"use client";

import React from "react";
import { 
  X, 
  Layers, 
  ExternalLink, 
  Code, 
  Activity, 
  Cpu, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  FileText,
  Sparkles
} from "lucide-react";
import { ArchNodeData } from "@/app/data/repoData";

interface NodeDetailDrawerProps {
  nodeId: string | null;
  nodeData: ArchNodeData | null;
  onClose: () => void;
  onSelectFile: (filePath: string) => void;
  onAskAI: (prompt: string) => void;
}

export default function NodeDetailDrawer({
  nodeId,
  nodeData,
  onClose,
  onSelectFile,
  onAskAI,
}: NodeDetailDrawerProps) {
  if (!nodeId || !nodeData) return null;

  return (
    <div className="absolute right-3 top-3 bottom-3 w-84 sm:w-96 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/70 rounded-2xl shadow-2xl flex flex-col z-30 overflow-hidden text-zinc-200 animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-start justify-between bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-zinc-100">{nodeData.label}</h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {nodeData.category}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{nodeData.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
        {/* Description */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            Module Overview
          </h4>
          <p className="text-zinc-300 leading-relaxed bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/80">
            {nodeData.description}
          </p>
        </div>

        {/* Live Telemetry / Metrics */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Live Telemetry
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Average Latency</span>
              <span className="text-sm font-mono font-semibold text-emerald-400">
                {nodeData.latency || "12ms"}
              </span>
            </div>
            <div className="bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Throughput</span>
              <span className="text-sm font-mono font-semibold text-cyan-400">
                {nodeData.throughput || "1.8k req/m"}
              </span>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            Technologies & Libraries
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {nodeData.techStack.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-zinc-800/80 border border-zinc-700/60 rounded-md font-mono text-[11px] text-zinc-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Associated Files */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-amber-400" />
            Core Implementation Files ({nodeData.relatedFiles.length})
          </h4>
          <div className="space-y-1.5">
            {nodeData.relatedFiles.map((file, i) => (
              <button
                key={i}
                onClick={() => onSelectFile(file)}
                className="w-full text-left flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-amber-400 font-mono text-[10px]">📄</span>
                  <span className="font-mono text-zinc-300 truncate text-[11px] group-hover:text-cyan-300">
                    {file}
                  </span>
                </div>
                <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Registered Endpoints */}
        {nodeData.endpoints && nodeData.endpoints.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              Exposed Endpoints
            </h4>
            <div className="space-y-1 bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/80 font-mono text-[10px]">
              {nodeData.endpoints.map((ep, i) => (
                <div key={i} className="flex items-center gap-2 py-0.5 text-zinc-300">
                  <span className="text-emerald-400">●</span>
                  <span>{ep}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center gap-2">
        <button
          onClick={() => onAskAI(`Explain the architecture and responsibilities of the ${nodeData.label} module (${nodeData.category}).`)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Ask AI About This Module
        </button>
      </div>
    </div>
  );
}
