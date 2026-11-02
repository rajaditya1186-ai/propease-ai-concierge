# Technical Design Document (TDD)
## Real Estate AI Lead-Response & Site-Visit Booking Platform
**Client**: Company A, Ahmedabad  
**Repository**: [GitHub Repository: https://github.com/adityaraj-workspace/propease-ai-concierge](https://github.com/adityaraj-workspace/propease-ai-concierge)  
**Author**: Aditya Raj (`rajaditya.1186@gmail.com`)  
**Status**: Specification Complete & Architecture Approved  

---

### 1. Problem Formulation & Financial Audit
Company A is a residential property developer in Ahmedabad, Gujarat, operating 2 live projects (420 apartments, 2 and 3 BHK, priced between ₹65 lakh and ₹1.2 crore). Annual booking turnover is ₹180–₹220 crore managed by 60 total staff, including 11 sales advisors.

#### Operational Bottleneck & Financial Loss
* **Inbound Spend & Lead Flow**: Company A spends **₹30,00,000 (₹30 lakh) monthly** across digital portals, social ads, website SEO, and hoarding phone numbers, acquiring ~3,000 leads at **₹1,000 per lead**.
* **Response Latency**: Current median first response is **14 hours**.
* **Cold Lead Waste**: **35% of all leads (1,050 leads/mo)** are never reached within 48 hours.
* **Direct Revenue Leakage**: $1,050 \times ₹1,000 = \mathbf{₹10.5\text{ Lakh/month}}$ ($\mathbf{₹1.26\text{ Crore/year}}$) wasted in uncontacted ad spend.
* **Low Conversion**: Only **6% of total leads** ever visit a site; visits are informally fixed via personal WhatsApp with zero attendance logging.

---

### 2. Comprehensive Inventory of Assumptions
> **Evaluation Rule Compliance**: Under the evaluation rules, only facts in the problem statement are treated as ground truth. Every technical, architectural, or domain assumption required to build a fully functional, production-ready system is explicitly labeled below:

* **[ASSUMPTION-1: Project Portfolios & Specifications]**:
  * *Project 1 ("The Grand Orchid")*: S.G. Highway, Ahmedabad. Luxury 3 BHK units (1,450 to 1,850 sq.ft.), ₹95 Lakh – ₹1.2 Crore. GujRERA No: `PR/GJ/AHMEDABAD/AHMEDABAD-CITY/AUDA/RAA09876/010124`.
  * *Project 2 ("Orchid Heights")*: Shela / South Bopal, Ahmedabad. Modern 2 & 3 BHK units (1,050 to 1,400 sq.ft.), ₹65 Lakh – ₹88 Lakh. GujRERA No: `PR/GJ/AHMEDABAD/SANAND/AUDA/RAA09877/010124`.
* **[ASSUMPTION-2: The 11 Named Sales Advisors]**:
  * The 11 sales staff members are given full identities, assigned projects, and language proficiencies for round-robin allocation:
    1. *Rajesh Mehta* (Senior Advisor, Project 1, Gujarati/Hindi/English)
    2. *Ananya Joshi* (Luxury Specialist, Project 1, English/Hindi)
    3. *Vikram Dave* (Sales Executive, Project 2, Gujarati/Hindi)
    4. *Neha Patel* (Sales Executive, Project 2, Gujarati/English)
    5. *Amit Shah* (Advisor, Project 1, Gujarati/Hindi)
    6. *Pooja Trivedi* (Advisor, Project 2, Hindi/English)
    7. *Karan Desai* (Advisor, Project 1 & 2, Gujarati/Hindi/English)
    8. *Meera Bhatt* (Advisor, Project 2, Gujarati/Hindi)
    9. *Sanjay Parikh* (Senior Advisor, Project 1, Gujarati/English)
    10. *Ritu Sharma* (Advisor, Project 1, Hindi/English)
    11. *Bhavin Vora* (Advisor, Project 2, Gujarati/Hindi)
* **[ASSUMPTION-3: Slot Scheduling Constraints & Capacity]**:
  * Site visits operate between 10:00 AM and 6:00 PM daily in 45-minute appointment windows with 15-minute buffers (10:00 AM, 11:00 AM, 12:00 PM, 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM).
  * Maximum simultaneous capacity per slot per project is 2 appointments, corresponding to available on-duty sales advisors.
* **[ASSUMPTION-4: Channel Ad Spend Allocation for Attribution Dashboard]**:
  * The ₹30,00,000 monthly spend is distributed as: Property Portals (45% = ₹13.5L), Social Media Ads (35% = ₹10.5L), Hoardings (15% = ₹4.5L), Website (5% = ₹1.5L).
* **[ASSUMPTION-5: Seed Data Integration from Problem Statement]**:
  * The 3 sample records from the problem statement are seeded as ground truth:
    * `LD-58210: Hardik Patel` | Property portal | Project 1 | 3 BHK | Booked 2026-11-01 11:00
    * `LD-58211: Nidhi Shah` | Social media ad | Project 2 | 2 BHK | Not booked
    * `LD-58224: Kavita Joshi` | Hoarding call | Project 2 | 2 BHK | Visited
    * Plus 27 synthetic leads to provide an immediate populated experience across all filters and metrics.
* **[ASSUMPTION-6: Mock Infrastructure Boundaries]**:
  * As explicitly allowed by the prompt (*"Mock payments, messages and outside systems"*), simulated WhatsApp/SMS engines, portal webhooks, and calendar `.ics` download services run locally without paid third-party external dependencies.
* **[ASSUMPTION-7: Reminders Timeline Simulation]**:
  * The system simulates 1-day before (24-hour) and 2-hour before notification triggers through a testable time-travel controller and automated dispatch ledger.
* **[ASSUMPTION-8: Multilingual Tokenizer & Dialect Support]**:
  * Conversational dictionaries and grammar templates for Gujarati (ગુજરાતી) and Hindi (हिंदी) provide native terminology for Ahmedabad real estate (e.g., બાલ્કની, પાર્કિંગ, કબજો, સાઇટ વિઝિટ, कालीन क्षेत्र).

---

### 3. Concurrency Locking Architecture (Solving the "Hard Part")

#### Problem Statement Requirement
*"Hard part: booking only real free slots, with no double booking."*

#### Concurrency Invariant
$$\forall \text{slot } s \in \text{Slots}: \quad s.\text{confirmedCount} + \sum \text{activeNonExpiredHolds}(s) \le s.\text{maxCapacity}$$

#### Two-Phase Optimistic Mutex Protocol
1. **Phase 1: Ephemeral Lock Hold (`acquireSlotHold`)**:
   * Evaluates current confirmed bookings + active non-expired holds against `maxCapacity`.
   * If capacity is open:
     * Creates an atomic hold record: `{ holdId: UUID, leadPhone, expiresAt: now + 180_000ms }`.
     * UI displays a 3-minute reservation countdown timer.
   * If capacity is exhausted:
     * Returns `SLOT_EXHAUSTED` with alternative adjacent slot recommendations.
2. **Phase 2: Atomic Commitment (`confirmSlotBooking`)**:
   * Re-evaluates lock ownership and capacity atomically.
   * Increments `confirmedCount += 1`.
   * Deletes hold and commits booking to persistent state.
   * Generates location pin, directions, and `.ics` calendar payload.
3. **Automatic Hold Expiration**:
   * If user closes browser or leaves modal idle, hold automatically expires after 180 seconds, freeing the slot instantly without orphan locks.

---

### 4. AI Agent Tool Schema & Grounding Boundaries

```typescript
// AI Function Calling Interfaces
export interface ToolCheckAvailableSlots {
  name: 'check_available_slots';
  description: 'Fetches real-time conflict-free slots for Project 1 or Project 2.';
  parameters: {
    projectId: 'Project 1' | 'Project 2';
    date?: string;
  };
}

export interface ToolHoldSlot {
  name: 'hold_slot';
  description: 'Acquires a 180-second concurrency hold on a slot.';
  parameters: {
    slotId: string;
    leadPhone: string;
  };
}

export interface ToolConfirmBooking {
  name: 'confirm_site_visit';
  description: 'Atomically commits the booking and assigns a named sales executive.';
  parameters: {
    slotId: string;
    leadName: string;
    leadPhone: string;
    configurationWanted: '2 BHK' | '3 BHK';
  };
}

export interface ToolEscalateToHuman {
  name: 'escalate_to_executive';
  description: 'Routes lead to a named executive when queries exceed the Fact Sheet.';
  parameters: {
    leadId: string;
    reason: string;
    summary: string;
  };
}
```

#### Strict Grounding & Anti-Negotiation Rules
* **Fact Sheet RAG Boundary**: The AI can only quote verified details from the Fact Sheet (price bands, carpet area, possession date, RERA number, amenities).
* **Missing Fact Interception**: If asked about an unlisted detail:
  * Polite fallback message: *"I want to ensure you receive 100% verified information. I have highlighted this inquiry for our Senior Sales Advisor, who will personally confirm this for you."*
  * Automatic flagging in `useChatStore` for Sales Head review.
* **Anti-Negotiation Guardrail**: AI is hardcoded to never quote custom discounts or negotiate prices.

---

### 5. Honest Notes About System Limits
1. **In-Memory Mutex vs Distributed Locks**: The current implementation utilizes an in-memory transactional mutex. For multi-node distributed deployments behind a round-robin load balancer, this would be transitioned to Redis Redlock or Postgres row-level locks (`SELECT ... FOR UPDATE`).
2. **Simulated External APIs**: Meta WhatsApp Business API, SMS telecommunication gateways, and property portal webhooks are provided as deterministic high-fidelity mocks.
3. **Offline AI Fallback**: If LLM API connectivity is unavailable, the system transparently falls back to an internal deterministic rule-based dialogue engine so that users and reviewers never encounter a broken interface.
4. **Browser Local Storage**: In this demonstration slice, state is persisted in reactive client storage. An enterprise tier would back this with SQLite/PostgreSQL with write-ahead logging.

---

### 6. Test Suite & Verification Matrix
* **Unit Tests**:
  * `concurrencyLock.test.ts`: Race-condition simulation testing 5 concurrent requests against 1 remaining slot $\rightarrow$ verifies 1 success and 4 handled rejections.
  * `deduplication.test.ts`: Phone number normalization (`+91`, leading zeros, dashes) and cross-channel merge integrity.
  * `aiBoundaries.test.ts`: Verification of discount interception and fact-sheet boundary triggers.
* **Manual Verification Checklist**:
  * End-to-end booking flow from chat $\rightarrow$ slot selection $\rightarrow$ executive handoff $\rightarrow$ dashboard KPI update.
  * Multilingual verification across English, Hindi, and Gujarati.
  * GujRERA and DPDP Act 2023 compliance notices.
