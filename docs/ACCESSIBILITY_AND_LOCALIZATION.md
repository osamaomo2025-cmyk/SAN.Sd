# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL INCLUSIVE DIGITAL EXPERIENCE MANUAL: ACCESSIBILITY, LOCALIZATION, INTERNATIONALIZATION, & RESPONSIVE STANDARDS (v1.0.0)

---

## 1. DESIGN PHILOSOPHY & INCLUSIVE STATEMENT

This framework establishes the authoritative **Accessibility, Localization, Internationalization, and Responsive Experience Framework** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national **"Sudan 2035 Digital Sovereignty Directive,"** this specification guarantees that all current and future digital services, portals, mobile applications, and internal workflows are universally accessible and culturally responsive.

In Sudan, where infrastructure varies from urban centers to remote regions, and where citizens access digital tools under varying network bandwidths and on a wide range of devices, **Inclusivity is a Core Sovereign Metric**. The platform is designed to support users of all physical, sensory, and cognitive abilities, ensuring equal access to commerce and industry services.

```
+─────────────────────────────────────────────────────────────────────────────────────────+
|                            Unified Inclusive Experience Core                            |
├───────────────────────────────┬────────────────────────────────┬────────────────────────┤
│     Accessibility (A11y)      │      Localization (L10n)       │    Performance (Perf)  │
│  - WCAG 2.2 AA Compliance     │  - Unified Bilingual Parity    │  - Offline-First Engine│
│  - 100% Keyboard Navigable    │  - DIN Next Arabic (RTL)       │  - Low-Bandwidth Mode  │
│  - Rich ARIA Landmark Trees   │  - DIN Next English (LTR)      │  - Minimal Assets      │
└───────────────────────────────┴────────────────────────────────┴────────────────────────┘
```

---

## 2. ENTERPRISE ACCESSIBILITY FRAMEWORK (WCAG 2.2 AA)

To satisfy the highest standards of digital inclusion, the MCI platform enforces strict, testable compliance with the **Web Content Accessibility Guidelines (WCAG) 2.2 AA** and the **WAI-ARIA 1.2** specification.

```
┌────────────────────────────────────────────────────────┐
│               WCAG 2.2 AA Contrast Checker             │
├───────────────────┬───────────────┬────────────────────┤
│ Element Type      │ Target Ratio  │ Base Color Hex     │
├───────────────────┼───────────────┼────────────────────┤
│ Small Text (<18px)│ 4.5:1 Minimum │ #0F172A (Charcoal) │
│ Large Text (>=18px│ 3.0:1 Minimum │ #007A33 (Sudan Grn)│
│ Graphic Boundaries│ 3.0:1 Minimum │ #E2E8F0 (Borders)  │
└───────────────────┴───────────────┴────────────────────┘
```

### 2.1 Focus & Keyboard Operability (`A11Y-KEYBOARD`)
The platform must be entirely navigable and functional without the use of a mouse or pointing device.
1.  **Logical Focus Order (`TAB` Flow):**
    *   Pressing `TAB` must advance focus through interactive elements in the logical reading order of the selected language: Right-to-Left (RTL) for Arabic, and Left-to-Right (LTR) for English.
    *   Focus must never become locked or trapped within any component (e.g., inside modal dialogs or dropdown menus). Pressing `SHIFT + TAB` must reverse focus order cleanly.
2.  **Skip Links & Landmarks:**
    *   A high-contrast skip link styled with `color-brand-primary` must appear as the very first keyboard focus element. Pressing `ENTER` on this link bypasses navigation bars and jumps focus directly to the main workspace anchor (`#main-content`).
    *   Landmarks (such as `<header>`, `<nav>`, `<main>`, `<aside>`, and `<footer>`) must be declared clearly, allowing screen reader users to jump between page sections using screen reader shortcut keys.
3.  **High-Visibility Focus Indicators:**
    *   The browser's default focus outline must be replaced with a consistent, dual-ring outline token: a 2px inner padding ring of `color-bg-surface` followed by a 2px outer outline of `color-brand-primary` (or `color-interactive-focus`).
    *   Focus states must never be hidden or suppressed, even when using mouse interactions.

```
          [ Standard Button Focus Outline ]
┌───────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────┐  │
│  │  [Button Surface: White #FFFFFF text on]    │  │
│  │  [Sudan National Green #007A33 Background]  │  │
│  └─────────────────────────────────────────────┘  │
│  Outer Ring: 2px High-contrast Focus Blue (#0EA5E9)│
└───────────────────────────────────────────────────┘
```

4.  **Custom Interactive Keyboard Shortcuts:**
    *   `CTRL + /` (or `CMD + /` on macOS): Instantly opens and focuses the cursor inside the bilingual **Sovereign AI Chat Panel**.
    *   `ESCAPE`: Closes open modal dialogs, collapsed drawers, mobile menus, and context menus, returning focus to the triggering element.
    *   `ARROW KEYS` (Up/Down/Left/Right): Standardizes navigation inside interactive data tables, dropdown options, select menus, and tab lists.

---

### 2.2 Screen Reader Compatibility (`A11Y-SCREEN-READER`)
To ensure compatibility with assistive technologies (such as JAWS, NVDA, and VoiceOver), all interfaces must utilize descriptive semantic HTML and clear ARIA roles.

*   **Bilingual Reading Order:** The screen reader's reading order must follow the visual structure of the page, flipping directions seamlessly based on the `dir` attribute of the container document (`dir="rtl"` for Arabic, `dir="ltr"` for English).
*   **Aria Labels & Landmark Structures:**
    *   Custom icons or buttons that do not contain descriptive text must include an explicit `aria-label` (e.g., `<button aria-label="تحميل الشهادة بصيغة PDF"><IconName /></button>`).
    *   Status messages and background processes (such as *"File upload complete"* or *"Processing payment"*) must be declared using live-region tags (e.g., `aria-live="polite"` or `aria-live="assertive"`) to notify screen reader users without interrupting active navigation.
*   **Form & Validation Errors:**
    *   Input fields must link to their helper and error labels using `aria-describedby` tags (e.g., `<input id="national-id" aria-describedby="national-id-error"> <p id="national-id-error">الرقم الوطني يجب أن يتكون من 11 خانة</p>`).
    *   On validation failure, focus must be programmatically moved to the error block, allowing the screen reader to read the issue and recovery steps.

---

### 2.3 Visual Inclusion & High-Contrast Mode (`A11Y-VISUAL`)
1.  **High-Contrast Theme (No Color-Only Cues):**
    *   The system must support browser-native High Contrast Mode (such as Windows Contrast Themes) without breaking layout alignments or component borders.
    *   Status changes must never be communicated using color changes alone. All status chips and success/error notifications must pair distinct background colors with clear text labels and unique system icons.

```
  [ Approved Status: Green background + "Approved" text + solid checkmark icon ]
  [ Rejected Status: Red background + "Rejected" text + solid exclamation icon ]
```

2.  **Adjustable Font Scaling:**
    *   All typographic layouts must scale dynamically up to **200%** using relative font units (`rem` or `em`) without causing overlapping text, horizontal scrolling, or broken containers.
3.  **Reduced Motion Support:**
    *   When the user has enabled "Reduce Motion" in their operating system or browser settings, the platform must detect the media query `(prefers-reduced-motion: reduce)` and instantly deactivate all slide-in transitions, layout expansions, and progress bar animations, replacing them with simple, comfortable opacity fades.

---

## 3. LOCALIZATION (L10N) & BILINGUAL PARITY

The MCI platform is fully bilingual, providing equal support for **Arabic (RTL)** as the official primary language and **English (LTR)** as the secondary administrative and investment language.

```
               [ User Toggles Language ]
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│        Arabic Layout         │       │        English Layout        │
├──────────────────────────────┤       ├──────────────────────────────┤
│ - Font: DIN Next Arabic      │       │ - Font: DIN Next             │
│ - Direction: dir="rtl"       │       │ - Direction: dir="ltr"       │
│ - Text Alignment: Right      │       │ - Text Alignment: Left       │
│ - Icon Mirroring: Active     │       │ - Icon Mirroring: Disabled   │
└──────────────────────────────┘       └──────────────────────────────┘
```

### 3.1 Structural Layout Symmetries
*   **Complete Layout Mirroring:** Language toggling must swap the entire layout direction of the page, mirroring top navigation headers, collapsible sidebars, multi-column forms, dashboard widgets, and table alignments.
*   **Logical Property Grid System:** To prevent alignment issues during layout mirroring, developers must use CSS logical properties (such as `margin-inline-start`, `padding-inline-end`, and `border-start-start-radius`) instead of directional absolute values (like `margin-left` or `padding-right`).

---

### 3.2 Standard Format Specifications
All data formats must adapt to the selected locale's conventions:

| Data Type | Arabic (RTL) Format | English (LTR) Format | Design Token Rule |
| :--- | :--- | :--- | :--- |
| **Short Date** | `٢٠٢٦/٠٧/١٢` (Y/M/D) | `12/07/2026` (D/M/Y) | Use `Intl.DateTimeFormat` |
| **Long Date** | `١٢ يوليو ٢٠٢٦` | `12 July 2026` | Use localized month names |
| **Time Format**| `١١:١٢ م` (12-Hour) | `11:12 PM` (12-Hour) | Use standard localized markers |
| **Currency** | `٥,٠٠٠ ج.س` (Sudanese Pound) | `5,000 SDG` / `$100 USD` | Format with proper thousand commas |
| **Address** | *State, Locality, Block, Street* | *Street, Block, Locality, State* | Keep forms structure flexible |

---

### 3.3 Terminology & Translation Governance
To prevent confusing translations and ensure a high level of digital trust, all platform text must follow a structured Translation Governance Framework.

1.  **Elimination of Hardcoded Text:** All text strings, label headers, input placeholders, error messages, and system notifications must be loaded dynamically from unified JSON resource files (`ar.json` and `en.json`).
2.  **Bilingual Trade Glossary:** The Ministry maintains an authoritative, bilingual glossary of trade, commercial, and industrial terms. Automated translation tools are strictly prohibited for public-facing text; all translations must be reviewed and approved by certified bilingual translation auditors.

---

## 4. INTERNATIONALIZATION (I18N) SYSTEM

The underlying codebase must support dynamic text rendering, pluralization, and scalable resource structures to ensure future adaptability.

```
┌────────────────────────────────────────────────────────┐
│               I18N Dynamic Text Pipeline               │
├────────────────────────────────────────────────────────┤
│ 1. Read locale context (AR or EN)                      │
│ 2. Fetch corresponding resource JSON block             │
│ 3. Inject dynamic values using template parameters     │
│ 4. Render with proper pluralization rules              │
└────────────────────────────────────────────────────────┘
```

### 4.1 Resource JSON Structure Spec
All translation resources must follow a standardized key-value structure:

```json
{
  "registration": {
    "title": {
      "ar": "طلب تسجيل شركة جديدة",
      "en": "New Company Incorporation Request"
    },
    "step_indicator": {
      "ar": "الخطوة {current} من {total}",
      "en": "Step {current} of {total}"
    },
    "shareholder_count": {
      "ar": {
        "one": "شريك واحد",
        "two": "شريكان",
        "few": "{count} شركاء",
        "many": "{count} شريكاً",
        "other": "{count} شريك"
      },
      "en": {
        "one": "1 Shareholder",
        "other": "{count} Shareholders"
      }
    }
  }
}
```

### 4.2 Dynamic Rendering & Text Expansion Rules:
*   **Dynamic Translation Interpolation:** Template parameters (such as `{current}` or `{total}`) must be used to inject numbers and values dynamically, preserving correct grammatical sentence structure.
*   **Unicode Parity:** All database storage and API communication pipelines must enforce **UTF-8 Unicode encoding** to support Arabic letters, special punctuation, and symbols.
*   **Text Expansion Safeguards:** Because Arabic text can expand up to **30%** in length compared to English equivalents, all UI elements (such as buttons, navigation bars, and inputs) must use flexible auto-wrap and dynamic padding boundaries to prevent text truncation.

---

## 5. RESPONSIVE DESIGN & MOBILE-FIRST LAYOUTS

With mobile web usage representing the primary digital gateway for the majority of Sudanese citizens, all interfaces must be designed following a strict, **Mobile-First Responsive Workflow**.

```
  [ Mobile Screen < 640px ] ──► [ Tablet Screen 640px-1024px ] ──► [ Desktop >= 1024px ]
   - Single-column flow          - Double-column cards            - Multi-column grids
   - Navigation Bottom-Dock      - Sidebar Collapse to Dock       - Fixed Side Navigation
```

### 5.1 Responsive Breakpoint Columns & Gutters

| Breakpoint Tier | Width Boundary | Target Devices | Grid Columns | Gutter Width | Outer Margins |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile** | `< 640px` | Phones (RTL/LTR) | 4 Columns | 12px | 16px |
| **Tablet** | `640px - 1023px` | Tablets & Foldables | 8 Columns | 16px | 24px |
| **Desktop**| `1024px - 1440px`| Standard Monitors | 12 Columns| 24px | 32px |
| **Wide** | `>= 1440px` | High-Res Displays | 12 Columns| 24px | Auto-centered |

---

### 5.2 Responsive Component Reflow Rules
1.  **Form Layout Reflow:**
    *   On desktop views, form fields are displayed in multi-column layouts (e.g., *First Name* and *Last Name* side-by-side).
    *   On mobile screens, form fields collapse into a single-column stacked layout, ensuring comfortable touch inputs.
2.  **Data Table Reflow (Horizontal Scrolling vs Cards):**
    *   On desktop screens, data tables display all columns with a sticky header and action column.
    *   On mobile screens, tables automatically transform into vertically stacked list cards. Each card groups row data as key-value pairs with an expand-to-view option.
3.  **Responsive Dashboard Widgets:**
    *   KPI cards and interactive charts reflow into vertical bento-grid structures on small screens, preventing chart distortion and ensuring labels remain readable.

---

## 6. TOUCH, GESTURE, AND BANDWIDTH ADAPTATION

Digital services must remain functional and easy to navigate under varying network speeds and on all mobile devices.

```
┌────────────────────────────────────────────────────────┐
│              Multi-Device Touch Targets                │
├────────────────────────────────────────────────────────┤
│ Minimum touch size: 44x44px                            │
│ Gaps between targets: 8px Minimum                      │
│ Swiping gestures: Custom horizontal carousel sweeps    │
└────────────────────────────────────────────────────────┘
```

### 6.1 Touch Targets and Interactive Gestures
*   **Touch Sizing:** Interactive elements (such as buttons, links, checkbox items, and menu tabs) must maintain a minimum touch size of **44x44 pixels** to support comfortable touch inputs.
*   **Inter-Element Spacing:** Maintain a minimum gap of **8px** between adjacent buttons or links, preventing accidental clicks on nearby elements.
*   **Touch Gesture Support:** Form wizard carousels and step panels support horizontal swiping gestures. Destructive actions (such as deleting files or cancelling applications) must never be assigned to simple swipe gestures, requiring a multi-tap confirmation instead.

---

### 6.2 Low-Bandwidth & High-Latency Performance Optimization
Because internet access speeds vary across different states in Sudan, all platform interfaces must be optimized for fast, reliable loading under constrained connections.

*   **Offline Caching Engine:** All form submissions and document uploads support offline caching using standard service workers. Progress is saved locally in browser storage (`localStorage` or `IndexedDB`) during network disconnections and automatically uploaded once connection is restored.
*   **Incremental Asset Loading:** Page content must load incrementally using skeletal shimmers instead of blocking loading indicators. Images and large charts are lazy-loaded, loading only when scrolled into view.
*   **Minimalist Vector Assets:** The platform avoids heavy image backgrounds, complex icons, or non-essential graphics. Layout structures rely entirely on Tailwind CSS classes and compact Lucide vector icons to minimize page weight and support fast loading.

---

## 7. SOVEREIGN AI ACCESSIBILITY & ASSISTIVE INTERACTION

The integration of the Sovereign AI Assistant must follow clear design standards to ensure AI-driven suggestions and summaries are accessible and transparent to all users.

```
┌────────────────────────────────────────────────────────┐
│                   MOL-AI-CARD Specs                    │
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

### AI Assistive Checkpoints:
*   **Voice Search Support:** The public search console includes an accessible microphone widget, enabling users to submit search queries or ask questions verbally.
*   **Screen Reader AI Identifiers:** AI suggestions and chat notifications must include an explicit `aria-label` or landmark banner, identifying the content as "AI-generated" or "نص مولد بالذكاء الاصطناعي".
*   **Confidence Levels & Sources:** AI-driven decisions must display a clear confidence rating (e.g., `Confidence Index: 92%` or `HIGH`) and direct links to referenced government rules, supporting accountability and transparency.
*   **Advisory Disclaimers:** Every AI panel must feature a persistent, bilingual advisory warning:
    *   *Arabic:* `مخرجات الذكاء الاصطناعي استشارية وغير ملزمة قانونياً.`
    *   *English:* `AI recommendations are advisory and legally non-binding.`

---

## 8. SYSTEM REUSABLE DEVICE COMPATIBILITY MATRIX

To guarantee consistent performance, the platform is regularly tested across diverse browser and OS configurations:

| Operating System | Default Browser | Min. Version | Expected Performance Target |
| :--- | :--- | :--- | :--- |
| **Android** | Google Chrome Mobile | v80+ | Full responsive layout, touch target compliance, offline caching. |
| **iOS** | Mobile Safari | v14+ | Core layout mirroring, swipe gesture support, modal dismissals. |
| **Windows** | Chrome / Edge | v90+ | Full keyboard tab flow, high-contrast themes, screen reader compatibility. |
| **macOS** | Safari / Chrome | v15+ | VoiceOver compliance, smooth scroll transitions, dynamic font scaling. |
| **Linux (Ubuntu)**| Firefox | v88+ | Full grid alignments, responsive reflow, standard input masking. |

---

## 9. COMPREHENSIVE ACCESSIBILITY TESTING FRAMEWORK

The MCI design and development pipelines use a structured testing workflow to ensure absolute accessibility compliance prior to product release.

```
[ Automated Lint Checks ] ──► [ Keyboard Tab-Flow Reviews ] ──► [ Screen Reader Audits ] ──► Release
```

### 9.1 Standard Accessibility Testing Checklist
All updates and new components must pass this accessibility checklist:
*   [ ] **100% Keyboard Operability:** All interactive components can be navigated and activated using only the keyboard.
*   [ ] **Visible Focus Rings:** Keyboard focus indicators are highly visible and styled with dual contrast rings.
*   [ ] **Text Contrast Compliance:** Text-to-background contrast ratios meet or exceed WCAG 2.2 AA standards (4.5:1 for standard text, 3.0:1 for large text).
*   [ ] **Screen Reader Integrity:** The visual layout matches the screen reader's reading order in both Arabic and English, and all icons contain valid ARIA labels.
*   [ ] **Directional Layout Mirroring:** Switching languages mirrors the layout flow (RTL vs. LTR) and mirrors directional icons cleanly.
*   [ ] **Color-Blind Safety:** Status updates use descriptive text labels and icons alongside color changes.
*   [ ] **Dynamic Text Scaling:** Typography scales dynamically up to 200% without causing overlapping text or horizontal scroll.

---

## 10. SYSTEM DESIGN GOVERNANCE & ROBUST COMPLIANCE ROADMAP

The Ministry enforces a rigorous governance model to maintain design consistency, accessibility compliance, and terminology standards as digital services expand:

```
[ Component Proposed ] ──► [ ARB Accessibility Audit ] ──► [ DRB Visual Review ] ──► Production Merge
```

### Design Governance Roles & Boards:
1.  **Accessibility Owner (Role):** A designated Accessibility Specialist who oversees accessibility audits, evaluates compliance reports, and manages the accessibility testing checklist.
2.  **Localization Owner (Role):** A bilingual Translation Auditor who maintains the authoritative trade glossary and reviews translations to ensure cultural appropriateness.
3.  **Accessibility Review Board (ARB):** Verifies that all proposed changes and components achieve 100% WCAG 2.2 AA compliance before being merged.
4.  **Design Review Board (DRB):** Led by the Chief UX Architect. Reviews visual consistency, responsive grid alignments, and typography standards across all platforms.
5.  **Audit Schedule:** The platform undergoes semi-annual accessibility audits, evaluating the entire components library and updating guidelines to align with evolving digital standards.
