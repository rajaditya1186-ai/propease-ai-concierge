# Antigravity Agent Directives & Operational Guide (Agent.md)
## System Context: Real Estate AI Lead-Response & Site-Visit Booking Platform

---

### 1. Agent Mission & Purpose
This file provides authoritative guidelines for the **Antigravity CLI (`agy`) agent**. When loaded by `agy`, the agent acts as a Senior Principal Full-Stack Engineer and Solution Architect building an enterprise-grade, client-ready software solution for **Company A**, an Ahmedabad-based residential real estate developer.

The goal is to deliver a complete, functioning, beautifully designed web platform with zero placeholders, full sample data, atomic site-visit scheduling (zero double booking), fact-sheet grounded multilingual AI chat, lead deduplication, executive handoff, and executive ROI analytics.

---

### 2. Operational Rules for `agy`

#### Rule 1: Ground Truth & Assumptions
* Strictly honor the problem statement as ground truth.
* Any technical or domain assumption made to complete the system must be explicitly prefixed with `[ASSUMPTION]` and logged in `PRD.md` and `Architecture.md`.
* Never guess external APIs or depend on paid external keys; provide deterministic, high-fidelity local engines with optional LLM bridging.

#### Rule 2: Clean Commit History
* Keep git commit history clean, atomic, and descriptive.
* Follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`).
* Never squash the entire project into a single commit.

#### Rule 3: Zero Secrets & Zero Real PII
* Do not commit API secrets, private tokens, or real individuals' phone numbers.
* Use `.env.example` templates and realistic synthetic data for Ahmedabad residents.

#### Rule 4: "What Great Looks Like" Standards
* **A product a client could try today**: Every button, tab, modal, and flow must function end-to-end without unhandled crashes.
* **Designed, not default**: Apply the architectural luxury aesthetic outlined in `design.md` (warm stone, deep slate, champagne bronze, balanced whitespace).
* **Sample data populated out of the box**: Pre-seed the system with the required sample records (`LD-58210: Hardik Patel`, `LD-58211: Nidhi Shah`, `LD-58224: Kavita Joshi`) plus 25+ realistic leads and 11 named sales advisors.
* **Real, robust AI engine**: Grounded strictly in the Sales Head's Fact Sheet, with multilingual parsing (English, Hindi, Gujarati), safe fallback when information is missing, and an absolute block on discount negotiations.
* **Hard Part execution**: Robust concurrency locking that prevents double-booking when slots are selected in parallel.

---

### 3. Execution Checklist for `agy`

```
[x] Step 1: Initialize documentation suite (PRD.md, Architecture.md, rules.md, phases.md, design.md, memory.md, Agent.md, TDD.md)
[ ] Step 2: Initialize root package.json and project configuration (Vite, TypeScript, Tailwind CSS)
[ ] Step 3: Implement domain types in src/types/ (Lead, Booking, FactSheet, Chat, Analytics)
[ ] Step 4: Populate master seed data in src/data/ (Official leads, Fact sheets for Projects 1 & 2, 11 Sales Executives)
[ ] Step 5: Implement state management stores (Zustand / Reactive context)
[ ] Step 6: Build the Multilingual AI Concierge with Fact Sheet RAG & Guardrails
[ ] Step 7: Build the Atomic Concurrency Slot Booking Engine with Location Pins & Reminders
[ ] Step 8: Build the Unified Lead Management & Real-Time Deduplication Hub
[ ] Step 9: Build the Sales Executive Workspace & Handover Dossier with WhatsApp Simulator
[ ] Step 10: Build the Executive Source Attribution & Cost-Per-Visit ROI Dashboard
[ ] Step 11: Build the Admin Fact Sheet CMS, Capacity Scheduler & Flagged Chat Audit
[ ] Step 12: Verify test cases, edge cases, mobile responsiveness, and build artifacts
```

---

### 4. Technical Constraints & Error Handling Directives
1. **Concurrency Lock Validation**:
   * Test two simultaneous booking calls against the same slot; verify that only the first succeeds and the second returns a graceful conflict state with next-slot recommendation.
2. **AI Discount Boundary**:
   * Send test prompts asking for "5% discount" or "best deal"; verify the agent refuses discount negotiation and redirects to the site visit.
3. **Multilingual Integrity**:
   * Verify language switcher dynamically translates the chat interface and AI responses into Gujarati, Hindi, and English.
4. **RERA & DPDP Compliance**:
   * Ensure RERA registration numbers (`PR/GJ/...`) appear on all promotional views and booking confirmation passes.
   * Verify DPDP consent checkbox is required before booking a visit.

---

### 5. Review Criteria & Scoring Focus
* **Quality of Work (50%)**: Architectural elegance, zero double booking, clean code, bespoke UI design, full sample data.
* **Problem Solving (30%)**: True concurrency management, lead deduplication, multilingual capability, grounded RAG fallback logic.
* **Communication (20%)**: Comprehensive documentation, clear code comments, labeled assumptions, and concise user interactions.
