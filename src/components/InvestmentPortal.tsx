/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, Landmark, Plus, CheckCircle, Search, MapPin, 
  Coins, ArrowRight, X, Sparkles, LayoutGrid, CheckSquare,
  TrendingUp, Award, ShieldCheck, FileText, Users, BarChart3,
  Sliders, Globe, HelpCircle, Activity, ChevronRight, Calendar,
  DollarSign, CheckSquare as CheckSquareIcon, Lock, Settings, RefreshCw, AlertTriangle
} from "lucide-react";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from "recharts";
import { LandApplication, InvestmentOpportunity, ApplicationStatus } from "../types";
import { INVESTMENT_OPPORTUNITIES, INDUSTRIAL_ZONES } from "../data";

interface InvestmentPortalProps {
  currentLanguage: "ar" | "en";
  applications: LandApplication[];
  onAddApplication: (appData: any) => Promise<any>;
  isAdmin: boolean;
  onUpdateAppStatus?: (id: string, status: ApplicationStatus) => Promise<any>;
}

// Pre-seeded Rich Investment Entities
interface Investor {
  id: string;
  nii: string; // National Investor Identifier
  nameAr: string;
  nameEn: string;
  type: "domestic" | "foreign" | "jv" | "sovereign" | "ppp" | "fund";
  countryAr: string;
  countryEn: string;
  capitalUsd: number;
  status: "active" | "under_review" | "suspended";
  registeredDate: string;
}

interface InvestmentProject {
  id: string;
  nameAr: string;
  nameEn: string;
  investorId: string;
  sectorAr: string;
  sectorEn: string;
  locationAr: string;
  locationEn: string;
  capitalUsd: number;
  fundingSourceAr: string;
  fundingSourceEn: string;
  employmentForecast: number;
  progress: number; // percentage
  operationalStatus: "planned" | "construction" | "operational" | "closed";
  nii: string;
}

interface StrategicProject {
  id: string;
  nameAr: string;
  nameEn: string;
  category: "industrial" | "infrastructure" | "agricultural" | "energy" | "logistics" | "tech";
  budgetUsd: number;
  progress: number;
  risk: "low" | "medium" | "high";
  milestoneAr: string;
  milestoneEn: string;
  impactAr: string;
  impactEn: string;
}

export default function InvestmentPortalModule({
  currentLanguage,
  applications,
  onAddApplication,
  isAdmin: systemIsAdmin,
  onUpdateAppStatus
}: InvestmentPortalProps) {
  
  // Custom RBAC support inside module for demonstration
  const [activeRole, setActiveRole] = useState<string>("investor");
  const isAdmin = activeRole !== "investor";

  // Tab State
  const [activeTab, setActiveTab] = useState<"dashboard" | "registry" | "projects" | "zones" | "incentives" | "strategic" | "advisor" | "services" | "reports">("dashboard");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [investorFilter, setInvestorFilter] = useState("all");
  const [projectSectorFilter, setProjectSectorFilter] = useState("all");

  // Selection states
  const [selectedOpp, setSelectedOpp] = useState<InvestmentOpportunity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(INDUSTRIAL_ZONES[0]);

  // Advisor States
  const [advisorScenario, setAdvisorScenario] = useState("recommend_opps");
  const [customPrompt, setCustomPrompt] = useState("");
  const [advisorOutput, setAdvisorOutput] = useState("");
  const [isAdvising, setIsAdvising] = useState(false);

  // Form State for land/project booking
  const [proposedProject, setProposedProject] = useState("");
  const [requestedAreaSqm, setRequestedAreaSqm] = useState("");
  const [preferredIndustrialZone, setPreferredIndustrialZone] = useState(INDUSTRIAL_ZONES[0].nameAr);
  const [investorName, setInvestorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State for Investor Registration
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);
  const [regNameAr, setRegNameAr] = useState("");
  const [regNameEn, setRegNameEn] = useState("");
  const [regType, setRegType] = useState<"domestic" | "foreign" | "jv" | "sovereign" | "ppp" | "fund">("domestic");
  const [regCountryAr, setRegCountryAr] = useState("");
  const [regCountryEn, setRegCountryEn] = useState("");
  const [regCapital, setRegCapital] = useState("");

  // Form State for Project Registration
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projNameAr, setProjNameAr] = useState("");
  const [projNameEn, setProjNameEn] = useState("");
  const [projSectorAr, setProjSectorAr] = useState("");
  const [projSectorEn, setProjSectorEn] = useState("");
  const [projCapital, setProjCapital] = useState("");
  const [projJobs, setProjJobs] = useState("");
  const [projLocation, setProjLocation] = useState("");

  // Incentive eligibility checker state
  const [checkSector, setCheckSector] = useState("food");
  const [checkCapital, setCheckCapital] = useState(5000000);
  const [checkJobs, setCheckJobs] = useState(120);
  const [incentiveEligible, setIncentiveEligible] = useState<any>(null);

  // Dynamic state for mock DB tables
  const [investors, setInvestors] = useState<Investor[]>([
    { id: "inv-1", nii: "NII-2026-04821", nameAr: "مجموعة دال الغذائية", nameEn: "DAL Food Group", type: "domestic", countryAr: "السودان", countryEn: "Sudan", capitalUsd: 45000000, status: "active", registeredDate: "2026-01-15" },
    { id: "inv-2", nii: "NII-2026-09211", nameAr: "مؤسسة الراجحي الاستثمارية", nameEn: "Al Rajhi Investment Corp", type: "foreign", countryAr: "المملكة العربية السعودية", countryEn: "Saudi Arabia", capitalUsd: 85000000, status: "active", registeredDate: "2026-02-10" },
    { id: "inv-3", nii: "NII-2026-11029", nameAr: "الشركة السودانية التركية للأدوية", nameEn: "Sudanese Turkish Pharma JV", type: "jv", countryAr: "تركيا / السودان", countryEn: "Turkey / Sudan", capitalUsd: 18000000, status: "active", registeredDate: "2026-03-22" },
    { id: "inv-4", nii: "NII-2026-15944", nameAr: "صندوق مصر السيادي للشراكات", nameEn: "Sovereign Fund of Egypt Partnership", type: "sovereign", countryAr: "جمهورية مصر العربية", countryEn: "Egypt", capitalUsd: 120000000, status: "active", registeredDate: "2026-04-05" },
    { id: "inv-5", nii: "NII-2026-22419", nameAr: "مجموعة الصين لموانئ لوجستيات بورتسودان", nameEn: "China Port Sudan Logistics JV", type: "ppp", countryAr: "الصين", countryEn: "China", capitalUsd: 150000000, status: "active", registeredDate: "2026-05-18" }
  ]);

  const [projects, setProjects] = useState<InvestmentProject[]>([
    { id: "proj-1", nameAr: "مجمع تعبئة الصمغ العربي المتكامل", nameEn: "Integrated Gum Arabic Processing Plant", investorId: "inv-1", sectorAr: "صناعات تحويلية", sectorEn: "Agro-Processing", locationAr: "المنطقة الحرة بورتسودان", locationEn: "Port Sudan Free Zone", capitalUsd: 15000000, fundingSourceAr: "ذاتي ومصرفي", fundingSourceEn: "Self & Banking", employmentForecast: 450, progress: 85, operationalStatus: "construction", nii: "NII-2026-04821" },
    { id: "proj-2", nameAr: "مشروع الراجحي للأمن الغذائي والقمح", nameEn: "Al Rajhi Wheat & Food Security Project", investorId: "inv-2", sectorAr: "أمن غذائي وزراعة", sectorEn: "Agriculture & Food Security", locationAr: "الولاية الشمالية", locationEn: "Northern State", capitalUsd: 50000000, fundingSourceAr: "تمويل أجنبي مباشر", fundingSourceEn: "FDI Financing", employmentForecast: 1200, progress: 100, operationalStatus: "operational", nii: "NII-2026-09211" },
    { id: "proj-3", nameAr: "مستودعات الغاز والمواد البترولية الاستراتيجية", nameEn: "Strategic LPG & Fuel Logistics Terminal", investorId: "inv-5", sectorAr: "لوجستيات وموانئ", sectorEn: "Logistics & Ports", locationAr: "بورتسودان", locationEn: "Port Sudan", capitalUsd: 75000000, fundingSourceAr: "شراكة عامة وخاصة", fundingSourceEn: "PPP Funding", employmentForecast: 600, progress: 40, operationalStatus: "construction", nii: "NII-2026-22419" }
  ]);

  const [strategicProjects] = useState<StrategicProject[]>([
    { id: "strat-1", nameAr: "مشروع قطار التنمية بورتسودان - الخرطوم بحري", nameEn: "Port Sudan - Khartoum Cargo Rail Link", category: "logistics", budgetUsd: 350000000, progress: 35, risk: "medium", milestoneAr: "اكتمال مسح 180 كم من المسارات وتثبيت القواعد", milestoneEn: "180 km track clearing and baseline stabilization completed", impactAr: "تقليص زمن نقل البضائع بنسبة 70% وخفض تكاليف الاستيراد والتصدير", impactEn: "70% freight transit time reduction, lowering import/export costs" },
    { id: "strat-2", nameAr: "مجمع البحر الأحمر للحديد والصلب الأخضر", nameEn: "Red Sea Green Steel Complex", category: "industrial", budgetUsd: 180000000, progress: 15, risk: "high", milestoneAr: "استلام موافقة تقييم الأثر البيئي وحجز الطاقة الهجينة", milestoneEn: "EIA clearance received and hybrid solar-diesel grid allocation complete", impactAr: "أول مصنع تكنولوجيا انبعاثات منخفضة للحديد لتغطية منطقة الكوميسا", impactEn: "First low-emission steel tech plant to serve COMESA region demand" },
    { id: "strat-3", nameAr: "المشروع الزراعي القومي الذكي بالجزيرة", nameEn: "National Smart Irrigation Hub in Gezira", category: "agricultural", budgetUsd: 95000000, progress: 65, risk: "low", milestoneAr: "تركيب 1200 مستشعر ري ذكي بالإنترنت للأشياء", milestoneEn: "Deployment of 1200 IoT smart irrigation sensors complete", impactAr: "مضاعفة إنتاج القطن طويل التيلة الموجه للتصدير بنسبة 110%", impactEn: "110% increase in long-staple cotton yield earmarked for exports" },
    { id: "strat-4", nameAr: "مجمع الطاقة الهجينة لتغذية الصناعات بجياد", nameEn: "Giad 250MW Hybrid Solar Feed", category: "energy", budgetUsd: 110000000, progress: 50, risk: "medium", milestoneAr: "تركيب المحولات الكهرومغناطيسية وربط الشبكة بنسبة 50%", milestoneEn: "Transformer substations installed, grid integration 50% done", impactAr: "تخفيض تكلفة الكهرباء الصناعية بنسبة 35% لمدينة جياد الاستراتيجية", impactEn: "35% industrial power cost discount for strategic Giad Industrial City" }
  ]);

  // Report Selections
  const [selectedReportType, setSelectedReportType] = useState<string>("executive");
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Document management simulation
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([
    { name: "Feasibility_Study_Gum_Arabic_Complex.pdf", size: "4.8 MB", date: "2026-07-11", type: "feasibility" },
    { name: "Environmental_Impact_Assessment_Approved.pdf", size: "2.1 MB", date: "2026-07-12", type: "environmental" }
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const newFile = {
        name: files[0].name,
        size: `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toISOString().split("T")[0],
        type: "supporting"
      };
      setUploadedFiles([...uploadedFiles, newFile]);
    }
  };

  const handleRegisterInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNameAr || !regNameEn || !regCapital) return;
    const randomNII = `NII-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newInv: Investor = {
      id: `inv-${Date.now()}`,
      nii: randomNII,
      nameAr: regNameAr,
      nameEn: regNameEn,
      type: regType,
      countryAr: regCountryAr || (currentLanguage === "ar" ? "السودان" : "Sudan"),
      countryEn: regCountryEn || "Sudan",
      capitalUsd: Number(regCapital),
      status: "active",
      registeredDate: new Date().toISOString().split("T")[0]
    };
    setInvestors([...investors, newInv]);
    setIsInvestorModalOpen(false);
    setRegNameAr("");
    setRegNameEn("");
    setRegCapital("");
    setRegCountryAr("");
    setRegCountryEn("");
  };

  const handleRegisterProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projNameAr || !projNameEn || !projCapital) return;
    const randomId = `proj-${Date.now()}`;
    const newProj: InvestmentProject = {
      id: randomId,
      nameAr: projNameAr,
      nameEn: projNameEn,
      investorId: investors[0]?.id || "inv-1",
      sectorAr: projSectorAr || (currentLanguage === "ar" ? "صناعات حديثة" : "Modern Industries"),
      sectorEn: projSectorEn || "Modern Industries",
      locationAr: projLocation || (currentLanguage === "ar" ? "منطقة الباقير" : "El Bagair"),
      locationEn: projLocation || "El Bagair",
      capitalUsd: Number(projCapital),
      fundingSourceAr: currentLanguage === "ar" ? "تمويل استثماري مشترك" : "Joint Venture Capital",
      fundingSourceEn: "Joint Venture Capital",
      employmentForecast: Number(projJobs) || 100,
      progress: 5,
      operationalStatus: "planned",
      nii: investors[0]?.nii || "NII-2026-04821"
    };
    setProjects([...projects, newProj]);
    setIsProjectModalOpen(false);
    setProjNameAr("");
    setProjNameEn("");
    setProjCapital("");
    setProjJobs("");
    setProjLocation("");
  };

  const handleCheckIncentives = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    if (checkCapital >= 10000000) score += 3;
    else if (checkCapital >= 5000000) score += 2;
    else score += 1;

    if (checkJobs >= 200) score += 3;
    else if (checkJobs >= 100) score += 2;
    else score += 1;

    let taxHoliday = "5 Years";
    let customExempt = "50%";
    let landDiscount = "15%";
    let extraBenefits = "Standard Support";

    if (score >= 5) {
      taxHoliday = "10 Years Full Exemption (إعفاء ضريبي كامل 10 سنوات)";
      customExempt = "100% Full Custom Waive (إعفاء جمركي سيادي كامل 100%)";
      landDiscount = "50% Discount on industrial SQM lease (خصم 50% على تعرفة الأرض)";
      extraBenefits = "Priority fast-track COMESA shipping lanes & airport logistics terminal access";
    } else if (score >= 3) {
      taxHoliday = "7 Years Exemption";
      customExempt = "75% Customs Waiver on industrial machineries";
      landDiscount = "30% Discount on industrial land";
      extraBenefits = "National Smart Electricity Grid hybrid priority link";
    }

    setIncentiveEligible({
      score,
      taxHoliday,
      customExempt,
      landDiscount,
      extraBenefits
    });
  };

  const handleGenerateReport = () => {
    setGeneratedReport({
      serial: `REP-SD-INV-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      author: activeRole,
      type: selectedReportType,
      summary: selectedReportType === "executive" 
        ? "Sudan Investment Performance & Strategic Outlook - Visualized under Vision 2035 rules. FDI Inflow is trending highly positive at +18.5% year-on-year." 
        : selectedReportType === "fdi" 
        ? "FDI analysis reveals China, Saudi Arabia, and Turkey as the top three strategic investor nations in Sudan, contributing 78% of the sovereign joint ventures."
        : "Economic Zone performance report shows Giad Industrial City and Port Sudan Free Zone dominating the occupancy metrics at 94% and 88% respectively."
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedProject || !requestedAreaSqm || !investorName) {
      alert(currentLanguage === "ar" ? "يرجى ملء البيانات المطلوبة لحجز الأرض" : "Please fill in all requested fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddApplication({
        investorName,
        opportunityId: selectedOpp ? selectedOpp.id : "custom",
        proposedProject,
        requestedAreaSqm: Number(requestedAreaSqm),
        preferredIndustrialZone
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormOpen(false);
        setProposedProject("");
        setRequestedAreaSqm("");
        setInvestorName("");
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenFormWithOpp = (opp: InvestmentOpportunity) => {
    setSelectedOpp(opp);
    setProposedProject(currentLanguage === "ar" ? `مشروع متكامل لـ ${opp.titleAr}` : `Integrated Project for ${opp.titleEn}`);
    setPreferredIndustrialZone(opp.id === "opp-1" ? "المنطقة الحرة بورتسودان" : opp.id === "opp-2" ? "مدينة جياد الصناعية" : "منطقة الباقير الصناعية");
    setIsFormOpen(true);
  };

  const handleCallAIAdvisor = async () => {
    setIsAdvising(true);
    try {
      const response = await fetch("/api/industrial/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt,
          scenario: advisorScenario,
          context: {
            activeRole,
            selectedZone: selectedZone?.nameEn,
            totalInvestorsCount: investors.length,
            totalProjectsCount: projects.length,
            activeTab
          }
        })
      });
      const data = await response.json();
      setAdvisorOutput(data.text);
    } catch (err: any) {
      setAdvisorOutput(currentLanguage === "ar" ? `حدث خطأ بالاتصال: ${err.message}` : `Connection error: ${err.message}`);
    } finally {
      setIsAdvising(false);
    }
  };

  const filteredOpportunities = INVESTMENT_OPPORTUNITIES.filter(opp => {
    return opp.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
           opp.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
           opp.sectorAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
           opp.sectorEn.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getInvestorTypeLabel = (type: string) => {
    switch (type) {
      case "domestic": return currentLanguage === "ar" ? "مستثمر وطني" : "Domestic Investor";
      case "foreign": return currentLanguage === "ar" ? "استثمار أجنبي مباشر FDI" : "Foreign FDI";
      case "jv": return currentLanguage === "ar" ? "مشروع مشترك JV" : "Joint Venture";
      case "sovereign": return currentLanguage === "ar" ? "صندوق سيادي شراكة" : "Sovereign Partnership";
      case "ppp": return currentLanguage === "ar" ? "شراكة عامة وخاصة PPP" : "Public Private Partnership";
      default: return type;
    }
  };

  // Recharts Chart Data
  const chartDataYearly = [
    { name: "2021", fdi: 24, domestic: 18, forecast: 0 },
    { name: "2022", fdi: 35, domestic: 22, forecast: 0 },
    { name: "2023", fdi: 42, domestic: 29, forecast: 0 },
    { name: "2024", fdi: 58, domestic: 38, forecast: 0 },
    { name: "2025", fdi: 79, domestic: 45, forecast: 0 },
    { name: "2026", fdi: 94, domestic: 52, forecast: 0 },
    { name: "2027 (AI)", fdi: 110, domestic: 65, forecast: 175 },
    { name: "2030 (AI)", fdi: 145, domestic: 90, forecast: 235 },
    { name: "2035 (AI)", fdi: 220, domestic: 150, forecast: 370 },
  ];

  const sectorDistribution = [
    { name: currentLanguage === "ar" ? "صناعات تحويلية" : "Agro-Processing", value: 35 },
    { name: currentLanguage === "ar" ? "طاقة متجددة" : "Renewable Energy", value: 20 },
    { name: currentLanguage === "ar" ? "تعدين ومعادن" : "Mining & Minerals", value: 15 },
    { name: currentLanguage === "ar" ? "لوجستيات وموانئ" : "Logistics & Ports", value: 20 },
    { name: currentLanguage === "ar" ? "صناعات ثقيلة" : "Heavy Industry", value: 10 }
  ];

  const COLORS = ["#006B3F", "#C5A059", "#1E293B", "#3B82F6", "#EF4444"];

  return (
    <div id="investment-portal-module" className="space-y-6">
      
      {/* Sovereign Top bar with Role Switching (RBAC) */}
      <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#F4F6F5] rounded-full flex items-center justify-center">
            <Award className="h-5 w-5 text-sudan-green" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider">
              {currentLanguage === "ar" ? "بوابة تشجيع الاستثمار السيادية الموحدة" : "Sovereign National Investment Promotion Engine"}
            </h4>
            <p className="text-[10px] text-gray-400 font-extrabold">
              {currentLanguage === "ar" ? "مكلفة بمطابقة قوانين وزارة التجارة والصناعة لعام 2035" : "Licensed under general sovereignty guidelines & Vision 2035"}
            </p>
          </div>
        </div>

        {/* Custom RBAC switch dropdown to live demo all capabilities */}
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-sudan-gold" />
          <span className="text-[10px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "الصلاحية الجارية:" : "Active Role:"}</span>
          <select 
            value={activeRole} 
            onChange={(e) => setActiveRole(e.target.value)}
            className="bg-slate-50 border border-gray-200 text-[10px] font-extrabold rounded-lg px-3 py-1.5 outline-none focus:border-sudan-gold text-slate-700"
          >
            <option value="investor">{currentLanguage === "ar" ? "مستثمر / شركة خاصة" : "Investor / Enterprise"}</option>
            <option value="officer">{currentLanguage === "ar" ? "مسؤول الاستثمار الفيدرالي" : "Investment Officer"}</option>
            <option value="analyst">{currentLanguage === "ar" ? "محلل اقتصادي" : "Investment Analyst"}</option>
            <option value="evaluator">{currentLanguage === "ar" ? "مقيم المشاريع الفني" : "Project Evaluator"}</option>
            <option value="zone_manager">{currentLanguage === "ar" ? "مدير المدن الصناعية" : "Economic Zone Manager"}</option>
            <option value="legal">{currentLanguage === "ar" ? "مستشار قانوني سيادي" : "Legal Advisor"}</option>
            <option value="minister">{currentLanguage === "ar" ? "معالي الوزير / الإدارة العليا" : "Minister / Executive"}</option>
          </select>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sudan-dark text-white p-6 rounded-3xl shadow-sm border border-sudan-gold/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-sudan-green/20 rounded-full blur-3xl"></div>
        <div className="absolute left-10 bottom-0 w-60 h-60 bg-sudan-gold/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 space-y-3">
          <span className="bg-sudan-gold text-sudan-dark font-bold text-[10px] px-3 py-1 rounded-full uppercase flex items-center gap-1 w-fit">
            <Sparkles className="h-3.5 w-3.5 fill-sudan-dark" />
            {currentLanguage === "ar" ? "منصة الاستثمار القومية والتنمية المستدامة" : "National Investment & Economic Development Platform"}
          </span>
          <h2 className="text-2xl font-black text-white">
            {currentLanguage === "ar" ? "بوابة السيطرة الاستثمارية وجذب الموارد" : "Sovereign Investment Command & Control"}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {currentLanguage === "ar" 
              ? "مجمع موحد لإدارة الشركات الاستثمارية الوطنية والأجنبية، ومتابعة المشاريع الاستراتيجية الكبرى والمدن الحرة مع كشف مستشار الذكاء الاصطناعي المباشر." 
              : "Unified hub managing domestic and foreign enterprises, mapping strategic economic zones, and planning target capital growth with AI-powered forecasting."}
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 pb-2">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${activeTab === "dashboard" ? "bg-sudan-green text-white" : "text-gray-500 hover:bg-slate-50"}`}
        >
          {currentLanguage === "ar" ? "لوحة المعلومات المؤشرات" : "KPI Dashboard"}
        </button>
        <button 
          onClick={() => setActiveTab("registry")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${activeTab === "registry" ? "bg-sudan-green text-white" : "text-gray-500 hover:bg-slate-50"}`}
        >
          {currentLanguage === "ar" ? "سجل المستثمرين الوطني (NII)" : "Investor Registry"}
        </button>
        <button 
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${activeTab === "projects" ? "bg-sudan-green text-white" : "text-gray-500 hover:bg-slate-50"}`}
        >
          {currentLanguage === "ar" ? "إدارة المشاريع ودورة الحياة" : "Project Lifecycle"}
        </button>
        <button 
          onClick={() => setActiveTab("zones")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${activeTab === "zones" ? "bg-sudan-green text-white" : "text-gray-500 hover:bg-slate-50"}`}
        >
          {currentLanguage === "ar" ? "المدن والمناطق الحرة GIS" : "Economic Zones Map"}
        </button>
        <button 
          onClick={() => setActiveTab("incentives")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${activeTab === "incentives" ? "bg-sudan-green text-white" : "text-gray-500 hover:bg-slate-50"}`}
        >
          {currentLanguage === "ar" ? "الحوافز الأجنبية ومحاكي الأهلية" : "Incentives & FDI"}
        </button>
        <button 
          onClick={() => setActiveTab("strategic")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${activeTab === "strategic" ? "bg-sudan-green text-white" : "text-gray-500 hover:bg-slate-50"}`}
        >
          {currentLanguage === "ar" ? "المشاريع القومية السيادية" : "Priority Megaprojects"}
        </button>
        <button 
          onClick={() => setActiveTab("advisor")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${activeTab === "advisor" ? "bg-sudan-green text-white animate-pulse" : "text-gray-500 hover:bg-slate-50"}`}
        >
          {currentLanguage === "ar" ? "مستشار الاستثمار الذكي AI" : "AI Advisor"}
        </button>
        <button 
          onClick={() => setActiveTab("services")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${activeTab === "services" ? "bg-sudan-green text-white" : "text-gray-500 hover:bg-slate-50"}`}
        >
          {currentLanguage === "ar" ? "حجز الأراضي والمعاملات" : "Land & Services"}
        </button>
        <button 
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${activeTab === "reports" ? "bg-sudan-green text-white" : "text-gray-500 hover:bg-slate-50"}`}
        >
          {currentLanguage === "ar" ? "التقارير واستخبارات الأعمال" : "Reports & Intelligence"}
        </button>
      </div>

      {/* Tabs Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          
          {/* TAB 1: KPI DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* KPIs Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "إجمالي قيمة الاستثمارات" : "Total Investment Value"}</span>
                    <Coins className="h-4 w-4 text-sudan-gold" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">$145,000,000+</h3>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-extrabold">
                    <span>↑ +18.5% YoY</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "المستثمرين النشطين" : "Active NII Entities"}</span>
                    <Users className="h-4 w-4 text-sudan-green" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">{investors.length} Companies</h3>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-extrabold">
                    <span>99.9% Compliance</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "الوظائف المتوقعة" : "Employment Forecast"}</span>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">42,500 Jobs</h3>
                  <div className="flex items-center gap-1 text-[10px] text-sudan-green font-extrabold">
                    <span>Vision 2035 Goal Reached</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "متوسط سرعة الموافقات" : "Mean Approval Time"}</span>
                    <Calendar className="h-4 w-4 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">2.4 Days</h3>
                  <div className="flex items-center gap-1 text-[10px] text-[#006B3F] font-extrabold">
                    <span>Instant Automated NII</span>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Year Growth & AI Forecast */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "تدفقات الاستثمار الأجنبي والوطني مع تنبؤات الذكاء الاصطناعي (مليون $)" : "FDI vs Domestic Investment & AI Forecasts (Millions USD)"}
                    </h4>
                    <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "بيانات تاريخية حتى عام 2026 مع نموذج تنبؤات 2035" : "Historical data up to 2026 with Vision 2035 model trajectory"}</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartDataYearly}>
                        <defs>
                          <linearGradient id="colorFdi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#006B3F" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#006B3F" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorDom" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C5A059" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#94A3B8" style={{ fontSize: 10, fontWeight: "bold" }} />
                        <YAxis stroke="#94A3B8" style={{ fontSize: 10, fontWeight: "bold" }} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                        <Area type="monotone" dataKey="fdi" name="FDI (الأجنبي)" stroke="#006B3F" fillOpacity={1} fill="url(#colorFdi)" />
                        <Area type="monotone" dataKey="domestic" name="Domestic (الوطني)" stroke="#C5A059" fillOpacity={1} fill="url(#colorDom)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sector Distribution */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "توزيع الاستثمارات حسب القطاع الاستراتيجي" : "Sovereign Sector Investment Density"}
                    </h4>
                    <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "النسبة المئوية لإشغال رأس المال" : "Percentage allocation of registered capital pool"}</p>
                  </div>
                  <div className="h-64 flex flex-col md:flex-row items-center justify-around gap-4">
                    <div className="h-48 w-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sectorDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {sectorDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {sectorDistribution.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                          <span className="font-bold text-slate-700">{entry.name}:</span>
                          <span className="font-extrabold text-sudan-green font-mono">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrations Monitor widget */}
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3">
                <h5 className="font-bold text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="h-4 w-4 text-sudan-gold" />
                  {currentLanguage === "ar" ? "لوحة التبادل وتكامل الأنظمة القومية" : "Unified Enterprise Integration Grid Status"}
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold">{currentLanguage === "ar" ? "سجل الشركات" : "Companies Registry"}</p>
                    <span className="text-[9px] bg-emerald-50 text-[#006B3F] px-2 py-0.5 rounded-full font-extrabold">✓ Integrated (متصل)</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold">{currentLanguage === "ar" ? "منصة التراخيص السيادية" : "Sovereign Licensing"}</p>
                    <span className="text-[9px] bg-emerald-50 text-[#006B3F] px-2 py-0.5 rounded-full font-extrabold">✓ Active Link (متصل)</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold">{currentLanguage === "ar" ? "المنصة الصناعية الذكية" : "Smart Industrial Platform"}</p>
                    <span className="text-[9px] bg-emerald-50 text-[#006B3F] px-2 py-0.5 rounded-full font-extrabold">✓ Dynamic Sync (متصل)</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold">{currentLanguage === "ar" ? "بوابة المدفوعات الحكومية" : "Government Payments"}</p>
                    <span className="text-[9px] bg-emerald-50 text-[#006B3F] px-2 py-0.5 rounded-full font-extrabold">✓ Instant Settlement</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold">{currentLanguage === "ar" ? "رادارات ذكاء الأعمال BI" : "Business Intelligence"}</p>
                    <span className="text-[9px] bg-emerald-50 text-[#006B3F] px-2 py-0.5 rounded-full font-extrabold">✓ Fully Injected</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NATIONAL INVESTOR REGISTRY */}
          {activeTab === "registry" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={currentLanguage === "ar" ? "ابحث بالاسم أو الرقم القومي للمستثمر..." : "Search by Investor or NII..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-sm pl-4 pr-11 py-2 rounded-xl outline-none focus:border-sudan-gold"
                    dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select 
                    value={investorFilter} 
                    onChange={(e) => setInvestorFilter(e.target.value)}
                    className="bg-white border border-gray-200 text-xs rounded-xl px-3 py-2 outline-none font-bold"
                  >
                    <option value="all">{currentLanguage === "ar" ? "كل الفئات" : "All Investor Types"}</option>
                    <option value="domestic">{currentLanguage === "ar" ? "وطني" : "Domestic"}</option>
                    <option value="foreign">{currentLanguage === "ar" ? "أجنبي مباشر FDI" : "FDI Foreign"}</option>
                    <option value="jv">{currentLanguage === "ar" ? "مشروع مشترك JV" : "Joint Ventures"}</option>
                    <option value="ppp">{currentLanguage === "ar" ? "شراكة PPP" : "PPP"}</option>
                  </select>

                  <button 
                    onClick={() => setIsInvestorModalOpen(true)}
                    className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{currentLanguage === "ar" ? "تسجيل مستثمر معتمد جديد" : "Register New Investor"}</span>
                  </button>
                </div>
              </div>

              {/* Investor Grid */}
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-gray-100">
                      <th className="p-4">{currentLanguage === "ar" ? "المعرف الاستثماري NII" : "National NII"}</th>
                      <th className="p-4">{currentLanguage === "ar" ? "الاسم الاستثماري" : "Entity / Investor Name"}</th>
                      <th className="p-4">{currentLanguage === "ar" ? "التصنيف" : "Classification"}</th>
                      <th className="p-4">{currentLanguage === "ar" ? "موطن رأس المال" : "Country of Origin"}</th>
                      <th className="p-4 text-right">{currentLanguage === "ar" ? "القيمة التقديرية" : "Stated Capital"}</th>
                      <th className="p-4 text-center">{currentLanguage === "ar" ? "الحالة" : "Verification Status"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {investors.filter(inv => {
                      const matchQuery = inv.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                         inv.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                         inv.nii.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchFilter = investorFilter === "all" || inv.type === investorFilter;
                      return matchQuery && matchFilter;
                    }).map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono font-extrabold text-sudan-green">{inv.nii}</td>
                        <td className="p-4">
                          <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? inv.nameAr : inv.nameEn}</p>
                          <p className="text-[10px] text-slate-400">Reg: {inv.registeredDate}</p>
                        </td>
                        <td className="p-4 font-bold">{getInvestorTypeLabel(inv.type)}</td>
                        <td className="p-4 font-extrabold text-slate-500">{currentLanguage === "ar" ? inv.countryAr : inv.countryEn}</td>
                        <td className="p-4 text-right font-mono font-extrabold text-slate-800">${inv.capitalUsd.toLocaleString()}</td>
                        <td className="p-4 text-center">
                          <span className="bg-emerald-50 text-[#006B3F] border border-emerald-100 px-2.5 py-1 rounded-full font-bold text-[9px] uppercase">
                            ✓ Verified (مستوفي سيادياً)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECT LIFECYCLE */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {currentLanguage === "ar" ? "سجل دورة حياة الاستثمار ومتابعة الإنشاءات" : "Investment Project Lifecycle & Progress Monitor"}
                  </h4>
                  <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "قائمة بالمشاريع الاستثمارية المعتمدة ومعدلات إنجازها" : "Approved economic projects tracking milestones, capital layout & job creation"}</p>
                </div>

                <button 
                  onClick={() => setIsProjectModalOpen(true)}
                  className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>{currentLanguage === "ar" ? "إدراج مشروع استثماري جديد" : "Insert Investment Project"}</span>
                </button>
              </div>

              {/* Project Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map(p => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-3xl p-5 space-y-4 shadow-xs relative overflow-hidden">
                    {/* Progress Bar top glow */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                      <div className="h-full bg-sudan-green transition-all" style={{ width: `${p.progress}%` }}></div>
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] bg-slate-100 text-[#1E293B] font-bold px-2 py-0.5 rounded-md">
                          {currentLanguage === "ar" ? p.sectorAr : p.sectorEn}
                        </span>
                        <h5 className="font-black text-slate-800 text-sm mt-1.5">{currentLanguage === "ar" ? p.nameAr : p.nameEn}</h5>
                        <p className="text-[10px] text-gray-400 font-mono">NII: {p.nii}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                        p.operationalStatus === "operational" ? "bg-emerald-50 text-[#006B3F] border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {p.operationalStatus === "operational" ? (currentLanguage === "ar" ? "قيد التشغيل" : "Operational") : (currentLanguage === "ar" ? "مرحلة التشييد" : "Under Construction")}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-50 pb-1.5">
                        <span className="text-gray-400 font-bold">{currentLanguage === "ar" ? "القيمة التقديرية:" : "Stated Capital:"}</span>
                        <span className="font-extrabold text-slate-800">${p.capitalUsd.toLocaleString()} USD</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-1.5">
                        <span className="text-gray-400 font-bold">{currentLanguage === "ar" ? "الوظائف المستهدفة:" : "Workforce Target:"}</span>
                        <span className="font-extrabold text-slate-800">{p.employmentForecast.toLocaleString()} {currentLanguage === "ar" ? "وظيفة" : "Jobs"}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-1.5">
                        <span className="text-gray-400 font-bold">{currentLanguage === "ar" ? "المنطقة والموقع الجغرافي:" : "Sovereign Site:"}</span>
                        <span className="font-extrabold text-slate-800 flex items-center gap-0.5">
                          <MapPin className="h-3.5 w-3.5 text-sudan-gold" />
                          {currentLanguage === "ar" ? p.locationAr : p.locationEn}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold">{currentLanguage === "ar" ? "مصدر التمويل المالي:" : "Funding Channel:"}</span>
                        <span className="font-extrabold text-slate-600">{currentLanguage === "ar" ? p.fundingSourceAr : p.fundingSourceEn}</span>
                      </div>
                    </div>

                    {/* Progress slider / bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400">{currentLanguage === "ar" ? "تقدم البناء والتشغيل" : "Milestone Completion"}</span>
                        <span className="text-sudan-green font-extrabold">{p.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-sudan-green h-full" style={{ width: `${p.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ECONOMIC ZONES WITH SVG GIS MAP */}
          {activeTab === "zones" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Interactive SVG GIS Map representation */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {currentLanguage === "ar" ? "خارطة الاستثمارات القومية ونظام المعلومات الجغرافي GIS" : "National Economic Zones Geographic Map (GIS)"}
                  </h4>
                  <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "انقر على النقاط الاستراتيجية لعرض بيانات المدينة الصناعية الحرة" : "Click interactive hot spots to fetch utilities, occupancy & lease data"}</p>
                </div>

                <div className="bg-[#FAFBFB] rounded-2xl p-4 border border-slate-100 relative h-96 flex items-center justify-center">
                  
                  {/* Styled GIS representation of Sudan map outline with rivers */}
                  <svg className="w-full h-full max-h-80" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Simulated Country Outline */}
                    <path d="M150,50 L250,40 L350,80 L380,180 L420,200 L440,280 L400,320 L350,450 L250,470 L120,430 L80,300 L90,150 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" strokeLinejoin="round" />
                    
                    {/* Nile river flow */}
                    <path d="M250,470 C240,400 245,300 270,250 C290,210 260,180 260,140 C260,100 280,60 250,40" fill="none" stroke="#3B82F6" strokeWidth="3" opacity="0.6" />
                    <path d="M270,250 C200,280 180,320 180,380" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" />
                    
                    {/* Hotspots for zones */}
                    {/* Giad */}
                    <circle cx="265" cy="270" r="10" className={`cursor-pointer transition-all ${selectedZone.id === "giad" ? "fill-sudan-green stroke-sudan-gold stroke-3 animate-pulse" : "fill-[#C5A059] hover:fill-sudan-green"}`} onClick={() => setSelectedZone(INDUSTRIAL_ZONES[0])} />
                    {/* Port Sudan */}
                    <circle cx="390" cy="190" r="10" className={`cursor-pointer transition-all ${selectedZone.id === "port_sudan_free" ? "fill-sudan-green stroke-sudan-gold stroke-3 animate-pulse" : "fill-[#C5A059] hover:fill-sudan-green"}`} onClick={() => setSelectedZone(INDUSTRIAL_ZONES[1])} />
                    {/* El Bagair */}
                    <circle cx="270" cy="230" r="10" className={`cursor-pointer transition-all ${selectedZone.id === "el_bagair" ? "fill-sudan-green stroke-sudan-gold stroke-3 animate-pulse" : "fill-[#C5A059] hover:fill-sudan-green"}`} onClick={() => setSelectedZone(INDUSTRIAL_ZONES[2])} />
                    {/* Khartoum North */}
                    <circle cx="260" cy="210" r="10" className={`cursor-pointer transition-all ${selectedZone.id === "khartoum_north" ? "fill-sudan-green stroke-sudan-gold stroke-3 animate-pulse" : "fill-[#C5A059] hover:fill-sudan-green"}`} onClick={() => setSelectedZone(INDUSTRIAL_ZONES[3])} />
                    {/* Salamat */}
                    <circle cx="255" cy="180" r="10" className={`cursor-pointer transition-all ${selectedZone.id === "salamat" ? "fill-sudan-green stroke-sudan-gold stroke-3 animate-pulse" : "fill-[#C5A059] hover:fill-sudan-green"}`} onClick={() => setSelectedZone(INDUSTRIAL_ZONES[4])} />
                    {/* Kosti */}
                    <circle cx="240" cy="340" r="10" className={`cursor-pointer transition-all ${selectedZone.id === "kosti" ? "fill-sudan-green stroke-sudan-gold stroke-3 animate-pulse" : "fill-[#C5A059] hover:fill-sudan-green"}`} onClick={() => setSelectedZone(INDUSTRIAL_ZONES[5])} />

                    {/* Labels */}
                    <text x="360" y="170" fill="#1E293B" fontSize="9" fontWeight="bold">بورتسودان (Port Sudan)</text>
                    <text x="280" y="220" fill="#1E293B" fontSize="9" fontWeight="bold">الخرطوم بحري (Khartoum)</text>
                    <text x="280" y="275" fill="#1E293B" fontSize="9" fontWeight="bold">جياد (Giad)</text>
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-150 text-[9px] space-y-1.5 font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 bg-sudan-green rounded-full"></span>
                      <span>{currentLanguage === "ar" ? "المنطقة المحددة" : "Selected Zone"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 bg-sudan-gold rounded-full"></span>
                      <span>{currentLanguage === "ar" ? "مناطق حرة ومجمعات صناعية" : "Sovereign Industrial Hubs"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-0.5 w-4 bg-blue-500 block"></span>
                      <span>{currentLanguage === "ar" ? "مسار نهر النيل الاستراتيجي" : "The Nile Corridor"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zone Details Side Card */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-sudan-green/10 text-sudan-green rounded-xl flex items-center justify-center">
                    <Landmark className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">{currentLanguage === "ar" ? selectedZone.nameAr : selectedZone.nameEn}</h4>
                    <p className="text-[10px] text-gray-400 font-extrabold">State of {selectedZone.state}</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="bg-[#FAFBFB] p-4 rounded-2xl border border-slate-100 space-y-2">
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "المرافق المتاحة والبنية التحتية:" : "Available Utilities & Power Grid:"}</p>
                    <ul className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                      <li className="flex items-center gap-1 text-sudan-green">✓ Industrial Water (مياه معالجة)</li>
                      <li className="flex items-center gap-1 text-sudan-green">✓ High-Voltage Grid (شبكة جهد عالي)</li>
                      <li className="flex items-center gap-1 text-sudan-green">✓ Fiber Connectivity (ألياف بصرية)</li>
                      <li className="flex items-center gap-1 text-[#C5A059]">⚡ Solar Hybrid (طاقة شمسية هجينة)</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold">{currentLanguage === "ar" ? "المساحة المتاحة" : "Available Area"}</span>
                      <p className="font-black text-xs text-slate-800">4,200,000 SQM</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold">{currentLanguage === "ar" ? "معدل الإشغال الجاري" : "Occupancy Rate"}</span>
                      <p className="font-black text-xs text-slate-800">76% Occupied</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-bold block">{currentLanguage === "ar" ? "الحوافز الضريبية والامتيازات الخاصة بالمنطقة:" : "Specific Incentives & Tax Rebates:"}</span>
                    <p className="text-[11px] font-extrabold text-slate-600 leading-relaxed">
                      {selectedZone.id === "port_sudan_free" 
                        ? (currentLanguage === "ar" ? "إعفاء كامل بنسبة 100% من الجمارك، إعفاء ضريبي للمستثمر الأجنبي لـ 15 سنة، تخفيض رسوم الشحن الصادر." : "100% customs waiver, 15-year tax holiday for foreign FDI, discounted export port fees.")
                        : (currentLanguage === "ar" ? "إعفاء ضريبي لمدة 7 سنوات، ربط مباشر بمدينة جياد الهندسية، شبكة كهرباء مستقلة بنظام المرابحة." : "7-year tax holiday, direct integration with Giad engineering cluster, independent priority hybrid power.")}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        setPreferredIndustrialZone(selectedZone.nameAr);
                        setProposedProject(currentLanguage === "ar" ? `تأسيس مصنع متكامل في ${selectedZone.nameAr}` : `Establishment of an integrated facility in ${selectedZone.nameEn}`);
                        setActiveTab("services");
                        setIsFormOpen(true);
                      }}
                      className="w-full bg-sudan-dark hover:bg-sudan-dark/80 text-slate-900 text-xs font-black py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{currentLanguage === "ar" ? "طلب تخصيص فوري في هذه المنطقة" : "Request Instant Land Lease Here"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INCENTIVES & FDI */}
          {activeTab === "incentives" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Eligibility Check tool */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {currentLanguage === "ar" ? "محاكي تقييم الأهلية والحوافز الضريبية والجمركية" : "Sovereign Incentives & Tax Holiday Eligibility Simulator"}
                  </h4>
                  <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "أدخل حجم رأس المال لتحديد نطاق الإعفاءات المعتمد" : "Enter sector and capital metrics to verify federal tax and land support ranges"}</p>
                </div>

                <form onSubmit={handleCheckIncentives} className="space-y-4 text-xs text-slate-700">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "القطاع الاستثماري المستهدف" : "Target Investment Sector"}</label>
                    <select 
                      value={checkSector} 
                      onChange={(e) => setCheckSector(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold"
                    >
                      <option value="food">{currentLanguage === "ar" ? "صناعات زراعية وغذائية (Gum Arabic / Sesame)" : "Agro-Pastoral & Gum Arabic"}</option>
                      <option value="energy">{currentLanguage === "ar" ? "طاقة نظيفة ومتجددة" : "Clean & Renewable Energy"}</option>
                      <option value="heavy">{currentLanguage === "ar" ? "صناعات ثقيلة وتعدين" : "Heavy Machinery & Metallurgy"}</option>
                      <option value="pharma">{currentLanguage === "ar" ? "القطاع الصيدلاني والطبي" : "Pharmaceuticals & Healthcare"}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "رأس المال المرصود (USD)" : "Planned Capital (USD)"}</label>
                      <input 
                        type="number" 
                        value={checkCapital} 
                        onChange={(e) => setCheckCapital(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "فرص العمل المتوقعة" : "Expected Local Jobs Created"}</label>
                      <input 
                        type="number" 
                        value={checkJobs} 
                        onChange={(e) => setCheckJobs(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-sudan-green hover:bg-sudan-green-light text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Sliders className="h-4 w-4" />
                    <span>{currentLanguage === "ar" ? "تقييم الأهلية والامتيازات الفورية" : "Simulate Sovereign Tax Rebate"}</span>
                  </button>
                </form>

                {incentiveEligible && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#006B3F]" />
                      <h5 className="font-black text-slate-800 text-xs">
                        {currentLanguage === "ar" ? "الحوافز الضريبية والامتيازات الممنوحة" : "Federal Incentives Earned:"}
                      </h5>
                    </div>
                    <div className="space-y-2 text-[11px] text-slate-700 font-bold">
                      <p className="flex justify-between border-b border-emerald-100/50 pb-1">
                        <span>• Tax Holiday Frame (الإعفاء الضريبي):</span>
                        <span className="text-[#006B3F] font-extrabold">{incentiveEligible.taxHoliday}</span>
                      </p>
                      <p className="flex justify-between border-b border-emerald-100/50 pb-1">
                        <span>• Customs Rebate (الخصم الجمركي):</span>
                        <span className="text-[#006B3F] font-extrabold">{incentiveEligible.customExempt}</span>
                      </p>
                      <p className="flex justify-between border-b border-emerald-100/50 pb-1">
                        <span>• Land lease discount (امتياز الأرض):</span>
                        <span className="text-[#006B3F] font-extrabold">{incentiveEligible.landDiscount}</span>
                      </p>
                      <p className="pt-1">
                        <span className="text-slate-400 block text-[10px] uppercase">COMESA & Trade Benefits (شراكة الكوميسا):</span>
                        <span className="text-[#006B3F] font-extrabold leading-relaxed">{incentiveEligible.extraBenefits}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* FDI Inflow Tracker List */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {currentLanguage === "ar" ? "تدفقات الاستثمار الأجنبي المباشر (FDI) لعام 2026" : "Foreign Direct Investment (FDI) Sovereign Approvals"}
                  </h4>
                  <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "متابعة مصادر التمويل الخارجي وتوثيقاتها سيادياً" : "Verified overseas entities, origin country and total approved capital layout"}</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-[#FAFBFB] rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-[#006B3F] rounded-full"></span>
                      <span>{currentLanguage === "ar" ? "المملكة العربية السعودية" : "Saudi Arabia"}</span>
                    </div>
                    <span className="font-extrabold text-slate-800">$85M Authorized Capital</span>
                  </div>
                  <div className="p-3 bg-[#FAFBFB] rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-[#006B3F] rounded-full"></span>
                      <span>{currentLanguage === "ar" ? "الصين" : "People's Republic of China"}</span>
                    </div>
                    <span className="font-extrabold text-slate-800">$150M Authorized Capital</span>
                  </div>
                  <div className="p-3 bg-[#FAFBFB] rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-[#006B3F] rounded-full"></span>
                      <span>{currentLanguage === "ar" ? "تركيا" : "Republic of Turkey"}</span>
                    </div>
                    <span className="font-extrabold text-slate-800">$18M Authorized Capital</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5 text-[11px] leading-relaxed text-slate-500 font-bold">
                  <p className="text-slate-700 flex items-center gap-1.5 font-extrabold">
                    <ShieldCheck className="h-4 w-4 text-sudan-green" />
                    {currentLanguage === "ar" ? "حماية تدفقات رؤوس الأموال الأجنبية" : "FDI Capital Protection Act"}
                  </p>
                  <p>
                    {currentLanguage === "ar"
                      ? "جميع تدفقات الاستثمار الأجنبي المباشر محمية بالكامل بموجب الفصل الرابع من اللائحة السيادية لعام 2026، والتي تضمن حرية ترحيل الأرباح والمعاملة التفضيلية لمشاريع الكوميسا."
                      : "Under Chapter 4 of the Sovereign Trade Act, all FDI projects enjoy full capital repatriation rights, protection against expropriation, and instant regulatory licensing."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PRIORITY MEGAPROJECTS */}
          {activeTab === "strategic" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  {currentLanguage === "ar" ? "مشاريع البنية التحتية والتنمية الاستراتيجية القومية" : "Priority National Megaprojects Status Board"}
                </h4>
                <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "متابعة مباشرة للمشاريع السيادية لفتح الممرات المائية واللوجستية" : "Direct oversight of priority megaprojects unlocking regional corridors"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strategicProjects.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md uppercase">
                            {p.category}
                          </span>
                          <h5 className="font-black text-slate-800 text-sm mt-1.5">{currentLanguage === "ar" ? p.nameAr : p.nameEn}</h5>
                        </div>
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                          p.risk === "low" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                          p.risk === "medium" ? "bg-amber-50 text-amber-800 border-amber-200" :
                          "bg-rose-50 text-rose-800 border-rose-200"
                        }`}>
                          Risk: {p.risk.toUpperCase()}
                        </span>
                      </div>

                      <div className="bg-[#FAFBFB] p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1.5 font-bold">
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "المرحلة الحالية والمؤشر المنجز:" : "Current Stage & Milestone:"}</p>
                        <p className="text-slate-700">{currentLanguage === "ar" ? p.milestoneAr : p.milestoneEn}</p>
                      </div>

                      <div className="bg-[#FAFBFB] p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1.5 font-bold">
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "الأثر الاقتصادي المتوقع لـ 2035:" : "Vision 2035 Economic Impact:"}</p>
                        <p className="text-sudan-green leading-relaxed">{currentLanguage === "ar" ? p.impactAr : p.impactEn}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-400">Megaproject Budget:</span>
                        <span className="text-slate-800 font-extrabold">${(p.budgetUsd / 1000000).toFixed(1)}M USD</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400">Construct Milestone Progress:</span>
                        <span className="text-sudan-green font-extrabold">{p.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-sudan-green h-full" style={{ width: `${p.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: AI INVESTMENT ADVISOR */}
          {activeTab === "advisor" && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-sudan-gold animate-spin" />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                    {currentLanguage === "ar" ? "مستشار التنمية والذكاء الاصطناعي الاستثماري الذكي" : "Vision 2035 Federated AI Investment Advisor"}
                  </h4>
                  <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "توليد فوري للتقارير والفرص الاستثمارية استناداً إلى نموذج Gemini 3.5" : "Real-time AI matching, trend analysis and compliance guidance tailored for Sudan"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Advisor Inputs */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "حدد موضوع وسيناريو التحليل:" : "Choose Advisor Scenario:"}</label>
                    <select 
                      value={advisorScenario} 
                      onChange={(e) => setAdvisorScenario(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold"
                    >
                      <option value="recommend_opps">{currentLanguage === "ar" ? "توصية بفرص استثمارية لـ 2035" : "Recommend Strategic Opportunities"}</option>
                      <option value="match_investors">{currentLanguage === "ar" ? "مطابقة المستثمرين مع المشاريع المتاحة" : "Match Investors to Priorities"}</option>
                      <option value="forecast_trends">{currentLanguage === "ar" ? "توقع اتجاهات نمو رأس المال والتصدير" : "Forecast Capital Growth Trends"}</option>
                      <option value="predict_risks">{currentLanguage === "ar" ? "تحليل مخاطر تذبذب العملة ومسارات النقل" : "Predict Trade Corridor Risks"}</option>
                      <option value="suggest_incentives">{currentLanguage === "ar" ? "تحديد الحوافز المثلى لجذب FDI" : "Suggest Optimised FDI Incentives"}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "ملاحظات أو أسئلة إضافية للمستشار:" : "Custom prompts or additional context:"}</label>
                    <textarea 
                      rows={4}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: أريد تحليلاً شاملاً لحجم صادرات الصمغ العربي عبر ميناء بورتسودان بحلول 2030..." : "e.g., Provide a growth forecast for a 15,000 SQM refinery in Port Sudan Free Zone..."}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:bg-white focus:border-sudan-green text-xs font-bold resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleCallAIAdvisor}
                    disabled={isAdvising}
                    className="w-full bg-sudan-green hover:bg-sudan-green-light text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md text-xs uppercase"
                  >
                    <RefreshCw className={`h-4 w-4 ${isAdvising ? "animate-spin" : ""}`} />
                    <span>{isAdvising ? (currentLanguage === "ar" ? "جاري الاستشارة الفيدرالية..." : "Generating Sovereign Insights...") : (currentLanguage === "ar" ? "استدعاء مستشار الاستثمار" : "Invoke AI Investment Advisor")}</span>
                  </button>
                </div>

                {/* Advisor Outputs */}
                <div className="lg:col-span-7 bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 min-h-[300px] flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] bg-amber-100 text-[#C5A059] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {currentLanguage === "ar" ? "مخرجات مستشار الذكاء الاصطناعي السيادي" : "Federal AI Generated Report"}
                    </span>
                    
                    {advisorOutput ? (
                      <div className="mt-4 text-xs text-slate-800 leading-relaxed font-bold whitespace-pre-wrap">
                        {advisorOutput}
                      </div>
                    ) : (
                      <div className="mt-12 text-center text-slate-400 space-y-2">
                        <HelpCircle className="h-10 w-10 mx-auto text-slate-300" />
                        <p className="text-xs">{currentLanguage === "ar" ? "الرجاء تحديد السيناريو والنقر على زر الاستدعاء للحصول على الإرشاد." : "Select your target metrics on the left and invoke the advisor to load sovereign AI predictions."}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-gray-400 font-bold">
                    <span>Model: Gemini 3.5 Flash</span>
                    <span>Safety: 100% Secure Node</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: LAND SERVICES & PROCEDURES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              
              {/* Existing Land Application and Zone Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOpportunities.map(opp => (
                  <div 
                    key={opp.id} 
                    className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-sudan-gold/30 transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-[9px] bg-amber-100 text-[#C5A059] border border-amber-200 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {currentLanguage === "ar" ? opp.sectorAr : opp.sectorEn}
                          </span>
                          <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base leading-snug">
                            {currentLanguage === "ar" ? opp.titleAr : opp.titleEn}
                          </h4>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl font-bold text-xs font-mono border border-emerald-100 shrink-0">
                          {opp.requiredCapital}
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed">
                        {currentLanguage === "ar" ? opp.descriptionAr : opp.descriptionEn}
                      </p>

                      <div className="bg-[#F4F6F5] p-3.5 rounded-2xl space-y-1 border border-gray-100 text-xs">
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "الحوافز والتسهيلات المتاحة:" : "Incentives & Tax Deductions:"}</p>
                        <p className="text-gray-500 leading-relaxed font-bold">
                          {currentLanguage === "ar" ? opp.incentivesAr : opp.incentivesEn}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-sudan-gold" />
                        {currentLanguage === "ar" ? opp.locationAr : opp.locationEn}
                      </span>
                      <button
                        onClick={() => handleOpenFormWithOpp(opp)}
                        className="bg-sudan-dark hover:bg-sudan-dark/80 text-slate-900 text-[10px] font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all duration-300 shadow-sm"
                      >
                        <span>{currentLanguage === "ar" ? "التقديم وتخصيص أرض" : "Apply & Lease Land"}</span>
                        <ArrowRight className={`h-3.5 w-3.5 ${currentLanguage === "ar" ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Secure Document Management */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-sudan-green" />
                  {currentLanguage === "ar" ? "المستندات ودراسات الجدوى المرفقة سيادياً" : "Sovereign Document Management Vault"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Drag and Drop Zone */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-sudan-gold transition-colors"
                  >
                    <Plus className="h-8 w-8 text-sudan-gold animate-pulse" />
                    <p className="text-xs font-bold text-slate-700">{currentLanguage === "ar" ? "اسحب وأفلت دراسة الجدوى أو عقد الأرض هنا" : "Drag and drop Feasibility Study or Lease Agreement"}</p>
                    <p className="text-[9px] text-gray-400 font-bold">PDF, DOCX up to 15MB. Encrypted under Vision 2035 rules.</p>
                  </div>

                  {/* Uploaded files list */}
                  <div className="space-y-2.5">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2 text-slate-700">
                          <FileText className="h-4 w-4 text-sudan-green" />
                          <span className="truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Applications History list */}
              <div className="space-y-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-sudan-green" />
                  {currentLanguage === "ar" ? "طلبات حجز الأراضي الصناعية السابقة" : "Industrial Lease Applications History"}
                </h4>
                
                <div className="divide-y divide-gray-100">
                  {applications.map(app => (
                    <div key={app.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                      <div className="space-y-1.5">
                        <p className="font-extrabold text-[#1E293B]">{app.proposedProject}</p>
                        <p className="text-gray-400">
                          {currentLanguage === "ar" 
                            ? `المستثمر: ${app.investorName} | المنطقة المفضلة: ${app.preferredIndustrialZone} (${app.requestedAreaSqm.toLocaleString()} متر مربع)` 
                            : `Investor: ${app.investorName} | Zone: ${app.preferredIndustrialZone} (${app.requestedAreaSqm.toLocaleString()} SQM)`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                          app.status === "approved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                          app.status === "rejected" ? "bg-rose-100 text-rose-800 border-rose-200" :
                          "bg-amber-100 text-amber-800 border-amber-200"
                        }`}>
                          {app.status === "approved" ? (currentLanguage === "ar" ? "موافق عليها" : "Lease Granted") :
                           app.status === "rejected" ? (currentLanguage === "ar" ? "مرفوضة" : "Rejected") :
                           (currentLanguage === "ar" ? "قيد الدراسة الفنية" : "Under Study")}
                        </span>

                        {isAdmin && app.status === "pending" && onUpdateAppStatus && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => onUpdateAppStatus(app.id, ApplicationStatus.APPROVED)}
                              className="bg-sudan-green hover:bg-sudan-green-light text-white font-bold p-1 rounded-md cursor-pointer"
                              title={currentLanguage === "ar" ? "الموافقة والمنح" : "Approve & Grant"}
                            >
                              ✓
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="text-center py-6 text-slate-400">{currentLanguage === "ar" ? "لا توجد طلبات جارية" : "No ongoing lease applications found"}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: EXECUTIVE INVESTMENT REPORTS */}
          {activeTab === "reports" && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {currentLanguage === "ar" ? "استخبارات الاستثمار وإصدار التقارير التنفيذية السيادية" : "Sovereign Executive Investment Intelligence Reports"}
                  </h4>
                  <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "اختر نوع التقرير المطلوب لتوليده وتصديقه رقمياً" : "Configure and generate real-time visual-backed executive investment briefs"}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={selectedReportType} 
                    onChange={(e) => setSelectedReportType(e.target.value)}
                    className="bg-slate-50 border border-gray-200 text-xs font-bold rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="executive">{currentLanguage === "ar" ? "تقرير الاستثمار الشامل" : "Executive Brief"}</option>
                    <option value="fdi">{currentLanguage === "ar" ? "تقرير تدفق رأس المال الأجنبي FDI" : "FDI Inflow Trends"}</option>
                    <option value="zones">{currentLanguage === "ar" ? "تقرير كفاءة المدن الصناعية" : "Economic Zones Performance"}</option>
                  </select>

                  <button 
                    onClick={handleGenerateReport}
                    className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{currentLanguage === "ar" ? "توليد وتصديق التقرير" : "Generate Certified Brief"}</span>
                  </button>
                </div>
              </div>

              {/* Render generated report as a official sealed document */}
              {generatedReport ? (
                <div className="border border-slate-300 rounded-2xl p-6 bg-[#FCFDFD] shadow-sm space-y-4 font-bold text-xs text-slate-700 relative">
                  {/* Watermark Logo symbol */}
                  <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
                    <Landmark className="h-40 w-40 text-sudan-green" />
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 text-sm">{currentLanguage === "ar" ? "وزارة التجارة والصناعة الاتحادية السودانية" : "REPUBLIC OF THE SUDAN"}</h4>
                      <p className="text-[10px] text-gray-400">Federal Ministry of Commerce & Industry | Vision 2035</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-400 font-mono">
                      <p>Serial: {generatedReport.serial}</p>
                      <p>Issued: {generatedReport.date}</p>
                    </div>
                  </div>

                  <div className="space-y-3 leading-relaxed">
                    <p className="font-extrabold text-slate-800 text-sm">
                      Subject: {generatedReport.type.toUpperCase()} INVESTMENT INTELLIGENCE UPDATE
                    </p>
                    <p className="text-slate-600 font-medium">
                      {generatedReport.summary}
                    </p>
                    
                    {/* Visual miniature chart injection */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1 mt-4">
                      <p className="text-[10px] text-gray-400">Visual Core Growth (النمو السنوي):</p>
                      <div className="h-20 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartDataYearly.slice(3, 7)}>
                            <Bar dataKey="fdi" fill="#006B3F" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="domestic" fill="#C5A059" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-sudan-green" />
                      <div>
                        <p className="text-[10px] text-[#006B3F] font-extrabold">✓ Certified Sovereign Ledger Signature</p>
                        <p className="text-[9px] text-gray-400">Immutable blockchain anchor active</p>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-gray-400">
                      <p>Authorised by: {generatedReport.author.toUpperCase()}</p>
                      <p>SDMCI Registry Node 1</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-slate-300" />
                  <p>{currentLanguage === "ar" ? "الرجاء النقر على زر التوليد في الأعلى لصياغة التقرير مع الرسوم البيانية." : "Click 'Generate Certified Brief' to instantly build your official economic report."}</p>
                </div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* MODAL 1: REGISTER INVESTOR */}
      <AnimatePresence>
        {isInvestorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-sudan-dark text-slate-900">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-sudan-gold" />
                  {currentLanguage === "ar" ? "تسجيل مستثمر وطني/أجنبي جديد" : "Register Sovereign NII Entity"}
                </h3>
                <button onClick={() => setIsInvestorModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleRegisterInvestor} className="p-6 space-y-4 text-slate-700 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "الاسم التجاري (العربية) *" : "Entity Name (Arabic) *"}</label>
                    <input 
                      type="text" 
                      required 
                      value={regNameAr} 
                      onChange={(e) => setRegNameAr(e.target.value)}
                      placeholder="شركة النيل للاستثمار" 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "الاسم التجاري (الإنجليزية) *" : "Entity Name (English) *"}</label>
                    <input 
                      type="text" 
                      required 
                      value={regNameEn} 
                      onChange={(e) => setRegNameEn(e.target.value)}
                      placeholder="Nile Investment Co." 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "نوع فئة المستثمر *" : "Investor Classification *"}</label>
                    <select 
                      value={regType} 
                      onChange={(e) => setRegType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                    >
                      <option value="domestic">{currentLanguage === "ar" ? "وطني" : "Domestic"}</option>
                      <option value="foreign">{currentLanguage === "ar" ? "أجنبي مباشر FDI" : "FDI Foreign"}</option>
                      <option value="jv">{currentLanguage === "ar" ? "مشروع مشترك JV" : "Joint Venture"}</option>
                      <option value="sovereign">{currentLanguage === "ar" ? "صندوق سيادي شراكة" : "Sovereign Partnership"}</option>
                      <option value="ppp">{currentLanguage === "ar" ? "شراكة عامة وخاصة PPP" : "PPP"}</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "رأس المال المستثمر (USD) *" : "Planned Stated Capital (USD) *"}</label>
                    <input 
                      type="number" 
                      required 
                      value={regCapital} 
                      onChange={(e) => setRegCapital(e.target.value)}
                      placeholder="e.g. 5000000" 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "بلد الموطن الأصل (عربي)" : "Origin Country (Arabic)"}</label>
                    <input 
                      type="text" 
                      value={regCountryAr} 
                      onChange={(e) => setRegCountryAr(e.target.value)}
                      placeholder="السودان" 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "بلد الموطن الأصل (إنجليزي)" : "Origin Country (English)"}</label>
                    <input 
                      type="text" 
                      value={regCountryEn} 
                      onChange={(e) => setRegCountryEn(e.target.value)}
                      placeholder="Sudan" 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsInvestorModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-xl font-bold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                  <button type="submit" className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2.5 rounded-xl font-bold cursor-pointer">
                    {currentLanguage === "ar" ? "إصدار NII والتحقق" : "Issue NII & Approve"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: INSERT PROJECT */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-sudan-dark text-slate-900">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-sudan-gold" />
                  {currentLanguage === "ar" ? "إدراج مشروع تنمية استثماري جديد" : "Insert Investment Project"}
                </h3>
                <button onClick={() => setIsProjectModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleRegisterProject} className="p-6 space-y-4 text-slate-700 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المشروع (عربي) *" : "Project Name (Arabic) *"}</label>
                    <input 
                      type="text" 
                      required 
                      value={projNameAr} 
                      onChange={(e) => setProjNameAr(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المشروع (إنجليزي) *" : "Project Name (English) *"}</label>
                    <input 
                      type="text" 
                      required 
                      value={projNameEn} 
                      onChange={(e) => setProjNameEn(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "القطاع الاستثماري (عربي)" : "Sector (Arabic)"}</label>
                    <input 
                      type="text" 
                      value={projSectorAr} 
                      onChange={(e) => setProjSectorAr(e.target.value)}
                      placeholder="صناعات تحويلية"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "القطاع الاستثماري (إنجليزي)" : "Sector (English)"}</label>
                    <input 
                      type="text" 
                      value={projSectorEn} 
                      onChange={(e) => setProjSectorEn(e.target.value)}
                      placeholder="Agro-Processing"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "قيمة رأس المال (USD)" : "Capital (USD)"}</label>
                    <input 
                      type="number" 
                      required 
                      value={projCapital} 
                      onChange={(e) => setProjCapital(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "فرص العمل المستهدفة" : "Jobs Forecast"}</label>
                    <input 
                      type="number" 
                      value={projJobs} 
                      onChange={(e) => setProjJobs(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "الموقع الصناعي المقترح" : "Proposed Location"}</label>
                    <input 
                      type="text" 
                      value={projLocation} 
                      onChange={(e) => setProjLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsProjectModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-xl font-bold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                  <button type="submit" className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2.5 rounded-xl font-bold cursor-pointer">
                    {currentLanguage === "ar" ? "إدراج وتفعيل" : "Insert & Activate"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FORM MODAL FOR LAND BOOKING */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-sudan-dark text-slate-900">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-sudan-gold" />
                  {currentLanguage === "ar" ? "حجز أرض صناعية استثمارية" : "Apply for Industrial Land Lease"}
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-10 text-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-slate-800">{currentLanguage === "ar" ? "تم تسجيل طلب التخصيص!" : "Application Logged!"}</h4>
                  <p className="text-xs text-slate-400">{currentLanguage === "ar" ? "سيقوم فريق التنمية الصناعية بدراسة المخطط والموافقة." : "The Industrial Development Unit will review your project layout."}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-700 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المستثمر / الشركة المستفيدة *" : "Investor / Company Name *"}</label>
                    <input
                      type="text"
                      required
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      placeholder="e.g. Khaled bin Saeed Al-Nahdi"
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "المشروع الصناعي المقترح *" : "Proposed Industrial Project *"}</label>
                    <textarea
                      required
                      rows={2}
                      value={proposedProject}
                      onChange={(e) => setProposedProject(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: مصنع تدوير و تعبئة الصمغ العربي" : "e.g. Factory for Refined Gum Arabic"}
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all resize-none font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "المساحة المطلوبة (متر مربع) *" : "Area Required (SQM) *"}</label>
                      <input
                        type="number"
                        required
                        value={requestedAreaSqm}
                        onChange={(e) => setRequestedAreaSqm(e.target.value)}
                        placeholder="e.g. 10000"
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "المدينة الصناعية المفضلة *" : "Preferred Industrial Zone *"}</label>
                      <select
                        value={preferredIndustrialZone}
                        onChange={(e) => setPreferredIndustrialZone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green font-bold"
                      >
                        {INDUSTRIAL_ZONES.map(z => (
                          <option key={z.id} value={z.nameAr}>{currentLanguage === "ar" ? z.nameAr : z.nameEn}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                    <button type="submit" disabled={isSubmitting} className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-md">
                      {isSubmitting ? "..." : (currentLanguage === "ar" ? "إرسال طلب تخصيص الأرض" : "Submit Lease Lease")}
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
