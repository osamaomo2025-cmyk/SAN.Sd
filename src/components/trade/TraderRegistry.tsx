/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserCheck, Search, Plus, QrCode, ShieldCheck, Building, Check, Briefcase } from "lucide-react";
import { TraderRecord } from "./TradeTypes";
import { initialTraders } from "./TradeMockData";

interface TraderRegistryProps {
  currentLanguage: "ar" | "en";
}

export default function TraderRegistry({ currentLanguage }: TraderRegistryProps) {
  const [traders, setTraders] = useState<TraderRecord[]>(initialTraders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrader, setSelectedTrader] = useState<TraderRecord | null>(initialTraders[0]);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [category, setCategory] = useState<TraderRecord["category"]>("exporter");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const categories = [
    { value: "importer", labelAr: "مستورد معتمد", labelEn: "Certified Importer" },
    { value: "exporter", labelAr: "مصدر معتمد", labelEn: "Certified Exporter" },
    { value: "broker", labelAr: "مخلص جمركي مرخص", labelEn: "Customs Broker" },
    { value: "forwarder", labelAr: "وكيل شحن وتفريغ", labelEn: "Freight Forwarder" },
    { value: "logistics", labelAr: "ناقل لوجستي وطني", labelEn: "Logistics Operator" },
    { value: "warehouse", labelAr: "مستودع جمركي جاف", labelEn: "Warehouse Operator" },
    { value: "shipping_agent", labelAr: "وكيل ملاحة بحرية", labelEn: "Shipping Agent" },
    { value: "ecommerce", labelAr: "تاجر تجارة إلكترونية", labelEn: "E-Commerce Trader" }
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !ownerName || !registrationNumber) return;

    const ntiCode = `SD-NTI-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTrader: TraderRecord = {
      id: `trader-${Date.now()}`,
      nti: ntiCode,
      companyName,
      category,
      ownerName,
      registrationNumber,
      status: "approved",
      registeredAt: new Date().toISOString()
    };

    const updated = [newTrader, ...traders];
    setTraders(updated);
    setSelectedTrader(newTrader);
    setIsRegistering(false);

    // Reset Form
    setCompanyName("");
    setOwnerName("");
    setRegistrationNumber("");
  };

  const filteredTraders = traders.filter(
    t => t.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         t.nti.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="national-trader-registry-hub" className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
            <UserCheck className="h-5.5 w-5.5 text-sudan-green" />
            {currentLanguage === "ar" ? "السجل الموحد للمتعاملين بالتجارة الخارجية (NTI)" : "National Trader Registry Framework"}
          </h2>
          <p className="text-xs text-gray-400">
            {currentLanguage === "ar" 
              ? "تسجيل وإصدار المعرف الوطني الموحد للتجارة الخارجية لكافة المستوردين، المصدرين، المخلصين، والشركات اللوجستية الفيدرالية." 
              : "Registration and assignment of unique National Trade Identifiers (NTI) to ensure security and compliance."}
          </p>
        </div>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-5 py-3 rounded-2xl cursor-pointer transition-all flex items-center gap-1.5"
        >
          <Plus className="h-4.5 w-4.5" />
          {currentLanguage === "ar" ? "تسجيل متعامل تجاري جديد" : "Register New Trader"}
        </button>
      </div>

      {/* Registration Form (Collapsible/Overlay) */}
      {isRegistering && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Building className="h-4.5 w-4.5 text-sudan-green" />
            {currentLanguage === "ar" ? "استمارة طلب ترخيص وتسجيل متعامل تجاري" : "Trader Registry Application Form"}
          </h4>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">{currentLanguage === "ar" ? "اسم الشركة التجاري *" : "Company Legal Name *"}</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Nile Agriculture Co"
                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-sudan-green"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">{currentLanguage === "ar" ? "اسم المالك / المدير المسؤول *" : "Owner / Director Legal Name *"}</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Ahmed Osman"
                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-sudan-green"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">{currentLanguage === "ar" ? "رقم السجل التجاري *" : "Commercial Registration No *"}</label>
              <input
                type="text"
                required
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. SD-2026-X..."
                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-sudan-green font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">{currentLanguage === "ar" ? "فئة المعاملة اللوجستية" : "Trade Category"}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-sudan-green"
              >
                {categories.map(c => (
                  <option key={c.value} value={c.value}>
                    {currentLanguage === "ar" ? c.labelAr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-xl font-bold cursor-pointer"
              >
                {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2.5 rounded-xl font-bold cursor-pointer"
              >
                {currentLanguage === "ar" ? "تأكيد التسجيل وإصدار NTI" : "Submit & Issue NTI"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Layout (List + Interactive ID Card Badge Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Traders list and Search tool */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building className="h-4.5 w-4.5 text-sudan-green" />
              {currentLanguage === "ar" ? "قائمة المتعاملين المسجلين بالسجل الموحد" : "Sovereign Registered Traders Directory"}
            </h4>

            {/* Simple search filter */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLanguage === "ar" ? "بحث برقم NTI أو اسم الشركة..." : "Search by NTI or company..."}
                className="w-full bg-slate-50 border border-slate-200 text-xs pl-4 pr-9 py-2 rounded-xl outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {filteredTraders.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTrader(t)}
                className={`flex items-center justify-between p-4 rounded-2xl text-xs cursor-pointer border transition-all duration-300 ${
                  selectedTrader?.id === t.id 
                    ? "bg-sudan-green/5 border-sudan-green" 
                    : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                }`}
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 truncate">{t.companyName}</span>
                    <span className="text-[8px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold text-slate-500">
                      {t.nti}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold leading-none">
                    {currentLanguage === "ar" ? `المالك: ${t.ownerName}` : `Owner: ${t.ownerName}`}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    t.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {currentLanguage === "ar" ? "نشط معتمد" : "Active"}
                  </span>
                </div>
              </div>
            ))}

            {filteredTraders.length === 0 && (
              <div className="text-center py-12 text-xs text-slate-400 font-bold">
                {currentLanguage === "ar" ? "لا توجد نتائج مطابقة" : "No registered traders matching query."}
              </div>
            )}
          </div>
        </div>

        {/* Selected Trader Official NTI ID Card Badge */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          {selectedTrader ? (
            <div className="space-y-4 flex-1">
              {/* ID Card Wrapper styled to look like a premium official ID Badge card */}
              <div className="border-2 border-sudan-gold bg-slate-50 p-5 rounded-2xl relative overflow-hidden shadow-xs">
                
                {/* Government Ribbon */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-sudan-green"></div>

                <div className="flex justify-between items-start border-b border-gray-200 pb-3 mt-1 text-[8px] font-bold text-gray-400">
                  <span className="uppercase">NTI ID BADGE 2035</span>
                  <span className="text-sudan-gold uppercase">REPUBLIC OF SUDAN</span>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5 w-2/3 overflow-hidden">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                        {currentLanguage === "ar" ? "الاسم التجاري للشركة" : "Company Legal Name"}
                      </span>
                      <p className="font-extrabold text-slate-800 text-sm truncate">{selectedTrader.companyName}</p>
                    </div>

                    {/* Miniature QR */}
                    <div className="h-12 w-12 border border-slate-300 p-1 bg-white rounded flex items-center justify-center shrink-0">
                      <QrCode className="h-full w-full text-slate-800" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{currentLanguage === "ar" ? "رقم المعرف الموحد" : "NTI ID CODE"}</span>
                      <p className="font-mono font-black text-sudan-green">{selectedTrader.nti}</p>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{currentLanguage === "ar" ? "فئة الترخيص" : "Trade category"}</span>
                      <p className="font-extrabold text-slate-700">
                        {categories.find(c => c.value === selectedTrader.category)?.labelEn || selectedTrader.category.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{currentLanguage === "ar" ? "الرقم السجل التجاري" : "Commerc. Reg"}</span>
                      <p className="font-mono font-semibold text-slate-500">{selectedTrader.registrationNumber}</p>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{currentLanguage === "ar" ? "تاريخ التسجيل" : "Registered At"}</span>
                      <p className="font-mono font-semibold text-slate-500">{new Date(selectedTrader.registeredAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal verification footer */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                  {currentLanguage === "ar" ? "حالة الترخيص والتعميد الفيدرالي" : "Sovereign Integration Check"}
                </p>

                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <p className="font-bold leading-normal">
                    {currentLanguage === "ar" 
                      ? "المعرف نشط بالكامل ومتكامل مع بوابة الدفع والجمارك وبنك السودان المركزي."
                      : "NTI is active and fully synched with Customs, Central Bank and Federal Payments Portal."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-16">
              <UserCheck className="h-10 w-10 text-slate-300" />
              <p className="text-slate-500 text-xs">
                {currentLanguage === "ar" ? "اختر متعامل تجاري لعرض بطاقة الهوية الرقمية بالتفصيل" : "Select a trader from the directory to construct official NTI ID Badge."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
