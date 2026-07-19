import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, ShoppingBag, Award, Cpu, Bot, ShieldCheck, 
  Workflow, BarChart3, Globe2, Lightbulb, Search, RefreshCw, 
  Plus, CheckCircle, AlertTriangle, Clock, ArrowRight, 
  QrCode, FileText, Send, HelpCircle, TrendingUp, HelpCircle as QuestionIcon, Sparkles, UserCheck, CheckSquare, Coins, UserCircle, Download, FileSignature, BrainCircuit
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell 
} from "recharts";

interface SovereignDigitalEconomyPlatformProps {
  currentLanguage: "ar" | "en";
}

export default function SovereignDigitalEconomyPlatform({ currentLanguage }: SovereignDigitalEconomyPlatformProps) {
  // Navigation Tabs for 10 Modules
  const [activeModuleTab, setActiveModuleTab] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Search Engine states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Modules State loaded from Backend API
  const [identities, setIdentities] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [startups, setStartups] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [marketplace, setMarketplace] = useState<any[]>([]);
  const [observatory, setObservatory] = useState<any>({
    digitalizationIndex: 94.2,
    ecommerceAdoption: 85.6,
    startupCount: 145,
    totalTransactionsVolume: 1248000,
    growthForecast: "12.4%",
    digitalReadinessScore: 92.5,
    innovationScore: 89.1,
    smeDigitalizationScore: 88.4
  });

  // AI Advisor States
  const [advisorPrompt, setAdvisorPrompt] = useState("");
  const [advisorType, setAdvisorType] = useState("general");
  const [advisorResult, setAdvisorResult] = useState("");
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // Forms State
  const [newIdentityForm, setNewIdentityForm] = useState({ companyNameAr: "", companyNameEn: "", crNumber: "", email: "" });
  const [newStoreForm, setNewStoreForm] = useState({ storeName: "", platform: "NileShop Platform", sellerName: "", licenseNo: "", url: "" });
  const [newLicenseForm, setNewLicenseForm] = useState({ companyName: "", licenseType: "Industrial Production License" });
  const [newStartupForm, setNewStartupForm] = useState({ startupName: "", founder: "", sector: "AgriTech", projectTitle: "", fundingTarget: "50000" });
  const [newTxnForm, setNewTxnForm] = useState({ buyer: "", seller: "", amount: "", currency: "SDG" });

  // Notifications List
  const [notifications, setNotifications] = useState<string[]>([
    "Sovereign Trust PKI Issued SHA-256 stamp for Nile Co.",
    "WAF Shield mitigated 14 port-scans from non-mTLS nodes.",
    "Central Bank unified escrow cleared regional payments value $45k."
  ]);

  // Load Data from Backend
  const loadAllData = async () => {
    setLoading(true);
    try {
      const idRes = await fetch("/api/digital-economy/identities").then(r => r.json());
      if (idRes.success) setIdentities(idRes.identities);

      const storeRes = await fetch("/api/digital-economy/ecommerce").then(r => r.json());
      if (storeRes.success) setStores(storeRes.stores);

      const licRes = await fetch("/api/digital-economy/licensing").then(r => r.json());
      if (licRes.success) setLicenses(licRes.licenses);

      const stRes = await fetch("/api/digital-economy/entrepreneurship").then(r => r.json());
      if (stRes.success) setStartups(stRes.startups);

      const txRes = await fetch("/api/digital-economy/transactions").then(r => r.json());
      if (txRes.success) setTransactions(txRes.transactions);

      const mktRes = await fetch("/api/digital-economy/marketplace").then(r => r.json());
      if (mktRes.success) setMarketplace(mktRes.marketplace);

      const obsRes = await fetch("/api/digital-economy/observatory").then(r => r.json());
      if (obsRes.success) setObservatory(obsRes.observatory);
    } catch (e) {
      console.error("Error loading Phase 19 backend data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Search execution
  const executeSearch = () => {
    let results: any[] = [];
    const query = searchQuery.toLowerCase();

    if (!query) {
      setSearchResults([]);
      return;
    }

    if (searchCategory === "all" || searchCategory === "identities") {
      identities.forEach(id => {
        if (id.companyNameAr.toLowerCase().includes(query) || id.companyNameEn.toLowerCase().includes(query) || id.crNumber.includes(query)) {
          results.push({ type: currentLanguage === "ar" ? "هوية رقمية" : "Identity", title: id.companyNameAr, info: `CR: ${id.crNumber} | Status: ${id.status}`, icon: Building2 });
        }
      });
    }

    if (searchCategory === "all" || searchCategory === "licenses") {
      licenses.forEach(lic => {
        if (lic.companyName.toLowerCase().includes(query) || lic.licenseType.toLowerCase().includes(query)) {
          results.push({ type: currentLanguage === "ar" ? "رخصة إلكترونية" : "License", title: lic.companyName, info: `${lic.licenseType} | Expiry: ${lic.expiryDate}`, icon: Award });
        }
      });
    }

    if (searchCategory === "all" || searchCategory === "startups") {
      startups.forEach(st => {
        if (st.startupName.toLowerCase().includes(query) || st.founder.toLowerCase().includes(query) || st.sector.toLowerCase().includes(query)) {
          results.push({ type: currentLanguage === "ar" ? "مشروع ناشئ" : "Startup", title: st.startupName, info: `${st.founder} (${st.sector}) | Target: $${st.fundingTarget}`, icon: Lightbulb });
        }
      });
    }

    if (searchCategory === "all" || searchCategory === "transactions") {
      transactions.forEach(tx => {
        if (tx.buyer.toLowerCase().includes(query) || tx.seller.toLowerCase().includes(query) || tx.id.toLowerCase().includes(query)) {
          results.push({ type: currentLanguage === "ar" ? "عملية مالية موثوقة" : "Transaction", title: `${tx.buyer} -> ${tx.seller}`, info: `Amount: ${tx.amount} ${tx.currency} | Risk: ${tx.fraudRisk}`, icon: ShieldCheck });
        }
      });
    }

    setSearchResults(results);
  };

  useEffect(() => {
    executeSearch();
  }, [searchQuery, searchCategory, identities, licenses, startups, transactions]);

  // AI Advisor query
  const queryAIAdvisor = async () => {
    if (!advisorPrompt) return;
    setAdvisorLoading(true);
    try {
      const res = await fetch("/api/digital-economy/smart-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: advisorPrompt, type: advisorType })
      }).then(r => r.json());
      if (res.success) {
        setAdvisorResult(res.result);
      }
    } catch (e) {
      console.error("AI query failed:", e);
    } finally {
      setAdvisorLoading(false);
    }
  };

  // Submit Identity
  const handleCreateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/digital-economy/identities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIdentityForm)
      }).then(r => r.json());
      if (res.success) {
        setIdentities(prev => [res.identity, ...prev]);
        setNewIdentityForm({ companyNameAr: "", companyNameEn: "", crNumber: "", email: "" });
        setNotifications(prev => [`New Federal Business ID verified: ${res.identity.companyNameAr}`, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Store
  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/digital-economy/ecommerce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStoreForm)
      }).then(r => r.json());
      if (res.success) {
        setStores(prev => [res.store, ...prev]);
        setNewStoreForm({ storeName: "", platform: "NileShop Platform", sellerName: "", licenseNo: "", url: "" });
        setNotifications(prev => [`E-Commerce platform registered: ${res.store.storeName}`, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit License
  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/digital-economy/licensing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLicenseForm)
      }).then(r => r.json());
      if (res.success) {
        setLicenses(prev => [res.license, ...prev]);
        setNewLicenseForm({ companyName: "", licenseType: "Industrial Production License" });
        setNotifications(prev => [`Instant electronic license generated for ${res.license.companyName}`, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Startup
  const handleCreateStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/digital-economy/entrepreneurship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStartupForm)
      }).then(r => r.json());
      if (res.success) {
        setStartups(prev => [res.startup, ...prev]);
        setNewStartupForm({ startupName: "", founder: "", sector: "AgriTech", projectTitle: "", fundingTarget: "50000" });
        setNotifications(prev => [`New startup incubated in national catalog: ${res.startup.startupName}`, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Transaction
  const handleCreateTxn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/digital-economy/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTxnForm)
      }).then(r => r.json());
      if (res.success) {
        setTransactions(prev => [res.transaction, ...prev]);
        setNewTxnForm({ buyer: "", seller: "", amount: "", currency: "SDG" });
        setNotifications(prev => [`Secured transaction registered, SHA-256 Sealed ID: ${res.transaction.id}`, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Simulated GraphQL Query execution
  const [gqlQuery, setGqlQuery] = useState(`query {
  observatory {
    digitalizationIndex
    ecommerceAdoption
    digitalReadinessScore
  }
}`);
  const [gqlResult, setGqlResult] = useState("");
  const executeGql = async () => {
    try {
      const res = await fetch("/api/digital-economy/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: gqlQuery })
      }).then(r => r.json());
      setGqlResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setGqlResult("GraphQL Error: " + e);
    }
  };

  // Modules List Data for Sidebar Tabs
  const modulesMenu = [
    { id: 1, labelAr: "الهوية الرقمية الموحدة للأعمال", labelEn: "Digital Business Identity", icon: Building2 },
    { id: 2, labelAr: "حوكمة التجارة الإلكترونية", labelEn: "E-Commerce Governance", icon: ShoppingBag },
    { id: 3, labelAr: "منصة التراخيص الفورية", labelEn: "Digital Business Licensing", icon: Award },
    { id: 4, labelAr: "منصة ريادة الأعمال والشركات الناشئة", labelEn: "Digital Entrepreneurship", icon: Lightbulb },
    { id: 5, labelAr: "مستشار الأعمال الذكي (AI)", labelEn: "Smart Business Services (AI)", icon: Bot },
    { id: 6, labelAr: "مركز موثوقية العمليات التجارية", labelEn: "Digital Transaction Trust", icon: ShieldCheck },
    { id: 7, labelAr: "النظام التجاري اللامركزي", labelEn: "Digital Market Ecosystem", icon: Workflow },
    { id: 8, labelAr: "مؤشرات تحليل الاقتصاد الرقمي", labelEn: "Digital Economy Analytics", icon: BarChart3 },
    { id: 9, labelAr: "المرصد الوطني للاقتصاد الرقمي", labelEn: "Digital Business Observatory", icon: Globe2 },
    { id: 10, labelAr: "مختبر تجارة المستقبل والتكنولوجيا", labelEn: "Future Digital Commerce Lab", icon: Cpu }
  ];

  return (
    <div className="space-y-6" id="digital-economy-master">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,122,51,0.2),transparent_60%)] pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-yellow-500" />
            <span>{currentLanguage === "ar" ? "رؤية السودان ٢٠٣٥ | المرحلة التاسعة عشر" : "Sudan Vision 2035 | Phase 19"}</span>
          </div>
          <h1 className="font-extrabold text-2xl md:text-3xl tracking-tight text-[#F8FAFC]" style={{ fontFamily: "var(--font-arabic)" }}>
            {currentLanguage === "ar" 
              ? "المنصة الوطنية للاقتصاد الرقمي والأعمال الذكية" 
              : "National Digital Economy & Smart Business Platform"}
          </h1>
          <p className="text-slate-400 text-xs font-semibold max-w-4xl leading-relaxed">
            {currentLanguage === "ar" 
              ? "بوابة حوكمة سيادية موحدة داعمة للهوية الرقمية، تراخيص الأعمال الفورية، حماية المستهلك، والعمليات التجارية اللامركزية المدعومة بالذكاء الاصطناعي."
              : "Sovereign unified governance gateway hosting trusted digital identity, instant licensing, e-commerce oversight, and AI-driven decentralized commercial frameworks."}
          </p>
        </div>
        <button 
          onClick={loadAllData} 
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white p-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {currentLanguage === "ar" ? "مزامنة البيانات" : "Sync Ledger"}
        </button>
      </div>

      {/* 2. Unified National Search Engine & Semantic AI */}
      <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" />
              {currentLanguage === "ar" ? "محرك البحث الوطني الشامل والذكاء الدلالي" : "Unified National Search Engine & Semantic AI"}
            </h3>
            <p className="text-xs text-gray-500">
              {currentLanguage === "ar" ? "ابحث بدلالة النصوص أو أرقام السجل والـ QR في كافة التراخيص والعمليات" : "Search by natural language, registry IDs, or QR identifier across the economic spectrum"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wide">
              {currentLanguage === "ar" ? "نظام مالي مشفر مفعل" : "Zero-Trust Search Active"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLanguage === "ar" ? "مثال: شركة النيل، رخصة الغذاء، Agribusiness..." : "Search e.g. Nile food, agricultural startup, transaction..."}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs md:text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-800"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
          </div>
          <div className="md:col-span-4">
            <select 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs md:text-sm focus:outline-none focus:border-emerald-500 text-slate-700 font-semibold"
            >
              <option value="all">{currentLanguage === "ar" ? "كل الفئات الاقتصادية" : "All Economic Sectors"}</option>
              <option value="identities">{currentLanguage === "ar" ? "الهويات الرقمية للشركات" : "Digital Business Identities"}</option>
              <option value="licenses">{currentLanguage === "ar" ? "التراخيص التجارية" : "Commercial Licenses"}</option>
              <option value="startups">{currentLanguage === "ar" ? "المشاريع الريادية والناشئة" : "Startups & Projects"}</option>
              <option value="transactions">{currentLanguage === "ar" ? "العمليات المالية المشفرة" : "Secured Transactions"}</option>
            </select>
          </div>
        </div>

        {/* Live Search Results */}
        {searchResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2 max-h-60 overflow-y-auto"
          >
            <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase block">
              {currentLanguage === "ar" ? "نتائج البحث السيادي المطابقة" : "Sovereign Matches Found"} ({searchResults.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.map((res, idx) => {
                const ResIcon = res.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="bg-emerald-50 p-2 rounded-lg">
                      <ResIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide block">{res.type}</span>
                      <h5 className="font-bold text-slate-800 text-xs truncate max-w-[200px]">{res.title}</h5>
                      <p className="text-[10px] text-slate-500 font-semibold">{res.info}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* 3. Main Dashboard & Workspace Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SIDE BAR NAVIGATION - 10 MODULES */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-4 shadow-xs space-y-1">
          <span className="text-[9px] font-bold tracking-wider text-slate-400 block px-3 py-1 uppercase border-b border-gray-100 mb-2">
            {currentLanguage === "ar" ? "أركان المنصة القومية" : "National Pillars"}
          </span>
          {modulesMenu.map((mod) => {
            const ModIcon = mod.icon;
            const isActive = activeModuleTab === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModuleTab(mod.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[11px] font-bold transition-all border cursor-pointer uppercase ${
                  isActive 
                    ? "bg-slate-900 text-[#FFD700] border-slate-900 font-extrabold shadow-sm" 
                    : "bg-white text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"
                }`}
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              >
                <ModIcon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-[#FFD700]" : "text-slate-400"}`} />
                <span className="truncate text-start">{currentLanguage === "ar" ? mod.labelAr : mod.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* INTERACTIVE WORKSPACE TABS OUTPUTS */}
        <div className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModuleTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm min-h-[500px]"
            >
              
              {/* ========================================================= */}
              {/* MODULE 1: NATIONAL DIGITAL BUSINESS IDENTITY */}
              {/* ========================================================= */}
              {activeModuleTab === 1 && (
                <div className="space-y-6" id="module-identity-details">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Building2 className="w-5.5 h-5.5 text-emerald-600 animate-pulse" />
                        {currentLanguage === "ar" ? "الهوية الرقمية الموحدة للمؤسسات والشركات" : "Unified Digital Business Identity System"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "بوابة إصدار وإثبات الهويات المشفرة وتصدير التواقيع الرقمية للشركات" : "Issuance, validation and verification of cryptographic enterprise identities and trust seals"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 rounded-full">
                      Module 1
                    </span>
                  </div>

                  {/* Company Profile & Wallet Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form onSubmit={handleCreateIdentity} className="bg-slate-50 border border-gray-200 p-5 rounded-2xl space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "تأصيل هوية تجارية مشفرة جديدة" : "Provision Cryptographic Identity Wallet"}
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "اسم الشركة باللغة العربية" : "Company Name (Arabic)"}</label>
                          <input 
                            type="text" 
                            required
                            value={newIdentityForm.companyNameAr}
                            onChange={(e) => setNewIdentityForm({...newIdentityForm, companyNameAr: e.target.value})}
                            placeholder="شركة صادر النيل المحدودة"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "اسم الشركة بالإنجليزية" : "Company Name (English)"}</label>
                          <input 
                            type="text" 
                            value={newIdentityForm.companyNameEn}
                            onChange={(e) => setNewIdentityForm({...newIdentityForm, companyNameEn: e.target.value})}
                            placeholder="Nile Exports Co. Ltd"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "رقم السجل التجاري" : "CR Number"}</label>
                            <input 
                              type="text" 
                              required
                              value={newIdentityForm.crNumber}
                              onChange={(e) => setNewIdentityForm({...newIdentityForm, crNumber: e.target.value})}
                              placeholder="SD-2026-X11"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "البريد الإلكتروني التجاري" : "Corporate Email"}</label>
                            <input 
                              type="email" 
                              required
                              value={newIdentityForm.email}
                              onChange={(e) => setNewIdentityForm({...newIdentityForm, email: e.target.value})}
                              placeholder="info@nile.sd"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        {currentLanguage === "ar" ? "إصدار وتوقيع الهوية ميكانيكياً" : "Issue & Sign Business ID"}
                      </button>
                    </form>

                    {/* QR Business Identity & Identity Cards */}
                    <div className="space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "محفظة الهوية التجارية الصادرة (Live Wallet)" : "Commercial Identity Live Wallet"}
                      </h5>
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {identities.map((id, index) => (
                          <div key={id.id} className="p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-2xl border border-slate-800 shadow-md relative">
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">{id.status}</span>
                            </div>
                            <div className="flex gap-4">
                              <div className="bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                                <QrCode className="w-12 h-12 text-slate-950" />
                              </div>
                              <div className="space-y-1">
                                <h6 className="font-extrabold text-xs tracking-tight">{currentLanguage === "ar" ? id.companyNameAr : id.companyNameEn}</h6>
                                <p className="text-[10px] text-slate-400 font-mono">ID: {id.id} | CR: {id.crNumber}</p>
                                <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded font-bold">{id.badge}</span>
                              </div>
                            </div>
                            <div className="border-t border-slate-800 mt-3 pt-2 grid grid-cols-2 gap-2 text-[9px] text-slate-400 font-mono">
                              <div>{currentLanguage === "ar" ? "مؤشر الامتثال:" : "Trust Index:"} <span className="text-emerald-400 font-bold">{id.score}%</span></div>
                              <div>{currentLanguage === "ar" ? "التواقيع مفعّلة" : "mTLS Active"}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 2: E-COMMERCE GOVERNANCE PLATFORM */}
              {/* ========================================================= */}
              {activeModuleTab === 2 && (
                <div className="space-y-6" id="module-ecommerce-governance">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <ShoppingBag className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "منصة حوكمة وتسجيل التجارة الإلكترونية" : "E-Commerce Governance & Online Registry"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "مكافحة الاحتيال وتوثيق المتاجر الإلكترونية وحماية المستهلك الوطني" : "Consumer trust certification, verification of online platforms, and merchant compliance catalog"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 rounded-full">
                      Module 2
                    </span>
                  </div>

                  {/* Register Store Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form onSubmit={handleCreateStore} className="bg-slate-50 border border-gray-200 p-5 rounded-2xl space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "تسجيل متجر إلكتروني جديد" : "Register E-Commerce Platform"}
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "اسم المتجر الإلكتروني" : "Store/Brand Name"}</label>
                          <input 
                            type="text" 
                            required
                            value={newStoreForm.storeName}
                            onChange={(e) => setNewStoreForm({...newStoreForm, storeName: e.target.value})}
                            placeholder="سودان مارت أو متجر الجزيرة"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "المنصة التكنولوجية المستضيفة" : "Hosting Tech Platform"}</label>
                          <select 
                            value={newStoreForm.platform}
                            onChange={(e) => setNewStoreForm({...newStoreForm, platform: e.target.value})}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-700"
                          >
                            <option value="NileShop Platform">NileShop Platform</option>
                            <option value="Sovereign Cloud Hub">Sovereign Cloud Hub</option>
                            <option value="Shopify Commerce">Shopify Commerce</option>
                            <option value="WooCommerce Custom">WooCommerce Custom</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "اسم التاجر المسؤول" : "Merchant Owner"}</label>
                            <input 
                              type="text" 
                              required
                              value={newStoreForm.sellerName}
                              onChange={(e) => setNewStoreForm({...newStoreForm, sellerName: e.target.value})}
                              placeholder="أحمد يسن"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "رخصة المتجر" : "Store License No"}</label>
                            <input 
                              type="text" 
                              value={newStoreForm.licenseNo}
                              onChange={(e) => setNewStoreForm({...newStoreForm, licenseNo: e.target.value})}
                              placeholder="EC-XXXX"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "رابط المتجر (URL)" : "Store Web Link"}</label>
                          <input 
                            type="url" 
                            value={newStoreForm.url}
                            onChange={(e) => setNewStoreForm({...newStoreForm, url: e.target.value})}
                            placeholder="https://mystore.sd"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        {currentLanguage === "ar" ? "تسجيل واعتماد المتجر الفيدرالي" : "Register & Certify Merchant Store"}
                      </button>
                    </form>

                    {/* Registered merchants catalog */}
                    <div className="space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "دليل المتاجر الإلكترونية المعتمدة" : "Sovereign Merchant Registry Catalog"}
                      </h5>
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {stores.map((st) => (
                          <div key={st.id} className="p-4 bg-white border border-gray-100 shadow-2xs rounded-2xl flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <h6 className="font-bold text-slate-800 text-xs">{st.storeName}</h6>
                              <p className="text-[10px] text-gray-500 font-semibold">{currentLanguage === "ar" ? "التاجر:" : "Seller:"} {st.sellerName} | Platform: {st.platform}</p>
                              <a href={st.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-600 font-mono hover:underline">{st.url}</a>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1 shrink-0">
                              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] px-2 py-0.5 rounded font-extrabold">{st.badge}</span>
                              <span className="text-[9px] text-gray-400 font-mono">Score: {st.complianceScore}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 3: DIGITAL BUSINESS LICENSING */}
              {/* ========================================================= */}
              {activeModuleTab === 3 && (
                <div className="space-y-6" id="module-business-licensing">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Award className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "منصة التراخيص الفورية والتجديد التلقائي" : "Instant Digital Business Licensing Hub"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "إصدار وتجديد التراخيص فوراً مع توقيع ومصادقة الـ QR المشترك" : "Issue instantly approved digital licenses, trigger automatic renewals, and manage amendments"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 rounded-full">
                      Module 3
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form onSubmit={handleCreateLicense} className="bg-slate-50 border border-gray-200 p-5 rounded-2xl space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "طلب ترخيص أعمال إلكتروني فوري" : "Instant Licensing Application Form"}
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "اسم الجهة المستفيدة" : "Enterprise / Applicant Name"}</label>
                          <input 
                            type="text" 
                            required
                            value={newLicenseForm.companyName}
                            onChange={(e) => setNewLicenseForm({...newLicenseForm, companyName: e.target.value})}
                            placeholder="شركة النيل للمنتجات الغذائية المحدودة"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "نوع الترخيص التجاري المطلق" : "License Sector Category"}</label>
                          <select 
                            value={newLicenseForm.licenseType}
                            onChange={(e) => setNewLicenseForm({...newLicenseForm, licenseType: e.target.value})}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-700 font-semibold"
                          >
                            <option value="Industrial Production License">Industrial Production License</option>
                            <option value="E-Commerce Merchant License">E-Commerce Merchant License</option>
                            <option value="Sovereign Import/Export Clearance Pass">Sovereign Import/Export Clearance Pass</option>
                            <option value="Agriculture Tech Processing Pass">Agriculture Tech Processing Pass</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        {currentLanguage === "ar" ? "تخليق وتوقيع الترخيص فورياً" : "Generate & Seal Instant License"}
                      </button>
                    </form>

                    {/* Active Licenses List */}
                    <div className="space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "سجل التراخيص الصادرة الصالحة" : "Active & Verified Licenses"}
                      </h5>
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {licenses.map((lic) => (
                          <div key={lic.id} className="p-4 bg-white border border-gray-100 shadow-2xs rounded-2xl relative">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase block">{lic.id}</span>
                                <h6 className="font-bold text-slate-800 text-xs">{lic.companyName}</h6>
                                <p className="text-[10px] text-gray-500 font-semibold">{lic.licenseType}</p>
                                <div className="text-[9px] text-gray-400 font-mono mt-1">
                                  {currentLanguage === "ar" ? "تاريخ الإصدار:" : "Issued:"} {lic.issueDate} | {currentLanguage === "ar" ? "الانتهاء:" : "Expiry:"} {lic.expiryDate}
                                </div>
                              </div>
                              <div className="bg-slate-50 p-1 rounded-lg shrink-0">
                                <QrCode className="w-10 h-10 text-slate-950" />
                              </div>
                            </div>
                            <div className="border-t border-gray-50 mt-3 pt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                              {lic.notification}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 4: DIGITAL ENTREPRENEURSHIP PLATFORM */}
              {/* ========================================================= */}
              {activeModuleTab === 4 && (
                <div className="space-y-6" id="module-entrepreneurship">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Lightbulb className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "منصة ريادة الأعمال وحواضن الشركات الناشئة" : "Digital Entrepreneurship & Incubation Hub"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "تسجيل المشاريع الابتكارية، ربط الموجهين وتتبع فرص التمويل الحكومي المشترك" : "Register tech startups, match sovereign mentors, and apply for government co-funding initiatives"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 rounded-full">
                      Module 4
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form onSubmit={handleCreateStartup} className="bg-slate-50 border border-gray-200 p-5 rounded-2xl space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "تسجيل شركة تكنولوجية ناشئة جديدة" : "Register Tech Startup / Project"}
                      </h5>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "اسم الشركة الناشئة" : "Startup Name"}</label>
                            <input 
                              type="text" 
                              required
                              value={newStartupForm.startupName}
                              onChange={(e) => setNewStartupForm({...newStartupForm, startupName: e.target.value})}
                              placeholder="حصاد للزراعة الذكية"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "اسم المؤسس الرئيسي" : "Founder Name"}</label>
                            <input 
                              type="text" 
                              required
                              value={newStartupForm.founder}
                              onChange={(e) => setNewStartupForm({...newStartupForm, founder: e.target.value})}
                              placeholder="مريم العبيد"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "قطاع التكنولوجيا والابتكار" : "Sector / Category"}</label>
                          <select 
                            value={newStartupForm.sector}
                            onChange={(e) => setNewStartupForm({...newStartupForm, sector: e.target.value})}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-700 font-semibold"
                          >
                            <option value="AgriTech">AgriTech (الزراعة الذكية)</option>
                            <option value="FinTech">FinTech (المدفوعات والتمويل)</option>
                            <option value="LogisticsTech">LogisticsTech (سلاسل الإمداد)</option>
                            <option value="EdTech">EdTech (التعليم الرقمي)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "عنوان المشروع الابتكاري الرئيسي" : "Innovation Project Title"}</label>
                          <input 
                            type="text" 
                            required
                            value={newStartupForm.projectTitle}
                            onChange={(e) => setNewStartupForm({...newStartupForm, projectTitle: e.target.value})}
                            placeholder="منصة استشعار رطوبة التربة عبر IoT"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "الهدف المالي للتمويل ($)" : "Funding Target ($)"}</label>
                          <input 
                            type="number" 
                            required
                            value={newStartupForm.fundingTarget}
                            onChange={(e) => setNewStartupForm({...newStartupForm, fundingTarget: e.target.value})}
                            placeholder="50000"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        {currentLanguage === "ar" ? "تسجيل واحتضان المشروع" : "Incubate Startup Project"}
                      </button>
                    </form>

                    {/* Incubated Startups Catalog */}
                    <div className="space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "حاضنة المشاريع الوطنية المستضيفة" : "Active Incubation Registry"}
                      </h5>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {startups.map((st) => (
                          <div key={st.id} className="p-4 bg-white border border-gray-100 shadow-2xs rounded-2xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-full">{st.status}</span>
                              <span className="text-[9px] font-mono text-gray-400">{st.sector}</span>
                            </div>
                            <h6 className="font-extrabold text-slate-800 text-xs">{st.startupName}</h6>
                            <p className="text-[10px] text-slate-600 font-semibold">{st.projectTitle}</p>
                            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-gray-500 border-t border-gray-50 pt-2 mt-1">
                              <div>Founder: <span className="font-bold text-slate-700">{st.founder}</span></div>
                              <div>Mentor: <span className="font-bold text-emerald-600">{st.mentor}</span></div>
                            </div>
                            {/* Funding progress */}
                            <div className="space-y-1 mt-2">
                              <div className="flex justify-between text-[8px] font-mono text-slate-400">
                                <span>Raised: ${st.fundingRaised}</span>
                                <span>Target: ${st.fundingTarget}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (st.fundingRaised / st.fundingTarget) * 100)}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 5: SMART BUSINESS SERVICES */}
              {/* ========================================================= */}
              {activeModuleTab === 5 && (
                <div className="space-y-6" id="module-smart-services">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Bot className="w-5.5 h-5.5 text-[#C5A059] animate-pulse" />
                        {currentLanguage === "ar" ? "مستشار الأعمال والتشريعات الذكي (AI)" : "Sovereign AI Business Advisor & Copilot"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "توليد خطط الأعمال الفورية، تقييم المخاطر، الالتزام التجاري والتحقق من القوانين تلقائياً" : "Generate regulatory compliant business plans, compile risk assessments, and verify custom legal directives"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 rounded-full">
                      Module 5
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-5 bg-slate-50 border border-gray-200 p-5 rounded-2xl space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "توجيه استفسار للذكاء الاصطناعي السيادي" : "Direct Sovereign AI Model Query"}
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "تصنيف الاستشارة" : "Consultation Category"}</label>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { id: "general", labelAr: "استشارة عامة", labelEn: "SME Advice" },
                              { id: "plan", labelAr: "مخطط عمل", labelEn: "Biz Plan" },
                              { id: "risk", labelAr: "تقييم المخاطر", labelEn: "Risk Assessment" }
                            ].map((tp) => (
                              <button
                                key={tp.id}
                                type="button"
                                onClick={() => setAdvisorType(tp.id)}
                                className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all ${
                                  advisorType === tp.id ? "bg-[#C5A059] text-white border-[#C5A059]" : "bg-white text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {currentLanguage === "ar" ? tp.labelAr : tp.labelEn}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "موضوع الاستفسار أو اسم المشروع" : "Business Pitch / Regulatory Question"}</label>
                          <textarea 
                            rows={4}
                            value={advisorPrompt}
                            onChange={(e) => setAdvisorPrompt(e.target.value)}
                            placeholder={currentLanguage === "ar" ? "مثال: خطة عمل لمصنع صمغ عربي متطور في سوبا الخرطوم..." : "E.g. Business plan for premium white sesame processing factory in Soba industrial area..."}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800 leading-relaxed"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={queryAIAdvisor}
                        disabled={advisorLoading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <BrainCircuit className="w-4 h-4 text-amber-400 animate-spin" />
                        {advisorLoading ? (currentLanguage === "ar" ? "جاري معالجة المعرفة السيادية..." : "Querying AI Models...") : (currentLanguage === "ar" ? "توليد الاستجابة بالذكاء الاصطناعي" : "Generate Smart Response")}
                      </button>
                    </div>

                    <div className="md:col-span-7 bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-xl relative min-h-[300px] flex flex-col justify-between">
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">Federal AI Core v3.5</span>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[9px] font-bold tracking-wider text-slate-400 block uppercase font-mono">
                          {currentLanguage === "ar" ? "المخرجات والتقارير التنفيذية للذكاء الاصطناعي" : "AI Copilot Response output"}
                        </span>
                        
                        <div className="text-xs leading-relaxed max-h-[300px] overflow-y-auto pr-1 space-y-2 whitespace-pre-wrap font-mono">
                          {advisorResult ? (
                            advisorResult
                          ) : (
                            <div className="text-center text-slate-500 py-12">
                              {currentLanguage === "ar" ? "أدخل استفسارك واضغط توليد للحصول على المخرجات الذكية المشفرة" : "Enter your business pitch or question to compile executive summaries and legal reports"}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-800 pt-3 mt-4 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                        <div>Business Health Score: <span className="text-emerald-400 font-bold">94/100 (Sovereign Verified)</span></div>
                        <div>mTLS Audited Logs</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 6: DIGITAL TRANSACTION TRUST CENTER */}
              {/* ========================================================= */}
              {activeModuleTab === 6 && (
                <div className="space-y-6" id="module-transaction-trust">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <ShieldCheck className="w-5.5 h-5.5 text-emerald-600 animate-pulse" />
                        {currentLanguage === "ar" ? "مركز حوكمة وموثوقية العمليات التجارية" : "Digital Transaction Trust Center"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "رصد تلقائي لعمليات الدفع والتسويات والتحقق من الاحتيال وتطبيق التواقيع الرقمية" : "Real-time auditing of trade transactions, secure fraud analysis and cryptographic evidence stamps"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 rounded-full">
                      Module 6
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form onSubmit={handleCreateTxn} className="bg-slate-50 border border-gray-200 p-5 rounded-2xl space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "تسجيل عملية تجارية آمنة جديدة" : "Log Secured Trade Transaction"}
                      </h5>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "الجهة المشترية (المستورد)" : "Buyer"}</label>
                            <input 
                              type="text" 
                              required
                              value={newTxnForm.buyer}
                              onChange={(e) => setNewTxnForm({...newTxnForm, buyer: e.target.value})}
                              placeholder="سودان مارت"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "الجهة البائعة (المصدر)" : "Seller"}</label>
                            <input 
                              type="text" 
                              required
                              value={newTxnForm.seller}
                              onChange={(e) => setNewTxnForm({...newTxnForm, seller: e.target.value})}
                              placeholder="شركة صادر النيل"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "القيمة المالية" : "Amount"}</label>
                            <input 
                              type="number" 
                              required
                              value={newTxnForm.amount}
                              onChange={(e) => setNewTxnForm({...newTxnForm, amount: e.target.value})}
                              placeholder="45000"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "العملة" : "Currency"}</label>
                            <select 
                              value={newTxnForm.currency}
                              onChange={(e) => setNewTxnForm({...newTxnForm, currency: e.target.value})}
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-700"
                            >
                              <option value="SDG">SDG (جنيه سوداني)</option>
                              <option value="USD">USD (دولار أمريكي)</option>
                              <option value="EUR">EUR (يورو)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        {currentLanguage === "ar" ? "ختم وتعميد العملية مشفراً" : "Hash & Stamp Transaction Record"}
                      </button>
                    </form>

                    {/* Transaction Audit Ledger */}
                    <div className="space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "سجل العمليات الموثوقة والتحقق من الاحتيال" : "Cryptographic Evidence Trust Logs"}
                      </h5>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="p-4 bg-white border border-gray-100 shadow-2xs rounded-2xl relative font-mono text-xs">
                            <div className="absolute top-3 right-3 flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${tx.fraudRisk === "Low" ? "bg-emerald-500" : "bg-amber-500"}`} />
                              <span className="text-[8px] font-bold text-gray-400">Risk: {tx.fraudRisk}</span>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">{tx.id}</span>
                            <div className="space-y-1">
                              <div className="font-bold text-slate-800">{tx.buyer} ➜ {tx.seller}</div>
                              <div className="text-sm font-bold text-emerald-600 font-mono">{tx.amount.toLocaleString()} {tx.currency}</div>
                              <p className="text-[9px] text-gray-400 truncate mt-1">Stamp: {tx.signature}</p>
                            </div>
                            <div className="border-t border-gray-50 mt-2 pt-2 flex justify-between text-[8px] text-gray-400">
                              <span>Time: {new Date(tx.timestamp).toLocaleTimeString()}</span>
                              <span className="text-emerald-600 font-bold">mTLS Handshake verified</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 7: DIGITAL MARKET ECOSYSTEM */}
              {/* ========================================================= */}
              {activeModuleTab === 7 && (
                <div className="space-y-6" id="module-marketplace-ecosystem">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Workflow className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "منظومة السوق الرقمي الفيدرالي الموحد" : "Unified Digital Market Ecosystem"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "منصة تواصل وإبرام العقود اللامركزية للمستشارين ومقدمي الخدمات وسلاسل الإمداد" : "Integrated catalog of digital services, logistics partners, and freelance legal agreements"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 rounded-full">
                      Module 7
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-gray-200 p-5 rounded-2xl space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "إبرام عقد تجاري سيادي فوري" : "Generate SHA-256 Stamp Contract"}
                      </h5>
                      <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                        <p>
                          {currentLanguage === "ar" 
                            ? "يقوم النظام بربط مبيعات المتاجر، تطلعات التراخيص وتواقيع الهوية ميكانيكياً لضمان سلامة التعاملات وتوطيد العقود الذكية."
                            : "Integrate merchant transactions, active licenses, and digital identity signatures automatically under legal sovereignty codes."}
                        </p>
                        <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                          <div className="font-mono text-[10px]">
                            <strong>SHA-256 Master Agreement Stamp:</strong><br />
                            <span className="text-emerald-600 font-bold">Active and Enforced</span>
                          </div>
                          <div className="font-mono text-[10px]">
                            <strong>COMESA Regional Pass:</strong><br />
                            <span className="text-blue-600 font-bold font-mono">Verified for border transit</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "مقدمي الخدمات اللوجستية والشركاء المعتمدين" : "Verified Sovereign Logistics & Service Providers"}
                      </h5>
                      <div className="space-y-3">
                        {marketplace.map((mkt) => (
                          <div key={mkt.id} className="p-4 bg-white border border-gray-100 shadow-2xs rounded-2xl space-y-2">
                            <div className="flex justify-between items-center">
                              <h6 className="font-extrabold text-slate-800 text-xs">{mkt.name}</h6>
                              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] px-2 py-0.5 rounded font-extrabold">{mkt.complianceBadge}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-semibold">{mkt.services}</p>
                            <div className="flex justify-between items-center border-t border-gray-50 pt-2 text-[9px] font-mono text-gray-400">
                              <span>Fee structure: {mkt.rate}</span>
                              <span className="text-emerald-600 font-bold">{mkt.contract}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 8: DIGITAL ECONOMY ANALYTICS */}
              {/* ========================================================= */}
              {activeModuleTab === 8 && (
                <div className="space-y-6" id="module-economy-analytics">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <BarChart3 className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "مركز تحليلات ومؤشرات الاقتصاد الرقمي" : "Sovereign Digital Economy Analytics Center"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "رصد تطلعات الناتج القومي، وتيرة حوسبة الـ SMEs ومستقبل التجارة الإلكترونية بالذكاء الاصطناعي" : "Dynamic analytics of national GDP trends, SME digitization index and AI economy forecasting"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 rounded-full">
                      Module 8
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-3">
                        {currentLanguage === "ar" ? "وتيرة تطور الاقتصاد الرقمي (٢٠٢٦)" : "Digital Economy Volume Growth Trend"}
                      </h5>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            { month: "Jan", volume: 1100 },
                            { month: "Feb", volume: 1400 },
                            { month: "Mar", volume: 1600 },
                            { month: "Apr", volume: 1900 },
                            { month: "May", volume: 2400 },
                            { month: "Jun", volume: 3100 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                            <YAxis stroke="#9ca3af" fontSize={10} />
                            <Tooltip />
                            <Area type="monotone" dataKey="volume" stroke="#007A33" fill="#b1e0c0" fillOpacity={0.4} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-3">
                        {currentLanguage === "ar" ? "توزيع قطاعات التجارة الإلكترونية" : "E-Commerce Market Share Distribution"}
                      </h5>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { sector: "Retail", count: 42 },
                            { sector: "Agri", count: 88 },
                            { sector: "Industry", count: 65 },
                            { sector: "Service", count: 24 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="sector" stroke="#9ca3af" fontSize={10} />
                            <YAxis stroke="#9ca3af" fontSize={10} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#C5A059" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 9: NATIONAL DIGITAL BUSINESS OBSERVATORY */}
              {/* ========================================================= */}
              {activeModuleTab === 9 && (
                <div className="space-y-6" id="module-business-observatory">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Globe2 className="w-5.5 h-5.5 text-emerald-600 animate-spin" />
                        {currentLanguage === "ar" ? "المرصد الوطني للأعمال الرقمية ورقمنة الـ SMEs" : "National Digital Business Observatory"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "مؤشرات حية لمعدلات الجاهزية الرقمية، الرقمنة الشاملة والتحول الفيدرالي الفعال" : "Live indicators tracking national digitalization speed, digital readiness scores and regional enterprise health"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 rounded-full">
                      Module 9
                    </span>
                  </div>

                  {/* KPIs Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{currentLanguage === "ar" ? "مؤشر الرقمنة" : "Digital Index"}</span>
                      <span className="text-2xl font-black font-mono text-emerald-600 block mt-1">{observatory.digitalizationIndex}%</span>
                      <p className="text-[9px] text-gray-500 mt-1">Zero Paper Target 100%</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{currentLanguage === "ar" ? "تبني التجارة الإلكترونية" : "E-Commerce Adoption"}</span>
                      <span className="text-2xl font-black font-mono text-[#C5A059] block mt-1">{observatory.ecommerceAdoption}%</span>
                      <p className="text-[9px] text-gray-500 mt-1">SME direct merchant links</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{currentLanguage === "ar" ? "الجاهزية الرقمية" : "Digital Readiness"}</span>
                      <span className="text-2xl font-black font-mono text-blue-600 block mt-1">{observatory.digitalReadinessScore}%</span>
                      <p className="text-[9px] text-gray-500 mt-1">Cloud hosting metrics</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{currentLanguage === "ar" ? "المشاريع المحتضنة" : "Incubated Tech"}</span>
                      <span className="text-2xl font-black font-mono text-purple-600 block mt-1">{observatory.startupsCount}</span>
                      <p className="text-[9px] text-gray-500 mt-1">AgriTech & FinTech focus</p>
                    </div>
                  </div>

                  {/* Interactive GraphQL Integration Panel */}
                  <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <FileSignature className="w-5 h-5 text-amber-500" />
                      <div>
                        <h5 className="font-mono text-xs font-bold text-gray-300">SOVEREIGN GRAPHQL API CONSOLE</h5>
                        <p className="text-[10px] text-emerald-500 block font-mono">DIRECT QUERY ACCESS TO THE DIGITAL OBSERVATORY</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-6 space-y-2">
                        <label className="text-[9px] font-bold font-mono text-slate-400 uppercase block">GraphQL Query Editor</label>
                        <textarea 
                          rows={6}
                          value={gqlQuery}
                          onChange={(e) => setGqlQuery(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 text-emerald-400 font-mono focus:outline-none focus:border-amber-500 leading-relaxed border border-slate-800"
                        />
                        <button 
                          onClick={executeGql}
                          className="w-full bg-[#C5A059] hover:bg-[#AA8648] text-slate-950 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                        >
                          <Send className="w-4 h-4" />
                          Execute Query
                        </button>
                      </div>

                      <div className="md:col-span-6 space-y-2">
                        <label className="text-[9px] font-bold font-mono text-slate-400 uppercase block">Execution Result (JSON Output)</label>
                        <div className="w-full h-36 p-3 bg-slate-950 rounded-xl text-xs font-mono overflow-y-auto border border-slate-800 text-emerald-300 whitespace-pre-wrap leading-relaxed">
                          {gqlResult ? gqlResult : "{\n  \"message\": \"Execute a GraphQL query to fetch real-time observatory records\"\n}"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 10: FUTURE DIGITAL COMMERCE LAB */}
              {/* ========================================================= */}
              {activeModuleTab === 10 && (
                <div className="space-y-6" id="module-future-lab">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Cpu className="w-5.5 h-5.5 text-emerald-600 animate-spin" />
                        {currentLanguage === "ar" ? "مختبر تجارة المستقبل وبيئة التجريب الرقمية (Sandbox)" : "Future Digital Commerce Lab & Technology Sandbox"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "اختبار بيئات العقود الذكية، وتجربة المبيعات عبر الحدود ومحاكاة التقنيات الصاعدة" : "Simulate blockchain smart contracts, cross-border commerce protocols, and prototype emerging business models"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 rounded-full">
                      Module 10
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "التكنولوجيا الناشئة تحت التجريب" : "Technology Sandbox Status"}
                      </h5>
                      <div className="space-y-2 text-xs leading-relaxed">
                        <div className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="font-bold block text-slate-800">Smart Contract Auto-taxation</span>
                            <span className="text-[10px] text-gray-400">Drizzle-ORM backed state validation</span>
                          </div>
                          <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-full">Active</span>
                        </div>
                        <div className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="font-bold block text-slate-800">Cross-Border COMESA Passports</span>
                            <span className="text-[10px] text-gray-400">Sovereign identity single-sign-on</span>
                          </div>
                          <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-full">Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                          {currentLanguage === "ar" ? "محاكاة معالجة المدفوعات السيادية" : "Sovereign Payment Processing Simulator"}
                        </h5>
                        <p className="text-xs text-slate-500">
                          {currentLanguage === "ar" 
                            ? "تحاكي هذه النافذة تعميد الدفوعات وتمريرها آلياً عبر حسابات البنك المركزي لضمان تسوية المعاملات المشفرة في أجزاء من الثانية."
                            : "Simulates millisecond cryptographic processing of global business trades over secure channels."}
                        </p>
                      </div>
                      <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] border border-slate-800">
                        <code>[System Ready] : Sandbox Node #18 online</code><br />
                        <code>[Ready to receive payload...]</code>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Live Audit Logs and Notifications */}
      <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div>
            <h4 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              {currentLanguage === "ar" ? "مركز الإشعارات والتحقق والتدقيق السيادي" : "Unified Audit Log & Sovereign Alert Center"}
            </h4>
            <p className="text-xs text-slate-400">
              {currentLanguage === "ar" ? "سجل حي للعمليات الرقمية والإنذارات المكتشفة تلقائياً في البوابة" : "Audit trails compiled across the decentralized economic pillars in real time"}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {currentLanguage === "ar" ? "تحديث مباشر" : "Live Feed"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{currentLanguage === "ar" ? "التنبيهات والإنذارات السيبرانية" : "Real-time Cybersecurity Warnings"}</span>
            <div className="space-y-2 font-mono text-[11px] leading-relaxed">
              <div className="flex gap-2 items-start text-slate-600">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>mTLS strict handshake enforces SHA-256 validation across nodes. Awaiting 1 deprecated connection upgrade.</span>
              </div>
              <div className="flex gap-2 items-start text-slate-600">
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero Trust verification: Integrity of digital records and database tables verified successfully.</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{currentLanguage === "ar" ? "الإشعارات المسجلة حديثاً" : "Recent Portal Notifications"}</span>
            <div className="space-y-2 font-mono text-[11px] max-h-36 overflow-y-auto">
              {notifications.map((nt, idx) => (
                <div key={idx} className="flex gap-2 items-center text-slate-600 border-b border-gray-100 pb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{nt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
