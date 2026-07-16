/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Truck, Compass, Anchor, ShieldCheck, Play, Check, Layers, Clock, Settings, RefreshCw } from "lucide-react";
import { ShipmentRecord } from "./TradeTypes";
import { initialShipments } from "./TradeMockData";

interface TradeLogisticsProps {
  currentLanguage: "ar" | "en";
}

export default function TradeLogistics({ currentLanguage }: TradeLogisticsProps) {
  const [shipments, setShipments] = useState<ShipmentRecord[]>(initialShipments);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentRecord | null>(initialShipments[0]);

  // Milestone mapping
  const milestones = [
    { key: "origin", labelAr: "المزود / المزرعة", labelEn: "Supplier Origin" },
    { key: "processing", labelAr: "التصنيع والتعبئة", labelEn: "Manufacturer Packing" },
    { key: "storage", labelAr: "المستودع الجاف", labelEn: "Warehouse Storage" },
    { key: "customs", labelAr: "الجمارك والتدقيق", labelEn: "Customs Clearance" },
    { key: "shipping", labelAr: "الشحن والترانزيت", labelEn: "Maritime Shipping" },
    { key: "delivered", labelAr: "الاستلام والوصول", labelEn: "Port Delivery" }
  ];

  // Helper to find index of current shipment step
  const getStepIndex = (status: ShipmentRecord["status"]) => {
    return milestones.findIndex(m => m.key === status);
  };

  return (
    <div id="logistics-and-supply-chain-panel" className="space-y-6">
      {/* Top statistics banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { labelAr: "شحنات نشطة تحت التتبع", labelEn: "Active Shipments", value: "٤٢ شحنة", sub: "100% Digital Logs" },
          { labelAr: "معدل الترانزيت البري", labelEn: "Avg Land Transit", value: "٤٨ ساعة", sub: "optimal route" },
          { labelAr: "الكفاءة اللوجستية العامة", labelEn: "Overall Logistics Efficiency", value: "٩٢.٤%", sub: "Sovereign Target" },
          { labelAr: "الممرات الاستراتيجية النشطة", labelEn: "Active Strategic Corridors", value: "٥ ممرات", sub: "Red Sea connected" }
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              {currentLanguage === "ar" ? stat.labelAr : stat.labelEn}
            </span>
            <div className="flex justify-between items-baseline">
              <span className="text-lg md:text-xl font-black text-sudan-green font-mono">{stat.value}</span>
              <span className="text-[9px] text-gray-400 font-semibold uppercase">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main split dashboard (Cargo List + Stepper Tracker) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Shipment Tracker List */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 col-span-1 lg:col-span-1">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="h-4.5 w-4.5 text-sudan-green" />
            {currentLanguage === "ar" ? "قائمة الشحنات الاستراتيجية النشطة" : "Active Strategic Cargo Ledger"}
          </h4>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {shipments.map((ship) => {
              const isSelected = selectedShipment?.id === ship.id;
              return (
                <div
                  key={ship.id}
                  onClick={() => setSelectedShipment(ship)}
                  className={`p-4 rounded-2xl text-xs cursor-pointer border transition-all duration-300 space-y-2 ${
                    isSelected ? "bg-sudan-green/5 border-sudan-green" : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-black text-slate-800">{ship.trackingId}</span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      ship.status === "delivered" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800 animate-pulse"
                    }`}>
                      {ship.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <p className="font-extrabold text-slate-700 truncate">{ship.cargoDescription}</p>
                    <p className="text-[10px] text-gray-400 font-semibold truncate">{ship.traderName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Horizontal Cargo Flow Node Stepper */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm col-span-1 lg:col-span-2 flex flex-col justify-between space-y-6">
          {selectedShipment ? (
            <div className="space-y-6 flex-1">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] bg-sudan-green/10 text-sudan-green border border-sudan-green/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                    {currentLanguage === "ar" ? "تتبع فدرالي حي" : "FEDERAL ACTIVE TELEMETRY"}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedShipment.cargoDescription}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold">{selectedShipment.traderName}</p>
                </div>
                <div className="text-left font-mono text-[10px] font-bold text-gray-400">
                  <span>TRACKING ID: </span>
                  <span className="text-slate-800">{selectedShipment.trackingId}</span>
                </div>
              </div>

              {/* Horizontal Stepper Diagram representing Supply Chain Node Stepper */}
              <div className="pt-2">
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider pb-4">
                  {currentLanguage === "ar" ? "المراحل التشغيلية للشحنة (شامل من المزرعة للميناء)" : "Cargo Milestones (Farm-To-Port Integrated)"}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center">
                  {milestones.map((milestone, idx) => {
                    const stepIdx = getStepIndex(selectedShipment.status);
                    const isCompleted = idx < stepIdx;
                    const isActive = idx === stepIdx;

                    return (
                      <div key={idx} className={`p-3 rounded-2xl border text-xs flex flex-col items-center justify-between min-h-[90px] transition-all ${
                        isCompleted ? "bg-emerald-50 border-emerald-100 text-emerald-800" :
                        isActive ? "bg-sudan-green/5 border-sudan-green text-sudan-green font-extrabold ring-4 ring-sudan-green/5 animate-[pulse_2s_infinite]" :
                        "bg-slate-50 border-slate-100 text-slate-400"
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isCompleted ? "bg-emerald-600 text-white" :
                          isActive ? "bg-sudan-green text-white" : "bg-slate-200 text-slate-500"
                        }`}>
                          {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                        </div>
                        <span className="text-[10px] font-extrabold leading-tight mt-2 block">
                          {currentLanguage === "ar" ? milestone.labelAr : milestone.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Telemetry details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs">
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{currentLanguage === "ar" ? "الموقع الحالي للشحنة" : "CURRENT LOGISTICS COORDINATES"}</span>
                    <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? selectedShipment.currentNodeAr : selectedShipment.currentNodeEn}</p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{currentLanguage === "ar" ? "المسار اللوجستي المعتمد" : "APPROVED TRANSIT CORRIDOR"}</span>
                    <p className="font-bold text-slate-600">{currentLanguage === "ar" ? selectedShipment.routeAr : selectedShipment.routeEn}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{currentLanguage === "ar" ? "الوزن الصافي" : "NET WEIGHT"}</span>
                      <p className="font-mono font-bold text-slate-800">{selectedShipment.weightNet.toLocaleString()} KG</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{currentLanguage === "ar" ? "الوزن الإجمالي" : "GROSS WEIGHT"}</span>
                      <p className="font-mono font-bold text-slate-800">{selectedShipment.weightGross.toLocaleString()} KG</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{currentLanguage === "ar" ? "الوصول المتوقع" : "ESTIMATED ETA"}</span>
                      <p className="font-mono font-bold text-sudan-green">{selectedShipment.eta}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{currentLanguage === "ar" ? "مؤشر كفاءة الشحن" : "CORRIDOR EFFICIENCY"}</span>
                      <p className="font-mono font-bold text-sudan-gold">{selectedShipment.efficiencyScore}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-16">
              <Truck className="h-10 w-10 text-slate-300" />
              <p className="text-slate-500 text-xs">
                {currentLanguage === "ar" ? "اختر شحنة لعرض مسار تتبعها بالتفصيل" : "Select a strategic shipment to construct supply chain milestone stepper."}
              </p>
            </div>
          )}

          {/* Sovereign compliance indicator */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-sudan-green shrink-0" />
            <p>
              {currentLanguage === "ar" 
                ? "تتبع الحاويات واللوجستيات متكامل بالكامل مع الأقمار الصناعية لضمان النزاهة الجمركية بنسبة ١٠٠%."
                : "Transit monitoring integrates directly with federal geospatial channels to secure customs integrity across all trade ports."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
