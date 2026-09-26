"use client";

import React, { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import BottomBar, { ViewTab } from "./BottomBar";
import RepositoryExplorer from "./RepositoryExplorer";
import ArchitectureMap from "./ArchitectureMap";
import AIChatPanel from "./AIChatPanel";
import NodeDetailDrawer from "./NodeDetailDrawer";
import FileViewerModal from "./FileViewerModal";
import CommandPalette from "./CommandPalette";
import ImportRepoModal from "./ImportRepoModal";
import OnboardingView from "./OnboardingView";
import { 
  getRepositoryProfile,
  INITIAL_REPOSITORY_DATA, 
  ArchNodeData, 
  FileNode 
} from "@/app/data/repoData";
import { 
  PanelLeftOpen, 
  PanelRightOpen, 
  MessageSquareCode, 
  FolderTree, 
  Maximize2 
} from "lucide-react";

export default function RepoNavigatorApp() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<ViewTab>("overview");
  
  // Collapsible panels
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // Repository Info
  const [currentRepo, setCurrentRepo] = useState(INITIAL_REPOSITORY_DATA.name);
  const [currentBranch, setCurrentBranch] = useState(INITIAL_REPOSITORY_DATA.branch);
  const [isReady, setIsReady] = useState(true);

  // Active Repository Profile — re-derived any time currentRepo changes.
  // useMemo ensures we re-read from the registry (which may have just been
  // updated by registerRepositoryProfile) rather than using a stale closure.
  const activeProfile = useMemo(
    () => getRepositoryProfile(currentRepo),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRepo, isReady]   // isReady flip (400-800ms after import) triggers re-read
  );

  // Cross-selection and focus state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<ArchNodeData | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  // Chat integration
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Reset selected inspector & file state whenever user switches repository
  useEffect(() => {
    setSelectedNodeId(null);
    setSelectedNodeData(null);
    setHighlightedNodeId(null);
    setActiveFile(null);
    setSelectedFilePath(null);
  }, [currentRepo]);

  // Flattened files lookup helper from the active repository file tree
  const findFileByPath = (path: string): FileNode | null => {
    let found: FileNode | null = null;
    const recurse = (nodes: FileNode[]) => {
      for (const n of nodes) {
        if (n.path === path) {
          found = n;
          return;
        }
        if (n.children) recurse(n.children);
      }
    };
    recurse(activeProfile.fileTree);
    return found;
  };

  const handleNodeSelect = (nodeId: string, nodeData: ArchNodeData) => {
    setSelectedNodeId(nodeId);
    setSelectedNodeData(nodeData);
  };

  const handleSelectNodeById = (nodeId: string) => {
    const target = activeProfile.nodes.find((n) => n.id === nodeId);
    if (target) {
      setSelectedNodeId(nodeId);
      setSelectedNodeData(target.data as unknown as ArchNodeData);
      if (activeTab === "onboarding") {
        setActiveTab("overview");
      }
    }
  };

  const handleOpenFile = (file: FileNode) => {
    setActiveFile(file);
    setSelectedFilePath(file.path);
    if (file.connectedNodeId) {
      setHighlightedNodeId(file.connectedNodeId);
    }
  };

  const handleOpenFilePath = (path: string) => {
    const f = findFileByPath(path);
    if (f) {
      handleOpenFile(f);
    } else {
      // Fallback virtual file
      handleOpenFile({
        id: path,
        name: path.split("/").pop() || path,
        type: "file",
        path: path,
        size: "1.8 KB",
        lines: 48,
        language: "typescript",
        description: `Source file for ${path}`,
      });
    }
  };

  const handleAskAI = (prompt: string) => {
    setInitialPrompt(prompt);
    setIsRightSidebarOpen(true);
    if (activeTab === "onboarding") {
      setActiveTab("overview");
    }
  };

  const handleSelectRepo = (repoName: string) => {
    setCurrentRepo(repoName);
    const profile = getRepositoryProfile(repoName);
    setCurrentBranch(profile.branch);
    setIsReady(false);
    setTimeout(() => {
      setIsReady(true);
    }, 400);
  };

  const handleImportSuccess = (newRepoName: string) => {
    setCurrentRepo(newRepoName);
    const profile = getRepositoryProfile(newRepoName);
    setCurrentBranch(profile.branch || "main");
    setIsReady(false);
    setTimeout(() => {
      setIsReady(true);
    }, 800);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#080b11] text-zinc-100 overflow-hidden font-sans">
      {/* 1. Header with panel toggle buttons */}
      <Header
        currentRepo={activeProfile.name}
        currentBranch={activeProfile.branch}
        isReady={isReady}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenImport={() => setIsImportModalOpen(true)}
        onSelectRepo={handleSelectRepo}
        isLeftOpen={isLeftSidebarOpen}
        onToggleLeft={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        isRightOpen={isRightSidebarOpen}
        onToggleRight={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 w-full relative overflow-hidden flex">
        {activeTab === "overview" && (
          <div className="w-full h-full flex overflow-hidden relative">
            {/* Left Column: REPOSITORY (Collapsible) */}
            {isLeftSidebarOpen && (
              <section className="w-64 lg:w-72 flex-shrink-0 h-full border-r border-zinc-800/80 z-20 transition-all duration-200">
                <RepositoryExplorer
                  tree={activeProfile.fileTree}
                  totalFiles={activeProfile.totalFiles}
                  totalModules={activeProfile.nodes.length}
                  onSelectFile={handleOpenFile}
                  onHighlightNode={setHighlightedNodeId}
                  selectedFilePath={selectedFilePath}
                  onToggleCollapse={() => setIsLeftSidebarOpen(false)}
                />
              </section>
            )}

            {/* Middle Column: ARCHITECTURE MAP (Expands automatically to fill 100% of remaining space) */}
            <section className="flex-1 h-full min-w-0 relative overflow-hidden bg-[#0b0f19]">
              {/* Floating Re-open Left Sidebar Button */}
              {!isLeftSidebarOpen && (
                <button
                  onClick={() => setIsLeftSidebarOpen(true)}
                  className="absolute left-3 top-3 z-30 p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-cyan-400 shadow-xl flex items-center gap-1.5 text-xs font-mono backdrop-blur-md transition-all hover:scale-105"
                  title="Open Repository Explorer"
                >
                  <FolderTree className="w-3.5 h-3.5" />
                  <span>Files</span>
                </button>
              )}

              {/* Floating Re-open Right Chat Button */}
              {!isRightSidebarOpen && (
                <button
                  onClick={() => setIsRightSidebarOpen(true)}
                  className="absolute right-3 top-3 z-30 p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-cyan-400 shadow-xl flex items-center gap-1.5 text-xs font-mono backdrop-blur-md transition-all hover:scale-105"
                  title="Open AI Chat Panel"
                >
                  <MessageSquareCode className="w-3.5 h-3.5" />
                  <span>Ask Repo AI</span>
                </button>
              )}

              <ArchitectureMap
                key={activeProfile.id}
                repoNodes={activeProfile.nodes}
                repoEdges={activeProfile.edges}
                repoName={activeProfile.name}
                onNodeSelect={handleNodeSelect}
                selectedNodeId={selectedNodeId}
                highlightedNodeId={highlightedNodeId}
                isLeftOpen={isLeftSidebarOpen}
                isRightOpen={isRightSidebarOpen}
              />

              {/* Node Inspector Drawer */}
              {selectedNodeId && selectedNodeData && (
                <NodeDetailDrawer
                  nodeId={selectedNodeId}
                  nodeData={selectedNodeData}
                  onClose={() => {
                    setSelectedNodeId(null);
                    setSelectedNodeData(null);
                  }}
                  onSelectFile={handleOpenFilePath}
                  onAskAI={handleAskAI}
                />
              )}
            </section>

            {/* Right Column: AI CHAT (Collapsible) */}
            {isRightSidebarOpen && (
              <section className="w-80 lg:w-96 flex-shrink-0 h-full border-l border-zinc-800/80 z-20 transition-all duration-200">
                <AIChatPanel
                  key={`chat-${activeProfile.id}`}
                  welcomeMessage={activeProfile.welcomeMessage}
                  quickPrompts={activeProfile.quickPrompts}
                  repoName={activeProfile.name}
                  activeContextNode={
                    selectedNodeId && selectedNodeData
                      ? { id: selectedNodeId, data: selectedNodeData }
                      : null
                  }
                  activeContextFile={selectedFilePath}
                  onHighlightNode={setHighlightedNodeId}
                  onSelectNode={handleSelectNodeById}
                  initialPrompt={initialPrompt}
                  onClearInitialPrompt={() => setInitialPrompt(null)}
                />
              </section>
            )}
          </div>
        )}

        {activeTab === "architecture" && (
          <div className="w-full h-full relative">
            <ArchitectureMap
              key={`arch-${activeProfile.id}`}
              repoNodes={activeProfile.nodes}
              repoEdges={activeProfile.edges}
              repoName={activeProfile.name}
              onNodeSelect={handleNodeSelect}
              selectedNodeId={selectedNodeId}
              highlightedNodeId={highlightedNodeId}
            />
            {selectedNodeId && selectedNodeData && (
              <NodeDetailDrawer
                nodeId={selectedNodeId}
                nodeData={selectedNodeData}
                onClose={() => {
                  setSelectedNodeId(null);
                  setSelectedNodeData(null);
                }}
                onSelectFile={handleOpenFilePath}
                onAskAI={handleAskAI}
              />
            )}
          </div>
        )}

        {activeTab === "onboarding" && (
          <div className="w-full h-full">
            <OnboardingView
              key={`onboard-${activeProfile.id}`}
              steps={activeProfile.onboardingSteps}
              onOpenFile={handleOpenFilePath}
              onAskAI={handleAskAI}
              onSwitchToOverview={() => setActiveTab("overview")}
            />
          </div>
        )}

        {activeTab === "chat" && (
          <div className="w-full h-full max-w-4xl mx-auto border-x border-zinc-800/80">
            <AIChatPanel
              key={`fullchat-${activeProfile.id}`}
              welcomeMessage={activeProfile.welcomeMessage}
              quickPrompts={activeProfile.quickPrompts}
              repoName={activeProfile.name}
              activeContextNode={
                selectedNodeId && selectedNodeData
                  ? { id: selectedNodeId, data: selectedNodeData }
                  : null
              }
              activeContextFile={selectedFilePath}
              onHighlightNode={setHighlightedNodeId}
              onSelectNode={handleSelectNodeById}
              initialPrompt={initialPrompt}
              onClearInitialPrompt={() => setInitialPrompt(null)}
            />
          </div>
        )}
      </main>

      {/* 3. Bottom Bar */}
      <BottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        nodeCount={activeProfile.nodes.length}
        fileCount={activeProfile.totalFiles}
        branch={activeProfile.branch}
      />

      {/* 4. Modals & Overlays */}
      <FileViewerModal
        file={activeFile}
        currentRepo={activeProfile.name}
        currentBranch={activeProfile.branch}
        onClose={() => setActiveFile(null)}
        onAskAI={handleAskAI}
        onInspectNode={handleSelectNodeById}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectFile={handleOpenFile}
        onSelectNode={handleSelectNodeById}
        onAskAI={handleAskAI}
        onSwitchTab={setActiveTab}
        tree={activeProfile.fileTree}
        nodes={activeProfile.nodes}
      />

      <ImportRepoModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
