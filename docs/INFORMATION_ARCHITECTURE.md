# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### MASTER BLUEPRINT: ENTERPRISE INFORMATION ARCHITECTURE (v1.0.0)

---

## 1. EXECUTIVE SUMMARY & DESIGN PHILOSOPHY
This document establishes the official **Enterprise Information Architecture (EIA)** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national "Sudan 2035 Digital Sovereignty Directive," this architecture is engineered to guide developers, database administrators, service designers, and AI agents for the next 20 years.

### Architectural Core Principles:
*   **Citizen & Investor First:** Zero-friction information pathways designed for rapid discovery, reducing administrative bottlenecks.
*   **National Sovereignty & Trust:** Single-source-of-truth publishing with immutable logs and digital certificates.
*   **AI-Ready Core:** Structured semantic metadata tagging on all regulations, decisions, and catalog entries, enabling the Sovereign AI Assistant (Gemini) to securely parse and summarize legal materials.
*   **High-Contrast & Dual-Language Standards:** Consistent Arabic (RTL, DIN Next Arabic) and English (LTR, DIN Next) structure, fully accessible (WCAG 2.2 AA compliant).
*   **Zero Duplication:** Every service, document template, and policy is indexed exactly once to ensure complete consistency.

---

## 2. MINISTRY DIGITAL ECOSYSTEM MAP
The MCI Digital Ecosystem is a distributed, multi-tenant network of integrated portals serving different public, business, and administrative interests.

```
                  +--------------------------------------------------+
                  |              Unified Gateway Portal              |
                  |                (mci.gov.sd/portal)               |
                  +------------------------+-------------------------+
                                           |
       +-----------------------------------+-----------------------------------+
       |                                   |                                   |
+------v------+                     +------v------+                     +------v------+
| Citizen &   |                     | Government  |                     |  Internal   |
| Investor    |                     |   Employee  |                     |  Executive  |
| Frontends   |                     |    Portal   |                     |  Dashboard  |
+------+------+                     +------+------+                     +------+------+
       |                                   |                                   |
       +-----------------+-----------------+-----------------+-----------------+
                         |                                   |
                  +------v------+                     +------v------+
                  |   Sovereign |                     | AI Semantic |
                  |  Data Lake  |                     |   Engine    |
                  | (Firestore) |                     |  (Gemini)   |
                  +-------------+                     +-------------+
```

1.  **Public Website (G2C):** Public legal notices, statistics, news center, knowledge base, and official ministerial circulars.
2.  **Investor Portal (G2B):** Workspace for local and foreign entities to register businesses, apply for industrial concessions, and coordinate export licenses.
3.  **Commercial Registry (G2B/G2G):** The federal corporate database housing active registrations, name reservations, and partnerships.
4.  **Industrial Registry (G2B/G2G):** Heavy industry permits, ecological clearance codes, and factory performance indexes.
5.  **Consumer Protection Portal (G2C/G2B):** Complaint reporting for price gouging, commercial fraud, and defective product recalls.
6.  **Inspection & Enforcement Platform (G2E):** Internal tooling for field inspectors to schedule site visits, issue citations, and log photographic evidence.
7.  **Employee Workspace (G2E):** Core administration workspace where caseworkers validate registries and approve licensing applications.
8.  **Executive Command Center (G2G):** Real-time business intelligence dashboards showing trade volume, FDI flows, and processing SLAs.

---

## 3. FULL SITE MAP HIERARCHY (LEVELS 1–5)

To ensure clear discoverability, the site map enforces a rigorous 5-level directory taxonomy. Every page, document, and route belongs to exactly one parent category.

### LEVEL 1: Unified Sovereign Root (`/`)
*   **LEVEL 2: Public Trade Gateway (`/portal`)**
    *   **LEVEL 3: Service Discovery Catalog (`/portal/services`)**
        *   **LEVEL 4: Corporate Entity Registration (`/portal/services/register`)**
            *   **LEVEL 5: Reserve Commercial Name Form (`/portal/services/register/reserve-name`)**
            *   **LEVEL 5: Individual Business Setup (`/portal/services/register/individual`)**
            *   **LEVEL 5: Partnership Registration Wizard (`/portal/services/register/partnership`)**
            *   **LEVEL 5: Limited Liability Company Wizard (`/portal/services/register/llc`)**
            *   **LEVEL 5: Public Shareholding Registry (`/portal/services/register/public-joint`)**
            *   **LEVEL 5: Foreign Subsidiary Setup (`/portal/services/register/foreign-branch`)**
        *   **LEVEL 4: Industrial Concessions (`/portal/services/industrial`)**
            *   **LEVEL 5: New Factory Permit (`/portal/services/industrial/new-permit`)**
            *   **LEVEL 5: Environmental Compliance Certificate (`/portal/services/industrial/ecological`)**
            *   **LEVEL 5: Production Line Expansion Concession (`/portal/services/industrial/expansion`)**
        *   **LEVEL 4: Global Trade Licensing (`/portal/services/trade`)**
            *   **LEVEL 5: Strategic Import Permit (`/portal/services/trade/import`)**
            *   **LEVEL 5: High-Grade Export Permit (`/portal/services/trade/export`)**
            *   **LEVEL 5: Restricted Goods Authorization (`/portal/services/trade/restricted`)**
    *   **LEVEL 3: Sudan Knowledge Center (`/portal/knowledge`)**
        *   **LEVEL 4: Commercial & Trade Laws (`/portal/knowledge/commercial-law`)**
            *   **LEVEL 5: Corporate Act of 2017 (`/portal/knowledge/commercial-law/2017-act`)**
            *   **LEVEL 5: National Trade Arbitration Rules (`/portal/knowledge/commercial-law/arbitration`)**
        *   **LEVEL 4: Industrial Codes & Policies (`/portal/knowledge/industrial-policy`)**
            *   **LEVEL 5: Environmental Standards (`/portal/knowledge/industrial-policy/ecology-code`)**
            *   **LEVEL 5: Industrial Concession Regulations (`/portal/knowledge/industrial-policy/concessions`)**
        *   **LEVEL 4: Ministerial Circulars & Decrees (`/portal/knowledge/decrees`)**
            *   **LEVEL 5: Trade Tariff Updates (`/portal/knowledge/decrees/tariffs-2026`)**
            *   **LEVEL 5: Strategic Food Reserve Rules (`/portal/knowledge/decrees/food-reserves`)**
    *   **LEVEL 3: Consumer Protection Hub (`/portal/consumer`)**
        *   **LEVEL 4: Report Incident (`/portal/consumer/report`)**
            *   **LEVEL 5: Submit Commercial Fraud Complaint (`/portal/consumer/report/fraud`)**
            *   **LEVEL 5: Report Illegal Price Gouging (`/portal/consumer/report/price-gouging`)**
            *   **LEVEL 5: Product Defect Alert (`/portal/consumer/report/defect`)**
        *   **LEVEL 4: National Recall Index (`/portal/consumer/recalls`)**
            *   **LEVEL 5: Safe Food & Drug Recalls (`/portal/consumer/recalls/food-safety`)**
            *   **LEVEL 5: Industrial Goods Recalls (`/portal/consumer/recalls/industrial`)**
    *   **LEVEL 3: Media & News Center (`/portal/media`)**
        *   **LEVEL 4: Press Releases (`/portal/media/releases`)**
        *   **LEVEL 4: Public Awareness Infographics (`/portal/media/awareness`)**
        *   **LEVEL 4: Open Trade Datasets (`/portal/media/statistics`)**

*   **LEVEL 2: Secure Investor Workspace (`/investor`)** *(Auth Protected)*
    *   **LEVEL 3: Unified Dashboard (`/investor/dashboard`)**
        *   **LEVEL 4: Active Entities Console (`/investor/dashboard/entities`)**
        *   **LEVEL 4: Interactive Fee Wallet (`/investor/dashboard/payments`)**
        *   **LEVEL 4: Document Verification Vault (`/investor/dashboard/vault`)**
            *   **LEVEL 5: Digital Certificates Wallet (`/investor/dashboard/vault/certificates`)**
            *   **LEVEL 5: Upload Tax Identification Cards (`/investor/dashboard/vault/tax-cards`)**

*   **LEVEL 2: Civil Service Employee Portal (`/employee`)** *(Auth + VPN Protected)*
    *   **LEVEL 3: Central Operations Console (`/employee/dashboard`)**
        *   **LEVEL 4: Case Management Board (`/employee/dashboard/cases`)**
            *   **LEVEL 5: Registries Approval Board (`/employee/dashboard/cases/registries`)**
            *   **LEVEL 5: Licensing Approvals Board (`/employee/dashboard/cases/licensing`)**
        *   **LEVEL 4: Inspection & Field Assignments (`/employee/dashboard/inspections`)**
            *   **LEVEL 5: Schedule Environmental Audit (`/employee/dashboard/inspections/schedule`)**
            *   **LEVEL 5: Field Violation Logging (`/employee/dashboard/inspections/violations`)**

*   **LEVEL 2: Executive Command Center (`/executive`)** *(Auth + Multi-Factor)*
    *   **LEVEL 3: National Economic BI (`/executive/dashboard`)**
        *   **LEVEL 4: Trade Deficit & Volume Metrics (`/executive/dashboard/trade`)**
        *   **LEVEL 4: Foreign Direct Investment BI (`/executive/dashboard/fdi`)**
        *   **LEVEL 4: Ministry Casework Performance KPIs (`/executive/dashboard/slas`)**

---

## 4. MAIN NAVIGATION ARCHITECTURE

Our Navigation Model avoids complex nested menus in favor of a clean, persistent visual layout that shifts dynamically depending on the user's role.

### Public Global Navigation (RTL/LTR Compatible)
```
+--------------------------------------------------------------------------------------------------+
| [MCI sovereign Logo]   Services | Companies | Industry | Investment | News | Statistics | Support  | [Login] |
+--------------------------------------------------------------------------------------------------+
```
1.  **Services Catalog:** Searchable list of all commercial, industrial, and consumer services.
2.  **Companies Registry:** Public directory for company license checks and brand protection verification.
3.  **Industrial Concessions:** Overview of industrial parks, tax cuts, and manufacturing incentives.
4.  **Investment Opportunities:** Guided FDI onboarding, raw material maps, and land leasing listings.
5.  **Media Center:** Legislative announcements, ministerial press releases, and circular archives.
6.  **Sovereign Data Center:** Interactive statistics showing registered capitals, agricultural trades, and industrial outputs.
7.  **Support Hub:** FAQ center, appeal submission gateway, and 24/7 Sovereign AI Chat Assistant.

---

## 5. USER GROUP ROLES & DASHBOARDS MATRIX

The digital ecosystem serves diverse audiences. Access and layout are strictly controlled through Role-Based Access Control (RBAC).

| User Group | Core Responsibility | Dashboard Viewport | Read Permissions | Write Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen (Public)** | Consumer reporting, entity verification. | `/portal/consumer` | Public registry, laws, circulars, recalls. | Fraud complaints, name reservation. |
| **Foreign Investor** | Capital allocation, plant construction. | `/investor/dashboard` | FDI guidelines, tax codes, land zones. | New company registry, license requests. |
| **Ministry Case Officer** | CAS verification, application audits. | `/employee/dashboard` | Assigned caseloads, public records. | Casework approvals, status transitions. |
| **Field Inspector** | Environmental compliance, price audits. | `/employee/inspections` | Factory specs, previous violations, maps. | Field logs, photographic evidence, tickets. |
| **Ministry Executive** | High-level trade policymaking. | `/executive/dashboard` | National KPIs, SLA tables, FDI projections. | None (Analytical layer). |
| **System Admin** | System config, platform audit logs. | `/admin/portal` | Complete system telemetry, audit logs. | App check bypass keys, metadata models. |

---

## 6. SERVICE TAXONOMY & CLASSIFICATION

Ministry activities are split into four clear operational divisions. Every digital form maps to one of these taxonomies:

```
                  +----------------------------------------------+
                  |              Ministry Taxonomies             |
                  +----------------------+-----------------------+
                                         |
       +-------------------+-------------+-------------+-------------------+
       |                   |                           |                   |
+------v------+     +------v------+             +------v------+     +------v------+
| Commercial  |     | Industrial  |             | Import &    |     |   Consumer  |
| Registries  |     |  Licensing  |             |   Export    |     |  Protection |
+-------------+     +-------------+             +-------------+     +-------------+
```

### 1. Commercial Registration Services (CR)
*   *Commercial Registry Entry (CR-01):* Incorporates legal corporations, partnerships, and sole traders.
*   *Commercial Name Allocation (CR-02):* Real-time reservation of brand names, checking against the national trademark database.
*   *Company Amendment Service (CR-03):* Relocation, capital changes, board restructures, and business mergers.

### 2. Industrial Licensing Services (IL)
*   *New Plant Industrial Clearance (IL-01):* Issued to heavy machinery factories, ensuring zone compliance.
*   *Industrial Concession Allocation (IL-02):* Application for government land, tax exemptions, and import tariff holidays.
*   *Environmental Compliance Clearance (IL-03):* Joint approval with the Ministry of Environment for chemical, waste, and energy plants.

### 3. Import & Export Licensing (IE)
*   *Strategic Importer License (IE-01):* Licensing for essential medicine, fuel, and crop imports.
*   *Strategic Exporter License (IE-02):* Licensing for gold, cotton, livestock, and Gum Arabic exports.
*   *Customs Interoperability Ticket (IE-03):* Direct API exchange of trading licenses to Sudanese Customs.

### 4. Consumer Protection & Fair Trade (CP)
*   *Fraud Complaint Submission (CP-01):* Citizen reports of fake brands, adulterated goods, or expired foods.
*   *Anti-Monopoly & Price Gouging Report (CP-02):* Secure submittal of local cartel activities and price manipulations.
*   *Commercial Arbitration Appeal (CP-03):* Mediation gateway between consumers, merchants, and the legal department.

---

## 7. CONTENT STRATEGY & LIFECYCLE

To maintain absolute reliability, all platform content follows a strict lifecycle governance workflow, ensuring zero outdated text remains active.

```
+---------------+     +--------------------+     +-------------------+     +------------------+
| Draft Created | --> | Legal/Policy Audit | --> | Executive Approve | --> | Public Publish   |
|   (Author)    |     |    (Validator)     |     |    (Publisher)    |     | (Active/Indexed) |
+---------------+     +--------------------+     +-------------------+     +------------------+
                                                                                    |
                                                                                    v
+---------------+     +--------------------+                               +------------------+
| Permanent Del | <-- | Archive/ReadOnly   | <---------------------------- | Expiration Date  |
| (Admin-Only)  |     |  (Auditable Copy)  |                               |  (1-Year Review) |
+---------------+     +--------------------+                               +------------------+
```

1.  **Drafting (Caseworkers / Legal Experts):** Documents, news posts, or regulatory changes are prepared inside the workspace.
2.  **Validator Audit:** Automated checks (spelling, cross-links) and manual legal review.
3.  **Executive Sign-Off:** Final publication permission granted by department directors.
4.  **Sovereign Indexing:** Content is published online, and its metadata is tagged for search and AI.
5.  **Annual Review Trigger:** Content expires or enters review after 12 months to prevent stale information.
6.  **Auditable Archiving:** Retired policies are stored in a read-only historical archive for reference, never deleted.

---

## 8. UNIFIED AI-READY SEARCH ARCHITECTURE

The platform implements a unified search engine that accommodates diverse search patterns, from traditional keyword queries to smart semantic AI search.

```
User Query ---> [ Search Dispatcher Router ]
                     |
                     +---> Keyword Search Parser ---> DB Index Match ---> Results
                     |
                     +---> AI Semantic NLP Engine ---> Vector DB Embed ---> AI Summary Result
```

### Search Features:
*   **Vector Search & Semantic Understanding:** Uses the Gemini Embedding models server-side, allowing users to search using natural phrases (e.g., *"كيف أسجل مصنع نسيج"* / *"how do I register a cotton mill"*).
*   **Real-time Filters:** Refine by Document Type (laws, decisions), Date, Department, and Service status.
*   **Federal Entity Verification Search:** A high-speed registry lookup enabling any citizen to verify a business's legal standing via its CR number or QR code.

---

## 9. STEP-BY-STEP USER JOURNEY MAPS

### Journey 1: Local Entrepreneur (Registering a Private Limited Company)
*   **Goal:** Establish a legal corporate entity with active tax records within 48 hours.
*   **Preconditions:** Active National ID, minimum capital of 100,000 SDG.
*   **Required Documents:** Draft articles of incorporation, founder passports.
*   **Steps:**
    1.  **Discovery:** Entrepreneur uses `/portal/services` to check registration requirements.
    2.  **Name Reservation:** Submits the desired trade name.
    3.  **Form Completion:** Submits the digital articles of association, shareholder names, and addresses.
    4.  **Payment:** Pays the registration fees using the integrated e-payment gateway.
    5.  **Review:** Caseworker verifies the details.
    6.  **Issuance:** System generates the signed Digital CR Certificate with an official QR code.

### Journey 2: Caseworker (Reviewing a Foreign Investment Application)
*   **Goal:** Verify, audit, and approve heavy manufacturing plant proposals.
*   **Steps:**
    1.  **Notification:** Receives an alert of a pending factory application.
    2.  **Verification:** Validates the investor's credentials and bank guarantees.
    3.  **Coordination:** Forwards the environmental proposal to the Ministry of Environment.
    4.  **Audit Log:** Logs details of any policy validations performed.
    5.  **Approval:** Grants approval, which triggers the generation of the official Industrial License.

---

## 10. FUTURE GOVERNMENT SYSTEM INTEGRATIONS

To establish a comprehensive national commerce platform, the EIA is designed with secure API endpoints to integrate with external state services:

```
              +---------------------------------------------+
              | Sudan Digital Ministry Commerce & Industry  |
              +----------------------+----------------------+
                                     |
    +-----------------+--------------+--------------+-----------------+
    |                 |                             |                 |
+---v----+       +----v---+                    +----v---+        +----v---+
| Customs|       | Taxes  |                    | Ports  |        | Central|
| (API)  |       |  (API) |                    |  (API) |        |  Bank  |
+--------+       +--------+                    +--------+        +--------+
```

1.  **Sudanese Customs (Direct API Interconnect):** Real-time verification of importer/exporter licenses at sea and air ports.
2.  **Federal Tax Authority:** Automatic generation of tax identification cards for newly registered businesses.
3.  **Central Bank of Sudan:** Instant corporate bank account verification and capital clearance audits.
4.  **National Civil Registry (National ID System):** Verification of citizen identities using official national ID records.
5.  **Sudanese Ports Authority:** Export clearance verification for strategic agricultural goods.
6.  **Unified National Payment Switch:** Supports seamless processing of fees and tariffs via major national electronic payment systems.
