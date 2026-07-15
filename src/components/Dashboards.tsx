/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { 
  Award, ShieldAlert, User, FileText, CheckCircle, Clock, 
  TrendingUp, Activity, Cpu, Landmark 
} from "lucide-react";
import { 
  CommercialRegistration, FactoryRegistration, ImportExportLicense, 
  CertificateOfOrigin, LandApplication, ConsumerComplaint, UserRole 
} from "../types";

interface DashboardsProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
  companies: CommercialRegistration[];
  factories: FactoryRegistration[];
  licenses: ImportExportLicense[];
  certificates: CertificateOfOrigin[];
  applications: LandApplication[];
  complaints: ConsumerComplaint[];
}

export default function Dashboards({
  currentLanguage,
  role,
  companies,
  factories,
  licenses,
  certificates,
  applications,
  complaints
}: DashboardsProps) {
  
  // Data prep for charts
  const stateCounts = companies.reduce((acc: any, curr) => {
    acc[curr.addressState] = (acc[curr.addressState] || 0) + 1;
    return acc;
  }, {});
  
  const stateChartData = Object.keys(stateCounts).map(key => ({
    name: key,
    "السجلات / Registries": stateCounts[key]
  }));

  const sectorCounts = factories.reduce((acc: any, curr) => {
    acc[curr.industrialSector] = (acc[curr.industrialSector] || 0) + 1;
    return acc;
  }, {});

  const sectorChartData = Object.keys(sectorCounts).map(key => {
    let nameAr = key;
    if (key === "food") nameAr = "غذائية / Agro";
    if (key === "chemical") nameAr = "كيميائية / Chem";
    if (key === "textile") nameAr = "نسيج / Textile";
    if (key === "engineering") nameAr = "هندسية / Eng";
    if (key === "pharmaceutical") nameAr = "أدوية / Pharma";
    return { name: nameAr, value: sectorCounts[key] };
  });

  const COLORS = ["#007a3d", "#C5A059", "#121824", "#D21034", "#475569", "#06B6D4"];

  // Load commercial names stats in real-time
  const [namesCount, setNamesCount] = React.useState(4);
  const [activeNamesCount, setActiveNamesCount] = React.useState(2);

  React.useEffect(() => {
    const local = localStorage.getItem("sdmci_names_reservations");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setNamesCount(parsed.length);
        setActiveNamesCount(parsed.filter((p: any) => p.status === "approved").length);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const tradeData = [
    { name: currentLanguage === "ar" ? "رخص تصدير" : "Export Lic", count: licenses.filter(l => l.licenseType === "export").length },
    { name: currentLanguage === "ar" ? "رخص استيراد" : "Import Lic", count: licenses.filter(l => l.licenseType === "import").length },
    { name: currentLanguage === "ar" ? "شهادات منشأ" : "Cert Origin", count: certificates.length }
  ];

  return (
    <div id="dashboards-view" className="space-y-6">
      
      {/* ----------------- MINISTER DASHBOARD ----------------- */}
      {(role === UserRole.GOVERNMENT_MINISTER) && (
        <div className="space-y-6">
          {/* Minister Header - Styled as Bento Hero Vision Card */}
          <div className="bg-[#003B15] text-white p-8 rounded-3xl border border-[#005220] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
              <svg width="250" height="250" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 L100 100 L0 100 Z" />
              </svg>
            </div>
            <div className="space-y-3 relative z-10">
              <span className="bg-[#D21034] text-white text-[10px] px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {currentLanguage === "ar" ? "رؤية 2035 السيادية" : "Sovereign Vision 2035"}
              </span>
              <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight leading-tight">
                {currentLanguage === "ar" ? "لوحة التنمية الوطنية والتحول الرقمي" : "National Development & Digital Transformation"}
              </h2>
              <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                {currentLanguage === "ar" 
                  ? "مؤشرات أداء الاستثمار، التجارة الخارجية، الالتزام الصناعي، وحماية المستهلك على مستوى جمهورية السودان تحت مظلة الحوكمة الرقمية." 
                  : "National indicators mapping investments, foreign trade, industrial operations, and public welfare under secure digital governance."}
              </p>
            </div>
            
            <div className="text-center md:text-right bg-white/5 p-5 rounded-2xl border border-white/10 shrink-0 relative z-10 min-w-[150px]">
              <p className="text-[10px] text-sudan-gold font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "معدل الرضا الحكومي" : "Govt Satisfaction"}</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">98.4%</p>
            </div>
          </div>

          {/* KPI Cards in Bento Grid format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[140px] hover:scale-[1.01] transition-all duration-300">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "إجمالي الكيانات التجارية" : "Total Business Entities"}</p>
              <p className="text-3xl font-black text-[#1E293B] my-1">{companies.length + factories.length}</p>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">↑ 14.5% {currentLanguage === "ar" ? "مقارنة بالربع الماضي" : "since last quarter"}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[140px] hover:scale-[1.01] transition-all duration-300">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "الأسماء التجارية المعتمدة" : "Reserved Commercial Names"}</p>
              <p className="text-3xl font-black text-[#1E293B] my-1">{activeNamesCount} <span className="text-xs text-gray-400">/ {namesCount}</span></p>
              <p className="text-[10px] text-sudan-green font-bold">100% {currentLanguage === "ar" ? "مطابقة وحجب فوري" : "compliant reservations"}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[140px] hover:scale-[1.01] transition-all duration-300">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "رؤوس أموال استثمارية مسجلة" : "Venture Capital Assets"}</p>
              <p className="text-2xl font-black text-sudan-green my-1">{(companies.reduce((sum, c) => sum + c.capital, 0) + 12000000).toLocaleString()} <span className="text-xs">SDG</span></p>
              <p className="text-[10px] text-emerald-600 font-bold">↑ 22.1% {currentLanguage === "ar" ? "نمو تدفقات نقدية" : "cashflow growth"}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[140px] hover:scale-[1.01] transition-all duration-300">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "إجمالي طلبات الأراضي الصناعية" : "Leased Plots Applications"}</p>
              <p className="text-3xl font-black text-[#1E293B] my-1">{applications.length}</p>
              <p className="text-[10px] text-sudan-gold font-bold">{applications.filter(a => a.status === "approved" || a.status === "pending").length} {currentLanguage === "ar" ? "موافقة معتمدة" : "grants certified"}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[140px] hover:scale-[1.01] transition-all duration-300">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "معدل حسم قضايا المستهلك" : "Consumer Case Resolution"}</p>
              <p className="text-3xl font-black text-rose-600 my-1">
                {complaints.length > 0 
                  ? Math.round((complaints.filter(c => c.status === "resolved").length / complaints.length) * 100) 
                  : 100}%
              </p>
              <p className="text-[10px] text-gray-500 font-bold">{complaints.filter(c => c.status === "new" || c.status === "investigating").length} {currentLanguage === "ar" ? "بلاغات قيد التفتيش" : "active dispatches"}</p>
            </div>
          </div>

          {/* Charts Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 lg:col-span-2">
              <h4 className="font-extrabold text-[#1E293B] text-sm pb-2 border-b border-gray-100">{currentLanguage === "ar" ? "توزيع السجلات التجارية عبر الولايات السودانية" : "Commercial Registries by Sudanese States"}</h4>
              <div className="h-64">
                {stateChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stateChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                      <Bar dataKey="السجلات / Registries" fill="#007229" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">{currentLanguage === "ar" ? "لا توجد سجلات كافية للرسم" : "Not enough data"}</div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <h4 className="font-extrabold text-[#1E293B] text-sm pb-2 border-b border-gray-100">{currentLanguage === "ar" ? "هيكل وتوزيع القطاع الصناعي" : "Industrial Sector Distribution"}</h4>
              <div className="h-64 flex flex-col justify-between">
                <div className="h-44 relative">
                  {sectorChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectorChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {sectorChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400">{currentLanguage === "ar" ? "لا توجد مصانع للرسم" : "No factory units"}</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 justify-center text-[10px] bg-[#F4F6F5] p-3 rounded-2xl border border-gray-100">
                  {sectorChartData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-gray-600 font-extrabold">{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- EXECUTIVE DASHBOARD ----------------- */}
      {(role === UserRole.GOVERNMENT_EXECUTIVE) && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-gray-100 text-gray-500 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{currentLanguage === "ar" ? "ديوان المتابعة التنفيذية" : "Executive Follow-up"}</span>
              <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2 mt-1">
                <Activity className="h-5 w-5 text-sudan-green" />
                {currentLanguage === "ar" ? "المتابعة والرقابة التنفيذية الميدانية" : "Executive Monitoring & Field Operations"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-[#1E293B] text-sm pb-2 border-b border-gray-100">{currentLanguage === "ar" ? "أداء التفتيش والتحقق من التراخيص" : "Inspection & License Audits"}</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tradeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#6B7280' }} width={80} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                    <Bar dataKey="count" fill="#C5A059" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
              <h4 className="font-extrabold text-[#1E293B] text-sm pb-2 border-b border-gray-100">{currentLanguage === "ar" ? "أحدث المنشآت الصناعية المسجلة ومصادر الطاقة" : "Latest Factories & Energy Sources"}</h4>
              <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                {factories.slice(-4).map(f => (
                  <div key={f.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors px-1 rounded-lg">
                    <div>
                      <p className="font-extrabold text-[#1E293B]">{f.factoryName}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{f.locationState} • {currentLanguage === "ar" ? `خطوط: ${f.productionLinesCount}` : `Lines: ${f.productionLinesCount}`}</p>
                    </div>
                    <span className="bg-[#C5A059]/10 text-[#A88849] border border-[#C5A059]/20 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
                      {f.energySource}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- EMPLOYEE DASHBOARD ----------------- */}
      {(role === UserRole.GOVERNMENT_EMPLOYEE) && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-sudan-green/10 text-sudan-green font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{currentLanguage === "ar" ? "منصة موظفي الوزارة" : "Ministry Employee Hub"}</span>
              <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2 mt-1">
                <CheckCircle className="h-5 w-5 text-sudan-green" />
                {currentLanguage === "ar" ? "قائمة المعاملات اليومية والتدقيق الرقمي" : "Daily Transactions Queue & Audit"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:scale-[1.01] transition-all duration-300">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{currentLanguage === "ar" ? "بانتظار تدقيق السجل" : "Pending Registries"}</p>
                <p className="text-3xl font-black text-[#1E293B] mt-2">{companies.filter(c => c.status === "pending").length}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:scale-[1.01] transition-all duration-300">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{currentLanguage === "ar" ? "بانتظار فحص المصانع" : "Pending Inspections"}</p>
                <p className="text-3xl font-black text-[#1E293B] mt-2">{factories.filter(f => f.inspectionStatus === "pending").length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <Cpu className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:scale-[1.01] transition-all duration-300">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{currentLanguage === "ar" ? "بلاغات المستهلك العاجلة" : "Urgent Complaints"}</p>
                <p className="text-3xl font-black text-rose-600 mt-2">{complaints.filter(c => c.status === "new" || c.status === "investigating").length}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                <ShieldAlert className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- INVESTOR/PUBLIC DASHBOARD ----------------- */}
      {(role === UserRole.BUSINESS_INVESTOR || role === UserRole.PUBLIC_CITIZEN) && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] bg-sudan-gold text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">{currentLanguage === "ar" ? "بوابة الخدمة العامة والاستثمار" : "Citizen & Investor Portal"}</span>
              <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2 mt-1">
                <User className="h-5 w-5 text-sudan-green" />
                {currentLanguage === "ar" ? "محفظة الاستثمارات والمصانع والخدمات الخاصة بي" : "My Investments, Factories & Lands"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* My companies */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <h4 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-2 pb-2 border-b border-gray-100">
                <FileText className="h-4.5 w-4.5 text-sudan-green" />
                {currentLanguage === "ar" ? "سجلاتي التجارية النشطة" : "My Active Registries"}
              </h4>
              <div className="space-y-2.5">
                {companies.slice(0, 3).map(c => (
                  <div key={c.id} className="bg-[#F4F6F5] p-3.5 rounded-2xl border border-gray-200 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-[#1E293B]">{currentLanguage === "ar" ? c.companyNameAr : c.companyNameEn}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">{c.registrationNumber}</p>
                    </div>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                      {c.status}
                    </span>
                  </div>
                ))}
                {companies.length === 0 && <p className="text-slate-400 text-xs py-4 text-center">{currentLanguage === "ar" ? "لم تقم بتسجيل شركة بعد" : "No companies registered"}</p>}
              </div>
            </div>

            {/* My Factories */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <h4 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-2 pb-2 border-b border-gray-100">
                <Cpu className="h-4.5 w-4.5 text-sudan-green" />
                {currentLanguage === "ar" ? "مصانعي وخطوط تشغيلي" : "My Industrial Units"}
              </h4>
              <div className="space-y-2.5">
                {factories.slice(0, 3).map(f => (
                  <div key={f.id} className="bg-[#F4F6F5] p-3.5 rounded-2xl border border-gray-200 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-[#1E293B]">{f.factoryName}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{f.locationState} • {f.productionCapacity}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase shrink-0 ${
                      f.inspectionStatus === "passed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}>
                      {f.inspectionStatus || "pending"}
                    </span>
                  </div>
                ))}
                {factories.length === 0 && <p className="text-slate-400 text-xs py-4 text-center">{currentLanguage === "ar" ? "لم تقم بتسجيل مصنع بعد" : "No factories registered"}</p>}
              </div>
            </div>

            {/* My Land Allocations */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <h4 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-2 pb-2 border-b border-gray-100">
                <Landmark className="h-4.5 w-4.5 text-sudan-green" />
                {currentLanguage === "ar" ? "حالة الأراضي وتخصيص المخططات" : "My Industrial Plots Status"}
              </h4>
              <div className="space-y-2.5">
                {applications.slice(0, 3).map(app => (
                  <div key={app.id} className="bg-[#F4F6F5] p-3.5 rounded-2xl border border-gray-200 space-y-2 text-xs">
                    <p className="font-extrabold text-[#1E293B] line-clamp-1">{app.proposedProject}</p>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1 border-t border-gray-100">
                      <span>{app.preferredIndustrialZone} ({app.requestedAreaSqm} m²)</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        app.status === "approved" ? "bg-emerald-105 text-emerald-800 border border-emerald-200" : "bg-amber-105 text-amber-800 border border-amber-200"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && <p className="text-slate-400 text-xs py-4 text-center">{currentLanguage === "ar" ? "لم تقم بتقديم طلب أرض" : "No land requests submitted"}</p>}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
