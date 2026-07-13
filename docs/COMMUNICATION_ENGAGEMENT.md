# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### MASTER BLUEPRINT: ENTERPRISE COMMUNICATION, NOTIFICATION & CITIZEN ENGAGEMENT FRAMEWORK (v1.0.0)

---

## 1. EXECUTIVE SUMMARY & GUIDING PRINCIPLES

This document establishes the official **Enterprise Communication, Notification & Citizen Engagement Framework (ECNCEF)** for the Sudan Digital Ministry of Commerce & Industry (MCI). Formulated under the national "Sudan 2035 Digital Sovereignty Directive," this architecture is engineered to govern all outward and inward communication flows, notification events, messaging channels, and citizen feedback mechanisms over the next 20 years.

The ECNCEF replaces fragmented, paper-heavy communication methods with an **Event-Driven, Omnichannel, secure, and Citizen-Centered Engagement Engine** that maintains a complete audit trail of official correspondence.

```
       [ Business Event Trigger ] ──► [ Unified Notification Engine ]
                                                 │
       ┌─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
┌─────────────┐           ┌─────────────┐           ┌─────────────┐
│ SMS Gateway │           │    Email    │           │ In-App Push │
│ (Zain/MTN)  │           │   Service   │           │   Console   │
└─────────────┘           └─────────────┘           └─────────────┘
```

### Guiding Principles:
*   **Citizen-Centered Engagement:** All communications must prioritize clarity, brevity, and usability. Complex legal updates are translated into plain language summaries for public consumption.
*   **API-First & Abracted Delivery:** Communication channels (SMS, Email, Push, Web Webhooks) are abstracted behind a unified messaging layer, ensuring that changing underlying providers does not affect core business systems.
*   **Sovereign & secure Delivery:** Official correspondence (including citations, approvals, and legal notices) are digitally signed, timestamped, and logged to prevent tampering or repudiation.
*   **Accessibility and RTL Parity:** Every notification must support complete parity between Arabic (DIN Next Arabic, RTL) and English (DIN Next, LTR), meeting WCAG 2.2 AA accessibility standards.
*   **Separation of Content and Logic:** Message templates, localization variables, and routing workflows are managed in a central repository, separating content from application source code.

---

## 2. OMNICHANNEL COMMUNICATION LANDSCAPE

The Ministry’s digital platform supports multiple communication channels to reach citizens, merchants, investors, and internal employees where they are most active.

```
                      +-----------------------------+
                      | Unified Notification Gateway|
                      +--------------+--------------+
                                     |
       +-----------------+-----------+-----------+-----------------+
       |                 |                       |                 |
+------v------+   +------v------+         +------v------+   +------v------+
| Transaction |   | Urgent SMS  |         | Custom Push |   | Official PDF|
| Email Alerts|   |   Alerts    |         |Notifications|   | Letters (CR)|
+-------------+   +-------------+         +-------------+   +-------------+
```

### Channel Catalog:
1.  **In-App Alerts & Web Portal Inbox:** The primary repository for account notifications, detailed transaction statuses, and legal correspondence.
2.  **Short Message Service (SMS):** Used for urgent, low-latency alerts (e.g., OTP codes, payment confirmations, and inspection reminders) sent via national networks (Zain, MTN, Sudani).
3.  **Electronic Mail (Email):** Used for rich content delivery, including PDF copies of digital certificates, detailed feedback requests, and legal circular updates.
4.  **Mobile Push Notifications:** Used for real-time operational alerts sent directly to case officers, field inspectors, and mobile portal users.
5.  **Official Generated PDF Letters:** Cryptographically signed, formal correspondence (such as registration approval letters or formal compliance demands) designed for legal archive.
6.  **Sovereign Notification Hub Interconnect:** Integration-ready with future national unified citizen communications platforms.

---

## 3. UNIFIED MESSAGE TEMPLATE CATALOG

To maintain brand consistency and linguistic accuracy, all platform-generated communications must draw from centrally governed, bilingual templates.

```
┌────────────────────────────────────────────────────────┐
│           Bilingual Template Metadata Envelope         │
├────────────────────────────────────────────────────────┤
│ Template ID: TMP-CR-002-APPROVE                        │
│ Name: LLC Registration Approval Letter                 │
│ Variables: {ownerName}, {companyName}, {crNumber}      │
│ Priority: HIGH (Immediate Routing)                     │
│ Channel Constraints: Email (Primary), SMS (Summary)    │
└────────────────────────────────────────────────────────┘
```

### Standard Template Specifications:

#### Template ID: `TMP-AUTH-OTP` | Multi-Factor Authentication Code
*   **Purpose:** Dispatches short-lived OTP verification codes for secure logins or transaction authorization.
*   **Audience:** All authenticated users (Citizens, Merchants, Employees).
*   **Priority:** URGENT (Immediate routing, bypasses non-critical queues).
*   **Delivery Channels:** SMS, Email.
*   **Payload Variables:** `{verificationCode}`, `{expirationMinutes}`.
*   **Localized Content:**
    *   *Arabic:* `رمز التحقق الخاص بك هو {verificationCode}. يرجى عدم مشاركته. هذا الرمز صالح لمدة {expirationMinutes} دقائق.`
    *   *English:* `Your secure verification code is {verificationCode}. Please do not share this. Valid for {expirationMinutes} minutes.`

#### Template ID: `TMP-CR-002-APPROVE` | LLC Registration Completed
*   **Purpose:** Notifies applicants when their company registration has been approved and issued.
*   **Priority:** HIGH.
*   **Delivery Channels:** Email (Primary), In-App Push (Summary).
*   **Payload Variables:** `{ownerName}`, `{companyName}`, `{crNumber}`, `{downloadLink}`.
*   **Localized Content:**
    *   *Arabic:* `عزيزي {ownerName}، يسعدنا إعلامك بأن شركة "{companyName}" قد تم تسجيلها بنجاح برقم سجل تجاري {crNumber}. يمكنك تحميل الشهادة الرقمية عبر الرابط: {downloadLink}.`
    *   *English:* `Dear {ownerName}, we are pleased to inform you that "{companyName}" has been successfully registered with CR Number {crNumber}. You can download your digital certificate here: {downloadLink}.`

#### Template ID: `TMP-IL-001-SCHEDULE` | Site Inspection Confirmation
*   **Purpose:** Confirms site audit scheduling with industrial facility developers.
*   **Priority:** MEDIUM.
*   **Delivery Channels:** SMS, Email, In-App.
*   **Payload Variables:** `{investorName}`, `{factoryName}`, `{inspectorName}`, `{scheduledDate}`, `{scheduledTime}`.

---

## 4. CITIZEN ENGAGEMENT & FEEDBACK STRATEGY

The Ministry values active public participation and implements structured mechanisms to gather user feedback and improve service delivery.

```
+────────────────+     +────────────────+     +────────────────+     +────────────────+
|  1. Experience | ──► |  2. Sentiment  | ──► |  3. Escalation | ──► |  4. Systemic   |
| (Transaction)  |     |  (AI Triage)   |     | (Case Review)  |     |   Adjustment   |
+────────────────+     +────────────────+     +────────────────+     +────────────────+
```

### Engagement Mechanics:
1.  **Transaction-Triggered Surveys:** Upon completing any digital service (such as renewing an import license), applicants receive a 1-question CSAT survey requesting rating on a scale of 1-5.
2.  **Public Suggestion Portal:** Citizens can submit ideas for streamlining commerce, reducing price gouging, or improving public markets.
3.  **AI Sentiment Analysis:** The Sovereign AI Assistant (using server-side Gemini models) reviews public comments, reviews, and suggestions, grouping them into thematic clusters to help identify systemic bottlenecks or compliance concerns.
4.  **Public Consultations (G2C):** A digital forum where the Ministry can publish draft commercial and industrial regulations for public comment before legislative adoption.

---

## 5. REVENUE & DISPATCH COMMUNICATION WORKFLOWS

To ensure high reliability, all outgoing messages are routed through a structured communication pipeline featuring error handling and delivery tracking.

```
                     [ Event Trigger Checked ]
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │ 1. Load User Preferences & Quiet Hours       │
         └──────────────────────┬───────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │ 2. Load Bilingual Template and Variables     │
         └──────────────────────┬───────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │ 3. Send Message to Primary Outbox Queue     │
         └──────────────────────┬───────────────────────┘
                                │
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
      [ Delivered ]                             [ Failed ]
   Verify Signature & Log                    Trigger Retries (x3)
```

1.  **Event Check:** A business process (e.g., license expiration check) triggers a notification event.
2.  **Preference Filter:** The system checks the recipient's subscription preferences:
    *   *Language Preference:* Arabic vs. English.
    *   *Channel Preference:* SMS vs. Email.
    *   *Quiet Hours:* Non-urgent notifications are paused during designated quiet hours (e.g., 10:00 PM to 6:00 AM) and queued for morning delivery. Mandatory legal or security alerts bypass this filter.
3.  **Template Compilation:** The system compiles the localized template with active variables, signing the payload metadata.
4.  **Dispatch Routing:** The message is added to the outgoing queue, where adapters (e.g., the SMS Adapter) route it to the active gateway provider.
5.  **Exception and Retry Management:**
    *   *Failed Deliveries:* The system retries failed messages up to 3 times with exponential backoff.
    *   *Dead Letter Queue (DLQ):* If all retries fail, the event is moved to a dead letter queue, and an alert is logged for administrator review.

---

## 6. SUBSCRIPTION & PREFERENCE MANAGEMENT

Citizens and merchants have control over how they receive non-mandatory notifications, with preferences managed through their profile workspace.

```
┌────────────────────────────────────────────────────────┐
│             Notification Preference Console            │
├────────────────────────────────────────────────────────┤
│ Language: [ Arabic | English ]                         │
├────────────────────────────────────────────────────────┤
│ Notification Preferences:                              │
│  - Security Alerts (MFA, Passwords)  [x] Enforced      │
│  - Case Status Updates               [x] Email  [ ] SMS│
│  - Policy & Legislative Circulars    [ ] Email  [ ] SMS│
│  - Feedback & Survey Invites         [ ] Email  [ ] SMS│
└────────────────────────────────────────────────────────┘
```

### Preference Categories:
*   **Security & Identity Alerts:** Mandatory notifications (including MFA codes, password reset requests, and login alerts) that bypass user preferences and are sent across all available channels.
*   **Transactional Status Updates:** Case progress updates (such as pending payments, missing documents, and approvals) sent to the user's preferred channels (e.g., In-App + Email).
*   **Regulatory & Policy Announcements:** Updates regarding new commerce codes, industrial tariffs, and holiday schedules. Users can opt in or out of this category.
*   **Feedback & Survey Invites:** Invites to CSAT surveys and public consultations. Users can opt out of these invites.

---

## 7. AI COMMUNICATION STANDARDS & ASSISTANCE

To improve efficiency and readability, the platform utilizes server-side Gemini models to assist with message drafting, translation, and summaries.

```
               [ Complex Legal Document ]
                           │
                           ▼
          ┌──────────────────────────────────┐
          │   Gemini Plain-Language Draft    │
          └────────────────┬─────────────────┘
                           │
                           ▼
          ┌──────────────────────────────────┐
          │  Bilingual Translation Checks    │
          └────────────────┬─────────────────┘
                           │
                           ▼
          ┌──────────────────────────────────┐
          │ Human Officer Review & Sign-Off  │
          └──────────────────────────────────┘
```

### AI Guidelines:
1.  **Plain Language Rewriting:** The AI can generate plain-language summaries of complex commercial laws or industrial regulations to help citizens and small business owners understand their obligations.
2.  **Draft Translation Support:** The AI assists in translating news articles, press releases, and announcements, ensuring terminological consistency between Arabic and English.
3.  **Suggested Caseworker Responses:** When a merchant requests clarification on a pending application, the AI drafts suggested responses based on the knowledge base to help caseworkers reply more quickly.
4.  **AI Safety Guard:** All AI-generated text must be clearly flagged inside the workspace and reviewed and approved by an authorized public relations or legal officer before public release. The AI is forbidden from sending unreviewed communications to the public.

---

## 8. SECURITY, PRIVACY & ROW-LEVEL COMMUNICATION POLICIES

To protect personal and corporate data, all communications must comply with strict privacy policies.

```
                         [ Outgoing Message ]
                                  │
                                  ▼
         ┌──────────────────────────────────────────────┐
         │ Is Sender Authenticated and Authorized?      │
         └──────────────────────┬───────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │ Strip PII (Except Recipient's Own Info)      │
         └──────────────────────┬───────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │ Sign Message Metadata & Add Opt-out Footer   │
         └──────────────────────────────────────────────┘
```

### Security Standards:
1.  **PII Protection:** Transactional messages sent via SMS or Email must not contain sensitive personal or corporate data (such as full National ID numbers or detailed banking details). Messages must refer users to their secure portal inbox to view sensitive information.
2.  **Sender Authentication:** Outgoing emails must use standard verification records (SPF, DKIM, and DMARC) to verify domain authenticity and prevent phishing.
3.  **Data Deletion & Retention:** Communication logs are retained in the active system for **7 years** (complying with auditing requirements), after which they are archived or permanently disposed of based on system governance policies.

---

## 9. ACCESSIBILITY & INCLUSION STANDARDS

The Ministry is committed to providing accessible digital communications for all users, including those with disabilities.

*   **Plain Language Design:** Message templates are designed using clear, direct language. Avoid dense jargon and overly technical terms to ensure readability.
*   **Screen Reader Compatibility:** Public emails and portal notifications are formatted with clean, semantic HTML, proper alternative text (ALT text) for images, and clear headings to ensure compatibility with screen readers.
*   **High-Contrast Templates:** Email and portal templates feature high-contrast text and backgrounds to ensure readability for users with low vision.
*   **Dual-Language Layout Patterns:** In-app and email templates utilize dual-direction styling, rendering cleanly in RTL (Arabic) and LTR (English) layout configurations.

---

## 10. ENTERPRISE COMMUNICATION GOVERNANCE

The ECNCEF is managed under a structured governance framework to ensure consistency and compliance with administrative policies:

1.  **Template Ownership:** Every template family has an assigned business owner (e.g., the Director of the Consumer Protection Division is the owner of all consumer complaints templates).
2.  **Biannual Review Cycle:** Templates are reviewed twice a year to ensure alignment with current laws, branding updates, and accessibility standards.
3.  **Communication Committee:** Any new notification template or awareness campaign proposal must be reviewed and signed off by the communication committee before being deployed to production.
4.  **Continuous Analytics Optimization:** Campaign performance metrics (delivery rates, CSAT feedback, and response times) are reviewed quarterly to identify opportunities for improving engagement and system efficiency.
