"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Trash2, 
  ArrowRight
} from "lucide-react";
import { ChatMessage, INITIAL_CHAT_MESSAGES, ArchNodeData } from "@/app/data/repoData";

interface AIChatPanelProps {
  activeContextNode?: { id: string; data: ArchNodeData } | null;
  activeContextFile?: string | null;
  onHighlightNode?: (nodeId: string | null) => void;
  onSelectNode?: (nodeId: string) => void;
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
  welcomeMessage?: ChatMessage;
  quickPrompts?: string[];
  repoName?: string;
}

export default function AIChatPanel({
  activeContextNode,
  activeContextFile,
  onHighlightNode,
  onSelectNode,
  initialPrompt,
  onClearInitialPrompt,
  welcomeMessage,
  quickPrompts = [
    "How does login work?",
    "How does placing an order work?",
    "Explain the 4 services",
    "Which files should I read first?",
  ],
  repoName = "Demo E-Commerce System",
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage || INITIAL_CHAT_MESSAGES[0]]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("IBM Bob AI / Gemini");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync welcome message on repository switch
  useEffect(() => {
    if (welcomeMessage) {
      setMessages([welcomeMessage]);
    }
  }, [repoName, welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      onClearInitialPrompt?.();
    }
  }, [initialPrompt]);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          repoName,
          contextNode: activeContextNode?.id,
          contextFile: activeContextFile,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          const aiMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: "assistant",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            referencedNodes: data.referencedFiles ?? [],
            suggestedActions: data.suggestedActions ?? [
              "Show entry point",
              "Explain architecture",
              "List dependencies",
            ],
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Chat API error — using local fallback:", err);
    }

    // Local grounded fallback (used for demo repos without a clone workspace)
    setTimeout(() => {
      const response = generateAIResponse(query, repoName, activeContextNode, activeContextFile);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 400);
  };

  const generateAIResponse = (
    query: string, 
    currentRepo: string,
    contextNode?: { id: string; data: ArchNodeData } | null,
    contextFile?: string | null
  ): ChatMessage => {
    const q = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 0. Dedicated File Code Analysis Handler (triggered by "Ask AI About This File" or file queries)
    const fileMatch = 
      query.match(/what the code in ["']?([^"'\n]+)["']? does/i) ||
      query.match(/(?:explain|what does|how does|analyze|read|inspect|describe)\s+(?:the\s+)?(?:file|code in|code for)?\s*["'`]?([a-zA-Z0-9_\-\.\/]+\.[a-zA-Z0-9]+)["'`]?/i) ||
      query.match(/([a-zA-Z0-9_\-\.\/]+\.(?:tsx?|jsx?|go|py|rs|java|sql|prisma|json|ya?ml|proto|md|env|config\.[a-z]+))/i);

    const codeBlockMatch = query.match(/```(?:[a-zA-Z0-9_\-]+)?\n([\s\S]*?)\n```/);
    const targetFilePath = fileMatch ? fileMatch[1].trim() : contextFile || null;

    if (targetFilePath || codeBlockMatch || q.includes("explain what the code in")) {
      const filePath = targetFilePath || (contextFile ? contextFile : "source file");
      const fileName = filePath.split("/").pop() || filePath;
      const fileExt = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() || "" : "";
      const codeSnippetText = codeBlockMatch ? codeBlockMatch[1] : "";

      const fileAnalysis = generateDeepFileAnalysis(filePath, fileName, fileExt, codeSnippetText, currentRepo);

      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: fileAnalysis.text,
        timestamp,
        codeSnippet: fileAnalysis.codeSnippet,
        referencedNodes: fileAnalysis.referencedNodes,
        suggestedActions: fileAnalysis.suggestedActions,
      };
    }

    // 1. RepoNavigator Core repository responses
    if (currentRepo.includes("RepoNavigator Core")) {
      if (q.includes("ast") || q.includes("parser") || q.includes("graph")) {
        return {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          text: "🔍 **AST Parsing & Architecture Inference**:\n\n1. **Extraction**: `app/api/ast-parser/route.ts` invokes Tree-sitter to parse TypeScript/JavaScript source files into Abstract Syntax Trees.\n2. **Import/Export Resolution**: It extracts symbols, declared endpoints (`GET`, `POST`), and cross-file import statements.\n3. **Graph Assembly**: Nodes and directed edges are computed with category mappings (`frontend`, `backend`, `auth`, `database`).\n4. **Real-time Visualization**: The computed topology is rendered on the React Flow canvas in `app/components/ArchitectureMap.tsx`.",
          timestamp,
          codeSnippet: {
            filename: "app/api/ast-parser/route.ts",
            language: "typescript",
            code: `export async function parseRepositoryAST(files: string[]) {
  const symbolGraph = await treeSitterEngine.extractSymbols(files);
  const nodes = buildArchitectureNodes(symbolGraph);
  const edges = inferCommunicationEdges(symbolGraph);
  return { nodes, edges };
}`
          },
          referencedNodes: ["rn-parser-node", "rn-ui-node"],
          suggestedActions: ["How does RAG ground code questions?", "Explain React Flow integration"]
        };
      }
      if (q.includes("rag") || q.includes("embed") || q.includes("copilot")) {
        return {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          text: "🧠 **RAG & Vector Grounding Pipeline**:\n\n- `services/ragEngine.service.ts` converts repository symbols into 1536-dimensional vector embeddings.\n- When a developer asks a question, cosine similarity finds the top-3 most relevant source files.\n- The files and the active architecture node context are assembled into a prompt fed to **Gemini 2.5 Flash**.\n- The response is streamed back with copyable code snippets and clickable `@Module` links.",
          timestamp,
          referencedNodes: ["rn-rag-node", "rn-ui-node"],
          suggestedActions: ["How does AST parsing work?", "Where are components structured?"]
        };
      }
    }

    // 2. Microservices Starter repository responses
    if (currentRepo.includes("Microservices Starter")) {
      if (q.includes("gateway") || q.includes("route") || q.includes("kong")) {
        return {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          text: "🌐 **API Gateway & Routing Architecture**:\n\n- **Kong Gateway (`api-gateway/kong.yml`)**: Acts as the reverse proxy entrypoint on port 8000.\n- **SSL & Rate Limiting**: Intercepts all traffic, enforces IP rate limits (100 req/min), and strips malicious headers.\n- **Service Dispatches**: Routes `/iam/*` to `user-service`, `/billing/*` to `billing-service`, and background triggers to RabbitMQ.",
          timestamp,
          referencedNodes: ["ms-gw-node", "ms-iam-node", "ms-bill-node"],
          suggestedActions: ["How does RabbitMQ handle async jobs?", "Where are Stripe webhooks processed?"]
        };
      }
      if (q.includes("queue") || q.includes("rabbit") || q.includes("async") || q.includes("worker")) {
        return {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          text: "⚡ **Asynchronous Event Processing (RabbitMQ)**:\n\n- When an invoice is created in `billing-service`, an `invoice.paid` event is published to the `events.topic` exchange in RabbitMQ.\n- `notification-worker/rabbitConsumer.ts` consumes the message off the queue and triggers SendGrid email delivery without blocking the user checkout request.",
          timestamp,
          referencedNodes: ["ms-bill-node", "ms-queue-node"],
          suggestedActions: ["How does the API Gateway route requests?", "Explain Keycloak multi-tenant auth"]
        };
      }
    }

    // 3. Demo E-Commerce System (Default)
    if (q.includes("login") || q.includes("auth") || q.includes("jwt") || q.includes("token")) {
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: "🔐 **Authentication Lifecycle (Step-by-Step)**:\n\n1. **Frontend**: Sends email & password from `frontend/components/Navbar.tsx`.\n2. **Backend Gateway**: Intercepts request and forwards authentication payload to `auth-service/login/login.controller.ts`.\n3. **Auth Validation**: `auth-service` validates user credentials against `database/users/user.model.ts`.\n4. **JWT Generation**: `auth-service/login/token.service.ts` signs a 7-day HMAC-SHA256 session token.\n5. **Protected Calls**: The token is returned to the Frontend and verified by `auth-service/middleware/authGuard.ts` on subsequent API calls.",
        timestamp,
        codeSnippet: {
          filename: "auth-service/login/token.service.ts",
          language: "typescript",
          code: `export const tokenService = {
  async generateToken(payload: TokenPayload): Promise<string> {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const body = Buffer.from(JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
    })).toString("base64url");
    const signature = Buffer.from(\`\${header}.\${body}.\${JWT_SECRET}\`).toString("base64url");
    return \`\${header}.\${body}.\${signature}\`;
  }
};`,
        },
        referencedNodes: ["frontend-node", "backend-node", "auth-node", "database-node"],
        suggestedActions: ["Explain RBAC permissions", "Inspect auth-service/login/token.service.ts", "How does order placement work?"]
      };
    }

    if (q.includes("order") || q.includes("checkout") || q.includes("cart") || q.includes("place")) {
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: "🛒 **Order Placement Flow (End-to-End)**:\n\n1. **User Action**: User submits cart in `frontend/pages/checkout.tsx`.\n2. **API Dispatch**: Next.js sends `POST /api/orders/create` with `Bearer <token>` to `backend/api/order.controller.ts`.\n3. **Auth Guard**: `auth-service/middleware/authGuard.ts` decodes token and extracts `userId`.\n4. **Payment Processing**: `backend/services/paymentGateway.ts` executes Stripe charge.\n5. **Database Persistence**: `backend/services/orderService.ts` writes order records to PostgreSQL `orders` table.",
        timestamp,
        codeSnippet: {
          filename: "backend/api/order.controller.ts",
          language: "typescript",
          code: `export const orderController = {
  async createOrder(req: { body: any; userId: string }) {
    const totalAmount = req.body.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const payment = await paymentGateway.charge({ amount: totalAmount, currency: "usd", userId: req.userId });
    const order = await orderService.saveOrder({ userId: req.userId, totalAmount, paymentId: payment.transactionId });
    return { success: true, orderId: order.id };
  }
};`,
        },
        referencedNodes: ["frontend-node", "backend-node", "auth-node", "database-node"],
        suggestedActions: ["Inspect backend/services/orderService.ts", "Show database schema for orders", "How does login work?"]
      };
    }

    if (q.includes("4 service") || q.includes("architecture") || q.includes("overview") || q.includes("explain")) {
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: "🏛️ **4-Service Architecture Breakdown**:\n\n- **Frontend (`frontend/`)**: Next.js 16 storefront managing product catalog grids, cart state, and checkout forms.\n- **Backend (`backend/`)**: Fastify REST API routing requests, executing order logic, and charging payment cards.\n- **Auth Service (`auth-service/`)**: Dedicated microservice for login validation, token signing, and role-based guards.\n- **Database (`database/`)**: PostgreSQL 16 relational store with Prisma ORM models and indexes for Users, Products, and Orders.",
        timestamp,
        referencedNodes: ["frontend-node", "backend-node", "auth-node", "database-node"],
        suggestedActions: ["How does login work?", "How does placing an order work?", "Which files should I read first?"]
      };
    }

    // Default response
    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      text: `🤖 **Analysis for**: "${query}"\n\nBased on the active repository **${currentRepo}** (${contextNode ? contextNode.data.label : "Entire Codebase"}):\n\n- All service boundaries and inter-process calls are mapped out on the Architecture canvas.\n- You can click any node on the graph to inspect its latency metrics, exposed endpoints, and source files.\n- Ask me to trace specific user lifecycles or explain subsystem implementations.`,
      timestamp,
      suggestedActions: quickPrompts.slice(0, 3)
    };
  };

  function generateDeepFileAnalysis(
    filePath: string,
    fileName: string,
    fileExt: string,
    codeSnippetText: string,
    currentRepo: string
  ): {
    text: string;
    codeSnippet?: { filename: string; language: string; code: string };
    referencedNodes?: string[];
    suggestedActions: string[];
  } {
    const p = filePath.toLowerCase();

    // 1. Jest Config
    if (p.includes("jest.config")) {
      return {
        text: `📄 **Analysis for \`${filePath}\`**:\n\n🎯 **Primary Purpose**: Configures the Jest automated test runner for TypeScript and JavaScript code across the repository.\n\n🧩 **Key Configurations & Features**:\n- **Node Environment (\`testEnvironment: "node"\`)**: Executes unit and integration tests inside a virtual Node.js context.\n- **SWC Transpiler (\`@swc/jest\`)**: Uses Rust-based SWC to transpile TypeScript and JSX in milliseconds without ts-node overhead.\n- **Path Aliasing (\`@/(.*)\`)**: Resolves module imports matching root directory path aliases.\n- **Coverage Thresholds**: Enforces a strict 85% branch, function, and line coverage bar for CI/CD pipelines.\n\n🔄 **Architectural Role**: Validates regression safety and unit functionality before changes are deployed across services.`,
        codeSnippet: {
          filename: filePath,
          language: "javascript",
          code: codeSnippetText || `module.exports = {
  testEnvironment: "node",
  transform: { "^.+\\\\.(ts|tsx)$": "@swc/jest" },
  coverageThreshold: { global: { lines: 85, functions: 85 } }
};`
        },
        referencedNodes: ["frontend-node", "backend-node"],
        suggestedActions: [
          "How do I run tests for this repository?",
          "Explain coverage thresholds",
          "Show mock configurations"
        ]
      };
    }

    // 2. Frontend Navbar
    if (p.includes("navbar")) {
      return {
        text: `📄 **Analysis for \`${filePath}\`**:\n\n🎯 **Primary Purpose**: Sticky top navigation component providing global branding, catalog links, search input, live cart badge, and user profile session trigger.\n\n🧩 **Key Functions & State**:\n- \`Navbar({ cartCount, userName, onOpenCart })\`: Renders header bar with responsive layout.\n- **Cart Count Badge**: Real-time numerical badge showing active items in the user's cart.\n- **User Menu Toggle**: Dropdown displaying account profile and logout triggers.\n\n📦 **Imports & Dependencies**:\n- \`lucide-react\`: Icon set (\`ShoppingCart\`, \`User\`, \`Search\`, \`Package\`).\n- \`next/link\`: Client-side routing between catalog, categories, and checkout.\n\n🔄 **Inter-Service Role**: Anchors the **Frontend** UI and dispatches user actions to the **Backend** and **Auth Service**.`,
        codeSnippet: {
          filename: filePath,
          language: "typescript",
          code: codeSnippetText || `export default function Navbar({ cartCount = 3, userName = "Alex Dev", onOpenCart }) {
  return (
    <nav className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
      <Link href="/">CloudStore</Link>
      <button onClick={onOpenCart}><ShoppingCart /> {cartCount}</button>
    </nav>
  );
}`
        },
        referencedNodes: ["frontend-node"],
        suggestedActions: [
          "Trace user login from Navbar",
          "Where is CartDrawer triggered?",
          "How is search connected to Backend API?"
        ]
      };
    }

    // 3. Backend Order Controller
    if (p.includes("order.controller") || p.includes("ordercontroller")) {
      return {
        text: `📄 **Analysis for \`${filePath}\`**:\n\n🎯 **Primary Purpose**: Fastify REST controller handling order lifecycle operations, payment verification via Stripe, and database transaction commits.\n\n🧩 **Key Endpoints & Handlers**:\n- \`POST /api/orders/create\` (\`createOrder\`): Validates cart items, verifies user session from JWT, charges card via \`paymentGateway\`, and records order in PostgreSQL.\n- \`GET /api/orders/:orderId\` (\`getOrderById\`): Fetches order summary and tracking details.\n\n📦 **Dependencies & Services**:\n- \`orderService\`: Database transaction manager.\n- \`paymentGateway\`: Stripe SDK payment charging client.\n- \`authGuard\`: Middleware extracting validated \`req.user\`.\n\n🔄 **Inter-Service Role**: Connects **Frontend** (\`checkout.tsx\`) to **Database** (\`schema.prisma\`) and third-party payment providers.`,
        codeSnippet: {
          filename: filePath,
          language: "typescript",
          code: codeSnippetText || `export const orderController = {
  async createOrder(req: FastifyRequest<{ Body: CreateOrderBody }>, reply: FastifyReply) {
    const payment = await paymentGateway.charge({ amount: totalAmount, userId: req.user.id });
    const order = await orderService.saveOrder({ userId: req.user.id, items, transactionId: payment.id });
    return reply.status(201).send({ success: true, orderId: order.id });
  }
};`
        },
        referencedNodes: ["backend-node", "database-node", "auth-node"],
        suggestedActions: [
          "How is payment refunded on failure?",
          "Show database schema for orders",
          "Inspect auth-service middleware"
        ]
      };
    }

    // 4. Auth Token Service
    if (p.includes("token.service") || p.includes("tokenservice")) {
      return {
        text: `📄 **Analysis for \`${filePath}\`**:\n\n🎯 **Primary Purpose**: Cryptographic token management module responsible for generating, signing, and validating HMAC-SHA256 JWT session tokens.\n\n🧩 **Key Exported Methods**:\n- \`generateToken(payload: TokenPayload)\`: Encodes header + payload and signs with \`JWT_SECRET\` with 7-day expiry.\n- \`verifyToken(token: string)\`: Validates signature integrity, decodes claims, and verifies expiration timestamps.\n\n📦 **Dependencies**:\n- Node.js built-in \`crypto\` module for constant-time HMAC hashing.\n\n🔄 **Inter-Service Role**: Used by \`login.controller.ts\` upon user authentication and verified by \`authGuard.ts\` across all protected microservice routes.`,
        codeSnippet: {
          filename: filePath,
          language: "typescript",
          code: codeSnippetText || `export const tokenService = {
  async generateToken(payload: TokenPayload): Promise<string> {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now()/1000 + 604800 })).toString("base64url");
    const signature = crypto.createHmac("sha256", JWT_SECRET).update(\`\${header}.\${body}\`).digest("base64url");
    return \`\${header}.\${body}.\${signature}\`;
  }
};`
        },
        referencedNodes: ["auth-node", "backend-node"],
        suggestedActions: [
          "Explain RBAC permissions matrix",
          "How does authGuard verify tokens?",
          "How to rotate JWT_SECRET?"
        ]
      };
    }

    // 5. Database Schema (Prisma / SQL)
    if (p.includes("schema.prisma") || p.includes("orders.sql") || p.includes("user.model")) {
      return {
        text: `📄 **Analysis for \`${filePath}\`**:\n\n🎯 **Primary Purpose**: Defines relational database models, entity relationships, constraints, and query indexes for PostgreSQL 16.\n\n🧩 **Key Entities & Relations**:\n- **User Model**: Encapsulates credentials, roles (\`customer\`, \`admin\`), and 1-to-many relationship with \`Order\`.\n- **Product Model**: Manages catalog items, decimal prices, and inventory stock counts.\n- **Order & OrderItem**: Encapsulates transaction records, statuses (\`PENDING\`, \`CONFIRMED\`), and foreign key cascade rules.\n\n🔄 **Inter-Service Role**: Provides type-safe persistence layer for **Backend** and **Auth Service** microservices.`,
        codeSnippet: {
          filename: filePath,
          language: fileExt === "sql" ? "sql" : "prisma",
          code: codeSnippetText || `model Order {
  id            String      @id @default(uuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  totalAmount   Decimal     @db.Decimal(10, 2)
  status        String      @default("PENDING")
  items         OrderItem[]
  createdAt     DateTime    @default(now())
}`
        },
        referencedNodes: ["database-node", "backend-node"],
        suggestedActions: [
          "Show migrations for this database",
          "How are transactions handled in orderService?",
          "Which indexes optimize search?"
        ]
      };
    }

    // 6. Protobuf / gRPC contracts
    if (p.endsWith(".proto")) {
      return {
        text: `📄 **Analysis for \`${filePath}\`**:\n\n🎯 **Primary Purpose**: Protocol Buffers schema defining gRPC service interfaces, RPC methods, and binary serialized message payloads across microservices.\n\n🧩 **Defined Services & RPCs**:\n- \`CartService\`: \`AddItem\`, \`GetCart\`, \`EmptyCart\` managing Redis session caches.\n- \`CheckoutService\`: \`PlaceOrder\` orchestrating payment and shipment dispatches.\n- \`ProductCatalogService\`: Fast catalog retrieval and search queries.\n\n🔄 **Inter-Service Role**: Universal language-agnostic contract shared between Go, C#, Python, and Node.js microservices.`,
        codeSnippet: {
          filename: filePath,
          language: "protobuf",
          code: codeSnippetText || `service CheckoutService {
  rpc PlaceOrder(PlaceOrderRequest) returns (PlaceOrderResponse) {}
}`
        },
        referencedNodes: ["service-node", "backend-node"],
        suggestedActions: [
          "Show implementation of PlaceOrder in Go",
          "How are protobuf messages compiled?",
          "Explain gRPC connection pooling"
        ]
      };
    }

    // 7. General source file breakdown
    const isComponent = fileExt === "tsx" || fileExt === "jsx";
    const isGo = fileExt === "go";
    const isPy = fileExt === "py";
    const isConfig = fileName.includes("config") || fileExt === "json" || fileExt === "yaml" || fileExt === "yml";

    return {
      text: `📄 **Analysis for \`${filePath}\`** (${currentRepo}):\n\n🎯 **Primary Purpose**: ${
        isComponent
          ? `React UI component responsible for rendering and user interaction in the ${fileName.replace(/\.[^.]+$/, "")} view.`
          : isGo
          ? `Go microservice module handling concurrent RPC/HTTP processing and core system logic.`
          : isPy
          ? `Python service handler processing incoming asynchronous tasks and data transformations.`
          : isConfig
          ? `System configuration defining build rules, package dependencies, and runtime parameters.`
          : `Core application module implementing logic and state management for ${fileName}.`
      }\n\n🧩 **Key Elements & Symbols**:\n- **Module Name**: \`${fileName}\`\n- **Runtime Language**: ${fileExt.toUpperCase() || "Code"}\n- **Scope**: Integrated into repository architecture graph.\n\n🔄 **Architectural Role**: Dispatches data and interacts with connected services across the **${currentRepo}** codebase.`,
      codeSnippet: {
        filename: filePath,
        language: fileExt || "typescript",
        code: codeSnippetText || `// Code implementation for ${filePath}\n// Module: ${fileName}`
      },
      referencedNodes: isComponent ? ["frontend-node"] : ["backend-node", "service-node"],
      suggestedActions: [
        `Explain how ${fileName} interacts with other modules`,
        `Where is ${fileName} called in the repository?`,
        "Show unit tests for this module"
      ]
    };
  }

  const shortRepoName = repoName.split("/").pop() || repoName;
  const contextLabel = activeContextNode
    ? activeContextNode.data.label
    : activeContextFile
    ? activeContextFile.split("/").pop() || activeContextFile
    : shortRepoName;

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 border-l border-zinc-800/80 select-none overflow-hidden font-sans">
      {/* Header */}
      <div className="px-3.5 py-2.5 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 flex-shrink-0 shadow-sm shadow-cyan-500/10">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs text-zinc-100 tracking-wide">Ask Repo AI</h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active</span>
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[180px] mt-0.5">
              Context: <span className="text-cyan-300 font-medium">{contextLabel}</span>
            </p>
          </div>
        </div>

        {/* Right Header: Model Badge & Reset */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 shadow-sm">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="font-semibold">IBM Bob AI</span>
          </div>
          <button
            onClick={() => setMessages([welcomeMessage || INITIAL_CHAT_MESSAGES[0]])}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors border border-transparent hover:border-zinc-700"
            title="Reset Chat Session"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-zinc-500 font-mono">
              {msg.sender === "user" ? (
                <>
                  <span>You</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span className="text-zinc-300 font-medium">RepoNavigator AI</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            <div
              className={`rounded-2xl p-3 max-w-[92%] leading-relaxed break-words ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-600/20"
                  : "bg-zinc-900/95 text-zinc-200 border border-zinc-800/90 rounded-tl-none shadow-md"
              }`}
            >
              <div className="whitespace-pre-line text-[11px] leading-relaxed">
                {msg.text}
              </div>

              {/* Referenced Node Links in Assistant Message */}
              {msg.referencedNodes && msg.referencedNodes.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500 font-mono">Related Modules:</span>
                  {msg.referencedNodes.map((nodeId) => (
                    <button
                      key={nodeId}
                      onClick={() => onSelectNode?.(nodeId)}
                      onMouseEnter={() => onHighlightNode?.(nodeId)}
                      onMouseLeave={() => onHighlightNode?.(null)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800/90 hover:bg-cyan-950/80 border border-zinc-700/80 hover:border-cyan-500/50 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>◈ {nodeId.replace("-node", "").toUpperCase()}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              )}

              {/* Code Snippet Card */}
              {msg.codeSnippet && (
                <div className="mt-2.5 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden font-mono text-[11px]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-[10px] text-zinc-400">
                    <span className="text-zinc-300 font-medium">
                      {msg.codeSnippet.filename || "snippet"}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(msg.codeSnippet!.code, msg.id)
                      }
                      className="flex items-center gap-1 hover:text-zinc-100 transition-colors px-1.5 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700"
                    >
                      {copiedCodeId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-zinc-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 overflow-x-auto text-cyan-300/90 text-[10px] leading-relaxed custom-scrollbar bg-[#0a0e14]">
                    <code>{msg.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Suggested Follow-up Actions */}
            {msg.suggestedActions && (
              <div className="flex flex-wrap gap-1.5 mt-2 px-1">
                {msg.suggestedActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(action)}
                    className="text-[10px] px-2.5 py-1 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-all flex items-center gap-1 shadow-sm active:scale-95"
                  >
                    <span>⚡</span>
                    <span>{action}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800/90 w-44 shadow-lg animate-in fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-[11px] text-cyan-300 font-mono animate-pulse">
              Analyzing AST & files...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="px-3 py-2 border-t border-zinc-800/60 bg-zinc-950/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
        <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 flex-shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
          Quick:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="flex-shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/90 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-all truncate max-w-[220px] shadow-sm active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar Container */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/95 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20 rounded-2xl transition-all shadow-inner"
        >
          <div className="pl-3 text-zinc-500 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={`Ask AI about ${shortRepoName} or code...`}
            className="w-full bg-transparent pl-2.5 pr-11 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isTyping}
            className={`absolute right-1.5 p-2 rounded-xl transition-all flex items-center justify-center ${
              inputPrompt.trim() && !isTyping
                ? "bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/30 scale-100 active:scale-95 cursor-pointer"
                : "text-zinc-600 bg-zinc-800/60 cursor-not-allowed scale-95 opacity-50"
            }`}
            title="Send Message (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-1.5 px-1 text-[9px] text-zinc-500 font-mono">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[8px] text-zinc-400">Enter ↵</kbd>
            <span>to ask AI</span>
          </span>
          <span className="text-cyan-400/80 font-medium">IBM Bob 2.0 • AST Grounded</span>
        </div>
      </div>
    </div>
  );
}
