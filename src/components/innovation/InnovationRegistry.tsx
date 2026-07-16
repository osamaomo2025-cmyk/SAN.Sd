/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, Plus, Search, CheckCircle, XCircle, FileText, 
  UserCheck, ShieldAlert, AlertCircle, Sparkles, Filter, Globe 
} from "lucide-react";
import { InnovatorRegistryRecord, InnovationUserRole, InnovatorType } from "./InnovationTypes";

interface InnovationRegistryProps {
  currentLanguage: "ar" | "en";
  records: InnovatorRegistryRecord[];
  onAddRecord: (newRec: InnovatorRegistryRecord) => void;
  onUpdateStatus: (id: string, status: "verified" | "rejected", log: any) => void;
  userRole: InnovationUserRole;
}

export default function InnovationRegistry({
  currentLanguage,
  records,
  onAddRecord,
  onUpdateStatus,
  userRole
}: InnovationRegistryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [type, setType] = useState<InnovatorType>("individual");
  const [representative, setRepresentative] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("state-khartoum");
  const [city, setCity] = useState("");
  const [specAr, setSpecAr] = useState("");
  const [specEn, setSpecEn] = useState("");

  const statesData = [
    { id: "state-khartoum", ar: "ولاية الخرطوم", en: "Khartoum State" },
    { id: "state-redsea", ar: "ولاية البحر الأحمر", en: "Red Sea State" },
    { id: "state-kordofan", ar: "ولاية شمال كردفان", en: "North Kordofan State" },
    { id: "state-gezira", ar: "ولاية الجزيرة", en: "Al Gezira State" },
    { id: "state-sennar", ar: "ولاية سنار", en: "Sennar State" },
    { id: "state-rivernile", ar: "ولاية نهر النيل", en: "River Nile State" }
  ];

  const typesData: { value: InnovatorType; ar: string; en: string }[] = [
    { value: "individual", ar: "مبتكر فردي", en: "Individual Innovator" },
    { value: "researcher", ar: "باحث مستقل", en: "Independent Researcher" },
    { value: "university", ar: "جامعة / كلية", en: "University" },
    { value: "research_center", ar: "مركز بحوث حكومي / مستقل", en: "Research Center" },
    { value: "startup", ar: "شركة تكنولوجية ناشئة", en: "Tech Startup" },
    { value: "tech_company", ar: "شركة قطاع خاص متميزة", en: "Technology Company" },
    { value: "industrial_unit", ar: "وحدة بحوث صناعية للمصانع", en: "Industrial Research Unit" },
    { value: "gov_institution", ar: "مؤسسة بحثية سيادية", en: "Government Research Institution" },
    { value: "innovation_hub", ar: "حاضنة أعمال ومجمع ابتكار", en: "Innovation Hub / Park" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !nameEn || !email || !representative) return;

    const randomId = Math.floor(10000 + Math.random() * 90000);
    const newRecord: InnovatorRegistryRecord = {
      id: `rec-${Date.now()}`,
      nii: `SD-NII-${randomId}`,
      nameAr,
      nameEn,
      type,
      representative,
      email,
      phone,
      state,
      city,
      specializationAr: specAr || nameAr,
      specializationEn: specEn || nameEn,
      status: "pending",
      createdAt: new Date().toISOString(),
      auditLogs: [
        {
          actionAr: "تقديم طلب التسجيل السيادي عبر البوابة الوطنية",
          actionEn: "Sovereign registry application filed via national portal",
          timestamp: new Date().toISOString(),
          actor: representative
        }
      ]
    };

    onAddRecord(newRecord);
    setIsFormOpen(false);

    // Reset Form
    setNameAr("");
    setNameEn("");
    setRepresentative("");
    setEmail("");
    setPhone("");
    setCity("");
    setSpecAr("");
    setSpecEn("");
  };

  const filteredRecords = records.filter((rec) => {
    const matchesSearch = 
      rec.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.nii.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.representative.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || rec.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleVerify = (id: string, approve: boolean) => {
    const actor = userRole.toUpperCase();
    const timestamp = new Date().toISOString();
    const log = {
      actionAr: approve ? "التحقق الميداني والاعتماد السيادي وإصدار المعرف NII" : "رفض الملف لعدم اكتمال وثائق الاعتماد المعتمدة",
      actionEn: approve ? "Physical audit verified, sovereign endorsement approved and NII issued" : "Application rejected due to incomplete credential filing",
      timestamp,
      actor
    };
    onUpdateStatus(id, approve ? "verified" : "rejected", log);
  };

  const isOfficer = [
    InnovationUserRole.SUPER_ADMIN,
    InnovationUserRole.SUPER_ADMIN as string,
    InnovationUserRole.MINISTER,
    InnovationUserRole.DIRECTOR,
    InnovationUserRole.DEPARTMENT_MANAGER,
    InnovationUserRole.INNOVATION_FUND_MANAGER,
    InnovationUserRole.PATENT_EXAMINER
  ].includes(userRole);

  return (
    <div className="space-y-6">
      
      {/* Banner introduction with dynamic counting */}
      <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-[#1E293B] text-base md:text-lg">
            {currentLanguage === "ar" ? "السجل الرقمي الموحد للمبتكرين والباحثين" : "National Integrated Innovators & Researchers Registry"}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {currentLanguage === "ar" 
              ? "حوكمة تسجيل الهوية الإبداعية الفيدرالية وإصدار معرفات الابتكار الرقمية الوطنية (NII) لتعزيز نقل التكنولوجيا."
              : "Unified governance of creative profiles, issuing unique National Innovation Identifiers (NII) to anchor tech-transfer ecosystems."}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>{currentLanguage === "ar" ? "تقديم طلب تسجيل جديد" : "Apply for Innovation Registry"}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Registration Form (Animate toggle) */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="h-5 w-5 text-sudan-gold animate-pulse" />
            <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">
              {currentLanguage === "ar" ? "نموذج تسجيل الابتكار والبحث العلمي السيادي" : "Sovereign Patent & Research Registry Application"}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Name Arabic */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "اسم المبتكر/المنشأة (بالعربية) *" : "Innovator/Entity Name (Arabic) *"}
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "مثال: مجمع أبحاث الكيمياء الحيوية" : "e.g. Biochemical Research Center"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Name English */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "اسم المبتكر/المنشأة (بالإنجليزية) *" : "Innovator/Entity Name (English) *"}
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Biochemical Research Center"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "نوع التسجيل ومستوى التمثيل *" : "Registration & Representative Type *"}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              >
                {typesData.map((t) => (
                  <option key={t.value} value={t.value}>
                    {currentLanguage === "ar" ? t.ar : t.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Representative */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "اسم الممثل القانوني / الباحث الرئيسي *" : "Legal Representative / Lead Investigator *"}
              </label>
              <input
                type="text"
                required
                value={representative}
                onChange={(e) => setRepresentative(e.target.value)}
                placeholder={currentLanguage === "ar" ? "أ.د. عثمان الصافي" : "e.g. Prof. Osman Al Safi"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "البريد الإلكتروني المعتمد *" : "Certified Email *"}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="research@entity.gov.sd"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "رقم الهاتف الفيدرالي" : "Federal Contact Phone"}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+249XXXXXXX"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* State GIS */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "الولاية (للربط بنظام الخرائط اللوجستية) *" : "State (for GIS Logistics Integration) *"}
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              >
                {statesData.map((s) => (
                  <option key={s.id} value={s.id}>
                    {currentLanguage === "ar" ? s.ar : s.en}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "المحلية / المدينة" : "District / City"}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={currentLanguage === "ar" ? "المنطقة الصناعية" : "e.g. Industrial Area"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Specialization Ar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "التخصص والنشاط الابتكاري الرئيسي (بالعربية)" : "Specialization & Creative Focus (Arabic)"}
              </label>
              <input
                type="text"
                value={specAr}
                onChange={(e) => setSpecAr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Specialization En */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "التخصص والنشاط الابتكاري الرئيسي (بالإنجليزية)" : "Specialization & Creative Focus (English)"}
              </label>
              <input
                type="text"
                value={specEn}
                onChange={(e) => setSpecEn(e.target.value)}
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
              {currentLanguage === "ar" ? "إرسال طلب التسجيل" : "Submit Request"}
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={currentLanguage === "ar" ? "بحث بالاسم، المعرف NII..." : "Search by name, NII..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs pl-8 pr-3.5 py-2 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        {/* Filter type */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all cursor-pointer"
          >
            <option value="all">{currentLanguage === "ar" ? "كل الفئات البحثية" : "All Entity Categories"}</option>
            {typesData.map((t) => (
              <option key={t.value} value={t.value}>
                {currentLanguage === "ar" ? t.ar : t.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Registry Table/Cards */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-slate-500">
                <th className="p-4 text-right md:text-right">{currentLanguage === "ar" ? "الاسم والمعرف الوطني" : "Entity Name & NII"}</th>
                <th className="p-4">{currentLanguage === "ar" ? "التصنيف" : "Classification"}</th>
                <th className="p-4">{currentLanguage === "ar" ? "المنطقة والمدينة" : "State & City"}</th>
                <th className="p-4">{currentLanguage === "ar" ? "الممثل والبريد" : "Representative & Contact"}</th>
                <th className="p-4">{currentLanguage === "ar" ? "الحالة" : "Status"}</th>
                <th className="p-4 text-center">{currentLanguage === "ar" ? "إجراءات الحوكمة" : "Governance Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => {
                  const typeLabel = typesData.find(t => t.value === rec.type);
                  const stateLabel = statesData.find(s => s.id === rec.state);
                  const isPending = rec.status === "pending";

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* Name and NII */}
                      <td className="p-4 text-right md:text-right space-y-1">
                        <p className="font-extrabold text-[#1E293B]">
                          {currentLanguage === "ar" ? rec.nameAr : rec.nameEn}
                        </p>
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded text-slate-600">
                          <Building2 className="h-3 w-3" />
                          <span>{rec.nii}</span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="p-4 font-bold text-slate-600">
                        {typeLabel ? (currentLanguage === "ar" ? typeLabel.ar : typeLabel.en) : rec.type}
                      </td>

                      {/* Location */}
                      <td className="p-4 space-y-0.5">
                        <span className="font-bold text-slate-700 block">
                          {stateLabel ? (currentLanguage === "ar" ? stateLabel.ar : stateLabel.en) : rec.state}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">{rec.city}</span>
                      </td>

                      {/* Representative */}
                      <td className="p-4 space-y-0.5">
                        <span className="font-bold text-slate-700 block">{rec.representative}</span>
                        <span className="text-[10px] text-gray-400 font-mono font-bold block">{rec.email}</span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          rec.status === "verified"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : rec.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          <span>
                            {rec.status === "verified"
                              ? (currentLanguage === "ar" ? "معتمد سيادياً" : "Verified")
                              : rec.status === "rejected"
                              ? (currentLanguage === "ar" ? "مرفوض" : "Rejected")
                              : (currentLanguage === "ar" ? "قيد التدقيق" : "Under Audit")}
                          </span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        {isPending && isOfficer ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleVerify(rec.id, true)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg cursor-pointer transition-colors"
                              title={currentLanguage === "ar" ? "اعتماد وتسجيل" : "Endorse & Registry"}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleVerify(rec.id, false)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg cursor-pointer transition-colors"
                              title={currentLanguage === "ar" ? "رفض الطلب" : "Reject File"}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                            {rec.status === "verified" ? (currentLanguage === "ar" ? "مدقق بالكامل" : "Audited") : (currentLanguage === "ar" ? "ملف مغلق" : "Dossier Closed")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-semibold">
                    <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2 animate-bounce" />
                    {currentLanguage === "ar" ? "لم يتم العثور على سجلات مطابقة لمعايير البحث" : "No records matching search parameters"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
