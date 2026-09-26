# 🧪 RepoNavigator AI — Quality Assurance & Testing Guide

This guide details how to verify every layer and phase of RepoNavigator AI to ensure rock-solid stability during development and live hackathon presentations.

---

## 🚦 Quick Test Commands

```bash
# 1. Start development server
npm run dev

# 2. Run TypeScript check & production build
npm run build

# 3. Run ESLint linting
npm run lint
```

---

## 📊 Phase-by-Phase Verification Matrix

| Phase | Feature | Manual Test Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **Phase 1** | Header | Observe top status indicator | Pulsing green dot with `● Repository Ready` | [ ] |
| **Phase 1** | Bottom Dock | Click `Overview`, `Architecture`, `Onboarding`, `Chat` | Switches active view pane cleanly | [ ] |
| **Phase 2** | File Tree | Type `auth` in repository search | Shows only `auth/` folder and nested files | [ ] |
| **Phase 2** | Code Peek | Click `app/page.tsx` | Code modal opens with syntax lines & copy button | [ ] |
| **Phase 2** | Repo Switch | Click top repo dropdown, select another repo | Updates active repository and re-indexes | [ ] |
| **Phase 3** | Graph Canvas | Drag canvas, scroll mousewheel | Pan and zoom operate smoothly at 60 FPS | [ ] |
| **Phase 3** | Layer Filter | Click `Database` category filter | Highlights database node, dims other layers | [ ] |
| **Phase 3** | Live Traffic | Click `Live Flow` toggle button | Edge particle animations toggle on/off | [ ] |
| **Phase 4** | Node Inspector | Click `Backend Gateway` node on canvas | Inspector drawer slides in with metrics & files | [ ] |
| **Phase 4** | Subsystem Deep Dive | Click `Explain this subsystem` in drawer | Chat opens with breakdown of backend layer | [ ] |
| **Phase 5** | AI Copilot | Click prompt chip *"Explain Frontend to Database flow"* | Streams multi-step explanation with code card | [ ] |
| **Phase 5** | Node Cross-Link | Click `@database` link inside AI response bubble | Architecture canvas highlights Database node | [ ] |
| **Phase 6** | Onboarding | Click checkbox on Step 1 checklist item | Progress bar updates percentage live | [ ] |
| **Phase 6** | Terminal Copy | Click `Copy all` on terminal commands | Copies formatted shell commands to clipboard | [ ] |
| **Phase 7** | Command Palette | Press `Ctrl+K` or `⌘K` | Search dialog opens with instant fuzzy search | [ ] |

---

## 🔍 Detailed Test Scripts

### Test Script 1: Three-Way Synchronization (Tree ↔ Graph ↔ Chat)
1. In the **Left Column** (`REPOSITORY`), hover over `📁 auth`.
   - **Verification**: The `Auth & IAM Service` node on the middle canvas should glow.
2. In the **Middle Column** (`ARCHITECTURE MAP`), click on the `Payment & Billing` node.
   - **Verification**: The right column AI Chat context updates to `Context: Payment & Billing`.
3. In the **Right Column** (`AI CHAT`), send query: *"Where is the webhook received?"*.
   - **Verification**: AI references `payment/webhook.ts` and includes a copyable code snippet.
4. Click on the file reference in chat.
   - **Verification**: The File Viewer Modal opens showing `payment/webhook.ts` line by line.

### Test Script 2: Responsive Viewport Check
1. **Desktop (> 1280px)**: Overview mode renders all 3 columns simultaneously without horizontal scroll.
2. **Tablet (768px - 1024px)**: Left tree and right chat collapse into clean drawer toggles or bottom bar navigation.
3. **Mobile (< 768px)**: Bottom bar tabs allow full-screen focus on Architecture map, Onboarding checklist, or AI Copilot.

### Test Script 3: Edge Cases & Error Handling
1. **Empty Search Query**: Clear search input in file explorer — verify full tree re-expands gracefully.
2. **Rapid Tab Switching**: Rapidly toggle between `Overview` ↔ `Onboarding` ↔ `Architecture` — verify React Flow canvas maintains zoom level and node positions.
3. **Copy to Clipboard in Protected Environments**: Verify fallback toast notification if clipboard permissions are restricted.
4. **Invalid Repository URL**: Type non-existent URL in import modal — verify error message is shown and does not crash UI.

---

## 🏆 Final Pre-Demo Sanity Checklist (T-Minus 10 Mins)
- [ ] Development server running on `http://localhost:3000` with zero console errors.
- [ ] Browser window sized to standard 16:9 1080p resolution.
- [ ] Zoom level reset to default `100%` (`Ctrl+0` / `⌘0`).
- [ ] Initial chat history reset to default greeting.
- [ ] Command Palette (`⌘K`) tested once to ensure smooth cache warm-up.
