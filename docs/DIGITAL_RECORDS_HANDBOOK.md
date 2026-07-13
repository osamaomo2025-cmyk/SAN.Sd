# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL GOVERNMENT DIGITAL DOCUMENTS & RECORDS HANDBOOK (v1.0.0)
#### Enterprise Document Generation, Records Management, Digital Signatures, and Archive Governance

---

## 1. ENTERPRISE DOCUMENT GENERATION ARCHITECTURE

This handbook establishes the authoritative **Enterprise Document Generation Architecture (EDGA)** and **Sovereign Records Management Framework** for the Sudan Digital Ministry of Commerce & Industry (MCI). This architecture is built to run on **Google Cloud Firestore**, **Google Cloud Storage**, **Firebase Cloud Functions**, and **Google Cloud Run**, ensuring serverless scalability, low latency, and high-performance throughput.

```
       [ Public Portal / Admin CRM ]
                     │
                     ▼ (API Request - JSON Payload)
        [ Cloud Functions API Gateway ]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼ (Read Template Schema)
  [ Cloud Firestore ]    [ Cloud Storage Templates Bucket ]
  - Document metadata    - Handlebars / HTML structure
  - Verification tokens  - Stylesheet & Assets (DIN Next)
         │                       │
         └───────────┬───────────┘
                     ▼ (Compile Payload & Assemble)
        [ Google Cloud Run PDF Engine ] (Headless Chromium / Weasyprint)
                     │
                     ├──────────────────────────────────────┐
                     ▼ (Write Document)                     ▼ (Generate QR)
        [ Cloud Storage Secure Bucket ]         [ Central Verification Index ]
        - /uploads                              - SHA-256 Document Hash
        - /generated                            - Verification URL Code
        - /archived
```

### 1.1 Storage Bucket Organizational Matrix
The storage strategy uses distinct, micro-segmented Google Cloud Storage buckets to isolate and protect active, generated, and archived materials:

*   **Intake Uploads Bucket (`mci-portal-uploads`):**
    *   *Path:* `gs://mci-portal-uploads/{tenantId}/{workflowId}/{userId}/{documentType}/`
    *   *Access:* Write-only for authenticated public portal users; read/write for verified caseworkers and background AI OCR routines.
    *   *Lifecycle:* Retention of temporary files for 30 days unless linked to a completed application.
*   **System Generated Certificates Bucket (`mci-generated-records`):**
    *   *Path:* `gs://mci-generated-records/{sector}/{dept}/{year}/{month}/{day}/{documentId}.pdf`
    *   *Access:* Read-only for authorized clients via cryptographically signed CDN URLs; read/write restricted to the backend Document Compiler.
    *   *Policy:* Encrypted in-transit using TLS 1.3 and at-rest using customer-managed encryption keys (CMEK) via Google Cloud KMS.
*   **Long-Term Archive Bucket (`mci-archived-records`):**
    *   *Path:* `gs://mci-archived-records/{retention_policy_id}/{year}/{documentId}.pdf`
    *   *Access:* Restricted to the Ministry Archive Custodian and judicial audit services.
    *   *Storage Class:* Cloud Storage Archive Class (cold storage) with Object Lifecycle Management configured to automate transitions and prevent premature deletion.

---

## 2. GOVERNMENT RECORDS MANAGEMENT FRAMEWORK

All regulatory records generated or managed by the MCI platform must adhere to the standardized records management taxonomy and row-level access control model.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           Ministry Records Access Clearance Matrix                          │
├─────────────────┬─────────────────┬───────────────────┬──────────────────┬──────────────────┤
│ Taxonomy Sector │ Series Code     │ Security Class    │ Role Permissions │ Retention Code   │
├─────────────────┼─────────────────┼───────────────────┼──────────────────┼──────────────────┤
│ Commercial Reg  │ SER-CR-CERT     │ RESTRICTED        │ Registrar, Owner │ RET-CR-01        │
│ Industrial Serv │ SER-IND-LICENSE │ RESTRICTED        │ Inspector, Owner │ RET-IL-01        │
│ Investment Serv │ SER-INV-AGREE   │ CONFIDENTIAL      │ Director, Board  │ RET-INV-01       │
│ Licensing Serv  │ SER-LIC-PERMIT  │ RESTRICTED        │ Analyst, Owner   │ RET-LIC-01       │
│ Consumer Prot   │ SER-CP-VIOL     │ INTERNAL          │ Inspector, Legal │ RET-CP-01        │
│ Inspections     │ SER-INS-REPT    │ INTERNAL          │ Inspector, Lead  │ RET-INS-01       │
│ Complaints      │ SER-CMP-CASE    │ RESTRICTED        │ Case Officer, Own│ RET-CMP-01       │
│ Administration  │ SER-ADM-DECREE  │ CONFIDENTIAL/INT  │ Minister, Staff  │ RET-ADM-01       │
└─────────────────┴─────────────────┴───────────────────┴──────────────────┴──────────────────┘
```

### 2.1 Detailed Record Taxonomy Dictionary

#### 2.1.1 Commercial Registry Documents
*   **Commercial Registration Certificate (`DOC-CR-CERT`):**
    *   *Business Purpose:* Issued to confirm the legal existence of a corporate entity within Sudan.
    *   *Applicable Workflow:* `WF-REG-COMPANY` (Incorporate Company).
    *   *Mandatory Fields:* Registration Number, Legal Form, Arabic/English Trade Name, Capital, Date of Incorporation, Registered Address, Director Names.
    *   *Classification Level:* RESTRICTED (Visible to company owners and registry staff).
    *   *Retention Period:* Permanent.
    *   *Verification Method:* Secure QR validation check.
*   **Trade Name Reservation Certificate (`DOC-CR-NAME`):**
    *   *Business Purpose:* Proves successful unique reservation of a commercial name for a 90-day period.
    *   *Applicable Workflow:* `WF-REG-NAME`.
    *   *Mandatory Fields:* Proposed Name (AR/EN), Reservation ID, Owner ID, Expiration Timestamp.
    *   *Classification Level:* RESTRICTED.
    *   *Retention Period:* 90 days active; then moved to archive for 1 year.

#### 2.1.2 Industrial Services Documents
*   **Industrial Operating Register (`DOC-IND-REGISTRY`):**
    *   *Business Purpose:* Confirms that an industrial factory meets mechanical, safety, and productivity standards.
    *   *Applicable Workflow:* `WF-IND-REGISTRY`.
    *   *Mandatory Fields:* ISIC Sector Code, Machine Capacity Index, Factory Location, Raw Material Class, Environmental Clearance Hash.
    *   *Classification Level:* INTERNAL.
    *   *Retention Period:* 10 Years from plant decommissioning.

#### 2.1.3 Investment Services Documents
*   **Investment Agreement & Incentives Decree (`DOC-INV-AGREE`):**
    *   *Business Purpose:* Legally binding state agreement allocating tax exemptions, land grants, and import/export privileges.
    *   *Applicable Workflow:* `WF-INV-CASE`.
    *   *Mandatory Fields:* Strategic Investment Identifier, Capital Commitments, Promised Exemptions list, Sovereign Signatures.
    *   *Classification Level:* CONFIDENTIAL (Minister and Board level clearance required).
    *   *Retention Period:* Permanent.

#### 2.1.4 Licensing Documents
*   **Commercial Business License (`DOC-LIC-PERMIT`):**
    *   *Business Purpose:* Grants authority to operate standard retail or service activities.
    *   *Applicable Workflow:* `WF-LIC-MANAGE`.
    *   *Mandatory Fields:* License ID, Owner ID, Business Activities List, Civil Defense Safety Clearance Hash, Expiry Date.
    *   *Classification Level:* RESTRICTED.
    *   *Retention Period:* 10 Years from expiration.

#### 2.1.5 Consumer Protection Documents
*   **Consumer Penalty Warning Notice (`DOC-CP-WARN`):**
    *   *Business Purpose:* Offical notice delivered to merchants found to have violated national price caps.
    *   *Applicable Workflow:* `WF-CON-ALERT`.
    *   *Mandatory Fields:* Violation Reference, Merchant CR, Reported Price, Limit Price, Penalty Fine, Appeal Window.
    *   *Classification Level:* INTERNAL.
    *   *Retention Period:* 5 Years.

#### 2.1.6 Inspection Documents
*   **On-Site Compliance Report (`DOC-INS-REPT`):**
    *   *Business Purpose:* Standardized digital audit sheet logging physical safety, hygiene, and worker licensing statuses.
    *   *Applicable Workflow:* `WF-INS-AUDIT`.
    *   *Mandatory Fields:* Inspector ID, GPS Match Coords, Time of Audit, Compliance Checklist Scores, Media File Hashes.
    *   *Classification Level:* INTERNAL.
    *   *Retention Period:* 5 Years.

#### 2.1.7 Complaints Documents
*   **Grievance Investigation File (`DOC-CMP-CASE`):**
    *   *Business Purpose:* Administrative record detailing merchant grievances against regulatory closures.
    *   *Applicable Workflow:* `WF-CMP-GRIEVANCE`.
    *   *Mandatory Fields:* Complainant Details, Action Challenged, Legal Brief, Investigator Recommendation.
    *   *Classification Level:* RESTRICTED.
    *   *Retention Period:* 10 Years.

#### 2.1.8 Administrative Documents
*   **Ministerial Decree & Policy Circular (`DOC-ADM-DECREE`):**
    *   *Business Purpose:* Legally binding executive policies issued by the Minister or Under-Secretary.
    *   *Applicable Workflow:* `WF-ADM-POLICY`.
    *   *Mandatory Fields:* Decree Number, Subject (AR/EN), Effective Date, Target Audiences, Legal Authority Reference.
    *   *Classification Level:* PUBLIC (when published).
    *   *Retention Period:* Permanent.

---

## 3. DOCUMENT TEMPLATE & BRANDING STANDARDS

All documents dynamically generated by the MCI platform must comply with the official visual layout and typography standards, preventing hardcoded text and layout styling within application files.

```
+───────────────────────────────────────────────────────────+
│                       OFFICIAL HEADER                     │
│  Republic of Sudan (Logo) Ministry of Commerce & Industry │
├───────────────────────────────────────────────────────────┤
│                                                           │
│                      DOCUMENT TITLE                       │
│                                                           │
│  (RTL Body in DIN Next Arabic / LTR Body in DIN Next)     │
│                                                           │
├───────────────────────────────────────────────────────────┤
│  Verification ID: MCI-7729-10A    [Secure QR barcode]    │
│  Digital Stamp: [CRYPT-HASH]      Dimensions: 120x120px   │
+───────────────────────────────────────────────────────────+
```

### 3.1 Design & Styling Rules
1.  **Typography & Font Selection:**
    *   *Arabic Content (RTL):* Must use **DIN Next Arabic** for both body text and displaying structural labels.
    *   *English Content (LTR):* Must use **DIN Next** for text.
    *   *Alignment:* Text blocks must automatically switch text-align property (`rtl` for Arabic, `ltr` for English) based on active metadata attributes.
2.  **Official Branding Elements:**
    *   *Header:* Top center includes the golden Republic of Sudan Eagle Emblem (vector format). Right header displays Arab Calligraphy of the Ministry; Left header displays the corresponding English text.
    *   *Footer:* Bottom left includes the official electronic stamp placeholder. Bottom center contains page indexing. Bottom right features the verification QR stamp.
    *   *Background Watermark:* Official certificates must overlay a semi-transparent, low-opacity (opacity: 0.03) vector shield centered on the PDF page canvas, preventing illicit photocopying.
3.  **Bilingual Dynamic Layout Schema:**
    Templates are maintained as isolated JSON templates specifying data-binding keys. No document content is hardcoded:

```json
{
  "templateId": "TPL-CR-CERTIFICATE",
  "name": "Commercial Registration Certificate",
  "version": "1.4.0",
  "styles": {
    "primaryFontAr": "DIN Next Arabic",
    "primaryFontEn": "DIN Next",
    "headerHeight": "140px",
    "watermarkOpacity": 0.03,
    "qrPosition": { "align": "right", "width": "120px" }
  },
  "layout": {
    "header": { "logoUrl": "https://assets.mci.gov.sd/branding/sudan_seal.svg" },
    "bodyAr": "تشهد وزارة التجارة والصناعة (مسجل الشركات التجاري) بأن الشركة: {companyName} قد تم تسجيلها رسمياً تحت الرقم {companyNumber} وتاريخ {issuanceDate}.",
    "bodyEn": "The Ministry of Commerce & Industry (Corporate Registrar) hereby certifies that company: {companyName} has been officially registered under Number {companyNumber} on {issuanceDate}."
  }
}
```

---

## 4. DIGITAL SIGNATURE READINESS SPECIFICATION

To ensure legally binding authenticity and prevent unauthorized modification of official certificates, the platform features a highly secure cryptographic signature pipeline.

```
┌──────────────────────────────────────────────────────────┐
│              Cryptographic Signing Pipeline              │
├──────────────────────────────────────────────────────────┤
│ 1. Canonicalize PDF Metadata + Document Hash             │
│ 2. Fetch Department Signer Key (KMS HSM-backed Key)     │
│ 3. Sign Hash via RSA-4096 / PSS Padding                  │
│ 4. Embed Cryptographic Signature Block into PDF Metadata │
│ 5. Lock Document Structure (Mark PDF as Read-Only)      │
└──────────────────────────────────────────────────────────┘
```

### 4.1 Digital Signature Pipeline
1.  **Organizational Certificates (KMS HSM):** Signing keys are stored in Hardware Security Modules (HSMs) managed via Google Cloud KMS. Keys are tied to specific administrative roles (e.g., `role-corporate-registrar-general`), rather than individual personal accounts.
2.  **Dual-Signature Process:** For high-value transactions (such as major strategic investment exemptions), the document remains marked as `APPROVED_OFFICER` until both the Legal Evaluator and the Board Director sign the document. The system compiles these distinct signatures into a unified PDF metadata envelope.
3.  **Timestamp Authority Integration:** Every applied digital signature incorporates a cryptographically verified timestamp retrieved from an authorized external Time Stamping Authority (TSA), preventing retro-signing or tampering with expiration dates.
4.  **Revocation and Validation Protocol:** The backend validates signatures on load using Online Certificate Status Protocol (OCSP) queries. If a signing key is revoked, the system flags affected documents as `SUSPENDED_VERIFICATION` in the public registry.

---

## 5. DOCUMENT VERIFICATION & QR VALIDATION FRAMEWORK

The platform features a public document verification system, allowing third parties (such as banks, customs, and courts) to instantly verify the authenticity of any printed or digital certificate.

```
    [ Scan QR Code on Certificate ]
                  │
                  ▼
   [ Redirect: verify.mci.gov.sd?id=TKN-18239A&hash=2f30...]
                  │
                  ▼
    [ Cloud Function API Handler ]
                  │
         ┌────────┴────────┐
         ▼                 ▼
   [ Database Match? ] ──► NO  ──► [ Display Alert: "INVALID CERTIFICATE" ]
         │ (YES)
         ▼
   [ Verify SHA-256 File Hash Matches Storage Snapshot? ]
         │
         ├──► NO  ──► [ Display Alert: "DOCUMENT TAMPERED" ]
         │
         └──► YES ──► [ Display Details: Company Active, Licensed, Valid ]
```

### 5.1 Verification Mechanisms
1.  **Online Verification Portal:** Scans of the embedded QR code trigger a secure redirect to the official MCI portal: `https://verify.mci.gov.sd/validate?id={token}&hash={sha256}`. The validation backend verifies the transaction token against Firestore data, ensuring the document is active and has not been revoked.
2.  **Database Integrity Verification:** On access, the validation engine fetches the target PDF file from Cloud Storage, computes its SHA-256 hash, and compares it with the cryptographically signed hash stored in Firestore. If the hashes do not match, the system flags the document as tampered.
3.  **Offline Verification Mode:** For secure field operations with limited network connectivity, the QR code contains an encrypted PDF417 format barcode. This barcode encodes a signed JSON payload containing the company name, ID, and validity dates, allowing inspectors to verify credentials offline using a cryptographically validated public key on their mobile devices.

---

## 6. RECORDS LIFECYCLE & ARCHIVE GOVERNANCE GUIDE

To manage storage efficiency, ensure legal compliance, and protect historical archives, the platform implements strict lifecycle policies.

```
[ Active Hot DB ] ──► (15 Years) ──► [ Cold Archive Vault ] ──► (Permanent) ──► National Archives
```

### 6.1 Record Retention Protocols
1.  **Active Storage Phase (Hot Tier):** Active certificates, licenses, and core company documents are stored in Standard Cloud Storage buckets for real-time access.
2.  **Cold Archive Migration:** Once a license expires or a company is dissolved, the system waits for the scheduled retention period (e.g., 10 years for operating licenses). Once this period ends, the file is automatically moved to Cloud Storage Coldline or Archive storage, reducing storage costs by up to 90%.
3.  **Legal Holds and Preservation Orders:** If a company becomes involved in a legal dispute, bankruptcy proceedings, or an active investigation, authorized Legal Officers can apply a `LEGAL_HOLD` flag to the record. This hold overrides standard retention limits, preventing the document from being archived or destroyed until the dispute is resolved.
4.  **Secure Disposal Workflow:** When a record's retention period expires and no legal holds are active, the system flags the file for destruction. The file is not deleted automatically; instead, the **Archive Custodian** must review and sign off on the disposal list. Once approved, the system permanently deletes the file from Cloud Storage, overwrites the metadata reference in Firestore, and records the destruction event in the audit logs.

---

## 7. AI-ASSISTED DOCUMENT PROCESSING FRAMEWORK

The platform integrates secure, server-side **Gemini models** (via the modern `@google/genai` SDK) to automate document intake, metadata tagging, and compliance checking.

```
┌──────────────────────────────────────────────────────────┐
│              AI Document Processing Pipeline             │
├──────────────────────────────────────────────────────────┤
│ 1. Citizen uploads Articles of Association PDF           │
│ 2. Run Gemini: Extract Shareholders, Capital, Objectives │
│ 3. Check for matching terms in Restricted Categories     │
│ 4. Flag PII (National ID, Phone numbers) for redaction   │
│ 5. Caseworker reviews and approves extracted metadata    │
└──────────────────────────────────────────────────────────┘
```

### 7.1 Key AI Assisted Functions
*   **Intelligent Metadata Tagging:** On upload, the AI scans the document to extract key attributes (such as company names, registration dates, capital, and shareholder lists) and automatically populates the metadata fields.
*   **Compliance Anomaly Audits:** The AI analyzes uploaded corporate charters against standard Ministry templates, flagging missing clauses or unauthorized modifications (e.g., restricted business activities) for caseworker review.
*   **Automated PII Redaction:** To comply with privacy standards, the AI scans public-facing documents to identify and suggest redactions for personally identifiable information (PII), such as national IDs, phone numbers, and bank account details.
*   **Advisory Status Safeguards:** AI recommendations are presented exclusively as advisory widgets within the administrative panel. The AI is structurally blocked from editing states, updating data, or granting approvals directly.

---

## 8. COMPLIANCE & RETENTION STANDARDS

The records management engine is built to comply with existing and future Sudanese Electronic Transactions Laws and National Archival Regulations, ensuring all digital records are legally binding and defensible.

```
┌──────────────────────────────────────────────────────────┐
│              Sovereign Legal Alignment Matrix            │
├─────────────────┬────────────────────────────────────────┤
│ Statute         │ System Compliance Implementation       │
├─────────────────┼────────────────────────────────────────┤
│ Electronic      │ Non-repudiation using RSA-4096 and    │
│ Transactions Act│ certified digital signatures.          │
├─────────────────┼────────────────────────────────────────┤
│ Corporate Law   │ Immutable version history of articles  │
│ (Registration)  │ and amendments.                        │
├─────────────────┼────────────────────────────────────────┤
│ Archival Act    │ Standardized retention schedules with  │
│ (Sovereign)     │ dual-signature disposal review.        │
└─────────────────┴────────────────────────────────────────┘
```

### 8.1 Key Legal Standards
1.  **Cryptographic Proof of Authenticity:** Every finalized certificate is hashed using SHA-256 and stored in an immutable, append-only ledger in Firestore, providing proof of authenticity that is legally admissible in court.
2.  **Audit Trail Completeness:** The system records every action taken on a document (who uploaded it, who reviewed it, who approved it), with each transition cryptographically signed and timestamped to maintain an unbroken chain of custody.
3.  **Linguistic Parity:** All public-facing documents, verification certificates, and metadata schemas maintain complete parity between Arabic and English, ensuring equal administrative access across languages.

---

## 9. DOCUMENT ANALYTICS & MONITORING DASHBOARD

The platform features a real-time analytics dashboard to monitor document generation volumes, verification requests, and storage health.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      MCI Records & Storage Dashboard                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [ Active Documents: 142,819 ]        [ Storage Capacity: 1.4 Terabytes ]│
│  [ Verification Requests: 4,119/day ] [ Retention Compliance: 100% ]     │
│                                                                         │
│  Storage Growth Tracker:                                                │
│  Standard Tier:  [ |||||||||||||||||||| 85% ]                           │
│  Archive Tier:   [ |||||||||||||||||||| 15% ]                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Key Operational Metrics
*   **Document Issuance Velocity:** Track the daily volume of certificates and licenses issued by sector and department.
*   **Verification Request Logs:** Monitor QR code verification volumes and locations to identify potential duplicate or fraudulent certificates.
*   **Storage Growth Projections:** Track the growth of standard and cold storage tiers, helping to optimize storage costs and capacity planning.
*   **SLA and Retention Tracking:** Flag records approaching their scheduled archive or disposal dates, triggering review notifications for records officers.

---

## 10. NATIONAL GOVERNMENT DIGITAL RECORDS HANDBOOK

### 10.1 Executive Manual Summary
The Enterprise Document Generation and Records Management Framework establishes a secure, modern, and legally binding digital records ecosystem for the Republic of Sudan Ministry of Commerce & Industry. By combining automated PDF generation, cryptographically secure digital signatures, QR-based public verification, and cost-effective cold archiving, the platform ensures complete regulatory compliance and administrative efficiency. 

All future system development, cross-ministerial integrations, and policy changes must comply with the guidelines, taxonomies, and design standards defined in this handbook to preserve the integrity and security of the nation's digital records.
