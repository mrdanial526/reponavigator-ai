/**
 * /api/chat
 *
 * Answers user questions about a cloned repository using:
 * 1. Keyword-based retrieval from the in-memory file index (no embedding needed)
 * 2. Sends relevant file chunks + question to Google Gemini (or falls back to
 *    a grounded template response if no API key is set)
 *
 * Runtime: Node.js
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export const runtime = "nodejs";

// ─── Types ───────────────────────────────────────────────────────────────────

interface IndexedFile {
  path: string;
  content: string;
  language: string;
  lines: number;
  size: number;
}

/** Scan os.tmpdir() for a _rn_index.json manifest matching repoKey. */
function findCloneWorkspace(repoKey: string): { fileIndex: IndexedFile[] } | null {
  try {
    const tmpDir = os.tmpdir();
    for (const entry of fs.readdirSync(tmpDir)) {
      if (!entry.startsWith("rn-")) continue;
      const manifestPath = path.join(tmpDir, entry, "_rn_index.json");
      if (!fs.existsSync(manifestPath)) continue;
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        if (manifest.repoKey !== repoKey) continue;
        if (manifest.expiresAt <= Date.now()) continue;
        return { fileIndex: manifest.fileIndex };
      } catch { /* skip */ }
    }
  } catch { /* tmpdir not readable */ }
  return null;
}

// ─── Retrieval ────────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "the","a","an","is","it","in","on","at","to","of","and","or","for",
  "with","this","that","are","was","were","be","been","as","by","from",
  "what","how","where","which","who","does","do","can","could","should",
  "would","will","have","has","had","not","but","if","when","then","so",
  "my","me","i","you","we","they","he","she","its",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function scoreFile(file: IndexedFile, queryTokens: string[]): number {
  let score = 0;
  const pathLower = file.path.toLowerCase();
  const contentLower = file.content.toLowerCase();

  for (const token of queryTokens) {
    // Path match: high weight (file named "auth.ts" is very relevant for "authentication")
    if (pathLower.includes(token)) score += 10;
    // Content match: count occurrences
    let idx = 0;
    while ((idx = contentLower.indexOf(token, idx)) !== -1) {
      score += 1;
      idx += token.length;
      if (score > 60) break; // cap to avoid domination by very large files
    }
  }

  // Boost important file types
  if (file.path.match(/\/(index|main|app|server|entry)\.[tj]sx?$/)) score += 5;
  if (file.path.includes("README")) score += 3;

  return score;
}

/** Pick the top N most relevant files for the query, cap total tokens sent */
function retrieveRelevantChunks(
  fileIndex: IndexedFile[],
  query: string,
  maxFiles = 6,
  maxCharsPerFile = 3000
): Array<{ path: string; language: string; snippet: string }> {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const scored = fileIndex
    .map((f) => ({ file: f, score: scoreFile(f, queryTokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxFiles);

  return scored.map(({ file }) => ({
    path: file.path,
    language: file.language,
    snippet: file.content.length > maxCharsPerFile
      ? file.content.slice(0, maxCharsPerFile) + "\n// ... (truncated)"
      : file.content,
  }));
}

// ─── Gemini caller ────────────────────────────────────────────────────────────

const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  for (const model of GEMINI_MODELS) {
    try {
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 12000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            ],
          }),
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text === "string" && text.trim()) {
          return text.trim();
        }
      }
    } catch {
      // Try next model if timeout or network failure occurs
      continue;
    }
  }

  return null;
}

// ─── Grounded template fallback (no API key needed) ──────────────────────────

function buildGroundedResponse(
  query: string,
  chunks: Array<{ path: string; language: string; snippet: string }>,
  repoName: string
): string {
  const q = query.toLowerCase();
  const fileList = chunks.map((c) => `\`${c.path}\``).join(", ");

  if (chunks.length === 0) {
    return `I searched the **${repoName}** codebase for "${query}" but didn't find closely matching files in the indexed set.\n\nTry asking about specific file paths, modules, or functions you can see in the file tree.`;
  }

  let intro = "";
  if (q.match(/auth|login|session|token|jwt|password/)) {
    intro = `Here's how authentication works in **${repoName}**:`;
  } else if (q.match(/entry|start|main|index|bootstrap/)) {
    intro = `The entry point for **${repoName}** is:`;
  } else if (q.match(/architect|struct|folder|layout|organiz/)) {
    intro = `**${repoName}** is organized as follows:`;
  } else if (q.match(/api|route|endpoint|request|http/)) {
    intro = `Here are the relevant API/routing files in **${repoName}**:`;
  } else if (q.match(/depend|package|librar|import/)) {
    intro = `Dependencies and imports in **${repoName}**:`;
  } else {
    intro = `Based on the **${repoName}** codebase, here are the most relevant files for "${query}":`;
  }

  const fileSummaries = chunks
    .slice(0, 4)
    .map((c) => {
      const lines = c.snippet.split("\n").slice(0, 8).join("\n");
      return `**\`${c.path}\`**\n\`\`\`${c.language}\n${lines}\n\`\`\``;
    })
    .join("\n\n");

  return `${intro}\n\nRelevant files: ${fileList}\n\n${fileSummaries}\n\n*Set \`GEMINI_API_KEY\` in \`.env.local\` for full AI-powered analysis.*`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { query, repoName, contextNode, contextFile } = await req.json();

    if (!query?.trim()) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    // Resolve workspace key (strip gh- prefix added by registerRepositoryProfile)
    const repoKey = (repoName || "")
      .replace(/^gh-/, "")
      .trim();

    const workspace = findCloneWorkspace(repoKey);

    // ── Case 1: workspace found (in-memory or disk) — do real retrieval ──
    if (workspace) {
      const chunks = retrieveRelevantChunks(workspace.fileIndex, query);

      // Build the prompt for Gemini
      const contextBlock = chunks
        .map((c) => `### File: ${c.path}\n\`\`\`${c.language}\n${c.snippet}\n\`\`\``)
        .join("\n\n");

      const extraContext = [
        contextNode ? `The user is currently inspecting module: ${contextNode}` : "",
        contextFile ? `The user has file open: ${contextFile}` : "",
      ].filter(Boolean).join("\n");

      const prompt = `You are RepoNavigator AI, an expert code assistant. The user has imported the repository "${repoKey}" and is asking:

"${query}"

${extraContext}

Below are the most relevant source files retrieved from the actual repository (real code, not synthesized):

${contextBlock || "No closely matching files found in the indexed set."}

Answer the question clearly and concisely. Reference specific file paths and line content where relevant. If you show code, use fenced code blocks with the correct language tag. Keep your answer under 400 words.`;

      const aiText = await callGemini(prompt);

      if (aiText) {
        return NextResponse.json({
          success: true,
          text: aiText,
          referencedFiles: chunks.map((c) => c.path),
          source: "gemini+clone",
          suggestedActions: [
            "Show me the entry point",
            "Explain the main dependencies",
            "Which files should I read first?",
          ],
        });
      }

      // Gemini failed or no key — use grounded template
      return NextResponse.json({
        success: true,
        text: buildGroundedResponse(query, chunks, repoKey),
        referencedFiles: chunks.map((c) => c.path),
        source: "grounded+clone",
        suggestedActions: [
          "Show me the entry point",
          "Explain the architecture",
          "List all API routes",
        ],
      });
    }

    // ── Case 2: no workspace (large repo or GitHub-tree import) ───────────
    // Return a helpful response telling the user to import via clone or ask
    // generic questions.
    const geminiGeneric = process.env.GEMINI_API_KEY
      ? await callGemini(
          `You are RepoNavigator AI. The user is asking about repository "${repoKey}": "${query}". Answer based on general knowledge of this project if you know it, or ask them to re-import so you can read the actual code. Keep it under 200 words.`
        )
      : null;

    return NextResponse.json({
      success: true,
      text: geminiGeneric ||
        `I don't have the source code for **${repoKey}** loaded yet.\n\nTo get real AI answers grounded in actual code:\n1. Re-import the repository (it will be cloned and indexed)\n2. Then ask your question — I'll search the real files\n\n*Large repos (>200 MB) use the GitHub tree API and can't be fully indexed.*`,
      referencedFiles: [],
      source: "no_workspace",
      suggestedActions: ["Re-import repository", "Ask about the architecture"],
    });

  } catch (err) {
    console.error("[/api/chat] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
