import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Building2, Briefcase, FileCheck, DollarSign, PlusCircle, AlertCircle, 
  TrendingUp, ListCollapse, CheckCircle, Search, Sparkles, Send, ShieldAlert,
  Calendar, FileText, BadgeAlert, Scale
} from "lucide-react";

interface SovereignProcurementPlatformProps {
  currentLanguage: "ar" | "en";
  role: string;
}

export default function SovereignProcurementPlatform({ currentLanguage, role }: SovereignProcurementPlatformProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "tenders" | "vendors" | "contracts" | "logs" | "ai-advisor">("dashboard");
  
  // States
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [procurementPlans, setProcurementPlans] = useState<any[]>([]);
  const [tenders, setTenders] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  
  // Loading & Action state
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New Supplier form state
  const [newSup, setNewSup] = useState({
    nameAr: "",
    nameEn: "",
    type: "local",
    typeAr: "مورد وطني محلي",
    commercialRegistration: "",
    taxId: "",
    financialEval: "A (Excellent)",
    technicalEval: "90% (SSMO Certified)",
    riskRating: "low",
    performanceScore: 90
  });

  // New Tender form state
  const [newTender, setNewTender] = useState({
    titleAr: "",
    titleEn: "",
    type: "open",
    typeAr: "مناقصة عامة مفتوحة",
    budget: "",
    tenderFee: "",
    submissionDeadline: "2026-10-31",
    categoryAr: "تجهيزات ومعدات تشغيلية",
    categoryEn: "Operational Equipment"
  });

  // Submit Bid form state
  const [selectedTenderForBid, setSelectedTenderForBid] = useState<any>(null);
  const [newBid, setNewBid] = useState({
    supplierId: "",
    amount: "",
    technicalScore: "85",
    financialScore: "85",
    notes: ""
  });

  // AI Advisor state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiScenario, setAiScenario] = useState("detect_collusion");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch all data from APIs
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resSups, resPlans, resTenders, resBids, resContracts, resPOs, resLogs] = await Promise.all([
        fetch("/api/procurement/suppliers").then(r => r.json()),
        fetch("/api/procurement/plans").then(r => r.json()),
        fetch("/api/procurement/tenders").then(r => r.json()),
        fetch("/api/procurement/bids").then(r => r.json()),
        fetch("/api/procurement/contracts").then(r => r.json()),
        fetch("/api/procurement/purchase-orders").then(r => r.json()),
        fetch("/api/procurement/audit-logs").then(r => r.json())
      ]);

      setSuppliers(resSups);
      setProcurementPlans(resPlans);
      setTenders(resTenders);
      setBids(resBids);
      setContracts(resContracts);
      setPurchaseOrders(resPOs);
      setAuditLogs(resLogs);
    } catch (err) {
      console.error("Failed to load procurement data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Form submit handlers
  const handleRegisterSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSup.nameAr || !newSup.commercialRegistration) {
      alert(currentLanguage === "ar" ? "الرجاء تعبئة البيانات الأساسية للمورد" : "Please fill in essential supplier details");
      return;
    }
    
    try {
      const res = await fetch("/api/procurement/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSup,
          actor: role === "GOVERNMENT_MINISTER" ? "ديوان معالي الوزير" : "مسؤول المشتريات الفيدرالي الموحد"
        })
      });
      if (res.ok) {
        setNewSup({
          nameAr: "",
          nameEn: "",
          type: "local",
          typeAr: "مورد وطني محلي",
          commercialRegistration: "",
          taxId: "",
          financialEval: "A (Excellent)",
          technicalEval: "90% (SSMO Certified)",
          riskRating: "low",
          performanceScore: 90
        });
        fetchAllData();
        alert(currentLanguage === "ar" ? "تم تسجيل المورد السيادي بنجاح" : "Sovereign supplier registered successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishTender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTender.titleAr || !newTender.budget) {
      alert(currentLanguage === "ar" ? "الرجاء إدخال تفاصيل العطاء والموازنة" : "Please enter tender details and budget");
      return;
    }

    try {
      const res = await fetch("/api/procurement/tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTender,
          actor: role === "GOVERNMENT_MINISTER" ? "ديوان معالي الوزير" : "لجنة فض المظاريف والبت والترسية"
        })
      });
      if (res.ok) {
        setNewTender({
          titleAr: "",
          titleEn: "",
          type: "open",
          typeAr: "مناقصة عامة مفتوحة",
          budget: "",
          tenderFee: "",
          submissionDeadline: "2026-10-31",
          categoryAr: "تجهيزات ومعدات تشغيلية",
          categoryEn: "Operational Equipment"
        });
        fetchAllData();
        alert(currentLanguage === "ar" ? "تم نشر العطاء السيادي وإدراجه بجريدة المناقصات الفيدرالية الموحدة" : "Sovereign tender published and cataloged successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenderForBid || !newBid.supplierId || !newBid.amount) {
      alert(currentLanguage === "ar" ? "الرجاء اختيار المورد وتحديد القيمة المالية للعرض" : "Please select supplier and state financial amount");
      return;
    }

    const matchedSupplier = suppliers.find(s => s.id === newBid.supplierId);

    try {
      const res = await fetch("/api/procurement/tenders/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: selectedTenderForBid.id,
          supplierId: newBid.supplierId,
          supplierNameAr: matchedSupplier ? matchedSupplier.nameAr : "مورد مسجل بالبوابة",
          supplierNameEn: matchedSupplier ? matchedSupplier.nameEn : "Registered Vendor",
          amount: Number(newBid.amount),
          technicalScore: Number(newBid.technicalScore),
          financialScore: Number(newBid.financialScore),
          notes: newBid.notes,
          actor: "أمين لجنة استلام وفحص العطاءات الموحدة"
        })
      });
      if (res.ok) {
        setNewBid({
          supplierId: "",
          amount: "",
          technicalScore: "85",
          financialScore: "85",
          notes: ""
        });
        setSelectedTenderForBid(null);
        fetchAllData();
        alert(currentLanguage === "ar" ? "تم تسجيل العرض المنافس وتشفيره بنجاح" : "Bid registered and cryptographically locked successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAwardTender = async (tenderId: string, bidId: string) => {
    if (!confirm(currentLanguage === "ar" 
      ? "هل أنت متأكد من قرار الترسية المباشرة؟ هذا الإجراء سيقوم بصياغة العقد وإصدار أمر الشراء فوراً وتحديث سجل الأصول." 
      : "Are you sure you want to award this tender? This will issue a sovereign PO and update Asset records instantly.")) return;

    try {
      const res = await fetch("/api/procurement/tenders/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId,
          bidId,
          actor: role === "GOVERNMENT_MINISTER" ? "ديوان معالي الوزير" : "رئيس لجنة البت والترسية الفيدرالية الموحدة"
        })
      });
      if (res.ok) {
        fetchAllData();
        alert(currentLanguage === "ar" ? "تمت عملية الترسية الرسمية وإمضاء العقد إلكترونياً!" : "Tender officially awarded and contract digitally signed!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConsultAI = async () => {
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/procurement/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          scenario: aiScenario,
          context: { suppliers, tenders, bids, contracts }
        })
      });
      const data = await res.json();
      setAiResponse(data.text);
    } catch (err) {
      console.error(err);
      setAiResponse(currentLanguage === "ar" ? "فشل الاتصال بمستشار الذكاء الاصطناعي." : "Failed to connect to AI Advisor.");
    } finally {
      setAiLoading(false);
    }
  };

  // Filtered lists
  const filteredSuppliers = suppliers.filter(s => 
    s.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nationalId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTenders = tenders.filter(t => 
    t.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.tenderCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Platform Title Banner */}
      <div className="bg-gradient-to-l from-sudan-green via-[#005c21] to-[#014118] text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-sudan-gold/20 text-sudan-gold text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-sudan-gold/20">
              {currentLanguage === "ar" ? "نظام الشراء والبت والتعاقد الفيدرالي" : "Federal Procurement & Sourcing"}
            </span>
            <h2 className="text-xl md:text-2xl font-black mt-2">
              {currentLanguage === "ar" ? "المنصة الوطنية الموحدة للمشتريات والعقود" : "Unified National Procurement & Contracts"}
            </h2>
            <p className="text-xs text-gray-200 mt-1 max-w-2xl font-medium">
              {currentLanguage === "ar" 
                ? "بوابة حوكمة الشراء العام لجمهورية السودان طبقاً لمعايير الكوميسا والهيئة السودانية للمواصفات ومكافحة الاحتكار."
                : "The central gateway for public commerce sourcing in accordance with SSMO, COMESA, and anti-corruption regulations."}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { setActiveTab("ai-advisor"); setAiScenario("detect_collusion"); handleConsultAI(); }}
              className="bg-sudan-gold hover:bg-sudan-gold/90 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? "مستشار مكافحة التواطؤ" : "Anti-Collusion AI"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "dashboard" ? "bg-sudan-green text-white shadow-sm" : "text-gray-500 hover:text-sudan-green"}`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>{currentLanguage === "ar" ? "لوحة المتابعة والمؤشرات" : "Dashboard & Metrics"}</span>
        </button>

        <button
          onClick={() => setActiveTab("tenders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "tenders" ? "bg-sudan-green text-white shadow-sm" : "text-gray-500 hover:text-sudan-green"}`}
        >
          <Briefcase className="h-4 w-4" />
          <span>{currentLanguage === "ar" ? "بوابة العطاءات العامة" : "Tenders & Bids"}</span>
        </button>

        <button
          onClick={() => setActiveTab("vendors")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "vendors" ? "bg-sudan-green text-white shadow-sm" : "text-gray-500 hover:text-sudan-green"}`}
        >
          <Building2 className="h-4 w-4" />
          <span>{currentLanguage === "ar" ? "سجل الموردين المعتمدين" : "Vendor Registry"}</span>
        </button>

        <button
          onClick={() => setActiveTab("contracts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "contracts" ? "bg-sudan-green text-white shadow-sm" : "text-gray-500 hover:text-sudan-green"}`}
        >
          <FileCheck className="h-4 w-4" />
          <span>{currentLanguage === "ar" ? "العقود وأوامر الشراء (POs)" : "Contracts & POs"}</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "logs" ? "bg-sudan-green text-white shadow-sm" : "text-gray-500 hover:text-sudan-green"}`}
        >
          <ListCollapse className="h-4 w-4" />
          <span>{currentLanguage === "ar" ? "سجل التدقيق والمطابقة" : "Sovereign Ledger"}</span>
        </button>

        <button
          onClick={() => setActiveTab("ai-advisor")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "ai-advisor" ? "bg-sudan-green text-white shadow-sm" : "text-gray-500 hover:text-sudan-green"}`}
        >
          <Sparkles className="h-4 w-4 text-sudan-gold" />
          <span>{currentLanguage === "ar" ? "مستشار المشتريات الذكي (AI)" : "Sourcing Advisor (AI)"}</span>
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 shadow-xs">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sudan-green"></div>
            <p className="text-xs text-gray-400 mt-4 font-bold">{currentLanguage === "ar" ? "جاري جلب البيانات من السجل الوطني..." : "Querying federal records..."}</p>
          </div>
        ) : (
          <>
            {/* TAB: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Statistics Bento Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-sudan-green/10 text-sudan-green rounded-2xl">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "الموردون المعتمدون" : "Registered Suppliers"}</p>
                      <h3 className="text-xl font-black mt-0.5 text-slate-800">{suppliers.length}</h3>
                      <p className="text-[9px] text-sudan-green font-bold mt-0.5">{currentLanguage === "ar" ? "✓ نشط وموثق وطنيا" : "✓ Active & Federal Certified"}</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-sudan-gold/10 text-sudan-gold rounded-2xl">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "المناقصات المفتوحة" : "Active Tenders"}</p>
                      <h3 className="text-xl font-black mt-0.5 text-slate-800">{tenders.filter(t => t.status === "bidding").length}</h3>
                      <p className="text-[9px] text-gray-500 font-bold mt-0.5">{currentLanguage === "ar" ? "تحت استقبال العطاءات" : "Bidding currently open"}</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "عقود التوريد والـ POs" : "Contracts & POs"}</p>
                      <h3 className="text-xl font-black mt-0.5 text-slate-800">{contracts.length + purchaseOrders.length}</h3>
                      <p className="text-[9px] text-blue-600 font-bold mt-0.5">{currentLanguage === "ar" ? "✓ جارية التنفيذ والمطابقة" : "✓ In Active Execution"}</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "متوسط وفر المشتريات" : "Procurement Savings"}</p>
                      <h3 className="text-xl font-black mt-0.5 text-slate-800">14.3%</h3>
                      <p className="text-[9px] text-purple-600 font-bold mt-0.5">{currentLanguage === "ar" ? "مقارنة بالقيمة السوقية" : "Under competitive vetting"}</p>
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Active Tenders & QCBS evaluation overview */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 lg:col-span-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "مستجدات العطاءات المفتوحة للبت والترسية" : "Active Sourcing & Bid Evaluations"}</h3>
                      <button onClick={() => setActiveTab("tenders")} className="text-sudan-green hover:text-sudan-green-light text-xs font-bold cursor-pointer">
                        {currentLanguage === "ar" ? "إدارة العطاءات ←" : "Manage Tenders ←"}
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase">
                            <th className="pb-3 text-right">{currentLanguage === "ar" ? "المناقصة" : "Tender"}</th>
                            <th className="pb-3 text-center">{currentLanguage === "ar" ? "النوع" : "Type"}</th>
                            <th className="pb-3 text-center">{currentLanguage === "ar" ? "العروض المستلمة" : "Bids Recv"}</th>
                            <th className="pb-3 text-left">{currentLanguage === "ar" ? "الموازنة المرصودة" : "Allocated Budget"}</th>
                            <th className="pb-3 text-center">{currentLanguage === "ar" ? "الوضعية" : "Status"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                          {tenders.slice(0, 5).map((t, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 font-bold text-slate-700 text-right">
                                <span className="block text-[10px] text-sudan-gold font-mono">{t.tenderCode}</span>
                                {currentLanguage === "ar" ? t.titleAr : t.titleEn}
                              </td>
                              <td className="py-3 text-center">
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[9px] font-bold">
                                  {currentLanguage === "ar" ? t.typeAr : t.type}
                                </span>
                              </td>
                              <td className="py-3 text-center font-bold text-slate-800">{t.bidsCount || 0}</td>
                              <td className="py-3 font-mono font-bold text-slate-600 text-left">{(t.budget).toLocaleString()} ج.س</td>
                              <td className="py-3 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${
                                  t.status === "bidding" ? "bg-sudan-green/10 text-sudan-green" : "bg-gray-100 text-gray-500"
                                }`}>
                                  {t.status === "bidding" 
                                    ? (currentLanguage === "ar" ? "إقبال العروض" : "Bidding") 
                                    : (currentLanguage === "ar" ? "تمت الترسية" : "Awarded")}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column - Sourcing Plans & COMESA integration */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "خطط المشتريات وموازنات الأقسام" : "Departmental Sourcing Budgets"}</h3>
                    <div className="space-y-3.5">
                      {procurementPlans.map((plan, idx) => {
                        const percent = Math.min(100, Math.round((plan.budgetUtilized / plan.budgetAllocated) * 100)) || 0;
                        return (
                          <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-gray-150 space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-extrabold text-xs text-slate-800">{currentLanguage === "ar" ? plan.planNameAr : plan.planNameEn}</h4>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">{currentLanguage === "ar" ? plan.departmentAr : plan.departmentEn}</p>
                              </div>
                              <span className="text-[10px] font-extrabold text-sudan-green font-mono">{plan.year}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                <span>{currentLanguage === "ar" ? "استهلاك الموازنة:" : "Utilization:"} {percent}%</span>
                                <span className="font-mono">{(plan.budgetAllocated).toLocaleString()} ج.س</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-sudan-green h-full" style={{ width: `${percent || 15}%` }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TENDERS & BIDDING */}
            {activeTab === "tenders" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Tender Publication Form */}
                  {(role !== "BUSINESS_INVESTOR") && (
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 h-fit">
                      <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <PlusCircle className="h-5 w-5 text-sudan-green" />
                        <span>{currentLanguage === "ar" ? "نشر كراسة شروط ومناقصة جديدة" : "Publish Sourcing Tender"}</span>
                      </h3>
                      <form onSubmit={handlePublishTender} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "عنوان المناقصة بالعربية" : "Tender Title (Arabic)"}</label>
                          <input 
                            type="text" 
                            required
                            placeholder="مثال: توريد مبردات ومعدات تكييف هجينة لصالح غرف التبريد"
                            value={newTender.titleAr}
                            onChange={(e) => setNewTender({...newTender, titleAr: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-sudan-green transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "عنوان المناقصة بالإنجليزية" : "Tender Title (English)"}</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Supply of Hybrid Cooling Equipment"
                            value={newTender.titleEn}
                            onChange={(e) => setNewTender({...newTender, titleEn: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-sudan-green transition-all text-left"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "الموازنة (ج.س)" : "Budget (SDG)"}</label>
                            <input 
                              type="number" 
                              required
                              value={newTender.budget}
                              onChange={(e) => setNewTender({...newTender, budget: e.target.value})}
                              className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-sudan-green transition-all font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "رسوم الكراسة (ج.س)" : "Tender Fee (SDG)"}</label>
                            <input 
                              type="number" 
                              value={newTender.tenderFee}
                              onChange={(e) => setNewTender({...newTender, tenderFee: e.target.value})}
                              className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-sudan-green transition-all font-mono"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "نوع المناقصة" : "Tender Type"}</label>
                            <select
                              value={newTender.type}
                              onChange={(e) => {
                                const labels: any = { open: "مناقصة عامة مفتوحة", limited: "مناقصة محدودة", direct: "إسناد مباشر", emergency: "عطاء طوارئ سيادي" };
                                setNewTender({...newTender, type: e.target.value, typeAr: labels[e.target.value]});
                              }}
                              className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                            >
                              <option value="open">{currentLanguage === "ar" ? "عامة مفتوحة" : "Open Tender"}</option>
                              <option value="limited">{currentLanguage === "ar" ? "محدودة مغلقة" : "Limited Tender"}</option>
                              <option value="direct">{currentLanguage === "ar" ? "إسناد مباشر" : "Direct Assignment"}</option>
                              <option value="emergency">{currentLanguage === "ar" ? "طوارئ وأمن غذائي" : "Emergency / Sovereign"}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "آخر أجل للتقديم" : "Deadline"}</label>
                            <input 
                              type="date" 
                              required
                              value={newTender.submissionDeadline}
                              onChange={(e) => setNewTender({...newTender, submissionDeadline: e.target.value})}
                              className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                            />
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "إمضاء ونشر المناقصة سيادياً" : "Sign and Publish Sovereign Tender"}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Active Tenders list */}
                  <div className={`space-y-4 lg:col-span-${role === "BUSINESS_INVESTOR" ? 3 : 2}`}>
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "سجل المناقصات والمزايدات الفيدرالية" : "Federal Tender Registry"}</h3>
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input 
                            type="text"
                            placeholder={currentLanguage === "ar" ? "بحث برمز العطاء..." : "Search by code..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl pr-9 pl-3 py-1.5 text-xs outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {filteredTenders.map((t, idx) => (
                          <div key={idx} className="border border-gray-150 p-4 rounded-2xl bg-white hover:border-sudan-green transition-colors space-y-3.5">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-black text-sudan-gold bg-slate-100 px-2 py-0.5 rounded-md">{t.tenderCode}</span>
                                  <span className="bg-sudan-green/10 text-sudan-green text-[9px] font-bold px-2 py-0.5 rounded-full">{currentLanguage === "ar" ? t.typeAr : t.type}</span>
                                </div>
                                <h4 className="font-extrabold text-sm text-slate-800 mt-2">{currentLanguage === "ar" ? t.titleAr : t.titleEn}</h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-400 mt-1 font-semibold">
                                  <span>{currentLanguage === "ar" ? "نشر:" : "Published:"} {t.publicationDate}</span>
                                  <span className="text-red-500">{currentLanguage === "ar" ? "آخر أجل:" : "Deadline:"} {t.submissionDeadline}</span>
                                </div>
                              </div>
                              <div className="text-left font-mono">
                                <p className="text-[9px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "القيمة التقديرية" : "Est. Value"}</p>
                                <p className="text-sm font-black text-slate-700">{(t.budget).toLocaleString()} SDG</p>
                              </div>
                            </div>

                            {/* Bids submitted for this tender */}
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-150 space-y-2.5">
                              <h5 className="text-[11px] font-extrabold text-slate-700 flex items-center justify-between">
                                <span>{currentLanguage === "ar" ? "العروض والترشيحات المنافسة المستلمة" : "Submitted Bid Proposals"}</span>
                                <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md text-[9px] font-mono">{bids.filter(b => b.tenderId === t.id).length} {currentLanguage === "ar" ? "عروض" : "bids"}</span>
                              </h5>

                              {bids.filter(b => b.tenderId === t.id).length === 0 ? (
                                <p className="text-[10px] text-gray-400 italic">{currentLanguage === "ar" ? "لم يتم تقديم عروض منافسة حتى الآن لعقد المطابقة." : "No competitor proposals have been received yet for this contract."}</p>
                              ) : (
                                <div className="space-y-2">
                                  {bids.filter(b => b.tenderId === t.id).map((b, bIdx) => (
                                    <div key={bIdx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-white rounded-lg border border-gray-150 text-xs gap-3">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-extrabold text-slate-800">{currentLanguage === "ar" ? b.supplierNameAr : b.supplierNameEn}</span>
                                          <span className="text-[9px] font-bold text-gray-400">({b.submissionDate})</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-[10px] font-semibold text-slate-500">
                                          <span>{currentLanguage === "ar" ? "التقييم الفني:" : "Tech Score:"} <strong className="text-sudan-green font-mono">{b.technicalScore}%</strong></span>
                                          <span>{currentLanguage === "ar" ? "المالي:" : "Financial:"} <strong className="text-blue-600 font-mono">{b.financialScore}%</strong></span>
                                          <span>{currentLanguage === "ar" ? "المجموع (QCBS 70/30):" : "Combined Score:"} <strong className="text-purple-600 font-mono">{b.combinedScore}%</strong></span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 justify-between sm:justify-start">
                                        <span className="font-mono font-bold text-slate-700">{(b.amount).toLocaleString()} ج.س</span>
                                        {t.status === "bidding" && (role !== "BUSINESS_INVESTOR") ? (
                                          <button 
                                            onClick={() => handleAwardTender(t.id, b.id)}
                                            className="bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                          >
                                            {currentLanguage === "ar" ? "الترسية والتعاقد" : "Award & Contract"}
                                          </button>
                                        ) : b.status === "awarded" ? (
                                          <span className="bg-sudan-gold/20 text-sudan-gold border border-sudan-gold/20 text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                                            {currentLanguage === "ar" ? "✓ تم الترسية والمصادقة" : "✓ Awarded"}
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-gray-400 font-bold">{currentLanguage === "ar" ? "لم يحالفه الحظ" : "Passed"}</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {t.status === "bidding" && (
                                <div className="pt-2 border-t border-gray-200 flex justify-end">
                                  <button
                                    onClick={() => setSelectedTenderForBid(t)}
                                    className="text-sudan-green hover:text-sudan-green-light text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                                  >
                                    <PlusCircle className="h-4.5 w-4.5" />
                                    <span>{currentLanguage === "ar" ? "تقديم عرض منافسة جديد" : "Submit Competitor Proposal"}</span>
                                  </button>
                                </div>
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

            {/* TAB: VENDOR REGISTRY */}
            {activeTab === "vendors" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Supplier Registration Form */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 h-fit">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <PlusCircle className="h-5 w-5 text-sudan-green" />
                      <span>{currentLanguage === "ar" ? "تسجيل مورد وطني / دولي بالبوابة" : "Register Sourcing Vendor"}</span>
                    </h3>
                    <form onSubmit={handleRegisterSupplier} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "اسم الشركة (عربي)" : "Company Name (Arabic)"}</label>
                        <input 
                          type="text" 
                          required
                          placeholder="مثال: مجموعة جياد للمعدات واللوجستيات"
                          value={newSup.nameAr}
                          onChange={(e) => setNewSup({...newSup, nameAr: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-sudan-green transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "اسم الشركة (إنجليزي)" : "Company Name (English)"}</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Giad Logistics Group"
                          value={newSup.nameEn}
                          onChange={(e) => setNewSup({...newSup, nameEn: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-sudan-green transition-all text-left"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "السجل التجاري الفيدرالي" : "Commercial Reg."}</label>
                          <input 
                            type="text" 
                            required
                            placeholder="CR-XXXX"
                            value={newSup.commercialRegistration}
                            onChange={(e) => setNewSup({...newSup, commercialRegistration: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "الرقم الضريبي الموحد" : "Tax ID"}</label>
                          <input 
                            type="text" 
                            placeholder="TAX-XXXX"
                            value={newSup.taxId}
                            onChange={(e) => setNewSup({...newSup, taxId: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "فئة التوريد" : "Supply Category"}</label>
                          <select
                            value={newSup.type}
                            onChange={(e) => {
                              const labels: any = { local: "مورد وطني محلي", comesa: "مورد إقليمي الكوميسا", foreign: "مورد أجنبي معتمد" };
                              setNewSup({...newSup, type: e.target.value, typeAr: labels[e.target.value]});
                            }}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                          >
                            <option value="local">{currentLanguage === "ar" ? "مورد وطني محلي" : "Local Supplier"}</option>
                            <option value="comesa">{currentLanguage === "ar" ? "إقليمي الكوميسا" : "COMESA Supplier"}</option>
                            <option value="foreign">{currentLanguage === "ar" ? "أجنبي معتمد" : "Foreign Approved"}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "تقييم الكفاءة الفنية" : "Technical Rating"}</label>
                          <select
                            value={newSup.technicalEval}
                            onChange={(e) => setNewSup({...newSup, technicalEval: e.target.value})}
                            className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                          >
                            <option value="95% (Elite Category)">95% (Elite Category)</option>
                            <option value="90% (SSMO Certified)">90% (SSMO Certified)</option>
                            <option value="80% (Certified Capability)">80% (Certified Capability)</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "اعتماد وتسجيل المورد بالوزارة" : "Authorize & Register Vendor"}
                      </button>
                    </form>
                  </div>

                  {/* Vendors Registry Table */}
                  <div className="space-y-4 lg:col-span-2">
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "بوابة الموردين والشركات الوطنية المعتمدة" : "Sovereign Supplier Registry"}</h3>
                        <div className="text-[10px] font-bold text-sudan-green bg-sudan-green/10 px-2.5 py-1 rounded-full">
                          {suppliers.length} {currentLanguage === "ar" ? "موردين" : "vendors"}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {filteredSuppliers.map((sup, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-gray-150 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center hover:border-sudan-green transition-colors">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-black text-sudan-green bg-white px-2 py-0.5 rounded border border-gray-200">{sup.nationalId}</span>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  sup.type === "local" ? "bg-blue-50 text-blue-600" : sup.type === "comesa" ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"
                                }`}>
                                  {currentLanguage === "ar" ? sup.typeAr : sup.type}
                                </span>
                              </div>
                              <h4 className="font-extrabold text-sm text-slate-800 mt-2">{currentLanguage === "ar" ? sup.nameAr : sup.nameEn}</h4>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-400 mt-1 font-semibold">
                                <span>{currentLanguage === "ar" ? "سجل تجاري:" : "CR:"} {sup.commercialRegistration}</span>
                                <span>{currentLanguage === "ar" ? "تقييم الكفاءة:" : "Capacity:"} <strong className="text-slate-600">{sup.technicalEval}</strong></span>
                              </div>
                            </div>
                            <div className="text-left font-mono sm:border-r sm:border-gray-200 sm:pr-4">
                              <p className="text-[9px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "مؤشر الأداء المجمع" : "Performance Score"}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-sudan-green h-full" style={{ width: `${sup.performanceScore}%` }}></div>
                                </div>
                                <span className="text-xs font-black text-slate-700">{sup.performanceScore}%</span>
                              </div>
                              <span className="text-[9px] font-bold text-sudan-green block mt-1">✓ {currentLanguage === "ar" ? "مستندات مستوفاة" : "Compliance Clear"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTRACTS & PURCHASE ORDERS */}
            {activeTab === "contracts" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sovereign Contracts Tracker */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-sudan-green" />
                      <span>{currentLanguage === "ar" ? "عقود التوريد والاتفاقيات الفيدرالية المبرمة" : "Sovereign Sourcing Contracts"}</span>
                    </h3>
                    
                    <div className="space-y-4">
                      {contracts.map((c, idx) => (
                        <div key={idx} className="border border-gray-150 p-4 rounded-2xl bg-slate-50 space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="font-mono text-xs font-bold text-sudan-gold bg-white border border-gray-200 px-2 py-0.5 rounded">{c.contractCode}</span>
                              <h4 className="font-extrabold text-xs text-slate-800 mt-2">{currentLanguage === "ar" ? c.titleAr : c.titleEn}</h4>
                              <p className="text-[10px] text-gray-400 font-bold mt-1">
                                {currentLanguage === "ar" ? "الطرف الثاني:" : "Supplier:"} <strong className="text-slate-600">{c.supplierName}</strong>
                              </p>
                            </div>
                            <div className="text-left font-mono">
                              <span className="text-[9px] bg-sudan-green/10 text-sudan-green border border-sudan-green/20 font-bold px-2 py-0.5 rounded-full">
                                {currentLanguage === "ar" ? "ساري الصلاحية" : "Active"}
                              </span>
                              <p className="text-xs font-black text-slate-700 mt-2">{(c.totalValue).toLocaleString()} ج.س</p>
                            </div>
                          </div>

                          {/* Milestones Tracker */}
                          <div className="pt-2 border-t border-gray-200 space-y-2">
                            <h5 className="text-[10px] font-bold text-gray-400 uppercase">{currentLanguage === "ar" ? "مراحل التنفيذ والدفعات التعاقدية" : "Contract Execution Milestones"}</h5>
                            <div className="grid grid-cols-3 gap-2">
                              {c.milestones.map((m: any, mIdx: number) => (
                                <div key={mIdx} className="p-2 bg-white rounded-lg border border-gray-200 text-[10px] space-y-1">
                                  <p className="font-extrabold text-slate-700 truncate">{m.title}</p>
                                  <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                                    <span>{m.weight}%</span>
                                    <span className="text-amber-600 font-bold">{currentLanguage === "ar" ? "تحت التدقيق" : "Pending"}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Guarantee Info */}
                          <div className="flex items-center justify-between text-[9px] bg-amber-50 border border-amber-100 p-2 rounded-xl text-amber-800 font-semibold">
                            <span>🛡️ {currentLanguage === "ar" ? "ضمان حسن التنفيذ بنكي:" : "Performance Bond:"} {(c.performanceGuarantee.amount).toLocaleString()} ج.س</span>
                            <span>{c.performanceGuarantee.bank} ({currentLanguage === "ar" ? "ساري" : "Active"})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sourcing Purchase Orders (POs) */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span>{currentLanguage === "ar" ? "أوامر الشراء الفيدرالية المعتمدة (PO)" : "Sovereign Purchase Orders (POs)"}</span>
                    </h3>

                    <div className="space-y-4">
                      {purchaseOrders.map((po, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-gray-150 space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-blue-600 bg-white border border-gray-250 px-2 py-0.5 rounded">{po.poCode}</span>
                                <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[9px] font-bold px-2 py-0.5 rounded-full">{currentLanguage === "ar" ? "معتمد للصرف" : "Authorized"}</span>
                              </div>
                              <h4 className="font-extrabold text-xs text-slate-800 mt-2">{currentLanguage === "ar" ? po.itemAr : po.itemEn}</h4>
                              <p className="text-[10px] text-gray-400 font-bold mt-1">
                                {currentLanguage === "ar" ? "المستلم المعتمد:" : "Vendor:"} <strong className="text-slate-600">{po.supplierName}</strong>
                              </p>
                            </div>
                            <div className="text-left font-mono">
                              <p className="text-[10px] text-gray-400 font-bold">{currentLanguage === "ar" ? "إجمالي المبلغ" : "Total Amount"}</p>
                              <p className="text-sm font-black text-slate-700">{(po.totalAmount).toLocaleString()} SDG</p>
                            </div>
                          </div>

                          <div className="flex justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-200 font-semibold">
                            <span>{currentLanguage === "ar" ? "تاريخ الإصدار:" : "Issued:"} {po.createdAt}</span>
                            <span>{currentLanguage === "ar" ? "تاريخ التوصيل المبرمج:" : "Delivery Plan:"} {po.deliveryDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BLOCKCHAIN AUDIT LOGS */}
            {activeTab === "logs" && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-800">{currentLanguage === "ar" ? "سجل التدقيق الرقمي ومطابقة عقود التوريد" : "Sovereign Audit Ledger & Blockchain Signatures"}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{currentLanguage === "ar" ? "سلسلة البصمات الإلكترونية المشفرة لجميع حركات الشراء السيادي" : "Immutable cryptographic log of federal procurement modifications."}</p>
                  </div>
                  <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Scale className="h-3.5 w-3.5" />
                    <span>{currentLanguage === "ar" ? "مؤمن ضد التلاعب" : "Anti-Tamper Active"}</span>
                  </span>
                </div>

                <div className="space-y-3.5 pt-2">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-gray-150 space-y-2 hover:border-sudan-green transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-200 text-gray-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded">{log.id}</span>
                          <span className="text-slate-800 font-bold">{currentLanguage === "ar" ? log.actor : log.actor}</span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-400">{log.timestamp}</span>
                      </div>
                      <p className="font-extrabold text-xs text-slate-700">
                        {currentLanguage === "ar" ? log.actionAr : log.actionEn}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {log.details}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono bg-white border border-gray-200 p-1.5 rounded-lg text-gray-400 overflow-x-auto">
                        <span className="text-sudan-green font-bold">SHA-256 HASH:</span>
                        <span>{log.hash}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: AI ADVISOR */}
            {activeTab === "ai-advisor" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Configuration Panel */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 h-fit">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-sudan-gold" />
                    <span>{currentLanguage === "ar" ? "ذكاء المشتريات التنبئي" : "AI Procurement Advisor"}</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    {currentLanguage === "ar" ? "تحليل المعاملات الشرائية لكشف التواطؤ، احتكار الأسواق، وحساب تسعير SSMO العادل." : "Autonomous modeling for bid rigging detection, sourcing optimizations and market fair valuation."}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "سيناريو التحليل الاستباقي" : "Select Sourcing Scenario"}</label>
                      <select
                        value={aiScenario}
                        onChange={(e) => setAiScenario(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-sudan-green"
                      >
                        <option value="detect_collusion">{currentLanguage === "ar" ? "كشف التواطؤ وتواطؤ العطاءات المشبوهة" : "Bid-Rigging & Collusion Detection"}</option>
                        <option value="strategy_recommendation">{currentLanguage === "ar" ? "استراتيجيات تحسين سلاسل الإمداد والتكلفة" : "Sourcing Optimization Strategy"}</option>
                        <option value="general_intelligence">{currentLanguage === "ar" ? "تقرير ذكاء المشتريات العام" : "General Procurement Intelligence"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "سؤال إضافي مخصص" : "Additional Specific Prompt"}</label>
                      <textarea
                        rows={3}
                        placeholder={currentLanguage === "ar" ? "اكتب سؤالك بخصوص عروض التوريد الحالية..." : "Ask the AI about current tender proposals..."}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-sudan-green resize-none"
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
                          <span>{currentLanguage === "ar" ? "جاري تشكيل التقرير..." : "Formulating Report..."}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-sudan-gold" />
                          <span>{currentLanguage === "ar" ? "توليد التقرير الاستشاري" : "Generate Sourcing Intelligence"}</span>
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
                        <h4 className="font-extrabold text-sm text-sudan-gold">{currentLanguage === "ar" ? "محرك تقارير الذكاء الاصطناعي السيادي" : "Sovereign AI Sourcing Engine"}</h4>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold px-2 py-0.5 rounded">
                        ONLINE - LLM AGENT
                      </span>
                    </div>

                    {aiResponse ? (
                      <div className="text-xs leading-relaxed space-y-4 whitespace-pre-line text-slate-200">
                        {aiResponse}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-2">
                        <Sparkles className="h-8 w-8 text-slate-700 animate-pulse" />
                        <p className="text-xs">{currentLanguage === "ar" ? "اضغط على زر التوليد لتشغيل محرك التحليل والمطابقة التنبؤية." : "Trigger the generation to run autonomous risk & strategy modeling."}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-500 flex justify-between items-center">
                    <span>{currentLanguage === "ar" ? "مدعوم بنظام معالجة اللغات الطبيعية لوزارة التجارة" : "Powered by SDMCI Natural Language Processing Core"}</span>
                    <span>SUDAN-AI-2026</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL: SUBMIT BID */}
      {selectedTenderForBid && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h4 className="font-extrabold text-sm text-slate-800">{currentLanguage === "ar" ? "تقديم عرض مالي وفني للمناقصة" : "Submit Competitor Bid Proposal"}</h4>
              <button 
                onClick={() => setSelectedTenderForBid(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-gray-150">
              <span className="text-[10px] text-sudan-gold font-mono font-bold block">{selectedTenderForBid.tenderCode}</span>
              <h5 className="font-extrabold text-xs text-slate-700">{currentLanguage === "ar" ? selectedTenderForBid.titleAr : selectedTenderForBid.titleEn}</h5>
              <p className="text-[10px] text-gray-400 mt-1">{currentLanguage === "ar" ? "القيمة التقديرية:" : "Est. Budget:"} {(selectedTenderForBid.budget).toLocaleString()} SDG</p>
            </div>

            <form onSubmit={handleRegisterBid} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "اختيار المورد / المزايد" : "Select Register Supplier"}</label>
                <select
                  required
                  value={newBid.supplierId}
                  onChange={(e) => setNewBid({...newBid, supplierId: e.target.value})}
                  className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none"
                >
                  <option value="">{currentLanguage === "ar" ? "-- اختر شركة التوريد --" : "-- Select Sourcing Supplier --"}</option>
                  {suppliers.map((s, idx) => (
                    <option key={idx} value={s.id}>{currentLanguage === "ar" ? s.nameAr : s.nameEn} ({s.nationalId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "القيمة المالية المعروضة (ج.س)" : "Proposed Financial Bid (SDG)"}</label>
                <input 
                  type="number" 
                  required
                  placeholder="مثال: 5400000"
                  value={newBid.amount}
                  onChange={(e) => setNewBid({...newBid, amount: e.target.value})}
                  className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "التقييم الفني (%)" : "Initial Tech %"}</label>
                  <input 
                    type="number" 
                    max="100"
                    required
                    value={newBid.technicalScore}
                    onChange={(e) => setNewBid({...newBid, technicalScore: e.target.value})}
                    className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "التقييم المالي (%)" : "Financial Score %"}</label>
                  <input 
                    type="number" 
                    max="100"
                    required
                    value={newBid.financialScore}
                    onChange={(e) => setNewBid({...newBid, financialScore: e.target.value})}
                    className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">{currentLanguage === "ar" ? "ملاحظات إضافية بخصوص العرض" : "Additional Proposal Details"}</label>
                <textarea 
                  rows={2}
                  placeholder="تفاصيل التوريد أو الكفالة البنكية..."
                  value={newBid.notes}
                  onChange={(e) => setNewBid({...newBid, notes: e.target.value})}
                  className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs outline-none resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
              >
                {currentLanguage === "ar" ? "إمضاء وتشفير وإيداع العرض" : "Sign, Encrypt & Deposit Proposal"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
