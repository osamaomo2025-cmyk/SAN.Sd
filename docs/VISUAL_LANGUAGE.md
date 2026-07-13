# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL DIGITAL BRAND IDENTITY & VISUAL LANGUAGE MANUAL (v1.0.0)

---

## 1. EXECUTIVE SUMMARY & BRAND PHILOSOPHY

This manual establishes the authoritative **Government Design System and Visual Language** for the Sudan Digital Ministry of Commerce & Industry (MCI). Prepared under the national "Sudan 2035 Digital Sovereignty Directive," this specification defines the official design standard for all present and future digital products, portals, dashboards, mobile applications, and official digital correspondence of the Ministry.

The goal of this visual language is to build deep **trust, transparency, stability, and digital accessibility** for citizens, local merchants, foreign investors, and public officials. By combining modern human-centered interface standards with a restrained, highly professional representation of Sudanese national identity, this system sets a benchmark for civic digital products in East Africa.

```
       [ National Identity Elements ] ──► [ Restrained Digital Stylization ]
                                                      │
         ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
         ▼                                            ▼                                            ▼
┌──────────────────┐                         ┌──────────────────┐                         ┌──────────────────┐
│   Sudan Green    │                         │  Sovereign Gold  │                         │ DIN Next Arabic  │
│  Trust & Growth  │                         │ Certified Stamp  │                         │ Clear Typography │
└──────────────────┘                         └──────────────────┘                         └──────────────────┘
```

### Core Design Philosophy:
*   **Government-Grade Dignity:** Avoid temporary web design trends, heavy gradients, or flashing elements. Visual design is grounded in structural discipline, solid color surfaces, generous negative space, and typographic clarity.
*   **Aesthetic Honesty & No Tech-Larping:** Interfaces must not include artificial developer metrics, fake system logs, mock network indicators, or diagnostic data. Every visual element must serve a direct, human-centered functional purpose.
*   **Linguistic Parity & Bi-directional Symmetries:** Absolute design equivalence between Arabic (RTL) and English (LTR). Layout shifting must happen seamlessly without breaking column alignments or typographic weight.
*   **Usability Over Aesthetics:** High text contrast, clear interactive boundaries, and standard form controls are prioritized over decorative elements.

---

## 2. NATIONAL VISUAL IDENTITY & THEMATIC ANCHORS

The visual identity translates Sudanese heritage into a clean, modern digital language. It uses restrained cultural details as strategic accents, avoiding overwhelming decorative graphics.

```
+────────────────────────────────────────────────────────────────────────+
│                      Sudan National Emblem Accent                      │
├────────────────────────────────────────────────────────────────────────┤
│ Visual Treatment: Simplified vector outline, rendered in Sovereign     │
│ Gold, applied exclusively as a subtle watermark background on official │
│ certificates and secure executive portals.                             │
+────────────────────────────────────────────────────────────────────────+
```

### 2.1 Visual Identity Anchors:
*   **Sudan National Green (`#007A33`):** The primary brand anchor, representing fertility, growth, commerce, and agricultural prosperity. Used as the leading color for primary buttons, active states, and header branding.
*   **Sovereign Gold (`#D4AF37`):** Represents trade excellence, industrial standards, and official certifications. Reserved for authenticated seals, approved status accents, and executive margins.
*   **Restrained Geometric Accents:** Minimalist, linear representations of traditional Sudanese weaving and architecture are used as border dividers or section backdrops to establish identity while keeping the UI clean and scannable.

---

## 3. TYPOGRAPHY SYSTEM & READING RHYTHM

Typography is the most critical element of the MCI visual brand. The typography scale is engineered to ensure high legibility on small mobile screens and high-resolution displays alike.

```
┌────────────────────────────────────────────────────────┐
│             Bilingual Font Stack Selection             │
├────────────────────────────────────────────────────────┤
│ Arabic (RTL): "DIN Next Arabic", "Inter", sans-serif   │
├────────────────────────────────────────────────────────┤
│ English (LTR): "DIN Next", "Inter", sans-serif         │
├────────────────────────────────────────────────────────┤
│ Numeric / Codes: "JetBrains Mono", monospace           │
└────────────────────────────────────────────────────────┘
```

### 3.1 Typographic Scale & Hierarchy

| Token Identifier | Font Size (px) | Line Height | Font Weight | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- |
| `font-display` | 36px / 2.25rem | 1.2 | Bold (700) | Landing page hero statements, main section headers. |
| `font-h1` | 30px / 1.875rem| 1.3 | Bold (700) | Main service page titles, primary portal headers. |
| `font-h2` | 24px / 1.5rem | 1.3 | SemiBold (600) | Card grouping titles, major dashboard panels. |
| `font-h3` | 20px / 1.25rem | 1.4 | Medium (500) | Form section subtitles, dialogue titles. |
| `font-body-lg` | 16px / 1.0rem | 1.5 | Regular (400) | Informational summaries, help articles. |
| `font-body` | 14px / 0.875rem| 1.5 | Regular (400) | Standard body copy, form labels, inputs. |
| `font-caption` | 12px / 0.75rem | 1.4 | Regular (400) | Input field helper labels, table column headers. |
| `font-mono-data` | 12px / 0.75rem | 1.3 | Medium (500) | Transaction hashes, invoice IDs, CR numbers. |

### 3.2 Reading Rhythm & Alignments:
*   **Arabic Text Realization (RTL):** Text alignment defaults to `right`, utilizing standard Arabic word spacing to prevent awkward line breaks. Font weights below Medium (500) are avoided on dark backgrounds to ensure high legibility.
*   **English Text Realization (LTR):** Text alignment defaults to `left`. Text tracking is set to standard, and normal font-smoothing is applied across all browsers.
*   **Numeric Display Standard:** Monospaced formatting (using **JetBrains Mono**) is required for all numeric displays, financial values, invoice details, dates, and registration codes. This prevents layout shifting and ensures tables align perfectly.

---

## 4. SEMANTIC COLOR SYSTEM & CONTRAST RULES

Colors are defined using a structured token taxonomy to separate visual appearance from underlying code implementation.

```
  [ Global Palette (Neutral Slate) ] ──► [ Semantic Token (Text Color) ] ──► [ WCAG 4.5:1 Checked ]
```

### 4.1 System Palette Definition

#### Primary Brand Colors
*   `color-brand-primary`: `color-green-700` | Hex: `#007A33` (Sudan National Green. Used for main buttons, headers, and active links).
*   `color-brand-secondary`: `color-gold-600` | Hex: `#D4AF37` (Sovereign Gold. Reserved for certified credentials, seals, and approvals).
*   `color-brand-dark`: `color-slate-900` | Hex: `#0F172A` (Deep Charcoal. Enforces crisp, high-contrast text readability).

#### Interactive State Variations
*   `color-interactive-hover`: `color-green-800` | Hex: `#005C26` (Dimmed green for button hover states).
*   `color-interactive-active`: `color-green-900` | Hex: `#00401A` (Deep green for active click states).
*   `color-interactive-focus`: `color-sky-500` | Hex: `#0EA5E9` (High-visibility blue outline for keyboard focus).

#### Feedback & System Status
*   `color-status-success`: `color-emerald-600` | Hex: `#059669` (Completed tasks, approved clearances).
*   `color-status-warning`: `color-amber-500` | Hex: `#D97706` (Near-breach SLAs, pending clarifications).
*   `color-status-danger`: `color-red-600` | Hex: `#DC2626` (Citations, expired licenses, system errors).
*   `color-status-info`: `color-sky-600` | Hex: `#0284C7` (System guides, informative status logs).

#### Neutral Surfaces & Canvas
*   `color-bg-canvas`: `color-slate-50` | Hex: `#F8FAFC` (Soft off-white canvas to minimize eye strain).
*   `color-bg-surface`: `color-white` | Hex: `#FFFFFF` (Pure white containers for cards, forms, and tables).
*   `color-border-subtle`: `color-slate-200` | Hex: `#E2E8F0` (Thin boundaries separating tables and dashboard widgets).

---

### 4.2 Accessibility Contrast Requirements

To comply with **WCAG 2.2 AA** standards, every text-to-background color combination must be tested to ensure clear contrast:

*   **Standard Text (< 18px):** Must maintain a minimum contrast ratio of **4.5:1**.
*   **Large Text (>= 18px):** Must maintain a minimum contrast ratio of **3.0:1**.
*   **High-Contrast Color Pairings:**
    *   *Primary Buttons:* Pure White `#FFFFFF` text on Sudan Green `#007A33` background (Contrast: **5.1:1** - APPROVED).
    *   *Danger Buttons:* Pure White `#FFFFFF` text on Status Red `#DC2626` background (Contrast: **4.6:1** - APPROVED).
    *   *Light Surface Text:* Deep Charcoal `#0F172A` text on White `#FFFFFF` background (Contrast: **16.2:1** - APPROVED).

---

## 5. SPACING, GRID & RESPONSIVE LAYOUT SYSTEM

All interface components are structured around a standard 8px grid system, ensuring a consistent layout rhythm across all screen sizes.

```
                       [ 1280px Maximum Width Limit ]
┌────────────────────────────────────────────────────────────────────────┐
│  Sidebar Margin  │  Column 1  │  Column 2  │  Column 3  │  Right Margin │
│      (24px)      │   (Gap:    │   16px)    │            │    (24px)     │
└──────────────────┴────────────┴────────────┴────────────┴───────────────┘
```

### 5.1 Layout Grid Breakpoint Parameters

| Device Tier | Screen Breakpoint | Columns | Gutter Width | Outer Margins | UX Layout Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile** | `< 640px` | 4 Columns | 12px | 16px | Single-column stacking. Sticky bottom actions. |
| **Tablet** | `640px - 1024px` | 8 Columns | 16px | 24px | Double-column grids. Sidebar collapses to top. |
| **Desktop**| `1024px - 1440px`| 12 Columns| 24px | 32px | Persistent left sidebar, multi-column dashboard. |
| **Wide** | `>= 1440px` | 12 Columns| 24px | Auto-centered | Maximum width restricted to 1280px. |

---

## 6. ICONOGRAPHY & ILLUSTRATION DIRECTIVES

The icon library provides clean, visual shorthand for actions, statuses, and services.

```
       [ Icon Alignment Frame: 24x24px Grid ]
┌────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────┐  │
│  │               Filled Active Core                 │  │
│  │               (Stroke: 2px Bold)                 │  │
│  │               (Radius: 4px Soft)                 │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### 6.1 Icon Style Standards:
1.  **Unified Vector Line Art:** All icons must be imported from the `lucide-react` library. Custom SVGs or non-standard icons are not permitted.
2.  **Stroke Weight & Corners:** Enforce a consistent stroke weight of **2px** with soft, rounded corners to match the typography's curves.
3.  **Bilingual Mirroring Rules:** Icons representing directional actions (such as arrows, undo/redo, file trees, or back/forward buttons) must be mirrored when toggling between Arabic (RTL) and English (LTR).

---

### 6.2 Photographic & Imagery Standards
*   **Authenticity Over Stock Art:** Use high-quality, authentic photographs representing real Sudanese commerce, manufacturing plants, agricultural developments, and local entrepreneurs.
*   **Avoid Over-Stylized Graphics:** Do not use abstract patterns, heavy graphic drop-shadows, or bright color filters. Keep imagery clean, professional, and well-lit.
*   **Respect Cultural Diversity:** Ensure that official photography is inclusive and represents the diverse geographic and cultural fabric of the Sudanese workforce.

---

## 7. CONTENT DESIGN, PLAIN LANGUAGE & VOICE BRANDING

To ensure that MCI services are accessible to all citizens, including those with varying levels of digital literacy, all platform text must follow clear, plain language guidelines.

```
               [ Complex Administrative Decree ]
                               │
                               ▼
            ┌──────────────────────────────────────┐
            │       Plain Language Rewrite         │
            └──────────────────┬───────────────────┘
                               │
                               ▼
            ┌──────────────────────────────────────┐
            │   Bilingual Content Validation       │
            └──────────────────────────────────────┘
```

### 7.1 Plain Language Principles:
*   **Concise Sentences:** Keep sentences short and direct. Avoid passive voice, dense legal jargon, and run-on sentences.
*   **Direct Headings:** Use informative, action-oriented headings that guide users through forms and processes.
*   **Bilingual Terminology Parity:** Maintain a synchronized, bilingual glossary to ensure consistent translation of key business and trade terms between Arabic and English.

---

### 7.2 System Messages & Status Writing Guidelines

#### Error Messages
*   *Incorrect (Technical Jargon):* `ERROR 503: Connection failed. DB_CONN_TIMEOUT.`
*   *Correct (Action-Oriented):* `عذراً، تعذر الاتصال بنظام السجل التجاري حالياً. تم حفظ مسودتك تلقائياً، يرجى المحاولة مرة أخرى خلال بضع دقائق.` / `We are temporarily unable to connect to the Commercial Registry. Your progress has been saved automatically; please try again in a few minutes.`

#### Success Messages
*   *Incorrect (Vague):* `Transaction complete.`
*   *Correct (Informative):* `تم استلام طلب تجديد السجل التجاري بنجاح برقم مرجعي #CR-98240-X. ستصلك رسالة نصية قصيرة فور اكتمال المراجعة.` / `Your Commercial Registration renewal request was successfully received with reference number #CR-98240-X. You will receive an SMS confirmation once the review is complete.`

---

## 8. DESIGN SYSTEM COMPONENT LIBRARY (ATOMIC BASE)

The component library contains the fundamental, reusable building blocks used to construct the platform's interfaces.

```
  [ Atom: Button ] ──► [ Molecule: Input Group ] ──► [ Organism: Page Form ]
```

### 8.1 Reusable Form Fields (`ATOM-FORM-FIELD`)
Form components must manage focus, input, and error states dynamically to ensure smooth data entry.

```
  ( Normal State ) ──► ( Active Focus ) ──► ( Invalid Input ) ──► ( Disabled State )
  Border: slate-200    Border: green-700    Border: red-600        Bg: slate-100
```

*   **States & Design Tokens:**
    *   *Default State:* Soft gray border `color-slate-200`, white background, neutral text.
    *   *Focus State:* Thick green border `color-brand-primary`, with a high-visibility blue outline `color-interactive-focus` to support keyboard navigation.
    *   *Invalid State:* Red border `color-status-danger`, accompanied by clear, descriptive error text below the input field.
    *   *Disabled State:* Soft gray background `color-slate-100`, disabled pointer events, and faded gray text.

---

### 8.2 Interactive Microinteractions & Motion Design
*   **Hover Transitions:** Background and borders feature subtle transitions matching `motion-duration-fast` (150ms) with a cubic-bezier easing curve, providing immediate cursor feedback.
*   **Reduced Motion Support:** All transitions and animations must support the standard `prefers-reduced-motion` media query. When active, page transitions, sidebar expansions, and progress loops collapse immediately to basic opacity fades, ensuring comfort and accessibility for users with vestibular conditions.

---

## 9. CERTIFICATES & OFFICIAL DOCUMENT DESIGN STANDARDS

Digital certificates and official correspondence issued by the Ministry are designed for absolute authenticity, security, and print readiness.

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

### 9.1 Visual Layout Rules:
1.  **Standard Page Dimension:** Formatted to standard **A4 portrait layout** with a persistent 20mm margin on all edges.
2.  **Official Headers & Seals:**
    *   *Header Section:* Features the official coat of arms of the Republic of Sudan and the Ministry of Commerce & Industry logo, centered on the page.
    *   *Background Watermark:* Displays a simplified vector outline of the National Emblem, rendered in light gold-gray with **5% opacity** to prevent interference with text readability.
3.  **Cryptographic QR Stamp:** Placed in the bottom-left corner of the certificate. Scanning the QR code routes the validator to the official verification page (`SCR-PUB-REGISTRY`), verifying authenticity.
4.  **Authorized Digital Signature Area:** Placed in the bottom-right corner, displaying the Minister's signature block, cryptographic SHA-256 confirmation hash, and timestamp.
5.  **Typography Constraints:** Headings use **DIN Next Arabic** (Arabic) and **DIN Next** (English), with monospaced **JetBrains Mono** reserved for serial keys, validation dates, and fee codes.
6.  **Print-Ready Optimization:** Certificates must compile into compact, vector-based PDF files optimized for black-and-white printing, ensuring all text remains crisp and readable.

---

## 10. ACCESSIBILITY COMPLIANCE MANUAL (WCAG 2.2 AA)

To satisfy the "Sudan 2035 Digital Sovereignty Directive," all platform interfaces must conform to international accessibility standards.

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

### Accessibility Standards:
1.  **Keyboard Navigation:** All interactive elements (such as links, buttons, and form inputs) must be fully functional using only a keyboard. Focus rings must remain highly visible at all times.
2.  **Screen Reader Compatibility:** Public pages must use semantic HTML tags, clear ARIA roles, and informative alternative text (ALT text) for all icons, charts, and illustrations.
3.  **Color Blind Safety:** Do not rely on color alone to convey critical status changes. Ensure status indicators pair colors with descriptive icons and clear, textual labels.
4.  **Bilingual Reading Flow:** Toggling between Arabic and English must adjust the document reading flow (RTL vs. LTR), swap sidebar layouts, and flip input orientations cleanly.

---

## 11. DESIGN SYSTEM GOVERNANCE & ROBUST CONTRIBUTION WORKFLOW

To maintain visual consistency and support aligned updates as legislation evolves, the Design System is managed under a structured governance framework.

```
[ Propose Component ] ──► [ Design Review ] ──► [ Accessibility Review ] ──► [ Token Build ] ──► [ Release ]
```

### Governance Boards:
*   **Design Review Board (DRB):** Led by the Chief UX Architect. Evaluates, approves, and prioritizes updates to the components library and design tokens.
*   **Accessibility Review Board (ARB):** Verifies that all proposed changes and new components conform to WCAG 2.2 AA standards before being merged.

---

### Design System Roadmap & Evolution:
*   **Phase 1 (Immediate):** Full integration of base typography tokens, color tokens, form components, and responsive grid layouts.
*   **Phase 2 (6 Months):** Deployment of advanced composite widgets (including interactive charts, data grids, and activity timelines) across the employee and merchant portals.
*   **Phase 3 (12 Months):** Release of deep-grounded AI assistant chat interfaces, executive BI widgets, and mobile-optimized inspection layouts.
*   **Phase 4 (Long-Term):** Interoperability with Sudan's national digital communication gateways and unified citizen platforms.
