# 🎬 RepoNavigator AI — Hackathon Pitch & 2.5-Minute Demo Script

> **Demo Objective**: Convince judges that RepoNavigator AI transforms the frustrating, slow process of codebase onboarding into an intuitive, visual, and AI-guided experience.

---

## ⏱️ Timeline Summary (Total: 2m 30s)

| Time | Stage | Key Visual Action | Speaking Point |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:25** | The Problem | Show bloated repo with 50+ files | *"The hardest part of joining a codebase isn't writing code—it's understanding where everything is."* |
| **0:25 - 0:50** | Repository Cockpit & Map | Show RepoNavigator UI with live pulsing nodes | *"RepoNavigator turns code into an interactive 3D-feeling architecture cockpit."* |
| **0:50 - 1:25** | "Explain This" Subsystem | Click `Payment Service` node → Inspector drawer | *"With one click, we see latency, endpoints, and exact implementation files."* |
| **1:25 - 1:55** | Contextual AI Q&A | Click prompt: *"How does request flow from Frontend to DB?"* | *"It doesn't just chat—it traces multi-service lifecycles with direct graph links."* |
| **1:55 - 2:20** | AI Onboarding Roadmap | Switch to `Onboarding` tab → Checklist | *"A personalized multi-day curriculum with copyable commands and progress tracking."* |
| **2:20 - 2:30** | Closing Value | Switch back to 3-column Overview | *"Don't just read code—navigate it visually with RepoNavigator AI."* |

---

## 🎙️ Step-by-Step Script with Click Cues

### Act 1: The Problem (0:00 – 0:25)
- **Visual**: Open a messy GitHub repository page with dozens of nested folders.
- **Speaker**:
  > *"Every developer knows the pain of joining a new company or opening a 50,000-line codebase for the first time. You're handed a outdated README, dozens of microservices, and you spend days just figuring out which service talks to which database.*
  >
  > *Current AI tools let you chat with code, but text alone can't give you spatial architectural awareness. That's why we built **RepoNavigator AI**."*

### Act 2: The Architecture Cockpit (0:25 – 0:50)
- **Visual**: Switch to RepoNavigator AI. Point out top status badge `● Repository Ready`, the 3-column cockpit layout, and animated data flows.
- **Speaker**:
  > *"RepoNavigator analyzes your entire repository's Abstract Syntax Tree and immediately visualizes it as an interactive architecture cockpit.*
  >
  > *On the left, we have our indexed repository tree. In the center, our real-time Architecture Map powered by React Flow with simulated data flows. And on the right, our AST-grounded AI copilot."*

### Act 3: "Explain This" Subsystem Deep Dive (0:50 – 1:25)
- **Visual**: Click on the `Backend Gateway` or `Payment & Billing` node. The Inspector Drawer slides out smoothly. Click on `payment/stripe.ts` to show the Code Viewer modal.
- **Speaker**:
  > *"When a developer wants to understand a subsystem—say, Payments—they don't need to grep through 50 files. They simply click the module.*
  >
  > *RepoNavigator extracts the exact entry points, latency telemetry, database dependencies, and lets us inspect the underlying implementation files with line-by-line syntax."*

### Act 4: Context-Aware AI Copilot (1:25 – 1:55)
- **Visual**: Click the prompt chip: *"Explain Frontend to Database flow"*. Watch the AI stream the response, highlight the code block, and click the `@Database` tag in chat to pulse the node on the map.
- **Speaker**:
  > *"Next, let's ask our copilot: 'How does a user request travel from the Frontend to the Database?'*
  >
  > *Notice that RepoNavigator doesn't give generic hallucinations. It maps out the exact lifecycle: Next.js UI → Jose JWT Session verification → Fastify Routes → Prisma ORM → Redis Caching. And clicking any module link in the chat immediately highlights its place in the visual architecture."*

### Act 5: Developer Onboarding Roadmap (1:55 – 2:20)
- **Visual**: Click the `Onboarding` tab in the bottom bar. Check off a task to show the live progress bar animating from 25% to 50%.
- **Speaker**:
  > *"Finally, we solve the Day-1 onboarding headache. The **Onboarding Guide** generates a customized curriculum: environment configuration, database seeding, and architectural checklists with one-click terminal commands.*
  >
  > *As the new engineer finishes tasks, their progress is tracked live, cutting onboarding time from weeks to hours."*

### Act 6: Strong Finish (2:20 – 2:30)
- **Visual**: Click `Overview` to return to the full cockpit view.
- **Speaker**:
  > *"RepoNavigator AI turns unfamiliar codebases into an interactive visual map, an intelligent copilot, and a guided onboarding journey. Thank you!"*

---

## 🎯 Top Judge Q&A Anticipation

#### Q1: "How does it extract the architecture from raw code?"
> **Answer**: *"We parse the repository AST using Tree-sitter and static import/export analyzers, detecting API routes, database schemas (like Prisma/SQL), and package dependencies. We then construct a directed dependency graph rendered dynamically via React Flow."*

#### Q2: "Can this work on massive repositories with hundreds of microservices?"
> **Answer**: *"Yes! Our canvas includes layer category filters (Frontend, Backend, Database, Auth, Payments) and a minimap to easily isolate specific subsystems without visual clutter."*

#### Q3: "How is this different from Cursor or GitHub Copilot?"
> **Answer**: *"Cursor and Copilot are file-level text assistants. RepoNavigator AI operates at the **system architecture level**, providing visual topological awareness, cross-service lifecycle tracing, and interactive onboarding checklists that IDE chat alone cannot provide."*
