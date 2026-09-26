"use client";

import React, { useState, useEffect, useMemo, useDeferredValue, useRef } from "react";
import { 
  Search, 
  FileCode, 
  Layers, 
  Sparkles, 
  X, 
  ArrowRight, 
  CornerDownLeft,
  Compass
} from "lucide-react";
import { Node } from "@xyflow/react";
import { REPOSITORY_TREE, INITIAL_ARCH_NODES, FileNode, ArchNodeData } from "@/app/data/repoData";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: FileNode) => void;
  onSelectNode: (nodeId: string) => void;
  onAskAI: (prompt: string) => void;
  onSwitchTab: (tab: "overview" | "architecture" | "onboarding" | "chat") => void;
  tree?: FileNode[];
  nodes?: Node[];
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectFile,
  onSelectNode,
  onAskAI,
  onSwitchTab,
  tree = REPOSITORY_TREE,
  nodes = INITIAL_ARCH_NODES,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Flatten and cache all files from tree
  const allFiles = useMemo(() => {
    const files: FileNode[] = [];
    const recurse = (fileNodes: FileNode[]) => {
      for (let i = 0; i < fileNodes.length; i++) {
        const n = fileNodes[i];
        if (n.type === "file") files.push(n);
        if (n.children && n.children.length > 0) recurse(n.children);
      }
    };
    recurse(tree);
    return files;
  }, [tree]);

  // Fast pre-computed search index for instant lookups
  const searchIndex = useMemo(() => {
    return allFiles.map((f) => ({
      file: f,
      nameLower: f.name.toLowerCase(),
      pathLower: f.path.toLowerCase(),
      extLower: (f.extension || "").toLowerCase(),
      descLower: (f.description || "").toLowerCase(),
    }));
  }, [allFiles]);

  // High-performance search with ranked relevance and strict DOM caps (max 8 files, 4 nodes)
  const { filteredNodes, filteredFiles, totalMatchingFiles, filteredActions } = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();

    if (!q) {
      return {
        filteredNodes: nodes.slice(0, 3),
        filteredFiles: allFiles.slice(0, 5),
        totalMatchingFiles: allFiles.length,
        filteredActions: [
          { label: "Switch to Onboarding Walkthrough", action: () => onSwitchTab("onboarding") },
          { label: "Ask AI: Explain request flow from Frontend to DB", action: () => onAskAI("Explain request flow from Frontend to DB") },
          { label: "Ask AI: Where are Stripe webhooks processed?", action: () => onAskAI("Where are Stripe webhooks processed?") },
        ],
      };
    }

    // 1. Filter Nodes (capped at 4)
    const matchingNodes: Node[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const data = n.data as unknown as ArchNodeData;
      if (
        data.label.toLowerCase().includes(q) ||
        data.subtitle.toLowerCase().includes(q) ||
        data.category.toLowerCase().includes(q)
      ) {
        matchingNodes.push(n);
        if (matchingNodes.length >= 4) break;
      }
    }

    // 2. Filter Files with multi-tier relevance ranking (capped at top 8 to prevent DOM thrashing)
    const exactNameMatches: FileNode[] = [];
    const startsWithNameMatches: FileNode[] = [];
    const includesNameMatches: FileNode[] = [];
    const pathMatches: FileNode[] = [];
    let totalMatches = 0;

    for (let i = 0; i < searchIndex.length; i++) {
      const item = searchIndex[i];
      const name = item.nameLower;
      const path = item.pathLower;

      if (name === q) {
        exactNameMatches.push(item.file);
        totalMatches++;
      } else if (name.startsWith(q)) {
        startsWithNameMatches.push(item.file);
        totalMatches++;
      } else if (name.includes(q)) {
        includesNameMatches.push(item.file);
        totalMatches++;
      } else if (path.includes(q) || item.descLower.includes(q)) {
        pathMatches.push(item.file);
        totalMatches++;
      }
    }

    const combinedFiles = [
      ...exactNameMatches,
      ...startsWithNameMatches,
      ...includesNameMatches,
      ...pathMatches,
    ].slice(0, 8);

    // 3. AI Prompts & Actions
    const actions = [
      { label: `Ask AI: "${deferredQuery}"`, action: () => onAskAI(deferredQuery) },
    ];

    return {
      filteredNodes: matchingNodes,
      filteredFiles: combinedFiles,
      totalMatchingFiles: totalMatches,
      filteredActions: actions,
    };
  }, [deferredQuery, searchIndex, allFiles, nodes, onSwitchTab, onAskAI]);

  // Flat list of selectable items for keyboard navigation
  const flatSelectableItems = useMemo(() => {
    const items: Array<{ type: "node" | "file" | "action"; item: any }> = [];
    filteredNodes.forEach((n) => items.push({ type: "node", item: n }));
    filteredFiles.forEach((f) => items.push({ type: "file", item: f }));
    filteredActions.forEach((a) => items.push({ type: "action", item: a }));
    return items;
  }, [filteredNodes, filteredFiles, filteredActions]);

  // Reset selectedIndex on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [deferredQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatSelectableItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatSelectableItems.length) % Math.max(1, flatSelectableItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = flatSelectableItems[selectedIndex];
        if (selected) {
          if (selected.type === "node") {
            onSelectNode(selected.item.id);
            onClose();
          } else if (selected.type === "file") {
            onSelectFile(selected.item);
            onClose();
          } else if (selected.type === "action") {
            selected.item.action();
            onClose();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, flatSelectableItems, selectedIndex, onSelectNode, onSelectFile]);

  if (!isOpen) return null;

  let currentItemOffset = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-100">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-200 z-10">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/80">
          <Search className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search files, modules, or ask AI..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-zinc-500 hover:text-zinc-300 text-xs font-mono px-1.5 py-0.5 rounded hover:bg-zinc-800 transition-colors"
            >
              Clear
            </button>
          )}
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2 space-y-3 custom-scrollbar text-xs">
          {/* Architecture Nodes */}
          {filteredNodes.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] uppercase font-mono text-zinc-500 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span>Architecture Modules</span>
                </div>
                <span className="text-[10px] text-zinc-600">{filteredNodes.length}</span>
              </div>
              <div className="space-y-1 mt-1">
                {filteredNodes.map((n) => {
                  const data = n.data as unknown as ArchNodeData;
                  const itemIndex = currentItemOffset++;
                  const isSelected = selectedIndex === itemIndex;

                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        onSelectNode(n.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all group ${
                        isSelected
                          ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                          : "hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-cyan-300" : "bg-cyan-500"}`} />
                        <div>
                          <div className="font-semibold text-zinc-200 group-hover:text-cyan-300">
                            {data.label}
                          </div>
                          <div className="text-[11px] text-zinc-400 line-clamp-1">{data.subtitle}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                        {data.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Files */}
          {filteredFiles.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] uppercase font-mono text-zinc-500 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileCode className="w-3 h-3 text-purple-400" />
                  <span>Repository Files</span>
                </div>
                {totalMatchingFiles > filteredFiles.length && (
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Showing top {filteredFiles.length} of {totalMatchingFiles}
                  </span>
                )}
              </div>
              <div className="space-y-1 mt-1">
                {filteredFiles.map((f) => {
                  const itemIndex = currentItemOffset++;
                  const isSelected = selectedIndex === itemIndex;

                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        onSelectFile(f);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all group ${
                        isSelected
                          ? "bg-purple-500/15 border border-purple-500/40 text-purple-200"
                          : "hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                        <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? "text-purple-300" : "text-zinc-500 group-hover:text-purple-400"}`} />
                        <div className="min-w-0 flex-1">
                          <div className="font-mono font-medium text-zinc-200 group-hover:text-purple-300 truncate">
                            {f.name}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono truncate max-w-sm">{f.path}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {f.language && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                            {f.language}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-zinc-500">{f.size || "code"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions & AI Prompts */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>AI Commands & Actions</span>
              </div>
              <div className="space-y-1 mt-1">
                {filteredActions.map((act) => {
                  const itemIndex = currentItemOffset++;
                  const isSelected = selectedIndex === itemIndex;

                  return (
                    <button
                      key={itemIndex}
                      onClick={() => {
                        act.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all group ${
                        isSelected
                          ? "bg-amber-500/15 border border-amber-500/40 text-amber-200"
                          : "hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-300 hover:text-amber-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-medium">{act.label}</span>
                      </div>
                      <CornerDownLeft className="w-3 h-3 text-zinc-500 group-hover:text-amber-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredNodes.length === 0 && filteredFiles.length === 0 && (
            <div className="py-8 text-center text-zinc-500">
              <Compass className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
              <p className="text-xs">No matching files or modules for "{deferredQuery}"</p>
              <button
                onClick={() => {
                  onAskAI(`Can you search the codebase and explain: ${deferredQuery}?`);
                  onClose();
                }}
                className="mt-2 text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask AI to search and explain</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Navigate with ⬆ ⬇ • Press Enter to select</span>
          <span className="text-cyan-400/80 font-semibold">Instant Search (60 FPS)</span>
        </div>
      </div>
    </div>
  );
}

