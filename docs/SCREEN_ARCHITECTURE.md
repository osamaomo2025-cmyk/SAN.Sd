# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### MASTER BLUEPRINT: ENTERPRISE PORTAL SCREEN ARCHITECTURE & UX FRAMEWORK (v1.0.0)

---

## 1. EXECUTIVE SUMMARY & DESIGN PHILOSOPHY

This document establishes the official **Enterprise Screen Architecture and User Experience (UX) Framework** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national "Sudan 2035 Digital Sovereignty Directive," this architecture outlines every screen, portal, dialog, and workflow wizard required to deliver national-grade digital public services.

The platform's design philosophy is **Citizen-Centered, Digital-First, and Accessibility-Driven**. It enforces a cohesive visual identity optimized for the unique operating constraints of the region (e.g., varying bandwidth, diverse screen densities, and bilingual requirements).

```
  [ Level 1: Public Portal ] ──► [ Level 2: Secure Identity Gate ] ──► [ Level 3: Consolidated Dashboards ]
                                                                                   │
                                         ┌─────────────────────────────────────────┴─────────────────────────────────────────┐
                                         ▼                                                                                   ▼
                       [ Level 4: Transaction Wizards ]                                                    [ Level 5: Case Audits & Details ]
```

### Core UX Principles:
1.  **Mobile-First Responsive Design:** All screens must be fully operational on mobile-touch displays before scaling up to tablet, desktop, or large executive screens.
2.  **Accessibility by Default (WCAG 2.2 AA):** Complete support for screen readers, keyboard navigation, high-contrast states, and flexible font scaling.
3.  **Strict Bilingual RTL/LTR Parity:** Native structural support for **RTL Arabic** (using *DIN Next Arabic*) and **LTR English** (using *DIN Next*), ensuring zero layout distortion during language toggling.
4.  **Zero-Trust Session Segregation:** Views are strictly partitioned based on authenticated roles. Users are locked out of administrative and executive namespaces at the router level.
5.  **Aesthetic Performance & Minimalism:** The visual interface utilizes generous negative space, high contrast, clean typography, and muted slate colors to focus attention on tasks, avoiding visual clutter or artificial telemetry data.

---

## 2. PORTAL SPECIFICATIONS & SCREEN INVENTORY

The platform is structured into five distinct portal environments, designed specifically for different user roles.

```
                                +-----------------------------+
                                | Unified MCI Gateway Router  |
                                +--------------+--------------+
                                               |
       +-----------------+-----------+---------+---------+-----------+-----------------+
       |                 |                     |                     |                 |
+------v------+   +------v------+       +------v------+       +------v------+   +------v------+
| 1. Public   |   | 2. Citizen  |       | 3. Corporate|       | 4. Employee |   | 5. Executive|
|  Portal     |   |   Portal    |       |   Portal    |       |  Workspace  |   |  Dashboard  |
+-------------+   +-------------+       +-------------+       +-------------+   +-------------+
```

---

### 2.1 Public Portal (Level 1 & 2 Screens)
The public portal is accessible without authentication, providing transparent access to news, services, directories, and registries.

#### Screen ID: `SCR-PUB-HOME` | Public Homepage
*   **Arabic Name:** الصفحة الرئيسية العامة
*   **Purpose:** Welcomes visitors and serves as the primary gateway to all public services and corporate registries.
*   **Primary Actions:** Search commercial registry, view services catalog, access the Sovereign AI assistant.
*   **Secondary Actions:** Toggle language, view news feed, access the help center.
*   **Displayed Information:** Main service links, featured announcements, direct link to search registry.
*   **AI Opportunities:** Smart search suggestions based on current trends.

#### Screen ID: `SCR-PUB-CATALOG` | Services Directory
*   **Arabic Name:** دليل الخدمات الرقمية
*   **Purpose:** Lists all digital services provided by the Ministry, categorized by sector (Commercial, Industrial, Investment).
*   **Primary Actions:** Select service, start application.
*   **Secondary Actions:** Filter by category, search services, view service FAQs.

#### Screen ID: `SCR-PUB-REGISTRY` | Commercial Registry Search Engine
*   **Arabic Name:** محرك البحث عن السجلات والأسماء التجارية
*   **Purpose:** Allows the public to search active business names, registrations, and license statuses.
*   **Primary Actions:** Execute search, view company record summary.
*   **Filters:** Search by Name, CR Number, State, or Active Status.
*   **AI Opportunities:** Natural language search processing (e.g., *"Show active agricultural companies in Red Sea State"*).

---

### 2.2 Citizen, Merchant & Investor Portals (Level 3 & 4)
Requires identity verification (AAL2 or AAL3) to manage business portfolios, submit licensing requests, and process payments.

#### Screen ID: `SCR-PORT-DASH` | Consolidated User Dashboard
*   **Arabic Name:** لوحة التحكم الموحدة للمستثمر والتاجر
*   **Purpose:** Provides a unified overview of the user's active name reservations, corporate registrations, active licenses, and pending tasks.
*   **Primary Actions:** Start new application, pay pending invoices, view messages.
*   **Displayed Information:** Portfolio summary, active alerts, task checklist, recent transactions.

#### Screen ID: `SCR-PORT-PROFILE` | User Profile & Preferences
*   **Arabic Name:** الملف الشخصي وإعدادات التفضيلات
*   **Purpose:** Allows users to manage personal details, security credentials, and communication preferences.
*   **Primary Actions:** Manage MFA, configure notification preferences (SMS/Email/In-App), change preferred language.

---

### 2.3 Employee Workspace (Level 3, 4 & 5)
Restricted to MCI employees (caseworkers, field inspectors, and managers) to manage case reviews and dispatch assignments.

#### Screen ID: `SCR-EMP-QUEUE` | Active Casework Queue
*   **Arabic Name:** قائمة المهام والملفات النشطة للموظف
*   **Purpose:** Serves as the primary workspace for caseworkers, displaying assigned files, processing statuses, and outstanding tasks.
*   **Primary Actions:** Claim task, review application details, assign status.
*   **Filters:** Group by Urgency, Service Type, SLA remaining, or Assignee.

#### Screen ID: `SCR-EMP-AUDIT` | Document Audit & AI Review Panel
*   **Arabic Name:** لوحة التدقيق والتحقق الذكي من المستندات
*   **Purpose:** Splitting screen view displaying the applicant's submitted documents alongside AI OCR recommendations.
*   **Primary Actions:** Approve document, request clarification, override AI suggestion.
*   **Displayed Information:** Submitted PDF files, extracted text, matching confidence scores, checklist requirements.

#### Screen ID: `SCR-EMP-INSPECT` | Field Inspection Mobile Workspace
*   **Arabic Name:** واجهة الرقابة والزيارات الميدانية للهاتف
*   **Purpose:** Mobile-optimized interface for field inspectors conducting site audits and logging citations.
*   **Primary Actions:** Fill out site safety checklists, upload photo evidence, log GPS coordinates, issue citations.

---

### 2.4 Executive Portal (Level 3 & 5)
Restricted to Department Directors, Directors General, and the Minister for high-level approvals and strategic data review.

#### Screen ID: `SCR-EXEC-APPROVALS` | High-Value Approvals Console
*   **Arabic Name:** منصة الموافقات والاعتمادات الوزارية الكبرى
*   **Purpose:** Aggregates pending high-value registrations, gold export permits, and strategic industrial licensing proposals requiring executive sign-off.
*   **Primary Actions:** Approve and apply digital signature, reject with comments, request board audit.

#### Screen ID: `SCR-EXEC-BI` | Executive BI Dashboard
*   **Arabic Name:** لوحة البيانات التحليلية والذكاء الاقتصادي
*   **Purpose:** Displays real-time charts, trends, SLA compliance metrics, and revenue inflows for strategic decision-making.
*   **AI Opportunities:** Natural Language Queries (e.g., *"ما هو حجم الاستثمار الأجنبي المباشر لهذا الشهر مقارنة بالعام الماضي"*).

---

## 3. GLOBAL NAVIGATION ARCHITECTURE

To ensure intuitive movement across the platform, navigation is structured into clear, hierarchical layers.

```
[ Level 1: Global Header ] ──► [ User Context Menu ] ──► [ Contextual Sidebar ] ──► [ Breadcrumbs ]
```

### 3.1 Navigation Layers:
1.  **Global Header Navigation:**
    *   *Public Portal:* Home, Services Catalog, Public Registry, News, Help Center, Language Toggle (AR/EN), Login Button.
    *   *Secure Portal:* Unified Logo, Global Search bar, Sovereign AI Shortcut, Notifications Center Bell, Profile Avatar.
2.  **Contextual Navigation Sidebar (Secure Portals):**
    *   *Citizen/Merchant:* Dashboard, My Companies, My Licenses, Invoices, Messages, Support.
    *   *Caseworker:* Tasks Queue, Pending Reviews, Document Vault, Performance Metrics.
    *   *Field Inspector:* My Dispatches, Active Violations, Calibration Settings.
    *   *Executive:* Strategic BI, Approvals Queue, Ministerial Decrees.
3.  **Breadcrumb Trails:** Enforced on all level 4 and 5 screens to provide clear context (e.g., `لوحة التحكم ──► السجل التجاري ──► شركة النيل المحدودة ──► تعديل رأس المال`).
4.  **AI Quick Actions Menu:** Persistent shortcut panel allowing users to speak or type commands (e.g., *"انتقل إلى فواتيري المعلقة"* / *"Go to my pending invoices"*).

---

## 4. DESIGN OF CORE TRANSACTION WIZARDS

Complex processes are split into guided, step-by-step wizard flows to reduce friction and improve completion rates.

```
[ Step 1: Naming check ] ──► [ Step 2: Entity details ] ──► [ Step 3: Document Uploads ] ──► [ Step 4: Pay Fees ]
```

### 4.1 Company Incorporation Wizard (`WIZ-CR-LLC`)
*   **Purpose:** Guides merchants and foreign investors through incorporating a Limited Liability Company.
*   **Actors:** Merchant, Investor.

#### Step 1: Commercial Name Validation
*   *Input:* Approved Name Reservation Certificate number.
*   *Validation:* The system verifies that the certificate number is valid and currently reserved under the applicant's profile.

#### Step 2: Shareholders & Capital Allocation
*   *Inputs:* Shareholder names, national ID/passport numbers, address coordinates, capital contribution.
*   *Validation:* The system verifies that the sum of shareholder equity matches 100% of the total registered capital.

#### Step 3: Document Upload & AI OCR Scan
*   *Inputs:* Draft Articles of Association, scanned copies of shareholder IDs.
*   *Validation:* The system runs an automated scan to verify file formats and run antivirus checks. AI performs OCR to match names and flag missing clauses.

#### Step 4: Review, Pay & Submit
*   *Inputs:* Digital fee payment via integrated payment switch.
*   *Validation:* Once payment is confirmed, the application is locked, assigned a tracking ID, and routed to the review queue.

---

### 4.2 Environmental site Inspection Wizard (`WIZ-IL-INSPECT`)
*   **Purpose:** Guides field inspectors through evaluating proposed manufacturing sites.
*   **Actors:** Field Inspector.

#### Step 1: Location & Coordinates Verification
*   *Inputs:* Automatic GPS check at the site location.
*   *Validation:* The system verifies that the inspector's physical coordinates match the proposed factory location within 50 meters.

#### Step 2: Site Checklists
*   *Inputs:* Site safety compliance checks (e.g., waste disposal layout, emergency exits, zoning conformity).

#### Step 3: Evidence Capture & Logging
*   *Inputs:* Real-time camera captures of waste outlets, ventilation configurations, and zoning labels.

#### Step 4: Report Submission
*   *Inputs:* Inspector signature. Once submitted, the report is uploaded to the document vault, updating the case status.

---

## 5. REUSABLE DIALOGS, MODALS & STATUS STATES

To maintain interface consistency, standard dialogs and states are defined across all platform portals.

```
                          ┌─────────────────────────────┐
                          │   Reusable Dialogue Hub     │
                          +--------------+--------------+
                                         |
       +---------------------------------+---------------------------------+
       |                                 |                                 |
+------v------+                     +------v------+                     +------v------+
| Confirm File│                     |  Rejection  |                     |  Signature  |
|  Deletion   │                     | Reason Modal│                     | Verification│
+-------------+                     +-------------+                     +-------------+
```

### 5.1 Reusable Modals:
1.  **Confirmation & Delete Modal (`MODAL-CONFIRM`):**
    *   *Purpose:* Enforces confirmation before destructive or high-value actions (e.g., deleting a draft profile or canceling an active application).
    *   *UX Spec:* High-contrast color buttons, requiring explicit verification text input for sensitive actions (e.g., typing "حذف" or "DELETE" to confirm).
2.  **Case Rejection Modal (`MODAL-REJECT`):**
    *   *Purpose:* Used by caseworkers when rejecting an application, requiring them to provide a specific rejection reason and suggest corrections.
3.  **Digital Signature & QR Modal (`MODAL-SIGN`):**
    *   *Purpose:* Dispatches secure MFA prompts before applying an executive's digital signature to approved certificates.

---

### 5.2 System Status Views:

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

1.  **Loading States:** Skeletons grids are utilized during data load operations, avoiding spinning icons or blank views.
2.  **Empty States:** When lists or queues are empty, the system displays helpful, illustrative empty states with clear actions (e.g., *"No active companies found. Start a new registration to get started."*).
3.  **Error States:** System error messages avoid raw codes or developer jargon. They must display helpful information and clear next steps (e.g., *"The payment switch is temporarily offline. Your draft has been saved; please try again in a few minutes."*).

---

## 6. RESPONSIVE LAYOUT MATRIX

Layout behavior adapts dynamically to different screen sizes to support seamless service delivery on all devices.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Responsive Layout Rules                         │
├───────────────────┬────────────────────────────────────────────────────┤
│ Mobile Displays   │ Single-column stacking. Primary actions pinned to  │
│                   │ bottom-touch zone (minimum 44px target).           │
├───────────────────┼────────────────────────────────────────────────────┤
│ Tablet Displays   │ Dual-column grid layouts. Sidebar navigation       │
│                   │ collapses into a top menu.                         │
├───────────────────┼────────────────────────────────────────────────────┤
│ Desktop Displays  │ Multi-column layout. Sticky left-sidebar, rich     │
│                   │ metrics panels, and contextual workspaces.         │
├───────────────────┼────────────────────────────────────────────────────┤
│ Large Displays    │ Centered layout max-width restriction (1280px) to  │
│                   │ prevent layout distortion on wide screens.         │
└───────────────────┴────────────────────────────────────────────────────┘
```

*   **Mobile Touch Targets:** Buttons and interactive elements on touch screens must have a minimum size of **44x44 pixels**, with adequate spacing to prevent accidental touches.
*   **Data Density Scaling:** Extensive data tables (such as company databases or transaction ledgers) scale dynamically. On mobile screens, they display as compact summary cards with expand-to-view links. On desktop displays, they scale to multi-column data grids.

---

## 7. ACCESSIBILITY, COMPLIANCE & TYPOGRAPHY STANDARDS

The platform complies with **WCAG 2.2 AA** accessibility guidelines to ensure inclusive digital access for all users.

*   **Typography Standards:**
    *   *Arabic Text (RTL):* Enforces **DIN Next Arabic** for display, headings, and body copy.
    *   *English Text (LTR):* Enforces **DIN Next** to maintain brand alignment.
    *   *Monospaced Text:* Enforces **JetBrains Mono** for serial keys, verification codes, and invoice numbers.
*   **Contrast Ratios:** Text and interactive elements must maintain a contrast ratio of at least **4.5:1** against the background to ensure readability.
*   **Keyboard Operability:** All forms, navigation items, and interactive components must be fully functional using only a keyboard, with clear focus indicators.
*   **Screen Reader Optimization:** Semantic HTML tags, clear ARIA labels, and proper alternative text are required on all views.
*   **Language-Specific Layout Flow:** Language toggling automatically switches the document layout structure (e.g., toggling to Arabic adjusts text alignment to Right-to-Left, swaps header layouts, and shifts sidebar alignments).

---

## 8. UX FLOWS FOR PORTAL PERSONAS

The platform implements structured user flows to guide different personas through typical interactions.

```
       [ Citizen User ] ──► [ Public Search ] ──► [ Name Confirmed ] ──► [ File Complaint ]
```

### Persona Flow: Citizen Filing Consumer Protection Case
*   *Entry Screen:* `SCR-PUB-HOME` ──► Selects "Consumer Protection Portal"
*   *Triage Screen:* `SCR-PUB-CATALOG` ──► Enters merchant details, location, and uploads receipt photo.
*   *AI Support:* AI performs OCR to extract merchant name and receipt details, suggesting case categories.
*   *Verification:* Citizen verifies extracted details, reviews the complaint draft, and submits.
*   *Exit Screen:* Renders success ticket with SMS tracking confirmations and unique QR status link.

---

### Persona Flow: Case Reviewer processing LLC Registration
*   *Entry Screen:* `SCR-EMP-QUEUE` ──► Claims the next pending LLC application.
*   *Review Screen:* `SCR-EMP-AUDIT` ──► Displays submitted company details alongside AI document verification recommendations.
*   *Verification:* Officer reviews AI recommendations, confirms shareholder details match uploaded IDs, and marks items verified.
*   *Approval:* Officer signs off on the case, initiating the invoice generation event.
*   *Exit Screen:* The application is updated to "Pending Payment," and is routed to the applicant's portal.

---

## 9. USER TRANSACTION PATHWAYS (INTERACTION MAP)

Interaction pathways connect portals, wizards, and database updates to complete business processes.

```
[ Merchant Action: Register LLC ] ──────► [ MOD-REG-COMM Database Check ]
                                                    │
                                                    ▼
[ Invoice Generation Event ] ───────────► [ MOD-PAY-SWT Payment Switch ]
                                                    │
                                                    ▼
[ Approved & Signed Certificate ] ──────► [ Cryptographic Vault Storage ]
```

*   **Corporate Incorporation Pathway:**
    1.  Applicant selects LLC registration in their portal workspace (`SCR-PORT-DASH`).
    2.  System loads the Company Registration Wizard (`WIZ-CR-LLC`).
    3.  On submission, the system runs automated integrity checks and updates the `MOD-REG-COMM` database.
    4.  The case is routed to the caseworker review queue (`SCR-EMP-QUEUE`).
    5.  Once verified, the caseworker approves the registration, which triggers the fee invoice.
    6.  The applicant processes payment via the integrated payment gateway.
    7.  Upon payment confirmation, the system applies the digital signature, renders the PDF certificate with a secure QR stamp, and stores it in the digital records vault.

---

## 10. SCREEN ARCHITECTURE GOVERNANCE & UX REVIEW CYCLES

To maintain interface quality and consistency as digital services expand, all platform views follow a structured governance process:

1.  **UI Component Registry:** Developers must draw exclusively from the approved UI component library, preventing custom or inconsistent visual styles.
2.  **Bilingual Compliance Checks:** No screen can be deployed to the production environment unless its layout is verified and approved in both Arabic and English.
3.  **Biannual Usability Audits:** The UX design team conducts semi-annual usability tests with citizen and business focus groups, identifying potential bottlenecks and optimizing workflows.
4.  **Accessibility Verification:** Every platform update must pass automated and manual WCAG accessibility checks to verify compatibility with screen readers, contrast standards, and keyboard navigation.
