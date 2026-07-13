# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL GOVERNMENT API MANAGEMENT HANDBOOK: ENTERPRISE API GATEWAY, INTEROPERABILITY CATALOG, & API GOVERNANCE (v1.0.0)

---

## 1. DESIGN PHILOSOPHY & SOVEREIGN API MANDATE

This handbook defines the authoritative **Enterprise API Gateway Architecture (EAGA)**, **National Government API Catalog**, and **API Governance Standards** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national **"Sovereign Information Security, Interoperability, & Digital Infrastructure Act"**, this specification establishes a modern, secure, and loosely coupled API ecosystem.

Our architectural philosophy is **API-First, Secure-by-Design, Stateless, and Observable**. Under digital sovereignty guidelines:
*   Direct, raw database access for external systems is **strictly prohibited**.
*   All business capabilities must be exposed via well-defined, version-controlled, and audited APIs.
*   The architecture is optimized for execution within the **Google Cloud Platform** ecosystem, leveraging **Cloud API Gateway**, **Cloud Run**, **Firebase Functions**, and **Firebase Authentication**.
*   All APIs must natively support bilingual data payloads (Arabic and English) without duplicating routing or controllers.

```
+───────────────────────────────────────────────────────────────────────────────────────────+
|                                    Zero Trust API Gateway                                 |
├───────────────────────────────┬───────────────────────────────────┬───────────────────────┤
│    Continuous Authn/Authz     │      Dynamic Rate Limiting        │     Symmetric mTLS    │
│  - Firebase JWT Verification  │  - Leaky bucket traffic policing  │  - Cryptographic keys │
│  - Dynamic ABAC/RBAC rules    │  - Quotas per consumer tier       │  - Inter-agency trust │
└───────────────────────────────┴───────────────────────────────────┴───────────────────────┘
```

---

## 2. ENTERPRISE API GATEWAY ARCHITECTURE

To protect internal systems and provide a unified entry point, the Ministry implements a multi-layer API Gateway topology utilizing **Google Cloud API Gateway** paired with **Cloud Armor** and **Cloud KMS**.

```
[ Public Consumers / Mobile Apps / Partner Agencies ]
                         │
                         ▼ (HTTPS / TLS 1.3 / mTLS)
                 [ Google Cloud DNS ]
                         │
                         ▼
          [ Google Cloud Load Balancer (GCLB) ]
                         │
                ├────────┴────────┤
                ▼                 ▼
          [ Cloud Armor ]  [ Cloud CDN ] (Caching)
         (WAF, DDoS, IPS)         │
                │                 │
                └────────┬────────┘
                         │
                         ▼
             [ Google Cloud API Gateway ]
          - Enforces OAuth2 / JWT Auth
          - Dynamic Rate Limiting & Quotas
          - Route Translation & CORS Policy
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   [ Cloud Run ]  [ Cloud Run ]  [ Firebase Functions ]
    (Core APIs)   (Partner Sync)  (Event Triggers)
```

### 2.1 API Gateway Core Capabilities
1.  **Request Routing & Decoupling:** Maps external public routes to decoupled backend microservices running on Cloud Run or Firebase Functions.
2.  **Zero-Trust Authentication Enforcement:** Validates Firebase Auth JWT signatures directly at the edge layer. Requests with invalid, expired, or forged tokens are instantly blocked before hitting backend microservices.
3.  **Bilingual Header Parsing:** Automatically extracts, normalizes, and propagates localized language headers (e.g., `Accept-Language: ar-SD`) to ensure backend responses are localized correctly.
4.  **Mutual TLS (mTLS) Termination:** Terminates mutual TLS connections for trusted government-to-government (G2G) networks, verifying client certificates against the National Certificate Authority.

---

## 3. NATIONAL GOVERNMENT API CATALOG

---

### 3.1 Core Platform APIs

#### 3.1.1 API Code: `API-CORE-AUTH` (Identity Authentication)
*   **Domain:** Identity & Access Management.
*   **Business Purpose:** Authenticate user login credentials, issue secure JWT tokens, and coordinate Multi-Factor Authentication (MFA).
*   **Resource:** `/v1/auth`
*   **Supported Operations:**
    *   `POST /v1/auth/login` - Verify password and return a temporary authorization ticket.
    *   `POST /v1/auth/mfa/verify` - Validate SMS/TOTP token and return signed session JWT.
    *   `POST /v1/auth/session/revoke` - Invalidate current session and clear server-side cache.
*   **Validation Requirements:** Emails must conform to RFC 5322; OTPs must be 6-digit numeric strings; password parameters must meet complexity standards (minimum 12 characters, mixing casing and special characters).
*   **Authentication & Authorization:** Public-access for login; active JWT for revocation.
*   **Rate Limit Category:** Tight (`Rate-Limit-Category: auth`).
*   **Audit Requirement:** Log IP, user-agent, username, and success/failure flag to the audit trail immediately.
*   **Error Handling Strategy:** Throw obscure `401 Unauthorized` for credential failures to prevent account enumeration.

#### 3.1.2 API Code: `API-CORE-USER` (User Management)
*   **Domain:** Identity & Access Management.
*   **Business Purpose:** Manage user profiles, update contact credentials, and track verified associations with registered companies.
*   **Resource:** `/v1/users`
*   **Supported Operations:**
    *   `GET /v1/users/me` - Retrieve authenticated user's profile and associations.
    *   `PUT /v1/users/me` - Update profile phone, physical address, and language preferences.
    *   `POST /v1/users/me/verify-nin` - Initiate national ID lookup and verification workflow.
*   **Validation Requirements:** NIN parameters must contain exactly 11 digits and pass structural Luhn-algorithm validation.
*   **Authentication & Authorization:** Requires valid Firebase JWT. Update operations require ownership bounds check.
*   **Rate Limit Category:** Standard (`Rate-Limit-Category: transactional`).
*   **Audit Requirement:** Changes to profile fields are written as differences (`diff`) to the audit log.
*   **Error Handling Strategy:** Return `409 Conflict` if the NIN is already associated with another active profile.

#### 3.1.3 API Code: `API-CORE-CONFIG` (Global Configuration)
*   **Domain:** Platform Utilities.
*   **Business Purpose:** Distribute economic classifications (ISIC), federal state matrices, licensing fee indexes, and public holiday logs.
*   **Resource:** `/v1/config`
*   **Supported Operations:**
    *   `GET /v1/config/isic-codes` - Retrieve ISIC Rev.4 classifications.
    *   `GET /v1/config/fee-schedules` - Retrieve active fee calculation tables.
    *   `GET /v1/config/states` - Retrieve list of the 18 federal states.
*   **Validation Requirements:** None (read-only endpoints).
*   **Authentication & Authorization:** Publicly accessible. No authorization tokens required.
*   **Rate Limit Category:** Loose (`Rate-Limit-Category: utility`). Exposes high CDN cache TTLs (24 hours).
*   **Audit Requirement:** None.
*   **Error Handling Strategy:** Standard HTTP status codes.

#### 3.1.4 API Code: `API-CORE-SEARCH` (Unified Directory Search)
*   **Domain:** Platform Directory.
*   **Business Purpose:** Provide high-speed prefix and exact matching across public trade names and active company registries.
*   **Resource:** `/v1/search`
*   **Supported Operations:**
    *   `GET /v1/search/companies` - Search active incorporated companies with filtering.
    *   `GET /v1/search/names/verify` - Check availability of proposed commercial names.
*   **Validation Requirements:** Search string length must be greater than or equal to 3 characters.
*   **Authentication & Authorization:** Publicly accessible.
*   **Rate Limit Category:** Loose for directory; Standard for name availability checks.
*   **Audit Requirement:** None for general searches; log name checks to prevent front-running.
*   **Error Handling Strategy:** Returns empty results with `200 OK` if no matches are found; no exceptions thrown.

#### 3.1.5 API Code: `API-CORE-WORKFLOW` (Casework Routing Engine)
*   **Domain:** Business Process Management.
*   **Business Purpose:** Direct, track, assign, and update states of registry, licensing, and complaint cases.
*   **Resource:** `/v1/workflows`
*   **Supported Operations:**
    *   `GET /v1/workflows/tasks` - Retrieve current task queue for logged caseworker.
    *   `POST /v1/workflows/tasks/{id}/claim` - Assign a task instance to active caseworker profile.
    *   `POST /v1/workflows/tasks/{id}/transition` - Process a state machine step (e.g., transition from `under_review` to `approved`).
*   **Validation Requirements:** State transition targets must exist inside the workflow definition map.
*   **Authentication & Authorization:** Requires administrative JWT claim (`is_caseworker: true` or `is_officer: true`).
*   **Rate Limit Category:** Tight (`Rate-Limit-Category: admin`).
*   **Audit Requirement:** Log transitions, caseworker ID, duration metrics, and reasons to the operational database.
*   **Error Handling Strategy:** Throw `422 Unprocessable Entity` if transition violates state-machine validation rules.

---

### 3.2 Commercial Registry APIs

#### 3.2.1 API Code: `API-REG-COMPANY` (Corporate Incorporation)
*   **Domain:** Commercial Registry.
*   **Business Purpose:** Process corporate registration filings, shareholder distributions, capital amendments, and dissolution requests.
*   **Resource:** `/v1/companies`
*   **Supported Operations:**
    *   `POST /v1/companies` - Submit a new company registration application.
    *   `GET /v1/companies/{id}` - Retrieve details of a registered company.
    *   `PUT /v1/companies/{id}/shareholders` - Modify shareholder lists and equity structures.
    *   `POST /v1/companies/{id}/suspend` - Apply administrative hold/freeze flag to company.
*   **Validation Requirements:** Initial capital must exceed the legal form threshold. Total shareholder percentages must equal exactly 100%.
*   **Authentication & Authorization:** Requires authenticated user. Write actions require authorized company representative roles or Commercial Registry Officer roles.
*   **Rate Limit Category:** Standard.
*   **Audit Requirement:** High-level audit log recording the complete state differences of the corporate structure.
*   **Error Handling Strategy:** Return `400 Bad Request` if local shareholder constraints for specialized legal forms are violated.

#### 3.2.2 API Code: `API-REG-NAME` (Trade Name Reservation)
*   **Domain:** Commercial Registry.
*   **Business Purpose:** Reserve commercial names, validate name constraints, and manage reservation holding lifecycles.
*   **Resource:** `/v1/commercial-names`
*   **Supported Operations:**
    *   `POST /v1/commercial-names/reserve` - Reserve verified trade name for a registered user.
    *   `GET /v1/commercial-names/{id}` - Retrieve active reservation ticket status.
    *   `DELETE /v1/commercial-names/{id}` - Cancel an active name reservation.
*   **Validation Requirements:** Reserved names must not contain restricted terms or punctuation marks.
*   **Authentication & Authorization:** Authenticated citizen or corporate representative.
*   **Rate Limit Category:** Tight (prevents name-squatting attempts).
*   **Audit Requirement:** Log reservation events with IP, timestamp, and user identifier.
*   **Error Handling Strategy:** Return `409 Conflict` if the requested name is phonetically or structurally identical to an existing company name.

---

### 3.3 Industrial Services APIs

#### 3.3.1 API Code: `API-IND-FACTORY` (Industrial Registry)
*   **Domain:** Industrial Services.
*   **Business Purpose:** Manage industrial factory registrations, raw material catalogs, and daily output logs.
*   **Resource:** `/v1/factories`
*   **Supported Operations:**
    *   `POST /v1/factories` - Submit factory registration and classification profile.
    *   `GET /v1/factories/{id}` - Retrieve industrial plant characteristics.
    *   `PUT /v1/factories/{id}/capacity` - Update machinery limits and production outputs.
*   **Validation Requirements:** GPS coordinate attributes must contain valid latitude and longitude numbers inside the geographic boundaries of Sudan.
*   **Authentication & Authorization:** Requires authenticated investor or Industrial Department representative.
*   **Rate Limit Category:** Standard.
*   **Audit Requirement:** Log structural capacity updates.
*   **Error Handling Strategy:** Standard HTTP status codes.

---

### 3.4 Investment Services APIs

#### 3.4.1 API Code: `API-INV-CASE` (Strategic Investment Capital)
*   **Domain:** Investment Services.
*   **Business Purpose:** Manage strategic foreign/domestic investment cases, tax exemptions, and capital clearing records.
*   **Resource:** `/v1/investments`
*   **Supported Operations:**
    *   `POST /v1/investments` - Register a strategic investment case.
    *   `GET /v1/investments/{id}/incentives` - Retrieve approved tax and customs waivers.
    *   `POST /v1/investments/{id}/verify-capital` - Push central bank capital clearance receipt.
*   **Validation Requirements:** Investment volume must be greater than 0; currency must correspond to ISO 4217 currency list.
*   **Authentication & Authorization:** Verified Investor or Investment Authority representative.
*   **Rate Limit Category:** Standard.
*   **Audit Requirement:** Log capital verification events, bank clearance hashes, and incentive approvals.
*   **Error Handling Strategy:** Throw `403 Forbidden` if verification fails central bank security checks.

---

### 3.5 Licensing APIs

#### 3.5.1 API Code: `API-LIC-PERMIT` (Operating Permits)
*   **Domain:** Licensing.
*   **Business Purpose:** Issue operating permits, coordinate cross-agency clearances, and manage expiration lifecycles.
*   **Resource:** `/v1/licenses`
*   **Supported Operations:**
    *   `POST /v1/licenses` - Submit business operating license application.
    *   `GET /v1/licenses/{id}` - Read license specifications and validity indicators.
    *   `POST /v1/licenses/{id}/renew` - Process renewal application with payment receipt.
*   **Validation Requirements:** Expiration dates must follow legal guidelines.
*   **Authentication & Authorization:** Requires authenticated user. Issuance requires caseworker role clearance.
*   **Rate Limit Category:** Standard.
*   **Audit Requirement:** Full audit logging on issuance, cancellation, or extension events.
*   **Error Handling Strategy:** Return `422 Unprocessable Entity` if the corresponding inspection safety audit report has expired or failed.

---

### 3.6 Consumer Protection APIs

#### 3.6.1 API Code: `API-CON-PRICES` (Price Control & Fraud Reports)
*   **Domain:** Consumer Protection.
*   **Business Purpose:** Maintain official price limit lists, register citizen price violation complaints, and dispatch product recalls.
*   **Resource:** `/v1/consumer`
*   **Supported Operations:**
    *   `GET /v1/consumer/prices` - Fetch public price index for critical commodities.
    *   `POST /v1/consumer/complaints` - Register price violation or fraud complaint.
    *   `POST /v1/consumer/recalls` - Issue product recall notice (restricted to Director-tier).
*   **Validation Requirements:** Complainant phone number must pass Sudanese telephone formatting verification (`+249xxxxxxxxx`).
*   **Authentication & Authorization:** Public-access for price lookup and complaint registration; Director-tier for recall alerts.
*   **Rate Limit Category:** Loose for price indexes; Standard for complaints.
*   **Audit Requirement:** Log recall notice publications, capturing authorizer details and reasoning.
*   **Error Handling Strategy:** Standard HTTP status codes.

---

### 3.7 Inspection APIs

#### 3.7.1 API Code: `API-INS-AUDIT` (Site Inspections)
*   **Domain:** Inspections.
*   **Business Purpose:** Manage inspector schedules, record compliance checklists, and file formal warning notices.
*   **Resource:** `/v1/inspections`
*   **Supported Operations:**
    *   `GET /v1/inspections` - Read scheduled inspections queue.
    *   `POST /v1/inspections/{id}/checklist` - Upload completed compliance results.
    *   `POST /v1/inspections/{id}/violation` - File safety violation notice.
*   **Validation Requirements:** Audit submission must include verified inspector GPS coordinates.
*   **Authentication & Authorization:** Requires active inspector or administrative manager credentials.
*   **Rate Limit Category:** Standard.
*   **Audit Requirement:** Log audit findings and violation tickets.
*   **Error Handling Strategy:** Return `400 Bad Request` if GPS coordinates mismatch target site by > 100 meters.

---

### 3.8 Complaint APIs

#### 3.8.1 API Code: `API-CMP-GRIEVANCE` (Corporate Grievances)
*   **Domain:** Complaints.
*   **Business Purpose:** Process citizen complaints and track appeal case timelines.
*   **Resource:** `/v1/complaints`
*   **Supported Operations:**
    *   `POST /v1/complaints` - File a corporate dispute or consumer grievance.
    *   `GET /v1/complaints/{id}` - Read case status and investigator updates.
    *   `POST /v1/complaints/{id}/resolve` - File legal resolution notice.
*   **Validation Requirements:** Text payload must not exceed 4000 characters.
*   **Authentication & Authorization:** Authenticated citizen or corporate representative.
*   **Rate Limit Category:** Standard.
*   **Audit Requirement:** Track investigation logs and access events.
*   **Error Handling Strategy:** Standard HTTP status codes.

---

### 3.9 Payment APIs

#### 3.9.1 API Code: `API-PAY-CLEARING` (Electronic Payments)
*   **Domain:** Payment Services.
*   **Business Purpose:** Connect to the Electronic Banking Switch (EBS) to process payment invoices, manage refunds, and track revenue metrics.
*   **Resource:** `/v1/payments`
*   **Supported Operations:**
    *   `POST /v1/payments/invoice` - Generate an official fee invoice.
    *   `POST /v1/payments/verify` - Confirm payment clearance with EBS gateway.
    *   `POST /v1/payments/refund` - Process fee refund (requires Director sign-off).
*   **Validation Requirements:** Invoice amounts must be rounded to exactly two decimal places.
*   **Authentication & Authorization:** Requires authenticated user. Refunds restricted to Finance Director-tier.
*   **Rate Limit Category:** Standard.
*   **Audit Requirement:** Immutable, transaction-level logging for all invoice generations, clearance receipts, and refund events.
*   **Error Handling Strategy:** Return `402 Payment Required` if payment switch verification fails.

---

### 3.10 Document APIs

#### 3.10.1 API Code: `API-DOC-EXCHANGE` (Official Document Storage)
*   **Domain:** Document Management.
*   **Business Purpose:** Manage official document uploads, antivirus scans, and generate temporary secure download links.
*   **Resource:** `/v1/documents`
*   **Supported Operations:**
    *   `POST /v1/documents/upload` - Request upload slot and register file metadata.
    *   `GET /v1/documents/{id}/download` - Generate secure signed URL for download.
    *   `DELETE /v1/documents/{id}` - Delete file reference (triggers lifecycle policy).
*   **Validation Requirements:** Mime-type must match approved list (e.g., `application/pdf`, `image/jpeg`).
*   **Authentication & Authorization:** Authenticated user with permission to access document.
*   **Rate Limit Category:** Standard.
*   **Audit Requirement:** Log upload, download, and delete events, capturing file hashes and user details.
*   **Error Handling Strategy:** Throw `403 Forbidden` if signed URL generation is requested by an unauthorized profile.

---

### 3.11 AI APIs

#### 3.11.1 API Code: `API-AI-ADVISORY` (Sovereign AI Assistant)
*   **Domain:** AI Services.
*   **Business Purpose:** Provide interactive guidance, summarize corporate files, and match business activities to ISIC codes.
*   **Resource:** `/v1/ai`
*   **Supported Operations:**
    *   `POST /v1/ai/chat` - Dispatch user prompt to isolated Gemini model.
    *   `POST /v1/ai/summarize` - Request summarization of public corporate records.
    *   `POST /v1/ai/classify` - Map natural language descriptions to ISIC classifications.
*   **Validation Requirements:** Prompt payload must be pre-scanned and stripped of raw national identifiers or bank routing numbers.
*   **Authentication & Authorization:** Requires active authenticated user profile.
*   **Rate Limit Category:** Tight (`Rate-Limit-Category: ai`).
*   **Audit Requirement:** Store all chat prompts, session tokens, and output hashes in the AI audit database.
*   **Error Handling Strategy:** Throw `400 Bad Request` if the prompt fails safety or injection verification checks.

---

## 4. API DESIGN & GOVERNANCE STANDARDS

To maintain professional, high-quality, and scalable interfaces, all development teams must adhere to the following design directives.

```
          [ Standard API Query Design Layout ]
          
  GET /v1/companies?status=active&state=khartoum&sort=-registration_date&limit=15
    │               │                             │                     │
    │               ▼ Filters                     ▼ Sort order          ▼ Limit (Pagination)
    ▼ Base Resource URL
```

### 4.1 Resource Naming & URI Standards
1.  **Strict Spinal-Case:** URI paths must utilize lower-case nouns, styled with spinal-case for multi-word paths (e.g., `/v1/industrial-licenses`).
2.  **Collection-to-Document Pathing:** Follow hierarchical structures: `/v1/{collection}/{document-id}/{sub-collection}/{sub-document-id}`.
3.  **Bilingual Header Protocol:**
    *   `Accept-Language: ar-SD` - Content and descriptions are returned in Arabic.
    *   `Accept-Language: en-US` - Content and descriptions are returned in English.

### 4.2 Standard HTTP Methods & Status Codes
*   `GET` - Retrieve resources. Returns `200 OK` (or `404 Not Found`).
*   `POST` - Create new resources. Returns `21 Created` with a `Location` header pointing to the new resource.
*   `PUT` - Replace or modify existing resources. Returns `200 OK`.
*   `DELETE` - Remove resources. Returns `204 No Content`.

### 4.3 Pagination, Sorting, and Filtering Standards
1.  **No Offset-Pagination:** High-volume endpoints must utilize cursor-based pagination parameters (`limit`, `starting_after`).
2.  **Stable Sorting Syntax:** Applied via query parameters: `?sort=-registration_date,name_ar`. A negative prefix indicates descending order.
3.  **Strict Filtering Boundaries:** Only verified, indexed fields can be passed as query filters. Unindexed filter combinations are blocked at the API gateway layer to prevent Firestore performance issues.

---

## 5. SECURITY & RATE LIMITING FRAMEWORK

The API platform implements a multi-level security framework to prevent abuse, protect data privacy, and maintain high availability.

```
[ Incoming Request ] ──► [ WAF IP Blocking ] ──► [ Token Validation (JWT/mTLS) ] ──► [ Rate-Limiting Check ] ──► [ Execute API ]
```

### 5.1 Security Standards
1.  **Cryptographic Handshake Enforcement:** All connections must enforce TLS 1.3 with modern cipher suites. Standard HTTP traffic is blocked and redirected to HTTPS.
2.  **mTLS for G2G Integrations:** Government-to-government integrations must terminate with Mutual TLS (mTLS) to verify client-side certificates signed by the National Certificate Authority.
3.  **HMAC Webhook Signatures:** Webhooks sent to external partners (such as banks or tax systems) must include an `X-MCI-Signature` header containing a SHA-256 HMAC hash of the payload, generated with a shared secret key.
4.  **Replay Attack Defenses:** State-changing requests must include an `Idempotency-Key` (UUIDv4) and a timestamp header. Gateway rules reject requests with duplicate keys or timestamps offset by more than 5 minutes.

### 5.2 Dynamic Rate Limiting Policies

```
┌──────────────────────────────────────────────────────────┐
│              API Rate Limiting Configurations            │
├───────────────────┬──────────────────┬───────────────────┤
│ Category Tier     │ Limit / Minute   │ Limit / Hour      │
├───────────────────┼──────────────────┼───────────────────┤
│ Public / Citizen  │ 60 Requests      │ 1,000 Requests    │
│ G2G Integrations  │ 10,000 Requests  │ 100,000 Requests  │
│ AI Assistant      │ 5 Requests       │ 50 Requests       │
│ Authentication    │ 5 Requests       │ 30 Requests       │
└───────────────────┴──────────────────┴───────────────────┘
```

1.  **Public/Citizen Tier:** Geared toward standard web portal users. Enforces up to 60 requests/minute per IP address.
2.  **Government Integrations (G2G):** High-throughput, mTLS-validated lanes. Allocated up to 10,000 requests/minute, backed by monthly consumption budgets.
3.  **Sovereign AI Assistant Tier:** Reflects high backend model execution costs. Restricted to 5 requests/minute and 50 requests/hour per active user profile.
4.  **Authentication Rate Limit:** To block brute-force attempts, login and password endpoints are throttled to 5 attempts/minute per IP, locking matching IPs for 30 minutes if exceeded.

---

## 6. API VERSIONING & LIFECYCLE GUIDE

To support system evolution without breaking active integrations, MCI implements a strict API lifecycle governance framework.

```
  [ ACTIVE / GENERAL AVAILABILITY ]
  - Exposed via stable paths (e.g., /v1/companies)
  - Full support and bug-fixes
                 │
                 ▼ (New version launched with breaking changes)
         [ DEPRECATED STAGE ]
         - Header injection: "X-API-Deprecated: true"
         - Sunset window: 12 Months
                 │
                 ▼ (Sunset window expires)
            [ DEACTIVATED / SUNSET ]
            - Endpoint deactivated
            - Returns HTTP 410 Gone with redirect guidance
```

### 6.1 Breaking Changes & Lifecycle Policies
1.  **Version Numbering:** API versions are defined inside the base URI path as a major number (e.g., `/v1/`, `/v2/`). Minor and patch updates are deployed transparently to the same major route if they maintain backward compatibility.
2.  **Definition of Breaking Changes:** A change is classified as breaking if it:
    *   Removes, renames, or changes the data type of an existing field in a response payload.
    *   Adds a new required parameter to an existing request template.
    *   Changes returned HTTP status codes for existing error or success states.
3.  **Sunset Period:** Deprecated endpoints are supported for exactly **12 months** from the date ofdeprecation notification. During this window, response payloads are injected with warning headers:
    *   `Warning: 299 - "API version deprecated. Sunset scheduled for 2027-07-12"`
4.  **Permanent Deactivation:** Once the sunset window expires, the endpoint is deactivated and returns an HTTP status of `410 Gone` along with redirect headers pointing to the active major version.

---

## 7. OBSERVABILITY, MONITORING, & LOGGING SPECIFICATION

The API Gateway collects and streams structural telemetry data to maintain system health and detect operational issues early.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    API Gateway Health Observability Hub                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [ Gateway Availability: 99.99% ]      [ Mean Response Time: 42ms ]     │
│  [ Active Consumers: 1,424 ]           [ P99 Processing Time: 148ms ]   │
│                                                                         │
│  Security Firewall Status:   [ ACTIVE / SECURE ]                        │
│  Failed Auth Checks:         [ 0.02% - NORMAL ]                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Core Performance KPIs:
*   **Mean Latency:** Target < 50ms at the gateway edge layer; < 150ms for P99 database transactions.
*   **Error Rate Percentage:** Tracked as HTTP 5xx codes (Target < 0.05% of total traffic).
*   **Security Auth Mismatch Rate:** Tracked as HTTP 401/403 codes; alarms trigger if rate exceeds 1% of total traffic.
*   **Correlation ID Logging:** Every incoming request receives a unique `X-Correlation-ID` header (UUIDv4) at the gateway layer, passed through all downstream microservices and logged in transaction history entries.

---

## 8. AI API GOVERNANCE SPECIFICATION

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

## 9. API DOCUMENTATION STANDARDS

To maintain clear and accessible developer pathways, the Ministry platform mandates standardized documentation formats for all exposed endpoints.

1.  **OpenAPI 3.1 Compliance:** Every service domain must maintain an up-to-date OpenAPI 3.1 YAML schema detailing exact request/response payload examples, parameter formats, status codes, and security requirements.
2.  **SDK Readyness Directive:** API schemas must define precise `operationId` parameters to support automated SDK generation tools.
3.  **Developer Portal Sandbox:** All documented APIs are registered in an internal developer portal sandbox, allowing verified partner developers to test endpoint integrations in a non-destructive staging environment.

---

## 10. GOVERNANCE & COMPLIANCE FRAMEWORK

Maintaining API standards and secure system integrations requires structured coordination across Ministry departments.

```
[ New Endpoint Proposed ] ──► [ API Review Board Evaluation ] ──► [ Security Audit ] ──► Deployment Merge
```

### 10.1 Key Governance Roles
1.  **API Owner (Role):** Manages the API endpoint catalogs, reviews version deprecation schedules, and monitors gateway performance metrics.
2.  **Domain Owner (Role):** Coordinates domain-specific data structures and validates business rules within their bounded service context.
3.  **Security Reviewer (Role):** Reviews API authentication policies, audits rate-limiting parameters, and conducts penetration tests on newly proposed interfaces.
4.  **Audit Responsibilities:** Independent compliance auditors review API gateway access logs, webhook signature rotations, and security certificates every 6 months to ensure alignment with national security standards.
