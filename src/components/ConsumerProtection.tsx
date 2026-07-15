/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, Plus, CheckCircle, Clock, AlertTriangle, 
  MapPin, Store, MessageSquare, Search, X, Check, Eye 
} from "lucide-react";
import { ConsumerComplaint } from "../types";
import { SUDANESE_STATES } from "../data";

interface ConsumerProtectionProps {
  currentLanguage: "ar" | "en";
  complaints: ConsumerComplaint[];
  onAddComplaint: (complaintData: any) => Promise<any>;
  isAdmin: boolean;
  onUpdateComplaintStatus?: (id: string, status: "new" | "investigating" | "resolved" | "dismissed") => Promise<any>;
}

export default function ConsumerProtectionModule({
  currentLanguage,
  complaints,
  onAddComplaint,
  isAdmin,
  onUpdateComplaintStatus
}: ConsumerProtectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewingComplaint, setViewingComplaint] = useState<ConsumerComplaint | null>(null);

  // Form State
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [violationType, setViolationType] = useState<"price_gouging" | "expired_goods" | "monopoly" | "counterfeit" | "other">("price_gouging");
  const [details, setDetails] = useState("");
  const [stateName, setStateName] = useState(SUDANESE_STATES[0].nameAr);
  const [cityName, setCityName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !details || !cityName) {
      alert(currentLanguage === "ar" ? "يرجى تعبئة كافة الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddComplaint({
        reporterName: reporterName || undefined,
        reporterPhone: reporterPhone || undefined,
        storeName,
        violationType,
        details,
        state: stateName,
        city: cityName,
        status: "new"
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormOpen(false);
        setReporterName("");
        setReporterPhone("");
        setStoreName("");
        setDetails("");
        setCityName("");
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveComplaint = async (id: string) => {
    if (onUpdateComplaintStatus) {
      try {
        await onUpdateComplaintStatus(id, "resolved");
        if (viewingComplaint && viewingComplaint.id === id) {
          setViewingComplaint(prev => prev ? { ...prev, status: "resolved" } : null);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const violationTypes = [
    { value: "price_gouging", labelAr: "زيادة أسعار غير مبررة / احتكار", labelEn: "Price-Gouging / Monopoly" },
    { value: "expired_goods", labelAr: "سلع منتهية الصلاحية / غير صالحة", labelEn: "Expired / Spoiled Goods" },
    { value: "monopoly", labelAr: "ممارسات احتكارية وحظر سلع", labelEn: "Monopolistic Practices" },
    { value: "counterfeit", labelAr: "مواصفات تالفة أو سلع مقلدة", labelEn: "Counterfeit / Substandard" },
    { value: "other", labelAr: "مخالفات تجارية أخرى غش وتدليس", labelEn: "Other Commercial Violations" }
  ];

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.details.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || c.violationType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div id="consumer-protection-module" className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-sudan-green" />
            {currentLanguage === "ar" ? "إدارة حماية المستهلك والرقابة التجارية" : "Consumer Protection & Market Control"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {currentLanguage === "ar" 
              ? "تقديم بلاغات الغش التجاري ومكافحة الاحتكار، ومراقبة الالتزام بأسعار السلع لعام 2035" 
              : "Report price-gouging, commercial fraud, expired products, and monitor compliance instantly"}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
        >
          <Plus className="h-4.5 w-4.5" />
          {currentLanguage === "ar" ? "تقديم بلاغ / شكوى تجارية" : "File a Violation Report"}
        </button>
      </div>

      {/* Grid status - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:scale-[1.01] transition-all duration-300">
          <div className="p-3.5 bg-red-50 text-red-600 border border-red-100 rounded-2xl shadow-xs">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h5 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "إجمالي البلاغات" : "Total Violations"}</h5>
            <p className="text-2xl font-black text-[#1E293B] mt-1">{complaints.length}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:scale-[1.01] transition-all duration-300">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl shadow-xs">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h5 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "تمت تسويتها ومخالفتها" : "Resolved Cases"}</h5>
            <p className="text-2xl font-black text-[#1E293B] mt-1">
              {complaints.filter(c => c.status === "resolved").length}
            </p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:scale-[1.01] transition-all duration-300">
          <div className="p-3.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl shadow-xs">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h5 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "قيد المتابعة الفورية" : "Under Action"}</h5>
            <p className="text-2xl font-black text-[#1E293B] mt-1">
              {complaints.filter(c => c.status === "new" || c.status === "investigating").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={currentLanguage === "ar" ? "ابحث عن بلاغ باسم المتجر أو التفاصيل..." : "Search violations by store or description..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F6F5] border border-gray-200 text-sm pl-4 pr-11 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-[#F4F6F5] border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-sudan-green min-w-[200px]"
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        >
          <option value="all">{currentLanguage === "ar" ? "كل أنواع المخالفات" : "All Violations"}</option>
          {violationTypes.map(v => (
            <option key={v.value} value={v.value}>{currentLanguage === "ar" ? v.labelAr : v.labelEn}</option>
          ))}
        </select>
      </div>

      {/* Directory log */}
      <div className="space-y-4">
        {filteredComplaints.map(comp => {
          const typeObj = violationTypes.find(v => v.value === comp.violationType);
          return (
            <div
              key={comp.id}
              onClick={() => setViewingComplaint(comp)}
              className="bg-white border border-gray-200 hover:border-red-500 rounded-3xl p-6 shadow-sm transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between md:items-center gap-4"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-red-50 text-red-600 border border-red-100 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {currentLanguage === "ar" ? typeObj?.labelAr : typeObj?.labelEn}
                  </span>
                  <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    comp.status === "resolved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                  }`}>
                    {comp.status === "resolved" ? (currentLanguage === "ar" ? "تمت تسوية القضية" : "Resolved") : (currentLanguage === "ar" ? "قيد التدقيق" : "Pending")}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-[#1E293B] text-sm md:text-base">{comp.storeName}</h3>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5 flex-wrap">
                    <Store className="h-3.5 w-3.5 text-gray-400" />
                    <span className="font-bold">{currentLanguage === "ar" ? `التاجر: ${comp.storeName}` : `Merchant: ${comp.storeName}`}</span>
                    <span className="text-gray-300">|</span>
                    <MapPin className="h-3.5 w-3.5 text-sudan-gold" />
                    <span className="font-bold">{comp.state} - {comp.city}</span>
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button className="bg-slate-50 hover:bg-slate-100 text-slate-500 p-2.5 rounded-xl border border-gray-200 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredComplaints.length === 0 && (
          <div className="bg-white text-center py-12 rounded-3xl border border-gray-200 space-y-3 shadow-sm animate-fade-in">
            <ShieldAlert className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="text-slate-500 text-sm">
              {currentLanguage === "ar" ? "لا توجد شكاوى أو بلاغات مدونة حالياً" : "No commercial complaints filed matching criteria"}
            </p>
          </div>
        )}
      </div>

      {/* Submit Violation Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-sudan-dark text-slate-900 rounded-t-3xl">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-sudan-gold" />
                  {currentLanguage === "ar" ? "تقديم شكوى / بلاغ حماية مستهلك" : "File Commercial Market Complaint"}
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full text-white cursor-pointer transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-10 text-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-slate-800">{currentLanguage === "ar" ? "تم تسجيل البلاغ!" : "Complaint Registered!"}</h4>
                  <p className="text-xs text-slate-400">{currentLanguage === "ar" ? "تم إخطار فريق المراقبة والتفتيش الميداني فورياً للتدقيق." : "Field compliance inspectors have been dispatched to investigate."}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-700">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الاسم الكريم (اختياري)" : "Reporter Name (Optional)"}</label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "رقم الهاتف للاتصال" : "Reporter Phone"}</label>
                      <input
                        type="text"
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المتجر / التاجر المشكو ضده *" : "Merchant / Store Name *"}</label>
                      <input
                        type="text"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "مثال: سوبرماركت البركة للبيع الإجمالي" : "e.g. Al-Amana Wholesale Depot"}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "تصنيف نوع المخالفة *" : "Violation Classification *"}</label>
                      <select
                        value={violationType}
                        onChange={(e) => setViolationType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      >
                        {violationTypes.map(v => (
                          <option key={v.value} value={v.value}>{currentLanguage === "ar" ? v.labelAr : v.labelEn}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الولاية *" : "State Location *"}</label>
                      <select
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      >
                        {SUDANESE_STATES.map(s => (
                          <option key={s.id} value={s.nameAr}>{currentLanguage === "ar" ? s.nameAr : s.nameEn}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "المدينة / الحي *" : "City / Neighborhood *"}</label>
                      <input
                        type="text"
                        required
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="e.g. Amarat, Block 15"
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "تفاصيل البلاغ والشكوى *" : "Incident Details & Description *"}</label>
                    <textarea
                      required
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "يرجى ذكر تفاصيل الزيادة أو المخالفة بوضوح..." : "Please describe what happened..."}
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                    <button type="submit" disabled={isSubmitting} className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-md">
                      {isSubmitting ? "..." : (currentLanguage === "ar" ? "إرسال البلاغ فورياً" : "Submit Urgent Report")}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Complaint Viewing Detail Modal */}
      <AnimatePresence>
        {viewingComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-slate-800 rounded-3xl max-w-lg w-full max-h-[95vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 bg-sudan-dark text-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-sudan-gold" />
                  <h3 className="font-bold text-sm">{currentLanguage === "ar" ? "بلاغ حماية المستهلك المعتمد" : "Consumer Grievance Report"}</h3>
                </div>
                <button onClick={() => setViewingComplaint(null)} className="text-slate-300 hover:text-white bg-slate-800 p-1 rounded-full cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>{currentLanguage === "ar" ? "حالة الملف" : "Status"}</span>
                    <span className="font-mono font-bold text-sudan-gold uppercase">{viewingComplaint.status}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{viewingComplaint.storeName}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{viewingComplaint.details}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px]">{currentLanguage === "ar" ? "التاجر المشكو ضده" : "Accused Merchant"}</span>
                    <p className="font-semibold text-slate-800 mt-1">{viewingComplaint.storeName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px]">{currentLanguage === "ar" ? "الموقع" : "Location"}</span>
                    <p className="font-semibold text-slate-800 mt-1">{viewingComplaint.state} - {viewingComplaint.city}</p>
                  </div>
                </div>

                {/* Resolution controls for admin */}
                {isAdmin && (viewingComplaint.status === "new" || viewingComplaint.status === "investigating") && onUpdateComplaintStatus && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <h5 className="text-xs font-bold text-slate-500">{currentLanguage === "ar" ? "قرارات حسم القضية وتغريم التاجر" : "Admin Compliance Action"}</h5>
                    <button
                      onClick={() => handleResolveComplaint(viewingComplaint.id)}
                      className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer shadow-sm transition-all animate-pulse"
                    >
                      {currentLanguage === "ar" ? "حسم القضية وتوجيه غرامة رقمية" : "Resolve Case & Dispatch Violation Fine"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
