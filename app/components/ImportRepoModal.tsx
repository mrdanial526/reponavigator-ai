"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Layers,
  Globe
} from "lucide-react";

import { registerRepositoryProfile, getRepositoryProfile } from "@/app/data/repoData";

interface ImportRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (repoName: string) => void;
}

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
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

export default function ImportRepoModal({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportRepoModalProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");

  if (!isOpen) return null;

  const popularTemplates = [
    { name: "GoogleCloudPlatform/microservices-demo", desc: "10-Microservices Online Boutique (Kubernetes, Istio & gRPC)", lang: "Go / C# / Node" },
    { name: "facebook/react", desc: "The library for web and native user interfaces", lang: "JavaScript" },
    { name: "vercel/next.js", desc: "The React Framework for the Web", lang: "TypeScript" },
    { name: "shadcn/ui", desc: "Beautifully designed components built with Tailwind & Radix", lang: "TypeScript" },
  ];

  const handleStartScan = async (urlToUse?: string) => {
    const target = (urlToUse || repoUrl).trim();
    if (!target) return;

    setIsScanning(true);

    const cleanName = target
      .replace(/^https?:\/\/github\.com\//, "")
      .replace(/\.git$/, "")
      .replace(/\/$/, "");

    // ── Step 1: try git clone (full file content, real AI answers) ────────
    // Falls back to GitHub tree API if the repo is too large (>200 MB).
    setScanStep("Cloning repository — reading actual source files...");

    const cloneCtrl = new AbortController();
    // Clone can take up to 45s for medium repos; give the full budget
    const cloneTimeout = setTimeout(() => cloneCtrl.abort(), 50000);

    const cloneTimer1 = setTimeout(() => setScanStep("Building file tree & indexing source files..."), 4000);
    const cloneTimer2 = setTimeout(() => setScanStep("Detecting architecture modules & data flows..."), 10000);

    const clearCloneTimers = () => {
      clearTimeout(cloneTimeout);
      clearTimeout(cloneTimer1);
      clearTimeout(cloneTimer2);
    };

    try {
      const cloneRes = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: target }),
        signal: cloneCtrl.signal,
      });
      clearCloneTimers();

      if (cloneRes.ok) {
        const data = await cloneRes.json();
        if (data.profile) {
          registerRepositoryProfile(data.profile);
          setIsScanning(false);
          onImportSuccess(data.profile.name);
          onClose();
          return;
        }
      }

      // clone returned 413 (too large) or other error — fall through to GitHub tree
      const errData = cloneRes.status === 413 ? await cloneRes.json().catch(() => ({})) : {};
      const sizeMB: number = errData.sizeMB || 0;
      if (sizeMB > 0) {
        setScanStep(`Large repo (${sizeMB} MB) — using GitHub tree API instead...`);
      } else {
        setScanStep("Clone failed — falling back to GitHub tree API...");
      }
    } catch {
      clearCloneTimers();
      setScanStep("Clone timed out — falling back to GitHub tree API...");
    }

    // ── Step 2: fallback — GitHub tree API (structure only, no file content) ─
    const ghCtrl = new AbortController();
    const ghTimeout = setTimeout(() => ghCtrl.abort(), 15000);
    const ghTimer = setTimeout(() => setScanStep("Generating Architecture Graph & Directed Data Flows..."), 3000);

    try {
      const res = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: target }),
        signal: ghCtrl.signal,
      });
      clearTimeout(ghTimeout);
      clearTimeout(ghTimer);

      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          registerRepositoryProfile(data.profile);
          setIsScanning(false);
          onImportSuccess(data.profile.name);
          onClose();
          return;
        }
      }

      _registerFallback(cleanName);
      setIsScanning(false);
      onImportSuccess(cleanName);
      onClose();
    } catch {
      clearTimeout(ghTimeout);
      clearTimeout(ghTimer);
      _registerFallback(cleanName);
      setIsScanning(false);
      onImportSuccess(cleanName);
      onClose();
    }
  };

  // Register a minimal but correct profile keyed to `repoName` so
  // getRepositoryProfile() never falls through to the stale generic placeholder.
  const _registerFallback = (repoName: string) => {
    // If already registered (e.g. second import attempt) keep it
    const existing = getRepositoryProfile(repoName);
    if (existing && existing.name === repoName) return;

    const baseName = repoName.split("/").pop() || repoName;
    registerRepositoryProfile({
      id: `gh-${repoName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name: repoName,
      branch: "main",
      version: "v1.0.0",
      badge: "Indexed",
      status: "Repository Connected",
      lastIndexed: "Just now",
      totalFiles: 0,
      totalLines: 0,
      techStack: ["TypeScript"],
      description: `${repoName} — fetched from GitHub`,
      fileTree: [],
      nodes: [],
      edges: [],
      welcomeMessage: {
        id: `msg-fb-${Date.now()}`,
        sender: "assistant",
        text: `◈ **${repoName}**\n\nGitHub was rate-limited or the request timed out. Try re-importing or use the ⚡ Open Immediately button.\n\n*Tip: unauthenticated GitHub API allows ~60 requests/hour.*`,
        timestamp: "Just now",
        suggestedActions: ["Explain architecture", "What is the directory structure?"],
      },
      quickPrompts: [`How does ${baseName} work?`, "Explain directory structure"],
      onboardingSteps: [
        {
          id: "fb-s1",
          title: `1. Clone ${baseName}`,
          estimatedTime: "1 min",
          category: "Setup",
          description: `Clone and explore ${repoName}.`,
          commands: [`git clone https://github.com/${repoName}.git`, `cd ${baseName}`],
          relatedFiles: ["README.md"],
          checklist: [{ id: "fb-c1", text: "Clone repository", completed: false }],
        },
      ],
    });
  };

  const handleCancelOrSkip = () => {
    const target = repoUrl.trim() || "facebook/react";
    const cleanName = target
      .replace(/^https?:\/\/github\.com\//, "")
      .replace(/\.git$/, "")
      .replace(/\/$/, "");
    _registerFallback(cleanName);
    setIsScanning(false);
    onImportSuccess(cleanName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-200 z-10">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700/60 text-cyan-400">
              <GithubIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-100">Import GitHub Repository</h3>
              <p className="text-xs text-zinc-400">Index any public repo into an interactive Architecture Map</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {isScanning ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="space-y-1">
                <div className="text-sm font-semibold text-zinc-200">
                  AI Repository Engine Active
                </div>
                <p className="text-xs text-cyan-400 font-mono animate-pulse">
                  {scanStep}
                </p>
              </div>

              {/* Skip & Cancel buttons to guarantee user is never stuck */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleCancelOrSkip}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition-all"
                >
                  ⚡ Open Immediately
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  GitHub Repository URL or handle
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/organization/repository"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 font-mono"
                  />
                  <button
                    onClick={() => handleStartScan()}
                    disabled={!repoUrl.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-xl shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-2">
                  Or pick a popular showcase repo
                </span>
                <div className="space-y-1.5">
                  {popularTemplates.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => handleStartScan(t.name)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-mono text-xs font-semibold text-zinc-200 group-hover:text-cyan-300">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-zinc-400 line-clamp-1">{t.desc}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
