/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Award, Plus, Search, Scale, FileText, ChevronRight, ChevronDown, 
  Sparkles, CheckCircle2, ShieldCheck, HelpCircle, AlertTriangle, ArrowRightLeft, BookOpen, Clock 
} from "lucide-react";
import { IpRecord, IpType, IpLifecycleStatus, InnovationUserRole } from "./InnovationTypes";

interface IntellectualPropertyProps {
  currentLanguage: "ar" | "en";
  ipRecords: IpRecord[];
  onAddIpRecord: (newIp: IpRecord) => void;
  onUpdateIpStatus: (id: string, nextStatus: IpLifecycleStatus, log: any) => void;
  onAddOpposition: (id: string, opposition: any) => void;
  onAddLicensing: (id: string, license: any) => void;
  userRole: InnovationUserRole;
}

export default function IntellectualProperty({
  currentLanguage,
  ipRecords,
  onAddIpRecord,
  onUpdateIpStatus,
  onAddOpposition,
  onAddLicensing,
  userRole
}: IntellectualPropertyProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIpType, setSelectedIpType] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form states
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [type, setType] = useState<IpType>("patent");
  const [ownerName, setOwnerName] = useState("");
  const [inventorsInput, setInventorsInput] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [claimsArInput, setClaimsArInput] = useState("");
  const [claimsEnInput, setClaimsEnInput] = useState("");

  // Opposition state
  const [opposerName, setOpposerName] = useState("");
  const [oppReasonAr, setOppReasonAr] = useState("");
  const [oppReasonEn, setOppReasonEn] = useState("");
  const [activeOppId, setActiveOppId] = useState<string | null>(null);

  // Licensing state
  const [licenseeName, setLicenseeName] = useState("");
  const [licTermsAr, setLicTermsAr] = useState("");
  const [licTermsEn, setLicTermsEn] = useState("");
  const [licFee, setLicFee] = useState<number>(0);
  const [activeLicId, setActiveLicId] = useState<string | null>(null);

  // Status transitions state
  const [statusNote, setStatusNote] = useState("");

  const ipTypesList: { value: IpType; ar: string; en: string }[] = [
    { value: "patent", ar: "براءة اختراع", en: "Patent" },
    { value: "utility_model", ar: "نموذج منفعة", en: "Utility Model" },
    { value: "industrial_design", ar: "تصميم صناعي", en: "Industrial Design" },
    { value: "trademark", ar: "علامة تجارية", en: "Trademark" },
    { value: "copyright", ar: "حقوق مؤلف وملكية فنية", en: "Copyright" },
    { value: "trade_secret", ar: "سر تجاري محمي", en: "Trade Secret" },
    { value: "geographical_indication", ar: "مؤشر جغرافي سيادي", en: "Geographical Indication" }
  ];

  // The lifecycle stage sequence
  const lifecycleStages: { value: IpLifecycleStatus; ar: string; en: string }[] = [
    { value: "submission", ar: "الإيداع والتقديم", en: "Submission" },
    { value: "technical_examination", ar: "الفحص الفني والجدة", en: "Tech Exam" },
    { value: "legal_review", ar: "التدقيق القانوني والملاءمة", en: "Legal Review" },
    { value: "publication", ar: "النشر والإشهار", en: "Publication" },
    { value: "opposition", ar: "الاعتراضات والمنازعات", en: "Opposition window" },
    { value: "registered", ar: "مسجل ومحمي سيادياً", en: "Registered" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !titleEn || !ownerName) return;

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const prefix = type === "patent" ? "PAT" : type === "trademark" ? "TM" : "IP";
    
    const newIp: IpRecord = {
      id: `ip-${Date.now()}`,
      ipNumber: `SD-${prefix}-2026-${randomId}`,
      titleAr,
      titleEn,
      type,
      ownerId: `rec-${Math.floor(100 + Math.random() * 900)}`,
      ownerName,
      inventors: inventorsInput ? inventorsInput.split(",").map(i => i.trim()) : [ownerName],
      status: "submission",
      submissionDate: new Date().toISOString().split("T")[0],
      descriptionAr,
      descriptionEn,
      claimsAr: claimsArInput ? claimsArInput.split("\n").map(c => c.trim()).filter(Boolean) : [],
      claimsEn: claimsEnInput ? claimsEnInput.split("\n").map(c => c.trim()).filter(Boolean) : [],
      oppositionRecords: [],
      licensingAgreements: [],
      auditLogs: [
        {
          status: "submission",
          actionAr: "إيداع ملف الملكية الفكرية وشهادات الفحص الأولي",
          actionEn: "IP file deposited with initial credential declarations",
          timestamp: new Date().toISOString(),
          actor: ownerName,
          notes: "الملف كامل ومستوفي للرسوم الإدارية الفيدرالية."
        }
      ]
    };

    onAddIpRecord(newIp);
    setIsFormOpen(false);

    // Reset Form
    setTitleAr("");
    setTitleEn("");
    setOwnerName("");
    setInventorsInput("");
    setDescriptionAr("");
    setDescriptionEn("");
    setClaimsArInput("");
    setClaimsEnInput("");
  };

  const handleOppositionSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!opposerName || !oppReasonAr) return;

    const newOpp = {
      opposerName,
      reasonAr: oppReasonAr,
      reasonEn: oppReasonEn || oppReasonAr,
      date: new Date().toISOString().split("T")[0],
      status: "pending" as const
    };

    onAddOpposition(id, newOpp);
    setActiveOppId(null);
    setOpposerName("");
    setOppReasonAr("");
    setOppReasonEn("");
  };

  const handleLicensingSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!licenseeName || !licTermsAr) return;

    const newLic = {
      licensee: licenseeName,
      termsAr: licTermsAr,
      termsEn: licTermsEn || licTermsAr,
      fee: Number(licFee) || 0,
      date: new Date().toISOString().split("T")[0]
    };

    onAddLicensing(id, newLic);
    setActiveLicId(null);
    setLicenseeName("");
    setLicTermsAr("");
    setLicTermsEn("");
    setLicFee(0);
  };

  const handleAdvanceStatus = (id: string, currentStatus: IpLifecycleStatus) => {
    const currentIndex = lifecycleStages.findIndex(s => s.value === currentStatus);
    if (currentIndex === -1 || currentIndex === lifecycleStages.length - 1) return;

    const nextStatus = lifecycleStages[currentIndex + 1].value;
    const actor = userRole.toUpperCase();
    const timestamp = new Date().toISOString();

    const log = {
      status: nextStatus,
      actionAr: `تمت ترقية الملف إلى مرحلة: ${lifecycleStages[currentIndex + 1].ar}`,
      actionEn: `Advanced file to: ${lifecycleStages[currentIndex + 1].en}`,
      timestamp,
      actor,
      notes: statusNote || undefined
    };

    onUpdateIpStatus(id, nextStatus, log);
    setStatusNote("");
  };

  const filteredIps = ipRecords.filter((ip) => {
    const matchesSearch = 
      ip.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ip.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ip.ipNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ip.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedIpType === "all" || ip.type === selectedIpType;
    return matchesSearch && matchesType;
  });

  // Role permissions
  const isExaminer = [
    InnovationUserRole.SUPER_ADMIN,
    InnovationUserRole.SUPER_ADMIN as string,
    InnovationUserRole.MINISTER,
    InnovationUserRole.PATENT_EXAMINER,
    InnovationUserRole.TRADEMARK_EXAMINER,
    InnovationUserRole.LEGAL_ADVISOR,
    InnovationUserRole.DEPARTMENT_MANAGER
  ].includes(userRole);

  return (
    <div className="space-y-6">
      
      {/* Upper Banner */}
      <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-[#1E293B] text-base md:text-lg">
            {currentLanguage === "ar" ? "منصة حوكمة وتسجيل براءات الاختراع والملكية الفكرية" : "Intellectual Property & National Patent Registry Platform"}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {currentLanguage === "ar" 
              ? "إدارة متكاملة لدورة حياة الاختراعات والمؤشرات الجغرافية ومطابقة القوانين الفيدرالية."
              : "Integrated lifecycle workflow for filings, geographical indications, and sovereign regulatory compliance."}
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>{currentLanguage === "ar" ? "تسجيل وإيداع براءة / علامة جديدة" : "File New IP / Patent application"}</span>
        </button>
      </div>

      {/* Dynamic filing Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Award className="h-5 w-5 text-sudan-gold" />
            <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">
              {currentLanguage === "ar" ? "نموذج تقديم طلب براءة اختراع / علامة تجارية فيدرالية" : "Sovereign Patent / IP Registration Form"}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Title Ar */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "عنوان المصنف / براءة الاختراع المبتكرة (بالعربية) *" : "IP / Patent Title (Arabic) *"}
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "نظام ميكانيكي هجين لمعالجة المحاصيل..." : "e.g. Hybrid Crops Compactor..."}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Title En */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "عنوان المصنف / براءة الاختراع المبتكرة (بالإنجليزية) *" : "IP / Patent Title (English) *"}
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Hybrid Crops Compactor..."
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Type selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "نوع الملكية الفكرية وتصنيفها *" : "IP Legal Classification *"}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IpType)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              >
                {ipTypesList.map((ip) => (
                  <option key={ip.value} value={ip.value}>
                    {currentLanguage === "ar" ? ip.ar : ip.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Owner name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "اسم المودع / الجهة المالكة سيادياً *" : "Applicant / Legal Sovereign Owner *"}
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder={currentLanguage === "ar" ? "مثال: مجمع جياد التكنولوجي" : "e.g. Giad Tech Group"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Inventors list */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "أسماء المخترعين والمبتكرين الفعليين (مفصولة بفاصلة) *" : "Inventors / Designers (comma separated) *"}
              </label>
              <input
                type="text"
                required
                value={inventorsInput}
                onChange={(e) => setInventorsInput(e.target.value)}
                placeholder={currentLanguage === "ar" ? "أ.د. عثمان الصافي، م. معتز الفاضل" : "e.g. Prof. Osman, Eng. Moataz"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Description Ar */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "الوصف التفصيلي والملخص التقني (بالعربية) *" : "Detailed Technical Description (Arabic) *"}
              </label>
              <textarea
                required
                rows={3}
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Description En */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "الوصف التفصيلي والملخص التقني (بالإنجليزية)" : "Detailed Technical Description (English)"}
              </label>
              <textarea
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Claims Ar */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "عناصر الحماية وبنود براءة الاختراع (بالعربية - كل بند في سطر)" : "Patent Claims / Scope (Arabic - line by line)"}
              </label>
              <textarea
                rows={2}
                value={claimsArInput}
                onChange={(e) => setClaimsArInput(e.target.value)}
                placeholder="1. آلية التشغيل الهجين للمكبس الفولاذي..."
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Claims En */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "عناصر الحماية وبنود براءة الاختراع (بالإنجليزية - كل بند في سطر)" : "Patent Claims / Scope (English - line by line)"}
              </label>
              <textarea
                rows={2}
                value={claimsEnInput}
                onChange={(e) => setClaimsEnInput(e.target.value)}
                placeholder="1. Mechanical hybrid linkage of compactors..."
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#1E293B] text-xs font-bold rounded-xl cursor-pointer"
            >
              {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              {currentLanguage === "ar" ? "إيداع طلب التسجيل" : "Submit & Log Application"}
            </button>
          </div>
        </form>
      )}

      {/* Filter / Search bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={currentLanguage === "ar" ? "بحث عن براءات، علامات، مؤشرات..." : "Search by code, title, owner..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs pl-8 pr-3.5 py-2 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <select
          value={selectedIpType}
          onChange={(e) => setSelectedIpType(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all cursor-pointer"
        >
          <option value="all">{currentLanguage === "ar" ? "كل تصنيفات الملكية الفكرية" : "All IP Classifications"}</option>
          {ipTypesList.map((ip) => (
            <option key={ip.value} value={ip.value}>
              {currentLanguage === "ar" ? ip.ar : ip.en}
            </option>
          ))}
        </select>
      </div>

      {/* List IP files */}
      <div className="space-y-4">
        {filteredIps.length > 0 ? (
          filteredIps.map((ip) => {
            const isExpanded = expandedId === ip.id;
            const currentStageIndex = lifecycleStages.findIndex(s => s.value === ip.status);
            const isRegistered = ip.status === "registered" || ip.status === "renewed" || ip.status === "licensed";

            return (
              <div 
                key={ip.id}
                className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4"
              >
                
                {/* Title & metadata bar */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 font-mono">
                        {ip.ipNumber}
                      </span>
                      <span className="bg-sudan-green/5 text-sudan-green text-[10px] font-bold px-2 py-0.5 rounded border border-sudan-green/20">
                        {ipTypesList.find(t => t.value === ip.type)?.ar || ip.type}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base leading-snug">
                      {currentLanguage === "ar" ? ip.titleAr : ip.titleEn}
                    </h4>

                    <div className="text-[10px] text-slate-500 font-semibold space-x-2">
                      <span className="text-sudan-green font-bold">{ip.ownerName}</span>
                      <span>|</span>
                      <span>{currentLanguage === "ar" ? `تاريخ الإيداع: ${ip.submissionDate}` : `Submission date: ${ip.submissionDate}`}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ip.id)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                  >
                    <span>{isExpanded ? (currentLanguage === "ar" ? "إخفاء التفاصيل" : "Hide Details") : (currentLanguage === "ar" ? "عرض الخريطة وتفاصيل الملف" : "View Stages & Details")}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {/* VISUAL ROADMAP STEPS (Active Progress) */}
                <div className="grid grid-cols-6 gap-1 md:gap-2 text-center pt-2">
                  {lifecycleStages.map((stage, idx) => {
                    const isPassed = currentStageIndex >= idx;
                    const isActive = currentStageIndex === idx;

                    return (
                      <div key={stage.value} className="space-y-1">
                        <div className={`h-1.5 rounded-full ${
                          isActive 
                            ? "bg-sudan-gold" 
                            : isPassed 
                            ? "bg-sudan-green" 
                            : "bg-slate-100"
                        }`} />
                        <span className={`block text-[8px] md:text-[9px] font-bold truncate ${
                          isActive 
                            ? "text-sudan-gold font-extrabold" 
                            : isPassed 
                            ? "text-sudan-green" 
                            : "text-slate-400"
                        }`}>
                          {currentLanguage === "ar" ? stage.ar : stage.en}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Expanded Sections */}
                {isExpanded && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4 text-xs">
                    
                    {/* Description & Claims */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      
                      {/* Left: Summary and Claims */}
                      <div className="md:col-span-8 space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                            {currentLanguage === "ar" ? "الملخص الفني المعتمد" : "Technical Specification Summary"}
                          </span>
                          <p className="text-[#1E293B] font-bold leading-relaxed">
                            {currentLanguage === "ar" ? ip.descriptionAr : ip.descriptionEn}
                          </p>
                        </div>

                        {ip.claimsAr && ip.claimsAr.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t border-slate-200">
                            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                              {currentLanguage === "ar" ? "عناصر وبنود الحماية المودعة" : "Filed Patent Claims"}
                            </span>
                            <ul className="space-y-1 list-none text-[11px] font-bold text-slate-700">
                              {(currentLanguage === "ar" ? ip.claimsAr : ip.claimsEn || ip.claimsAr).map((claim, idx) => (
                                <li key={idx} className="bg-white border border-slate-150 p-2 rounded-lg">
                                  {claim}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Right: Inventors & Operations Audit */}
                      <div className="md:col-span-4 space-y-3 border-r border-slate-200 pr-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                            {currentLanguage === "ar" ? "الفريق الابتكاري / المخترعون" : "Inventors Array"}
                          </span>
                          <p className="font-extrabold text-[#1E293B]">{ip.inventors.join(", ")}</p>
                        </div>

                        {/* Audit Trail Logs */}
                        <div className="space-y-1.5 border-t border-slate-200 pt-2">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{currentLanguage === "ar" ? "مسار تدقيق الملكية الفكرية الموحد" : "Immutable IP Audit Ledger"}</span>
                          </span>
                          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                            {ip.auditLogs.map((log, idx) => (
                              <div key={idx} className="bg-white p-2 rounded border border-slate-150 text-[10px] space-y-0.5">
                                <div className="flex justify-between font-bold text-slate-600">
                                  <span className="text-sudan-green">{log.actor}</span>
                                  <span className="font-mono">{log.timestamp.split("T")[0]}</span>
                                </div>
                                <p className="font-extrabold text-[#1E293B]">
                                  {currentLanguage === "ar" ? log.actionAr : log.actionEn}
                                </p>
                                {log.notes && (
                                  <p className="text-slate-400 font-medium italic">"{log.notes}"</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Actions Panel (Admins/Examiners can advance, Citizens can dispute) */}
                    <div className="border-t border-slate-200 pt-3 flex flex-wrap gap-2 justify-between items-center">
                      
                      {/* State Advancement (For Officials) */}
                      {isExaminer && currentStageIndex < lifecycleStages.length - 1 ? (
                        <div className="bg-slate-900 text-[#FFD700] rounded-xl p-3 border border-slate-850 w-full md:w-auto flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-[#FFD700]/70 uppercase tracking-wider block">
                            {currentLanguage === "ar" ? "بوابة الفحص والترقية السيادية" : "Sovereign Examination & Clearance Portal"}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={statusNote}
                              onChange={(e) => setStatusNote(e.target.value)}
                              placeholder={currentLanguage === "ar" ? "ملاحظة ومستند الفحص الفيدرالي..." : "Audit remarks..."}
                              className="bg-slate-800 border border-slate-700 text-white text-[10px] px-3 py-1.5 rounded-lg outline-none"
                            />
                            <button
                              onClick={() => handleAdvanceStatus(ip.id, ip.status)}
                              className="bg-sudan-gold text-slate-900 font-extrabold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-yellow-400"
                            >
                              <span>{currentLanguage === "ar" ? "اعتماد وترقية المرحلة" : "Advance Stage"}</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Oppositions and Licensing agreements lists & triggers */}
                      <div className="flex flex-wrap gap-2">
                        
                        {/* Oppositions list / File Opposition */}
                        <div className="space-y-1 border border-slate-200 bg-white p-3 rounded-xl min-w-[200px]">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-bold block">
                              {currentLanguage === "ar" ? "الاعتراضات والمنازعات" : "Objection Filings"}
                            </span>
                            <button
                              onClick={() => setActiveOppId(activeOppId === ip.id ? null : ip.id)}
                              className="text-rose-600 hover:text-rose-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>{currentLanguage === "ar" ? "+ تسجيل اعتراض" : "+ Dispute"}</span>
                            </button>
                          </div>
                          
                          {/* List existing */}
                          {ip.oppositionRecords && ip.oppositionRecords.length > 0 ? (
                            <div className="space-y-1">
                              {ip.oppositionRecords.map((opp, idx) => (
                                <div key={idx} className="bg-rose-50/50 border border-rose-100 p-1.5 rounded text-[9px] font-bold">
                                  <div className="flex justify-between text-rose-800">
                                    <span>{opp.opposerName}</span>
                                    <span>{opp.date}</span>
                                  </div>
                                  <p className="text-[#1E293B] font-extrabold">{currentLanguage === "ar" ? opp.reasonAr : opp.reasonEn}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-medium italic block">
                              {currentLanguage === "ar" ? "لا توجد اعتراضات مسجلة." : "Zero disputes lodged."}
                            </span>
                          )}

                          {activeOppId === ip.id && (
                            <form onSubmit={(e) => handleOppositionSubmit(e, ip.id)} className="pt-2 border-t border-slate-100 space-y-2">
                              <input
                                type="text"
                                required
                                placeholder={currentLanguage === "ar" ? "اسم مقدم الاعتراض..." : "Opposer entity..."}
                                value={opposerName}
                                onChange={(e) => setOpposerName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-250 text-[10px] px-2 py-1 rounded outline-none"
                              />
                              <textarea
                                required
                                rows={2}
                                placeholder={currentLanguage === "ar" ? "سبب الاعتراض القانوني..." : "Legal reason..."}
                                value={oppReasonAr}
                                onChange={(e) => setOppReasonAr(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-250 text-[10px] px-2 py-1 rounded outline-none"
                              />
                              <button
                                type="submit"
                                className="bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold px-2.5 py-1 rounded block w-full text-center cursor-pointer"
                              >
                                {currentLanguage === "ar" ? "إرسال الاعتراض" : "Submit Dispute"}
                              </button>
                            </form>
                          )}
                        </div>

                        {/* Licensing Agreements */}
                        <div className="space-y-1 border border-slate-200 bg-white p-3 rounded-xl min-w-[200px]">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-bold block">
                              {currentLanguage === "ar" ? "اتفاقيات ترخيص الاستغلال" : "Commercial Licenses"}
                            </span>
                            {isRegistered && (
                              <button
                                onClick={() => setActiveLicId(activeLicId === ip.id ? null : ip.id)}
                                className="text-emerald-600 hover:text-emerald-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <span>{currentLanguage === "ar" ? "+ عقد استغلال" : "+ License"}</span>
                              </button>
                            )}
                          </div>
                          
                          {/* List existing */}
                          {ip.licensingAgreements && ip.licensingAgreements.length > 0 ? (
                            <div className="space-y-1">
                              {ip.licensingAgreements.map((lic, idx) => (
                                <div key={idx} className="bg-emerald-50/50 border border-emerald-100 p-1.5 rounded text-[9px] font-bold">
                                  <div className="flex justify-between text-emerald-800">
                                    <span>{lic.licensee}</span>
                                    <span>{lic.fee.toLocaleString()} SDG</span>
                                  </div>
                                  <p className="text-[#1E293B] font-extrabold">{currentLanguage === "ar" ? lic.termsAr : lic.termsEn}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-medium italic block">
                              {currentLanguage === "ar" ? "لم يتم صياغة عقود ترخيص." : "Zero commercial licenses."}
                            </span>
                          )}

                          {activeLicId === ip.id && (
                            <form onSubmit={(e) => handleLicensingSubmit(e, ip.id)} className="pt-2 border-t border-slate-100 space-y-2">
                              <input
                                type="text"
                                required
                                placeholder={currentLanguage === "ar" ? "اسم المرخص له..." : "Licensee entity..."}
                                value={licenseeName}
                                onChange={(e) => setLicenseeName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-250 text-[10px] px-2 py-1 rounded outline-none"
                              />
                              <input
                                type="number"
                                required
                                placeholder={currentLanguage === "ar" ? "مبلغ الترخيص (SDG)..." : "Licensing fee..."}
                                value={licFee || ""}
                                onChange={(e) => setLicFee(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-250 text-[10px] px-2 py-1 rounded outline-none"
                              />
                              <textarea
                                required
                                rows={2}
                                placeholder={currentLanguage === "ar" ? "شروط العقد..." : "Contract clauses..."}
                                value={licTermsAr}
                                onChange={(e) => setLicTermsAr(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-250 text-[10px] px-2 py-1 rounded outline-none"
                              />
                              <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold px-2.5 py-1 rounded block w-full text-center cursor-pointer"
                              >
                                {currentLanguage === "ar" ? "توثيق اتفاق الترخيص" : "Validate License"}
                              </button>
                            </form>
                          )}
                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-200 p-8 rounded-3xl text-center text-slate-400 font-semibold">
            <AlertTriangle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            {currentLanguage === "ar" ? "لا توجد سجلات ملكية فكرية مطابقة لمعايير البحث" : "No IP registers matches search parameters"}
          </div>
        )}
      </div>

    </div>
  );
}
