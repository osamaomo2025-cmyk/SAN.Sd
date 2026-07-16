import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, FileText, CheckCircle2, 
  Search, Sparkles, Send, Eye, Shield, ListCollapse, PlusCircle,
  HelpCircle, UserCheck, Trash2, Scale, ClipboardList
} from "lucide-react";

interface SovereignGRCPlatformProps {
  currentLanguage: "ar" | "en";
  role: string;
}

export default function SovereignGRCPlatform({ currentLanguage, role }: SovereignGRCPlatformProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "risks" | "controls" | "audits" | "whistleblower" | "ai-advisor">("dashboard");
  
  // Data States
  const [risks, setRisks] = useState<any[]>([]);
  const [controls, setControls] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [findings, setFindings] = useState<any[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Loading & Filter
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Risk form state
  const [newRisk, setNewRisk] = useState({
    titleAr: "",
    titleEn: "",
    category: "operational",
    categoryAr: "مخاطر تشغيلية واستراتيجية",
    probability: "5",
    impact: "5",
    controlEffectiveness: "50",
    riskAppetite: "25",
    riskTolerance: "40",
    mitigationPlanAr: "",
    mitigationPlanEn: "",
    ownerAr: "إدارة المخاطر والالتزام الفيدرالي"
  });

  // Control form state
  const [newControl, setNewControl] = useState({
    titleAr: "",
    titleEn: "",
    type: "preventive",
    typeAr: "ضابط وقائي استباقي",
    methodAr: "مراجعة وفحص دوري مؤتمت ومستمر",
    effectiveness: "effective",
    nextTestDate: "2026-12-31",
    notes: ""
  });

  // Whistleblower form state
  const [newIncident, setNewIncident] = useState({
    incidentTitleAr: "",
    incidentTitleEn: "",
    categoryAr: "بلاغات الفساد والنزاهة وحماية المستهلك",
    reporterType: "anonymous_whistleblower",
    detailsAr: ""
  });

  // Audit engagement form state
  const [newAudit, setNewAudit] = useState({
    engagementNameAr: "",
    engagementNameEn: "",
    scope: "فحص وتدقيق الالتزام والمطابقة المالية",
    typeAr: "تدقيق التزام مالي وتشغيلي ونزاهة",
    status: "in_progress",
    startDate: "2026-08-01",
    endDate: "2026-08-31"
  });

  // Findings form state
  const [selectedAuditForFinding, setSelectedAuditForFinding] = useState<any>(null);
  const [newFinding, setNewFinding] = useState({
    findingTitleAr: "",
    findingTitleEn: "",
    severity: "medium",
    recommendationAr: "",
    recommendationEn: "",
    targetResolutionDate: "2026-09-30"
  });

  // AI Advisor state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiScenario, setAiScenario] = useState("predict_emerging_risks");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch all GRC data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resRisks, resControls, resPolicies, resAudits, resFindings, resActions, resIncidents, resLogs] = await Promise.all([
        fetch("/api/grc/risks").then(r => r.json()),
        fetch("/api/grc/controls").then(r => r.json()),
        fetch("/api/grc/policies").then(r => r.json()),
        fetch("/api/grc/audits").then(r => r.json()),
        fetch("/api/grc/findings").then(r => r.json()),
        fetch("/api/grc/corrective-actions").then(r => r.json()),
        fetch("/api/grc/incidents").then(r => r.json()),
        fetch("/api/grc/audit-logs").then(r => r.json())
      ]);

      setRisks(resRisks);
      setControls(resControls);
      setPolicies(resPolicies);
      setAudits(resAudits);
      setFindings(resFindings);
      setCorrectiveActions(resActions);
      setIncidents(resIncidents);
      setAuditLogs(resLogs);
    } catch (err) {
      console.error("Failed to load GRC data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Form submission handlers
  const handleRegisterRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRisk.titleAr || !newRisk.mitigationPlanAr) {
      alert(currentLanguage === "ar" ? "الرجاء كتابة تفاصيل الخطر وخطة معالجته" : "Please provide risk title and mitigation plan");
      return;
    }

    try {
      const res = await fetch("/api/grc/risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRisk,
          actor: role === "GOVERNMENT_MINISTER" ? "ديوان معالي الوزير" : "مسؤول إدارة المخاطر السيادي"
        })
      });
      if (res.ok) {
        setNewRisk({
          titleAr: "",
          titleEn: "",
          category: "operational",
          categoryAr: "مخاطر تشغيلية واستراتيجية",
          probability: "5",
          impact: "5",
          controlEffectiveness: "50",
          riskAppetite: "25",
          riskTolerance: "40",
          mitigationPlanAr: "",
          mitigationPlanEn: "",
          ownerAr: "إدارة المخاطر والالتزام الفيدرالي"
        });
        fetchAllData();
        alert(currentLanguage === "ar" ? "تم تسجيل وتقييم الخطر بنجاح في سجل المخاطر الوطني" : "Risk successfully cataloged and evaluated in National Registry");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateControl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newControl.titleAr) {
      alert(currentLanguage === "ar" ? "الرجاء كتابة عنوان الضابط الرقابي" : "Please specify control title");
      return;
    }

    try {
      const res = await fetch("/api/grc/controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newControl,
          actor: "أخصائي الحوكمة ومراجعة الضوابط الرقابية"
        })
      });
      if (res.ok) {
        setNewControl({
          titleAr: "",
          titleEn: "",
          type: "preventive",
          typeAr: "ضابط وقائي استباقي",
          methodAr: "مراجعة وفحص دوري مؤتمت ومستمر",
          effectiveness: "effective",
          nextTestDate: "2026-12-31",
          notes: ""
        });
        fetchAllData();
        alert(currentLanguage === "ar" ? "تم إدراج الضابط الرقابي الجديد في مكتبة الحوكمة" : "New control successfully cataloged in Governance library");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLaunchAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudit.engagementNameAr) {
      alert(currentLanguage === "ar" ? "الرجاء إدخال تفاصيل برنامج التدقيق" : "Please enter audit engagement details");
      return;
    }

    try {
      const res = await fetch("/api/grc/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAudit,
          actor: role === "GOVERNMENT_MINISTER" ? "ديوان معالي الوزير" : "رئيس ديوان التدقيق الداخلي الفيدرالي"
        })
      });
      if (res.ok) {
        setNewAudit({
          engagementNameAr: "",
          engagementNameEn: "",
          scope: "فحص وتدقيق الالتزام والمطابقة المالية",
          typeAr: "تدقيق التزام مالي وتشغيلي ونزاهة",
          status: "in_progress",
          startDate: "2026-08-01",
          endDate: "2026-08-31"
        });
        fetchAllData();
        alert(currentLanguage === "ar" ? "تم إطلاق وتعميم مهمة التدقيق والامتثال الداخلي" : "Audit engagement successfully initiated");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterFinding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuditForFinding || !newFinding.findingTitleAr || !newFinding.recommendationAr) {
      alert(currentLanguage === "ar" ? "الرجاء ملء تفاصيل الثغرة أو القصور والتوصية العلاجية" : "Please provide finding details and remediation recommendations");
      return;
    }

    try {
      const res = await fetch("/api/grc/findings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId: selectedAuditForFinding.id,
          ...newFinding,
          actor: "لجنة الرقابة والتدقيق الداخلي الفيدرالية"
        })
      });
      if (res.ok) {
        setNewFinding({
          findingTitleAr: "",
          findingTitleEn: "",
          severity: "medium",
          recommendationAr: "",
          recommendationEn: "",
          targetResolutionDate: "2026-09-30"
        });
        setSelectedAuditForFinding(null);
        fetchAllData();
        alert(currentLanguage === "ar" ? "تم تسجيل ثغرة عدم الالتزام وخطتها العلاجية تلقائياً" : "Compliance gap logged; remediation plan auto-generated successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveAction = async (actionId: string) => {
    try {
      const res = await fetch("/api/grc/corrective-actions/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correctiveActionId: actionId,
          evidenceDoc: "تقرير المطابقة والموافقة الفيدرالي المشفر برقم SD-GRC-CLR-2026",
          actor: "مسؤول الجودة والامتثال والمطابقة"
        })
      });
      if (res.ok) {
        fetchAllData();
        alert(currentLanguage === "ar" ? "تم تأكيد تصحيح الثغرة وإغلاق ملف المطابقة بالكامل" : "Remediation verified; compliance folder successfully closed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.incidentTitleAr || !newIncident.detailsAr) {
      alert(currentLanguage === "ar" ? "الرجاء تحديد العنوان ووصف بلاغ النزاهة بدقة" : "Please state the title and details of the integrity violation");
      return;
    }

    try {
      const res = await fetch("/api/grc/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncident)
      });
      if (res.ok) {
        setNewIncident({
          incidentTitleAr: "",
          incidentTitleEn: "",
          categoryAr: "بلاغات الفساد والنزاهة وحماية المستهلك",
          reporterType: "anonymous_whistleblower",
          detailsAr: ""
        });
        fetchAllData();
        alert(currentLanguage === "ar" 
          ? "تم إيداع بلاغك وتشفير هويتك بالكامل بصيغة SHA-256. نشكرك على حمايتك للنزاهة الوطنية." 
          : "Report deposited; your identity has been cryptographically secured with SHA-256. Thank you for protecting national integrity.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConsultAI = async () => {
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/grc/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          scenario: aiScenario,
          context: { risks, controls, policies, audits, findings, incidents }
        })
      });
      const data = await res.json();
      setAiResponse(data.text);
    } catch (err) {
      console.error(err);
      setAiResponse(currentLanguage === "ar" ? "فشل الاتصال بمستشار الذكاء الاصطناعي." : "Failed to connect to AI GRC Advisor.");
    } finally {
      setAiLoading(false);
    }
  };

  // Filtered Lists
  const filteredRisks = risks.filter(r => 
    r.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.nationalId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Platform Title Banner */}
      <div className="bg-gradient-to-l from-[#1e293b] via-[#0f172a] to-[#020617] text-white p-6 rounded-3xl shadow-sm relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-red-500/15 text-red-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-red-500/20">
              {currentLanguage === "ar" ? "بوابة الحوكمة والمخاطر والالتزام الفيدرالية الموحدة" : "Unified GRC & Sovereign Audit"}
            </span>
            <h2 className="text-xl md:text-2xl font-black mt-2">
              {currentLanguage === "ar" ? "المنصة الوطنية للرقابة والحوكمة ومكافحة الفساد" : "National GRC & Anti-Corruption Platform"}
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl font-medium">
              {currentLanguage === "ar" 
                ? "إدارة سجل المخاطر الوطني الموحد، التدقيق الاستراتيجي الداخلي، وضمان المطابقة والسياسات مع معايير ديوان المراجعة القومي."
                : "The central gateway for evaluating national risk registers, scheduling internal audit coverage, and enforcing public integrity."}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { setActiveTab("ai-advisor"); setAiScenario("predict_emerging_risks"); handleConsultAI(); }}
              className="bg-sudan-green hover:bg-sudan-green/90 text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-sudan-gold" />
              <span>{currentLanguage === "ar" ? "التحليل الاستباقي للمخاطر" : "Predict GRC Risks"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "dashboard" ? "bg-slate-900 text-white shadow-sm" : "text-gray-500 hover:text-slate-900"}`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>{currentLanguage === "ar" ? "المؤشرات والوضع الرقابي" : "Dashboard Overview"}</span>
        </button>

        <button
          onClick={() => setActiveTab("risks")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "risks" ? "bg-slate-900 text-white shadow-sm" : "text-gray-500 hover:text-slate-900"}`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>{currentLanguage === "ar" ? "سجل المخاطر الوطني الموحد" : "National Risk Register"}</span>
        </button>

        <button
          onClick={() => setActiveTab("controls")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "controls" ? "bg-slate-900 text-white shadow-sm" : "text-gray-500 hover:text-slate-900"}`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{currentLanguage === "ar" ? "الضوابط والخطط العلاجية" : "Controls & Remediation"}</span>
        </button>

        <button
          onClick={() => setActiveTab("audits")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "audits" ? "bg-slate-900 text-white shadow-sm" : "text-gray-500 hover:text-slate-900"}`}
        >
          <Scale className="h-4 w-4" />
          <span>{currentLanguage === "ar" ? "برامج التدقيق الفيدرالية" : "Sovereign Audit Plan"}</span>
        </button>

        <button
          onClick={() => setActiveTab("whistleblower")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "whistleblower" ? "bg-slate-900 text-white shadow-sm" : "text-gray-500 hover:text-slate-900"}`}
        >
          <ShieldAlert className="h-4 w-4 text-red-500" />
          <span>{currentLanguage === "ar" ? "بوابة كاشفي الفساد المشفرة" : "Sovereign Whistleblowing"}</span>
        </button>

        <button
          onClick={() => setActiveTab("ai-advisor")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "ai-advisor" ? "bg-slate-900 text-white shadow-sm" : "text-gray-500 hover:text-slate-900"}`}
        >
          <Sparkles className="h-4 w-4 text-sudan-gold" />
          <span>{currentLanguage === "ar" ? "مستشار الحوكمة الذكي (AI)" : "Sovereign GRC Advisor (AI)"}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 shadow-xs">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
            <p className="text-xs text-gray-400 mt-4 font-bold">{currentLanguage === "ar" ? "جاري تدقيق السجلات الوطنية الفيدرالية..." : "Querying Sovereign GRC register..."}</p>
          </div>
        ) : (
          <>
            {/* TAB: OVERVIEW */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Statistics bento cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "المخاطر المرصودة" : "Cataloged Risks"}</p>
                      <h3 className="text-xl font-black mt-0.5 text-slate-800">{risks.length}</h3>
                      <p className="text-[9px] text-red-500 font-bold mt-0.5">{currentLanguage === "ar" ? "خطر وطني نشط" : "Active sovereign risks"}</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-sudan-green/10 text-sudan-green rounded-2xl">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "الضوابط الرقابية الفعالة" : "Compliance Controls"}</p>
                      <h3 className="text-xl font-black mt-0.5 text-slate-800">{controls.length}</h3>
                      <p className="text-[9px] text-sudan-green font-bold mt-0.5">{currentLanguage === "ar" ? "✓ ضوابط مبرمجة ومستمرة" : "✓ Active continuous controls"}</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-slate-900 text-white rounded-2xl">
                      <Scale className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "برامج التدقيق الجارية" : "Audit Programs"}</p>
                      <h3 className="text-xl font-black mt-0.5 text-slate-800">{audits.length}</h3>
                      <p className="text-[9px] text-gray-500 font-bold mt-0.5">{currentLanguage === "ar" ? "تتبع ديوان الرقابة" : "Internal Audit oversight"}</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "مؤشر النزاهة الكلي" : "National Integrity index"}</p>
                      <h3 className="text-xl font-black mt-0.5 text-slate-800">96.4%</h3>
                      <p className="text-[9px] text-blue-600 font-bold mt-0.5">{currentLanguage === "ar" ? "مستوى آمن سيادياً" : "Federally Compliant"}</p>
                    </div>
                  </div>
                </div>

                {/* Dashboard grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Emerging Risks Matrix */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 lg:col-span-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "سجل المخاطر الوطني وتقييم القيمة المتبقية" : "Sovereign Risk Matrix & Residual Value"}</h3>
                      <button onClick={() => setActiveTab("risks")} className="text-slate-900 hover:text-slate-700 text-xs font-bold cursor-pointer">
                        {currentLanguage === "ar" ? "عرض سجل المخاطر الكامل ←" : "Risk Register ←"}
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase">
                            <th className="pb-3 text-right">{currentLanguage === "ar" ? "الخطر الوطني الموحد" : "Risk ID & Title"}</th>
                            <th className="pb-3 text-center">{currentLanguage === "ar" ? "القسم" : "Category"}</th>
                            <th className="pb-3 text-center">{currentLanguage === "ar" ? "الخطر الكامن" : "Inherent"}</th>
                            <th className="pb-3 text-center">{currentLanguage === "ar" ? "الخطر المتبقي" : "Residual"}</th>
                            <th className="pb-3 text-center">{currentLanguage === "ar" ? "الوضعية" : "Status"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                          {risks.slice(0, 5).map((r, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 font-bold text-slate-700 text-right">
                                <span className="block text-[10px] text-red-500 font-mono">{r.nationalId}</span>
                                {currentLanguage === "ar" ? r.titleAr : r.titleEn}
                              </td>
                              <td className="py-3 text-center text-slate-500 text-[11px]">{r.categoryAr}</td>
                              <td className="py-3 text-center font-mono font-black text-red-600">{r.inherentRiskScore}</td>
                              <td className="py-3 text-center font-mono font-black text-amber-600">
                                <span className={`px-2 py-0.5 rounded ${
                                  r.residualRiskScore > 35 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                }`}>
                                  {r.residualRiskScore}
                                </span>
                              </td>
                              <td className="py-3 text-center">
                                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full ${
                                  r.status === "active" ? "bg-red-50 text-red-600 border border-red-200" : "bg-slate-100 text-gray-500"
                                }`}>
                                  {r.status === "active" ? (currentLanguage === "ar" ? "معالجة وقائية" : "Mitigating") : (currentLanguage === "ar" ? "تم التعريف" : "Identified")}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Active Policies Overview */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "السياسات واللوائح الفيدرالية النشطة" : "Active Regulatory Directives"}</h3>
                    <div className="space-y-3.5">
                      {policies.map((p, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-gray-150 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-800">{currentLanguage === "ar" ? p.titleAr : p.titleEn}</h4>
                              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{currentLanguage === "ar" ? "الجهة المصدرة:" : "Issuer:"} {p.draftedBy}</p>
                            </div>
                            <span className="text-[9px] font-bold text-sudan-green bg-sudan-green/10 border border-sudan-green/20 px-2 py-0.5 rounded-md">V{p.version}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                            <span>{currentLanguage === "ar" ? "تاريخ النشر:" : "Published:"} {p.publishDate}</span>
                            <span className="text-sudan-green font-mono">✓ {currentLanguage === "ar" ? "نشط وملزم" : "Enforced"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: RISK REGISTER */}
            {activeTab === "risks" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Risk Register form */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 h-fit">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <PlusCircle className="h-5 w-5 text-red-500" />
                      <span>{currentLanguage === "ar" ? "تسجيل خطر فيدرالي جديد" : "Register Enterprise Risk"}</span>
                    </h3>
                    <form onSubmit={handleRegisterRisk} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "وصف الخطر بالعربية" : "Risk Description (Arabic)"}</label>
                        <input 
                          type="text" 
                          required
                          placeholder="مثال: فجوة توريد محاليل ومعايرة صادرات الصمغ العربي"
                          value={newRisk.titleAr}
                          onChange={(e) => setNewRisk({...newRisk, titleAr: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-red-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "وصف الخطر بالإنجليزية" : "Risk Description (English)"}</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Soba gum arabic lab chemical supply gap"
                          value={newRisk.titleEn}
                          onChange={(e) => setNewRisk({...newRisk, titleEn: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-red-500 transition-all text-left"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "الاحتمالية (1-10)" : "Prob (1-10)"}</label>
                          <input 
                            type="number" 
                            min="1" max="10"
                            required
                            value={newRisk.probability}
                            onChange={(e) => setNewRisk({...newRisk, probability: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "الأثر (1-10)" : "Impact (1-10)"}</label>
                          <input 
                            type="number" 
                            min="1" max="10"
                            required
                            value={newRisk.impact}
                            onChange={(e) => setNewRisk({...newRisk, impact: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "أثر الضوابط (%)" : "Ctrl Eff. %"}</label>
                          <input 
                            type="number" 
                            min="0" max="100"
                            required
                            value={newRisk.controlEffectiveness}
                            onChange={(e) => setNewRisk({...newRisk, controlEffectiveness: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "شهية المخاطر (Appetite)" : "Risk Appetite"}</label>
                          <input 
                            type="number" 
                            value={newRisk.riskAppetite}
                            onChange={(e) => setNewRisk({...newRisk, riskAppetite: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "تحمل المخاطر (Tolerance)" : "Risk Tolerance"}</label>
                          <input 
                            type="number" 
                            value={newRisk.riskTolerance}
                            onChange={(e) => setNewRisk({...newRisk, riskTolerance: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "خطة المعالجة والتحصين" : "Mitigation & Action Plan"}</label>
                        <textarea 
                          rows={2}
                          required
                          placeholder="مثال: إنشاء موازنة طوارئ مستقلة لشراء المواد مع Giad..."
                          value={newRisk.mitigationPlanAr}
                          onChange={(e) => setNewRisk({...newRisk, mitigationPlanAr: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none resize-none focus:border-red-500"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "إمضاء وتدوين الخطر الفيدرالي" : "Authorize & Register Risk"}
                      </button>
                    </form>
                  </div>

                  {/* Risks catalog register table */}
                  <div className="space-y-4 lg:col-span-2">
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "سجل المخاطر الوطني الموحد لوزارة التجارة" : "Sovereign Risk Catalog Register"}</h3>
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input 
                            type="text"
                            placeholder={currentLanguage === "ar" ? "بحث برمز الخطر المعرف..." : "Search by Risk ID..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl pr-9 pl-3 py-1.5 text-xs outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        {filteredRisks.map((r, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-gray-150 space-y-3 hover:border-red-500 transition-colors">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 text-xs">
                              <div>
                                <span className="font-mono text-[11px] font-black text-red-600 bg-white border border-gray-200 px-2.5 py-0.5 rounded">{r.nationalId}</span>
                                <span className="text-[10px] text-gray-400 font-extrabold mr-2 uppercase">[{r.categoryAr}]</span>
                                <h4 className="font-extrabold text-sm text-slate-800 mt-2">{currentLanguage === "ar" ? r.titleAr : r.titleEn}</h4>
                                <p className="text-[10px] text-slate-500 font-semibold mt-1">
                                  {currentLanguage === "ar" ? "الجهة المالكة للحل:" : "Risk Owner:"} <strong className="text-slate-600">{r.ownerAr}</strong>
                                </p>
                              </div>
                              <div className="flex items-center gap-4 text-center font-mono">
                                <div>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "الكامن" : "Inherent"}</p>
                                  <p className="text-xs font-black text-red-600 mt-0.5">{r.inherentRiskScore}</p>
                                </div>
                                <div className="border-r border-gray-200 h-8 pr-4">
                                  <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "المتبقي" : "Residual"}</p>
                                  <p className="text-xs font-black text-amber-600 mt-0.5">{r.residualRiskScore}</p>
                                </div>
                              </div>
                            </div>

                            {/* Mitigation plan display */}
                            <div className="bg-white p-3 rounded-xl border border-gray-150">
                              <h5 className="text-[10px] font-extrabold text-slate-700 uppercase flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-sudan-green" />
                                <span>{currentLanguage === "ar" ? "خطة التخفيف والوقاية المعتمدة" : "Approved Remediation Plan"}</span>
                              </h5>
                              <p className="text-[11px] text-gray-500 mt-1 font-semibold leading-relaxed">
                                {currentLanguage === "ar" ? r.mitigationPlanAr : r.mitigationPlanEn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTROLS & REMEDIATIONS */}
            {activeTab === "controls" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Create Control form */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 h-fit">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <PlusCircle className="h-5 w-5 text-sudan-green" />
                      <span>{currentLanguage === "ar" ? "إنشاء ضابط رقابي مبرمج" : "Create Compliance Control"}</span>
                    </h3>
                    <form onSubmit={handleCreateControl} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "عنوان الضابط الرقابي (عربي)" : "Control Title (Arabic)"}</label>
                        <input 
                          type="text" 
                          required
                          placeholder="مثال: تفعيل بوابة الدفع الموحد لمطابقة الفواتير"
                          value={newControl.titleAr}
                          onChange={(e) => setNewControl({...newControl, titleAr: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "عنوان الضابط الرقابي (إنجليزي)" : "Control Title (English)"}</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Central gateway payment invoice verification"
                          value={newControl.titleEn}
                          onChange={(e) => setNewControl({...newControl, titleEn: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none text-left"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "نوع الضابط" : "Control Type"}</label>
                          <select
                            value={newControl.type}
                            onChange={(e) => {
                              const labels: any = { preventive: "ضابط وقائي استباقي", detective: "كاشف وتحليلي لاحق" };
                              setNewControl({...newControl, type: e.target.value, typeAr: labels[e.target.value]});
                            }}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                          >
                            <option value="preventive">{currentLanguage === "ar" ? "وقائي استباقي" : "Preventive"}</option>
                            <option value="detective">{currentLanguage === "ar" ? "كاشف وتحليلي" : "Detective"}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "تاريخ الفحص القادم" : "Next Test Date"}</label>
                          <input 
                            type="date" 
                            required
                            value={newControl.nextTestDate}
                            onChange={(e) => setNewControl({...newControl, nextTestDate: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "حفظ الضابط بمكتبة الحوكمة" : "Authorize & Catalog Control"}
                      </button>
                    </form>
                  </div>

                  {/* Active Controls & Corrective actions list */}
                  <div className="space-y-4 lg:col-span-2">
                    {/* Controls Library */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                      <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "مكتبة الضوابط الرقابية والوقائية الفعالة" : "Active Regulatory Controls Library"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {controls.map((con, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-gray-150 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <span className="bg-sudan-green/10 text-sudan-green text-[9px] font-black px-2 py-0.5 rounded-full">{currentLanguage === "ar" ? con.typeAr : con.type}</span>
                              <span className="text-[10px] text-gray-400 font-mono font-bold">{con.lastTested}</span>
                            </div>
                            <h4 className="font-extrabold text-xs text-slate-800">{currentLanguage === "ar" ? con.titleAr : con.titleEn}</h4>
                            <div className="pt-2 border-t border-gray-200 flex justify-between text-[10px] font-semibold text-slate-500">
                              <span>{currentLanguage === "ar" ? "الفعالية:" : "Effectiveness:"} <strong className="text-sudan-green">Effective</strong></span>
                              <span>{currentLanguage === "ar" ? "الفحص التالي:" : "Next test:"} <strong className="text-slate-600">{con.nextTestDate}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Remediation & Corrective Actions Tracker */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                      <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "ملفات معالجة وتصحيح ثغرات الامتثال (Corrective Actions)" : "Sovereign Corrective & Remediation Tracker"}</h3>
                      <div className="space-y-3">
                        {correctiveActions.map((action, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-sudan-green transition-colors">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] font-black text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">{action.id}</span>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                  action.status === "completed" ? "bg-sudan-green/10 text-sudan-green" : "bg-red-50 text-red-600"
                                }`}>
                                  {action.status === "completed" ? (currentLanguage === "ar" ? "✓ معالجة مطابقة ومغلقة" : "Remediated") : (currentLanguage === "ar" ? "قيد المتابعة والعلاج" : "Remediation Pending")}
                                </span>
                              </div>
                              <h4 className="font-extrabold text-xs text-slate-800 mt-2">{currentLanguage === "ar" ? action.actionAr : action.actionEn}</h4>
                              <p className="text-[10px] text-gray-400 font-semibold mt-1">
                                {currentLanguage === "ar" ? "المسؤول عن التصحيح:" : "Remediation Owner:"} <strong className="text-slate-600">{action.assignedToAr}</strong>
                              </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-3">
                              {action.status === "open" ? (
                                <button
                                  onClick={() => handleResolveAction(action.id)}
                                  className="bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                >
                                  {currentLanguage === "ar" ? "تأكيد إغلاق الثغرة" : "Resolve Finding"}
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-gray-400 italic">
                                  {currentLanguage === "ar" ? `مكتمل (${action.completionDate})` : `Closed (${action.completionDate})`}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AUDITS */}
            {activeTab === "audits" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Launch Audit form */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 h-fit">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <PlusCircle className="h-5 w-5 text-slate-900" />
                      <span>{currentLanguage === "ar" ? "إطلاق برنامج تدقيق داخلي" : "Initiate Audit Engagement"}</span>
                    </h3>
                    <form onSubmit={handleLaunchAudit} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "اسم برنامج التدقيق بالعربية" : "Engagement Title (Arabic)"}</label>
                        <input 
                          type="text" 
                          required
                          placeholder="مثال: تدقيق ومراجعة مصانع سوبا الطبية الدوائية"
                          value={newAudit.engagementNameAr}
                          onChange={(e) => setNewAudit({...newAudit, engagementNameAr: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "اسم برنامج التدقيق بالإنجليزية" : "Engagement Title (English)"}</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Soba pharmaceutical compliance check"
                          value={newAudit.engagementNameEn}
                          onChange={(e) => setNewAudit({...newAudit, engagementNameEn: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none text-left"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "النطاق الفني والرقابي" : "Technical Scope"}</label>
                        <textarea 
                          rows={2}
                          required
                          value={newAudit.scope}
                          onChange={(e) => setNewAudit({...newAudit, scope: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "تاريخ البداية" : "Start Date"}</label>
                          <input 
                            type="date" 
                            required
                            value={newAudit.startDate}
                            onChange={(e) => setNewAudit({...newAudit, startDate: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "تاريخ النهاية" : "End Date"}</label>
                          <input 
                            type="date" 
                            required
                            value={newAudit.endDate}
                            onChange={(e) => setNewAudit({...newAudit, endDate: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "المصادقة وبدء برنامج التدقيق" : "Authorize & Launch Audit"}
                      </button>
                    </form>
                  </div>

                  {/* Audits Engagements List */}
                  <div className="space-y-4 lg:col-span-2">
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                      <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "ملفات وبرامج التدقيق الفيدرالي والرقابة" : "Sovereign Audit Working Engagements"}</h3>
                      <div className="space-y-4">
                        {audits.map((aud, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-gray-150 space-y-3 hover:border-slate-800 transition-colors">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                              <div>
                                <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{currentLanguage === "ar" ? aud.typeAr : "Internal Audit"}</span>
                                <h4 className="font-extrabold text-sm text-slate-800 mt-2">{currentLanguage === "ar" ? aud.engagementNameAr : aud.engagementNameEn}</h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-400 mt-1 font-semibold">
                                  <span>{currentLanguage === "ar" ? "الفترة:" : "Duration:"} {aud.startDate} ⇾ {aud.endDate}</span>
                                </div>
                              </div>
                              <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                {currentLanguage === "ar" ? "قيد المراجعة الميدانية" : "Active Field Audit"}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 font-semibold bg-white p-2.5 rounded-xl border border-gray-200">
                              <strong>{currentLanguage === "ar" ? "نطاق الفحص:" : "Scope:"}</strong> {aud.scope}
                            </p>

                            {/* Findings under this audit */}
                            <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-3">
                              <h5 className="text-[11px] font-black text-slate-700 flex justify-between items-center">
                                <span>⚠️ {currentLanguage === "ar" ? "القصور وفجوات الامتثال المكتشفة" : "Identified Compliance Gaps"}</span>
                                <span className="bg-slate-100 text-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-md">{findings.filter(f => f.auditId === aud.id).length} {currentLanguage === "ar" ? "فجوات" : "gaps"}</span>
                              </h5>

                              {findings.filter(f => f.auditId === aud.id).length === 0 ? (
                                <p className="text-[10px] text-gray-400 italic">{currentLanguage === "ar" ? "لم يتم رصد فجوات عدم التزام في هذه المرحلة." : "No compliance exceptions logged at this checkpoint."}</p>
                              ) : (
                                <div className="space-y-2.5">
                                  {findings.filter(f => f.auditId === aud.id).map((f, fIdx) => (
                                    <div key={fIdx} className="p-3 bg-red-50/30 rounded-xl border border-red-100 text-xs space-y-2">
                                      <div className="flex justify-between items-start gap-2">
                                        <div>
                                          <h6 className="font-extrabold text-slate-800">{currentLanguage === "ar" ? f.findingTitleAr : f.findingTitleEn}</h6>
                                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded mt-1 inline-block ${
                                            f.severity === "high" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                                          }`}>{f.severity.toUpperCase()} RISK</span>
                                        </div>
                                        <span className={`text-[10px] font-bold ${f.status === "resolved" ? "text-sudan-green" : "text-red-500"}`}>
                                          {f.status === "resolved" ? (currentLanguage === "ar" ? "✓ تم معالجتها" : "Remediated") : (currentLanguage === "ar" ? "قيد المعالجة" : "Remediation pending")}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                                        <strong>{currentLanguage === "ar" ? "التوصية العلاجية المبرمة:" : "Remediation Rule:"}</strong> {f.recommendationAr}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="pt-2 border-t border-gray-150 flex justify-end">
                                <button
                                  onClick={() => setSelectedAuditForFinding(aud)}
                                  className="text-slate-900 hover:text-slate-700 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                                >
                                  <PlusCircle className="h-4.5 w-4.5" />
                                  <span>{currentLanguage === "ar" ? "تدوين ثغرة / استثناء امتثال رقمي" : "Log Compliance Finding"}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SECURE WHISTLEBLOWER */}
            {activeTab === "whistleblower" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Whistleblower Form */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 h-fit">
                  <div className="flex items-center gap-2 text-red-600">
                    <ShieldAlert className="h-6 w-6" />
                    <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "نظام كاشفي الفساد الفيدرالي المؤمن" : "Sovereign Whistleblower Core"}</h3>
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    {currentLanguage === "ar" 
                      ? "نظام مشفر بالكامل لحماية النزاهة الوطنية وكشف أي تلاعب بالأسعار أو احتكار للسلع المدعومة. يتم حجب بياناتك بالكامل وتوليد بصمة SHA-256 مشفرة لا يمكن لأي جهة عكسها لضمان الأمان السيادي المطلق." 
                      : "Cryptographically protected secure whistleblowing interface. Your identity is automatically shielded with a one-way SHA-256 hash."}
                  </p>

                  <form onSubmit={handleRegisterIncident} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "عنوان البلاغ (مكافحة الاحتكار / الفساد)" : "Incident Title"}</label>
                      <input 
                        type="text" 
                        required
                        placeholder="مثال: ممارسات احتكارية بمستودع القمح بأم درمان"
                        value={newIncident.incidentTitleAr}
                        onChange={(e) => setNewIncident({...newIncident, incidentTitleAr: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "فئة المخالفة" : "Violation Category"}</label>
                      <select
                        value={newIncident.categoryAr}
                        onChange={(e) => setNewIncident({...newIncident, categoryAr: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                      >
                        <option value="بلاغات الفساد والنزاهة وحماية المستهلك">{currentLanguage === "ar" ? "مكافحة الاحتكار وتبديد المال العام" : "Antitrust & Price Gouging"}</option>
                        <option value="تجاوز ضوابط المواصفات الفيدرالية">{currentLanguage === "ar" ? "تجاوز معايير المواصفات السودانية SSMO" : "SSMO Non-Compliance"}</option>
                        <option value="شبهة تضارب مصالح في الترسية">{currentLanguage === "ar" ? "شبهة تضارب مصالح في عطاءات المشتريات" : "Conflict of Interest"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "تفاصيل البلاغ والأدلة (سرية ومشفرة)" : "Confidential Incident Description"}</label>
                      <textarea 
                        rows={4}
                        required
                        placeholder="الرجاء كتابة تفاصيل الحادثة بدقة، مع أرقام الحاويات، المواقع، التواريخ، أو أسماء الأطراف المشتبه بتورطها..."
                        value={newIncident.detailsAr}
                        onChange={(e) => setNewIncident({...newIncident, detailsAr: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none resize-none focus:border-red-500"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      {currentLanguage === "ar" ? "إرسال البلاغ المشفر بالبصمة المؤمنة" : "Deposit Cryptographic Report"}
                    </button>
                  </form>
                </div>

                {/* Whistleblower Incidents Feed */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "سجل تتبع بلاغات الحوكمة والنزاهة قيد التحقيق" : "Sovereign Protected Incidents Directory"}</h3>
                    
                    <div className="space-y-4">
                      {incidents.map((inc, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-gray-150 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
                                {currentLanguage === "ar" ? "مشفر للنزاهة" : "ENCRYPTED"}
                              </span>
                              <span className="text-slate-500 font-extrabold text-[10px]">[{inc.categoryAr}]</span>
                            </div>
                            <span className="font-mono text-[10px] text-gray-400">{inc.loggedAt}</span>
                          </div>

                          <h4 className="font-extrabold text-sm text-slate-800">{currentLanguage === "ar" ? inc.incidentTitleAr : inc.incidentTitleEn}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-gray-150 font-semibold">
                            {inc.detailsAr}
                          </p>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-gray-200 text-[10px] font-semibold text-gray-400">
                            <span className="flex items-center gap-1">
                              🕵️ {currentLanguage === "ar" ? "المحقق الفيدرالي المكلف:" : "Assigned Investigator:"} <strong className="text-slate-600">{inc.investigatorAr}</strong>
                            </span>
                            <span className="bg-yellow-50 text-yellow-600 border border-yellow-200 text-[9px] font-black px-2 py-0.5 rounded-full">
                              {currentLanguage === "ar" ? "✓ قيد التحقيق السري والمطابقة" : "Under Active Investigation"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[9px] font-mono bg-white border border-gray-200 p-1.5 rounded-lg text-gray-400 overflow-x-auto">
                            <span className="text-red-600 font-bold">ANONYMOUS HASH:</span>
                            <span>{inc.securedWhistleblowerHash}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AI ADVISOR */}
            {activeTab === "ai-advisor" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Configuration */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 h-fit">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-sudan-gold" />
                    <span>{currentLanguage === "ar" ? "مستشار الحوكمة الذكي" : "Sovereign GRC AI Advisor"}</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    {currentLanguage === "ar" ? "محاكاة التنبؤ بالمخاطر الناشئة وتحديد فجوات الامتثال للوزارات والديوان." : "Sovereign predictive risk modeling, continuous audit optimization, and regulatory alignment advice."}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "سيناريو الرقابة والتنبؤ" : "Select Modeling Scenario"}</label>
                      <select
                        value={aiScenario}
                        onChange={(e) => setAiScenario(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-800"
                      >
                        <option value="predict_emerging_risks">{currentLanguage === "ar" ? "التنبؤ بالمخاطر الاستراتيجية والتشغيلية الناشئة" : "Predict Emerging Strategic Risks"}</option>
                        <option value="prioritize_audits">{currentLanguage === "ar" ? "جدولة أولويات التدقيق المبني على المخاطر" : "Risk-Based Audit Prioritization"}</option>
                        <option value="general_compliance">{currentLanguage === "ar" ? "تقرير ذكاء الحوكمة والالتزام العام" : "General GRC Maturity Intelligence"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "سؤال إداري مخصص" : "Additional Specific Inquiry"}</label>
                      <textarea
                        rows={3}
                        placeholder={currentLanguage === "ar" ? "مثال: مراجعة مدى توافق معايير SSMO بخصوص معامل سوبا..." : "e.g., Review compliance gaps of Soba labs..."}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-800 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleConsultAI}
                      disabled={aiLoading}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      {aiLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>{currentLanguage === "ar" ? "جاري تشكيل التقرير الرقابي..." : "Generating Sourcing Report..."}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-sudan-gold" />
                          <span>{currentLanguage === "ar" ? "توليد التقرير الرقابي الذكي" : "Generate GRC Report"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Response Display */}
                <div className="lg:col-span-2 bg-slate-950 text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4 min-h-[400px] flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-sudan-gold" />
                        <h4 className="font-extrabold text-sm text-sudan-gold">{currentLanguage === "ar" ? "محرك الذكاء الرقابي الفيدرالي الموحد" : "Sovereign GRC AI Core"}</h4>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold px-2 py-0.5 rounded">
                        ONLINE - REGULATOR AGENT
                      </span>
                    </div>

                    {aiResponse ? (
                      <div className="text-xs leading-relaxed space-y-4 whitespace-pre-line text-slate-200">
                        {aiResponse}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-2">
                        <Sparkles className="h-8 w-8 text-slate-700 animate-pulse" />
                        <p className="text-xs">{currentLanguage === "ar" ? "اضغط على زر التوليد لتشغيل محرك التحليل والرقابة التنبؤية الفيدرالية." : "Trigger the generation to run autonomous risk & compliance modeling."}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-500 flex justify-between items-center">
                    <span>{currentLanguage === "ar" ? "مدعوم بنظام الحوكمة الرقمية ومكافحة الفساد للجمهورية" : "Sovereign GRC AI Advisor • Republic of Sudan"}</span>
                    <span>SUDAN-GRC-2026</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL: SUBMIT COMPLIANCE FINDING */}
      {selectedAuditForFinding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h4 className="font-extrabold text-sm text-slate-800">{currentLanguage === "ar" ? "تدوين ثغرة / استثناء امتثال رقمي" : "Log Compliance Audit Finding"}</h4>
              <button 
                onClick={() => setSelectedAuditForFinding(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-gray-150">
              <h5 className="font-extrabold text-xs text-slate-700">{currentLanguage === "ar" ? selectedAuditForFinding.engagementNameAr : selectedAuditForFinding.engagementNameEn}</h5>
              <p className="text-[10px] text-gray-400 mt-1">{currentLanguage === "ar" ? "نطاق الفحص:" : "Scope:"} {selectedAuditForFinding.scope}</p>
            </div>

            <form onSubmit={handleRegisterFinding} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "وصف فجوة / ثغرة عدم الالتزام (عربي)" : "Finding Description (Arabic)"}</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: رصد عدم تفعيل التتبع الجغرافي لـ 3 مركبات سوبا"
                  value={newFinding.findingTitleAr}
                  onChange={(e) => setNewFinding({...newFinding, findingTitleAr: e.target.value})}
                  className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "وصف فجوة / ثغرة عدم الالتزام (إنجليزي)" : "Finding Description (English)"}</label>
                <input 
                  type="text" 
                  placeholder="e.g., Lack of GPS tracking in 3 Soba logistics vehicles"
                  value={newFinding.findingTitleEn}
                  onChange={(e) => setNewFinding({...newFinding, findingTitleEn: e.target.value})}
                  className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "درجة الخطورة" : "Severity Rating"}</label>
                  <select
                    value={newFinding.severity}
                    onChange={(e) => setNewFinding({...newFinding, severity: e.target.value})}
                    className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    <option value="low">LOW RISK</option>
                    <option value="medium">MEDIUM RISK</option>
                    <option value="high">HIGH RISK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "الأجل المبرمج للحل" : "Target Resolution Date"}</label>
                  <input 
                    type="date" 
                    required
                    value={newFinding.targetResolutionDate}
                    onChange={(e) => setNewFinding({...newFinding, targetResolutionDate: e.target.value})}
                    className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "التوصية العلاجية لتصحيح المسار" : "Remediation Recommendation"}</label>
                <textarea 
                  rows={2}
                  required
                  placeholder="تجهيز وتفصيل تركيب أجهزة التتبع وربطها الفوري بالبوابة..."
                  value={newFinding.recommendationAr}
                  onChange={(e) => setNewFinding({...newFinding, recommendationAr: e.target.value})}
                  className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none resize-none focus:border-slate-800"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
              >
                {currentLanguage === "ar" ? "حفظ الثغرة وبدء المتابعة العلاجية" : "Log Finding & Start Remediation"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
