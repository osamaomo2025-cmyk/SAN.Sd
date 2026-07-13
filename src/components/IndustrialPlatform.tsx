/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, Plus, CheckCircle, Clock, ShieldAlert, MapPin, Activity, 
  Layers, Zap, Calendar, Search, X, Check, ShieldCheck 
} from "lucide-react";
import { FactoryRegistration, ApplicationStatus } from "../types";
import { SUDANESE_STATES } from "../data";

interface IndustrialPlatformProps {
  currentLanguage: "ar" | "en";
  factories: FactoryRegistration[];
  onAddFactory: (factoryData: any) => Promise<any>;
  isAdmin: boolean;
  onInspectFactory?: (id: string, inspectionStatus: "passed" | "failed", status: ApplicationStatus) => Promise<any>;
}

export default function IndustrialPlatformModule({
  currentLanguage,
  factories,
  onAddFactory,
  isAdmin,
  onInspectFactory
}: IndustrialPlatformProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  
  // Form state
  const [factoryName, setFactoryName] = useState("");
  const [industrialSector, setIndustrialSector] = useState<"food" | "chemical" | "textile" | "engineering" | "pharmaceutical" | "other">("food");
  const [locationState, setLocationState] = useState(SUDANESE_STATES[0].nameAr);
  const [productionCapacity, setProductionCapacity] = useState("");
  const [energySource, setEnergySource] = useState("");
  const [productionLinesCount, setProductionLinesCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Inspection states
  const [inspectingId, setInspectingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factoryName || !productionCapacity || !energySource) {
      alert(currentLanguage === "ar" ? "يرجى ملء كافة الحقول الأساسية" : "Please fill in all core fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddFactory({
        factoryName,
        industrialSector,
        locationState,
        productionCapacity,
        energySource,
        productionLinesCount: Number(productionLinesCount)
      });
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormOpen(false);
        // Clear Form
        setFactoryName("");
        setProductionCapacity("");
        setEnergySource("");
        setProductionLinesCount(1);
      }, 2000);
    } catch (e) {
      console.error(e);
      alert(currentLanguage === "ar" ? "فشل تقديم طلب التسجيل" : "Failed to submit factory registry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInspectionDecision = async (id: string, decision: "passed" | "failed") => {
    if (onInspectFactory) {
      try {
        const appStatus = decision === "passed" ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED;
        await onInspectFactory(id, decision, appStatus);
        setInspectingId(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const sectors = [
    { value: "food", labelAr: "صناعات غذائية وزراعية", labelEn: "Agro-Food Processing" },
    { value: "chemical", labelAr: "صناعات كيميائية وبلاستيكية", labelEn: "Chemicals & Plastics" },
    { value: "textile", labelAr: "غزل ونسيج وملبوسات", labelEn: "Textiles & Garments" },
    { value: "engineering", labelAr: "صناعات هندسية ومعدنية ثقيلة", labelEn: "Heavy Engineering & Metals" },
    { value: "pharmaceutical", labelAr: "أدوية ومستلزمات طبية", labelEn: "Pharma & MedTech" },
    { value: "other", labelAr: "صناعات وحرف أخرى", labelEn: "Other Industries" }
  ];

  const filteredFactories = factories.filter(f => {
    const matchesSearch = f.factoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.locationState.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = filterSector === "all" || f.industrialSector === filterSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div id="industrial-platform-module" className="space-y-6">
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <Cpu className="h-6 w-6 text-sudan-green animate-pulse" />
            {currentLanguage === "ar" ? "المنصة الصناعية السودانية الموحدة 2035" : "Sudan Unified Industrial Platform 2035"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {currentLanguage === "ar" 
              ? "تسجيل المنشآت والمصانع، متابعة خطوط الإنتاج، وجدولة عمليات التفتيش الفني الآلي" 
              : "Register industrial units, monitor production capacity, and coordinate inspections digitally"}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
        >
          <Plus className="h-4.5 w-4.5" />
          {currentLanguage === "ar" ? "تسجيل مصنع / منشأة صناعية" : "Register Industrial Unit"}
        </button>
      </div>

      {/* Industrial Key metrics - Bento Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-all duration-300">
          <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-700 border border-gray-100">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "إجمالي المصانع" : "Total Factories"}</h5>
            <p className="text-2xl font-black text-[#1A1A1A] mt-1">{factories.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-all duration-300">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "المرخصة بالكامل" : "Licensed Units"}</h5>
            <p className="text-2xl font-black text-[#1A1A1A] mt-1">
              {factories.filter(f => f.status === "approved").length}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-all duration-300">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "خطوط الإنتاج المسجلة" : "Production Lines"}</h5>
            <p className="text-2xl font-black text-[#1A1A1A] mt-1">
              {factories.reduce((sum, f) => sum + f.productionLinesCount, 0)}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-all duration-300">
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "المفتشة بيئياً وفنياً" : "Passed Inspections"}</h5>
            <p className="text-2xl font-black text-[#1A1A1A] mt-1">
              {factories.filter(f => f.inspectionStatus === "passed").length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={currentLanguage === "ar" ? "البحث عن مصنع بالاسم أو الولاية..." : "Search factory by name or state location..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F6F5] border border-gray-200 text-sm pl-4 pr-11 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          />
        </div>
        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className="bg-[#F4F6F5] border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-sudan-green min-w-[150px]"
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        >
          <option value="all">{currentLanguage === "ar" ? "كل القطاعات الصناعية" : "All Sectors"}</option>
          {sectors.map(s => (
            <option key={s.value} value={s.value}>{currentLanguage === "ar" ? s.labelAr : s.labelEn}</option>
          ))}
        </select>
      </div>

      {/* Factories Directory */}
      <div className="space-y-4">
        {filteredFactories.map(fac => {
          const currentSector = sectors.find(s => s.value === fac.industrialSector);
          return (
            <div
              key={fac.id}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6 hover:border-sudan-green hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] bg-sudan-green/10 text-sudan-green font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-sudan-green/20">
                    {currentLanguage === "ar" ? currentSector?.labelAr : currentSector?.labelEn}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    fac.inspectionStatus === "passed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                    fac.inspectionStatus === "failed" ? "bg-rose-100 text-rose-800 border-rose-200" :
                    "bg-amber-100 text-amber-800 border-amber-200"
                  }`}>
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {fac.inspectionStatus === "passed" ? (currentLanguage === "ar" ? "تجاوز التفتيش الفني" : "Inspection Passed") :
                       fac.inspectionStatus === "failed" ? (currentLanguage === "ar" ? "مخالف للمواصفات" : "Inspection Failed") :
                       (currentLanguage === "ar" ? "بانتظار التفتيش" : "Awaiting Inspection")}
                    </span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-extrabold text-[#1A1A1A]">{fac.factoryName}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-sudan-gold" />
                    <span className="font-bold">{fac.locationState}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t border-slate-50 text-xs text-slate-600">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{currentLanguage === "ar" ? "الطاقة الإنتاجية" : "Capacity"}</p>
                    <p className="font-semibold text-slate-800">{fac.productionCapacity}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{currentLanguage === "ar" ? "خطوط التشغيل" : "Production Lines"}</p>
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-sudan-green" />
                      <span>{fac.productionLinesCount}</span>
                    </p>
                  </div>
                  <div className="space-y-0.5 col-span-2 md:col-span-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{currentLanguage === "ar" ? "مصدر الطاقة الأساسي" : "Energy Source"}</p>
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span className="truncate">{fac.energySource}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons (Government Inspector interaction) */}
              <div className="shrink-0 flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                {isAdmin && onInspectFactory && fac.inspectionStatus === "pending" && (
                  <div className="space-y-2 w-full md:w-auto">
                    <p className="text-[10px] text-slate-400 font-bold text-center md:text-right">{currentLanguage === "ar" ? "إجراء تفتيش ميداني" : "Perform Inspection"}</p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleInspectionDecision(fac.id, "passed")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1"
                        title={currentLanguage === "ar" ? "اجتياز التدقيق" : "Pass Inspection"}
                      >
                        <Check className="h-4 w-4" />
                        <span className="md:hidden text-[10px]">{currentLanguage === "ar" ? "موافق" : "Pass"}</span>
                      </button>
                      <button
                        onClick={() => handleInspectionDecision(fac.id, "failed")}
                        className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1"
                        title={currentLanguage === "ar" ? "تسجيل مخالفة فنية" : "Fail Inspection"}
                      >
                        <X className="h-4 w-4" />
                        <span className="md:hidden text-[10px]">{currentLanguage === "ar" ? "مخالفة" : "Fail"}</span>
                      </button>
                    </div>
                  </div>
                )}
                {fac.lastInspectionDate && (
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-sudan-gold" />
                    <span>{currentLanguage === "ar" ? `آخر فحص: ${fac.lastInspectionDate}` : `Last Check: ${fac.lastInspectionDate}`}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filteredFactories.length === 0 && (
          <div className="bg-white text-center py-12 rounded-2xl border border-slate-100 space-y-3">
            <Cpu className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="text-slate-500 text-sm">
              {currentLanguage === "ar" ? "لا توجد منشآت صناعية مسجلة في هذا القسم" : "No industrial facilities registered in this sector"}
            </p>
          </div>
        )}
      </div>

      {/* Add Factory Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-sudan-dark text-white rounded-t-3xl">
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-5 w-5 text-sudan-gold animate-spin-slow" />
                  <h3 className="font-bold text-base">
                    {currentLanguage === "ar" ? "تسجيل ترخيص منشأة صناعية جديدة 2035" : "Register New Industrial Facility"}
                  </h3>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full text-white cursor-pointer transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {currentLanguage === "ar" ? "تم استلام الطلب وبدء الجدولة!" : "Facility Registered & Inspection Scheduled!"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {currentLanguage === "ar" 
                      ? "تم تدوين بيانات مصنعك بنجاح. سيتم تعيين مفتش آلي لزيارة الموقع ومطابقة المواصفات خلال 48 ساعة." 
                      : "We've registered your unit. An industrial inspector is scheduled to verify the production lines within 48h."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المصنع / المنشأة *" : "Factory Name *"}</label>
                    <input
                      type="text"
                      required
                      value={factoryName}
                      onChange={(e) => setFactoryName(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: مصنع النيلين لإنتاج وتعبئة الزيوت النباتية" : "e.g. Nilein Vegetable Oils & Processing Factory"}
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "القطاع الصناعي *" : "Industrial Sector *"}</label>
                      <select
                        value={industrialSector}
                        onChange={(e) => setIndustrialSector(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      >
                        {sectors.map(s => (
                          <option key={s.value} value={s.value}>{currentLanguage === "ar" ? s.labelAr : s.labelEn}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "مقر الولاية *" : "State Location *"}</label>
                      <select
                        value={locationState}
                        onChange={(e) => setLocationState(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      >
                        {SUDANESE_STATES.map(s => (
                          <option key={s.id} value={s.nameAr}>{currentLanguage === "ar" ? s.nameAr : s.nameEn}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الطاقة الإنتاجية المتوقعة *" : "Estimated Capacity *"}</label>
                      <input
                        type="text"
                        required
                        value={productionCapacity}
                        onChange={(e) => setProductionCapacity(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "مثال: 50 طن يومياً" : "e.g. 50 Tons Daily"}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "عدد خطوط الإنتاج *" : "Production Lines Count *"}</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={50}
                        value={productionLinesCount}
                        onChange={(e) => setProductionLinesCount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "مصدر الطاقة المستهدف وتشغيل خطوط العمل *" : "Primary Energy Source *"}</label>
                    <input
                      type="text"
                      required
                      value={energySource}
                      onChange={(e) => setEnergySource(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: طاقة شمسية هجينة + مولد مساند" : "e.g. Solar Hybrid + National Grid Backup"}
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                    />
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-2.5">
                    <ShieldAlert className="h-5 w-5 text-sudan-green shrink-0 mt-0.5" />
                    <p className="text-[11px] text-sudan-green-light leading-normal">
                      {currentLanguage === "ar" 
                        ? "سجل المنصة يضمن مطابقة الإجراءات الفنية مع معايير الجودة والبيئة والسلامة المهنية السودانية لعام 2026 تمهيداً لمنح الإعفاءات الصناعية." 
                        : "Registration qualifies the company for national energy subsidies and customized industrial tax deductions once inspect checks pass."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
                    >
                      {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                    >
                      {isSubmitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                      {currentLanguage === "ar" ? "طلب ترخيص المنشأة" : "Submit Unit Request"}
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
