# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL GOVERNMENT BUSINESS PROCESS AUTOMATION HANDBOOK: ENTERPRISE WORKFLOW ENGINE, DECISION MODELS, & PROCESS ORCHESTRATION (v1.0.0)

---

## 1. DESIGN PHILOSOPHY & SOVEREIGN AUTOMATION MANDATE

This handbook defines the authoritative **Enterprise Workflow Engine Architecture (EWEA)**, **Business Process Automation Framework**, and **Decision Engine Specifications** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national **"Sovereign Digital Transformation & Business Process Standardization Mandate"**, this specification establishes a highly configurable, scalable, and audit-compliant process orchestration environment.

Our architectural philosophy is **Configurable-First, Event-Driven, Human-Centric, and AI-Assisted**:
*   **Zero Hardcoding of Workflows:** Process paths, validation checklists, approval boundaries, SLA timers, and assignment queues must be configured as metadata declarations (schemas) inside Cloud Firestore. No application code changes should be required to alter a business workflow.
*   **Event-Driven Transitions:** Workflow state transitions are triggered by business events published to the national messaging fabric (Google Cloud Pub/Sub), allowing decoupled operations.
*   **Strict Separation of AI Advisory and Human Authority:** AI systems are integrated exclusively in advisory, analytical, and classification roles. Any legally binding action, final approval, or permit issuance requires manual verification and cryptographic signature by an authorized officer.
*   **Sovereign Compliance & Bilingual Orchestration:** All workflows must natively track processing streams, metadata, audit trails, and automated notifications in both Arabic and English.

```
+───────────────────────────────────────────────────────────────────────────────────────────+
|                                Sovereign Process Engine                                   |
├───────────────────────────────┬───────────────────────────────────┬───────────────────────┤
│    Decoupled Orchestration    │     Deterministic Decisions       │    Bilingual Audits   │
│  - State machines in Firestore│  - Externalized Business Rules    │  - Immutable history  │
│  - Triggered by Pub/Sub events│  - Structural validation lists    │  - Arabic/English logs│
└───────────────────────────────┴───────────────────────────────────┴───────────────────────┘
```

---

## 2. ENTERPRISE WORKFLOW ENGINE ARCHITECTURE

The workflow platform operates serverlessly using **Google Cloud Firestore** to store state metadata, orchestrated by **Firebase Functions** and **Cloud Pub/Sub** event handlers.

```
                     [ Public Portals / Internal Admin Client ]
                                        │
                                        ▼ (HTTP POST / REST API)
                             [ Cloud API Gateway ]
                                        │
                                        ▼
                           [ Workflow API Service ]
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼ (Evaluate & Write)                                  ▼ (Dispatch Event)
   [ Cloud Firestore ]                                    [ Cloud Pub/Sub ]
   ├── /workflow_definitions                             (Topic: workflow-events)
   ├── /workflow_instances                                         │
   └── /tasks                                                      ▼
                                                        [ Firebase Functions ]
                                                        (Process transitions, SLAs,
                                                         notifications, & AI analysis)
```

### 2.1 Core Architectural Components
1.  **State Directory (`/workflow_definitions`):** Declarative JSON documents defining the valid states, transition triggers, roles, SLA durations, and checklists for each business process.
2.  **Runtime Engine (`/workflow_instances`):** Tracks active business cases, current states, active steps, payload snapshots, and assigned operational queues.
3.  **Task Manager (`/tasks`):** Exposes operational tickets (manual, automated, and parallel) allocated to caseworkers, supervisors, or automated worker accounts.
4.  **Asynchronous Coordinator (Pub/Sub):** Manages event queues to ensure that workflow updates trigger notifications, sync audits, and prompt AI reviews without blocking user interfaces.

---

## 3. NATIONAL GOVERNMENT WORKFLOW CATALOG

The Ministry's business workflows are structured into distinct service contexts, ensuring clear boundaries, compliance, and clean operational handoffs.

---

### 3.1 Commercial Registry Workflows

#### 3.1.1 Corporate Incorporation Workflow (`WF-REG-COMPANY`)
*   **Arabic Name:** مسار تأسيس وتسجيل الشركات التجارية
*   **English Name:** Corporate Incorporation Workflow
*   **Business Purpose:** Orchestrate the complete lifecycle of corporate registration applications, verifying names, shareholders, capitals, and issuing final incorporation certificates.
*   **Trigger Event:** `IncorporationApplicationSubmitted` (from Citizen Portal).
*   **Initial State:** `DRAFT`
*   **Final State:** `COMPLETED` (Incorporation certificate issued).
*   **Intermediate States:** `SUBMITTED`, `AWAITING_NAME_VALIDATION`, `UNDER_REVIEW`, `AWAITING_INFORMATION`, `AWAITING_PAYMENT`, `APPROVED_OFFICER`, `STAMPED_REGISTRAR`.
*   **Responsible Roles:** Public Applicant, Name Registrar, Commercial Registry Officer, Registrar General, Financial Officer.
*   **Required Documents:** Draft Articles of Association, National IDs of Shareholders, Bank Capital Certificate, Commercial Name Reservation Ticket.
*   **Required Validations:**
    *   Verify that the proposed name has an active, unexpired reservation.
    *   Verify that shareholder national IDs are active via the Civil Registry API.
    *   Confirm that the paid capital exceeds the minimum threshold for the legal form.
*   **Approval Levels:**
    *   *Level 1:* Commercial Registry Officer (Compliance review & checklist audit).
    *   *Level 2:* Registrar General (Final sign-off, digital stamp validation, and certificate issuance).
*   **SLA Requirements:** 48 hours to final decision from payment verification.
*   **Escalation Rules:** If Level 1 review exceeds 24 hours, send warning to Regional Supervisor. If review exceeds 36 hours, auto-escalate task to High-Priority Supervisor Queue.
*   **Audit Requirements:** Log state, timestamp, user, IP, and changes to data payloads.
*   **AI Assistance Opportunities:** Analyze draft Articles of Association to flag deviations from the Ministry’s standard templates.

#### 3.1.2 Trade Name Reservation Workflow (`WF-REG-NAME`)
*   **Arabic Name:** مسار فحص وحجز الأسماء التجارية
*   **English Name:** Commercial Name Reservation Workflow
*   **Business Purpose:** Process, validate, and reserve unique trade names, ensuring no duplicate or legally restricted words are registered.
*   **Trigger Event:** `TradeNameProposed` (from Citizen Portal).
*   **Initial State:** `SUBMITTED`
*   **Final State:** `RESERVED`
*   **Intermediate States:** `UNDER_PHONETIC_REVIEW`, `AWAITING_REGISTRAR_DECISION`, `REJECTED`, `RESERVED`.
*   **Responsible Roles:** Name Registrar.
*   **Required Documents:** None.
*   **Required Validations:**
    *   Phonetic and structural matching check against the unified names index.
    *   Regex blocklist validation against prohibited government terms or phrases.
*   **Approval Levels:** Single-level approval by the Name Registrar.
*   **SLA Requirements:** 4 hours from submission.
*   **Escalation Rules:** If unassigned for 2 hours, flag as urgent in the Name Registrar Queue.
*   **Audit Requirements:** Record proposed names, phonetics, and matches.
*   **AI Assistance Opportunities:** Semantic matching and auto-suggesting valid alternative names if the proposed name is unavailable.

---

### 3.2 Industrial Services Workflows

#### 3.2.1 Industrial Registry & Site Registration Workflow (`WF-IND-REGISTRY`)
*   **Arabic Name:** مسار تسجيل وتصنيف المنشآت الصناعية
*   **English Name:** Industrial Plant Registration Workflow
*   **Business Purpose:** Manage applications for factory and processing plant registrations, verifying sector codes, production limits, and machinery capacities.
*   **Trigger Event:** `IndustrialRegistryRequested`.
*   **Initial State:** `SUBMITTED`
*   **Final State:** `REGISTERED`
*   **Intermediate States:** `UNDER_DESK_AUDIT`, `INSPECTION_SCHEDULED`, `AWAITING_INSPECTION_REPORT`, `APPROVED_DIRECTOR`.
*   **Responsible Roles:** Industrial Investor, Compliance Officer, Field Inspector, Industrial Director.
*   **Required Documents:** Corporate Registration Certificate, Land Ownership or Lease Agreement, Environmental Impact Assessment, Machinery List.
*   **Required Validations:** Verify active company registration status, check that sectors map to correct ISIC Rev.4 codes, and ensure that GPS coordinates match authorized industrial zones.
*   **Approval Levels:**
    *   *Level 1:* Compliance Officer (Desk validation of documents).
    *   *Level 2:* Field Inspector (GPS-verified site safety and machinery audit).
    *   *Level 3:* Industrial Director (Final registry sign-off).
*   **SLA Requirements:** 5 working days from submission.
*   **Escalation Rules:** If site inspection is not scheduled within 48 hours of desk audit approval, notify the Inspection Coordinator.
*   **Audit Requirements:** Log all checklist responses, GPS tracking coordinates, and inspector credentials.
*   **AI Assistance Opportunities:** Classify raw material and machinery lists to target HS Tariff categories.

---

### 3.3 Investment Services Workflows

#### 3.3.1 Strategic Investment Case & Incentives Workflow (`WF-INV-CASE`)
*   **Arabic Name:** مسار منح الميزات والتسهيلات الاستثمارية
*   **English Name:** Strategic Investment Case & Incentives Workflow
*   **Business Purpose:** Process applications for major foreign and domestic investment cases, coordinating tax exemptions, customs waivers, and land concessions.
*   **Trigger Event:** `InvestmentCaseSubmitted`.
*   **Initial State:** `SUBMITTED`
*   **Final State:** `GRANTED`
*   **Intermediate States:** `EVALUATION_STAGE`, `AWAITING_MINISTRY_CLEARANCES`, `AWAITING_FINANCE_STAMP`, `APPROVED_COMMISSIONER`.
*   **Responsible Roles:** Investment Representative, Project Evaluator, Finance Ministry Liaison, Investment Commissioner.
*   **Required Documents:** Detailed Feasibility Study, Bank Capital Inflow Evidence, National Security Clearances, Environmental Clearance.
*   **Required Validations:** Validate minimum capital deposit ($500,000 USD for foreign investments), check alignment with the National Development Plan, and verify company standing.
*   **Approval Levels:**
    *   *Level 1:* Project Evaluator (Economic feasibility scoring).
    *   *Level 2:* Ministry of Finance Liaison (Tax/customs exemption verification).
    *   *Level 3:* Investment Commissioner (Sovereign sign-off).
*   **SLA Requirements:** 10 working days.
*   **Escalation Rules:** If external clearances remain pending after 5 days, automatically send high-priority reminders to external liaisons.
*   **Audit Requirements:** Store feasibility scoring sheets and capital verification hashes.
*   **AI Assistance Opportunities:** Analyze feasibility studies to generate projected local employment and economic contribution scores.

---

### 3.4 Licensing Services Workflows

#### 3.4.1 Business Operating License Workflow (`WF-LIC-MANAGE`)
*   **Arabic Name:** مسار إصدار وتجديد رخص التشغيل التجارية
*   **English Name:** Operating Permit & Licensing Workflow
*   **Business Purpose:** Coordinate internal audits, external clearances (Health, Safety, Civil Defense), and issue operating licenses to registered companies.
*   **Trigger Event:** `LicenseApplicationSubmitted`.
*   **Initial State:** `SUBMITTED`
*   **Final State:** `ISSUED`
*   **Intermediate States:** `UNDER_REVIEW`, `AWAITING_EXTERNAL_CLEARANCE`, `AWAITING_INSPECTION`, `AWAITING_PAYMENT`, `ISSUED`.
*   **Responsible Roles:** Company Representative, Licensing Analyst, External Clearance Liaison, Licensing Board Chair.
*   **Required Documents:** Active Registration Certificate, Civil Defense Safety Certificate, Health Inspector Clearance (for food/medical).
*   **Required Validations:** Verify active corporate standing, check that all external clearances are signed and current, and confirm payment of licensing fees.
*   **Approval Levels:**
    *   *Level 1:* Licensing Analyst (Checklist validation).
    *   *Level 2:* Licensing Board Chair (Final electronic sign-off).
*   **SLA Requirements:** 72 hours from successful external clearances.
*   **Escalation Rules:** If external clearance status remains unvalidated for 72 hours, notify the Clearance Escalation Manager.
*   **Audit Requirements:** Log all clearance certificate hashes and validation timestamps.
*   **AI Assistance Opportunities:** Classify business descriptions to auto-determine required external clearance pathways.

---

### 3.5 Consumer Protection Workflows

#### 3.5.1 Public Price Control & Fraud Alert Workflow (`WF-CON-ALERT`)
*   **Arabic Name:** مسار إدارة بلاغات حماية المستهلك وضبط الأسعار
*   **English Name:** Consumer Protection & Price Control Workflow
*   **Business Purpose:** Process citizen price violation reports, dispatch inspectors to retail markets, and manage product recall alerts.
*   **Trigger Event:** `PriceViolationReported` (from Citizen Portal/SMS).
*   **Initial State:** `RECEIVED`
*   **Final State:** `RESOLVED`
*   **Intermediate States:** `RECEIVED`, `TRIAGED`, `INSPECTOR_DISPATCHED`, `VIOLATION_FILED`, `PENALTY_ISSUED`, `CLOSED`.
*   **Responsible Roles:** Citizen Complainant, Triage Coordinator, Market Inspector, Legal Analyst.
*   **Required Documents:** Citizen Report (photos/receipt uploads), Inspector Violation Ticket, Retailer Appeal Response (optional).
*   **Required Validations:**
    *   Verify merchant details against registration records.
    *   Check reported pricing against the current national price limits list.
*   **Approval Levels:**
    *   *Level 1:* Market Inspector (On-site investigation and ticketing).
    *   *Level 2:* Legal Analyst (Review of penalties and case closure).
*   **SLA Requirements:** 24 hours for triage; 48 hours for site inspection.
*   **Escalation Rules:** If a reported food safety violation remains untriaged after 4 hours, auto-assign to the High-Priority Emergency Inspector Queue.
*   **Audit Requirements:** Encrypt complainant profile details, allowing access to investigators only under strict logging.
*   **AI Assistance Opportunities:** Group similar complaints geographically to identify local market price manipulation trends.

---

### 3.6 Inspection Services Workflows

#### 3.6.1 Site Audit & Violation Issuance Workflow (`WF-INS-AUDIT`)
*   **Arabic Name:** مسار جدولة التفتيش الميداني وتحرير المخالفات
*   **English Name:** Field Inspection & Compliance Audit Workflow
*   **Business Purpose:** Manage inspector schedules, record market audits, process compliance checklists, and issue safety violation tickets.
*   **Trigger Event:** `InspectionTriggered` (from licensing, registration, or complaint events).
*   **Initial State:** `SCHEDULED`
*   **Final State:** `COMPLETED`
*   **Intermediate States:** `SCHEDULED`, `ASSIGNED`, `IN_PROGRESS`, `VIOLATION_FILED`, `COMPLIANT_PASSED`.
*   **Responsible Roles:** Inspection Coordinator, Field Inspector, Compliance Manager.
*   **Required Documents:** Digital Compliance Checklist, Verified Site Photos, Warning or Penalty Ticket PDF.
*   **Required Validations:**
    *   Verify that inspector GPS coordinates match the target business location within a 100-meter range.
    *   Confirm compliance checklists are fully filled out before submission.
*   **Approval Levels:**
    *   *Level 1:* Field Inspector (On-site checklist completion and warning submission).
    *   *Level 2:* Compliance Manager (Review of penalty tickets).
*   **SLA Requirements:** 48 hours from scheduled date.
*   **Escalation Rules:** If an inspection remains unassigned for 24 hours past schedule, auto-assign to the Regional Lead Inspector.
*   **Audit Requirements:** Log GPS validation outputs, site timestamps, photo hashes, and inspector IDs.
*   **AI Assistance Opportunities:** Compare site photos using computer vision to flag potential physical safety hazards or unlicensed signage.

---

### 3.7 Complaints Services Workflows

#### 3.7.1 Corporate Grievance & Appeal Workflow (`WF-CMP-GRIEVANCE`)
*   **Arabic Name:** مسار الشكاوى والاعتراضات القانونية
*   **English Name:** Corporate Grievance & Legal Appeal Workflow
*   **Business Purpose:** Resolve business disputes, process regulatory appeals, and manage corporate grievance casework.
*   **Trigger Event:** `GrievanceSubmitted` (from Business Portal).
*   **Initial State:** `RECEIVED`
*   **Final State:** `RESOLVED`
*   **Intermediate States:** `RECEIVED`, `INVESTIGATION_PENDING`, `HEARING_SCHEDULED`, `RULING_ISSUED`, `APPEAL_CLOSED`.
*   **Responsible Roles:** Complainant Representative, Case Investigator, Legal Counsel, Dispute Resolution Chair.
*   **Required Documents:** Formal Grievance Statement, Support Documentation (contracts, decisions), Investigator Report, Final Decision PDF.
*   **Required Validations:** Check that the appeal is submitted within the 15-day regulatory appeal window, and verify company registration statuses.
*   **Approval Levels:**
    *   *Level 1:* Case Investigator (Factual review).
    *   *Level 2:* Dispute Resolution Chair (Final ruling sign-off).
*   **SLA Requirements:** 15 working days.
*   **Escalation Rules:** If the investigator report is unfiled after 10 days, trigger a status alert to Legal Counsel.
*   **Audit Requirements:** Maintain detailed case logs, tracking all document access events.
*   **AI Assistance Opportunities:** Perform sentiment analysis and keyword extraction on complaints to categorize critical issues.

---

### 3.8 Internal Administrative Processes

#### 3.8.1 Policy Approval & Circular Distribution Workflow (`WF-ADM-POLICY`)
*   **Arabic Name:** مسار اعتماد ونشر السياسات والتعاميم الوزارية
*   **English Name:** Policy Approval & Circular Distribution Workflow
*   **Business Purpose:** Coordinate internal drafting, review, ministerial sign-off, and distribution of official policy decisions and circulars.
*   **Trigger Event:** `PolicyCircularDrafted`.
*   **Initial State:** `DRAFT`
*   **Final State:** `DISTRIBUTED`
*   **Intermediate States:** `DRAFT`, `LEGAL_REVIEW`, `UNDER_SECRETARY_STAMP`, `MINISTER_APPROVAL`, `DISTRIBUTED`.
*   **Responsible Roles:** Department Drafter, Legal Director, Under-Secretary, Minister, Public Relations Coordinator.
*   **Required Documents:** Draft Circular Word Document, Legal Opinion Document, Signed PDF Circular.
*   **Required Validations:** Ensure compliance with existing administrative decrees and verify signature hashes.
*   **Approval Levels:**
    *   *Level 1:* Legal Director (Regulatory compliance review).
    *   *Level 2:* Under-Secretary (Administrative clearance).
    *   *Level 3:* Minister (Final signature approval).
*   **SLA Requirements:** 5 working days from draft completion.
*   **Escalation Rules:** If review stages delay for more than 48 hours, trigger an administrative reminder alert.
*   **Audit Requirements:** Standard audit trail, tracking draft revisions and signature approvals.
*   **AI Assistance Opportunities:** Auto-generate plain-language summaries (Arabic and English) for public distribution.

---

## 4. WORKFLOW STATE MACHINE FRAMEWORK

All processes on the Ministry platform must utilize a standardized, metadata-configured state machine model.

```
       +───────────────────────────────────+
       │               DRAFT               │
       +─────────────────┬─────────────────+
                         │ Submit
                         ▼
       +───────────────────────────────────+
       │             SUBMITTED             │◄───────────────────────────┐
       +─────────────────┬─────────────────+                            │
                         │ Triage & Assign                              │ Correct
                         ▼                                              │ & Resubmit
       +───────────────────────────────────+                            │
       │           UNDER_REVIEW            │                            │
       +───────┬───────────────────┬───────+                            │
               │                   │                                    │
               │ Info Requested    │ Approve                            │
               ▼                   ▼                                    │
  +────────────┴────+    +─────────┴────────+    +─────────────────+    │
  │AWAITING_INFO    │    │APPROVED_OFFICER  │──► │RETURNED_FOR_CORR│────┘
  +────────────┬────+    +─────────┬────────+    +─────────────────+
               │                   │
               │ Resubmit          │ Sign & Stamp
               ▼                   ▼
       +───────┴────+    +─────────┴────────+
       │ SUBMITTED  │    │COMPLETED/ARCHIVED│
       +────────────+    +──────────────────+
```

### 4.1 System-Wide State Glossary
*   `DRAFT` - Application created by the citizen/investor, editable, not yet visible to Ministry staff.
*   `SUBMITTED` - Dispatched to the Ministry queue, unassigned, document validation active.
*   `UNDER_REVIEW` - Claimed by a caseworker, under evaluation against system checklists.
*   `AWAITING_INFORMATION` - Processing is paused, caseworker requested clarify or extra files from applicant.
*   `APPROVED_OFFICER` - Level 1 verification complete; waiting for supervisor stamp.
*   `RETURNED_FOR_CORRECTION` - Sent back with explicit feedback; editable by applicant for resubmission.
*   `COMPLETED` - Final approval signed, license/certificate issued, notifications dispatched.
*   `REJECTED` - Disapproved, permanently closed with reasons logged; can be appealed.
*   `CANCELLED` - Aborted by user or administrator prior to completion.

---

## 5. BUSINESS RULES & DECISION ENGINE SPECIFICATION

To keep process flows clean and decouple business logic from the codebase, MCI uses a dynamic, Firestore-backed decision engine aligned with standard **Decision Model and Notation (DMN)** principles.

```
┌──────────────────────────────────────────────────────────┐
│                    DMN Decision Engine                   │
├──────────────────────────────────────────────────────────┤
│ 1. Evaluate Inputs (Company Type, Foreign Shareholder %) │
│ 2. Fetch Active Decision Table from /system_configuration│
│ 3. Execute Rules Matrix (Single hit / collect rules)     │
│ 4. Output: Fee Index, Approval Route, and Risk Level     │
└──────────────────────────────────────────────────────────┘
```

### 5.1 Externalized Rules Schema (`/system_configuration/decision_tables`)
Rules are defined inside Firestore as key-value maps, enabling real-time adjustments by authorized managers.

```json
{
  "tableId": "TBL-REG-FEE-CALC",
  "name": "Corporate Registration Fee Matrix",
  "inputs": ["legal_form", "capital_amount", "has_foreign_partners"],
  "rules": [
    {
      "conditions": {
        "legal_form": "limited_liability",
        "capital_amount": { "operator": "LTE", "value": 10000000 },
        "has_foreign_partners": false
      },
      "outputs": {
        "base_fee": 50000,
        "tax_multiplier": 1.0,
        "requires_investment_clearance": false
      }
    },
    {
      "conditions": {
        "legal_form": "limited_liability",
        "has_foreign_partners": true
      },
      "outputs": {
        "base_fee": 150000,
        "tax_multiplier": 1.5,
        "requires_investment_clearance": true
      }
    }
  ]
}
```

---

## 6. TASK & APPROVAL MANAGEMENT FRAMEWORK

```
       [ Core Event: Submission ]
                   │
                   ▼ (Fetch Active Rule)
       [ Evaluate Routing Policy ]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
  [ Sequential Path ]  [ Parallel Path ]
  - Officer Review     - Environmental Clearance (Env Dept)
  - Director Stamp     - Safety Clearance (Civil Defense)
```

### 6.1 Task Distribution Models
1.  **Manual Pull (Claim Model):** Unassigned tasks are pushed to regional state queues. Caseworkers manually review and claim tickets.
2.  **Dynamic Push (Auto-Assign Model):** System automatically allocates tasks to caseworkers using round-robin or workload balancing (target < 5 open cases per officer).
3.  **Parallel Tasks Routing:** Processes can trigger multiple concurrent sub-tasks (e.g., checking names while completing background identity audits). The workflow engine waits for all parallel checkpoints to clear before advancing the parent state.

### 6.2 Approval Framework Configuration
*   **Single-Approval Path:** Applies to simple operations (e.g., name reservations or address updates).
*   **Dual-Approval (Two-Man Rule):** High-value operations (e.g., initial registrations or capital modifications) require an officer review and supervisor approval.
*   **Four-Eye Principle (Multi-Agency):** Strategic actions (e.g., strategic foreign investments) require sequential sign-offs from the Investment, Customs, and Treasury boards.

---

## 7. SLA & ESCALATION GOVERNANCE GUIDE

To keep processing queues moving and ensure accountability across all 18 states, the platform enforces strict Service Level Agreements (SLAs).

```
┌──────────────────────────────────────────────────────────┐
│              SLA Target and Trigger Matrix               │
├───────────────────┬──────────────┬───────────────────────┤
│ Process ID        │ SLA Duration │ Warning Trigger       │
├───────────────────┼──────────────┼───────────────────────┤
│ WF-REG-NAME       │ 4 Hours      │ Alert at 2 Hours      │
│ WF-REG-COMPANY    │ 48 Hours     │ Alert at 24 Hours     │
│ WF-LIC-MANAGE     │ 72 Hours     │ Alert at 36 Hours     │
│ WF-CMP-GRIEVANCE  │ 15 Days      │ Alert at 10 Days      │
└───────────────────┴──────────────┴───────────────────────┘
```

### 7.1 Multi-Tiered Escalation Protocol
1.  **Stage 1 Warning (Yellow Flag):** Triggered when an active task exceeds 50% of its SLA window.
    *   *Action:* Send in-app and email reminders to the assigned caseworker.
2.  **Stage 2 Alert (Orange Flag):** Triggered when an active task exceeds 75% of its SLA window.
    *   *Action:* CC the regional supervisor and display the task on department warning boards.
3.  **Stage 3 Breach (Red Flag & Auto-Route):** Triggered when an active task exceeds 100% of its SLA window.
    *   *Action:* Flag the task as overdue in reporting metrics, notify the Department Director, and support auto-routing the ticket to an active supervisor for immediate processing.

---

## 8. AI-ASSISTED WORKFLOW INTEGRATION FRAMEWORK

The platform leverages isolated server-side **Gemini models** (via the modern `@google/genai` SDK) to provide intelligent assistance while maintaining complete human oversight.

```
┌──────────────────────────────────────────────────────────┐
│              AI Assistant Processing Pipeline            │
├──────────────────────────────────────────────────────────┤
│ 1. Document Uploaded (Articles of Association PDF)       │
│ 2. Trigger Background Gemini OCR & Template Alignment    │
│ 3. Compare Text to Approved Legal Patterns               │
│ 4. Score Structural Match (e.g., 94% Standard Match)     │
│ 5. Display Review & Recommendations in Officer Panel     │
│ 6. *Strict Requirement*: Officer confirms or overrides    │
└──────────────────────────────────────────────────────────┘
```

### 8.1 Key AI Advisor Capabilities
*   **OCR and Align Checks:** Scans uploaded corporate bylaws to flag missing mandatory legal clauses or formatting discrepancies.
*   **ISIC Sector Classifications:** Maps natural-language company mission statements to their corresponding ISIC Rev.4 economic codes.
*   **Predictive SLA Indicators:** Flags complex applications likely to exceed standard SLA limits, allowing teams to route them early to specialized caseworkers.
*   **Strict Security & Advisor Sandbox:** AI recommendations are presented exclusively as advisory widgets within the administrative panel. The AI is structurally blocked from editing states, updating data, or granting approvals directly.

---

## 9. WORKFLOW MONITORING & ANALYTICS DASHBOARD

Real-time visibility into process metrics and queue health is critical for operations management.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      MCI Operational Monitoring Hub                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [ Average Active Load: 2,412 Cases ]   [ Overall SLA Compliance: 98.4% ]│
│  [ Mean Processing Time: 14.8 Hours ]   [ Auto-Triage Accuracy: 94.2% ]  │
│                                                                         │
│  Regional Queue Statuses:                                               │
│  Khartoum Office: [ HEALTHY ]           Red Sea Port Office: [ STABLE ] │
│  Last Sandbox Health Audit:             [ PASSED - 2026-07-12 11:30 ]   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Management Metric Cubes:
*   **Processing Timelines:** Track average duration from submission to final approval per state, queue, and caseworker.
*   **SLA Compliance Percentage:** Track the ratio of tasks processed within SLA targets (Target > 95% compliance).
*   **Queue Bottleneck Indicators:** Monitor unassigned ticket buildup per state office to assist with staffing allocations.
*   **AI Suggestion Effectiveness:** Log the percentage of AI recommendations accepted by officers to assist with system tuning.

---

## 10. WORKFLOW GOVERNANCE & VERSIONING MANUAL

To support system evolution, all changes to workflow definitions must follow a strict change management process.

```
[ Propose Change ] ──► [ Board Review & Testing ] ──► [ Publish Sandbox Version ] ──► Live Migration
```

### 10.1 Key Governance Roles
1.  **Workflow Owner (Role):** Approves changes to process paths and validation checklists.
2.  **Business Process Analyst (Role):** Modifies the declarative JSON schemas inside the `/workflow_definitions` directory and tests changes in sandbox environments.
3.  **Approval Authority (Role):** Authorizes major workflow version migrations.
4.  **Workflow Versioning Framework:**
    *   Workflow templates include schema version numbers (e.g., `v1.0.0`, `v1.1.0`).
    *   Active cases are bound to their initiation schema version. Deploying a new version (`v2.0.0`) does not alter active historical cases.
    *   The platform supports parallel processing paths for multiple active major versions during migration windows.
