import type { Node, Edge } from "@xyflow/react";

export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  path: string;
  extension?: string;
  size?: string;
  lines?: number;
  description?: string;
  language?: string;
  content?: string;
  connectedNodeId?: string;
  children?: FileNode[];
}

export interface ArchNodeData {
  label: string;
  category: 'frontend' | 'backend' | 'auth' | 'database' | 'service' | 'payment';
  subtitle: string;
  techStack: string[];
  status: 'healthy' | 'warning' | 'idle';
  latency?: string;
  throughput?: string;
  filesCount: number;
  description: string;
  endpoints?: string[];
  relatedFiles: string[];
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
  };
  referencedNodes?: string[];
  suggestedActions?: string[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  estimatedTime: string;
  category: string;
  description: string;
  commands?: string[];
  relatedFiles: string[];
  checklist: { id: string; text: string; completed: boolean }[];
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
  };
}

export interface RepositoryProfile {
  id: string;
  name: string;
  branch: string;
  version: string;
  badge: string;
  status: string;
  lastIndexed: string;
  totalFiles: number;
  totalLines: number;
  techStack: string[];
  description: string;
  fileTree: FileNode[];
  nodes: Node[];
  edges: Edge[];
  welcomeMessage: ChatMessage;
  quickPrompts: string[];
  onboardingSteps: OnboardingStep[];
}

// -------------------------------------------------------------
// 1. REPO: Demo E-Commerce System (4 Services)
// -------------------------------------------------------------
const ECOMMERCE_REPO: RepositoryProfile = {
  id: "demo-ecommerce",
  name: "Demo E-Commerce System",
  branch: "main",
  version: "v2.0.0",
  badge: "4 Services",
  status: "Repository Connected",
  lastIndexed: "Just now",
  totalFiles: 32,
  totalLines: 4850,
  techStack: ["Next.js 16", "React 19", "Fastify", "JWT", "Prisma", "PostgreSQL 16", "Stripe"],
  description: "Synthesized multi-service e-commerce store with storefront UI, Fastify backend, JWT auth, and PostgreSQL database.",
  fileTree: [
    {
      id: "frontend-dir",
      name: "frontend",
      type: "folder",
      path: "frontend",
      connectedNodeId: "frontend-node",
      children: [
        {
          id: "fe-components",
          name: "components",
          type: "folder",
          path: "frontend/components",
          connectedNodeId: "frontend-node",
          children: [
            { id: "fe-navbar", name: "Navbar.tsx", type: "file", extension: "tsx", path: "frontend/components/Navbar.tsx", size: "1.4 KB", lines: 36, language: "typescript", connectedNodeId: "frontend-node", description: "Top navigation with cart drawer trigger and user session badge." },
            { id: "fe-prod-card", name: "ProductCard.tsx", type: "file", extension: "tsx", path: "frontend/components/ProductCard.tsx", size: "1.2 KB", lines: 38, language: "typescript", connectedNodeId: "frontend-node", description: "Product item card with dynamic pricing and add-to-cart button." },
            { id: "fe-cart-drawer", name: "CartDrawer.tsx", type: "file", extension: "tsx", path: "frontend/components/CartDrawer.tsx", size: "1.9 KB", lines: 58, language: "typescript", connectedNodeId: "frontend-node", description: "Slide-over shopping cart calculating subtotal and taxes." }
          ]
        },
        {
          id: "fe-pages",
          name: "pages",
          type: "folder",
          path: "frontend/pages",
          connectedNodeId: "frontend-node",
          children: [
            { id: "fe-index", name: "index.tsx", type: "file", extension: "tsx", path: "frontend/pages/index.tsx", size: "2.3 KB", lines: 62, language: "typescript", connectedNodeId: "frontend-node", description: "Catalog storefront rendering product grids from Backend REST API." },
            { id: "fe-checkout", name: "checkout.tsx", type: "file", extension: "tsx", path: "frontend/pages/checkout.tsx", size: "2.1 KB", lines: 54, language: "typescript", connectedNodeId: "frontend-node", description: "Checkout form submitting order payloads with Authorization headers." },
            { id: "fe-profile", name: "profile.tsx", type: "file", extension: "tsx", path: "frontend/pages/profile.tsx", size: "1.8 KB", lines: 45, language: "typescript", connectedNodeId: "frontend-node", description: "User dashboard displaying order history retrieved from the Backend." }
          ]
        },
        { id: "fe-readme", name: "README.md", type: "file", extension: "md", path: "frontend/README.md", size: "0.8 KB", lines: 20, language: "markdown", connectedNodeId: "frontend-node", description: "Overview of frontend architecture and UI routing." }
      ]
    },
    {
      id: "backend-dir",
      name: "backend",
      type: "folder",
      path: "backend",
      connectedNodeId: "backend-node",
      children: [
        {
          id: "be-api",
          name: "api",
          type: "folder",
          path: "backend/api",
          connectedNodeId: "backend-node",
          children: [
            { id: "be-order-ctrl", name: "order.controller.ts", type: "file", extension: "ts", path: "backend/api/order.controller.ts", size: "1.6 KB", lines: 40, language: "typescript", connectedNodeId: "backend-node", description: "Orchestrates order creation, payment charging, and database insertion." },
            { id: "be-prod-ctrl", name: "product.controller.ts", type: "file", extension: "ts", path: "backend/api/product.controller.ts", size: "1.1 KB", lines: 28, language: "typescript", connectedNodeId: "backend-node", description: "Handles product catalog querying and category filtering." },
            { id: "be-routes", name: "routes.ts", type: "file", extension: "ts", path: "backend/api/routes.ts", size: "1.4 KB", lines: 32, language: "typescript", connectedNodeId: "backend-node", description: "Fastify route registrations mapping REST paths to controller handlers." }
          ]
        },
        {
          id: "be-services",
          name: "services",
          type: "folder",
          path: "backend/services",
          connectedNodeId: "backend-node",
          children: [
            { id: "be-order-svc", name: "orderService.ts", type: "file", extension: "ts", path: "backend/services/orderService.ts", size: "1.7 KB", lines: 42, language: "typescript", connectedNodeId: "backend-node", description: "Persists order records and reads historical invoices from Database." },
            { id: "be-prod-svc", name: "productService.ts", type: "file", extension: "ts", path: "backend/services/productService.ts", size: "1.5 KB", lines: 36, language: "typescript", connectedNodeId: "backend-node", description: "Retrieves product catalogs from PostgreSQL with caching." },
            { id: "be-pay-gw", name: "paymentGateway.ts", type: "file", extension: "ts", path: "backend/services/paymentGateway.ts", size: "1.2 KB", lines: 26, language: "typescript", connectedNodeId: "backend-node", description: "Stripe SDK client charging credit cards and verifying transaction IDs." }
          ]
        },
        { id: "be-readme", name: "README.md", type: "file", extension: "md", path: "backend/README.md", size: "0.9 KB", lines: 24, language: "markdown", connectedNodeId: "backend-node", description: "Documentation for Backend Gateway, endpoint contracts, and services." }
      ]
    },
    {
      id: "auth-dir",
      name: "auth-service",
      type: "folder",
      path: "auth-service",
      connectedNodeId: "auth-node",
      children: [
        {
          id: "auth-login",
          name: "login",
          type: "folder",
          path: "auth-service/login",
          connectedNodeId: "auth-node",
          children: [
            { id: "auth-login-ctrl", name: "login.controller.ts", type: "file", extension: "ts", path: "auth-service/login/login.controller.ts", size: "1.5 KB", lines: 35, language: "typescript", connectedNodeId: "auth-node", description: "Validates user credentials against Database and responds with JWT." },
            { id: "auth-token-svc", name: "token.service.ts", type: "file", extension: "ts", path: "auth-service/login/token.service.ts", size: "1.8 KB", lines: 44, language: "typescript", connectedNodeId: "auth-node", description: "Generates and verifies cryptographic HMAC-SHA256 JWT tokens." }
          ]
        },
        {
          id: "auth-middleware",
          name: "middleware",
          type: "folder",
          path: "auth-service/middleware",
          connectedNodeId: "auth-node",
          children: [
            { id: "auth-guard", name: "authGuard.ts", type: "file", extension: "ts", path: "auth-service/middleware/authGuard.ts", size: "1.2 KB", lines: 28, language: "typescript", connectedNodeId: "auth-node", description: "Middleware verifying Bearer tokens on protected routes." },
            { id: "auth-rbac", name: "rbac.ts", type: "file", extension: "ts", path: "auth-service/middleware/rbac.ts", size: "1.1 KB", lines: 22, language: "typescript", connectedNodeId: "auth-node", description: "Role-Based Access Control matrix for Admin, Editor, and Customer roles." }
          ]
        },
        { id: "auth-readme", name: "README.md", type: "file", extension: "md", path: "auth-service/README.md", size: "0.8 KB", lines: 22, language: "markdown", connectedNodeId: "auth-node", description: "Authentication and session security architecture guide." }
      ]
    },
    {
      id: "database-dir",
      name: "database",
      type: "folder",
      path: "database",
      connectedNodeId: "database-node",
      children: [
        {
          id: "db-users",
          name: "users",
          type: "folder",
          path: "database/users",
          connectedNodeId: "database-node",
          children: [
            { id: "db-user-model", name: "user.model.ts", type: "file", extension: "ts", path: "database/users/user.model.ts", size: "1.6 KB", lines: 42, language: "typescript", connectedNodeId: "database-node", description: "User entity model and repository queries for User records." }
          ]
        },
        {
          id: "db-schemas",
          name: "schemas",
          type: "folder",
          path: "database/schemas",
          connectedNodeId: "database-node",
          children: [
            { id: "db-prisma", name: "schema.prisma", type: "file", extension: "prisma", path: "database/schemas/schema.prisma", size: "2.4 KB", lines: 65, language: "prisma", connectedNodeId: "database-node", description: "Prisma schema defining User, Product, Order, and OrderItem models." },
            { id: "db-orders-sql", name: "orders.sql", type: "file", extension: "sql", path: "database/schemas/orders.sql", size: "1.8 KB", lines: 48, language: "sql", connectedNodeId: "database-node", description: "PostgreSQL DDL tables, foreign keys, and performance indexing scripts." }
          ]
        },
        { id: "db-readme", name: "README.md", type: "file", extension: "md", path: "database/README.md", size: "0.9 KB", lines: 26, language: "markdown", connectedNodeId: "database-node", description: "Relational database schema, entity relationships, and migrations." }
      ]
    }
  ],
  nodes: [
    {
      id: "frontend-node",
      type: "customArch",
      position: { x: 260, y: 30 },
      data: {
        label: "FRONTEND",
        category: "frontend" as const,
        subtitle: "Next.js Storefront & UI",
        techStack: ["Next.js 16", "React 19", "Tailwind CSS"],
        status: "healthy" as const,
        latency: "12ms",
        throughput: "3.2k req/m",
        filesCount: 6,
        description: "Customer storefront handling product catalog browsing, cart drawers, checkout forms, and user profiles.",
        endpoints: ["GET /", "GET /checkout", "GET /profile"],
        relatedFiles: ["frontend/components/Navbar.tsx", "frontend/components/ProductCard.tsx", "frontend/components/CartDrawer.tsx", "frontend/pages/index.tsx", "frontend/pages/checkout.tsx", "frontend/pages/profile.tsx"],
        icon: "LayoutTemplate"
      }
    },
    {
      id: "backend-node",
      type: "customArch",
      position: { x: 260, y: 220 },
      data: {
        label: "BACKEND",
        category: "backend" as const,
        subtitle: "REST API & Business Logic",
        techStack: ["Fastify", "Node.js", "TypeScript", "Stripe SDK"],
        status: "healthy" as const,
        latency: "8ms",
        throughput: "4.8k req/m",
        filesCount: 6,
        description: "Central REST Gateway that processes incoming orders, calculates totals, charges payment, and queries the database.",
        endpoints: ["GET /api/products", "GET /api/products/:id", "POST /api/orders/create", "GET /api/orders/:id"],
        relatedFiles: ["backend/api/order.controller.ts", "backend/api/product.controller.ts", "backend/api/routes.ts", "backend/services/orderService.ts", "backend/services/productService.ts", "backend/services/paymentGateway.ts"],
        icon: "Server"
      }
    },
    {
      id: "auth-node",
      type: "customArch",
      position: { x: 70, y: 410 },
      data: {
        label: "AUTH SERVICE",
        category: "auth" as const,
        subtitle: "JWT & User Authentication",
        techStack: ["Jose JWT", "HMAC-SHA256", "RBAC"],
        status: "healthy" as const,
        latency: "15ms",
        throughput: "1.1k req/m",
        filesCount: 4,
        description: "Validates user login credentials, issues cryptographic 7-day JWT tokens, and guards protected API routes.",
        endpoints: ["POST /api/auth/login", "POST /api/auth/verify", "GET /api/auth/session"],
        relatedFiles: ["auth-service/login/login.controller.ts", "auth-service/login/token.service.ts", "auth-service/middleware/authGuard.ts", "auth-service/middleware/rbac.ts"],
        icon: "ShieldCheck"
      }
    },
    {
      id: "database-node",
      type: "customArch",
      position: { x: 450, y: 410 },
      data: {
        label: "DATABASE",
        category: "database" as const,
        subtitle: "PostgreSQL 16 & Prisma ORM",
        techStack: ["PostgreSQL 16", "Prisma ORM", "SQL DDL"],
        status: "healthy" as const,
        latency: "3ms",
        throughput: "8.5k qps",
        filesCount: 3,
        description: "Stores relational tables for users, products, orders, and order_items with foreign key constraints and indexes.",
        endpoints: ["TCP 5432 (PostgreSQL Pool)"],
        relatedFiles: ["database/users/user.model.ts", "database/schemas/schema.prisma", "database/schemas/orders.sql"],
        icon: "Database"
      }
    }
  ],
  edges: [
    { id: "e-frontend-backend", source: "frontend-node", target: "backend-node", animated: true, label: "API Requests", style: { stroke: "#38bdf8", strokeWidth: 2.5 } },
    { id: "e-backend-auth", source: "backend-node", target: "auth-node", animated: true, label: "Verify Token / Login", style: { stroke: "#c084fc", strokeWidth: 2 } },
    { id: "e-backend-database", source: "backend-node", target: "database-node", animated: true, label: "Query Orders & Products", style: { stroke: "#34d399", strokeWidth: 2 } },
    { id: "e-auth-database", source: "auth-node", target: "database-node", animated: false, label: "Validate User Credentials", style: { stroke: "#fbbf24", strokeWidth: 2 } }
  ],
  welcomeMessage: {
    id: "msg-welcome-ecom",
    sender: "assistant",
    text: "🤖 **RepoNavigator AI Analysis Ready**\n\nThis repository follows a **4-Service E-Commerce Architecture**:\n\n1. **Frontend (`frontend/`)** → Next.js 16 storefront, product catalog, and cart.\n2. **Backend (`backend/`)** → Fastify REST API, order processing, and Stripe payments.\n3. **Auth Service (`auth-service/`)** → User login validation and JWT session signing.\n4. **Database (`database/`)** → Relational PostgreSQL 16 schema with Prisma ORM.\n\n*Click any node in the map to inspect its files, or select a question below:*",
    timestamp: "12:00 PM",
    suggestedActions: [
      "How does login work?",
      "How does placing an order work?",
      "Explain the 4 services",
      "Where is the database configured?"
    ]
  },
  quickPrompts: [
    "How does login work?",
    "How does placing an order work?",
    "Explain the 4 services",
    "Which files should I read first?",
  ],
  onboardingSteps: [
    {
      id: "step-1",
      title: "1. Clone & Configure Environment",
      estimatedTime: "3 mins",
      category: "Setup",
      description: "Set up local configuration files for PostgreSQL database connection, JWT secret keys, and Stripe test API tokens.",
      commands: ["git clone https://github.com/org/ecommerce-platform.git", "cd ecommerce-platform", "cp .env.example .env.local", "npm install"],
      relatedFiles: ["frontend/README.md", "backend/README.md"],
      checklist: [
        { id: "c1", text: "Clone repository into local workspace", completed: true },
        { id: "c2", text: "Configure DATABASE_URL and AUTH_SECRET in .env.local", completed: false },
        { id: "c3", text: "Run `npm install` for dependencies", completed: true }
      ],
      codeSnippet: {
        filename: ".env.local",
        language: "bash",
        code: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db"\nAUTH_SECRET="dev_super_secret_jwt_key_32_bytes"\nSTRIPE_SECRET_KEY="sk_test_51Mz..."\nNEXT_PUBLIC_API_URL="http://localhost:8080/api"`
      }
    },
    {
      id: "step-2",
      title: "2. Database Schema & Seed Data",
      estimatedTime: "2 mins",
      category: "Database",
      description: "Apply PostgreSQL DDL tables from `database/schemas/orders.sql` and run Prisma migrations to generate models.",
      commands: ["npx prisma db push --schema=database/schemas/schema.prisma", "npm run seed:products"],
      relatedFiles: ["database/schemas/schema.prisma", "database/schemas/orders.sql"],
      checklist: [
        { id: "c4", text: "Run PostgreSQL 16 container via Docker", completed: false },
        { id: "c5", text: "Execute schema migrations for Users, Products & Orders", completed: false },
        { id: "c6", text: "Verify test hardware products populated in catalog", completed: false }
      ]
    },
    {
      id: "step-3",
      title: "3. Run Microservices & UI Cockpit",
      estimatedTime: "2 mins",
      category: "Execution",
      description: "Launch the Frontend storefront and Backend Fastify gateway concurrently in watch mode.",
      commands: ["npm run dev"],
      relatedFiles: ["frontend/pages/index.tsx", "backend/api/routes.ts"],
      checklist: [
        { id: "c7", text: "Open http://localhost:3000 to view storefront", completed: false },
        { id: "c8", text: "Verify REST API responding on http://localhost:8080/api/products", completed: false }
      ]
    },
    {
      id: "step-4",
      title: "4. Architecture Overview & First PR Checklist",
      estimatedTime: "5 mins",
      category: "Architecture",
      description: "Review service boundaries between Frontend, Backend, Auth, and Database before submitting code.",
      relatedFiles: ["backend/api/order.controller.ts", "auth-service/middleware/authGuard.ts"],
      checklist: [
        { id: "c9", text: "Inspect interactive Architecture Map in RepoNavigator", completed: false },
        { id: "c10", text: "Verify new endpoints protected with `authGuard` middleware", completed: false },
        { id: "c11", text: "Run lint and unit tests before creating Pull Request", completed: false }
      ]
    }
  ]
};

// -------------------------------------------------------------
// 2. REPO: RepoNavigator Core (AI Platform & AST Engine)
// -------------------------------------------------------------
const REPONAVIGATOR_CORE_REPO: RepositoryProfile = {
  id: "reponavigator-core",
  name: "RepoNavigator Core",
  branch: "production",
  version: "v1.4.5",
  badge: "Next.js 16",
  status: "Repository Connected",
  lastIndexed: "1 min ago",
  totalFiles: 44,
  totalLines: 8920,
  techStack: ["Next.js 16", "React 19", "@xyflow/react", "TypeScript", "Tailwind CSS", "Tree-sitter", "Gemini 2.5", "Redis"],
  description: "Core AI Developer Onboarding Cockpit featuring AST parsing, React Flow visualization, and RAG pair-programming assistant.",
  fileTree: [
    {
      id: "rn-app",
      name: "app",
      type: "folder",
      path: "app",
      connectedNodeId: "rn-ui-node",
      children: [
        {
          id: "rn-components",
          name: "components",
          type: "folder",
          path: "app/components",
          connectedNodeId: "rn-ui-node",
          children: [
            { id: "rn-arch-map", name: "ArchitectureMap.tsx", type: "file", extension: "tsx", path: "app/components/ArchitectureMap.tsx", size: "8.4 KB", lines: 240, language: "typescript", connectedNodeId: "rn-ui-node", description: "Interactive React Flow canvas with live animated traffic and auto-fit controls." },
            { id: "rn-chat", name: "AIChatPanel.tsx", type: "file", extension: "tsx", path: "app/components/AIChatPanel.tsx", size: "18.2 KB", lines: 420, language: "typescript", connectedNodeId: "rn-rag-node", description: "Conversational code assistant grounded in AST topology." },
            { id: "rn-explorer", name: "RepositoryExplorer.tsx", type: "file", extension: "tsx", path: "app/components/RepositoryExplorer.tsx", size: "9.8 KB", lines: 280, language: "typescript", connectedNodeId: "rn-ui-node", description: "Collapsible searchable repository file explorer tree." },
            { id: "rn-drawer", name: "NodeDetailDrawer.tsx", type: "file", extension: "tsx", path: "app/components/NodeDetailDrawer.tsx", size: "7.1 KB", lines: 190, language: "typescript", connectedNodeId: "rn-ui-node", description: "Subsystem inspection drawer displaying telemetry and files." }
          ]
        },
        {
          id: "rn-api",
          name: "api",
          type: "folder",
          path: "app/api",
          connectedNodeId: "rn-parser-node",
          children: [
            { id: "rn-api-ast", name: "ast-parser/route.ts", type: "file", extension: "ts", path: "app/api/ast-parser/route.ts", size: "4.2 KB", lines: 110, language: "typescript", connectedNodeId: "rn-parser-node", description: "Tree-sitter AST extraction route analyzing imports and exports." },
            { id: "rn-api-chat", name: "chat/route.ts", type: "file", extension: "ts", path: "app/api/chat/route.ts", size: "3.5 KB", lines: 95, language: "typescript", connectedNodeId: "rn-rag-node", description: "Streaming AI route with RAG prompt assembly." }
          ]
        },
        { id: "rn-page", name: "page.tsx", type: "file", extension: "tsx", path: "app/page.tsx", size: "0.8 KB", lines: 12, language: "typescript", connectedNodeId: "rn-ui-node", description: "Main entry page rendering RepoNavigatorApp." },
        { id: "rn-globals", name: "globals.css", type: "file", extension: "css", path: "app/globals.css", size: "1.5 KB", lines: 60, language: "css", connectedNodeId: "rn-ui-node", description: "Tailwind v4 tokens, custom scrollbars, and dark theme." }
      ]
    },
    {
      id: "rn-services",
      name: "services",
      type: "folder",
      path: "services",
      connectedNodeId: "rn-ingest-node",
      children: [
        { id: "rn-svc-indexer", name: "indexer.service.ts", type: "file", extension: "ts", path: "services/indexer.service.ts", size: "5.1 KB", lines: 145, language: "typescript", connectedNodeId: "rn-ingest-node", description: "Clones remote Git repositories and extracts file manifests." },
        { id: "rn-svc-rag", name: "ragEngine.service.ts", type: "file", extension: "ts", path: "services/ragEngine.service.ts", size: "6.2 KB", lines: 180, language: "typescript", connectedNodeId: "rn-rag-node", description: "Generates vector embeddings and matches queries with cosine similarity." }
      ]
    },
    {
      id: "rn-docs",
      name: "docs",
      type: "folder",
      path: "docs",
      children: [
        { id: "rn-doc-prd", name: "PRD.md", type: "file", extension: "md", path: "docs/PRD.md", size: "5.2 KB", lines: 160, language: "markdown", description: "Product Requirements Document for RepoNavigator AI." },
        { id: "rn-doc-plan", name: "DEVELOPMENT_PLAN.md", type: "file", extension: "md", path: "docs/DEVELOPMENT_PLAN.md", size: "6.8 KB", lines: 210, language: "markdown", description: "7-phase step-by-step roadmap." },
        { id: "rn-doc-demo", name: "DEMO_SCRIPT.md", type: "file", extension: "md", path: "docs/DEMO_SCRIPT.md", size: "4.5 KB", lines: 130, language: "markdown", description: "2.5-minute timed hackathon demo script." }
      ]
    }
  ],
  nodes: [
    {
      id: "rn-ui-node",
      type: "customArch",
      position: { x: 260, y: 30 },
      data: {
        label: "UI COCKPIT",
        category: "frontend" as const,
        subtitle: "Next.js 16 + React Flow",
        techStack: ["Next.js 16", "React 19", "@xyflow/react", "Framer Motion"],
        status: "healthy" as const,
        latency: "10ms",
        throughput: "5.2k req/m",
        filesCount: 12,
        description: "Interactive visual cockpit with real-time graph rendering, file explorer, and AI copilot.",
        endpoints: ["GET /", "GET /api/health"],
        relatedFiles: ["app/components/ArchitectureMap.tsx", "app/components/RepositoryExplorer.tsx", "app/components/RepoNavigatorApp.tsx"],
        icon: "LayoutTemplate"
      }
    },
    {
      id: "rn-parser-node",
      type: "customArch",
      position: { x: 80, y: 220 },
      data: {
        label: "AST PARSER ENGINE",
        category: "service" as const,
        subtitle: "Tree-Sitter Static Analysis",
        techStack: ["Tree-Sitter", "TypeScript Compiler API", "Zod"],
        status: "healthy" as const,
        latency: "45ms",
        throughput: "850 req/m",
        filesCount: 5,
        description: "Inspects source files, builds import/export trees, and infers cross-service communication links.",
        endpoints: ["POST /api/ast-parser"],
        relatedFiles: ["app/api/ast-parser/route.ts", "services/indexer.service.ts"],
        icon: "Sparkles"
      }
    },
    {
      id: "rn-rag-node",
      type: "customArch",
      position: { x: 440, y: 220 },
      data: {
        label: "RAG & EMBEDDINGS",
        category: "service" as const,
        subtitle: "Gemini 2.5 + Vector DB",
        techStack: ["Gemini 2.5 Flash", "pgvector", "LangChain"],
        status: "healthy" as const,
        latency: "140ms",
        throughput: "420 req/m",
        filesCount: 6,
        description: "Transforms codebase symbols into vector embeddings to ground AI answers with verified file snippets.",
        endpoints: ["POST /api/chat", "POST /services/embed"],
        relatedFiles: ["app/components/AIChatPanel.tsx", "services/ragEngine.service.ts"],
        icon: "Sparkles"
      }
    },
    {
      id: "rn-ingest-node",
      type: "customArch",
      position: { x: 260, y: 410 },
      data: {
        label: "INGESTION & CACHE",
        category: "database" as const,
        subtitle: "Git Cloner & Upstash Redis",
        techStack: ["Git Subprocess", "Redis Cache", "SQLite"],
        status: "healthy" as const,
        latency: "6ms",
        throughput: "9.2k qps",
        filesCount: 4,
        description: "Clones target GitHub repositories, caches AST graphs, and maintains ephemeral user session state.",
        endpoints: ["TCP 6379 (Redis AST Cache)"],
        relatedFiles: ["services/indexer.service.ts", "app/data/repoData.ts"],
        icon: "Database"
      }
    }
  ],
  edges: [
    { id: "e-rn-ui-parser", source: "rn-ui-node", target: "rn-parser-node", animated: true, label: "AST Parse Request", style: { stroke: "#38bdf8", strokeWidth: 2 } },
    { id: "e-rn-ui-rag", source: "rn-ui-node", target: "rn-rag-node", animated: true, label: "Stream Q&A", style: { stroke: "#c084fc", strokeWidth: 2 } },
    { id: "e-rn-parser-ingest", source: "rn-parser-node", target: "rn-ingest-node", animated: true, label: "Cache Graph", style: { stroke: "#34d399", strokeWidth: 2 } },
    { id: "e-rn-rag-ingest", source: "rn-rag-node", target: "rn-ingest-node", animated: false, label: "Vector Index Lookup", style: { stroke: "#fbbf24", strokeWidth: 2 } }
  ],
  welcomeMessage: {
    id: "msg-welcome-rn",
    sender: "assistant",
    text: "◈ **RepoNavigator Core Platform Active**\n\nYou are viewing the internal architecture of **RepoNavigator AI** itself:\n\n- **UI Cockpit (`app/components/`)** → Next.js 16 + React Flow visual workspace.\n- **AST Parser Engine (`app/api/ast-parser/`)** → Extracts imports and service topologies.\n- **RAG & Embeddings (`services/ragEngine.service.ts`)** → Grounded code pair-programmer.\n- **Ingestion & Cache (`services/indexer.service.ts`)** → Git cloner & Redis graph caching.",
    timestamp: "12:00 PM",
    suggestedActions: [
      "How does the AST Parser generate the graph?",
      "How does RAG pair programming work?",
      "Explain the React Flow integration",
      "Show all documentation files"
    ]
  },
  quickPrompts: [
    "How does AST parsing work?",
    "How does RAG ground code questions?",
    "Explain the React Flow integration",
    "Where are components structured?",
  ],
  onboardingSteps: [
    {
      id: "rn-s1",
      title: "1. Install Dependencies & Build System",
      estimatedTime: "2 mins",
      category: "Setup",
      description: "Install React 19, @xyflow/react, Lucide icons, and Framer Motion.",
      commands: ["npm install", "npm run dev"],
      relatedFiles: ["package.json", "app/page.tsx"],
      checklist: [
        { id: "r1", text: "Verify Node.js 18.18+ or 20+ installed", completed: true },
        { id: "r2", text: "Run `npm install` for dependencies", completed: true },
        { id: "r3", text: "Start dev server with `npm run dev`", completed: true }
      ]
    },
    {
      id: "rn-s2",
      title: "2. Explore React Flow Architecture Canvas",
      estimatedTime: "3 mins",
      category: "Visualization",
      description: "Review custom node handles, animated traffic styles, and minimap integration.",
      relatedFiles: ["app/components/ArchitectureMap.tsx", "app/components/CustomNode.tsx"],
      checklist: [
        { id: "r4", text: "Test dragging nodes on canvas", completed: false },
        { id: "r5", text: "Test Layout presets (Top-Down, Horizontal, Grid)", completed: false }
      ]
    }
  ]
};

// -------------------------------------------------------------
// 3. REPO: Microservices Starter (SaaS Cloud Architecture)
// -------------------------------------------------------------
const MICROSERVICES_STARTER_REPO: RepositoryProfile = {
  id: "microservices-starter",
  name: "Microservices Starter",
  branch: "develop",
  version: "v3.1.0",
  badge: "Fastify",
  status: "Repository Connected",
  lastIndexed: "5 mins ago",
  totalFiles: 52,
  totalLines: 11400,
  techStack: ["Kong Gateway", "Keycloak IAM", "Node.js", "RabbitMQ", "ClickHouse", "Stripe", "Docker"],
  description: "Enterprise SaaS microservices blueprint with API gateway proxying, message queues, and distributed telemetry.",
  fileTree: [
    {
      id: "ms-gateway",
      name: "api-gateway",
      type: "folder",
      path: "api-gateway",
      connectedNodeId: "ms-gw-node",
      children: [
        { id: "ms-gw-conf", name: "kong.yml", type: "file", extension: "yml", path: "api-gateway/kong.yml", size: "3.4 KB", lines: 80, language: "yaml", connectedNodeId: "ms-gw-node", description: "Kong Gateway routing rules and rate limiting plugins." },
        { id: "ms-gw-proxy", name: "reverseProxy.ts", type: "file", extension: "ts", path: "api-gateway/reverseProxy.ts", size: "2.8 KB", lines: 75, language: "typescript", connectedNodeId: "ms-gw-node", description: "Fastify proxy forwarding client traffic to microservices." }
      ]
    },
    {
      id: "ms-user-svc",
      name: "user-service",
      type: "folder",
      path: "user-service",
      connectedNodeId: "ms-iam-node",
      children: [
        { id: "ms-user-ctrl", name: "user.controller.ts", type: "file", extension: "ts", path: "user-service/user.controller.ts", size: "3.1 KB", lines: 85, language: "typescript", connectedNodeId: "ms-iam-node", description: "Keycloak SSO federation and tenant membership management." },
        { id: "ms-user-model", name: "user.entity.ts", type: "file", extension: "ts", path: "user-service/user.entity.ts", size: "2.2 KB", lines: 60, language: "typescript", connectedNodeId: "ms-iam-node", description: "Tenant user models with multi-organization scopes." }
      ]
    },
    {
      id: "ms-billing-svc",
      name: "billing-service",
      type: "folder",
      path: "billing-service",
      connectedNodeId: "ms-bill-node",
      children: [
        { id: "ms-bill-sub", name: "subscription.service.ts", type: "file", extension: "ts", path: "billing-service/subscription.service.ts", size: "4.2 KB", lines: 110, language: "typescript", connectedNodeId: "ms-bill-node", description: "Stripe subscription webhooks and metered usage billing." },
        { id: "ms-bill-inv", name: "invoiceGenerator.ts", type: "file", extension: "ts", path: "billing-service/invoiceGenerator.ts", size: "3.0 KB", lines: 80, language: "typescript", connectedNodeId: "ms-bill-node", description: "Generates PDF receipts and VAT compliance records." }
      ]
    },
    {
      id: "ms-notif-svc",
      name: "notification-worker",
      type: "folder",
      path: "notification-worker",
      connectedNodeId: "ms-queue-node",
      children: [
        { id: "ms-queue-consumer", name: "rabbitConsumer.ts", type: "file", extension: "ts", path: "notification-worker/rabbitConsumer.ts", size: "2.6 KB", lines: 70, language: "typescript", connectedNodeId: "ms-queue-node", description: "Consumes async events from RabbitMQ and dispatches emails." }
      ]
    }
  ],
  nodes: [
    {
      id: "ms-gw-node",
      type: "customArch",
      position: { x: 260, y: 30 },
      data: {
        label: "API GATEWAY",
        category: "backend" as const,
        subtitle: "Kong / Fastify Proxy",
        techStack: ["Kong", "Fastify", "Reverse Proxy"],
        status: "healthy" as const,
        latency: "5ms",
        throughput: "12.4k req/m",
        filesCount: 6,
        description: "Entry proxy managing SSL termination, rate limiting, and request routing to microservices.",
        endpoints: ["ALL /api/*"],
        relatedFiles: ["api-gateway/kong.yml", "api-gateway/reverseProxy.ts"],
        icon: "Server"
      }
    },
    {
      id: "ms-iam-node",
      type: "customArch",
      position: { x: 60, y: 220 },
      data: {
        label: "IAM & USER SERVICE",
        category: "auth" as const,
        subtitle: "Keycloak SSO & Multi-Tenant",
        techStack: ["Keycloak", "OAuth2", "Postgres"],
        status: "healthy" as const,
        latency: "18ms",
        throughput: "2.1k req/m",
        filesCount: 5,
        description: "Federated single sign-on, organization tenant management, and user permissions.",
        endpoints: ["POST /iam/token", "GET /iam/tenants"],
        relatedFiles: ["user-service/user.controller.ts", "user-service/user.entity.ts"],
        icon: "ShieldCheck"
      }
    },
    {
      id: "ms-bill-node",
      type: "customArch",
      position: { x: 450, y: 220 },
      data: {
        label: "BILLING & INVOICING",
        category: "payment" as const,
        subtitle: "Stripe Metered Usage",
        techStack: ["Stripe Webhooks", "PDFKit"],
        status: "healthy" as const,
        latency: "30ms",
        throughput: "450 req/m",
        filesCount: 6,
        description: "Manages subscription tier upgrades, seats licensing, and automated monthly invoice generation.",
        endpoints: ["POST /billing/webhook", "GET /billing/invoices"],
        relatedFiles: ["billing-service/subscription.service.ts", "billing-service/invoiceGenerator.ts"],
        icon: "CreditCard"
      }
    },
    {
      id: "ms-queue-node",
      type: "customArch",
      position: { x: 260, y: 410 },
      data: {
        label: "ASYNC QUEUE & WORKERS",
        category: "service" as const,
        subtitle: "RabbitMQ Event Broker",
        techStack: ["RabbitMQ", "SendGrid", "AMQP"],
        status: "healthy" as const,
        latency: "2ms",
        throughput: "18.5k msg/m",
        filesCount: 4,
        description: "Decoupled asynchronous message broker executing background email notifications and webhooks.",
        endpoints: ["AMQP 5672 (RabbitMQ Broker)"],
        relatedFiles: ["notification-worker/rabbitConsumer.ts"],
        icon: "Sparkles"
      }
    }
  ],
  edges: [
    { id: "e-ms-gw-iam", source: "ms-gw-node", target: "ms-iam-node", animated: true, label: "Auth Proxy", style: { stroke: "#c084fc", strokeWidth: 2 } },
    { id: "e-ms-gw-bill", source: "ms-gw-node", target: "ms-bill-node", animated: true, label: "Billing API", style: { stroke: "#ec4899", strokeWidth: 2 } },
    { id: "e-ms-iam-queue", source: "ms-iam-node", target: "ms-queue-node", animated: true, label: "User Created Event", style: { stroke: "#fbbf24", strokeWidth: 2 } },
    { id: "e-ms-bill-queue", source: "ms-bill-node", target: "ms-queue-node", animated: true, label: "Invoice Paid Event", style: { stroke: "#fbbf24", strokeWidth: 2 } }
  ],
  welcomeMessage: {
    id: "msg-welcome-ms",
    sender: "assistant",
    text: "⚡ **Microservices Starter Blueprint Loaded**\n\nThis architecture demonstrates a decoupled enterprise SaaS system:\n\n- **API Gateway (`api-gateway/`)** → Kong reverse proxy.\n- **IAM Service (`user-service/`)** → Keycloak SSO & multi-tenant auth.\n- **Billing Engine (`billing-service/`)** → Stripe metered subscriptions.\n- **Async Queue (`notification-worker/`)** → RabbitMQ AMQP message bus.",
    timestamp: "12:00 PM",
    suggestedActions: [
      "How are asynchronous events processed?",
      "How does Kong gateway route traffic?",
      "Explain the Stripe billing webhook handler",
      "Show RabbitMQ consumer code"
    ]
  },
  quickPrompts: [
    "How does the API Gateway route requests?",
    "How does RabbitMQ handle async jobs?",
    "Where are Stripe webhooks processed?",
    "Explain Keycloak multi-tenant auth",
  ],
  onboardingSteps: [
    {
      id: "ms-s1",
      title: "1. Docker Compose Services Spin-up",
      estimatedTime: "5 mins",
      category: "Infrastructure",
      description: "Launch Kong Gateway, RabbitMQ, PostgreSQL, and Keycloak containers with Docker.",
      commands: ["docker-compose up -d", "docker ps"],
      relatedFiles: ["api-gateway/kong.yml"],
      checklist: [
        { id: "m1", text: "Start all containers via Docker Compose", completed: false },
        { id: "m2", text: "Verify RabbitMQ Management UI on port 15672", completed: false }
      ]
    }
  ]
};

// -------------------------------------------------------------
// 4. REPO: Google Cloud Platform Microservices Demo (Online Boutique)
// -------------------------------------------------------------
const GCP_MICROSERVICES_DEMO_REPO: RepositoryProfile = {
  id: "gcp-microservices-demo",
  name: "GoogleCloudPlatform/microservices-demo",
  branch: "main",
  version: "v0.10.7",
  badge: "10 Microservices",
  status: "Repository Connected",
  lastIndexed: "Just now",
  totalFiles: 86,
  totalLines: 24800,
  techStack: ["Go", "C# .NET", "Node.js", "Python", "Java", "Kubernetes", "gRPC", "Istio", "Terraform", "Redis"],
  description: "Sample cloud-first application with 10 microservices showcasing Kubernetes, Istio, and gRPC (Online Boutique).",
  fileTree: [
    {
      id: "gcp-deploystack",
      name: ".deploystack",
      type: "folder",
      path: ".deploystack",
      children: [
        { id: "gcp-ds-json", name: "deploystack.json", type: "file", extension: "json", path: ".deploystack/deploystack.json", size: "1.4 KB", lines: 42, language: "json", description: "DeployStack automated provisioning configuration." }
      ]
    },
    {
      id: "gcp-github",
      name: ".github",
      type: "folder",
      path: ".github",
      children: [
        { id: "gcp-ci", name: "ci.yaml", type: "file", extension: "yaml", path: ".github/workflows/ci.yaml", size: "3.2 KB", lines: 95, language: "yaml", description: "Continuous integration build and test workflow." },
        { id: "gcp-release-wf", name: "release.yaml", type: "file", extension: "yaml", path: ".github/workflows/release.yaml", size: "2.1 KB", lines: 60, language: "yaml", description: "Automated container release and Helm publishing workflow." }
      ]
    },
    {
      id: "gcp-docs",
      name: "docs",
      type: "folder",
      path: "docs",
      children: [
        { id: "gcp-arch-doc", name: "architecture.md", type: "file", extension: "md", path: "docs/architecture.md", size: "4.8 KB", lines: 140, language: "markdown", description: "Network topology and gRPC protocol architecture diagram." },
        { id: "gcp-dev-doc", name: "development.md", type: "file", extension: "md", path: "docs/development.md", size: "3.1 KB", lines: 85, language: "markdown", description: "Local development and Minikube cluster setup guide." }
      ]
    },
    {
      id: "gcp-helm",
      name: "helm-chart",
      type: "folder",
      path: "helm-chart",
      children: [
        { id: "gcp-helm-chart", name: "Chart.yaml", type: "file", extension: "yaml", path: "helm-chart/Chart.yaml", size: "0.8 KB", lines: 25, language: "yaml", description: "Helm chart metadata for Online Boutique." },
        { id: "gcp-helm-values", name: "values.yaml", type: "file", extension: "yaml", path: "helm-chart/values.yaml", size: "4.5 KB", lines: 130, language: "yaml", description: "Default deployment variables and replica limits." }
      ]
    },
    {
      id: "gcp-istio",
      name: "istio-manifests",
      type: "folder",
      path: "istio-manifests",
      children: [
        { id: "gcp-istio-gw", name: "frontend-gateway.yaml", type: "file", extension: "yaml", path: "istio-manifests/frontend-gateway.yaml", size: "1.2 KB", lines: 35, language: "yaml", description: "Istio ingress gateway routing external traffic to frontend service." },
        { id: "gcp-istio-se", name: "service-entries.yaml", type: "file", extension: "yaml", path: "istio-manifests/service-entries.yaml", size: "1.6 KB", lines: 48, language: "yaml", description: "Istio ServiceEntry configurations for external dependencies." }
      ]
    },
    {
      id: "gcp-k8s",
      name: "kubernetes-manifests",
      type: "folder",
      path: "kubernetes-manifests",
      children: [
        { id: "gcp-k8s-fe", name: "frontend.yaml", type: "file", extension: "yaml", path: "kubernetes-manifests/frontend.yaml", size: "2.4 KB", lines: 65, language: "yaml", connectedNodeId: "gcp-frontend-node", description: "Kubernetes Deployment & Service for Go Frontend." },
        { id: "gcp-k8s-cart", name: "cartservice.yaml", type: "file", extension: "yaml", path: "kubernetes-manifests/cartservice.yaml", size: "2.1 KB", lines: 58, language: "yaml", connectedNodeId: "gcp-cart-node", description: "Kubernetes Deployment for C# Cart Service." },
        { id: "gcp-k8s-redis", name: "redis.yaml", type: "file", extension: "yaml", path: "kubernetes-manifests/redis.yaml", size: "1.5 KB", lines: 42, language: "yaml", connectedNodeId: "gcp-cart-node", description: "Redis in-memory caching deployment for shopping carts." },
        { id: "gcp-k8s-checkout", name: "checkoutservice.yaml", type: "file", extension: "yaml", path: "kubernetes-manifests/checkoutservice.yaml", size: "2.6 KB", lines: 75, language: "yaml", connectedNodeId: "gcp-checkout-node", description: "Kubernetes Deployment for Go Checkout Orchestrator." },
        { id: "gcp-k8s-catalog", name: "productcatalogservice.yaml", type: "file", extension: "yaml", path: "kubernetes-manifests/productcatalogservice.yaml", size: "2.0 KB", lines: 52, language: "yaml", connectedNodeId: "gcp-catalog-node", description: "Kubernetes Deployment for Product Catalog Service." },
        { id: "gcp-k8s-payment", name: "paymentservice.yaml", type: "file", extension: "yaml", path: "kubernetes-manifests/paymentservice.yaml", size: "1.9 KB", lines: 48, language: "yaml", connectedNodeId: "gcp-payment-node", description: "Kubernetes Deployment for Node.js Payment Service." },
        { id: "gcp-k8s-email", name: "emailservice.yaml", type: "file", extension: "yaml", path: "kubernetes-manifests/emailservice.yaml", size: "1.8 KB", lines: 45, language: "yaml", connectedNodeId: "gcp-email-node", description: "Kubernetes Deployment for Python Email Service." }
      ]
    },
    {
      id: "gcp-kustomize",
      name: "kustomize",
      type: "folder",
      path: "kustomize",
      children: [
        { id: "gcp-kust-yaml", name: "kustomization.yaml", type: "file", extension: "yaml", path: "kustomize/kustomization.yaml", size: "1.1 KB", lines: 32, language: "yaml", description: "Kustomize bundle overlay configuration." }
      ]
    },
    {
      id: "gcp-protos",
      name: "protos",
      type: "folder",
      path: "protos",
      children: [
        { id: "gcp-proto-demo", name: "demo.proto", type: "file", extension: "proto", path: "protos/demo.proto", size: "6.8 KB", lines: 210, language: "protobuf", description: "Protocol Buffers (gRPC) definitions for all 10 microservices." }
      ]
    },
    {
      id: "gcp-release",
      name: "release",
      type: "folder",
      path: "release",
      children: [
        { id: "gcp-rel-sh", name: "release.sh", type: "file", extension: "sh", path: "release/release.sh", size: "1.4 KB", lines: 40, language: "bash", description: "Shell script generating release manifests." }
      ]
    },
    {
      id: "gcp-src",
      name: "src",
      type: "folder",
      path: "src",
      children: [
        {
          id: "gcp-fe-dir",
          name: "frontend",
          type: "folder",
          path: "src/frontend",
          connectedNodeId: "gcp-frontend-node",
          children: [
            { id: "gcp-fe-main", name: "main.go", type: "file", extension: "go", path: "src/frontend/main.go", size: "5.2 KB", lines: 160, language: "go", connectedNodeId: "gcp-frontend-node", description: "HTTP web server routing user requests and invoking gRPC clients." },
            { id: "gcp-fe-handlers", name: "handlers.go", type: "file", extension: "go", path: "src/frontend/handlers.go", size: "8.4 KB", lines: 240, language: "go", connectedNodeId: "gcp-frontend-node", description: "HTTP page handlers for Cart, Checkout, Products, and Currency." },
            { id: "gcp-fe-rpc", name: "rpc.go", type: "file", extension: "go", path: "src/frontend/rpc.go", size: "4.1 KB", lines: 110, language: "go", connectedNodeId: "gcp-frontend-node", description: "gRPC client connection pooling and retry interceptors." }
          ]
        },
        {
          id: "gcp-cart-dir",
          name: "cartservice",
          type: "folder",
          path: "src/cartservice",
          connectedNodeId: "gcp-cart-node",
          children: [
            { id: "gcp-cart-prog", name: "Program.cs", type: "file", extension: "cs", path: "src/cartservice/src/Program.cs", size: "3.2 KB", lines: 85, language: "csharp", connectedNodeId: "gcp-cart-node", description: "C# ASP.NET Core gRPC server initialization." },
            { id: "gcp-cart-svc", name: "CartService.cs", type: "file", extension: "cs", path: "src/cartservice/src/CartService.cs", size: "4.5 KB", lines: 125, language: "csharp", connectedNodeId: "gcp-cart-node", description: "AddItem, GetCart, and EmptyCart gRPC handlers." },
            { id: "gcp-cart-redis", name: "RedisCartStore.cs", type: "file", extension: "cs", path: "src/cartservice/src/RedisCartStore.cs", size: "3.8 KB", lines: 95, language: "csharp", connectedNodeId: "gcp-cart-node", description: "StackExchange.Redis integration persisting cart items." }
          ]
        },
        {
          id: "gcp-catalog-dir",
          name: "productcatalogservice",
          type: "folder",
          path: "src/productcatalogservice",
          connectedNodeId: "gcp-catalog-node",
          children: [
            { id: "gcp-cat-server", name: "server.go", type: "file", extension: "go", path: "src/productcatalogservice/server.go", size: "4.8 KB", lines: 135, language: "go", connectedNodeId: "gcp-catalog-node", description: "ListProducts, GetProduct, and SearchProducts gRPC handlers." },
            { id: "gcp-cat-json", name: "products.json", type: "file", extension: "json", path: "src/productcatalogservice/products.json", size: "12.4 KB", lines: 320, language: "json", connectedNodeId: "gcp-catalog-node", description: "JSON hardware and apparel product catalogue data." }
          ]
        },
        {
          id: "gcp-checkout-dir",
          name: "checkoutservice",
          type: "folder",
          path: "src/checkoutservice",
          connectedNodeId: "gcp-checkout-node",
          children: [
            { id: "gcp-chk-main", name: "main.go", type: "file", extension: "go", path: "src/checkoutservice/main.go", size: "6.2 KB", lines: 175, language: "go", connectedNodeId: "gcp-checkout-node", description: "Central PlaceOrder orchestration pipeline calling Cart, Payment, Shipping, and Email." },
            { id: "gcp-chk-processor", name: "processor.go", type: "file", extension: "go", path: "src/checkoutservice/processor.go", size: "4.9 KB", lines: 130, language: "go", connectedNodeId: "gcp-checkout-node", description: "Calculates order taxes, currency conversions, and total invoices." }
          ]
        },
        {
          id: "gcp-pay-dir",
          name: "paymentservice",
          type: "folder",
          path: "src/paymentservice",
          connectedNodeId: "gcp-payment-node",
          children: [
            { id: "gcp-pay-idx", name: "index.js", type: "file", extension: "js", path: "src/paymentservice/index.js", size: "2.8 KB", lines: 75, language: "javascript", connectedNodeId: "gcp-payment-node", description: "Node.js gRPC server handling Charge requests." },
            { id: "gcp-pay-charge", name: "charge.js", type: "file", extension: "js", path: "src/paymentservice/charge.js", size: "3.4 KB", lines: 90, language: "javascript", connectedNodeId: "gcp-payment-node", description: "Credit card verification and transaction ID generation." }
          ]
        },
        {
          id: "gcp-curr-dir",
          name: "currencyservice",
          type: "folder",
          path: "src/currencyservice",
          connectedNodeId: "gcp-currency-node",
          children: [
            { id: "gcp-curr-server", name: "server.js", type: "file", extension: "js", path: "src/currencyservice/server.js", size: "3.5 KB", lines: 95, language: "javascript", connectedNodeId: "gcp-currency-node", description: "Convert and GetSupportedCurrencies gRPC server." },
            { id: "gcp-curr-data", name: "currency_conversion.json", type: "file", extension: "json", path: "src/currencyservice/data/currency_conversion.json", size: "2.1 KB", lines: 45, language: "json", connectedNodeId: "gcp-currency-node", description: "EUR, USD, JPY, GBP exchange conversion rate table." }
          ]
        },
        {
          id: "gcp-ship-dir",
          name: "shippingservice",
          type: "folder",
          path: "src/shippingservice",
          connectedNodeId: "gcp-shipping-node",
          children: [
            { id: "gcp-ship-main", name: "main.go", type: "file", extension: "go", path: "src/shippingservice/main.go", size: "3.8 KB", lines: 105, language: "go", connectedNodeId: "gcp-shipping-node", description: "GetQuote and ShipOrder gRPC delivery handlers." }
          ]
        },
        {
          id: "gcp-email-dir",
          name: "emailservice",
          type: "folder",
          path: "src/emailservice",
          connectedNodeId: "gcp-email-node",
          children: [
            { id: "gcp-email-server", name: "email_server.py", type: "file", extension: "py", path: "src/emailservice/email_server.py", size: "3.6 KB", lines: 90, language: "python", connectedNodeId: "gcp-email-node", description: "Python gRPC server sending HTML order confirmation emails." }
          ]
        },
        {
          id: "gcp-rec-dir",
          name: "recommendationservice",
          type: "folder",
          path: "src/recommendationservice",
          connectedNodeId: "gcp-rec-node",
          children: [
            { id: "gcp-rec-server", name: "recommendation_server.py", type: "file", extension: "py", path: "src/recommendationservice/recommendation_server.py", size: "3.4 KB", lines: 80, language: "python", connectedNodeId: "gcp-rec-node", description: "Python ML recommendation engine suggesting related items." }
          ]
        },
        {
          id: "gcp-ad-dir",
          name: "adservice",
          type: "folder",
          path: "src/adservice",
          connectedNodeId: "gcp-ad-node",
          children: [
            { id: "gcp-ad-java", name: "AdService.java", type: "file", extension: "java", path: "src/adservice/src/main/java/hipstershop/AdService.java", size: "5.6 KB", lines: 140, language: "java", connectedNodeId: "gcp-ad-node", description: "Java gRPC server returning contextual banner ads based on category." }
          ]
        }
      ]
    },
    {
      id: "gcp-tf",
      name: "terraform",
      type: "folder",
      path: "terraform",
      children: [
        { id: "gcp-tf-main", name: "main.tf", type: "file", extension: "tf", path: "terraform/main.tf", size: "4.2 KB", lines: 110, language: "hcl", description: "Terraform provisioning GKE Google Kubernetes Engine cluster." },
        { id: "gcp-tf-vars", name: "variables.tf", type: "file", extension: "tf", path: "terraform/variables.tf", size: "1.8 KB", lines: 50, language: "hcl", description: "GCP project, region, and machine type variables." }
      ]
    },
    { id: "gcp-editorcfg", name: ".editorconfig", type: "file", extension: "editorconfig", path: ".editorconfig", size: "0.5 KB", lines: 15, language: "config", description: "Editor whitespace formatting configuration." },
    { id: "gcp-gitattr", name: ".gitattributes", type: "file", extension: "gitattributes", path: ".gitattributes", size: "0.4 KB", lines: 12, language: "config", description: "Git CRLF line ending configuration." },
    { id: "gcp-gitignore", name: ".gitignore", type: "file", extension: "gitignore", path: ".gitignore", size: "0.9 KB", lines: 28, language: "config", description: "Git build artifacts ignore rules." },
    { id: "gcp-readme", name: "README.md", type: "file", extension: "md", path: "README.md", size: "8.5 KB", lines: 220, language: "markdown", description: "Complete documentation for Google Cloud 10-Microservices Online Boutique." },
    { id: "gcp-license", name: "LICENSE", type: "file", extension: "txt", path: "LICENSE", size: "11.3 KB", lines: 200, language: "plaintext", description: "Apache 2.0 Open Source License." }
  ],
  nodes: [
    {
      id: "gcp-frontend-node",
      type: "customArch",
      position: { x: 260, y: 30 },
      data: {
        label: "FRONTEND",
        category: "frontend" as const,
        subtitle: "Go HTTP Web Storefront",
        techStack: ["Go", "HTML Templates", "gRPC Client", "Port 8080"],
        status: "healthy" as const,
        latency: "14ms",
        throughput: "8.4k req/m",
        filesCount: 4,
        description: "Public entrypoint serving HTML templates, handling session cookies, and invoking internal gRPC microservices.",
        endpoints: ["GET /", "GET /product/{id}", "POST /cart", "POST /cart/checkout"],
        relatedFiles: ["src/frontend/main.go", "src/frontend/handlers.go", "src/frontend/rpc.go", "kubernetes-manifests/frontend.yaml"],
        icon: "LayoutTemplate"
      }
    },
    {
      id: "gcp-checkout-node",
      type: "customArch",
      position: { x: 260, y: 220 },
      data: {
        label: "CHECKOUT SERVICE",
        category: "backend" as const,
        subtitle: "Go gRPC Order Pipeline",
        techStack: ["Go", "gRPC", "Protobuf"],
        status: "healthy" as const,
        latency: "18ms",
        throughput: "3.2k req/m",
        filesCount: 3,
        description: "Orchestrates order placement by querying Cart, charging Payment, requesting Shipping quotes, and sending Confirmation emails.",
        endpoints: ["gRPC PlaceOrder(PlaceOrderRequest)"],
        relatedFiles: ["src/checkoutservice/main.go", "src/checkoutservice/processor.go", "kubernetes-manifests/checkoutservice.yaml"],
        icon: "Server"
      }
    },
    {
      id: "gcp-cart-node",
      type: "customArch",
      position: { x: 60, y: 220 },
      data: {
        label: "CART SERVICE",
        category: "database" as const,
        subtitle: "C# .NET + Redis Store",
        techStack: ["C#", ".NET 8", "Redis", "gRPC"],
        status: "healthy" as const,
        latency: "4ms",
        throughput: "6.8k req/m",
        filesCount: 4,
        description: "Manages user shopping cart line items with Redis persistence.",
        endpoints: ["gRPC AddItem", "gRPC GetCart", "gRPC EmptyCart"],
        relatedFiles: ["src/cartservice/src/CartService.cs", "src/cartservice/src/RedisCartStore.cs", "kubernetes-manifests/redis.yaml"],
        icon: "Database"
      }
    },
    {
      id: "gcp-catalog-node",
      type: "customArch",
      position: { x: 460, y: 220 },
      data: {
        label: "PRODUCT CATALOG",
        category: "service" as const,
        subtitle: "Go gRPC Product Store",
        techStack: ["Go", "JSON Database", "gRPC"],
        status: "healthy" as const,
        latency: "3ms",
        throughput: "12.5k req/m",
        filesCount: 3,
        description: "Provides product details, prices, search filtering, and inventory catalog data.",
        endpoints: ["gRPC ListProducts", "gRPC GetProduct", "gRPC SearchProducts"],
        relatedFiles: ["src/productcatalogservice/server.go", "src/productcatalogservice/products.json"],
        icon: "Sparkles"
      }
    },
    {
      id: "gcp-payment-node",
      type: "customArch",
      position: { x: 60, y: 410 },
      data: {
        label: "PAYMENT SERVICE",
        category: "payment" as const,
        subtitle: "Node.js Credit Card Processing",
        techStack: ["Node.js", "JavaScript", "gRPC"],
        status: "healthy" as const,
        latency: "25ms",
        throughput: "2.8k req/m",
        filesCount: 3,
        description: "Authorizes and charges credit cards with cryptographic transaction IDs.",
        endpoints: ["gRPC Charge(ChargeRequest)"],
        relatedFiles: ["src/paymentservice/index.js", "src/paymentservice/charge.js"],
        icon: "CreditCard"
      }
    },
    {
      id: "gcp-currency-node",
      type: "customArch",
      position: { x: 260, y: 410 },
      data: {
        label: "CURRENCY SERVICE",
        category: "service" as const,
        subtitle: "Node.js Exchange Converter",
        techStack: ["Node.js", "FX Rates", "gRPC"],
        status: "healthy" as const,
        latency: "5ms",
        throughput: "7.1k req/m",
        filesCount: 3,
        description: "Converts prices between USD, EUR, GBP, JPY, and other international currencies.",
        endpoints: ["gRPC Convert", "gRPC GetSupportedCurrencies"],
        relatedFiles: ["src/currencyservice/server.js", "src/currencyservice/data/currency_conversion.json"],
        icon: "Sparkles"
      }
    },
    {
      id: "gcp-shipping-node",
      type: "customArch",
      position: { x: 460, y: 410 },
      data: {
        label: "SHIPPING SERVICE",
        category: "service" as const,
        subtitle: "Go Shipping & Quotes",
        techStack: ["Go", "Tracking Engine", "gRPC"],
        status: "healthy" as const,
        latency: "8ms",
        throughput: "3.5k req/m",
        filesCount: 2,
        description: "Generates estimated shipping costs and tracking numbers.",
        endpoints: ["gRPC GetQuote", "gRPC ShipOrder"],
        relatedFiles: ["src/shippingservice/main.go"],
        icon: "Sparkles"
      }
    }
  ],
  edges: [
    { id: "e-fe-chk", source: "gcp-frontend-node", target: "gcp-checkout-node", animated: true, label: "Checkout Submit", style: { stroke: "#38bdf8", strokeWidth: 2.5 } },
    { id: "e-fe-cart", source: "gcp-frontend-node", target: "gcp-cart-node", animated: true, label: "View / Update Cart", style: { stroke: "#34d399", strokeWidth: 2 } },
    { id: "e-fe-cat", source: "gcp-frontend-node", target: "gcp-catalog-node", animated: true, label: "Fetch Products", style: { stroke: "#fbbf24", strokeWidth: 2 } },
    { id: "e-fe-curr", source: "gcp-frontend-node", target: "gcp-currency-node", animated: true, label: "Convert Price", style: { stroke: "#c084fc", strokeWidth: 2 } },
    { id: "e-chk-cart", source: "gcp-checkout-node", target: "gcp-cart-node", animated: true, label: "Empty Cart", style: { stroke: "#34d399", strokeWidth: 2 } },
    { id: "e-chk-pay", source: "gcp-checkout-node", target: "gcp-payment-node", animated: true, label: "Charge Card", style: { stroke: "#ec4899", strokeWidth: 2 } },
    { id: "e-chk-ship", source: "gcp-checkout-node", target: "gcp-shipping-node", animated: true, label: "Create Shipment", style: { stroke: "#fbbf24", strokeWidth: 2 } },
    { id: "e-chk-curr", source: "gcp-checkout-node", target: "gcp-currency-node", animated: true, label: "Calculate Total", style: { stroke: "#c084fc", strokeWidth: 2 } }
  ],
  welcomeMessage: {
    id: "msg-welcome-gcp",
    sender: "assistant",
    text: "☁️ **GoogleCloudPlatform/microservices-demo (Online Boutique) Loaded**\n\nThis is Google Cloud's canonical 10-microservice cloud-native demo:\n\n- **Frontend (`src/frontend/`)** → Go web server serving HTML UI.\n- **Checkout (`src/checkoutservice/`)** → Go gRPC orchestrator.\n- **Cart (`src/cartservice/`)** → C# .NET + Redis cache.\n- **Product Catalog (`src/productcatalogservice/`)** → Go gRPC catalog.\n- **Payment (`src/paymentservice/`)** → Node.js card processor.\n- **Infra (`kubernetes-manifests/`, `istio-manifests/`, `terraform/`)** → GKE & Service Mesh.\n\n*Click any node in the map or ask a question below:*",
    timestamp: "12:00 PM",
    suggestedActions: [
      "How does the checkout flow work across microservices?",
      "Explain the gRPC definitions in protos/demo.proto",
      "Where are Kubernetes and Istio manifests configured?",
      "How is Redis used in cartservice?"
    ]
  },
  quickPrompts: [
    "How does checkout work across microservices?",
    "Explain the gRPC proto definitions",
    "Where are Kubernetes manifests configured?",
    "How does cartservice use Redis?",
  ],
  onboardingSteps: [
    {
      id: "gcp-s1",
      title: "1. Local Minikube or GKE Cluster Setup",
      estimatedTime: "5 mins",
      category: "Kubernetes",
      description: "Provision a local Kubernetes cluster and deploy the 10 microservices using kubectl.",
      commands: ["minikube start --cpus=4 --memory=4096", "kubectl apply -f ./kubernetes-manifests/"],
      relatedFiles: ["kubernetes-manifests/frontend.yaml", "kubernetes-manifests/checkoutservice.yaml"],
      checklist: [
        { id: "g1", text: "Start local Minikube or connect to GKE cluster", completed: false },
        { id: "g2", text: "Apply all 10 microservice manifests", completed: false },
        { id: "g3", text: "Port-forward frontend service on port 8080", completed: false }
      ]
    },
    {
      id: "gcp-s2",
      title: "2. Inspect gRPC Protobuf Contracts",
      estimatedTime: "3 mins",
      category: "Architecture",
      description: "Review gRPC service interfaces for CheckoutService, CartService, and ProductCatalogService.",
      relatedFiles: ["protos/demo.proto", "src/checkoutservice/main.go"],
      checklist: [
        { id: "g4", text: "Inspect protos/demo.proto service contracts", completed: false },
        { id: "g5", text: "Trace PlaceOrder RPC parameters", completed: false }
      ]
    }
  ]
};

// Export dictionary of all repository datasets
export const ALL_REPOSITORIES: Record<string, RepositoryProfile> = {
  "Demo E-Commerce System": ECOMMERCE_REPO,
  "GoogleCloudPlatform/microservices-demo": GCP_MICROSERVICES_DEMO_REPO,
  "RepoNavigator Core": REPONAVIGATOR_CORE_REPO,
  "Microservices Starter": MICROSERVICES_STARTER_REPO,
};

export function registerRepositoryProfile(profile: RepositoryProfile) {
  ALL_REPOSITORIES[profile.name] = profile;
  ALL_REPOSITORIES[profile.id] = profile;
}

export function getRepositoryProfile(name: string): RepositoryProfile {
  if (ALL_REPOSITORIES[name]) {
    return ALL_REPOSITORIES[name];
  }

  // Case-insensitive / partial match
  const lower = name.toLowerCase();
  for (const [key, profile] of Object.entries(ALL_REPOSITORIES)) {
    if (key.toLowerCase() === lower || profile.id.toLowerCase() === lower || key.toLowerCase().includes(lower)) {
      return profile;
    }
  }

  // Dynamic profile generation for imported repos
  const baseName = name.split("/").pop() || name;
  return {
    id: `custom-${baseName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    name: name,
    branch: "main",
    version: "v1.0.0",
    badge: "AST Parsed",
    status: "Repository Connected",
    lastIndexed: "Just now",
    totalFiles: 18,
    totalLines: 3200,
    techStack: ["TypeScript", "React", "Node.js", "REST"],
    description: `Indexed repository architecture for ${name}`,
    fileTree: [
      {
        id: "src-dir",
        name: "src",
        type: "folder",
        path: "src",
        connectedNodeId: "src-core-node",
        children: [
          { id: "f-index", name: "index.ts", type: "file", extension: "ts", path: "src/index.ts", size: "2.1 KB", lines: 52, language: "typescript", connectedNodeId: "src-core-node", description: "Main application entrypoint and initialization." },
          { id: "f-config", name: "config.ts", type: "file", extension: "ts", path: "src/config.ts", size: "1.4 KB", lines: 34, language: "typescript", connectedNodeId: "src-core-node", description: "Environment variables and runtime configuration." },
          { id: "f-router", name: "router.ts", type: "file", extension: "ts", path: "src/router.ts", size: "1.9 KB", lines: 48, language: "typescript", connectedNodeId: "api-gw-node", description: "REST routes and HTTP middleware dispatchers." }
        ]
      },
      {
        id: "lib-dir",
        name: "lib",
        type: "folder",
        path: "lib",
        connectedNodeId: "services-node",
        children: [
          { id: "f-client", name: "client.ts", type: "file", extension: "ts", path: "lib/client.ts", size: "2.8 KB", lines: 72, language: "typescript", connectedNodeId: "services-node", description: "Internal SDK client and HTTP pooling." },
          { id: "f-utils", name: "utils.ts", type: "file", extension: "ts", path: "lib/utils.ts", size: "1.2 KB", lines: 30, language: "typescript", connectedNodeId: "services-node", description: "Helper formatting and transformation utilities." }
        ]
      },
      { id: "readme", name: "README.md", type: "file", extension: "md", path: "README.md", size: "1.5 KB", lines: 40, language: "markdown", description: "Project documentation." }
    ],
    nodes: [
      {
        id: "src-core-node",
        type: "customArch",
        position: { x: 260, y: 40 },
        data: {
          label: "CORE APPLICATION",
          category: "frontend" as const,
          subtitle: `${baseName} Runtime`,
          techStack: ["TypeScript", "Node.js"],
          status: "healthy" as const,
          latency: "14ms",
          throughput: "2.4k req/m",
          filesCount: 3,
          description: `Primary runtime entrypoint for ${name}`,
          endpoints: ["GET /", "GET /health"],
          relatedFiles: ["src/index.ts", "src/config.ts"],
          icon: "LayoutTemplate"
        }
      },
      {
        id: "api-gw-node",
        type: "customArch",
        position: { x: 100, y: 240 },
        data: {
          label: "API ROUTER",
          category: "backend" as const,
          subtitle: "HTTP & Middleware",
          techStack: ["REST", "Middleware"],
          status: "healthy" as const,
          latency: "8ms",
          throughput: "3.1k req/m",
          filesCount: 2,
          description: "Routes and controllers handling client requests.",
          endpoints: ["GET /api/v1/status", "POST /api/v1/data"],
          relatedFiles: ["src/router.ts"],
          icon: "Server"
        }
      },
      {
        id: "services-node",
        type: "customArch",
        position: { x: 420, y: 240 },
        data: {
          label: "SERVICES & UTILITIES",
          category: "service" as const,
          subtitle: "Shared Libraries",
          techStack: ["Utility Libs", "SDK"],
          status: "healthy" as const,
          latency: "4ms",
          throughput: "5.8k req/m",
          filesCount: 2,
          description: "Internal client utilities and data transformations.",
          endpoints: ["Internal Module Calls"],
          relatedFiles: ["lib/client.ts", "lib/utils.ts"],
          icon: "Sparkles"
        }
      }
    ],
    edges: [
      { id: "e-core-router", source: "src-core-node", target: "api-gw-node", animated: true, label: "Dispatches HTTP", style: { stroke: "#38bdf8", strokeWidth: 2 } },
      { id: "e-core-services", source: "src-core-node", target: "services-node", animated: true, label: "Calls Helpers", style: { stroke: "#c084fc", strokeWidth: 2 } },
    ],
    welcomeMessage: {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      text: `◈ **${name} Repository AST Analysis Complete**\n\n- **Core Application (\`src/\`)** → Primary runtime and configuration.\n- **API Router (\`src/router.ts\`)** → Endpoint mapping and middleware.\n- **Services & Helpers (\`lib/\`)** → Shared client logic.\n\n*Click any node in the map or ask a question below:*`,
      timestamp: "Just now",
      suggestedActions: [
        "Explain architecture of this project",
        "Where is the entry point?",
        "Show all files in src/"
      ]
    },
    quickPrompts: [
      `How does ${baseName} work?`,
      "Where is the entry point?",
      "Explain the service dependencies",
      "Which files should I start reading?",
    ],
    onboardingSteps: [
      {
        id: "custom-s1",
        title: `1. Clone & Setup ${baseName}`,
        estimatedTime: "2 mins",
        category: "Setup",
        description: `Install packages and run test suite for ${name}.`,
        commands: [`git clone https://github.com/${name}.git`, `cd ${baseName}`, "npm install", "npm run dev"],
        relatedFiles: ["README.md", "src/index.ts"],
        checklist: [
          { id: "cs1", text: "Clone repository into local workspace", completed: true },
          { id: "cs2", text: "Run `npm install` for dependencies", completed: true },
          { id: "cs3", text: "Start local development server", completed: false }
        ]
      }
    ]
  };
}

export const INITIAL_REPOSITORY_DATA = ECOMMERCE_REPO;
export const REPOSITORY_TREE = ECOMMERCE_REPO.fileTree;
export const INITIAL_ARCH_NODES = ECOMMERCE_REPO.nodes;
export const INITIAL_ARCH_EDGES = ECOMMERCE_REPO.edges;
export const INITIAL_CHAT_MESSAGES = [ECOMMERCE_REPO.welcomeMessage];
export const ONBOARDING_STEPS = ECOMMERCE_REPO.onboardingSteps;
