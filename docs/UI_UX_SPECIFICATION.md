# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### MASTER BLUEPRINT: COMPREHENSIVE UI/UX SPECIFICATIONS MANUAL & SCREEN INTERACTION CATALOG (v1.0.0)

---

## 1. EXECUTIVE SUMMARY & COHESIVE EXPERIENCE PHILOSOPHY

This document serves as the authoritative, implementation-ready **UI/UX Specifications Manual and Screen Interaction Catalog** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national **"Sudan 2035 Digital Sovereignty Directive,"** this manual establishes exact, unambiguous behavioral and interactive standards for every screen, portal, dialog, and workflow wizard.

The goal is to provide a single, comprehensive reference for developers, engineers, QA auditors, and business analysts to implement the entire digital platform within Google Firebase Studio and future national digital frameworks without requiring design reinterpretation.

```
+----------------------------------------------------------------------------------------+
|                              Human-Centered UX Strategy                                |
|                                                                                        |
|  [Inclusive Citizen Access] ◄───► [Strict Standard Forms] ◄───► [Fast-Track Approvals] │
|       (Mobile Touch, RTL)          (Structured Validation)         (Executive Insights)│
+----------------------------------------------------------------------------------------+
```

### Core UX Principles:
1.  **Citizen-Centered Transparency:** Complex regulatory administrative tasks are broken down into logical, guided step-by-step processes that explain requirements upfront.
2.  **Mobile-First Touch & Gesture Foundations:** All interfaces are designed first for touch targets (minimum **44x44 pixels**) to support mobile-first environments, then expand gracefully for high-density desktop displays.
3.  **Strict Bilingual Parity (RTL/LTR Symmetry):** Interface components dynamically flip layouts between Arabic (*DIN Next Arabic*, Right-to-Left) and English (*DIN Next*, Left-to-Right) without alignment degradation.
4.  **Zero Aesthetic Friction & No Tech-Larping:** Interfaces are free of arbitrary graphs, status messages, or fake telemetry logs. Every pixel supports task execution, and typography size and color contrast are used to establish visual hierarchy.
5.  **AIOps Advisory Visual Isolation:** AI-generated recommendations are separated visually using distinct cards and disclaimers to prevent users from confusing recommendations with official ministry decisions.

---

## 2. MAIN LAYOUT GRID & PORTAL SPECIFICATIONS

The platform utilizes a structured layout system designed to adapt seamlessly across diverse screen resolutions.

```
                       [ 1280px Maximum Workspace Width ]
┌────────────────────────────────────────────────────────────────────────┐
│  Sidebar Margin  │  Column 1  │  Column 2  │  Column 3  │  Right Margin │
│      (24px)      │   (Gap:    │   16px)    │            │    (24px)     │
└──────────────────┴────────────┴────────────┴────────────┴───────────────┘
```

### 2.1 The Global Portal Grid System
*   **Desktop Layout Grid (>= 1024px):**
    *   *Columns:* 12 Columns.
    *   *Gutter:* 24px fixed.
    *   *Outer Margin:* 32px or Auto-centered (restricted to a maximum content width of **1280px**).
    *   *Navigation:* Persistent left sidebar (width: 260px) paired with a persistent global header (height: 70px).
*   **Tablet Layout Grid (640px - 1023px):**
    *   *Columns:* 8 Columns.
    *   *Gutter:* 16px.
    *   *Outer Margin:* 24px.
    *   *Navigation:* Left sidebar collapses into an icon-only dock (width: 70px) or is hidden behind a drawer menu.
*   **Mobile Layout Grid (< 640px):**
    *   *Columns:* 4 Columns.
    *   *Gutter:* 12px.
    *   *Outer Margin:* 16px.
    *   *Navigation:* No sidebar. Global navigation is handled via a bottom-sticky tab bar (height: 64px) with high-contrast icons.

---

## 3. COMPREHENSIVE SCREEN SPECIFICATIONS CATALOG

This section contains exact, granular behavioral and data specifications for core platform screens.

---

### 3.1 Public Portal: Commercial Search Console (`SCR-PUB-SEARCH`)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SCR-PUB-SEARCH Screen Layout                      │
├────────────────────────────────────────────────────────────────────────┤
│ Header: [ MCI National Crest ]                      [ Language Toggle ] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                      البحث عن السجلات والأسماء التجارية               │
│                  Search Commercial Names & Registrations               │
│                                                                        │
│  [ Search Input field: Enter company name, registration, or ID... ]    │
│                                                                        │
│  Filters: [x] Active Only   [ ] LLCs   [ ] States (All)   [ ] Year     │
│                                                                        │
│  [ Results Section / Empty State / Loading Shimmer / AI Assist ]       │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ Footer: Official Ministry Portals & Verification Disclaimer            │
└────────────────────────────────────────────────────────────────────────┘
```

*   **Screen ID:** `SCR-PUB-SEARCH`
*   **Screen Name:** Commercial Search Console | منصة الاستعلام عن السجلات والشركات
*   **Module Association:** `MOD-REG-COMM` (Commercial Registry)
*   **User Types:** Citizens, Foreign Investors, Legal Researchers, Public Officers.
*   **Business Goal:** Provide transparent, public lookup for registered businesses and name reservations to prevent duplicates and support trade clarity.
*   **User Goal:** Instantly verify if a specific company name is registered, check its active licensing status, or find a business's registration details.
*   **Entry Conditions:** Navigating to the homepage or clicking "Sovereign Name Search" from the public directory.
*   **Exit Conditions:**
    *   Clicking a result row ──► Routes to Company Detail Card (`SCR-PUB-COMP-DETAIL`).
    *   Clicking "Log in to Reserve Name" ──► Routes to Identity Portal login (`SCR-AUTH-LOGIN`).
*   **Primary Actions:**
    *   *Execute Search:* Initiated via typing and hitting `ENTER`, tapping the magnifying glass, or speaking via voice input.
    *   *Filter Results:* Expandable accordion filters to narrow results by registration date, business category, or state.
*   **Required Data & Display Fields:**
    *   *Inputs:* Query String (alphanumeric, supporting both Arabic and English characters).
    *   *Outputs (Result Cards):* Company Name (Bilingual), Registration Number (CR), Registration Date, Legal Entity Type (e.g., LLC, Partnership), Active Status (Green/Red Chip), and State/Locality.
*   **Verification & Validation Rules:**
    *   Search input is sanitized to strip malicious script inputs (XSS protection).
    *   Special characters are stripped; search supports partial name matches.
*   **Loading State:** Replaces results panel with a 3-row list of card skeletons (shimmer effect matching `motion-duration-normal`).
*   **Empty State:** Displays a custom vector illustration of a document folder with text: *"No active registrations found matching this name. Would you like to reserve this name now?"* accompanied by a primary "Reserve Name" action button.
*   **Accessibility Features:**
    *   Input field contains an explicit `aria-label="البحث عن الأسماء التجارية"`.
    *   Results list utilizes the live-region tag `aria-live="polite"` so screen readers read results counts upon updates.
*   **AI Support Opportunity:** Includes an optional AI Assistant panel that analyzes semantic searches (e.g., *"Show food packaging factories in Khartoum"*), auto-selecting correct category filters.

---

### 3.2 Secure Identity Gate: Multi-Factor Authentication (`SCR-AUTH-MFA`)

*   **Screen ID:** `SCR-AUTH-MFA`
*   **Screen Name:** Multi-Factor Verification Gate | بوابة التحقق الثنائي الآمنة
*   **Module Association:** `MOD-CORE-PLAT` (Identity & Access Management)
*   **User Types:** Authenticated Citizens, Caseworkers, Inspectors, Executives.
*   **Business Goal:** Secure high-value digital transactions and profile entries by requiring a second factor.
*   **User Goal:** Enter verification code to access account.
*   **Entry Conditions:** Triggered immediately after entering valid login credentials or when initiating a sensitive action (e.g., submitting a license cancellation).
*   **Exit Conditions:**
    *   Valid verification ──► Routes to secure User Dashboard (`SCR-PORT-DASH`).
    *   Clicking "Cancel" ──► Routes to home portal.
*   **Primary Actions:**
    *   *Submit Code:* Automated trigger on typing the 6th digit, or manual click of "Verify Code".
    *   *Resend Code:* Triggers a new SMS/Email OTP, disabled for a 60-second cooldown period.
*   **Required Data & Display Fields:**
    *   *Inputs:* 6-Digit OTP String.
    *   *Display Fields:* Destination obfuscated phone/email (e.g., `+249 9X XXX X52`), Countdown Timer (displays remaining time out of 5 minutes).
*   **Form & Validation Rules:**
    *   OTP field accepts only numeric characters. Non-numeric input is blocked automatically.
    *   The OTP box splits visually into 6 individual blocks with autofocus advancing to the next block upon entry.
    *   Auto-pasting a copied 6-digit code fills all blocks.
*   **Error State:** Entering an invalid or expired code displays a warning text below the input: *"The code entered is incorrect or expired. Please check your messages and try again."* The input borders change to `color-status-danger` with a horizontal shake animation.
*   **Security Controls:**
    *   Max of 3 failed attempts before locking the user's login session for 15 minutes.
    *   Actions are logged with IP address and timestamp.

---

### 3.3 Casework Workspace: Pending Reviews Queue (`SCR-EMP-QUEUE`)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SCR-EMP-QUEUE Layout                            │
├────────────────────────────────────────────────────────────────────────┤
│ Top: Casework Queue Dashboard [ Claim Next ]       Filter: [ Pending ] │
├────────────────────────────────────────────────────────────────────────┤
│  Data Table:                                                           │
│  [x] ID       | Service Type    | Applicant     | SLA Remaining | Action│
│  [ ] CR-1029  | New LLC Regis.  | Nile Flour Ltd| 14 Hours      | Review│
│  [ ] IL-4920  | Industrial Lic. | Red Sea Salt  | 2 Days        | Review│
│  [ ] CR-1035  | Name Change     | Al-Bashir Co  | Breach Alert  | Review│
├────────────────────────────────────────────────────────────────────────┤
│ Footer: Displaying 1-10 of 48 items     [ Prev Page ]  [ Next Page ]  │
└────────────────────────────────────────────────────────────────────────┘
```

*   **Screen ID:** `SCR-EMP-QUEUE`
*   **Screen Name:** Pending Reviews Queue | لوحة تدقيق طلبات السجلات والتراخيص المعلقة
*   **Module Association:** `MOD-CORE-PLAT` / `MOD-REG-COMM` (Shared Workspace)
*   **User Types:** Caseworkers, Legal Review Officers, Department Supervisors.
*   **Business Goal:** Provide a high-throughput, organized queue of pending service applications to meet Service Level Agreements (SLAs).
*   **User Goal:** Efficiently claim, review, and process pending applications without system latency.
*   **Entry Conditions:** Successful login by authorized employee.
*   **Exit Conditions:** Clicking "Review" in a row ──► Opens Document Audit details panel (`SCR-EMP-AUDIT`).
*   **Primary Actions:**
    *   *Claim Next Task:* Picks the oldest pending high-priority task, opening its audit page.
    *   *Bulk Reassign:* Allows supervisors to select multiple files and reassign them to specific officers.
*   **Filters:** Group applications by: Service Type, SLA Threshold, Submission Date, or State.
*   **Required Data & Display Fields:**
    *   *Display Columns:* Application ID (Monospaced), Service Name, Applicant Entity Name, Submission Timestamp, SLA Timer Status (Green chip for safe, yellow for near-breach, red flashing chip for breached SLA), and Assigned Officer.
*   **Loading State:** Skeleton shimmers for all table rows.
*   **Empty State:** Displays a green success banner with text: *"All clear! No pending applications in your assigned queue. Good job!"*
*   **AIOps Integration:** Displays an AI Priority Score next to applications, highlighting files that match historical risk profiles or missing criteria, allowing officers to triage reviews.

---

### 3.4 Industrial Site Audit & Environmental Compliance Review (`SCR-IND-AUDIT`)

*   **Screen ID:** `SCR-IND-AUDIT`
*   **Screen Name:** Environmental Compliance Audit Panel | لوحة تدقيق الالتزام البيئي والترخيص الصناعي
*   **Module Association:** `MOD-IND-LIC` (Industrial Services)
*   **User Types:** Industrial Audit Officers, Environmental Inspectors, Department Managers.
*   **Business Goal:** Ensure that industrial facilities meet environmental and zoning standards before issuing operational licenses.
*   **User Goal:** Review site photos, inspection checklists, GPS coordinates, and toxic waste management plans to determine compliance.
*   **Entry Conditions:** Click "Conduct Audit" on an assigned industrial license file from the workspace queue.
*   **Exit Conditions:**
    *   Click "Issue License" ──► Triggers Digital Signature Dialog and routes to Success page.
    *   Click "Request Remediation" ──► Opens Rejection dialog and updates applicant's portal status.
*   **Primary Actions:**
    *   *Verify Compliance Checklist:* Interactive checkboxes for required safety metrics.
    *   *View Geographic Coordinates:* Opens interactive map widget showing factory location relative to municipal zones and local communities.
    *   *Launch AI Audit Assistant:* Generates an automated zoning check report.
*   **Required Data & Display Fields:**
    *   *Display Fields:* Factory Name, Industrial Sector (e.g., Chemicals, Textiles), Planned Annual Output, Coordinates, Water Disposal Plan, Field Inspector Checklist, and Site Photos.
*   **Zoning Policy Rule:**
    *   If the planned facility is classified as "Heavy Chemical Manufacturing," coordinates must be checked to verify the facility is located at least **5,000 meters** away from residential zones. If the distance is less, the system displays a warning and blocks approval.
*   **AI Capabilities:** Generates risk reports by matching site plans and water plans with local environmental data, flagging potential pollution risks.
*   **Accessibility Features:**
    *   Site photos must display descriptive alternative text (ALT tags) provided by inspectors.
    *   Full keyboard support to navigate the map widget using standard directional keys.

---

## 4. DESIGN OF WIZARDS & STEP-BY-STEP USER PATHWAYS

To simplify complex processes, the platform divides applications into logical, multi-step wizards.

```
[ Step 1: Name verification ] ──► [ Step 2: Shareholders ] ──► [ Step 3: Documents ] ──► [ Step 4: Pay ]
```

### 4.1 Company Incorporation Wizard (`WIZ-CR-LLC`)
*   **Parent Screen:** Secure User Dashboard (`SCR-PORT-DASH`)
*   **Target Users:** Local Entrepreneurs, Corporate Representatives, International Investors.
*   **Progress Stepper:** Horizontal tracking bar on desktop, circular progress circle on mobile, showing current step and completed items.

#### Step 1: Commercial Name Validation
*   *Field Inputs:* Approved Name Reservation Certificate Number (6 Alphanumeric digits, monospaced format).
*   *Validation Rule:* The system queries `MOD-REG-COMM` database to verify that the certificate is active and reserved under the current user's profile.
*   *Error Handling:* If invalid, displays message: *"This reservation number is invalid or has expired. Please verify your reservation number or register a new commercial name."* Moves focus back to the input box.

#### Step 2: Shareholder & Capital Allocation
*   *Field Inputs:*
    *   Shareholder List (Sub-form with add/remove rows): National ID (Sudanese Citizens) or Passport Number (Foreign Investors), Name, Share Percentage, Capital Contribution (Monetary).
    *   Total Corporate Capital: BigDecimal field with Currency Selector (SDG/USD).
*   *Validation Rules:*
    *   The sum of all shareholder percentages must equal exactly **100%**.
    *   Individual share capital contributions must sum to match the total corporate capital.
    *   If any shareholder is a foreign citizen, the system checks sectors restrictions. If the selected industry is restricted (e.g., local small-scale agriculture), foreign equity is capped at **49%** unless a Ministerial Waiver is uploaded.
*   *Auto-Save Behavior:* Sub-form edits are saved to a temporary draft collection in Firestore every 15 seconds, preventing data loss on disconnection.

#### Step 3: Document Uploads & AI OCR Scan
*   *Field Inputs:* Scanned copies of shareholder IDs, Draft Articles of Association (PDF format only, maximum 15MB).
*   *Interaction Design:* High-contrast drop zone area.
*   *Validation Rules:*
    *   Files must pass background antivirus and mime-type signature checks.
    *   AI runs OCR on uploaded PDF Articles of Association, scanning for required clauses (e.g., standard dispute resolution methods and profit sharing distributions) and matching names against the shareholder database.
    *   AI displays a list of matched names alongside confidence ratings. If matched confidence is low (< 90%), the caseworker is flagged for manual review.

#### Step 4: Review, Pay & Submit
*   *Field Inputs:* Select payment method (Credit Card, National Payment Switch, Mobile Wallet).
*   *Validation Rules:*
    *   Displays a structured invoice summarizing registry fees.
    *   Clicking "Process Payment" opens the secure national bank gateway.
    *   Once payment confirmation is received, the application status is updated to "Pending Review," a secure confirmation receipt is generated, and progress details are routed to the caseworker queue.

---

## 5. STANDARD DATA TABLE DESIGN & SPECIFICATIONS

Data tables are designed to display extensive records clearly, featuring robust controls for sorting, filtering, and bulk actions.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ORG-DATA-TABLE Layout                           │
├────────────────────────────────────────────────────────────────────────┤
│ Header: [ Bulk Action Dropdown ]              [ Query Search Input ]   │
├────────────────────────────────────────────────────────────────────────┤
│ Columns: Entity ID | Name | State | Date | SLA Status | Quick Action   │
├────────────────────────────────────────────────────────────────────────┤
│ Rows: [Checkbox]   | Data | Data  | Data | Status Chip| [Edit Button]  │
├────────────────────────────────────────────────────────────────────────┤
│ Footer: Displaying 1-10 of 480 items     [ Prev Page ]  [ Next Page ]  │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Data Table Interactions:
1.  **Logical Column Sorting:** Columns with sorting enabled display a high-contrast chevron icon next to the title. Clicking the column header toggles sort direction: Ascending ──► Descending ──► Normal.
2.  **Checkbox Row Selection:** Standard checkbox on the leading edge of each row. Selecting the header checkbox selects all visible rows on the current page, displaying a bulk action panel on the top (e.g., *"Download Certificates"*, *"Queue Inspection"*).
3.  **Horizontal Scrolling (Responsive Reflow):**
    *   On desktop displays, all column fields are visible with sticky header and action columns.
    *   On mobile displays, the table automatically collapses into stacked cards. Each card displays column fields as clear key-value pairs with an expand-to-view option.
4.  **Pagination controls:** Placed in the bottom-right corner. Displays current page, items range (e.g., `1-10 of 480`), and arrow buttons to navigate. Clicking an arrow fetches the next page asynchronously, keeping scroll focus at the top of the table.

---

## 6. SOVEREIGN AI INTERFACE PATTERNS (AI UX)

To maintain transparency and satisfy governance requirements, the system must clearly separate AI suggestions and insights from official, binding decisions.

```
┌────────────────────────────────────────────────────────┐
│                  AI-SUGGESTION Card                    │
├────────────────────────────────────────────────────────┤
│  ✨ Sovereign AI Advisor Recommendation                 │
│  The requested name has a 12% Phonetic Similarity to: │
│  - "النيل للمقاولات المحدودة" (CR-81249)               │
│                                                        │
│  [ Confidence Index: HIGH ]        [ Data Sources ]    │
├────────────────────────────────────────────────────────┤
│  ⚠️ AI recommendations are advisory and non-binding.  │
└────────────────────────────────────────────────────────┘
```

### 6.1 Visual Isolation Standards:
*   **Distinct Framing:** AI components are styled with a unique 1px border using Sovereign Gold `#D4AF37` and include a distinctive AI sparkle icon "✨".
*   **Background Canvas:** Soft, light gold-gray background to visually separate AI panels from core application data.
*   **Required Disclosure Label:** Every AI-assisted card must feature a persistent, bilingual disclosure label:
    *   *Arabic:* `مخرجات الذكاء الاصطناعي استشارية وغير ملزمة قانونياً.`
    *   *English:* `AI recommendations are advisory and legally non-binding.`

---

### 6.2 Interactive AI Chat Console (`ORG-AI-CHAT`)
An expandable chat drawer providing secure, natural language guidance for users and administrators.

*   **Keyboard Shortcut:** Pressing `CTRL + /` (or `CMD + /` on macOS) opens the chat drawer, focusing cursor on the chat input box.
*   **Real-Time Generation Feedback:** To prevent users from clicking repeatedly during generation, the chat console locks the input box and displays an animated three-dot pulsing shimmer indicating active generation.
*   **Actionable Chat Suggestions:** Tapping contextual suggestion bubbles (e.g., *"How do I register a textile factory?"*) auto-fills and submits queries, streamlining user interactions.

---

## 7. OFFICIAL DOCUMENT & CERTIFICATE UX PATTERNS

Official digital certificates issued by the Ministry are designed for authenticity, security, and print readiness.

```
┌────────────────────────────────────────────────────────┐
│             Secure MCI Digital Certificate             │
├────────────────────────────────────────────────────────┤
│  [ MCI Header Seal ]             [ State Emblem ]      │
│                                                        │
│  ENTITY ID: CR-981240-X                                │
│  COMPANY: Nile Food Industries LLC                     │
│                                                        │
│  [ Cryptographic QR Stamp ]    [ Minister Signature ]  │
└────────────────────────────────────────────────────────┘
```

### 7.1 Certificate View & Verification Interaction Flow
1.  **Secure Preview Canvas:** Inside the merchant's portal workspace, certificates are rendered in a high-contrast preview canvas with interactive options:
    *   *Print Certificate:* Formats the document for standard A4 printing, temporarily hiding on-screen navigation buttons.
    *   *Download secure PDF:* Generates a compact, cryptographically signed vector PDF containing the official Ministry seal and background watermark.
2.  **QR Code Stamp & Verification Flow:**
    *   Every official certificate features a secure QR stamp in the bottom-left corner.
    *   Scanning the QR code routes the user to the public verification page (`SCR-PUB-REGISTRY`).
    *   The verification page displays the authoritative certificate details from the Ministry database, confirming validity and preventing fraud.
3.  **Authorized Digital Signature Area:** Displays the Minister's signature block, cryptographic SHA-256 confirmation hash, and timestamp, proving document integrity.

---

## 8. EXECUTIVE WORKSPACES & DECISION DASHBOARDS

The Executive Dashboard provides Department Directors and the Minister with a high-level, real-time overview of ministry operations.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       Ministerial BI Dashboard                         │
├────────────────────────────────────────────────────────────────────────┤
│ KPI: Total FDI Inflow  │ KPI: active Companies  │ KPI: Pending Audits  │
│      $45,200,000 (▲8%) │      14,820 (▲4%)      │      142 Cases       │
├────────────────────────┴────────────────────────┴──────────────────────┤
│ Charts: National Trade Balance & Active Industrial Growth Trends       │
├────────────────────────────────────────────────────────────────────────┤
│ AI Insight: "Agricultural processing registrations are projecting a    │
│ 14% volume increase next quarter."                  [ View Sources ]   │
└────────────────────────────────────────────────────────────────────────┘
```

*   **Sovereign BI Dashboard Layout:**
    *   *Top Section:* High-impact KPI cards displaying total corporate registrations, FDI inflow, and SLA performance metrics.
    *   *Center Section:* Interactive charts (National Trade Balance, Active Industrial Sectors) with dynamic filters to toggle between bar, line, and geographic map views.
    *   *Bottom Section:* AI Insight Panel presenting predictive analysis and operational trends, with direct links to referenced source data.
*   **Natural Language Query Panel:** Includes an interactive AI search bar where leaders can type or speak queries to generate custom reports (e.g., *"ما هو حجم الاستثمار الأجنبي المباشر لهذا الشهر مقارنة بالعام الماضي"*).

---

## 9. TRANSITIONAL STATES & FAILSAPE MECHANISMS

A smooth user experience requires handling transitional and error states gracefully.

```
  ┌────────────────────────────────────────────────────────┐
  │                 Unified State Interfaces               │
  └──────────────────────────┬─────────────────────────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  1. LOADING  │      │   2. EMPTY   │      │   3. ERROR   │
│ Skeleton Grids│      │ Illustrative │      │ Helpful Info │
└──────────────┘      └──────────────┘      └──────────────┘
```

1.  **Skeleton Screens (Loading States):** During data fetch operations, tables and cards are replaced with animated skeleton blocks matching `motion-duration-normal` (300ms) with a cubic-bezier easing curve, providing immediate visual feedback and preventing layout shift.
2.  **Illustrative Empty States:** When a queue or dashboard widget is empty, the system displays a muted, high-contrast illustration paired with a clear, next-step action button (e.g., *"No active registrations found. Click here to start a new application."*).
3.  **Graceful Error Recovery:** Error notifications avoid complex technical jargon. They must explain what went wrong and provide clear recovery paths (e.g., *"The national payment switch is currently offline. Your progress has been saved; please try your payment again in a few minutes."*).

---

## 10. SYSTEM ACCESSIBILITY COMPLIANCE (WCAG 2.2 AA)

To satisfy the **"Sudan 2035 Digital Sovereignty Directive,"** all platform interfaces must conform to international accessibility standards.

```
                      [ Accessibility Audit ]
                                 │
                                 ▼
         ┌──────────────────────────────────────────────┐
         │ Core Check: 100% Keyboard Operability        │
         └──────────────────────┬───────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │ Contrast Check: Verify Standard Text >= 4.5:1│
         └──────────────────────┬───────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │ Screen Reader Check: Confirm Alt & ARIA Tags │
         └──────────────────────────────────────────────┘
```

*   **Keyboard Navigation & Focus Ordering:** Users must be able to navigate all forms, wizards, and interactive cards sequentially using only the `TAB` and `SHIFT + TAB` keys. Focus indicators must remain highly visible at all times, styled with a high-contrast double ring.
*   **Contrast Standards:** Standard text must maintain a minimum contrast ratio of **4.5:1** against the background, and large text (>= 18px) must maintain a minimum contrast ratio of **3.0:1** to ensure readability.
*   **Bilingual Directional Mirroring:** Switching languages between Arabic and English automatically swaps document reading direction, aligns text blocks, and mirrors directional navigation icons (RTL vs. LTR).

---

## 11. SECURITY UX & SENSITIVE DATA MASKS

Security controls are embedded directly into the UI components to protect personal and corporate data.

```
[ Sensitive field: National ID ] ──► [ Click to View ] ──► [ MFA verification / Log entry ]
```

*   **Secure Input Masking:** Text fields containing sensitive or private information (such as National ID numbers, tax IDs, or personal phone numbers) are masked by default (e.g., `XXXX-XXXX-1234`).
*   **On-Demand Reveal Pattern:** Users can click a "View" eye icon next to masked fields to reveal the contents. Revealing sensitive fields triggers an immediate entry in the security audit log, capturing the user's ID, timestamp, and IP address.
*   **Session Timeout Alert Dialogue (`MOL-TIMEOUT-ALERT`):**
    *   A high-contrast overlay modal that alerts the user 2 minutes before their secure session expires. It displays a countdown timer and a primary button to renew the session, alongside a secondary button to log out securely.

---

## 12. UX GOVERNANCE & INTERACTIVE PROTOTYPE PLATFORM

To maintain interface quality and consistency as digital services expand, all platform views follow a structured governance process:

1.  **Component Library Enforcement:** Developers must build interfaces using only components from the approved Enterprise Design System, preventing inconsistent visual styles.
2.  **Bilingual Compliance Checks:** No screen can be deployed to the production environment unless its layout is verified and approved in both Arabic and English.
3.  **Continuous Usability Optimization:** The UX design team conducts regular usability audits and reviews feedback logs, identifying potential bottlenecks and optimizing workflows.
4.  **Accessibility Verification:** Every platform update must pass automated and manual WCAG accessibility checks to verify compatibility with screen readers, contrast standards, and keyboard navigation.
