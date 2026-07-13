# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL GOVERNMENT COMPLIANCE & POLICY GOVERNANCE HANDBOOK (v1.0.0)
#### Enterprise Compliance Management, Legal Governance, Regulatory Frameworks, Policy Management, and Responsible AI Compliance

---

## 1. ENTERPRISE COMPLIANCE MANAGEMENT ARCHITECTURE

This handbook establishes the authoritative **Enterprise Compliance Management Architecture (ECMA)**, **Sovereign Legal Governance Framework**, and **Policy Management System** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under national digital modernization laws and international governance standards, this architecture provides a configurable, policy-driven foundation that translates statutory law into executable system boundaries without hardcoding logic.

The compliance platform is architected to utilize **Google Cloud Firestore** as its highly flexible metadata store, ensuring that regulatory requirements, legal obligations, and business rules remain decoupled from operational code.

```
          [ Sudanese National Legislation / Ministerial Decrees ]
                                     │
                                     ▼
                     [ Compliance & Policy Registry ]
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
  [ Legal Obligations Register ]                       [ Configurable Rules Engine ]
  - Statute mapping & clauses                          - Schema parameters
  - Policy metadata & revisions                        - Status validation logic
         │                                                       │
         └───────────────────────────┬───────────────────────────┘
                                     ▼
                       [ Core Processing Pipelines ]
                       - Preventive & Detective Controls
                       - Dual-Signature Approvals
                                     │
                                     ▼
                       [ Audit & Evidence Registry ]
                       - Immutable activity logs
                       - Authenticated PDF exports (CMEK)
```

### 1.1 Architectural Foundations
*   **Decoupled Policy Logic:** To ensure administrative flexibility, all statutory requirements, price limits, renewal grace periods, and licensing rules are managed in dynamic schema collections rather than application code. 
*   **Traceability Mapping:** Every operational transaction, workflow transition, and system-generated document maintains an unbroken reference trail tracing directly back to its authorizing statutory clause.
*   **Bilingual Delivery Engine:** The compliance platform utilizes the **DIN Next Arabic** font for Arabic (RTL) administrative panels and the **DIN Next** font for English (LTR) portals, ensuring high-contrast, accessible, and legally authoritative bilingual presentation.

---

## 2. REGULATORY GOVERNANCE FRAMEWORK

The platform integrates multi-sector regulatory oversight into a single digital core, translating federal guidelines into automated system controls.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           Ministry Regulatory Governance Domains                         │
├─────────────────┬───────────────────┬───────────────────┬───────────────────────────────┤
│ Domain          │ Authorized Unit   │ Primary Statute   │ Automated System Control      │
├─────────────────┼───────────────────┼───────────────────┼───────────────────────────────┤
│ Commercial Reg  │ Registrar General │ Companies Act     │ Minimum capital checks, name  │
│                 │                   │                   │ availability validations.     │
├─────────────────┼───────────────────┼───────────────────┼───────────────────────────────┤
│ Industrial Serv │ Industrial Dir    │ Industrial        │ Capacity allocations, safety  │
│                 │                   │ Development Act   │ inspection clearances.        │
├─────────────────┼───────────────────┼───────────────────┼───────────────────────────────┤
│ Investment Serv │ Invest Commission │ Investment        │ Exemption triggers, tax       │
│                 │                   │ Encouragement Act │ privilege validation.         │
├─────────────────┼───────────────────┼───────────────────┼───────────────────────────────┤
│ Licensing Serv  │ Licensing Board   │ Commercial        │ Local authority validation,   │
│                 │                   │ Licensing Law     │ civil defense clearances.     │
├─────────────────┼───────────────────┼───────────────────┼───────────────────────────────┤
│ Consumer Prot   │ Consumer Board    │ Consumer          │ Regional price cap alerts,    │
│                 │                   │ Protection Law    │ violation ticketing limits.   │
├─────────────────┼───────────────────┼───────────────────┼───────────────────────────────┤
│ Inspections     │ Chief Inspector   │ Auditing &        │ GPS-stamped photo logs,       │
│                 │                   │ Public Health Act │ audit questionnaire lists.    │
└─────────────────┴───────────────────┴───────────────────┴───────────────────────────────┘
```

### 2.2 Core Domain Specifications

#### 2.2.1 Commercial Registry Regulations
*   *Application:* Governs corporate formation, name reservation, partner structures, and dissolution filings.
*   *System Controls:* Automatic validation of partner national IDs against the civil registry, capital checks based on company type (e.g., LLC vs. public shareholding), and automated reservation periods (90-day locks).

#### 2.2.2 Industrial Services Regulations
*   *Application:* Regulates manufacturing plant approvals, raw material imports, and safety compliance.
*   *System Controls:* Checks on ISIC codes, verification of environmental impact approvals, and automated machinery capacity validation before operating certificates are issued.

#### 2.2.3 Strategic Investment Regulations
*   *Application:* Manages tax exemptions, free-zone land grants, and foreign capital transfers.
*   *System Controls:* Direct integration of investment project approvals into custom and revenue registries, with multi-stage approval gates required to activate Strategic Project privileges.

#### 2.2.4 Administrative Services Regulations
*   *Application:* Governs internal delegation of authority, official correspondences, ethics standards, and conflicts of interest.
*   *System Controls:* Automated routing paths based on organizational hierarchy, with electronic signatures validated against role delegation matrices.

---

## 3. LEGAL OBLIGATIONS & POLICY MANAGEMENT SYSTEM

The Ministry’s policies, decrees, and compliance registers are managed within a structured, versioned digital document management system.

```
 [ Draft Policy ] ──► [ Legal Advisory Review ] ──► [ Ministerial Approval ] ──► [ Publish & Deploy ]
```

### 3.1 Logical Data Schemas (Firestore Concepts)

#### 3.1.1 Policy Registry Schema (`/policies`)
Tracks the metadata, status, version history, and authorizing legislation for all administrative policies.
```json
{
  "policyId": "POL-REG-LLC-CAPITAL",
  "titleAr": "تعديل الحد الأدنى لرأس مال الشركات ذات المسؤولية المحدودة",
  "titleEn": "Amendment of Minimum Share Capital for Limited Liability Companies",
  "effectiveDate": "2026-08-01T00:00:00Z",
  "expiryDate": null,
  "status": "PUBLISHED",
  "version": "2.1.0",
  "authorizingLegislation": "Sudan Companies Act 2015, Article 44(2)",
  "applicableWorkflows": ["WF-REG-COMPANY"],
  "rules": {
    "minimumCapitalSdg": 5000000,
    "minimumPartnersCount": 2,
    "maximumPartnersCount": 30
  }
}
```

#### 3.1.2 Legal Obligations Mapping Schema (`/legal_obligations`)
Maintains the centralized legal obligation register, mapping statutes to specific platform controls.
```json
{
  "obligationId": "OB-CP-PRICE-GOUGE",
  "statute": "Sudan Consumer Protection Act, Section 12",
  "descriptionAr": "حظر فرض أسعار تتجاوز الحد الأقصى المعلن للسلع الأساسية",
  "descriptionEn": "Prohibition of pricing exceeding the declared maximum limit for essential commodities",
  "primaryOwner": "Director of Consumer Protection",
  "complianceCategory": "MARKET_INTEGRITY",
  "linkedControlIds": ["CTRL-CP-WARN", "CTRL-CP-FINE"],
  "auditEvidenceRequired": "Inspector field report, photo of store price tags, and GPS coordinates."
}
```

### 3.2 Policy Lifecycle and Review Workflow
1.  **Drafting:** Policy Managers draft policies in Arabic and English, linking them to underlying legislation in the Legal Obligations database.
2.  **Legal Review Gate:** The Legal Affairs Director reviews the policy draft to ensure consistency with existing federal laws, signing off on the policy's regulatory compatibility.
3.  **Ministerial Approval Gate:** High-impact policies are routed to the Minister or Undersecretary for final authorization using cryptographic digital signatures.
4.  **Active Deployment:** Once approved, the system updates active business rules in the registry, automatically enforcing new parameters (e.g., updating minimum capital limits or price ceilings) across affected application workflows.

---

## 4. BUSINESS RULE GOVERNANCE FRAMEWORK

To prevent hardcoded rules from complicating future system updates, the platform implements a centralized **Configurable Rules Repository**.

```
    [ Operational Workflow ] ──► ( Fetch Rule Params: /policies/POL-REG-LLC-CAPITAL )
                                                   │
                                                   ▼
                     [ Rule Engine: Validate Input Capital >= SDG 5,000,000 ]
                                                   │
                        ┌──────────────────────────┴──────────────────────────┐
                        ▼ (Valid)                                             ▼ (Invalid)
                 [ Continue Process ]                             [ Halt & Return Error Ar/En ]
```

### 4.1 Business Rule Management Rules
*   **Code Independence:** No business rules, fee structures, registration thresholds, or inspection criteria may be hardcoded. Developers must retrieve parameters dynamically from the rules database on transaction execution.
*   **Rule Versioning and Integrity:** Every business rule is assigned a unique version number (e.g., `v1.2.0`). When a rule is updated, active transactions continue to use the previous version until they are completed, preventing system-wide state issues.
*   **Test and Rollback Procedures:** Prior to activation, new business rules must undergo regression testing in UAT sandboxes. If errors or system issues are detected after deployment, administrators can instantly roll back to the prior stable rule version.

---

## 5. INTERNAL CONTROLS & AUDIT READINESS MANUAL

The platform features automated controls and logging structures to prevent fraud, ensure transparency, and simplify audit reviews.

```
┌──────────────────────────────────────────────────────────┐
│              Sovereign System Audit Controls             │
├─────────────────┬────────────────────────────────────────┤
│ Control Type    │ Platform Execution Method              │
├─────────────────┼────────────────────────────────────────┤
│ Preventive      │ Restricts critical data access based   │
│ Controls        │ on role permissions (IAM).             │
├─────────────────┼────────────────────────────────────────┤
│ Detective       │ Continuously audits change logs and    │
│ Controls        │ flags suspicious data patterns.        │
├─────────────────┼────────────────────────────────────────┤
│ Corrective      │ Automates rollbacks and initiates      │
│ Controls        │ security alerts on unauthorized changes.│
└─────────────────┴────────────────────────────────────────┘
```

### 5.1 Key Internal Controls and Security Safeguards
*   **Segregation of Duties (SoD):** The platform strictly separates conflicting operational roles. An official who reviews an application is blocked from giving final approval. System administrators are also blocked from editing transactional databases.
*   **Immutable Evidentiary Registry:** Every completed transaction, certificate issuance, and compliance approval is cryptographically logged, capturing the user's ID, transaction parameters, timestamp, and IP address.
*   **Audit-Ready Search Interface:** The system provides secure, read-only portals for internal and external auditors (such as the Diwan of Audit / Auditor General of Sudan). Auditors can query records by transaction ID or department, with all query activities recorded in the system logs.

---

## 6. REGULATORY CHANGE MANAGEMENT GUIDE

The platform implements a structured regulatory change management process to adapt to legislative updates without disrupting live services.

```
[ Law Amendment Issued ] ──► [ Impact Assessment ] ──► [ Rule Update & Test ] ──► [ CAB Review ] ──► Deploy
```

### 6.1 Regulatory Change Pipeline
1.  **Identification:** The Compliance Officer registers new legal amendments, ministerial decrees, or executive circulars in the Legal Obligations database.
2.  **Impact Assessment:** Compliance and Legal teams evaluate the new regulations, mapping required changes to affected system forms, workflow schemas, and business rules.
3.  **Rule Formulation and Testing:** Engineers update parameters in the Rules Registry and test new configurations in staging environments, ensuring compatibility with existing processes.
4.  **CAB Review and Deployment:** The Change Advisory Board (CAB) reviews the update, and once approved, the new rule is deployed with zero-downtime, keeping system records accurate and up-to-date.

---

## 7. ENTERPRISE RISK & COMPLIANCE FRAMEWORK

MCI implements an integrated risk management methodology to proactively identify, evaluate, and mitigate regulatory and compliance risks.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Enterprise Risk Management Matrix                    │
├──────────────────┬──────────────┬──────────────────┬────────────────────┤
│ Risk Category    │ Impact Level │ Mitigation Path  │ Assigned Owner     │
├──────────────────┼──────────────┼──────────────────┼────────────────────┤
│ Regulatory Gap   │ HIGH         │ Dynamic obligations│ Chief Compliance   │
│                  │              │ mapping register.│ Officer            │
├──────────────────┼──────────────┼──────────────────┼────────────────────┤
│ Policy Breach    │ HIGH         │ Real-time alerts │ Platform SRE       │
│                  │              │ and access audits.│ Team               │
├──────────────────┼──────────────┼──────────────────┼────────────────────┤
│ Data Protection  │ CRITICAL     │ Data masking and │ Cybersecurity      │
│                  │              │ role-based IAM.  │ Director           │
├──────────────────┼──────────────┼──────────────────┼────────────────────┤
│ AI Bias/Drift    │ MEDIUM       │ Human-in-the-loop│ AI Ethics Board    │
│                  │              │ review and audits│                    │
└──────────────────┴──────────────┴──────────────────┴────────────────────┘
```

### 7.1 Risk Mitigation Strategies
*   **Regulatory Gap Risks:** Managed through regular compliance reviews, ensuring that system configurations and rules align with current legislative requirements.
*   **Policy Breach Risks:** Mitigated using automated rule validation at every phase of transaction processing, blocking non-compliant applications.
*   **Data Protection Risks:** Addressed via advanced encryption (TLS 1.3 in-transit and KMS-backed storage encryption at-rest) and strict data access policies.
*   **Algorithmic and AI Risks:** Managed through regular validation audits, tracking AI accuracy levels and comparing automated recommendations against caseworker decisions.

---

## 8. RESPONSIBLE AI COMPLIANCE STANDARDS

To ensure the ethical, transparent, and compliant use of AI, the platform enforces strict standards for server-side **Gemini models** (via the modern `@google/genai` SDK).

```
┌──────────────────────────────────────────────────────────┐
│              Responsible AI Compliance Pipeline          │
├──────────────────────────────────────────────────────────┤
│ 1. AI generates a draft recommendation or metadata tag   │
│ 2. Log AI decision metadata, parameters, and sources    │
│ 3. Display recommendation clearly marked as "Advisory"   │
│ 4. Caseworker reviews and approves or overrides draft    │
│ 5. Audit logs track final actions and manual overrides   │
└──────────────────────────────────────────────────────────┘
```

### 8.1 Ethical AI Operational Rules
1.  **Human-in-the-Loop Validation:** The AI is strictly barred from making administrative decisions, updating records, or changing application states directly. All AI outputs must be validated by an authorized official.
2.  **Explainable and Traceable AI:** All AI-generated recommendations, compliance scores, and draft documents must display the underlying data sources and criteria used, ensuring accountability.
3.  **Algorithmic Audit Trails:** Every AI-generated output is logged in the system audit database, recording model parameters, inputs, outputs, and user feedback, supporting regular compliance reviews.

---

## 9. EXECUTIVE COMPLIANCE DASHBOARD SPECIFICATION

This section details the design and layout of the compliance monitoring dashboards, providing executives with clear, real-time indicators of compliance health.

```
+───────────────────────────────────────────────────────────+
│                      MCI COMPLIANCE HUB                   │
│  (Sovereign Logo)   Chief Compliance Officer Console      │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  [ Open Audits: 0 Pending ]         [ Policy Coverage: 100% ]│
│  [ Active Alerts: 2 Minor ]         [ SLA Compliance:  99.8% ]│
│                                                           │
├───────────────────────────────────────────────────────────┤
│  Regulatory Change Log Monitoring:                        │
│  - Companies Act (Capital): [ ACTIVE - Deployed v2.1.0 ]  │
│  - Price Cap Rule 12:       [ ACTIVE - Deployed v1.4.0 ]  │
│  - Free-Zone Land Grant:    [ PENDING - CAB Review ]      │
+───────────────────────────────────────────────────────────+
```

### 9.1 Visualization and Typography Standards
*   **Official Font Families:** Dashboard views must use **DIN Next Arabic** for Arabic (RTL) panels and **DIN Next** for English (LTR) views, ensuring elegant, professional typography.
*   **Alert Indicators:** Color-coded status alerts (e.g., green for compliant, amber for warnings, and red for high-risk issues) highlight outstanding compliance gaps and policy reviews.
*   **Cross-Device Responsiveness:** Dashboards are designed to scale cleanly across desktop, tablet, and mobile displays, supporting remote reviews.

---

## 10. NATIONAL GOVERNMENT COMPLIANCE & POLICY GOVERNANCE HANDBOOK

### 10.1 Executive Manual Summary
The National Government Compliance and Policy Governance Handbook establishes a secure, legally compliant, and highly configurable digital governance framework for the Republic of Sudan Ministry of Commerce & Industry. By combining decentralized rules management, automated internal controls, complete audit logging, and responsible AI oversight, the platform ensures that all digital services are legally defensible, transparent, and highly responsive to regulatory updates.

All future application development, cross-ministerial integrations, and policy changes must comply with the guidelines, taxonomies, and operational workflows defined in this handbook to preserve the security, integrity, and compliance of the nation's digital services.
