/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Map, MapPin, Anchor, ShieldCheck, Activity, Info, Plane, RefreshCw } from "lucide-react";

interface TradeGisMapProps {
  currentLanguage: "ar" | "en";
}

interface MapNode {
  id: string;
  nameAr: string;
  nameEn: string;
  type: "port" | "airport" | "border" | "hub";
  x: number; // SVG X coord (scaled 0-500)
  y: number; // SVG Y coord (scaled 0-500)
  capacity: string;
  delayAr: string;
  delayEn: string;
  cargoAr: string;
  cargoEn: string;
  status: "optimal" | "warning";
}

export default function TradeGisMap({ currentLanguage }: TradeGisMapProps) {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>({
    id: "node-1",
    nameAr: "ميناء بورتسودان الرئيسي والمنطقة الحرة",
    nameEn: "Port Sudan Sea Port & Free Zone",
    type: "port",
    x: 410,
    y: 110,
    capacity: "1.2 Million TEU / Year",
    delayAr: "١١.٢ ساعة (معدل مثالي)",
    delayEn: "11.2 Hours (Optimal rate)",
    cargoAr: "الصمغ العربي، الذهب، السمسم، الضأن، الحاويات الدولية",
    cargoEn: "Gum Arabic, Gold, Sesame, Livestock, Containers",
    status: "optimal"
  });

  const [activeRoute, setActiveRoute] = useState<string>("route-1");

  const nodes: MapNode[] = [
    {
      id: "node-1",
      nameAr: "ميناء بورتسودان الرئيسي والمنطقة الحرة",
      nameEn: "Port Sudan Sea Port & Free Zone",
      type: "port",
      x: 410,
      y: 110,
      capacity: "1.2 Million TEU / Year",
      delayAr: "١١.٢ ساعة (معدل مثالي)",
      delayEn: "11.2 Hours (Optimal rate)",
      cargoAr: "الصمغ العربي، الذهب، السمسم، الضأن، الحاويات الدولية",
      cargoEn: "Gum Arabic, Gold, Sesame, Livestock, Containers",
      status: "optimal"
    },
    {
      id: "node-2",
      nameAr: "مطار الخرطوم للشحن والقرية اللوجستية",
      nameEn: "Khartoum Air Cargo & Logistics Village",
      type: "airport",
      x: 230,
      y: 270,
      capacity: "250K Tons / Year",
      delayAr: "٤.٥ ساعة",
      delayEn: "4.5 Hours",
      cargoAr: "سبائك الذهب، شحنات التجارة الإلكترونية، الأدوية والمواد الطبية الحساسة",
      cargoEn: "Gold Bullion, E-Commerce cargo, sensitive pharmaceuticals",
      status: "optimal"
    },
    {
      id: "node-3",
      nameAr: "منطقة سوبا اللوجستية والمنفذ الجاف",
      nameEn: "Soba Dry Port & Logistics Terminal",
      type: "hub",
      x: 250,
      y: 290,
      capacity: "400K Tons / Year",
      delayAr: "٦.٨ ساعة",
      delayEn: "6.8 Hours",
      cargoAr: "القمح، الدقيق، المواد الخام والآلات الهندسية المستوردة",
      cargoEn: "Wheat, Flour, raw manufacturing goods, heavy machinery",
      status: "optimal"
    },
    {
      id: "node-4",
      nameAr: "مستودعات الأبيض اللوجستية (سوق الصمغ العربي)",
      nameEn: "El Obeid Trade & Gum Arabic Hub",
      type: "hub",
      x: 140,
      y: 350,
      capacity: "850K Tons / Year",
      delayAr: "٣.٢ ساعة (تجميع ومطابقة)",
      delayEn: "3.2 Hours (Assembly & Grading)",
      cargoAr: "محصول الصمغ العربي، الفول السوداني، الثروة الحيوانية البرية",
      cargoEn: "Gum Arabic, Peanut kernels, local livestock",
      status: "optimal"
    },
    {
      id: "node-5",
      nameAr: "معبر حلفا الحدودي البري",
      nameEn: "Halfa Border Crossing (Egypt Boundary)",
      type: "border",
      x: 200,
      y: 40,
      capacity: "150 Trucks / Day",
      delayAr: "١٨.٥ ساعة (فحص المستندات)",
      delayEn: "18.5 Hours (Doc Verification)",
      cargoAr: "المحاصيل الزراعية، الثروة الحيوانية الحية، السلع التجارية المتبادلة",
      cargoEn: "Agricultural crops, live cattle, trade commodities",
      status: "warning"
    },
    {
      id: "node-6",
      nameAr: "معبر القلابات الحدودي (إثيوبيا والكوميسا)",
      nameEn: "Gallabat Border Crossing (Ethiopia Gateway)",
      type: "border",
      x: 350,
      y: 360,
      capacity: "100 Trucks / Day",
      delayAr: "١٢.٠ ساعة",
      delayEn: "12.0 Hours",
      cargoAr: "البن، المواشي، السلع الاستهلاكية الإقليمية",
      cargoEn: "Coffee, Livestock, regional consumer products",
      status: "optimal"
    }
  ];

  return (
    <div id="trade-gis-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Interactive GIS SVG Canvas */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm col-span-1 lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Map className="h-4.5 w-4.5 text-sudan-green" />
            {currentLanguage === "ar" ? "نظام الخرائط الجغرافية والمسارات اللوجستية الفيدرالية" : "GIS Geographic Trade & Logistics Corridors"}
          </h4>
          <div className="flex gap-1">
            <button
              onClick={() => setActiveRoute(prev => prev === "route-1" ? "route-2" : "route-1")}
              className="p-1 text-slate-400 hover:text-sudan-green hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* The SVG Geographic Container */}
        <div className="bg-[#FAFBFD] border border-slate-100 rounded-2xl relative p-2 overflow-hidden flex items-center justify-center min-h-[350px] md:min-h-[420px]">
          {/* Compass Rose Accent */}
          <div className="absolute bottom-4 left-4 border border-slate-100 bg-white p-2.5 rounded-full shadow-xs">
            <div className="w-8 h-8 rounded-full border-2 border-sudan-gold/20 flex items-center justify-center font-bold text-[8px] text-sudan-gold tracking-tight select-none font-mono">
              N
            </div>
          </div>

          <svg viewBox="0 0 500 500" className="w-full max-w-[450px] h-auto select-none">
            {/* Outline of Sudan Map (Stylized Abstract Grid Vector) */}
            <path 
              d="M 210,20 L 320,40 L 410,110 L 490,140 L 460,210 L 430,280 L 390,380 L 340,440 L 290,480 L 210,470 L 150,450 L 110,420 L 70,390 L 50,330 L 70,250 L 120,180 L 160,110 L 170,40 Z" 
              fill="#EBF2EE" 
              stroke="#A8D5BA" 
              strokeWidth="1.5" 
              strokeDasharray="4 2"
              className="transition-all duration-300"
            />

            {/* Simulated Maritime Red Sea Route Line */}
            <path
              d="M 410,110 C 440,70, 470,50, 495,10"
              fill="none"
              stroke="#C5A059"
              strokeWidth="2.5"
              strokeDasharray="5, 4"
              className="animate-[dash_20s_linear_infinite]"
            />

            {/* active route animation paths */}
            {activeRoute === "route-1" ? (
              // Route 1: El Obeid -> Khartoum -> Port Sudan (The main export corridor)
              <>
                <path
                  d="M 140,350 L 230,270 L 410,110"
                  fill="none"
                  stroke="#007A33"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="opacity-70"
                />
                <path
                  d="M 140,350 L 230,270 L 410,110"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeDasharray="10 15"
                  strokeLinecap="round"
                  className="animate-[dash_4s_linear_infinite]"
                />
              </>
            ) : (
              // Route 2: Gallabat Border -> Wad Madani -> Khartoum -> Soba
              <>
                <path
                  d="M 350,360 L 250,290"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-70"
                />
                <path
                  d="M 350,360 L 250,290"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="8 10"
                  strokeLinecap="round"
                  className="animate-[dash_3s_linear_infinite]"
                />
              </>
            )}

            {/* Node coordinates & render circles */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(node)}
                >
                  {/* Glowing Pulse Rings */}
                  <circle 
                    r={isSelected ? 16 : 8} 
                    fill={node.status === "warning" ? "rgba(245, 158, 11, 0.2)" : "rgba(0, 122, 51, 0.15)"}
                    className="animate-ping"
                  />
                  <circle 
                    r={isSelected ? 10 : 5} 
                    fill={node.status === "warning" ? "#F59E0B" : "#007A33"}
                    className="transition-all duration-300 shadow-sm border border-white"
                  />
                  {/* Small Label below node in SVG */}
                  <text 
                    y="-12" 
                    textAnchor="middle" 
                    fill="#1E293B" 
                    fontSize="7.5" 
                    fontWeight="800"
                    className="bg-white/80 px-1 font-sans"
                  >
                    {currentLanguage === "ar" ? node.nameAr.split(" ")[1] || node.nameAr.slice(0, 7) : node.nameEn.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Route legend details */}
        <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-sudan-green rounded-full"></span>
            <span>{currentLanguage === "ar" ? "مسار التصدير الاستراتيجي (كردفان - ميناء الصادر)" : "Strategic Export Corridor (Kordofan - Port Sudan)"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-sky-500 rounded-full"></span>
            <span>{currentLanguage === "ar" ? "مسار الربط الإقليمي للكوميسا (القلابات - الخرطوم)" : "COMESA Regional Link (Gallabat - Khartoum)"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span>
            <span>{currentLanguage === "ar" ? "معابر حدودية تحت الرقابة والمطابقة" : "Border Boundary Compliance Control"}</span>
          </div>
        </div>
      </div>

      {/* Selected Node Status Details Dashboard */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
        {selectedNode ? (
          <div className="space-y-4 flex-1">
            <div className="flex items-start justify-between">
              <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                selectedNode.type === "port" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                selectedNode.type === "airport" ? "bg-indigo-100 text-indigo-800 border-indigo-200" :
                selectedNode.type === "border" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-cyan-100 text-cyan-800 border-cyan-200"
              }`}>
                {selectedNode.type === "port" ? (currentLanguage === "ar" ? "منفذ بحري سيادي" : "Maritime Sea Port") :
                 selectedNode.type === "airport" ? (currentLanguage === "ar" ? "مطار شحن دولي" : "Cargo Air Port") :
                 selectedNode.type === "border" ? (currentLanguage === "ar" ? "معبر بري اتحادي" : "Land Border Post") : (currentLanguage === "ar" ? "مركز تجميع لوجستي" : "Inland Hub")}
              </span>
              
              <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                selectedNode.status === "optimal" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100 animate-pulse"
              }`}>
                {selectedNode.status === "optimal" ? (currentLanguage === "ar" ? "نشط - معدل مثالي" : "Optimal Active") : (currentLanguage === "ar" ? "تأخير مستندات طفيف" : "Delayed Checks")}
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-[#1E293B] text-base leading-snug">
                {currentLanguage === "ar" ? selectedNode.nameAr : selectedNode.nameEn}
              </h4>
              <p className="text-[10px] text-gray-400 mt-1 font-semibold font-mono">ID: {selectedNode.id.toUpperCase()}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 uppercase font-black block tracking-wider">
                  {currentLanguage === "ar" ? "الطاقة الاستيعابية / الممر التشغيلي" : "Operational Capacity / Throughput"}
                </span>
                <p className="font-extrabold text-slate-700">{selectedNode.capacity}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 uppercase font-black block tracking-wider">
                  {currentLanguage === "ar" ? "متوسط زمن المطابقة الجمركية" : "Average Customs Match Time"}
                </span>
                <p className="font-mono font-bold text-sudan-green">
                  {currentLanguage === "ar" ? selectedNode.delayAr : selectedNode.delayEn}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 uppercase font-black block tracking-wider">
                  {currentLanguage === "ar" ? "السلع والمواد الأكثر نشاطاً" : "Core Handled Materials"}
                </span>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {currentLanguage === "ar" ? selectedNode.cargoAr : selectedNode.cargoEn}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-12">
            <Info className="h-8 w-8 text-slate-300" />
            <p className="text-slate-500 text-xs">
              {currentLanguage === "ar" ? "اختر نقطة على الخريطة لعرض مؤشرات أدائها بالتفصيل" : "Select a node on the GIS map to view localized telemetry."}
            </p>
          </div>
        )}

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-sudan-green shrink-0 mt-0.5" />
          <p>
            {currentLanguage === "ar" 
              ? "مؤشرات المنافذ والجمارك الفيدرالية متصلة تلقائياً بنظام الربط الحكومي الموحد 2035."
              : "Federal custom metrics and border logs are dynamically feeding into the sovereign interoperability cluster."}
          </p>
        </div>
      </div>
    </div>
  );
}
