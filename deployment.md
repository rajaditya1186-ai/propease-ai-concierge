# Deployment & Reviewer Guide (deployment.md)
## PropEase AI Lead-Response & Site-Visit Booking Platform
### Residential Real Estate AI Assistant for Company A (Ahmedabad, Gujarat)

---

### Project Links
* **GitHub Repository**: [https://github.com/rajaditya1186/propease-ai-concierge](https://github.com/rajaditya1186/propease-ai-concierge)
* **Live Web Application**: [https://propease-ai-concierge.vercel.app](https://propease-ai-concierge.vercel.app)
* **Author / Candidate**: Aditya Raj (`rajaditya.1186@gmail.com`)

---

## 1. How to Run Locally (Step-by-Step)

The project is built as a modern, high-performance Single Page Application (SPA) using **React 18**, **TypeScript** (`strict: true`), **Vite**, and **Tailwind CSS**, with zero heavy backend dependencies required for local evaluation.

### Prerequisites
* **Node.js**: `v18.x` or higher (tested on `v20.x` and `v22.20.0`)
* **Package Manager**: `npm` (v9+) or `pnpm` / `yarn`
* **Git**: Installed and available in PATH
* **Modern Web Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari

---

### Step 1: Clone or Extract the Repository
```bash
# Clone the repository from GitHub
git clone https://github.com/rajaditya1186/propease-ai-concierge.git

# Enter the project directory
cd propease-ai-concierge
```
*(If working from the unzipped source code, open your terminal in the extracted root folder).*

---

### Step 2: Install Dependencies
Install all production and development dependencies:
```bash
npm install
```
*(This installs React, Lucide Icons, Zustand, Tailwind CSS, Vite, TypeScript, and developer tooling).*

---

### Step 3: Run the Development Server
Start the Vite local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

The terminal will output the local network URL:
```text
  VITE v5.4.21  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
Open **`http://localhost:5173`** in your browser to interact with the live application.

---

### Step 4: Run the Automated Verification Test Suite
The codebase includes 10 automated test suites verifying core invariants: phone normalization (E.164), duplicate detection, the Two-Phase Mutex Lock, anti-negotiation guardrails, missing fact deferral, official ground truth seeds, GujRERA numbers, multilingual parsing (EN/HI/GU), statutory stamp duty math (0% female concession), and DPDP opt-out state machine.

Run the test suite from your terminal:
```bash
node tests/runVerification.mjs
```
**Expected Output**:
```text
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
[PASS] GujRERA & DPDP: Validates official registration numbers and consent gate
[PASS] Multilingual Parser: Recognizes intents across English, Hindi, and Gujarati
[PASS] Statutory Math: Calculates Gujarat 4.9% stamp duty, 0% female concession, and recognizes intent
[PASS] DPDP State Machine: Handles STOP opt-out and START opt-in with RERA template verification

================================================================
Results: 10 / 10 test suites passed cleanly (100%).
================================================================
```

---

### Step 5: Build for Production & Preview Locally
To execute the strict TypeScript compiler (`tsc`) and Vite Rollup chunk-splitter:
```bash
npm run build
```
This generates an optimized, code-split production bundle inside the `dist/` directory:
* `dist/assets/vendor-react-*.js` (~133 kB / gzip: ~43 kB)
* `dist/assets/vendor-icons-*.js` (~33 kB / gzip: ~8 kB)
* `dist/assets/index-*.js` (~237 kB / gzip: ~60 kB)
* `dist/assets/index-*.css` (~60 kB / gzip: ~10 kB)

To preview the built production bundle locally:
```bash
npm run preview
```
Visit the printed URL (typically `http://localhost:4173`).

---

## 2. Cloud Deployment & Environment Variables

### Deployment Options

#### Option A: Vercel (Recommended & Zero Configuration)
1. Push your code to your GitHub repository.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Vercel auto-detects the Vite preset:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`
4. Click **Deploy**. The site will be live on a global CDN within 45 seconds.

#### Option B: Netlify
1. Connect your repository to Netlify.
2. Set **Build command**: `npm run build`.
3. Set **Publish directory**: `dist`.
4. Deploy the site.

#### Option C: Docker Container / Static Server (Self-Hosted)
A standard single-stage Nginx or multi-stage Node container can serve the static build:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### Environment Variables (Names Only)

The application includes an embedded deterministic AI knowledge engine and ground-truth RAG database, allowing all functionality, guardrails, and role interactions to run seamlessly without mandatory external API keys.

For production enterprise deployment with live external webhooks and cloud LLMs, the following environment variables are supported. **Only variable names are documented below (never secrets or values):**

| Variable Name | Purpose / Target Service | Required / Optional |
| :--- | :--- | :--- |
| `VITE_APP_ENV` | Application environment (`development`, `staging`, `production`) | Optional (defaults to `development`) |
| `VITE_BASE_URL` | Canonical public URL of the deployed application | Optional |
| `VITE_AI_MODEL` | Selected LLM backend model identifier (e.g., `gemini-1.5-pro` or `gpt-4o`) | Optional |
| `VITE_GEMINI_API_KEY` | API Key for live Gemini interactions and function-calling | Optional (uses deterministic RAG engine if omitted) |
| `VITE_WHATSAPP_API_TOKEN` | Meta WhatsApp Cloud API access token for live outbound message delivery | Optional (simulated in UI if omitted) |
| `VITE_WHATSAPP_PHONE_NUMBER_ID` | Meta WhatsApp Cloud API verified business phone number ID | Optional |
| `VITE_WHATSAPP_VERIFY_TOKEN` | Webhook verification token for inbound WhatsApp message callbacks | Optional |
| `VITE_REDIS_URL` | Redis connection URI for production multi-pod distributed Redlock mutex | Optional (uses in-memory Two-Phase Mutex if omitted) |
| `VITE_CRM_WEBHOOK_URL` | Outbound webhook endpoint for live CRM synchronization (Salesforce / LeadSquared) | Optional |

To supply these variables locally, create a `.env.local` file in the project root:
```bash
# .env.local (Template)
VITE_APP_ENV=production
VITE_BASE_URL=https://propease-ai-concierge.vercel.app
VITE_AI_MODEL=
VITE_GEMINI_API_KEY=
VITE_WHATSAPP_API_TOKEN=
VITE_WHATSAPP_PHONE_NUMBER_ID=
VITE_REDIS_URL=
VITE_CRM_WEBHOOK_URL=
```

---

## 3. Demo Login Details & Reviewer Quick-Start

### Frictionless Reviewer Access
To ensure evaluators and reviewers can inspect all facets of the software without getting blocked by authentication hurdles or SMS OTP friction, the application operates in **Zero-Friction Reviewer Mode**:
* **No sign-up or registration required**.
* All four enterprise roles are immediately accessible via the **Top Navigation Bar** and **Header Role Switcher**:
  1. **Buyer Concierge** (`/chat`): Public home-buyer portal.
  2. **Lead Hub** (`/leads`): Sales admin ingestion & deduplication console.
  3. **Sales Workspace** (`/workspace`): Named sales advisor queues and dossiers.
  4. **Executive Dashboard** (`/dashboard`): Director's attribution and ROI sandbox.
  5. **Fact Sheet CMS & Platform Limits** (`/cms`): Sales Head master knowledge editor and triage queue.

---

### Pre-Seeded Evaluation Personas & Credentials

#### Persona 1: Prospective Home Buyer (Ahmedabad)
* **Name**: Hardik Patel
* **Phone**: `+91 98250 12345` (E.164)
* **Identifier**: `LD-58210`
* **Profile**: Interested in 3 BHK at *The Grand Orchid* (S.G. Highway), ₹95 Lakh – ₹1.2 Crore budget.
* **Reviewer Action**:
  * Open the **Buyer Concierge** tab.
  * Click the pre-seeded **"Hardik Patel (3 BHK)"** chip in the conversation bar to simulate his conversation.
  * Click **"Book Site Visit"** to experience the 180s Two-Phase Mutex Lock and receive the Boarding Passcard.

#### Persona 2: Additional Evaluator Ground Truth Leads
* **Nidhi Shah (`LD-58211`)**: 2 BHK, ₹65L – ₹80L budget, *Orchid Heights* (Shela), Preferred Language: Gujarati (`gu`).
* **Kavita Joshi (`LD-58224`)**: 3 BHK, High intent, urgent weekend tour slot.

#### Persona 3: Named Sales Advisors (11 Sales Executives)
* **Reviewer Access**: Open the **Sales Workspace** tab.
* **Advisor Queue Selector**: Reviewer can switch between any of Company A's 11 real sales advisors:
  * `Rajesh Mehta` (Senior Sales Advisor, Gujarati / Hindi / English) — *Default active advisor*
  * `Ananya Joshi` (Luxury Portfolio Specialist)
  * `Vikram Dave` (Site Visit Coordinator)
  * `Neha Patel`, `Amit Shah`, `Pooja Trivedi`, `Karan Desai`, `Meera Bhatt`, `Sanjay Parikh`, `Ritu Sharma`, `Bhavin Vora`
* **Reviewer Action**:
  * Inspect the **Warm Handover Dossier** with the 3-bullet AI qualification digest.
  * Update the visit outcome using the **Visit Status Controller** (*Show/Visited*, *No-Show*, *Rescheduled*).
  * Click **"WhatsApp Simulation"** to inspect RERA visit templates and test DPDP `STOP` opt-out.

#### Persona 4: Director of Sales & Marketing
* **Reviewer Access**: Open the **Executive Dashboard** tab.
* **Reviewer Action**:
  * Review live SLA metrics (**18 seconds** median response time vs 14 hours historical benchmark).
  * Review cold lead reduction (**2.8%** unreached vs 35% previously).
  * Interact with the **Director's ROI Scenario Sandbox** sliders (adjust monthly ad spend and site-visit conversion to simulate revenue recovery).

---

## 4. Evaluator 1-Click Verification Scenarios

For rapid grading and review, the UI features embedded 1-click test triggers:

| Scenario | Location | How to Trigger | What It Demonstrates |
| :--- | :--- | :--- | :--- |
| **₹5L Discount Refusal** | Buyer Concierge | Click **"₹5L Discount?"** chip | Proves GujRERA Section 11(4) anti-negotiation guardrail. AI strictly refuses to haggling over chat. |
| **Missing Fact Deferral** | Buyer Concierge | Click **"Metro Phase 3?"** chip | Proves AI hallucination block. AI defers unverified claims to sales advisor and flags chat for audit. |
| **Lead Deduplication** | Unified Lead Hub | Click **"Test Deduplication"** button | Ingests repeat inquiry from Hardik Patel via Hoarding. Merges touchpoint without creating duplicate rows. |
| **5-Buyer Race Condition** | Header Pill / Modal | Click **"Test Mutex"** / **"Run Concurrency Stress Test"** | Fires 5 simultaneous bookings for the last remaining slot. Exactly 1 succeeds; 4 receive concurrency backoffs. Zero double-booking. |
| **DPDP Opt-Out** | WhatsApp Simulator | Type or click **`STOP`** | Immediate communication suspension under DPDP Act 2023. Replying **`START`** re-activates consent. |
| **Statutory Cost & EMI** | Buyer Concierge | Ask *"What is the stamp duty?"* | AI calculates Gujarat 4.9% stamp duty, 0% female concession, 1% registration, and 20-year EMI benchmarks. |

---

### Support & Contact
If you encounter any issues during local setup or testing, please contact:
* **Aditya Raj**: `rajaditya.1186@gmail.com`
