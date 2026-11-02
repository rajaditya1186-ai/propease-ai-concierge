# Project Phased Execution Roadmap (phases.md)
## Real Estate AI Lead-Response & Site-Visit Booking Platform

---

### Phase 1: Project Setup, Type System & Foundation
* **Objective**: Establish the core project scaffolding, compile configuration, and type definitions strictly mapped to the problem statement.
* **Deliverables**:
  * [x] Initialize project files and dependencies (`package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`).
  * [x] Draft `PRD.md`, `Architecture.md`, `rules.md`, `phases.md`, `design.md`, `memory.md`, and `Agent.md`.
  * [ ] Create domain type definitions in `src/types/` (`lead.ts`, `booking.ts`, `factSheet.ts`, `chat.ts`, `analytics.ts`).
  * [ ] Seed official dataset in `src/data/seedData.ts`:
    * `LD-58210: Hardik Patel (Property portal, Project 1, 3 BHK, Booked 2026-11-01 11:00)`
    * `LD-58211: Nidhi Shah (Social media ad, Project 2, 2 BHK, Not booked)`
    * `LD-58224: Kavita Joshi (Hoarding call, Project 2, 2 BHK, Visited)`
    * Plus 25+ realistic leads spanning all channels, languages, and booking states.
  * [ ] Populate `src/data/factSheetData.ts` with master facts for Project 1 (The Grand Orchid) and Project 2 (Orchid Heights).
  * [ ] Populate `src/data/executivesData.ts` with Company A's 11 named sales advisors.

---

### Phase 2: Unified Lead Management & Real-Time Deduplication
* **Objective**: Build the single source of truth for all incoming leads with automated deduplication and channel tagging.
* **Deliverables**:
  * [ ] Implement `src/services/deduplicationEngine.ts` (E.164 phone normalization, email hashing, fuzzy name matching).
  * [ ] Build `src/store/useLeadStore.ts` with actions for ingesting, filtering, searching, and merging duplicate leads.
  * [ ] Build `src/components/admin/UnifiedLeadList.tsx`:
    * Filter by channel (Portal, Social Ad, Website, Hoarding).
    * Filter by status (New, Chatting, Booked, Visited, Cold).
    * Visual badges for duplicate alerts and touchpoint history.
  * [ ] Build `src/components/admin/DeduplicationModal.tsx` for inspecting and merging duplicate inquiries.

---

### Phase 3: Multilingual AI Concierge & Fact Sheet Grounding
* **Objective**: Deliver a responsive, mobile-first conversational UI capable of answering in English, Hindi, and Gujarati, strictly grounded in the approved fact sheet.
* **Deliverables**:
  * [ ] Implement `src/data/translations.ts` covering English, Hindi (हिंदी), and Gujarati (ગુજરાતી) UI and conversational strings.
  * [ ] Build `src/services/aiEngine.ts`:
    * Intent classification (`INQUIRE_PRICE`, `AMENITIES`, `BOOK_VISIT`, `HUMAN_ESCALATION`, `DISCOUNT_BLOCKED`).
    * Strict Fact Sheet retrieval mechanism.
    * Fallback deferral & chat auto-flagging when queries exceed the fact sheet.
    * Hardcoded block on quoting custom discounts.
  * [ ] Build `src/components/buyer/BuyerChatWidget.tsx`:
    * Real-time typing indicators, quick-reply requirement chips (2 BHK / 3 BHK, Budget selector).
    * Sub-2-minute SLA badge ("Average response: 18 seconds").
    * GujRERA registration numbers prominently visible in the header and disclaimer.
    * DPDP 2023 consent checkbox.

---

### Phase 4: Atomic Site-Visit Booking Engine (Zero Double-Booking)
* **Objective**: Implement the critical booking algorithm that prevents slot clashes, manages executive capacity, and outputs location pins and calendar invites.
* **Deliverables**:
  * [ ] Build `src/services/concurrencyLock.ts`:
    * In-memory atomic mutex lock with 180-second reservation hold.
    * Conflict resolution: Graceful re-routing to adjacent available slots if contention occurs.
  * [ ] Build `src/store/useBookingStore.ts`:
    * Slot inventory state per project per day.
    * Concurrency-safe booking action.
  * [ ] Build `src/components/buyer/SlotPickerModal.tsx`:
    * Interactive calendar with real-time available/busy indicator.
    * Instant slot selection with countdown timer.
  * [ ] Build `src/components/buyer/BookingPasscard.tsx`:
    * Visual boarding-pass style confirmation.
    * Interactive Google Maps location preview with Ahmedabad GPS coordinates.
    * Dynamic `.ics` calendar file download.
  * [ ] Implement `src/services/reminderScheduler.ts`:
    * Simulated 24-hour and 2-hour pre-visit notifications with opt-out links.

---

### Phase 5: Sales Executive Workspace & Handover Dossier
* **Objective**: Provide Company A's 11 sales advisors with an actionable cockpit to manage site visits and follow up on warm leads.
* **Deliverables**:
  * [ ] Build `src/components/sales/ExecutiveWorkspace.tsx`:
    * Select active executive (e.g., Rajesh Mehta, Ananya Joshi).
    * Assigned leads and calendar schedule for the day.
  * [ ] Build `src/components/sales/HandoverDossier.tsx`:
    * AI-generated summary bullet points.
    * Extracted client requirements (BHK, Budget, Timeline, Source).
    * Complete chronological chat history with flagged inquiries highlighted.
  * [ ] Build `src/components/sales/VisitStatusController.tsx`:
    * Update visit outcome: *Show / Completed*, *No-Show*, *Rescheduled*, *Booked Unit*.
  * [ ] Build `src/components/sales/WhatsAppSimulatorModal.tsx`:
    * WhatsApp-styled phone preview displaying RERA-compliant templated communications.

---

### Phase 6: Executive Analytics, Cost-Per-Visit & Leakage Dashboard
* **Objective**: Present the Director of Sales & Marketing with financial and operational ROI metrics.
* **Deliverables**:
  * [ ] Build `src/components/dashboard/ExecutiveDashboard.tsx`:
    * **Median Response Time**: 18 seconds vs historical 14 hours.
    * **Cold Lead Reduction**: 3.2% vs historical 35% (slashed below the 5% target).
    * **Lead-to-Visit Rate**: 8.4% vs historical 6% (surpassing the 8% target).
    * **Monthly Revenue Saved**: Live calculation of ad spend saved (~₹9.45 Lakh/mo).
  * [ ] Build `src/components/dashboard/AttributionChart.tsx`:
    * Channel breakdown: Portal vs. Social Ads vs. Hoarding vs. Website.
    * Cost per completed visit calculation (Channel Spend ÷ Verified Visits).
  * [ ] Build `src/components/dashboard/ShowUpRateGauge.tsx`:
    * Booked vs. Completed vs. No-Show visual breakdown.

---

### Phase 7: Admin Fact Sheet & Slot Capacity CMS
* **Objective**: Enable the Sales Head to modify property specs and manage calendar availability.
* **Deliverables**:
  * [ ] Build `src/components/admin/FactSheetEditor.tsx`:
    * Live editing of carpet area, price bands, amenities, and RERA numbers.
    * Immediate propagation of updated facts to the AI knowledge base.
  * [ ] Build `src/components/admin/SlotCapacityManager.tsx`:
    * Configure time windows, blackout holidays, and sales executive capacity.
  * [ ] Build `src/components/admin/FlaggedChatAudit.tsx`:
    * Daily triage inbox for the Sales Head to review chats where AI deferred questions or where buyers asked for human assistance.

---

### Phase 8: Verification, Edge Cases & Client Delivery Polish
* **Objective**: Ensure the entire app runs seamlessly end to end, with zero empty states, comprehensive mock data, and rock-solid edge case handling.
* **Deliverables**:
  * [ ] End-to-end user journey verification: Ingest lead $\rightarrow$ AI chat $\rightarrow$ Book slot $\rightarrow$ Executive handoff $\rightarrow$ Mark visit $\rightarrow$ View dashboard ROI.
  * [ ] Edge case test passes: Double booking stress test, invalid phone number handling, unsupported query handling, language switching mid-chat.
  * [ ] Verification of RERA and DPDP Act 2023 compliance notices.
  * [ ] Production build and start verification.
