/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  FileText, Shield, Key, Search, Upload, Plus, Download, Eye, Share2, 
  Trash2, RefreshCw, CheckCircle, AlertTriangle, Clock, ArrowRight, 
  BookOpen, Lock, Tag, Layers, Database, UserCheck, Check, Globe,
  FileCheck, Calendar, Filter, Send, Award, Activity, BarChart2, Briefcase
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell 
} from "recharts";

interface PlatformProps {
  currentLanguage: "ar" | "en";
}

// 10 Distinct roles requested
type GovRole = 
  | "Clerk" 
  | "Records Officer" 
  | "Correspondence Officer" 
  | "Archivist" 
  | "Department Manager" 
  | "Director" 
  | "Legal Officer" 
  | "Undersecretary" 
  | "Minister" 
  | "Super Administrator";

export default function GovernmentRecordsArchivePlatform({ currentLanguage }: PlatformProps) {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedRole, setSelectedRole] = useState<GovRole>("Director");
  
  // Data State
  const [documents, setDocuments] = useState<any[]>([]);
  const [correspondences, setCorrespondences] = useState<any[]>([]);
  const [archives, setArchives] = useState<any[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [retentionPolicies, setRetentionPolicies] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  
  // Search & Filter state
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [docClassFilter, setDocClassFilter] = useState("all");
  const [corrTypeFilter, setCorrTypeFilter] = useState("all");
  const [corrSearchQuery, setCorrSearchQuery] = useState("");
  const [archiveSearchQuery, setArchiveSearchQuery] = useState("");
  const [kbCategoryFilter, setKbCategoryFilter] = useState("all");
  const [kbSearchQuery, setKbSearchQuery] = useState("");

  // Loading & Action states
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [assistantLoading, setAssistantLoading] = useState(false);
  
  // OCR Scanned template selection
  const [selectedOcrTemplate, setSelectedOcrTemplate] = useState("license_scanned");
  const [customOcrText, setCustomOcrText] = useState("");
  const [ocrResult, setOcrResult] = useState<any>(null);
  
  // AI Assistant active state
  const [assistantResult, setAssistantResult] = useState<any>(null);
  const [assistantDocId, setAssistantDocId] = useState("");

  // Form states
  const [newDoc, setNewDoc] = useState({
    title: "",
    titleEn: "",
    fileType: "pdf",
    classification: "public",
    retentionPeriodYears: "5",
    tagsString: "",
    department: "الشؤون الإدارية العامة"
  });

  const [newCorr, setNewCorr] = useState({
    subject: "",
    subjectEn: "",
    correspondenceType: "internal",
    sender: "ديوان وزارة التجارة والصناعة",
    recipient: "الأمانة العامة لمجلس الوزراء",
    priority: "normal",
    classificationLevel: "confidential"
  });

  const [newKb, setNewKb] = useState({
    titleAr: "",
    titleEn: "",
    category: "circular",
    content: "",
    version: "1.0"
  });

  const [shareDocId, setShareDocId] = useState<string | null>(null);
  const [shareDept, setShareDept] = useState("نظم المعلومات والتحول الرقمي");

  // Notification message
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // --- FETCH DATA ON LOAD ---
  const loadData = async () => {
    setLoading(true);
    try {
      const [docsRes, corrRes, archRes, kbRes, policyRes, auditRes] = await Promise.all([
        fetch("/api/documents"),
        fetch("/api/correspondences"),
        fetch("/api/archive"),
        fetch("/api/knowledge"),
        fetch("/api/retention-policies"),
        fetch("/api/gov-audit-logs")
      ]);

      const [docs, corrs, archs, kbs, policies, audits] = await Promise.all([
        docsRes.json(),
        corrRes.json(),
        archRes.json(),
        kbRes.json(),
        policyRes.json(),
        auditRes.json()
      ]);

      setDocuments(docs);
      setCorrespondences(corrs);
      setArchives(archs);
      setKnowledgeBase(kbs);
      setRetentionPolicies(policies);
      setAuditLogs(audits);
    } catch (e) {
      console.error("Failed to load records database", e);
      showNotification(currentLanguage === "ar" ? "فشل الاتصال بالخادم الرئيسي لقاعدة البيانات" : "Failed connection to primary records backend", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentLanguage]);

  // Utility to show notification
  const showNotification = (text: string, type: "success" | "error" | "info" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // --- API MUTATIONS ---

  // Create Document
  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.titleEn) {
      showNotification(currentLanguage === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill out required fields", "error");
      return;
    }

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newDoc,
          ownerName: getActiveNameByRole(selectedRole),
          ownerRole: selectedRole,
          tags: newDoc.tagsString.split(",").map(t => t.trim()).filter(Boolean)
        })
      });

      if (response.ok) {
        const result = await response.json();
        setDocuments([result.document, ...documents]);
        setAuditLogs([result.log, ...auditLogs]);
        showNotification(
          currentLanguage === "ar" ? "تم تسجيل وأرشفة الوثيقة وتشفيرها بنجاح" : "Document created, encrypted and registered successfully",
          "success"
        );
        // Reset form
        setNewDoc({
          title: "",
          titleEn: "",
          fileType: "pdf",
          classification: "public",
          retentionPeriodYears: "5",
          tagsString: "",
          department: "الشؤون الإدارية العامة"
        });
      }
    } catch (e) {
      showNotification(currentLanguage === "ar" ? "فشل حفظ الوثيقة" : "Failed to save document", "error");
    }
  };

  // Share Document
  const handleShareDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: shareDept,
          actorName: getActiveNameByRole(selectedRole),
          actorRole: selectedRole
        })
      });

      if (response.ok) {
        const result = await response.json();
        setDocuments(documents.map(d => d.id === id ? result.document : d));
        setAuditLogs([result.log, ...auditLogs]);
        setShareDocId(null);
        showNotification(
          currentLanguage === "ar" 
            ? `تمت مشاركة الوثيقة مع إدارة [${shareDept}] بأمان` 
            : `Shared document securely with [${shareDept}] department`,
          "success"
        );
      }
    } catch (e) {
      showNotification(currentLanguage === "ar" ? "فشل مشاركة الوثيقة" : "Failed sharing document", "error");
    }
  };

  // Archive Document
  const handleArchiveDocument = async (id: string) => {
    try {
      const response = await fetch("/api/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: id,
          actorName: getActiveNameByRole(selectedRole),
          actorRole: selectedRole
        })
      });

      if (response.ok) {
        const result = await response.json();
        setArchives([result.archiveRecord, ...archives]);
        setAuditLogs([result.log, ...auditLogs]);
        showNotification(
          currentLanguage === "ar" 
            ? "تم ترحيل الوثيقة للأرشيف الرقمي السيادي وتوليد بصمة الـ Blockchain" 
            : "Document moved to Sovereign Archive with secure ledger block generated",
          "success"
        );
      }
    } catch (e) {
      showNotification(currentLanguage === "ar" ? "فشل ترحيل الوثيقة للأرشيف" : "Failed to archive document", "error");
    }
  };

  // Dispose/Destroy Document
  const handleDeleteDocument = async (id: string, action: "disposed" | "destroyed") => {
    const confirmMsg = currentLanguage === "ar"
      ? `هل أنت متأكد من ${action === "destroyed" ? "إتلاف" : "استبعاد"} هذا المستند نهائياً طبقاً لسياسات حفظ السجلات الفيدرالية؟`
      : `Are you sure you want to ${action === "destroyed" ? "destroy" : "dispose"} this document under federal retention guidelines?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await fetch(`/api/documents/${id}?action=${action}&actorName=${getActiveNameByRole(selectedRole)}&actorRole=${selectedRole}`, {
        method: "DELETE"
      });

      if (response.ok) {
        const result = await response.json();
        setDocuments(documents.filter(d => d.id !== id));
        setAuditLogs([result.log, ...auditLogs]);
        showNotification(
          currentLanguage === "ar" 
            ? `${action === "destroyed" ? "تم إتلاف المادة الورقية والرقمية بالكامل" : "تم استبعاد المستند بنجاح"}` 
            : `Document ${action === "destroyed" ? "permanently destroyed" : "disposed"} successfully`,
          "success"
        );
      }
    } catch (e) {
      showNotification(currentLanguage === "ar" ? "فشل إجراء الاستبعاد" : "Failed disposal action", "error");
    }
  };

  // Register Correspondence
  const handleCreateCorrespondence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCorr.subject || !newCorr.subjectEn) {
      showNotification(currentLanguage === "ar" ? "يرجى كتابة موضوع المراسلة" : "Please provide correspondence subject", "error");
      return;
    }

    try {
      const response = await fetch("/api/correspondences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCorr,
          authorName: getActiveNameByRole(selectedRole),
          authorRole: selectedRole
        })
      });

      if (response.ok) {
        const result = await response.json();
        setCorrespondences([result.correspondence, ...correspondences]);
        setAuditLogs([result.log, ...auditLogs]);
        showNotification(
          currentLanguage === "ar" ? "تم تسجيل المعاملة وتخصيص الباركود السيادي" : "Correspondence registered with sovereign reference barcode allocated",
          "success"
        );
        setNewCorr({
          subject: "",
          subjectEn: "",
          correspondenceType: "internal",
          sender: "ديوان وزارة التجارة والصناعة",
          recipient: "الأمانة العامة لمجلس الوزراء",
          priority: "normal",
          classificationLevel: "confidential"
        });
      }
    } catch (e) {
      showNotification(currentLanguage === "ar" ? "فشل تسجيل المعاملة" : "Failed to register correspondence", "error");
    }
  };

  // Sign / Approve Correspondence
  const handleApproveCorrespondence = async (id: string) => {
    try {
      const response = await fetch(`/api/correspondences/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actorName: getActiveNameByRole(selectedRole),
          actorRole: selectedRole
        })
      });

      if (response.ok) {
        const result = await response.json();
        setCorrespondences(correspondences.map(c => c.id === id ? result.correspondence : c));
        setAuditLogs([result.log, ...auditLogs]);
        showNotification(
          currentLanguage === "ar" 
            ? "تم التوقيع الرقمي السيادي المتعدد واعتماد الخطاب عبر خدمات الهوية الوطنية" 
            : "Sovereign Multi-level Digital Signature verified and document authorized successfully",
          "success"
        );
      }
    } catch (e) {
      showNotification(currentLanguage === "ar" ? "فشل التوقيع الرقمي" : "Failed digital signature validation", "error");
    }
  };

  // Create Knowledge base item
  const handleCreateKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKb.titleAr || !newKb.content) {
      showNotification(currentLanguage === "ar" ? "يرجى ملء جميع حقول المستند المعرفي" : "Please fill out knowledge base fields", "error");
      return;
    }

    try {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newKb,
          actorName: getActiveNameByRole(selectedRole),
          actorRole: selectedRole
        })
      });

      if (response.ok) {
        const result = await response.json();
        setKnowledgeBase([result.knowledgeItem, ...knowledgeBase]);
        setAuditLogs([result.log, ...auditLogs]);
        showNotification(
          currentLanguage === "ar" ? "تم النشر بنجاح في مستودع المعرفة المركزي" : "Knowledge item published in central sovereign repository",
          "success"
        );
        setNewKb({
          titleAr: "",
          titleEn: "",
          category: "circular",
          content: "",
          version: "1.0"
        });
      }
    } catch (e) {
      showNotification(currentLanguage === "ar" ? "فشل نشر المورد المعرفي" : "Failed to publish knowledge item", "error");
    }
  };

  // Run AI OCR
  const handleRunOcr = async () => {
    setOcrLoading(true);
    setOcrResult(null);
    try {
      const response = await fetch("/api/documents/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: selectedOcrTemplate,
          fileDescription: customOcrText
        })
      });

      if (response.ok) {
        const data = await response.json();
        setOcrResult(data.ocrResults);
        showNotification(
          currentLanguage === "ar" ? "اكتمل المسح الضوئي الذكي واستخراج البصمة بنجاح" : "Intelligent scanned OCR finished successfully",
          "success"
        );
      }
    } catch (e) {
      showNotification(currentLanguage === "ar" ? "فشل الاتصال بمستخرج الذكاء الاصطناعي" : "OCR Extraction failed", "error");
    } finally {
      setOcrLoading(false);
    }
  };

  // Run AI Assistant
  const handleRunAssistant = async (docTitle: string, docContent: string, docId: string) => {
    setAssistantLoading(true);
    setAssistantDocId(docId);
    setAssistantResult(null);
    try {
      const response = await fetch("/api/documents/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: docTitle,
          content: docContent,
          type: "all"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAssistantResult(data.aiAnalysis);
        showNotification(
          currentLanguage === "ar" ? "تم إقرار الدراسة التحليلية وصياغة التوصيات" : "AI compliance analysis and retention study completed",
          "success"
        );
      }
    } catch (e) {
      showNotification(currentLanguage === "ar" ? "فشل تحليل الذكاء الاصطناعي" : "AI analysis failed", "error");
    } finally {
      setAssistantLoading(false);
    }
  };

  // Export metadata mass report
  const handleExportMetadata = () => {
    const reportData = {
      reportType: "Sovereign Information Governance Report",
      generatedAt: new Date().toISOString(),
      governedBy: getActiveNameByRole(selectedRole),
      totalManagedDocuments: documents.length,
      activeCorrespondenceCount: correspondences.length,
      immutableArchiveRecords: archives.length,
      registryLogs: auditLogs.length,
      policies: retentionPolicies,
      documentsList: documents.map(d => ({ id: d.id, title: d.title, classification: d.classification, retention: d.retentionPeriodYears })),
      correspondenceList: correspondences.map(c => ({ ref: c.referenceNumber, type: c.correspondenceType, status: c.status }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Sovereign_Records_Audit_Report_2026.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showNotification(
      currentLanguage === "ar" ? "تم تصدير تقرير معايير حوكمة البيانات الموحد" : "Sovereign Information Governance Report exported successfully",
      "success"
    );
  };

  // --- COMPONENT ROLE / RBAC HELPER ---
  const getActiveNameByRole = (role: GovRole) => {
    const names: Record<GovRole, string> = {
      "Clerk": "عوض الجاك الطيب",
      "Records Officer": "أ. إيمان الفاتح البشير",
      "Correspondence Officer": "أ. يس طه الخضر",
      "Archivist": "بروفيسور عوض الله عمر",
      "Department Manager": "د. عبد السلام حسن",
      "Director": "أ. منى صلاح الجعلي",
      "Legal Officer": "المستشار القانوني معاوية الدومة",
      "Undersecretary": "م. عثمان صالح الجزولي",
      "Minister": "معالي وزير التجارة والصناعة الاتحادية",
      "Super Administrator": "المهندس السيادي للأنظمة"
    };
    return names[role];
  };

  const getRoleTranslations = (role: GovRole) => {
    const translations: Record<GovRole, { ar: string; en: string }> = {
      "Clerk": { ar: "كاتب ملفات رقمي", en: "Digital File Clerk" },
      "Records Officer": { ar: "مسؤول السجلات الفيدرالي", en: "Federal Records Officer" },
      "Correspondence Officer": { ar: "ضابط المراسلات الرسمية", en: "Official Correspondence Officer" },
      "Archivist": { ar: "أمين الأرشيف والتوثيق السيادي", en: "Sovereign Archivist" },
      "Department Manager": { ar: "مدير إدارة هندسة الأصول", en: "Assets Department Manager" },
      "Director": { ar: "مدير عام الإدارة العامة للمطابقة", en: "Compliance Director General" },
      "Legal Officer": { ar: "المستشار القانوني العام للدولة", en: "State Legal Advisor General" },
      "Undersecretary": { ar: "سعادة وكيل الوزارة الاتحادي", en: "Federal Undersecretary" },
      "Minister": { ar: "معالي وزير التجارة والصناعة سيادياً", en: "Sovereign Federal Minister" },
      "Super Administrator": { ar: "المشرف الأمني للأنظمة السيادية", en: "Sovereign Security Administrator" }
    };
    return translations[role];
  };

  // Role permissions checks (RBAC)
  const canCreateDoc = ["Clerk", "Records Officer", "Department Manager", "Director", "Undersecretary", "Minister", "Super Administrator"].includes(selectedRole);
  const canDeleteDoc = ["Director", "Undersecretary", "Minister", "Super Administrator"].includes(selectedRole);
  const canSignCorr = ["Undersecretary", "Minister", "Director"].includes(selectedRole);
  const canManageArchive = ["Archivist", "Super Administrator", "Director"].includes(selectedRole);
  const canPublishKnowledge = ["Director", "Undersecretary", "Minister", "Legal Officer"].includes(selectedRole);

  // --- RECHARTS STYLING CONSTANTS ---
  const SUDAN_GREEN = "#007229";
  const SUDAN_RED = "#D21034";
  const SUDAN_BLACK = "#000000";
  const SUDAN_GOLD = "#C5A059";

  // Filtered lists
  const filteredDocs = documents.filter(d => {
    const matchSearch = docSearchQuery === "" || 
      d.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      d.titleEn.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      (d.tags && d.tags.some((t: string) => t.toLowerCase().includes(docSearchQuery.toLowerCase())));
    const matchClass = docClassFilter === "all" || d.classification === docClassFilter;
    return matchSearch && matchClass;
  });

  const filteredCorrs = correspondences.filter(c => {
    const matchSearch = corrSearchQuery === "" ||
      c.subject.toLowerCase().includes(corrSearchQuery.toLowerCase()) ||
      c.subjectEn.toLowerCase().includes(corrSearchQuery.toLowerCase()) ||
      c.referenceNumber.toLowerCase().includes(corrSearchQuery.toLowerCase()) ||
      c.sender.toLowerCase().includes(corrSearchQuery.toLowerCase()) ||
      c.recipient.toLowerCase().includes(corrSearchQuery.toLowerCase());
    const matchType = corrTypeFilter === "all" || c.correspondenceType === corrTypeFilter;
    return matchSearch && matchType;
  });

  const filteredArchives = archives.filter(a => {
    return archiveSearchQuery === "" ||
      a.title.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
      a.originalDocId.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
      a.immutableHash.toLowerCase().includes(archiveSearchQuery.toLowerCase());
  });

  const filteredKbs = knowledgeBase.filter(k => {
    const matchSearch = kbSearchQuery === "" ||
      k.titleAr.toLowerCase().includes(kbSearchQuery.toLowerCase()) ||
      k.titleEn.toLowerCase().includes(kbSearchQuery.toLowerCase()) ||
      k.content.toLowerCase().includes(kbSearchQuery.toLowerCase());
    const matchCat = kbCategoryFilter === "all" || k.category === kbCategoryFilter;
    return matchSearch && matchCat;
  });

  // Calculate stats for Dashboard
  const activeCount = documents.length;
  const incomingCount = correspondences.filter(c => c.correspondenceType === "incoming").length;
  const outgoingCount = correspondences.filter(c => c.correspondenceType === "outgoing").length;
  const pendingSignCount = correspondences.filter(c => c.status !== "approved").length;
  const archivedCount = archives.length;

  const docFlowData = [
    { name: currentLanguage === "ar" ? "يناير" : "Jan", incoming: 4, outgoing: 2, internal: 8 },
    { name: currentLanguage === "ar" ? "فبراير" : "Feb", incoming: 7, outgoing: 5, internal: 12 },
    { name: currentLanguage === "ar" ? "مارس" : "Mar", incoming: 10, outgoing: 8, internal: 15 },
    { name: currentLanguage === "ar" ? "أبريل" : "Apr", incoming: 15, outgoing: 12, internal: 19 },
    { name: currentLanguage === "ar" ? "مايو" : "May", incoming: 18, outgoing: 14, internal: 25 },
    { name: currentLanguage === "ar" ? "يونيو" : "Jun", incoming: 22, outgoing: 19, internal: 28 },
    { name: currentLanguage === "ar" ? "يوليو" : "Jul", incoming: activeCount + 12, outgoing: correspondences.filter(c => c.correspondenceType === "outgoing").length + 15, internal: 32 }
  ];

  const classPieData = [
    { name: currentLanguage === "ar" ? "عادي / عام" : "Public", value: documents.filter(d => d.classification === "public").length, color: "#10B981" },
    { name: currentLanguage === "ar" ? "سري" : "Secret", value: documents.filter(d => d.classification === "secret").length, color: "#F59E0B" },
    { name: currentLanguage === "ar" ? "سري للغاية" : "Top Secret", value: documents.filter(d => d.classification === "top_secret").length, color: "#EF4444" },
    { name: currentLanguage === "ar" ? "مشترك / محدود" : "Confidential", value: documents.filter(d => d.classification === "confidential").length, color: "#3B82F6" }
  ];

  return (
    <div className="w-full bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden font-sans" id="gov-records-platform">
      
      {/* Banner / Header Title */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-950 text-white p-6 md:p-8 border-b-4 border-sudan-green relative overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-sudan-green text-white p-3.5 rounded-xl shadow-lg border border-[#ffffff1b]">
              <Database className="h-8 w-8 animate-pulse text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-sudan-red text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">SDMCI SECURE RECORD</span>
                <span className="text-slate-400 text-xs">|</span>
                <span className="text-sudan-gold text-xs font-mono">VISION SUDAN 2035</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
                {currentLanguage === "ar" 
                  ? "المنصة الاتحادية الموحدة لإدارة الوثائق، المراسلات والأرشيف الرقمي" 
                  : "Federal Platform for Government Documents, Correspondence & Digital Archives"}
              </h1>
              <p className="text-slate-300 text-xs mt-1 md:text-sm font-medium">
                {currentLanguage === "ar"
                  ? "النظام الرئاسي الشامل للأرشفة الرقمية والتحقق الموثوق والتحول الورقي الصفري"
                  : "Comprehensive federal enterprise ecosystem for trusted smart records and zero-paper transition"}
              </p>
            </div>
          </div>

          {/* Mass Metadata Export Action */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleExportMetadata}
              className="px-4 py-2 bg-[#1E293B] hover:bg-slate-800 text-sudan-gold border border-sudan-gold/30 hover:border-sudan-gold text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? "تصدير تقرير الحوكمة الفيدرالي" : "Export Governance Audit File"}</span>
            </button>
            <button
              onClick={loadData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-sudan-green" : ""}`} />
            </button>
          </div>
        </div>

        {/* Dynamic State Notification Banner inside Header */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-xs border ${
            message.type === "success" ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30" :
            message.type === "error" ? "bg-rose-950/80 text-rose-300 border-rose-500/30" :
            "bg-blue-950/80 text-blue-300 border-blue-500/30"
          }`}>
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Sovereign Role & Identity Impersonation Control Panel */}
      <div className="bg-slate-100 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold font-mono">
          <Shield className="h-4 w-4 text-sudan-green" />
          <span>{currentLanguage === "ar" ? "صلاحيات الوصول القائم على الأدوار (RBAC):" : "Role-Based Access Identity:"}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-sudan-green animate-pulse" />
            <span className="font-bold text-slate-800">
              {getActiveNameByRole(selectedRole)}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-sudan-green font-semibold">
              {getRoleTranslations(selectedRole)[currentLanguage]}
            </span>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value as GovRole);
              showNotification(
                currentLanguage === "ar" 
                  ? `تمت محاكاة الهوية الرسمية لـ [${getRoleTranslations(e.target.value as GovRole).ar}] بنجاح` 
                  : `Simulating security credentials for [${e.target.value}] active officer`,
                "info"
              );
            }}
            className="text-xs bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-3 py-1.5 rounded-lg font-semibold shadow-sm focus:ring-1 focus:ring-sudan-green focus:outline-none cursor-pointer"
          >
            <option value="Clerk">Clerk (كاتب)</option>
            <option value="Records Officer">Records Officer (مسؤول وثائق)</option>
            <option value="Correspondence Officer">Correspondence Officer (مراسلات)</option>
            <option value="Archivist">Archivist (أمين أرشيف)</option>
            <option value="Department Manager">Department Manager (مدير قسم)</option>
            <option value="Director">Director (مدير عام)</option>
            <option value="Legal Officer">Legal Officer (مستشار قانوني)</option>
            <option value="Undersecretary">Undersecretary (وكيل وزارة)</option>
            <option value="Minister">Minister (معالي الوزير)</option>
            <option value="Super Administrator">Super Administrator (مشرف نظام)</option>
          </select>
        </div>
      </div>

      {/* Main Internal Navigation Grid */}
      <div className="flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 bg-slate-900 text-slate-300 border-r border-slate-800/60 p-4 space-y-1 flex-shrink-0">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {currentLanguage === "ar" ? "أدوات السجلات الفيدرالية" : "Federal Records Subsystems"}
          </div>

          {[
            { id: "dashboard", labelAr: "مؤشرات القيادة والتحليل", labelEn: "Sovereign Dashboard", icon: BarChart2 },
            { id: "documents", labelAr: "المستندات والوثائق", labelEn: "Enterprise Documents", icon: FileText },
            { id: "correspondence", labelAr: "المراسلات والخطابات", labelEn: "Official Correspondence", icon: Send },
            { id: "archive", labelAr: "الأرشيف القومي المحصن", labelEn: "Sovereign Digital Archive", icon: Shield },
            { id: "ocr", labelAr: "قارئ البصمة و AI OCR", labelEn: "AI OCR & Processing", icon: Key },
            { id: "knowledge", labelAr: "المستودع المعرفي المركزي", labelEn: "Sovereign Knowledge Hub", icon: BookOpen },
            { id: "audit", labelAr: "دفتر التدقيق الجنائي للأنظمة", labelEn: "Immutable Audits ledger", icon: Activity }
          ].map((navItem) => {
            const IconComponent = navItem.icon;
            const isActive = activeTab === navItem.id;
            return (
              <button
                key={navItem.id}
                onClick={() => setActiveTab(navItem.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                  isActive 
                    ? "bg-sudan-green text-white shadow-md border-l-4 border-sudan-gold" 
                    : "hover:bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent className={`h-4.5 w-4.5 ${isActive ? "text-sudan-gold" : "text-slate-400"}`} />
                  <span>{currentLanguage === "ar" ? navItem.labelAr : navItem.labelEn}</span>
                </div>
                {navItem.id === "correspondence" && pendingSignCount > 0 && (
                  <span className="bg-sudan-red text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {pendingSignCount}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-8 text-center text-[10px] text-slate-500 font-medium">
            <div>SDMCI SECURE RECORDS PLATFORM</div>
            <div>VER. 4.0.1 (SUITE 2035)</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto min-h-[600px] bg-slate-50">
          
          {/* TAB 1: SOVEREIGN DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* KPIs Widgets */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-sudan-green rounded-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">{currentLanguage === "ar" ? "الوثائق النشطة" : "Active Documents"}</div>
                    <div className="text-2xl font-bold font-mono text-slate-800 mt-1">{activeCount}</div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Send className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">{currentLanguage === "ar" ? "الوارد والصادر" : "Correspondence"}</div>
                    <div className="text-2xl font-bold font-mono text-slate-800 mt-1">{correspondences.length}</div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <Clock className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">{currentLanguage === "ar" ? "معاملات قيد التوقيع" : "Pending Signatures"}</div>
                    <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{pendingSignCount}</div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-rose-50 text-sudan-red rounded-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">{currentLanguage === "ar" ? "الأرشيف السيادي" : "Immutable Archive"}</div>
                    <div className="text-2xl font-bold font-mono text-slate-800 mt-1">{archivedCount}</div>
                  </div>
                </div>
              </div>

              {/* Graphical Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart 1: Document flow timeline */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-sudan-green" />
                    <span>{currentLanguage === "ar" ? "تحليل تدفق المراسلات والخطابات الرسمية (الوارد/الصادر)" : "Correspondence Flow Analysis (Incoming/Outgoing)"}</span>
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={docFlowData}>
                        <defs>
                          <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={SUDAN_GREEN} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={SUDAN_GREEN} stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={SUDAN_RED} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={SUDAN_RED} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="incoming" name={currentLanguage === "ar" ? "المراسلات الواردة" : "Incoming"} stroke={SUDAN_GREEN} fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
                        <Area type="monotone" dataKey="outgoing" name={currentLanguage === "ar" ? "المراسلات الصادرة" : "Outgoing"} stroke={SUDAN_RED} fillOpacity={1} fill="url(#colorOut)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Security Classifications Breakdown */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <Lock className="h-4.5 w-4.5 text-sudan-red" />
                    <span>{currentLanguage === "ar" ? "توزيع درجات السرية والتصنيف" : "Document Security Classification"}</span>
                  </h3>
                  <div className="h-64 flex flex-col justify-between">
                    <ResponsiveContainer width="100%" height="75%">
                      <PieChart>
                        <Pie
                          data={classPieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {classPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Pie Legend */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 mt-2">
                      {classPieData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="truncate">{item.name}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* AI Strategic Insights Banner */}
              <div className="bg-slate-900 border border-sudan-gold/20 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sudan-green/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sudan-green/20 rounded-xl text-sudan-gold border border-sudan-gold/30">
                    <Award className="h-7 w-7 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      {currentLanguage === "ar" ? "رؤية المستشار الذكي لحوكمة السجلات الفيدرالية 2035" : "AI Strategic Information Governance Advisor Insights"}
                    </h4>
                    <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
                      {currentLanguage === "ar"
                        ? "تحليل المستشار: تم رصد زيادة بنسبة 14% في المراسلات الإدارية بين مكاتب وزارة الصناعة والتجارة والأمانة الفيدرالية هذا الشهر. نوصي بتحديث فترات الاحتفاظ لملفات الصمغ العربي لتصبح 15 عاماً لضمان الجدة والاستمرارية السيادية."
                        : "Sovereign AI Advisory: An increase of 14% in active inter-ministerial communications was flagged this month. We recommend raising the digital retention period for industrial gum Arabic standards to 15 years to match COMESA directives."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("ocr")}
                  className="px-4 py-2 bg-sudan-green hover:bg-sudan-green/90 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
                >
                  <span>{currentLanguage === "ar" ? "تفعيل مساعد المعالجة الذكي" : "Launch IDP Processing"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Audit logs quick view */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-sudan-green" />
                    <span>{currentLanguage === "ar" ? "سجل المعاملات والعمليات الأخيرة الموثقة" : "Recent Document Governance Transactions"}</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("audit")}
                    className="text-xs text-sudan-green font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{currentLanguage === "ar" ? "عرض دفتر الحسابات الكامل" : "View Complete Ledger"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {auditLogs.slice(0, 4).map((log, idx) => (
                    <div key={log.id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className={`w-2 h-2 rounded-full mt-1.5 ${
                          log.eventType?.includes("signature") ? "bg-amber-500" :
                          log.eventType?.includes("creation") ? "bg-emerald-500" :
                          "bg-blue-500"
                        }`} />
                        <div>
                          <p className="font-bold text-slate-800">
                            {currentLanguage === "ar" ? log.descriptionAr : log.descriptionEn}
                          </p>
                          <p className="text-slate-400 text-[10px] font-medium mt-0.5">
                            {currentLanguage === "ar" ? "المسؤول" : "Actor"}: {log.actorName} ({log.actorRole})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                          {log.systemHash ? log.systemHash.slice(0, 16) : "g_hash_778ba2dfc"}
                        </span>
                        <span className="text-slate-400 font-medium text-[10px] min-w-[120px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ENTERPRISE DOCUMENT MANAGEMENT */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              
              {/* Document Actions header & search bar */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
                
                {/* Search Inputs */}
                <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={currentLanguage === "ar" ? "ابحث بالاسم، الرقم، أو الكلمات الدلالية..." : "Search by name, ID, or tags..."}
                      value={docSearchQuery}
                      onChange={(e) => setDocSearchQuery(e.target.value)}
                      className="w-full text-xs pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sudan-green focus:outline-none"
                    />
                  </div>
                  
                  {/* Classification Filter */}
                  <div className="relative w-full sm:w-44">
                    <select
                      value={docClassFilter}
                      onChange={(e) => setDocClassFilter(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg py-2 px-3 focus:ring-1 focus:ring-sudan-green focus:outline-none cursor-pointer"
                    >
                      <option value="all">{currentLanguage === "ar" ? "كل تصنيفات السرية" : "All Classifications"}</option>
                      <option value="public">{currentLanguage === "ar" ? "عادي / عام" : "Public"}</option>
                      <option value="confidential">{currentLanguage === "ar" ? "مشترك / محدود" : "Confidential"}</option>
                      <option value="secret">{currentLanguage === "ar" ? "سري" : "Secret"}</option>
                      <option value="top_secret">{currentLanguage === "ar" ? "سري للغاية" : "Top Secret"}</option>
                    </select>
                  </div>
                </div>

                <div className="text-slate-400 text-xs font-mono font-bold">
                  {currentLanguage === "ar" ? `تم العثور على ${filteredDocs.length} وثيقة` : `Found ${filteredDocs.length} documents`}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Documents list panel */}
                <div className="lg:col-span-2 space-y-4">
                  {filteredDocs.map((doc) => (
                    <div key={doc.id} className="bg-white border border-slate-200 hover:border-sudan-green/40 p-5 rounded-xl shadow-sm transition-all relative">
                      
                      {/* Classification ribbon color */}
                      <span className={`absolute top-0 right-0 w-3 h-full rounded-r-xl ${
                        doc.classification === "top_secret" ? "bg-rose-600" :
                        doc.classification === "secret" ? "bg-amber-500" :
                        doc.classification === "confidential" ? "bg-blue-500" :
                        "bg-emerald-500"
                      }`} />

                      <div className="mr-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-sudan-green">{doc.id}</span>
                              <span className="text-slate-300">|</span>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase font-mono">{doc.fileType}</span>
                              <span className="text-slate-300">|</span>
                              <span className="text-slate-400 text-[10px] font-semibold">{doc.size}</span>
                              <span className="text-slate-300">|</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                doc.classification === "top_secret" ? "bg-rose-50 text-rose-600" :
                                doc.classification === "secret" ? "bg-amber-50 text-amber-600" :
                                doc.classification === "confidential" ? "bg-blue-50 text-blue-600" :
                                "bg-emerald-50 text-emerald-600"
                              }`}>
                                {currentLanguage === "ar" 
                                  ? (doc.classification === "top_secret" ? "سري للغاية" : doc.classification === "secret" ? "سري" : doc.classification === "confidential" ? "مشترك / محدود" : "عادي")
                                  : doc.classification.toUpperCase()}
                              </span>
                            </div>
                            
                            <h4 className="text-sm font-bold text-slate-800 mt-2">
                              {currentLanguage === "ar" ? doc.title : doc.titleEn}
                            </h4>
                            
                            <p className="text-slate-400 text-[10px] font-medium mt-1">
                              {currentLanguage === "ar" ? `المالك: ${doc.ownerName} (${doc.ownerRole})` : `Owner: ${doc.ownerName} (${doc.ownerRole})`}
                              <span className="mx-2">|</span>
                              {currentLanguage === "ar" ? `الإدارة: ${doc.department}` : `Department: ${doc.department}`}
                            </p>
                          </div>

                          {/* Signature Status Stamp */}
                          {doc.isSigned ? (
                            <div className="bg-emerald-50 border border-emerald-200/50 text-emerald-600 rounded px-2.5 py-1 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>{currentLanguage === "ar" ? "معتمد وموقع رقمياً" : "Signed & Certified"}</span>
                            </div>
                          ) : (
                            <div className="bg-slate-100 text-slate-400 rounded px-2 py-1 text-[10px] font-semibold">
                              {currentLanguage === "ar" ? "مسودة غير موقعة" : "Unsigned Draft"}
                            </div>
                          )}
                        </div>

                        {/* Tags display */}
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3.5">
                            {doc.tags.map((tag: string, i: number) => (
                              <span key={i} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 transition-colors">
                                <Tag className="h-2.5 w-2.5 text-slate-400" />
                                <span>{tag}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Shared departments */}
                        {doc.sharedDepartments && doc.sharedDepartments.length > 0 && (
                          <div className="mt-3 text-[10px] bg-blue-50/50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-lg flex flex-wrap items-center gap-1.5">
                            <span className="font-bold">{currentLanguage === "ar" ? "مشارك مع إدارات:" : "Shared with:"}</span>
                            {doc.sharedDepartments.map((dept: string, i: number) => (
                              <span key={i} className="bg-white border border-blue-200 px-1.5 py-0.5 rounded">{dept}</span>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons for Documents */}
                        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 mt-4 pt-3.5">
                          <button
                            onClick={() => handleRunAssistant(doc.title, currentLanguage === "ar" ? doc.title : doc.titleEn, doc.id)}
                            className="text-[11px] font-bold text-sudan-green hover:bg-sudan-green/5 bg-white px-3 py-1.5 rounded border border-sudan-green/20 hover:border-sudan-green transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Award className="h-3.5 w-3.5" />
                            <span>{currentLanguage === "ar" ? "مستشار الحوكمة والـ AI" : "AI Governance Study"}</span>
                          </button>

                          <button
                            onClick={() => setShareDocId(doc.id)}
                            className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 bg-white px-3 py-1.5 rounded border border-blue-200 hover:border-blue-400 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            <span>{currentLanguage === "ar" ? "مشاركة آمنة" : "Secure Share"}</span>
                          </button>

                          <button
                            onClick={() => handleArchiveDocument(doc.id)}
                            className="text-[11px] font-bold text-amber-600 hover:bg-amber-50 bg-white px-3 py-1.5 rounded border border-amber-200 hover:border-amber-400 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Shield className="h-3.5 w-3.5" />
                            <span>{currentLanguage === "ar" ? "ترحيل للأرشيف" : "Move to Archive"}</span>
                          </button>

                          {canDeleteDoc && (
                            <button
                              onClick={() => handleDeleteDocument(doc.id, "destroyed")}
                              className="text-[11px] font-bold text-sudan-red hover:bg-red-50 bg-white px-3 py-1.5 rounded border border-red-200 hover:border-red-400 transition-all flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>{currentLanguage === "ar" ? "إتلاف سيادي" : "Policy Destruction"}</span>
                            </button>
                          )}
                        </div>

                        {/* Interactive sharing dropdown/drawer */}
                        {shareDocId === doc.id && (
                          <div className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded-lg space-y-3">
                            <h5 className="text-xs font-bold text-slate-800">{currentLanguage === "ar" ? "اختر الإدارة لربط ومشاركة هذا الملف:" : "Select Department to securely share:"}</h5>
                            <div className="flex gap-2">
                              <select
                                value={shareDept}
                                onChange={(e) => setShareDept(e.target.value)}
                                className="text-xs bg-white border border-slate-300 p-2 rounded flex-1 focus:outline-none"
                              >
                                <option value="نظم المعلومات والتحول الرقمي">نظم المعلومات والتحول الرقمي</option>
                                <option value="السجل التجاري والشركات">السجل التجاري والشركات</option>
                                <option value="ديوان مراجعة الحسابات الفيدرالي">ديوان مراجعة الحسابات الفيدرالي</option>
                                <option value="هيئة حماية المستهلك السودانية">هيئة حماية المستهلك السودانية</option>
                                <option value="صندوق الابتكار وبراءات الاختراع">صندوق الابتكار وبراءات الاختراع</option>
                              </select>
                              <button
                                onClick={() => handleShareDocument(doc.id)}
                                className="px-3 py-2 bg-sudan-green hover:bg-sudan-green/90 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                              >
                                {currentLanguage === "ar" ? "تأكيد المشاركة" : "Confirm Share"}
                              </button>
                              <button
                                onClick={() => setShareDocId(null)}
                                className="px-3 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 font-bold text-xs rounded transition-colors cursor-pointer"
                              >
                                {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* AI Analysis results expansion */}
                        {assistantDocId === doc.id && assistantLoading && (
                          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center gap-2">
                            <RefreshCw className="h-4.5 w-4.5 text-sudan-green animate-spin" />
                            <span className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "يقوم مستشار الـ AI بفحص ومطابقة المستند..." : "AI compliance & retention audit in progress..."}</span>
                          </div>
                        )}

                        {assistantDocId === doc.id && assistantResult && (
                          <div className="mt-4 p-4 bg-slate-950 text-slate-100 rounded-lg border border-sudan-gold/20 space-y-3 shadow-inner">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-sudan-gold">
                                <Award className="h-4 w-4" />
                                <span>{currentLanguage === "ar" ? "تقرير تدقيق حوكمة البيانات الذكي" : "Sovereign AI Governance Audit Report"}</span>
                              </div>
                              <button
                                onClick={() => setAssistantResult(null)}
                                className="text-[10px] text-slate-400 hover:text-white"
                              >
                                [X]
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-slate-500 font-bold block">{currentLanguage === "ar" ? "التصنيف المقترح:" : "Classification advice:"}</span>
                                <span className="bg-slate-800 text-white font-mono px-2 py-0.5 rounded inline-block mt-1 capitalize">{assistantResult.classification}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 font-bold block">{currentLanguage === "ar" ? "فترة الاحتفاظ الموصى بها:" : "Retention match:"}</span>
                                <span className="text-sudan-gold font-bold">{assistantResult.retentionYears} {currentLanguage === "ar" ? "سنوات (سياسي/مالي)" : "Years (Standard)"}</span>
                              </div>
                            </div>

                            <div className="text-xs">
                              <span className="text-slate-500 font-bold block">{currentLanguage === "ar" ? "موقع الأرشفة والملفات المقترح:" : "Suggested Archiving Node:"}</span>
                              <span className="text-slate-200 block mt-1">{currentLanguage === "ar" ? assistantResult.filingLocationAr : assistantResult.filingLocationEn}</span>
                            </div>

                            <div className="text-xs">
                              <span className="text-slate-500 font-bold block">{currentLanguage === "ar" ? "الملخص التنفيذي السيادي:" : "Executive Summary:"}</span>
                              <div className="text-slate-300 space-y-1.5 mt-1 leading-relaxed">
                                {currentLanguage === "ar" ? assistantResult.summaryAr : assistantResult.summaryEn}
                              </div>
                            </div>

                            <div className="text-xs bg-slate-900 p-2 rounded border border-slate-800">
                              <span className="text-slate-400 font-bold block">{currentLanguage === "ar" ? "فحص التكرار والمنازعات:" : "Duplication & Conflict scan:"}</span>
                              <span className="text-emerald-400 block mt-1">{assistantResult.duplicateStatus}</span>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  ))}

                  {filteredDocs.length === 0 && (
                    <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
                      <AlertTriangle className="h-10 w-10 text-slate-300 mx-auto" />
                      <p className="text-slate-500 text-xs font-bold mt-2">{currentLanguage === "ar" ? "لم يتم العثور على وثائق مطابقة لعوامل التصفية" : "No documents match filters"}</p>
                    </div>
                  )}
                </div>

                {/* Create Document Form Panel (Side) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm self-start">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <Upload className="h-4.5 w-4.5 text-sudan-green" />
                    <span>{currentLanguage === "ar" ? "تسجيل وأرشفة وثيقة جديدة" : "Register New Document"}</span>
                  </h3>

                  {canCreateDoc ? (
                    <form onSubmit={handleCreateDocument} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "عنوان المستند (عربي) *" : "Document Title (Arabic) *"}</label>
                        <input
                          type="text"
                          required
                          value={newDoc.title}
                          onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                          placeholder="مثال: القرار الإداري لتنظيم الصادرات"
                          className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sudan-green bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "عنوان المستند (إنجليزي) *" : "Document Title (English) *"}</label>
                        <input
                          type="text"
                          required
                          value={newDoc.titleEn}
                          onChange={(e) => setNewDoc({ ...newDoc, titleEn: e.target.value })}
                          placeholder="e.g. Administrative Decree for Export Standards"
                          className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sudan-green bg-slate-50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "نوع الملف" : "File Type"}</label>
                          <select
                            value={newDoc.fileType}
                            onChange={(e) => setNewDoc({ ...newDoc, fileType: e.target.value })}
                            className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none"
                          >
                            <option value="pdf">PDF</option>
                            <option value="docx">DOCX</option>
                            <option value="xlsx">XLSX</option>
                            <option value="png">PNG/JPG</option>
                            <option value="dwg">DWG Map</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "فترة الاستبقاء" : "Retention Period"}</label>
                          <select
                            value={newDoc.retentionPeriodYears}
                            onChange={(e) => setNewDoc({ ...newDoc, retentionPeriodYears: e.target.value })}
                            className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none"
                          >
                            <option value="3">3 {currentLanguage === "ar" ? "سنوات" : "Years"}</option>
                            <option value="5">5 {currentLanguage === "ar" ? "سنوات" : "Years"}</option>
                            <option value="10">10 {currentLanguage === "ar" ? "سنوات" : "Years"}</option>
                            <option value="15">15 {currentLanguage === "ar" ? "سنوات" : "Years"}</option>
                            <option value="25">25 {currentLanguage === "ar" ? "سنة" : "Years"}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "درجة السرية والتصنيف" : "Classification Level"}</label>
                        <select
                          value={newDoc.classification}
                          onChange={(e) => setNewDoc({ ...newDoc, classification: e.target.value })}
                          className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none"
                        >
                          <option value="public">{currentLanguage === "ar" ? "عادي / عام (Public)" : "Public"}</option>
                          <option value="confidential">{currentLanguage === "ar" ? "مشترك / محدود (Confidential)" : "Confidential"}</option>
                          <option value="secret">{currentLanguage === "ar" ? "سري فدرالي (Secret)" : "Secret"}</option>
                          <option value="top_secret">{currentLanguage === "ar" ? "سري للغاية سيادي (Top Secret)" : "Top Secret"}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "الإدارة المسؤولة" : "Assigned Department"}</label>
                        <select
                          value={newDoc.department}
                          onChange={(e) => setNewDoc({ ...newDoc, department: e.target.value })}
                          className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none"
                        >
                          <option value="الشؤون الإدارية العامة">الشؤون الإدارية العامة</option>
                          <option value="الصناعات الزراعية والغابات">الصناعات الزراعية والغابات</option>
                          <option value="تطوير المشاريع الصغيرة والمتوسطة">تطوير المشاريع الصغيرة والمتوسطة</option>
                          <option value="التنمية الصناعية والمناطق الاستثمارية">التنمية الصناعية والمناطق الاستثمارية</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {currentLanguage === "ar" ? "الكلمات الدلالية (مفصولة بفاصلة) *" : "Tags (comma-separated) *"}
                        </label>
                        <input
                          type="text"
                          value={newDoc.tagsString}
                          onChange={(e) => setNewDoc({ ...newDoc, tagsString: e.target.value })}
                          placeholder={currentLanguage === "ar" ? "صمغ عربي, بورتسودان, جمارك" : "Gum Arabic, Port Sudan, Customs"}
                          className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sudan-green bg-slate-50"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-sudan-green hover:bg-sudan-green/95 text-white font-bold text-xs rounded shadow transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "إقرار وتسجيل الوثيقة بأمان" : "Authorize & Register Document"}
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded border border-rose-100 flex items-start gap-2">
                      <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>
                        {currentLanguage === "ar"
                          ? `عذراً، لا تمتلك هوية [${getRoleTranslations(selectedRole).ar}] صلاحية أرشفة أو إدخال وثائق جديدة.`
                          : `Role [${selectedRole}] is not authorized to register new federal documents.`}
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: ELECTRONIC CORRESPONDENCE */}
          {activeTab === "correspondence" && (
            <div className="space-y-6">
              
              {/* Correspondence Tab Filters */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "all", ar: "كل المراسلات الموثقة", en: "All Correspondence" },
                    { id: "incoming", ar: "خطابات واردة", en: "Incoming (MIN)" },
                    { id: "outgoing", ar: "خطابات صادرة", en: "Outgoing (OUT)" },
                    { id: "internal", ar: "خطابات داخلية", en: "Internal Circulars (INT)" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setCorrTypeFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        corrTypeFilter === tab.id 
                          ? "bg-slate-900 text-white shadow-sm" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {currentLanguage === "ar" ? tab.ar : tab.en}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={currentLanguage === "ar" ? "ابحث بالرقم المرجعي أو الموضوع..." : "Search by Reference or Subject..."}
                    value={corrSearchQuery}
                    onChange={(e) => setCorrSearchQuery(e.target.value)}
                    className="w-full text-xs pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sudan-green focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Correspondence Listing */}
                <div className="lg:col-span-2 space-y-4">
                  {filteredCorrs.map((corr) => (
                    <div key={corr.id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4 relative">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              corr.correspondenceType === "incoming" ? "bg-sudan-green" :
                              corr.correspondenceType === "outgoing" ? "bg-sudan-red" :
                              "bg-slate-500"
                            }`} />
                            <span className="font-bold text-xs text-slate-800 font-mono">{corr.referenceNumber}</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 uppercase rounded">
                              {corr.correspondenceType}
                            </span>
                          </div>
                          
                          <p className="text-[10px] font-medium text-slate-400">
                            {currentLanguage === "ar" 
                              ? `من: ${corr.sender} ➔ إلى: ${corr.recipient}` 
                              : `From: ${corr.sender} ➔ To: ${corr.recipient}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            corr.priority === "immediate" ? "bg-rose-50 text-rose-600 animate-pulse" :
                            corr.priority === "high" ? "bg-amber-50 text-amber-600" :
                            "bg-slate-50 text-slate-600"
                          }`}>
                            {corr.priority.toUpperCase()}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            corr.status === "approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"
                          }`}>
                            {corr.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-snug">
                          {currentLanguage === "ar" ? corr.subject : corr.subjectEn}
                        </h4>
                        <p className="text-slate-400 text-[10px] mt-1.5">
                          {currentLanguage === "ar" ? "تاريخ التسجيل السيادي:" : "Registered At:"} {new Date(corr.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Display Secure Signature verification and QR */}
                      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{currentLanguage === "ar" ? "التوقيع الرقمي والاعتماد الفيدرالي" : "Federal Cryptographic Stamp"}</div>
                          {corr.digitalSignature ? (
                            <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold">
                              <UserCheck className="h-4.5 w-4.5" />
                              <span className="font-mono text-[11px] truncate max-w-[250px]">{corr.digitalSignature}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                              <AlertTriangle className="h-4 w-4" />
                              <span>{currentLanguage === "ar" ? "قيد التدقيق والتوقيع" : "Awaiting Authorization"}</span>
                            </div>
                          )}
                        </div>

                        {/* QR and digital signature action */}
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-1 rounded border border-slate-200" title="Scan QR to Verify on sdmci.gov.sd">
                            <div className="w-10 h-10 bg-slate-800 flex items-center justify-center text-white text-[8px] font-bold font-mono text-center">
                              QR VERIFY
                            </div>
                          </div>
                          
                          {/* Sign button (undersecretary/minister/director general) */}
                          {!corr.digitalSignature && canSignCorr && (
                            <button
                              onClick={() => handleApproveCorrespondence(corr.id)}
                              className="px-3 py-2 bg-sudan-green hover:bg-sudan-green/95 text-white text-xs font-bold rounded shadow transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileCheck className="h-4 w-4" />
                              <span>{currentLanguage === "ar" ? "توقيع واعتماد رقمي" : "Sign & Approve"}</span>
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  ))}

                  {filteredCorrs.length === 0 && (
                    <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
                      <AlertTriangle className="h-10 w-10 text-slate-300 mx-auto" />
                      <p className="text-slate-500 text-xs font-bold mt-2">{currentLanguage === "ar" ? "لا يوجد خطابات أو مراسلات مطابقة في الأرشيف النشط" : "No registered correspondences match filters"}</p>
                    </div>
                  )}
                </div>

                {/* Register correspondence form */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm self-start">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <Send className="h-4.5 w-4.5 text-sudan-green" />
                    <span>{currentLanguage === "ar" ? "تسجيل صادر/وارد رسمي جديد" : "Draft Official Dispatch"}</span>
                  </h3>

                  <form onSubmit={handleCreateCorrespondence} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "موضوع الخطاب باللغة العربية *" : "Subject (Arabic) *"}</label>
                      <input
                        type="text"
                        required
                        value={newCorr.subject}
                        onChange={(e) => setNewCorr({ ...newCorr, subject: e.target.value })}
                        placeholder="مثال: طلب تسهيلات جمركية لقطاع الصمغ العربي"
                        className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "موضوع الخطاب باللغة الإنجليزية *" : "Subject (English) *"}</label>
                      <input
                        type="text"
                        required
                        value={newCorr.subjectEn}
                        onChange={(e) => setNewCorr({ ...newCorr, subjectEn: e.target.value })}
                        placeholder="e.g. Customs Facilitation Request for Gum Arabic"
                        className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "مسار المعاملة" : "Correspondence Track"}</label>
                      <select
                        value={newCorr.correspondenceType}
                        onChange={(e) => setNewCorr({ ...newCorr, correspondenceType: e.target.value })}
                        className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none"
                      >
                        <option value="incoming">{currentLanguage === "ar" ? "وارد رسمي من جهة خارجية" : "Incoming"}</option>
                        <option value="outgoing">{currentLanguage === "ar" ? "صادر رسمي لجهة خارجية" : "Outgoing"}</option>
                        <option value="internal">{currentLanguage === "ar" ? "خطاب/منشور داخلي مشترك" : "Internal"}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "مستوى الأهمية" : "Priority"}</label>
                        <select
                          value={newCorr.priority}
                          onChange={(e) => setNewCorr({ ...newCorr, priority: e.target.value })}
                          className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none"
                        >
                          <option value="normal">{currentLanguage === "ar" ? "عادي" : "Normal"}</option>
                          <option value="high">{currentLanguage === "ar" ? "عاجل" : "High"}</option>
                          <option value="immediate">{currentLanguage === "ar" ? "عاجل جداً سيادي" : "Immediate"}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "درجة التصنيف" : "Classification"}</label>
                        <select
                          value={newCorr.classificationLevel}
                          onChange={(e) => setNewCorr({ ...newCorr, classificationLevel: e.target.value })}
                          className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none"
                        >
                          <option value="public">{currentLanguage === "ar" ? "عادي" : "Public"}</option>
                          <option value="confidential">{currentLanguage === "ar" ? "مشترك" : "Confidential"}</option>
                          <option value="secret">{currentLanguage === "ar" ? "سري للغاية" : "Secret"}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "الجهة المرسلة *" : "Sender *"}</label>
                      <input
                        type="text"
                        required
                        value={newCorr.sender}
                        onChange={(e) => setNewCorr({ ...newCorr, sender: e.target.value })}
                        className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "الجهة المستلمة *" : "Recipient *"}</label>
                      <input
                        type="text"
                        required
                        value={newCorr.recipient}
                        onChange={(e) => setNewCorr({ ...newCorr, recipient: e.target.value })}
                        className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none bg-slate-50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs rounded shadow transition-all cursor-pointer"
                    >
                      {currentLanguage === "ar" ? "تسجيل وأرشفة المعاملة الفيدرالية" : "Register Formal Dispatch"}
                    </button>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: IMMUTABLE SOVEREIGN DIGITAL ARCHIVE */}
          {activeTab === "archive" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-900 text-sudan-gold rounded-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{currentLanguage === "ar" ? "سجل الأرشيف الرقمي السيادي المحصن" : "Immutable Sovereign Archival Registers"}</h3>
                    <p className="text-slate-400 text-[10px]">{currentLanguage === "ar" ? "سجلات أرشفة محصنة ببصمة لا تتبدل لحماية تاريخ السودان المعرفي والصناعي" : "Sovereign archive index with immutable hashes for regulatory historical security"}</p>
                  </div>
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={currentLanguage === "ar" ? "ابحث ببصمة الهاش أو الاسم الأصلي..." : "Search by Hash or original Title..."}
                    value={archiveSearchQuery}
                    onChange={(e) => setArchiveSearchQuery(e.target.value)}
                    className="w-full text-xs pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Archives Listing */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-right sm:text-right text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase font-mono font-bold">
                    <tr>
                      <th className="p-3.5 text-center">{currentLanguage === "ar" ? "معرف الأرشيف" : "Archive ID"}</th>
                      <th className="p-3.5">{currentLanguage === "ar" ? "العنوان السيادي" : "Sovereign Title"}</th>
                      <th className="p-3.5">{currentLanguage === "ar" ? "أرشفة بواسطة" : "Archived By"}</th>
                      <th className="p-3.5">{currentLanguage === "ar" ? "تاريخ الحجز والأرشفة" : "Archived At"}</th>
                      <th className="p-3.5">{currentLanguage === "ar" ? "بصمة التشفير الجنائية (SHA-256)" : "Cryptographic Hash"}</th>
                      <th className="p-3.5 text-center">{currentLanguage === "ar" ? "حالة الحفظ" : "Preservation State"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredArchives.map((arc) => (
                      <tr key={arc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-center font-mono font-bold text-slate-700">{arc.id}</td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-800">{arc.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Original ID: {arc.originalDocId}</p>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">{arc.archivedBy}</td>
                        <td className="p-4 text-slate-400 font-mono text-[11px]">{new Date(arc.archivedAt).toLocaleString()}</td>
                        <td className="p-4">
                          <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded inline-block shadow-inner">
                            {arc.immutableHash}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-emerald-100 text-sudan-green font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                            {currentLanguage === "ar" ? "محفوظ للأبد" : "Permanently Preserved"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredArchives.length === 0 && (
                  <div className="p-12 text-center text-slate-400 font-bold">
                    <AlertTriangle className="h-8 w-8 mx-auto text-slate-300" />
                    <p className="mt-2 text-xs">{currentLanguage === "ar" ? "لا يوجد مواد مؤرشفة مطابقة" : "No archives found matching terms"}</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: AI OCR & DOCUMENT PROCESSING HUB */}
          {activeTab === "ocr" && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Simulated Scanned files selector & Trigger */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 self-start">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Upload className="h-4.5 w-4.5 text-sudan-green" />
                    <span>{currentLanguage === "ar" ? "مستخرج النصوص والمستندات بـ AI" : "AI Document Extraction Console"}</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      {currentLanguage === "ar" ? "اختر قالباً لمستند ممسوح ضوئياً لمحاكاة الفحص:" : "Select Scanned Document Template:"}
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: "license_scanned", ar: "رخصة تشغيل وتأسيس شركة (تصدير الصمغ العربي)", en: "Company Registration & Operating License" },
                        { id: "decree_scanned", ar: "القرار الوزاري رقم 14 لتنظيم الصمغ العربي", en: "Ministerial Regulatory Decree No.14" },
                        { id: "customs_scanned", ar: "شهادة المنشأ الصادرة لجمارك بورتسودان", en: "Certificate of Origin - Customs Document" }
                      ].map(template => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => {
                            setSelectedOcrTemplate(template.id);
                            setOcrResult(null);
                          }}
                          className={`w-full text-right sm:text-right p-3 rounded-lg text-xs font-bold border transition-all flex items-start gap-2.5 cursor-pointer ${
                            selectedOcrTemplate === template.id 
                              ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          <FileText className={`h-4.5 w-4.5 mt-0.5 ${selectedOcrTemplate === template.id ? "text-sudan-gold" : "text-slate-400"}`} />
                          <div>
                            <p>{currentLanguage === "ar" ? template.ar : template.en}</p>
                            <span className="text-[9px] text-slate-400 font-mono font-medium">{template.id}.pdf</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {currentLanguage === "ar" ? "إرشادات استخلاص إضافية أو وصف للملف (اختياري):" : "Extraction Prompts / File context (optional):"}
                    </label>
                    <textarea
                      value={customOcrText}
                      onChange={(e) => setCustomOcrText(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "اكتب توجيهات إضافية لمساعد الذكاء الاصطناعي..." : "Write additional instructions for the AI extraction..."}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sudan-green bg-slate-50 h-24"
                    />
                  </div>

                  <button
                    onClick={handleRunOcr}
                    disabled={ocrLoading}
                    className="w-full py-2.5 bg-sudan-green hover:bg-sudan-green/95 text-white font-bold text-xs rounded shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${ocrLoading ? "animate-spin" : ""}`} />
                    <span>{ocrLoading ? (currentLanguage === "ar" ? "جاري المسح واستخلاص النصوص..." : "Extracting...") : (currentLanguage === "ar" ? "بدء المسح واستخراج الـ OCR" : "Run Intelligent AI OCR")}</span>
                  </button>
                </div>

                {/* Display extracted results and parsed JSON */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                  
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Layers className="h-4.5 w-4.5 text-sudan-green" />
                      <span>{currentLanguage === "ar" ? "لوحة مخرجات المسح الذكي والـ OCR" : "AI Scanned OCR Document outputs"}</span>
                    </h3>
                    <span className="text-[10px] bg-slate-100 border px-2 py-0.5 font-bold font-mono text-slate-600 rounded">
                      STATUS: {ocrResult ? "COMPLETED" : "READY"}
                    </span>
                  </div>

                  {ocrResult ? (
                    <div className="space-y-6">
                      
                      {/* Grid for extracted properties */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{currentLanguage === "ar" ? "رقم الوثيقة المستخلص" : "Extracted Document Number"}</span>
                          <span className="font-mono text-xs font-bold text-sudan-green mt-1 block">{ocrResult.documentNumber || "N/A"}</span>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{currentLanguage === "ar" ? "السجلات التجارية / أرقام الشركات" : "Company / SME registration IDs"}</span>
                          <span className="font-mono text-xs font-bold text-blue-600 mt-1 block">
                            {ocrResult.companyNumbers && ocrResult.companyNumbers.length > 0 ? ocrResult.companyNumbers.join(", ") : "N/A"}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{currentLanguage === "ar" ? "أرقام الهوية الوطنية المستخلصة" : "Extracted National IDs"}</span>
                          <span className="font-mono text-xs font-bold text-slate-700 mt-1 block">
                            {ocrResult.nationalIds && ocrResult.nationalIds.length > 0 ? ocrResult.nationalIds.join(", ") : "N/A"}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{currentLanguage === "ar" ? "تواريخ المستند" : "Dates found"}</span>
                          <span className="font-mono text-xs font-bold text-amber-600 mt-1 block">
                            {ocrResult.dates && ocrResult.dates.length > 0 ? ocrResult.dates.join(", ") : "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Names mentioned */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">{currentLanguage === "ar" ? "الأسماء والمسؤولين المذكورين" : "Extracted Names & Figures"}</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {ocrResult.names && ocrResult.names.length > 0 ? ocrResult.names.map((name: string, i: number) => (
                            <span key={i} className="bg-white border border-slate-200 px-2.5 py-1 rounded text-xs font-bold text-slate-800 shadow-sm">
                              {name}
                            </span>
                          )) : <span className="text-xs text-slate-400">N/A</span>}
                        </div>
                      </div>

                      {/* Keywords parsed */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">{currentLanguage === "ar" ? "الكلمات المفتاحية والدلالية المقترحة" : "Extracted Keywords"}</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {ocrResult.keywords && ocrResult.keywords.map((kw: string, i: number) => (
                            <span key={i} className="bg-sudan-green/5 text-sudan-green border border-sudan-green/20 px-2 py-0.5 rounded text-[10px] font-bold">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Transcription full text block */}
                      <div className="bg-slate-900 text-slate-100 p-5 rounded-lg border border-slate-800 shadow-inner relative">
                        <span className="absolute top-2 right-2 text-[9px] bg-slate-800 text-slate-400 font-mono px-1.5 py-0.5 rounded uppercase">Full Scanned Transcription</span>
                        <p className="text-xs font-sans whitespace-pre-wrap leading-relaxed mt-2 text-slate-200">
                          {ocrResult.extractedText}
                        </p>
                      </div>

                      {/* Form action to immediately register this OCR result as active document */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-800">{currentLanguage === "ar" ? "هل ترغب في أرشفة هذه المخرجات رسمياً؟" : "Register these parsed outputs?"}</h4>
                          <p className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "سيؤدي هذا إلى إنشاء مستند نشط في المنصة وحفظه في الخادم" : "This registers an active file index instantly into server.ts"}</p>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch("/api/documents", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  title: `وثيقة مستخلصة بـ OCR: ${ocrResult.documentNumber || "معاملة غير معنونة"}`,
                                  titleEn: `OCR Extracted Doc: ${ocrResult.documentNumber || "Untitled file"}`,
                                  fileType: "pdf",
                                  classification: "confidential",
                                  retentionPeriodYears: 10,
                                  ownerName: getActiveNameByRole(selectedRole),
                                  ownerRole: selectedRole,
                                  tags: ocrResult.keywords || []
                                })
                              });

                              if (response.ok) {
                                const result = await response.json();
                                setDocuments([result.document, ...documents]);
                                setAuditLogs([result.log, ...auditLogs]);
                                showNotification(
                                  currentLanguage === "ar" ? "تم تسجيل وأرشفة مخرجات الـ OCR بنجاح" : "OCR file index created successfully",
                                  "success"
                                );
                              }
                            } catch (e) {
                              showNotification("Failed to save OCR document", "error");
                            }
                          }}
                          className="px-4 py-2 bg-sudan-green hover:bg-sudan-green/95 text-white font-bold text-xs rounded transition-colors shadow cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "أرشفة وتدوين السجل المستخلص" : "Save and File Digitally"}
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="p-16 text-center text-slate-400 font-semibold space-y-3">
                      <Clock className="h-12 w-12 mx-auto text-slate-300 animate-pulse" />
                      <p className="text-xs">{currentLanguage === "ar" ? "الرجاء اختيار مستند ممسوح ضوئياً من القائمة الجانبية وبدء المسح الذكي" : "Select a scanned PDF/Image template on the side panel and trigger AI OCR"}</p>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* TAB 6: CENTRALIZED KNOWLEDGE REPOSITORY */}
          {activeTab === "knowledge" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
                
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "all", ar: "كل الموارد المعرفية", en: "All Knowledge" },
                    { id: "policy", ar: "السياسات واللوائح", en: "Policies" },
                    { id: "procedure", ar: "إجراءات العمل القياسية (SOP)", en: "Procedures" },
                    { id: "circular", ar: "المنشورات والتعاميم", en: "Circulars" },
                    { id: "legal_reference", ar: "المراجع القانونية ومواد القانون", en: "Legal References" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setKbCategoryFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        kbCategoryFilter === tab.id 
                          ? "bg-[#1E293B] text-white shadow-sm" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {currentLanguage === "ar" ? tab.ar : tab.en}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={currentLanguage === "ar" ? "ابحث بالعنوان أو المحتوى المعرفي..." : "Search Knowledge resources..."}
                    value={kbSearchQuery}
                    onChange={(e) => setKbSearchQuery(e.target.value)}
                    className="w-full text-xs pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Knowledge Base Listing */}
                <div className="lg:col-span-2 space-y-4">
                  {filteredKbs.map((kb) => (
                    <div key={kb.id} className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-xl shadow-sm space-y-3 transition-all">
                      
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-sudan-green font-bold">{kb.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold font-mono">VER {kb.version}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            kb.category === "policy" ? "bg-purple-50 text-purple-600" :
                            kb.category === "procedure" ? "bg-blue-50 text-blue-600" :
                            kb.category === "circular" ? "bg-emerald-50 text-emerald-600" :
                            "bg-amber-50 text-amber-600"
                          }`}>
                            {kb.category.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          {currentLanguage === "ar" ? kb.titleAr : kb.titleEn}
                        </h4>
                        <p className="text-slate-600 text-xs mt-2 leading-relaxed whitespace-pre-wrap">
                          {kb.content}
                        </p>
                      </div>

                      <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between font-semibold">
                        <span>{currentLanguage === "ar" ? "التحديث الأخير:" : "Last Updated:"} {new Date(kb.lastUpdated).toLocaleString()}</span>
                        <span className="text-sudan-green">وزارة التجارة والصناعة السودانية 2035</span>
                      </div>

                    </div>
                  ))}

                  {filteredKbs.length === 0 && (
                    <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
                      <AlertTriangle className="h-10 w-10 text-slate-300 mx-auto" />
                      <p className="text-slate-500 text-xs font-bold mt-2">{currentLanguage === "ar" ? "لا يوجد معارف منشورة مطابقة" : "No knowledge resources found"}</p>
                    </div>
                  )}
                </div>

                {/* Publish knowledge form */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm self-start">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <BookOpen className="h-4.5 w-4.5 text-sudan-green" />
                    <span>{currentLanguage === "ar" ? "نشر منشور معرفي أو تعميم جديد" : "Publish Knowledge Resource"}</span>
                  </h3>

                  {canPublishKnowledge ? (
                    <form onSubmit={handleCreateKnowledge} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "العنوان باللغة العربية *" : "Title (Arabic) *"}</label>
                        <input
                          type="text"
                          required
                          value={newKb.titleAr}
                          onChange={(e) => setNewKb({ ...newKb, titleAr: e.target.value })}
                          placeholder="مثال: إجراء الفحص المجهري الموحد للمحاصيل"
                          className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "العنوان باللغة الإنجليزية" : "Title (English)"}</label>
                        <input
                          type="text"
                          value={newKb.titleEn}
                          onChange={(e) => setNewKb({ ...newKb, titleEn: e.target.value })}
                          placeholder="e.g. Microscopic Crops Inspection SOP"
                          className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none bg-slate-50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "التصنيف المعرفي" : "Category"}</label>
                          <select
                            value={newKb.category}
                            onChange={(e) => setNewKb({ ...newKb, category: e.target.value })}
                            className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none"
                          >
                            <option value="policy">Policy (سياسة/لائحة)</option>
                            <option value="procedure">Procedure (إجراء/SOP)</option>
                            <option value="circular">Circular (منشور/تعميم)</option>
                            <option value="legal_reference">Legal Reference (مستند قانوني)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "رقم الإصدار" : "Version"}</label>
                          <input
                            type="text"
                            value={newKb.version}
                            onChange={(e) => setNewKb({ ...newKb, version: e.target.value })}
                            className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none bg-slate-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{currentLanguage === "ar" ? "المحتوى أو نص المنشور المعرفي *" : "Content / Document Body *"}</label>
                        <textarea
                          required
                          value={newKb.content}
                          onChange={(e) => setNewKb({ ...newKb, content: e.target.value })}
                          placeholder={currentLanguage === "ar" ? "اكتب المحتوى الفيدرالي للمنشور هنا..." : "Write knowledge content here..."}
                          className="w-full text-xs p-2.5 border border-slate-300 rounded focus:outline-none h-32 bg-slate-50"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-sudan-green hover:bg-sudan-green/95 text-white font-bold text-xs rounded shadow transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "نشر وتعميم المورد المعرفي" : "Publish to Repository"}
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded border border-rose-100 flex items-start gap-2">
                      <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>
                        {currentLanguage === "ar"
                          ? `عذراً، لا تمتلك هوية [${getRoleTranslations(selectedRole).ar}] الصلاحية القانونية لنشر المنشورات أو السياسات المعرفية للدولة.`
                          : `Role [${selectedRole}] is not authorized to publish new policies or legal manuals.`}
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 7: IMMUTABLE AUDITING LEDGER */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sudan-green text-white rounded-lg">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{currentLanguage === "ar" ? "سجل الرقابة ودفتر المراجعة الجنائية للأنظمة" : "Sovereign Information Governance & Audits Ledger"}</h3>
                    <p className="text-slate-400 text-[10px]">{currentLanguage === "ar" ? "دفتر تدقيق متصل بختم تشفير أمني جنائي لمنع تبديل أو تزوير سجلات المعاملات الحكومية" : "Cryptographically chained immutable ledger monitoring all digital approvals and signages"}</p>
                  </div>
                </div>

                <div className="text-[10px] bg-slate-100 border px-3 py-1.5 font-bold font-mono text-slate-600 rounded flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sudan-green animate-ping" />
                  <span>LEDGER SECURE: SHA-256 ENCRYPTED</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-right sm:text-right text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase font-mono font-bold">
                    <tr>
                      <th className="p-3.5 text-center">ID</th>
                      <th className="p-3.5">{currentLanguage === "ar" ? "العملية والحدث الموثق" : "Event / Action"}</th>
                      <th className="p-3.5">{currentLanguage === "ar" ? "المسؤول عن الإجراء" : "Actor"}</th>
                      <th className="p-3.5">{currentLanguage === "ar" ? "الرتبة / الصفة التنظيمية" : "Sovereign Role"}</th>
                      <th className="p-3.5">{currentLanguage === "ar" ? "التوقيت الفيدرالي" : "Timestamp"}</th>
                      <th className="p-3.5 text-center">{currentLanguage === "ar" ? "بصمة التشفير الجنائية للعملية" : "Cryptographic Hash Trace"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-center font-mono font-bold text-slate-500">{log.id}</td>
                        <td className="p-4 text-slate-800 font-bold">
                          {currentLanguage === "ar" ? log.descriptionAr : log.descriptionEn}
                          {log.documentId && (
                            <span className="font-mono text-[10px] block text-slate-400 mt-0.5">Linked Item: {log.documentId}</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-700">{log.actorName}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">
                            {log.actorRole}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-4 text-center">
                          <span className="font-mono text-[10px] bg-slate-900 text-sudan-gold px-2.5 py-1 rounded inline-block shadow">
                            {log.systemHash || "g_hash_d81aef12bcda0"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
