/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, Plus, Search, Eye, ShieldCheck, 
  UserCheck, Smartphone, CheckCircle, HelpCircle, 
  TrendingUp, Activity, BadgeAlert, RefreshCw, X, Check, EyeOff, Link, FileText, Ban
} from "lucide-react";
import { DigitalBusiness, BusinessType, CommerceUserRole, AuditLog } from "./CommerceTypes";

interface CommerceRegistryProps {
  currentLanguage: "ar" | "en";
  businesses: DigitalBusiness[];
  onAddBusiness: (biz: any) => void;
  onUpdateStatus: (id: string, status: any) => void;
  onUpdateLogs: (id: string, log: AuditLog) => void;
  userRole: CommerceUserRole;
}

export default function CommerceRegistry({
  currentLanguage,
  businesses,
  onAddBusiness,
  onUpdateStatus,
  onUpdateLogs,
  userRole
}: CommerceRegistryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState<DigitalBusiness | null>(null);

  // New business form state
  const [storeNameAr, setStoreNameAr] = useState("");
  const [storeNameEn, setStoreNameEn] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("online_store");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("agricultural_commerce");
  const [addressState, setAddressState] = useState("الخرطوم");
  const [addressCity, setAddressCity] = useState("بحري");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [crLink, setCrLink] = useState("");
  const [licenseLink, setLicenseLink] = useState("");

  const isGov = [
    CommerceUserRole.GOVERNMENT_OFFICER,
    CommerceUserRole.SME_ADVISOR,
    CommerceUserRole.DEPARTMENT_MANAGER,
    CommerceUserRole.DIRECTOR,
    CommerceUserRole.UNDERSECRETARY,
    CommerceUserRole.MINISTER,
    CommerceUserRole.SUPER_ADMIN
  ].includes(userRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeNameAr || !storeNameEn || !ownerName || !email || !phone) {
      alert(currentLanguage === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all fields");
      return;
    }

    const newId = `db-${Date.now()}`;
    const digitalId = `SD-BIZ-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBiz: DigitalBusiness = {
      id: newId,
      digitalId,
      storeNameAr,
      storeNameEn,
      businessType,
      ownerName,
      email,
      phone,
      status: "pending",
      trustScore: 80,
      sector,
      addressState,
      addressCity,
      registeredAt: new Date().toISOString(),
      annualRevenue: Number(annualRevenue) || 500000,
      paymentPlatformLinked: false,
      logisticsLinked: false,
      crLink: crLink || undefined,
      licenseLink: licenseLink || undefined,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          actionAr: "طلب تسجيل جديد للمؤسسة الرقمية",
          actionEn: "Initial digital registry registration requested",
          actor: ownerName,
          role: userRole,
          timestamp: new Date().toISOString(),
          ip: "197.251.10.42"
        }
      ]
    };

    onAddBusiness(newBiz);
    setIsRegisterOpen(false);
    
    // Reset fields
    setStoreNameAr("");
    setStoreNameEn("");
    setOwnerName("");
    setEmail("");
    setPhone("");
    setAnnualRevenue("");
    setCrLink("");
    setLicenseLink("");
  };

  const changeStatus = (bizId: string, nextStatus: string, actionAr: string, actionEn: string) => {
    onUpdateStatus(bizId, nextStatus);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actionAr,
      actionEn,
      actor: userRole,
      role: userRole,
      timestamp: new Date().toISOString(),
      ip: "196.1.200.89"
    };
    onUpdateLogs(bizId, newLog);
    // update current selected view
    if (selectedBiz && selectedBiz.id === bizId) {
      setSelectedBiz(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: nextStatus as any,
          auditLogs: [newLog, ...prev.auditLogs]
        };
      });
    }
  };

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = 
      b.storeNameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.storeNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.digitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || b.businessType === filterType;
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {currentLanguage === "ar" ? "نشط ومفعل" : "Active & Ready"}
          </span>
        );
      case "verified":
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {currentLanguage === "ar" ? "تم التحقق (Verified)" : "Verified"}
          </span>
        );
      case "pending":
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {currentLanguage === "ar" ? "قيد التدقيق" : "Pending Vetting"}
          </span>
        );
      case "suspended":
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {currentLanguage === "ar" ? "موقوف مؤقتاً" : "Suspended"}
          </span>
        );
      default:
        return (
          <span className="bg-gray-50 text-gray-700 border border-gray-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {currentLanguage === "ar" ? "مؤرشف" : "Archived"}
          </span>
        );
    }
  };

  const getBusinessTypeName = (type: BusinessType) => {
    const mappings: Record<BusinessType, { ar: string, en: string }> = {
      online_store: { ar: "متجر إلكتروني مستقل", en: "Independent E-Store" },
      marketplace: { ar: "سوق رقمي مشترك", en: "Shared Marketplace" },
      home_based: { ar: "عمل منزلي رقمي", en: "Home-Based Business" },
      freelancer: { ar: "عمل مهني حر", en: "Freelancer Profile" },
      digital_service: { ar: "مقدم خدمات رقمية", en: "Digital Service Provider" }
    };
    return currentLanguage === "ar" ? mappings[type].ar : mappings[type].en;
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Header */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={currentLanguage === "ar" ? "ابحث بالرقم الوطني الموحد، اسم المتجر أو المالك..." : "Search by National ID, store, owner..."}
            className="w-full bg-slate-50 border border-slate-200 text-xs px-10 py-3 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:border-sudan-green"
          >
            <option value="all">{currentLanguage === "ar" ? "كل أنواع التجارة" : "All Business Types"}</option>
            <option value="online_store">{currentLanguage === "ar" ? "متجر إلكتروني" : "E-Store"}</option>
            <option value="marketplace">{currentLanguage === "ar" ? "سوق رقمي" : "Marketplace"}</option>
            <option value="home_based">{currentLanguage === "ar" ? "عمل منزلي" : "Home-Based"}</option>
            <option value="freelancer">{currentLanguage === "ar" ? "عمل حر" : "Freelancer"}</option>
            <option value="digital_service">{currentLanguage === "ar" ? "خدمات رقمية" : "Digital Service"}</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:border-sudan-green"
          >
            <option value="all">{currentLanguage === "ar" ? "كل حالات التحقق" : "All Statuses"}</option>
            <option value="pending">{currentLanguage === "ar" ? "قيد التدقيق" : "Pending"}</option>
            <option value="verified">{currentLanguage === "ar" ? "معتمد وموثق" : "Verified"}</option>
            <option value="active">{currentLanguage === "ar" ? "نشط ومفعل" : "Active"}</option>
            <option value="suspended">{currentLanguage === "ar" ? "موقوف" : "Suspended"}</option>
          </select>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm md:ml-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{currentLanguage === "ar" ? "تسجيل عمل رقمي جديد" : "Register Digital Business"}</span>
          </button>
        </div>
      </div>

      {/* Grid of registered digital businesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-white border border-gray-200 hover:border-sudan-green rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex justify-between items-start">
                <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                  {biz.digitalId}
                </span>
                {getStatusBadge(biz.status)}
              </div>

              <div>
                <h3 className="font-extrabold text-[#1E293B] text-sm md:text-base leading-tight">
                  {currentLanguage === "ar" ? biz.storeNameAr : biz.storeNameEn}
                </h3>
                <p className="text-[10px] text-sudan-gold font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                  <Smartphone className="h-3.5 w-3.5 text-gray-400" />
                  <span>{getBusinessTypeName(biz.businessType)}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] border-t border-slate-100 text-slate-500">
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "المالك المعتمد" : "Authorized Owner"}</p>
                  <p className="font-bold text-slate-800 truncate">{biz.ownerName}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "الولاية / المدينة" : "State / City"}</p>
                  <p className="font-bold text-slate-800 truncate">{biz.addressState} - {biz.addressCity}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${biz.paymentPlatformLinked ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-400"}`}>
                  {currentLanguage === "ar" ? "بوابة الدفع" : "Sovereign Pay"}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${biz.logisticsLinked ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-400"}`}>
                  {currentLanguage === "ar" ? "الربط اللوجستي" : "Logistics"}
                </span>
                {biz.crLink && (
                  <span className="text-[9px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-bold flex items-center gap-0.5">
                    <Link className="h-2.5 w-2.5" />
                    {currentLanguage === "ar" ? "مربوط بالسجل" : "CR Linked"}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "مؤشر موثوقية التاجر" : "Merchant Trust Score"}</span>
                <span className={`text-xs font-mono font-bold ${biz.trustScore >= 90 ? "text-emerald-600" : biz.trustScore >= 70 ? "text-amber-600" : "text-rose-600"}`}>
                  {biz.trustScore}%
                </span>
              </div>
              <button
                onClick={() => setSelectedBiz(biz)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#1E293B] text-[10px] font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{currentLanguage === "ar" ? "تفاصيل وسير العمل" : "Details & Workflow"}</span>
              </button>
            </div>
          </div>
        ))}

        {filteredBusinesses.length === 0 && (
          <div className="col-span-full bg-white text-center py-12 rounded-3xl border border-gray-200 space-y-2 shadow-sm">
            <Building2 className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-slate-500 text-sm font-bold">
              {currentLanguage === "ar" ? "لا توجد متاجر رقمية مسجلة تطابق التصفية" : "No registered digital businesses found"}
            </p>
          </div>
        )}
      </div>

      {/* Register Business Dialog Overlay */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full text-slate-800 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
              <h3 className="font-bold text-base">
                {currentLanguage === "ar" ? "تقديم طلب تسجيل مؤسسة تجارة رقمية وطنية" : "National Digital Commerce Business Registration Form"}
              </h3>
              <button onClick={() => setIsRegisterOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المتجر/المنصة (بالعربية) *" : "Store/Platform Name (Arabic) *"}</label>
                  <input
                    type="text"
                    required
                    value={storeNameAr}
                    onChange={(e) => setStoreNameAr(e.target.value)}
                    placeholder="موقع مزارع السودان الذكي"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المتجر/المنصة (بالإنجليزية) *" : "Store/Platform Name (English) *"}</label>
                  <input
                    type="text"
                    required
                    value={storeNameEn}
                    onChange={(e) => setStoreNameEn(e.target.value)}
                    placeholder="e.g. Sudanese Smart Farmers Platform"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "نوع الكيان الرقمي *" : "Digital Entity Type *"}</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  >
                    <option value="online_store">{currentLanguage === "ar" ? "متجر إلكتروني مستقل (E-Store)" : "Independent E-Store"}</option>
                    <option value="marketplace">{currentLanguage === "ar" ? "سوق رقمي مشترك (Marketplace)" : "Shared Marketplace"}</option>
                    <option value="home_based">{currentLanguage === "ar" ? "عمل منزلي رقمي (Home-Based)" : "Home-Based Business"}</option>
                    <option value="freelancer">{currentLanguage === "ar" ? "رخصة مهنية حرة للشباب" : "Freelancer Professional"}</option>
                    <option value="digital_service">{currentLanguage === "ar" ? "بوابة خدمات رقمية وتقنية" : "Digital Service Provider"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المالك المسؤول *" : "Owner / Representative Name *"}</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="جمال عبد الماجد البشير"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "البريد الإلكتروني *" : "Official Email Address *"}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@store.sd"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الهاتف المعتمد *" : "Official Phone Number *"}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+2499XXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الولاية *" : "State Location *"}</label>
                  <select
                    value={addressState}
                    onChange={(e) => setAddressState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  >
                    <option value="الخرطوم">الخرطوم</option>
                    <option value="البحر الأحمر">البحر الأحمر</option>
                    <option value="شمال كردفان">شمال كردفان</option>
                    <option value="الجزيرة">الجزيرة</option>
                    <option value="سنار">سنار</option>
                    <option value="نهر النيل">نهر النيل</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "المدينة *" : "City Location *"}</label>
                  <input
                    type="text"
                    required
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    placeholder="بورتسودان"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "حجم المبيعات السنوية المتوقع (SDG)" : "Est. Annual Revenue (SDG)"}</label>
                  <input
                    type="number"
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(e.target.value)}
                    placeholder="1000000"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "ربط برقم السجل التجاري القائم" : "Link Commercial Register #"}</label>
                  <input
                    type="text"
                    value={crLink}
                    onChange={(e) => setCrLink(e.target.value)}
                    placeholder="e.g. SD-2026-90412"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "ربط برقم رخصة صادر/وارد" : "Link Trade License #"}</label>
                  <input
                    type="text"
                    value={licenseLink}
                    onChange={(e) => setLicenseLink(e.target.value)}
                    placeholder="e.g. lic-1"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 bg-white sticky bottom-0">
                <button type="button" onClick={() => setIsRegisterOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer">
                  {currentLanguage === "ar" ? "إرسال طلب التسجيل" : "Submit Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Business Details and Workflow Modal */}
      {selectedBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full text-slate-800 border-t-8 border-sudan-green my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-mono font-bold text-slate-500">
                  {selectedBiz.digitalId}
                </span>
                <h4 className="font-extrabold text-[#1E293B] text-lg">
                  {currentLanguage === "ar" ? selectedBiz.storeNameAr : selectedBiz.storeNameEn}
                </h4>
              </div>
              <button onClick={() => setSelectedBiz(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Stepper Workflow Engine */}
              <div className="space-y-3 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-sudan-green" />
                  <span>{currentLanguage === "ar" ? "محرك تدفق العمل الرقمي والاعتماد الفيدرالي" : "Sovereign Digital Commerce Workflow Stepper"}</span>
                </h5>
                
                {/* Visual Workflow Steps */}
                <div className="grid grid-cols-5 gap-2 pt-2 text-center text-[10px] font-bold">
                  {[
                    { key: "pending", labelAr: "تقديم الطلب", labelEn: "Submitted" },
                    { key: "verified", labelAr: "فحص وتدقيق الهوية", labelEn: "Identity Vetted" },
                    { key: "active", labelAr: "تفعيل المتجر والربط", labelEn: "Gateways Bound" },
                    { key: "compliance", labelAr: "فحص الامتثال", labelEn: "Compliant" },
                    { key: "renewal", labelAr: "التقييم الدوري", labelEn: "Evaluated" }
                  ].map((step, idx) => {
                    let isCompleted = false;
                    let isCurrent = false;

                    if (selectedBiz.status === "pending") {
                      isCompleted = idx === 0;
                      isCurrent = idx === 0;
                    } else if (selectedBiz.status === "verified") {
                      isCompleted = idx <= 1;
                      isCurrent = idx === 1;
                    } else if (selectedBiz.status === "active") {
                      isCompleted = idx <= 3; // active means gateway & compliance both good
                      isCurrent = idx === 2;
                    } else if (selectedBiz.status === "suspended") {
                      isCompleted = false;
                    }

                    return (
                      <div key={idx} className="space-y-1">
                        <div className={`h-2.5 rounded-full transition-all duration-300 ${
                          selectedBiz.status === "suspended" 
                            ? "bg-rose-200" 
                            : isCompleted 
                              ? "bg-sudan-green" 
                              : isCurrent 
                                ? "bg-amber-400 animate-pulse" 
                                : "bg-slate-200"
                        }`} />
                        <span className={`block font-semibold scale-90 ${isCurrent ? "text-sudan-green font-extrabold" : "text-gray-500"}`}>
                          {currentLanguage === "ar" ? step.labelAr : step.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Business specs */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-gray-400 font-bold uppercase text-[9px]">{currentLanguage === "ar" ? "نوع التجارة الرقمية" : "Digital Trade Category"}</p>
                  <p className="font-extrabold text-slate-800">{getBusinessTypeName(selectedBiz.businessType)}</p>

                  <p className="text-gray-400 font-bold uppercase text-[9px] pt-1">{currentLanguage === "ar" ? "المالك المعتمد المسؤول" : "Authorized Owner / Representative"}</p>
                  <p className="font-extrabold text-slate-800">{selectedBiz.ownerName}</p>

                  <p className="text-gray-400 font-bold uppercase text-[9px] pt-1">{currentLanguage === "ar" ? "الهاتف والبريد الإلكتروني" : "Direct Contact Channel"}</p>
                  <p className="font-semibold text-slate-700">{selectedBiz.phone}<br/>{selectedBiz.email}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-400 font-bold uppercase text-[9px]">{currentLanguage === "ar" ? "تاريخ التسجيل الوطني" : "National Registration Timestamp"}</p>
                  <p className="font-mono font-bold text-slate-800">{new Date(selectedBiz.registeredAt).toLocaleDateString()}</p>

                  <p className="text-gray-400 font-bold uppercase text-[9px] pt-1">{currentLanguage === "ar" ? "حجم المبيعات السنوية المتوقع" : "Annual Turnover Estimate"}</p>
                  <p className="font-mono font-bold text-emerald-600">{selectedBiz.annualRevenue.toLocaleString()} SDG</p>

                  <p className="text-gray-400 font-bold uppercase text-[9px] pt-1">{currentLanguage === "ar" ? "الربط بالسجل والترخيص الفيدرالي" : "Sovereign Document Bonds"}</p>
                  <div className="space-y-1">
                    {selectedBiz.crLink ? (
                      <p className="text-[10px] text-blue-700 font-bold flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-500" />
                        {currentLanguage === "ar" ? `السجل التجاري رقم: ${selectedBiz.crLink}` : `Commercial Register: ${selectedBiz.crLink}`}
                      </p>
                    ) : (
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <X className="h-3 w-3 text-rose-500" />
                        {currentLanguage === "ar" ? "غير مربوط بسجل تجاري" : "No active CR bond"}
                      </p>
                    )}

                    {selectedBiz.licenseLink ? (
                      <p className="text-[10px] text-indigo-700 font-bold flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-500" />
                        {currentLanguage === "ar" ? `رخصة الصادر/وارد: ${selectedBiz.licenseLink}` : `Trade Permit: ${selectedBiz.licenseLink}`}
                      </p>
                    ) : (
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <X className="h-3 w-3 text-rose-500" />
                        {currentLanguage === "ar" ? "لا توجد رخصة صادر/وارد نشطة" : "No active Trade Permit"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Immutable Sovereign Audit Trail */}
              <div className="space-y-3.5 pt-3 border-t border-slate-150">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-4.5 w-4.5 text-sudan-green" />
                  <span>{currentLanguage === "ar" ? "سجل المراجعة والتدقيق الفيدرالي غير القابل للتعديل" : "Sovereign Immutable Commerce Audit Trail"}</span>
                </h5>
                
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {selectedBiz.auditLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between text-[11px]">
                      <div className="space-y-1">
                        <p className="font-bold text-[#1E293B]">
                          {currentLanguage === "ar" ? log.actionAr : log.actionEn}
                        </p>
                        <p className="text-gray-400 font-semibold">
                          {currentLanguage === "ar" ? `المُعَمِّد: ${log.actor} (${log.role})` : `Actor: ${log.actor} (${log.role})`} • IP: {log.ip}
                        </p>
                      </div>
                      <span className="font-mono text-[9px] text-gray-400 shrink-0">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administrative Government Actions */}
              {isGov && (
                <div className="pt-4 border-t border-slate-150 space-y-2 bg-slate-50 p-4 rounded-2xl">
                  <h5 className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                    <UserCheck className="h-4 w-4 text-sudan-gold" />
                    <span>{currentLanguage === "ar" ? "إجراءات الاعتماد والرقابة للوزارة" : "Ministry Vetting and Compliance Operations"}</span>
                  </h5>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {selectedBiz.status === "pending" && (
                      <button
                        onClick={() => changeStatus(
                          selectedBiz.id, 
                          "verified", 
                          "اعتماد وتوثيق الهوية الرقمية للتاجر", 
                          "Merchant digital identity vetted and verified"
                        )}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {currentLanguage === "ar" ? "اعتماد وتوثيق الهوية" : "Verify Identity"}
                      </button>
                    )}

                    {selectedBiz.status === "verified" && (
                      <button
                        onClick={() => changeStatus(
                          selectedBiz.id, 
                          "active", 
                          "تفعيل المتجر الإلكتروني وربط بوابات الدفع الوطنية", 
                          "National gateway binding finalized & store activated"
                        )}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        {currentLanguage === "ar" ? "تفعيل المتجر وربط بوابات الدفع" : "Activate & Link Gateways"}
                      </button>
                    )}

                    {selectedBiz.status !== "suspended" ? (
                      <button
                        onClick={() => changeStatus(
                          selectedBiz.id, 
                          "suspended", 
                          "تجميد حساب التاجر لمخالفة اللوائح وقوانين الرقابة", 
                          "Sovereign merchant suspension enforced due to regulatory mismatch"
                        )}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        {currentLanguage === "ar" ? "تجميد الحساب لمخالفة القوانين" : "Enforce Suspension"}
                      </button>
                    ) : (
                      <button
                        onClick={() => changeStatus(
                          selectedBiz.id, 
                          "active", 
                          "إعادة تنشيط الكيان الرقمي وتوثيق تلافي المخالفات", 
                          "Reactivated digital merchant store following audit compliance validation"
                        )}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                        {currentLanguage === "ar" ? "رفع التجميد وإعادة التفعيل" : "Lift Suspension & Reactivate"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
