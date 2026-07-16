/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Map, Pin, Info, Star, ShieldAlert, Sparkles, AlertTriangle } from "lucide-react";
import { SUDANESE_STATES } from "../../data";

interface GisMapProps {
  currentLanguage: "ar" | "en";
  complaints: any[];
  recalls: any[];
}

export default function GisMap({
  currentLanguage,
  complaints,
  recalls
}: GisMapProps) {
  const [metric, setMetric] = useState<"complaints" | "recalls" | "satisfaction">("complaints");
  const [selectedState, setSelectedState] = useState<any>(SUDANESE_STATES[0]);

  // Derive dynamic state statistics
  const getStateStats = (stateAr: string) => {
    const stateComplaints = complaints.filter(c => c.state === stateAr || c.state === stateAr.replace("ولاية ", ""));
    const stateRecalls = recalls.filter(r => r.state === stateAr).length;
    
    // Calculate mock but reproducible satisfaction rate based on state length
    const satisfaction = Math.min(100, Math.max(50, 85 - (stateComplaints.length * 3)));
    
    return {
      complaintCount: stateComplaints.length,
      recallCount: stateRecalls,
      satisfactionRate: satisfaction,
      riskLevel: stateComplaints.length > 5 ? "high" : stateComplaints.length > 2 ? "medium" : "low"
    };
  };

  // State coordinate map grid representation
  // This layout places states in relative physical grid coordinates of Sudan (Northern states at the top, Darfur on the left, Kassala on the right, etc.)
  const stateLayout = [
    { id: "northern", nameAr: "الشمالية", nameEn: "Northern", gridX: 3, gridY: 1 },
    { id: "nile", nameAr: "نهر النيل", nameEn: "River Nile", gridX: 4, gridY: 1 },
    { id: "red_sea", nameAr: "البحر الأحمر", nameEn: "Red Sea", gridX: 5, gridY: 1 },
    
    { id: "north_darfur", nameAr: "شمال دارفور", nameEn: "North Darfur", gridX: 1, gridY: 2 },
    { id: "north_kordofan", nameAr: "شمال كردفان", nameEn: "North Kordofan", gridX: 2, gridY: 2 },
    { id: "khartoum", nameAr: "الخرطوم", nameEn: "Khartoum", gridX: 3, gridY: 2 },
    { id: "kassala", nameAr: "كسلا", nameEn: "Kassala", gridX: 5, gridY: 2 },
    { id: "gadarif", nameAr: "القضارف", nameEn: "Gadarif", gridX: 5, gridY: 3 },
    
    { id: "west_darfur", nameAr: "غرب دارفور", nameEn: "West Darfur", gridX: 1, gridY: 3 },
    { id: "central_darfur", nameAr: "وسط دارفور", nameEn: "Central Darfur", gridX: 1, gridY: 4 },
    { id: "east_darfur", nameAr: "شرق دارفور", nameEn: "East Darfur", gridX: 2, gridY: 3 },
    { id: "south_darfur", nameAr: "جنوب دارفور", nameEn: "South Darfur", gridX: 2, gridY: 4 },
    
    { id: "west_kordofan", nameAr: "غرب كردفان", nameEn: "West Kordofan", gridX: 2, gridY: 5 },
    { id: "south_kordofan", nameAr: "جنوب كردفان", nameEn: "South Kordofan", gridX: 3, gridY: 5 },
    
    { id: "white_nile", nameAr: "النيل الأبيض", nameEn: "White Nile", gridX: 3, gridY: 3 },
    { id: "gezira", nameAr: "الجزيرة", nameEn: "Gezira", gridX: 4, gridY: 2 },
    { id: "sennar", nameAr: "سنار", nameEn: "Sennar", gridX: 4, gridY: 3 },
    { id: "blue_nile", nameAr: "النيل الأزرق", nameEn: "Blue Nile", gridX: 4, gridY: 4 }
  ];

  const getMetricColor = (stats: any) => {
    if (metric === "complaints") {
      if (stats.complaintCount > 5) return "bg-red-500 hover:bg-red-600 text-white";
      if (stats.complaintCount > 2) return "bg-amber-500 hover:bg-amber-600 text-slate-900";
      return "bg-emerald-500 hover:bg-emerald-600 text-white";
    } else if (metric === "recalls") {
      if (stats.recallCount > 1) return "bg-rose-600 hover:bg-rose-700 text-white";
      if (stats.recallCount > 0) return "bg-amber-500 hover:bg-amber-600 text-slate-900";
      return "bg-slate-200 hover:bg-slate-300 text-slate-700";
    } else { // satisfaction
      if (stats.satisfactionRate >= 80) return "bg-emerald-600 hover:bg-emerald-700 text-white";
      if (stats.satisfactionRate >= 65) return "bg-amber-500 hover:bg-amber-600 text-slate-900";
      return "bg-red-500 hover:bg-red-600 text-white";
    }
  };

  const selectedStats = getStateStats(selectedState.nameAr);

  return (
    <div id="gis-geographical-analytics-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* State Selector and relative grid map Left 2 Columns */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6">
        
        {/* Toggle selectors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Map className="h-4.5 w-4.5 text-sudan-green" />
              {currentLanguage === "ar" ? "الخريطة الجغرافية للإنذار والرقابة" : "GIS Warning & Surveillance Map"}
            </h4>
            <p className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "تحديد بؤر تضخم الأسعار ونشاط سحب السلع الفيدرالي" : "Live geographical view of price surges and hazard distributions"}</p>
          </div>

          <div className="bg-slate-50 border border-slate-150 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setMetric("complaints")}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                metric === "complaints" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {currentLanguage === "ar" ? "البلاغات النشطة" : "Active Grievances"}
            </button>
            <button
              onClick={() => setMetric("recalls")}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                metric === "recalls" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {currentLanguage === "ar" ? "سحب المنتجات" : "Recalls Order"}
            </button>
            <button
              onClick={() => setMetric("satisfaction")}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                metric === "satisfaction" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {currentLanguage === "ar" ? "رضا الشارع" : "Satisfaction Rate"}
            </button>
          </div>
        </div>

        {/* Dynamic Relative Grid Map */}
        <div className="bg-[#FAFBFB] rounded-3xl p-6 border border-dashed border-slate-200 relative">
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 bg-white p-3 border border-gray-150 rounded-2xl text-[9px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span>{metric === "complaints" ? (currentLanguage === "ar" ? "أمان / التزام عالي" : "Safe") : metric === "recalls" ? (currentLanguage === "ar" ? "مكتمل السحب" : "No recalls") : (currentLanguage === "ar" ? "ممتاز > 80%" : "Excellent")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              <span>{metric === "complaints" ? (currentLanguage === "ar" ? "مخاطر متوسطة" : "Medium Risk") : metric === "recalls" ? (currentLanguage === "ar" ? "نشط" : "Active recall") : (currentLanguage === "ar" ? "متوسط 65-80%" : "Fair")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
              <span>{metric === "complaints" ? (currentLanguage === "ar" ? "غش تضخمي مفرط" : "Inflation Surge") : metric === "recalls" ? (currentLanguage === "ar" ? "حظر سحب سيادي" : "Urgent action") : (currentLanguage === "ar" ? "قلق < 65%" : "Needs Improvement")}</span>
            </div>
          </div>

          {/* Coordinate board */}
          <div className="grid grid-cols-5 grid-rows-5 gap-3.5 max-w-lg mx-auto aspect-square p-2">
            {stateLayout.map(state => {
              const stats = getStateStats(state.nameAr);
              const colorClass = getMetricColor(stats);
              const isSelected = selectedState.nameAr === state.nameAr;
              
              return (
                <button
                  key={state.id}
                  onClick={() => setSelectedState({ nameAr: state.nameAr, nameEn: state.nameEn })}
                  style={{
                    gridColumnStart: state.gridX,
                    gridRowStart: state.gridY
                  }}
                  className={`p-2 rounded-2xl flex flex-col justify-between text-left transition-all relative cursor-pointer shadow-sm ${colorClass} ${
                    isSelected ? "ring-4 ring-sudan-gold ring-offset-2 scale-105 z-10" : "hover:scale-[1.02]"
                  }`}
                >
                  <p className="text-[10px] font-black tracking-tight truncate leading-none mb-1 text-center w-full">
                    {currentLanguage === "ar" ? state.nameAr.replace("ولاية ", "") : state.nameEn}
                  </p>
                  
                  <div className="text-center w-full mt-auto">
                    {metric === "complaints" && (
                      <span className="text-[10px] font-extrabold">{stats.complaintCount}</span>
                    )}
                    {metric === "recalls" && (
                      <span className="text-[10px] font-extrabold">{stats.recallCount}</span>
                    )}
                    {metric === "satisfaction" && (
                      <span className="text-[10px] font-extrabold">{stats.satisfactionRate}%</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* State Detail Statistics Panel Right Column */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Selected State Details Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">{currentLanguage === "ar" ? "تفاصيل الإقليم" : "Selected Region Info"}</span>
              <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                {currentLanguage === "ar" ? selectedState.nameAr : selectedState.nameEn}
              </h4>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
              selectedStats.riskLevel === "high" ? "bg-red-50 text-red-700 border-red-100" : selectedStats.riskLevel === "medium" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}>
              {selectedStats.riskLevel} risk
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
              <span className="text-slate-500">{currentLanguage === "ar" ? "مجموع بلاغات حماية المستهلك" : "Consumer Grievance Intake"}</span>
              <span className="font-extrabold text-slate-800">{selectedStats.complaintCount} {currentLanguage === "ar" ? "بلاغ" : "Grievances"}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
              <span className="text-slate-500">{currentLanguage === "ar" ? "نشاط سحب المنتجات والسلع" : "Sovereign Recall Orders"}</span>
              <span className="font-extrabold text-slate-800">{selectedStats.recallCount} {currentLanguage === "ar" ? "سلعة" : "Commodities"}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
              <span className="text-slate-500">{currentLanguage === "ar" ? "نسبة رضا المواطنين المستهدفة" : "Target Satisfaction"}</span>
              <span className="font-extrabold text-slate-800 flex items-center gap-1">
                <Star className="h-4 w-4 text-sudan-gold fill-sudan-gold" />
                <span>{selectedStats.satisfactionRate}%</span>
              </span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-start gap-2.5">
            <Sparkles className="h-5 w-5 text-sudan-green shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-600 leading-normal font-sans">
              {currentLanguage === "ar"
                ? `يقوم الذكاء الاصطناعي الفيدرالي بمتابعة معدل التزام المنشآت بولاية ${selectedState.nameAr} وإعادة جدولة دوريات التفتيش والمطابقة بناءً على المؤشرات الفورية المحدثة.`
                : `Sovereign AI continuously calculates risk weights for ${selectedState.nameEn} to schedule automated compliance check routes.`}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
