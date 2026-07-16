/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, Check, Search, Calendar, FileText, CheckSquare, Layers, Clock, ShieldCheck } from "lucide-react";
import { InspectionRecord } from "./TradeTypes";
import { initialInspections, hsCodesDatabase } from "./TradeMockData";

interface TradeComplianceProps {
  currentLanguage: "ar" | "en";
}

export default function TradeCompliance({ currentLanguage }: TradeComplianceProps) {
  // Sanctions Screening state
  const [screenInput, setScreenInput] = useState("");
  const [screenResult, setScreenResult] = useState<any | null>(null);

  // Restricted Goods HS state
  const [hsInput, setHsInput] = useState("");
  const [hsResult, setHsResult] = useState<any | null>(null);

  // Inspections list state
  const [inspections, setInspections] = useState<InspectionRecord[]>(initialInspections);
  const [targetName, setTargetName] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [agency, setAgency] = useState("SSMO");

  const [activeStep, setActiveStep] = useState(4); // default active step in WTO workflow

  const workflowSteps = [
    { labelAr: "التسجيل بالسجل الوطني", labelEn: "Trader Registry" },
    { labelAr: "تقديم مستندات المعاملة", labelEn: "License Submission" },
    { labelAr: "تدقيق المستندات الآلي", labelEn: "Doc Verification" },
    { labelAr: "مطابقة نظام العقوبات والقيود", labelEn: "Sanctions Screening" },
    { labelAr: "تنسيق الفحص الفيدرالي", labelEn: "SSMO Inspection" },
    { labelAr: "بوابة الدفع السيادي", labelEn: "Payment Gateway" },
    { labelAr: "إصدار الشهادة المشفرة", labelEn: "Certificate Issuance" },
    { labelAr: "تتبع مسار الشحن اللوجستي", labelEn: "Cargo Tracking" }
  ];

  const handleScreeningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScreenResult(null);

    const query = screenInput.trim().toLowerCase();
    if (!query) return;

    if (query.includes("sahab") || query.includes("سحاب") || query.includes("restricted")) {
      setScreenResult({
        status: "flagged",
        messageAr: "تحذير: الجهة المسجلة تقع ضمن النطاق المالي المقيد أو المحظور إقليمياً بموجب لوائح الكوميسا.",
        messageEn: "WARNING: Listed entity matches restricted financial profiles under COMESA regional sanctions protocol.",
        entity: "Al-Sahab Logistics Ltd"
      });
    } else {
      setScreenResult({
        status: "cleared",
        messageAr: "تم التدقيق: الجهة مستوفية لكافة الشروط والأحكام وغير مدرجة بأي قوائم حظر سيادية.",
        messageEn: "CLEARED: No active matches found in sovereign or international sanctions databases.",
        entity: screenInput
      });
    }
  };

  const handleHsLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setHsResult(null);

    const query = hsInput.trim();
    if (!query) return;

    const found = hsCodesDatabase.find(
      h => h.code.includes(query) || h.nameAr.toLowerCase().includes(query.toLowerCase()) || h.nameEn.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      setHsResult(found);
    } else {
      setHsResult({
        code: query,
        nameAr: "بند جمركي قياسي عام",
        nameEn: "Standard Custom Goods Class",
        dutyRate: "5%",
        exportIncentive: "0%",
        restricted: false,
        requirementsAr: ["شهادة منشأ جمركية معتمدة", "الفاتورة التجارية"],
        requirementsEn: ["Certified Custom Origin Certificate", "Commercial Invoice"]
      });
    }
  };

  const handleScheduleInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName || !scheduledDate) return;

    const newInsp: InspectionRecord = {
      id: `insp-${Date.now()}`,
      targetId: `tg-${Math.floor(1000 + Math.random() * 9000)}`,
      targetName,
      inspectorName: "مفتش منوب فيدرالي",
      agency,
      scheduledDate,
      status: "pending",
      comments: "تمت جدولة الفحص والمطابقة وسيصل المفتش للموقع بالوقت المحدد."
    };

    setInspections([newInsp, ...inspections]);
    setTargetName("");
    setScheduledDate("");
  };

  return (
    <div id="compliance-and-faciltation-hub" className="space-y-6">
      
      {/* WTO Trade Facilitation Workflow Stepper */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="h-4.5 w-4.5 text-sudan-green" />
          {currentLanguage === "ar" ? "نظام التدقيق ومسار تيسير التجارة العالمية (WTO-Aligned)" : "WTO Trade Facilitation Master Process Tracker"}
        </h4>
        <p className="text-[11px] text-gray-400 max-w-2xl leading-relaxed">
          {currentLanguage === "ar" 
            ? "تتبع دقيق لخطوات المعاملات التجارية الموحدة المتوافقة مع بنود تسهيل التجارة الدولية الصادرة عن منظمة التجارة العالمية."
            : "Monitor and audit end-to-end trade facilitation processes aligned with World Trade Organization (WTO) standard lifecycles."}
        </p>

        {/* Process Stepper Component */}
        <div className="pt-4 overflow-x-auto">
          <div className="flex justify-between items-center min-w-[800px] px-2 relative">
            {/* Background Connector Bar */}
            <div className="absolute top-[18px] left-0 w-full h-1 bg-slate-100 z-0"></div>
            {/* Filled Progress Bar */}
            <div 
              style={{ width: `${(activeStep / (workflowSteps.length - 1)) * 100}%` }}
              className="absolute top-[18px] left-0 h-1 bg-sudan-green z-0 transition-all duration-500"
            ></div>

            {/* Stepper Steps */}
            {workflowSteps.map((step, idx) => {
              const isCompleted = idx < activeStep;
              const isActive = idx === activeStep;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 relative z-10 w-[100px] cursor-pointer" onClick={() => setActiveStep(idx)}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all border shadow-xs ${
                    isCompleted ? "bg-sudan-green border-sudan-green text-white" :
                    isActive ? "bg-white border-sudan-green text-sudan-green ring-4 ring-sudan-green/10" :
                    "bg-white border-slate-200 text-slate-400"
                  }`}>
                    {isCompleted ? <Check className="h-4.5 w-4.5" /> : idx + 1}
                  </div>
                  <span className={`text-[9px] font-extrabold text-center leading-tight transition-colors ${
                    isActive ? "text-sudan-green" : isCompleted ? "text-slate-700" : "text-slate-400"
                  }`}>
                    {currentLanguage === "ar" ? step.labelAr : step.labelEn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Compliance Tools & Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sanctions Screening Tool widget */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="h-4.5 w-4.5 text-sudan-gold" />
            {currentLanguage === "ar" ? "تدقيق نظام العقوبات ومكافحة غسيل الأموال" : "Sanctions & AML Screening Engine"}
          </h4>

          <form onSubmit={handleScreeningSubmit} className="flex gap-2">
            <input
              type="text"
              value={screenInput}
              onChange={(e) => setScreenInput(e.target.value)}
              placeholder={currentLanguage === "ar" ? "اسم الشركة المراد فحصها..." : "Enter company name..."}
              className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green text-slate-800"
            />
            <button type="submit" className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 rounded-xl cursor-pointer">
              {currentLanguage === "ar" ? "فحص" : "Check"}
            </button>
          </form>

          {/* Screening Results Area */}
          {screenResult && (
            <div className={`p-4 rounded-2xl border text-xs space-y-1.5 transition-all ${
              screenResult.status === "flagged" ? "bg-rose-50 border-rose-100 text-rose-800" : "bg-emerald-50 border-emerald-100 text-emerald-800"
            }`}>
              <div className="flex items-center gap-2">
                {screenResult.status === "flagged" ? <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0" /> : <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />}
                <p className="font-extrabold">
                  {screenResult.status === "flagged" ? (currentLanguage === "ar" ? "تحذير أمني مقيد" : "Compliance Restriction Flagged") : (currentLanguage === "ar" ? "موافقة معتمدة" : "Verification Cleared")}
                </p>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Entity: {screenResult.entity}</p>
              <p className="leading-relaxed font-semibold">
                {currentLanguage === "ar" ? screenResult.messageAr : screenResult.messageEn}
              </p>
            </div>
          )}
        </div>

        {/* Restricted Goods HS Code Lookup */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-4.5 w-4.5 text-sudan-green" />
            {currentLanguage === "ar" ? "التحقق من قيود البند الجمركي (HS Code)" : "HS Tariff & Restricted Goods Lookup"}
          </h4>

          <form onSubmit={handleHsLookup} className="flex gap-2">
            <input
              type="text"
              value={hsInput}
              onChange={(e) => setHsInput(e.target.value)}
              placeholder={currentLanguage === "ar" ? "رمز البند الجمركي، مثلاً: 1301.90..." : "e.g. 1301.90.10..."}
              className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green text-slate-800 font-mono font-bold"
            />
            <button type="submit" className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 rounded-xl cursor-pointer">
              {currentLanguage === "ar" ? "تدقيق" : "Verify"}
            </button>
          </form>

          {hsResult && (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-slate-800">{hsResult.code}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  hsResult.restricted ? "bg-rose-100 text-rose-800 border border-rose-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}>
                  {hsResult.restricted ? (currentLanguage === "ar" ? "سلعة مقيدة" : "Restricted") : (currentLanguage === "ar" ? "مسموح عام" : "Standard Allowed")}
                </span>
              </div>

              <div>
                <p className="font-bold text-slate-800">{currentLanguage === "ar" ? hsResult.nameAr : hsResult.nameEn}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] mt-2 font-semibold">
                  <div>
                    <span className="text-gray-400">{currentLanguage === "ar" ? "الرسوم الجمركية" : "Tariff Duty"}: </span>
                    <span className="text-slate-800 font-mono font-bold">{hsResult.dutyRate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">{currentLanguage === "ar" ? "الحافز التصديري" : "Incentive"}: </span>
                    <span className="text-sudan-green font-mono font-bold">{hsResult.exportIncentive}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-[9px] uppercase font-bold text-slate-400">{currentLanguage === "ar" ? "المستندات الإلزامية المطلوبة" : "Mandatory Certificates Required"}:</p>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-[10px] font-semibold text-slate-600">
                  {(currentLanguage === "ar" ? hsResult.requirementsAr : hsResult.requirementsEn).map((req: string, i: number) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Inspections scheduling */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4.5 w-4.5 text-sudan-green" />
            {currentLanguage === "ar" ? "جدولة الفحص والمطابقة (SSMO)" : "SSMO & Veterinary Quarantine Scheduler"}
          </h4>

          <form onSubmit={handleScheduleInspection} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">{currentLanguage === "ar" ? "الشحنة أو رخصة التصدير *" : "Cargo / Permit Name *"}</label>
              <input
                type="text"
                required
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                placeholder="e.g. Gum Arabic Crop white batch"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2 rounded-lg outline-none focus:bg-white focus:border-sudan-green"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">{currentLanguage === "ar" ? "هيئة الفحص" : "Agency"}</label>
                <select value={agency} onChange={(e) => setAgency(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-xs px-2 py-2 rounded-lg outline-none">
                  <option value="SSMO">SSMO (المواصفات)</option>
                  <option value="Quarantine">Quarantine (الحجر البيطري)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">{currentLanguage === "ar" ? "التاريخ المقترح" : "Scheduled Date"}</label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs px-2 py-2 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-2 rounded-xl cursor-pointer">
              {currentLanguage === "ar" ? "جدولة الفحص الميداني" : "Schedule Field Inspection"}
            </button>
          </form>
        </div>
      </div>

      {/* Inspections Scheduled List */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="h-4.5 w-4.5 text-sudan-green" />
          {currentLanguage === "ar" ? "سجل ومعاينة الفحوصات الفيدرالية المجدولة" : "Sovereign Scheduled Field Inspections Logs"}
        </h4>

        <div className="space-y-2.5">
          {inspections.map((insp) => (
            <div key={insp.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">{insp.targetName}</span>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    insp.agency === "SSMO" ? "bg-cyan-100 text-cyan-800 border-cyan-200" : "bg-indigo-100 text-indigo-800 border-indigo-200"
                  }`}>
                    {insp.agency}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-semibold leading-normal">
                  {currentLanguage === "ar" ? `المفتش: ${insp.inspectorName} | ملاحظة: ${insp.comments}` : `Inspector: ${insp.inspectorName} | Notes: ${insp.comments}`}
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-slate-500 font-bold block">{insp.scheduledDate}</span>
                <span className={`text-[9px] font-bold uppercase ${
                  insp.status === "passed" ? "text-emerald-600" : "text-amber-500 animate-pulse"
                }`}>
                  {insp.status === "passed" ? (currentLanguage === "ar" ? "مطابق ومعتمد" : "Passed Approved") : (currentLanguage === "ar" ? "معلق للمعاينة" : "Scheduled Pending")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
