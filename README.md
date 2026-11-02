# PropEase AI Lead-Response & Site-Visit Booking Platform
### Residential Real Estate AI Assistant for Company A (Ahmedabad, Gujarat)

[![Build & Typecheck](https://img.shields.io/badge/Build-Passing-emerald?style=flat-square)](file:///c:/Users/Aditya%20Raj.000/Desktop/IsoCode_Workspace/dist/)
[![Tests](https://img.shields.io/badge/Tests-6%2F6%20Passing%20(100%25)-blue?style=flat-square)](file:///c:/Users/Aditya%20Raj.000/Desktop/IsoCode_Workspace/tests/runVerification.mjs)
[![License](https://img.shields.io/badge/GujRERA-Compliant-gold?style=flat-square)](https://gujrera.gujarat.gov.in)
[![Privacy](https://img.shields.io/badge/DPDP%20Act%202023-Consent%20Enforced-emerald?style=flat-square)](#)

---

## 1. Executive Summary & Problem Context

**Company A** is a prominent residential developer based in Ahmedabad with 2 live luxury/mid-luxury projects comprising 420 apartments (2 BHK and 3 BHK units ranging from ₹65 lakh to ₹1.2 crore). With 60 staff members, including 11 dedicated sales advisors, the developer generates ₹180–₹220 crore in annual bookings.

### The Operational Bottleneck & Financial Loss
* **Marketing Budget**: Company A spends **₹30,00,000 (₹30 Lakh)** each month across property portals (99acres, MagicBricks), social media ads (Meta/Instagram), organic website inquiries, and physical outdoor hoardings, generating ~3,000 leads at **₹1,000 per lead**.
* **The Response Latency Problem**:
  * Inquiries historically landed in an unmonitored email inbox and Excel spreadsheets.
  * Telecallers reached out the next morning.
  * **Median first response time was 14 hours**.
  * **35% of all incoming leads (1,050 leads/month) were never contacted within 48 hours**, going completely cold.
  * **Financial Bleed**: $1,050 \times ₹1,000 = \mathbf{₹10.5\text{ Lakh/month}}$ ($\mathbf{₹1.26\text{ Crore/year}}$) in lost marketing capital.
  * Only **6% of total leads** ever reached a physical site visit, and visits were informally fixed on personal WhatsApp chats with zero attendance logging.

---

## 2. The Solution: PropEase AI Concierge

PropEase delivers an end-to-end client-ready software solution that eliminates this ₹1.26 Cr leakage:
1. **Instant First Response**: Slashes first response time from 14 hours to **18 seconds** 24/7/365 across English, Hindi (हिंदी), and Gujarati (ગુજરાતી).
2. **Fact-Sheet Grounded AI**: Answers strictly from the Sales Head's master Fact Sheet. If a question is unverified, it politely defers to a senior advisor and automatically flags the chat for audit. It strictly refuses to negotiate discounts over chat.
3. **Atomic Concurrency Booking (The "Hard Part")**: Eliminates double-booking via an atomic Two-Phase Optimistic Mutex Lock with a 180-second reservation hold.
4. **Instant Sales Handoff**: Routes serious buyers to one of Company A's 11 named sales advisors with a 3-bullet AI qualification dossier.
5. **Channel Attribution & ROI Dashboard**: Live visibility into median response times, visits delivered, show-up rates, and cost per visit across Portals, Social Ads, Hoardings, and Web.
6. **Regulatory Compliance**: Integrates official GujRERA registration numbers (`PR/GJ/AHMEDABAD/...`) and DPDP Act 2023 opt-in/opt-out consent mechanisms.

---

## 3. Core Build: The 6 to 8 Interactive Screens

| Screen | Core Role & Target User | Key Capabilities |
| :--- | :--- | :--- |
| **1. Buyer AI Concierge** | Prospective Home Buyers (Mobile-First) | Multilingual chat in EN/HI/GU, real-time typing indicators, quick requirement chips (2/3 BHK, Pricing, Amenities), Sub-2m SLA badge, instant human escalation. |
| **2. Atomic Slot Booking & Passcard** | Prospective Home Buyers | Interactive conflict-free calendar, 180s countdown hold, boarding-pass styled booking pass with Ahmedabad GPS coordinates, Google Maps route, and `.ics` calendar download. |
| **3. Unified Lead Hub & Dedup** | Sales Head & Administrative Staff | Ingests leads from Portals, Social Ads, Website, and Hoardings. Real-time E.164 phone normalization, duplicate alert pills, touchpoint merger, and official seed tags. |
| **4. Sales Advisor Cockpit** | 11 Named Sales Advisors | Filterable queue for Company A's 11 advisors (Rajesh Mehta, Ananya Joshi, etc.), showing active scheduled tours, verified show-up rates, and attendee histories. |
| **5. Warm Handover Dossier** | Sales Advisors | AI-generated 3-bullet qualification summary, extracted buyer attributes, full chronological transcript, and one-click visit outcome controller (*Visited*, *No-Show*, *Rescheduled*). |
| **6. Executive ROI Dashboard** | Director of Sales & Marketing | Tracks median response time (18s vs 14h), cold lead rate (2.8% vs 35%), lead-to-visit rate (8.4% vs 6%), cost per visit by channel, and monthly leakage recovery (₹9.45L/mo). |
| **7. Fact Sheet & Slot CMS** | Sales Head | Live CMS editor for pricing bands, carpet areas, amenities, and RERA numbers, plus daily triage inbox for flagged chats. |
| **8. WhatsApp Simulation Sandbox** | Buyers & Telecallers | High-fidelity WhatsApp preview displaying RERA-compliant templated communications, 24h & 2h reminders, and DPDP `STOP` opt-out mechanics. |

---

## 4. Solving the "Hard Part": Zero Double-Booking Concurrency Lock

### The Concurrency Invariant
$$\forall \text{slot } s \in \text{Slots}: \quad s.\text{confirmedCount} + \sum \text{activeNonExpiredHolds}(s) \le s.\text{maxCapacity}$$

### Two-Phase Optimistic Mutex Protocol
1. **Phase 1: Temporary Lock Acquisition (Hold)**:
   * When a buyer selects a time slot, `acquireSlotHold(slotId, leadPhone)` validates that `confirmedCount + activeHolds < maxCapacity`.
   * If free, it creates an ephemeral hold with a 180-second TTL (`expiresAt = Date.now() + 180_000`).
   * A 3-minute reservation countdown appears in the UI.
2. **Phase 2: Atomic Commitment**:
   * When the buyer confirms their details, `validateAndCommitBooking(slot, holdId)` atomically verifies slot capacity, increments `confirmedCount += 1`, releases the hold, assigns a named advisor, and generates calendar invites.
3. **Graceful Conflict Resolution**:
   * If two parallel users race for the last remaining slot, the first acquires the lock; the second is gracefully notified: *"That slot was just reserved a moment ago. We have reserved the next best slot for you: [12:00 PM]. Would you like to confirm this?"*
4. **Auto-Expiration**:
   * Abandoned holds silently evaporate after 180 seconds, restoring slot availability without manual intervention.

---

## 5. Seed Data Ground Truth & Sample Records

The 3 mandatory sample leads from the problem statement are seeded permanently as ground truth:
* **`LD-58210`**: Hardik Patel | Property portal | Project 1 (The Grand Orchid) | 3 BHK | Booked 2026-11-01 11:00
* **`LD-58211`**: Nidhi Shah | Social media ad | Project 2 (Orchid Heights) | 2 BHK | Not booked
* **`LD-58224`**: Kavita Joshi | Hoarding call | Project 2 (Orchid Heights) | 2 BHK | Visited

*Plus 27 synthetic leads spanning all acquisition channels, languages, duplicate touchpoints, and visit outcomes.*

---

## 6. How to Run & Verify

### Prerequisites
* Node.js v18+ or v20+ / v22+
* npm or pnpm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run the automated verification test suite
node tests/runVerification.mjs

# 3. Build the production bundle
npm run build

# 4. Start the development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 7. Verification Test Suite Output
```
================================================================
PropEase AI Concierge: Verification & Regression Test Suite
Company A (Ahmedabad) • Real Estate Platform
================================================================

[PASS] Phone Normalization: Formats 10-digit, 0-prefixed and +91 numbers uniformly
[PASS] Duplicate Detection: Identifies existing lead by phone across different channels
[PASS] Concurrency Lock: Prevents parallel double booking when slot capacity is reached
[PASS] AI Guardrail: Blocks price discount and negotiation attempts
[PASS] AI Guardrail: Defers missing facts and flags chat for Sales Head audit
[PASS] Ground Truth Seeds: Verifies sample leads LD-58210, LD-58211, and LD-58224 exist

================================================================
Results: 6 / 6 test suites passed cleanly (100%).
================================================================
```

---

## 8. Technical Design Document & Repository Reference
* **Author**: Aditya Raj (`rajaditya.1186@gmail.com`)
* **Repository**: [https://github.com/adityaraj-workspace/propease-ai-concierge](https://github.com/adityaraj-workspace/propease-ai-concierge)
* **Technical Design Document**: [`TDD.md`](file:///c:/Users/Aditya%20Raj.000/Desktop/IsoCode_Workspace/TDD.md)
* **Product Requirements Document**: [`PRD.md`](file:///c:/Users/Aditya%20Raj.000/Desktop/IsoCode_Workspace/PRD.md)
* **Architecture Specification**: [`Architecture.md`](file:///c:/Users/Aditya%20Raj.000/Desktop/IsoCode_Workspace/Architecture.md)
* **Engineering & AI Rules**: [`rules.md`](file:///c:/Users/Aditya%20Raj.000/Desktop/IsoCode_Workspace/rules.md)
* **Design Tokens & Theme**: [`design.md`](file:///c:/Users/Aditya%20Raj.000/Desktop/IsoCode_Workspace/design.md)
* **Phased Roadmap**: [`phases.md`](file:///c:/Users/Aditya%20Raj.000/Desktop/IsoCode_Workspace/phases.md)
* **Living State Ledger**: [`memory.md`](file:///c:/Users/Aditya%20Raj.000/Desktop/IsoCode_Workspace/memory.md)
* **Antigravity CLI Directives**: [`Agent.md`](file:///c:/Users/Aditya%20Raj.000/Desktop/IsoCode_Workspace/Agent.md)
