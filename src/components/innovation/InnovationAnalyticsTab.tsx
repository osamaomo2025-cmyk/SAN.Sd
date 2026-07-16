/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from "recharts";
import { 
  TrendingUp, MapPin, Award, Building, DollarSign, Users, 
  HelpCircle, AlertCircle, RefreshCw 
} from "lucide-react";

interface RegionStats {
  id: string;
  nameAr: string;
  nameEn: string;
  innovators: number;
  patents: number;
  universities: number;
  activeFunds: number; // Million SDG
  coordinates: { x: number; y: number }; // Relative percentage for map plotting
}

interface InnovationAnalyticsTabProps {
  currentLanguage: "ar" | "en";
}

export default function InnovationAnalyticsTab({ currentLanguage }: InnovationAnalyticsTabProps) {
  // Region cluster selection for GIS
  const [selectedRegionId, setSelectedRegionId] = useState<string>("khartoum");

  // Mock GIS Data representing regional innovation clusters in Sudan
  const regionalClusters: RegionStats[] = [
    {
      id: "khartoum",
      nameAr: "ولاية الخرطوم التكنولوجية",
      nameEn: "Khartoum Technology Hub",
      innovators: 540,
      patents: 120,
      universities: 18,
      activeFunds: 450,
      coordinates: { x: 50, y: 35 }
    },
    {
      id: "gezira",
      nameAr: "ولاية الجزيرة (الابتكار الزراعي)",
      nameEn: "Al Gezira (Agri-Innovation)",
      innovators: 380,
      patents: 65,
      universities: 8,
      activeFunds: 280,
      coordinates: { x: 55, y: 50 }
    },
    {
      id: "red_sea",
      nameAr: "ولاية البحر الأحمر (اللوجستيات والموانئ)",
      nameEn: "Red Sea (Port Logistics Hub)",
      innovators: 210,
      patents: 24,
      universities: 4,
      activeFunds: 190,
      coordinates: { x: 75, y: 18 }
    },
    {
      id: "kassala",
      nameAr: "ولاية كسلا (الصناعات التحويلية)",
      nameEn: "Kassala (Processing Hub)",
      innovators: 110,
      patents: 12,
      universities: 3,
      activeFunds: 85,
      coordinates: { x: 70, y: 38 }
    },
    {
      id: "north_kordofan",
      nameAr: "شمال كردفان (الصمغ العربي)",
      nameEn: "North Kordofan (Gum Arabic Research)",
      innovators: 185,
      patents: 38,
      universities: 5,
      activeFunds: 140,
      coordinates: { x: 38, y: 48 }
    },
    {
      id: "south_darfur",
      nameAr: "جنوب دارفور (الثروة الحيوانية والجلود)",
      nameEn: "South Darfur (Livestock & Leather)",
      innovators: 140,
      patents: 15,
      universities: 4,
      activeFunds: 95,
      coordinates: { x: 18, y: 62 }
    }
  ];

  const selectedRegion = regionalClusters.find(r => r.id === selectedRegionId) || regionalClusters[0];

  // Recharts Data
  const patentGrowthData = [
    { year: "2021", Patents: 28, Research: 45 },
    { year: "2022", Patents: 42, Research: 62 },
    { year: "2023", Patents: 68, Research: 88 },
    { year: "2024", Patents: 115, Research: 140 },
    { year: "2025", Patents: 185, Research: 210 },
    { year: "2026", Patents: 284, Research: 320 }
  ];

  const patentCategoryData = [
    { name: currentLanguage === "ar" ? "الهندسة الزراعية" : "Agri-Engineering", value: 38 },
    { name: currentLanguage === "ar" ? "التكنولوجيا الحيوية" : "Biotech & Medicine", value: 25 },
    { name: currentLanguage === "ar" ? "المعلوماتية والاتصالات" : "ICT Solutions", value: 20 },
    { name: currentLanguage === "ar" ? "الطاقة المتجددة" : "Clean Energy", value: 12 },
    { name: currentLanguage === "ar" ? "الصناعات الكيميائية" : "Chemical Sciences", value: 5 }
  ];

  const fundDisbursementData = [
    { name: currentLanguage === "ar" ? "منح ابتكار فردية" : "Individual Grants", value: 150 },
    { name: currentLanguage === "ar" ? "تمويل بذور ناشئة" : "Startup Seed", value: 320 },
    { name: currentLanguage === "ar" ? "منح أبحاث جامعية" : "Research Grants", value: 240 },
    { name: currentLanguage === "ar" ? "تطوير التكنولوجيا" : "Tech Dev Funds", value: 480 },
    { name: currentLanguage === "ar" ? "دعم التسويق" : "Commercialization", value: 180 }
  ];

  const COLORS = ["#00A859", "#FFD700", "#1E293B", "#38BDF8", "#EC4899"];

  return (
    <div className="space-y-6">
      
      {/* Upper overview charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: GIS Interactive Node Map of Sudan clusters (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base flex items-center gap-1.5">
              <MapPin className="h-5 w-5 text-sudan-green" />
              <span>{currentLanguage === "ar" ? "نظام المعلومات الجغرافي الفيدرالي للابتكار (GIS)" : "Federal Geographic GIS Innovation Node Cluster"}</span>
            </h4>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">
              {currentLanguage === "ar" ? "خريطة تفاعلية" : "Interactive Map"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* The SVG map container */}
            <div className="md:col-span-8 bg-slate-50 border border-slate-200 rounded-2xl relative h-72 md:h-80 overflow-hidden flex items-center justify-center">
              
              {/* Decorative SVG background representing Sudan outline loosely */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 30,10 L 70,10 L 85,30 L 75,60 L 55,90 L 30,85 L 15,65 L 10,40 Z" fill="#00A859" stroke="#1E293B" strokeWidth="0.5" />
                <path d="M 50,5 L 50,95 M 5,50 L 95,50" stroke="#CBD5E1" strokeWidth="0.2" strokeDasharray="2" />
              </svg>

              <div className="absolute top-2 right-2 text-[9px] text-slate-400 font-bold leading-tight select-none">
                {currentLanguage === "ar" ? "مكثف التكتلات الصناعية الفيدرالية" : "Sovereign GIS Industrial Clusters"}
              </div>

              {/* Cluster clickable nodes */}
              {regionalClusters.map((cluster) => {
                const isSelected = selectedRegionId === cluster.id;

                return (
                  <button
                    key={cluster.id}
                    onClick={() => setSelectedRegionId(cluster.id)}
                    style={{ left: `${cluster.coordinates.x}%`, top: `${cluster.coordinates.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
                  >
                    {/* Ring animation */}
                    {isSelected && (
                      <span className="absolute -inset-1.5 rounded-full bg-sudan-green/30 animate-ping" />
                    )}

                    <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected 
                        ? "bg-slate-900 border-sudan-gold text-sudan-gold scale-125" 
                        : "bg-sudan-green border-white text-white hover:scale-110"
                    }`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    </span>

                    {/* Simple Tooltip on hover */}
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {currentLanguage === "ar" ? cluster.nameAr : cluster.nameEn}
                    </span>
                  </button>
                );
              })}

              {/* Geographic compass label */}
              <div className="absolute bottom-2 left-2 text-[8px] font-mono text-slate-400">
                Lat: 15.5007° N | Lon: 32.5599° E
              </div>

            </div>

            {/* GIS Regional stats panel (4 cols) */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex flex-col justify-between gap-3 text-xs font-bold">
              <div className="space-y-2">
                <span className="text-[10px] text-sudan-green uppercase tracking-wider block font-extrabold">
                  {currentLanguage === "ar" ? "التكتل الابتكاري المختار" : "Selected GIS Cluster"}
                </span>
                
                <h5 className="font-extrabold text-[#1E293B] text-xs leading-snug">
                  {currentLanguage === "ar" ? selectedRegion.nameAr : selectedRegion.nameEn}
                </h5>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-2 text-[10px] text-slate-600">
                <div className="flex justify-between">
                  <span>{currentLanguage === "ar" ? "المبتكرون المسجلون:" : "Registered Innovators:"}</span>
                  <span className="text-slate-900">{selectedRegion.innovators}</span>
                </div>
                <div className="flex justify-between">
                  <span>{currentLanguage === "ar" ? "براءات الاختراع:" : "Patent Records:"}</span>
                  <span className="text-slate-900">{selectedRegion.patents}</span>
                </div>
                <div className="flex justify-between">
                  <span>{currentLanguage === "ar" ? "المؤسسات الأكاديمية:" : "Academic Institutions:"}</span>
                  <span className="text-slate-900">{selectedRegion.universities}</span>
                </div>
                <div className="flex justify-between">
                  <span>{currentLanguage === "ar" ? "السيولة المخصصة:" : "Allocated Capital:"}</span>
                  <span className="text-sudan-green font-bold">{selectedRegion.activeFunds}M SDG</span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200 text-[9px] text-slate-400 font-medium leading-relaxed">
                {currentLanguage === "ar" 
                  ? "يتم تحديث هذه البيانات جغرافياً بصورة متزامنة مع الرخص التجارية والصناعية والمنح السيادية الصادرة."
                  : "Sovereign analytical data synced directly with the industrial registries, national patents, and trade permits databases."}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT: Patent submissions & Research growth Line Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base flex items-center gap-1.5">
              <TrendingUp className="h-5 w-5 text-sudan-green" />
              <span>{currentLanguage === "ar" ? "معدلات نمو براءات الاختراع والأبحاث" : "Patent & Research Annual Trajectory"}</span>
            </h4>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patentGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Patents" stroke="#00A859" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name={currentLanguage === "ar" ? "البراءات المسجلة" : "Patents"} />
                <Line type="monotone" dataKey="Research" stroke="#FFD700" strokeWidth={2} name={currentLanguage === "ar" ? "البحوث المنشورة" : "Published Research"} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Lower Pie charts: Classification break down & Funds breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pie chart 1: IP Classifications breakdown */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base border-b border-gray-100 pb-3">
            {currentLanguage === "ar" ? "توزيع براءات الاختراع والملكية الفكرية حسب القطاع" : "Intellectual Property Sectors Distribution"}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patentCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {patentCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legends */}
            <div className="md:col-span-5 space-y-1.5 text-[10px] font-bold text-slate-600">
              {patentCategoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie chart 2: Funding breakdown */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base border-b border-gray-100 pb-3">
            {currentLanguage === "ar" ? "توزيع ميزانيات الدعم حسب البرنامج المالي" : "Federal Funding Allocations Distribution"}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fundDisbursementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {fundDisbursementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legends */}
            <div className="md:col-span-5 space-y-1.5 text-[10px] font-bold text-slate-600">
              {fundDisbursementData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate">{entry.name}: {entry.value}M SDG</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
