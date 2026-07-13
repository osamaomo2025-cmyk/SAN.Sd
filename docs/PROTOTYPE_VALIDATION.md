# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### ENTERPRISE PROTOTYPE VALIDATION & USABILITY ENGINEERING FRAMEWORK (v1.0.0)

---

## 1. EXECUTIVE SUMMARY & PROTOTYPE PHILOSOPHY

This document establishes the authoritative **High-Fidelity Interactive Prototype and Validation Framework** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national **"Sudan 2035 Digital Sovereignty Directive,"** this framework bridges the gap between static design tokens, visual specifications, and actual production-ready software development within Google Firebase Studio.

By requiring rigorous, evidence-based usability and accessibility testing *prior* to writing production code, this framework eliminates engineering waste, ensures absolute alignment with Sudanese administrative policies, and guarantees that public digital services are fully accessible to all citizens, local merchants, international investors, and government employees.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Usability-First Life Cycle                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [ EDS Tokens ] ──► [ Interactive Prototype ] ──► [ Usability / Access Audits ] ──► [ DEV ]│
│    (Figma/Studio)       (High-Fidelity)             (Evidence-Based Validation)  (Firebase)│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Core Prototype Principles:
1.  **Fidelity Without Compromise:** Prototypes must utilize genuine typography (**DIN Next Arabic** for RTL / **DIN Next** for LTR), exact semantic colors, real responsive grid shifts, and realistic micro-interactions.
2.  **Strict Bilingual Symmetries:** Every interactive pathway must be fully functional in both Arabic and English, including complete bi-directional layout mirroring (RTL/LTR).
3.  **Keyboard & Assistive Operability:** Interactive prototypes must be navigable using standard keyboard inputs (`TAB`, `ENTER`, `SPACE`, arrows) and tested against screen readers prior to production approval.
4.  **AI Integrity Isolation:** All simulated AI interactions (such as the Sovereign AI Assistant or OCR file scanners) must maintain visual separation (using Sovereign Gold and explicit disclaimers) to prevent confusion with official ministry actions.
5.  **Evidence-Based Decisions:** Design changes are driven purely by quantitative usability metrics (such as task success rates and error frequencies) rather than subjective visual opinions.

---

## 2. COMPREHENSIVE PROTOTYPE COVERAGE DIRECTORY

To provide a complete pre-development testing environment, the interactive prototype must cover all modules and portals across the MCI ecosystem.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Interactive Prototype Portals                             │
├──────────────────────────────────────┬─────────────────────────────────────────────────┤
│ Portal Identifier                    │ Core Interactive Responsibilities               │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ Public Lookup Portal                 │ Commercial Search, Public Verification Registry │
│ Secure Merchant Portal               │ Company Incorporation, License Renewals, Payments│
│ Employee Operations Desk             │ Casework Review, Queues, Site Audit Logging     │
│ Executive Oversight Panel            │ KPI Business Intelligence, Trend Summaries      │
│ Integrated AI Services               │ Chat Guidance, Smart OCR, Risk Analysis Alerts │
└──────────────────────────────────────┴─────────────────────────────────────────────────┘
```

### Core System Coverage:
*   **Commercial Registry (`MOD-REG-COMM`):** Name reservation searches, LLC incorporation wizard, business profile updates.
*   **Industrial Licensing (`MOD-IND-LIC`):** Site registration, environmental compliance checklists, license issuances.
*   **Investment Services (`MOD-INV-FDI`):** Foreign direct investment applications, sector restriction validations, tax incentive tracking.
*   **Consumer Protection (`MOD-CON-PROT`):** Complaint filing, fraud report uploads, local market inspection logs.
*   **Document and Payment Systems (`MOD-CORE-PLAT`):** Digital document lockers, multi-factor verification, national payment gateway flows, and secure digital signatures.

---

## 3. CORE USER JOURNEYS & VALIDATION PATHWAYS

This section defines the exact sequential pathways that the interactive prototype must validate, specifying success criteria and exception recovery paths.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        User Journey Flow: Citizen Name Search                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [ Public Search ] ──► [ Query Input ] ──► [ AI Semantic Filter ] ──► [ Result Grid ]    │
│         │                                                                  │           │
│         └─── (Invalid Input) ──► [ Helpful Error Msg ] ────────────────────┘           │
│                                                                                        │
│  [ Result Grid ] ──► [ Select Name ] ──► [ Login Portal ] ──► [ OTP Gate ] ──► [ Done ] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.1 Citizen / Entrepreneur: Commercial Name Registration
*   **Start Point:** Public Search Console (`SCR-PUB-SEARCH`).
*   **Step Sequence:**
    1.  Enter proposed business name into the bilingual search input box.
    2.  Apply sector and geographic filters to check for existing registrations.
    3.  Select an available name and click the primary "Reserve Name" action button.
    4.  Authenticate profile using the National Identity Gate (`SCR-AUTH-MFA`).
    5.  Review name reservation fees and complete payment via the secure banking portal.
    6.  Receive cryptographic name reservation certificate.
*   **Success Condition:** Certificate generated containing the correct business name, registration ID, and validation QR code.
*   **Failure Condition:** Input name is flagged as highly similar to an existing registration, or payment fails.
*   **Exception Recovery Path:**
    *   *Duplicate Conflict:* AI Assistant presents 3 alternative name suggestions matching phonetics and sector keywords.
    *   *Payment Failure:* System preserves progress, creates a draft reservation active for 24 hours, and returns to the payment selection screen with helpful troubleshooting instructions.

---

### 3.2 Inspector: Field Inspection & Zoning Check
*   **Start Point:** Inspector Work Queue Dashboard (`SCR-EMP-QUEUE`).
*   **Step Sequence:**
    1.  Select a scheduled industrial audit task from the assigned local queue.
    2.  Access GPS mapping widget to navigate to the factory site.
    3.  Verify environmental checklist items (waste plans, safety margins).
    4.  Capture site photos and upload them directly into the inspection form.
    5.  Complete the digital signature field to submit the inspection report.
*   **Success Condition:** Field inspection report is submitted, updating the merchant's application status to "Audit Complete" within 2 seconds.
*   **Failure Condition:** Lack of network connection or zoning violation is identified during checks.
*   **Exception Recovery Path:**
    *   *Network Offline:* Form saves progress locally using offline caching. It automatically uploads cached data once network connection is restored.
    *   *Zoning Violation:* Selecting "Non-Compliant" triggers a required textarea field to document the violation, generating an actionable remediation plan for the merchant.

---

### 3.3 Director: Regional SLA Oversight & Case Reassignment
*   **Start Point:** Executive Oversight Dashboard.
*   **Step Sequence:**
    1.  Review regional processing times and active casework queues.
    2.  Identify specific caseworker queues showing pending files near SLA breach.
    3.  Select multiple near-breach files using row selection checkboxes.
    4.  Select a high-performing caseworker from the re-assignment dropdown.
    5.  Confirm the assignment update.
*   **Success Condition:** Table records update instantly, displaying new caseworker assignments and resetting team SLA metrics.
*   **Failure Condition:** Reassigned officer is unavailable or has reached maximum work limits.
*   **Exception Recovery Path:**
    *   *System Warning:* Displays warning pop-up showing active workload and suggests alternative officers with low queue density.

---

### 3.4 Minister: Strategic Business Intelligence Analysis
*   **Start Point:** Minister Executive Dashboard.
*   **Step Sequence:**
    1.  Review top-level KPI cards displaying national FDI inflows and active registrations.
    2.  Toggle chart views between historical bar charts and geographic map overlays.
    3.  Select the "AI Insights Panel" to view projected growth trends.
    4.  Enter a query in the AI search bar to generate a custom report (e.g., *"Show food processing investments in Khartoum"*).
    5.  Export the custom report to a secure PDF and share it with department heads.
*   **Success Condition:** Report is generated and exported in 3 seconds, matching official document standards.
*   **Failure Condition:** Data search query is too vague, or PDF generation fails.
*   **Exception Recovery Path:**
    *   *Vague Query:* AI Assistant suggests 3 clarified search prompts based on active trade parameters.

---

## 4. USABILITY TESTING SPECIFICATIONS

Usability tests must follow highly structured scripts, simulating real-world scenarios to identify potential navigation bottlenecks.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Usability Test Lifecycle                        │
├────────────────────────────────────────────────────────────────────────┤
│  1. Preconditions Checked ──► 2. Test Scenario Executed                 │
│                                            │                           │
│                                            ▼                           │
│  4. Results Checked ◄─── 3. Metrics Logged (Success/Errors)            │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 4.1 Usability Test Scenarios

#### Scenario A: LLC Incorporation Application
*   **Testing Objective:** Verify that users can successfully navigate the multi-step incorporation wizard (`WIZ-CR-LLC`) and upload required documents without assistance.
*   **Preconditions:** Test user is logged into a valid profile, holding an active name reservation certificate.
*   **Expected Actions:**
    1.  Access the incorporation wizard from the user dashboard.
    2.  Validate the reserved commercial name.
    3.  Enter shareholder details, ensuring capital allocation sums to 100%.
    4.  Upload shareholder IDs and draft Articles of Association.
    5.  Review fees and initiate payment.
*   **Acceptance Criteria:** User completes all steps in under **8 minutes** without encountering validation blocks or system errors.

#### Scenario B: Public Commercial Search & Verification
*   **Testing Objective:** Verify that public users can quickly lookup active business registrations and verify certificate authenticity on mobile screens.
*   **Preconditions:** Tester is using a mobile phone browser, holding a physical certificate with a QR code.
*   **Expected Actions:**
    1.  Access the public search console (`SCR-PUB-SEARCH`).
    2.  Type a target company name and apply active status filters.
    3.  Scan the QR code on the certificate using the camera.
    4.  Verify that the displayed registry information matches the physical certificate.
*   **Acceptance Criteria:** Mobile search completes in under **3 seconds**, and the QR code routes the user to the correct verification page in a single action.

---

## 5. REUSABLE TESTING SCRIPTS CATALOG

To ensure consistency across multiple usability test rounds, all testing moderators must follow these standardized bilingual scripts.

```
┌────────────────────────────────────────────────────────┐
│             Bilingual Testing Script Flow              │
├────────────────────────────────────────────────────────┤
│ 1. Introductions & Informed Consent (RTL/LTR)          │
│ 2. Task Launch: Read scenario instructions aloud      │
│ 3. Active Observation: Log actions, times, and errors │
│ 4. Post-Task Feedback: Ease-of-use rating (1-5 scale)  │
└────────────────────────────────────────────────────────┘
```

### 5.1 Test Moderator Script: Commercial Name Reservation

#### Section 1: Pre-Task Briefing
*   **Arabic Script:**
    > "أهلاً بك وشكراً لمشاركتك معنا اليوم. نحن نقوم باختبار نظام حجز الأسماء التجارية الجديد لوزارة التجارة والصناعة. نريد منك أن تحاول حجز اسم تجاري لشركتك الجديدة وهي 'النيل للصناعات الغذائية'. يرجى تذكر أننا نختبر النظام وليس قدراتك الشخصية، تصفح النظام بشكل طبيعي وتحدث بصوت مسموع معبراً عن انطباعاتك أثناء الانتقال بين الصفحات."
*   **English Script:**
    > "Welcome and thank you for participating today. We are testing the new Commercial Name Reservation system for the Ministry of Commerce & Industry. We would like you to attempt to reserve a commercial name for your new business, 'Nile Food Industries'. Please remember that we are testing the system, not your personal abilities. Interact with the system naturally and speak out loud, sharing your thoughts as you navigate."

#### Section 2: Post-Task Assessment Questions
*   **Language & Clarity:** Was the terminology clear and easy to understand in your selected language? (Rate on a 1-5 scale).
*   **Aesthetic Trust:** Did the visual design, typography, and official logos make you feel confident that this is a secure government application?
*   **AI Support Helpfulness:** If you interacted with the AI Assistant, did the suggestions help you find or refine your commercial name?

---

## 6. COMPREHENSIVE USABILITY METRICS FRAMEWORK

To ensure objective design evaluations, the prototype's performance is measured using structured, quantitative metrics.

```
                       [ Usability Quality Index ]
┌────────────────────────────────────────────────────────────────────────┐
│  Task Success  │  Time on Task  │  Average Errors  │  User Sat. (SUS)  │
│    >= 90%      │   <= 5 Min.    │    <= 1.5 Per    │    Score >= 80    │
└────────────────┴────────────────┴──────────────────┴───────────────────┘
```

### Usability Metrics and Quality Thresholds:
1.  **Task Completion Rate (TCR):**
    *   *Formula:* `(Completed Tasks / Total Attempted Tasks) * 100`.
    *   *Sovereign Quality Threshold:* **>= 90%** across all citizen-facing services.
2.  **Mean Time on Task (MTT):**
    *   *Formula:* Total time spent on task divided by the number of successful completions.
    *   *Sovereign Quality Threshold:* LLC Incorporation Wizard must be completed in **<= 8 minutes**; Public Search must return results in **<= 5 seconds**.
3.  **Task Error Rate (TER):**
    *   *Formula:* Total number of errors encountered divided by the number of attempts.
    *   *Sovereign Quality Threshold:* **<= 1.5 errors** per session. High error rates on form fields signal a need to clarify helper labels or inputs.
4.  **System Usability Scale (SUS):**
    *   *Standard:* Post-test survey scoring user satisfaction across 10 standardized questions.
    *   *Sovereign Quality Threshold:* **SUS Score >= 80** (representing trade-grade excellence).
5.  **Accessibility Compliance Audit:**
    *   *Standard:* Zero keyboard blocks, and 100% compliance with WCAG 2.2 contrast rules.
    *   *Sovereign Quality Threshold:* **100% compliance** is required before production sign-off.
6.  **AI Assistant Effectiveness (AIE):**
    *   *Measurement:* Ratio of queries resolved by AI suggestions without needing manual caseworker support.
    *   *Sovereign Quality Threshold:* **>= 70%** helpfulness rating.

---

## 7. BILINGUAL ACCESSIBILITY VALIDATION MANUAL

Every interactive prototype must pass rigorous accessibility audits to ensure full compatibility with assistive technologies.

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

### Accessibility Checkpoints:
*   **Keyboard Navigation Audit:** Verify that all buttons, inputs, links, and dropdowns can be accessed sequentially using only the `TAB` and `SHIFT + TAB` keys. Ensure focus rings remain highly visible, styled with a high-contrast double outline.
*   **Screen Reader Compatibility:** Ensure that all icons, cards, and tables contain valid `aria-label`, `aria-describedby`, and semantic role tags so that screen readers read content and statuses clearly.
*   **RTL/LTR Layout Mirroring:** Test that toggling languages between Arabic and English swaps the document reading direction (RTL vs. LTR), aligns text blocks, and mirrors navigation chevrons cleanly.
*   **Color Blind Evaluation:** Use color blind simulation tools to verify that status changes do not rely on color alone. Ensure status chips pair color changes with clear, descriptive icons and text labels.
*   **Reduced Motion Support:** Test that activating `prefers-reduced-motion` in browser settings pauses or simplifies all transitional animations, replacing slide-in menus with immediate opacity fades.

---

## 8. MULTI-DEVICE RESPONSIVE VALIDATION DIRECTIVES

To ensure consistent performance on all devices, the interactive prototype must be validated across multiple screen breakpoints.

```
  [ Mobile Screen < 640px ] ──► [ Tablet Screen 640px-1024px ] ──► [ Desktop >= 1024px ]
   - Single column flow          - 2-Column grid                  - 12-Column grid layout
   - Sticky bottom actions       - Collapsible menu docks         - Fixed left side navigation
```

### Breakpoint Validation Checkpoints:
1.  **Mobile view (< 640px):** Verify that all tables collapse into stacked cards, touch targets are at least **44x44 pixels**, and primary actions are pinned to the bottom of the screen.
2.  **Tablet view (640px - 1024px):** Verify that left-aligned navigation sidebars collapse into compact icon docks and grid columns adjust from 12 to 8 columns without layout distortion.
3.  **Desktop view (>= 1024px):** Verify that content layouts are restricted to a maximum width of **1280px** to ensure optimal readability, and left-side navigation bars remain fixed.

---

## 9. DESIGN ITERATION FRAMEWORK & QUALITY GATEWAYS

To manage user feedback and maintain interface quality as digital services expand, all design updates follow a structured governance process.

```
[ Gather Feedback ] ──► [ Classify Severity ] ──► [ Update Prototype ] ──► [ Regression Check ] ──► [ Sign-off ]
```

### 9.1 Feedback Issue Classification Severity

| Severity Level | Definition & Operational Impact | Action Timeline | Release Gate Status |
| :--- | :--- | :--- | :--- |
| **Critical Block** | Prevents task completion, breaks accessibility guidelines, or fails security checks. | Immediate (Within 24 Hours) | **BLOCKS RELEASE** |
| **High Friction** | Users can complete tasks but encounter confusion, high error rates, or awkward workarounds. | Mid-Priority (Within 3 Days) | **BLOCKS RELEASE** |
| **Minor Aesthetic** | Small spacing alignment issues, spelling errors, or visual inconsistencies. | Planned Backlog (Next Sprint) | *PERMITTED FOR RELEASE* |

---

### 9.2 Prototype Regression Testing Checklist
Prior to final design approval, the updated prototype must pass a comprehensive regression review:
*   [ ] Verify that visual and typography updates have been applied consistently across both Arabic and English layouts.
*   [ ] Confirm that recent design changes have not broken existing keyboard navigation pathways or screen reader focus loops.
*   [ ] Re-evaluate mobile and tablet views to ensure grid alignments remain intact.
*   [ ] Verify that all simulated AI disclaimers and confidence ratings remain clearly visible.

---

## 10. SYSTEM DESIGN GOVERNANCE & PRODUCTION READINESS ASSESSMENT

To bridge the gap between interactive design and production, the system must pass a structured **Development Readiness Assessment** before software engineering begins in Google Firebase Studio.

```
┌────────────────────────────────────────────────────────┐
│             Development Readiness Gateway              │
├────────────────────────────────────────────────────────┤
│ 1. Complete Prototype Interactive Walkthrough          │
│ 2. WCAG 2.2 AA Accessibility Compliance Review         │
│ 3. Biligual Language & Reading Flow Approval           │
│ 4. Design Token Registry & Asset Export Verification   │
└────────────────────────────────────────────────────────┘
```

### Development Readiness Checklist:
*   [ ] **Interactive Completeness:** All user journeys (Citizen, Inspector, Director, Minister) have been prototyped and validated with high-fidelity components.
*   [ ] **Accessibility Compliance:** The prototype has passed accessibility reviews, achieving 100% WCAG 2.2 AA compliance.
*   [ ] **Bilingual Parity:** All pages and workflows have been reviewed and approved in both Arabic (RTL) and English (LTR).
*   [ ] **Design Token Synchronization:** Spacing, typography, and color tokens are defined in the central design token registry, ready for export as CSS/SASS variables into Google Firebase Studio.
*   [ ] **Official Approval Sign-off:** The prototype has received formal sign-off from the Design, Accessibility, and Executive Review Boards.
