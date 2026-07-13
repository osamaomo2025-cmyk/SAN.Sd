# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### MASTER BLUEPRINT: ENTERPRISE BUSINESS PROCESS REPOSITORY (v1.0.0)

---

## 1. INTRODUCTION & BPMN 2.0 MODELING STANDARDS

This repository contains the standard **Business Process Model and Notation (BPMN 2.0)** specifications for the Sudan Digital Ministry of Commerce & Industry (MCI). Every workflow in the ministry's digital ecosystem must conform to these architectural standards to ensure interoperability, scalability, and ease of maintenance over the next 20 years.

### BPMN 2.0 Element Matrix
To maintain consistency across all process designs, developers and business analysts must utilize these standardized BPMN elements:

```
[Start Event] ────> [User Task] ────> [Service Task] ────> {Gateway} ────> [End Event]
```

1.  **Start Events (O):** Represents the trigger for a process (e.g., Form Submission, Timer Trigger, webhook API Call).
2.  **User Tasks (👤):** Standard interactive forms requiring manual inputs or verification by citizens, merchants, or caseworkers.
3.  **Service Tasks (⚙️):** Automated system-to-system operations (e.g., searching database registers, sending API payloads, validating hashes).
4.  **Business Rule Tasks (📋):** Automated decision tables (e.g., verifying tax status, checking capital thresholds).
5.  **AI Advisory Tasks (🤖):** AI-powered analysis (using server-side Gemini models) for document completeness audits, OCR text extraction, and risk assessment. AI outputs are advisory only; final authorization remains with designated officers.
6.  **Gateways (X):** Decision points routing workflows based on specific criteria (e.g., Exclusive XOR, Parallel AND, Inclusive OR).
7.  **Intermediate Timer Events (⏱️):** Handles SLA deadlines, escalation triggers, and automated reminders.
8.  **Error End Events (❌):** Terminates workflows with specific error states (e.g., "Verification Failure," "Payment Timeout").
9.  **End Events (🏁):** Successful completion of a process, resulting in the delivery of a service (e.g., Certificate Issued).

---

## 2. REUSABLE SUB-PROCESSES (SHARED UTILITIES)

These shared, modular sub-processes are defined once and referenced across multiple high-level workflows.

```
                          +-----------------------------+
                          |   Common Reusable Engines   |
                          +--------------+--------------+
                                         |
       +---------------------------------+---------------------------------+
       |                                 |                                 |
+------v------+                     +------v------+                     +------v------+
|   SUB-01    |                     |   SUB-02    |                     |   SUB-03    |
| Dynamic SMS |                     | Cryptography|                     | National ID |
|   & Email   |                     | & QR Stamps |                     | Integration |
+-------------+                     +-------------+                     +-------------+
```

### Sub-Process ID: SUB-01 | Multi-Channel Dynamic Notifications
*   **Purpose:** Sends transactional alerts to applicants and caseworkers at key stages.
*   **Trigger:** Invoked by main workflows when status changes occur.
*   **Inputs:** Recipient contact info, message template ID, context metadata.
*   **Logic:** Detects user preferences and dispatches notifications via In-App Alerts, Email, and SMS. Logs dispatch status in the database.

### Sub-Process ID: SUB-02 | Cryptographically Signed Certificate Issuance
*   **Purpose:** Generates secure digital certificates (e.g., CR Extracts, Industrial Licenses) with official verification credentials.
*   **Inputs:** Approved entity payload, licensee details, expiry date, signatory keys.
*   **Steps:**
    1.  Format certificate payload into standard JSON.
    2.  Generate a unique SHA-256 hash representing the document state.
    3.  Generate a secure verification URL mapping to `/portal/verify?hash=...` and encode it into a high-contrast QR code stamp.
    4.  Apply the Ministry's digital signature.
    5.  Render the final, secure PDF and store it in the system vault.

### Sub-Process ID: SUB-03 | Unified Identity Validation (National ID API Integration)
*   **Purpose:** Verifies applicant identities against the national civil registry database.
*   **Inputs:** National ID number, Full Name, Birth Date.
*   **Outputs:** Verification Status (Verified/Failed), verified details payload.

---

## 3. CORE BUSINESS PROCESS SPECIFICATIONS

---

### Process ID: PR-CR-001 | Commercial Name Reservation & Trademark Conflict Check

#### 1. Process Metadata
*   **Purpose:** Ensures prospective business names are unique, legally permissible, and free from trademark conflicts prior to company incorporation.
*   **Trigger:** Applicant submits a "Name Reservation" request.
*   **Actors:** Applicant, Ministry Trademarks Officer (Reviewer).
*   **SLA Target:** 4 Business Hours.
*   **Success Criteria:** Name reserved and a digital reservation ticket issued.
*   **Failure Criteria:** Application rejected due to naming conflicts or offensive terms.

#### 2. BPMN Swimlane & Step Narrative
The process coordinates actions across three main swimlanes: Applicant, System, and Trademarks Officer.

```
[Applicant] ---------> Submit Name ---> (Wait for Review) ----> [SLA Exceeded] ---> Auto-Escalate
                             |                                         |
[System] ------------> Run Checks ----> {Is Conflict?} ---> [Yes] ---> Auto-Reject (End ❌)
                             |                 | [No]
                             v                 v
[Trademarks Officer]                 Verify Naming Rules ---------> Approved ---> Issue Certificate (End 🏁)
```

1.  **Step 1 (Applicant):** Fills out the digital name reservation request form, specifying the desired name in Arabic and English, along with business activity categories.
2.  **Step 2 (System - Service Task):** Executes an automated query checking the requested name against:
    *   Active and pending registrations.
    *   The National Trademark registry.
    *   A blacklisted vocabulary database (containing offensive terms, restricted national symbols, or state names).
3.  **Step 3 (System - Gateway XOR):**
    *   *If an exact match or clear conflict is found:* Automatically routes to **Auto-Reject**, sends an notification (via `SUB-01`), and terminates with an Error Event (❌).
    *   *If no immediate conflict is found:* Forwards the application to the Trademarks Officer's queue.
4.  **Step 4 (Trademarks Officer - User Task):** Conducts a manual audit to evaluate phonetic similarities, semantic risks, and potential brand dilution.
5.  **Step 5 (Trademarks Officer - Gateway XOR):**
    *   *Approved:* Signs off on the name. System invokes `SUB-02` to generate a 90-day Name Reservation Certificate and sends a confirmation via `SUB-01` (End 🏁).
    *   *Rejected:* Submits a reason for rejection (e.g., "Phonetically identical to an existing brand"). System sends a rejection notification and terminates (End ❌).

#### 3. Exception & Escalation Scenarios
*   **SLA Timer Breach (Intermediate Event):** If the application remains un-reviewed after 3 hours, the system fires a Timer Event, triggering an automatic escalation rule that re-assigns the application to the Department Supervisor.
*   **User Clarification Request:** If the officer requires clarification on the business activities, the application is returned to the applicant, and the SLA timer pauses.

---

### Process ID: PR-CR-002 | New Limited Liability Company (LLC) Registration

#### 1. Process Metadata
*   **Purpose:** Manages the step-by-step submission, legal review, verification, fee collection, and digital issuance of Commercial Registrations for LLCs.
*   **Trigger:** Applicant initiates an LLC Registration, linking a previously approved Commercial Name.
*   **Actors:** Applicant, Case Reviewer, Department Director, Finance Officer.
*   **SLA Target:** 24 Business Hours.
*   **Success Criteria:** Sovereign Digital Commercial Registration Certificate issued, with active status.

#### 2. Workflow Swimlane & Step Narrative

```
[Applicant] ---------> Submit LLC Details ---> Pay Fees (Gateway) ---> Receive Signed CR (End 🏁)
                             |
[System - AI Guard] -> Run Document OCR & Completeness Check ---> [Failed] ---> Return to Applicant
                             | [Passed]
                             v
[Case Reviewer] ------> Audit Articles of Association & IDs
                             |
                             v
[Dept Director] ------> Final Digital Sign-off
```

1.  **Step 1 (Applicant):** Enters LLC details (registered capital, business address, shareholder shares) and uploads copies of shareholder IDs and draft Articles of Association.
2.  **Step 2 (System - AI Advisory Task):** Uses server-side Gemini models to process uploaded documents:
    *   Performs OCR check to verify shareholder names match their IDs.
    *   Scans the Articles of Association to check for mandatory legal clauses.
    *   Flags any discrepancies or missing documents for review.
3.  **Step 3 (Case Reviewer - User Task):** Audits the AI recommendations and verifies compliance with company laws. 
    *   *Action:* If document details are incorrect, the caseworker marks them as "clarification required" and returns the application to the applicant.
4.  **Step 4 (System - Gateway XOR):**
    *   *Passed:* Generates a secure invoice and notifies the applicant to complete the fee payment.
5.  **Step 5 (Applicant - User Task):** Pays the registration fee using the integrated e-payment gateway.
6.  **Step 6 (Dept Director - User Task):** Conducts final review of the verified file and signs off on the registration.
7.  **Step 7 (System - Service Task):** Invokes `SUB-02` to generate the official Commercial Registration Certificate and updates the public registry database (End 🏁).

---

### Process ID: PR-IL-001 | Industrial Licensing & Environmental Site Inspection

#### 1. Process Metadata
*   **Purpose:** Coordinates the evaluation of proposed manufacturing sites to ensure compliance with zoning, safety, and environmental regulations.
*   **Trigger:** Applicant submits an "Industrial License Application."
*   **Actors:** Industrial Investor, Case Auditor, Field Inspector, Ministry Director.
*   **SLA Target:** 10 Business Days.
*   **Success Criteria:** Valid Industrial Operating Certificate issued.

#### 2. Workflow Narrative & Process Map

```
[Investor] ----------> Submit Industrial Proposal ---> (Wait for Audit) ---> Pay Tariffs ---> License Issued
                             |
[System] ------------> Validate Coordinates & Zone Maps
                             |
                             v
[Case Auditor] ------> Audit Floor plans & Environmental Impact
                             |
                             v
[Field Inspector] ---> Conduct Site Audit & Log GPS/Photo Proof ---> [Passed] ---> Director Sign-off
```

1.  **Step 1 (Investor):** Submits factory floor plans, proposed manufacturing activities, waste management plans, and GPS coordinates.
2.  **Step 2 (System - Service Task):** Validates the submitted coordinates against state industrial zoning maps and environmental preservation boundaries.
3.  **Step 3 (Case Auditor - User Task):** Audits the manufacturing proposals. If the proposal meets the criteria, the auditor schedules a field visit.
4.  **Step 4 (Field Inspector - Mobile User Task):** Receives the inspection dispatch. Performs a physical inspection of the site, takes photos of waste disposals and safety layouts, and logs observations on their mobile device.
5.  **Step 5 (Field Inspector - Gateway XOR):**
    *   *If Violations are found:* Inspector logs specific infractions, and the system issues a corrective action ticket to the investor, pausing the licensing process.
    *   *If Compliant:* Inspector submits the report. The system updates the application status to "Ready for Approval."
6.  **Step 6 (Ministry Director - User Task):** Reviews the compliance file and grants final approval.
7.  **Step 7 (System - Service Task):** Invokes `SUB-02` to generate the Industrial Operating Certificate, updates the industrial registry, and schedules the next annual inspection cycle (End 🏁).

---

### Process ID: PR-CP-001 | Consumer Protection Complaint, Investigation & Enforcement

#### 1. Process Metadata
*   **Purpose:** Receives, triages, and coordinates field audits for public reports of commercial fraud, expired food sales, or price gouging.
*   **Trigger:** Consumer files a complaint through the mobile application or web portal.
*   **Actors:** Consumer, Case Coordinator, Field Inspector.
*   **SLA Target:** 48 Hours for Triage / 5 Days for Resolution.
*   **Success Criteria:** Case resolved, and appropriate corrective actions or citations issued.

#### 2. Workflow Narrative & Process Map

```
[Consumer] ----------> Submit Complaint & Photo Receipt ---> Receive Progress Updates
                             |
[System] ------------> Group Complaint by Merchant (AI Advisory)
                             |
                             v
[Case Coordinator] --> Triage Priority ---> [High Priority] ---> Dispatch Field Inspector
                                                                        |
[Field Inspector] <-----------------------------------------------------+
        |
        +------------> Conduct Audit ---> [Violation] ---> Log Citation Ticket ---> Notify Merchant
```

1.  **Step 1 (Consumer):** Enters merchant name, location details, receipt photo, and description of the complaint (e.g., price gouging).
2.  **Step 2 (System - AI Advisory Task):** Automatically groups incoming complaints by merchant ID, location, and category. If multiple complaints are flagged for the same merchant within a 12-hour period, the system escalates the merchant's risk priority to "Critical."
3.  **Step 3 (Case Coordinator - User Task):** Reviews the complaint file and determines the next action. If the complaint suggests immediate danger (e.g., expired food distribution), a high-priority field inspection is dispatched.
4.  **Step 4 (Field Inspector - User Task):** Receives the dispatch on their device, conducts an unannounced audit at the merchant's physical location, and logs findings.
5.  **Step 5 (Field Inspector - Gateway XOR):**
    *   *Violation Found:* The inspector issues a digital citation ticket. The merchant is notified of the violation and fine, with payment tracking managed through `PR-PM-001`.
    *   *No Violation Found:* Case is closed. System sends an update notification to the complaining consumer.

---

## 4. DYNAMIC DECISION TABLES (CONFIGURABLE BUSINESS LOGIC)

The platform utilizes configurable decision tables to manage business rules. This allows system administrators to adjust values (such as fee thresholds and approval requirements) without needing to modify application code.

### Decision Table ID: DT-CR-01 | Foreign Capital Investment Tiers
This table evaluates the required approval level and processing track for foreign investment proposals based on proposed capital amounts and industry sectors.

| Column 1: Foreign Capital (USD) | Column 2: Industrial Sector | Output 1: SLA Target | Output 2: Approval Level | Output 3: Escaped Fast-Track |
| :--- | :--- | :--- | :--- | :--- |
| < $500,000 | Light Assembly, Retail Services | 2 Business Days | Department Director | Yes |
| $500,000 to $5,000,000 | Agricultural, Local Manufacture | 3 Business Days | Director General | Yes |
| > $5,000,000 | Heavy Industry, Mining, Logistics | 5 Business Days | Federal Minister | No (Board Audit) |

### Decision Table ID: DT-IL-01 | Environmental Impact Risk Triage
Determines site inspection requirements based on environmental risk levels of manufacturing proposals.

| Column 1: Chemical / Waste Output | Column 2: Proposed Zone | Output 1: Risk Level | Output 2: Inter-Ministry Approvals Required | Output 3: Scheduled Audits Frequency |
| :--- | :--- | :--- | :--- | :--- |
| None (Water/Steam Only) | Approved Industrial Park | Low Risk | None (Immediate Approval) | Annual |
| Standard Industrial Byproducts | Approved Industrial Park | Medium Risk | Ministry of Environment | Semi-Annual |
| Hazardous / Chemical Waste | Any Zone | Critical Risk | Environment, Civil Defense, Water Authority | Quarterly |

---

## 5. SLA & AUTOMATIC ESCALATION FRAMEWORK

The platform features built-in SLA tracking to ensure applications are processed in a timely manner. If a deadline is missed, the system automatically escalates the file to keep workflows moving forward.

```
[ Application Submitted ] ──( Start SLA Timer )
                                  │
                                  ├─> 50% SLA Time: Send reminder to Case Reviewer
                                  │
                                  ├─> 80% SLA Time: Send high-priority alert to Supervisor
                                  │
                                  └─> 100% SLA Time: Re-assign application to escalation queue
```

### SLA Configuration Rules:
1.  **Level 1 Warning (50% SLA Time):** Sends an in-app reminder to the assigned case officer.
2.  **Level 2 Alert (80% SLA Time):** Sends a high-priority dashboard alert to the department supervisor, flagging the case as near-breach.
3.  **Level 3 Escalation (100% SLA Time):** Automatically re-assigns the application to the escalation queue and logs an SLA breach event for performance tracking.

---

## 6. EXCEPTION MANAGEMENT CATALOG

This catalog outlines standard procedures for handling common exceptions, ensuring workflows can recover gracefully without manual intervention.

| Exception Event | Primary Impact | Recovery & Resolution Steps |
| :--- | :--- | :--- |
| **Missing Documents** | Application processing is paused. | 1. Case reviewer marks specific files as "rejected."<br>2. System pauses the SLA timer.<br>3. Notifies the applicant via `SUB-01` with instructions on how to upload the corrected documents.<br>4. Processing and SLA timer resume once the missing files are uploaded. |
| **E-Payment Gateway Timeout** | Payment status is unverified. | 1. System attempts automated payment reconciliation with the banking gateway.<br>2. If payment is verified, the system updates the status to "Paid."<br>3. If payment failed, the system notifies the applicant to retry the payment. |
| **Duplicate Business Name Request** | Application rejected. | 1. System automatically flags the conflict.<br>2. Returns the application to the applicant with a clear rejection reason.<br>3. Suggests available variations based on AI recommendations. |
| **Legal / Judicial Hold** | Entity records are locked. | 1. System flags the database record with a "legal hold."<br>2. Prevents any modifications or certification renewals.<br>3. Logs all access attempts for administrative review. |

---

## 7. AUDIT, COMPLIANCE & SECURITY CHECKPOINTS

To ensure transparency and protect data integrity, the system implements standard security checkpoints across all processes.

### 1. Non-Repudiation Logging
Every administrative action (such as an approval, rejection, or database edit) is recorded in an immutable audit log. Each log entry includes:
*   Timestamp of the action.
*   Unique ID of the user performing the action.
*   The previous state and updated state of the record.
*   The user's IP address and verified role.

### 2. Multi-Factor Approval for High-Value Transactions
Transactions involving large capital values or strategic licensing (e.g., gold export permits) require:
*   Multi-factor authentication (MFA) validation from the approving director.
*   A cryptographic digital signature applied to the certificate.

### 3. Data Sanitization Rules
All user-entered text is passed through a sanitization filter before database storage to prevent scripting attacks (XSS) and SQL injection.

---

## 8. BPM GOVERNANCE & CONTINUOUS IMPROVEMENT

To keep workflows aligned with changing regulatory and administrative requirements, process designs are managed through a structured governance cycle:

1.  **Process Ownership:** Every business process has an assigned owner (e.g., the Registrar General for Commercial Name Reservations) responsible for reviewing process performance.
2.  **Semi-Annual Performance Audits:** Process owners review operational metrics (SLA compliance, bottleneck reports, rejection rates) twice a year to identify opportunities for optimization.
3.  **Workflow Versioning Rules:** Modifications to workflow routes or decision tables are tested in a staging environment and deployed with incremental version numbers (e.g., v1.1.0) to preserve historical compliance records.
