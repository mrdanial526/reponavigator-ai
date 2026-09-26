"use client";

import React, { useState, useMemo, useEffect, useDeferredValue } from "react";
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileText, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  Code2, 
  Database, 
  Lock, 
  Server, 
  PanelLeftClose,
  Sparkles,
  CreditCard,
  FileSpreadsheet,
  MoreHorizontal
} from "lucide-react";
import { FileNode, REPOSITORY_TREE } from "@/app/data/repoData";

interface RepositoryExplorerProps {
  onSelectFile: (file: FileNode) => void;
  onHighlightNode?: (nodeId: string | null) => void;
  selectedFilePath?: string | null;
  onToggleCollapse?: () => void;
  tree?: FileNode[];
  totalFiles?: number;
  totalModules?: number;
}

export default function RepositoryExplorer({
  onSelectFile,
  onHighlightNode,
  selectedFilePath,
  onToggleCollapse,
  tree = REPOSITORY_TREE,
  totalFiles = 32,
  totalModules = 4,
}: RepositoryExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [showAllChildren, setShowAllChildren] = useState<Record<string, boolean>>({});

  // Auto-expand ONLY top-level primary folders on repository change (prevents DOM freezing on massive repos)
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    tree.slice(0, 5).forEach((n) => {
      if (n.type === "folder") {
        initialExpanded[n.id] = true;
      }
    });
    setExpandedFolders(initialExpanded);
    setShowAllChildren({});
  }, [tree]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    const recurse = (nodes: FileNode[], depth = 0) => {
      if (depth > 2) return; // Cap expand-all depth at 2 levels for safety
      nodes.forEach((n) => {
        if (n.type === "folder") {
          allExpanded[n.id] = true;
          if (n.children) recurse(n.children, depth + 1);
        }
      });
    };
    recurse(tree);
    setExpandedFolders(allExpanded);
  };

  const collapseAll = () => {
    setExpandedFolders({});
  };

  // High-speed filter with max 60 results cap to ensure 60fps typing
  const filteredTree = useMemo(() => {
    if (!deferredQuery.trim()) return tree;

    const query = deferredQuery.toLowerCase().trim();
    let matchCount = 0;

    const filterNode = (node: FileNode): FileNode | null => {
      if (matchCount > 60) return null;

      const isNameMatch = node.name.toLowerCase().includes(query);
      const isExtMatch = node.extension && node.extension.toLowerCase().includes(query);

      let matchingChildren: FileNode[] = [];
      if (node.children) {
        matchingChildren = node.children
          .map(filterNode)
          .filter(Boolean) as FileNode[];
      }

      if (isNameMatch || isExtMatch || matchingChildren.length > 0) {
        matchCount++;
        return {
          ...node,
          children: matchingChildren.length > 0 ? matchingChildren : node.children,
        };
      }

      return null;
    };

    return tree.map(filterNode).filter(Boolean) as FileNode[];
  }, [deferredQuery, tree]);

  const getFolderIcon = (name: string, isExpanded: boolean) => {
    const n = name.toLowerCase();
    if (n.includes("frontend") || n.includes("ui") || n === "app") {
      return <Code2 className="w-4 h-4 text-sky-400" />;
    }
    if (n.includes("backend") || n.includes("api") || n.includes("gateway") || n.includes("server")) {
      return <Server className="w-4 h-4 text-indigo-400" />;
    }
    if (n.includes("auth") || n.includes("iam") || n.includes("login")) {
      return <Lock className="w-4 h-4 text-purple-400" />;
    }
    if (n.includes("database") || n.includes("schemas") || n.includes("users") || n.includes("redis")) {
      return <Database className="w-4 h-4 text-emerald-400" />;
    }
    if (n.includes("billing") || n.includes("payment") || n.includes("checkout")) {
      return <CreditCard className="w-4 h-4 text-pink-400" />;
    }
    if (n.includes("service") || n.includes("worker") || n.includes("pkg") || n.includes("packages")) {
      return <Sparkles className="w-4 h-4 text-amber-400" />;
    }

    return isExpanded ? (
      <FolderOpen className="w-4 h-4 text-amber-400" />
    ) : (
      <Folder className="w-4 h-4 text-amber-400" />
    );
  };

  const getFileIcon = (ext?: string) => {
    switch (ext) {
      case "tsx":
      case "ts":
      case "jsx":
      case "js":
        return <FileCode className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />;
      case "prisma":
      case "sql":
        return <Database className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
      case "css":
        return <FileText className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />;
      case "json":
      case "yml":
      case "yaml":
        return <FileSpreadsheet className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />;
    }
  };

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return (
      <div className="space-y-0.5">
        {nodes.map((node) => {
          if (node.type === "folder") {
            const isExpanded = !!expandedFolders[node.id] || !!searchQuery;
            const childrenList = node.children || [];
            const isShowingAll = !!showAllChildren[node.id];
            
            // Limit children in DOM to 20 for extreme performance
            const visibleChildren = isShowingAll || childrenList.length <= 20
              ? childrenList
              : childrenList.slice(0, 20);

            return (
              <div key={node.id} className="select-none">
                <button
                  onClick={() => toggleFolder(node.id)}
                  onMouseEnter={() => node.connectedNodeId && onHighlightNode?.(node.connectedNodeId)}
                  onMouseLeave={() => onHighlightNode?.(null)}
                  style={{ paddingLeft: `${depth * 14 + 6}px` }}
                  className="w-full flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-xs text-zinc-200 hover:text-white hover:bg-zinc-850 transition-colors group text-left"
                >
                  <span className="text-zinc-500 group-hover:text-zinc-300 transition-transform">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {getFolderIcon(node.name, isExpanded)}
                    <span className="font-medium text-zinc-100 truncate group-hover:text-cyan-300">
                      {node.name}
                    </span>
                  </div>
                  {node.children && (
                    <span className="text-[10px] font-mono text-zinc-500 pr-1">
                      {node.children.length}
                    </span>
                  )}
                </button>

                {isExpanded && visibleChildren.length > 0 && (
                  <div>
                    {renderTree(visibleChildren, depth + 1)}
                    
                    {!isShowingAll && childrenList.length > 20 && (
                      <button
                        onClick={() => setShowAllChildren((prev) => ({ ...prev, [node.id]: true }))}
                        style={{ paddingLeft: `${(depth + 1) * 14 + 16}px` }}
                        className="w-full flex items-center gap-1.5 py-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline text-left"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                        <span>+ {childrenList.length - 20} more files in {node.name}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          }

          // File item
          const isSelected = selectedFilePath === node.path;

          return (
            <button
              key={node.id}
              onClick={() => onSelectFile(node)}
              onMouseEnter={() => node.connectedNodeId && onHighlightNode?.(node.connectedNodeId)}
              onMouseLeave={() => onHighlightNode?.(null)}
              style={{ paddingLeft: `${depth * 14 + 22}px` }}
              className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-all group text-left ${
                isSelected
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-850/80"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {getFileIcon(node.extension)}
                <span className="font-mono text-[11px] truncate group-hover:text-cyan-200">
                  {node.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 font-mono text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {node.lines && <span>{node.lines}L</span>}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 border-r border-zinc-800 select-none overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-200">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Repository Explorer</span>
          </div>

          <div className="flex items-center gap-1 text-[10px]">
            <button
              onClick={expandAll}
              className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
              title="Expand Top Folders"
            >
              Expand
            </button>
            <button
              onClick={collapseAll}
              className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
              title="Collapse All Folders"
            >
              Collapse
            </button>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors ml-1"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter files & services..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-zinc-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar bg-zinc-950">
        {filteredTree.length > 0 ? (
          renderTree(filteredTree)
        ) : (
          <div className="p-6 text-center text-zinc-500 text-xs">
            <p>No files match "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Explorer Footer stats */}
      <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
        <span>{totalModules} Modules</span>
        <span className="text-cyan-400">{totalFiles} Files Indexed</span>
      </div>
    </div>
  );
}
