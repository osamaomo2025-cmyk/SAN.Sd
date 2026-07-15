# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL GOVERNMENT IDENTITY & ACCESS MANAGEMENT MASTER REPORT (v1.0.0)
#### Secure IAM Architecture, Zero-Trust Role-Based Access Control, Firebase Authentication Recovery Plan, and Audit Framework

---

## 1. EXECUTIVE AUDIT SUMMARY & IDENTITY GOVERNANCE | الملخص التنفيذي لحوكمة الهوية الوطنية
This master report outlines the authoritative **Identity & Access Management (IAM) and Zero-Trust Access Control Architecture** for the **Sudan Digital Ministry of Commerce & Industry Platform (SDMCI 2035)**. This system is designed in complete alignment with sovereign digital governance standards, security policies, and national identity privacy regulations.

يقدم هذا التقرير البنية التحتية السيادية والأمنية لنظام إدارة الهويات والصلاحيات الرقمية (IAM) لمنصة وزارة التجارة والصناعة بجمهورية السودان. تم تصميم البنية البرمجية باتباع مبدأ "الثقة الصفرية" (Zero-Trust Security) لضمان حماية بيانات المستثمرين، المصانع، والتجار، وتأمين قنوات تبادل البيانات الحكومية والخدمات الرقمية.

```
                  +-------------------------------------------------+
                  |          SOVEREIGN IDENTITY PROVIDER            |
                  |     (Sudan National Digital ID Gateway)         |
                  +------------------------+------------------------+
                                           |
                                           v
                  +------------------------+------------------------+
                  |         FIREBASE AUTHENTICATION LAYER          |
                  |   Custom Claims & Cryptographic Role Matching   |
                  +-------+----------------+----------------+-------+
                          |                |                |
         +----------------v+      +--------v-------+       +v---------------+
         |  Citizen/Broker |      | Merchant/Corp  |       | Govt Employee  |
         |  (Identity-LoA2)|      | (Business-LoA3)|       | (Officer-LoA4) |
         +-----------------+      +----------------+       +----------------+
```

---

## 2. ENTERPRISE IDENTITY ARCHITECTURE | بنية الهوية الرقمية للمؤسسات الحكومية

### 2.1 Identity Levels of Assurance (LoA)
We define four distinct Levels of Assurance (LoA) based on user authentication factors and verification processes:
1.  **LoA 1 (Basic Access):** Single-factor authentication (email/password) for basic portal browsing and FAQ services.
2.  **LoA 2 (Verified Citizen / Investor):** Dual-factor verification including verified email address and national identification number matching.
3.  **LoA 3 (Commercial Merchant):** Cryptographically bound commercial registration credentials with automated registry sync.
4.  **LoA 4 (Sovereign Officer):** Multi-factor hardware authentication combined with static IP and department security certificates.

### 2.2 Core IAM Component Topology
The security model uses **Firebase Authentication** as the primary identity token generator, mapped directly to customized role-based attributes cached within modern, high-performance secure React states.

---

## 3. FIRESTORE IDENTITY DATA MODEL | نموذج بيانات الهوية الرقمية في قواعد البيانات

To support highly granular authorization, user data is split into specialized secure collections to isolate sensitive PII (Personally Identifiable Information) from public directories:

```json
{
  "users": {
    "path": "/users/{uid}",
    "description": "Primary authenticated identity document",
    "fields": {
      "uid": "string (Firebase Auth UID)",
      "nationalId": "string (Encrypted National Identification)",
      "fullNameAr": "string",
      "fullNameEn": "string",
      "email": "string",
      "role": "string (Enum: citizen, merchant, investor, employee, inspector, minister, admin)",
      "verificationStatus": "string (Enum: unverified, pending, verified, suspended)",
      "organization": "string",
      "department": "string",
      "createdAt": "timestamp",
      "lastActive": "timestamp"
    }
  },
  "roles_permissions": {
    "path": "/roles_permissions/{role_id}",
    "description": "Sovereign permissions map linked to functional modules",
    "fields": {
      "roleId": "string",
      "accessibleModules": "array of strings",
      "allowedActions": "array of strings",
      "approvalLimitSDG": "number"
    }
  }
}
```

---

## 4. ROLE-BASED ACCESS CONTROL (RBAC) MATRIX | مصفوفة الصلاحيات والأدوار السيادية

To prevent privilege escalation and ensure **Least Privilege Access (LPA)**, the system enforces a strict permission model across all digital modules:

| Role (الدور الوظيفي) | Accessible Modules (الأنظمة المتاحة) | Read | Write | Approve / Reject | Audit Logs Access |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Super Administrator** | All Systems (System Config, Logs, Admin) | Yes | Yes | N/A | Full View |
| **Minister (السيد الوزير)** | Executive Dashboard, Performance KPIs, Audits | Yes | No | Strategic Approvals | Full View |
| **Undersecretary (الوكيل)** | Department Portals, Performance KPIs, Approvals | Yes | Yes | High-Value Licensing | Department View |
| **Inspector (المفتش التجاري)** | Field Inspections, Violation Registries, Reports | Yes | Yes | Issue Citations | No |
| **Investor / Merchant** | Commercial Portals, Licenses, Invoices | Self | Self | No | No |
| **Citizen (المواطن)** | Consumer Complaints, Catalog, Public Forms | Self | Self | No | No |

---

## 5. AUTHENTICATION RECOVERY PLAN | خطة معالجة واستقرار المصادقة الرقمية

During the transition between isolated environments and live Firebase systems, the platform maintains a robust, zero-downtime **Local Authentication Fallback & Caching Layer**:

```
[User Login Request]
       │
       ▼
[Firebase Auth Service] ──(Success)──► [Update Session Cache] ──► [Grant Access]
       │
   (Offline/In-flight)
       │
       ▼
[Local Secure Cache] ────(Matches)───► [Restore Valid Offline State]
```

### 5.1 Fallback Configuration & Session Hydration
*   **Token Expiry Policy:** Absolute session timeout enforced at **30 minutes** of idle activity.
*   **Automatic Synchronization:** When connectivity is restored, cached operations queue and sync seamlessly with Firestore ledgers.
*   **Local Cryptographic Storage:** Session tokens are secured using browser session-isolated storage with randomized payload hashes.

---

## 6. MULTI-FACTOR AUTHENTICATION (MFA) READINESS | جاهزية المصادقة متعددة العوامل

To guarantee enterprise compliance, the system is designed to seamlessly activate Multi-Factor Authentication:

1.  **Email One-Time Password (OTP):** Dynamically generated standard 6-digit codes sent via secure mail templates.
2.  **SMS Gateway Ready:** Hooked parameters configured to integrate with national telecommunication providers (Zain, MTN, Sudani) once production API gateways are active.
3.  **Hardware Security Keys:** Integrated WebAuthn patterns to support USB and NFC hardware verification for high-clearance ministry executives.

---

## 7. AUDIT & COMPLIANCE LOGGING | أنظمة الرقابة وتتبع العمليات السيادية

To maintain operational transparency, any change in authorization, identity registration, or licensing must be logged into a tamper-evident administrative ledger.

### 7.1 Sample Secure Audit Event Payload
```json
{
  "eventId": "evt_94820184710",
  "timestamp": "2026-07-14T15:20:00Z",
  "actor": {
    "uid": "usr_emp_481028",
    "role": "inspector",
    "fullName": "عثمان أحمد علي"
  },
  "action": "VIOLATION_RECORD_CREATED",
  "resource": "companies/com_94810294",
  "ipAddress": "196.1.201.45",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "changeLog": {
    "field": "inspectionStatus",
    "oldValue": "compliant",
    "newValue": "non-compliant"
  }
}
```

---

## 8. PRODUCTION IDENTITY READINESS CHECKLIST | قائمة جاهزية إدارة الهويات

*   [✓] **Zero Trust Enforcement:** All sensitive API endpoints verify both session presence and custom claims tokens.
*   [✓] **Multi-role UI Adaptability:** Component visibility is fully bound to the active user's verified role.
*   [✓] **Arabic Interface Localization:** All login, registration, and profile screens support right-to-left layout direction and premium typographic styling (**DIN Next Arabic**).
*   [✓] **Error Handling Resilience:** Beautiful localized system warnings corresponding to standard authentication errors (e.g., incorrect password, expired verification token).

---

### Authoritative Seal & Signature
**Sovereign Digital Identity & Cybersecurity Directorate**  
*Ministry of Commerce & Industry, Republic of Sudan*  
*Date of Certification: 2026-07-14*
