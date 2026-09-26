"use client";

import React from "react";
import IBMBobBadgeModal from "./IBMBobBadgeModal";
import { 
  FolderGit2, 
  Search, 
  Sparkles, 
  Plus, 
  Layers, 
  Terminal, 
  ChevronDown, 
  CheckCircle2,
  RefreshCw,
  Share2,
  Sliders,
  GitBranch,
  PanelLeft,
  PanelRight,
  MessageSquareCode
} from "lucide-react";

interface HeaderProps {
  currentRepo: string;
  currentBranch: string;
  isReady: boolean;
  onOpenSearch: () => void;
  onOpenImport: () => void;
  onSelectRepo: (repoName: string) => void;
  isLeftOpen?: boolean;
  onToggleLeft?: () => void;
  isRightOpen?: boolean;
  onToggleRight?: () => void;
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function Header({
  currentRepo,
  currentBranch,
  isReady,
  onOpenSearch,
  onOpenImport,
  onSelectRepo,
  isLeftOpen,
  onToggleLeft,
  isRightOpen,
  onToggleRight,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [isBobModalOpen, setIsBobModalOpen] = React.useState(false);

  const sampleRepos = [
    { name: "Demo E-Commerce System", branch: "main", stars: "4 Services" },
    { name: "GoogleCloudPlatform/microservices-demo", branch: "main", stars: "10 Microservices" },
    { name: "RepoNavigator Core", branch: "production", stars: "Next.js 16" },
    { name: "Microservices Starter", branch: "develop", stars: "Fastify" },
  ];

  return (
    <header className="h-12 border-b border-zinc-800/90 bg-zinc-950/95 backdrop-blur-xl px-4 flex items-center justify-between z-40 select-none">
      {/* Left: Brand / Logo matching wireframe ◈ RepoNavigator AI */}
      <div className="flex items-center gap-3">
        {onToggleLeft && (
          <button
            onClick={onToggleLeft}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              isLeftOpen
                ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
            }`}
            title={isLeftOpen ? "Hide Explorer" : "Show Explorer"}
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all font-bold text-sm">
            ◈
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              RepoNavigator
            </span>
            <span className="text-[10px] uppercase font-mono font-semibold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              AI
            </span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800" />

        {/* Repository Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 hover:text-white transition-all group"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium font-mono text-zinc-100">{currentRepo}</span>
            <span className="text-[10px] text-zinc-500 font-mono">({currentBranch})</span>
            <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-transform" />
          </button>

          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setDropdownOpen(false)} 
              />
              <div className="absolute left-0 mt-1.5 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 p-1.5 space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] uppercase font-mono text-zinc-500">
                  Switch Repository
                </div>
                {sampleRepos.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => {
                      onSelectRepo(r.name);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      currentRepo === r.name
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                        : "text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-medium text-xs truncate">{r.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{r.branch}</div>
                    </div>
                    {currentRepo === r.name && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}

                <div className="border-t border-zinc-800 my-1" />

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenImport();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Import GitHub Repository...</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center: Command Palette Search Bar */}
      <div className="hidden md:flex items-center">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3 py-1.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-zinc-400 transition-all w-64 justify-between group shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
            <span className="font-mono text-[11px] text-zinc-400">Search code, nodes, AST...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/80">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Status Badge matching wireframe ● Repository Ready & Chat Toggle */}
      <div className="flex items-center gap-2">
        {/* IBM Bob 2.0 Submission Badge Button */}
        <button
          onClick={() => setIsBobModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono shadow-sm transition-all hover:scale-105"
          title="View IBM Bob 2.0 Hackathon Proof & Pitch Plan"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold">IBM Bob 2.0</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono shadow-sm shadow-emerald-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium tracking-tight">
            {isReady ? "Repository Connected" : "Analyzing..."}
          </span>
        </div>

        {onToggleRight && (
          <button
            onClick={onToggleRight}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              isRightOpen
                ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
            }`}
            title={isRightOpen ? "Collapse AI Chat Panel" : "Open AI Chat Panel"}
          >
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        )}
      </div>

      {/* IBM Bob 2.0 Modal */}
      <IBMBobBadgeModal
        isOpen={isBobModalOpen}
        onClose={() => setIsBobModalOpen(false)}
      />
    </header>
  );
}
