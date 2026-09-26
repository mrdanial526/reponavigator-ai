"use client";

import React from "react";
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Code2, 
  Terminal, 
  ExternalLink,
  ShieldCheck,
  Bot
} from "lucide-react";

interface IBMBobBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IBMBobBadgeModal({ isOpen, onClose }: IBMBobBadgeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden text-zinc-200 z-10">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 font-bold text-base">
              ◈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-zinc-100">IBM Bob 2.0 Hackathon Build Proof</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold">
                  Official Submission
                </span>
              </div>
              <p className="text-xs text-zinc-400">RepoNavigator AI • Visual Developer Onboarding Cockpit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-zinc-300 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-cyan-300">
              <Bot className="w-4 h-4" />
              <span>Project Provenance & Architecture Summary</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-300">
              RepoNavigator AI was engineered to solve developer onboarding friction. It bridges the gap between static code inspection and cognitive architecture comprehension by automatically transforming codebases into real-time interactive systems graphs.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive React Flow Map</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Custom architecture nodes, live animated traffic lines, category filtering & layout presets.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Live GitHub API Parser</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Dynamic recursive tree discovery (`/api/github`) parsing public repositories into live architecture.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Grounded RAG AI Pair-Programmer</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Context-aware conversational assistant with clickable module badges and copyable snippets.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Latency 4-Service Showcase</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Pre-packaged realistic microservices (Frontend ──▶ Fastify ──▶ JWT Auth / PostgreSQL).
              </p>
            </div>
          </div>

          {/* Pitch Checklist */}
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
            <h4 className="font-semibold text-zinc-200 text-[11px] uppercase tracking-wider">
              2-Minute Demo Flow Checklist
            </h4>
            <div className="space-y-1.5 text-[11px] font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>0:00 - 0:30 → Problem & 3-Column Cockpit (Files | Architecture | AI Chat)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>0:30 - 1:00 → Interactive Node Inspector & Clickable Quick Prompts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>1:00 - 1:30 → Bottom Dock Switch (Onboarding Checklist & Live Terminal Commands)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>1:30 - 2:00 → Dynamic Multi-Repo Switching & Live GitHub Import</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>IBM Bob 2.0 Hackathon • Track: AI Developer Tools</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-sans text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
