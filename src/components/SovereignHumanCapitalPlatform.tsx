import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, UserCheck, Calendar, DollarSign, Award, BookOpen, ShieldCheck, 
  Search, Plus, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, BarChart3, 
  Database, RefreshCw, Briefcase, MapPin, UserPlus, FileText, ArrowLeftRight, 
  ChevronRight, Lock, Signature, Clock, CloudLightning, HelpCircle
} from "lucide-react";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";

interface SovereignHumanCapitalPlatformProps {
  currentLanguage: "ar" | "en";
  role: string;
}

export default function SovereignHumanCapitalPlatform({ currentLanguage, role }: SovereignHumanCapitalPlatformProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "directory" | "payroll" | "attendance" | "talent" | "audit" | "ai-advisor">("dashboard");

  // Data states
  const [employees, setEmployees] = useState<any[]>([]);
  const [orgUnits, setOrgUnits] = useState<any[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [talentPools, setTalentPools] = useState<any[]>([]);
  const [hrAuditLogs, setHrAuditLogs] = useState<any[]>([]);
  
  // App State Helpers
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterDept, setFilterDept] = useState<string>("all");
  
  // Selected detail cards
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [lifecycleAction, setLifecycleAction] = useState<string | null>(null); // "promotion", "transfer", "onboarding_pass", "termination"
  
  // Digital signing state for Payroll or HR decrees
  const [signingItem, setSigningItem] = useState<any | null>(null); // payroll
  const [signingStep, setSigningStep] = useState<number>(0);
  const [nationalId, setNationalId] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");

  // Forms states
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    nameAr: "", nameEn: "", email: "", phone: "", nationalId: "",
    department: "الشؤون الإدارية والمالية", section: "إدارة الموارد البشرية",
    position: "محلل موارد بشرية مساعد", grade: "السادسة", basicSalary: "180000",
    allowanceTransport: "20000", allowanceHousing: "30000", allowanceNature: "25000",
    deductionTax: "5000", deductionInsurance: "12000",
    bankName: "بنك الخرطوم", bankAccount: "SD82BOK00100", costCenter: "CC-HR-101",
    role: "Employee"
  });

  const [newVacancyForm, setNewVacancyForm] = useState({
    titleAr: "", titleEn: "", department: "الرقابة وحماية المستهلك",
    grade: "السادسة", salaryRange: "200,000 - 250,000 SDG", requirementsAr: ""
  });

  const [newLeaveForm, setNewLeaveForm] = useState({
    employeeId: "emp-001", type: "annual", startDate: "", endDate: "", days: "5", reason: ""
  });

  const [newPerfForm, setNewPerfForm] = useState({
    employeeId: "emp-003", period: "2026", kpiScore: "85", competencyScore: "80",
    feedback: "", finalRating: "B", recommendedAction: "none"
  });

  const [newTrainingForm, setNewTrainingForm] = useState({
    titleAr: "", titleEn: "", startDate: "", endDate: "", instructor: "", attendees: ["emp-003"]
  });

  const [newOrgForm, setNewOrgForm] = useState({
    nameAr: "", nameEn: "", type: "department", parent: "unit-3", manager: ""
  });

  // AI Advisor States
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiScenario, setAiScenario] = useState<string>("generate_hr_report");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Punch in/out simulation
  const [punchingIn, setPunchingIn] = useState<boolean>(false);
  const [currentPunchStatus, setCurrentPunchStatus] = useState<any>(null);

  // Fetch all HR & Payroll data
  const fetchAllHRData = async () => {
    setLoading(true);
    try {
      const [
        emps, orgs, vacs, apps, pays, atts, lvs, perfs, trns, pools, logs
      ] = await Promise.all([
        fetch("/api/hr/employees").then(r => r.json()),
        fetch("/api/hr/org-units").then(r => r.json()),
        fetch("/api/hr/vacancies").then(r => r.json()),
        fetch("/api/hr/applications").then(r => r.json()),
        fetch("/api/hr/payrolls").then(r => r.json()),
        fetch("/api/hr/attendance").then(r => r.json()),
        fetch("/api/hr/leaves").then(r => r.json()),
        fetch("/api/hr/performance").then(r => r.json()),
        fetch("/api/hr/trainings").then(r => r.json()),
        fetch("/api/hr/talent-pools").then(r => r.json()),
        fetch("/api/hr/audit-logs").then(r => r.json())
      ]);

      setEmployees(emps);
      setOrgUnits(orgs);
      setVacancies(vacs);
      setApplications(apps);
      setPayrolls(pays);
      setAttendance(atts);
      setLeaves(lvs);
      setPerformance(perfs);
      setTrainings(trns);
      setTalentPools(pools);
      setHrAuditLogs(logs);

      // check if logged in user has checked in today
      const today = new Date().toISOString().split("T")[0];
      const todayAtt = atts.find((a: any) => a.employeeId === "emp-001" && a.date === today);
      if (todayAtt) {
        setCurrentPunchStatus(todayAtt);
      }
    } catch (err) {
      console.error("Failed to fetch Human Capital & Payroll data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHRData();
  }, []);

  // Post dynamic actions
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        nameAr: newEmployeeForm.nameAr,
        nameEn: newEmployeeForm.nameEn,
        email: newEmployeeForm.email,
        phone: newEmployeeForm.phone,
        nationalId: newEmployeeForm.nationalId,
        department: newEmployeeForm.department,
        section: newEmployeeForm.section,
        position: newEmployeeForm.position,
        grade: newEmployeeForm.grade,
        hireDate: new Date().toISOString().split("T")[0],
        basicSalary: Number(newEmployeeForm.basicSalary),
        allowances: {
          transport: Number(newEmployeeForm.allowanceTransport),
          housing: Number(newEmployeeForm.allowanceHousing),
          natureOfWork: Number(newEmployeeForm.allowanceNature)
        },
        deductions: {
          tax: Number(newEmployeeForm.deductionTax),
          socialInsurance: Number(newEmployeeForm.deductionInsurance)
        },
        bankName: newEmployeeForm.bankName,
        bankAccount: newEmployeeForm.bankAccount,
        costCenter: newEmployeeForm.costCenter,
        role: newEmployeeForm.role,
        createdBy: "ديوان الوزير / نظام الموارد البشرية"
      };

      const res = await fetch("/api/hr/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setEmployees([...employees, data]);
      
      // Reset Form
      setNewEmployeeForm({
        nameAr: "", nameEn: "", email: "", phone: "", nationalId: "",
        department: "الشؤون الإدارية والمالية", section: "إدارة الموارد البشرية",
        position: "محلل موارد بشرية مساعد", grade: "السادسة", basicSalary: "180000",
        allowanceTransport: "20000", allowanceHousing: "30000", allowanceNature: "25000",
        deductionTax: "5000", deductionInsurance: "12000",
        bankName: "بنك الخرطوم", bankAccount: "SD82BOK00100", costCenter: "CC-HR-101",
        role: "Employee"
      });
      
      fetchAllHRData();
      alert(currentLanguage === "ar" ? "تم تعيين الموظف وإدراجه في السجل الاتحادي للخدمة المدنية" : "Employee registered in the Civil Service Registry.");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLifecycleAction = async (employeeId: string, action: string, actionDetails: any) => {
    try {
      const res = await fetch("/api/hr/employees/lifecycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          action,
          details: actionDetails,
          actor: "ديوان الوزير / المدير العام"
        })
      });
      if (res.ok) {
        setLifecycleAction(null);
        setSelectedEmp(null);
        fetchAllHRData();
        alert(currentLanguage === "ar" ? "تم معالجة الإجراء بنجاح وتوثيقه في السجل السيادي" : "Lifecycle operation approved and logged successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/hr/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVacancyForm)
      });
      if (res.ok) {
        setNewVacancyForm({
          titleAr: "", titleEn: "", department: "الرقابة وحماية المستهلك",
          grade: "السادسة", salaryRange: "200,000 - 250,000 SDG", requirementsAr: ""
        });
        fetchAllHRData();
        alert(currentLanguage === "ar" ? "تم نشر الوظيفة الشاغرة للعموم" : "Vacancy successfully published.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLeaveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newLeaveForm,
        days: Number(newLeaveForm.days)
      };
      const res = await fetch("/api/hr/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewLeaveForm({
          employeeId: "emp-001", type: "annual", startDate: "", endDate: "", days: "5", reason: ""
        });
        fetchAllHRData();
        alert(currentLanguage === "ar" ? "تم تقديم طلب الإجازة للمراجعة السيادية" : "Leave request submitted for review.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveLeave = async (leaveId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/hr/leaves/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaveId,
          status,
          managerName: "أحمد الطيب محمد"
        })
      });
      if (res.ok) {
        fetchAllHRData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePayrollDraft = async (period: string) => {
    try {
      const res = await fetch("/api/hr/payrolls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          period,
          officerName: "منى صلاح الجعلي"
        })
      });
      if (res.ok) {
        fetchAllHRData();
        alert(currentLanguage === "ar" ? `تم توليد مسودة رواتب فترة ${period} بناءً على القوة العاملة النشطة` : `Generated payroll draft for period ${period}.`);
      } else {
        const data = await res.json();
        alert(currentLanguage === "ar" ? data.error : data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprovePayrollSignature = async () => {
    if (!signingItem) return;
    if (!nationalId || !pinCode) {
      alert(currentLanguage === "ar" ? "الرجاء إدخال الهوية الوطنية والرقم السري للمصادقة" : "Please input National ID & PIN code.");
      return;
    }
    setSubmitting(true);
    try {
      const roleMapping: Record<string, string> = {
        "government_minister": "HR Director",
        "government_executive": "Financial Auditor",
        "government_employee": "Payroll Officer",
        "business_investor": "Payroll Officer"
      };

      const res = await fetch("/api/hr/payrolls/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payrollId: signingItem.id,
          role: roleMapping[role] || "Financial Auditor",
          name: role === "government_minister" ? "أحمد الطيب محمد" : "طارق عبد الوهاب",
          action: "approve"
        })
      });

      if (res.ok) {
        setSigningItem(null);
        setSigningStep(0);
        setNationalId("");
        setPinCode("");
        fetchAllHRData();
        alert(currentLanguage === "ar" ? "تم التوقيع الإلكتروني السيادي للمرتب والتحويل لبنك السودان" : "Sovereign e-signature appended and fund transfer initiated.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePunchAttendance = async () => {
    setPunchingIn(true);
    try {
      const res = await fetch("/api/hr/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: "emp-001",
          method: "GPS",
          gpsCoords: { lat: 15.5562, lng: 32.5358 } // Khartoum coordinates
        })
      });
      if (res.ok) {
        const attRec = await res.json();
        setCurrentPunchStatus(attRec);
        fetchAllHRData();
        alert(
          currentLanguage === "ar" 
            ? (attRec.checkOut ? "تم تسجيل الانصراف بأمان" : "تم تسجيل الحضور الجغرافي الاتحادي بنجاح")
            : (attRec.checkOut ? "Checked out safely" : "Federal GPS check-in completed successfully")
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPunchingIn(false);
    }
  };

  const handleAskAIAdvisor = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const contextObj = {
        employeesCount: employees.length,
        payrollSum: payrolls.reduce((sum, p) => sum + p.netAmount, 0),
        activeLeaves: leaves.filter(l => l.status === "approved").length,
        vacanciesCount: vacancies.length,
        orgUnitsCount: orgUnits.length
      };

      const res = await fetch("/api/hr/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          scenario: aiScenario,
          context: contextObj
        })
      });
      const data = await res.json();
      setAiResult(data.text);
    } catch (err) {
      console.error("AI Advisor call failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  // Calculations for dashboard
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === "active" || e.status === "probation").length;
  const totalPayrollValue = payrolls.length > 0 ? payrolls[payrolls.length - 1].netAmount : 0;
  const openVacancies = vacancies.filter(v => v.status === "active").length;
  const totalApplications = applications.length;

  // Search filter
  const filteredEmployees = employees.filter(e => {
    const matchesSearch = 
      e.nameAr.includes(searchQuery) || 
      e.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.nationalEmployeeId?.includes(searchQuery) ||
      e.position?.includes(searchQuery);
    
    if (filterDept === "all") return matchesSearch;
    return matchesSearch && e.department === filterDept;
  });

  // Recharts custom label / styling
  const COLORS = ["#007229", "#FF9E1B", "#1E293B", "#EF4444", "#3B82F6"];

  return (
    <div className="space-y-6">
      
      {/* Platform Title Banner */}
      <div className="bg-gradient-to-r from-sudan-green to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
        {/* Decorative Flag Corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D21034] opacity-25 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sudan-gold opacity-10 blur-2xl rounded-full"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sudan-gold uppercase tracking-widest mb-1.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-sudan-gold" />
              <span>{currentLanguage === "ar" ? "نظام الخدمة المدنية الاتحادية السيادي" : "SOVEREIGN FEDERAL CIVIL SERVICE SYSTEM"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {currentLanguage === "ar" ? "رأس المال البشري والرواتب والتعاقب" : "Human Capital, Payroll & Succession Platform"}
            </h2>
            <p className="text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
              {currentLanguage === "ar" 
                ? "إدارة متكاملة للقوة العاملة، والتعويضات المالية الإلكترونية، وتخطيط الهياكل الوظيفية للوزارة وفق مرئيات رؤية السودان للتنمية والتحديث المدني 2035 وبشفرات أمان سيادية."
                : "An integrated portal for employee lifecycles, CBS net digital payrolls, GPS check-in nodes, and high-fidelity workforce AI advisors."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePunchAttendance}
              disabled={punchingIn}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                currentPunchStatus?.checkIn && !currentPunchStatus?.checkOut
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-sudan-gold hover:bg-amber-500 text-slate-900"
              }`}
            >
              <Clock className="h-4 w-4 shrink-0 animate-pulse" />
              <span>
                {punchingIn 
                  ? (currentLanguage === "ar" ? "معالجة..." : "Processing...")
                  : currentPunchStatus?.checkIn && !currentPunchStatus?.checkOut
                    ? (currentLanguage === "ar" ? "تسجيل الانصراف الجغرافي" : "Punch Out (GPS)")
                    : (currentLanguage === "ar" ? "تسجيل الحضور الجغرافي" : "Punch In (GPS)")
                }
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab("ai-advisor")}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-sudan-gold" />
              <span>{currentLanguage === "ar" ? "المستشار الذكي" : "AI Advisor"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-gray-200 scrollbar-none">
        {[
          { id: "dashboard", labelAr: "لوحة المتابعة", labelEn: "Overview Dashboard", icon: BarChart3 },
          { id: "directory", labelAr: "سجل الموظفين والمناصب", labelEn: "Staff Directory", icon: Users },
          { id: "payroll", labelAr: "إدارة الرواتب والأجور", labelEn: "Payroll Ledger", icon: DollarSign },
          { id: "attendance", labelAr: "الحضور والإجازات", labelEn: "Time & Attendance", icon: Calendar },
          { id: "talent", labelAr: "الأداء والتدريب والتعاقب", labelEn: "Talent & Succession", icon: Award },
          { id: "audit", labelAr: "سجل المطابقة والتحقق السيادي", labelEn: "Sovereign Audit Ledger", icon: ShieldCheck },
          { id: "ai-advisor", labelAr: "مستشار رأس المال البشري AI", labelEn: "AI HR Advisor", icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedEmp(null);
                setLifecycleAction(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                isActive 
                  ? "bg-sudan-green text-white shadow-xs font-extrabold" 
                  : "text-gray-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-sudan-gold" : "text-gray-400"}`} />
              <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Render Panel */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-xs">
          <RefreshCw className="h-10 w-10 text-sudan-green animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-bold text-sm">
            {currentLanguage === "ar" ? "جاري تحميل سجلات الخدمة المدنية ومطابقة البيانات السيادية..." : "Retrieving public service registers..."}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            
            {/* 1. OVERVIEW DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                
                {/* Highlights Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { titleAr: "إجمالي الموظفين", titleEn: "Total Employees", val: totalEmployees, subAr: "موظف سيادي مفعّل", subEn: "Registered Active Staff", color: "border-sudan-green text-sudan-green bg-emerald-50/40", icon: Users },
                    { titleAr: "فاتورة الرواتب الشهرية", titleEn: "Monthly Payroll", val: `${totalPayrollValue.toLocaleString()} SDG`, subAr: "اعتماد بنك السودان", subEn: "Authorized CBS Net", color: "border-amber-500 text-amber-500 bg-amber-50/30", icon: DollarSign },
                    { titleAr: "وظائف شاغرة معلنة", titleEn: "Open Vacancies", val: openVacancies, subAr: "منصة الاستقطاب الموحد", subEn: "E-Recruitment Hub", color: "border-slate-800 text-slate-800 bg-slate-50/40", icon: Briefcase },
                    { titleAr: "طلبات التوظيف المستلمة", titleEn: "Job Applications", val: totalApplications, subAr: "قيد المراجعة الفنية", subEn: "Candidates Registered", color: "border-blue-500 text-blue-500 bg-blue-50/40", icon: FileText },
                    { titleAr: "الالتزام بالحضور اليومي", titleEn: "Attendance Rate", val: "94.2%", subAr: "مطابقة الحضور والـ GPS", subEn: "Integrated GPS logs", color: "border-violet-500 text-violet-500 bg-violet-50/40", icon: UserCheck }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className={`p-5 rounded-2xl border-l-4 border-y border-r border-gray-200 bg-white shadow-xs ${stat.color} flex flex-col justify-between`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-extrabold text-gray-500 tracking-tight uppercase">
                            {currentLanguage === "ar" ? stat.titleAr : stat.titleEn}
                          </span>
                          <Icon className="h-4.5 w-4.5 shrink-0" />
                        </div>
                        <div className="mt-3">
                          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">{stat.val}</h3>
                          <p className="text-[10px] text-gray-500 font-bold mt-1">
                            {currentLanguage === "ar" ? stat.subAr : stat.subEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dashboard Charts & Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Payroll Trend Analysis */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900">
                          {currentLanguage === "ar" ? "تحليل النفقات الشهرية ومجموع الرواتب" : "Monthly Compensation & Payroll Trend"}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {currentLanguage === "ar" ? "إجمالي المنصرفات المالية المدفوعة لرواتب موظفي الخدمة المدنية الاتحادية" : "Historical CBS payroll disbursement data"}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-sudan-green bg-emerald-50 px-2 py-1 rounded-md">
                        {currentLanguage === "ar" ? "رؤية 2035" : "Vision 2035"}
                      </span>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { month: "Jan", amount: 1200000 },
                            { month: "Feb", amount: 1350000 },
                            { month: "Mar", amount: 1350000 },
                            { month: "Apr", amount: 1400000 },
                            { month: "May", amount: 1450000 },
                            { month: "Jun", amount: 1520000 },
                            { month: "Jul", amount: 1520000 }
                          ]}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#007229" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#007229" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: "bold" }} />
                          <YAxis tick={{ fontSize: 10, fontWeight: "bold" }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="amount" stroke="#007229" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPayroll)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right Column: Demographics and Department Breakdown */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900">
                          {currentLanguage === "ar" ? "توزيع الكادر بالدرجات الوظيفية" : "Grade Distribution & Demographics"}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {currentLanguage === "ar" ? "توزيع موظفي الخدمة المدنية وفق الدرجات واللوائح الفيدرالية" : "Staff allocation by statutory grades"}
                        </p>
                      </div>
                    </div>

                    <div className="h-64 flex flex-col justify-between">
                      <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: currentLanguage === "ar" ? "الدرجة الخاصة" : "Special Grade", value: employees.filter(e => e.grade === "الخاصة").length || 1 },
                              { name: currentLanguage === "ar" ? "الدرجة الأولى" : "Grade 1", value: employees.filter(e => e.grade === "الأولى").length || 1 },
                              { name: currentLanguage === "ar" ? "الدرجة الثالثة" : "Grade 3", value: employees.filter(e => e.grade === "الثالثة").length || 1 },
                              { name: currentLanguage === "ar" ? "الدرجة السادسة" : "Grade 6", value: employees.filter(e => e.grade === "السادسة").length || 1 }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {employees.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-600 mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#007229]"></div>
                          <span>{currentLanguage === "ar" ? "الدرجة الخاصة" : "Special Grade"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF9E1B]"></div>
                          <span>{currentLanguage === "ar" ? "الدرجة الأولى" : "Grade 1"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#1E293B]"></div>
                          <span>{currentLanguage === "ar" ? "الدرجة الثالثة" : "Grade 3"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                          <span>{currentLanguage === "ar" ? "الدرجة السادسة" : "Grade 6"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Organizational Structure Mapping Preview */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                  <div className="border-b border-gray-100 pb-4 mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {currentLanguage === "ar" ? "الهيكل التنظيمي والوحدات السيادية للوزارة" : "Organizational & Sovereign Units Map"}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {currentLanguage === "ar" ? "الهرم الإداري وتسلسل حوكمة الإدارات العامة والأقسام" : "Hierarchical chain of command and ministerial entities"}
                      </p>
                    </div>
                    {role !== "business_investor" && (
                      <button
                        onClick={() => setActiveTab("talent")}
                        className="text-xs text-sudan-green hover:text-sudan-green-light font-extrabold flex items-center gap-1"
                      >
                        <span>{currentLanguage === "ar" ? "إضافة قسم" : "Add Org Unit"}</span>
                        <ChevronRight className="h-4 w-4 rotate-90" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {orgUnits.map((unit: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl border border-gray-100 hover:border-sudan-green/30 bg-[#F8FAFC] transition-all relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-sudan-green"></div>
                        <div>
                          <div className="text-[10px] font-bold text-sudan-gold uppercase tracking-wider mb-1">{unit.type}</div>
                          <h4 className="font-extrabold text-xs text-slate-800 leading-snug">
                            {currentLanguage === "ar" ? unit.nameAr : unit.nameEn}
                          </h4>
                        </div>
                        <div className="mt-3 border-t border-gray-200/60 pt-2.5 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="text-[10px] font-semibold text-gray-500 truncate">
                            {currentLanguage === "ar" ? `المدير: ${unit.manager}` : `Head: ${unit.manager}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Interactive Panels: Recuitment Pipeline Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Vacancy Card & Recruiting */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                    <div className="border-b border-gray-100 pb-3 mb-3 flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase">
                        {currentLanguage === "ar" ? "فرص التوظيف المفتوحة (الاستقطاب الإلكتروني)" : "Active Recruiting Vacancies"}
                      </h4>
                      <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{vacancies.length}</span>
                    </div>

                    <div className="space-y-3">
                      {vacancies.map((vac: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                          <div>
                            <h5 className="font-extrabold text-xs text-slate-800">
                              {currentLanguage === "ar" ? vac.titleAr : vac.titleEn}
                            </h5>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {currentLanguage === "ar" 
                                ? `قسم: ${vac.department} • الدرجة: ${vac.grade}` 
                                : `Dept: ${vac.department} • Grade: ${vac.grade}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-500 block">
                              {currentLanguage === "ar" ? `${vac.applicationsCount} متقدماً` : `${vac.applicationsCount} Applicants`}
                            </span>
                            <span className="text-[9px] text-sudan-green font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1 inline-block uppercase">
                              {vac.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Leaves Board */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                    <div className="border-b border-gray-100 pb-3 mb-3 flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase">
                        {currentLanguage === "ar" ? "الإجازات المصرحة والنشطة حالياً" : "Approved and Active Leaves"}
                      </h4>
                      <span className="text-[10px] font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
                        {leaves.filter(l => l.status === "approved").length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {leaves.filter(l => l.status === "approved").map((lv: any, idx: number) => {
                        const employeeObj = employees.find(e => e.id === lv.employeeId) || {};
                        return (
                          <div key={idx} className="p-3.5 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                            <div>
                              <h5 className="font-extrabold text-xs text-slate-800">
                                {currentLanguage === "ar" ? employeeObj.nameAr : employeeObj.nameEn}
                              </h5>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {currentLanguage === "ar" 
                                  ? `إجازة ${lv.type} لـ ${lv.days} أيام` 
                                  : `${lv.type} leave for ${lv.days} days`}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-slate-600 block">
                                {lv.startDate}
                              </span>
                              <span className="text-[9px] text-gray-400 font-bold block mt-0.5">
                                {currentLanguage === "ar" ? `السبب: ${lv.reason}` : `Reason: ${lv.reason}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. STAFF DIRECTORY TAB */}
            {activeTab === "directory" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Panel: Employee Directory List */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {currentLanguage === "ar" ? "السجل السيادي لموظفي الخدمة المدنية" : "Sovereign Public Service Staff Directory"}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {currentLanguage === "ar" ? "البحث ومتابعة وتصنيف ملفات العاملين بالوزارة وإجراءات النقل والترقية" : "Full database list with active filter tools"}
                      </p>
                    </div>
                    {role !== "business_investor" && (
                      <button
                        onClick={() => setSelectedEmp({ id: "new_hire" })}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>{currentLanguage === "ar" ? "تعيين موظف" : "Hire Employee"}</span>
                      </button>
                    )}
                  </div>

                  {/* Search and Filters */}
                  <div className="flex gap-2.5">
                    <div className="flex-1 relative">
                      <Search className="absolute right-3.5 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "ابحث باسم الموظف، الرقم الوظيفي، أو المسمى..." : "Search employee..."}
                        className="w-full text-xs pr-10 pl-4 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sudan-green font-medium"
                      />
                    </div>
                    
                    <select
                      value={filterDept}
                      onChange={(e) => setFilterDept(e.target.value)}
                      className="text-xs px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none"
                    >
                      <option value="all">{currentLanguage === "ar" ? "جميع الإدارات" : "All Departments"}</option>
                      <option value="الشؤون الإدارية والمالية">{currentLanguage === "ar" ? "الإدارية والمالية" : "Admin & Finance"}</option>
                      <option value="الشؤون القانونية">{currentLanguage === "ar" ? "الشؤون القانونية" : "Legal Affairs"}</option>
                      <option value="الرقابة وحماية المستهلك">{currentLanguage === "ar" ? "الرقابة والتفتيش" : "Consumer Control"}</option>
                    </select>
                  </div>

                  {/* Employees Table Grid */}
                  <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-left text-xs text-gray-500">
                      <thead className="text-[10px] text-gray-600 bg-slate-50 border-b border-gray-100 font-extrabold uppercase">
                        <tr>
                          <th className="px-4 py-3 text-right">{currentLanguage === "ar" ? "الاسم والرقم الوظيفي" : "Name / ID"}</th>
                          <th className="px-4 py-3 text-right">{currentLanguage === "ar" ? "الموقع الوظيفي" : "Department / Position"}</th>
                          <th className="px-4 py-3 text-right">{currentLanguage === "ar" ? "الدرجة" : "Grade"}</th>
                          <th className="px-4 py-3 text-right">{currentLanguage === "ar" ? "الراتب الأساسي" : "Basic Salary"}</th>
                          <th className="px-4 py-3 text-right">{currentLanguage === "ar" ? "الحالة" : "Status"}</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredEmployees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-800 text-right">
                              <div>{currentLanguage === "ar" ? emp.nameAr : emp.nameEn}</div>
                              <div className="text-[9px] text-slate-400 font-bold mt-0.5">{emp.nationalEmployeeId}</div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="font-bold text-slate-700">{emp.position}</div>
                              <div className="text-[9px] text-gray-400">{emp.department}</div>
                            </td>
                            <td className="px-4 py-3 text-right font-extrabold text-slate-800">{emp.grade}</td>
                            <td className="px-4 py-3 text-right font-mono text-slate-800 font-bold">
                              {emp.basicSalary?.toLocaleString()} SDG
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                                emp.status === "active" 
                                  ? "bg-emerald-50 text-sudan-green" 
                                  : emp.status === "probation"
                                    ? "bg-amber-50 text-amber-500"
                                    : "bg-red-50 text-red-500"
                              }`}>
                                {emp.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => {
                                  setSelectedEmp(emp);
                                  setLifecycleAction(null);
                                }}
                                className="text-sudan-green hover:text-sudan-green-light font-extrabold"
                              >
                                {currentLanguage === "ar" ? "تفاصيل" : "Details"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Panel: Employee Actions / Profiles / New Hire Form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                  {selectedEmp ? (
                    selectedEmp.id === "new_hire" ? (
                      
                      // 1. Interactive Form: New Hire
                      <form onSubmit={handleCreateEmployee} className="space-y-4">
                        <div className="border-b border-gray-100 pb-3 mb-3 flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-slate-800 uppercase flex items-center gap-1.5">
                            <UserPlus className="h-4.5 w-4.5 text-sudan-green" />
                            <span>{currentLanguage === "ar" ? "استمارة تعيين موظف جديد" : "New Onboarding Record"}</span>
                          </h4>
                          <button 
                            type="button" 
                            onClick={() => setSelectedEmp(null)}
                            className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                          >
                            {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                          </button>
                        </div>

                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">{currentLanguage === "ar" ? "الاسم بالكامل (عربي)" : "Name (Arabic)"}</label>
                            <input
                              type="text"
                              required
                              value={newEmployeeForm.nameAr}
                              onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, nameAr: e.target.value })}
                              placeholder="أحمد محمد حسن عثمان"
                              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sudan-green font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">{currentLanguage === "ar" ? "الاسم بالكامل (إنجليزي)" : "Name (English)"}</label>
                            <input
                              type="text"
                              required
                              value={newEmployeeForm.nameEn}
                              onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, nameEn: e.target.value })}
                              placeholder="Ahmed Mohamed Hassan"
                              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sudan-green font-medium"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">{currentLanguage === "ar" ? "الرقم الوطني" : "National ID"}</label>
                              <input
                                type="text"
                                required
                                value={newEmployeeForm.nationalId}
                                onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, nationalId: e.target.value })}
                                placeholder="192003847291"
                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sudan-green font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">{currentLanguage === "ar" ? "الهاتف" : "Phone"}</label>
                              <input
                                type="text"
                                value={newEmployeeForm.phone}
                                onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, phone: e.target.value })}
                                placeholder="+249 912"
                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sudan-green font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">{currentLanguage === "ar" ? "الدرجة الاتحادية" : "Federal Grade"}</label>
                              <select
                                value={newEmployeeForm.grade}
                                onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, grade: e.target.value })}
                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sudan-green"
                              >
                                <option value="الخاصة">الخاصة</option>
                                <option value="الأولى">الأولى</option>
                                <option value="الثالثة">الثالثة</option>
                                <option value="السادسة">السادسة</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">{currentLanguage === "ar" ? "الراتب الأساسي" : "Base Salary"}</label>
                              <input
                                type="number"
                                required
                                value={newEmployeeForm.basicSalary}
                                onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, basicSalary: e.target.value })}
                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sudan-green font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">{currentLanguage === "ar" ? "الإدارات العامة" : "General Directorate"}</label>
                            <select
                              value={newEmployeeForm.department}
                              onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, department: e.target.value })}
                              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sudan-green"
                            >
                              <option value="الشؤون الإدارية والمالية">الشؤون الإدارية والمالية</option>
                              <option value="الشؤون القانونية">الشؤون القانونية</option>
                              <option value="الرقابة وحماية المستهلك">الرقابة وحماية المستهلك</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">{currentLanguage === "ar" ? "المسمى الوظيفي" : "Position Title"}</label>
                            <input
                              type="text"
                              required
                              value={newEmployeeForm.position}
                              onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, position: e.target.value })}
                              placeholder="باحث قانوني"
                              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">{currentLanguage === "ar" ? "الحساب البنكي" : "Bank Account"}</label>
                              <input
                                type="text"
                                value={newEmployeeForm.bankAccount}
                                onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, bankAccount: e.target.value })}
                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">{currentLanguage === "ar" ? "البريد" : "Email"}</label>
                              <input
                                type="email"
                                value={newEmployeeForm.email}
                                onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })}
                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none font-mono"
                              />
                            </div>
                          </div>

                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs py-3 rounded-xl font-extrabold shadow-sm mt-4 transition-all cursor-pointer"
                        >
                          {submitting 
                            ? (currentLanguage === "ar" ? "جاري تعميد السجلات..." : "Registering...")
                            : (currentLanguage === "ar" ? "اعتماد وإصدار القرار الوزاري بالتعيين" : "Authorize Ministerial Appointment Decree")
                          }
                        </button>
                      </form>

                    ) : (
                      
                      // 2. View Selected Employee Details & Profile
                      <div className="space-y-4">
                        <div className="border-b border-gray-100 pb-3 mb-2 flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-slate-800 uppercase">
                            {currentLanguage === "ar" ? "تفاصيل الملف الشخصي" : "Employee Profile Details"}
                          </h4>
                          <button 
                            onClick={() => setSelectedEmp(null)}
                            className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                          >
                            {currentLanguage === "ar" ? "إغلاق" : "Close"}
                          </button>
                        </div>

                        {/* Top Bio Banner */}
                        <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl flex items-center gap-3">
                          <div className="h-12 w-12 bg-sudan-green text-white rounded-xl flex items-center justify-center font-extrabold text-sm uppercase shadow-xs">
                            {selectedEmp.nameEn[0]}
                          </div>
                          <div className="overflow-hidden">
                            <h5 className="font-extrabold text-xs text-slate-800">
                              {currentLanguage === "ar" ? selectedEmp.nameAr : selectedEmp.nameEn}
                            </h5>
                            <p className="text-[10px] text-sudan-gold font-bold mt-0.5">{selectedEmp.nationalEmployeeId}</p>
                            <p className="text-[9px] text-gray-400">{selectedEmp.position}</p>
                          </div>
                        </div>

                        {/* Complete salary and civil status breakups */}
                        <div className="space-y-2.5 text-xs text-slate-700">
                          <div className="flex justify-between border-b border-gray-100 py-1.5">
                            <span className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "الرقم الوطني" : "National ID"}</span>
                            <span className="font-bold text-slate-800 font-mono">{selectedEmp.nationalId}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 py-1.5">
                            <span className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "الإدارة" : "Department"}</span>
                            <span className="font-bold text-slate-800">{selectedEmp.department}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 py-1.5">
                            <span className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "تاريخ التعيين" : "Hire Date"}</span>
                            <span className="font-bold text-slate-800 font-mono">{selectedEmp.hireDate}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 py-1.5">
                            <span className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "الدرجة" : "Grade"}</span>
                            <span className="font-bold text-slate-800">{selectedEmp.grade}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 py-1.5">
                            <span className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "الراتب الأساسي" : "Base Salary"}</span>
                            <span className="font-bold text-slate-800 font-mono">{selectedEmp.basicSalary?.toLocaleString()} SDG</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 py-1.5">
                            <span className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "بدل السكن والترحيل" : "Allowances (Housing/Trans)"}</span>
                            <span className="font-bold text-slate-800 font-mono">
                              {((selectedEmp.allowances?.housing || 0) + (selectedEmp.allowances?.transport || 0))?.toLocaleString()} SDG
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 py-1.5">
                            <span className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "إجمالي الاستقطاعات" : "Deductions (Tax/Ins)"}</span>
                            <span className="font-bold text-red-500 font-mono">
                              {((selectedEmp.deductions?.tax || 0) + (selectedEmp.deductions?.socialInsurance || 0))?.toLocaleString()} SDG
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 py-1.5">
                            <span className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "البنك والحساب" : "Bank & Account"}</span>
                            <span className="font-bold text-slate-800 text-[10px] font-mono truncate max-w-[150px]">{selectedEmp.bankName} - {selectedEmp.bankAccount}</span>
                          </div>
                        </div>

                        {/* Interactive Lifecycle triggers */}
                        {role !== "business_investor" && (
                          <div className="pt-4 border-t border-gray-100 space-y-2">
                            <h6 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                              {currentLanguage === "ar" ? "إجراءات التغيير والمسار الوظيفي" : "Workforce Lifecycle Management"}
                            </h6>
                            
                            {selectedEmp.status === "probation" && (
                              <button
                                onClick={() => handleLifecycleAction(selectedEmp.id, "probation_pass", {})}
                                className="w-full bg-emerald-50 hover:bg-emerald-100 text-sudan-green text-[11px] py-2.5 rounded-xl font-bold transition-all border border-emerald-100"
                              >
                                {currentLanguage === "ar" ? "تجاوز فترة الاختبار وتثبيت التعيين" : "Pass Probation & Confirm Hire"}
                              </button>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setLifecycleAction("promotion")}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] py-2 rounded-xl font-bold border border-gray-200"
                              >
                                {currentLanguage === "ar" ? "ترقية الدرجة/الراتب" : "Promote / Increase"}
                              </button>
                              <button
                                onClick={() => setLifecycleAction("transfer")}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] py-2 rounded-xl font-bold border border-gray-200"
                              >
                                {currentLanguage === "ar" ? "نقل لإدارة أخرى" : "Transfer Department"}
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleLifecycleAction(selectedEmp.id, "delegation", { targetEntity: "ديوان الخدمة المدنية القومي" })}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] py-2 rounded-xl font-bold border border-gray-200"
                              >
                                {currentLanguage === "ar" ? "ندب مؤقت" : "Delegate / Second"}
                              </button>
                              <button
                                onClick={() => handleLifecycleAction(selectedEmp.id, "retirement", {})}
                                className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] py-2 rounded-xl font-bold border border-red-100"
                              >
                                {currentLanguage === "ar" ? "إحالة للتقاعد" : "Retire Employee"}
                              </button>
                            </div>

                            {/* Promotion/Transfer Details form panels if activated */}
                            {lifecycleAction === "promotion" && (
                              <div className="p-3 bg-[#FFFDF5] border border-amber-200/60 rounded-xl space-y-3.5 mt-2.5">
                                <h5 className="text-[10px] font-extrabold text-slate-800">{currentLanguage === "ar" ? "تفاصيل قرار الترقية" : "Promotion details"}</h5>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[9px] font-bold text-gray-500">الدرجة الجديدة</label>
                                    <select id="promoGrade" className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-white">
                                      <option value="الخاصة">الخاصة</option>
                                      <option value="الأولى">الأولى</option>
                                      <option value="الثالثة">الثالثة</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-gray-500">الراتب الجديد</label>
                                    <input id="promoSalary" type="number" defaultValue={selectedEmp.basicSalary + 50000} className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-white" />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const g = (document.getElementById("promoGrade") as any).value;
                                    const s = (document.getElementById("promoSalary") as any).value;
                                    handleLifecycleAction(selectedEmp.id, "promotion", { newGrade: g, newSalary: s });
                                  }}
                                  className="w-full bg-sudan-green text-white text-[10px] py-2 rounded-lg font-bold"
                                >
                                  اعتماد وتوقيع الترقية
                                </button>
                              </div>
                            )}

                            {lifecycleAction === "transfer" && (
                              <div className="p-3 bg-[#FFFDF5] border border-amber-200/60 rounded-xl space-y-3.5 mt-2.5">
                                <h5 className="text-[10px] font-extrabold text-slate-800">{currentLanguage === "ar" ? "تفاصيل قرار النقل" : "Transfer details"}</h5>
                                <div>
                                  <label className="text-[9px] font-bold text-gray-500">الإدارة العامة الجديدة</label>
                                  <select id="transDept" className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-white">
                                    <option value="الشؤون القانونية">الشؤون القانونية</option>
                                    <option value="الرقابة وحماية المستهلك">الرقابة وحماية المستهلك</option>
                                    <option value="الشؤون الإدارية والمالية">الشؤون الإدارية والمالية</option>
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const d = (document.getElementById("transDept") as any).value;
                                    handleLifecycleAction(selectedEmp.id, "transfer", { newDepartment: d });
                                  }}
                                  className="w-full bg-sudan-green text-white text-[10px] py-2 rounded-lg font-bold"
                                >
                                  اعتماد وتوقيع النقل
                                </button>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                      <Users className="h-8 w-8 mb-2 stroke-1" />
                      <p className="text-xs font-bold">{currentLanguage === "ar" ? "اختر موظفاً من القائمة لعرض تفاصيل ملفه وإجراءات النقل والترقية" : "Select an employee from directory to view full profile and run actions."}</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 3. FEDERAL PAYROLL SYSTEM TAB */}
            {activeTab === "payroll" && (
              <div className="space-y-6">
                
                {/* Payroll Header and Draft Generator */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {currentLanguage === "ar" ? "احتساب وتصديق الرواتب المدفوعة" : "Federal Public Compensation & Payroll Certification"}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {currentLanguage === "ar" ? "إعداد مسودة الأجور الشهرية، فحص الاختلالات إلكترونياً، والتعميد السيادي للتصديق" : "Generate, audit, and approve public payroll lists connected to CBS Net"}
                    </p>
                  </div>
                  {role !== "business_investor" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCreatePayrollDraft("2026-07")}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs px-4 py-2.5 rounded-xl font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <DollarSign className="h-4 w-4" />
                        <span>{currentLanguage === "ar" ? "إصدار مسودة راتب يوليو 2026" : "Generate July 2026 Payroll"}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Main Payroll List & Digital Signing Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: List of Payroll periods */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase border-b border-gray-100 pb-2">
                      {currentLanguage === "ar" ? "سجلات مسودات الدفعيات والأجور" : "Compensation Periods & Authorization State"}
                    </h4>

                    <div className="space-y-3.5">
                      {payrolls.map((pay: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl border border-gray-100 hover:border-sudan-green/30 bg-[#F8FAFC] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-slate-800">
                                {currentLanguage === "ar" ? `مسودة رواتب شهر: ${pay.period}` : `Compensation Draft: ${pay.period}`}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                                pay.status === "approved" 
                                  ? "bg-emerald-50 text-sudan-green" 
                                  : "bg-amber-50 text-amber-500"
                              }`}>
                                {pay.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-[10px] text-gray-500 font-bold mt-2">
                              <div>{currentLanguage === "ar" ? `الأساسي: ${pay.totalBasic?.toLocaleString()}` : `Basic: ${pay.totalBasic}`} SDG</div>
                              <div>{currentLanguage === "ar" ? `البدلات: ${pay.totalAllowances?.toLocaleString()}` : `Allowances: ${pay.totalAllowances}`} SDG</div>
                              <div className="text-red-500">{currentLanguage === "ar" ? `الخصومات: ${pay.totalDeductions?.toLocaleString()}` : `Deductions: ${pay.totalDeductions}`} SDG</div>
                            </div>
                          </div>

                          <div className="text-right sm:border-l sm:border-gray-200/70 sm:pl-4">
                            <span className="text-xs font-extrabold text-slate-800 block">
                              {pay.netAmount?.toLocaleString()} SDG
                            </span>
                            {pay.status !== "approved" && role !== "business_investor" && (
                              <button
                                onClick={() => {
                                  setSigningItem(pay);
                                  setSigningStep(1);
                                }}
                                className="mt-2 bg-sudan-gold hover:bg-amber-500 text-slate-900 text-[10px] px-3 py-1.5 rounded-lg font-extrabold transition-all cursor-pointer"
                              >
                                {currentLanguage === "ar" ? "توقيع وتعميد السيولة" : "Sign & Authorize Funds"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Digital Cryptographic Signature panel */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase border-b border-gray-100 pb-2 mb-3 flex items-center gap-1.5">
                      <Signature className="h-4.5 w-4.5 text-sudan-gold" />
                      <span>{currentLanguage === "ar" ? "بوابة التوقيع والتحقق الرقمي" : "Sovereign Digital Signature Node"}</span>
                    </h4>

                    {signingItem ? (
                      <div className="space-y-4">
                        <div className="p-3.5 bg-slate-50 border border-gray-100 rounded-xl">
                          <span className="text-[10px] text-gray-400 block uppercase font-bold">بند الصرف المستهدف</span>
                          <span className="text-xs font-extrabold text-slate-800">
                            {currentLanguage === "ar" ? `الرواتب الفيدرالية لشهر: ${signingItem.period}` : `Disbursement period: ${signingItem.period}`}
                          </span>
                          <span className="text-sm font-extrabold text-sudan-green block mt-1">
                            {signingItem.netAmount?.toLocaleString()} SDG
                          </span>
                        </div>

                        {signingStep === 1 ? (
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-2">
                              <Lock className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] text-blue-700 leading-normal">
                                {currentLanguage === "ar" 
                                  ? "تتطلب لوائح الخدمة المدنية ومطابقة الحسابات مصادقة رقمية سيادية لتفادي الاختلالات."
                                  : "Standard civil services regulatory act requires multi-signatory digital validation before Central Bank transmission."}
                              </p>
                            </div>

                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-500 mb-1">الرقم الوطني للهوية السيادية</label>
                              <input
                                type="text"
                                value={nationalId}
                                onChange={(e) => setNationalId(e.target.value)}
                                placeholder="19200831092"
                                className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sudan-green font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-500 mb-1">الرمز السري الموحد (PIN)</label>
                              <input
                                type="password"
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value)}
                                placeholder="••••"
                                className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sudan-green font-mono"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={handleApprovePayrollSignature}
                              disabled={submitting}
                              className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                            >
                              {submitting ? "جاري التحقق والتوقيع..." : "التوقيع وإصدار شهادة التحويل"}
                            </button>
                          </div>
                        ) : null}

                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                        <Signature className="h-8 w-8 mb-2 stroke-1 text-sudan-gold" />
                        <p className="text-xs font-bold px-4">{currentLanguage === "ar" ? "اضغط على زر (توقيع وتعميد السيولة) بجانب مسودة الشهر لتشغيل التوقيع الإلكتروني السيادي للمطابقة" : "Click authorize to launch dynamic digital verification node."}</p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* 4. TIME & ATTENDANCE TAB */}
            {activeTab === "attendance" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Attendance logs and dynamic check in */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {currentLanguage === "ar" ? "سجلات الحضور اليومي للمطابقة" : "Daily Attendance and Geo-verification Node"}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {currentLanguage === "ar" ? "متابعة أوقات حضور الموظفين والتحقق الجغرافي من الإحداثيات (GPS) لمنع التحايل" : "Sovereign GPS geolocation matching verification system"}
                      </p>
                    </div>
                  </div>

                  {/* Punch simulation banner */}
                  <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-sudan-green/10 text-sudan-green rounded-xl flex items-center justify-center">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-800">
                          {currentLanguage === "ar" ? "جهاز الحضور والمطابقة الافتراضي (GPS)" : "Geo-attendance node simulation"}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold">
                          {currentPunchStatus?.checkIn 
                            ? (currentLanguage === "ar" ? `مسجل الحضور اليوم الساعة: ${currentPunchStatus.checkIn}` : `Today Checked In at: ${currentPunchStatus.checkIn}`)
                            : (currentLanguage === "ar" ? "لم يتم تسجيل الحضور لليوم" : "No punch log today yet")
                          }
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handlePunchAttendance}
                      className="bg-sudan-green text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer"
                    >
                      {currentPunchStatus?.checkIn && !currentPunchStatus?.checkOut
                        ? (currentLanguage === "ar" ? "تسجيل الانصراف" : "Check Out")
                        : (currentLanguage === "ar" ? "تسجيل الحضور" : "Check In")
                      }
                    </button>
                  </div>

                  {/* Attendance log lists */}
                  <div className="space-y-2">
                    {attendance.map((att: any, idx: number) => {
                      const empObj = employees.find(e => e.id === att.employeeId) || {};
                      return (
                        <div key={idx} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-2.5">
                            <Clock className="h-4.5 w-4.5 text-gray-400 shrink-0" />
                            <div>
                              <span className="font-extrabold text-slate-800">
                                {currentLanguage === "ar" ? empObj.nameAr : empObj.nameEn}
                              </span>
                              <span className="text-[9px] text-gray-400 block font-mono mt-0.5">{att.date}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-right">
                            <div>
                              <span className="text-[9px] text-gray-400 uppercase block font-bold">حضور</span>
                              <span className="font-bold text-slate-700 font-mono">{att.checkIn}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-400 uppercase block font-bold">انصراف</span>
                              <span className="font-bold text-slate-700 font-mono">{att.checkOut || "--:--:--"}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-600 block flex items-center gap-1 justify-end">
                              <MapPin className="h-3 w-3 text-sudan-gold" />
                              <span>{att.method}</span>
                            </span>
                            <span className="text-[9px] text-gray-400 block font-mono mt-0.5">Lat: {att.gpsCoords?.lat}, Lng: {att.gpsCoords?.lng}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Leave request panel */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-5">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase border-b border-gray-100 pb-2">
                      {currentLanguage === "ar" ? "تقديم وموافقة الإجازات" : "Leave Management & Authorization"}
                    </h4>
                  </div>

                  {/* Create leave request form */}
                  <form onSubmit={handleCreateLeaveRequest} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 mb-1">الموظف المعني</label>
                      <select
                        value={newLeaveForm.employeeId}
                        onChange={(e) => setNewLeaveForm({ ...newLeaveForm, employeeId: e.target.value })}
                        className="w-full text-xs p-2 border border-gray-200 rounded-xl bg-white"
                      >
                        {employees.map(e => (
                          <option key={e.id} value={e.id}>{currentLanguage === "ar" ? e.nameAr : e.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-500 mb-1">تاريخ البدء</label>
                        <input
                          type="date"
                          required
                          value={newLeaveForm.startDate}
                          onChange={(e) => setNewLeaveForm({ ...newLeaveForm, startDate: e.target.value })}
                          className="w-full text-xs p-2 border border-gray-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-500 mb-1">تاريخ الانتهاء</label>
                        <input
                          type="date"
                          required
                          value={newLeaveForm.endDate}
                          onChange={(e) => setNewLeaveForm({ ...newLeaveForm, endDate: e.target.value })}
                          className="w-full text-xs p-2 border border-gray-200 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-500 mb-1">النوع</label>
                        <select
                          value={newLeaveForm.type}
                          onChange={(e) => setNewLeaveForm({ ...newLeaveForm, type: e.target.value })}
                          className="w-full text-xs p-2 border border-gray-200 rounded-xl bg-white"
                        >
                          <option value="annual">سنوية</option>
                          <option value="sick">مرضية</option>
                          <option value="emergency">طارئة</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-500 mb-1">عدد الأيام</label>
                        <input
                          type="number"
                          required
                          value={newLeaveForm.days}
                          onChange={(e) => setNewLeaveForm({ ...newLeaveForm, days: e.target.value })}
                          className="w-full text-xs p-2 border border-gray-200 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 mb-1">السبب والشرح</label>
                      <input
                        type="text"
                        value={newLeaveForm.reason}
                        onChange={(e) => setNewLeaveForm({ ...newLeaveForm, reason: e.target.value })}
                        placeholder="القيام بالإجازة السنوية"
                        className="w-full text-xs p-2 border border-gray-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-sudan-green text-white text-xs py-2 rounded-xl font-bold cursor-pointer"
                    >
                      تقديم طلب الإجازة
                    </button>
                  </form>

                  {/* Manager approval board */}
                  <div className="pt-4 border-t border-gray-100">
                    <h5 className="text-[10px] font-extrabold text-slate-800 uppercase mb-3">طلبات قيد المراجعة الفيدرالية</h5>
                    
                    <div className="space-y-2">
                      {leaves.filter(l => l.status === "pending").map((lv: any, idx: number) => {
                        const empObj = employees.find(e => e.id === lv.employeeId) || {};
                        return (
                          <div key={idx} className="p-3 bg-[#FFFDF5] border border-amber-100 rounded-xl text-xs space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-slate-800">
                                {currentLanguage === "ar" ? empObj.nameAr : empObj.nameEn}
                              </span>
                              <span className="text-[9px] text-amber-500 font-extrabold uppercase">PENDING</span>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-snug">
                              إجازة {lv.type} لـ {lv.days} أيام من {lv.startDate} إلى {lv.endDate}
                            </p>
                            
                            {role !== "business_investor" && (
                              <div className="flex gap-2 justify-end pt-1">
                                <button
                                  onClick={() => handleApproveLeave(lv.id, "approved")}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] px-2.5 py-1 rounded font-bold transition-all cursor-pointer"
                                >
                                  موافقة
                                </button>
                                <button
                                  onClick={() => handleApproveLeave(lv.id, "rejected")}
                                  className="bg-red-500 hover:bg-red-600 text-white text-[9px] px-2.5 py-1 rounded font-bold transition-all cursor-pointer"
                                >
                                  رفض
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 5. PERFORMANCE, TRAINING & SUCCESSION */}
            {activeTab === "talent" && (
              <div className="space-y-6">
                
                {/* Upper stats banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Performance appraisals */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase border-b border-gray-100 pb-2">
                      {currentLanguage === "ar" ? "أبرز تقييمات الأداء" : "Performance Reviews"}
                    </h4>
                    
                    <div className="space-y-2.5">
                      {performance.map((perf: any, idx: number) => {
                        const empObj = employees.find(e => e.id === perf.employeeId) || {};
                        return (
                          <div key={idx} className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-xs flex justify-between items-center">
                            <div>
                              <span className="font-extrabold text-slate-800">
                                {currentLanguage === "ar" ? empObj.nameAr : empObj.nameEn}
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-1">المعدل: {perf.finalRating} | KPI Score: {perf.kpiScore}</span>
                            </div>
                            <span className="h-7 w-7 bg-sudan-green text-white rounded-full flex items-center justify-center font-extrabold text-xs">
                              {perf.finalRating}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Training Academy programs */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase border-b border-gray-100 pb-2">
                      {currentLanguage === "ar" ? "برامج أكاديمية التدريب" : "Training Academy Programs"}
                    </h4>

                    <div className="space-y-2.5">
                      {trainings.map((trn: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-xs">
                          <h5 className="font-extrabold text-slate-800">
                            {currentLanguage === "ar" ? trn.titleAr : trn.titleEn}
                          </h5>
                          <span className="text-[9px] text-sudan-gold font-bold block mt-1 uppercase">المحاضر: {trn.instructor}</span>
                          <span className="text-[9px] text-gray-400 block mt-0.5">{trn.startDate} - {trn.endDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Succession track & potential */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase border-b border-gray-100 pb-2">
                      {currentLanguage === "ar" ? "خطط التعاقب والقيادات الشابة" : "Succession & Talent Pools"}
                    </h4>

                    <div className="space-y-2.5">
                      {talentPools.map((pool: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-xs">
                          <h5 className="font-extrabold text-slate-800">
                            {currentLanguage === "ar" ? pool.nameAr : pool.nameEn}
                          </h5>
                          <div className="mt-2 text-[9px] text-gray-500 font-bold space-y-1">
                            {pool.candidates?.map((c: any, i: number) => {
                              const empObj = employees.find(e => e.id === c.employeeId) || {};
                              return (
                                <div key={i} className="flex justify-between border-t border-gray-200/50 pt-1">
                                  <span>{currentLanguage === "ar" ? empObj.nameAr : empObj.nameEn}</span>
                                  <span className="text-sudan-green uppercase font-extrabold">{c.readiness}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Training academy registration and org structures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Form to create training */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase border-b border-gray-100 pb-2 mb-3">
                      {currentLanguage === "ar" ? "اعتماد وإدراج برنامج تدريبي جديد" : "Launch New Training Academy Program"}
                    </h4>

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const res = await fetch("/api/hr/trainings", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(newTrainingForm)
                        });
                        if (res.ok) {
                          setNewTrainingForm({ titleAr: "", titleEn: "", startDate: "", endDate: "", instructor: "", attendees: ["emp-003"] });
                          fetchAllHRData();
                          alert("تم إدراج البرنامج التدريبي.");
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }} className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-500 mb-1">اسم الدورة التدريبية (عربي)</label>
                        <input
                          type="text"
                          required
                          value={newTrainingForm.titleAr}
                          onChange={(e) => setNewTrainingForm({ ...newTrainingForm, titleAr: e.target.value })}
                          className="w-full text-xs p-2 border border-gray-200 rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-extrabold text-gray-500 mb-1">تاريخ البدء</label>
                          <input type="date" required value={newTrainingForm.startDate} onChange={(e) => setNewTrainingForm({ ...newTrainingForm, startDate: e.target.value })} className="w-full text-xs p-2 border border-gray-200 rounded-xl" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-gray-500 mb-1">تاريخ الانتهاء</label>
                          <input type="date" required value={newTrainingForm.endDate} onChange={(e) => setNewTrainingForm({ ...newTrainingForm, endDate: e.target.value })} className="w-full text-xs p-2 border border-gray-200 rounded-xl" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-extrabold text-gray-500 mb-1">اسم المحاضر والمشرف</label>
                          <input type="text" required value={newTrainingForm.instructor} onChange={(e) => setNewTrainingForm({ ...newTrainingForm, instructor: e.target.value })} className="w-full text-xs p-2 border border-gray-200 rounded-xl" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-gray-500 mb-1">المرشح لحضور الدورة</label>
                          <select className="w-full text-xs p-2 border border-gray-200 rounded-xl bg-white" onChange={(e) => setNewTrainingForm({ ...newTrainingForm, attendees: [e.target.value] })}>
                            {employees.map(e => (
                              <option key={e.id} value={e.id}>{currentLanguage === "ar" ? e.nameAr : e.nameEn}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-sudan-green text-white text-xs py-2.5 rounded-xl font-bold cursor-pointer">جدولة البرنامج في مصفوفة التدريب الفيدرالي</button>
                    </form>
                  </div>

                  {/* Form to create organizational unit */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase border-b border-gray-100 pb-2 mb-3">
                      {currentLanguage === "ar" ? "اعتماد وحدة تنظيمية/إدارة جديدة" : "Create New Organizational Directorate / Department"}
                    </h4>

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const res = await fetch("/api/hr/org-units", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(newOrgForm)
                        });
                        if (res.ok) {
                          setNewOrgForm({ nameAr: "", nameEn: "", type: "department", parent: "unit-3", manager: "" });
                          fetchAllHRData();
                          alert("تم إعتماد الوحدة التنظيمية وإرسال مرئيات الهيكل السيادي لمجلس الوزراء.");
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }} className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-500 mb-1">اسم الوحدة بالكامل (عربي)</label>
                        <input
                          type="text"
                          required
                          value={newOrgForm.nameAr}
                          onChange={(e) => setNewOrgForm({ ...newOrgForm, nameAr: e.target.value })}
                          className="w-full text-xs p-2 border border-gray-200 rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-extrabold text-gray-500 mb-1">النوع</label>
                          <select value={newOrgForm.type} onChange={(e) => setNewOrgForm({ ...newOrgForm, type: e.target.value })} className="w-full text-xs p-2 border border-gray-200 rounded-xl bg-white">
                            <option value="directorate">إدارة عامة</option>
                            <option value="department">إدارة فرعية</option>
                            <option value="section">قسم سيادي</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-gray-500 mb-1">المدير المسؤول</label>
                          <input type="text" required value={newOrgForm.manager} onChange={(e) => setNewOrgForm({ ...newOrgForm, manager: e.target.value })} className="w-full text-xs p-2 border border-gray-200 rounded-xl" />
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-sudan-green text-white text-xs py-2.5 rounded-xl font-bold cursor-pointer">تثبيت الوحدة في دليل الهياكل الفيدرالي</button>
                    </form>
                  </div>

                </div>

              </div>
            )}

            {/* 6. IMMUTABLE AUDIT TRAIL LEDGER TAB */}
            {activeTab === "audit" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {currentLanguage === "ar" ? "سجل التحقق والمطابقة والتدقيق السيادي" : "Sovereign Audit Ledger & Cryptographic Integrity"}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {currentLanguage === "ar" ? "سجل غير قابل للتعديل يوثق كافة التعديلات، الحركات، والترقيات بترميز أمان مشفر SHA-256" : "Immutable ledger recording all system-wide transactions with cryptographical validation hashes"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {hrAuditLogs.map((log: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[11px] leading-relaxed">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-sudan-gold font-extrabold bg-slate-900 px-1.5 py-0.5 rounded-md">LOG</span>
                          <span className="font-semibold text-gray-400">{log.timestamp}</span>
                        </div>
                        <h5 className="font-extrabold text-slate-800 text-xs mt-1.5 font-sans">
                          {currentLanguage === "ar" ? log.actionAr : log.actionEn}
                        </h5>
                        <p className="text-gray-500 text-[10px] leading-normal font-sans">
                          {currentLanguage === "ar" ? `المُعتمِد: ${log.actor} • التفاصيل: ${log.details}` : `Actor: ${log.actor} • Details: ${log.details}`}
                        </p>
                      </div>
                      
                      <div className="text-right shrink-0 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
                        <span className="text-[9px] text-gray-400 block font-bold">SHA-256 HASH VERIFIED</span>
                        <span className="text-[9px] text-sudan-green font-extrabold truncate max-w-[180px] inline-block">{log.hash}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. AI HR ADVISOR TAB (GEMINI POWERED) */}
            {activeTab === "ai-advisor" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Panel: Prompt controls */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-sudan-gold animate-pulse" />
                      <span>{currentLanguage === "ar" ? "مستشار رأس المال البشري والرواتب الذكي" : "Sovereign AI HR Consultant"}</span>
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {currentLanguage === "ar" ? "نماذج الذكاء الاصطناعي للتنبؤ بمعدلات تسرب الكوادر، تحليل الرواتب واكتشاف الأخطاء، وترشيحات التعاقب" : "AI model running predictive algorithms for retention risk, payroll sanity checks, and promotion mapping"}
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">سيناريو التحليل المطلوب</label>
                      <select
                        value={aiScenario}
                        onChange={(e) => setAiScenario(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-white"
                      >
                        <option value="generate_hr_report">التقرير الاستراتيجي الموحد لأداء الموارد البشرية</option>
                        <option value="predict_turnover">تحليل التنبؤ بمعدلات تسرب الموظفين (Turnover Risk)</option>
                        <option value="recommend_promotions">ترشيح ترقيات استحقاقية ذكية (Promotions)</option>
                        <option value="identify_training">تحديد الفجوات والاحتياجات التدريبية (Skills Gap)</option>
                        <option value="forecast_demand">توقع وحساب الطلب على القوى العاملة (Workforce Demand)</option>
                        <option value="detect_payroll_anomalies">تدقيق كشف التجاوزات المالية واختلال البدلات</option>
                        <option value="recommend_succession">خطط التعاقب للمناصب القيادية الفيدرالية</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 mb-1 uppercase">استفسار أو موجه إضافي مخصص (اختياري)</label>
                      <textarea
                        rows={3}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="مثال: قيم خطورة مغادرة المهندسين الفنيين في الباقير مع توفير خطة بدل حوافز..."
                        className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-sudan-green"
                      />
                    </div>

                    <button
                      onClick={handleAskAIAdvisor}
                      disabled={aiLoading}
                      className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs py-3 rounded-xl font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 shrink-0 text-sudan-gold" />
                      <span>{aiLoading ? "جاري توليد التحليل الذكي الفيدرالي..." : "توليد التحليل المدعوم بـ Gemini"}</span>
                    </button>
                  </div>
                </div>

                {/* Right Panel: Results Display */}
                <div className="lg:col-span-2 bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col justify-between min-h-[450px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-sudan-gold animate-ping"></div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-sudan-gold">AI DECISION HUB • SUDAN 2035</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">MODEL: GEMINI-3.5-FLASH</span>
                    </div>

                    {aiLoading ? (
                      <div className="py-16 text-center space-y-4">
                        <RefreshCw className="h-8 w-8 text-sudan-gold animate-spin mx-auto" />
                        <p className="text-xs text-slate-400 font-bold">
                          جاري قراءة سجلات الخدمة المدنية، ومجموع البدلات والرواتب لإجراء فحص إحصائي ذكي ومقارنة التوقعات بـ Gemini...
                        </p>
                      </div>
                    ) : aiResult ? (
                      <div className="text-xs space-y-4 leading-relaxed font-sans overflow-y-auto max-h-[380px] pr-2 scrollbar-thin">
                        <div className="whitespace-pre-line text-slate-200 markdown-body">
                          {aiResult}
                        </div>
                      </div>
                    ) : (
                      <div className="py-24 text-center text-slate-500 space-y-3">
                        <HelpCircle className="h-10 w-10 stroke-1 mx-auto" />
                        <p className="text-xs font-bold">
                          اضغط على زر التوليد في اليمين لإجراء استشارات الموارد البشرية والرواتب السيادية المدعومة بالكامل بالذكاء الاصطناعي.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-3 mt-4 flex items-center justify-between text-[9px] text-slate-500">
                    <span>المنصة السيادية المدعومة بـ Gemini</span>
                    <span>سري وشخصي • وزارة التجارة والصناعة</span>
                  </div>
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}
