/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  ShieldCheck, AlertTriangle, Map, Navigation, CheckCircle2, AlertOctagon, 
  Search, Sliders, Calendar, Play, Camera, Mic, CheckSquare, Layers, 
  Users, UserCheck, Scale, Cpu, Sparkles, Send, RefreshCw, FileText, 
  BookOpen, Eye, ClipboardList, Trash2, ArrowUpRight, Download, Printer, 
  HardDrive, FileSpreadsheet, Lock, Check, Clock, Radio, Key, MapPin
} from "lucide-react";
import { 
  UserRole, CommercialRegistration, FactoryRegistration, 
  ImportExportLicense, CertificateOfOrigin, LandApplication, 
  ConsumerComplaint 
} from "../types";
import { 
  inspectionManualsAndDocs, mockInspectors, mockInitialInspections 
} from "./inspectionMockData";

interface SmartInspectionPlatformProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
  companies: CommercialRegistration[];
  factories: FactoryRegistration[];
  licenses: ImportExportLicense[];
  certificates: CertificateOfOrigin[];
  applications: LandApplication[];
  complaints: ConsumerComplaint[];
}

export default function SmartInspectionPlatform({
  currentLanguage,
  role: initialRole,
  companies,
  factories,
  licenses,
  certificates,
  applications,
  complaints
}: SmartInspectionPlatformProps) {
  // Local active roles to simulate the full range of governmental personnel
  const [activeRole, setActiveRole] = useState<string>("inspector"); // inspector, senior_inspector, supervisor, legal, director, minister
  const [activeTab, setActiveTab] = useState<string>("dashboard"); // dashboard, risk_engine, dispatch, field_execution, violations, audits, manuals
  
  // Applet state
  const [inspections, setInspections] = useState(mockInitialInspections);
  const [selectedInspection, setSelectedInspection] = useState(mockInitialInspections[0]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Field Mobile Form simulator states
  const [isOffline, setIsOffline] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "pending_changes">("synced");
  const [fieldGPS, setFieldGPS] = useState<{ lat: number; lng: number } | null>(null);
  const [photoEvidence, setPhotoEvidence] = useState<string[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<string[]>([]);
  const [findingsText, setFindingsText] = useState("");
  const [tempCheckedItems, setTempCheckedItems] = useState<Record<string, boolean>>({});
  const [digitizedSignature, setDigitizedSignature] = useState("");
  const [scannedQrCode, setScannedQrCode] = useState("");

  // Risk Engine parameters
  const [violationWeight, setViolationWeight] = useState(30);
  const [complaintWeight, setComplaintWeight] = useState(30);
  const [activityWeight, setActivityWeight] = useState(40);
  const [dynamicSchedulesCount, setDynamicSchedulesCount] = useState(0);

  // Violation Filer Panel
  const [newViolationCategory, setNewViolationCategory] = useState("expired_goods");
  const [newViolationSeverity, setNewViolationSeverity] = useState("medium");
  const [newViolationDesc, setNewViolationDesc] = useState("");
  const [calculatedFine, setCalculatedFine] = useState(50000);

  // Legal and Appeals board states
  const [appeals, setAppeals] = useState([
    { id: "APL-101", inspectionId: "INSP-2026-002", entityName: "شركة البشير للمواد الطبية", violation: "مستحضرات منتهية الصلاحية", fine: 150000, reasonAr: "المستحضرات كانت في ركن المرتجعات المخصص للإتلاف وليست للبيع.", reasonEn: "Goods were in dedicated disposal bin, not for retail.", status: "pending" }
  ]);

  // Cryptographic audit logs
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; timestamp: string; actionAr: string; actionEn: string; actor: string; hash: string; status: "valid" | "tampered" }>>([
    { id: "AUD-001", timestamp: "2026-07-15 06:40:12", actionAr: "توليد مصفوفة المخاطر الوطنية وتوزيع حصص التفتيش", actionEn: "Generated national risk matrix and dispatched inspections", actor: "نظام الجدولة الذكي", hash: "sha256-4c7b89...f012", status: "valid" },
    { id: "AUD-002", timestamp: "2026-07-15 07:10:45", actionAr: "المصادقة الجغرافية وتوقيع محضر التفتيش INSP-2026-002", actionEn: "GPS handshaking and digital signature verification for INSP-2026-002", actor: "المفتش نضال الطيب", hash: "sha256-82bc19...3bde", status: "valid" }
  ]);

  // AI Assistant Simulation Chat
  const [aiHistory, setAiHistory] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: currentLanguage === "ar" 
      ? "مرحباً بك معالي مستشار الرقابة والتفتيش الذكي. يمكنني تحليل مستويات المخاطر للشركات والمصانع، التوصية بجدولة التفتيش، والتنبؤ بمكامن المخالفات حسب القطاع والولاية." 
      : "Welcome back. I am your Smart Regulatory and Inspection Advisor. I can analyze risk thresholds, dispatch optimal inspection schedules, and predict infraction hotspots across sectors." 
    }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Export report states
  const [exportFormat, setExportFormat] = useState("csv");
  const [activeReportTab, setActiveReportTab] = useState("daily_compliance");
  const [reportLogs, setReportLogs] = useState<string>("");

  // Sync state if offline toggled
  const handleOfflineToggle = () => {
    setIsOffline(!isOffline);
    if (!isOffline) {
      // Transitioning to offline
      setSyncStatus("pending_changes");
    } else {
      // Re-connecting online
      setSyncStatus("syncing");
      setTimeout(() => {
        setSyncStatus("synced");
        // Append log
        const timestamp = new Date().toLocaleString();
        setAuditLogs(prev => [
          {
            id: `AUD-${Math.floor(Math.random() * 1000)}`,
            timestamp,
            actionAr: "مزامنة البيانات الميدانية غير المتصلة والتحقق من التواقيع والمواقع",
            actionEn: "Synchronized offline field records, verified location bindings and digital signatures",
            actor: "بوابة المزامنة الذكية",
            hash: `sha256-${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
            status: "valid"
          },
          ...prev
        ]);
      }, 1500);
    }
  };

  // Generate dynamic priority schedule based on custom weights
  const runRiskBasedScheduling = () => {
    setDynamicSchedulesCount(prev => prev + 1);
    const updated = inspections.map(insp => {
      // Calculate dynamic risk score
      const baseRisk = insp.riskScore;
      const calculatedScore = Math.min(100, Math.round(
        (baseRisk * 0.4) + 
        (violationWeight * 0.7) + 
        (complaintWeight * 0.5) + 
        (activityWeight * 0.4)
      ));
      
      let priority: "low" | "medium" | "high" | "critical" = "medium";
      if (calculatedScore > 85) priority = "critical";
      else if (calculatedScore > 70) priority = "high";
      else if (calculatedScore > 40) priority = "medium";
      else priority = "low";

      return {
        ...insp,
        riskScore: calculatedScore,
        priority
      };
    });
    setInspections(updated);
    // Find active selection in updated list
    const found = updated.find(i => i.id === selectedInspection.id);
    if (found) setSelectedInspection(found);

    const timestamp = new Date().toLocaleString();
    setAuditLogs(prev => [
      {
        id: `AUD-${Math.floor(Math.random() * 1000)}`,
        timestamp,
        actionAr: "إعادة احتساب مصفوفة المخاطر والفرز التلقائي للزيارات الميدانية",
        actionEn: "Recalculated national risk assessment and auto-routed active inspections",
        actor: "محرك المخاطر AI Engine",
        hash: "sha256-d7a8e2...c31b",
        status: "valid"
      },
      ...prev
    ]);
  };

  // Simulate mobile GPS capture
  const mockGpsCapture = () => {
    setFieldGPS({ lat: 15.6083 + (Math.random() - 0.5) * 0.05, lng: 32.5294 + (Math.random() - 0.5) * 0.05 });
  };

  // Simulate Photo Upload
  const mockPhotoUpload = () => {
    const urls = [
      "https://images.unsplash.com/photo-1513828742140-ccaa34f3bfc0?w=400&auto=format&fit=crop&q=60", // industrial factory line
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&auto=format&fit=crop&q=60", // inspection tools
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&auto=format&fit=crop&q=60"  // documents verification
    ];
    const picked = urls[Math.floor(Math.random() * urls.length)];
    setPhotoEvidence(prev => [...prev, picked]);
  };

  // Simulate QR Code Scan
  const mockQrScan = () => {
    setScannedQrCode(`SDMCI-REG-VALID-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  // Simulate voice notes
  const mockVoiceNote = () => {
    const notes = [
      "إفادة ميدانية: تلاحظ التزام المنشأة بالمسارات الآمنة ولكن خط الإنتاج الثاني يحتاج فحص الغلايات.",
      "ملاحظة الرقابة: السجلات التجارية متطابقة، غير أن رخصة تصريح البيئة توشك على الانتهاء."
    ];
    setVoiceNotes(prev => [...prev, notes[Math.floor(Math.random() * notes.length)]]);
  };

  // Save/Submit Mobile field report
  const handleFieldSubmit = () => {
    const updated = inspections.map(insp => {
      if (insp.id === selectedInspection.id) {
        return {
          ...insp,
          status: "review" as const,
          findings: findingsText || "تمت مطابقة شروط التفتيش ميدانياً وحصر المخالفات المرفقة.",
          evidence: {
            photos: photoEvidence.length > 0 ? photoEvidence : insp.evidence.photos,
            voiceNotes: voiceNotes.length > 0 ? voiceNotes : insp.evidence.voiceNotes,
            signature: digitizedSignature || "Inspector_Field_Signed"
          },
          checklist: insp.checklist.map(item => ({
            ...item,
            checked: tempCheckedItems[item.item] !== undefined ? tempCheckedItems[item.item] : item.checked
          }))
        };
      }
      return insp;
    });

    setInspections(updated);
    const found = updated.find(i => i.id === selectedInspection.id);
    if (found) setSelectedInspection(found);

    // Reset simulator states
    setPhotoEvidence([]);
    setVoiceNotes([]);
    setFindingsText("");
    setDigitizedSignature("");
    setScannedQrCode("");
    setTempCheckedItems({});

    const timestamp = new Date().toLocaleString();
    setAuditLogs(prev => [
      {
        id: `AUD-${Math.floor(Math.random() * 1000)}`,
        timestamp,
        actionAr: `رفع محضر تفتيش ميداني للطلب ${selectedInspection.id} للمراجعة والإقرار`,
        actionEn: `Submitted inspection findings for ${selectedInspection.id} for supervisor review`,
        actor: "مستكشف الميدان الرقمي",
        hash: `sha256-b31c90...${Math.random().toString(36).substring(2, 6)}`,
        status: "valid"
      },
      ...prev
    ]);

    setActiveTab("dashboard");
  };

  // Supervisor Review Actions
  const handleSupervisorReview = (action: "approve" | "reject") => {
    const status = action === "approve" ? "completed" : "assigned";
    const updated = inspections.map(insp => {
      if (insp.id === selectedInspection.id) {
        return {
          ...insp,
          status: status as any
        };
      }
      return insp;
    });
    setInspections(updated);
    const found = updated.find(i => i.id === selectedInspection.id);
    if (found) setSelectedInspection(found);

    const timestamp = new Date().toLocaleString();
    setAuditLogs(prev => [
      {
        id: `AUD-${Math.floor(Math.random() * 1000)}`,
        timestamp,
        actionAr: `إقرار تقرير التفتيش رقم ${selectedInspection.id} بحالة: ${action === "approve" ? "مكتمل ومطابق" : "مرفوض ومُعاد للمفتش"}`,
        actionEn: `Sovereign sign-off for report ${selectedInspection.id} status: ${action === "approve" ? "Approved & Sealed" : "Returned to Inspector"}`,
        actor: "المشرف العام للرقابة",
        hash: `sha256-55fa1c...${Math.random().toString(36).substring(2, 6)}`,
        status: "valid"
      },
      ...prev
    ]);
  };

  // Add violation and penalty dynamically
  const fileViolation = () => {
    const updated = inspections.map(insp => {
      if (insp.id === selectedInspection.id) {
        const newViolations = [
          ...(insp.violations || []),
          {
            id: `VIO-DEC-${Math.floor(100 + Math.random() * 900)}`,
            category: newViolationCategory,
            severity: newViolationSeverity,
            fine: calculatedFine,
            description: newViolationDesc || "مخالفة عدم الالتزام بالاشتراطات التنظيمية المقررة."
          }
        ];
        return {
          ...insp,
          violations: newViolations
        };
      }
      return insp;
    });
    setInspections(updated);
    const found = updated.find(i => i.id === selectedInspection.id);
    if (found) setSelectedInspection(found);

    // Reset fields
    setNewViolationDesc("");

    const timestamp = new Date().toLocaleString();
    setAuditLogs(prev => [
      {
        id: `AUD-${Math.floor(Math.random() * 1000)}`,
        timestamp,
        actionAr: `تسجيل غرامة ومخالفة قانونية للمنشأة المرتبطة بـ ${selectedInspection.entityName}`,
        actionEn: `Registered legal infraction and penalty for ${selectedInspection.entityName}`,
        actor: "مدير الشؤون القانونية والإنفاذ",
        hash: `sha256-4c4f9a...${Math.random().toString(36).substring(2, 6)}`,
        status: "valid"
      },
      ...prev
    ]);
  };

  // Calculate fine automatically based on category/severity selection
  useEffect(() => {
    let fine = 50000;
    if (newViolationCategory === "expired_goods") fine = newViolationSeverity === "critical" ? 250000 : newViolationSeverity === "high" ? 150000 : 75000;
    else if (newViolationCategory === "price_gouging") fine = newViolationSeverity === "critical" ? 300000 : newViolationSeverity === "high" ? 180000 : 90000;
    else if (newViolationCategory === "monopoly") fine = newViolationSeverity === "critical" ? 500000 : newViolationSeverity === "high" ? 350000 : 150000;
    else fine = newViolationSeverity === "critical" ? 150000 : newViolationSeverity === "high" ? 100000 : 50000;
    setCalculatedFine(fine);
  }, [newViolationCategory, newViolationSeverity]);

  // AI Assistant Interaction
  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput;
    setAiHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setAiInput("");
    setIsAiThinking(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `أنت مساعد التفتيش الذكي لوزارة التجارة والصناعة بالسودان. أجب باحترافية بخصوص هذا الاستعلام: "${userMsg}". لدينا ${inspections.length} تفتيشات في النظام. تفتيشات مكتملة=${inspections.filter(i => i.status === "completed").length}، تفتيشات قيد المراجعة والتدقيق المشرف=${inspections.filter(i => i.status === "review").length}. المخالفات النشطة تشمل سلعاً منتهية الصلاحية ومخالفة أسعار. اقترح أولويات تفتيش بناءً على المخاطر والقطاعات.`,
          history: [],
          context: { inspections }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiHistory(prev => [...prev, { sender: "bot", text: data.text }]);
      } else {
        throw new Error("API Limit");
      }
    } catch (err) {
      // Offline fallback high-fidelity regulatory AI response
      setTimeout(() => {
        let text = "";
        const lower = userMsg.toLowerCase();
        if (lower.includes("أولية") || lower.includes("خطر") || lower.includes("priority") || lower.includes("risk")) {
          text = currentLanguage === "ar"
            ? "توصية الرقابة الذكية: نوصي بجدولة تفتيش عاجل لـ 'شركة البشير للمواد الطبية' بورتسودان (مؤشر خطورة 94) بسبب وجود غرامة نشطة خاصة بمستحضرات منتهية الصلاحية. كما يُنصح بمراجعة مخازن قطاع الأغذية ببحري بصفة أسبوعية كأولوية قصوى."
            : "Sovereign Recommendation: Prioritize immediate inspection for 'Al-Bashir Medical Products' Port Sudan (Risk score 94) due to active expired goods infraction. Weekly auditing of all food warehouses in Bahri is highly advised.";
        } else if (lower.includes("مخالف") || lower.includes("غرامة") || lower.includes("fine") || lower.includes("violation")) {
          text = currentLanguage === "ar"
            ? "تحليل المخالفات: تتركز المخالفات الحرجة في قطاع التجزئة العام بنسبة 48% (تلاعب بالأسعار)، يليه قطاع الأدوية والصناعات الطبية (35%). نقترح رفع الغرامة الموجهة للمنشآت ذات العود المتكرر بنسبة 50% لردع المخالفين."
            : "Infraction Synthesis: Price-gouging comprises 48% of active violations, followed by clinical storage standards at 35%. Suggest raising the progressive fine multiplier by 50% for repeat corporate offenders.";
        } else {
          text = currentLanguage === "ar"
            ? "لقد قمت بمراجعة الاستفسار الرقابي الخاص بكم. النظام يشير إلى التزام إجمالي بنسبة 94.5% في الخرطوم والجزيرة. يرجى مراجعة مصفوفة الإنفاذ وقائمة المهام في لوحة Dispatch لإدارة جولات المفتشين الميدانيين."
            : "Query processed. National compliance registry indicators show an average of 94.5% compliance across Khartoum and Gezira. Please consult the dispatch module to coordinate active field inspection routines.";
        }
        setAiHistory(prev => [...prev, { sender: "bot", text }]);
      }, 700);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Simulated reports download helper
  const handleReportExport = () => {
    let content = "";
    if (activeReportTab === "daily_compliance") {
      content = "Date,Location,Inspector,Sovereign Status,Violations Found\n" +
                "2026-07-15,Khartoum - Bahri,Eng. Mujtaba,Passed,None\n" +
                "2026-07-15,Red Sea - Port Sudan,Nidal Al-Tayeb,Action Required,Expired Goods (150000 SDG Fine)\n" +
                "2026-07-12,Gezira - Wad Madani,Manal Abdelgadir,Passed,None\n";
    } else if (activeReportTab === "industry_compliance") {
      content = "Sector,Total Inspected,Violations Count,Compliance Index\n" +
                "Food Processing,45,2,95.5%\n" +
                "Medical & Clinical,20,5,75.0%\n" +
                "Retail & General Trade,110,14,87.2%\n";
    } else {
      content = "Risk-Score Range,Count of Entities,Audit Status,Intervention Recommendation\n" +
                "Critical (85-100),4,Dispatched,Immediate closure on breach\n" +
                "High (70-84),12,Schedules pending,Bi-weekly monitoring\n" +
                "Medium (40-69),45,Compliant,Quarterly checklist verification\n";
    }

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SDMCI_Inspection_${activeReportTab}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper translations for UI text
  const getRoleBadgeColor = (r: string) => {
    if (r === "inspector") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (r === "supervisor") return "bg-amber-100 text-amber-800 border-amber-200";
    if (r === "legal") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-purple-100 text-purple-800 border-purple-200";
  };

  const getPriorityBadge = (p: string) => {
    if (p === "critical") return "bg-rose-150 text-rose-800 font-extrabold border-rose-300 animate-pulse";
    if (p === "high") return "bg-amber-100 text-amber-800 border-amber-300";
    if (p === "medium") return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-slate-100 text-slate-700 border-slate-300";
  };

  const filteredInspections = inspections.filter(insp => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      insp.id.toLowerCase().includes(q) ||
      insp.entityName.toLowerCase().includes(q) ||
      insp.inspectorName.toLowerCase().includes(q) ||
      insp.region.toLowerCase().includes(q)
    );
  });

  return (
    <div id="smart-inspection-platform" className="space-y-6 print:bg-white print:text-black">
      
      {/* 1. Header Hero Panel */}
      <div className="bg-[#0c2310] text-white p-6 md:p-8 rounded-3xl border border-emerald-900 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-[-40%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#C5A059] text-emerald-950 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider">
              {currentLanguage === "ar" ? "الإدارة العامة للمطابقة والرقابة والإنفاذ" : "General Directorate of Compliance & Enforcement"}
            </span>
            <span className={`border text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 transition-all ${
              isOffline 
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30" 
                : "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`}></span>
              {isOffline 
                ? (currentLanguage === "ar" ? "وضع عدم الاتصال (حفظ محلي)" : "Offline Mode (Local Storage Active)") 
                : (currentLanguage === "ar" ? "متصل بالبوابة الوطنية" : "Connected to National Gateway")}
            </span>
          </div>
          
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="h-9 w-9 text-[#C5A059]" />
            {currentLanguage === "ar" ? "منصة التفتيش الذكي وإنفاذ اللوائح الرقابية" : "Smart Inspection & Regulatory Enforcement Platform"}
          </h1>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {currentLanguage === "ar" 
              ? "منظومة سيادية موحدة لإدارة التفتيش الميداني القائم على تقييم المخاطر الذكي، توثيق المخالفات بالبصمة الجغرافية والوسائط الرقمية، وإقرار الجزاءات والغرامات التصاعدية مع إمكانية التفتيش بدون إنترنت وإثبات المطابقة التلقائي." 
              : "A sovereign unified platform for risk-based inspection workflows, mobile offline field auditing, GPS-verified evidence collection, and progressive administrative enforcement."}
          </p>
        </div>

        {/* Sync / Connectivity Control Gauge */}
        <div className="bg-slate-900/40 p-4 rounded-2xl border border-emerald-800 text-center lg:text-right shrink-0 min-w-[200px] relative z-10">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-[10px] text-[#C5A059] font-black uppercase tracking-wider">
              {currentLanguage === "ar" ? "الشبكة الميدانية" : "Field Network Status"}
            </span>
            <button 
              onClick={handleOfflineToggle}
              className="text-[9px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-md font-bold cursor-pointer transition-all"
            >
              {currentLanguage === "ar" ? "تبديل الوضع" : "Toggle State"}
            </button>
          </div>
          <p className="text-lg font-black text-white">{isOffline ? "OFFLINE-FIRST" : "SECURE ONLINE"}</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-300">
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
            <span>{syncStatus === "synced" ? "Synced" : syncStatus === "syncing" ? "Syncing changes..." : "Changes saved locally"}</span>
          </div>
        </div>
      </div>

      {/* 2. Government-Grade Multi-Role Interactive Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-extrabold pr-2 border-r border-gray-200">
            {currentLanguage === "ar" ? "محاكاة المستوى الوظيفي للرقابة:" : "Inspectors and Legal Board Simulation:"}
          </span>
          {[
            { id: "inspector", ar: "مفتش ميداني", en: "Field Inspector" },
            { id: "supervisor", ar: "مشرف تفتيش", en: "Inspection Supervisor" },
            { id: "legal", ar: "الشؤون القانونية والمحكمة", en: "Legal & Appeals Officer" },
            { id: "director", ar: "إدارة التخطيط والمخاطر", en: "Risk Planner & Director" }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeRole === r.id 
                  ? "bg-[#007229] text-white shadow-xs" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {currentLanguage === "ar" ? r.ar : r.en}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-500 bg-[#F4F6F5] px-3.5 py-1.5 rounded-xl border border-gray-150">
          {currentLanguage === "ar" ? "عدد المفتشين النشطين بالولايات: 4" : "Active Regional Inspector Force: 4"}
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-gray-200 no-scrollbar">
        {[
          { id: "dashboard", ar: "لوحة رقابة الامتثال", en: "Compliance & Inspections Board", icon: ClipboardList },
          { id: "risk_engine", ar: "محرك تقييم المخاطر", en: "Risk Assessment Engine", icon: Sliders },
          { id: "dispatch", ar: "توزيع وتكليف الجولات", en: "Field Dispatch Center", icon: Navigation },
          { id: "field_execution", ar: "تطبيق المفتش الميداني (Offline)", en: "Mobile Inspector App (Offline-First)", icon: Camera },
          { id: "violations", ar: "سجل المخالفات والجزاءات", en: "Violations & Penalties Registry", icon: Scale },
          { id: "audits", ar: "سجل التدقيق والأمن السيادي", en: "Cryptographic Audit Integrity", icon: Lock },
          { id: "manuals", ar: "أدلة العمل والمستندات الفنية", en: "National Compliance Specs", icon: BookOpen }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                // Pre-check field form simulator checks on selection change
                if (t.id === "field_execution") {
                  const items: Record<string, boolean> = {};
                  selectedInspection.checklist.forEach(item => {
                    items[item.item] = item.checked;
                  });
                  setTempCheckedItems(items);
                }
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold transition-all shrink-0 border-b-2 cursor-pointer ${
                isActive 
                  ? "border-[#007229] text-[#007229] bg-white font-extrabold" 
                  : "border-transparent text-gray-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? t.ar : t.en}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Main Tab Container */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm min-h-[520px]">
        
        {/* ==================== TAB 1: DASHBOARD ==================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-100 flex flex-col justify-between">
                <p className="text-[10px] text-slate-500 font-extrabold uppercase">{currentLanguage === "ar" ? "معدل المطابقة والالتزام العام" : "Overall National Compliance Rate"}</p>
                <p className="text-3xl font-black text-emerald-800 my-1">94.5%</p>
                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> +2.1% {currentLanguage === "ar" ? "منذ الربع الماضي" : "vs last quarter"}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-100 flex flex-col justify-between">
                <p className="text-[10px] text-slate-500 font-extrabold uppercase">{currentLanguage === "ar" ? "الجولات المخططة / المكتملة" : "Planned vs Completed Inspections"}</p>
                <p className="text-3xl font-black text-blue-800 my-1">
                  {inspections.filter(i => i.status === "completed").length} / {inspections.length}
                </p>
                <div className="text-[10px] text-slate-500 font-bold">
                  {currentLanguage === "ar" ? "تغطية تفتيش مستمرة بـ 7 ولايات" : "Covering 7 states actively"}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border border-amber-100 flex flex-col justify-between">
                <p className="text-[10px] text-slate-500 font-extrabold uppercase">{currentLanguage === "ar" ? "إجمالي المخالفات المسجلة" : "Total Logged Violations"}</p>
                <p className="text-3xl font-black text-amber-800 my-1">
                  {inspections.reduce((acc, curr) => acc + (curr.violations?.length || 0), 0)}
                </p>
                <div className="text-[10px] text-amber-600 font-bold">
                  {currentLanguage === "ar" ? "أكثرها تكراراً: السلع منتهية الصلاحية" : "Dominant infraction: Expired Goods"}
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-white p-5 rounded-2xl border border-rose-100 flex flex-col justify-between">
                <p className="text-[10px] text-slate-500 font-extrabold uppercase">{currentLanguage === "ar" ? "إجمالي قيم الغرامات المحصلة" : "Total Imposed Penalties"}</p>
                <p className="text-3xl font-black text-rose-800 my-1">
                  {inspections.reduce((acc, curr) => {
                    const fines = curr.violations?.reduce((s, v) => s + v.fine, 0) || 0;
                    return acc + fines;
                  }, 0).toLocaleString()} <span className="text-xs">SDG</span>
                </p>
                <div className="text-[10px] text-rose-600 font-bold">
                  {currentLanguage === "ar" ? "توجه لحساب الإيرادات العامة الفيدرالي" : "Directed to National Treasury account"}
                </div>
              </div>
            </div>

            {/* Charts & Interactive States */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Compliance Rates per State Chart */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 lg:col-span-2 shadow-xs">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">{currentLanguage === "ar" ? "معدلات الامتثال وجودة التفتيش حسب الولايات السودانية" : "Compliance Indexes & Inspection Counts by Sudan States"}</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { state: "الخرطوم", compliance: 96, inspections: 45 },
                      { state: "البحر الأحمر", compliance: 94, inspections: 24 },
                      { state: "الجزيرة", compliance: 91, inspections: 18 },
                      { state: "نهر النيل", compliance: 95, inspections: 32 },
                      { state: "كسلا", compliance: 89, inspections: 12 },
                      { state: "شمال كردفان", compliance: 91, inspections: 15 },
                      { state: "القضارف", compliance: 90, inspections: 14 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="state" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="compliance" name="نسبة الامتثال (%)" fill="#007229" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="inspections" name="عدد الزيارات المنجزة" fill="#C5A059" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Inspection Priority Distribution (Radar) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col justify-between shadow-xs">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider pb-2 border-b border-gray-100">{currentLanguage === "ar" ? "توزيع تصنيف المخاطر الميدانية للمنشآت" : "Field Entity Risk-Class Proportions"}</h4>
                <div className="h-56 mx-auto w-full max-w-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                      { subject: "أغذية ودواء", A: 90, fullMark: 100 },
                      { subject: "تعدين ومعادن", A: 85, fullMark: 100 },
                      { subject: "تصنيع عام", A: 65, fullMark: 100 },
                      { subject: "بيع التجزئة", A: 45, fullMark: 100 },
                      { subject: "تراخيص عامة", A: 75, fullMark: 100 }
                    ]}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#475569" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                      <Radar name="خطورة القطاع" dataKey="A" stroke="#007229" fill="#007229" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[10px] text-gray-500 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "أحجام خطورة المنشآت تُقاس مصفوفياً عبر فحص التراخيص والنشاط التجاري الفعلي." 
                    : "Corporate risk scores are dynamic integrations of license validity, trade data and visual audit reports."}
                </div>
              </div>
            </div>

            {/* List of Registered Inspections / Interactive Status Map */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h4 className="font-extrabold text-sm text-slate-800">{currentLanguage === "ar" ? "قائمة الجولات التفتيشية النشطة بالمنصة" : "Active Regulatory Inspection Queue"}</h4>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={currentLanguage === "ar" ? "البحث بالمنشأة، المفتش، الولاية..." : "Search entity, inspector..."}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right text-slate-600">
                  <thead className="bg-[#F4F6F5] text-[10px] text-slate-500 uppercase font-black">
                    <tr>
                      <th className="p-3 text-center">{currentLanguage === "ar" ? "الرقم التعريفي" : "ID"}</th>
                      <th className="p-3">{currentLanguage === "ar" ? "المنشأة المستهدفة" : "Target Entity"}</th>
                      <th className="p-3">{currentLanguage === "ar" ? "القطاع والنشاط" : "Sector / Activity"}</th>
                      <th className="p-3">{currentLanguage === "ar" ? "المفتش المكلّف" : "Assigned Inspector"}</th>
                      <th className="p-3 text-center">{currentLanguage === "ar" ? "مستوى الخطورة" : "Risk Score"}</th>
                      <th className="p-3 text-center">{currentLanguage === "ar" ? "الأولوية" : "Priority"}</th>
                      <th className="p-3 text-center">{currentLanguage === "ar" ? "الحالة" : "Status"}</th>
                      <th className="p-3 text-center">{currentLanguage === "ar" ? "الإجراء" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInspections.map(insp => (
                      <tr key={insp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-center font-mono font-bold text-slate-800">{insp.id}</td>
                        <td className="p-3 font-extrabold text-slate-900">{insp.entityName}</td>
                        <td className="p-3">{insp.activity}</td>
                        <td className="p-3">{insp.inspectorName}</td>
                        <td className="p-3 text-center font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded-full ${insp.riskScore > 80 ? "text-rose-600 bg-rose-50" : insp.riskScore > 50 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"}`}>
                            {insp.riskScore}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] border font-bold uppercase ${getPriorityBadge(insp.priority)}`}>
                            {insp.priority}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            insp.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                            insp.status === "review" ? "bg-amber-100 text-amber-800" :
                            insp.status === "field_execution" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-800"
                          }`}>
                            {insp.status === "completed" ? (currentLanguage === "ar" ? "مكتمل ومؤرشف" : "Completed") :
                             insp.status === "review" ? (currentLanguage === "ar" ? "قيد مراجعة المشرف" : "Under Review") :
                             insp.status === "field_execution" ? (currentLanguage === "ar" ? "تفتيش ميداني نشط" : "Active Field") :
                             (currentLanguage === "ar" ? "مكلف ومخطط" : "Assigned")}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedInspection(insp);
                              if (insp.status === "assigned" || insp.status === "field_execution") {
                                setActiveTab("field_execution");
                                // Prefill checked items
                                const checks: Record<string, boolean> = {};
                                insp.checklist.forEach(it => {
                                  checks[it.item] = it.checked;
                                });
                                setTempCheckedItems(checks);
                              } else {
                                setActiveTab("violations");
                              }
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-[#007229] font-black text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Eye className="h-3 w-3" />
                            <span>{currentLanguage === "ar" ? "التفاصيل" : "View"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: RISK ENGINE ==================== */}
        {activeTab === "risk_engine" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-emerald-600" />
                {currentLanguage === "ar" ? "محرك تقييم المخاطر وجدولة الزيارات الميدانية تلقائياً" : "Risk-Based Regulatory Dispatch Engine"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "يتحكم هذا المحرك في حساب درجات المخاطر الوطنية وتوليد أولويات التفتيش والزيارات تلقائياً لتفادي الهدر البشري وتركيز الرقابة على المواقع الأكثر عرضة للمخالفات." 
                  : "Calibrate risk heuristics below to adjust the automated dispatch schedules across Sudan commercial and industrial blocks."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Calibration Controls */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-6">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">{currentLanguage === "ar" ? "معايرة أوزان المخاطر السيادية" : "Sovereign Risk Weights Calibration"}</h4>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">{currentLanguage === "ar" ? "ثقل المخالفات السابقة" : "Previous Violations Weight"}</span>
                      <span className="text-emerald-700 font-mono">{violationWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={violationWeight}
                      onChange={e => setViolationWeight(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">{currentLanguage === "ar" ? "ثقل شكاوى المواطنين والمستهلكين" : "Citizen Complaints Weight"}</span>
                      <span className="text-emerald-700 font-mono">{complaintWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={complaintWeight}
                      onChange={e => setComplaintWeight(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">{currentLanguage === "ar" ? "خطورة النشاط والصناعة (أغذية/تعدين)" : "Sector Activity Risk Weight"}</span>
                      <span className="text-emerald-700 font-mono">{activityWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="70"
                      value={activityWeight}
                      onChange={e => setActivityWeight(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>

                <button
                  onClick={runRiskBasedScheduling}
                  className="w-full bg-[#007229] hover:bg-[#005e21] text-white font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Cpu className="h-4 w-4 text-[#C5A059]" />
                  <span>{currentLanguage === "ar" ? "تشغيل المحرك وإعادة جدولة التفتيش" : "Recalculate & Re-schedule"}</span>
                </button>

                {dynamicSchedulesCount > 0 && (
                  <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-200 text-[11px] leading-relaxed flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <strong>{currentLanguage === "ar" ? "اكتمل الحساب:" : "Computation success:"}</strong> {currentLanguage === "ar" ? `تم تحديث درجات الخطورة وإرسال الأولوية المحدثة بنجاح (المزامنة رقم ${dynamicSchedulesCount})` : `Risk priorities mapped to database schema successfully (Pass #${dynamicSchedulesCount})`}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Risk Output */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 lg:col-span-2 space-y-4">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">{currentLanguage === "ar" ? "محاكاة جدول الجولات الذكية المتولد لحظياً" : "Dynamic Dispatched Schedules Simulation Preview"}</h4>
                
                <div className="space-y-3">
                  {inspections.map(insp => (
                    <div key={insp.id} className="p-3.5 bg-slate-50 rounded-xl border border-gray-150 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-800">{insp.entityName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            insp.priority === "critical" ? "bg-rose-100 text-rose-800" :
                            insp.priority === "high" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                          }`}>{insp.priority}</span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          {currentLanguage === "ar" ? `موقع المنشأة: ${insp.region} - ${insp.city} | تاريخ الجولة المخطط: ${insp.scheduledDate}` : `Location: ${insp.region} - ${insp.city} | Target Date: ${insp.scheduledDate}`}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block">{currentLanguage === "ar" ? "درجة الخطورة المحسوبة" : "Risk Score"}</span>
                        <span className="text-xl font-mono font-black text-slate-800">{insp.riskScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: DISPATCH ==================== */}
        {activeTab === "dispatch" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-emerald-600" />
                {currentLanguage === "ar" ? "غرفة تكليف وتوزيع مهام التفتيش بالولايات" : "National Geographic Field Dispatch & Map Operations"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "يتيح هذا القسم لمشرفي الرقابة توزيع وتعديل تكليف المفتشين بالولايات بناءً على تغطية التفتيش المطلوبة ومستويات الكثافة الجغرافية للشكاوى." 
                  : "Dispatch field inspectors directly, reassign workloads, and track geographic deployment targets across provinces."}
              </p>
            </div>

            {/* Simulated GIS map representation with state values */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Graphic GIS SVG Map */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 text-white relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-[#C5A059] flex items-center gap-1">
                    <Radio className="h-3 w-3 text-rose-500 animate-ping" /> {currentLanguage === "ar" ? "خريطة الكثافة الجغرافية للالتزام" : "Spatial GIS Compliance Heat-map"}
                  </span>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">WGS84 Normalized</span>
                </div>

                {/* Sudan Interactive GIS Mock Frame */}
                <div className="h-64 bg-slate-950 rounded-xl flex items-center justify-center relative overflow-hidden border border-slate-800">
                  {/* Mock Abstract Map Nodes of Sudan regions */}
                  <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>

                  {/* Inline CSS-based interactive regional dots */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>Wad Madani Hub</span>
                      <span>Port Sudan Port Authority</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-extrabold text-[#C5A059] block">{currentLanguage === "ar" ? "الخرطوم الفيدرالية" : "KHARTOUM FEDERAL ZONE"}</span>
                      <span className="text-[9px] text-emerald-400">96.5% compliance</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>Kassala Border Block</span>
                      <span>El Obeid Trade Rail</span>
                    </div>
                  </div>

                  {/* Visual Crosshairs */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-dashed border-white/5 rounded-full pointer-events-none"></div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <div>
                    <span className="text-slate-400 block">{currentLanguage === "ar" ? "أعلى الولايات امتثالاً" : "Highest compliance"}</span>
                    <strong className="text-emerald-400 font-bold">{currentLanguage === "ar" ? "نهر النيل (95.8%)" : "River Nile (95.8%)"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{currentLanguage === "ar" ? "الولايات تحت التدقيق العالي" : "Critical Intervention"}</span>
                    <strong className="text-rose-400 font-bold">{currentLanguage === "ar" ? "كسلا (89.4%)" : "Kassala (89.4%)"}</strong>
                  </div>
                </div>
              </div>

              {/* Assign and Dispatch Controls */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 lg:col-span-2 space-y-4 shadow-xs">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">{currentLanguage === "ar" ? "تعديل إسناد المفتشين وتأكيد الحصة اليومية" : "Inspector Assignment & Operational Target Control"}</h4>
                
                <div className="space-y-4">
                  {inspections.map(insp => (
                    <div key={insp.id} className="p-3.5 bg-slate-50 rounded-xl border border-gray-150 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-800">{insp.entityName}</span>
                          <span className="bg-slate-200 text-slate-700 text-[9px] px-1.5 py-0.5 rounded font-bold">{insp.region}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                          <span className="font-bold">{currentLanguage === "ar" ? "المفتش الحالي:" : "Current Inspector:"} {insp.inspectorName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                          value={insp.inspectorId}
                          onChange={e => {
                            const inspector = mockInspectors.find(i => i.id === e.target.value);
                            if (inspector) {
                              const updated = inspections.map(item => {
                                if (item.id === insp.id) {
                                  return {
                                    ...item,
                                    inspectorId: inspector.id,
                                    inspectorName: inspector.name
                                  };
                                }
                                return item;
                              });
                              setInspections(updated);
                              // Update selected if applicable
                              if (selectedInspection.id === insp.id) {
                                setSelectedInspection(updated.find(x => x.id === insp.id)!);
                              }
                            }
                          }}
                          className="text-xs p-1.5 border border-gray-200 rounded-lg focus:outline-none"
                        >
                          {mockInspectors.map(ins => (
                            <option key={ins.id} value={ins.id}>{ins.name} ({ins.level})</option>
                          ))}
                        </select>
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">
                          {currentLanguage === "ar" ? "تأكيد" : "Dispatched"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: FIELD MOBILE APPLICATION (SIMULATOR) ==================== */}
        {activeTab === "field_execution" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Camera className="h-5 w-5 text-[#C5A059]" />
                {currentLanguage === "ar" ? "محاكي جهاز التفتيش الميداني الذكي للمفتشين" : "Smart Inspector Mobile Field Form Simulator"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "يحاكي هذا الجهاز واجهة المفتش الميداني أثناء الوجود في الموقع. يدعم إثبات الحضور بالبصمة الجغرافية، التحقق من رمز الاستجابة السريعة، تدوين الملاحظات الصوتية والتقاط الصور، وحفظ البيانات محلياً بدون إنترنت." 
                  : "Simulate offline field checks, GPS location capture, QR verification, voice dictation, and cryptographic digital signature sign-off."}
              </p>
            </div>

            {/* Field Form Simulator Framework */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Field Device Frame */}
              <div className="bg-slate-900 rounded-3xl p-5 border-4 border-slate-850 text-white space-y-4 shadow-xl relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full z-15"></div>
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 pt-2 text-xs">
                  <span className="font-extrabold text-[#C5A059] flex items-center gap-1.5">
                    <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
                    {currentLanguage === "ar" ? "جهاز التفتيش اللاسلكي" : "Inspector Handheld v2.6"}
                  </span>
                  <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                    {isOffline ? "LOCAL MODE" : "FEDERAL GATEWAY"}
                  </span>
                </div>

                {/* Main device screen body */}
                <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-200">
                  
                  {/* Current Active Target Inspection */}
                  <div className="border-b border-slate-800 pb-3 space-y-1">
                    <span className="text-[9px] text-slate-400 font-black block uppercase">{currentLanguage === "ar" ? "المنشأة المستهدفة حالياً" : "Active Target Entity"}</span>
                    <h5 className="font-extrabold text-sm text-white">{selectedInspection.entityName}</h5>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {selectedInspection.id}</p>
                  </div>

                  {/* GPS Verification section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">{currentLanguage === "ar" ? "البصمة الجغرافية والمطابقة" : "GPS Binding & Verification"}</span>
                      <button 
                        onClick={mockGpsCapture}
                        className="text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-bold cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "تحديث الموقع" : "Capture GPS"}
                      </button>
                    </div>
                    {fieldGPS ? (
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                        <MapPin className="h-4 w-4" />
                        <span>Lat: {fieldGPS.lat.toFixed(4)}, Lng: {fieldGPS.lng.toFixed(4)}</span>
                        <span className="text-emerald-500 ml-auto">(Verified)</span>
                      </div>
                    ) : (
                      <div className="bg-rose-950/20 p-2.5 rounded-xl border border-rose-900/30 text-[10px] text-rose-300 text-center">
                        {currentLanguage === "ar" ? "بانتظار التقاط البصمة الجغرافية لمطابقة إحداثيات السجل" : "Pending GPS lock to authenticate registry location"}
                      </div>
                    )}
                  </div>

                  {/* QR Registration Verification */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">{currentLanguage === "ar" ? "التحقق من باركود السجل التجاري" : "Verify Registry QR Code"}</span>
                      <button 
                        onClick={mockQrScan}
                        className="text-[9px] bg-[#C5A059] text-slate-950 px-2 py-0.5 rounded font-black cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "مسح الرمز" : "Scan QR"}
                      </button>
                    </div>
                    {scannedQrCode ? (
                      <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-[10px] font-mono text-[#C5A059] flex items-center justify-between">
                        <span>{scannedQrCode}</span>
                        <span className="text-emerald-400 text-[9px] font-bold">Matched!</span>
                      </div>
                    ) : (
                      <p className="text-[9px] text-slate-500">{currentLanguage === "ar" ? "امسح الرمز الملصق على واجهة المحل للمطابقة." : "Scan standard SDMCI QR code to verify legal active state."}</p>
                    )}
                  </div>

                  {/* Checklists for Inspection */}
                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <span className="text-[10px] text-slate-400 block font-bold">{currentLanguage === "ar" ? "بنود التدقيق والمطابقة والمكافحة" : "Audit Checklist Criteria"}</span>
                    <div className="space-y-2">
                      {selectedInspection.checklist.map(item => (
                        <label key={item.item} className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={tempCheckedItems[item.item] !== undefined ? tempCheckedItems[item.item] : item.checked}
                            onChange={e => {
                              setTempCheckedItems({
                                ...tempCheckedItems,
                                [item.item]: e.target.checked
                              });
                            }}
                            className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                          />
                          <span>{item.item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Multimedia Evidence and Written Findings Inputs */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 lg:col-span-2 space-y-6 shadow-xs">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">{currentLanguage === "ar" ? "توثيق الأدلة الفنية وإثبات المحضر الرقمي" : "Technical Evidence Dictation & Findings Report"}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Photo evidence box */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-150">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                        <Camera className="h-4 w-4 text-[#C5A059]" /> {currentLanguage === "ar" ? "إثباتات الصور الميدانية" : "Visual Field Evidences"}
                      </span>
                      <button
                        onClick={mockPhotoUpload}
                        className="text-[9px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "التقاط صورة" : "Snap Photo"}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {photoEvidence.map((url, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-300">
                          <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setPhotoEvidence(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-0.5 right-0.5 bg-slate-950/80 rounded-full p-0.5 text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {photoEvidence.length === 0 && (
                        <p className="text-[10px] text-slate-400 italic py-4 text-center w-full">{currentLanguage === "ar" ? "لا توجد صور ملتقطة حالياً." : "No visual logs committed."}</p>
                      )}
                    </div>
                  </div>

                  {/* Voice notes dictation */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-150">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                        <Mic className="h-4 w-4 text-[#C5A059]" /> {currentLanguage === "ar" ? "تسجيل الملاحظات الصوتية" : "Dictation & Voice Notes"}
                      </span>
                      <button
                        onClick={mockVoiceNote}
                        className="text-[9px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "تسجيل مذكرات" : "Record Note"}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {voiceNotes.map((note, i) => (
                        <div key={i} className="bg-white p-2 rounded-lg border border-gray-200 text-[10px] text-slate-700 flex items-center justify-between">
                          <span className="truncate max-w-[200px]">{note}</span>
                          <button 
                            onClick={() => setVoiceNotes(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {voiceNotes.length === 0 && (
                        <p className="text-[10px] text-slate-400 italic py-4 text-center w-full">{currentLanguage === "ar" ? "لا توجد مذكرات صوتية مسجلة." : "No dictation committed."}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Findings text & Signature */}
                <div className="space-y-4 pt-2 border-t border-gray-150">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">{currentLanguage === "ar" ? "التقرير النهائي والمشاهدات الميدانية المكتوبة" : "Final Written Findings & Field Description"}</label>
                    <textarea
                      rows={3}
                      value={findingsText}
                      onChange={e => setFindingsText(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "اكتب هنا تفاصيل الفحص وتفاصيل التزام المنشأة والملاحظات..." : "Describe the overall compliance state and findings in details..."}
                      className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">{currentLanguage === "ar" ? "توقيع المفتش الرقمي وتأكيد المالك" : "Digital Inspector & Owner Sign-off Key"}</label>
                    <input
                      type="text"
                      placeholder={currentLanguage === "ar" ? "أدخل اسم المفتش أو رمز التوقيع الرقمي للمطابقة" : "Enter cryptographic signature or full name of inspector"}
                      value={digitizedSignature}
                      onChange={e => setDigitizedSignature(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setPhotoEvidence([]);
                      setVoiceNotes([]);
                      setFindingsText("");
                      setDigitizedSignature("");
                      setScannedQrCode("");
                    }}
                    className="px-4 py-2 text-xs font-bold border border-gray-200 text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "إلغاء وتصفير" : "Cancel"}
                  </button>
                  <button
                    onClick={handleFieldSubmit}
                    className="px-5 py-2 text-xs font-bold bg-[#007229] hover:bg-[#005e21] text-white rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "حفظ وإرسال التقرير للمشرف" : "Submit Findings & Close Form"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: VIOLATIONS ==================== */}
        {activeTab === "violations" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* View current selection details or filer */}
            <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase block tracking-widest">{currentLanguage === "ar" ? "المنشأة المحددة للتدقيق والإنفاذ" : "Currently Selected Entity for Auditing"}</h3>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-900">{selectedInspection.entityName}</h4>
                  <p className="text-xs text-slate-500">
                    {currentLanguage === "ar" 
                      ? `قطاع: ${selectedInspection.activity} | موقع: ${selectedInspection.region} - ${selectedInspection.city}` 
                      : `Sector: ${selectedInspection.activity} | City: ${selectedInspection.region} - ${selectedInspection.city}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedInspection.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {selectedInspection.status}
                  </span>
                  <span className="bg-slate-800 text-[#C5A059] font-mono font-bold text-xs px-2.5 py-1 rounded-full">
                    {currentLanguage === "ar" ? "تقييم المخاطر الحالي:" : "Risk score:"} {selectedInspection.riskScore}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* File Violation Panel */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-xs">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-gray-100">
                  {currentLanguage === "ar" ? "تسجيل مخالفة وقيمة الغرامة الفيدرالية" : "Record Infraction & Impose Fine"}
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-bold block">{currentLanguage === "ar" ? "تصنيف ونوع المخالفة الرقابية" : "Regulatory Infraction Type"}</label>
                    <select
                      value={newViolationCategory}
                      onChange={e => setNewViolationCategory(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg text-xs"
                    >
                      <option value="expired_goods">{currentLanguage === "ar" ? "بيع/تخزين سلع منتهية الصلاحية" : "Expired Goods / Poor Storage"}</option>
                      <option value="price_gouging">{currentLanguage === "ar" ? "التلاعب بالأسعار والمضاربة" : "Price Gouging / Unofficial Pricing"}</option>
                      <option value="monopoly">{currentLanguage === "ar" ? "ممارسات احتكارية وتقييد السلع" : "Monopolistic Practices"}</option>
                      <option value="unlicensed">{currentLanguage === "ar" ? "العمل بدون تراخيص وطنية أو بيئية" : "Unlicensed Operations"}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-bold block">{currentLanguage === "ar" ? "درجة الجسامة القانونية" : "Severity Index"}</label>
                    <select
                      value={newViolationSeverity}
                      onChange={e => setNewViolationSeverity(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg text-xs"
                    >
                      <option value="low">{currentLanguage === "ar" ? "منخفضة (تنبيه وإنذار)" : "Low (Warning Limit)"}</option>
                      <option value="medium">{currentLanguage === "ar" ? "متوسطة (غرامة مادية)" : "Medium (Administrative Penalty)"}</option>
                      <option value="high">{currentLanguage === "ar" ? "عالية (غرامة وغلق جزئي)" : "High (Impose Shut-down)"}</option>
                      <option value="critical">{currentLanguage === "ar" ? "حرجة وقومية (سحب الترخيص)" : "Critical (License Revocation)"}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-gray-150">
                    <span className="text-slate-500 block text-[10px]">{currentLanguage === "ar" ? "الغرامة المحتسبة تلقائياً حسب اللائحة" : "Dynamic Calculated Penalty SDG"}</span>
                    <strong className="text-lg font-mono font-black text-rose-700 block">{calculatedFine.toLocaleString()} SDG</strong>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-bold block">{currentLanguage === "ar" ? "وصف وملاحظات المخالفة" : "Written Evidence details"}</label>
                    <textarea
                      rows={2}
                      value={newViolationDesc}
                      onChange={e => setNewViolationDesc(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "صف تفاصيل ومكامن المخالفة هنا للمطابقة الفيدرالية..." : "Detail the infraction and item counts found..."}
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    onClick={fileViolation}
                    className="w-full bg-rose-700 hover:bg-rose-800 text-white font-extrabold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <AlertOctagon className="h-4 w-4" />
                    <span>{currentLanguage === "ar" ? "قيد وإصدار المخالفة" : "Impose Penalty Order"}</span>
                  </button>
                </div>
              </div>

              {/* Display existing violations and Administrative closures */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 lg:col-span-2 space-y-4 shadow-xs">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">{currentLanguage === "ar" ? "الجرائم التنظيمية والقرارات الصادرة على المنشأة" : "Infractions & Directives Logged on Selected Entity"}</h4>

                <div className="space-y-3">
                  {selectedInspection.violations && selectedInspection.violations.length > 0 ? (
                    selectedInspection.violations.map((vio: any) => (
                      <div key={vio.id} className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 flex items-start justify-between gap-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-rose-800">{vio.id}</span>
                            <span className="bg-rose-200 text-rose-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">{vio.severity}</span>
                          </div>
                          <p className="font-bold text-slate-800">{vio.description}</p>
                          <span className="text-[10px] text-gray-500 block">{currentLanguage === "ar" ? "المخالفة:" : "Infraction:"} {vio.category}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 block">{currentLanguage === "ar" ? "قيمة العقوبة" : "Fine SDG"}</span>
                          <span className="font-mono font-black text-rose-700 text-sm">{vio.fine.toLocaleString()} SDG</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                      <CheckSquare className="h-8 w-8 text-emerald-500 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">{currentLanguage === "ar" ? "المنشأة مطابقة للشروط بالكامل" : "No active infractions registered."}</p>
                      <p className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "لم ترصد جولات المفتشين أي تجاوزات تنظيمية أو مخالفة أسعار." : "Inspection findings indicate complete regulatory compliance."}</p>
                    </div>
                  )}

                  {/* Actions for supervisors/legal */}
                  <div className="pt-4 border-t border-gray-150 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSupervisorReview("approve")}
                      disabled={selectedInspection.status !== "review"}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{currentLanguage === "ar" ? "إقرار المطابقة والأرشفة" : "Sign-off & Archive File"}</span>
                    </button>
                    <button
                      onClick={() => handleSupervisorReview("reject")}
                      disabled={selectedInspection.status !== "review"}
                      className="px-4 py-2 border border-rose-300 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{currentLanguage === "ar" ? "إلغاء التقرير وإعادة التكليف" : "Reject & Re-dispatch"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: AUDITS ==================== */}
        {activeTab === "audits" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-600" />
                {currentLanguage === "ar" ? "سجل الرقابة الأمنية والمصادقة على تواقيع المفتشين الميدانيين" : "Sovereign Cryptographic Audit Ledger"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "يتم قيد جميع إجراءات المفتش الميداني والمشرفين في سجل غير قابل للتعديل (Immutable Audit Log) لضمان حماية الأدلة والشفافية الرقابية الكاملة ومنع التدخلات الخارجية." 
                  : "Every enforcement action, photo verification, and GPS bind is secured with SHA-256 integrity hashes to safeguard national audit chains."}
              </p>
            </div>

            <div className="space-y-4">
              {auditLogs.map(log => (
                <div key={log.id} className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between gap-4 font-mono">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-800 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-black">{log.id}</span>
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span className="text-emerald-500 bg-emerald-950/40 border border-emerald-900/40 text-[9px] px-1.5 py-0.2 rounded flex items-center gap-1">
                        <Check className="h-3 w-3" /> Integrity Passed
                      </span>
                    </div>
                    <p className="font-sans font-bold text-white mt-1">
                      {currentLanguage === "ar" ? log.actionAr : log.actionEn}
                    </p>
                    <p className="font-sans text-[10px] text-slate-400">
                      {currentLanguage === "ar" ? "القائم بالإجراء:" : "Actor:"} <strong>{log.actor}</strong>
                    </p>
                  </div>

                  <div className="text-left shrink-0 text-[10px]">
                    <span className="text-slate-500 block">SHA-256 HASH</span>
                    <span className="text-[#C5A059]">{log.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 7: MANUALS & SPECIFICATIONS ==================== */}
        {activeTab === "manuals" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  {currentLanguage === "ar" ? "أدلة اللوائح التفتيشية وتقارير الماستر" : "National Inspection Standards & Manual Specifications"}
                </h3>
                <p className="text-xs text-slate-400">
                  {currentLanguage === "ar" 
                    ? "الوثائق التنظيمية المعتمدة لإدارة وتفعيل الرقابة الشاملة على المجمعات الصناعية والأسواق بالولايات." 
                    : "Official technical guidelines, progressive penalty protocols, and mobile offline synchronization requirements."}
                </p>
              </div>

              {/* PDF Print Button */}
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="h-4 w-4" />
                <span>{currentLanguage === "ar" ? "طباعة الدليل السيادي" : "Print Master Manual"}</span>
              </button>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
              {inspectionManualsAndDocs.map(doc => (
                <div key={doc.id} className="p-5 bg-slate-50 rounded-2xl border border-gray-200 space-y-2">
                  <h4 className="text-sm font-black text-slate-800 border-b border-gray-200 pb-2">
                    {currentLanguage === "ar" ? doc.titleAr : doc.titleEn}
                  </h4>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                    {currentLanguage === "ar" ? doc.contentAr : doc.contentEn}
                  </p>
                </div>
              ))}
            </div>

            {/* Interactive Filer Report section */}
            <div className="bg-gradient-to-br from-[#0c2310]/5 to-white p-5 rounded-2xl border border-emerald-100 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h4 className="font-extrabold text-sm text-slate-800">{currentLanguage === "ar" ? "محرك توليد التقارير السيادية الفيدرالية" : "Sovereign Executive Reporting Center"}</h4>
                <div className="flex items-center gap-2">
                  <select
                    value={activeReportTab}
                    onChange={e => setActiveReportTab(e.target.value)}
                    className="text-xs p-1.5 border border-gray-200 rounded-lg"
                  >
                    <option value="daily_compliance">{currentLanguage === "ar" ? "تقرير الامتثال اليومي" : "Daily Compliance Log"}</option>
                    <option value="industry_compliance">{currentLanguage === "ar" ? "تقرير أداء القطاع الصناعي" : "Sectoral Metrics"}</option>
                    <option value="risk_intervention">{currentLanguage === "ar" ? "تقرير مصفوفة التدخل بالمخاطر" : "Risk Matrix Deliverables"}</option>
                  </select>

                  <button
                    onClick={handleReportExport}
                    className="bg-[#007229] hover:bg-[#005e21] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{currentLanguage === "ar" ? "تصدير CSV" : "Export CSV"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Sovereign Interactive AI Assistant Side Drawer */}
      <div className="bg-[#f8fafc] p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#C5A059]" />
            <h4 className="font-black text-sm text-slate-800">
              {currentLanguage === "ar" ? "مساعد التفتيش والرقابة الذكي AI Assistant" : "Sovereign AI Regulatory Advisor"}
            </h4>
          </div>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">Powered by Gemini 1.5 Flash</span>
        </div>

        <div className="h-44 overflow-y-auto space-y-3 p-3 bg-white rounded-2xl border border-gray-150">
          {aiHistory.map((item, i) => (
            <div key={i} className={`p-3 rounded-xl text-xs max-w-[85%] ${
              item.sender === "bot" 
                ? "bg-[#F4F6F5] text-slate-800 mr-auto text-left" 
                : "bg-[#007229] text-white ml-auto text-right"
            }`}>
              {item.text}
            </div>
          ))}
          {isAiThinking && (
            <div className="text-[10px] text-slate-400 italic flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-600" />
              <span>{currentLanguage === "ar" ? "جاري الاستشارة التنظيمية وتدقيق المخططات..." : "Consulting national compliance specs..."}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleAiChat} className="flex gap-2">
          <input
            type="text"
            placeholder={currentLanguage === "ar" ? "اسأل المساعد عن نسب الامتثال بالولايات أو توصيات التدخل بالمخاطر..." : "Ask AI about regional compliance, risk levels, and penalty matrices..."}
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            className="flex-1 text-xs p-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 bg-white"
          />
          <button
            type="submit"
            disabled={isAiThinking}
            className="bg-[#007229] hover:bg-[#005e21] text-white p-3 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
