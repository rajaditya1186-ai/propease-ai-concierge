# System Architecture & Technical Design Document (Architecture.md)
## Real Estate AI Lead-Response & Site-Visit Booking Platform (Company A)

---

### 1. High-Level Architectural Flow

The platform is designed around a **Single Source of Truth** for leads, visit schedules, and property facts. It strictly separates buyer-facing concierge interactions, staff workflows, and administrative governance:

```
+-----------------------------------------------------------------------------------------------------------------------+
|                                                  MULTI-CHANNEL INGESTION                                              |
|    [Property Portals (99acres, MagicBricks)]    [Meta / Social Ads]    [Website Inbound]    [Hoarding Calls / QR]     |
+-----------------------------------------------------------+-----------------------------------------------------------+
                                                            |
                                                            v
+-----------------------------------------------------------+-----------------------------------------------------------+
|                                        UNIFIED LEAD INGESTION & DEDUPLICATION                                         |
|    - E.164 Phone Normalization (+91 ...)                  - Cross-Channel Duplicate Detection & Auto-Tagging          |
|    - Source Attribution & Campaign Metadata               - Touchpoint History Ledger & Merge Controller              |
+-----------------------------------------------------------+-----------------------------------------------------------+
                                                            |
                            +-------------------------------+-------------------------------+
                            |                                                               |
                            v                                                               v
+---------------------------+-------------------------------+   +---------------------------+---------------------------+
|               MULTILINGUAL AI CONCIERGE                   |   |            ATOMIC CONCURRENCY BOOKING ENGINE          |
|    - Languages: English, Hindi (हिंदी), Gujarati (ગુજરાતી) |   |    - Real-time Slot Availability Matrix                   |
|    - Strict Grounding: Sales Head Approved Fact Sheet     |   |    - Two-Phase Optimistic Mutex Lock (180s Hold)          |
|    - Intent Parser: Budget, BHK, Urgency, Human Handoff   |   |    - Zero Double-Booking Concurrency Invariant            |
|    - AI Boundaries: Anti-Negotiation, Hallucination Block |   |    - Location Pin & .ics Calendar Invite Generator        |
|    - Direct Booking Tool Calling Integration              |   |    - Automated 24h & 2h Reminder Simulator               |
+---------------------------+-------------------------------+   +---------------------------+---------------------------+
                            |                                                               |
                            +-------------------------------+-------------------------------+
                                                            |
                                                            v
+-----------------------------------------------------------+-----------------------------------------------------------+
|                                           EXECUTIVE WORKSPACE & DISPATCH                                              |
|    - Named Advisor Routing (11 Sales Executives)          - Instant Handover Dossier (3-Bullet AI Summary)            |
|    - Full Chronological Chat History with Flags           - Visit Outcome Manager (Show / No-Show / Rescheduled)      |
|    - WhatsApp Simulator with RERA Opt-in Templates        - DPDP Consent & Communication Audit Ledger                 |
+-----------------------------------------------------------+-----------------------------------------------------------+
                                                            |
                                                            v
+-----------------------------------------------------------+-----------------------------------------------------------+
|                                          EXECUTIVE DASHBOARD & GOVERNANCE CMS                                         |
|    - Median First Response Time Tracker (< 2m vs 14h)     - Ad Spend Leakage Recovery Calculator (₹10.5L/mo saved)    |
|    - Cost-Per-Visit by Channel (Portal, Social, Hoard)    - Sales Head Fact Sheet & RERA Master CMS                   |
|    - Show-Up Rate & Conversion Analytics (6% to 8% target)- Flagged Chat Triage & Audit Console                       |
+-----------------------------------------------------------------------------------------------------------------------+
```

---

### 2. Technology Stack Selection & Rationale

| Layer | Selected Tech | Architectural Benefit |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18+ with Vite & TypeScript** | Strict type safety (`"strict": true`), instantaneous HMR, optimized component tree. |
| **Design System** | **Tailwind CSS + Lucide Icons** | Bespoke architectural aesthetic (warm stone `#F8F7F4`, charcoal slate `#111418`, champagne bronze `#C5A059`). Zero generic templates. |
| **State Management** | **Zustand + Reactive Store** | Atomic, decoupled state slices for Leads, Bookings, Fact Sheets, and Chat Transcripts with zero unnecessary re-renders. |
| **Concurrency Mutex** | **In-Memory Two-Phase Lock with Expiring Holds** | ACID-style optimistic slot locking guaranteeing strictly zero double-booking under race conditions. |
| **AI Agent & Tool Calling** | **Schema-Driven Intent Engine + Tool Executor** | Deterministic function-calling pipeline allowing the AI to execute real slot checks and bookings with strict fact-sheet grounding. |
| **Internationalization** | **Bespoke Multilingual Tokenizer (EN, HI, GU)** | Zero external overhead; instant contextual switching between English, Hindi, and Gujarati scripts. |

---

### 3. Folder & File Structure

```
IsoCode_Workspace/
├── PRD.md                                 # Product Requirement Document
├── Architecture.md                        # System Architecture & Technical Design Document
├── rules.md                               # Engineering standards, AI boundaries & security rules
├── phases.md                              # 8-phase execution roadmap
├── design.md                              # Design system, color tokens & typography specs
├── memory.md                              # Dynamic progress log & active task ledger
├── Agent.md                               # Operational instructions for agy CLI
├── TDD.md                                 # Technical Design Document with labeled assumptions
├── package.json                           # Root scripts and workspace orchestration
├── tsconfig.json                          # TypeScript configuration
├── vite.config.ts                         # Vite builder configuration
├── tailwind.config.js                     # Tailwind CSS design token mappings
├── index.html                             # Single Page Application root
├── src/
│   ├── main.tsx                           # App entry point
│   ├── App.tsx                            # Primary layout & role switcher (Buyer / Sales / Admin / Executive)
│   ├── index.css                          # Global design variables & font imports
│   ├── types/
│   │   ├── lead.ts                        # Lead, source, duplicate, and touchpoint models
│   │   ├── booking.ts                     # Slot, booking status, executive assignment models
│   │   ├── factSheet.ts                   # Project specifications, RERA, unit configs
│   │   ├── chat.ts                        # Message, sender, language, intent, flagged state
│   │   ├── tools.ts                       # AI tool calling interfaces and execution payloads
│   │   └── analytics.ts                   # KPI metrics, channel spend, conversion rates
│   ├── data/
│   │   ├── seedData.ts                    # Official sample data (LD-58210, LD-58211, LD-58224) + 27 synthetic leads
│   │   ├── factSheetData.ts               # Approved fact sheet for Project 1 & Project 2
│   │   ├── executivesData.ts              # 11 named sales executives with capacities & languages
│   │   └── translations.ts                # Multilingual string dictionary (EN, HI, GU)
│   ├── store/
│   │   ├── useLeadStore.ts                # Unified lead list, deduplication logic, source filter
│   │   ├── useBookingStore.ts             # Atomic slot reservation, concurrency lock, reminders
│   │   ├── useFactSheetStore.ts           # Admin CMS editable facts & RERA records
│   │   └── useChatStore.ts                # Active conversation state, transcripts, flagged chats
│   ├── services/
│   │   ├── aiEngine.ts                    # Grounded response generator, intent extraction, guardrails
│   │   ├── aiBookingTools.ts              # Implementation of AI function calling tools
│   │   ├── deduplicationEngine.ts         # Phone/email normalization, similarity matching
│   │   ├── concurrencyLock.ts             # Mutex/Optimistic lock implementation for slot booking
│   │   └── reminderScheduler.ts           # 24h & 2h reminder simulator with WhatsApp template
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx                 # Navigation, view switcher (Buyer, Sales, Admin, Dashboard), SLA indicator
│   │   │   └── ComplianceBanner.tsx       # GujRERA disclaimer & DPDP consent badge
│   │   ├── buyer/
│   │   │   ├── BuyerChatWidget.tsx        # Multilingual chat interface with language selector & quick requirement chips
│   │   │   ├── SlotPickerModal.tsx        # Interactive calendar slot selection with concurrency hold timer
│   │   │   └── BookingPasscard.tsx        # Boarding-pass confirmation card with Maps pin & .ics download
│   │   ├── sales/
│   │   │   ├── ExecutiveWorkspace.tsx     # Queue for 11 named executives with calendar schedule
│   │   │   ├── HandoverDossier.tsx        # AI summary, extracted budget, full transcript & visit status controller
│   │   │   └── WhatsAppSimulatorModal.tsx # Simulated WhatsApp thread with RERA templates & DPDP STOP opt-out
│   │   ├── admin/
│   │   │   ├── UnifiedLeadList.tsx        # All leads, duplicate badge, merge modal, channel filters
│   │   │   ├── DeduplicationModal.tsx     # Side-by-side duplicate comparison and resolution
│   │   │   ├── ConcurrencyStressTestModal.tsx # Live interactive race condition stress tester for atomic locking
│   │   │   ├── FactSheetEditor.tsx        # Live editor for prices, amenities, RERA details
│   │   │   └── FlaggedChatAudit.tsx       # Review chats where human handoff was triggered
│   │   └── dashboard/
│   │       └── ExecutiveDashboard.tsx     # High-level KPIs, channel attribution, leakage recovery & show-up rate
│   └── utils/
│       ├── formatters.ts                  # Currency (₹ Lakh / Crore), date, phone formatting
│       └── calendarExport.ts              # Generate .ics calendar invite payload
└── tests/
    └── runVerification.mjs                # Comprehensive regression test suite (Deduplication, Concurrency, AI Guardrails, Seeds)
```

---

### 4. Data Schemas & TypeScript Models

#### 4.1. Lead Entity (`Lead`)
```typescript
export interface Lead {
  id: string; // e.g. "LD-58210"
  name: string; // e.g. "Hardik Patel"
  phone: string; // Normalized E.164 (+919825012345)
  email?: string;
  source: 'Property portal' | 'Social media ad' | 'Website' | 'Hoarding call';
  projectInterest: 'Project 1' | 'Project 2' | 'Both';
  configurationWanted: '2 BHK' | '3 BHK' | 'Unspecified';
  budgetRange?: string; // e.g. "₹95L - ₹1.2Cr"
  preferredLanguage: 'en' | 'hi' | 'gu';
  status: 'New' | 'In Conversation' | 'Site Visit Booked' | 'Visited' | 'Cold' | 'Unresponsive';
  firstResponseTimeSeconds?: number;
  assignedExecutiveId?: string;
  isDuplicate: boolean;
  duplicateOfId?: string;
  touchpoints: Array<{
    source: string;
    timestamp: string;
    campaign?: string;
  }>;
  dpdpConsentGiven: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### 4.2. Slot & Booking Entity (`Booking`)
```typescript
export interface SiteVisitSlot {
  slotId: string; // e.g. "SLOT-20261105-1100-P1"
  projectId: 'Project 1' | 'Project 2';
  date: string; // "YYYY-MM-DD"
  timeString: string; // e.g. "11:00 AM"
  maxCapacity: number; // e.g. 2 simultaneous appointments
  confirmedCount: number;
  activeHoldCount: number;
  assignedExecutiveIds: string[];
}

export interface SiteVisitBooking {
  bookingId: string; // e.g. "BK-9021"
  leadId: string;
  leadName: string;
  leadPhone: string;
  projectId: 'Project 1' | 'Project 2';
  projectName: string;
  date: string;
  timeString: string;
  assignedExecutiveId: string;
  assignedExecutiveName: string;
  status: 'Booked' | 'Visited' | 'No-Show' | 'Cancelled' | 'Rescheduled';
  locationPin: {
    lat: number;
    lng: number;
    address: string;
    googleMapsUrl: string;
  };
  reminders: {
    reminder24hScheduled: string;
    reminder24hSent: boolean;
    reminder2hScheduled: string;
    reminder2hSent: boolean;
  };
  bookedAt: string;
}
```

#### 4.3. AI Booking Tool Schemas
As specified in the prompt (*"AI: chat assistant with a booking tool"*), the AI assistant is equipped with 4 structured tool definitions:

```typescript
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

// Tool 1: Check Real Available Slots
export interface CheckAvailableSlotsArgs {
  projectId: 'Project 1' | 'Project 2';
  date?: string; // Optional target date (defaults to upcoming 3 days)
}

// Tool 2: Acquire Temporary Concurrency Hold (180s)
export interface HoldSlotArgs {
  slotId: string;
  leadPhone: string;
}

// Tool 3: Atomic Commitment of Site Visit Booking
export interface ConfirmBookingArgs {
  slotId: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  projectId: 'Project 1' | 'Project 2';
  configuration: '2 BHK' | '3 BHK';
}

// Tool 4: Request Human Executive Escalation
export interface EscalateToExecutiveArgs {
  leadId: string;
  reason: string;
  summary: string;
  urgency: 'Standard' | 'High';
}
```

---

### 5. The Concurrency Locking Mechanism (The "Hard Part")

```
   Buyer Interaction                            Concurrency Mutex Lock Engine                          Data Store
          |                                                   |                                            |
          |--- 1. Selects Slot (e.g. Sunday 11:00 AM) ------->|                                            |
          |                                                   |--- 2. Evaluate (Confirmed + Active Holds) >|
          |                                                   |                                            |
          |                                                   |<-- 3. Return (Available: true, Cap: 2) ----|
          |                                                   |                                            |
          |<-- 4. Grant Ephemeral Hold (180s TTL) ------------| [Hold Registered with Expiry Timestamp]    |
          |                                                   |                                            |
          |--- 5. Buyer Enters Details & Confirms ----------->|                                            |
          |                                                   |--- 6. Atomic Commit: Confirmed += 1 ------>|
          |                                                   |       Release Hold, Assign Executive       |
          |<-- 7. Booking Confirmed (Passcard & Pin) ---------|                                            |
          |                                                   |                                            |
  Parallel Contender (Races for Same Last Slot)               |                                            |
          |--- A. Selects Same Slot ------------------------->|                                            |
          |                                                   |--- B. Evaluate Cap: (Confirmed+Holds >= 2)-|
          |<-- C. Slot Conflict Rejected ---------------------|                                            |
                  Suggest Closest Available (12:00 PM)        |                                            |
```

* **Holding Phase**: Prevents other buyers from snatching a slot while a buyer is typing their phone number.
* **Auto-Expiration**: If a user abandons the form, the 180s hold silently evaporates, restoring slot availability without manual administrative cleanup.
* **Atomic Mutex**: The commit action verifies that `slot.confirmedCount < slot.maxCapacity` at the exact instant of execution.
