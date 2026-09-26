/**
 * /api/clone
 *
 * Clones a public GitHub repository into a temp directory (depth 1),
 * walks the file system, reads source files, builds a RepositoryProfile
 * and an in-memory searchable file index shared with /api/chat.
 *
 * Runtime: Node.js (not edge — needs child_process + fs)
 */

import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { FileNode } from "@/app/data/repoData";
import type { Node, Edge } from "@xyflow/react";
import { WORKSPACE_CACHE, type IndexedFile, type WorkspaceEntry } from "@/app/lib/workspaceCache";

export const runtime = "nodejs";
export const maxDuration = 60; // seconds — Vercel hobby cap; increase on Pro
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_FILE_BYTES = 80_000;        // ~80 KB per file, enough for most source files
const MAX_INDEX_FILES = 500;          // cap on how many files we index

// Dirs/files to skip when walking the clone
const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", ".next", "out", "coverage",
  ".turbo", ".cache", "__pycache__", "vendor", ".yarn", ".pnp",
  "playwright-report", "test-results", ".changeset",
]);
const SKIP_EXTS = new Set([
  "png","jpg","jpeg","gif","svg","ico","webp","woff","woff2","ttf","eot",
  "pdf","zip","gz","tar","lock","map","min.js","min.css",
]);
// Source extensions we actually want to read
const SOURCE_EXTS = new Set([
  "ts","tsx","js","jsx","mjs","cjs","py","go","rs","java","cs","rb","php",
  "css","scss","sass","less","html","json","yaml","yml","toml","env","md",
  "mdx","prisma","graphql","gql","proto","sql","sh","bash","dockerfile",
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getLanguage(ext: string): string {
  const map: Record<string, string> = {
    ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript",
    mjs: "javascript", cjs: "javascript", py: "python", go: "go", rs: "rust",
    java: "java", cs: "csharp", rb: "ruby", php: "php", css: "css",
    scss: "scss", sass: "scss", less: "css", html: "html", json: "json",
    yaml: "yaml", yml: "yaml", toml: "toml", md: "markdown", mdx: "markdown",
    prisma: "prisma", graphql: "graphql", gql: "graphql", proto: "protobuf",
    sql: "sql", sh: "bash", bash: "bash", dockerfile: "dockerfile",
  };
  return map[ext.toLowerCase()] || "plaintext";
}

function walkDir(
  dir: string,
  rootDir: string,
  fileIndex: IndexedFile[],
  fileNodes: Map<string, FileNode>
): void {
  if (fileIndex.length >= MAX_INDEX_FILES) return;

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch { return; }

  for (const entry of entries) {
    if (fileIndex.length >= MAX_INDEX_FILES) return;

    const absPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, absPath).replace(/\\/g, "/");
    const segments = relPath.split("/");

    // Skip hidden dirs and known noise dirs at any depth
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
      // Create folder node
      fileNodes.set(relPath, {
        id: relPath,
        name: entry.name,
        type: "folder",
        path: relPath,
        children: [],
      });
      walkDir(absPath, rootDir, fileIndex, fileNodes);
    } else if (entry.isFile()) {
      const nameLower = entry.name.toLowerCase();
      const ext = entry.name.includes(".") ? entry.name.split(".").pop()!.toLowerCase() : "";

      // Skip binaries and lock files
      if (SKIP_EXTS.has(ext)) continue;
      if (nameLower === "yarn.lock" || nameLower === "package-lock.json" || nameLower === "pnpm-lock.yaml") continue;
      // Skip hidden files
      if (entry.name.startsWith(".") && !["env","env.example","env.local","gitignore","dockerignore"].includes(ext)) continue;

      let stat: fs.Stats;
      try { stat = fs.statSync(absPath); } catch { continue; }

      // Read source files; skip non-source or oversized files
      let content = "";
      if (SOURCE_EXTS.has(ext) && stat.size < MAX_FILE_BYTES * 2) {
        try {
          const raw = fs.readFileSync(absPath, "utf-8");
          content = raw.length > MAX_FILE_BYTES ? raw.slice(0, MAX_FILE_BYTES) + "\n// ... (truncated)" : raw;
        } catch { content = ""; }
      }

      const lang = getLanguage(ext);
      const lines = content ? content.split("\n").length : Math.max(10, Math.round(stat.size / 40));

      fileIndex.push({ path: relPath, content, language: lang, lines, size: stat.size });

      fileNodes.set(relPath, {
        id: relPath,
        name: entry.name,
        type: "file",
        path: relPath,
        extension: ext,
        size: `${(stat.size / 1024).toFixed(1)} KB`,
        lines,
        language: lang,
      });
    }
  }
}

/** Build the nested FileNode[] tree from the flat fileNodes map */
function buildFileTree(fileNodes: Map<string, FileNode>, rootDir: string): FileNode[] {
  const rootNodes: FileNode[] = [];
  const sorted = [...fileNodes.keys()].sort();

  for (const relPath of sorted) {
    const node = fileNodes.get(relPath)!;
    const parts = relPath.split("/");

    if (parts.length === 1) {
      rootNodes.push(node);
    } else {
      const parentPath = parts.slice(0, -1).join("/");
      const parent = fileNodes.get(parentPath);
      if (parent?.children) {
        parent.children.push(node);
      } else {
        // Orphan (parent dir was skipped/missing) — attach to root
        rootNodes.push(node);
      }
    }
  }

  return rootNodes;
}

/** Derive architecture nodes + edges from the file index */
function buildArchitecture(
  fileIndex: IndexedFile[],
  primaryLanguage: string,
  repoName: string
): { nodes: Node[]; edges: Edge[]; serviceFolders: string[] } {
  // Identify top-level service directories
  const containerDirs = new Set(["apps","packages","services","src","backend","frontend","lib","agents"]);
  const nonServiceDirs = new Set([
    "docs","test","tests","scripts","public","static","assets","e2e","ci","specs",
  ]);

  const topLevel = new Set<string>();
  const monorepoSubs = new Set<string>();

  for (const f of fileIndex) {
    const parts = f.path.split("/");
    if (parts.length > 1 && !nonServiceDirs.has(parts[0])) topLevel.add(parts[0]);
    if (parts.length > 2 && containerDirs.has(parts[0])) monorepoSubs.add(`${parts[0]}/${parts[1]}`);
  }

  const serviceFolders: string[] = [];
  if (monorepoSubs.size >= 2) {
    monorepoSubs.forEach((d) => serviceFolders.push(d));
  } else {
    topLevel.forEach((d) => { if (!nonServiceDirs.has(d)) serviceFolders.push(d); });
  }

  const detectedServices = serviceFolders.slice(0, 12);
  const categoryList = ["frontend","backend","service","database","auth","payment"] as const;
  const archNodes: Node[] = [];
  const archEdges: Edge[] = [];

  const COLS = 3, NODE_W = 260, NODE_H = 190, GAP_X = 40, GAP_Y = 40;

  detectedServices.forEach((folder, idx) => {
    const folderName = folder.split("/").pop() || folder;
    const nodeId = `node-${folder.replace(/[/.]/g, "-")}`;
    const fLower = folderName.toLowerCase();

    let category: typeof categoryList[number] = "service";
    if (fLower.match(/front|ui|web|client|app|react/)) category = "frontend";
    else if (fLower.match(/auth|iam|login|guard|session/)) category = "auth";
    else if (fLower.match(/db|data|redis|sql|store|prisma|kysely/)) category = "database";
    else if (fLower.match(/pay|bill|checkout|cart|stripe/)) category = "payment";
    else if (fLower.match(/api|back|server|gateway|core|trpc/)) category = "backend";

    const matchingFiles = fileIndex
      .filter((f) => f.path.startsWith(folder + "/"))
      .map((f) => f.path)
      .slice(0, 5);

    // Detect tech stack from file extensions and imports
    const techSet = new Set<string>([primaryLanguage]);
    for (const f of fileIndex.filter((x) => x.path.startsWith(folder + "/"))) {
      if (f.content.includes("next/")) techSet.add("Next.js");
      if (f.content.includes("fastify") || f.content.includes("Fastify")) techSet.add("Fastify");
      if (f.content.includes("express") || f.content.includes("Express")) techSet.add("Express");
      if (f.content.includes("prisma") || f.content.includes("Prisma")) techSet.add("Prisma");
      if (f.content.includes("trpc") || f.content.includes("tRPC")) techSet.add("tRPC");
      if (f.content.includes("postgres") || f.content.includes("pg")) techSet.add("PostgreSQL");
      if (f.content.includes("redis") || f.content.includes("Redis")) techSet.add("Redis");
      if (f.content.includes("stripe") || f.content.includes("Stripe")) techSet.add("Stripe");
      if (f.content.includes("zod")) techSet.add("Zod");
      if (f.content.includes("tailwind")) techSet.add("Tailwind");
    }

    let posX: number, posY: number;
    if (idx === 0) { posX = NODE_W + GAP_X; posY = 40; }
    else {
      const col = (idx - 1) % COLS;
      const row = Math.floor((idx - 1) / COLS);
      posX = col * (NODE_W + GAP_X);
      posY = NODE_H + GAP_Y * 2 + row * (NODE_H + GAP_Y);
    }

    archNodes.push({
      id: nodeId,
      type: "customArch",
      position: { x: posX, y: posY },
      data: {
        label: folderName.toUpperCase().replace(/[-_]/g, " "),
        category,
        subtitle: `${folder} Module`,
        techStack: [...techSet].slice(0, 4),
        status: "healthy",
        latency: `${Math.floor(Math.random() * 15 + 4)}ms`,
        throughput: `${(Math.random() * 8 + 1.2).toFixed(1)}k req/m`,
        filesCount: Math.max(1, matchingFiles.length),
        description: `Module and logic for ${folder}`,
        endpoints: [`GET /api/${folderName}`, `Module /${folderName}`],
        relatedFiles: matchingFiles,
        icon: category === "frontend" ? "LayoutTemplate"
          : category === "database" ? "Database"
          : category === "auth" ? "ShieldCheck" : "Server",
      },
    });

    if (idx > 0 && archNodes[0]) {
      archEdges.push({
        id: `e-0-${idx}`,
        source: archNodes[0].id,
        target: nodeId,
        animated: true,
        label: idx === 1 ? "Dispatches" : "Queries",
        style: { stroke: "#38bdf8", strokeWidth: 2 },
      });
    }
  });

  return { nodes: archNodes, edges: archEdges, serviceFolders };
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let owner = "";
  let repoName = "";

  try {
    const body = await req.json();
    let { repo } = body;

    if (!repo) return NextResponse.json({ error: "repo is required" }, { status: 400 });

    repo = repo
      .replace(/^https?:\/\/github\.com\//, "")
      .replace(/\.git$/, "")
      .replace(/\/$/, "")
      .trim();

    const parts = repo.split("/");
    if (parts.length < 2) return NextResponse.json({ error: "Use owner/repo format." }, { status: 400 });

    owner = parts[0];
    repoName = parts[1];
    const repoKey = `${owner}/${repoName}`;

    // ── Return cached workspace if still warm AND workDir still exists ────
    const cached = WORKSPACE_CACHE.get(repoKey);
    if (cached && cached.expiresAt > Date.now() && fs.existsSync(cached.workDir)) {
      // Ensure the disk manifest exists so other worker threads can find it
      const manifestPath = path.join(cached.workDir, "_rn_index.json");
      if (!fs.existsSync(manifestPath)) {
        try {
          fs.writeFileSync(
            manifestPath,
            JSON.stringify({ repoKey, workDir: cached.workDir, expiresAt: cached.expiresAt, fileIndex: cached.fileIndex }),
            "utf-8"
          );
        } catch { /* non-fatal */ }
      }
      return buildProfileResponse(cached, owner, repoName, "cached");
    }
    // Stale / workDir deleted — remove from cache and re-clone
    WORKSPACE_CACHE.delete(repoKey);

    // ── Fetch repo metadata to get branch + size ──────────────────────────
    const ghToken = process.env.GITHUB_TOKEN;
    const ghHeaders: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "RepoNavigator-AI-Bot",
    };
    if (ghToken) ghHeaders["Authorization"] = `Bearer ${ghToken}`;

    let defaultBranch = "main";
    let repoDesc = `${repoKey} repository`;
    let primaryLanguage = "TypeScript";
    let repoSizeKB = 0;

    try {
      const metaCtrl = new AbortController();
      setTimeout(() => metaCtrl.abort(), 5000);
      const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
        headers: ghHeaders,
        signal: metaCtrl.signal,
      });
      if (metaRes.ok) {
        const meta = await metaRes.json();
        defaultBranch = meta.default_branch || "main";
        repoDesc = meta.description || repoDesc;
        primaryLanguage = meta.language || primaryLanguage;
        repoSizeKB = meta.size || 0;
      }
    } catch { /* continue */ }

    // ── Size guard: repos > 200 MB skip clone, use GitHub tree API ────────
    // ~200 MB = 200_000 KB (GitHub reports in KB)
    if (repoSizeKB > 200_000) {
      return NextResponse.json({
        error: "too_large",
        message: `${repoKey} is ${Math.round(repoSizeKB / 1024)} MB — too large to clone. Use the GitHub tree import instead.`,
        sizeMB: Math.round(repoSizeKB / 1024),
      }, { status: 413 });
    }

    // ── Clone the repo ────────────────────────────────────────────────────
    const workDir = path.join(os.tmpdir(), `rn-${owner}-${repoName}-${Date.now()}`);
    const cloneUrl = `https://github.com/${owner}/${repoName}.git`;

    // Clean up any leftover from previous run
    if (fs.existsSync(workDir)) {
      try { fs.rmSync(workDir, { recursive: true, force: true }); } catch { /* ignore */ }
    }

    // Try the detected default branch; fall back to cloning HEAD if that fails
    // (happens when meta fetch was rate-limited and defaultBranch stayed "main"
    // but the repo actually uses "master" or another branch name).
    try {
      execSync(
        `git clone --depth 1 --single-branch --no-tags -b ${defaultBranch} "${cloneUrl}" "${workDir}"`,
        { timeout: 45_000, stdio: "pipe" }
      );
    } catch {
      if (fs.existsSync(workDir)) {
        try { fs.rmSync(workDir, { recursive: true, force: true }); } catch { /* ignore */ }
      }
      // Clone without specifying a branch — git picks the remote HEAD
      execSync(
        `git clone --depth 1 --single-branch --no-tags "${cloneUrl}" "${workDir}"`,
        { timeout: 45_000, stdio: "pipe" }
      );
    }

    // ── Walk filesystem + build index ─────────────────────────────────────
    const fileIndex: IndexedFile[] = [];
    const fileNodes = new Map<string, FileNode>();
    walkDir(workDir, workDir, fileIndex, fileNodes);

    // ── Persist index to disk so other route workers can read it ─────────
    // Next.js dev/prod may run each API route in a separate worker thread,
    // so we can't rely on in-process memory sharing across routes.
    // Writing a JSON manifest next to the clone lets every route find it
    // by scanning os.tmpdir() for the matching repo key.
    const manifest = {
      repoKey,
      workDir,
      expiresAt: Date.now() + CACHE_TTL_MS,
      fileIndex,   // full index with content
    };
    const manifestPath = path.join(workDir, "_rn_index.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest), "utf-8");

    // ── Cache in-memory too (for same-worker hits) ────────────────────────
    const entry: WorkspaceEntry = {
      workDir,
      fileIndex,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };
    WORKSPACE_CACHE.set(repoKey, entry);

    // ── Schedule cleanup after TTL ────────────────────────────────────────
    setTimeout(() => {
      try { fs.rmSync(workDir, { recursive: true, force: true }); } catch { /* ignore */ }
      WORKSPACE_CACHE.delete(repoKey);
    }, CACHE_TTL_MS);

    // ── Build profile and return ──────────────────────────────────────────
    return buildProfileResponse(
      entry,
      owner,
      repoName,
      "cloned",
      defaultBranch,
      repoDesc,
      primaryLanguage,
      fileNodes
    );

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/clone] error:", msg);

    // If clone failed (network, too large, etc.) return a useful error
    return NextResponse.json({
      error: "clone_failed",
      message: msg.includes("ETIMEDOUT") || msg.includes("timeout")
        ? "Clone timed out — repository may be too large. Try a smaller repo."
        : `Failed to clone ${owner}/${repoName}: ${msg.slice(0, 200)}`,
    }, { status: 500 });
  }
}

/** Also expose GET to retrieve file content from a cached workspace */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repo = (searchParams.get("repo") || "").replace(/^gh-/, "").trim();
  const filePath = searchParams.get("path") || "";

  if (!repo || !filePath) {
    return NextResponse.json({ error: "repo and path are required" }, { status: 400 });
  }

  const entry = WORKSPACE_CACHE.get(repo);
  if (!entry) {
    return NextResponse.json({ error: "workspace_not_found", message: "Workspace expired or not cloned yet." }, { status: 404 });
  }

  const absPath = path.join(entry.workDir, filePath.replace(/^\/+/, ""));
  // Prevent path traversal
  if (!absPath.startsWith(entry.workDir)) {
    return NextResponse.json({ error: "invalid_path" }, { status: 400 });
  }

  // Check in-memory index first (already read and cached)
  const indexed = entry.fileIndex.find((f) => f.path === filePath.replace(/^\/+/, ""));
  if (indexed) {
    return NextResponse.json({ success: true, source: "clone", content: indexed.content, lines: indexed.lines });
  }

  // Fall back to reading from disk
  try {
    const raw = fs.readFileSync(absPath, "utf-8");
    const content = raw.length > MAX_FILE_BYTES ? raw.slice(0, MAX_FILE_BYTES) + "\n// ... (truncated)" : raw;
    return NextResponse.json({ success: true, source: "clone", content, lines: content.split("\n").length });
  } catch {
    return NextResponse.json({ error: "file_not_found" }, { status: 404 });
  }
}

// ─── Response builder ─────────────────────────────────────────────────────────

function buildProfileResponse(
  entry: WorkspaceEntry,
  owner: string,
  repoName: string,
  source: string,
  defaultBranch = "main",
  repoDesc = `${owner}/${repoName}`,
  primaryLanguage = "TypeScript",
  fileNodes?: Map<string, FileNode>
) {
  const { fileIndex } = entry;

  // Rebuild fileNodes from index if not provided (cache hit path)
  if (!fileNodes) {
    fileNodes = new Map<string, FileNode>();
    for (const f of fileIndex) {
      const parts = f.path.split("/");
      const ext = f.path.includes(".") ? f.path.split(".").pop() : undefined;

      // Ensure all ancestor folders exist
      for (let depth = 1; depth < parts.length; depth++) {
        const ancestorPath = parts.slice(0, depth).join("/");
        if (!fileNodes.has(ancestorPath)) {
          fileNodes.set(ancestorPath, {
            id: ancestorPath,
            name: parts[depth - 1],
            type: "folder",
            path: ancestorPath,
            children: [],
          });
        }
      }

      fileNodes.set(f.path, {
        id: f.path,
        name: parts[parts.length - 1],
        type: "file",
        path: f.path,
        extension: ext,
        size: `${(f.size / 1024).toFixed(1)} KB`,
        lines: f.lines,
        language: f.language,
      });
    }
  }

  const fileTree = buildFileTree(fileNodes, entry.workDir);
  const { nodes, edges, serviceFolders } = buildArchitecture(fileIndex, primaryLanguage, repoName);

  const totalFiles = fileIndex.filter((f) => !f.path.endsWith("/")).length;
  const repoKey = `${owner}/${repoName}`;

  const profile = {
    id: `gh-${owner}-${repoName}`.toLowerCase(),
    name: repoKey,
    branch: defaultBranch,
    version: "v1.0.0",
    badge: `${totalFiles} Files`,
    status: "Repository Connected",
    lastIndexed: "Just now",
    totalFiles,
    totalLines: fileIndex.reduce((s, f) => s + f.lines, 0),
    techStack: [primaryLanguage, "Microservices", "REST"],
    description: repoDesc,
    fileTree,
    nodes: nodes.length > 0 ? nodes : [{
      id: "node-root",
      type: "customArch",
      position: { x: 260, y: 100 },
      data: {
        label: repoName.toUpperCase(),
        category: "frontend",
        subtitle: "Repository Core",
        techStack: [primaryLanguage],
        status: "healthy",
        latency: "10ms",
        throughput: "4.2k req/m",
        filesCount: totalFiles,
        description: repoDesc,
        endpoints: ["GET /"],
        relatedFiles: fileIndex.slice(0, 5).map((f) => f.path),
        icon: "LayoutTemplate",
      },
    }],
    edges,
    welcomeMessage: {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      text: `◈ **${repoKey} Cloned & Indexed**\n\n- **Branch**: \`${defaultBranch}\`\n- **Files indexed**: ${totalFiles}\n- **Detected modules**: ${serviceFolders.length}\n- **Source**: ${source === "cached" ? "warm cache ⚡" : "fresh clone"}\n\n*Ask me anything about this codebase — I have read the actual source files:*`,
      timestamp: "Just now",
      suggestedActions: [
        `Explain the architecture of ${repoName}`,
        "What does the entry point do?",
        "Which files should I read first?",
      ],
    },
    quickPrompts: [
      `How does ${repoName} work?`,
      "Explain the directory structure",
      "Where is the entry point?",
      "What dependencies does this project use?",
    ],
    onboardingSteps: [
      {
        id: "clone-s1",
        title: `1. Clone ${repoName}`,
        estimatedTime: "2 mins",
        category: "Setup",
        description: `Clone and explore ${repoKey}.`,
        commands: [
          `git clone https://github.com/${repoKey}.git`,
          `cd ${repoName}`,
          "npm install",
        ],
        relatedFiles: ["README.md"],
        checklist: [
          { id: "c1", text: "Clone repository", completed: true },
          { id: "c2", text: "Review architecture map", completed: true },
          { id: "c3", text: "Ask AI about entry point", completed: false },
        ],
      },
    ],
    // Expose the file index for the chat route (not sent to browser)
    _fileIndexLength: fileIndex.length,
  };

  return NextResponse.json({ success: true, profile, source });
}
