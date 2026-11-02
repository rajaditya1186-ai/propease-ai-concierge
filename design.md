# Design System & UI/UX Specification (design.md)
## Visual Language: Architectural Luxury, Restraint & Calm

---

### 1. Design Philosophy
The homes developed by Company A represent substantial life milestones (₹65 lakh to ₹1.2 crore). The user interface must reflect this emotional weight:
* **Calm & Architectural**: Generous whitespace, razor-sharp alignment, balanced proportions, and minimal visual noise.
* **Warm, Tactile Palette**: Evoking limestone, warm travertine, deep slate, brushed brass, and muted forest sage. No garish neon or generic corporate blue.
* **Clarity of Purpose**: Nothing appears on screen without an explicit function.
* **Mobile-First Conversational Experience**: Over 80% of prospective buyers browse on smartphones in evening hours; the chat interface must feel as fluid and native as a luxury concierge app.

---

### 2. Color Palette & Semantic Tokens

```
+-----------------------------------------------------------------------------------------------+
| PRIMARY LUXURY BASE                                                                           |
| Charcoal Slate (Deep Canvas) : #111418   (Headers, hero surfaces, luxury card darks)          |
| Architectural Stone (Warm Gray): #F8F7F4 (Main background, calm paper texture)               |
| Travertine Border (Muted Gray): #E6E4DF  (Dividers, structural borders, card outlines)        |
+-----------------------------------------------------------------------------------------------+
| METALLIC ACCENT (BRONZE & GOLD)                                                               |
| Champagne Bronze             : #C5A059   (Primary brand accent, key action buttons, badges)   |
| Warm Amber Bronze            : #A37F38   (Hover states, focused inputs, active icons)         |
| Subtle Champagne Glow        : #FBF7EE   (Subtle highlights, selected chip backgrounds)       |
+-----------------------------------------------------------------------------------------------+
| SEMANTIC STATUS COLORS                                                                        |
| Forest Emerald (Success/Show): #1B7A4D   (Site visit confirmed, high show-up rate, verified)  |
| Terracotta Rust (Alert/Loss) : #B84233   (Cost leakage, uncontacted leads, slot clash alert)  |
| Amber Honey (In-Progress)    : #D9822B   (Waiting for executive, hold expiring, tentative)    |
| Soft Indigo (Portal/Source)  : #3E54AC   (Channel attribution badges, RERA certification)     |
+-----------------------------------------------------------------------------------------------+
```

#### Tailwind Color Variables Mapping
* `bg-surface-primary`: `#F8F7F4` (Warm architectural paper)
* `bg-surface-card`: `#FFFFFF` (Crisp elevated white card)
* `bg-surface-dark`: `#111418` (Executive dark mode / luxury header)
* `border-subtle`: `#E6E4DF` (Subtle architectural hair-line border)
* `accent-bronze`: `#C5A059`
* `accent-bronze-dark`: `#A37F38`
* `text-primary`: `#181A1D` (Deep graphite, high readability)
* `text-muted`: `#686E78` (Refined secondary label)
* `text-bronze`: `#94712E`

---

### 3. Typography Scale & Hierarchy

* **Primary Font Family (Sans-Serif)**: `Plus Jakarta Sans`, `Inter`, or `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  * Modern, clean, geometrically balanced, exceptional legibility on mobile screens.
* **Display / Accent Font (Optional for Project Titles)**: `Playfair Display` or `Cinzel` (used sparingly for luxury project headers).

#### Type Scale
| Level | Font Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | 2rem (32px) | 1.2 | 700 / Bold | Dashboard headline, Welcome hero |
| **H1 Section** | 1.5rem (24px) | 1.3 | 600 / Semi-Bold | Screen headers, Project titles |
| **H2 Card Header** | 1.125rem (18px) | 1.4 | 600 / Semi-Bold | Card titles, modal headers |
| **Body (Regular)** | 0.9375rem (15px) | 1.5 | 400 / Regular | Chat messages, lead rows, descriptions |
| **Body (Emphasis)** | 0.9375rem (15px) | 1.5 | 600 / Semi-Bold | Executive names, pricing figures |
| **Caption / Badge** | 0.75rem (12px) | 1.4 | 500 / Medium | RERA numbers, timestamps, source tags |

---

### 4. Component Design Specifications

#### 4.1. Multilingual Chat Interface (Buyer View)
* **Header**: Deep slate background (`#111418`), gold verified checkmark, project selector, and language pill switcher (`English | हिंदी | ગુજરાતી`).
* **Sub-2-minute SLA Beacon**: Subtle pulsing emerald green status dot: *"Average reply time: 18s • 24/7 Live Concierge"*.
* **Chat Bubbles**:
  * *Assistant*: Crisp white background with delicate 1px border (`#E6E4DF`), rounded-2xl with bottom-left anchor, generous 14px padding.
  * *Buyer*: Deep slate with crisp white text, rounded-2xl with bottom-right anchor.
* **Quick Response Chips**: Horizontally scrollable pill buttons with subtle champagne glow on hover (`₹65L - ₹90L`, `3 BHK Luxury`, `View RERA Details`, `Schedule Site Visit`).

#### 4.2. Site Visit Booking Passcard
* Styled like an executive boarding pass:
  * Top section: Project Name, Ahmedabad GPS coordinates, designated Sales Advisor.
  * Middle section: Date (e.g. *Saturday, Nov 7, 2026*) & Slot (*11:00 AM – 11:45 AM*).
  * Bottom section: Interactive Google Maps directions button, `.ics` calendar download button, and GujRERA registration stamp.

#### 4.3. Unified Lead Table
* Clean tabular layout with roomy padding (12px vertical per row).
* Source Tag Pills:
  * Property Portal: Deep Indigo
  * Social Media Ad: Royal Rose/Violet
  * Hoarding Call: Warm Amber
  * Website Form: Forest Emerald
* Duplicate indicator: Subtle amber badge with touchpoint counter (e.g., `⚡ 2 Touchpoints (Portal + Ad)`).

#### 4.4. Executive KPI Dashboard Widgets
* Stat cards with clear micro-comparisons:
  * Metric number in bold 28px font.
  * Trend indicator (e.g., `↓ Slashed from 14h to 18s`, `↑ Up from 6% to 8.4%`).
  * Sub-text explaining the financial impact (e.g., `₹9.45 Lakh ad waste recovered this month`).

---

### 5. Layout & Responsive Grid

* **Navigation**: Persistent top header with role selector (`Buyer Concierge`, `Sales Executive Workspace`, `Admin & Fact Sheet CMS`, `Executive Dashboard`).
* **Desktop**: 12-column responsive layout with max-width `1440px` centered on viewport.
* **Mobile (< 768px)**:
  * Bottom sheet navigation or clean top drawer.
  * Full-bleed chat stream with sticky input bar and one-tap quick action chips.
  * Zero horizontal scroll traps.
