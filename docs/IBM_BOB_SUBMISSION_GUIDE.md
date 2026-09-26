# 🏆 RepoNavigator AI — IBM Bob 2.0 Submission & Pitch Guide

## 1. Project Overview & Hackathon Fit

* **Project Name**: RepoNavigator AI
* **Category / Track**: AI Developer Productivity & Developer Tools
* **Tagline**: *Visual AI Developer Onboarding Assistant — Don't just chat with your repository, visually understand it.*
* **Built With**: Next.js 16 (React 19, TypeScript), `@xyflow/react` (React Flow v12), Tailwind CSS, GitHub REST API, Gemini / IBM Bob AI agent architecture.

---

## 2. The 2-Minute Demo Video Pitch Script

Follow this exact 120-second timeline for recording your video:

| Time | Tab / Screen | What to Show | What to Say (Script) |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:25** | **Overview (Default)** | Top Header & 3-Column Cockpit (`Files` \| `Architecture Map` \| `AI Chat`) | *"Welcome to RepoNavigator AI. When joining a new team or exploring a massive GitHub codebase, developers spend hours lost in complex folder trees. RepoNavigator transforms any repository into an interactive visual cockpit."* |
| **0:25 - 0:50** | **Architecture Map** | Click a node (e.g. `FRONTEND` or `BACKEND`), drag nodes, test layout presets (`Top-Down`, `Horizontal`) | *"Here on the canvas, our engine parses the codebase into connected microservices with live data flows. Clicking any node opens the Subsystem Inspector to reveal latency metrics, endpoints, and connected source files."* |
| **0:50 - 1:15** | **Ask Repo AI** | Click a preset chip (e.g. *"How does user login work?"*) & click the interactive `◈ AUTH SERVICE` module badge | *"Instead of generic AI chat, RepoNavigator is grounded in the repository topology. Clickable module badges link directly to the architecture canvas with verified code snippets."* |
| **1:15 - 1:40** | **Bottom Dock: Onboarding** | Click **Onboarding** in bottom dock, check items, click **Copy all** on terminal commands | *"Using the bottom navigation dock, we switch to Onboarding Walkthrough. New developers get an interactive step-by-step checklist, environment setup, and one-click terminal commands with progress tracking."* |
| **1:40 - 2:00** | **Multi-Repo Switching & GitHub Import** | Select `GoogleCloudPlatform/microservices-demo` or click **Import Repository** | *"RepoNavigator seamlessly indexes multi-service systems like Google Cloud's 10-microservice demo and live GitHub repositories in real-time. Thank you!"* |

---

## 3. Required Submission Checklist (For Maximum Score)

- [x] **1. IBM Bob 2.0 Provenance Badge**: Top header includes the interactive `IBM Bob 2.0` badge displaying project proof and architecture summary.
- [x] **2. Bottom Navigation Dock**: Smooth 1-click switching between `Overview`, `Architecture Fullscreen`, `Onboarding Guide`, and `Full Chat`.
- [x] **3. Preset Zero-Latency Showcase Repos**:
  - `Demo E-Commerce System` (Frontend ──▶ Fastify REST ──▶ JWT Auth / PostgreSQL)
  - `GoogleCloudPlatform/microservices-demo` (10 Cloud-Native Kubernetes microservices)
  - `RepoNavigator Core` (AST Engine + RAG)
  - `Microservices Starter` (Kong Gateway + RabbitMQ)
- [x] **4. One-Click Quick Prompts & Clickable Module Badges**: Chat features preset prompt chips and interactive `◈ MODULE` badges that navigate to canvas nodes.
- [x] **5. Live GitHub API Engine (`/api/github`)**: Enter any public repository URL to fetch recursive file manifests and generate architecture dynamically.

---

## 4. Capturing Screenshots for `/screenshots` Folder

Capture and save these 4 key screenshots:
1. `screenshots/01_overview_cockpit.png` — The 3-column cockpit with the Architecture canvas, file explorer, and AI chat.
2. `screenshots/02_node_inspector.png` — Node inspector drawer open showing latency, endpoints, and related files.
3. `screenshots/03_onboarding_walkthrough.png` — The Onboarding view with interactive checklists and terminal commands.
4. `screenshots/04_gcp_10_microservices.png` — `GoogleCloudPlatform/microservices-demo` showing the 10-microservice cloud graph.
