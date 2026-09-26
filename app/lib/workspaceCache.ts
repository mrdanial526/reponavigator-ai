/**
 * Shared workspace cache for RepoNavigator AI.
 *
 * TWO layers of storage so routes always find the workspace regardless of
 * whether Next.js puts them in the same worker thread or not:
 *
 *   1. globalThis Map  — fastest, works when routes share a process
 *   2. Disk manifest   — fallback, written as _rn_index.json inside the
 *                        clone dir; works across separate worker threads
 */

import fs from "fs";
import path from "path";
import os from "os";

export interface IndexedFile {
  path: string;
  content: string;
  language: string;
  lines: number;
  size: number;
}

export interface WorkspaceEntry {
  workDir: string;
  fileIndex: IndexedFile[];
  expiresAt: number;
}

// ── Layer 1: globalThis Map ───────────────────────────────────────────────────
const CACHE_KEY = Symbol.for("reponavigator.workspaceCache");
type GlobalWithCache = typeof globalThis & {
  [CACHE_KEY]?: Map<string, WorkspaceEntry>;
};
const g = globalThis as GlobalWithCache;
if (!g[CACHE_KEY]) g[CACHE_KEY] = new Map<string, WorkspaceEntry>();
export const WORKSPACE_CACHE: Map<string, WorkspaceEntry> = g[CACHE_KEY]!;

// ── Layer 2: disk manifest lookup ─────────────────────────────────────────────

/**
 * Find a workspace entry for `repoKey`.
 * Checks in-memory first; if not found scans os.tmpdir() for a matching
 * _rn_index.json written by /api/clone.
 */
export function findWorkspace(repoKey: string): WorkspaceEntry | null {
  // Fast path — in-memory
  const mem = WORKSPACE_CACHE.get(repoKey);
  if (mem && mem.expiresAt > Date.now()) return mem;

  // Slow path — scan temp dir for a matching manifest file
  try {
    const tmpDir = os.tmpdir();
    const entries = fs.readdirSync(tmpDir);
    for (const entry of entries) {
      if (!entry.startsWith("rn-")) continue;
      const manifestPath = path.join(tmpDir, entry, "_rn_index.json");
      if (!fs.existsSync(manifestPath)) continue;
      try {
        const raw = fs.readFileSync(manifestPath, "utf-8");
        const manifest: WorkspaceEntry & { repoKey: string } = JSON.parse(raw);
        if (manifest.repoKey !== repoKey) continue;
        if (manifest.expiresAt <= Date.now()) continue;

        // Found — promote to in-memory cache
        const ws: WorkspaceEntry = {
          workDir: manifest.workDir,
          fileIndex: manifest.fileIndex,
          expiresAt: manifest.expiresAt,
        };
        WORKSPACE_CACHE.set(repoKey, ws);
        return ws;
      } catch { /* corrupt manifest, skip */ }
    }
  } catch { /* tmpdir not readable */ }

  return null;
}
