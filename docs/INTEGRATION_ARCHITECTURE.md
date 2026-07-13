# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL GOVERNMENT INTEROPERABILITY HANDBOOK: ENTERPRISE INTEGRATION, DATA MIGRATION, & INTEROPERABILITY FRAMEWORK (v1.0.0)

---

## 1. DESIGN PHILOSOPHY & SOVEREIGN INTEROPERABILITY MANDATE

This handbook defines the authoritative **Enterprise Integration Architecture (EIA)**, **Government Interoperability Framework (GIF)**, and **Data Migration Blueprint** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national **"National Interoperability & Digital Sovereignty Act"**, this framework establishes a modern, secure, and resilient ecosystem that enables seamless data exchange between MCI and current or future government ministries, agencies, and private sector financial nodes.

The core architectural directive is **API-First, Event-Driven, and Loosely Coupled**. To protect national digital sovereignty and guarantee long-term system evolution, direct database-to-database connections or shared-filesystem integrations with external bodies are **strictly prohibited**. Systems must interact exclusively through cryptographically secured, standards-based APIs and asynchronous messaging fabrics.

```
+───────────────────────────────────────────────────────────────────────────────────────────+
|                             Sovereign Interoperability Engine                             |
├───────────────────────────────┬───────────────────────────────────┬───────────────────────┤
│          API-First            │           Event-Driven            │    Secure-by-Design   │
│  - REST & gRPC endpoints      │  - Asynchronous Pub/Sub messaging │  - mTLS & OAuth federation│
│  - Rigid OpenAPI contracts    │  - Idempotent event processing    │  - Full audit logging │
└───────────────────────────────┴───────────────────────────────────┴───────────────────────┘
```

---

## 2. GOVERNMENT INTEROPERABILITY FRAMEWORK

The MCI serves as the authoritative source of truth for corporate identities, trade names, and industrial registries in Sudan. Interoperability with sister ministries and national agencies is structured using **Decoupled Gateway Adapters** to ensure that downtime in external agencies does not compromise the core operational capacity of the MCI portal.

```
                  +----------------------------------------------+
                  |         Ministry Interoperability Bus        |
                  +----------------------+-----------------------+
                                         |
       +-------------------+-------------+-------------+-------------------+
       |                   |                           |                   |
+------v------+     +------v------+             +------v------+     +------v------+
| National ID |     | Min Finance |             | Central Bank|             | Customs/Tax |
|   Platform  |     |  & Revenue  |             |   of Sudan  |             |  Authorities|
+-------------+     +-------------+             +-------------+     +-------------+
```

### 2.1 Cross-Agency Integration Enclaves

#### 2.1.1 National Digital Identity Platform (Civil Registry)
*   **Integration Boundary:** Bi-directional verification.
*   **Data Exchange:** Queries national identification numbers (NIN) during citizen or representative registration to retrieve verified Arabic/English full names, birthdates, and biological statuses.
*   **Sovereign Fallback:** If the Civil Registry is offline, MCI enters "Deferred Verification Mode," allowing application drafts with scanned ID uploads, scheduling background queue verification once the registry comes back online.

#### 2.1.2 Ministry of Finance & Economic Planning
*   **Integration Boundary:** Automated financial reporting and revenue reconciliation.
*   **Data Exchange:** Pushes daily collected revenue metrics, license fee summaries, and foreign investment capital inflows to the central government general ledger.

#### 2.1.3 Customs Authority
*   **Integration Boundary:** Real-time port clearance queries.
*   **Data Exchange:** Customs gateways query MCI to confirm the validity of active import/export licenses, sanitary certificates, and industrial raw-material waivers for shipments arriving at Port Sudan or land borders.

#### 2.1.4 Federal Tax Authority
*   **Integration Boundary:** Joint company registration and tax card generation.
*   **Data Exchange:** Upon successful company incorporation, MCI triggers an automated registration request to the Tax Authority, generating a Tax Identification Number (TIN) and returns it to the company representative's portal profile.

#### 2.1.5 Ministry of Justice (Commercial Court & Registry)
*   **Integration Boundary:** Legal hold registry and corporate litigation tracking.
*   **Data Exchange:** Receives court-mandated legal freeze orders, liquidations, and disputes. Pushes certified corporate articles of association and authorized signatory logs for legal verification.

#### 2.1.6 Central Bank of Sudan (CBOS)
*   **Integration Boundary:** National payment clearance and capital transfer verification.
*   **Data Exchange:** Validates payment transactions through the National Electronic Payments Switch (EBS). Verifies foreign capital compliance for registered investment groups.

#### 2.1.7 National Statistics Authority
*   **Integration Boundary:** Anonymized economic trend publishing.
*   **Data Exchange:** Pushes monthly aggregated metrics regarding new factory registrations, active industry sectors, employment metrics, and geographic distribution profiles across Sudan’s 18 Federal States.

---

## 3. API ARCHITECTURE & STANDARDS MANUAL

To enforce uniformity across all integration points, the Ministry mandates strict standardization of REST and gRPC API contracts.

```
┌──────────────────────────────────────────────────────────┐
│                    API Gateway Pipeline                  │
├──────────────────────────────────────────────────────────┤
│ 1. Mutual TLS (mTLS) Handshake & Whitelist Check         │
│ 2. JWT Identity Verification & Custom Claim Check (RBAC) │
│ 3. Rate-Limit Evaluation (Leaky Bucket Algorithm)        │
│ 4. Request Payload JSON Schema Validation                │
│ 5. Header Injection (Request Correlation ID)             │
│ 6. Core Application Routing & Logging                    │
└──────────────────────────────────────────────────────────┘
```

### 3.1 Versioning & Endpoint Standards
1.  **URI-Based Versioning:** Enforced for all external REST interfaces (e.g., `https://api.mci.gov.sd/v1/companies/`).
2.  **Naming Convention:** Endpoints must utilize nouns in plural format, styled in spinal-case (e.g., `/v1/industrial-licenses`).
3.  **Language Negotiation:** Supported via standard headers (`Accept-Language: ar-SD` or `Accept-Language: en-US`). Error messages and field descriptions are translated based on this parameter.

### 3.2 Request & Response Standards
All payloads must exchange data in valid UTF-8 JSON format. 

#### 3.2.1 Pagination, Filtering, and Sorting Standard
*   **Filtering:** Applied via query parameters matching exact attributes (e.g., `?status=active&state=red-sea`).
*   **Sorting:** Formatted with a comma-separated list of attributes (e.g., `?sort=-registration_date,name_ar`). The negative prefix indicates descending order.
*   **Pagination:** Cursor-based pagination parameters are enforced for high-volume endpoints (e.g., `?limit=25&starting_after=comp_9812`).

#### 3.2.2 Standard Error Response (RFC 7807 Compliance)
All API failure states must return a machine-readable problem detail structure:

```json
{
  "type": "https://api.mci.gov.sd/errors/validation-failure",
  "title": "Unprocessable Entity: Validation Error",
  "status": 422,
  "detail": "The requested business name contains characters that are legally prohibited for commercial registrations.",
  "instance": "/v1/commercial-names/reserve/txn_81249",
  "errorDetails": {
    "field": "name_ar",
    "reason": "Name contains the word 'وزارة' which is restricted for government departments."
  }
}
```

### 3.3 Rate Limiting & Idempotency
*   **Rate Limiting:** Enforced at the API Gateway using a Redis-backed Leaky Bucket algorithm. Public clients are limited to 120 requests/minute, whereas partner government endpoints are allocated up to 10,000 requests/minute.
*   **Idempotency:** Write operations (POST/PUT) must accept an `Idempotency-Key` header (UUIDv4). If a duplicate request is received within a 24-hour window, the gateway returns the cached response of the initial transaction without re-executing backend logic.

---

## 4. DATA MIGRATION STRATEGY & PLAYBOOK

Transitioning from paper-based and legacy database systems across the 18 states of Sudan requires a highly structured, transactional, and reversible migration playbook.

```
[ Phase 1: Source Assessment ] ──► [ Phase 2: Schema Mapping ] ──► [ Phase 3: Cleansing & Normalization ]
                                                                                   │
                                                                                   ▼
[ Phase 6: Rollback & Reconcile] ◄── [ Phase 5: Final Switchover ] ◄── [ Phase 4: Parallel Trial Runs ]
```

---

### 4.1 Migration Phases & Playbook

#### Phase 1: Source Assessment & Cataloging
*   **Objective:** Scan and inventory all legacy relational databases (Microsoft SQL Server, Oracle, and MySQL) and local Excel spreadsheets currently stored in regional commerce offices.
*   **Discovery Checklist:** Identify unstructured text fields, invalid date formats (including non-gregorian inputs), and orphaned foreign keys across records.

#### Phase 2: Schema Mapping & Field Isolation
*   **Objective:** Define structural field mappings from legacy tables to Cloud Firestore's high-performance shallow collection design.
*   **Strategy:** Map traditional tables (e.g., `T_COMPANY`, `T_OWNER`) into highly scalable `/companies` collections with denormalized child maps for active shareholders.

#### Phase 3: Cleansing & Bilingual Normalization
*   **Objective:** Resolve duplicate records, missing attributes, and inconsistent language fields.
*   **Cleansing Routines:**
    1.  Normalize Arabic names by stripping vocalizations and consolidating alef variants.
    2.  Identify duplicate commercial names and append verified legacy registration numbers to establish a single source of truth.
    3.  Flag files with missing critical elements (e.g., missing national identifiers) for manual verification by registry caseworkers.

#### Phase 4: Parallel Trial Migration (Sandbox Runs)
*   **Objective:** Execute non-destructive, full-scale migrations into an isolated staging environment.
*   **Validation Rules:** Compare legacy record checksums against newly generated Firestore documents. Verify that index utilization matches operational performance targets.

#### Phase 5: Final Migration & Switchover
*   **Objective:** Transition operations to the live production database.
*   **Execution Strategy:**
    1.  Place the legacy database in read-only mode during a weekend maintenance window.
    2.  Execute the migration scripts, logging all operations.
    3.  Redirect API and application portal traffic to the newly populated Firestore database.

#### Phase 6: Failback & Rollback Plan
In the event of critical errors or performance bottlenecks during migration, the system supports a structured, 3-tier rollback plan:

```
┌──────────────────────────────────────────────────────────┐
│                 MCI Tiered Rollback Plan                 │
├───────────────────┬───────────────────┬──────────────────┤
│ Trigger Condition │ Rollback Scope    │ Target Execution │
├───────────────────┼───────────────────┼──────────────────┤
│ Schema Mismatch   │ Hot-Fix Schema    │ < 15 Minutes     │
│ Data Loss (>0.1%) │ Database Restore  │ < 1 Hour         │
│ Critical Failure  │ DNS Traffic Revert│ < 10 Minutes     │
└───────────────────┴───────────────────┴──────────────────┘
```

1.  **Immediate Hot-Fix (Level 1):** If minor schema mismatches or index delays occur, developers deploy index overrides while leaving the platform online.
2.  **Point-in-Time Restore (Level 2):** If data corruption or loss exceeds 0.1% during the final write phase, the system restores the Firestore database state using Point-in-Time Recovery (PITR) to the pre-migration baseline.
3.  **DNS Traffic Reversion (Level 3):** If a critical gateway error blocks access, the DNS routing engine redirects public traffic back to the legacy portal.

---

## 5. DATA QUALITY & MASTER DATA MANAGEMENT (MDM)

To prevent data fragmentation and keep database records accurate across all national integrations, MCI defines clear Master Data Management policies.

```
+───────────────────────────────────────────────────────────────────────────────────────────+
|                                Master Data Authority Model                                |
├───────────────────────────────┬───────────────────────────────────┬───────────────────────┤
│    Authority: MCI             │      Authority: Tax Agency        │    Authority: Civil   │
│  - Company Core Registers     │  - Tax Identification Numbers     │  - National Identities │
│  - Active Trade License IDs   │  - Revenue Collection Status      │  - Authorized Signers │
└───────────────────────────────┴───────────────────────────────────┴───────────────────────┘
```

### 5.1 MDM Authority & Synchronization Rules
*   **MCI Authority:** MCI is the master authority for `companies`, `commercial_names`, and `industrial_licenses`. Other agencies can only query these files, and any changes must be requested through MCI workflows.
*   **Sync Schedules:** Reference datasets (such as ISIC activity categories, regional administrative states, and legal forms) are distributed daily to partner databases through automated JSON sync catalogs.
*   **Data Validation Controls:** All incoming data records are checked against core business validation rules:
    1.  *National IDs:* Must conform to verified Sudanese National Identification structures and pass Luhn-algorithm validation.
    2.  *Tax IDs:* Checked against federal format models before being saved to company records.
    3.  *Geographic Fields:* Must match the official Sudanese postal index codes and state geographic identifiers.

---

## 6. EVENT-DRIVEN ARCHITECTURE (EDA) CATALOG

The platform utilizes a secure asynchronous event fabric (Google Cloud Pub/Sub) to handle cross-departmental coordination without blocking user interactions.

```
       [ Core Business Action Completed ]
                       │
                       ▼
         [ Event Published to Pub/Sub ]
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
  [ Subscriber A ]            [ Subscriber B ]
  (Taxes Adapter)             (Customs Sync)
```

### 6.1 Core Event Blueprints

#### 6.1.1 Event: `CompanyRegistered` (V1.0)
*   **Trigger Condition:** Fired when a company incorporation application receives final approval and stamp validation from the Registry Officer.
*   **Publisher:** Commercial Registry Module.
*   **Subscribers:** Tax Authority Adapter, Customs Registry Sync, Ministry of Finance.
*   **Payload Schema:**
```json
{
  "eventId": "evt_company_reg_71289",
  "eventType": "sd.gov.mci.company.registered",
  "eventSource": "https://api.mci.gov.sd/registry",
  "timestamp": "2026-07-12T10:31:15Z",
  "data": {
    "companyId": "comp_981240_K",
    "crNumber": "CR-981240-K",
    "legalNameAr": "شركة النيل الزرقاء المحدودة",
    "legalNameEn": "Blue Nile Company Ltd",
    "capitalAmount": 50000000.00,
    "currency": "SDG",
    "registeredAddress": "الخرطوم، تقاطع شارع القصر مع الجمهورية",
    "incorporationDate": "2026-07-12T10:30:00Z"
  }
}
```

#### 6.1.2 Event: `LicenseIssued` (V1.0)
*   **Trigger Condition:** Fired when a business or factory operating license is approved and printed.
*   **Publisher:** Licensing & Permit Module.
*   **Subscribers:** Customs Authority (to enable import/export activity), Local State Government Offices.
*   **Payload Schema:**
```json
{
  "eventId": "evt_license_issue_98241",
  "eventType": "sd.gov.mci.license.issued",
  "eventSource": "https://api.mci.gov.sd/licensing",
  "timestamp": "2026-07-12T11:05:00Z",
  "data": {
    "licenseId": "lic_98241_f9",
    "companyId": "comp_981240_K",
    "licenseType": "industrial_manufacturing",
    "expirationDate": "2027-07-12T18:00:00Z",
    "operatingScope": "food_processing_sugar"
  }
}
```

---

## 7. DOCUMENT & CERTIFICATE EXCHANGE STANDARDS

To maintain legal compatibility and ensure certificates can be easily validated by third parties, the platform enforces strict document exchange guidelines.

```
┌──────────────────────────────────────────────────────────┐
│              Document Verification Lifecycle             │
├──────────────────────────────────────────────────────────┤
│ 1. Certificate is generated in PDF/A-1b compliance form │
│ 2. Embeds dynamic metadata (ID, Issuer, Issue Date)     │
│ 3. Generates digital signature using SHA-256 with RSA-4K │
│ 4. Embeds high-contrast QR code pointing to verify portal│
│ 5. Pushes metadata and file hash to registry database    │
└──────────────────────────────────────────────────────────┘
```

### 7.1 Certificate Verification Standards
1.  **Format Compliance:** Official certificates are generated in PDF/A-1b format to ensure long-term archival compatibility.
2.  **QR Code Verification:** Every printed certificate includes a high-contrast QR code pointing to a secure validation URL (e.g., `https://verify.mci.gov.sd/lic/lic_98241_f9`).
3.  **Digital Signature Compatibility:** The platform supports digital signatures compliant with international cryptographic standards (SHA-256 with RSA-4096). This ensures that certificates can be validated by external bodies, including foreign banks and international trade organizations.

---

## 8. EXTERNAL SYSTEM CONNECTIVITY & SECURITY

Connections with external platforms are secured by clear cryptographic protocols to protect government data exchange.

```
[ External Partner Client ] ──► [ Gateway Firewall ] ──► [ Token Validation (mTLS) ] ──► [ Target API ]
```

### 8.1 Core Security Rules
1.  **Mutual TLS (mTLS):** Enforced for all inter-agency connections. Communication must utilize client certificates signed by the National Certificate Authority (CA).
2.  **Signed HTTP Requests:** High-value banking transactions require the request payload to be cryptographically signed by the sending gateway using RSA-4096 private keys.
3.  **HMAC Signature Verification:** Webhooks sent to external partners must include an `X-MCI-Signature` header containing a SHA-256 HMAC hash of the payload, generated with a shared secret key.
4.  **IP Whitelisting:** Administrative integration APIs are restricted to whitelisted IP addresses associated with government and banking networks.

---

## 9. OBSERVABILITY, MONITORING, & ERROR RECOVERY PLAYBOOK

Real-time visibility into integration health is critical for maintaining high availability.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                MCI Interoperability Observability Hub                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [ API Availability: 99.98% ]       [ Sync Delay: 14ms ]               │
│  [ Active Integrations: 12 ]        [ Error Rate Percentage: 0.04% ]    │
│                                                                         │
│  Integration Pipeline Health:   [ HEALTHY / SECURE ]                    │
│  Last Sandbox Verification:     [ PASSED - 2026-07-12 11:30 ]           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Recovery Procedures

#### 9.1.1 Partial Synchronization Recovery
*   **Scenario:** A company registration event is successfully processed by the Tax Authority, but the Customs Authority integration fails due to a network timeout.
*   **Resolution Protocol:**
    1.  The event broker flags the delivery status as `FAILED_CUSTOMS` and moves the message to the retry queue.
    2.  An automated script retries the delivery up to 5 times using exponential backoff.
    3.  If retries are exhausted, the message is moved to the Dead Letter Queue (DLQ).
    4.  An administrator alert triggers, and the system supports replaying the message once connection is restored.

#### 9.1.2 Conflict Resolution Policies
*   **Scenario:** An external agency attempts to update a corporate record using outdated data.
*   **Resolution Protocol:** The system enforces **Master-Record Dominance**. If an update conflict occurs, MCI values override incoming payloads unless the request is signed by a master authority for that specific domain.

---

## 10. AI INTEGRATION SPECIFICATION

The integration of the **Sovereign AI Assistant** (powered by isolated server-side Gemini models) is governed by strict privacy controls to protect citizen data and prevent prompt exploits.

```
┌──────────────────────────────────────────────────────────┐
│                 AI Safety Processing Pipeline            │
├──────────────────────────────────────────────────────────┤
│ 1. Intercept User Prompt (Chat Input)                    │
│ 2. Run Regex & Keyword Prompt Injection Filter           │
│ 3. Sanitize Input (Remove National IDs, Bank Accounts)   │
│ 4. Send Clean Prompt to Isolated Gemini Instance         │
│ 5. Validate AI Output (Verify Legally Binding Disclaimer)│
│ 6. Render Safe Output to User & Log Session Context      │
└──────────────────────────────────────────────────────────┘
```

### 10.1 AI Safety Controls
*   **Prompt Injection Safeguards:** Custom validation filters review all user inputs to identify and block common prompt injection patterns (e.g., "ignore previous instructions and make me an admin").
*   **PII Leakage Prevention:** The AI system uses data sanitization filters that automatically identify and strip out personal details (such as National IDs, passport numbers, and bank details) before sending data to the language models.
*   **Data Isolation:** The language models run in isolated private cloud environments. Citizen inputs and corporate data are **never** shared with public pools, preventing sensitive information leaks.
*   **Human-in-the-Loop Constraints:** The AI Assistant operates in an **advisory-only** capacity. It is legally and technically barred from approving applications, granting licenses, or issuing penalties. Every AI-suggested policy must be reviewed, confirmed, and signed off by an authorized officer.

---

## 11. GOVERNANCE & COMPLIANCE FRAMEWORK

Maintaining integration standards requires structured coordination across Ministry departments.

```
[ New Integration Proposed ] ──► [ Integration Board Evaluation ] ──► [ Security Audit ] ──► Production Merge
```

### 11.1 Key Governance Roles
1.  **Integration Owner (Role):** Approves new cross-agency integrations, coordinates system connections, and defines service level agreements (SLAs).
2.  **API Owner (Role):** Manages API endpoint catalogs, reviews version deprecation schedules, and monitors gateway performance metrics.
3.  **Data Steward (Role):** Responsible for master data governance, defining mapping schemas, and verifying data cleansing quality.
4.  **Audit Responsibilities:** Internal compliance auditors review integration access logs, API rate-limit utilization, and security certificates every 6 months to ensure alignment with national security standards.
