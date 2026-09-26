"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { 
  LayoutTemplate, 
  ShieldCheck, 
  Server, 
  Sparkles, 
  Database, 
  CreditCard, 
  Activity,
  Layers,
  ChevronRight
} from "lucide-react";
import { ArchNodeData } from "@/app/data/repoData";

const iconMap: Record<string, React.ReactNode> = {
  LayoutTemplate: <LayoutTemplate className="w-4 h-4 text-sky-400" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4 text-purple-400" />,
  Server: <Server className="w-4 h-4 text-indigo-400" />,
  Sparkles: <Sparkles className="w-4 h-4 text-amber-400" />,
  Database: <Database className="w-4 h-4 text-emerald-400" />,
  CreditCard: <CreditCard className="w-4 h-4 text-pink-400" />,
  Layers: <Layers className="w-4 h-4 text-cyan-400" />,
};

const categoryBorderColors: Record<string, string> = {
  frontend: "border-sky-500/40 hover:border-sky-400 bg-sky-950/20 shadow-sky-500/10",
  auth: "border-purple-500/40 hover:border-purple-400 bg-purple-950/20 shadow-purple-500/10",
  backend: "border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/20 shadow-indigo-500/10",
  service: "border-amber-500/40 hover:border-amber-400 bg-amber-950/20 shadow-amber-500/10",
  database: "border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20 shadow-emerald-500/10",
  payment: "border-pink-500/40 hover:border-pink-400 bg-pink-950/20 shadow-pink-500/10",
  external: "border-zinc-500/40 hover:border-zinc-400 bg-zinc-900/40 shadow-zinc-500/10",
};

const categoryBadgeColors: Record<string, string> = {
  frontend: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  auth: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  backend: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  service: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  database: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  payment: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  external: "bg-zinc-700/30 text-zinc-300 border-zinc-600/30",
};

function CustomNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ArchNodeData;
  const borderStyle = categoryBorderColors[nodeData.category] || "border-zinc-700 bg-zinc-900";
  const badgeStyle = categoryBadgeColors[nodeData.category] || "bg-zinc-800 text-zinc-300 border-zinc-700";

  return (
    <div
      className={`relative min-w-[240px] max-w-[270px] rounded-xl border backdrop-blur-md transition-all duration-200 shadow-lg ${borderStyle} ${
        selected ? "ring-2 ring-cyan-400 shadow-cyan-500/20 scale-[1.02]" : "hover:scale-[1.01]"
      } group cursor-pointer p-3.5`}
    >
      {/* Target handle top */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-zinc-900 !-top-1.5 transition-colors group-hover:!bg-cyan-400"
      />

      {/* Header with Icon and Category */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800/80 shadow-inner">
            {iconMap[nodeData.icon] || <Layers className="w-4 h-4 text-cyan-400" />}
          </div>
          <div>
            <h4 className="font-semibold text-xs text-zinc-100 tracking-tight leading-tight">
              {nodeData.label}
            </h4>
            <span className="text-[10px] text-zinc-400 font-mono">
              {nodeData.filesCount} files
            </span>
          </div>
        </div>

        <span
          className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border tracking-wider font-medium ${badgeStyle}`}
        >
          {nodeData.category}
        </span>
      </div>

      {/* Subtitle / Description */}
      <p className="text-[11px] text-zinc-300 leading-snug mb-2.5 line-clamp-2">
        {nodeData.subtitle}
      </p>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {nodeData.techStack.slice(0, 3).map((tech, idx) => (
          <span
            key={idx}
            className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-400 font-mono"
          >
            {tech}
          </span>
        ))}
        {nodeData.techStack.length > 3 && (
          <span className="text-[9px] px-1 py-0.5 rounded bg-zinc-900/50 text-zinc-500 font-mono">
            +{nodeData.techStack.length - 3}
          </span>
        )}
      </div>

      {/* Metrics Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px] text-zinc-400 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{nodeData.latency || "OK"}</span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400 group-hover:text-cyan-400 transition-colors">
          <span>Inspect</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>

      {/* Source handle bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-zinc-900 !-bottom-1.5 transition-colors group-hover:!bg-cyan-400"
      />
      {/* Additional side handles for flexible connections */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2 !h-2 !bg-zinc-500 !border-2 !border-zinc-900 !-right-1 opacity-50"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-2 !h-2 !bg-zinc-500 !border-2 !border-zinc-900 !-left-1 opacity-50"
      />
    </div>
  );
}

export default memo(CustomNodeComponent);
