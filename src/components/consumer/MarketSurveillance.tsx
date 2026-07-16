/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Globe, ShieldAlert, Plus, CheckCircle, 
  MapPin, Store, FileText, Camera, RefreshCw, BarChart3, Clock, Scale, X
} from "lucide-react";

interface MarketSurveillanceProps {
  currentLanguage: "ar" | "en";
  inspections: any[];
  onAddInspection: (inspectionData: any) => Promise<any>;
  companies: any[];
  licenses: any[];
}

export default function MarketSurveillance({
  currentLanguage,
  inspections,
  onAddInspection,
  companies,
  licenses
}: MarketSurveillanceProps) {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [isCitationOpen, setIsCitationOpen] = useState(false);

  // Citation Form
  const [targetStore, setTargetStore] = useState("");
  const [linkedCompanyId, setLinkedCompanyId] = useState("");
  const [linkedLicenseId, setLinkedLicenseId] = useState("");
  const [stateName, setStateName] = useState("الخرطوم");
  const [cityName, setCityName] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [offenseType, setOffenseType] = useState("price_manipulation");
  const [fineAmount, setFineAmount] = useState<number>(50000);
  const [evidencePhoto, setEvidencePhoto] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCaptureGPS = () => {
    const lat = (15.5 + Math.random() * 0.1).toFixed(6);
    const long = (32.5 + Math.random() * 0.1).toFixed(6);
    setGpsCoordinates(`${lat}° N, ${long}° E`);
  };

  const handleSubmitCitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedCompany = companies.find(c => c.id === linkedCompanyId);
      const selectedLicense = licenses.find(l => l.id === linkedLicenseId);

      const inspectionData = {
        storeName: targetStore,
        location: `${stateName} - ${cityName}`,
        inspectorName: inspectorName || "مفتش عام",
        result: "fine_issued",
        notes: `[غرامة بقيمة ${fineAmount.toLocaleString()} ج.س] ${notes}. تم الربط القانوني بالسجل التجاري رقم ${
          selectedCompany ? selectedCompany.registrationNumber : "غير مسجل"
        } والترخيص الموحد رقم ${selectedLicense ? selectedLicense.id : "غير مرخص"}.`,
        gps: gpsCoordinates,
        fineAmount,
        linkedCompanyReg: selectedCompany?.registrationNumber || "",
        linkedLicenseNumber: selectedLicense?.id || ""
      };

      await onAddInspection(inspectionData);
      setIsCitationOpen(false);
      // Reset form
      setTargetStore("");
      setLinkedCompanyId("");
      setLinkedLicenseId("");
      setCityName("");
      setInspectorName("");
      setFineAmount(50000);
      setEvidencePhoto(false);
      setGpsCoordinates("");
      setNotes("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectors = [
    { id: "all", nameAr: "جميع القطاعات", nameEn: "All Sectors", icon: Store, count: inspections.length },
    { id: "retail", nameAr: "أسواق التجزئة والمقالات", nameEn: "Retail Markets", icon: Store, count: 12 },
    { id: "wholesale", nameAr: "أسواق الجملة والمستودعات", nameEn: "Wholesale Markets", icon: Building2, count: 5 },
    { id: "ecommerce", nameAr: "التجارة الإلكترونية والمنصات", nameEn: "E-Commerce & Digital", icon: Globe, count: 4 },
    { id: "imported", nameAr: "السلع والمنتجات المستوردة", nameEn: "Imported Cargo", icon: Globe, count: 8 },
    { id: "exported", nameAr: "الصادرات والرقابة الخارجية", nameEn: "Exported Cargo", icon: Globe, count: 3 }
  ];

  const offenseTypes = [
    { value: "price_gouging", labelAr: "مضاعفة الأسعار دون مبرر", labelEn: "Unjust Price-Gouging" },
    { value: "expired_goods", labelAr: "عرض أغذية منتهية الصلاحية", labelEn: "Expired Goods on Shelf" },
    { value: "monopoly", labelAr: "إخفاء واحتكار السلع الأساسية", labelEn: "Monopoly & Goods Hoarding" },
    { value: "counterfeit", labelAr: "تداول مواد مقلدة ومغشوشة", labelEn: "Counterfeit/Substandard Stock" },
    { value: "deception", labelAr: "الغش التجاري والتدليس", labelEn: "Commercial Deception" },
    { value: "price_manipulation", labelAr: "عدم إعلان الأسعار وتزييفها", labelEn: "Price-Tag Fraud" }
  ];

  return (
    <div id="market-surveillance-tab" className="space-y-6">
      
      {/* Header and Quick Launcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Scale className="h-5 w-5 text-sudan-green" />
            {currentLanguage === "ar" ? "إدارة الرقابة والإنفاذ الميداني" : "Field Enforcement & Surveillance"}
          </h3>
          <p className="text-xs text-slate-400">
            {currentLanguage === "ar" 
              ? "متابعة أعمال المفتشين الميدانيين وإصدار الضبطيات القضائية والغرامات آلياً" 
              : "Track active inspections, issue court citations, and sync with financial collections."}
          </p>
        </div>
        <button
          onClick={() => setIsCitationOpen(true)}
          className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-5 py-3 rounded-2xl cursor-pointer shadow hover:shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="h-4.5 w-4.5" />
          {currentLanguage === "ar" ? "تحرير مخالفة ضبط قضائي" : "Create Legal Field Citation"}
        </button>
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {sectors.map(sec => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec.id)}
              className={`p-4 rounded-2xl border text-center space-y-2 cursor-pointer transition-all ${
                selectedSector === sec.id
                  ? "bg-white border-sudan-green shadow-sm ring-1 ring-sudan-green"
                  : "bg-white border-gray-200 hover:bg-slate-50"
              }`}
            >
              <div className={`p-2 w-10 h-10 rounded-xl mx-auto flex items-center justify-center ${
                selectedSector === sec.id ? "bg-emerald-50 text-sudan-green" : "bg-slate-50 text-slate-500"
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-black text-slate-800 leading-snug">{currentLanguage === "ar" ? sec.nameAr : sec.nameEn}</p>
            </button>
          );
        })}
      </div>

      {/* Inspections Logs List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "أحدث تقارير الضبط والتفتيش الميداني" : "Realtime Field Compliance Log"}</h4>
          <span className="text-[9px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-black uppercase">
            {inspections.length} {currentLanguage === "ar" ? "زيارة مسجلة" : "Visits Registered"}
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {inspections.map(insp => (
            <div key={insp.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition-all">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-red-50 text-red-600 border border-red-100 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {currentLanguage === "ar" ? "ضبطية قضائية وغرامة" : "Digital Citation"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(insp.date).toLocaleDateString()}</span>
                  </span>
                </div>
                <h5 className="font-extrabold text-slate-800 text-xs md:text-sm">{insp.storeName}</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{insp.notes}</p>
                {insp.gps && (
                  <p className="text-[9px] text-slate-400 font-mono flex items-center gap-1 bg-slate-100 w-fit px-2 py-0.5 rounded-md">
                    <MapPin className="h-3 w-3 text-sudan-gold" />
                    <span>GPS: {insp.gps}</span>
                  </p>
                )}
              </div>

              <div className="text-right space-y-1.5 self-stretch md:self-auto flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end border-t md:border-t-0 pt-3 md:pt-0">
                <p className="text-xs text-slate-400">{currentLanguage === "ar" ? "المفتش المسؤول" : "Inspector"}</p>
                <p className="text-[11px] font-bold text-slate-800">{insp.inspectorName}</p>
              </div>
            </div>
          ))}

          {inspections.length === 0 && (
            <div className="p-10 text-center text-slate-400 text-xs">
              {currentLanguage === "ar" ? "لا توجد زيارات رقابية مدونة حالياً" : "No inspections recorded yet"}
            </div>
          )}
        </div>
      </div>

      {/* Write Citation Modal */}
      <AnimatePresence>
        {isCitationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-sudan-dark text-slate-900 p-6 border-b border-slate-100 flex justify-between items-center rounded-t-3xl">
                <div>
                  <h3 className="font-black text-sm md:text-base flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-sudan-gold" />
                    {currentLanguage === "ar" ? "تحرير مخالفة وضبطية قضائية سيادية" : "Issue Sovereign Field Citation"}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{currentLanguage === "ar" ? "سيتم تلقائياً ترحيل الغرامة لفاتورة السجل الموحد للمنشأة" : "This citation automatically issues a digital fine invoice linked to the company record."}</p>
                </div>
                <button onClick={() => setIsCitationOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-white p-1.5 rounded-full cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSubmitCitation} className="p-6 space-y-4 text-slate-700 text-xs">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المحل أو التاجر الميداني *" : "Store Name *"}</label>
                    <input
                      type="text"
                      required
                      value={targetStore}
                      onChange={(e) => setTargetStore(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: بقالة الصادق النموذجية" : "Store name"}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "المفتش المحرر للمخالفة *" : "Inspector Name *"}</label>
                    <input
                      type="text"
                      required
                      value={inspectorName}
                      onChange={(e) => setInspectorName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* Referential Integrity Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">{currentLanguage === "ar" ? "الربط مع السجل التجاري الموحد" : "Link Commercial Registry"}</label>
                    <select
                      value={linkedCompanyId}
                      onChange={(e) => setLinkedCompanyId(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl"
                    >
                      <option value="">{currentLanguage === "ar" ? "--- غير مسجل بالسجل التجاري ---" : "--- No Registry Linked ---"}</option>
                      {companies.map(comp => (
                        <option key={comp.id} value={comp.id}>{comp.companyNameAr}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">{currentLanguage === "ar" ? "الربط مع التراخيص الوطنية" : "Link National License"}</label>
                    <select
                      value={linkedLicenseId}
                      onChange={(e) => setLinkedLicenseId(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl"
                    >
                      <option value="">{currentLanguage === "ar" ? "--- غير مرخص رخص تجارية ---" : "--- No License Linked ---"}</option>
                      {licenses.map(lic => (
                        <option key={lic.id} value={lic.id}>{lic.goodsDescription || lic.id}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "المدينة / المحلية *" : "City / District *"}</label>
                    <input
                      type="text"
                      required
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "نوع المخالفة الضبطية *" : "Infringement Category *"}</label>
                    <select
                      value={offenseType}
                      onChange={(e) => setOffenseType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl"
                    >
                      {offenseTypes.map(off => (
                        <option key={off.value} value={off.value}>{currentLanguage === "ar" ? off.labelAr : off.labelEn}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "قيمة الغرامة المحتسبة (ج.س) *" : "Fine Amount (SDG) *"}</label>
                    <input
                      type="number"
                      required
                      value={fineAmount}
                      onChange={(e) => setFineAmount(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "تفاصيل المخالفة والسلع المضبوطة *" : "Specific Details & Confiscated items *"}</label>
                  <textarea
                    required
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl resize-none"
                  />
                </div>

                {/* Evidence items */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEvidencePhoto(true)}
                    className={`p-3 border rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      evidencePhoto ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <Camera className="h-4.5 w-4.5" />
                    <span>{evidencePhoto ? (currentLanguage === "ar" ? "تم قفل الصورة بنجاح" : "Photo Locked") : (currentLanguage === "ar" ? "إلتقاط صورة الدليل الميداني" : "Capture Evidence Photo")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCaptureGPS}
                    className={`p-3 border rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      gpsCoordinates ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <MapPin className="h-4.5 w-4.5" />
                    <span>{gpsCoordinates ? (currentLanguage === "ar" ? "تم قفل الإحداثيات" : "GPS Locked") : (currentLanguage === "ar" ? "ختم الموقع الجغرافي GPS" : "Stamp Geolocation GPS")}</span>
                  </button>
                </div>

                {gpsCoordinates && (
                  <div className="p-2 bg-slate-900 text-emerald-400 font-mono text-[9px] rounded-lg border border-slate-800">
                    GPS SEALED: {gpsCoordinates} | HASH: SHA256:{Math.random().toString(16).substr(2, 24)}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsCitationOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-xl">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !targetStore}
                    className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2 rounded-xl shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? "..." : (currentLanguage === "ar" ? "تصدير المخالفة والربط المالي" : "Issue & Bind Citation") }
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
