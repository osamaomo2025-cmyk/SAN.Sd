/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * Module: Companies Registration & Corporate Lifecycle Management Platform (Vision 2035)
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Users, Award, ShieldCheck, FileText, MapPin, 
  Search, Plus, Trash2, Edit3, ArrowRight, ArrowLeft, 
  CheckCircle2, AlertTriangle, Download, Eye, QrCode, 
  TrendingUp, DollarSign, GitBranch, RefreshCw, Archive, 
  Ban, UserCheck, Play, Check, X, Bell, BarChart2, Briefcase
} from "lucide-react";
import { 
  EntityType, Shareholder, Director, Branch, CorporateDocument, 
  AuditLogEntry, CorporateAmendment, CorporateCompany, UserRole, ApplicationStatus 
} from "../types";
import { SUDANESE_STATES } from "../data";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface CorporateLifecycleProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
}

// Initial Mock Seed Data
const seedCorporateCompanies: CorporateCompany[] = [
  {
    id: "corp-1",
    legalNameAr: "شركة زادنا للتطوير الزراعي والحيواني المساهمة العامة",
    legalNameEn: "Zadna Agricultural & Animal Development Joint Stock Co.",
    commercialNameAr: "زادنا الزراعية الموحدة",
    commercialNameEn: "Zadna Unified Agriculture",
    commercialNameId: "n-1",
    registrationNumber: "CO-SD-2026-8012",
    entityType: EntityType.JOINT_STOCK,
    establishmentDate: "2026-01-10",
    capital: 500000000,
    addressState: "الجزيرة",
    addressCity: "ود مدني",
    status: "approved",
    shareholders: [
      { id: "sh-1", name: "وزارة الزراعة والموارد الطبيعية الاتحادية", type: "corporate", nationality: "سوداني", percentage: 70, capitalContribution: 350000000, votingRights: true, sharesCount: 350000 },
      { id: "sh-2", name: "الصندوق الوطني للضمان الاجتماعي بالسودان", type: "corporate", nationality: "سوداني", percentage: 30, capitalContribution: 150000000, votingRights: true, sharesCount: 150000 }
    ],
    directors: [
      { id: "dir-1", name: "عوض الله أحمد عبدالجليل", role: "chairman", nationality: "سوداني", appointedDate: "2026-01-12", status: "active" },
      { id: "dir-2", name: "السيّد حسن عثمان فضل", role: "ceo", nationality: "سوداني", appointedDate: "2026-01-15", status: "active" }
    ],
    branches: [
      { id: "br-1", name: "فرع ميناء بورتسودان اللوجستي", state: "البحر الأحمر", city: "بورتسودان", manager: "ياسر علي صالح", activities: ["التخزين المبرد", "التخليص الجمركي للحاصلات"], status: "active", licenseNumber: "BR-90312" },
      { id: "br-2", name: "مستودعات شندي للفرز والتعبئة", state: "نهر النيل", city: "شندي", manager: "معتز عثمان", activities: ["التعبئة", "الفرز والتوزيع"], status: "active", licenseNumber: "BR-50211" }
    ],
    documents: [
      { id: "doc-1", name: "عقد التأسيس والنظام الأساسي", type: "aoi", fileName: "Articles_of_Incorporation_Zadna.pdf", fileSize: "2.4 MB", uploadedAt: "2026-01-05", version: 1, previewUrl: "#" },
      { id: "doc-2", name: "شهادة إيداع رأس المال البنكي", type: "capital_certificate", fileName: "Bank_Capital_Deposit_Cert_SD.pdf", fileSize: "1.1 MB", uploadedAt: "2026-01-08", version: 1, previewUrl: "#" }
    ],
    amendments: [
      { id: "am-1", companyId: "corp-1", type: "capital_increase", descriptionAr: "زيادة رأس المال بمقدار 100 مليون جنيه بقرار الجمعية العمومية", descriptionEn: "Capital increase of 100M SDG by General Assembly resolution", status: "approved", createdAt: "2026-04-20", approvedAt: "2026-04-25" }
    ],
    auditHistory: [
      { id: "aud-1", actionAr: "تأسيس وقبول المستندات المبدئية", actionEn: "Incorporation & initial documents accepted", actorName: "عاصم السنوسي", actorRole: "Registry Officer", timestamp: "2026-01-10T09:00:00Z" },
      { id: "aud-2", actionAr: "اعتماد السجل وإصدار الشهادة السيادية برقم CO-SD-2026-8012", actionEn: "Registry approved and sovereign certificate issued", actorName: "وزير التجارة والصناعة", actorRole: "Minister", timestamp: "2026-01-10T14:30:00Z" }
    ],
    activities: ["زراعة القمح والذرة والمحاصيل الاستراتيجية", "تربية الماشية وتسمين العجول وتصدير اللحوم المبردة"],
    contactEmail: "info@zadna.sd",
    contactPhone: "+249183200110",
    applicantId: "user-default",
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-04-25T12:00:00Z",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ais-pre-jveltj6wsseafhkiulvfgw-76404771010.europe-west3.run.app/verify/CO-SD-2026-8012"
  },
  {
    id: "corp-2",
    legalNameAr: "شركة سنار للصمغ العربي والمنتجات التحويلية ذ.م.م",
    legalNameEn: "Sennar Gum Arabic & Processing LLC",
    commercialNameAr: "سنار لتصنيع الصمغ العربي",
    commercialNameEn: "Sennar Gum Arabic Processing",
    commercialNameId: "n-2",
    registrationNumber: "CO-SD-2026-4409",
    entityType: EntityType.LLC,
    establishmentDate: "2026-03-01",
    capital: 80000000,
    addressState: "سنار",
    addressCity: "سنجة",
    status: "approved",
    shareholders: [
      { id: "sh-3", name: "الأستاذة فاطمة آدم إبراهيم", type: "individual", nationality: "سوداني", percentage: 60, capitalContribution: 48000000, votingRights: true, sharesCount: 48000 },
      { id: "sh-4", name: "صندوق استثمار الكوميسا للتنمية الصناعية", type: "corporate", nationality: "إقليمي", percentage: 40, capitalContribution: 32000000, votingRights: true, sharesCount: 32000 }
    ],
    directors: [
      { id: "dir-3", name: "فاطمة آدم إبراهيم", role: "managing_director", nationality: "سوداني", appointedDate: "2026-03-01", status: "active" }
    ],
    branches: [],
    documents: [
      { id: "doc-3", name: "عقد التأسيس ذ.م.م المعتمد", type: "moa", fileName: "MoA_Sennar_Gum_Arabic.pdf", fileSize: "1.8 MB", uploadedAt: "2026-02-20", version: 1, previewUrl: "#" }
    ],
    amendments: [],
    auditHistory: [
      { id: "aud-3", actionAr: "الموافقة الأمنية والقانونية على عقد التأسيس ذ.م.م", actionEn: "Security & legal approval on LLC Memorandum of Association", actorName: "رندة التوم", actorRole: "Legal Reviewer", timestamp: "2026-02-28T11:00:00Z" }
    ],
    activities: ["شراء وتجميع الصمغ العربي الخام", "تأسيس مصانع تحويلية للبودرة الرذاذية القابلة للذوبان"],
    contactEmail: "contact@sennargum.sd",
    contactPhone: "+249912444005",
    applicantId: "user-default",
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-03-01T15:00:00Z",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ais-pre-jveltj6wsseafhkiulvfgw-76404771010.europe-west3.run.app/verify/CO-SD-2026-4409"
  }
];

export default function CorporateLifecycleModule({ currentLanguage, role }: CorporateLifecycleProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "incorporate" | "registry" | "ai_advisor" | "gov_desk">("dashboard");
  const [corporateCompanies, setCorporateCompanies] = useState<CorporateCompany[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [selectedCorp, setSelectedCorp] = useState<CorporateCompany | null>(null);
  
  // Incorporation Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [legalNameAr, setLegalNameAr] = useState("");
  const [legalNameEn, setLegalNameEn] = useState("");
  const [commercialNameAr, setCommercialNameAr] = useState("");
  const [commercialNameEn, setCommercialNameEn] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>(EntityType.LLC);
  const [estDate, setEstDate] = useState("2026-07-15");
  const [capital, setCapital] = useState("");
  const [addressState, setAddressState] = useState("الخرطوم");
  const [addressCity, setAddressCity] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [activities, setActivities] = useState("");
  
  // Wizard Dynamics: Shareholders & Directors lists
  const [formShareholders, setFormShareholders] = useState<Shareholder[]>([]);
  const [shName, setShName] = useState("");
  const [shType, setShType] = useState<"individual" | "corporate">("individual");
  const [shNationality, setShNationality] = useState("");
  const [shPercentage, setShPercentage] = useState("");
  
  const [formDirectors, setFormDirectors] = useState<Director[]>([]);
  const [dirName, setDirName] = useState("");
  const [dirRole, setDirRole] = useState<Director["role"]>("ceo");
  const [dirNationality, setDirNationality] = useState("");

  // Documents uploaded checklist
  const [uploadedDocs, setUploadedDocs] = useState<{name: string, file: string}[]>([]);
  const [docTypeName, setDocTypeName] = useState("aoi");

  // Amendments/Restructuring states
  const [isAmendmentModalOpen, setIsAmendmentModalOpen] = useState(false);
  const [amendmentType, setAmendmentType] = useState<CorporateAmendment["type"]>("capital_increase");
  const [amendmentDescAr, setAmendmentDescAr] = useState("");
  const [amendmentDescEn, setAmendmentDescEn] = useState("");

  // Branch management states
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [branchState, setBranchState] = useState("الخرطوم");
  const [branchCity, setBranchCity] = useState("");
  const [branchManager, setBranchManager] = useState("");
  const [branchActs, setBranchActs] = useState("");

  // Notifications State
  const [notifications, setNotifications] = useState<{ id: string; textAr: string; textEn: string; type: string; date: string }[]>([]);

  // AI Assistant Corporate Services
  const [aiChatQuery, setAiChatQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Initialize
  useEffect(() => {
    const localCorp = localStorage.getItem("sdmci_corporate_companies");
    if (localCorp) {
      setCorporateCompanies(JSON.parse(localCorp));
    } else {
      setCorporateCompanies(seedCorporateCompanies);
      localStorage.setItem("sdmci_corporate_companies", JSON.stringify(seedCorporateCompanies));
    }

    // Seed Notification log
    setNotifications([
      { id: "n-1", textAr: "تم تأسيس شركة سنار للصمغ العربي بنجاح وإرسال رخصة التشغيل.", textEn: "Sennar Gum Arabic LLC successfully incorporated and operational license sent.", type: "success", date: "2026-03-01" },
      { id: "n-2", textAr: "تذكير بتقديم الإقرار السنوي والحوكمة لشركة زادنا للتطوير الزراعي.", textEn: "Annual filing and corporate governance report reminder for Zadna Agricultural.", type: "warning", date: "2026-07-01" }
    ]);
  }, []);

  const saveToStorage = (updatedList: CorporateCompany[]) => {
    setCorporateCompanies(updatedList);
    localStorage.setItem("sdmci_corporate_companies", JSON.stringify(updatedList));
  };

  const addNotification = (textAr: string, textEn: string, type: "success" | "warning" | "info" | "danger") => {
    const newN = {
      id: `notif-${Date.now()}`,
      textAr,
      textEn,
      type,
      date: new Date().toISOString().split("T")[0]
    };
    setNotifications(prev => [newN, ...prev]);
  };

  // Add shareholder to wizard list
  const handleAddShareholder = () => {
    if (!shName || !shPercentage) return;
    const percentageNum = Number(shPercentage);
    const calculatedContribution = (Number(capital) || 0) * (percentageNum / 100);
    const newSh: Shareholder = {
      id: `sh-${Date.now()}`,
      name: shName,
      type: shType,
      nationality: shNationality || (currentLanguage === "ar" ? "سوداني" : "Sudanese"),
      percentage: percentageNum,
      capitalContribution: calculatedContribution,
      votingRights: true,
      sharesCount: Math.round(calculatedContribution / 1000)
    };
    setFormShareholders([...formShareholders, newSh]);
    setShName("");
    setShPercentage("");
  };

  // Add director to wizard list
  const handleAddDirector = () => {
    if (!dirName) return;
    const newDir: Director = {
      id: `dir-${Date.now()}`,
      name: dirName,
      role: dirRole,
      nationality: dirNationality || (currentLanguage === "ar" ? "سوداني" : "Sudanese"),
      appointedDate: new Date().toISOString().split("T")[0],
      status: "active"
    };
    setFormDirectors([...formDirectors, newDir]);
    setDirName("");
  };

  // Document Upload Mock
  const handleDocUploadSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const docNamesMap: Record<string, string> = {
      aoi: "Articles of Association (عقد التأسيس)",
      moa: "Memorandum of Association (النظام الأساسي)",
      board_resolution: "Board Resolution (قرار مجلس الإدارة)",
      capital_certificate: "Capital Deposit Certificate (شهادة البنك رأس المال)",
      supporting: "Supporting Legal Identity (المستندات الثبوتية الشريكة)"
    };
    setUploadedDocs([...uploadedDocs, { name: docNamesMap[docTypeName] || docTypeName, file: `Simulated_Doc_${Date.now()}.pdf` }]);
    addNotification(`تم رفع مستند ${docNamesMap[docTypeName]} بنجاح`, `Document ${docTypeName.toUpperCase()} uploaded successfully`, "success");
  };

  // Wizard Finish: Incorporation Submission
  const handleIncorporateSubmit = () => {
    // Basic validations
    if (!legalNameAr || !legalNameEn || !capital) {
      alert(currentLanguage === "ar" ? "يرجى ملء الاسم ورأس المال" : "Please fill in company name and capital structure");
      return;
    }

    const totalPct = formShareholders.reduce((sum, item) => sum + item.percentage, 0);
    if (totalPct !== 100 && formShareholders.length > 0) {
      alert(currentLanguage === "ar" ? "تنبيه: يجب أن تبلغ نسبة المساهمين الإجمالية 100%!" : "Warning: Total shareholder percentage must sum up to exactly 100%!");
      return;
    }

    const docObjects: CorporateDocument[] = uploadedDocs.map((doc, idx) => ({
      id: `doc-up-${idx}-${Date.now()}`,
      name: doc.name,
      type: "aoi",
      fileName: doc.file,
      fileSize: "1.5 MB",
      uploadedAt: new Date().toISOString().split("T")[0],
      version: 1,
      previewUrl: "#"
    }));

    const regNumPlaceholder = `CO-SD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCompany: CorporateCompany = {
      id: `corp-${Date.now()}`,
      legalNameAr,
      legalNameEn,
      commercialNameAr: commercialNameAr || legalNameAr,
      commercialNameEn: commercialNameEn || legalNameEn,
      entityType: selectedEntityType,
      establishmentDate: estDate,
      capital: Number(capital),
      addressState,
      addressCity: addressCity || (currentLanguage === "ar" ? "الخرطوم" : "Khartoum"),
      status: "submitted",
      shareholders: formShareholders,
      directors: formDirectors,
      branches: [],
      documents: docObjects,
      amendments: [],
      auditHistory: [
        {
          id: `aud-sub-${Date.now()}`,
          actionAr: "تقديم طلب التأسيس إلكترونياً عبر البوابة الموحدة",
          actionEn: "Incorporation application submitted digitally",
          actorName: currentLanguage === "ar" ? "مقدم الطلب" : "Applicant Account",
          actorRole: "Representative",
          timestamp: new Date().toISOString()
        }
      ],
      activities: activities.split(",").map(a => a.trim()).filter(a => a.length > 0),
      contactEmail,
      contactPhone,
      applicantId: "user-default",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      registrationNumber: regNumPlaceholder,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ais-pre-jveltj6wsseafhkiulvfgw-76404771010.europe-west3.run.app/verify/${regNumPlaceholder}`
    };

    const newList = [newCompany, ...corporateCompanies];
    saveToStorage(newList);
    addNotification(`تم تقديم طلب تأسيس ${legalNameAr} وبدء التدقيق القانوني.`, `Incorporation request for ${legalNameEn} submitted. Legal auditing started.`, "info");
    
    // Reset form
    setLegalNameAr("");
    setLegalNameEn("");
    setCapital("");
    setFormShareholders([]);
    setFormDirectors([]);
    setUploadedDocs([]);
    setWizardStep(1);
    setActiveTab("registry");
    setSelectedCorp(newCompany);
  };

  // Perform Amendment Action (Lifecycle restructure)
  const handleApplyAmendment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCorp) return;

    const newAmend: CorporateAmendment = {
      id: `am-${Date.now()}`,
      companyId: selectedCorp.id,
      type: amendmentType,
      descriptionAr: amendmentDescAr || `تحديث وحوكمة الشركة بنظام ${amendmentType}`,
      descriptionEn: amendmentDescEn || `Lifecycle amendment performed: ${amendmentType}`,
      status: role === UserRole.GOVERNMENT_MINISTER || role === UserRole.GOVERNMENT_EXECUTIVE ? "approved" : "pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    const updatedAud: AuditLogEntry = {
      id: `aud-am-${Date.now()}`,
      actionAr: `تقديم طلب تغيير قانوني للشركة: ${amendmentType}`,
      actionEn: `Submitted legal amendment application: ${amendmentType}`,
      actorName: "Representative",
      actorRole: "Company Representative",
      timestamp: new Date().toISOString()
    };

    const updatedList = corporateCompanies.map(c => {
      if (c.id === selectedCorp.id) {
        let updatedCapital = c.capital;
        if (newAmend.status === "approved" && amendmentType === "capital_increase") {
          updatedCapital += 20000000; // Simulated default raise
        } else if (newAmend.status === "approved" && amendmentType === "capital_reduction") {
          updatedCapital -= 10000000;
        }

        const isDissolving = newAmend.status === "approved" && (amendmentType === "dissolution" || amendmentType === "liquidation");

        return {
          ...c,
          capital: updatedCapital,
          status: isDissolving ? ("dissolved" as const) : c.status,
          amendments: [newAmend, ...c.amendments],
          auditHistory: [updatedAud, ...c.auditHistory],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    saveToStorage(updatedList);
    setSelectedCorp(updatedList.find(c => c.id === selectedCorp.id) || null);
    setIsAmendmentModalOpen(false);
    setAmendmentDescAr("");
    setAmendmentDescEn("");
    addNotification(`تم تسجيل التعديل القانوني في سجل ${selectedCorp.legalNameAr}`, `Corporate amendment registered for ${selectedCorp.legalNameEn}`, "success");
  };

  // Create new branch
  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCorp || !branchName) return;

    const newBr: Branch = {
      id: `br-${Date.now()}`,
      name: branchName,
      state: branchState,
      city: branchCity,
      manager: branchManager || "تعيين لاحقاً",
      activities: branchActs ? branchActs.split(",").map(a => a.trim()) : ["نشاط الفرع العام"],
      status: "active",
      licenseNumber: `BR-REG-${Math.floor(10000 + Math.random() * 90000)}`
    };

    const updatedAud: AuditLogEntry = {
      id: `aud-br-${Date.now()}`,
      actionAr: `تسجيل فرع جديد: ${branchName} في ولاية ${branchState}`,
      actionEn: `Registered new branch: ${branchName} in state ${branchState}`,
      actorName: "Ministry System",
      actorRole: "Registrar",
      timestamp: new Date().toISOString()
    };

    const updatedList = corporateCompanies.map(c => {
      if (c.id === selectedCorp.id) {
        return {
          ...c,
          branches: [...c.branches, newBr],
          auditHistory: [updatedAud, ...c.auditHistory],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    saveToStorage(updatedList);
    setSelectedCorp(updatedList.find(c => c.id === selectedCorp.id) || null);
    setIsBranchModalOpen(false);
    setBranchName("");
    setBranchManager("");
    setBranchActs("");
    addNotification(`تم ترخيص الفرع ${branchName} لشركة ${selectedCorp.legalNameAr}`, `Branch licensed successfully for ${selectedCorp.legalNameEn}`, "success");
  };

  // Gov Desk Approval actions
  const handleGovReview = (corpId: string, action: "approved" | "rejected" | "legal_review" | "dept_review") => {
    const actionNamesAr: Record<string, string> = {
      approved: "تم التصديق النهائي والترخيص",
      rejected: "تم رفض الطلب لعدم كفاية الشروط",
      legal_review: "إرسال ملف الشركة للتدقيق القانوني",
      dept_review: "إرسال ملف الشركة للمراجعة القطاعية"
    };

    const updatedList = corporateCompanies.map(c => {
      if (c.id === corpId) {
        const aud: AuditLogEntry = {
          id: `aud-gov-${Date.now()}`,
          actionAr: `مراجعة سيادية: ${actionNamesAr[action]}`,
          actionEn: `Sovereign action taken: ${action.toUpperCase()}`,
          actorName: role === UserRole.GOVERNMENT_MINISTER ? "معالي الوزير" : "المراجع السيادي",
          actorRole: role,
          timestamp: new Date().toISOString()
        };
        return {
          ...c,
          status: action === "approved" ? ("approved" as const) : action === "rejected" ? ("rejected" as const) : ("legal_review" as const),
          auditHistory: [aud, ...c.auditHistory],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    saveToStorage(updatedList);
    if (selectedCorp && selectedCorp.id === corpId) {
      setSelectedCorp(updatedList.find(c => c.id === corpId) || null);
    }
    addNotification(`تم تحديث حالة الشركة السيادية بنجاح`, `Sovereign corporate status updated successfully`, "success");
  };

  // Corporate AI Assistant Expert Copilot Logic
  const handleAiConsult = async (queryPreset?: string) => {
    const activeQuery = queryPreset || aiChatQuery;
    if (!activeQuery) return;

    setAiLoading(true);
    // Simulate smart Ministry AI Recommendation
    setTimeout(() => {
      let recTextAr = "";
      let recTextEn = "";
      let checklistAr: string[] = [];
      let checklistEn: string[] = [];

      if (activeQuery.includes("نوع") || activeQuery.includes("كيان") || activeQuery.includes("entity") || activeQuery.includes("recommend")) {
        recTextAr = "استناداً لمعطيات قانون الشركات السوداني لعام 2026 ورؤية 2035 الرقمية، يُنصح باختيار **شركة ذات مسؤولية محدودة (LLC)** للمشاريع المتوسطة والناشئة، أو **شركة مساهمة عامة** للشركات الكبرى التي تسعى لزيادة رأس المال عن طريق الاكتتاب والتمويل الجماهيري.";
        recTextEn = "Based on Sudan Companies Act 2026 and Vision 2035 guidelines, we recommend a **Limited Liability Company (LLC)** for medium businesses, and a **Joint Stock Company** for large-scale operations seeking public financing.";
        checklistAr = [
          "تثبيت اسم تجاري معتمد غير مكرر.",
          "الحد الأدنى لعدد الشركاء: شريكان (2).",
          "مستند عقد التأسيس والنظام الأساسي (MoA & AoI).",
          "إيداع الحد الأدنى لرأس المال ببنك السودان المركزي."
        ];
        checklistEn = [
          "Verified unique commercial name reservation.",
          "Minimum 2 shareholders required for LLC.",
          "Standardized Articles of Incorporation uploaded.",
          "Bank deposit certificate of nominal capital."
        ];
      } else if (activeQuery.includes("مستند") || activeQuery.includes("شروط") || activeQuery.includes("document") || activeQuery.includes("required")) {
        recTextAr = "تتطلب عملية التأسيس السيادية حزمة من المستندات القانونية والحوكمة المعتمدة رقمياً لضمان الفحص الذكي السريع:";
        recTextEn = "The sovereign incorporation process requires digitally signed legal and governance documents to pass smart validation:";
        checklistAr = [
          "عقد التأسيس (Articles of Incorporation) موقع إلكترونياً.",
          "النظام الأساسي واللوائح الداخلية للشركة (MoA).",
          "إثبات الهوية الرقمية لجميع الشركاء والمديرين.",
          "قرار الشركاء بتعيين المفوض بالتوقيع والتسجيل."
        ];
        checklistEn = [
          "Articles of Incorporation digitally signed.",
          "Memorandum of Association detailing internal bylaws.",
          "Digital ID/Passport verification of all founders.",
          "Founders board resolution appointing representative."
        ];
      } else {
        recTextAr = "مساعد وزارة التجارة والصناعة ذو الحوكمة الذكية يحييكم. يمكنني حوكمة وتصميم هيكل شركتكم، واكتشاف أي قصور في مستندات الحوكمة، واحتساب توزيع الأسهم بدقة 100%.";
        recTextEn = "The Sovereign Ministry Corporate AI Copilot greets you. I can help architect your corporate bylaws, analyze share registers, audit compliance, and guarantee faultless incorporation.";
        checklistAr = ["اضغط على زر التوصية بالكيان لتفاصيل إضافية.", "تأكد من مطابقة مجموع الأسهم لنسبة 100%."];
        checklistEn = ["Click 'Recommend Entity' to launch structure advisor.", "Double check that your shareholder stakes sum exactly to 100%."];
      }

      setAiResponse({
        query: activeQuery,
        ar: recTextAr,
        en: recTextEn,
        checklistAr,
        checklistEn
      });
      setAiLoading(false);
      setAiChatQuery("");
    }, 1200);
  };

  // Search filter
  const filteredCorps = corporateCompanies.filter(c => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      c.legalNameAr.toLowerCase().includes(query) ||
      c.legalNameEn.toLowerCase().includes(query) ||
      c.registrationNumber.toLowerCase().includes(query) ||
      c.shareholders.some(s => s.name.toLowerCase().includes(query)) ||
      c.directors.some(d => d.name.toLowerCase().includes(query)) ||
      (c.commercialNameAr && c.commercialNameAr.toLowerCase().includes(query));

    const matchesEntity = entityFilter === "all" || c.entityType === entityFilter;

    return matchesSearch && matchesEntity;
  });

  // Recharts Chart configurations
  const getEntityTypeName = (type: EntityType) => {
    const namesAr: Record<EntityType, string> = {
      [EntityType.SOLE_PROPRIETORSHIP]: "مؤسسة فردية",
      [EntityType.GENERAL_PARTNERSHIP]: "شركة تضامن",
      [EntityType.LIMITED_PARTNERSHIP]: "توصية بسيطة",
      [EntityType.LLC]: "مسؤولية محدودة (ذ.م.م)",
      [EntityType.JOINT_STOCK]: "مساهمة عامة",
      [EntityType.NON_PROFIT]: "منظمة غير ربحية",
      [EntityType.COOPERATIVE]: "جمعية تعاونية",
      [EntityType.FOREIGN_BRANCH]: "فرع شركة أجنبية",
      [EntityType.GOVERNMENT_OWNED]: "مملوكة للدولة"
    };
    const namesEn: Record<EntityType, string> = {
      [EntityType.SOLE_PROPRIETORSHIP]: "Sole Proprietorship",
      [EntityType.GENERAL_PARTNERSHIP]: "General Partnership",
      [EntityType.LIMITED_PARTNERSHIP]: "Limited Partnership",
      [EntityType.LLC]: "Limited Liability Co (LLC)",
      [EntityType.JOINT_STOCK]: "Joint Stock Company",
      [EntityType.NON_PROFIT]: "Non-Profit Organization",
      [EntityType.COOPERATIVE]: "Cooperative",
      [EntityType.FOREIGN_BRANCH]: "Foreign Branch",
      [EntityType.GOVERNMENT_OWNED]: "Gov-Owned Enterprise"
    };
    return currentLanguage === "ar" ? namesAr[type] : namesEn[type];
  };

  const getStatusBadge = (status: CorporateCompany["status"]) => {
    const labelsAr: Record<string, string> = {
      draft: "مسودة",
      submitted: "قيد المراجعة المبدئية",
      legal_review: "التدقيق القانوني",
      dept_review: "المراجعة القطاعية",
      approved: "معتمد ونشط",
      rejected: "مرفوض",
      dissolved: "تمت التصفية/الحل",
      archived: "مؤرشف"
    };
    const labelsEn: Record<string, string> = {
      draft: "Draft",
      submitted: "Submitted / Pending",
      legal_review: "Legal Review",
      dept_review: "Dept Review",
      approved: "Approved & Active",
      rejected: "Rejected",
      dissolved: "Dissolved / Liquidated",
      archived: "Archived"
    };

    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700 border-gray-300",
      submitted: "bg-amber-50 text-amber-700 border-amber-300 animate-pulse",
      legal_review: "bg-blue-50 text-blue-700 border-blue-300",
      dept_review: "bg-purple-50 text-purple-700 border-purple-300",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-300",
      rejected: "bg-rose-50 text-rose-700 border-rose-300",
      dissolved: "bg-red-50 text-red-800 border-red-400",
      archived: "bg-stone-100 text-stone-600 border-stone-300"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${colors[status] || "bg-gray-100"}`}>
        {currentLanguage === "ar" ? labelsAr[status] : labelsEn[status]}
      </span>
    );
  };

  // Recharts Chart datasets
  const chartDataTypes = Object.values(EntityType).map(type => {
    const count = corporateCompanies.filter(c => c.entityType === type).length;
    return {
      name: getEntityTypeName(type),
      value: count
    };
  }).filter(item => item.value > 0);

  const chartDataCapital = corporateCompanies.map(c => ({
    name: currentLanguage === "ar" ? c.legalNameAr.substring(0, 15) + "..." : c.legalNameEn.substring(0, 15) + "...",
    capital: c.capital / 1000000 // In millions
  }));

  const COLORS = ["#007A33", "#C5A059", "#1E3A8A", "#0D9488", "#7C3AED", "#DB2777"];

  return (
    <div id="corporate-lifecycle-platform" className="space-y-6">
      {/* Platform Branding Header & Stats */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="bg-sudan-gold/15 text-[#AA8648] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-sudan-gold/25">
            {currentLanguage === "ar" ? "منصة الحوكمة الموحدة" : "Sovereign Corporate Registry"}
          </span>
          <h2 className="text-xl font-extrabold text-[#1E293B] flex items-center gap-2 mt-2">
            <Building2 className="h-6 w-6 text-sudan-green animate-pulse" />
            {currentLanguage === "ar" ? "نظام تسجيل الشركات وإدارة دورة حياة الشركات" : "Companies Registration & Corporate Lifecycle Management"}
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
            {currentLanguage === "ar" 
              ? "تسجيل وحوكمة وتعديل الكيانات التجارية والشركات ذات المسؤولية المحدودة والمساهمة العامة رقمياً تماشياً مع رؤية السودان السيادية 2035."
              : "Incorporate, restructure, audit, and dissolve legal entities in compliance with Sudan's 2035 Sovereign Government Digital Codes."}
          </p>
        </div>

        {/* Tab Selector Nav Pill */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F4F6F5] p-1.5 rounded-2xl border border-gray-200">
          {[
            { id: "dashboard", labelAr: "الحصيلة والإحصاءات", labelEn: "Sovereign Analytics", icon: BarChart2 },
            { id: "registry", labelAr: "السجل والعمليات", labelEn: "Corporate Registry", icon: Briefcase },
            { id: "incorporate", labelAr: "تأسيس شركة", labelEn: "Incorporate", icon: Plus },
            { id: "ai_advisor", labelAr: "المستشار الذكي", labelEn: "Governance AI", icon: ShieldCheck },
            { id: "gov_desk", labelAr: "ديوان التدقيق السيادي", labelEn: "Gov Approval Desk", icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedCorp(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isTabActive 
                    ? "bg-sudan-green text-white shadow-sm font-black" 
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

      {/* Main Contents based on Tab selected */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {/* TAB 1: SOVEREIGN DASHBOARD & REPORTS */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Quick statistics widgets row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm hover:scale-[1.01] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{currentLanguage === "ar" ? "الشركات المسجلة" : "Total Corporate Registered"}</span>
                    <Building2 className="h-5 w-5 text-sudan-green" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 mt-2">{corporateCompanies.length}</h3>
                  <p className="text-[10px] text-emerald-600 font-extrabold mt-1">✓ {corporateCompanies.filter(c => c.status === "approved").length} {currentLanguage === "ar" ? "نشطة ومعتمدة سيادياً" : "Active & Sovereign Approved"}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm hover:scale-[1.01] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{currentLanguage === "ar" ? "حجم رأس المال المودع" : "Accumulated Nominated Capital"}</span>
                    <DollarSign className="h-5 w-5 text-[#AA8648]" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 mt-2">
                    {corporateCompanies.reduce((sum, item) => sum + item.capital, 0).toLocaleString()} <span className="text-xs text-gray-500 font-bold">SDG</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">{currentLanguage === "ar" ? "مؤمن بالكامل بالبنوك المركزية" : "Fully secured in partner banks"}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm hover:scale-[1.01] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{currentLanguage === "ar" ? "قيد المراجعة والتدقيق" : "Pending Sovereign Audit"}</span>
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-3xl font-black text-amber-600 mt-2">
                    {corporateCompanies.filter(c => c.status === "submitted" || c.status === "legal_review" || c.status === "dept_review").length}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">⚙ {currentLanguage === "ar" ? "متوسط المعالجة: 24 ساعة" : "Average processing: 24h"}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm hover:scale-[1.01] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{currentLanguage === "ar" ? "التراخيص الفرعية والوطنية" : "Licensed Corporate Branches"}</span>
                    <GitBranch className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-black text-blue-600 mt-2">
                    {corporateCompanies.reduce((sum, c) => sum + c.branches.length, 0)}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ {currentLanguage === "ar" ? "لامركزية الولايات" : "Active decentralized coverage"}</p>
                </div>
              </div>

              {/* Graphical charts using Recharts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-4">{currentLanguage === "ar" ? "توزيع الكيانات حسب الشكل القانوني" : "Corporate Distribution by Entity Type"}</h4>
                  {chartDataTypes.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartDataTypes}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartDataTypes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400 text-xs font-bold">
                      {currentLanguage === "ar" ? "لا توجد بيانات كافية للرسم" : "Insufficient data for charting"}
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-4">{currentLanguage === "ar" ? "أكبر الاستثمارات المسجلة (رأس المال بالمليون جنيه سوداني)" : "Highest Capitalized Incorporations (Millions SDG)"}</h4>
                  {chartDataCapital.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartDataCapital}>
                          <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                          <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="capital" fill="#C5A059" radius={[10, 10, 0, 0]}>
                            {chartDataCapital.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#007A33" : "#C5A059"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400 text-xs font-bold">
                      {currentLanguage === "ar" ? "لا توجد بيانات كافية للرسم" : "Insufficient data for charting"}
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications / Alerts Panel */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-sudan-gold animate-bounce" />
                  {currentLanguage === "ar" ? "لوحة الإشعارات والحوكمة السيادية النشطة" : "Sovereign Notifications & Active Filing Indicators"}
                </h4>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${n.type === "success" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <span className="text-xs font-black text-[#1E293B]">
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

          {/* TAB 2: CENTRAL COMPANY REGISTRY & LIFECYCLE MANAGEMENT */}
          {activeTab === "registry" && (
            <div className="space-y-6">
              {/* Filter controls and Search Bar */}
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                  <input
                    type="text"
                    placeholder={currentLanguage === "ar" ? "البحث بالاسم القانوني، الاسم التجاري، رقم السجل، الشركاء والمدراء..." : "Search legal name, registration ID, directors or shareholders..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <select
                    value={entityFilter}
                    onChange={(e) => setEntityFilter(e.target.value)}
                    className="w-full md:w-56 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green cursor-pointer"
                  >
                    <option value="all">{currentLanguage === "ar" ? "كل الكيانات القانونية" : "All Legal Entities"}</option>
                    {Object.values(EntityType).map(type => (
                      <option key={type} value={type}>{getEntityTypeName(type)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Master-Detail Split Screen Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Master Company Grid List */}
                <div className={`space-y-4 ${selectedCorp ? "lg:col-span-5" : "lg:col-span-12"}`}>
                  {filteredCorps.length > 0 ? (
                    filteredCorps.map(corp => {
                      const isSelected = selectedCorp?.id === corp.id;
                      return (
                        <div
                          key={corp.id}
                          onClick={() => setSelectedCorp(corp)}
                          className={`p-5 bg-white rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                            isSelected ? "border-sudan-green ring-2 ring-sudan-green/10" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[9px] uppercase font-bold tracking-widest text-sudan-gold bg-sudan-gold/10 px-2.5 py-1 rounded-full border border-sudan-gold/15">
                                {getEntityTypeName(corp.entityType)}
                              </span>
                              <h4 className="text-sm font-extrabold text-[#1E293B] mt-2">
                                {currentLanguage === "ar" ? corp.legalNameAr : corp.legalNameEn}
                              </h4>
                              {corp.commercialNameAr && (
                                <p className="text-[11px] text-gray-400 font-bold mt-1">
                                  🏢 {currentLanguage === "ar" ? `الاسم التجاري: ${corp.commercialNameAr}` : `Commercial Name: ${corp.commercialNameEn}`}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(corp.status)}
                              <span className="text-[10px] text-gray-400 font-mono font-bold">
                                {corp.registrationNumber}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 text-[11px] text-gray-500 font-bold">
                            <div>
                              <span className="text-gray-400">{currentLanguage === "ar" ? "رأس المال:" : "Capital:"}</span>
                              <p className="text-gray-700 font-extrabold mt-0.5">{corp.capital.toLocaleString()} SDG</p>
                            </div>
                            <div>
                              <span className="text-gray-400">{currentLanguage === "ar" ? "الولاية:" : "State:"}</span>
                              <p className="text-gray-700 mt-0.5">📍 {corp.addressState}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 text-gray-400 text-xs font-bold">
                      {currentLanguage === "ar" ? "لا توجد شركات مطابقة لبحثك" : "No companies match your search criteria"}
                    </div>
                  )}
                </div>

                {/* Detail View Container */}
                {selectedCorp && (
                  <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6 relative">
                    <button
                      onClick={() => setSelectedCorp(null)}
                      className="absolute left-4 top-4 p-1.5 hover:bg-slate-100 rounded-full text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    {/* Official sovereign visual header */}
                    <div className="border-b border-gray-100 pb-5">
                      <span className="text-[9px] uppercase font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        {currentLanguage === "ar" ? "السجل الرقمي الرسمي المعتمد" : "Official Sovereign Record"}
                      </span>
                      <h3 className="text-lg font-black text-gray-800 mt-2">
                        {currentLanguage === "ar" ? selectedCorp.legalNameAr : selectedCorp.legalNameEn}
                      </h3>
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        REG-ID: {selectedCorp.registrationNumber} • {getEntityTypeName(selectedCorp.entityType)}
                      </p>
                    </div>

                    {/* Quick Profile Overview tabs: details, shareholders, branches, modifications */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs font-bold">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "حالة الكيان" : "Sovereign Status"}</span>
                        <div className="mt-1.5">{getStatusBadge(selectedCorp.status)}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "رأس مال الكيان" : "Nominal Capital"}</span>
                        <span className="text-xs font-black text-gray-800 block mt-1.5">{selectedCorp.capital.toLocaleString()} SDG</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "المساهمين" : "Founders/Shareholders"}</span>
                        <span className="text-xs font-black text-gray-800 block mt-1.5">{selectedCorp.shareholders.length}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "الفروع الفعالة" : "Decentral Branches"}</span>
                        <span className="text-xs font-black text-gray-800 block mt-1.5">{selectedCorp.branches.length}</span>
                      </div>
                    </div>

                    {/* Shareholders & Ownership distribution register */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-extrabold text-gray-400 flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-[#AA8648]" />
                        {currentLanguage === "ar" ? "سجل المساهمين وحصص رأس المال" : "Share Register & Cap Table"}
                      </h4>
                      <div className="space-y-2">
                        {selectedCorp.shareholders.map(sh => (
                          <div key={sh.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                            <div>
                              <p className="font-extrabold text-gray-800">{sh.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{sh.type === "corporate" ? (currentLanguage === "ar" ? "مساهم اعتباري" : "Corporate Shareholder") : (currentLanguage === "ar" ? "مساهم فردي" : "Individual")} • {sh.nationality}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sudan-green font-black">{sh.percentage}%</span>
                              <p className="text-[10px] text-gray-400 mt-0.5">{sh.capitalContribution.toLocaleString()} SDG</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Directors & Management representation */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-extrabold text-gray-400 flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-sudan-green" />
                        {currentLanguage === "ar" ? "سجل المدراء والمفوضين بالتوقيع" : "Directors & Authorized Signatories"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCorp.directors.map(dir => (
                          <div key={dir.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                            <span className="bg-sudan-green/10 text-sudan-green px-2 py-0.5 rounded-md text-[9px] font-black uppercase">
                              {dir.role.toUpperCase()}
                            </span>
                            <p className="font-extrabold text-gray-800 mt-2">{dir.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{currentLanguage === "ar" ? `تاريخ التعيين: ${dir.appointedDate}` : `Appointed: ${dir.appointedDate}`}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Branches Register and Action */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs uppercase font-extrabold text-gray-400 flex items-center gap-1.5">
                          <GitBranch className="h-4 w-4 text-blue-500" />
                          {currentLanguage === "ar" ? "سجل فروع الشركة بالولايات" : "Decentralized Branch Registry"}
                        </h4>
                        <button
                          onClick={() => setIsBranchModalOpen(true)}
                          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer transition-all"
                        >
                          <Plus className="h-3 w-3" />
                          {currentLanguage === "ar" ? "ترخيص فرع" : "License Branch"}
                        </button>
                      </div>
                      
                      {selectedCorp.branches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedCorp.branches.map(br => (
                            <div key={br.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-gray-800">{br.name}</span>
                                <span className="text-[8px] bg-emerald-50 text-emerald-600 font-extrabold px-1.5 py-0.5 rounded">✓ ACTIVE</span>
                              </div>
                              <p className="text-gray-500 text-[11px]">📍 {br.state} - {br.city}</p>
                              <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? `المدير المسجل: ${br.manager}` : `Manager: ${br.manager}`}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400 italic bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                          {currentLanguage === "ar" ? "لا توجد فروع مسجلة حالياً لهذه الشركة" : "No domestic branches currently licensed for this corporation."}
                        </p>
                      )}
                    </div>

                    {/* Lifecycle action panel (Amendments/restructuring) */}
                    <div className="p-5 bg-[#FAF6EB] rounded-3xl border border-sudan-gold/25 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                            <RefreshCw className="h-4 w-4 text-sudan-gold animate-spin" />
                            {currentLanguage === "ar" ? "بوابة التعديلات السيادية وإعادة الهيكلة" : "Sovereign Lifecycle Amendments Hub"}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {currentLanguage === "ar" ? "رفع طلبات تعديل رأس المال، دمج، تصفية أو حل الشركة." : "Perform mergers, capital restructuring, conversions, or dissolution."}
                          </p>
                        </div>
                        <button
                          onClick={() => setIsAmendmentModalOpen(true)}
                          className="bg-[#C5A059] hover:bg-[#AA8648] text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-sm cursor-pointer transition-all"
                        >
                          {currentLanguage === "ar" ? "تعديل قانوني" : "Apply Amendment"}
                        </button>
                      </div>

                      {selectedCorp.amendments.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-sudan-gold/15">
                          {selectedCorp.amendments.map(am => (
                            <div key={am.id} className="flex items-center justify-between text-[11px] text-gray-600">
                              <span>⚙ {currentLanguage === "ar" ? am.descriptionAr : am.descriptionEn}</span>
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">APPROVED</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Digital Certificate printable preview and QR Code */}
                    <div className="bg-[#E6F5EC] p-5 rounded-3xl border border-sudan-green/25 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-sudan-green flex items-center gap-1.5">
                          <QrCode className="h-4.5 w-4.5" />
                          {currentLanguage === "ar" ? "الشهادة الرقمية الموثقة برمز QR" : "Verified QR Digital Certificate"}
                        </h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          {currentLanguage === "ar" 
                            ? "تحتوي هذه الشهادة المعتمدة على رمز الاستجابة السريع للتحقق من هوية وحالة السجل لدى البنوك والموانئ والجهات الاتحادية."
                            : "This certified credential includes an active QR-Code for instant bank, harbor, and federal verification."}
                        </p>
                      </div>

                      <div className="bg-white p-2 rounded-xl border border-emerald-100 flex items-center justify-center shrink-0">
                        <img src={selectedCorp.qrCodeUrl} alt="QR Code" className="w-16 h-16" referrerPolicy="no-referrer" />
                      </div>
                    </div>

                    {/* Immutable audit logs history */}
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase font-extrabold text-gray-400">
                        {currentLanguage === "ar" ? "السجل التاريخي والتدقيق العام (Immutable Audit Log)" : "Immutable Historical Audit Log"}
                      </h4>
                      <div className="space-y-1.5 font-mono text-[10px] text-gray-500">
                        {selectedCorp.auditHistory.map(aud => (
                          <div key={aud.id} className="flex items-start justify-between p-2 bg-slate-50 rounded-lg">
                            <span>🕒 {currentLanguage === "ar" ? aud.actionAr : aud.actionEn} ({aud.actorName} - {aud.actorRole})</span>
                            <span className="text-gray-400 font-bold shrink-0">{new Date(aud.timestamp).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: WIZARD INCORPORATION APPLICATION */}
          {activeTab === "incorporate" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Wizard Form Frame */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                
                {/* Steps Visual indicator */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  {[
                    { step: 1, labelAr: "الاسم والنشاط", labelEn: "Name & Acts" },
                    { step: 2, labelAr: "الشركاء والمديرين", labelEn: "Owners & Board" },
                    { step: 3, labelAr: "رفع المستندات والتحقق", labelEn: "Legal Docs" },
                    { step: 4, labelAr: "المراجعة النهائية", labelEn: "Finalize" }
                  ].map(s => (
                    <div key={s.step} className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black ${
                        wizardStep === s.step 
                          ? "bg-sudan-green text-white" 
                          : wizardStep > s.step 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-slate-100 text-slate-400"
                      }`}>
                        {s.step}
                      </div>
                      <span className={`text-[10px] font-black hidden md:inline ${
                        wizardStep === s.step ? "text-[#1E293B]" : "text-gray-400"
                      }`}>
                        {currentLanguage === "ar" ? s.labelAr : s.labelEn}
                      </span>
                    </div>
                  ))}
                </div>

                {/* STEP 1: Basic Company details */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-gray-800">
                      {currentLanguage === "ar" ? "1. معلومات الكيان القانوني ورأس المال" : "1. Legal Entity & Nominated Capital Structure"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase">{currentLanguage === "ar" ? "الاسم القانوني المقترح (عربي) *" : "Suggested Legal Name (Ar) *"}</label>
                        <input
                          type="text"
                          required
                          value={legalNameAr}
                          onChange={(e) => setLegalNameAr(e.target.value)}
                          placeholder="شركة النيلين للصادرات الزراعية المحدودة"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase">{currentLanguage === "ar" ? "الاسم القانوني المقترح (انجليزي) *" : "Suggested Legal Name (En) *"}</label>
                        <input
                          type="text"
                          required
                          value={legalNameEn}
                          onChange={(e) => setLegalNameEn(e.target.value)}
                          placeholder="Nileln Agricultural Exports Co. Ltd"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase">{currentLanguage === "ar" ? "ربط الاسم التجاري المحجوز مسبقاً" : "Link Reserved Commercial Name"}</label>
                        <input
                          type="text"
                          value={commercialNameAr}
                          onChange={(e) => setCommercialNameAr(e.target.value)}
                          placeholder="الاسم المحجوز بالبوابة الموحدة"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase">{currentLanguage === "ar" ? "الشكل والكيان القانوني *" : "Legal Entity Type *"}</label>
                        <select
                          value={selectedEntityType}
                          onChange={(e) => setSelectedEntityType(e.target.value as EntityType)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green cursor-pointer"
                        >
                          <option value={EntityType.LLC}>{getEntityTypeName(EntityType.LLC)}</option>
                          <option value={EntityType.SOLE_PROPRIETORSHIP}>{getEntityTypeName(EntityType.SOLE_PROPRIETORSHIP)}</option>
                          <option value={EntityType.GENERAL_PARTNERSHIP}>{getEntityTypeName(EntityType.GENERAL_PARTNERSHIP)}</option>
                          <option value={EntityType.JOINT_STOCK}>{getEntityTypeName(EntityType.JOINT_STOCK)}</option>
                          <option value={EntityType.COOPERATIVE}>{getEntityTypeName(EntityType.COOPERATIVE)}</option>
                          <option value={EntityType.FOREIGN_BRANCH}>{getEntityTypeName(EntityType.FOREIGN_BRANCH)}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase">{currentLanguage === "ar" ? "رأس المال المودع بالجنيه السوداني *" : "Nominal Capital In SDG *"}</label>
                        <input
                          type="number"
                          required
                          value={capital}
                          onChange={(e) => setCapital(e.target.value)}
                          placeholder="150000000"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase">{currentLanguage === "ar" ? "ولاية التأسيس *" : "State *"}</label>
                          <select
                            value={addressState}
                            onChange={(e) => setAddressState(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green cursor-pointer"
                          >
                            {SUDANESE_STATES.map(s => (
                              <option key={s.id} value={s.nameAr}>{s.nameAr}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase">{currentLanguage === "ar" ? "المدينة/المحلية *" : "City *"}</label>
                          <input
                            type="text"
                            required
                            value={addressCity}
                            onChange={(e) => setAddressCity(e.target.value)}
                            placeholder="الخرطوم بحري"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase">{currentLanguage === "ar" ? "البريد الإلكتروني للشركة *" : "Corporate Contact Email *"}</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="info@nileln.com"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase">{currentLanguage === "ar" ? "رقم الهاتف المعتمد *" : "Corporate phone number *"}</label>
                        <input
                          type="text"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+249912000300"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase">{currentLanguage === "ar" ? "الأنشطة الاقتصادية والتجارية المقررة (مفصولة بفاصلة) *" : "Economic Activities (separated by commas) *"}</label>
                      <textarea
                        rows={3}
                        value={activities}
                        onChange={(e) => setActivities(e.target.value)}
                        placeholder="تصدير الصمغ العربي والمحاصيل الزراعية النقية، فرز وتعبئة البقوليات"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-sudan-green"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Shareholders and Directors */}
                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-gray-800">
                      {currentLanguage === "ar" ? "2. سجل المساهمين وتشكيل مجلس الإدارة" : "2. Share Register & Board Structuring"}
                    </h3>

                    {/* Section Shareholders */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <h4 className="text-xs font-black text-gray-700">{currentLanguage === "ar" ? "إضافة مساهم جديد" : "Register a Shareholder"}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder={currentLanguage === "ar" ? "اسم الشريك / المؤسسة" : "Shareholder Name"}
                          value={shName}
                          onChange={(e) => setShName(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                        />
                        <select
                          value={shType}
                          onChange={(e) => setShType(e.target.value as any)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          <option value="individual">{currentLanguage === "ar" ? "شريك فردي" : "Individual"}</option>
                          <option value="corporate">{currentLanguage === "ar" ? "شريك اعتباري" : "Corporate"}</option>
                        </select>
                        <input
                          type="number"
                          placeholder={currentLanguage === "ar" ? "الحصة (%)" : "Stake Percentage (%)"}
                          value={shPercentage}
                          onChange={(e) => setShPercentage(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddShareholder}
                          className="bg-sudan-green hover:bg-sudan-green-light text-white px-3 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
                        >
                          {currentLanguage === "ar" ? "تسجيل الحصة" : "Add Stake"}
                        </button>
                      </div>

                      {/* Shareholders List */}
                      {formShareholders.length > 0 && (
                        <div className="space-y-2 mt-4 pt-4 border-t border-slate-200">
                          {formShareholders.map((sh, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 text-xs font-bold">
                              <span>👤 {sh.name} ({sh.type === "corporate" ? "Corporate" : "Founder"})</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sudan-green">{sh.percentage}%</span>
                                <button
                                  onClick={() => setFormShareholders(formShareholders.filter(item => item.id !== sh.id))}
                                  className="text-rose-500 hover:text-rose-700 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section Directors */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <h4 className="text-xs font-black text-gray-700">{currentLanguage === "ar" ? "تعيين أعضاء مجلس الإدارة والمديرين" : "Appoint Board Members & CEO"}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder={currentLanguage === "ar" ? "اسم المدير الرباعي" : "Director Full Name"}
                          value={dirName}
                          onChange={(e) => setDirName(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                        />
                        <select
                          value={dirRole}
                          onChange={(e) => setDirRole(e.target.value as any)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          <option value="chairman">{currentLanguage === "ar" ? "رئيس مجلس الإدارة" : "Chairman"}</option>
                          <option value="board_member">{currentLanguage === "ar" ? "عضو مجلس إدارة" : "Board Member"}</option>
                          <option value="managing_director">{currentLanguage === "ar" ? "المدير العام" : "Managing Director"}</option>
                          <option value="ceo">{currentLanguage === "ar" ? "الرئيس التنفيذي" : "CEO"}</option>
                          <option value="authorized_signatory">{currentLanguage === "ar" ? "مفوض بالتوقيع والتعامل" : "Authorized Signatory"}</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleAddDirector}
                          className="bg-sudan-green hover:bg-sudan-green-light text-white px-3 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
                        >
                          {currentLanguage === "ar" ? "تعيين العضو" : "Appoint Director"}
                        </button>
                      </div>

                      {/* Directors List */}
                      {formDirectors.length > 0 && (
                        <div className="space-y-2 mt-4 pt-4 border-t border-slate-200">
                          {formDirectors.map((dir, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 text-xs font-bold">
                              <span>💼 {dir.name} ({dir.role.toUpperCase()})</span>
                              <button
                                onClick={() => setFormDirectors(formDirectors.filter(item => item.id !== dir.id))}
                                className="text-rose-500 hover:text-rose-700 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* STEP 3: Legal Documents upload and AI validations */}
                {wizardStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-gray-800">
                      {currentLanguage === "ar" ? "3. رفع عقد التأسيس ومستندات الحوكمة مع التحقق رقمياً" : "3. Upload Legal Bylaws & Digital Validator"}
                    </h3>

                    <div className="bg-[#FAF6EB] p-4 rounded-2xl border border-sudan-gold/20 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-sudan-gold shrink-0 mt-0.5" />
                      <div className="text-xs text-gray-600 leading-relaxed">
                        <p className="font-bold text-gray-800">{currentLanguage === "ar" ? "تنبيه هام ومشدد بشأن المستندات:" : "Strict document compliance alert:"}</p>
                        <p className="mt-1">
                          {currentLanguage === "ar" 
                            ? "يجب أن تكون عقود التأسيس مطابقة تماماً للمسودة المعتمدة بالوزارة. يقوم نظام الذكاء الاصطناعي السيادي تلقائياً بفحص سلامة التوقيعات والهويات الرقمية."
                            : "Articles of Incorporation must follow the standardized federal templates. Our sovereign AI checks electronic signatures and identity codes in real time."}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleDocUploadSimulate} className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <select
                        value={docTypeName}
                        onChange={(e) => setDocTypeName(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        <option value="aoi">{currentLanguage === "ar" ? "عقد التأسيس (AoI)" : "Articles of Association"}</option>
                        <option value="moa">{currentLanguage === "ar" ? "النظام الأساسي (MoA)" : "Memorandum of Association"}</option>
                        <option value="capital_certificate">{currentLanguage === "ar" ? "شهادة إيداع رأس المال" : "Capital Certificate"}</option>
                        <option value="supporting">{currentLanguage === "ar" ? "مستند ثبوتي الشركاء" : "Supporting ID Document"}</option>
                      </select>
                      <div className="flex items-center justify-center border border-dashed border-slate-300 rounded-xl bg-white px-4 cursor-pointer text-[10px] text-gray-400 font-bold">
                        {currentLanguage === "ar" ? "اسحب الملف هنا أو تصفح..." : "Drag & drop files here..."}
                      </div>
                      <button
                        type="submit"
                        className="bg-[#C5A059] hover:bg-[#AA8648] text-white px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
                      >
                        {currentLanguage === "ar" ? "رفع ومطابقة المستند" : "Upload & Validate"}
                      </button>
                    </form>

                    {/* Uploaded Documents List */}
                    {uploadedDocs.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase font-extrabold text-gray-400">{currentLanguage === "ar" ? "المستندات المرفوعة المعتمدة رقمياً" : "Digitally Uploaded Documents List"}</h4>
                        <div className="space-y-1.5">
                          {uploadedDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                              <span className="font-extrabold text-[#1E293B]">✓ {doc.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] text-emerald-600 font-bold uppercase shrink-0">✓ VERIFIED BY AI</span>
                                <button
                                  onClick={() => setUploadedDocs(uploadedDocs.filter((_, i) => i !== idx))}
                                  className="text-rose-500 hover:text-rose-700 cursor-pointer"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: Finalize and submit */}
                {wizardStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-gray-800">
                      {currentLanguage === "ar" ? "4. الفحص السيادي النهائي والمراجعة" : "4. Sovereign Final Review & Code Validation"}
                    </h3>

                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 text-xs space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400 block">{currentLanguage === "ar" ? "الاسم القانوني للشركة" : "Company Legal Name"}</span>
                          <span className="font-extrabold text-gray-800 block mt-1">{currentLanguage === "ar" ? legalNameAr : legalNameEn}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">{currentLanguage === "ar" ? "رأس المال المقرر" : "Nominated Capital"}</span>
                          <span className="font-extrabold text-gray-800 block mt-1">{capital} SDG</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400 block">{currentLanguage === "ar" ? "نوع ومستوى الكيان" : "Nominal Entity Type"}</span>
                          <span className="font-extrabold text-gray-800 block mt-1">{getEntityTypeName(selectedEntityType)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">{currentLanguage === "ar" ? "طاقم الشركاء والمدراء" : "Total Founders & Board"}</span>
                          <span className="font-extrabold text-gray-800 block mt-1">{formShareholders.length} {currentLanguage === "ar" ? "شريك" : "Shareholders"} • {formDirectors.length} {currentLanguage === "ar" ? "أعضاء مجلس" : "Directors"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-gray-600">
                        <p className="font-extrabold text-emerald-800">{currentLanguage === "ar" ? "جاهز للتسجيل النهائي والمطابقة:" : "Entity structures fully validated:"}</p>
                        <p className="mt-1">
                          {currentLanguage === "ar" 
                            ? "جميع متطلبات الحوكمة مستوفية تماماً. بمجرد الضغط على زر التأسيس، سيتم ترحيل الطلب لديوان المراجع وتسجيله في قاعدة البيانات المشتركة."
                            : "Governance regulations cleared. Clicking finish will route the application to the state examiner and record it in the ledger."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wizard navigation buttons */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  {wizardStep > 1 ? (
                    <button
                      onClick={() => setWizardStep(wizardStep - 1)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {currentLanguage === "ar" ? "السابق" : "Back"}
                    </button>
                  ) : <div />}

                  {wizardStep < 4 ? (
                    <button
                      onClick={() => setWizardStep(wizardStep + 1)}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-sudan-green hover:bg-sudan-green-light text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm hover:shadow"
                    >
                      {currentLanguage === "ar" ? "التالي" : "Next"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleIncorporateSubmit}
                      className="flex items-center gap-1.5 px-6 py-3 bg-[#C5A059] hover:bg-[#AA8648] text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg"
                    >
                      <ShieldCheck className="h-4.5 w-4.5" />
                      {currentLanguage === "ar" ? "تأسيس واعتماد الكيان السيادي" : "Finalize & Record Incorporation"}
                    </button>
                  )}
                </div>

              </div>

              {/* Wizard Side Interactive AI Guidelines */}
              <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4 h-fit">
                <div className="flex items-center gap-2 text-sudan-green border-b border-gray-100 pb-3">
                  <ShieldCheck className="h-5 w-5 text-sudan-gold animate-bounce" />
                  <h4 className="text-xs uppercase font-extrabold tracking-wider">{currentLanguage === "ar" ? "فحص المطابقة الذكي (AI Validator)" : "Interactive AI Compliance"}</h4>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-extrabold text-gray-700">{currentLanguage === "ar" ? "1. فحص الأسهم وحصص المساهمين:" : "1. Share register audit:"}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span>{currentLanguage === "ar" ? "مجموع النسب المئوية:" : "Aggregate founder percentages:"}</span>
                      <span className={`font-mono font-black ${formShareholders.reduce((sum, item) => sum + item.percentage, 0) === 100 ? "text-emerald-600" : "text-amber-500"}`}>
                        {formShareholders.reduce((sum, item) => sum + item.percentage, 0)}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-extrabold text-gray-700">{currentLanguage === "ar" ? "2. فحص مستندات الحوكمة الأساسية:" : "2. Document requirements audit:"}</p>
                    <ul className="mt-2 space-y-1 text-gray-500 font-semibold list-inside list-disc">
                      <li>{currentLanguage === "ar" ? "عقد التأسيس (AoI):" : "Articles (AoI):"} <span className="font-bold text-emerald-600">✓ OK</span></li>
                      <li>{currentLanguage === "ar" ? "النظام الأساسي (MoA):" : "Bylaws (MoA):"} <span className="font-bold text-emerald-600">✓ OK</span></li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleAiConsult("ما هي الكيانات والشروط القانونية الأنسب لمشروعي؟")}
                    className="w-full bg-[#FAF6EB] hover:bg-[#FAF6EB]/80 text-[#AA8648] border border-sudan-gold/25 px-4 py-2.5 rounded-xl text-[10px] font-black cursor-pointer transition-all"
                  >
                    💡 {currentLanguage === "ar" ? "استشارة المستشار الذكي السريعة" : "Quick AI Compliance Audit"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI CORPORATE ADVISOR EXPERT */}
          {activeTab === "ai_advisor" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-black text-gray-800 flex items-center gap-2">
                    <ShieldCheck className="h-5.5 w-5.5 text-sudan-gold" />
                    {currentLanguage === "ar" ? "مستشار وزارة التجارة والصناعة لحوكمة وهيكلة الشركات" : "Ministry Sovereign Corporate AI Advisor"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {currentLanguage === "ar" 
                      ? "احصل على استشارة فورية معتمدة على قانون الشركات السوداني لعام 2026 لتحديد أنسب الكيانات وتدقيق عقد التأسيس بدقة."
                      : "Consult our legal AI on the Sudan Companies Act 2026 guidelines for correct structural planning and bylaws."}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <input
                    type="text"
                    value={aiChatQuery}
                    onChange={(e) => setAiChatQuery(e.target.value)}
                    placeholder={currentLanguage === "ar" ? "اسأل المستشار الذكي حول متطلبات LLC،Joint Stock، شروط رأس المال..." : "Ask AI about LLC requirements, Joint Stock share divisions, bank capital deposits..."}
                    className="flex-1 px-4 py-3 bg-transparent text-xs font-bold outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleAiConsult()}
                  />
                  <button
                    onClick={() => handleAiConsult()}
                    disabled={aiLoading}
                    className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-3 rounded-xl text-xs font-black cursor-pointer transition-all shrink-0"
                  >
                    {aiLoading ? (currentLanguage === "ar" ? "فحص وتحليل..." : "Analyzing...") : (currentLanguage === "ar" ? "استشارة" : "Consult")}
                  </button>
                </div>

                {/* Pre-designed interactive advisory cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { titleAr: "الاستشارة بالكيان الأنسب", titleEn: "Recommend Legal Entity", query: "ما هو الكيان والنوع القانوني الأنسب لمشروعي؟" },
                    { titleAr: "شروط رأس المال المودع", titleEn: "Capital Deposit Rules", query: "ما هي شروط إيداع رأس المال وتوثيق البنك؟" },
                    { titleAr: "حوكمة مجلس الإدارة واللجان", titleEn: "Corporate Governance rules", query: "ما هي قواعد الحوكمة والتمثيل القانوني للمديرين؟" }
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAiConsult(card.query)}
                      className="p-4 bg-slate-50 hover:bg-sudan-green/5 hover:border-sudan-green transition-all rounded-2xl border border-slate-200 cursor-pointer text-xs"
                    >
                      <h5 className="font-extrabold text-[#1E293B]">{currentLanguage === "ar" ? card.titleAr : card.titleEn}</h5>
                      <p className="text-[10px] text-gray-400 mt-1">{currentLanguage === "ar" ? "اضغط للاستشارة المباشرة" : "Click to query"}</p>
                    </div>
                  ))}
                </div>

                {/* Response Visualizer */}
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-[#FAF6EB] rounded-3xl border border-sudan-gold/25 space-y-4"
                  >
                    <div className="flex items-center gap-2 border-b border-sudan-gold/15 pb-2.5 text-xs text-sudan-gold font-extrabold">
                      <ShieldCheck className="h-5 w-5 animate-spin" />
                      <span>{currentLanguage === "ar" ? "تحليل ومطابقة قانونية معتمدة" : "Verified Legal Analysis"}</span>
                    </div>

                    <div className="text-xs text-gray-700 leading-relaxed font-semibold">
                      <p>{currentLanguage === "ar" ? aiResponse.ar : aiResponse.en}</p>
                    </div>

                    {aiResponse.checklistAr.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">{currentLanguage === "ar" ? "قائمة مطابقة شروط الحوكمة المكتشفة" : "Governance Compliance Checklist"}</span>
                        <ul className="space-y-1 list-inside list-disc text-xs text-slate-600 font-bold">
                          {(currentLanguage === "ar" ? aiResponse.checklistAr : aiResponse.checklistEn).map((item: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-emerald-500 font-black">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

              </div>

              {/* Legal Reference Manual */}
              <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4 h-fit text-xs">
                <h4 className="text-xs uppercase font-extrabold text-sudan-green border-b border-gray-100 pb-3">{currentLanguage === "ar" ? "مرجع المخطط الوطني لعام 2026" : "Sovereign Framework Reference"}</h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-gray-700 block">{currentLanguage === "ar" ? "الشركة ذات المسؤولية المحدودة (LLC)" : "Limited Liability Company (LLC)"}</span>
                    <p className="text-[10px] text-gray-400 mt-1">{currentLanguage === "ar" ? "الحد الأدنى للشركاء: 2، الأقصى: 50. مسؤولية الشريك تقتصر على حصته." : "Min founders: 2, Max: 50. Liability strictly limited to the share value."}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-gray-700 block">{currentLanguage === "ar" ? "الشركة المساهمة العامة (Joint Stock)" : "Joint Stock Company"}</span>
                    <p className="text-[10px] text-gray-400 mt-1">{currentLanguage === "ar" ? "الحد الأدنى لرأس المال: 100 مليون. تديرها جمعية عمومية ومجلس إدارة من 5 أعضاء على الأقل." : "Min nominal capital: 100M SDG. Managed by general assembly & board of min 5."}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GOVERNMENT REVIEW DESK / SOVEREIGN APPROVALS */}
          {activeTab === "gov_desk" && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <span className="bg-sudan-green/10 text-sudan-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {currentLanguage === "ar" ? "بوابة التدقيق والاعتماد السيادي" : "Sovereign Approval Ledger"}
                </span>
                <h3 className="text-base font-black text-gray-800 mt-2">
                  {currentLanguage === "ar" ? "ديوان مراجعة حوكمة وتأسيس الشركات" : "Ministry Registrar Review Board"}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {currentLanguage === "ar" 
                    ? "خاص بموظفي ومراجعي وزارة التجارة والصناعة لاعتماد الشركات وتدقيق عقود التأسيس المرفوعة إلكترونياً."
                    : "Exclusive access panel for Ministry registrars and directorates to audit company structures and issue sovereign codes."}
                </p>
              </div>

              {corporateCompanies.filter(c => c.status !== "approved" && c.status !== "rejected").length > 0 ? (
                <div className="space-y-4">
                  {corporateCompanies.filter(c => c.status !== "approved" && c.status !== "rejected").map(corp => (
                    <div key={corp.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <span className="text-[9px] uppercase font-black text-sudan-gold bg-sudan-gold/10 px-2 rounded border border-sudan-gold/20">
                            {getEntityTypeName(corp.entityType)}
                          </span>
                          <h4 className="text-sm font-extrabold text-[#1E293B] mt-1.5">
                            {currentLanguage === "ar" ? corp.legalNameAr : corp.legalNameEn}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-bold mt-0.5">{currentLanguage === "ar" ? `رأس المال المقترح: ${corp.capital.toLocaleString()} SDG` : `Proposed Capital: ${corp.capital.toLocaleString()} SDG`}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400 font-bold block">{currentLanguage === "ar" ? "الحالة الحالية:" : "Current Stage:"}</span>
                          <div className="mt-1">{getStatusBadge(corp.status)}</div>
                        </div>
                      </div>

                      {/* Display of shareholders for review */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-gray-600">
                        <div>
                          <span className="text-gray-400 block mb-1">{currentLanguage === "ar" ? "المؤسسين وحصص التملك:" : "Founders stakes:"}</span>
                          <div className="space-y-1">
                            {corp.shareholders.map(sh => (
                              <div key={sh.id} className="flex items-center justify-between p-1.5 bg-white border border-slate-100 rounded-lg">
                                <span>👤 {sh.name}</span>
                                <span className="text-sudan-green">{sh.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-400 block mb-1">{currentLanguage === "ar" ? "المستندات المرفقة للمطابقة:" : "Governance documents:"}</span>
                          <div className="space-y-1">
                            {corp.documents.map(doc => (
                              <div key={doc.id} className="flex items-center justify-between p-1.5 bg-white border border-slate-100 rounded-lg">
                                <span>📄 {doc.name}</span>
                                <span className="text-[9px] text-emerald-600 font-extrabold">✓ READY</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Review Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200">
                        <button
                          onClick={() => handleGovReview(corp.id, "approved")}
                          className="flex items-center gap-1 bg-sudan-green hover:bg-sudan-green-light text-white px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all shadow-xs"
                        >
                          <Check className="h-4 w-4" />
                          {currentLanguage === "ar" ? "تصديق نهائي وإصدار السجل" : "Approve & Issue Registry"}
                        </button>
                        <button
                          onClick={() => handleGovReview(corp.id, "legal_review")}
                          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
                        >
                          <FileText className="h-4 w-4" />
                          {currentLanguage === "ar" ? "إحالة للتدقيق القانوني" : "Route to Legal Audit"}
                        </button>
                        <button
                          onClick={() => handleGovReview(corp.id, "rejected")}
                          className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
                        >
                          <X className="h-4 w-4" />
                          {currentLanguage === "ar" ? "رفض وإعادة الطلب للمراجعة" : "Reject Application"}
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400 text-xs font-bold bg-slate-50 border border-slate-100 rounded-3xl">
                  {currentLanguage === "ar" ? "لا توجد طلبات معلقة قيد المراجعة والتدقيق حالياً" : "All corporate registries and bylaws cleared. No pending requests."}
                </div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* MODAL 1: LIFECYCLE AMENDMENTS */}
      {isAmendmentModalOpen && selectedCorp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl max-w-lg w-full relative space-y-4">
            <button
              onClick={() => setIsAmendmentModalOpen(false)}
              className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-black text-gray-800">
              {currentLanguage === "ar" ? "تقديم طلب تعديل الهيكل القانوني أو تصفية الشركة" : "Sovereign Lifecycle Amendment & Restructuring Application"}
            </h3>

            <form onSubmit={handleApplyAmendment} className="space-y-4 text-xs font-bold text-gray-600">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase">{currentLanguage === "ar" ? "نوع التعديل القانوني المطلوب *" : "Amendment type *"}</label>
                <select
                  value={amendmentType}
                  onChange={(e) => setAmendmentType(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none cursor-pointer"
                >
                  <option value="capital_increase">{currentLanguage === "ar" ? "زيادة رأس المال الإجمالي" : "Capital Increase"}</option>
                  <option value="capital_reduction">{currentLanguage === "ar" ? "تخفيض رأس المال الإجمالي" : "Capital Reduction"}</option>
                  <option value="activity_change">{currentLanguage === "ar" ? "تعديل الأنشطة التجارية المقررة" : "Activity Amendment"}</option>
                  <option value="address_change">{currentLanguage === "ar" ? "تعديل عنوان المركز الرئيسي" : "Address/Relocation change"}</option>
                  <option value="director_change">{currentLanguage === "ar" ? "تعديل مجلس الإدارة أو الشركاء" : "Director/Governance shuffle"}</option>
                  <option value="merger">{currentLanguage === "ar" ? "دمج الشركة مع كيان آخر" : "Company Merger"}</option>
                  <option value="conversion">{currentLanguage === "ar" ? "تحويل الشكل والكيان القانوني للشركة" : "Company Conversion"}</option>
                  <option value="dissolution">{currentLanguage === "ar" ? "حل وتصفية الشركة اختيارياً" : "Voluntary Dissolution"}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase">{currentLanguage === "ar" ? "تفاصيل التعديل (بالعربية) *" : "Details description (Ar) *"}</label>
                <textarea
                  rows={3}
                  required
                  value={amendmentDescAr}
                  onChange={(e) => setAmendmentDescAr(e.target.value)}
                  placeholder="زيادة رأس مال الشركة لتمويل خط إنتاج غزل أقطان الكومب بمقدار 20 مليون جنيه"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase">{currentLanguage === "ar" ? "تفاصيل التعديل (بالانجليزية) *" : "Details description (En) *"}</label>
                <textarea
                  rows={3}
                  required
                  value={amendmentDescEn}
                  onChange={(e) => setAmendmentDescEn(e.target.value)}
                  placeholder="Increasing standard operating capital by 20M SDG for manufacturing extensions"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C5A059] hover:bg-[#AA8648] text-white py-3 rounded-2xl text-xs font-black cursor-pointer transition-all shadow"
              >
                {currentLanguage === "ar" ? "تقديم طلب التعديل للديوان" : "Submit Amendment Application"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BRANCH LICENSING */}
      {isBranchModalOpen && selectedCorp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl max-w-lg w-full relative space-y-4">
            <button
              onClick={() => setIsBranchModalOpen(false)}
              className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-black text-gray-800">
              {currentLanguage === "ar" ? `ترخيص فرع جديد لشركة: ${selectedCorp.legalNameAr}` : `License New Domestic Branch for: ${selectedCorp.legalNameEn}`}
            </h3>

            <form onSubmit={handleCreateBranch} className="space-y-4 text-xs font-bold text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase">{currentLanguage === "ar" ? "اسم الفرع المقترح *" : "Proposed Branch Name *"}</label>
                  <input
                    type="text"
                    required
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="فرع الجزيرة للتعبئة والتوزيع"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase">{currentLanguage === "ar" ? "مدير الفرع المسجل *" : "Registered Branch Manager *"}</label>
                  <input
                    type="text"
                    required
                    value={branchManager}
                    onChange={(e) => setBranchManager(e.target.value)}
                    placeholder="محمد كمال الدين"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase">{currentLanguage === "ar" ? "ولاية الفرع *" : "State *"}</label>
                  <select
                    value={branchState}
                    onChange={(e) => setBranchState(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none cursor-pointer"
                  >
                    {SUDANESE_STATES.map(s => (
                      <option key={s.id} value={s.nameAr}>{s.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase">{currentLanguage === "ar" ? "المدينة/المحلية *" : "City *"}</label>
                  <input
                    type="text"
                    required
                    value={branchCity}
                    onChange={(e) => setBranchCity(e.target.value)}
                    placeholder="مدني"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase">{currentLanguage === "ar" ? "الأنشطة الفرعية المقررة (مفصولة بفاصلة) *" : "Activities *"}</label>
                <textarea
                  rows={2}
                  required
                  value={branchActs}
                  onChange={(e) => setBranchActs(e.target.value)}
                  placeholder="التغليف والتوزيع اللوجستي المحلي بالجزيرة"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sudan-green hover:bg-sudan-green-light text-white py-3 rounded-2xl text-xs font-black cursor-pointer transition-all shadow"
              >
                {currentLanguage === "ar" ? "تسجيل وإصدار رخصة الفرع" : "Issue Branch Operating License"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
