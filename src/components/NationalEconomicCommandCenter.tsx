/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * Phase Twenty-Four: National Economic Command Center & Crisis Management Platform
 * Integrated Sovereign Situation Room, Early Warning System & AI Decision Support
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, ShieldAlert, ShieldCheck, Activity, AlertTriangle, Play, RefreshCw, 
  Layers, Landmark, Users, Globe, BarChart3, LineChart as LineChartIcon,
  Search, Terminal, Send, CheckCircle2, AlertCircle, FileText, Download,
  Volume2, VolumeX, HelpCircle, Flame, Server, Cpu, Truck, HelpCircle as HelpIcon,
  Briefcase, TrendingUp, Compass, Settings, Radio, Plus, Trash2, Check, Scale
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell
} from "recharts";

// TypeScript Interfaces for Crisis & Economic Monitoring
interface CrisisIncident {
  id: string;
  titleAr: string;
  titleEn: string;
  category: "supply_chain" | "inflation" | "disruption" | "infrastructure";
  severity: "critical" | "high" | "medium" | "low";
  status: "detection" | "validation" | "coordination" | "execution" | "resolved";
  assignedAgency: string;
  date: string;
  descriptionAr: string;
  descriptionEn: string;
}

interface EarlyWarningAlert {
  id: string;
  indicatorAr: string;
  indicatorEn: string;
  currentValue: string;
  threshold: string;
  status: "danger" | "warning" | "stable";
  sectorAr: string;
  sectorEn: string;
}

interface DecisionAlternative {
  id: string;
  titleAr: string;
  titleEn: string;
  gdpImpact: string;
  socialCost: string;
  feasibility: number; // percentage
  riskScore: number; // 1-100
  aiRecommendation: string;
}

export default function NationalEconomicCommandCenter({
  currentLanguage,
  role = "admin"
}: {
  currentLanguage: "ar" | "en";
  role?: string;
}) {
  // Navigation tabs inside Command Center
  const [activeTab, setActiveTab] = useState<"situation" | "crisis" | "warning" | "decisions" | "prediction" | "resources">("situation");
  
  // Custom states
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<"all" | "crisis" | "company" | "geographic">("all");
  const [isAiBroadcasting, setIsAiBroadcasting] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  
  // Crisis Registration & Lifecycle (Module 2)
  const [crises, setCrises] = useState<CrisisIncident[]>([
    {
      id: "CRS-2026-01",
      titleAr: "انقطاع سلاسل إمداد القمح بالبحر الأحمر",
      titleEn: "Red Sea Wheat Supply Chain Disruption",
      category: "supply_chain",
      severity: "critical",
      status: "coordination",
      assignedAgency: "Federal Food Security Council",
      date: "2026-07-18",
      descriptionAr: "تعطل عبور ناقلات القمح الموجهة لمطاحن غلال بورتسودان بسبب اضطرابات الملاحة الإقليمية.",
      descriptionEn: "Transit delays for sovereign grain carriers bound for Port Sudan milling centers due to regional maritime challenges."
    },
    {
      id: "CRS-2026-02",
      titleAr: "ارتفاع تضخم زيوت الطعام في أسواق الخرطوم والجزيرة",
      titleEn: "Edible Oil Price Spike in Central Markets",
      category: "inflation",
      severity: "high",
      status: "execution",
      assignedAgency: "Consumer Protection Agency",
      date: "2026-07-19",
      descriptionAr: "ممارسات احتكارية تم رصدها من بعض الموردين أدت لارتفاع الأسعار بنسبة 35% خلال أسبوع.",
      descriptionEn: "Uncompetitive supplier practices detected, resulting in a 35% local price spike over a single trading week."
    },
    {
      id: "CRS-2026-03",
      titleAr: "عجز الطاقة في مجمع الباقير الصناعي",
      titleEn: "Power Deficiency at El Bagair Industrial Complex",
      category: "infrastructure",
      severity: "medium",
      status: "validation",
      assignedAgency: "Ministry of Industrial Infrastructure",
      date: "2026-07-15",
      descriptionAr: "انقطاع خطوط الإمداد الكهربائي المغذية لمصانع الغزل والصناعات الدوائية.",
      descriptionEn: "Power infrastructure overload affecting sovereign cotton mills and local pharmaceutical labs."
    }
  ]);

  const [newCrisis, setNewCrisis] = useState({
    titleAr: "",
    titleEn: "",
    category: "supply_chain" as any,
    severity: "medium" as any,
    descriptionAr: "",
    descriptionEn: ""
  });

  // Early Warning Indicators (Module 3)
  const [warnings, setWarnings] = useState<EarlyWarningAlert[]>([
    { id: "W1", indicatorAr: "احتياطي الدقيق الفيدرالي الاستراتيجي", indicatorEn: "Federal Strategic Flour Reserves", currentValue: "18 Days", threshold: "30 Days min", status: "danger", sectorAr: "الأمن الغذائي", sectorEn: "Food Security" },
    { id: "W2", indicatorAr: "مؤشر أسعار سلة المواد الاستهلاكية الأساسية", indicatorEn: "Core Consumer Goods Basket Index", currentValue: "+24% YoY", threshold: "+15% YoY max", status: "warning", sectorAr: "حماية المستهلك", sectorEn: "Consumer Protection" },
    { id: "W3", indicatorAr: "إمدادات الوقود للمناطق الصناعية الكبرى", indicatorEn: "Industrial Diesel Logistics Flow", currentValue: "94% Normal", threshold: "90% min", status: "stable", sectorAr: "الصناعة", sectorEn: "Industry" },
    { id: "W4", indicatorAr: "حجم الصادرات غير النفطية عبر ميناء بورتسودان", indicatorEn: "Non-Oil Sovereign Exports volume", currentValue: "-8.5%", threshold: "-5.0% max deviation", status: "warning", sectorAr: "التجارة الخارجية", sectorEn: "Foreign Trade" }
  ]);

  // Scenario Simulator & What-If variables (Module 4)
  const [inflationTrigger, setInflationTrigger] = useState<number>(14); // %
  const [currencyStability, setCurrencyStability] = useState<number>(75); // % stability rating
  const [supplyChainImpact, setSupplyChainImpact] = useState<number>(20); // % disruption
  const [simulatedGdpLoss, setSimulatedGdpLoss] = useState<number>(1.2);
  const [simulatedRiskScore, setSimulatedRiskScore] = useState<number>(45);

  // Recalculate Scenario Outcomes
  useEffect(() => {
    // Simple mock formula based on input parameters to represent "What-if" scenario engine
    const baseLoss = (supplyChainImpact * 0.08) + (inflationTrigger * 0.12) - ((currencyStability - 50) * 0.03);
    const roundedLoss = Math.max(0.1, Math.round(baseLoss * 10) / 10);
    setSimulatedGdpLoss(roundedLoss);

    const baseRisk = (supplyChainImpact * 1.5) + (inflationTrigger * 2.5) + (100 - currencyStability);
    const roundedRisk = Math.min(100, Math.max(10, Math.round(baseRisk)));
    setSimulatedRiskScore(roundedRisk);
  }, [inflationTrigger, currencyStability, supplyChainImpact]);

  // Strategic Alternatives Options
  const decisionAlternatives: DecisionAlternative[] = [
    {
      id: "ALT-01",
      titleAr: "الإفراج الفوري عن الاحتياطي الاستراتيجي المبرم في صوامع القضارف",
      titleEn: "Immediate Release of Strategic Reserves from Al-Qadarif Silos",
      gdpImpact: "+0.6% recovery",
      socialCost: "Minimal (1.2M SDG logistics cost)",
      feasibility: 95,
      riskScore: 18,
      aiRecommendation: "Highly Recommended. Relieves central market bread inflation within 48 hours."
    },
    {
      id: "ALT-02",
      titleAr: "تخفيض التعريفة الجمركية بنسبة 50% على مدخلات الإنتاج الصناعي المستوردة",
      titleEn: "50% Custom Duty Relief on Imported Industrial Inputs",
      gdpImpact: "+1.8% long-term",
      socialCost: "Medium (Sovereign customs revenue drop)",
      feasibility: 82,
      riskScore: 35,
      aiRecommendation: "Recommended for Al-Bagair industrial recovery but requires Cabinet authorization."
    },
    {
      id: "ALT-03",
      titleAr: "فرض تسعير جبري وتحديد هوامش الربح القصوى لزيوت الطعام",
      titleEn: "Enforced Sovereign Pricing and Margin Caps on Edible Oils",
      gdpImpact: "-0.4% market confidence loss",
      socialCost: "High (Potential merchant black-market withholding)",
      feasibility: 60,
      riskScore: 78,
      aiRecommendation: "Not Recommended. Encourages hoarding and degrades long-term market trust."
    }
  ];

  // Resource Allocation & Logistics (Module 7)
  const [emergencyResources, setEmergencyResources] = useState<any[]>([
    { id: "RES-01", nameAr: "فرق التفتيش السريع لحماية المستهلك", nameEn: "Consumer Protection Rapid Response Teams", allocated: 12, standby: 8, location: "Khartoum, Port Sudan" },
    { id: "RES-02", nameAr: "قوافل النقل الفيدرالية للسلع الضرورية", nameEn: "Federal Sovereign Food Transport Fleet", allocated: 45, standby: 15, location: "Al-Qadarif to Central Hubs" },
    { id: "RES-03", nameAr: "مفتشو مكافحة الاحتكار ومراقبة الأسواق", nameEn: "Anti-Monopoly & Price Inspection Agents", allocated: 18, standby: 6, location: "Port Sudan Trade Hub" }
  ]);

  // Executive Communications & Messages (Module 9)
  const [ministryMessages, setMinistryMessages] = useState<any[]>([
    { sender: "Sovereign Minister", role: "Minister", messageAr: "يرجى تحضير مسودة القرار التنفيذي رقم ٢٤ للإفراج عن القمح المستورد خلال ساعة.", messageEn: "Please prepare Sovereign Decree No. 24 for releasing wheat reserves within the hour.", time: "09:12 AM" },
    { sender: "Undersecretary", role: "Undersecretary", messageAr: "فرق التفتيش جاهزة للتوزيع الميداني بالتنسيق مع سلطات بورتسودان.", messageEn: "Rapid response inspection teams are fully briefed and standing by in Port Sudan.", time: "09:25 AM" }
  ]);
  const [newMessageText, setNewMessageText] = useState<string>("");

  // System status logs
  const [auditLogs, setAuditLogs] = useState<string[]>([
    "Sovereign Economic Situation Room established.",
    "Real-time feed connected to Port Sudan Custom Ledger database.",
    "AI Predictive Engine loaded model: Vision-2035-Crisis-Scoring-v4.",
    "Early Warning threshold warning triggered for wheat reserves."
  ]);

  // Voice output function for AI advisor
  const handleAiAdvisorBroadcast = () => {
    setIsAiBroadcasting(true);
    const briefAr = "تقرير المساعد الاستراتيجي: تم رصد زيادة طارئة في مؤشر المخاطر بنسبة ١٥٪ بسبب تراجع احتياطي الدقيق الفيدرالي. ننصح بتفعيل البديل الاستراتيجي الأول المتمثل في تحويل شحنات القمح عبر القضارف وتخفيف الرسوم فوراً.";
    const briefEn = "Strategic Advisory Alert: Risk score increased by 15% due to federal grain reserve delays. AI model strongly recommends activating Strategy Alternative 1 to dispatch reserve grain from Al-Qadarif.";
    
    setTimeout(() => {
      setIsAiBroadcasting(false);
      setAuditLogs(prev => ["AI Strategic Advisory broadcasted speech output.", ...prev]);
      if (speechEnabled && window.speechSynthesis) {
        const text = currentLanguage === "ar" ? briefAr : briefEn;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === "ar" ? "ar-SA" : "en-US";
        window.speechSynthesis.speak(utterance);
      }
    }, 1500);
  };

  // Add a new crisis incident
  const handleCreateCrisis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrisis.titleAr || !newCrisis.titleEn) return;

    const incident: CrisisIncident = {
      id: `CRS-2026-0${crises.length + 1}`,
      titleAr: newCrisis.titleAr,
      titleEn: newCrisis.titleEn,
      category: newCrisis.category,
      severity: newCrisis.severity,
      status: "detection",
      assignedAgency: "Ministry Taskforce Team 1",
      date: new Date().toISOString().split("T")[0],
      descriptionAr: newCrisis.descriptionAr || "لم يتم تقديم تفاصيل.",
      descriptionEn: newCrisis.descriptionEn || "No English description provided."
    };

    setCrises([incident, ...crises]);
    setAuditLogs(prev => [`New crisis registered: ${incident.id} (${incident.titleEn})`, ...prev]);
    setNewCrisis({
      titleAr: "",
      titleEn: "",
      category: "supply_chain",
      severity: "medium",
      descriptionAr: "",
      descriptionEn: ""
    });
  };

  // Move crisis through lifecycle steps
  const advanceCrisisWorkflow = (id: string) => {
    const nextStatusMap: { [key: string]: "validation" | "coordination" | "execution" | "resolved" } = {
      detection: "validation",
      validation: "coordination",
      coordination: "execution",
      execution: "resolved",
      resolved: "resolved"
    };

    setCrises(prev =>
      prev.map(c => {
        if (c.id === id) {
          const next = nextStatusMap[c.status] || "resolved";
          setAuditLogs(prevLogs => [`Incident ${id} workflow advanced to: ${next.toUpperCase()}`, ...prevLogs]);
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  // Crisis search & filtering logic
  const filteredCrises = crises.filter(c => {
    // Severity Filter
    if (selectedSeverityFilter !== "all" && c.severity !== selectedSeverityFilter) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = (c.titleAr + c.titleEn + c.descriptionAr + c.descriptionEn + c.id).toLowerCase();
      return matchText.includes(q);
    }
    return true;
  });

  // Recharts Data for Economic indicators (Module 5)
  const economicTrendData = [
    { period: "Q1-25", inflation: 12.4, gdpGrowth: 1.8, industrialOutput: 78 },
    { period: "Q2-25", inflation: 13.8, gdpGrowth: 1.9, industrialOutput: 82 },
    { period: "Q3-25", inflation: 14.1, gdpGrowth: 2.1, industrialOutput: 85 },
    { period: "Q4-25", inflation: 15.2, gdpGrowth: 2.3, industrialOutput: 89 },
    { period: "Q1-26", inflation: 16.5, gdpGrowth: 2.0, industrialOutput: 81 },
    { period: "Q2-26", inflation: 17.8, gdpGrowth: 1.6, industrialOutput: 74 }, // Disruption dip
    { period: "Current", inflation: 18.2, gdpGrowth: 1.4, industrialOutput: 71 }
  ];

  return (
    <div id="national-command-center-root" className="bg-slate-950 text-slate-100 p-5 md:p-7 border border-slate-800 rounded-xl shadow-2xl relative overflow-hidden font-sans">
      
      {/* Dynamic scan line effect to resemble a command room screen */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-red-500/20 shadow-lg animate-pulse"></div>

      {/* SOVEREIGN STATUS BANNER & COMMAND CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-950 border border-red-500/40 p-3 rounded-lg text-red-400 relative">
            <Radio className="h-6 w-6 animate-pulse" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{currentLanguage === "ar" ? "غرفة طوارئ القيادة الاقتصادية والأزمات الفيدرالية" : "National Economic Command Center & Crisis Room"}</span>
              <span className="bg-red-900/30 text-red-400 text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-red-500/20">Sovereign Live Feed</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {currentLanguage === "ar" 
                ? "الرصد الاقتصادي الفوري، إدارة الطوارئ واللوجستيات الاستراتيجية، محاكاة السيناريوهات، والتنبؤ الاصطناعي برؤية السودان ٢٠٣٥" 
                : "Real-time economic risk monitoring, multi-agency response dispatch, AI policy simulator & sovereign resilience index"}
            </p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-3">
          {/* Text-to-Speech Toggle */}
          <button 
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${speechEnabled ? "bg-red-950/40 border-red-500/30 text-red-400" : "bg-slate-900 border-slate-800 text-gray-500"}`}
            title="Toggle Voice Broadcast"
          >
            {speechEnabled ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
          </button>

          {/* AI Advisor Trigger Button */}
          <button
            onClick={handleAiAdvisorBroadcast}
            disabled={isAiBroadcasting}
            className="bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-xs py-2 px-3.5 rounded-lg border border-red-600/30 flex items-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer"
          >
            <Cpu className={`h-4 w-4 ${isAiBroadcasting ? "animate-spin" : ""}`} />
            <span>{currentLanguage === "ar" ? "تقرير المساعد الاستراتيجي للذكاء الاصطناعي" : "Sovereign AI Strategic Advisor"}</span>
          </button>
        </div>
      </div>

      {/* CORE STATS BAR (National Economic Readiness & Stability index) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        
        <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-gray-400 uppercase font-mono block">{currentLanguage === "ar" ? "مستوى التأهب القومي" : "National Crisis Level"}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-red-500">LEVEL 3</span>
            <span className="bg-red-950 text-red-400 text-[8px] font-mono px-1.5 rounded">HIGH ALERT</span>
          </div>
          <div className="w-full bg-slate-800 h-1 mt-2.5 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-3/4"></div>
          </div>
        </div>

        <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-gray-400 uppercase font-mono block">{currentLanguage === "ar" ? "مؤشر استقرار الأسواق" : "Market Stability Index"}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-amber-500">71.8%</span>
            <span className="text-[8px] text-red-400 font-mono">-4.5%</span>
          </div>
          <div className="w-full bg-slate-800 h-1 mt-2.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[71.8%]"></div>
          </div>
        </div>

        <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-gray-400 uppercase font-mono block">{currentLanguage === "ar" ? "سلامة سلاسل الإمداد" : "Supply Chain Health"}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-rose-500">62.0%</span>
            <span className="text-[8px] text-red-400 font-mono">-12.0%</span>
          </div>
          <div className="w-full bg-slate-800 h-1 mt-2.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full w-[62%]"></div>
          </div>
        </div>

        <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-gray-400 uppercase font-mono block">{currentLanguage === "ar" ? "ثقة المستهلك القومية" : "Consumer Confidence"}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-emerald-400">84.5%</span>
            <span className="text-[8px] text-emerald-400 font-mono">+1.2%</span>
          </div>
          <div className="w-full bg-slate-800 h-1 mt-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-[84.5%]"></div>
          </div>
        </div>

        <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-800/80 col-span-2 md:col-span-1">
          <span className="text-[10px] text-gray-400 uppercase font-mono block">{currentLanguage === "ar" ? "مؤشر المرونة القومية ٢٠٣٥" : "National Resilience Index"}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-teal-400 font-mono">VISION-HIGH</span>
          </div>
          <div className="w-full bg-slate-800 h-1 mt-2.5 rounded-full overflow-hidden">
            <div className="bg-teal-400 h-full w-5/6"></div>
          </div>
        </div>

      </div>

      {/* LEVEL 2 INTERACTIVE NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
        {[
          { id: "situation", labelAr: "🖥️ غرفة العمليات والبيانات", labelEn: "🖥️ Situation Room & KPIs", icon: Layers },
          { id: "crisis", labelAr: "🚨 إدارة وتتبع الأزمات الفيدرالية", labelEn: "🚨 Federal Crisis Tracker", icon: Flame },
          { id: "warning", labelAr: "⚠️ إنذار مبكر ومخاطر التجارة", labelEn: "⚠️ Early Warning Indicators", icon: ShieldAlert },
          { id: "decisions", labelAr: "⚖️ صانع القرار ومحاكاة البدائل", labelEn: "⚖️ Policy Simulator & What-If", icon: Scale },
          { id: "prediction", labelAr: "🔮 التنبؤ والذكاء التنبؤي للأعطال", labelEn: "🔮 AI Predictive Intelligence", icon: TrendingUp },
          { id: "resources", labelAr: "🚛 تنسيق الموارد والفرق اللوجستية", labelEn: "🚛 Resource Deployment", icon: Truck }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all duration-150 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-red-950/40 border-red-500/40 text-red-400 shadow-md shadow-red-950/20"
                  : "bg-slate-900/60 border-slate-800/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT GRID */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: EXECUTIVE SITUATION ROOM */}
        {activeTab === "situation" && (
          <motion.div
            key="situation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Economic Trend Charts (Module 5) */}
            <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <LineChartIcon className="h-4.5 w-4.5 text-red-400" />
                    <span>{currentLanguage === "ar" ? "رصد المنحنيات الاقتصادية الحيوية ومعدلات التضخم" : "Sovereign Economic Real-time Trends"}</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">{currentLanguage === "ar" ? "المقارنة التاريخية لمعدل التضخم والإنتاج الصناعي" : "Quarterly historical and simulated macro performance curves"}</p>
                </div>
                <span className="text-[10px] font-mono text-gray-500">Database: FED_DB_PORT3000</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={economicTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInflation" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                    <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
                    <Area type="monotone" dataKey="inflation" name={currentLanguage === "ar" ? "التضخم المقاس (%)" : "Inflation Rate (%)"} stroke="#ef4444" fillOpacity={1} fill="url(#colorInflation)" />
                    <Area type="monotone" dataKey="industrialOutput" name={currentLanguage === "ar" ? "الإنتاج الصناعي (%)" : "Industrial Index (%)"} stroke="#10b981" fillOpacity={1} fill="url(#colorOutput)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4 pt-4 border-t border-slate-800/60 text-xs">
                <div className="bg-slate-900/40 p-2.5 rounded border border-slate-800/85">
                  <span className="text-gray-400 block">{currentLanguage === "ar" ? "إيرادات الصادرات (أسبوعي)" : "Export Proceeds (Weekly)"}</span>
                  <span className="text-sm font-black text-white block mt-0.5">4.8M USD</span>
                  <span className="text-[10px] text-red-400 font-mono">▼ 8.2% from mean</span>
                </div>
                <div className="bg-slate-900/40 p-2.5 rounded border border-slate-800/85">
                  <span className="text-gray-400 block">{currentLanguage === "ar" ? "الاستثمارات الأجنبية المفعلة" : "Sovereign FDI Committed"}</span>
                  <span className="text-sm font-black text-white block mt-0.5">14.5M USD</span>
                  <span className="text-[10px] text-emerald-400 font-mono">▲ Stable inflows</span>
                </div>
                <div className="bg-slate-900/40 p-2.5 rounded border border-slate-800/85">
                  <span className="text-gray-400 block">{currentLanguage === "ar" ? "الرقم القياسي لأسعار المواد" : "Commodity Price Index"}</span>
                  <span className="text-sm font-black text-white block mt-0.5">241.9 Points</span>
                  <span className="text-[10px] text-red-400 font-mono">▲ Historical pressure</span>
                </div>
              </div>
            </div>

            {/* Live Incidents Feed (Module 1) */}
            <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-3.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-4.5 w-4.5 text-red-500" />
                    <span>{currentLanguage === "ar" ? "شريط الأحداث الفورية الفيدرالية" : "Sovereign Incident Feed"}</span>
                  </span>
                  <span className="text-[9px] bg-slate-800 border border-slate-700 text-gray-300 px-1.5 py-0.2 rounded font-mono uppercase">Live logs</span>
                </h3>

                <div className="space-y-3.5 max-h-[290px] overflow-y-auto scrollbar-none pr-1">
                  {auditLogs.map((log, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-[11px] font-mono leading-normal">
                      <span className="text-red-500 mt-1">●</span>
                      <div className="text-gray-300">
                        <span className="text-gray-500 font-normal mr-1">[{new Date().toLocaleTimeString()}]</span>
                        {log}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minister and Emergency Committee Hotlines */}
              <div className="border-t border-slate-800/80 pt-4 mt-4">
                <div className="text-[10px] uppercase font-mono text-gray-500 mb-2">{currentLanguage === "ar" ? "قناة الاتصال الفيدرالي الآمنة" : "Secure Inter-Cabinet Comm Link"}</div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-xs flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-semibold">Emergency Comm Room</span>
                    <span className="text-emerald-400 font-mono text-[9px] flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> ACTIVE
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto scrollbar-none text-[11px]">
                    {ministryMessages.map((msg, index) => (
                      <div key={index} className="text-gray-300">
                        <span className="text-[#D4AF37] font-semibold">{msg.sender}: </span>
                        <span>{currentLanguage === "ar" ? msg.messageAr : msg.messageEn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1.5 mt-1 border-t border-slate-900 pt-2">
                    <input
                      type="text"
                      placeholder={currentLanguage === "ar" ? "أرسل برقية آمنة..." : "Send secure memo..."}
                      value={newMessageText}
                      onChange={e => setNewMessageText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && newMessageText) {
                          setMinistryMessages([...ministryMessages, { sender: "Executive Command Office", role: "Staff", messageAr: newMessageText, messageEn: newMessageText, time: "Just now" }]);
                          setNewMessageText("");
                        }
                      }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] outline-none text-white focus:border-red-500"
                    />
                    <button
                      onClick={() => {
                        if (newMessageText) {
                          setMinistryMessages([...ministryMessages, { sender: "Executive Command Office", role: "Staff", messageAr: newMessageText, messageEn: newMessageText, time: "Just now" }]);
                          setNewMessageText("");
                        }
                      }}
                      className="bg-red-800 hover:bg-red-700 text-white rounded p-1 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: CRISIS REGISTRATION & LIFECYCLE */}
        {activeTab === "crisis" && (
          <motion.div
            key="crisis"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Crisis Incident List */}
            <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{currentLanguage === "ar" ? "قائمة الأزمات والحوادث الطارئة النشطة" : "Active Crisis incidents Ledger"}</h3>
                  <p className="text-[11px] text-gray-400">{currentLanguage === "ar" ? "تتبع دورة حياة الأزمات من الرصد والتحقق إلى المعالجة والحل" : "Formal crisis lifecycle progression and inter-agency dispatch status"}</p>
                </div>

                {/* Filter and search */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                    <input
                      type="text"
                      placeholder={currentLanguage === "ar" ? "بحث عن أزمة..." : "Search incidents..."}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-red-500 outline-none w-44"
                    />
                  </div>

                  <select
                    value={selectedSeverityFilter}
                    onChange={e => setSelectedSeverityFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs rounded-lg p-1.5 text-white cursor-pointer"
                  >
                    <option value="all">{currentLanguage === "ar" ? "كل الحالات" : "All Severities"}</option>
                    <option value="critical">{currentLanguage === "ar" ? "حرجة" : "Critical"}</option>
                    <option value="high">{currentLanguage === "ar" ? "عالية" : "High"}</option>
                    <option value="medium">{currentLanguage === "ar" ? "متوسطة" : "Medium"}</option>
                  </select>
                </div>
              </div>

              {/* Incidents Table / List */}
              <div className="space-y-4">
                {filteredCrises.length === 0 ? (
                  <div className="p-10 text-center bg-slate-950/40 rounded-lg border border-slate-900 text-gray-500 text-xs">
                    {currentLanguage === "ar" ? "لا توجد أزمات مطابقة لخيارات البحث." : "No strategic crises matched your filter options."}
                  </div>
                ) : (
                  filteredCrises.map(incident => (
                    <div key={incident.id} className="bg-slate-950/80 p-4 rounded-xl border border-slate-900/80 hover:border-red-500/30 transition-all flex flex-col md:flex-row justify-between gap-4">
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-black ${
                            incident.severity === "critical"
                              ? "bg-red-950 text-red-400 border border-red-500/30"
                              : incident.severity === "high"
                              ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                              : "bg-blue-950 text-blue-400 border border-blue-500/30"
                          }`}>
                            {incident.severity}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">{incident.id} | {incident.date}</span>
                        </div>

                        <h4 className="text-sm font-bold text-white">
                          {currentLanguage === "ar" ? incident.titleAr : incident.titleEn}
                        </h4>

                        <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                          {currentLanguage === "ar" ? incident.descriptionAr : incident.descriptionEn}
                        </p>

                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-mono text-gray-500 pt-1">
                          <span>Dispatch: <strong className="text-gray-300">{incident.assignedAgency}</strong></span>
                          <span>Category: <strong className="text-gray-300">{incident.category.toUpperCase()}</strong></span>
                        </div>
                      </div>

                      {/* Workflow state tracker */}
                      <div className="flex flex-col items-start md:items-end justify-between shrink-0 gap-3">
                        <div className="text-right">
                          <span className="text-[9px] uppercase text-gray-500 font-mono block mb-1">Workflow Phase</span>
                          <span className="px-2.5 py-0.8 rounded-full text-[10px] font-bold font-mono uppercase bg-slate-900 border border-slate-800 text-red-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                            {incident.status}
                          </span>
                        </div>

                        {incident.status !== "resolved" && (
                          <button
                            onClick={() => advanceCrisisWorkflow(incident.id)}
                            className="text-[10px] bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/30 px-3 py-1 rounded font-bold flex items-center gap-1 transition-all cursor-pointer w-full md:w-auto justify-center"
                          >
                            <Play className="h-3 w-3" />
                            <span>{currentLanguage === "ar" ? "تقديم مرحلة الحل" : "Advance Workflow"}</span>
                          </button>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Register a New Incident Form (Module 2) */}
            <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
              <form onSubmit={handleCreateCrisis} className="space-y-4">
                <div className="pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-red-500" />
                    <span>{currentLanguage === "ar" ? "تسجيل أزمة طارئة جديدة" : "Register Sovereign Incident"}</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{currentLanguage === "ar" ? "صلاحيات المنسق الفيدرالي للطوارئ" : "Requires Federal Command Clearance"}</p>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 block mb-1">{currentLanguage === "ar" ? "عنوان الأزمة (عربي)" : "Crisis Title (Arabic)"}</label>
                  <input
                    type="text"
                    required
                    value={newCrisis.titleAr}
                    onChange={e => setNewCrisis({ ...newCrisis, titleAr: e.target.value })}
                    placeholder="مثال: تعطل الملاحة البحرية..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 block mb-1">{currentLanguage === "ar" ? "عنوان الأزمة (إنجليزي)" : "Crisis Title (English)"}</label>
                  <input
                    type="text"
                    required
                    value={newCrisis.titleEn}
                    onChange={e => setNewCrisis({ ...newCrisis, titleEn: e.target.value })}
                    placeholder="e.g. Grain Cargo Vessel Delay..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 block mb-1">Category</label>
                    <select
                      value={newCrisis.category}
                      onChange={e => setNewCrisis({ ...newCrisis, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white cursor-pointer"
                    >
                      <option value="supply_chain">Supply Chain</option>
                      <option value="inflation">Inflation</option>
                      <option value="disruption">Market Disruption</option>
                      <option value="infrastructure">Infrastructure</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 block mb-1">Severity</label>
                    <select
                      value={newCrisis.severity}
                      onChange={e => setNewCrisis({ ...newCrisis, severity: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white cursor-pointer"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 block mb-1">{currentLanguage === "ar" ? "وصف الأزمة والتدابير العاجلة" : "Detailed Context"}</label>
                  <textarea
                    rows={3}
                    value={newCrisis.descriptionAr}
                    onChange={e => setNewCrisis({ ...newCrisis, descriptionAr: e.target.value, descriptionEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-red-500"
                    placeholder="التفاصيل الجغرافية والمخاطر المترتبة..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-800 hover:bg-red-700 text-white font-bold text-xs py-2 rounded border border-red-600/30 shadow-lg cursor-pointer"
                >
                  {currentLanguage === "ar" ? "إعلان حالة الطوارئ وتسجيل الأزمة" : "Dispatch Crisis Alert"}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 3: NATIONAL EARLY WARNING SYSTEM */}
        {activeTab === "warning" && (
          <motion.div
            key="warning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Warning Cards List (Module 3) */}
            <div className="lg:col-span-12 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert className="h-4.5 w-4.5 text-amber-500" />
                    <span>{currentLanguage === "ar" ? "مؤشرات الحذر والإنذار المبكر للتجارة والاستيراد" : "National Commercial Early Warning System (Sovereign Indicators)"}</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">{currentLanguage === "ar" ? "رصد تخطي الحدود المرجعية لتدفق السلع والخدمات" : "Real-time safety bounds threshold validation feed"}</p>
                </div>
                <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">4 Active Warns</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {warnings.map(warn => (
                  <div key={warn.id} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between relative overflow-hidden">
                    {warn.status === "danger" && <div className="absolute top-0 inset-x-0 h-[3px] bg-red-500"></div>}
                    {warn.status === "warning" && <div className="absolute top-0 inset-x-0 h-[3px] bg-amber-500"></div>}
                    {warn.status === "stable" && <div className="absolute top-0 inset-x-0 h-[3px] bg-emerald-500"></div>}

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] font-mono text-gray-500">{warn.id}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono uppercase font-black ${
                          warn.status === "danger" 
                            ? "bg-red-950/60 text-red-400" 
                            : warn.status === "warning" 
                            ? "bg-amber-950/60 text-amber-400" 
                            : "bg-emerald-950/60 text-emerald-400"
                        }`}>
                          {warn.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">
                        {currentLanguage === "ar" ? warn.indicatorAr : warn.indicatorEn}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-slate-900 flex justify-between items-baseline">
                      <div>
                        <span className="text-[8px] text-gray-500 uppercase block">Current</span>
                        <span className={`text-sm font-black ${warn.status === "danger" ? "text-red-400" : warn.status === "warning" ? "text-amber-400" : "text-emerald-400"}`}>
                          {warn.currentValue}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-gray-500 uppercase block">Threshold</span>
                        <span className="text-xs text-gray-300 font-mono">{warn.threshold}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-[9px] text-gray-400 flex items-center justify-between pt-1">
                      <span>Sector: {currentLanguage === "ar" ? warn.sectorAr : warn.sectorEn}</span>
                      <button
                        onClick={() => {
                          setAuditLogs(prev => [`Cleared alert status for ${warn.id}`, ...prev]);
                          setWarnings(prev => prev.map(w => w.id === warn.id ? { ...w, status: "stable", currentValue: "Compliant" } : w));
                        }}
                        className="text-[8px] text-emerald-400 hover:underline cursor-pointer"
                      >
                        Reset Limit
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Action plan guideline */}
              <div className="mt-6 bg-slate-950/80 p-4 rounded-xl border border-slate-900 text-xs">
                <h4 className="font-bold text-white mb-2 flex items-center gap-1.5 text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{currentLanguage === "ar" ? "بروتوكول تفعيل خطة الطوارئ الوطنية للأغذية" : "Emergency Grain Import Activation Guideline"}</span>
                </h4>
                <p className="text-gray-400 leading-relaxed mb-3">
                  {currentLanguage === "ar" 
                    ? "عند تراجع احتياطي الدقيق الفيدرالي الاستراتيجي دون حاجز الـ ٣٠ يوماً، يفعل تلقائياً مسار الاستيراد البديل عبر البحر الأحمر مع تصفير الجمارك فوراً ومنح رخصة استيراد استثنائية لشركات الفئة أ." 
                    : "Whenever federal grain reserve declines below the 30-day safety limit, custom duty mitigation and sovereign emergency tenders automatically activate under decree 2026-F."}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setWarnings(prev => prev.map(w => w.id === "W1" ? { ...w, currentValue: "45 Days (Restored)", status: "stable" } : w));
                      setAuditLogs(prev => ["Emergency strategic grain release triggered. Federal reserves restored to 45 days.", ...prev]);
                      alert(currentLanguage === "ar" ? "تم تفعيل الاستيراد الاستثنائي وضخ ٢٠,٠٠٠ طن قمح" : "Emergency Strategic grain reserve released. Threshold warning cleared.");
                    }}
                    className="bg-amber-800 hover:bg-amber-700 text-white text-[10px] px-3 py-1 rounded font-bold cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "تفعيل خطة الدقيق الطارئة فوراً" : "Activate Emergency Reserves Protocol"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: STRATEGIC DECISION SUPPORT & WHAT-IF */}
        {activeTab === "decisions" && (
          <motion.div
            key="decisions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Interactive sliders for What-If Analysis (Module 4) */}
            <div className="lg:col-span-5 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="pb-2 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Compass className="h-4.5 w-4.5 text-teal-400" />
                    <span>{currentLanguage === "ar" ? "محاكي السيناريوهات وصناعة القرار المالي" : "Sovereign Strategic Policy Simulator"}</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{currentLanguage === "ar" ? "تعديل المتغيرات الفيدرالية لتقدير الخسائر في الناتج المحلي" : "Adjust key federal trade vectors to forecast immediate macro losses"}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{currentLanguage === "ar" ? "معدل التضخم السنوي" : "Inflation Target (%)"}</span>
                      <span className="text-amber-400 font-mono font-bold">{inflationTrigger}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={inflationTrigger}
                      onChange={e => setInflationTrigger(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{currentLanguage === "ar" ? "استقرار العملة الوطنية مقابل الدولار" : "Currency Stability Index (%)"}</span>
                      <span className="text-emerald-400 font-mono font-bold">{currencyStability}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={currencyStability}
                      onChange={e => setCurrencyStability(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{currentLanguage === "ar" ? "تعطيل خطوط الإمداد البحري" : "Maritime Disruption index (%)"}</span>
                      <span className="text-rose-400 font-mono font-bold">{supplyChainImpact}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={supplyChainImpact}
                      onChange={e => setSupplyChainImpact(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Realtime Simulator Forecast Outcomes */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 mt-6">
                <div className="text-[10px] uppercase font-mono text-gray-500 mb-2.5">What-If Forecasting Outcomes</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "الانخفاض المقدر في الناتج المحلي" : "GDP Annual Impact"}</span>
                    <span className="text-lg font-black text-rose-400">-{simulatedGdpLoss}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "مؤشر المخاطر القومي العام" : "Simulated Risk Score"}</span>
                    <span className={`text-lg font-black ${simulatedRiskScore > 65 ? "text-red-400" : simulatedRiskScore > 40 ? "text-amber-400" : "text-emerald-400"}`}>
                      {simulatedRiskScore} / 100
                    </span>
                  </div>
                </div>
                <div className="text-[9px] text-gray-500 font-mono mt-3 text-center border-t border-slate-900 pt-2">
                  Prediction models built with Vision-2035 Bayesian layers.
                </div>
              </div>
            </div>

            {/* Strategic Alternatives comparison */}
            <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3.5 flex items-center gap-1.5">
                <Scale className="h-4.5 w-4.5 text-red-400" />
                <span>{currentLanguage === "ar" ? "البدائل والسياسات الاستراتيجية الموصى بها بالذكاء الاصطناعي" : "AI Strategic Policy Alternatives Ledger"}</span>
              </h3>

              <div className="space-y-4">
                {decisionAlternatives.map(alt => (
                  <div key={alt.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 hover:border-teal-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-teal-400">{alt.id}</span>
                      <div className="flex gap-2">
                        <span className="text-[9px] bg-slate-900 text-teal-400 px-2 rounded-full font-mono">Feasibility: {alt.feasibility}%</span>
                        <span className="text-[9px] bg-slate-900 text-rose-400 px-2 rounded-full font-mono">Risk: {alt.riskScore}</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-2">
                      {currentLanguage === "ar" ? alt.titleAr : alt.titleEn}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 mb-2 border-y border-slate-900 py-1.5">
                      <span>GDP Effect: <strong className="text-emerald-400">{alt.gdpImpact}</strong></span>
                      <span>Social/Sovereign Cost: <strong className="text-gray-300">{alt.socialCost}</strong></span>
                    </div>

                    <div className="bg-teal-950/20 border border-teal-500/20 p-2 rounded text-[10px] text-teal-300 italic">
                      <strong>AI Advice:</strong> {alt.aiRecommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: AI PREDICTIVE INTELLIGENCE */}
        {activeTab === "prediction" && (
          <motion.div
            key="prediction"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Economic Forecasting and Risk scoring model (Module 8) */}
            <div className="lg:col-span-6 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                <Cpu className="h-4.5 w-4.5 text-red-400" />
                <span>{currentLanguage === "ar" ? "نموذج الذكاء الاصطناعي للتنبؤ وحساب مؤشر المخاطر" : "Vision-2035 Bayesian Risk Predictor"}</span>
              </h3>
              <p className="text-xs text-gray-400 mb-4">{currentLanguage === "ar" ? "رصد احتمالات حدوث نقص في السلع الاستراتيجية بناءً على المتغيرات الحالية" : "AI model probability scores of commodity and logistics disruptions in the next 90 days"}</p>

              <div className="space-y-4">
                {[
                  { labelAr: "نقص دقيق المخابز الفيدرالي", labelEn: "Federal Flour Scarcity probability", risk: 84, trend: "up" },
                  { labelAr: "تعطيل رصيف حاويات ميناء بورتسودان", labelEn: "Port Sudan Berth 12 congestion", risk: 65, trend: "up" },
                  { labelAr: "زيادة احتكار تجار زيوت الطعام", labelEn: "Edible Oil merchant price speculation", risk: 42, trend: "stable" },
                  { labelAr: "نقص وقود تشغيل مصانع الباقير", labelEn: "Industrial Fuel flow disruption", risk: 18, trend: "down" }
                ].map((item, index) => (
                  <div key={index} className="bg-slate-950 p-3.5 rounded-lg border border-slate-900">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-white font-semibold">{currentLanguage === "ar" ? item.labelAr : item.labelEn}</span>
                      <span className={`font-mono font-bold ${item.risk > 70 ? "text-red-400" : item.risk > 40 ? "text-amber-400" : "text-emerald-400"}`}>{item.risk}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.risk > 70 ? "bg-red-500" : item.risk > 40 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${item.risk}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                      <span>Model: Bayesian_Network_Sudan_v3</span>
                      <span>Trend: <strong className="text-gray-400 uppercase">{item.trend}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Generated Report and Speech trigger (Module 8) */}
            <div className="lg:col-span-6 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-3">{currentLanguage === "ar" ? "تقرير المساعد التنفيذي بالذكاء الاصطناعي" : "Executive AI Intelligence Report"}</h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-xs font-mono text-gray-300 leading-relaxed whitespace-pre-line">
                  {currentLanguage === "ar" ? (
                    `[سرّي للغاية - صالح لغرفة العمليات فقط]
                     تحديث الأزمة الحالية:
                     رصد نموذج التنبؤ احتمالاً بنسبة ٨٤٪ لنقص القمح في الخرطوم خلال الأسبوعين القادمين بسبب بطء الملاحة.
                     
                     التوصيات العاجلة:
                     ١. تفريغ الدقيق من مخازن القضارف الشرقية فوراً.
                     ٢. فتح باب الاستيراد الاستثنائي المعفى من الرسوم الجمركية لثلاثة موردين وطنيين.
                     ٣. توجيه فرق التفتيش الميداني لمنع احتكار زيوت الطعام في أمدرمان وبحري.`
                  ) : (
                    `[Sovereign Command Clearance Only]
                     Immediate Prediction:
                     Wheat reserves in Port Sudan will trigger an amber warning in 5 days if logistics flow is not diverted. 
                     
                     Action Plan:
                     1. Initiate Alternative Route 2 via Eastern Al-Qadarif silos.
                     2. Authorize tariff-free emergency imports for Tier-A certified vendors.
                     3. Deploy 12 inspection units to Central Markets to suppress uncompetitive retail pricing.`
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between gap-3">
                <button
                  onClick={() => {
                    const text = currentLanguage === "ar" ? "صوامع القمح القضارف بورتسودان" : "Wheat Al Qadarif reserves report";
                    alert(`${currentLanguage === "ar" ? "تم تحميل التقرير الاستراتيجي بصيغة PDF" : "Strategic PDF Report downloaded successfully."}`);
                    setAuditLogs(prev => ["Downloaded PDF strategic brief.", ...prev]);
                  }}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-4 w-4 text-red-500" />
                  <span>{currentLanguage === "ar" ? "تحميل التقرير كـ PDF" : "Download PDF Brief"}</span>
                </button>

                <button
                  onClick={handleAiAdvisorBroadcast}
                  className="bg-red-800 hover:bg-red-700 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>{currentLanguage === "ar" ? "استمع للتقرير الصوتي" : "Play Voice Brief"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: RESOURCE ALLOCATION & LOGISTICS */}
        {activeTab === "resources" && (
          <motion.div
            key="resources"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Fleet & Human capital dispatcher (Module 7) */}
            <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3.5">{currentLanguage === "ar" ? "حالة تعبئة وتوزيع الموارد اللوجستية الفيدرالية" : "Sovereign Emergency Resources Allocation"}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emergencyResources.map(res => (
                  <div key={res.id} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono text-gray-500">{res.id}</span>
                      <h4 className="text-xs font-bold text-white mt-1">
                        {currentLanguage === "ar" ? res.nameAr : res.nameEn}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-2">Active: <strong className="text-white">{res.allocated} units</strong></p>
                      <p className="text-[10px] text-gray-400">Reserve/Standby: <strong className="text-gray-300">{res.standby} units</strong></p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900 flex gap-2">
                      <button
                        onClick={() => {
                          setEmergencyResources(prev =>
                            prev.map(r => r.id === res.id ? { ...r, allocated: r.allocated + 1, standby: Math.max(0, r.standby - 1) } : r)
                          );
                          setAuditLogs(prev => [`Dispatched 1 additional unit of ${res.id}`, ...prev]);
                        }}
                        className="flex-1 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/20 rounded text-[10px] font-bold cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "توزيع وحدة" : "Dispatch Unit"}
                      </button>
                      <button
                        onClick={() => {
                          setEmergencyResources(prev =>
                            prev.map(r => r.id === res.id ? { ...r, standby: r.standby + 1, allocated: Math.max(0, r.allocated - 1) } : r)
                          );
                          setAuditLogs(prev => [`Recalled 1 unit of ${res.id} to standby`, ...prev]);
                        }}
                        className="py-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-gray-300 border border-slate-800 rounded text-[10px] cursor-pointer"
                      >
                        Recall
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Geographic coordination visual tracker */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 mt-6 text-xs">
                <h4 className="font-bold text-white mb-2">{currentLanguage === "ar" ? "قائمة التوزيع الجغرافي للفرق الميدانية" : "Active Deployment Locations & Corridors"}</h4>
                <div className="space-y-2 font-mono">
                  <div className="flex justify-between border-b border-slate-900 pb-1.5 text-[11px]">
                    <span className="text-gray-400">Corridor A (Port Sudan to Al-Qadarif):</span>
                    <span className="text-emerald-400">12 Heavy Freight Teams Active</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5 text-[11px]">
                    <span className="text-gray-400">Corridor B (Khartoum Metropolitan):</span>
                    <span className="text-amber-400">18 Consumer Price Inspection Units</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Corridor C (El Bagair Industrial Area):</span>
                    <span className="text-gray-500">Standby (4 Grid Engineering Vehicles)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick search and command dispatch summary */}
            <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-3">{currentLanguage === "ar" ? "محرك البحث والـتقصي الفيدرالي" : "Sovereign Command Query Engine"}</h3>
                <p className="text-xs text-gray-400 mb-3">{currentLanguage === "ar" ? "ابحث عن الأزمات، الشركات المخالفة، أو المفتشين المسؤولين" : "Command-wide global index Search"}</p>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={currentLanguage === "ar" ? "اكتب كلمة البحث..." : "Type query..."}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-red-500"
                  />

                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    {[
                      { id: "all", label: "All Data" },
                      { id: "crisis", label: "Crises" },
                      { id: "company", label: "Companies" },
                      { id: "geographic", label: "Geographic" }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSearchType(type.id as any)}
                        className={`py-1 rounded border transition-colors cursor-pointer ${searchType === type.id ? "bg-red-950/30 border-red-500/40 text-red-400" : "bg-slate-950 border-slate-900 text-gray-400"}`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-900 mt-4 text-[11px]">
                <div className="text-gray-500 uppercase font-mono text-[9px] mb-1">Index Status</div>
                <div className="text-gray-300">12,482 total records indexed. Port Sudan custom ledger live integration: **OK**. Database state: **Consistent**.</div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* SYSTEM META FOOTER */}
      <div className="mt-8 pt-4 border-t border-slate-800/60 flex flex-wrap justify-between items-center text-[10px] font-mono text-gray-500 gap-4">
        <div>🇸🇩 REPUBLIC OF SUDAN | EXECUTIVE PORTAL v3.5-PRODUCTION</div>
        <div className="flex gap-4">
          <span>Role Clearance: <strong className="text-red-400">{role.toUpperCase()}</strong></span>
          <span>Security Audit: <strong className="text-emerald-400">ISO 27001</strong></span>
          <span>Node Port: <strong className="text-gray-300">3000</strong></span>
        </div>
      </div>

    </div>
  );
}
