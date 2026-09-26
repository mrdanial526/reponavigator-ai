"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Layers, 
  Compass, 
  MessageSquareCode, 
  GitBranch, 
  Activity, 
  Cpu, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

export type ViewTab = "overview" | "architecture" | "onboarding" | "chat";

interface BottomBarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  nodeCount: number;
  fileCount: number;
  branch?: string;
}

export default function BottomBar({
  activeTab,
  onTabChange,
  nodeCount,
  fileCount,
  branch = "main",
}: BottomBarProps) {
  const tabs = [
    { id: "overview" as ViewTab, label: "Overview", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: "architecture" as ViewTab, label: "Architecture", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "onboarding" as ViewTab, label: "Onboarding", icon: <Compass className="w-3.5 h-3.5" /> },
    { id: "chat" as ViewTab, label: "Chat", icon: <MessageSquareCode className="w-3.5 h-3.5" /> },
  ];

  return (
    <footer className="h-10 border-t border-zinc-800/90 bg-zinc-950/95 backdrop-blur-xl px-4 flex items-center justify-between text-xs select-none z-30">
      {/* Left: View Tabs matching wireframe: Overview | Architecture | Onboarding | Chat */}
      <div className="flex items-center gap-1">
        {tabs.map((tab, idx) => (
          <React.Fragment key={tab.id}>
            <button
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
              }`}
            >
              <span className={activeTab === tab.id ? "text-cyan-400" : "text-zinc-500"}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
            {idx < tabs.length - 1 && (
              <span className="text-zinc-700 select-none">|</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right: Repository Telemetry & Status Badges */}
      <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-3 h-3 text-cyan-400" />
          <span>branch: {branch}</span>
        </div>

        <div className="h-3 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-purple-400" />
          <span>{nodeCount} Modules</span>
        </div>

        <div className="h-3 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{fileCount} Files (100% indexed)</span>
        </div>

        <div className="h-3 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-1 text-cyan-400">
          <Sparkles className="w-3 h-3" />
          <span>AI Engine Ready</span>
        </div>
      </div>
    </footer>
  );
}
