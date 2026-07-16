/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from "recharts";
import { 
  TrendingUp, Compass, MapPin, Layers, Globe, 
  Activity, Users, DollarSign, Award, Target 
} from "lucide-react";
import { DigitalBusiness, StartupRecord } from "./CommerceTypes";

interface CommerceAnalyticsProps {
  currentLanguage: "ar" | "en";
  businesses: DigitalBusiness[];
  startups: StartupRecord[];
}

export default function CommerceAnalytics({
  currentLanguage,
  businesses,
  startups
}: CommerceAnalyticsProps) {
  const [selectedState, setSelectedState] = useState<string>("all");
  const [mapZoom, setMapZoom] = useState(1);

  // Core metrics calculation
  const totalBusinesses = businesses.length;
  const activeSmes = businesses.filter(b => b.status === "active" || b.status === "verified").length;
  const totalSmeRevenue = businesses.reduce((acc, curr) => acc + curr.annualRevenue, 0);
  const averageReputation = Math.round(businesses.reduce((acc, curr) => acc + curr.trustScore, 0) / (businesses.length || 1));
  const avgSurvivalYears = Number((startups.reduce((acc, curr) => acc + curr.survivalYears, 0) / (startups.length || 1)).toFixed(1));

  // Regional state-wise breakdown for GIS Map
  const stateData = [
    { id: "state-khartoum", nameAr: "ولاية الخرطوم", nameEn: "Khartoum State", coords: "15.55° N, 32.53° E", smes: 1420, startups: 58, revenue: 154000000, color: "#007229", x: 180, y: 140 },
    { id: "state-redsea", nameAr: "ولاية البحر الأحمر", nameEn: "Red Sea State", coords: "19.61° N, 37.21° E", smes: 850, startups: 22, revenue: 98000000, color: "#FFD700", x: 310, y: 50 },
    { id: "state-kordofan", nameAr: "ولاية شمال كردفان", nameEn: "North Kordofan", coords: "13.18° N, 30.20° E", smes: 640, startups: 8, revenue: 42000000, color: "#1E293B", x: 110, y: 210 },
    { id: "state-gezira", nameAr: "ولاية الجزيرة", nameEn: "Al Gezira State", coords: "14.40° N, 33.51° E", smes: 920, startups: 12, revenue: 78000000, color: "#0284C7", x: 210, y: 170 },
    { id: "state-sennar", nameAr: "ولاية سنار", nameEn: "Sennar State", coords: "13.56° N, 33.56° E", smes: 430, startups: 4, revenue: 31000000, color: "#4F46E5", x: 220, y: 220 },
    { id: "state-rivernile", nameAr: "ولاية نهر النيل", nameEn: "River Nile State", coords: "16.81° N, 33.91° E", smes: 310, startups: 5, revenue: 22000000, color: "#F59E0B", x: 200, y: 80 }
  ];

  // Selected state specs
  const activeStateObj = stateData.find(s => s.id === selectedState || s.nameEn === selectedState);

  // E-commerce monthly growth data (recharts)
  const monthlySalesTrend = [
    { month: currentLanguage === "ar" ? "يناير" : "Jan", sales: 120, startups: 5 },
    { month: currentLanguage === "ar" ? "فبراير" : "Feb", sales: 155, startups: 8 },
    { month: currentLanguage === "ar" ? "مارس" : "Mar", sales: 198, startups: 11 },
    { month: currentLanguage === "ar" ? "أبريل" : "Apr", sales: 240, startups: 14 },
    { month: currentLanguage === "ar" ? "مايو" : "May", sales: 310, startups: 18 },
    { month: currentLanguage === "ar" ? "يونيو" : "Jun", sales: 420, startups: 24 },
    { month: currentLanguage === "ar" ? "يوليو" : "Jul", sales: 580, startups: 32 }
  ];

  // Category breakdown for Pie Chart
  const categoryChartData = [
    { name: currentLanguage === "ar" ? "سلع وطنية" : "Sovereign Commodities", value: 45 },
    { name: currentLanguage === "ar" ? "صناعات تحويلية" : "Processed Foods", value: 25 },
    { name: currentLanguage === "ar" ? "صناعات يدوية" : "Handicrafts", value: 15 },
    { name: currentLanguage === "ar" ? "خدمات رقمية" : "Digital Services", value: 15 }
  ];

  const COLORS = ["#007229", "#FFD700", "#1E293B", "#0284C7"];

  return (
    <div className="space-y-6">
      
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {currentLanguage === "ar" ? "المشاريع والمتاجر النشطة" : "Active & Verified SMEs"}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-extrabold text-[#1E293B] font-mono">
              {activeSmes.toLocaleString()} / {totalBusinesses}
            </h4>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+18.4% {currentLanguage === "ar" ? "نمو ربع سنوي" : "Quarterly growth"}</span>
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {currentLanguage === "ar" ? "حجم مبيعات التجارة الرقمية" : "Estimated Commerce Turnover"}
            </span>
            <div className="p-2 bg-sudan-green/10 text-sudan-green rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-extrabold text-[#1E293B] font-mono truncate">
              {totalSmeRevenue.toLocaleString()} SDG
            </h4>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+24.1% {currentLanguage === "ar" ? "زيادة المبيعات الإلكترونية" : "E-Commerce volume"}</span>
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {currentLanguage === "ar" ? "معدل استمرار الشركات الناشئة" : "Startup Survival Index"}
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-extrabold text-[#1E293B] font-mono">
              {avgSurvivalYears} {currentLanguage === "ar" ? "سنوات معدل بقاء" : "Yrs Avg Lifecycle"}
            </h4>
            <p className="text-[10px] text-indigo-600 font-bold flex items-center gap-1">
              <span>94.5% {currentLanguage === "ar" ? "نسبة التوطين والنجاح" : "Success & durability"}</span>
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {currentLanguage === "ar" ? "مؤشر الرضا والثقة العام" : "Consumer Trust Rating"}
            </span>
            <div className="p-2 bg-sudan-gold/10 text-sudan-gold rounded-xl">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-extrabold text-[#1E293B] font-mono">
              {averageReputation}%
            </h4>
            <p className="text-[10px] text-sudan-gold font-bold flex items-center gap-1">
              <span>{currentLanguage === "ar" ? "تأمين حماية المستهلك متكامل" : "Sovereign consumer escrow active"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* GIS and Maps Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive GIS Mapping Hub */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-sudan-green" />
              <div>
                <h4 className="font-extrabold text-sm md:text-base">
                  {currentLanguage === "ar" ? "نظام الخرائط الرقمية الفيدرالي وجغرافيات الاقتصاد" : "Federal GIS Digital Economy Map Platform"}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {currentLanguage === "ar" ? "تتبع وتوزيع رواد الأعمال وحواضن الابتكار" : "Interactive mapping of SME cluster networks"}
                </p>
              </div>
            </div>
            
            {/* Zoom Controls & Layers */}
            <div className="flex items-center gap-1 text-[10px]">
              <button 
                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
                className="bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded cursor-pointer"
              >
                +
              </button>
              <button 
                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.6))}
                className="bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded cursor-pointer"
              >
                -
              </button>
              <span className="font-mono text-gray-500 bg-slate-950 px-2 py-1 rounded">
                {(mapZoom * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Interactive SVG Map */}
            <div className="md:col-span-8 bg-slate-950 rounded-2xl aspect-square border border-slate-800 relative overflow-hidden flex items-center justify-center">
              <div 
                className="w-full h-full relative transition-transform duration-300"
                style={{ transform: `scale(${mapZoom})` }}
              >
                {/* SVG Nile river blueprint path / Sudan Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 300">
                  <path d="M 180,300 C 180,240 210,180 200,140 C 190,100 210,40 200,0" fill="none" stroke="#0ea5e9" strokeWidth="6" />
                  <path d="M 200,140 C 220,150 250,210 280,240" fill="none" stroke="#38bdf8" strokeWidth="4" />
                </svg>

                {/* State Node markers */}
                {stateData.map((state) => {
                  const isSelected = selectedState === state.id;
                  return (
                    <button
                      key={state.id}
                      onClick={() => setSelectedState(state.id)}
                      className="absolute group flex flex-col items-center justify-center"
                      style={{ left: `${state.x}px`, top: `${state.y}px` }}
                    >
                      <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{ backgroundColor: state.color }} />
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isSelected ? "ring-4 ring-white" : ""}`} style={{ backgroundColor: state.color }} />
                      </span>
                      <span className="hidden group-hover:block bg-slate-900 border border-slate-700 text-[8px] font-bold px-1.5 py-0.5 rounded shadow absolute top-4 whitespace-nowrap z-30">
                        {currentLanguage === "ar" ? state.nameAr : state.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Map Floating HUD info */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl text-[9px] font-bold text-slate-300">
                <p className="text-sudan-green">● {currentLanguage === "ar" ? "الاتصال السيادي اللوجستي: نشط" : "Sovereign Link: ACTIVE"}</p>
                <p className="font-mono text-gray-500 mt-0.5">{currentLanguage === "ar" ? "الأقمار الصناعية: السودان-١" : "Satellites: SUDANSAT-1"}</p>
              </div>
            </div>

            {/* GIS Details Sidebar Panel */}
            <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <span className="text-[9px] bg-slate-800 text-slate-400 font-mono font-bold px-2 py-1 rounded border border-slate-700 uppercase">
                  {currentLanguage === "ar" ? "قراءة الاستشعار الفيدرالي" : "Federal GIS Telemetry"}
                </span>

                {activeStateObj ? (
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-extrabold text-sm text-[#FFD700]">
                        {currentLanguage === "ar" ? activeStateObj.nameAr : activeStateObj.nameEn}
                      </h5>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{activeStateObj.coords}</p>
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-800 pt-2.5">
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">{currentLanguage === "ar" ? "المتاجر الرقمية المسجلة" : "Digital Businesses"}</span>
                        <span className="font-mono font-extrabold">{activeStateObj.smes.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">{currentLanguage === "ar" ? "حواضن الابتكار / شركات ناشئة" : "Accelerators & Tech"}</span>
                        <span className="font-mono font-extrabold">{activeStateObj.startups}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">{currentLanguage === "ar" ? "الناتج المحلي الرقمي السنوي" : "Annual Digital Sales"}</span>
                        <span className="font-mono font-extrabold text-sudan-green">{activeStateObj.revenue.toLocaleString()} SDG</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    <MapPin className="h-8 w-8 mx-auto text-slate-700 animate-bounce mb-2" />
                    {currentLanguage === "ar" ? "انقر على أحد المؤشرات الجغرافية بالخريطة للاستعلام الفوري" : "Click a cluster node to view telemetry"}
                  </div>
                )}
              </div>

              {activeStateObj && (
                <button 
                  onClick={() => setSelectedState("all")}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-white text-[10px] font-bold py-2 rounded-xl border border-slate-700 cursor-pointer"
                >
                  {currentLanguage === "ar" ? "إعادة تصفية الكل" : "Reset GIS view"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Charts and Data Visualizations */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Chart 1: Sales Monthly Growth */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between h-[210px]">
            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-sudan-green" />
              <span>{currentLanguage === "ar" ? "مؤشر حجم التجارة الرقمية الشهري (مليار جنيه)" : "Monthly Commerce Volume (Billions SDG)"}</span>
            </h5>
            
            <div className="h-32 mt-3 text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySalesTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#007229" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Category Breakdown Pie */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between h-[210px]">
            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-sudan-green" />
              <span>{currentLanguage === "ar" ? "توزيع الاقتصاد الرقمي حسب القطاع" : "Economic Cluster Diversification (%)"}</span>
            </h5>

            <div className="grid grid-cols-2 items-center gap-2 mt-3">
              <div className="h-28 text-[9px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={4} dataKey="value">
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-[10px] font-semibold text-slate-500">
                {categoryChartData.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    <span className="h-2 w-2 rounded-full inline-block shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="truncate max-w-[120px]">{cat.name}:</span>
                    <span className="font-mono font-bold text-[#1E293B]">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
