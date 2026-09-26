# ◈ RepoNavigator AI
### *Visual Developer Onboarding & Interactive Architecture Cockpit*

> **"Don't just chat with the repository — visually understand it."**

RepoNavigator AI transforms complex codebases into an interactive visual cockpit. It helps developers immediately grasp architecture topologies, explore AST-indexed file hierarchies, trace request lifecycles, and follow personalized onboarding paths.

---

## 📸 Cockpit Layout Overview

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

## 🌟 5 Core Superpowers

1. **📁 Repository Explorer**: Real-time searchable file tree with line counts, file sizes, and cross-linking to architecture nodes.
2. **🗺️ Interactive Architecture Map**: React Flow canvas with custom styled nodes, animated data traffic particles, minimap, and layer filtering.
3. **💬 Contextual AI Copilot**: AST-grounded pair-programming assistant that generates syntax-highlighted code snippets and clickable `@Module` links.
4. **🎓 AI Onboarding Guide**: Multi-day guided developer onboarding curriculum with interactive task checklists and copyable shell scripts.
5. **🔎 "Explain This" Subsystem Inspector**: One-click slide-out inspector displaying latency telemetry, registered endpoints, and core implementation files.

---

## 📚 Complete Project Documentation

| Document | Description |
| :--- | :--- |
| 📄 [**Product Requirements Document (PRD)**](file:///e:/Projects/reponavigator-ai/docs/PRD.md) | Full product specifications, personas, user journeys, and technical contracts. |
| 🗺️ [**Step-by-Step Development Plan**](file:///e:/Projects/reponavigator-ai/docs/DEVELOPMENT_PLAN.md) | 7-Phase implementation roadmap with deliverables and acceptance criteria. |
| 🧪 [**Quality Assurance & Testing Guide**](file:///e:/Projects/reponavigator-ai/docs/TESTING_GUIDE.md) | Phase-by-phase test matrices, manual scripts, and pre-demo checklist. |
| 🎬 [**Hackathon Pitch & Demo Script**](file:///e:/Projects/reponavigator-ai/docs/DEMO_SCRIPT.md) | 2.5-minute timed demo script, speaking notes, and judge Q&A prep. |

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18.18+ or 20+
- npm, yarn, or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/reponavigator-ai.git
cd reponavigator-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Visual Graph**: `@xyflow/react` (React Flow v12)
- **Animations**: Framer Motion & CSS Particle Streams
