# ANEMIA-SCAN Design System and Application Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive clinical-tech application shell with stable routing and useful placeholder workspaces for ANEMIA-SCAN.

**Architecture:** `AppRouter` owns route matching and redirects while `AppShell` owns the shared semantic frame. Desktop and mobile navigation are separate focused components backed by a shared route configuration, and each feature route renders a small, honest placeholder page into the shell outlet.

**Tech Stack:** React 19, React Router 7, TypeScript, Vitest, Testing Library, Lucide React, CSS custom properties, Fontsource.

---

### Task 1: Lock The Shell Contract With Tests

**Files:**
- Create: `src/app/AppShell.test.tsx`
- Modify: `src/App.test.tsx`

- [ ] Write a test rendering `AppShell` in a memory router and assert that `Skrining baru`, `Data wilayah`, and `Kinerja model` are present.
- [ ] Write router tests asserting `/` redirects to `/screening`, unknown routes return to `/screening`, and `/history` marks `Riwayat` active.
- [ ] Run `pnpm test -- src/app/AppShell.test.tsx src/App.test.tsx` and confirm failure because the new shell and router do not exist.

### Task 2: Add Routing And Focused Feature Placeholders

**Files:**
- Create: `src/app/AppRouter.tsx`
- Create: `src/features/screening/ScreeningPage.tsx`
- Create: `src/features/dashboard/DashboardPage.tsx`
- Create: `src/features/history/HistoryPage.tsx`
- Create: `src/features/evidence/EvidencePage.tsx`
- Modify: `src/App.tsx`

- [ ] Define `/screening`, `/dashboard`, `/history`, and `/evidence` as children of the shared shell.
- [ ] Redirect `/` and `*` to `/screening` with `replace` semantics.
- [ ] Give each placeholder a route-specific heading, short status context, and clear unavailable/coming-next state without simulating unfinished features.
- [ ] Run the focused tests and confirm routing assertions pass.

### Task 3: Build The Shared Application Frame

**Files:**
- Create: `src/app/AppShell.tsx`
- Create: `src/components/navigation/navigationItems.ts`
- Create: `src/components/navigation/IconRail.tsx`
- Create: `src/components/navigation/ContextSidebar.tsx`
- Create: `src/components/navigation/MobileNav.tsx`

- [ ] Add a skip link, semantic header, navigation landmarks, and `main` outlet target.
- [ ] Render a dark green icon rail, contextual Indonesian navigation, centered command bar, workspace tabs, and utility actions using Lucide icons.
- [ ] Use React Router `NavLink` active state consistently across desktop and mobile navigation.
- [ ] Ensure every icon-only action has an accessible name and tooltip.
- [ ] Run the focused tests and confirm the shell contract remains green.

### Task 4: Establish Tokens And Responsive Styling

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `src/main.tsx`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] Install bundled variable sans and mono font packages.
- [ ] Define clinical green, coral, neutral, typography, spacing, radius, elevation, and focus tokens.
- [ ] Style the desktop grid at 1024px and above, collapse the contextual sidebar on tablet, and switch to compact header plus fixed bottom navigation at 760px and below.
- [ ] Include bottom content clearance for mobile navigation, overflow guards, reduced-motion handling, and visible keyboard focus.
- [ ] Run `pnpm test`, `pnpm lint`, and `pnpm build`.

### Task 5: Visual Verification And Delivery

**Files:**
- Review all files changed by Tasks 1-4.

- [ ] Start Vite and capture one desktop and one mobile screenshot.
- [ ] Check navigation visibility, content clearance, text wrapping, active state, focus styling, and horizontal overflow.
- [ ] Fix visual or semantic issues, rerun `pnpm test`, `pnpm lint`, and `pnpm build`, then review `git diff --check` and `git diff`.
- [ ] Commit only the application-shell work with a focused message and report the resulting SHA.
