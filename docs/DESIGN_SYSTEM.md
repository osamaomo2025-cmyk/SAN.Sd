# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### MASTER BLUEPRINT: ENTERPRISE DESIGN SYSTEM & UI COMPONENTS LIBRARY (v1.0.0)

---

## 1. DESIGN SYSTEM PHILOSOPHY & VISUAL IDENTITY

This document establishes the official **Enterprise Design System (EDS) and Design Tokens Framework** for the Sudan Digital Ministry of Commerce & Industry (MCI). Prepared under the national "Sudan 2035 Digital Sovereignty Directive," this framework is engineered to unify all digital touchpoints—public portals, merchant spaces, caseworker dashboards, and executive control rooms—into a cohesive, accessible, and high-performance visual ecosystem.

The design system is built on **Atomic Design Principles** and driven entirely by **Semantic Design Tokens**, ensuring absolute portability, dynamic themes, and flawless rendering on any framework, with full compatibility with Google Firebase Studio and future national cloud infrastructures.

```
  [ Design Tokens (Colors/Fonts) ] ──► [ Atoms (Buttons/Labels) ] ──► [ Molecules (Inputs/Chips) ]
                                                                                │
                                         ┌──────────────────────────────────────┴──────────────────────────────────────┐
                                         ▼                                                                             ▼
                        [ Organisms (Cards/Tables) ]                                                  [ Templates & Page Layouts ]
```

### Visual Identity Anchors:
*   **Sovereign & Humble Typography:** Absolute enforcement of **DIN Next Arabic** for RTL Arabic layout and **DIN Next** for LTR English layout. No generic fallback fonts or creative lettering are permitted in official interfaces.
*   **Aesthetic Minimalist Contrast:** Deep Slate grays, pure white backgrounds, and deep Sudan Green and Sovereign Gold accents. The interface avoids complex gradients, drop shadows, or unrequested visual clutter to focus entirely on task execution.
*   **Accessibility by Design:** Structured to achieve strict compliance with **WCAG 2.2 AA** criteria, supporting screen readers, full keyboard operability, and native direction-aware layout adjustments (RTL/LTR flow).

---

## 2. GOVERNMENT DESIGN TOKENS FRAMEWORK

Design Tokens are the single source of truth for all visual values. They replace hardcoded values (such as hex codes or pixel dimensions) with semantic, reusable variables.

```
┌────────────────────────────────────────────────────────┐
│                   Semantic Token Chain                 │
├────────────────────────────────────────────────────────┤
│ Global Tier:   color-green-700 (#007A33)               │
│ Semantic Tier: color-brand-primary (color-green-700)   │
│ Component Tier:button-bg-primary (color-brand-primary) │
└────────────────────────────────────────────────────────┘
```

### 2.1 Color Tokens (60-30-10 Distribution Rule)

#### Brand & Accent Colors
*   `color-brand-primary`: `color-green-700` | Hex: `#007A33` (Sudan National Green. Symbolizes growth, official sovereignty).
*   `color-brand-secondary`: `color-gold-600` | Hex: `#D4AF37` (Sovereign Gold. Used for certified badges, high-value stamps).
*   `color-brand-dark`: `color-slate-900` | Hex: `#0F172A` (Deep Charcoal. Enforces crisp text readability).

#### System & Status Colors
*   `color-status-success`: `color-emerald-600` | Hex: `#059669` (Completed tasks, approved clearances).
*   `color-status-warning`: `color-amber-500` | Hex: `#D97706` (Near-breach SLAs, pending clarifications).
*   `color-status-danger`: `color-red-600` | Hex: `#DC2626` (Citations, expired licenses, system errors).
*   `color-status-info`: `color-sky-600` | Hex: `#0284C7` (System guides, informative status logs).

#### Surface & Background Canvas
*   `color-bg-canvas`: `color-slate-50` | Hex: `#F8FAFC` (Soft off-white canvas to minimize eye strain).
*   `color-bg-surface`: `color-white` | Hex: `#FFFFFF` (Pure white containers for cards, forms, and tables).
*   `color-border-subtle`: `color-slate-200` | Hex: `#E2E8F0` (Thin boundaries separating tables and dashboard widgets).

---

### 2.2 Spacing & Layout Grid (8px Base Scale)
All component padding, margin, and gap values must align with the 8px spatial grid to maintain consistent layout rhythm.

*   `spacing-xs`: `4px` (Tight padding between chip labels and icons).
*   `spacing-sm`: `8px` (Inner spacing of input fields, buttons).
*   `spacing-md`: `16px` (Padding inside standard cards and dialog containers).
*   `spacing-lg`: `24px` (Horizontal margins, gap between adjacent dashboard widgets).
*   `spacing-xl`: `32px` (Vertical spacing between page sections).
*   `spacing-xxl`: `48px` (Top margin for major page title sections).

---

### 2.3 Typography Design Tokens
Typography is optimized to ensure maximum legibility and proper semantic hierarchy.

*   **Arabic Typographic Target:** `font-family-arabic`: `"DIN Next Arabic", "Inter", sans-serif`.
*   **English Typographic Target:** `font-family-english`: `"DIN Next", "Inter", sans-serif`.
*   **Monospaced Target:** `font-family-mono`: `"JetBrains Mono", monospace`.

```
┌────────────────────────────────────────────────────────┐
│               Typography Scale & Hierarchy             │
├───────────────────┬───────────┬──────────────┬─────────┤
│ Token Name        │ Size (px) │ Weight (gsm) │ Line-Ht │
├───────────────────┼───────────┼──────────────┼─────────┤
│ font-display      │ 36px      │ Bold (700)   │ 1.2     │
│ font-heading-h1   │ 30px      │ Bold (700)   │ 1.3     │
│ font-heading-h2   │ 24px      │ SemiBold(600)│ 1.3     │
│ font-heading-h3   │ 20px      │ Medium (500) │ 1.4     │
│ font-body-lg      │ 16px      │ Regular (400)│ 1.5     │
│ font-body-base    │ 14px      │ Regular (400)│ 1.5     │
│ font-caption      │ 12px      │ Regular (400)│ 1.4     │
│ font-mono-data    │ 12px      │ Medium (500) │ 1.3     │
└───────────────────┴───────────┴──────────────┴─────────┘
```

---

### 2.4 Border Radius, Shadows, and Motion
*   **Radius Scale:**
    *   `radius-sm`: `4px` (Form inputs, validation checkboxes).
    *   `radius-md`: `8px` (Standard buttons, chips, tags, dialog buttons).
    *   `radius-lg`: `12px` (Cards, dashboard widgets, modal containers).
*   **Elevation Shadows (No Blur Clutter):**
    *   `shadow-sm`: `0 1px 2px 0 rgba(15, 23, 42, 0.05)` (Subtle card outline).
    *   `shadow-md`: `0 4px 6px -1px rgba(15, 23, 42, 0.1)` (Dropdowns, floating dialogs).
*   **Standard Transition Motion:**
    *   `motion-duration-fast`: `150ms` (Hover states on buttons and links).
    *   `motion-duration-normal`: `300ms` (Modal transitions, sidebar collapsible animations).
    *   `motion-easing-standard`: `cubic-bezier(0.4, 0, 0.2, 1)`.

---

## 3. ATOMIC COMPONENTS SPECIFICATIONS

Atomic components represent the basic, building blocks of the interface. They cannot be broken down further.

```
  [ Atom: Button ] ──► [ Atom: Icon ] ──► [ Atom: Badge / Chip ]
```

### 3.1 Button Component Specs (`ATOM-BUTTON`)
The button is the primary tool for user actions. It must maintain high contrast and clear focus indicators.

```
┌────────────────────────────────────────────────────────┐
│                   ATOM-BUTTON Specs                    │
├─────────────┬──────────────────┬───────────────────────┤
│ Variant     │ Text Token Color │ Background Token Color│
├─────────────┼──────────────────┼───────────────────────┤
│ Primary     │ color-white      │ color-brand-primary   │
│ Secondary   │ color-slate-900  │ color-slate-100       │
│ Outline     │ color-green-700  │ Transparent           │
│ Danger      │ color-white      │ color-status-danger   │
└─────────────┴──────────────────┴───────────────────────┘
```

*   **States & Interaction Behavior:**
    *   *Hover State:* Background color dims by 10% (e.g., `color-brand-primary` shifts to `#005C26`), transition duration matches `motion-duration-fast`.
    *   *Focus State:* Enforces a high-contrast double outline: an inner white ring followed by a 2px outer ring of `color-brand-primary` to satisfy keyboard navigation requirements.
    *   *Active State:* Pushes down by 1px to provide clear physical interaction feedback.
    *   *Disabled State:* Opacity drops to `40%`, pointer events are disabled, and background shifts to `color-slate-100` with light slate text.
    *   *Loading State:* Button locks, text is temporarily hidden, and a centered spinning circle matches the text color.
*   **Touch Targets:** Pinned to a minimum touch size of **44x44 pixels** on mobile views.

---

### 3.2 Badges & Status Chips (`ATOM-BADGE`)
Badges and status chips provide a quick, visual classification of statuses and categories.

*   **Approved Status Chip:** Background `color-emerald-50` with text `color-status-success`. Displays a solid success icon.
*   **Pending Warning Chip:** Background `color-amber-50` with text `color-status-warning`. Displays an exclamation mark icon.
*   **Revoked Danger Chip:** Background `color-red-50` with text `color-status-danger`. Displays a locked or closed icon.
*   **Under Review Info Chip:** Background `color-sky-50` with text `color-status-info`. Displays an information circle icon.

---

## 4. MOLECULE COMPONENTS (COMPOSITE FORMS)

Molecules are combinations of atoms that function together as a single form field or input group.

```
[ Label Atom ] + [ Text Input Atom ] + [ Error Indicator Atom ] ──► [ Molecule Field ]
```

### 4.1 Bilingual Form Field Control (`MOL-FORM-FIELD`)
Form fields must manage focus, input, and error states dynamically to ensure smooth data entry.

```
  ( Normal State ) ──► ( Focus Active ) ──► ( Invalid Input ) ──► ( Focus Out / Valid )
  Border: slate-200    Border: green-700    Border: red-600        Border: slate-200
```

*   **Form Structure:**
    1.  *Label Header (Top):* Rendered in `font-body-base`, weight semi-bold. Demands a localized required asterisk `*` in status red for mandatory inputs.
    2.  *Input Box (Center):* Solid border of `color-slate-200`, radius `radius-md`, utilizing typography token `font-body-base`.
    3.  *Helper or Error Label (Bottom):* Default state is empty or display helper text in neutral slate. On invalid validation, error text is loaded in `color-status-danger`, changing the box border to status red.
*   **Security Inputs (Masked Data):**
    *   *Sensitive Inputs (e.g., National ID, Password):* Includes a toggle icon on the trailing edge (eye/eye-off) to mask or unmask content. Default state is masked.
    *   *Secure Copy Blocking:* Input fields with classified or sensitive data must disable copy, cut, and paste interactions at the client browser level.

---

### 4.2 File Upload Control (`MOL-FILE-UPLOAD`)
The file upload control is designed to support drag-and-drop interactions as well as manual file selection.

*   **Drop Zone Container:** Light gray, dashed border using `color-slate-300`, background using `color-slate-50`.
*   **Drop Zone Actions:** Displays an upload cloud icon, followed by a primary action button labeled "Choose File" or "اسحب الملف هنا".
*   **Status Indicators:**
    *   *Uploading State:* Shows a linear progress indicator showing percentage uploaded and current transfer speeds.
    *   *Success State:* Card changes border to green, displaying a file checkmark icon alongside the computed SHA-256 hash stamp for user validation.
    *   *Error State:* Card changes border to red, displaying a clear failure message (e.g., *"File exceeds maximum 10MB limit"* or *"Unsafe file signature detected"*).

---

## 5. REUSABLE ORGANISM LAYER

Organisms are complex UI components composed of molecules and atoms, representing complete functional areas like data tables or widgets.

```
  [ Molecule: Search ] + [ Molecule: Pagination ] + [ Atoms: Rows ] ──► [ Organism: Data Table ]
```

### 5.1 Enterprise Data Table System (`ORG-DATA-TABLE`)
The data table is the primary tool for displaying list-based records in administrative and merchant portals.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ORG-DATA-TABLE Layout                           │
├────────────────────────────────────────────────────────────────────────┤
│ Header: [ Bulk Actions ]                  [ Search ]   [ Export CSV ]  │
├────────────────────────────────────────────────────────────────────────┤
│ Columns: Entity ID | Name | State | Date | SLA Status | Quick Action   │
├────────────────────────────────────────────────────────────────────────┤
│ Rows: [Checkbox]   | Data | Data  | Data | Status Chip| [Edit Button]  │
├────────────────────────────────────────────────────────────────────────┤
│ Footer: Displaying 1-10 of 480 items     [ Prev Page ]  [ Next Page ]  │
└────────────────────────────────────────────────────────────────────────┘
```

*   **Responsive Scrolling Rules:**
    *   *Desktop Displays:* All columns are displayed with a sticky header. Columns auto-scale with explicit minimum widths.
    *   *Mobile Displays:* The table transforms into a vertically stacked list of cards. Column fields are grouped as key-value pairs inside each card.
*   **Table Interaction Specs:**
    *   *Hover Row State:* Row background changes to `color-slate-50` with a smooth fade, providing cursor feedback.
    *   *Bulk Actions:* Selecting the header checkbox reveals a persistent action panel on the top, allowing the user to select multiple rows to download certificates, trigger notifications, or queue reviews.

---

### 5.2 Chronological Activity Timeline (`ORG-TIMELINE`)
Used in caseworker reviews, complaint audits, and investor dashboards to show case history.

*   **Structure:** A vertical, high-contrast timeline line in slate gray, connecting a series of action cards.
*   **Timeline Nodes:**
    *   *Authoritative Actions (e.g., Approvals, Citations):* Node is a solid green circle containing a white checkmark or stamp icon.
    *   *Operational Events (e.g., Draft Saves, Minor Edits):* Node is a hollow gray circle containing a status info icon.
*   **Content Details:** Each timeline card displays the action title, actor name (e.g., Case Officer ID), timestamp, and a summary of state changes or comments.

---

## 6. SOVEREIGN AI INTERFACE COMPONENTS

The integration of the Sovereign AI Assistant requires specialized, visually distinct UI components to ensure users can easily distinguish AI recommendations from official, binding ministry decisions.

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

### 6.1 AI Suggestion Cards (`MOL-AI-CARD`)
*   **Visual Framing:** Bound in an elegant Slate card with a 1px border using Sovereign Gold `#D4AF37`. Includes a clean AI sparkle icon "✨" as a visual label.
*   **Background Canvas:** Soft, light gold-gray canvas to visually separate it from core application data.
*   **Confidence Indicators:** Displays a dynamic confidence rating (e.g., `Confidence Index: 92%` or `HIGH`) alongside a "Data Sources" link to view referenced rules and documents.
*   **AI Disclaimer Footer:** Every AI component must display a persistent, bilingual warning:
    *   *Arabic:* `مخرجات الذكاء الاصطناعي استشارية وغير ملزمة قانونياً.`
    *   *English:* `AI recommendations are advisory and legally non-binding.`

---

### 6.2 Interactive AI Chat Console (`ORG-AI-CHAT`)
An expandable chat drawer providing a secure, natural language interface for portal users and executives.

*   **Header Interface:** Displays "Sovereign AI Assistant" with an active, pulsing indicator showing model availability.
*   **Message Stream:**
    *   *User Messages:* Displayed in a right-aligned (RTL) or left-aligned (LTR) message bubble using Slate background.
    *   *AI Responses:* Displayed on the opposite side, formatted in a soft gold card with markdown support, proper margins, and bold key terms.
*   **Actionable Chat Suggestions:** Features quick-tap buttons based on context (e.g., *"How do I register a textile factory?"* or *"ما هي تكلفة حجز اسم تجاري"*).

---

## 7. SYSTEM REUSABLE TEMPLATES (GRID LAYOUTS)

Layout templates define the structural skeleton of the portals, ensuring a consistent user experience.

```
┌────────────────────────────────────────────────────────┐
│               Enterprise Page Template                 │
├────────────────────────────────────────────────────────┤
│ [ Header Menu / Portal Logo ]                          │
├────────────────────────────────────────────────────────┤
│ [ Left Sidebar ]  │ [ Breadcrumbs ]                    │
│  - Dashboard      ├────────────────────────────────────┤
│  - My Companies   │ [ Main Workspace Content ]         │
│  - Invoices       │                                    │
│  - Messages       │                                    │
│                   │                                    │
└───────────────────┴────────────────────────────────────┘
```

*   **Responsive Page Layouts:**
    *   *Double-Column Grid:* Left-aligned sidebar navigation (collapsible to icons) paired with a responsive main content workspace. The grid shifts to a single column on mobile screens.
    *   *Workspace Boundaries:* Max-width of the main content workspace is restricted to **1280px** on large screens, preventing layout distortion and ensuring comfortable reading spans.

---

## 8. ACCESSIBILITY & BILINGUAL PARITY SPECIFICATIONS

The Design System is engineered to guarantee full accessibility and bilingual usability.

### 8.1 RTL/LTR Layout Parity (Bilingual Flow)
*   **Structural Flipping:** Language toggling automatically reverses the structural layout direction of components. Headers, sidebars, buttons, form inputs, and typography alignment swap smoothly from Right-to-Left (Arabic) to Left-to-Right (English).
*   **Grid Parity:** Grids, layout cards, and flex containers use direction-aware CSS classes (e.g., using logical properties like `margin-inline-start` instead of `margin-left`) to prevent layout distortion during language toggling.

---

### 8.2 Keyboard & Focus Operability (WCAG 2.2 AA)
*   **Logical Focus Order:** Users can navigate all interactive components, modals, and wizards sequentially using only the `TAB` and `SHIFT + TAB` keys. Focus states follow the natural reading order of the language (RTL vs. LTR).
*   **Focus Ring Design:** Focus indicators must never be hidden. The standard focus state is a high-contrast double outline using `color-brand-primary` and a white inset ring, satisfying WCAG 2.2 contrast rules.
*   **Aria Labels and Roles:** All custom visual atoms (such as custom switch toggles or modal dialog controls) must include explicit `aria-label`, `aria-describedby`, and semantic role tags to ensure compatibility with screen readers.

---

## 9. DESIGN SECURITY & SENSITIVE DATA MASKS

Security controls are embedded directly into the UI components to protect personal and corporate data.

```
[ Sensitive field: National ID ] ──► [ Click to View ] ──► [ MFA verification / Log entry ]
```

*   **Secure Input Masking:** Text fields containing sensitive or private information (such as National ID numbers, tax IDs, or personal phone numbers) are masked by default (e.g., `XXXX-XXXX-1234`).
*   **On-Demand Reveal Pattern:** Users can click a "View" eye icon next to masked fields to reveal the contents. Revealing sensitive fields triggers an immediate entry in the security audit log, capturing the user's ID, timestamp, and IP address.
*   **Session Timeout Alert Dialogue (`MOL-TIMEOUT-ALERT`):**
    *   A high-contrast overlay modal that alerts the user 2 minutes before their secure session expires. It displays a countdown timer and a primary button to renew the session, alongside a secondary button to log out securely.

---

## 10. DESIGN SYSTEM GOVERNANCE & COMPLIANCE

The Enterprise Design System is managed under a structured governance framework to ensure visual consistency and code quality as digital services expand:

1.  **Strict Component Registry:** Developers must build interfaces using only components from the approved UI library. Creating custom, non-compliant visual styles is strictly blocked.
2.  **Bilingual Parity Sign-off:** No component or template can be deployed to production unless its visual styling and layout are reviewed and approved in both Arabic and English.
3.  **Semi-Annual Accessibility Audits:** Designated accessibility auditors conduct regular reviews of the components library, verifying compliance with current WCAG criteria.
4.  **Token-Driven Maintenance:** Changes to spacing, colors, or typography are applied by updating the central Design Tokens, ensuring updates roll out consistently across all connected platforms.
