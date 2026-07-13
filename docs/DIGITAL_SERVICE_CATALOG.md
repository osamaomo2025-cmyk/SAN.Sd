# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### MASTER BLUEPRINT: ENTERPRISE DIGITAL SERVICE CATALOG (v1.0.0)

---

## 1. INTRODUCTION & SERVICE DESIGN PRINCIPLES
This catalog outlines the standard digital specifications for services managed by the Sudan Digital Ministry of Commerce & Industry (MCI). Every digital service is designed to be highly reliable, secure, and user-friendly, supporting the national digital transformation strategy.

### Service Design Principles:
*   **Digital by Default:** All services must be fully executable online without requiring physical office visits.
*   **AI-Assisted:** Services use AI server-side (Gemini) to check files and guide form completion, with final decisions left to authorized officers.
*   **Configurable Workflows:** Processing fees, approval routes, and SLAs are managed via dynamic configuration settings rather than being hardcoded into the system.
*   **Secure & Auditable:** All service actions are logged to ensure transparency and accountability.

---

## 2. SYSTEM USER ROLES & RESPONSIBILITIES

Services are executed through a collaborative workflow involving several key user roles:

```
[ Applicant / Rep ] ---> [ AI Guard validation ] ---> [ Case Reviewer ] ---> [ Supervisor / Director ]
                                                            |
                                                   [ Field Inspector ]
```

1.  **Applicant / Company Representative:** Submits registrations, uploads documents, makes payments, and responds to updates.
2.  **Reviewer (Case Officer):** Verifies submitted documents and validates business data against registry records.
3.  **Department Supervisor:** Reviews processed files and escalates complex registrations to directors.
4.  **Director (Approving Authority):** Grants final approvals and signs high-value licenses or concessions.
5.  **Field Inspector:** Performs site audits, logs compliance checks, and records environmental observations.
6.  **Finance Officer:** Reconciles government fees and processes refunds.
7.  **Platform Auditor:** Reviews system logs to ensure compliance and transparency.

---

## 3. CORE SERVICE CATEGORIES & PROCESS SPECS

---

### SERVICE CATEGORY 01: Commercial Registration (CR)

#### Service ID: CR-001 | Reserve Commercial Name
*   **Description:** Allows businesses to reserve a unique trade name prior to incorporation.
*   **Target Users:** Local entrepreneurs, international legal groups.
*   **Required Documents:** National ID or Passport of the main applicant.
*   **Processing Fee:** 5,000 SDG (Configurable).
*   **Processing SLA:** Instant (Automated verification) / 4 Hours max.
*   **Workflow:**
    1.  Applicant inputs the desired trade name.
    2.  The system checks the database for exact matches and trademark conflicts.
    3.  If no conflict is found, the name is reserved for 90 days.
*   **AI Assistance:** Provides alternative name suggestions if the requested name is already registered.

#### Service ID: CR-002 | New Commercial Registration (Private Limited Company)
*   **Description:** Incorporates new private limited liability businesses in Sudan.
*   **Required Documents:** Articles of association, copies of director IDs, and proof of capital deposit.
*   **Processing Fee:** 50,000 SDG.
*   **Processing SLA:** 24 to 48 Hours.
*   **Workflow:**
    1.  Applicant enters company information and selects a reserved trade name.
    2.  Uploads shareholder information and draft articles of association.
    3.  Caseworker verifies details and checks files.
    4.  Applicant pays fees through the payment gateway.
    5.  Registry Director signs the digital certificate.
*   **AI Assistance:** Analyzes uploaded articles of association to verify standard statutory clauses.

#### Service ID: CR-003 | Register Foreign Branch / Subsidiary
*   **Description:** Authorizes foreign multinational groups to open legal branch operations in Sudan.
*   **Required Documents:** Certified parent company articles, board resolution authorizing the branch, and bank credit history.
*   **Processing Fee:** $1,500 USD (Configurable).
*   **Processing SLA:** 5 Business Days.

---

### SERVICE CATEGORY 02: Industrial Licensing (IL)

#### Service ID: IL-001 | New Factory Operating Permit
*   **Description:** Authorizes manufacturing plants to construct and operate within national zones.
*   **Target Users:** Industrial developers, heavy manufacturing companies.
*   **Required Documents:** Land lease deed, environmental impact assessment, and factory safety plans.
*   **Processing Fee:** 150,000 SDG.
*   **Processing SLA:** 10 Business Days.
*   **Workflow:**
    1.  Developer submits factory coordinates, floor plans, and power requirements.
    2.  System notifies the Ministry of Environment and Ministry of Infrastructure.
    3.  Field inspector schedules an environmental audit.
    4.  Director approves the permit based on the compliance reports.
*   **AI Assistance:** Analyzes floor layouts to highlight potential safety or environmental concerns.

#### Service ID: IL-002 | Industrial Concession & Incentive Allocation
*   **Description:** Grants tax exemptions, land grants, or custom tariff holidays to major industrial plants.
*   **Required Documents:** Feasibility study, investment plan, and proof of capital allocation.
*   **Processing SLA:** 15 Business Days.

---

### SERVICE CATEGORY 03: Investment Services (IS)

#### Service ID: IS-001 | Global Investor Registration
*   **Description:** Onboarding portal for international groups to obtain an official investor identification card.
*   **Required Documents:** Notarized corporate documents, bank statements, and legal representative authorizations.
*   **Processing SLA:** 3 Business Days.
*   **Output:** Smart Digital Investor Identification Card with secure QR code verification.

#### Service ID: IS-002 | Industrial Zone Land Application
*   **Description:** Allows registered investors to lease industrial land within official national zones.
*   **Required Documents:** Feasibility study, architectural layout, and waste management plan.
*   **Processing SLA:** 14 Business Days.

---

### SERVICE CATEGORY 04: Import & Export (IE)

#### Service ID: IE-001 | Strategic Importer Registration
*   **Description:** Registers traders to import essential goods (such as fuel, medicine, and food grains).
*   **Required Documents:** Valid Commercial Register (CR) copy, tax card, and quality certification.
*   **Processing Fee:** 100,000 SDG.
*   **Processing SLA:** 3 Business Days.

#### Service ID: IE-002 | High-Grade Exporter Permit
*   **Description:** Registration for exporting premium resources (such as gold, livestock, and Gum Arabic).
*   **Required Documents:** Chamber of Commerce membership, customs registration, and trade specifications.
*   **Processing SLA:** 2 Business Days.

---

### SERVICE CATEGORY 05: Consumer Protection (CP)

#### Service ID: CP-001 | Submit Consumer Fraud Complaint
*   **Description:** Allows citizens to report commercial fraud, sub-standard products, or false advertising.
*   **Required Documents:** Purchase receipt, product photos, and business address.
*   **Processing Fee:** Free.
*   **Processing SLA:** 24 Hours for initial triage.
*   **Workflow:**
    1.  Citizen enters complaint details and uploads photos of the product and receipt.
    2.  System tags and categorizes the complaint based on location and merchant.
    3.  Assigned caseworker contacts the business for response or schedules a site inspection.
*   **AI Assistance:** Automatically groups similar complaints to help identify widespread fraud or price gouging.

---

### SERVICE CATEGORY 06: Inspection Services (IP)

#### Service ID: IP-001 | Field Inspection & Citation Logging
*   **Description:** Allows inspectors to conduct site visits, document compliance, and log violations.
*   **Workflow:**
    1.  The system schedules and assigns inspections based on outstanding complaints or routine cycles.
    2.  Inspector views assigned cases on their mobile device.
    3.  During the visit, the inspector logs observations and uploads photos.
    4.  If a violation is found, the system generates a citation ticket with a payment code.
*   **Audit Requirements:** Inspector GPS coordinates are automatically recorded during log submittal to ensure audit transparency.

---

### SERVICE CATEGORY 07: Digital Certificates (DC)

#### Service ID: DC-001 | Issue Certified Registry Extract (CR-Extract)
*   **Description:** Generates an official, digitally signed document showing a company's current registration status.
*   **Processing SLA:** Instant.
*   **Outputs:** Cryptographically signed PDF with a secure verification QR code.

---

### SERVICE CATEGORY 08: Payments (PM)

#### Service ID: PM-001 | Fee Collection & Reconciliation
*   **Description:** Consolidated portal for processing service fees, fines, and renewals.
*   **Integrated Gateways:** Designed to support major local card systems and mobile wallets.
*   **Workflow:**
    1.  The system generates a payment transaction code for approved services.
    2.  User completes payment through their preferred gateway.
    3.  A digital receipt is generated, and the service status updates to "fees paid" to resume processing.

---

### SERVICE CATEGORY 09: Appeals & Grievances (AP)

#### Service ID: AP-001 | Administrative Appeal Submission
*   **Description:** Allows applicants to appeal application rejections or regulatory citations.
*   **Processing SLA:** 10 Business Days.
*   **Workflow:**
    1.  Applicant enters the reference ID of the decision being appealed.
    2.  Submits a statement of grounds and any supporting documents.
    3.  An independent board reviews the file and issues a final decision.

---

### SERVICE CATEGORY 10: Public Information Services (PI)

#### Service ID: PI-001 | Public Registry Search & Verification
*   **Description:** Public portal for searching registered business names, status, and active licenses.
*   **Access Level:** Public (No login required).
*   **Response Time:** Sub-second.

---

## 4. DYNAMIC NOTIFICATION SYSTEM

The platform keeps users informed by sending automated updates through multiple communication channels at key stages of the service lifecycle:

```
[ Form Submission ] --------> SMS & Email: "Application #123 Received."
                                     |
[ Document Missing ] -------> Push Notification: "Clarification Needed."
                                     |
[ Approved & Signed ] ------> Email with Digital Certificate attached.
```

*   **Application Submission:** Confirms receipt and provides a tracking ID.
*   **Document Clarification:** Alerts the user if additional documents are needed.
*   **Status Updates:** Notifies the user of approvals, rejections, or scheduled inspections.
*   **Payment Due:** Sends payment codes and deadlines for processing.

---

## 5. ANALYTICS & MONITORING METRICS

To help maintain service quality, the system tracks key performance indicators for each digital service:

*   **SLA Compliance Rate:** Percentage of applications completed within the target timeframe.
*   **Average Processing Time:** Time elapsed from submission to final issuance.
*   **First-Time Pass Rate:** Percentage of applications approved without requiring additional clarifications.
*   **Revenue Collection:** Total processing fees collected, grouped by service type and payment method.
*   **User Satisfaction Score:** Feedback gathered from optional post-service ratings.
