# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL GOVERNMENT DIGITAL COMMUNICATION & OMNICHANNEL MESSAGING HANDBOOK (v1.0.0)
#### Authority: Sovereign Digital Transformation Directive (SDTD-2026-MSG)

---

## 1. ENTERPRISE COMMUNICATION ARCHITECTURE (ECA)

This section establishes the official, serverless, decoupled, and event-driven communication framework designed for the Ministry’s digital portal. The architecture utilizes **Google Cloud Pub/Sub**, **Cloud Firestore**, **Firebase Cloud Messaging (FCM)**, and **Cloud Functions** to provide a highly resilient message queue capable of high-throughput messaging across the Republic of Sudan.

```
       [ Core Application Event / Service Trigger ]
                            │
                            ▼
          +───────────────────────────────────+
          │     Google Cloud Pub/Sub Topic    │ (topic: "mci-notification-triggers")
          +─────────────────┬─────────────────+
                            │
                            ▼
          +───────────────────────────────────+
          │      Cloud Function Dispatcher    │ (Triggered by Pub/Sub message)
          +─────────────────┬─────────────────+
                            │
                            ├───────────────────────────────────────┐
                            ▼ (Fetch Preferences & Rules)           ▼ (Audit Log)
                +───────────────────────+               +───────────────────────+
                │   Cloud Firestore     │               │   Cloud Firestore     │
                │  - /user_preferences  │               │  - /communication_logs│
                │  - /message_templates │               │                       │
                +───────────┬───────────+               +───────────────────────+
                            │
                            ▼ (Compile Template & Dynamic Variables)
                +───────────────────────+
                │   Payload Compiler    │
                +───────────┬───────────+
                            │
                            ▼ (Select Active Channels via Rules)
          +───────────────────────────────────+
          │    Omnichannel Dispatch Router    │
          +───────┬───────────┬───────────┬───+
                  │           │           │
                  ▼           ▼           ▼
               [ FCM ]     [ Email ]   [ SMS ]
```

### 1.1 Architecture Components

*   **Notification Publisher Interface:** Any microservice or internal module triggers notification requests by writing a structured JSON payload to the unified Google Cloud Pub/Sub topic: `mci-notification-triggers`. This completely decouples core business systems from delivery implementations.
*   **Decoupled Orchestrator Engine (Firebase Functions):** Listens to Pub/Sub events, retrieves target user profiles and preferences from `/user_preferences`, fetches the approved localized message template from `/message_templates`, compiles dynamic values, and executes safety/policy checks.
*   **Central Transactional State Store (Cloud Firestore):** Runs a decoupled collections structure:
    *   `/message_templates`: Stores active translation files, variables, and metadata (version, channels, approvals).
    *   `/user_preferences`: Contains preferred channels, quiet-hour exceptions, and opt-ins.
    *   `/communication_logs`: Tracks transactional delivery histories, message hashes, retries, and delivery receipts for compliance audits.
*   **Channel Routing Fabric:** Routes compiled messages to appropriate underlying delivery providers (e.g., Zain/MTN/Sudani SMS APIs, SMTP/SendGrid, Firebase Cloud Messaging, or external secure government hubs) based on active metadata routing parameters.

---

## 2. NATIONAL GOVERNMENT NOTIFICATION FRAMEWORK

The MCI notification framework defines a standardized system of message priorities, retry policies, and retention policies, categorized by business domain.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          Notification Urgency & Priority Matrix                        │
├──────────────┬──────────────────┬─────────────────┬──────────────┬─────────────────────┤
│ Priority     │ Primary Channels │ Retry Limit     │ Backoff Type │ Max Retries (Limit) │
├──────────────┼──────────────────┼─────────────────┼──────────────┼─────────────────────┤
│ URGENT (P0)  │ SMS, In-App, FCM │ Immediate       │ Exponential  │ 10 (Max)            │
│ HIGH (P1)    │ Email, In-App    │ Within 5 min    │ Linear       │ 5 (Max)             │
│ MEDIUM (P2)  │ Email, In-App    │ Within 1 hour   │ Linear       │ 3 (Max)             │
│ LOW (P3)     │ In-App Inbox     │ Next business   │ None         │ 1 (Max)             │
└──────────────┴──────────────────┴─────────────────┴──────────────┴─────────────────────┘
```

### 2.1 Message Categories and Policies

#### 2.1.1 Security Alerts (MFA, Password Changes, Login Alerts)
*   **Priority:** URGENT (P0)
*   **Primary Channels:** SMS (Primary), FCM Push, Email (Secondary).
*   **Retry Policy:** 10 retries with exponential backoff (starting at 5 seconds, max interval 2 minutes).
*   **Escalation Rules:** If SMS fails twice, fallback immediately to sending an OTP via registered Email and FCM.
*   **Retention Policy:** Active logs stored in `/communication_logs` for 30 days, then moved to cold audit storage for 7 years.

#### 2.1.2 Financial & Payment Notifications (Invoices, Receipts, Overdue Fees)
*   **Priority:** HIGH (P1)
*   **Primary Channels:** Email, In-App Inbox.
*   **Retry Policy:** 5 retries with linear backoff (interval 10 minutes).
*   **Escalation Rules:** If payment receipt email fails to deliver, add high-importance task banner inside the Citizen Portal Workspace.
*   **Retention Policy:** 7 years active storage (due to regulatory auditing laws).

#### 2.1.3 Workflow Approvals & Rejections (Commercial Registry, Licenses)
*   **Priority:** HIGH (P1)
*   **Primary Channels:** Email, In-App Portal Workspace.
*   **Retry Policy:** 5 retries with linear backoff (interval 15 minutes).
*   **Escalation Rules:** For approvals, if unread for 24 hours, send a summary SMS to the applicant.
*   **Retention Policy:** Indefinite storage as part of the corporate/license historical registry.

#### 2.1.4 Inspections & Violations (Site Visits, Notices, Warnings)
*   **Priority:** HIGH (P1)
*   **Primary Channels:** SMS, Email, In-App Portal.
*   **Retry Policy:** 5 retries with exponential backoff.
*   **Escalation Rules:** If a violation warning is undelivered for 12 hours, escalate to the Compliance Officer for manual verification and physical dispatch.
*   **Retention Policy:** Indefinite storage within the firm's compliance registry.

#### 2.1.5 General Updates & Circulars (Regulatory policy changes, Ministry Announcements)
*   **Priority:** LOW (P3)
*   **Primary Channels:** Email (Opt-In), In-App Circular Board.
*   **Retry Policy:** 1 retry attempt. No automatic retry if bounced.
*   **Escalation Rules:** None.
*   **Retention Policy:** 1 year active, then archived.

---

## 3. OMNICHANNEL MESSAGING PLATFORM SPECIFICATION

The Omnichannel Routing Engine is configured to dynamically deliver notifications through multiple protocols, supporting both immediate channels and future national infrastructure APIs.

```
+────────────────────────────────────────────────────────────────────────────────────────┐
│                                Omnichannel Delivery Fabric                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Channels Supported:                                                                    │
│  - In-App Inbox (Portal Console, Direct State Rendering)                                │
│  - Push Notifications (Firebase Cloud Messaging - APNS & FCM Core)                     │
│  - Email (SMTP/Mime Protocol, SPF/DKIM signed)                                         │
│  - Short Message Service (SMS, zain/MTN/Sudani SMPP integrations)                      │
│  - Future Targets: WhatsApp Business API, National Digital Mailbox, Sovereign Super App│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Delivery Channels Specification

1.  **In-App Inbox:** Rendered natively inside the secure portal interface. Supported by high-performance Firestore queries. Messages in this inbox support read states, detailed status logs, and official document attachments.
2.  **Firebase Cloud Messaging (Push):** Used to deliver real-time notifications to corporate mobile apps and inspector field devices. Integrates with system-level alert panels.
3.  **Email (Secure SMTP):** Rich-text format. All outgoing emails are digitally signed with SPF, DKIM, and DMARC records matching `@mci.gov.sd`. Formatted in high-contrast HTML with PDF attachments.
4.  **Short Message Service (SMS):** Restricted to urgent notifications and multi-factor authentication codes. Sends text-only payloads (<160 characters) using local mobile network protocols.
5.  **WhatsApp Business API (Future Integration):** Configurable gateway ready for automated customer service, allowing merchants to query application statuses using approved chatbot playbooks.
6.  **National Digital Mailbox (Future Integration):** Designed to connect with future sovereign electronic citizen mailbox networks, ensuring legally binding digital delivery of court orders and licenses.

---

## 4. MESSAGE TEMPLATE & LOCALIZATION FRAMEWORK

To prevent hardcoding of text in application logic, all notifications draw from structured bilingual templates managed in a centralized Firestore repository.

```
┌──────────────────────────────────────────────────────────┐
│             Bilingual Template Structure                 │
├──────────────────────────────────────────────────────────┤
│ - Template ID: "TMP-LICENSE-REVOKE"                      │
│ - Variables: {licenseNo}, {firmName}, {reason}           │
│ - Arabic Layout: RTL direction                           │
│ - English Layout: LTR direction                          │
│ - Default Fonts: DIN Next Arabic (AR) / DIN Next (EN)    │
└──────────────────────────────────────────────────────────┘
```

### 4.1 central Template Schema Model
Templates are defined as highly structured JSON documents stored under `/message_templates/{templateId}`:

```json
{
  "templateId": "TMP-LICENSE-REVOKE",
  "name": "Operating License Revocation Notice",
  "version": "1.2.0",
  "status": "APPROVED",
  "variables": ["licenseNo", "firmName", "reason", "appealDays"],
  "translations": {
    "ar": {
      "subject": "تنبيه هام: إلغاء رخصة التشغيل رقم {licenseNo}",
      "body": "عزيزي ممثل {firmName}، نحيطكم علماً بأنه قد تم إلغاء رخصة التشغيل الخاصة بكم رقم {licenseNo} بسبب {reason}. يمنحكم القانون فترة {appealDays} يوماً لتقديم طعن قانوني عبر البوابة.",
      "sms": "تنبيه: تم إلغاء الرخصة {licenseNo} لشركة {firmName} بسبب {reason}. لتقديم طعن: mci.gov.sd"
    },
    "en": {
      "subject": "CRITICAL NOTICE: Revocation of Operating License No. {licenseNo}",
      "body": "Dear representative of {firmName}, please be notified that your Operating License No. {licenseNo} has been revoked due to: {reason}. You have {appealDays} days to file a formal appeal via the digital portal.",
      "sms": "Alert: License {licenseNo} for {firmName} has been revoked due to {reason}. To appeal: mci.gov.sd"
    }
  },
  "channelControl": {
    "email": true,
    "sms": true,
    "push": true,
    "inApp": true
  }
}
```

### 4.2 Dynamic Validation & Versioning
*   **Variable Extraction:** The execution logic checks incoming Pub/Sub payloads against the template’s `variables` array before queuing the message.
*   **Schema Version Locking:** Active notifications are locked to specific schema versions (e.g., `v1.2.0`). Updates increment the version number, preserving the integrity of active workflow sequences.

---

## 5. EVENT-TO-COMMUNICATION CATALOG

This catalog maps business events on the digital portal to corresponding localized notifications, specifying priorities and target channels.

```
       [ Core App Event ] ──► [ Lookup Template ID ] ──► [ Compile & Dispatch ]
```

### 5.1 Event Mappings

#### 5.1.1 Event: `UserRegistrationCompleted`
*   **Trigger Source:** Identity and Access Management System (IAM).
*   **Template ID:** `TMP-AUTH-WELCOME`
*   **Target Audience:** Registered Citizen or Investor.
*   **Preferred Channels:** Email (Primary), In-App.
*   **Delivery Priority:** HIGH (P1)
*   **Payload Schema:** `{firstName}`, `{activationUrl}`

#### 5.1.2 Event: `CompanyRegistrationApproved`
*   **Trigger Source:** Commercial Registry Workflow Engine (`WF-REG-COMPANY`).
*   **Template ID:** `TMP-REG-COMPANY-APPROVE`
*   **Target Audience:** Company Founder / Partners.
*   **Preferred Channels:** Email (Rich PDF certificate), In-App.
*   **Delivery Priority:** HIGH (P1)
*   **Payload Schema:** `{companyName}`, `{crNumber}`, `{certificateDownloadUrl}`

#### 5.1.3 Event: `CompanyRegistrationRejected`
*   **Trigger Source:** Commercial Registry Workflow Engine (`WF-REG-COMPANY`).
*   **Template ID:** `TMP-REG-COMPANY-REJECT`
*   **Target Audience:** Company Founder.
*   **Preferred Channels:** Email, In-App.
*   **Delivery Priority:** HIGH (P1)
*   **Payload Schema:** `{proposedName}`, `{rejectionReasons}`, `{appealUrl}`

#### 5.1.4 Event: `LicensePaymentConfirmed`
*   **Trigger Source:** Ministry Revenue Integration Service.
*   **Template ID:** `TMP-FIN-PAYMENT-CONFIRM`
*   **Target Audience:** Merchant Account Owner.
*   **Preferred Channels:** Email, SMS (Summary receipt).
*   **Delivery Priority:** HIGH (P1)
*   **Payload Schema:** `{receiptNo}`, `{amount}`, `{paymentDate}`

#### 5.1.5 Event: `InspectionSiteScheduled`
*   **Trigger Source:** Inspection Services Workflow (`WF-INS-AUDIT`).
*   **Template ID:** `TMP-INS-SCHEDULED`
*   **Target Audience:** Factory Manager.
*   **Preferred Channels:** SMS, Email, In-App.
*   **Delivery Priority:** MEDIUM (P2)
*   **Payload Schema:** `{inspectionDate}`, `{inspectorName}`, `{checklistLink}`

#### 5.1.6 Event: `SecurityBreachDetected`
*   **Trigger Source:** Platform Security SIEM.
*   **Template ID:** `TMP-SEC-ALERT`
*   **Target Audience:** System Administrator / Affected User.
*   **Preferred Channels:** SMS (Immediate alert), FCM Push, Email.
*   **Delivery Priority:** URGENT (P0)
*   **Payload Schema:** `{deviceType}`, `{ipAddress}`, `{timestamp}`

---

## 6. DELIVERY TRACKING & ANALYTICS FRAMEWORK

To ensure reliability, all notifications are tracked in real-time through an audit-compliant delivery pipeline.

```
                       [ Outgoing Event Queue ]
                                  │
                                  ▼
                     [ Send to Gateway Adapter ]
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼ (Successful Delivery)                           ▼ (Delivery Failure)
[ Register Delivery Receipt ]                       [ Increment Retry Count ]
- Update Firestore logs                             - Execute linear/exp backoff
- Set status = "DELIVERED"                         - If limit reached: Move to DLQ
```

### 6.1 Deliveries and Queue Management
*   **Deferred and Scheduled Deliveries:** Notifications can include `deliverAt` ISO timestamps in their metadata. The scheduler holds these events in Firestore until the target time, allowing for automated expiration notices or delayed survey links.
*   **Dead Letter Queue (DLQ):** Messages that fail all retry attempts are moved to `/system_failures/dlq/records`. The system triggers alert events to notify administrators of persistent network issues.
*   **Duplicate Prevention (Idempotency Key):** Every notification payload must include an `idempotencyKey` (e.g., `event_id + user_id`). The engine rejects incoming messages that match keys processed within the past 48 hours, preventing duplicate alerts during network delays.

### 6.2 Monitoring and Metrics Logs
For each notification dispatched, the engine records an immutable tracking entry in `/communication_logs`:

```json
{
  "logId": "LOG-827364129",
  "eventId": "EVT-9001",
  "templateId": "TMP-REG-COMPANY-APPROVE",
  "userId": "USR-44129",
  "idempotencyKey": "cr_approve_9001_usr44129",
  "selectedChannels": {
    "sms": { "gateway": "Zain-Sudan", "status": "DELIVERED", "sentAt": "2026-07-12T12:00:01Z", "deliveredAt": "2026-07-12T12:00:03Z" },
    "email": { "gateway": "MCI-Mail", "status": "SENT", "sentAt": "2026-07-12T12:00:01Z" }
  },
  "recipientHash": "sha256(phone_and_email)",
  "readStatus": "UNREAD",
  "totalRetries": 0
}
```

---

## 7. USER COMMUNICATION PREFERENCE MANAGEMENT

Citizens and business owners can manage how they receive communications through their profile dashboard, ensuring respect for their privacy and preferences.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Linguistic and Routing Options                    │
├────────────────────────────────────────────────────────────────────────┤
│ - Preferred Interface Language: [ Arabic | English ]                   │
│ - Notification Delivery Target Channels:                               │
│   * Receipts & Invoices:     [ Email ] [ In-App ] (SMS opt-out)        │
│   * General Updates:         [ Email ] (SMS blocked)                   │
│ - Quiet Hours Window:        [ 22:00 to 07:00 (Local Sudan Time) ]     │
│ - Enforced Override Status:  [ ACTIVE ] (Bypasses for security & law)  │
└────────────────────────────────────────────────────────────────────────┘
```

### 7.1 Preference Rules & Exclusions
*   **Quiet Hours Filter:** Users can define localized quiet hour windows (default: 10:00 PM to 7:00 AM). Non-critical messages (e.g., survey invites or circulars) are held in the queue and delivered at 8:00 AM.
*   **Mandatory Security Overrides:** Urgent notifications (e.g., multi-factor authentication codes, transaction confirmations, password resets, and regulatory citations) ignore user preferences and quiet-hour rules to ensure system security and legal compliance.

---

## 8. AI COMMUNICATION & PERSONALIZATION FRAMEWORK

The platform integrates secure server-side **Gemini models** (using the modern `@google/genai` SDK) to improve communication efficiency and accessibility.

```
┌──────────────────────────────────────────────────────────┐
│              AI Communication Pipeline                   │
├──────────────────────────────────────────────────────────┤
│ 1. Event: Public Circular Drafted                        │
│ 2. Run Gemini: Generate Plain-Language Arabic & English  │
│ 3. Check for Terminology and Regulatory Alignment       │
│ 4. Officer Review Panel: View, Edit, and Sign-off        │
│ 5. *Policy Guard*: Unsigned AI drafts cannot be sent      │
└──────────────────────────────────────────────────────────┘
```

### 8.1 Key AI Communication Roles
*   **Plain-Language Summarization:** Simplifies complex legal and tariff updates into clear, understandable language for small business owners and citizens.
*   **Intelligent Escalation Flags:** Analyzes user replies and feedback, routing complaints to specialized teams based on sentiment and urgency.
*   **Delivery Time Optimization:** Analyzes user activity patterns to schedule non-urgent notifications when the user is most likely to read them, improving engagement.
*   **Regulatory Policy Guard:** AI models act exclusively as advisory draft tools. AI-generated text must be reviewed and signed off by an authorized communications officer before being released to the public.

---

## 9. COMMUNICATION GOVERNANCE & AUDIT MANUAL

This section outlines the management and governance policies that ensure all communications are secure, consistent, and compliant with administrative laws.

```
[ Draft Template ] ──► [ Compliance Review ] ──► [ Legal Sign-off ] ──► Live Deployment
```

### 9.1 Key Governance Roles
*   **Communication Owner:** Oversees messaging strategies, branding consistency, and policy alignment.
*   **Template Owner:** Manages message content, ensuring templates are clear, accurate, and regularly updated.
*   **Approval Authority:** Reviews and signs off on new templates, verifying regulatory compliance before deployment.

### 9.2 Audit & Verification Policies
1.  **Tamper-Evident Signatures:** All official notifications, such as licensing certificates and compliance warnings, are cryptographically hashed and signed to verify authenticity.
2.  **Delivery Verification Log:** The system maintains an unmodifiable audit trail of all outgoing communications, recording delivery states, timestamps, and receipt hashes.
3.  **Authentication Protocols:** Outgoing emails must use SPF, DKIM, and DMARC records matching `@mci.gov.sd` to prevent email spoofing and phishing attacks.

---

## 10. NATIONAL GOVERNMENT DIGITAL COMMUNICATION HANDBOOK

To maintain brand consistency and accessibility, all public notifications must comply with standard linguistic and styling guidelines.

### 10.1 Typography and Fonts
All public communications and digital interfaces must use approved fonts:
*   **Arabic Text (RTL):** Must use **DIN Next Arabic** to ensure readability and professional presentation.
*   **English Text (LTR):** Must use **DIN Next** to maintain brand alignment.

### 10.2 Language & Design Standards
*   **Plain Language:** Keep notifications clear, direct, and easy to understand. Avoid dense legal jargon and technical terms.
*   **WCAG 2.2 AA Compliance:** All portal messages, HTML emails, and mobile push notifications must feature high-contrast colors and support screen readers.
*   **RTL and LTR Compatibility:** Interface templates must dynamically adapt layout directions based on the user's preferred language, ensuring clean rendering in both Arabic and English.
