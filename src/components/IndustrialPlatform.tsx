/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, Plus, CheckCircle, Clock, ShieldAlert, MapPin, Activity, 
  Layers, Zap, Calendar, Search, X, Check, ShieldCheck, 
  AlertTriangle, TrendingUp, Sparkles, Globe, FileText, Settings, 
  Lock, Building, Database, Warehouse, Truck, FileSpreadsheet, 
  Play, BarChart3, Flame, Shield, Coins, ArrowLeftRight
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { FactoryRegistration, ApplicationStatus, UserRole } from "../types";
import { SUDANESE_STATES } from "../data";

interface IndustrialPlatformProps {
  currentLanguage: "ar" | "en";
  factories: FactoryRegistration[];
  onAddFactory: (factoryData: any) => Promise<any>;
  isAdmin: boolean;
  onInspectFactory?: (id: string, inspectionStatus: "passed" | "failed", status: ApplicationStatus) => Promise<any>;
}

// Extra mock data for rich features
interface IndustrialCity {
  id: string;
  nameAr: string;
  nameEn: string;
  state: string;
  occupancy: number;
  companiesCount: number;
  powerGrid: "stable" | "unstable" | "moderate";
  waterGrid: "optimal" | "limited" | "good";
  opportunities: string[];
}

const MOCK_CITIES: IndustrialCity[] = [
  {
    id: "city-1",
    nameAr: "منطقة الخرطوم بحري الصناعية",
    nameEn: "Khartoum North Industrial Area",
    state: "الخرطوم",
    occupancy: 82,
    companiesCount: 145,
    powerGrid: "moderate",
    waterGrid: "optimal",
    opportunities: ["صناعة النسيج القطني", "تعبئة الزيوت الغذائية", "مصانع التدوير الحراري"]
  },
  {
    id: "city-2",
    nameAr: "منطقة الباقير الصناعية",
    nameEn: "El Bagair Industrial Area",
    state: "الجزيرة",
    occupancy: 74,
    companiesCount: 92,
    powerGrid: "stable",
    waterGrid: "good",
    opportunities: ["صناعات دوائية ومصلية", "الصناعات البلاستيكية والكيميائية", "التعبئة الحديثة"]
  },
  {
    id: "city-3",
    nameAr: "مدينة جياد الصناعية المتكاملة",
    nameEn: "Giad Integrated Industrial City",
    state: "الجزيرة",
    occupancy: 89,
    companiesCount: 54,
    powerGrid: "stable",
    waterGrid: "optimal",
    opportunities: ["تجميع السيارات والمعدات الزراعية", "صناعات الحديد والصلب", "البطاريات الذكية"]
  },
  {
    id: "city-4",
    nameAr: "المنطقة الحرة بورتسودان",
    nameEn: "Port Sudan Free Zone",
    state: "البحر الأحمر",
    occupancy: 61,
    companiesCount: 110,
    powerGrid: "moderate",
    waterGrid: "limited",
    opportunities: ["صناعات صمغ عربي للتصدير", "تجهيز وتعبئة اللحوم والأسماك", "تجميع الأجهزة الإلكترونية"]
  },
  {
    id: "city-5",
    nameAr: "مجمع الأبيض لتصنيع الصمغ العربي",
    nameEn: "El Obeid Gum Arabic Cluster",
    state: "شمال كردفان",
    occupancy: 95,
    companiesCount: 38,
    powerGrid: "unstable",
    waterGrid: "good",
    opportunities: ["تكرير الصمغ العربي المتطور", "صناعات غدائية كالفول السوداني والكركديه", "صناعة الأعلاف الحيوانية"]
  }
];

export default function IndustrialPlatformModule({
  currentLanguage,
  factories,
  onAddFactory,
  isAdmin: initialIsAdmin,
  onInspectFactory
}: IndustrialPlatformProps) {
  
  // Custom Role Player switcher (RBAC selector)
  const [activeRole, setActiveRole] = useState<"owner" | "investor" | "inspector" | "minister">("owner");
  const isAdmin = activeRole === "minister" || activeRole === "inspector";

  const [activeTab, setActiveTab] = useState<
    "registry" | "cities" | "iot" | "supply_chain" | "kpis" | "compliance" | "incentives" | "ai_advisor" | "gis_map"
  >("registry");

  // Filter and Registry Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  const [selectedFactoryPassport, setSelectedFactoryPassport] = useState<FactoryRegistration | null>(null);

  // Dynamic IoT Sensor Values (Simulation Pulse)
  const [iotPulseActive, setIotPulseActive] = useState(false);
  const [iotSensors, setIotSensors] = useState([
    { id: "line-1-m1", name: "خلاط المواد الغذائية - خط 1", temp: 42, vibe: 2.1, speed: 1450, status: "optimal" },
    { id: "line-1-m2", name: "فرن التحميص الدوار - خط 1", temp: 185, vibe: 4.5, speed: 120, status: "warning" },
    { id: "line-1-m3", name: "ذراع التعبئة الآلي - خط 1", temp: 35, vibe: 1.2, speed: 45, status: "optimal" },
    { id: "line-2-m1", name: "ضاغط الكيماويات والبوليمر - خط 2", temp: 88, vibe: 3.2, speed: 950, status: "optimal" },
    { id: "line-2-m2", name: "جهاز الصهر الهيدروليكي - خط 2", temp: 240, vibe: 6.8, speed: 0, status: "maintenance" }
  ]);

  // Submit Application State (New Licenses, Capacity Expansion, Production Modification, Suspension)
  const [isAppWizardOpen, setIsAppWizardOpen] = useState(false);
  const [appType, setAppType] = useState<"new_license" | "expansion" | "modification" | "capacity_increase" | "suspension" | "renewal" | "closure">("new_license");
  const [factoryName, setFactoryName] = useState("");
  const [industrialSector, setIndustrialSector] = useState<"food" | "chemical" | "textile" | "engineering" | "pharmaceutical" | "other">("food");
  const [locationState, setLocationState] = useState(SUDANESE_STATES[0].nameAr);
  const [productionCapacity, setProductionCapacity] = useState("");
  const [energySource, setEnergySource] = useState("");
  const [productionLinesCount, setProductionLinesCount] = useState(1);
  const [workforceCount, setWorkforceCount] = useState(45);
  const [environmentalClass, setEnvironmentalClass] = useState<"A" | "B" | "C">("A");
  const [exportStatus, setExportStatus] = useState<"yes" | "no">("yes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Active Applications workflow tracker
  const [applications, setApplications] = useState([
    {
      id: "app-3091",
      factoryName: "شركة سنار لإنتاج وتكرير السكر",
      type: "expansion",
      sector: "food",
      state: "سنار",
      stage: 3, // 3 out of 8 (Environmental Verification)
      status: "pending",
      createdAt: "2026-07-10"
    },
    {
      id: "app-3092",
      factoryName: "الشركة السودانية لغزل خيوط القطن",
      type: "new_license",
      sector: "textile",
      state: "الجزيرة",
      stage: 5, // 5 out of 8 (Digital Certificate Issuance)
      status: "approved",
      createdAt: "2026-07-12"
    },
    {
      id: "app-3093",
      factoryName: "التاج للصناعات الهندسية الثقيلة",
      type: "capacity_increase",
      sector: "engineering",
      state: "الخرطوم",
      stage: 2, // 2 out of 8 (Technical Evaluation)
      status: "pending",
      createdAt: "2026-07-14"
    }
  ]);

  // AI Advisor Chat/Generative State
  const [aiScenario, setAiScenario] = useState("recommend_incentives");
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // GIS Map layers toggle
  const [gisLayers, setGisLayers] = useState({
    factories: true,
    cities: true,
    logistics: true,
    energy: false
  });
  const [gisSelectedNode, setGisSelectedNode] = useState<string | null>(null);

  // Industry-specific environmental log and compliance indicators
  const [environmentalLogs, setEnvironmentalLogs] = useState([
    { id: "env-1", factoryName: "مصنع الخرطوم للتدوير الكيميائي", permitStatus: "approved", emissions: "12% below cap", safetyScore: 94, actions: 0 },
    { id: "env-2", factoryName: "المقرن للتعبئة والتغليف البلاستيكي", permitStatus: "pending_audit", emissions: "5% above cap", safetyScore: 78, actions: 1 },
    { id: "env-3", factoryName: "مصنع صمغ بورتسودان المتطور", permitStatus: "approved", emissions: "24% below cap", safetyScore: 98, actions: 0 }
  ]);

  // Incentives state
  const [appliedIncentives, setAppliedIncentives] = useState([
    { id: "inc-101", titleAr: "إعفاء جمركي لقطع غيار خطوط الغزل", status: "approved", grantAmount: "0 SDG (خصم جمركي)" },
    { id: "inc-102", titleAr: "منحة الأتمتة والتحول الرقمي الصناعي", status: "pending", grantAmount: "12,000,000 SDG" }
  ]);

  // Simulate IoT Sensor fluctuation
  const triggerIoTPulse = () => {
    setIotPulseActive(true);
    setTimeout(() => {
      setIotSensors(prev => prev.map(s => {
        if (s.status === "maintenance") return s;
        const tempDelta = Math.floor(Math.random() * 11) - 5;
        const vibeDelta = parseFloat((Math.random() * 1.2 - 0.6).toFixed(1));
        const speedDelta = Math.floor(Math.random() * 61) - 30;
        
        let newTemp = s.temp + tempDelta;
        let newVibe = parseFloat((s.vibe + vibeDelta).toFixed(1));
        if (newVibe < 0.5) newVibe = 0.5;
        let newSpeed = s.speed + speedDelta;

        let status = "optimal";
        if (newTemp > 100 && s.id === "line-2-m1") status = "warning";
        if (newTemp > 190 && s.id === "line-1-m2") status = "warning";
        if (newVibe > 4.8) status = "warning";

        return {
          ...s,
          temp: newTemp,
          vibe: newVibe,
          speed: newSpeed,
          status
        };
      }));
      setIotPulseActive(false);
    }, 800);
  };

  // Handle Industrial Application submit wizard
  const handleWizardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factoryName || !productionCapacity || !energySource) {
      alert(currentLanguage === "ar" ? "يرجى تعبئة كافة الحقول الضرورية" : "Please fill in all necessary fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Add as factory in core registration flow
      const newFactoryPayload = {
        factoryName,
        industrialSector,
        locationState,
        productionCapacity,
        energySource,
        productionLinesCount: Number(productionLinesCount),
        workforceCount,
        environmentalClass,
        exportStatus,
        nationalId: `NFI-2026-${Math.floor(100000 + Math.random() * 900000)}`
      };

      await onAddFactory(newFactoryPayload);

      // Add to workflows list too
      const newApp = {
        id: `app-${Math.floor(4000 + Math.random() * 5999)}`,
        factoryName,
        type: appType,
        sector: industrialSector,
        state: locationState,
        stage: 1, // Stage 1: Technical Review
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0]
      };

      setApplications(prev => [newApp, ...prev]);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsAppWizardOpen(false);
        // Clear Form fields
        setFactoryName("");
        setProductionCapacity("");
        setEnergySource("");
        setProductionLinesCount(1);
      }, 2000);

    } catch (err) {
      console.error(err);
      alert(currentLanguage === "ar" ? "حدث خطأ أثناء إرسال الطلب الصناعي الموحد" : "An error occurred submitting the application");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inspect factory decision
  const handleInspectDecisionLocal = async (id: string, decision: "passed" | "failed") => {
    if (onInspectFactory) {
      try {
        const appStatus = decision === "passed" ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED;
        await onInspectFactory(id, decision, appStatus);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Query AI Industrial Advisor
  const runAIAdvisor = async () => {
    setAiLoading(true);
    setAiOutput("");
    try {
      const response = await fetch("/api/industrial/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiCustomPrompt,
          scenario: aiScenario,
          context: {
            activeTab,
            totalFactories: factories.length,
            sectorsBreakdown: factories.map(f => f.industrialSector),
            citiesCount: MOCK_CITIES.length
          }
        })
      });

      const data = await response.json();
      if (data.error) {
        setAiOutput(currentLanguage === "ar" ? `❌ خطأ من الخادم: ${data.details}` : `❌ Server Error: ${data.details}`);
      } else {
        setAiOutput(data.text);
      }
    } catch (err: any) {
      console.error("AI Advisor fetch failed", err);
      setAiOutput(currentLanguage === "ar" ? "❌ تعذر الاتصال بمحرك الذكاء الاصطناعي حالياً." : "❌ Failed to reach AI engine.");
    } finally {
      setAiLoading(false);
    }
  };

  // Trigger default AI report on tab load
  useEffect(() => {
    if (activeTab === "ai_advisor" && !aiOutput) {
      runAIAdvisor();
    }
  }, [activeTab, aiScenario]);

  // Sectors setup
  const sectors = [
    { value: "food", labelAr: "صناعات غذائية وزراعية", labelEn: "Agro-Food Processing", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { value: "chemical", labelAr: "صناعات كيميائية وبلاستيكية", labelEn: "Chemicals & Plastics", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { value: "textile", labelAr: "غزل ونسيج وملبوسات", labelEn: "Textiles & Garments", color: "bg-purple-50 text-purple-700 border-purple-100" },
    { value: "engineering", labelAr: "صناعات هندسية ومعدنية ثقيلة", labelEn: "Heavy Engineering & Metals", color: "bg-amber-50 text-amber-700 border-amber-100" },
    { value: "pharmaceutical", labelAr: "أدوية ومستلزمات طبية", labelEn: "Pharma & MedTech", color: "bg-rose-50 text-rose-700 border-rose-100" },
    { value: "other", labelAr: "صناعات وحرف أخرى", labelEn: "Other Industries", color: "bg-slate-50 text-slate-700 border-slate-100" }
  ];

  // Map Filtered Factories
  const filteredFactories = factories.filter(f => {
    const matchesSearch = f.factoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.locationState.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = filterSector === "all" || f.industrialSector === filterSector;
    return matchesSearch && matchesSector;
  });

  // KPI charts data
  const productionTrendsData = [
    { name: "2021", "صناعات غذائية": 240, "صناعات هندسية": 110, "صناعات كيميائية": 180 },
    { name: "2022", "صناعات غذائية": 280, "صناعات هندسية": 140, "صناعات كيميائية": 190 },
    { name: "2023", "صناعات غذائية": 310, "صناعات هندسية": 170, "صناعات كيميائية": 220 },
    { name: "2024", "صناعات غذائية": 390, "صناعات هندسية": 230, "صناعات كيميائية": 280 },
    { name: "2025", "صناعات غذائية": 450, "صناعات هندسية": 310, "صناعات كيميائية": 340 },
    { name: "2026", "صناعات غذائية": 520, "صناعات هندسية": 390, "صناعات كيميائية": 410 }
  ];

  const capacityUtilizationData = [
    { name: "الغذائية", "الاستغلال المالي %": 88, "الحد الأدنى المستهدف %": 70 },
    { name: "الكيميائية", "الاستغلال المالي %": 72, "الحد الأدنى المستهدف %": 70 },
    { name: "الغزل والنسيج", "الاستغلال المالي %": 64, "الحد الأدنى المستهدف %": 70 },
    { name: "الهندسية", "الاستغلال المالي %": 78, "الحد الأدنى المستهدف %": 70 },
    { name: "الطبية والأدوية", "الاستغلال المالي %": 85, "الحد الأدنى المستهدف %": 70 }
  ];

  // 8-stage Industrial Licences Workflow Definition
  const WORKFLOW_STAGES = [
    { id: 1, nameAr: "المراجعة الفنية الأولية", nameEn: "Technical Review" },
    { id: 2, nameAr: "التقييم الهندسي والجدوى", nameEn: "Engineering Evaluation" },
    { id: 3, nameAr: "التدقيق والمطابقة البيئية", nameEn: "Environmental Verification" },
    { id: 4, nameAr: "تفتيش الموقع الميداني الآلي", nameEn: "Site Inspection" },
    { id: 5, nameAr: "التقييم والتدقيق المالي", nameEn: "Financial Assessment" },
    { id: 6, nameAr: "التوقيع والاعتماد الفيدرالي", nameEn: "Federal Approval" },
    { id: 7, nameAr: "إصدار الترخيص الرقمي المؤمن", nameEn: "Certificate Issuance" },
    { id: 8, nameAr: "الرقابة والمتابعة الدورية", nameEn: "Active Monitoring" }
  ];

  return (
    <div id="industrial-platform-module" className="space-y-6">
      
      {/* Platform Header & RBAC Switcher */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-sudan-green animate-pulse" />
            <h2 className="text-xl font-black text-[#1E293B]">
              {currentLanguage === "ar" ? "المنصة الوطنية للتنمية الصناعية والتصنيع الذكي" : "National Industrial Development & Smart Mfg Platform"}
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            {currentLanguage === "ar" 
              ? "مجمع سيادي متكامل لإدارة المصانع، رخص التشغيل والتحول الرقمي، المدن والقرى الصناعية، وتدقيق أنظمة الجيل الرابع Industry 4.0 بيئياً وفنياً" 
              : "Enterprise sovereign platform overseeing factories registry, smart Industry 4.0 automation, free zones, and regulatory compliance"}
          </p>
        </div>

        {/* RBAC Mode Selector */}
        <div className="bg-slate-50 p-1.5 rounded-2xl border border-gray-100 flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-bold px-2 uppercase tracking-wide">
            {currentLanguage === "ar" ? "الهوية النشطة:" : "Role Context:"}
          </span>
          <button
            onClick={() => { setActiveRole("owner"); }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer transition-all ${
              activeRole === "owner" ? "bg-sudan-green text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {currentLanguage === "ar" ? "صاحب مصنع" : "Factory Owner"}
          </button>
          <button
            onClick={() => { setActiveRole("investor"); }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer transition-all ${
              activeRole === "investor" ? "bg-sudan-green text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {currentLanguage === "ar" ? "مستثمر صناعي" : "Industrial Investor"}
          </button>
          <button
            onClick={() => { setActiveRole("inspector"); }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer transition-all ${
              activeRole === "inspector" ? "bg-sudan-green text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {currentLanguage === "ar" ? "مفتش فني" : "Field Inspector"}
          </button>
          <button
            onClick={() => { setActiveRole("minister"); }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer transition-all ${
              activeRole === "minister" ? "bg-sudan-green text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {currentLanguage === "ar" ? "الوزير / الوكيل" : "Minister"}
          </button>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1 overflow-x-auto">
        {[
          { id: "registry", labelAr: "سجل المصانع والعمليات", labelEn: "Factory Registry", icon: Cpu },
          { id: "gis_map", labelAr: "الخارطة الموحدة GIS", labelEn: "GIS Map Layers", icon: Globe },
          { id: "cities", labelAr: "المدن والمجمعات الصناعية", labelEn: "Industrial Cities", icon: Building },
          { id: "iot", labelAr: "التصنيع الذكي (IoT)", labelEn: "Smart Manufacturing", icon: Activity },
          { id: "supply_chain", labelAr: "سلاسل الإمداد واللوجستيات", labelEn: "Supply Chain Risk", icon: Truck },
          { id: "kpis", labelAr: "مؤشرات الأداء الإنتاجي", labelEn: "Performance KPIs", icon: BarChart3 },
          { id: "compliance", labelAr: "الالتزام والسلامة والبيئة", labelEn: "Environmental Audit", icon: Shield },
          { id: "incentives", labelAr: "الحوافز والمنح الحكومية", labelEn: "Grants & Subsidies", icon: Coins },
          { id: "ai_advisor", labelAr: "مستشار الصناعة الذكي (AI)", labelEn: "AI Advisor", icon: Sparkles }
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id 
                  ? "border-sudan-green text-sudan-green bg-sudan-green/5 rounded-t-xl font-extrabold" 
                  : "border-transparent text-gray-500 hover:text-slate-800 hover:border-gray-300"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          
          {/* TAB 1: REGISTRY AND APPLICATIONS WORKFLOW */}
          {activeTab === "registry" && (
            <div className="space-y-6">
              
              {/* Header inside Registry */}
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-sudan-gold" />
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm">
                      {currentLanguage === "ar" ? "السجل الصناعي الفيدرالي الموحد" : "Federal Industrial Registry Ledger"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLanguage === "ar" ? "قائمة المصانع المعتمدة، طلبات التراخيص وتتبع مراحلها" : "Directory of certified plants and technical license workflows"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setAppType("new_license"); setIsAppWizardOpen(true); }}
                    className="flex items-center gap-1.5 bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    {currentLanguage === "ar" ? "طلب رخصة جديدة" : "New License"}
                  </button>
                  <button
                    onClick={() => { setAppType("expansion"); setIsAppWizardOpen(true); }}
                    className="flex items-center gap-1.5 bg-sudan-gold hover:bg-sudan-gold-light text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                  >
                    <Layers className="h-4 w-4" />
                    {currentLanguage === "ar" ? "تعديل / توسيع خط إنتاج" : "Expand Capacity"}
                  </button>
                </div>
              </div>

              {/* Active Applications Workflow Progress Trackers */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-sudan-green" />
                  {currentLanguage === "ar" ? "مسار طلبات التراخيص الموحدة الجارية (نظام التدقيق الرقمي المتكامل)" : "Active Unified Application Workflows (8-Stage Digital Audit)"}
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  {applications.map(app => (
                    <div key={app.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {app.id}
                          </span>
                          <h5 className="font-extrabold text-sm text-slate-800 mt-1">{app.factoryName}</h5>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[11px] text-gray-400 font-bold">
                            {currentLanguage === "ar" ? "نوع الإجراء:" : "Action:"}
                          </span>
                          <span className="font-bold text-sudan-green bg-sudan-green/10 px-2.5 py-1 rounded-full border border-sudan-green/10">
                            {app.type === "new_license" ? (currentLanguage === "ar" ? "رخصة جديدة" : "New License") :
                             app.type === "expansion" ? (currentLanguage === "ar" ? "توسعة منشأة" : "Expansion") :
                             app.type === "capacity_increase" ? (currentLanguage === "ar" ? "زيادة طاقة تشغيل" : "Capacity Increase") :
                             (currentLanguage === "ar" ? "تعديل خط تشغيل" : "Modification")}
                          </span>
                        </div>
                      </div>

                      {/* Workflow Step Indicator */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-sudan-gold">
                            {currentLanguage === "ar" 
                              ? `المرحلة النشطة: ${WORKFLOW_STAGES[app.stage - 1].nameAr}` 
                              : `Active Stage: ${WORKFLOW_STAGES[app.stage - 1].nameEn}`}
                          </span>
                          <span className="text-gray-400 font-bold">
                            {Math.round((app.stage / 8) * 100)}% {currentLanguage === "ar" ? "مكتمل" : "Completed"}
                          </span>
                        </div>

                        {/* Visual Node Steps */}
                        <div className="relative flex items-center justify-between w-full mt-2">
                          {/* Background connector line */}
                          <div className="absolute left-0 right-0 h-1 bg-gray-100 -z-10 rounded-full" />
                          <div 
                            className="absolute left-0 h-1 bg-sudan-green -z-10 rounded-full transition-all duration-500" 
                            style={{ width: `${((app.stage - 1) / 7) * 100}%` }}
                          />

                          {WORKFLOW_STAGES.map((stg) => {
                            const isCompleted = stg.id < app.stage;
                            const isActive = stg.id === app.stage;
                            return (
                              <div 
                                key={stg.id} 
                                className="flex flex-col items-center group relative cursor-pointer"
                                title={currentLanguage === "ar" ? stg.nameAr : stg.nameEn}
                              >
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-all ${
                                  isCompleted ? "bg-sudan-green text-white" :
                                  isActive ? "bg-sudan-gold text-white ring-4 ring-sudan-gold/30 animate-pulse" :
                                  "bg-white border-2 border-gray-200 text-gray-400"
                                } text-[9px] font-bold`}>
                                  {isCompleted ? <Check className="h-3 w-3" /> : stg.id}
                                </div>
                                <span className="absolute top-7 hidden group-hover:block bg-slate-800 text-white text-[9px] font-medium px-2 py-1 rounded-md z-20 whitespace-nowrap shadow-md">
                                  {currentLanguage === "ar" ? stg.nameAr : stg.nameEn}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Gov Approvals / Inspections Actions Inside applications */}
                      {isAdmin && app.status === "pending" && (
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-50">
                          <span className="text-[11px] text-gray-400 font-bold ml-auto">
                            {currentLanguage === "ar" ? "إجراءات الاعتماد الفيدرالي:" : "Federal Action Actions:"}
                          </span>
                          <button
                            onClick={() => {
                              setApplications(prev => prev.map(a => a.id === app.id ? { ...a, stage: Math.min(8, a.stage + 1) } : a));
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                          >
                            {currentLanguage === "ar" ? "تمرير للمرحلة التالية" : "Approve Next Stage"}
                          </button>
                          <button
                            onClick={() => {
                              setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: "rejected" } : a));
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                          >
                            {currentLanguage === "ar" ? "طلب تعديلات ومراجعة" : "Require Revision"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Layout: Left Registry Directory, Right Passport Viewer */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Directory List (takes 2 columns on lg) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                    <div className="relative flex-1">
                      <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder={currentLanguage === "ar" ? "البحث بالاسم، الولاية أو الرقم الوطني للمصنع..." : "Search by name, state location or NFI..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#F4F6F5] border border-gray-200 text-xs pl-4 pr-11 py-2 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                      />
                    </div>
                    <select
                      value={filterSector}
                      onChange={(e) => setFilterSector(e.target.value)}
                      className="bg-[#F4F6F5] border border-gray-200 text-xs px-3 py-2 rounded-xl outline-none focus:border-sudan-green min-w-[150px]"
                    >
                      <option value="all">{currentLanguage === "ar" ? "كل القطاعات" : "All Sectors"}</option>
                      {sectors.map(s => (
                        <option key={s.value} value={s.value}>{currentLanguage === "ar" ? s.labelAr : s.labelEn}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    {filteredFactories.map(fac => {
                      const sBreak = sectors.find(s => s.value === fac.industrialSector);
                      const nationalFactoryId = (fac as any).nationalId || `NFI-2026-${Math.floor(100000 + Math.random() * 900000)}`;
                      return (
                        <div
                          key={fac.id}
                          onClick={() => setSelectedFactoryPassport({ ...fac, nationalId: nationalFactoryId } as any)}
                          className={`bg-white border rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-sudan-green hover:shadow-sm cursor-pointer transition-all duration-300 ${
                            selectedFactoryPassport?.id === fac.id ? "ring-2 ring-sudan-green border-transparent" : "border-gray-200"
                          }`}
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border ${sBreak?.color}`}>
                                {currentLanguage === "ar" ? sBreak?.labelAr : sBreak?.labelEn}
                              </span>
                              <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                                {nationalFactoryId}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-sm font-extrabold text-slate-800">{fac.factoryName}</h4>
                              <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3 text-sudan-gold" />
                                <span>{fac.locationState}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                            <div className="text-right">
                              <p className="text-[9px] text-slate-400 font-bold uppercase">{currentLanguage === "ar" ? "خطوط التشغيل" : "Lines"}</p>
                              <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                <Layers className="h-3.5 w-3.5 text-sudan-green" />
                                <span>{fac.productionLinesCount}</span>
                              </p>
                            </div>

                            <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                              fac.inspectionStatus === "passed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                              fac.inspectionStatus === "failed" ? "bg-rose-100 text-rose-800 border-rose-200" :
                              "bg-amber-100 text-amber-800 border-amber-200"
                            }`}>
                              {fac.inspectionStatus === "passed" ? (currentLanguage === "ar" ? "معتمد" : "Passed") :
                               fac.inspectionStatus === "failed" ? (currentLanguage === "ar" ? "مخالف" : "Failed") :
                               (currentLanguage === "ar" ? "قيد التدقيق" : "Pending")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Passport Viewer "National Industrial Passport (NIP)" */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-5 h-fit sticky top-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-sudan-gold" />
                      <h4 className="text-xs font-black tracking-wider uppercase text-sudan-gold">
                        {currentLanguage === "ar" ? "جواز السفر الصناعي الوطني" : "National Industrial Passport"}
                      </h4>
                    </div>
                    <span className="text-[9px] bg-slate-800 text-gray-300 font-mono px-2 py-0.5 rounded">SD-NIP-2026</span>
                  </div>

                  {selectedFactoryPassport ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "الاسم التجاري للمصنع" : "Factory Name"}</p>
                        <h3 className="text-sm font-black text-white">{selectedFactoryPassport.factoryName}</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "المعرف الصناعي الموحد" : "National Factory ID"}</p>
                          <p className="font-mono font-bold text-white text-sudan-gold">{(selectedFactoryPassport as any).nationalId}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "موقع الولاية" : "State Location"}</p>
                          <p className="font-bold text-white">{selectedFactoryPassport.locationState}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "طاقة الإنتاج المسجلة" : "Capacity"}</p>
                          <p className="font-bold text-white">{selectedFactoryPassport.productionCapacity}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "عدد الموظفين" : "Workforce"}</p>
                          <p className="font-bold text-white">{(selectedFactoryPassport as any).workforceCount || 64} {currentLanguage === "ar" ? "عامل وموظف" : "employees"}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "حالة التصدير" : "Export Status"}</p>
                          <p className="font-bold text-white">{(selectedFactoryPassport as any).exportStatus === "yes" ? (currentLanguage === "ar" ? "تصدير نشط للكوميسا" : "Export Active (COMESA)") : (currentLanguage === "ar" ? "سوق محلي" : "Local Market")}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "التصنيف البيئي" : "Environmental Rating"}</p>
                          <p className="font-mono font-bold text-emerald-400">Class {(selectedFactoryPassport as any).environmentalClass || "A"}</p>
                        </div>
                      </div>

                      {/* QR Verification details */}
                      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center gap-3.5">
                        <div className="bg-white p-1 rounded-lg shrink-0">
                          {/* Simulated QR Code */}
                          <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-white text-[8px] font-mono border-2 border-slate-900">
                            [QR CODE]
                          </div>
                        </div>
                        <div className="text-[11px] leading-normal space-y-1">
                          <p className="font-bold text-gray-200">
                            {currentLanguage === "ar" ? "التحقق المزدوج عبر البلوكشين الحكومي" : "Verified Blockchain Record"}
                          </p>
                          <p className="text-gray-400 text-[10px]">
                            {currentLanguage === "ar" 
                              ? "مرتبط بالسجل التجاري ومنصة التراخيص الوطنية الموحدة لتفادي تكرار الوثائق." 
                              : "Fully linked with Commercial Registry and licensing gateways."}
                          </p>
                        </div>
                      </div>

                      {/* Direct action triggers */}
                      {isAdmin && selectedFactoryPassport.inspectionStatus === "pending" && (
                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => handleInspectDecisionLocal(selectedFactoryPassport.id, "passed")}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2 rounded-xl transition-all cursor-pointer text-center"
                          >
                            {currentLanguage === "ar" ? "منح ترخيص مطابقة" : "Approve Factory Compliance"}
                          </button>
                          <button
                            onClick={() => handleInspectDecisionLocal(selectedFactoryPassport.id, "failed")}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-2 rounded-xl transition-all cursor-pointer text-center"
                          >
                            {currentLanguage === "ar" ? "تسجيل مخالفة" : "Register Non-Compliance"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 space-y-2">
                      <Cpu className="h-8 w-8 mx-auto text-slate-700 animate-pulse" />
                      <p className="text-xs">
                        {currentLanguage === "ar" 
                          ? "الرجاء تحديد مصنع من القائمة لعرض جوازه الصناعي الفيدرالي والتحقق من التراخيص." 
                          : "Select any industrial facility to view its verified National Industrial Passport."}
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: GIS MAP */}
          {activeTab === "gis_map" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* GIS Interactive SVG Map Viewer */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-sudan-green" />
                    <h3 className="font-extrabold text-slate-800 text-sm">
                      {currentLanguage === "ar" ? "الخارطة الجغرافية للتنمية الصناعية (GIS Integration)" : "Geographical Industrial GIS Map"}
                    </h3>
                  </div>
                  
                  {/* Layer check toggles */}
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={gisLayers.factories} 
                        onChange={() => setGisLayers(p => ({ ...p, factories: !p.factories }))}
                        className="rounded border-gray-300 text-sudan-green focus:ring-sudan-green"
                      />
                      <span>{currentLanguage === "ar" ? "المصانع المسجلة" : "Factories"}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={gisLayers.cities} 
                        onChange={() => setGisLayers(p => ({ ...p, cities: !p.cities }))}
                        className="rounded border-gray-300 text-sudan-green focus:ring-sudan-green"
                      />
                      <span>{currentLanguage === "ar" ? "المدن الصناعية" : "Industrial Cities"}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={gisLayers.logistics} 
                        onChange={() => setGisLayers(p => ({ ...p, logistics: !p.logistics }))}
                        className="rounded border-gray-300 text-sudan-green focus:ring-sudan-green"
                      />
                      <span>{currentLanguage === "ar" ? "مسارات الإمداد" : "Supply Routes"}</span>
                    </label>
                  </div>
                </div>

                {/* SVG Visual Canvas of Sudan Map */}
                <div className="relative h-96 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-4">
                  
                  {/* GIS Overlay Compass Grid */}
                  <div className="absolute top-4 left-4 text-[9px] font-mono text-slate-400 bg-white/80 p-2 rounded-lg border border-gray-100 z-10">
                    <p>SUDAN GRID COORD</p>
                    <p>LAT: 15.5007° N</p>
                    <p>LONG: 32.5599° E</p>
                  </div>

                  {/* SVG Map of Sudan */}
                  <svg className="w-full h-full max-w-lg" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Simplified states outlines */}
                    <path d="M 120 40 L 220 30 L 320 20 L 330 110 L 250 140 L 150 120 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
                    <path d="M 320 20 L 420 30 L 450 120 L 350 150 L 330 110 Z" fill="#D1FAE5" stroke="#A7F3D0" strokeWidth="1.5" title="Eastern Red Sea State" />
                    <path d="M 250 140 L 350 150 L 380 260 L 280 280 L 220 210 Z" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5" />
                    <path d="M 150 120 L 250 140 L 220 210 L 100 180 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
                    <path d="M 100 180 L 220 210 L 280 280 L 140 380 L 60 300 Z" fill="#F5F5F5" stroke="#E5E5E5" strokeWidth="1.5" />
                    <path d="M 280 280 L 380 260 L 420 370 L 320 390 Z" fill="#FAF5FF" stroke="#F3E8FF" strokeWidth="1.5" />

                    {/* Logistics Overlay Roads (dotted lines) */}
                    {gisLayers.logistics && (
                      <>
                        {/* Khartoum to Port Sudan */}
                        <line x1="260" y1="130" x2="380" y2="80" stroke="#C5A059" strokeWidth="2.5" strokeDasharray="5,4" className="animate-pulse" />
                        {/* Khartoum to El Obeid */}
                        <line x1="260" y1="130" x2="160" y2="240" stroke="#C5A059" strokeWidth="2.5" strokeDasharray="5,4" />
                        {/* El Obeid to Port Sudan bypass */}
                        <path d="M 160 240 Q 280 210 380 80" stroke="#007A33" strokeWidth="1.5" strokeDasharray="3,3" />
                      </>
                    )}

                    {/* Industrial Nodes (Interactive circles) */}
                    {gisLayers.cities && (
                      <>
                        {/* Khartoum Node */}
                        <g className="cursor-pointer" onClick={() => setGisSelectedNode("khartoum")}>
                          <circle cx="260" cy="130" r="10" fill="#007A33" fillOpacity="0.8" stroke="#ffffff" strokeWidth="2" />
                          <circle cx="260" cy="130" r="16" stroke="#007A33" strokeWidth="1.5" strokeOpacity="0.4" className="animate-ping" />
                          <text x="275" y="133" fill="#1E293B" fontSize="10" fontWeight="900" fontFamily="sans-serif">الخرطوم (Khartoum)</text>
                        </g>

                        {/* Port Sudan Node */}
                        <g className="cursor-pointer" onClick={() => setGisSelectedNode("portsudan")}>
                          <circle cx="380" cy="80" r="10" fill="#007A33" fillOpacity="0.8" stroke="#ffffff" strokeWidth="2" />
                          <circle cx="380" cy="80" r="16" stroke="#007A33" strokeWidth="1.5" strokeOpacity="0.4" className="animate-ping" />
                          <text x="395" y="83" fill="#1E293B" fontSize="10" fontWeight="900" fontFamily="sans-serif">بورتسودان (Port Sudan)</text>
                        </g>

                        {/* El Obeid Node */}
                        <g className="cursor-pointer" onClick={() => setGisSelectedNode("elobeid")}>
                          <circle cx="160" cy="240" r="8" fill="#C5A059" fillOpacity="0.8" stroke="#ffffff" strokeWidth="2" />
                          <text x="175" y="244" fill="#1E293B" fontSize="10" fontWeight="900" fontFamily="sans-serif">الأبيض (El Obeid)</text>
                        </g>

                        {/* El Bagair & Giad (Soba) Nodes */}
                        <g className="cursor-pointer" onClick={() => setGisSelectedNode("elbagair")}>
                          <circle cx="270" cy="155" r="7" fill="#007A33" stroke="#ffffff" strokeWidth="1.5" />
                          <text x="282" y="159" fill="#64748B" fontSize="9" fontWeight="bold">الباقير / جياد</text>
                        </g>
                      </>
                    )}

                    {/* Factory Pins */}
                    {gisLayers.factories && factories.map((fac, idx) => {
                      // Distribute factory dots deterministically near Khartoum and other cities
                      const offsets = [
                        { x: 245, y: 125 },
                        { x: 275, y: 135 },
                        { x: 370, y: 90 },
                        { x: 170, y: 230 },
                        { x: 260, y: 150 },
                        { x: 250, y: 110 }
                      ];
                      const coord = offsets[idx % offsets.length];
                      return (
                        <circle 
                          key={fac.id}
                          cx={coord.x} 
                          cy={coord.y} 
                          r="4.5" 
                          fill="#EF4444" 
                          stroke="#ffffff" 
                          strokeWidth="1"
                          title={fac.factoryName}
                        />
                      );
                    })}
                  </svg>
                </div>
                <p className="text-[10px] text-gray-400 text-center">
                  {currentLanguage === "ar" 
                    ? "💡 انقر فوق عقد المدن الصناعية الرئيسية (الخرطوم، بورتسودان، الأبيض) لعرض تحليل الكثافة والفرص المتاحة." 
                    : "💡 Click on key Industrial City nodes (Khartoum, Port Sudan, El Obeid) to view regional density profile."}
                </p>
              </div>

              {/* Right Side: Map Selected Node Profile card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  {currentLanguage === "ar" ? "تفاصيل الإقليم ومحيط التنمية" : "Regional Profile & Logistics Metrics"}
                </h4>

                {gisSelectedNode === "khartoum" ? (
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="font-extrabold text-[#1E293B] text-base">إقليم العاصمة - الخرطوم والجزيرة</h3>
                      <p className="text-xs text-sudan-green font-bold">كثافة صناعية عالية (خمس نجوم)</p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{currentLanguage === "ar" ? "المجمعات الصناعية النشطة" : "Active Clusters"}</span>
                        <span className="font-bold text-slate-800">بحري، الباقير، جياد، سوبا</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{currentLanguage === "ar" ? "القطاعات الرائدة" : "Leading Sectors"}</span>
                        <span className="font-bold text-slate-800">{currentLanguage === "ar" ? "الأغذية، الأدوية، السيارات" : "Food, Pharma, Autos"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{currentLanguage === "ar" ? "ربط الطاقة الشبكي" : "Grid Power Integration"}</span>
                        <span className="text-emerald-600 font-bold">85% (أفضل استقرار نسبي)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{currentLanguage === "ar" ? "الفرص الاستثمارية الشاغرة" : "Investment Openings"}</span>
                        <span className="text-sudan-gold font-bold">12 فرصة ذهبية</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                      <h5 className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-sudan-green" />
                        {currentLanguage === "ar" ? "مسارات النقل اللوجستي المقترحة" : "Recommended Logistic Corridors"}
                      </h5>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        يربط طريق التحدي السريع والخط الحديدي محيط الخرطوم مباشرة بميناء بورتسودان للتصدير السريع في أقل من 12 ساعة.
                      </p>
                    </div>
                  </div>
                ) : gisSelectedNode === "portsudan" ? (
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="font-extrabold text-[#1E293B] text-base">بوابة البحر الأحمر والمنطقة الحرة</h3>
                      <p className="text-xs text-blue-600 font-bold">بوابة الصادرات والتبادل التجاري الدولي</p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">سعة الاستيعاب بالميناء</span>
                        <span className="font-bold text-slate-800">750,000 حاوية / سنويًا</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">كثافة مصانع تصنيع الصمغ العربي</span>
                        <span className="font-bold text-slate-800">عالٍ (تصدير مباشر)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">إعفاءات جمركية بالمنطقة الحرة</span>
                        <span className="text-emerald-600 font-bold">100% إعفاء استثماري وسيادي</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-2">
                      <h5 className="text-[11px] font-black text-blue-800 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-blue-600 animate-bounce" />
                        تحسينات البنية التحتية الجارية
                      </h5>
                      <p className="text-[10px] text-blue-700 leading-normal">
                        يجري إكمال محطة تحلية المياه بالطاقة الشمسية لتغذية المجمعات اللوجستية وتلافي تحديات الإمداد المائي الساحلي.
                      </p>
                    </div>
                  </div>
                ) : gisSelectedNode === "elobeid" ? (
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="font-extrabold text-[#1E293B] text-base">إقليم الأبيض - غرب ووسط السودان</h3>
                      <p className="text-xs text-sudan-gold font-bold">عاصمة الصمغ العربي والمحاصيل الزيتية العالمية</p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">إنتاج الصمغ العربي الخام</span>
                        <span className="font-bold text-slate-800">45,000 طن متري / سنويًا</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">البنية اللوجستية الجافة</span>
                        <span className="font-bold text-slate-800">بورصة محاصيل الأبيض الموحدة</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">الربط اللوجستي مع الميناء</span>
                        <span className="text-amber-600 font-bold">طريق الصادرات القومي البري والسكك الحديدية</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 space-y-2">
                      <h5 className="text-[11px] font-black text-amber-800 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        نصيحة أمن الإمداد
                      </h5>
                      <p className="text-[10px] text-amber-700 leading-normal">
                        نوصي بدعم المعالجة التحويلية المتقدمة محلياً (بودرة الصمغ والبلورات النقية) بدلاً من التصدير الخام لرفع العائد المالي 4 أضعاف.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400 space-y-2">
                    <Globe className="h-10 w-10 mx-auto text-gray-300 animate-spin-slow" />
                    <p className="text-xs">
                      {currentLanguage === "ar" 
                        ? "يرجى النقر فوق إحدى المدن الرئيسية على الخارطة اليسرى لعرض الإقليم اللوجستي الصناعي المخصص." 
                        : "Click any major city node on the left GIS map layer to fetch regional data."}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: INDUSTRIAL CITIES */}
          {activeTab === "cities" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_CITIES.map(city => (
                  <div key={city.id} className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6 hover:shadow-md transition-all duration-300 space-y-4">
                    <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                      <div>
                        <h4 className="font-black text-sm text-slate-800">
                          {currentLanguage === "ar" ? city.nameAr : city.nameEn}
                        </h4>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-sudan-gold" />
                          <span>{city.state}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {city.companiesCount} {currentLanguage === "ar" ? "منشأة" : "units"}
                      </span>
                    </div>

                    {/* Progress occupancy */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-400">{currentLanguage === "ar" ? "نسبة إشغال المدينة" : "Occupancy Rate"}</span>
                        <span className="text-sudan-green">{city.occupancy}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-sudan-green h-full rounded-full" style={{ width: `${city.occupancy}%` }} />
                      </div>
                    </div>

                    {/* Utilities grids */}
                    <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "استقرار الطاقة" : "Power Grid"}</p>
                        <p className={`font-black ${
                          city.powerGrid === "stable" ? "text-emerald-600" :
                          city.powerGrid === "moderate" ? "text-amber-600" : "text-rose-600"
                        }`}>
                          {city.powerGrid === "stable" ? (currentLanguage === "ar" ? "مستقر ومضمون" : "Stable") :
                           city.powerGrid === "moderate" ? (currentLanguage === "ar" ? "متقطع جزئياً" : "Moderate") :
                           (currentLanguage === "ar" ? "تحدي في الإمداد" : "Unstable")}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "شبكة المياه الصناعية" : "Water Grid"}</p>
                        <p className="font-black text-slate-700">
                          {city.waterGrid === "optimal" ? (currentLanguage === "ar" ? "ممتاز" : "Optimal") :
                           city.waterGrid === "good" ? (currentLanguage === "ar" ? "جيد" : "Good") :
                           (currentLanguage === "ar" ? "شحيح ومحدود" : "Limited")}
                        </p>
                      </div>
                    </div>

                    {/* Investment opportunities */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                        {currentLanguage === "ar" ? "الفرص الاستثمارية الشاغرة بالمدينة" : "Vacant Priority Investments"}
                      </h5>
                      <div className="space-y-1.5">
                        {city.opportunities.map((opp, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-sudan-gold" />
                            <span>{opp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick apply for land allocation */}
                    <button
                      onClick={() => {
                        setLocationState(city.state);
                        setAppType("new_license");
                        setIsAppWizardOpen(true);
                      }}
                      className="w-full bg-[#1E293B] hover:bg-slate-800 text-white text-xs font-black py-2 rounded-xl cursor-pointer transition-colors text-center"
                    >
                      {currentLanguage === "ar" ? "تقديم طلب تخصيص أرض صناعية" : "Apply for Land Allocation"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SMART MANUFACTURING (IoT) */}
          {activeTab === "iot" && (
            <div className="space-y-6">
              
              {/* IoT Live Control Room panel */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-right">
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-1.5 justify-center md:justify-start">
                    <Activity className="h-5 w-5 text-sudan-green animate-pulse" />
                    {currentLanguage === "ar" ? "غرفة عمليات الأتمتة والجيل الرابع الصناعي (Industry 4.0)" : "Industry 4.0 IoT Control Room"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentLanguage === "ar" ? "مراقبة مستشعرات خطوط الإنتاج، درجة الحرارة، الارتجاج، ومعدل كفاءة المعدات اللحظي" : "Monitor digital production lines, vibrations, heat sensors, and dynamic OEE"}
                  </p>
                </div>

                <button
                  onClick={triggerIoTPulse}
                  disabled={iotPulseActive}
                  className="flex items-center gap-2 bg-sudan-green hover:bg-sudan-green-light text-white font-black text-xs px-5 py-3 rounded-2xl cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Play className={`h-4.5 w-4.5 ${iotPulseActive ? "animate-spin" : ""}`} />
                  <span>{currentLanguage === "ar" ? "تحديث البيانات اللحظية (Simulate IoT Pulse)" : "Trigger IoT Sensor Pulse"}</span>
                </button>
              </div>

              {/* Grid: 3 columns (2 Left side machine grid, 1 Right side overall efficiency metrics) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Machine sensors list */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    {currentLanguage === "ar" ? "أجهزة ومحركات خطوط الإنتاج النشطة" : "Active Machine Sensors Directory"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {iotSensors.map(sensor => (
                      <div 
                        key={sensor.id} 
                        className={`bg-white border p-5 rounded-3xl space-y-4 transition-all duration-300 hover:shadow-xs ${
                          sensor.status === "warning" ? "border-amber-300 ring-1 ring-amber-300/40" :
                          sensor.status === "maintenance" ? "border-rose-300 bg-rose-50/20" : "border-gray-100"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                              {sensor.id}
                            </span>
                            <h5 className="font-extrabold text-xs text-slate-800 mt-1">{sensor.name}</h5>
                          </div>

                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            sensor.status === "optimal" ? "bg-emerald-100 text-emerald-800" :
                            sensor.status === "warning" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {sensor.status === "optimal" ? (currentLanguage === "ar" ? "مثالي" : "Optimal") :
                             sensor.status === "warning" ? (currentLanguage === "ar" ? "تنبيه حرارة" : "Warning") :
                             (currentLanguage === "ar" ? "صيانة وقائية" : "Maintenance")}
                          </span>
                        </div>

                        {/* Sensor micro indicators */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-[8px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "درجة الحرارة" : "Heat"}</p>
                            <p className="font-extrabold text-slate-800 mt-1">{sensor.temp}°C</p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-[8px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "الارتجاج (Vibe)" : "Vibration"}</p>
                            <p className="font-extrabold text-slate-800 mt-1">{sensor.vibe} mm/s</p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-[8px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "السرعة (RPM)" : "Speed"}</p>
                            <p className="font-extrabold text-slate-800 mt-1">{sensor.speed} rpm</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overall production efficiency dashboard (OEE) */}
                <div className="bg-[#1E293B] text-white p-6 rounded-3xl space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-sudan-gold tracking-wider uppercase">
                      {currentLanguage === "ar" ? "الفعالية الإجمالية للمصانع (OEE)" : "Overall Equipment Effectiveness (OEE)"}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">الربط اللحظي الرقمي لخطوط إنتاج السودان</p>
                  </div>

                  {/* Circle OEE visual mock */}
                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-36 h-36 rounded-full border-8 border-slate-800 flex items-center justify-center">
                      {/* Innermost values */}
                      <div className="text-center space-y-0.5">
                        <p className="text-3xl font-black text-white">79.2%</p>
                        <p className="text-[9px] text-emerald-400 font-black">▲ 1.4% (مستقر)</p>
                      </div>
                    </div>
                  </div>

                  {/* OEE elements */}
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-400">{currentLanguage === "ar" ? "جاهزية المعدات (Availability)" : "Equipment Availability"}</span>
                        <span>84.5%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "84.5%" }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-400">{currentLanguage === "ar" ? "سرعة الأداء التشغيلي (Performance)" : "Operating Performance"}</span>
                        <span>78.0%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-sudan-gold h-full rounded-full" style={{ width: "78%" }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-400">{currentLanguage === "ar" ? "نسبة الجودة والخلو من العيوب" : "Quality Standard"}</span>
                        <span>98.4%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-400 h-full rounded-full" style={{ width: "98.4%" }} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1 text-[11px] leading-relaxed">
                    <p className="font-bold text-slate-200">📊 نصيحة الذكاء اللحظي:</p>
                    <p className="text-slate-400">
                      يُسجل الفرن الدوار تذبذباً طفيفاً بالاهتزاز. تم إشعار فريق الصيانة الوقائية بمجمع جياد لتعديل التوازن تلقائياً قبل حدوث توقف غير مجدول.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: SUPPLY CHAIN AND RISK */}
          {activeTab === "supply_chain" && (
            <div className="space-y-6">
              
              {/* Supply chain flows & tracing card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Truck className="h-5 w-5 text-sudan-green" />
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    {currentLanguage === "ar" ? "سلاسل إمداد السلع والمنتجات الوطنية" : "National Supply Chain Tracing Hub"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                    <Database className="h-5 w-5 mx-auto text-sudan-gold" />
                    <h4 className="font-bold text-slate-800">{currentLanguage === "ar" ? "1. موردي المواد الخام" : "1. Raw Material Suppliers"}</h4>
                    <p className="text-[10px] text-gray-400">تجميع الصمغ، السمسم، خيوط القطن، الحديد</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                    <Building className="h-5 w-5 mx-auto text-sudan-green" />
                    <h4 className="font-bold text-slate-800">{currentLanguage === "ar" ? "2. مصانع المعالجة التحويلية" : "2. Manufacturers"}</h4>
                    <p className="text-[10px] text-gray-400">تكرير، عصر، صهر، أتمتة، غزل ونسيج</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                    <Warehouse className="h-5 w-5 mx-auto text-blue-500" />
                    <h4 className="font-bold text-slate-800">{currentLanguage === "ar" ? "3. المستودعات الجافة" : "3. Warehouses"}</h4>
                    <p className="text-[10px] text-gray-400">صوامع الغلال، مجمع سوبا للمطاط، الأبيض</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                    <Truck className="h-5 w-5 mx-auto text-indigo-500" />
                    <h4 className="font-bold text-slate-800">{currentLanguage === "ar" ? "4. لوجستيات وموانئ التصدير" : "4. Logistics & Export"}</h4>
                    <p className="text-[10px] text-gray-400">ميناء بورتسودان الذكي، منفذ أرقين</p>
                  </div>
                </div>
              </div>

              {/* Supply chain risks Heatmap Matrix */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                    {currentLanguage === "ar" ? "مصفوفة مخاطر سلاسل الإمداد ومحاور التدخل" : "Supply Chain Risk Mitigations Matrix"}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold">محدث لحظياً: يوليو 2026</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border-collapse" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-black border-b border-gray-100">
                        <th className="p-3">{currentLanguage === "ar" ? "السلعة / القطاع الحرج" : "Critical Sector"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "مستوى المخاطر" : "Risk Level"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "سبب التهديد أو الاختناق" : "Primary Threat"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "الإجراءات الوقائية من الوزارة" : "Mitigating Action"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-slate-700 font-bold">
                      <tr>
                        <td className="p-3">صناعة الأدوية والمصل المستورد</td>
                        <td className="p-3 text-rose-600">عالي (High Risk)</td>
                        <td className="p-3">صعوبة تحويل العملات واستيراد المواد الفعالة</td>
                        <td className="p-3 text-emerald-600">تسريع تراخيص المصانع الوطنية وتفعيل الدفع الفوري عبر البنك المركزي</td>
                      </tr>
                      <tr>
                        <td className="p-3">عصر وتكرير زيوت الطعام</td>
                        <td className="p-3 text-amber-600">متوسط (Medium)</td>
                        <td className="p-3">تذبذب توريد السمسم والفول السوداني من كردفان</td>
                        <td className="p-3 text-emerald-600">تخصيص صوامع تخزين حكومية مجانية لتخزين احتياطي يكفي 90 يوماً</td>
                      </tr>
                      <tr>
                        <td className="p-3">تصدير الصمغ العربي المتطور</td>
                        <td className="p-3 text-emerald-600">منخفض (Low)</td>
                        <td className="p-3">تأثير طفيف في لوجستيات النقل البري لميناء بورتسودان</td>
                        <td className="p-3 text-emerald-600">تشغيل القافلة الحديدية الموحدة لنقل الحاويات أسبوعياً بإشراف أمني وجمركي ميسر</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: PERFORMANCE KPIS (Recharts) */}
          {activeTab === "kpis" && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Production trends */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">
                      {currentLanguage === "ar" ? "نمو الإنتاج الصناعي السنوي بالمليون طن" : "Annual Industrial Production Volume (Millions Tons)"}
                    </h4>
                    <p className="text-xs text-slate-400">توزيع الكفاءة الإنتاجية بين القطاعات الاستراتيجية المعتمدة</p>
                  </div>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={productionTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#007A33" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#007A33" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorChem" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontWeight="bold" />
                        <YAxis stroke="#94A3B8" fontSize={10} fontWeight="bold" />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                        <Area type="monotone" dataKey="صناعات غذائية" stroke="#007A33" fillOpacity={1} fill="url(#colorFood)" strokeWidth={2} />
                        <Area type="monotone" dataKey="صناعات كيميائية" stroke="#3B82F6" fillOpacity={1} fill="url(#colorChem)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Capacity Utilization */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">
                      {currentLanguage === "ar" ? "معدل استغلال القدرة التصميمية للمصانع %" : "Capacity Utilization Rate % by Sector"}
                    </h4>
                    <p className="text-xs text-slate-400">مقارنة الكفاءة الفعلية مع الحد الأدنى للاستحقاق الاقتصادي</p>
                  </div>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={capacityUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontWeight="bold" />
                        <YAxis stroke="#94A3B8" fontSize={10} fontWeight="bold" />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                        <Bar dataKey="الاستغلال المالي %" fill="#C5A059" radius={[5, 5, 0, 0]} />
                        <Bar dataKey="الحد الأدنى المستهدف %" fill="#E2E8F0" radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 7: ENVIRONMENTAL AND SAFETY COMPLIANCE */}
          {activeTab === "compliance" && (
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="h-5 w-5 text-sudan-green" />
                    {currentLanguage === "ar" ? "الامتثال البيئي والصحة السلامة المهنية الفيدرالية" : "Federal Environmental & Safety Compliance Audit Log"}
                  </h3>
                  <span className="text-xs text-sudan-green font-bold">متكامل مع نظام التفتيش الذكي</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border-collapse" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-black border-b border-gray-100">
                        <th className="p-3">اسم المنشأة الصناعية</th>
                        <th className="p-3">رخصة الانبعاث الكربوني</th>
                        <th className="p-3">نسبة الالتزام بالسلامة</th>
                        <th className="p-3">الخطوات التصحيحية المطلوبة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-slate-700 font-bold">
                      {environmentalLogs.map(log => (
                        <tr key={log.id}>
                          <td className="p-3">{log.factoryName}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded text-[10px] ${
                              log.permitStatus === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            }`}>
                              {log.permitStatus === "approved" ? "مرخص بيئياً" : "قيد المراجعة السنوية"}
                            </span>
                          </td>
                          <td className="p-3">{log.safetyScore}%</td>
                          <td className="p-3">
                            {log.actions === 0 ? (
                              <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> ملتزم بالكامل</span>
                            ) : (
                              <span className="text-rose-600 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 animate-bounce" /> تركيب فلاتر غازات عاجل</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: INVESTMENT AND INCENTIVES */}
          {activeTab === "incentives" && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Available incentives info card */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Coins className="h-5 w-5 text-sudan-gold" />
                    <h3 className="font-extrabold text-slate-800 text-sm">
                      {currentLanguage === "ar" ? "قائمة التسهيلات والحوافز الاستثمارية المعتمدة لعام 2026" : "Approved Industrial Grants & Subsidies"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                      <h4 className="font-extrabold text-sudan-green">1. إعفاء ضريبي تفضيلي كامل</h4>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        متاح للمصانع المقامة بالمدن الصناعية أو التي تزيد نسبة الصادرات لديها عن 40%، إعفاء ضريبي كامل لمدة تتراوح بين 5 إلى 10 سنوات.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                      <h4 className="font-extrabold text-sudan-green">2. دعم تمويل معدات الأتمتة والجيل الرابع</h4>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        منح مالية مخصصة لتحديث الآلات وتركيب مستشعرات إنترنت الأشياء، بالتعاون مع بنك السودان المركزي لتمويل الأتمتة بمرابحة ميسرة.
                      </p>
                    </div>
                  </div>

                  {/* Apply incentive form */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3.5">
                    <h4 className="font-black text-xs text-slate-800">
                      {currentLanguage === "ar" ? "تقديم طلب حافز استثماري جديد" : "Request New Industrial Incentive Support"}
                    </h4>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder={currentLanguage === "ar" ? "مثال: طلب إعفاء جمركي لقطع غيار توربينات" : "Incentive request title..."}
                        className="flex-1 bg-white border border-gray-200 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                      />
                      <button
                        onClick={() => {
                          setAppliedIncentives(prev => [...prev, { id: "inc-new", titleAr: "طلب تسهيل ضريبي للمواد الخام", status: "pending", grantAmount: "قيد التدقيق الفيدرالي" }]);
                          alert(currentLanguage === "ar" ? "تم تسجيل طلب التسهيلات بنجاح" : "Incentive application added successfully");
                        }}
                        className="bg-sudan-green text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "إرسال طلب" : "Apply"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Applied incentives status tracking table */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    {currentLanguage === "ar" ? "طلبات الحوافز الجارية الخاصة بك" : "Active Applications Status"}
                  </h4>

                  <div className="space-y-3 text-xs">
                    {appliedIncentives.map(inc => (
                      <div key={inc.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-slate-800">{inc.titleAr}</h5>
                          <p className="text-[10px] text-slate-400 mt-1">القيمة التقريبية: {inc.grantAmount}</p>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          inc.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {inc.status === "approved" ? "موافق عليه" : "تحت المراجعة والتدقيق"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 9: AI INDUSTRIAL ADVISOR */}
          {activeTab === "ai_advisor" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Scenario cards templates (2 columns) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Sparkles className="h-5 w-5 text-sudan-green animate-bounce" />
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    {currentLanguage === "ar" ? "مستشار الصناعة والذكاء الاستراتيجي الفيدرالي" : "Federal Industrial AI Strategic Advisor"}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-normal">
                  {currentLanguage === "ar" 
                    ? "اختر أحد النماذج الاستراتيجية الجاهزة لتحليل أداء مصانعك، التنبؤ بالاختناقات اللوجستية، واقتراح الحوافز المناسبة طبقاً لرؤية السودان التنموية:" 
                    : "Select a strategic model template to analyze dynamic performance, predict operational bottlenecks or fetch custom incentives:"}
                </p>

                {/* Templates selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: "recommend_incentives", titleAr: "📋 استحقاق الحوافز والمنح المتاحة", icon: Coins },
                    { id: "predict_bottlenecks", titleAr: "⚠️ التنبؤ باختناقات ومخاطر خطوط الإنتاج", icon: AlertTriangle },
                    { id: "forecast_growth", titleAr: "📈 توقعات النمو والتصدير للأسواق العالمية", icon: TrendingUp },
                    { id: "detect_risks", titleAr: "🛡️ تقييم المخاطر التشغيلية والسيبرانية", icon: ShieldAlert },
                    { id: "optimize_performance", titleAr: "⚙️ تحسين الكفاءة التشغيلية الموحدة OEE", icon: Activity },
                    { id: "recommend_inspections", titleAr: "🔍 جدولة تفتيش الرقابة والمطابقة الفنية", icon: Search }
                  ].map(tmpl => {
                    const TmplIcon = tmpl.icon;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => { setAiScenario(tmpl.id); }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          aiScenario === tmpl.id 
                            ? "border-sudan-green bg-sudan-green/5 ring-1 ring-sudan-green text-sudan-green font-extrabold" 
                            : "border-gray-200 hover:border-gray-300 bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl ${aiScenario === tmpl.id ? "bg-sudan-green text-white" : "bg-white text-slate-500 border"}`}>
                            <TmplIcon className="h-4 w-4" />
                          </div>
                          <span>{tmpl.titleAr}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Free form custom prompt */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <label className="text-xs font-bold text-slate-600">
                    {currentLanguage === "ar" ? "استفسار استراتيجي مخصص (اختياري)" : "Custom Strategic Query (Optional)"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiCustomPrompt}
                      onChange={(e) => setAiCustomPrompt(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: ما هي شروط الإعفاء لشركة نسيج في بورتسودان؟" : "e.g. What are the tax cut conditions for textile mills in Port Sudan?"}
                      className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3.5 py-3 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                    />
                    <button
                      onClick={runAIAdvisor}
                      disabled={aiLoading}
                      className="bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      {aiLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      <span>{currentLanguage === "ar" ? "تحليل الذكاء" : "Consult AI"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Generative Output Reader (1 column) */}
              <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-900 shadow-lg flex flex-col h-[500px]">
                <div className="border-b border-slate-800 pb-3 flex items-center gap-2 shrink-0">
                  <Sparkles className="h-4.5 w-4.5 text-sudan-gold animate-spin-slow" />
                  <span className="text-xs font-black text-sudan-gold tracking-wider uppercase">
                    {currentLanguage === "ar" ? "لوحة مخرجات الذكاء التنموي" : "Strategic Intelligence Output"}
                  </span>
                </div>

                {/* Scrollable output container */}
                <div className="flex-1 overflow-y-auto pt-4 text-xs font-medium leading-relaxed space-y-4">
                  {aiLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <span className="w-10 h-10 border-4 border-sudan-gold border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-400 font-bold">
                        {currentLanguage === "ar" ? "جاري استشارة نموذج الجيل القادم وتوليد التقرير الفيدرالي..." : "Analyzing parameters and compiling official executive advice..."}
                      </p>
                    </div>
                  ) : aiOutput ? (
                    <div className="whitespace-pre-line text-right" dir="rtl">
                      {aiOutput}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 space-y-2">
                      <Sparkles className="h-10 w-10 text-slate-800 animate-pulse" />
                      <p>اختر أحد السيناريوهات الجاهزة أو اكتب استفسارك، وسيتولى الذكاء الاصطناعي معالجة المعطيات وإصدار التوصيات.</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-500 text-center shrink-0">
                  مدعوم بنظام الذكاء الاصطناعي الفيدرالي الموحد - وزارة التجارة والصناعة
                </div>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Unified Industrial Licensing Application Wizard Modal */}
      <AnimatePresence>
        {isAppWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-gray-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#1E293B] text-white rounded-t-3xl">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="h-5 w-5 text-sudan-gold" />
                  <h3 className="font-extrabold text-sm">
                    {currentLanguage === "ar" ? "بوابة تقديم المعاملات والطلبات الصناعية الموحدة" : "Unified Industrial Applications Gateway"}
                  </h3>
                </div>
                <button onClick={() => setIsAppWizardOpen(false)} className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full text-white cursor-pointer transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {currentLanguage === "ar" ? "تم إرسال الطلب بنجاح للتدقيق الفيدرالي!" : "Application Submitted Successfully!"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {currentLanguage === "ar" 
                      ? "تم تدوين معاملتك وإدراجها في مسار المراجعة الفنية. يمكنك تتبعها في السجل الصناعي الموحد تحت فئة الطلبات الجارية." 
                      : "We have received your request. It has been securely listed on your unified progress dashboard."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWizardSubmit} className="p-6 space-y-4">
                  
                  {/* Action Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "نوع المعاملة الصناعية المطلوبة *" : "Request Type *"}</label>
                    <select
                      value={appType}
                      onChange={(e) => setAppType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green font-bold"
                    >
                      <option value="new_license">{currentLanguage === "ar" ? "تقديم رخصة تشغيل منشأة صناعية جديدة" : "New Factory Operating License"}</option>
                      <option value="expansion">{currentLanguage === "ar" ? "طلب توسيع منشأة صناعية أو إضافة خطوط" : "Capacity Expansion & Line Addition"}</option>
                      <option value="capacity_increase">{currentLanguage === "ar" ? "طلب زيادة الطاقة الإنتاجية المعتمدة" : "Production Capacity Increase"}</option>
                      <option value="modification">{currentLanguage === "ar" ? "طلب تعديل وتحديث النشاط الصناعي" : "Production Process Modification"}</option>
                      <option value="suspension">{currentLanguage === "ar" ? "طلب إيقاف مؤقت لأسباب فنية أو اقتصادية" : "Temporary Suspension Request"}</option>
                      <option value="renewal">{currentLanguage === "ar" ? "طلب تجديد الرخصة الموحدة منتهية الصلاحية" : "Unified License Renewal"}</option>
                    </select>
                  </div>

                  {/* Factory Basic info */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الاسم التجاري للمصنع أو المنشأة *" : "Factory Name *"}</label>
                    <input
                      type="text"
                      required
                      value={factoryName}
                      onChange={(e) => setFactoryName(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: مجمع النيل للصناعات الدوائية المحدودة" : "e.g. Nile Pharmaceutical Complex Ltd"}
                      className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                    />
                  </div>

                  {/* Sector & State Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "القطاع الصناعي *" : "Industrial Sector *"}</label>
                      <select
                        value={industrialSector}
                        onChange={(e) => setIndustrialSector(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white"
                      >
                        {sectors.map(s => (
                          <option key={s.value} value={s.value}>{currentLanguage === "ar" ? s.labelAr : s.labelEn}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "مقر الولاية *" : "State Location *"}</label>
                      <select
                        value={locationState}
                        onChange={(e) => setLocationState(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white"
                      >
                        {SUDANESE_STATES.map(s => (
                          <option key={s.id} value={s.nameAr}>{currentLanguage === "ar" ? s.nameAr : s.nameEn}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Capacity & Lines count */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الطاقة الإنتاجية السنوية *" : "Annual Capacity *"}</label>
                      <input
                        type="text"
                        required
                        value={productionCapacity}
                        onChange={(e) => setProductionCapacity(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "مثال: 120,000 طن سنوياً" : "e.g. 120,000 Tons Annually"}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "عدد خطوط التشغيل *" : "Production Lines Count *"}</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={productionLinesCount}
                        onChange={(e) => setProductionLinesCount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  {/* Workforce count & Environmental scale */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "إجمالي العمالة *" : "Total Workforce *"}</label>
                      <input
                        type="number"
                        required
                        min={5}
                        value={workforceCount}
                        onChange={(e) => setWorkforceCount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "فئة التصنيف البيئي *" : "Env Category *"}</label>
                      <select
                        value={environmentalClass}
                        onChange={(e) => setEnvironmentalClass(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                      >
                        <option value="A">Class A (صديق للبيئة)</option>
                        <option value="B">Class B (انبعاث طفيف)</option>
                        <option value="C">Class C (يتطلب فلاتر مخصصة)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "هل المنتج مخصص للتصدير؟ *" : "Export Target *"}</label>
                      <select
                        value={exportStatus}
                        onChange={(e) => setExportStatus(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                      >
                        <option value="yes">{currentLanguage === "ar" ? "نعم (تصدير إقليمي)" : "Yes (Export)"}</option>
                        <option value="no">{currentLanguage === "ar" ? "لا (سوق داخلي فقط)" : "No (Local Only)"}</option>
                      </select>
                    </div>
                  </div>

                  {/* Energy Source */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "مصدر تشغيل الطاقة المعتمد *" : "Primary Power Source *"}</label>
                    <input
                      type="text"
                      required
                      value={energySource}
                      onChange={(e) => setEnergySource(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: طاقة شمسية كهروضوئية هجينة 120 كيلو واط" : "e.g. 120kW Solar PV Hybrid"}
                      className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  {/* Federal Security and linkage warning */}
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-2 text-[10px] leading-relaxed text-amber-800 font-bold">
                    <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      يرتبط هذا الطلب تلقائياً ببوابة السجل التجاري الموحد ووزارة المالية لتجنب تكرار الوثائق وتسهيل منح الحوافز الجمركية والضريبية فور صدور شهادة المطابقة البيئية والصناعية لعام 2026.
                    </p>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-4 border-t border-gray-100 flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsAppWizardOpen(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold cursor-pointer transition-colors"
                    >
                      {currentLanguage === "ar" ? "إلغاء المعاملة" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2.5 rounded-xl font-black cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                    >
                      {isSubmitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                      {currentLanguage === "ar" ? "تقديم المعاملة وتدقيق الطلب" : "Submit & Verify Request"}
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
