# 🚀 Product Requirements Document (PRD)
## RepoNavigator AI — Visual Developer Onboarding & Architecture Assistant

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
When software engineers join a new company, switch teams, or contribute to an open-source codebase, **up to 70% of their initial onboarding time is spent understanding where everything is and how services communicate**, rather than writing features. Existing tools offer either static text READMEs or generic chat LLMs that lack visual spatial awareness of codebase topology.

### 1.2 Solution & Value Proposition
**RepoNavigator AI** transforms complex codebases into an **interactive visual cockpit**:
> *"Don't just chat with the repository — visually understand it."*

It couples **visual architecture maps** (powered by React Flow), **AST-indexed file trees**, **subsystem deep-dives ("Explain This")**, **context-aware AI Q&A**, and **personalized onboarding roadmaps** (tailored to experience levels).

---

## 2. Target Personas & Use Cases

| Persona | Primary Needs & Pain Points | Key Feature Utilized |
| :--- | :--- | :--- |
| **New Hire / Onboarding Dev** | *"Where do I start? Which files handle user authentication?"* | Feature 4 (AI Onboarding Guide) & Feature 1 (Repo Overview) |
| **Fullstack / Backend Engineer** | *"What happens when an order is placed? How does payment flow into the database?"* | Feature 2 (Interactive Architecture Map) & Feature 5 ("Explain This") |
| **Tech Lead / Architect** | *"Are our service boundaries clean? Are there circular dependencies?"* | Feature 2 (Live Flow Simulation) & Feature 3 (Repository Q&A) |
| **Open Source Contributor** | *"How do I test a small module locally without breaking unrelated microservices?"* | Feature 4 (Checklists) & Feature 5 (Subsystem Entry Points) |

---

## 3. Core Feature Specifications

### 🌟 Feature 1: Repository Overview & File Ingestion
- **Description**: Parses a GitHub URL or local repository, extracts module hierarchy, technologies, and file counts.
- **Inputs**: GitHub URL (e.g. `facebook/react`, `org/ecommerce-platform`) or local workspace folder.
- **Outputs**:
  - Telemetry badge (`● Repository Ready`, 428 files, 37 modules, 14 services).
  - Categorized directory explorer: `📁 frontend`, `📁 backend`, `📁 auth`, `📁 database`, `📁 payment`, `📁 services`.
  - Technology stack pill tags (e.g., `Next.js 16`, `Prisma`, `PostgreSQL`, `Fastify`, `Redis`, `Stripe`).

### 🗺️ Feature 2: Interactive Architecture Map (Hero Feature)
- **Description**: A dynamic interactive graph built on `@xyflow/react` showing system topology, layers, and communication protocols.
- **Node Categories**:
  - `Frontend Layer` (Next.js / React UI Cockpit)
  - `Auth Service` (OAuth2, JWT Session Guards)
  - `Backend Gateway` (API Routing, Rate Limiting)
  - `Services & Ingestion` (RAG Engine, AST Parsers, Worker Queues)
  - `Database & Storage` (PostgreSQL, Prisma ORM, Redis Cache)
  - `Payment & External` (Stripe Webhook Listeners)
- **Interactions**:
  - **Click Node**: Opens contextual Inspector Drawer showing: Module Purpose, Latency/Throughput, Registered Endpoints, Core Files, and "Ask AI" button.
  - **Live Flow Particles**: Toggle animated edge particle streams representing REST, RPC, and database queries.
  - **Layer Filters**: Filter view by All, Frontend, Backend, Auth, Database, Payments.

### 💬 Feature 3: Repository Q&A (Context-Aware AI Copilot)
- **Description**: Conversational pair-programmer grounded in the repository's AST symbol graph.
- **Capabilities**:
  - Traces multi-module lifecycles (e.g. *"How does a request travel from Frontend to Database?"*).
  - Generates syntax-highlighted code snippets with copy button.
  - Injects interactive `@Module` tags: clicking a module name in chat pulses and pans to the node on the Architecture canvas.
  - Quick action chips for common developer questions.

### 🎓 Feature 4: Personalized AI Onboarding Guide
- **Description**: Structured multi-day curriculum customized by developer seniority.
- **Skill Profiles**:
  - `Beginner`: Focus on running the app, directory layouts, and setting up `.env`.
  - `Intermediate`: Focus on API routes, authentication session flows, and Prisma models.
  - `Experienced`: Focus on caching policies, race conditions, webhook idempotency, and CI/CD pipelines.
- **Interactive Checklist**: Persistent checkbox completion state, copyable terminal setup commands, and file jump links.

### 🔎 Feature 5: "Explain This" Subsystem Deep-Dive
- **Description**: One-click visual decomposition of any selected module.
- **Decomposition Schema**:
  1. **Purpose**: Executive summary of responsibilities.
  2. **Entry Point**: Main controller route or initialization hook.
  3. **Main Components**: Internal class/function breakdown.
  4. **Data Flow**: Step-by-step sequence diagram (ASCII / Mermaid).

---

## 4. UI/UX Layout Specification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ◈ RepoNavigator AI                     [⌘K Search]       ● Repository Ready │
├─────────────────┬────────────────────────────────────────┬──────────────────┤
│                 │                                        │                  │
│   REPOSITORY    │          ARCHITECTURE MAP              │     AI CHAT      │
│                 │                                        │                  │
│  📁 frontend    │          ┌──────────────┐              │ 🤖 AI Copilot    │
│  📁 backend     │          │   Frontend   │              │                  │
│  📁 auth        │─────────▶│  (Next.js)   │───────────┐  │ Ask anything...  │
│  📁 database    │          └──────┬───────┘           │  │                  │
│  📁 payment     │                 │                   │  │ You: How does    │
│  📁 services    │                 ▼                   ▼  │ auth work?       │
│                 │          ┌──────────────┐    ┌───────┐ │                  │
│                 │          │ API Gateway  │    │ Auth  │ │ AI: JWT session  │
│                 │          └──────┬───────┘    └───────┘ │ in session.ts... │
│                 │                 ▼                      │                  │
│                 │          ┌──────────────┐              │ [Copy Code]      │
│                 │          │   Database   │              │                  │
│                 │          └──────────────┘              │                  │
├─────────────────┴────────────────────────────────────────┴──────────────────┤
│  📊 Overview    🗺 Architecture    🎓 Onboarding    💬 Chat   │ main (clean) │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Technical Architecture & Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript 5.8 | Modern reactive web application with SSR/CSR balance |
| **Styling & Design** | Tailwind CSS v4, Lucide Icons, Custom Scrollbars | Developer-grade dark aesthetic (slate/zinc palette) |
| **Graph Visualization** | `@xyflow/react` (React Flow v12) | Node canvas, minimap, drag/zoom, custom node types |
| **Animations** | Framer Motion & CSS Particle Streams | Smooth transitions and edge connection pulses |
| **State Management** | React Context + React Flow State Hooks | Cross-component state (file tree ↔ node ↔ chat) |
| **AI Inference** | Gemini 2.5 Flash / Fastify AI Backend | AST augmentation, code explanation, onboarding path |

---

## 6. Non-Functional Requirements
- **Performance**: Canvas renders at 60 FPS with up to 50 nodes and 100 edges.
- **Latency**: Sub-second UI updates upon selecting files, switching tabs, or triggering quick prompts.
- **Responsive**: 3-column split view on desktops (>= 1024px) with dedicated full-screen modes for Mobile/Tablet via Bottom Bar tabs.
- **Zero Configuration**: Ready out of the box with sample fixtures and instant GitHub repo ingestion simulation.

---

## 7. Success Metrics for Hackathon & Production
- **Time to First Comprehension**: Under 90 seconds for a new engineer to explain the backend-to-database flow.
- **Demo Flow Cohesion**: Complete 2.5-minute demo sequence without UI freezing or blank screens.
- **Clarity Score**: High judge rating on differentiation ("visual architecture cockpit" vs "generic chat prompt").
