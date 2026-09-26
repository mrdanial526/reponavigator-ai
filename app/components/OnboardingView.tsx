"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Terminal, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  FileCode, 
  Layers, 
  ExternalLink,
  Clock,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { ONBOARDING_STEPS, OnboardingStep } from "@/app/data/repoData";

interface OnboardingViewProps {
  onOpenFile: (filePath: string) => void;
  onAskAI: (prompt: string) => void;
  onSwitchToOverview: () => void;
  steps?: OnboardingStep[];
}

export default function OnboardingView({
  onOpenFile,
  onAskAI,
  onSwitchToOverview,
  steps: initialSteps = ONBOARDING_STEPS,
}: OnboardingViewProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps);
  const [activeStepId, setActiveStepId] = useState<string>(initialSteps[0]?.id || "step-1");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  useEffect(() => {
    setSteps(initialSteps);
    if (initialSteps.length > 0) {
      setActiveStepId(initialSteps[0].id);
    }
  }, [initialSteps]);

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0];

  const toggleChecklistItem = (stepId: string, checkId: string) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id !== stepId) return s;
        return {
          ...s,
          checklist: s.checklist.map((c) =>
            c.id === checkId ? { ...c, completed: !c.completed } : c
          ),
        };
      })
    );
  };

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const totalChecklist = steps.flatMap((s) => s.checklist);
  const completedChecklist = totalChecklist.filter((c) => c.completed).length;
  const progressPercent = Math.round(
    (completedChecklist / totalChecklist.length) * 100
  );

  return (
    <div className="w-full h-full bg-[#0a0d14] flex flex-col md:flex-row overflow-hidden select-none">
      {/* Sidebar: Step List */}
      <div className="w-full md:w-80 border-r border-zinc-800/80 bg-zinc-950/80 flex flex-col">
        {/* Progress Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-xs text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Developer Onboarding</span>
            </h3>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 font-mono">
            {completedChecklist} of {totalChecklist.length} tasks finished
          </p>
        </div>

        {/* Steps Navigation */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
          {steps.map((step, idx) => {
            const isCompleted = step.checklist.every((c) => c.completed);
            const isActive = step.id === activeStepId;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                  isActive
                    ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/5"
                    : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-mono font-bold ${
                          isActive
                            ? "border-cyan-400 text-cyan-400"
                            : "border-zinc-600 text-zinc-500"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-xs truncate text-zinc-200">
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500 font-mono">
                      <span>{step.category}</span>
                      <span>•</span>
                      <span>{step.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 text-center">
          <button
            onClick={onSwitchToOverview}
            className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors flex items-center justify-center gap-2"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Return to Architecture Cockpit</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Title Banner */}
        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {activeStep.category}
                </span>
                <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  {activeStep.estimatedTime}
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-100 mt-1.5">
                {activeStep.title}
              </h2>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                {activeStep.description}
              </p>
            </div>

            <button
              onClick={() =>
                onAskAI(
                  `Help me with onboarding step: "${activeStep.title}". Can you give step-by-step guidance and troubleshoot potential setup issues?`
                )
              }
              className="flex items-center gap-2 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-all flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Guide</span>
            </button>
          </div>
        </div>

        {/* Actionable Checklist */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Interactive Checklist</span>
          </h3>

          <div className="space-y-2">
            {activeStep.checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(activeStep.id, item.id)}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  item.completed
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                    : "bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    item.completed ? "line-through text-zinc-400" : "text-zinc-200"
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal Commands */}
        {activeStep.commands && activeStep.commands.length > 0 && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden font-mono">
            <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-zinc-200">
                  Terminal Commands
                </span>
              </div>
              <button
                onClick={() =>
                  copyCommand(
                    activeStep.commands!.join("\n"),
                    `all-${activeStep.id}`
                  )
                }
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
              >
                {copiedCodeId === `all-${activeStep.id}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied all</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy all</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 space-y-2 text-xs">
              {activeStep.commands.map((cmd, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 text-cyan-300 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-600 select-none">$</span>
                    <span>{cmd}</span>
                  </div>
                  <button
                    onClick={() => copyCommand(cmd, `cmd-${activeStep.id}-${i}`)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-zinc-200"
                  >
                    {copiedCodeId === `cmd-${activeStep.id}-${i}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Snippet */}
        {activeStep.codeSnippet && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden font-mono">
            <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span className="text-zinc-300 font-semibold">
                {activeStep.codeSnippet.filename}
              </span>
              <button
                onClick={() =>
                  copyCommand(
                    activeStep.codeSnippet!.code,
                    `snip-${activeStep.id}`
                  )
                }
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
              >
                {copiedCodeId === `snip-${activeStep.id}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs text-zinc-200 overflow-x-auto custom-scrollbar leading-relaxed">
              <code>{activeStep.codeSnippet.code}</code>
            </pre>
          </div>
        )}

        {/* Related Files */}
        {activeStep.relatedFiles && activeStep.relatedFiles.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Related Files to Check
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeStep.relatedFiles.map((file, i) => (
                <button
                  key={i}
                  onClick={() => onOpenFile(file)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{file}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
