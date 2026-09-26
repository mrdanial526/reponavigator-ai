"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNodeComponent from "./CustomNode";
import { INITIAL_ARCH_NODES, INITIAL_ARCH_EDGES, ArchNodeData } from "@/app/data/repoData";
import { 
  RotateCcw, 
  Layers, 
  Zap, 
  Info,
  MoveVertical,
  MoveHorizontal,
  LayoutGrid,
  Focus,
  Eye,
  EyeOff
} from "lucide-react";

interface ArchitectureMapProps {
  onNodeSelect: (nodeId: string, nodeData: ArchNodeData) => void;
  selectedNodeId?: string | null;
  highlightedNodeId?: string | null;
  isLeftOpen?: boolean;
  isRightOpen?: boolean;
  repoNodes?: Node[];
  repoEdges?: Edge[];
  repoName?: string;
}

const nodeTypes = {
  customArch: CustomNodeComponent,
};

function ArchitectureMapInner({
  onNodeSelect,
  selectedNodeId,
  highlightedNodeId,
  isLeftOpen,
  isRightOpen,
  repoNodes = INITIAL_ARCH_NODES,
  repoEdges = INITIAL_ARCH_EDGES,
  repoName,
}: ArchitectureMapProps) {
  const { fitView, setCenter } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(repoNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(repoEdges);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState(true);
  const [activeLayout, setActiveLayout] = useState<"topDown" | "horizontal" | "grid">("topDown");
  const [showMinimap, setShowMinimap] = useState(true);

  // Sync nodes and edges whenever active repository changes
  useEffect(() => {
    setNodes(repoNodes);
    setEdges(repoEdges);
    setActiveFilter("all");
    const timer = setTimeout(() => {
      fitView({ padding: 0.25, duration: 400 });
    }, 150);
    return () => clearTimeout(timer);
  }, [repoNodes, repoEdges, repoName, setNodes, setEdges, fitView]);

  // Auto-fit view when sidebars open/close or layout changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.25, duration: 400 });
    }, 150);
    return () => clearTimeout(timer);
  }, [isLeftOpen, isRightOpen, activeLayout, fitView]);

  // Center on highlighted or selected node
  useEffect(() => {
    const targetId = selectedNodeId || highlightedNodeId;
    if (targetId) {
      const target = nodes.find((n) => n.id === targetId);
      if (target) {
        setCenter(target.position.x + 130, target.position.y + 70, {
          zoom: 1.1,
          duration: 400,
        });
      }
    }
  }, [selectedNodeId, highlightedNodeId, nodes, setCenter]);

  // Dynamic layout repositioning based on active nodes
  const handleApplyLayout = (layoutKey: "topDown" | "horizontal" | "grid") => {
    setActiveLayout(layoutKey);

    setNodes((prevNodes) => {
      return prevNodes.map((node, idx) => {
        let newPos = { ...node.position };

        if (layoutKey === "topDown") {
          if (idx === 0) {
            newPos = { x: 320, y: 30 };
          } else {
            const row = Math.floor((idx - 1) / 3);
            const col = (idx - 1) % 3;
            newPos = { x: 60 + col * 270, y: 220 + row * 190 };
          }
        } else if (layoutKey === "horizontal") {
          if (idx === 0) {
            newPos = { x: 50, y: 190 };
          } else {
            const col = Math.floor((idx - 1) / 3) + 1;
            const row = (idx - 1) % 3;
            newPos = { x: 50 + col * 330, y: 50 + row * 180 };
          }
        } else if (layoutKey === "grid") {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          newPos = { x: 60 + col * 300, y: 50 + row * 200 };
        }

        return { ...node, position: newPos };
      });
    });

    setTimeout(() => {
      fitView({ padding: 0.25, duration: 400 });
    }, 100);
  };

  // Filter nodes based on selected category
  const filteredNodes = useMemo(() => {
    return nodes.map((node) => {
      const data = node.data as unknown as ArchNodeData;
      const isMatch = activeFilter === "all" || data.category === activeFilter;
      const isHighlighted = highlightedNodeId === node.id || selectedNodeId === node.id;
      
      return {
        ...node,
        style: {
          opacity: isMatch ? 1 : 0.2,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: isHighlighted ? 20 : 1,
        },
        selected: isHighlighted,
      };
    });
  }, [nodes, activeFilter, highlightedNodeId, selectedNodeId]);

  // Edges styling with active traffic
  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const isConnectedToSelected = 
        selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId);
      
      return {
        ...edge,
        animated: isSimulatingTraffic,
        style: {
          ...edge.style,
          stroke: isConnectedToSelected ? "#38bdf8" : (edge.style?.stroke || "#64748b"),
          strokeWidth: isConnectedToSelected ? 3.5 : 2,
          filter: isConnectedToSelected ? "drop-shadow(0 0 8px rgba(56, 189, 248, 0.7))" : undefined,
        },
      };
    });
  }, [edges, selectedNodeId, isSimulatingTraffic]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id, node.data as unknown as ArchNodeData);
    },
    [onNodeSelect]
  );

  const handleResetLayout = () => {
    handleApplyLayout("topDown");
    setActiveFilter("all");
    setTimeout(() => {
      fitView({ padding: 0.25, duration: 400 });
    }, 100);
  };

  // Derive active categories from the current nodes
  const categories = useMemo(() => {
    const cats = new Set<string>();
    nodes.forEach((n) => {
      const d = n.data as unknown as ArchNodeData;
      if (d?.category) cats.add(d.category);
    });

    const list = [{ id: "all", label: "All Modules" }];
    cats.forEach((c) => {
      list.push({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) });
    });
    return list;
  }, [nodes]);

  return (
    <div className="relative w-full h-full bg-[#080b11] flex flex-col overflow-hidden">
      {/* Top Architecture Canvas Control Bar */}
      <div className="h-11 px-3.5 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between z-10 select-none">
        {/* Left: Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium pr-2 border-r border-zinc-800">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">Architecture Map</span>
          </div>

          <div className="flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                  activeFilter === cat.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Layout Switchers & Flow Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Layout Presets */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[10px]">
            <button
              onClick={() => handleApplyLayout("topDown")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                activeLayout === "topDown"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Top-Down Vertical Flow"
            >
              <MoveVertical className="w-3 h-3" />
              <span className="hidden md:inline">Top-Down</span>
            </button>
            <button
              onClick={() => handleApplyLayout("horizontal")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                activeLayout === "horizontal"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Horizontal Left-to-Right Flow"
            >
              <MoveHorizontal className="w-3 h-3" />
              <span className="hidden md:inline">Horizontal</span>
            </button>
            <button
              onClick={() => handleApplyLayout("grid")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                activeLayout === "grid"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="2x2 Grid Layout"
            >
              <LayoutGrid className="w-3 h-3" />
              <span className="hidden md:inline">Grid</span>
            </button>
          </div>

          {/* Auto-Fit / Center Button */}
          <button
            onClick={() => fitView({ padding: 0.25, duration: 400 })}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            title="Auto-Center & Fit View"
          >
            <Focus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">Fit View</span>
          </button>

          {/* Toggle Minimap */}
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-colors ${
              showMinimap
                ? "bg-zinc-900 text-cyan-300 border-zinc-700"
                : "bg-zinc-900/50 text-zinc-500 border-zinc-800"
            }`}
            title="Toggle Minimap"
          >
            {showMinimap ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden xl:inline">Minimap</span>
          </button>

          {/* Live Flow Traffic Toggle */}
          <button
            onClick={() => setIsSimulatingTraffic(!isSimulatingTraffic)}
            className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
              isSimulatingTraffic
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-medium"
                : "bg-zinc-900 text-zinc-400 border-zinc-800"
            }`}
            title="Toggle Live Traffic Flow"
          >
            <Zap className={`w-3 h-3 ${isSimulatingTraffic ? "text-emerald-400 animate-pulse" : "text-zinc-500"}`} />
            <span>Flow</span>
          </button>

          {/* Reset Layout */}
          <button
            onClick={handleResetLayout}
            className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
            title="Reset Architecture Layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={filteredNodes}
          edges={styledEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.4}
          maxZoom={1.8}
          className="bg-[#080b11]"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={18}
            size={1.2}
            color="#272f45"
            className="opacity-70"
          />

          <Controls
            className="!bg-zinc-900/90 !border-zinc-800 !rounded-xl !shadow-xl !fill-zinc-300 [&>button]:!border-zinc-800 [&>button]:!bg-transparent hover:[&>button]:!bg-zinc-800"
            showInteractive={false}
          />

          {/* Clean Styled Minimap */}
          {showMinimap && (
            <MiniMap
              nodeStrokeColor="#475569"
              nodeColor={(node) => {
                const data = node.data as unknown as ArchNodeData;
                switch (data?.category) {
                  case "frontend":
                    return "#38bdf8";
                  case "auth":
                    return "#c084fc";
                  case "backend":
                    return "#818cf8";
                  case "database":
                    return "#34d399";
                  case "payment":
                    return "#ec4899";
                  case "service":
                    return "#fbbf24";
                  default:
                    return "#94a3b8";
                }
              }}
              nodeBorderRadius={6}
              maskColor="rgba(8, 11, 17, 0.85)"
              className="!bg-zinc-950/95 !border-2 !border-zinc-800 !rounded-xl !overflow-hidden !shadow-2xl !w-44 !h-28 !bottom-4 !right-4"
            />
          )}

          {/* Canvas Floating Legend */}
          <Panel position="bottom-left" className="!m-3">
            <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800/90 rounded-xl p-2.5 shadow-xl text-[10px] text-zinc-400 space-y-1 hidden md:block">
              <div className="font-semibold text-zinc-200 text-[11px] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>{repoName || "Interactive Architecture Cockpit"}</span>
              </div>
              <p className="text-zinc-400 text-[10px] max-w-[220px]">
                Click any node to inspect endpoints & files. Drag nodes to customize positions.
              </p>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export default function ArchitectureMap(props: ArchitectureMapProps) {
  return (
    <ReactFlowProvider>
      <ArchitectureMapInner {...props} />
    </ReactFlowProvider>
  );
}
