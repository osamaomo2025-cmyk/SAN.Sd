# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### MASTER BLUEPRINT: ENTERPRISE MODULAR ARCHITECTURE & DDD BLUEPRINT (v1.0.0)

---

## 1. ARCHITECTURAL BLUEPRINT & SYSTEM HYBRID TOPOLOGY

This document defines the official **Enterprise Modular Architecture (EMA)** and **Domain-Driven Design (DDD)** specification for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Prepared under the national "Sudan 2035 Digital Sovereignty Directive," this architecture provides a flexible, modular foundation designed to support gradual expansion, multi-agency interoperability, and high performance over the next 20 years.

To balance speed of deployment with long-term portability, the platform implements a **Hybrid Logical Microservices Architecture**, developed as a modular monolith on Google Firebase/GCP with clear domain boundaries, enabling future extraction into standalone microservices.

```
                  +----------------------------------------------+
                  |         Unified API Gateway Router           |
                  +----------------------+-----------------------+
                                         |
       +---------------------------------+---------------------------------+
       |                                 |                                 |
+------v------+                     +------v------+                     +------v------+
| CORE-PLAT   |                     | REG-MOD     |                     | IND-LIC     |
| Identity &  |                     | Commercial  |                     | Industrial  |
| Shared Serv |                     | Registries  |                     | Services    |
+-------------+                     +-------------+                     +-------------+
```

### Core Architecture Principles:
1.  **Strict Domain Isolation:** Modules must communicate with each other exclusively through public APIs or asynchronous event brokers. Direct cross-module database joins are strictly forbidden.
2.  **Domain-Driven Design (DDD):** Business domains are mapped into isolated Bounded Contexts containing distinct Aggregates, Entities, and Value Objects.
3.  **Event-Driven Decoupling:** State transitions within a module are published as durable events, allowing subscribing modules to react asynchronously.
4.  **Configuration-Driven Behavior:** Business rules, workflows, fees, and permissions must be managed via configuration files, avoiding hardcoded logic in application code.
5.  **AI-Ready Integration:** Modules are designed with native entry points for the Sovereign AI Assistant to provide advisory support without bypassing human authorization.

---

## 2. ENTERPRISE MODULE CATALOG

The platform is structured into clear, independent modules, each representing a core administrative or public-facing capability of the Ministry.

```
       [ Client Portal / Admin App ] ──► [ API Gateway Router ]
                                                  │
       ┌─────────────────────────┬────────────────┴─────────────────────────┐
       ▼                         ▼                                          ▼
┌─────────────┐           ┌─────────────┐                            ┌─────────────┐
│ CORE-PLAT   │           │ REG-MOD     │                            │ IND-LIC     │
│ Shared Core │           │ Commercial  │                            │ Industrial  │
│ Services    │           │ Registries  │                            │ Services    │
└─────────────┘           └─────────────┘                            └─────────────┘
```

### Module ID: MOD-CORE-PLAT | Shared Core Platform Services
*   **Arabic Name:** وحدة الخدمات الأساسية المشتركة
*   **Business Purpose:** Provides core, reusable platform capabilities including user management, role-based access control, system logging, and notification routing.
*   **Responsibilities:**
    *   Manages citizen, merchant, employee, and service account profile registries.
    *   Enforces authentication, multi-factor verification, and role elevation.
    *   Routes notification payloads to active channel adapters (SMS, Email, In-App).
    *   Maintains the immutable system-wide security audit trail.
*   **Inputs:** Identity claims, profile update requests, notification payloads, audit event logs.
*   **Outputs:** Verified user tokens, dispatch states, audit confirmation hashes.
*   **Dependencies:** None (Base module).

---

### Module ID: MOD-REG-COMM | Commercial Name & Corporate Registry
*   **Arabic Name:** وحدة السجل التجاري والأسماء التجارية
*   **Business Purpose:** Manages the registration, modification, renewal, and legal tracking of business names and corporate entities (LLCs, partnerships, sole proprietorships) in Sudan.
*   **Responsibilities:**
    *   Coordinates the reserve and conflict checks of proposed commercial names.
    *   Processes company registration applications and maintains articles of incorporation.
    *   Generates official digital Commercial Registration (CR) certificates.
    *   Maintains corporate registry records, including active shareholder structures and capital tracking.
*   **Inputs:** Name reservation queries, LLC registration forms, shareholder directories, amendment filings.
*   **Outputs:** Name reservation tickets, signed CR extracts, registered company payloads.
*   **Dependencies:** `MOD-CORE-PLAT`, `MOD-PAY-SWT`.

---

### Module ID: MOD-IND-LIC | Industrial Licensing & Environmental Compliance
*   **Arabic Name:** وحدة التراخيص الصناعية والالتزام البيئي
*   **Business Purpose:** Manages operating licenses for manufacturing plants, factory site evaluations, and environmental safety audits in industrial zones.
*   **Responsibilities:**
    *   Processes applications for new industrial operating licenses.
    *   Schedules site audits and coordinates field inspections.
    *   Tracks environmental compliance metrics and waste management plans.
    *   Enforces factory operating regulations and issues corrective action orders.
*   **Inputs:** Factory floor plans, coordinate locations, waste classifications, operating metrics.
*   **Outputs:** Industrial operating certificates, site audit reports, corrective action orders.
*   **Dependencies:** `MOD-CORE-PLAT`, `MOD-DOC-MGT`, `MOD-INSP-OPS`.

---

### Module ID: MOD-INSP-OPS | Mobile Field Inspection & Citations
*   **Arabic Name:** وحدة الرقابة الميدانية والمخالفات
*   **Business Purpose:** Supports mobile-first field inspections, evidence recording, safety standard checks, and the digital issuance of citations for commercial and industrial violations.
*   **Responsibilities:**
    *   Dispatches and schedules field inspections based on priority or merchant complaints.
    *   Enables mobile logging of site checklists, GPS coordinates, and photo evidence.
    *   Generates digital citation tickets and issues formal fine notices.
    *   Tracks remediation progress and compliance updates for issued violations.
*   **Inputs:** Dispatch assignments, site safety checklists, photo files, citation records.
*   **Outputs:** Inspection audit logs, digital citation receipts, compliance status updates.
*   **Dependencies:** `MOD-CORE-PLAT`, `MOD-DOC-MGT`.

---

### Module ID: MOD-CONS-PROT | Consumer Protection & Complaint Triage
*   **Arabic Name:** وحدة حماية المستهلك ومعالجة الشكاوى
*   **Business Purpose:** Receives and triages public reports of consumer fraud, expired food sales, and price gouging, routing cases to enforcement agencies.
*   **Responsibilities:**
    *   Maintains public portals and mobile channels for filing consumer complaints.
    *   Uses AI sentiment analysis and keyword categorizations to triage and prioritize incoming reports.
    *   Escalates critical safety reports directly to the field dispatch system.
    *   Monitors and records dispute resolution outcomes between consumers and merchants.
*   **Inputs:** Complaint descriptions, transaction receipt photos, merchant IDs, case updates.
*   **Outputs:** Triaged complaint tickets, consumer status alerts, dispatch requests.
*   **Dependencies:** `MOD-CORE-PLAT`, `MOD-INSP-OPS`.

---

### Module ID: MOD-PAY-SWT | Unified Payment Swifter & Finance Ledger
*   **Arabic Name:** وحدة الدفع الإلكتروني الموحد والمقاصة المالية
*   **Business Purpose:** Handles digital fee collections, e-payment platform routing, invoice generation, and transaction reconciliation.
*   **Responsibilities:**
    *   Generates secure invoices for all ministry services, linking billing records with active cases.
    *   Processes payments securely through integrated national banking gateways.
    *   Provides automatic reconciliation and handles transaction timeout recovery.
    *   Maintains a read-only, tamper-evident ledger of all processed fees and fines.
*   **Inputs:** Billing parameters, payment gateway tokens, bank reconciliation receipts.
*   **Outputs:** Secure payment links, digital payment receipts, payment confirmation events.
*   **Dependencies:** `MOD-CORE-PLAT`.

---

## 3. DOMAIN-DRIVEN DESIGN BLUEPRINT

Each module contains bounded contexts with defined Aggregates, Entities, Value Objects, and Domain Services to enforce proper domain boundaries.

```
+------------------------------------------------------------------------+
|                      Commercial Registry Domain                        |
|                                                                        |
|  [Aggregate Root: Company] ──► [Entity: Shareholder]                   |
|           │                                                            |
|           ├──► [Value Object: RegisteredCapital]                       |
|           └──► [Value Object: PhysicalAddress]                         |
+------------------------------------------------------------------------+
```

### 3.1 Bounded Context: Commercial Corporate Registry (`MOD-REG-COMM`)

#### 1. Aggregate Roots
*   **`Company` Aggregate:** The central aggregate managing the lifecycle of an incorporated entity in Sudan.
    *   *ID:* `CompanyId` (Value Object).
    *   *Core Attributes:* Registration Number, Legal Name (Ar/En), Incorporation Date, Business Type, Active Status, Expiry Date.
    *   *Nested Entities:* `Shareholder` (Entity), `Branch` (Entity).
    *   *Value Objects:* `RegisteredCapital`, `PhysicalAddress`, `BusinessActivityCode`.

#### 2. Nested Entities
*   **`Shareholder` Entity:** Represents an individual or corporate owner holding equity in the company.
    *   *ID:* `ShareholderId` (Value Object).
    *   *Attributes:* Name, Nationality, National ID / Passport, Shares Owned, Equity Percentage.
*   **`Branch` Entity:** Represents an affiliated physical office or outlet under the company's registration.
    *   *ID:* `BranchId` (Value Object).
    *   *Attributes:* Branch Name, Geographic Coordinates, Local Address, Manager ID.

#### 3. Value Objects
*   **`RegisteredCapital` Value Object:** Enforces monetary parameters and currency verification rules:
    *   *Fields:* `Amount` (BigDecimal), `Currency` (Enum: `SDG`, `USD`, `EUR`).
    *   *Validation Rules:* Amount must be greater than zero. Currency must map to approved Central Bank codes.
*   **`PhysicalAddress` Value Object:** Represents a verified corporate physical location:
    *   *Fields:* `State` (Enum), `Locality` (String), `StreetAddress` (String), `GpsCoordinates` (String).

#### 4. Domain Services
*   **`CompanyIncorporationService`:** Coordinates multi-entity validation rules:
    *   *Logic:* Verifies that the associated Commercial Name reservation is active, validates that the sum of shareholder equity matches the total registered capital, and checks that all shareholders have valid, verified IDs.

#### 5. Domain Business Rules & Policies
*   **Policy: `ForeignEquityRestrictionPolicy`**
    *   *Rule:* If the company's business activities include restricted national sectors (e.g., local small-scale agriculture or strategic retail distribution), foreign shareholders cannot hold more than 49% of total equity, unless approved by a Ministerial Decree.

---

## 4. CROSS-MODULE EVENT EXCHANGE SCHEMA

To maintain decopled operations, state changes are published as durable events, enabling subscribing modules to react asynchronously.

```
[ MOD-PAY-SWT ] ──► ( Event: PaymentConfirmed ) ──► [ MOD-REG-COMM ] ──► Issue CR Certificate
```

### Event Interaction Map:

1.  **Event Name:** `PaymentConfirmed`
    *   **Publisher:** `MOD-PAY-SWT`
    *   **Subscribers:** `MOD-REG-COMM`, `MOD-IND-LIC`
    *   **Business Meaning:** Fired automatically when a digital fee or citation payment is confirmed by the gateway.
    *   **Payload Schema:**
```json
{
  "eventId": "evt-71289-abc",
  "eventType": "sd.gov.mci.payment.confirmed",
  "timestamp": "2026-07-12T11:01:32Z",
  "data": {
    "transactionId": "tx-81249-p",
    "invoiceNumber": "INV-2026-981240",
    "referenceCaseId": "case-cr-981240-K",
    "amountPaid": 50000.00,
    "currency": "SDG",
    "paymentMethod": "National_Payment_Switch"
  }
}
```

2.  **Event Name:** `LicenseRevoked`
    *   **Publisher:** `MOD-IND-LIC`
    *   **Subscribers:** `MOD-INSP-OPS`, `MOD-CORE-PLAT` (Notification Engine)
    *   **Business Meaning:** Fired when an industrial operating license is suspended or revoked due to safety or environmental infractions.

---

## 5. PLATFORM CONFIGURATION MATRIX (NO HARDCODING)

Every module is designed to be configuration-driven, separating business parameters from application source code.

```
┌────────────────────────────────────────────────────────┐
│             Configurable Module Parameters             │
├───────────────────┬────────────────────────────────────┤
│ Feature Toggles   │ Enable or disable module features  │
│                   │ without deploying code changes.    │
├───────────────────┼────────────────────────────────────┤
│ Localization      │ Multi-language support (AR / EN)   │
│                   │ managed through translation files. │
├───────────────────┼────────────────────────────────────┤
│ Fee Schedules     │ Manage fee thresholds and service │
│                   │ charges dynamically.               │
└───────────────────┴────────────────────────────────────┘
```

*   **Feature Toggles:** Allows system administrators to enable or disable specific features (e.g., enabling digital name reservations while keeping manual checks active) without deploying new code.
*   **Localization (Bilingual Support):** Translates interface text, labels, and notifications between Arabic (DIN Next Arabic) and English (DIN Next) using centrally managed localization files.
*   **Fee and Tariff Schedules:** Manage service fees, licensing costs, and citation fine thresholds dynamically, avoiding hardcoded values in application logic.

---

## 6. SOVEREIGN AI SERVICES MATRIX

The platform integrates server-side AI advisory capabilities (powered by Gemini models) across its core modules to support decision-making while preserving human oversight.

```
                      ┌──────────────────────────────────────┐
                      │    MCI Sovereign AI Architecture     │
                      └──────────────────┬───────────────────┘
                                         |
       ┌─────────────────────────────────┼─────────────────────────────────┐
       ▼                                 ▼                                 ▼
┌──────────────┐                  ┌──────────────┐                  ┌──────────────┐
│  MOD-REG-COMM │                  │  MOD-CONS-PROT│                  │  MOD-IND-LIC │
│  Name Check  │                  │ Triage Alerts│                  │ Risk Auditing│
└──────────────┘                  └──────────────┘                  └──────────────┘
```

### 1. Module Name Reservation (`MOD-REG-COMM`)
*   *AI Advisory Task:* Automatically analyzes requested business names for phonetic and semantic similarity to existing registrations or trademarks, generating a "Naming Similarity Risk Score."

### 2. Consumer Protection (`MOD-CONS-PROT`)
*   *AI Advisory Task:* Automatically categorizes and triages incoming public complaints, highlighting critical food safety or price-gouging reports for urgent field dispatch.

### 3. Industrial Licensing (`MOD-IND-LIC`)
*   *AI Advisory Task:* Analyzes industrial plant coordinates against ecological and zoning maps, generating an environmental compliance audit summary.

### 4. AI Guardrail Constraints
*   **Advisory Only:** AI model outputs are treated as recommendations. The AI is strictly forbidden from directly updating database records, approving licenses, or rejecting applications. Decisions require human caseworker review and sign-off.

---

## 7. MODULE GOVERNANCE & RELEASE INDEPENDENCE

To support long-term maintainability, the platform enforces structured governance guidelines across all development and release cycles.

```
+────────────────+     +────────────────+     +────────────────+     +────────────────+
|   1. Define    | ──► |  2. Validate   | ──► |   3. Deploy    | ──► |  4. Monitor    |
| (API Contract)       (Contract Tests)        (Blue-Green Dev)       (Alert Metrics)
+────────────────+     +────────────────+     +────────────────+     +────────────────+
```

1.  **Module Ownership:** Every module has an assigned business owner (e.g., the Registrar General for `MOD-REG-COMM`) and a technical lead responsible for system updates.
2.  **API Version Control:** Changes to module APIs are managed with semantic versioning (e.g., `/api/v1/` to `/api/v2/`), keeping deprecated endpoints active for a 12-month deprecation window.
3.  **Release Independence:** Modules are designed with clear logical boundaries. This decoupled structure allows teams to deploy minor updates and hotfixes to a module without requiring a full redeployment of the entire platform.
4.  **Continuous Performance Evaluation:** Module performance (including database query times, API latency, and SLA compliance) is reviewed quarterly to identify opportunities for refactoring and technical debt reduction.
