/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * Module: National Commercial & Industrial Licensing Platform (Vision 2035)
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Award, ShieldCheck, FileText, Search, Plus, Trash2, 
  ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Download, 
  Eye, QrCode, Sparkles, RefreshCw, Play, Check, X, Bell, 
  BarChart2, Briefcase, FileCheck, HelpCircle, Scale, ShieldAlert,
  Layers, MapPin, ClipboardCheck, History, Clock, FileWarning, ExternalLink, Globe
} from "lucide-react";
import { 
  SovereignLicense, LicenseStatus, ComplianceStatus, InspectionRecord, 
  RenewalRecord, LicenseAmendmentRequest, LicensingDocument, AuditLogEntry, UserRole
} from "../types";
import { SUDANESE_STATES } from "../data";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";

interface LicensingPlatformProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
}

// 10 Government-Grade Personas for full compliance/security testing
type LicensingPersona = 
  | "company_rep"
  | "citizen"
  | "licensing_officer"
  | "technical_reviewer"
  | "inspector"
  | "dept_manager"
  | "director"
  | "undersecretary"
  | "minister"
  | "super_admin";

// Premium Initial Seed Data for Sovereign Licenses
const seedSovereignLicenses: SovereignLicense[] = [
  {
    id: "lic-1",
    licenseNumber: "LIC-SD-2026-9081",
    licenseTypeAr: "رخصة تشغيل صناعي وإنتاج حاصلات زراعية",
    licenseTypeEn: "Industrial Processing & Agricultural Crop Production License",
    category: "industrial",
    linkedCompanyId: "corp-1",
    linkedCompanyNameAr: "شركة زادنا للتطوير الزراعي والحيواني المساهمة العامة",
    linkedCompanyNameEn: "Zadna Agricultural & Animal Development Joint Stock Co.",
    registrationNumber: "CO-SD-2026-8012",
    linkedBranchId: "br-1",
    linkedBranchNameAr: "فرع ميناء بورتسودان اللوجستي",
    linkedBranchNameEn: "Port Sudan Logistics Branch",
    businessActivitiesAr: [
      "تصنيع وتعبئة الحبوب الزيتية والمستخلصات الطبيعية",
      "إدارة غرف التبريد اللوجستية للصادرات الزراعية"
    ],
    businessActivitiesEn: [
      "Processing & packaging of oilseeds & natural extracts",
      "Operation of temperature-controlled logistics for exports"
    ],
    issueDate: "2026-01-15",
    expiryDate: "2027-01-15",
    status: "active",
    complianceStatus: "compliant",
    capacityLimit: "15,000 طن سنوياً / Metric Tons Annually",
    inspections: [
      {
        id: "insp-1",
        date: "2026-04-10",
        inspectorName: "م. طارق العبيد (بلدية بورتسودان)",
        status: "passed",
        notesAr: "تم التفتيش الميداني على غرف التبريد والحرارة والمطابقة لمتطلبات الصحة والسلامة المهنية بنسبة 100%.",
        notesEn: "Field inspection of cold rooms completed. 100% compliance with environmental and industrial safety directives.",
        violationsFoundAr: [],
        violationsFoundEn: []
      }
    ],
    renewals: [],
    amendments: [],
    documents: [
      { id: "ldoc-1", nameAr: "رخصة التشغيل الموقعة سيادياً", nameEn: "Sovereign Operations License Certificate", type: "license", fileName: "Sovereign_Operations_License_LIC9081.pdf", fileSize: "1.8 MB", uploadedAt: "2026-01-15", version: 1 },
      { id: "ldoc-2", nameAr: "تقرير السلامة البيئية والمهنية", nameEn: "Environmental Safety Assessment", type: "technical", fileName: "Env_Safety_Zadna_PortSudan.pdf", fileSize: "3.2 MB", uploadedAt: "2026-01-12", version: 1 }
    ],
    auditHistory: [
      { id: "laud-1", actionAr: "تقديم طلب الترخيص وإرفاق خطة العمل المعتمدة", actionEn: "License application submitted with approved layout plan", actorName: "عوض الله أحمد عبدالجليل", actorRole: "CEO", timestamp: "2026-01-10T09:00:00Z" },
      { id: "laud-2", actionAr: "اعتماد التقرير الفني والتحقق من الملاءة المالية", actionEn: "Technical assessment approved and banking liquidity verified", actorName: "رندة التوم", actorRole: "Technical Reviewer", timestamp: "2026-01-13T11:45:00Z" },
      { id: "laud-3", actionAr: "إصدار وتوقيع رخصة التشغيل الفيدرالية برقم LIC-SD-2026-9081", actionEn: "Sovereign Federal License issued and signed under No. LIC-SD-2026-9081", actorName: "ديوان الوزير", actorRole: "Minister", timestamp: "2026-01-15T15:20:00Z" }
    ],
    notesAr: "ترخيص سيادي خاضع لبنود تشجيع الاستثمار الزراعي وفق خطة التنمية الوطنية.",
    notesEn: "Sovereign license subject to investment incentives under national strategic agricultural masterplan.",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ais-pre-jveltj6wsseafhkiulvfgw-76404771010.europe-west3.run.app/verify-license/LIC-SD-2026-9081",
    createdAt: "2026-01-10T09:00:00Z",
    updatedAt: "2026-04-10T14:00:00Z"
  },
  {
    id: "lic-2",
    licenseNumber: "LIC-SD-2026-4412",
    licenseTypeAr: "رخصة تشغيل وتصدير الصمغ العربي ومشتقاته",
    licenseTypeEn: "Gum Arabic Processing & Export Operations License",
    category: "commercial",
    linkedCompanyId: "corp-2",
    linkedCompanyNameAr: "شركة سنار للصمغ العربي والمنتجات التحويلية ذ.م.م",
    linkedCompanyNameEn: "Sennar Gum Arabic & Processing LLC",
    registrationNumber: "CO-SD-2026-4409",
    businessActivitiesAr: [
      "فرز وتدريج الصمغ العربي الطبيعي",
      "تصدير الصمغ العربي المصنع لدول الكوميسا والاتحاد الأوروبي"
    ],
    businessActivitiesEn: [
      "Grading and sorting of raw Gum Arabic",
      "Export of processed Gum Arabic to COMESA & EU markets"
    ],
    issueDate: "2026-03-05",
    expiryDate: "2027-03-05",
    status: "active",
    complianceStatus: "compliant",
    inspections: [
      {
        id: "insp-2",
        date: "2026-06-20",
        inspectorName: "أحمد النعيم (هيئة المواصفات والمقاييس)",
        status: "passed",
        notesAr: "مطابق لمعايير الجودة والفرز الميكانيكي وخلوه من الملوثات.",
        notesEn: "Fully meets technical grading and purity requirements of standard specifications.",
        violationsFoundAr: [],
        violationsFoundEn: []
      }
    ],
    renewals: [],
    amendments: [],
    documents: [
      { id: "ldoc-3", nameAr: "رخصة التصدير التجارية المعتمدة", nameEn: "Approved Commercial Export License", type: "license", fileName: "Export_License_Sennar_LIC4412.pdf", fileSize: "1.4 MB", uploadedAt: "2026-03-05", version: 1 }
    ],
    auditHistory: [
      { id: "laud-4", actionAr: "إرسال شهادة المطابقة البيئية واللوائح الإدارية", actionEn: "Environmental compliance certificate and administrative bylaws filed", actorName: "فاطمة آدم إبراهيم", actorRole: "Managing Director", timestamp: "2026-03-01T10:15:00Z" },
      { id: "laud-5", actionAr: "التوقيع النهائي على الترخيص التجاري بعد استيفاء رسوم التأسيس", actionEn: "Final commercial licensing approved after payment of incorporation fee", actorName: "إدارة التراخيص", actorRole: "Licensing Officer", timestamp: "2026-03-05T13:00:00Z" }
    ],
    notesAr: "صادرات الصمغ العربي مدعومة بنسبة 100% من الرسوم وفق توجيهات مجلس الوزراء.",
    notesEn: "Gum Arabic exports are 100% tariff-exempted according to federal business promotion directives.",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ais-pre-jveltj6wsseafhkiulvfgw-76404771010.europe-west3.run.app/verify-license/LIC-SD-2026-4412",
    createdAt: "2026-03-01T10:15:00Z",
    updatedAt: "2026-06-20T11:00:00Z"
  }
];

export default function LicensingPlatform({ currentLanguage, role }: LicensingPlatformProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"overview" | "apply" | "registry" | "ai_copilot" | "public_portal" | "audit_trail">("overview");
  
  // Licenses states
  const [licenses, setLicenses] = useState<SovereignLicense[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "commercial" | "industrial" | "special">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "pending" | "expired">("all");
  const [selectedLicense, setSelectedLicense] = useState<SovereignLicense | null>(null);

  // TESTING PERSONA SELECTOR (To test all 10 roles easily)
  const [testingPersona, setTestingPersona] = useState<LicensingPersona>("company_rep");

  // Application Wizard form state
  const [wizardStep, setWizardStep] = useState(1);
  const [appCategory, setAppCategory] = useState<"commercial" | "industrial" | "special">("commercial");
  const [appTypeAr, setAppTypeAr] = useState("");
  const [appTypeEn, setAppTypeEn] = useState("");
  const [linkedCompanyId, setLinkedCompanyId] = useState("");
  const [linkedBranchId, setLinkedBranchId] = useState("");
  const [capacityLimit, setCapacityLimit] = useState("");
  const [activitiesAr, setActivitiesAr] = useState("");
  const [activitiesEn, setActivitiesEn] = useState("");
  const [notesAr, setNotesAr] = useState("");
  const [notesEn, setNotesEn] = useState("");

  // Documents uploaded list (Simulated)
  const [uploadedDocs, setUploadedDocs] = useState<{ nameAr: string; nameEn: string; file: string; type: string }[]>([]);
  const [docTypeSelector, setDocTypeSelector] = useState<string>("technical");

  // Compliance Verification Status state (to block/allow issuance)
  const [complianceChecks, setComplianceChecks] = useState({
    registryValid: true,
    noOutstandingViolations: true,
    inspectionPassed: true,
    documentsComplete: false
  });

  // Amendment modal state
  const [isAmendModalOpen, setIsAmendModalOpen] = useState(false);
  const [amendType, setAmendType] = useState<LicenseAmendmentRequest["type"]>("activity_change");
  const [amendDescAr, setAmendDescAr] = useState("");
  const [amendDescEn, setAmendDescEn] = useState("");

  // Inspection modal state
  const [isInspModalOpen, setIsInspModalOpen] = useState(false);
  const [inspStatus, setInspStatus] = useState<"passed" | "failed">("passed");
  const [inspNotesAr, setInspNotesAr] = useState("");
  const [inspNotesEn, setInspNotesEn] = useState("");
  const [inspViolationsAr, setInspViolationsAr] = useState("");
  const [inspViolationsEn, setInspViolationsEn] = useState("");

  // Public portal search states
  const [portalSearchQuery, setPortalSearchQuery] = useState("");
  const [portalResult, setPortalResult] = useState<SovereignLicense | null>(null);
  const [portalSearched, setPortalSearched] = useState(false);

  // AI Assistant Custom Interaction State
  const [aiChatQuery, setAiChatQuery] = useState("");
  const [aiReply, setAiReply] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<{ id: string; textAr: string; textEn: string; date: string; type: string }[]>([]);

  // Registered Companies lookup (for dropdown)
  const [companies, setCompanies] = useState<any[]>([]);

  // Initialize
  useEffect(() => {
    // Load licenses
    const storedLic = localStorage.getItem("sdmci_licenses");
    if (storedLic) {
      setLicenses(JSON.parse(storedLic));
    } else {
      setLicenses(seedSovereignLicenses);
      localStorage.setItem("sdmci_licenses", JSON.stringify(seedSovereignLicenses));
    }

    // Load registered companies from localStorage (or defaults)
    const storedCorp = localStorage.getItem("sdmci_corporate_companies");
    if (storedCorp) {
      setCompanies(JSON.parse(storedCorp));
    } else {
      setCompanies([
        { id: "corp-1", legalNameAr: "شركة زادنا للتطوير الزراعي والحيواني المساهمة العامة", legalNameEn: "Zadna Agricultural & Animal Development Joint Stock Co.", registrationNumber: "CO-SD-2026-8012", status: "approved" },
        { id: "corp-2", legalNameAr: "شركة سنار للصمغ العربي والمنتجات التحويلية ذ.م.م", legalNameEn: "Sennar Gum Arabic & Processing LLC", registrationNumber: "CO-SD-2026-4409", status: "approved" }
      ]);
    }

    // Seeding notifications
    setNotifications([
      { id: "notif-lic-1", textAr: "تم إصدار رخصة تشغيل زادنا للتطوير الزراعي (LIC-SD-2026-9081) بنجاح.", textEn: "Zadna Agricultural Operations License (LIC-SD-2026-9081) issued successfully.", date: "2026-07-15", type: "success" },
      { id: "notif-lic-2", textAr: "تذكير: رخصة سنار للصمغ العربي خاضعة لمراجعة التزام ربع سنوية في غضون 30 يوماً.", textEn: "Reminder: Sennar Gum Arabic license is subject to quarterly compliance review in 30 days.", date: "2026-07-10", type: "info" }
    ]);
  }, []);

  // Save licenses helper
  const saveLicenses = (updatedList: SovereignLicense[]) => {
    setLicenses(updatedList);
    localStorage.setItem("sdmci_licenses", JSON.stringify(updatedList));
  };

  const addNotification = (textAr: string, textEn: string, type: "success" | "warning" | "danger" | "info") => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      textAr,
      textEn,
      date: new Date().toISOString().split("T")[0],
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Automated compliance checker for draft applications
  useEffect(() => {
    if (linkedCompanyId) {
      const matchedCompany = companies.find(c => c.id === linkedCompanyId);
      const isRegistryOk = matchedCompany ? (matchedCompany.status === "approved") : false;
      
      // Checking document requirements based on license category
      const hasEnoughDocs = uploadedDocs.length >= (appCategory === "industrial" ? 3 : 2);

      setComplianceChecks(prev => ({
        ...prev,
        registryValid: isRegistryOk,
        noOutstandingViolations: true, // Simulated
        inspectionPassed: true, // Simulated
        documentsComplete: hasEnoughDocs
      }));
    }
  }, [linkedCompanyId, uploadedDocs, appCategory, companies]);

  // Upload Document Simulation
  const handleUploadDocumentSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const docTypesMapAr: Record<string, string> = {
      technical: "تقرير السلامة الفنية",
      compliance: "شهادة مطابقة المواصفات والبيئة",
      supporting: "المستندات الثبوتية القانونية",
      inspection: "تقرير الفحص الميداني المعتمد"
    };
    const docTypesMapEn: Record<string, string> = {
      technical: "Technical Safety Report",
      compliance: "Environmental Compliance Certificate",
      supporting: "Legal Supporting Documentation",
      inspection: "Approved Inspection Report"
    };

    const newDoc = {
      nameAr: docTypesMapAr[docTypeSelector] || "مستند ترخيص إضافي",
      nameEn: docTypesMapEn[docTypeSelector] || "Additional Licensing Attachment",
      file: `Sovereign_Lic_Doc_${Date.now()}.pdf`,
      type: docTypeSelector
    };

    setUploadedDocs([...uploadedDocs, newDoc]);
    addNotification(`تم تحميل مستند: ${newDoc.nameAr}`, `Document uploaded: ${newDoc.nameEn}`, "success");
  };

  // Wizard application submission
  const handleLicenseSubmit = () => {
    if (!linkedCompanyId) {
      alert(currentLanguage === "ar" ? "يرجى تحديد الشركة المرتبطة لتمرير فحص الالتزام" : "Please select a linked company to pass compliance checks");
      return;
    }

    const matchedCompany = companies.find(c => c.id === linkedCompanyId);
    if (!matchedCompany) return;

    if (!complianceChecks.registryValid) {
      alert(currentLanguage === "ar" ? "خطأ: السجل التجاري لهذه الشركة غير معتمد سيادياً حالياً!" : "Error: The Commercial Registry for this company is not approved or inactive!");
      return;
    }

    if (!complianceChecks.documentsComplete) {
      alert(currentLanguage === "ar" ? `مطلوب على الأقل ${appCategory === "industrial" ? 3 : 2} مستندات حوكمة للتقديم!` : `A minimum of ${appCategory === "industrial" ? 3 : 2} governance documents are required!`);
      return;
    }

    const licNum = `LIC-SD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLicense: SovereignLicense = {
      id: `lic-${Date.now()}`,
      licenseNumber: licNum,
      licenseTypeAr: appTypeAr || (appCategory === "industrial" ? "رخصة تشغيل صناعي عامة" : "رخصة تجارية عامة"),
      licenseTypeEn: appTypeEn || (appCategory === "industrial" ? "General Industrial Operation License" : "General Commercial Trade License"),
      category: appCategory,
      linkedCompanyId: matchedCompany.id,
      linkedCompanyNameAr: matchedCompany.legalNameAr || matchedCompany.companyNameAr,
      linkedCompanyNameEn: matchedCompany.legalNameEn || matchedCompany.companyNameEn,
      registrationNumber: matchedCompany.registrationNumber,
      linkedBranchId: linkedBranchId || undefined,
      linkedBranchNameAr: linkedBranchId ? "الفرع المختار" : undefined,
      linkedBranchNameEn: linkedBranchId ? "Selected Branch" : undefined,
      businessActivitiesAr: activitiesAr ? activitiesAr.split(",").map(a => a.trim()) : ["نشاط عام معتمد بموجب قوانين التجارة"],
      businessActivitiesEn: activitiesEn ? activitiesEn.split(",").map(a => a.trim()) : ["Certified operational business activities"],
      status: "pending", // Workflow starts as pending/under review
      complianceStatus: "pending_inspection",
      capacityLimit: capacityLimit || undefined,
      inspections: [],
      renewals: [],
      amendments: [],
      documents: uploadedDocs.map((d, idx) => ({
        id: `ldoc-wizard-${idx}-${Date.now()}`,
        nameAr: d.nameAr,
        nameEn: d.nameEn,
        type: d.type as any,
        fileName: d.file,
        fileSize: "1.5 MB",
        uploadedAt: new Date().toISOString().split("T")[0],
        version: 1
      })),
      auditHistory: [
        {
          id: `laud-wizard-${Date.now()}`,
          actionAr: "تقديم طلب الترخيص الفيدرالي عبر البوابة الرقمية الموحدة",
          actionEn: "Federal licensing application filed via the Unified Digital Gateway",
          actorName: currentLanguage === "ar" ? "الممثل القانوني للشركة" : "Company Legal Representative",
          actorRole: "Representative",
          timestamp: new Date().toISOString()
        }
      ],
      notesAr: notesAr || undefined,
      notesEn: notesEn || undefined,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ais-pre-jveltj6wsseafhkiulvfgw-76404771010.europe-west3.run.app/verify-license/${licNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedLicenses = [newLicense, ...licenses];
    saveLicenses(updatedLicenses);
    addNotification(`تم تسجيل طلب الترخيص ${licNum} قيد التدقيق`, `License application ${licNum} registered under sovereign audit`, "info");
    
    // Reset wizard
    setAppTypeAr("");
    setAppTypeEn("");
    setLinkedCompanyId("");
    setCapacityLimit("");
    setActivitiesAr("");
    setActivitiesEn("");
    setUploadedDocs([]);
    setWizardStep(1);
    setSelectedLicense(newLicense);
    setActiveTab("registry");
  };

  // Workflow Approval Engine (Role-based steps)
  const handleWorkflowAction = (licenseId: string, nextStatus: LicenseStatus, notes?: string) => {
    const updated = licenses.map(l => {
      if (l.id === licenseId) {
        let actualIssueDate = l.issueDate;
        let actualExpiryDate = l.expiryDate;
        if (nextStatus === "active") {
          actualIssueDate = new Date().toISOString().split("T")[0];
          // Set expiry exactly 1 year from now
          const expiry = new Date();
          expiry.setFullYear(expiry.getFullYear() + 1);
          actualExpiryDate = expiry.toISOString().split("T")[0];
        }

        const auditItem: AuditLogEntry = {
          id: `laud-gov-act-${Date.now()}`,
          actionAr: `تحديث الحالة السيادية للرخصة إلى: ${nextStatus} (${notes || "لا توجد ملاحظات إضافية"})`,
          actionEn: `Sovereign status updated to: ${nextStatus.toUpperCase()} (${notes || "No extra comments"})`,
          actorName: `المسؤول الرقمي (${testingPersona.toUpperCase()})`,
          actorRole: testingPersona,
          timestamp: new Date().toISOString()
        };

        return {
          ...l,
          status: nextStatus,
          issueDate: actualIssueDate,
          expiryDate: actualExpiryDate,
          complianceStatus: nextStatus === "active" ? ("compliant" as ComplianceStatus) : l.complianceStatus,
          auditHistory: [auditItem, ...l.auditHistory],
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    });

    saveLicenses(updated);
    const updatedLicense = updated.find(l => l.id === licenseId) || null;
    setSelectedLicense(updatedLicense);
    addNotification(`تم تحديث حالة الترخيص بنجاح`, `Sovereign licensing action applied successfully`, "success");
  };

  // Submit Amendment Request
  const handleApplyAmendment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLicense) return;

    const newAmend: LicenseAmendmentRequest = {
      id: `lam-${Date.now()}`,
      licenseId: selectedLicense.id,
      type: amendType,
      descriptionAr: amendDescAr || `طلب تعديل الترخيص: ${amendType}`,
      descriptionEn: amendDescEn || `License amendment requested: ${amendType}`,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    const auditItem: AuditLogEntry = {
      id: `laud-amend-${Date.now()}`,
      actionAr: `تقديم طلب تعديل ترخيص رسمي: ${amendType}`,
      actionEn: `Submitted formal license amendment petition: ${amendType}`,
      actorName: currentLanguage === "ar" ? "مفوض الشركة" : "Company Commissioner",
      actorRole: "Representative",
      timestamp: new Date().toISOString()
    };

    const updated = licenses.map(l => {
      if (l.id === selectedLicense.id) {
        return {
          ...l,
          amendments: [newAmend, ...l.amendments],
          auditHistory: [auditItem, ...l.auditHistory],
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    });

    saveLicenses(updated);
    setSelectedLicense(updated.find(l => l.id === selectedLicense.id) || null);
    setIsAmendModalOpen(false);
    setAmendDescAr("");
    setAmendDescEn("");
    addNotification(`تم استلام طلب تعديل الترخيص`, `License amendment request registered successfully`, "info");
  };

  // Submit/Process License Renewal Online
  const handleRenewLicenseOnline = (licenseId: string) => {
    const updated = licenses.map(l => {
      if (l.id === licenseId) {
        // Increment expiry date by 1 year
        let newExpDate = "2028-01-15";
        if (l.expiryDate) {
          const currentExp = new Date(l.expiryDate);
          currentExp.setFullYear(currentExp.getFullYear() + 1);
          newExpDate = currentExp.toISOString().split("T")[0];
        }

        const renewalRecord: RenewalRecord = {
          id: `lren-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          status: "approved",
          feePaid: l.category === "industrial" ? 75000 : 35000,
          expiryDate: newExpDate,
          notesAr: "تم تجديد رخصة التشغيل الفيدرالية عبر فحص الالتزام الذكي التلقائي بنجاح.",
          notesEn: "Sovereign license renewed through automated smart compliance checks."
        };

        const auditItem: AuditLogEntry = {
          id: `laud-ren-${Date.now()}`,
          actionAr: `تجديد الترخيص بنجاح وتمديد الصلاحية إلى ${newExpDate}`,
          actionEn: `License renewed successfully, extending validity to ${newExpDate}`,
          actorName: "بوابة التراخيص الرقمية الموحدة",
          actorRole: "Automated System",
          timestamp: new Date().toISOString()
        };

        return {
          ...l,
          expiryDate: newExpDate,
          status: "active" as LicenseStatus,
          complianceStatus: "compliant" as ComplianceStatus,
          renewals: [renewalRecord, ...l.renewals],
          auditHistory: [auditItem, ...l.auditHistory],
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    });

    saveLicenses(updated);
    setSelectedLicense(updated.find(l => l.id === licenseId) || null);
    addNotification(`تم تجديد الترخيص الفيدرالي لعام إضافي`, `Sovereign license renewed successfully for an additional year`, "success");
  };

  // Trigger On-Site Compliance Inspection
  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLicense) return;

    const violationsArList = inspViolationsAr ? inspViolationsAr.split(",").map(v => v.trim()) : [];
    const violationsEnList = inspViolationsEn ? inspViolationsEn.split(",").map(v => v.trim()) : [];

    const newInsp: InspectionRecord = {
      id: `insp-record-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      inspectorName: `المفتش السيادي (${testingPersona.toUpperCase()})`,
      status: inspStatus,
      notesAr: inspNotesAr || "تم التفتيش الميداني وإرسال التقرير للمطابقة.",
      notesEn: inspNotesEn || "Field audit completed and matching assessment filed.",
      violationsFoundAr: violationsArList,
      violationsFoundEn: violationsEnList
    };

    const updatedCompliance: ComplianceStatus = 
      inspStatus === "failed" 
        ? "critical_violation" 
        : "compliant";

    const auditItem: AuditLogEntry = {
      id: `laud-insp-${Date.now()}`,
      actionAr: `تسجيل تقرير فحص ميداني رسمي: النتيجة ${inspStatus === "passed" ? "مطابق" : "مخالف"}`,
      actionEn: `Official field audit logged: Result ${inspStatus.toUpperCase()}`,
      actorName: `ديوان الرقابة الميدانية`,
      actorRole: "Inspector",
      timestamp: new Date().toISOString()
    };

    const updated = licenses.map(l => {
      if (l.id === selectedLicense.id) {
        return {
          ...l,
          complianceStatus: updatedCompliance,
          inspections: [newInsp, ...l.inspections],
          auditHistory: [auditItem, ...l.auditHistory],
          status: inspStatus === "failed" ? ("suspended" as LicenseStatus) : l.status,
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    });

    saveLicenses(updated);
    setSelectedLicense(updated.find(l => l.id === selectedLicense.id) || null);
    setIsInspModalOpen(false);
    setInspNotesAr("");
    setInspNotesEn("");
    setInspViolationsAr("");
    setInspViolationsEn("");
    addNotification(`تم تسجيل تقرير الرقابة والمطابقة الميدانية`, `Field audit report recorded for compliance file`, "success");
  };

  // Public Portal verification query
  const handlePortalVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setPortalSearched(true);
    const matched = licenses.find(l => 
      l.licenseNumber.toLowerCase() === portalSearchQuery.trim().toLowerCase()
    );
    setPortalResult(matched || null);
  };

  // AI assistant expert licensing recommendations
  const handleAiConsult = async (queryPreset?: string) => {
    const activeQuery = queryPreset || aiChatQuery;
    if (!activeQuery) return;

    setAiLoading(true);
    setTimeout(() => {
      let arResponse = "";
      let enResponse = "";
      let checklistAr: string[] = [];
      let checklistEn: string[] = [];

      if (activeQuery.includes("صناعي") || activeQuery.includes("مصنع") || activeQuery.includes("industrial") || activeQuery.includes("factory")) {
        arResponse = "لتأسيس منشأة صناعية أو معمل إنتاج في جمهورية السودان لعام 2026، يجب حوكمة وتوفير التراخيص الفيدرالية التالية بالتنسيق مع ديوان الرقابة البيئية والمواصفات:";
        enResponse = "To establish an industrial plant or production facility in Sudan, you must obtain the following federal licensing packages in full alignment with the Environmental Safety Directorate:";
        checklistAr = [
          "رخصة تشغيل صناعي (مع تبيان خطوط الإنتاج والقدرة الاستيعابية).",
          "شهادة السلامة والوقاية من الدفاع المدني.",
          "شهادة المطابقة البيئية والصحية الصادرة من وزارة الصحة الفيدرالية.",
          "عقد التسجيل المعتمد في السجل التجاري الموحد."
        ];
        checklistEn = [
          "Industrial Operations License (with explicit line capacity declarations).",
          "Civil Defense Fire & Occupational Safety Clearance.",
          "Federal Environmental Compliance assessment certification.",
          "Active status registration certificate in the Unified Commercial Registry."
        ];
      } else if (activeQuery.includes("تجديد") || activeQuery.includes("تعديل") || activeQuery.includes("renew") || activeQuery.includes("amend")) {
        arResponse = "تجديد وتعديل رخص التشغيل يتم إلكترونياً بالكامل عبر نظام المطابقة الذكي التلقائي. يتطلب تجديد الترخيص الفيدرالي الآتي:";
        enResponse = "Renewals and amendments are processed instantly online via the automated smart compliance validation engine. Requirements include:";
        checklistAr = [
          "خلو السجل من أي مخالفات ميدانية مسجلة لدى المفتشين.",
          "صلاحية ونشاط السجل التجاري والشركة بشكل كامل.",
          "سداد الرسوم الفيدرالية المحددة عبر قنوات الدفع الحكومية الموحدة."
        ];
        checklistEn = [
          "Clean compliance file with zero unresolved field inspection citations.",
          "Fully active company status in the Sovereign Commercial Registry.",
          "Prompt payment of licensing tariffs via integrated government channels."
        ];
      } else {
        arResponse = "مرحباً بك في المستشار الذكي لمنصة التراخيص الفيدرالية الموحدة. يمكنني توجيهك في اختيار الفئة المناسبة (رخصة تجارية، تشغيل صناعي، تصريح خاص) وتحليل الملاءة الفنية واستباق شروط الموافقة.";
        enResponse = "Welcome to the Sovereign Licensing AI Copilot. I can guide you through choosing the proper category (Commercial, Industrial, Special Permit) and analyzing your legal completeness.";
        checklistAr = ["حدد فئة النشاط لبدء التحليل الفني.", "تأكد من إرفاق شهادة إيداع رأس المال بوزارة المالية."];
        checklistEn = ["Specify your main business activity to trigger technical assessment.", "Ensure your capital statement is verified and attached."];
      }

      setAiReply({
        query: activeQuery,
        ar: arResponse,
        en: enResponse,
        checklistAr,
        checklistEn
      });
      setAiLoading(false);
      setAiChatQuery("");
    }, 1100);
  };

  // Filters application
  const filteredLicenses = licenses.filter(l => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      l.licenseNumber.toLowerCase().includes(query) ||
      l.linkedCompanyNameAr.toLowerCase().includes(query) ||
      l.linkedCompanyNameEn.toLowerCase().includes(query) ||
      l.licenseTypeAr.toLowerCase().includes(query) ||
      l.licenseTypeEn.toLowerCase().includes(query) ||
      l.registrationNumber.toLowerCase().includes(query);

    const matchesCategory = categoryFilter === "all" || l.category === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter !== "all") {
      matchesStatus = l.status === statusFilter;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Recharts Chart Configs & Datasets
  const chartDataCategories = [
    { name: currentLanguage === "ar" ? "رخص تجارية" : "Commercial", value: licenses.filter(l => l.category === "commercial").length },
    { name: currentLanguage === "ar" ? "رخص صناعية" : "Industrial", value: licenses.filter(l => l.category === "industrial").length },
    { name: currentLanguage === "ar" ? "تصاريح خاصة" : "Special Permits", value: licenses.filter(l => l.category === "special").length }
  ].filter(d => d.value > 0);

  const chartDataCompliance = [
    { name: currentLanguage === "ar" ? "ملتزم" : "Compliant", value: licenses.filter(l => l.complianceStatus === "compliant").length },
    { name: currentLanguage === "ar" ? "مخالفات معلقة" : "Non-Compliant", value: licenses.filter(l => l.complianceStatus === "non_compliant" || l.complianceStatus === "critical_violation").length },
    { name: currentLanguage === "ar" ? "قيد التدقيق" : "Pending Inspection", value: licenses.filter(l => l.complianceStatus === "pending_inspection").length }
  ].filter(d => d.value > 0);

  const COLORS_PRIMARY = ["#007A33", "#C5A059", "#1E3A8A", "#D97706", "#9333EA"];

  return (
    <div id="sovereign-licensing-platform" className="space-y-6">
      
      {/* Platform Branding Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="bg-[#007A33]/10 text-sudan-green px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-[#007A33]/20">
            {currentLanguage === "ar" ? "منصة التراخيص الوطنية الموحدة" : "Unified National Licensing Gateway"}
          </span>
          <h2 className="text-xl font-extrabold text-[#1E293B] flex items-center gap-2 mt-2">
            <Scale className="h-6 w-6 text-sudan-green" />
            {currentLanguage === "ar" ? "إدارة وتدقيق رخص التشغيل والمطابقة السيادية" : "Sovereign Commercial & Industrial Licensing Platform"}
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
            {currentLanguage === "ar" 
              ? "حوكمة متكاملة لإصدار، تجديد، تعديل، ورقابة تراخيص المصانع والأنشطة التجارية في جمهورية السودان تماشياً مع رؤية 2035 الرقمية السيادية."
              : "End-to-end digital lifecycle for issuing, renewing, amending, and auditing business & factory licenses in compliance with Sudan's Vision 2035."}
          </p>
        </div>

        {/* Tab Navigator */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F4F6F5] p-1.5 rounded-2xl border border-gray-200">
          {[
            { id: "overview", labelAr: "الحصيلة الرقابية", labelEn: "Analytics", icon: BarChart2 },
            { id: "registry", labelAr: "دليل الرخص", labelEn: "Registry", icon: Briefcase },
            { id: "apply", labelAr: "تقديم طلب ترخيص", labelEn: "Apply Online", icon: Plus },
            { id: "ai_copilot", labelAr: "المستشار الفني الذكي", labelEn: "Licensing AI", icon: Sparkles },
            { id: "public_portal", labelAr: "الاستعلام العام برمز QR", labelEn: "Verification Portal", icon: Globe },
            { id: "audit_trail", labelAr: "سجل الرقابة والأمان", labelEn: "Immutable Logs", icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedLicense(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isTabActive 
                    ? "bg-sudan-green text-white shadow-sm" 
                    : "text-gray-500 hover:text-sudan-green hover:bg-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TESTING PERSONA SWITCHER - CRITICAL FOR DEMOING COMPLIANCE & GOV WORKFLOWS */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <h4 className="text-xs font-extrabold text-slate-300">
              {currentLanguage === "ar" ? "مختبر الصلاحيات ومصفوفة الحوكمة السيادية (10 أدوار)" : "Sovereign Privilege Matrix Testing Panel (10 Personas)"}
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {currentLanguage === "ar" 
                ? "اختر دوراً لمحاكاة صلاحيات مراجعي التراخيص، المفتشين، أو منصب الوزير في التوقيع والاعتماد." 
                : "Switch roles to simulate compliance officers, on-site inspectors, undersecretaries, or ministerial signing authority."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={testingPersona}
            onChange={(e) => setTestingPersona(e.target.value as any)}
            className="bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-black outline-none border border-slate-700 cursor-pointer focus:border-sudan-gold"
          >
            <option value="company_rep">{currentLanguage === "ar" ? "مفوض وممثل الشركة (Applicant)" : "Company Representative"}</option>
            <option value="citizen">{currentLanguage === "ar" ? "مواطن مستعلم (Citizen)" : "Citizen / Public"}</option>
            <option value="licensing_officer">{currentLanguage === "ar" ? "ضابط التراخيص الحكومي (Licensing Officer)" : "Licensing Officer"}</option>
            <option value="technical_reviewer">{currentLanguage === "ar" ? "المراجع الفني والهندسي (Technical Reviewer)" : "Technical Reviewer"}</option>
            <option value="inspector">{currentLanguage === "ar" ? "مفتش الصحة والرقابة (Inspector)" : "Inspector"}</option>
            <option value="dept_manager">{currentLanguage === "ar" ? "مدير ديوان التراخيص (Dept Manager)" : "Department Manager"}</option>
            <option value="director">{currentLanguage === "ar" ? "المدير العام للسجل (Director)" : "Director General"}</option>
            <option value="undersecretary">{currentLanguage === "ar" ? "وكيل الوزارة المفوض (Undersecretary)" : "Undersecretary"}</option>
            <option value="minister">{currentLanguage === "ar" ? "معالي الوزير السيادي (Minister)" : "Sovereign Minister"}</option>
            <option value="super_admin">{currentLanguage === "ar" ? "المدير التقني الخارق (Super Admin)" : "Super Administrator"}</option>
          </select>

          <span className="bg-sudan-gold/25 text-sudan-gold text-[10px] font-black px-2.5 py-1 rounded-lg border border-sudan-gold/30 uppercase">
            {testingPersona}
          </span>
        </div>
      </div>

      {/* Main Tab Views */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Statistical KPI widgets */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{currentLanguage === "ar" ? "التراخيص الفيدرالية النشطة" : "Active Licenses"}</span>
                    <Award className="h-5 w-5 text-sudan-green" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 mt-2">
                    {licenses.filter(l => l.status === "active").length}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-extrabold mt-1">✓ {licenses.filter(l => l.complianceStatus === "compliant").length} {currentLanguage === "ar" ? "مستوفية لمعايير المطابقة" : "Compliant with regulations"}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{currentLanguage === "ar" ? "الرخص قيد التدقيق الفني" : "Under Technical Review"}</span>
                    <Clock className="h-5 w-5 text-sudan-gold" />
                  </div>
                  <h3 className="text-3xl font-black text-amber-600 mt-2">
                    {licenses.filter(l => l.status === "pending" || l.status === "under_review").length}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">{currentLanguage === "ar" ? "متوسط الفحص: 48 ساعة" : "Average queue: 48h SLA"}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{currentLanguage === "ar" ? "مخالفات الرقابة والمطابقة" : "Compliance Violations"}</span>
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-3xl font-black text-red-600 mt-2">
                    {licenses.filter(l => l.complianceStatus === "critical_violation").length}
                  </h3>
                  <p className="text-[10px] text-red-500 font-extrabold mt-1">⚠ {currentLanguage === "ar" ? "تتطلب تفتيشاً ميدانياً عاجلاً" : "Urgent action required"}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{currentLanguage === "ar" ? "التراخيص المجددة سيادياً" : "Renewed This Quarter"}</span>
                    <RefreshCw className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-black text-blue-600 mt-2">
                    {licenses.reduce((sum, l) => sum + l.renewals.length, 0) + 1}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ {currentLanguage === "ar" ? "ربط فوري بالدفع الموحد" : "Fully digital payments"}</p>
                </div>
              </div>

              {/* Graphic Charts block */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Categories distribution */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-4">
                    {currentLanguage === "ar" ? "توزيع التراخيص الوطنية حسب الفئة" : "Licensing Category Allocation"}
                  </h4>
                  {chartDataCategories.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartDataCategories}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {chartDataCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS_PRIMARY[index % COLORS_PRIMARY.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-xs text-gray-400 font-bold">
                      {currentLanguage === "ar" ? "لا توجد بيانات كافية حالياً" : "No sufficient licensing data"}
                    </div>
                  )}
                </div>

                {/* Chart 2: Compliance rates */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-4">
                    {currentLanguage === "ar" ? "تحليل حالة التزام ومطابقة الرخص" : "Licensing Compliance Audit Breakdown"}
                  </h4>
                  {chartDataCompliance.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartDataCompliance}>
                          <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                          <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#007A33" radius={[10, 10, 0, 0]}>
                            {chartDataCompliance.map((entry, index) => (
                              <Cell key={`cell-comp-${index}`} fill={index === 0 ? "#007A33" : index === 1 ? "#DC2626" : "#D97706"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-xs text-gray-400 font-bold">
                      {currentLanguage === "ar" ? "لا توجد بيانات كافية" : "No statistics available"}
                    </div>
                  )}
                </div>

              </div>

              {/* Geographic and Sector compliance notice */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <Bell className="h-4.5 w-4.5 text-sudan-gold animate-pulse" />
                  {currentLanguage === "ar" ? "لوحة تنبيهات الالتزام والرقابة الفيدرالية النشطة" : "Active Federal Compliance & Licensing Alerts"}
                </h4>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${n.type === "success" ? "bg-emerald-500" : "bg-blue-500"}`} />
                        <span className="text-xs font-black text-slate-700">
                          {currentLanguage === "ar" ? n.textAr : n.textEn}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">{n.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CENTRAL LICENSE REGISTRY */}
          {activeTab === "registry" && (
            <div className="space-y-6">
              
              {/* Filter controls */}
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                  <input
                    type="text"
                    placeholder={currentLanguage === "ar" ? "البحث برقم الترخيص، اسم الشركة، الأنشطة، أو رقم السجل التجاري..." : "Search by license number, company name, registration ID..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green transition-all"
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green cursor-pointer"
                  >
                    <option value="all">{currentLanguage === "ar" ? "كل الفئات" : "All Categories"}</option>
                    <option value="commercial">{currentLanguage === "ar" ? "تراخيص تجارية" : "Commercial"}</option>
                    <option value="industrial">{currentLanguage === "ar" ? "تراخيص صناعية" : "Industrial"}</option>
                    <option value="special">{currentLanguage === "ar" ? "تصاريح خاصة" : "Special Permits"}</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green cursor-pointer"
                  >
                    <option value="all">{currentLanguage === "ar" ? "كل الحالات" : "All Statuses"}</option>
                    <option value="active">{currentLanguage === "ar" ? "نشطة" : "Active"}</option>
                    <option value="suspended">{currentLanguage === "ar" ? "موقوفة" : "Suspended"}</option>
                    <option value="pending">{currentLanguage === "ar" ? "قيد المراجعة" : "Pending Approval"}</option>
                    <option value="expired">{currentLanguage === "ar" ? "منتهية" : "Expired"}</option>
                  </select>
                </div>
              </div>

              {/* Master-Detail Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Master List Column */}
                <div className={`space-y-4 ${selectedLicense ? "lg:col-span-5" : "lg:col-span-12"}`}>
                  {filteredLicenses.length > 0 ? (
                    filteredLicenses.map(lic => {
                      const isSelected = selectedLicense?.id === lic.id;
                      return (
                        <div
                          key={lic.id}
                          onClick={() => setSelectedLicense(lic)}
                          className={`p-5 bg-white rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                            isSelected ? "border-sudan-green ring-2 ring-sudan-green/10" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[9px] uppercase font-bold tracking-widest text-sudan-gold bg-sudan-gold/10 px-2.5 py-1 rounded-full border border-sudan-gold/15">
                                {lic.category.toUpperCase()}
                              </span>
                              <h4 className="text-sm font-extrabold text-slate-800 mt-2">
                                {currentLanguage === "ar" ? lic.licenseTypeAr : lic.licenseTypeEn}
                              </h4>
                              <p className="text-[11px] text-gray-400 font-bold mt-1.5">
                                🏢 {currentLanguage === "ar" ? lic.linkedCompanyNameAr : lic.linkedCompanyNameEn}
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-1.5">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                                lic.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                                lic.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-300 animate-pulse" :
                                lic.status === "suspended" ? "bg-red-50 text-red-700 border-red-300" :
                                "bg-gray-100 text-gray-600 border-gray-300"
                              }`}>
                                {currentLanguage === "ar" 
                                  ? (lic.status === "active" ? "نشط" : lic.status === "pending" ? "تحت التدقيق" : "موقوف")
                                  : lic.status.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono font-bold">
                                {lic.licenseNumber}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 text-[11px] text-gray-500 font-bold">
                            <div>
                              <span className="text-gray-400">{currentLanguage === "ar" ? "حالة الالتزام والمطابقة:" : "Compliance Status:"}</span>
                              <p className={`font-black mt-0.5 ${
                                lic.complianceStatus === "compliant" ? "text-emerald-600" :
                                lic.complianceStatus === "critical_violation" ? "text-red-600" : "text-amber-600"
                              }`}>
                                {currentLanguage === "ar" 
                                  ? (lic.complianceStatus === "compliant" ? "مطابق تماماً" : lic.complianceStatus === "critical_violation" ? "مخالفة معلقة" : "قيد التدقيق")
                                  : lic.complianceStatus.replace("_", " ").toUpperCase()}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400">{currentLanguage === "ar" ? "تاريخ الانتهاء:" : "Expiry Date:"}</span>
                              <p className="text-slate-700 font-extrabold mt-0.5">{lic.expiryDate || "Pending"}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
                      <FileWarning className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-400 font-bold">
                        {currentLanguage === "ar" ? "لا توجد تراخيص مطابقة لخيارات البحث" : "No licenses found matching the filters"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Detail Panel Column */}
                {selectedLicense && (
                  <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                    <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                      <div>
                        <span className="bg-[#007A33]/15 text-sudan-green px-2.5 py-1 rounded-full text-[9px] font-black uppercase border border-[#007A33]/25">
                          {selectedLicense.category.toUpperCase()}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-800 mt-2">
                          {currentLanguage === "ar" ? selectedLicense.licenseTypeAr : selectedLicense.licenseTypeEn}
                        </h3>
                        <p className="text-xs text-gray-400 font-extrabold mt-1">
                          {currentLanguage === "ar" ? `الرخصة الوطنية الفيدرالية: ${selectedLicense.licenseNumber}` : `Federal License ID: ${selectedLicense.licenseNumber}`}
                        </p>
                      </div>

                      <button 
                        onClick={() => setSelectedLicense(null)}
                        className="p-1 text-gray-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* License Information Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{currentLanguage === "ar" ? "الشركة المرتبطة" : "Linked Corporate Entity"}</span>
                        <p className="text-slate-800 mt-1">{currentLanguage === "ar" ? selectedLicense.linkedCompanyNameAr : selectedLicense.linkedCompanyNameEn}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{currentLanguage === "ar" ? `سجل تجاري رقم: ${selectedLicense.registrationNumber}` : `CR No: ${selectedLicense.registrationNumber}`}</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{currentLanguage === "ar" ? "الفرع المرخص" : "Licensed Branch Outlet"}</span>
                        <p className="text-slate-800 mt-1">
                          {selectedLicense.linkedBranchNameAr 
                            ? (currentLanguage === "ar" ? selectedLicense.linkedBranchNameAr : selectedLicense.linkedBranchNameEn)
                            : (currentLanguage === "ar" ? "الفرع الرئيسي" : "Headquarters")}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{currentLanguage === "ar" ? "تواريخ الصلاحية الفيدرالية" : "Validity & Issue Ledger"}</span>
                        <p className="text-slate-800 mt-1">{currentLanguage === "ar" ? `الإصدار: ${selectedLicense.issueDate || "تحت الفحص"}` : `Issued: ${selectedLicense.issueDate || "Under Review"}`}</p>
                        <p className="text-slate-800 mt-0.5">{currentLanguage === "ar" ? `الانتهاء: ${selectedLicense.expiryDate || "تحت الفحص"}` : `Expires: ${selectedLicense.expiryDate || "Under Review"}`}</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{currentLanguage === "ar" ? "حالة الالتزام الميداني" : "Field Compliance Integrity"}</span>
                        <p className={`mt-1 font-black ${
                          selectedLicense.complianceStatus === "compliant" ? "text-emerald-600" :
                          selectedLicense.complianceStatus === "critical_violation" ? "text-red-600" : "text-amber-600"
                        }`}>
                          ● {currentLanguage === "ar" 
                            ? (selectedLicense.complianceStatus === "compliant" ? "مطابق للشروط والمواصفات" : selectedLicense.complianceStatus === "critical_violation" ? "مخالفة مرصودة بالتقرير" : "قيد جدولة التفتيش")
                            : selectedLicense.complianceStatus.replace("_", " ").toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Industrial specific parameters */}
                    {selectedLicense.capacityLimit && (
                      <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-xs font-bold">
                        <span className="text-[10px] text-amber-800 uppercase tracking-wider">{currentLanguage === "ar" ? "حدود السعة التشغيلية الفنية" : "Sovereign Engineering & Capacity Limit"}</span>
                        <p className="text-amber-950 mt-1">{selectedLicense.capacityLimit}</p>
                      </div>
                    )}

                    {/* Allowed Business Activities */}
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase font-extrabold text-slate-500">{currentLanguage === "ar" ? "الأنشطة التجارية المرخص بمزاولتها" : "Authorized Operational Activities"}</h4>
                      <ul className="space-y-1.5">
                        {(currentLanguage === "ar" ? selectedLicense.businessActivitiesAr : selectedLicense.businessActivitiesEn).map((act, i) => (
                          <li key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2">
                            <Check className="h-4 w-4 text-sudan-green flex-shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interactive Actions Panel based on Persona Role */}
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                        <Scale className="h-4 w-4 text-sudan-green" />
                        {currentLanguage === "ar" ? "ديوان القرارات والعمليات الفيدرالية" : "Sovereign Licensing Action Center"}
                      </h4>

                      {/* ACTIONS FOR COMPANY REP (APPLICANT) */}
                      {testingPersona === "company_rep" && (
                        <div className="flex flex-wrap items-center gap-2">
                          {selectedLicense.status === "active" && (
                            <>
                              <button
                                onClick={() => handleRenewLicenseOnline(selectedLicense.id)}
                                className="bg-sudan-green hover:bg-[#006028] text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                                {currentLanguage === "ar" ? "تجديد فوري للدورة القادمة" : "Instant License Renewal"}
                              </button>

                              <button
                                onClick={() => setIsAmendModalOpen(true)}
                                className="bg-white border border-gray-300 hover:bg-slate-50 text-slate-700 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                {currentLanguage === "ar" ? "تقديم طلب تعديل ترخيص" : "Request Amendment"}
                              </button>
                            </>
                          )}

                          {selectedLicense.status === "pending" && (
                            <p className="text-[11px] text-amber-600 font-extrabold bg-amber-50/80 px-3 py-2 rounded-xl border border-amber-100">
                              ⚙ {currentLanguage === "ar" ? "طلبك قيد المراجعة والتدقيق بواسطة وزارة التجارة والصناعة حالياً." : "Your application is currently being audited by technical officers."}
                            </p>
                          )}
                        </div>
                      )}

                      {/* ACTIONS FOR GOVT OFFICERS / INSPECTOR / MANAGERS / MINISTERS */}
                      {(testingPersona === "licensing_officer" || testingPersona === "technical_reviewer" || testingPersona === "inspector" || testingPersona === "dept_manager" || testingPersona === "minister" || testingPersona === "super_admin") && (
                        <div className="space-y-2">
                          <p className="text-[10px] text-slate-500 font-black">
                            {currentLanguage === "ar" ? `تحكم سيادي بصفتك: ${testingPersona.toUpperCase()}` : `Sovereign controls active for role: ${testingPersona.toUpperCase()}`}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {selectedLicense.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleWorkflowAction(selectedLicense.id, "active", "Approved by the licensing department")}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="h-4 w-4" />
                                  {currentLanguage === "ar" ? "التصديق والاعتماد النهائي" : "Approve & Issue Certificate"}
                                </button>
                                <button
                                  onClick={() => handleWorkflowAction(selectedLicense.id, "cancelled", "Rejected during legal audit")}
                                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                                >
                                  <X className="h-4 w-4" />
                                  {currentLanguage === "ar" ? "رفض الطلب" : "Reject Petition"}
                                </button>
                              </>
                            )}

                            {selectedLicense.status === "active" && (
                              <>
                                <button
                                  onClick={() => setIsInspModalOpen(true)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                                >
                                  <ClipboardCheck className="h-4 w-4" />
                                  {currentLanguage === "ar" ? "تسجيل تفتيش ميداني" : "Log Site Audit"}
                                </button>

                                <button
                                  onClick={() => handleWorkflowAction(selectedLicense.id, "suspended", "Emergency regulatory suspension")}
                                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                  {currentLanguage === "ar" ? "إيقاف احترازي مؤقت" : "Emergency Suspend"}
                                </button>
                              </>
                            )}

                            {selectedLicense.status === "suspended" && (
                              <button
                                onClick={() => handleWorkflowAction(selectedLicense.id, "active", "Reactivated after compliance matching")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                              >
                                <Play className="h-4 w-4" />
                                {currentLanguage === "ar" ? "رفع الإيقاف وتفعيل الرخصة" : "Reactivate Operations"}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* QR Code / sovereign validation watermark block */}
                    <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center gap-4">
                      {selectedLicense.qrCodeUrl && (
                        <div className="p-2 bg-white rounded-2xl border border-gray-100 flex-shrink-0">
                          <img 
                            src={selectedLicense.qrCodeUrl} 
                            alt="Sovereign QR Seal" 
                            className="h-24 w-24 object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="text-xs font-bold space-y-1">
                        <h5 className="text-slate-800 flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-sudan-gold" />
                          {currentLanguage === "ar" ? "وثيقة رسمية سيادية مشفرة" : "Sovereign Digital QR Watermark"}
                        </h5>
                        <p className="text-gray-400 leading-relaxed text-[11px]">
                          {currentLanguage === "ar" 
                            ? "تحمل هذه الرخصة روعة التصديق الرقمي الوطني لوزارة التجارة والصناعة. يمكن للجمهور والشركاء التحقق الفوري من صلاحية الرخصة عبر أي ماسح ضوئي بشكل فوري."
                            : "This operation license carries the cryptographic validation seal of Sudan's Digital Transformation Ministry. Partners can verify status instantly via QR scan."}
                        </p>
                      </div>
                    </div>

                    {/* Audit Trail list */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-extrabold text-slate-500 flex items-center gap-1">
                        <History className="h-4 w-4 text-slate-400" />
                        {currentLanguage === "ar" ? "سجل التعديلات والقرارات القانونية غير القابل للتعديل" : "Sovereign License Change History"}
                      </h4>
                      <div className="space-y-2 border-l-2 border-slate-100 pl-4 space-y-3">
                        {selectedLicense.auditHistory.map((h, i) => (
                          <div key={i} className="relative text-xs font-bold">
                            <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-sudan-green" />
                            <p className="text-slate-800">{currentLanguage === "ar" ? h.actionAr : h.actionEn}</p>
                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{h.actorName} ({h.actorRole}) • {h.timestamp.substring(0, 16).replace("T", " ")}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 3: APPLY FOR LICENSE (WIZARD ENGINE) */}
          {activeTab === "apply" && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              
              {/* Wizard progress header bar */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {currentLanguage === "ar" ? "ديوان تقديم التراخيص الرقمية الموحدة" : "Unified Federal License Submission Portal"}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    {currentLanguage === "ar" ? `الخطوة ${wizardStep} من 4` : `Step ${wizardStep} of 4`}
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map(step => (
                    <div 
                      key={step} 
                      className={`h-2.5 w-10 rounded-full transition-all ${
                        wizardStep >= step ? "bg-sudan-green" : "bg-gray-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: CATEGORY SELECTION */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">{currentLanguage === "ar" ? "1. حدد تصنيف ونوع الترخيص المراد تقديمه" : "1. Choose License Classification & Subtype"}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      onClick={() => setAppCategory("commercial")}
                      className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                        appCategory === "commercial" ? "border-sudan-green bg-[#007A33]/5 ring-1 ring-sudan-green" : "border-gray-200 hover:border-slate-300"
                      }`}
                    >
                      <Award className="h-8 w-8 text-sudan-green mb-3" />
                      <h5 className="text-sm font-extrabold text-slate-800">{currentLanguage === "ar" ? "رخصة تجارية عامة" : "Commercial License"}</h5>
                      <p className="text-[11px] text-gray-400 font-bold mt-1 leading-relaxed">
                        {currentLanguage === "ar" ? "تصدير، استيراد، تجارة تجزئة، تجميع وتوزيع في ولايات جمهورية السودان كافة." : "Trade, wholesale, exports, distribution, and commercial outlets nationwide."}
                      </p>
                    </div>

                    <div 
                      onClick={() => setAppCategory("industrial")}
                      className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                        appCategory === "industrial" ? "border-sudan-green bg-[#007A33]/5 ring-1 ring-sudan-green" : "border-gray-200 hover:border-slate-300"
                      }`}
                    >
                      <Building2 className="h-8 w-8 text-sudan-gold mb-3" />
                      <h5 className="text-sm font-extrabold text-slate-800">{currentLanguage === "ar" ? "رخصة تشغيل صناعي" : "Industrial Operations License"}</h5>
                      <p className="text-[11px] text-gray-400 font-bold mt-1 leading-relaxed">
                        {currentLanguage === "ar" ? "للمصانع، خطوط الإنتاج والفرز، الصناعات التحويلية كالصمغ العربي والمعادن الثقيلة." : "Heavy manufacturing plants, sorting complexes, agro-processing, and chemicals."}
                      </p>
                    </div>

                    <div 
                      onClick={() => setAppCategory("special")}
                      className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                        appCategory === "special" ? "border-sudan-green bg-[#007A33]/5 ring-1 ring-sudan-green" : "border-gray-200 hover:border-slate-300"
                      }`}
                    >
                      <Layers className="h-8 w-8 text-blue-500 mb-3" />
                      <h5 className="text-sm font-extrabold text-slate-800">{currentLanguage === "ar" ? "تصاريح استثنائية ومؤقتة" : "Special / Temporary Permits"}</h5>
                      <p className="text-[11px] text-gray-400 font-bold mt-1 leading-relaxed">
                        {currentLanguage === "ar" ? "للمعارض السنوية والموسمية، مستودعات التخزين العامة، والمجمعات الحرة." : "Exhibition booths, seasonal markets, customs warehouses, and public trade shows."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                    <div className="space-y-1.5">
                      <label className="text-slate-500">{currentLanguage === "ar" ? "مسمى الترخيص القانوني (بالعربية)" : "Legal License Name (Arabic)"}</label>
                      <input 
                        type="text" 
                        value={appTypeAr}
                        onChange={(e) => setAppTypeAr(e.target.value)}
                        placeholder="مثال: رخصة تكرير وتصدير حاصلات الصمغ العربي"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sudan-green"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500">{currentLanguage === "ar" ? "مسمى الترخيص القانوني (بالإنجليزية)" : "Legal License Name (English)"}</label>
                      <input 
                        type="text" 
                        value={appTypeEn}
                        onChange={(e) => setAppTypeEn(e.target.value)}
                        placeholder="Example: Raw Gum Arabic Refining & Sovereign Export License"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sudan-green"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: LINKED INCORPORATION & COMPLIANCE PRE-CHECK */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">{currentLanguage === "ar" ? "2. ربط طلب الترخيص بالشركة المعتمدة والتحقق التلقائي" : "2. Link Commercial Registry & Compliance Verification"}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-500">{currentLanguage === "ar" ? "اختر الشركة المسجلة قانوناً" : "Select Registered Corporate Company"}</label>
                        <select
                          value={linkedCompanyId}
                          onChange={(e) => setLinkedCompanyId(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sudan-green cursor-pointer"
                        >
                          <option value="">{currentLanguage === "ar" ? "-- اختر شركة مسجلة بالسجل الفيدرالي --" : "-- Select a registered enterprise --"}</option>
                          {companies.map(c => (
                            <option key={c.id} value={c.id}>{currentLanguage === "ar" ? c.legalNameAr : c.legalNameEn} ({c.registrationNumber})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-500">{currentLanguage === "ar" ? "تحديد خطة السعة / القدرة السنوية" : "Nominated Annual Production Capacity"}</label>
                        <input 
                          type="text" 
                          value={capacityLimit}
                          onChange={(e) => setCapacityLimit(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "مثال: 20,000 طن متري سنوياً" : "Example: 20,000 Metric Tons Annually"}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sudan-green"
                        />
                      </div>
                    </div>

                    {/* COMPLIANCE VALIDATOR PRE-CHECK RESULTS (BLOCKING SYSTEM) */}
                    <div className="bg-slate-900 text-slate-100 p-5 rounded-3xl border border-slate-800 space-y-4">
                      <h5 className="text-xs font-black text-sudan-gold flex items-center gap-1.5">
                        <ShieldCheck className="h-4.5 w-4.5 text-sudan-gold" />
                        {currentLanguage === "ar" ? "محرك تدقيق الالتزام والمطابقة الفوري" : "Real-time Compliance Verification Engine"}
                      </h5>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="text-slate-400">{currentLanguage === "ar" ? "صلاحية السجل التجاري الموحد:" : "Commercial Registry Status:"}</span>
                          <span className={`font-black ${complianceChecks.registryValid ? "text-emerald-400" : "text-red-400"}`}>
                            {complianceChecks.registryValid ? "ACTIVE (نشط)" : "INACTIVE / NOT LINKED"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="text-slate-400">{currentLanguage === "ar" ? "مخالفات أو مطالبات مالية معلقة:" : "Outstanding Legal Citations:"}</span>
                          <span className="text-emerald-400 font-black">
                            {linkedCompanyId ? "NONE (سليم)" : "PENDING MATCH"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="text-slate-400">{currentLanguage === "ar" ? "رفع المستندات والخطط الفنية:" : "Mandatory Attachments Status:"}</span>
                          <span className={`font-black ${complianceChecks.documentsComplete ? "text-emerald-400" : "text-amber-400 animate-pulse"}`}>
                            {complianceChecks.documentsComplete ? "COMPLETE" : "INCOMPLETE / PENDING"}
                          </span>
                        </div>
                      </div>

                      {!complianceChecks.registryValid && linkedCompanyId && (
                        <div className="p-3 bg-red-950/50 border border-red-900 rounded-2xl flex items-start gap-2 text-[11px] text-red-200 font-bold">
                          <ShieldAlert className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <p>{currentLanguage === "ar" ? "تنبيه حظر: تم اكتشاف قصور في السجل الموحد للشركة المحددة. لا يمكن إتمام الترخيص حتى تفعيل السجل التجاري." : "Blocking Alert: Linked enterprise registry failed compliance. Issuance is restricted."}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: DOCUMENT UPLOAD & ATTACHMENTS CHECKLIST */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">{currentLanguage === "ar" ? "3. لوحة تحميل مستندات الحوكمة والسلامة" : "3. Upload Corporate Safety & Governance Documents"}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold">
                    <form onSubmit={handleUploadDocumentSimulate} className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-500">{currentLanguage === "ar" ? "نوع الملف المراد تحميله" : "Document Classification"}</label>
                        <select
                          value={docTypeSelector}
                          onChange={(e) => setDocTypeSelector(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-sudan-green cursor-pointer"
                        >
                          <option value="technical">{currentLanguage === "ar" ? "خطة التخطيط والسلامة الفنية" : "Technical Layout & Safety Plan"}</option>
                          <option value="compliance">{currentLanguage === "ar" ? "شهادة المطابقة البيئية والمهنية" : "Environmental Clearance Certificate"}</option>
                          <option value="supporting">{currentLanguage === "ar" ? "تفويض أو إقرار مالي بنكي" : "Bank Liquidity Verification"}</option>
                        </select>
                      </div>

                      <div className="p-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                        <FileText className="h-10 w-10 text-gray-300 mx-auto" />
                        <p className="text-[11px] text-gray-400 font-bold">{currentLanguage === "ar" ? "اسحب الملف هنا أو انقر للمحاكاة الفورية" : "Drag files here or click to simulate upload"}</p>
                        <button 
                          type="submit"
                          className="bg-sudan-green hover:bg-[#006028] text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "تحميل ومطابقة المستند" : "Upload Document"}
                        </button>
                      </div>
                    </form>

                    {/* Uploaded items queue */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-extrabold text-slate-500">{currentLanguage === "ar" ? "المستندات المرفقة بالطلب حالياً" : "Attached Governance File Queue"}</h5>
                      {uploadedDocs.length > 0 ? (
                        uploadedDocs.map((doc, idx) => (
                          <div key={idx} className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileCheck className="h-5 w-5 text-sudan-green" />
                              <div>
                                <p className="text-xs font-black text-slate-800">{currentLanguage === "ar" ? doc.nameAr : doc.nameEn}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{doc.file}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setUploadedDocs(uploadedDocs.filter((_, i) => i !== idx))}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                          <p className="text-xs text-gray-400 font-bold">{currentLanguage === "ar" ? "لم يتم إرفاق أي مستندات ترخيص حتى الآن" : "No attachments loaded yet"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & SUBMIT APPLICATION */}
              {wizardStep === 4 && (
                <div className="space-y-6">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">{currentLanguage === "ar" ? "4. مراجعة إقرار التأسيس والتقديم النهائي" : "4. Sovereign Attestation & Final Submission"}</h4>

                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 text-xs font-bold space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400">{currentLanguage === "ar" ? "مسمى الترخيص المقترح:" : "Proposed License Category:"}</span>
                        <p className="text-slate-800 font-extrabold mt-0.5">{currentLanguage === "ar" ? appTypeAr : appTypeEn}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">{currentLanguage === "ar" ? "تصنيف الترخيص:" : "Classification:"}</span>
                        <p className="text-slate-800 font-extrabold mt-0.5 uppercase">{appCategory}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <span className="text-gray-400">{currentLanguage === "ar" ? "إقرار الالتزام والحوكمة السيادية:" : "Sovereign Compliance Attestation:"}</span>
                      <p className="text-gray-500 text-[11px] leading-relaxed mt-1">
                        {currentLanguage === "ar" 
                          ? "نقر نحن الشركاء ومجلس الإدارة بصفتنا الممثل القانوني للشركة، بالتزامنا الكامل بالمعايير البيئية والصحية وقوانين العمل المعتمدة من قِبل جمهورية السودان. أي إخلال بهذه البنود يعرّض الترخيص للإيقاف السيادي الفوري دون إشعار مسبق."
                          : "We hereby declare under federal penalty that all statements made in this licensing application are accurate. We guarantee full alignment with the statutory safety codes of the Republic of Sudan."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Nav buttons row */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <button
                  disabled={wizardStep === 1}
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {currentLanguage === "ar" ? "السابق" : "Previous"}
                </button>

                {wizardStep < 4 ? (
                  <button
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="px-4 py-2 bg-sudan-green hover:bg-[#006028] text-white text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "التالي" : "Next"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleLicenseSubmit}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    {currentLanguage === "ar" ? "تقديم طلب الترخيص رسمياً" : "Submit Federal License Application"}
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: AI LICENSING COPILOT */}
          {activeTab === "ai_copilot" && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <Sparkles className="h-6 w-6 text-sudan-green animate-pulse" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {currentLanguage === "ar" ? "مساعد ومستشار التراخيص الفيدرالي الذكي" : "Sovereign Federal Licensing AI Copilot"}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    {currentLanguage === "ar" ? "تحليل الملاءة الفنية، التوصية بالتراخيص، واستيفاء الشروط القانونية." : "Instantly evaluate licensing prerequisites, technical codes, and compliance metrics."}
                  </p>
                </div>
              </div>

              {/* Chat Input block */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiChatQuery}
                    onChange={(e) => setAiChatQuery(e.target.value)}
                    placeholder={currentLanguage === "ar" ? "اسأل المستشار الذكي عن شروط رخص المصانع، التصدير، أو رسوم التجديد..." : "Ask AI about industrial factory licensing, export rules, or renewal fees..."}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green"
                  />
                  <button
                    onClick={() => handleAiConsult()}
                    className="bg-sudan-green hover:bg-[#006028] text-white text-xs font-black px-5 py-3 rounded-2xl cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    {currentLanguage === "ar" ? "استشارة فنية" : "Query Copilot"}
                  </button>
                </div>

                {/* Preset recommendation buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button 
                    onClick={() => handleAiConsult("ما هي شروط ترخيص مصنع حاصلات زراعية؟")}
                    className="px-3.5 py-2 bg-[#F4F6F5] hover:bg-slate-200 rounded-xl text-xs font-bold text-gray-600 cursor-pointer"
                  >
                    🌾 {currentLanguage === "ar" ? "شروط رخصة مصنع حاصلات" : "Agro-Processing Reqs"}
                  </button>
                  <button 
                    onClick={() => handleAiConsult("كيف أعدل أو أجدد رخصتي المنتهية؟")}
                    className="px-3.5 py-2 bg-[#F4F6F5] hover:bg-slate-200 rounded-xl text-xs font-bold text-gray-600 cursor-pointer"
                  >
                    🔄 {currentLanguage === "ar" ? "آلية التجديد والتعديل الذكي" : "Automated Renewal Flow"}
                  </button>
                </div>
              </div>

              {/* Response Area */}
              {aiLoading ? (
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center animate-pulse">
                  <p className="text-xs text-gray-400 font-bold">{currentLanguage === "ar" ? "يجري تحليل الأنشطة التجارية والتوافق القانوني..." : "Evaluating commercial bylaws and federal safety codes..."}</p>
                </div>
              ) : aiReply ? (
                <div className="bg-[#007A33]/5 p-5 rounded-3xl border border-[#007A33]/20 space-y-4">
                  <div className="text-xs font-bold leading-relaxed text-slate-800">
                    <p className="font-extrabold text-sudan-green mb-1">
                      {currentLanguage === "ar" ? "تحليل وتوصية المستشار الفيدرالي:" : "Federal Licensing Advisor Recommendation:"}
                    </p>
                    <p>{currentLanguage === "ar" ? aiReply.ar : aiReply.en}</p>
                  </div>

                  {aiReply.checklistAr && aiReply.checklistAr.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-[11px] uppercase font-extrabold text-[#AA8648]">{currentLanguage === "ar" ? "حزمة حوكمة المستندات المطلوبة:" : "Mandatory Governance Checklist:"}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                        {(currentLanguage === "ar" ? aiReply.checklistAr : aiReply.checklistEn).map((item: string, i: number) => (
                          <div key={i} className="bg-white p-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                            <Check className="h-4 w-4 text-sudan-green" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

            </div>
          )}

          {/* TAB 5: PUBLIC VERIFICATION PORTAL */}
          {activeTab === "public_portal" && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <Globe className="h-10 w-10 text-sudan-green mx-auto" />
                <h3 className="text-base font-extrabold text-slate-800">
                  {currentLanguage === "ar" ? "بوابة الاستعلام والتحقق السيادية العامة" : "Sovereign Public Licensing Verification"}
                </h3>
                <p className="text-xs text-gray-400 font-bold leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "يتيح هذا الدليل للشركاء الدوليين والجهات الرقابية والمواطنين مطابقة صحة وصلاحية التراخيص والقرارات القانونية الصادرة من ديوان الوزارة."
                    : "Allows global trade partners, regulatory bodies, and citizens to securely verify the validity of any active commercial or industrial license."}
                </p>
              </div>

              {/* Search Box */}
              <form onSubmit={handlePortalVerify} className="max-w-md mx-auto flex gap-2">
                <input
                  type="text"
                  placeholder={currentLanguage === "ar" ? "أدخل رقم الترخيص الفيدرالي (مثال: LIC-SD-2026-9081)..." : "Enter Federal License ID (e.g., LIC-SD-2026-9081)..."}
                  value={portalSearchQuery}
                  onChange={(e) => setPortalSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green"
                />
                <button
                  type="submit"
                  className="bg-sudan-green hover:bg-[#006028] text-white text-xs font-black px-5 py-3 rounded-2xl cursor-pointer"
                >
                  {currentLanguage === "ar" ? "فحص الوثيقة" : "Verify Status"}
                </button>
              </form>

              {/* Result Area */}
              {portalSearched && (
                <div className="max-w-lg mx-auto">
                  {portalResult ? (
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 rounded-full text-[9px] font-black uppercase tracking-wider">
                            {currentLanguage === "ar" ? "مرخص ونشط" : "Sovereign Verified & Active"}
                          </span>
                          <h4 className="text-xs font-bold text-slate-400 mt-1">{portalResult.licenseNumber}</h4>
                        </div>

                        <Award className="h-8 w-8 text-sudan-gold" />
                      </div>

                      {/* Displaying public information only (shielding internal banking/shareholder structures) */}
                      <div className="space-y-2 text-xs font-bold text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-gray-400">{currentLanguage === "ar" ? "اسم الشركة القانوني:" : "Entity Legal Name:"}</span>
                          <span>{currentLanguage === "ar" ? portalResult.linkedCompanyNameAr : portalResult.linkedCompanyNameEn}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">{currentLanguage === "ar" ? "الأنشطة المعتمدة للجمهور:" : "Approved Public Activities:"}</span>
                          <span>{portalResult.businessActivitiesAr.length} {currentLanguage === "ar" ? "نشاط مرخص" : "Approved activities"}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">{currentLanguage === "ar" ? "تاريخ انتهاء الصلاحية:" : "Expiration Ledger:"}</span>
                          <span className="text-slate-900 font-extrabold">{portalResult.expiryDate}</span>
                        </div>
                      </div>

                      {/* Cryptographic sovereignty seal */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center text-[10px] text-gray-400 font-semibold leading-relaxed">
                        ✓ {currentLanguage === "ar" 
                          ? "تم التحقق من صحة هذه الوثيقة مباشرة من قاعدة البيانات الموحدة لجمهورية السودان. يحمي التشفير السيادي سلامة هذه الرخصة."
                          : "This document is securely verified against the National Federal Ledger of Sudan. Cryptographic protection guarantees integrity."}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-center space-y-2 max-w-sm mx-auto">
                      <ShieldAlert className="h-8 w-8 text-red-500 mx-auto" />
                      <h4 className="text-xs font-black text-red-800">{currentLanguage === "ar" ? "فشل التحقق من صحة الرقم" : "Document Not Found / Unverified"}</h4>
                      <p className="text-[10px] text-red-600 font-bold leading-relaxed">
                        {currentLanguage === "ar" 
                          ? "لم نتمكن من مطابقة هذا الرقم في قاعدة البيانات الفيدرالية. يرجى مراجعة رقم الترخيص أو مسح الرمز بشكل صحيح."
                          : "We could not find an active or suspended license matching this ID in the sovereign database."}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 6: IMMUTABLE AUDIT LOGS */}
          {activeTab === "audit_trail" && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <ShieldCheck className="h-6 w-6 text-sudan-green animate-pulse" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {currentLanguage === "ar" ? "ديوان التدقيق وسجلات الرقابة السيادية" : "Immutable Sovereign Licensing Audit Logs"}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    {currentLanguage === "ar" ? "رصد كامل وغير قابل للتعديل لكافة الإجراءات والقرارات الفيدرالية." : "Cryptographically secured audit trail of all licensing approvals, suspensions, and regulatory steps."}
                  </p>
                </div>
              </div>

              {/* Audit history master log layout */}
              <div className="space-y-4">
                {licenses.flatMap(l => 
                  l.auditHistory.map(audit => ({
                    ...audit,
                    licenseNumber: l.licenseNumber,
                    companyNameAr: l.linkedCompanyNameAr,
                    companyNameEn: l.linkedCompanyNameEn
                  }))
                ).sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map((log, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-bold">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-sudan-gold/15 text-[#AA8648] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                          {log.licenseNumber}
                        </span>
                        <span className="text-slate-800">
                          {currentLanguage === "ar" ? log.actionAr : log.actionEn}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                        🏢 {currentLanguage === "ar" ? log.companyNameAr : log.companyNameEn}
                      </p>
                    </div>

                    <div className="flex flex-col md:items-end text-[10px] text-gray-400 font-mono">
                      <span>{log.actorName} ({log.actorRole.toUpperCase()})</span>
                      <span className="font-bold mt-0.5">{log.timestamp.substring(0, 19).replace("T", " ")}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* AMENDMENT REQUEST MODAL */}
      <AnimatePresence>
        {isAmendModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-3xl border border-gray-200 max-w-md w-full shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="text-sm font-extrabold text-slate-800">
                  {currentLanguage === "ar" ? "تقديم طلب تعديل ترخيص تشغيل" : "Submit License Amendment Request"}
                </h4>
                <button onClick={() => setIsAmendModalOpen(false)} className="p-1 text-gray-400 hover:text-slate-600 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleApplyAmendment} className="space-y-4 text-xs font-bold">
                <div className="space-y-1.5">
                  <label className="text-slate-500">{currentLanguage === "ar" ? "نوع التعديل القانوني المطلوب" : "Amendment Classification"}</label>
                  <select
                    value={amendType}
                    onChange={(e) => setAmendType(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sudan-green cursor-pointer"
                  >
                    <option value="activity_change">{currentLanguage === "ar" ? "تغيير أو إضافة نشاط تجاري" : "Change or Add Business Activity"}</option>
                    <option value="address_change">{currentLanguage === "ar" ? "تعديل عنوان المنشأة/المصنع" : "Update Facility Physical Address"}</option>
                    <option value="capacity_increase">{currentLanguage === "ar" ? "زيادة السعة والقدرة التشغيلية" : "Increase Production Capacity"}</option>
                    <option value="capacity_reduction">{currentLanguage === "ar" ? "تخفيض السعة التشغيلية" : "Reduce Capacity"}</option>
                    <option value="representative_update">{currentLanguage === "ar" ? "تغيير المفوض أو المدير المسؤول" : "Update Representative or Manager"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">{currentLanguage === "ar" ? "وصف ومبررات التعديل (العربية)" : "Justification & Details (Arabic)"}</label>
                  <textarea
                    value={amendDescAr}
                    onChange={(e) => setAmendDescAr(e.target.value)}
                    rows={3}
                    placeholder="اكتب أسباب وتفاصيل التعديل الفني..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sudan-green"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">{currentLanguage === "ar" ? "وصف ومبررات التعديل (الإنجليزية)" : "Justification & Details (English)"}</label>
                  <textarea
                    value={amendDescEn}
                    onChange={(e) => setAmendDescEn(e.target.value)}
                    rows={3}
                    placeholder="Explain the technical or legal reasons for the amendment..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sudan-green"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-sudan-green hover:bg-[#006028] text-white text-xs font-black py-3 rounded-2xl cursor-pointer"
                >
                  {currentLanguage === "ar" ? "إرسال طلب التعديل رسمياً" : "Submit Amendment Request"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSPECTION / COMPLIANCE RECORD MODAL */}
      <AnimatePresence>
        {isInspModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-3xl border border-gray-200 max-w-md w-full shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="text-sm font-extrabold text-slate-800">
                  {currentLanguage === "ar" ? "تسجيل تقرير فحص ومطابقة ميداني" : "Log Official Field Inspection"}
                </h4>
                <button onClick={() => setIsInspModalOpen(false)} className="p-1 text-gray-400 hover:text-slate-600 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateInspection} className="space-y-4 text-xs font-bold">
                <div className="space-y-1.5">
                  <label className="text-slate-500">{currentLanguage === "ar" ? "نتيجة الفحص الفني" : "Inspection Result"}</label>
                  <select
                    value={inspStatus}
                    onChange={(e) => setInspStatus(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sudan-green cursor-pointer"
                  >
                    <option value="passed">{currentLanguage === "ar" ? "مطابق تماماً ومعتمد" : "Passed (Compliant)"}</option>
                    <option value="failed">{currentLanguage === "ar" ? "مخالف للشروط (إجراء احترازي)" : "Failed (Critical Violations)"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">{currentLanguage === "ar" ? "ملاحظات الفحص والتدقيق (العربية)" : "Inspector Notes (Arabic)"}</label>
                  <textarea
                    value={inspNotesAr}
                    onChange={(e) => setInspNotesAr(e.target.value)}
                    rows={2}
                    placeholder="أدخل الملاحظات الميدانية والصحية هنا..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sudan-green"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">{currentLanguage === "ar" ? "ملاحظات الفحص والتدقيق (الإنجليزية)" : "Inspector Notes (English)"}</label>
                  <textarea
                    value={inspNotesEn}
                    onChange={(e) => setInspNotesEn(e.target.value)}
                    rows={2}
                    placeholder="Enter on-site audit findings here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sudan-green"
                  />
                </div>

                {inspStatus === "failed" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-red-500">{currentLanguage === "ar" ? "المخالفات المرصودة (العربية - مفصولة بفاصلة)" : "Violations Detected (Arabic - comma separated)"}</label>
                      <input
                        type="text"
                        value={inspViolationsAr}
                        onChange={(e) => setInspViolationsAr(e.target.value)}
                        placeholder="مثال: تسرب مبردات، غياب لافتات الأمان"
                        className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-2xl outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-red-500">{currentLanguage === "ar" ? "المخالفات المرصودة (الإنجليزية - مفصولة بفاصلة)" : "Violations Detected (English - comma separated)"}</label>
                      <input
                        type="text"
                        value={inspViolationsEn}
                        onChange={(e) => setInspViolationsEn(e.target.value)}
                        placeholder="e.g. refrigerant leak, no fire signs"
                        className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-2xl outline-none focus:border-red-500"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-sudan-green hover:bg-[#006028] text-white text-xs font-black py-3 rounded-2xl cursor-pointer"
                >
                  {currentLanguage === "ar" ? "حفظ التقرير والاعتماد" : "Submit Audit Assessment"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
