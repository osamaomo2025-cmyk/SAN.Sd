/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FileSpreadsheet, FileText, Scale, Truck, CreditCard, 
  Search, ShieldCheck, Heart, AlertCircle, Plus, Eye, CheckCircle, X, ShieldAlert 
} from "lucide-react";
import { 
  ElectronicInvoice, DigitalContract, DisputeRecord, 
  ShipmentRecord, CommerceUserRole, DigitalBusiness 
} from "./CommerceTypes";

interface CommerceServicesProps {
  currentLanguage: "ar" | "en";
  invoices: ElectronicInvoice[];
  contracts: DigitalContract[];
  disputes: DisputeRecord[];
  shipments: ShipmentRecord[];
  businesses: DigitalBusiness[];
  onAddInvoice: (inv: any) => void;
  onAddDispute: (disp: any) => void;
  onResolveDispute: (id: string, resolutionAr: string, resolutionEn: string) => void;
  userRole: CommerceUserRole;
}

export default function CommerceServices({
  currentLanguage,
  invoices,
  contracts,
  disputes,
  shipments,
  businesses,
  onAddInvoice,
  onAddDispute,
  onResolveDispute,
  userRole
}: CommerceServicesProps) {
  const [activeSubTab, setActiveSubTab] = useState<"invoices" | "contracts" | "disputes" | "logistics">("invoices");
  
  // Dialog Open states
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord | null>(null);

  // Form states
  const [issuerId, setIssuerId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [amount, setAmount] = useState("");

  const [disputeBizId, setDisputeBizId] = useState("");
  const [consumerName, setConsumerName] = useState("");
  const [consumerPhone, setConsumerPhone] = useState("");
  const [complaintType, setComplaintType] = useState<any>("non_delivery");
  const [details, setDetails] = useState("");

  const [govResolutionAr, setGovResolutionAr] = useState("");
  const [govResolutionEn, setGovResolutionEn] = useState("");

  const isGov = [
    CommerceUserRole.GOVERNMENT_OFFICER,
    CommerceUserRole.SME_ADVISOR,
    CommerceUserRole.DEPARTMENT_MANAGER,
    CommerceUserRole.DIRECTOR,
    CommerceUserRole.UNDERSECRETARY,
    CommerceUserRole.MINISTER,
    CommerceUserRole.SUPER_ADMIN
  ].includes(userRole);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issuerId || !buyerName || !amount) {
      alert(currentLanguage === "ar" ? "يرجى ملء البيانات المطلوبة" : "Please fill in all required fields");
      return;
    }

    const newInv: ElectronicInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `SD-EINV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      issuerId,
      buyerName,
      issueDate: new Date().toISOString(),
      amount: Number(amount),
      vatAmount: Number(amount) * 0.15,
      status: "pending"
    };

    onAddInvoice(newInv);
    setIsInvoiceOpen(false);

    // reset
    setIssuerId("");
    setBuyerName("");
    setAmount("");
  };

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeBizId || !consumerName || !consumerPhone || !details) {
      alert(currentLanguage === "ar" ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields");
      return;
    }

    const newDisp: DisputeRecord = {
      id: `disp-${Date.now()}`,
      ticketNumber: `SD-DISP-${Math.floor(1000 + Math.random() * 9000)}`,
      businessId: disputeBizId,
      consumerName,
      consumerPhone,
      complaintType,
      details,
      status: "new",
      createdAt: new Date().toISOString()
    };

    onAddDispute(newDisp);
    setIsDisputeOpen(false);

    // reset
    setDisputeBizId("");
    setConsumerName("");
    setConsumerPhone("");
    setDetails("");
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !govResolutionAr || !govResolutionEn) {
      alert(currentLanguage === "ar" ? "يرجى إدخال القرار بالعربية والإنجليزية" : "Please fill in resolution text in both languages");
      return;
    }

    onResolveDispute(selectedDispute.id, govResolutionAr, govResolutionEn);
    setSelectedDispute(null);
    setGovResolutionAr("");
    setGovResolutionEn("");
  };

  const getBusinessName = (id: string) => {
    const biz = businesses.find(b => b.id === id);
    return biz ? (currentLanguage === "ar" ? biz.storeNameAr : biz.storeNameEn) : id;
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-Tabs Nav */}
      <div className="flex border-b border-gray-200 gap-1 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "invoices", labelAr: "الفواتير الإلكترونية الموحدة", labelEn: "E-Invoicing System", icon: FileSpreadsheet },
          { id: "contracts", labelAr: "العقود الرقمية والربط السيادي", labelEn: "Digital Contracts", icon: FileText },
          { id: "disputes", labelAr: "حماية المستهلك وتسوية النزاعات", labelEn: "Disputes & Safety", icon: Scale },
          { id: "logistics", labelAr: "التتبع والربط اللوجستي الفيدرالي", labelEn: "Sovereign Logistics Tracking", icon: Truck }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider whitespace-nowrap ${
                isSelected 
                  ? "border-sudan-green text-sudan-green font-extrabold bg-sudan-green/5 rounded-t-xl" 
                  : "border-transparent text-gray-400 hover:text-gray-800"
              }`}
            >
              <IconComp className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* E-INVOICING SECTION */}
      {activeSubTab === "invoices" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
                {currentLanguage === "ar" ? "نظام الفوترة الرقمية الموحد للشركات الرقمية" : "National Integrated E-Invoicing Ledger"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {currentLanguage === "ar" 
                  ? "إصدار فواتير ذكية بنظام ضريبة القيمة المضافة السيادي الموحد بنسبة ١٥٪، والربط الفوري مع بوابات الدفع."
                  : "Issue standard electronic tax invoices with integrated 15% VAT, cryptographically signed and bound to federal pay."}
              </p>
            </div>

            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? "إصدار فاتورة إلكترونية" : "Issue E-Invoice"}</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-4 text-center">{currentLanguage === "ar" ? "رقم الفاتورة" : "Invoice ID"}</th>
                    <th className="p-4">{currentLanguage === "ar" ? "الشركة المصدرة" : "Issuer Merchant"}</th>
                    <th className="p-4">{currentLanguage === "ar" ? "العميل المشتري" : "Buyer Name"}</th>
                    <th className="p-4">{currentLanguage === "ar" ? "التاريخ" : "Timestamp"}</th>
                    <th className="p-4 text-right">{currentLanguage === "ar" ? "القيمة الصافية" : "Subtotal"}</th>
                    <th className="p-4 text-right">{currentLanguage === "ar" ? "ضريبة القيمة المضافة" : "VAT (15%)"}</th>
                    <th className="p-4 text-right">{currentLanguage === "ar" ? "الإجمالي" : "Total Amount"}</th>
                    <th className="p-4 text-center">{currentLanguage === "ar" ? "حالة الدفع" : "Payment Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-center font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>
                      <td className="p-4 font-bold text-slate-800">{getBusinessName(inv.issuerId)}</td>
                      <td className="p-4 font-semibold text-slate-600">{inv.buyerName}</td>
                      <td className="p-4 text-gray-400 font-mono">{new Date(inv.issueDate).toLocaleDateString()}</td>
                      <td className="p-4 text-right font-mono font-bold">{(inv.amount - inv.vatAmount).toLocaleString()} SDG</td>
                      <td className="p-4 text-right font-mono text-gray-500">{inv.vatAmount.toLocaleString()} SDG</td>
                      <td className="p-4 text-right font-mono font-extrabold text-[#1E293B]">{inv.amount.toLocaleString()} SDG</td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          inv.status === "paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-150" : "bg-amber-50 text-amber-700 border border-amber-150"
                        }`}>
                          {inv.status === "paid" ? (currentLanguage === "ar" ? "مدفوعة" : "Paid") : (currentLanguage === "ar" ? "معلقة" : "Pending")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL CONTRACTS SECTION */}
      {activeSubTab === "contracts" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
              {currentLanguage === "ar" ? "دفتر العقود والتفاهمات الرقمية المشفرة" : "Sovereign Encrypted Digital Contracts Registry"}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {currentLanguage === "ar" 
                ? "عقود تجارية ملزمة وموثقة بتوقيع رقمي سيادي موحد، مع توليد بصمة تشفيرية (SHA-256) لمنع التلاعب وتسهيل المقاضاة."
                : "Legally binding electronic business agreements signed via National Digital ID, securing cryptography hashes on the federal registry."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contracts.map((con) => (
              <div key={con.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-sudan-green transition-all duration-300 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-bold px-2.5 py-0.5 rounded">
                      {con.contractNumber}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase">
                      {con.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base leading-snug">
                    {currentLanguage === "ar" ? con.titleAr : con.titleEn}
                  </h4>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-[11px] leading-relaxed text-slate-600">
                  <p><strong>{currentLanguage === "ar" ? "الطرف الأول:" : "Party A:"}</strong> {con.partyA}</p>
                  <p><strong>{currentLanguage === "ar" ? "الطرف الثاني:" : "Party B:"}</strong> {con.partyB}</p>
                </div>

                <div className="pt-2 text-[10px] text-gray-400 font-mono space-y-1">
                  <p className="font-semibold">{currentLanguage === "ar" ? "التوقيع الرقمي الموحد (SHA-256 Hash):" : "Sovereign Signature Hash:"}</p>
                  <p className="bg-slate-50 border border-slate-200 p-2 rounded-lg break-all font-bold text-slate-500">{con.hash}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-gray-400 font-semibold">
                  <span>{currentLanguage === "ar" ? `موقع في: ${new Date(con.signedAt!).toLocaleDateString()}` : `Signed: ${new Date(con.signedAt!).toLocaleDateString()}`}</span>
                  <button onClick={() => alert(currentLanguage === "ar" ? "جاري تحميل وثيقة العقد المشفرة المعتمدة بختم الوزارة" : "Downloading sovereign sealed contract PDF...")} className="text-sudan-green font-bold flex items-center gap-1 cursor-pointer">
                    <Eye className="h-3.5 w-3.5" />
                    {currentLanguage === "ar" ? "عرض وتحميل العقد" : "View Sealed Contract"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISPUTES SECTION */}
      {activeSubTab === "disputes" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
                {currentLanguage === "ar" ? "مركز تسوية النزاعات وحماية المستهلك الإلكتروني" : "National E-Commerce Dispute Resolution Board"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {currentLanguage === "ar" 
                  ? "تسجيل شكاوى المستهلكين، مراجعة المخالفات (السلع المقلدة، التلاعب بالأسعار)، وإجراء الاسترداد المالي السيادي."
                  : "Resolve consumer shopping disputes, audit merchant authenticity, manage refund orders via federal gateways."}
              </p>
            </div>

            <button
              onClick={() => setIsDisputeOpen(true)}
              className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? "تقديم شكوى نزاع" : "Raise Dispute Ticket"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {disputes.map((disp) => (
              <div key={disp.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-sudan-green transition-all duration-300 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-mono font-bold px-2.5 py-0.5 rounded">
                      {disp.ticketNumber}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      disp.status === "resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      disp.status === "under_investigation" ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse" :
                      "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {currentLanguage === "ar" ? 
                        (disp.status === "resolved" ? "تم الحل والتسوية" : disp.status === "under_investigation" ? "تحت التحقيق" : "جديد") : 
                        disp.status.replace("_", " ").toUpperCase()
                      }
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#1E293B] text-sm">
                      {currentLanguage === "ar" ? `الشاكي: ${disp.consumerName}` : `Claimant: ${disp.consumerName}`}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                      {currentLanguage === "ar" ? `المتجر المشكو ضده: ${getBusinessName(disp.businessId)}` : `Against Store: ${getBusinessName(disp.businessId)}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      {disp.details}
                    </p>
                  </div>

                  {disp.resolutionAr && (
                    <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs space-y-1">
                      <p className="font-extrabold text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>{currentLanguage === "ar" ? "قرار التسوية السيادي الصادر:" : "Federal Board Resolution:"}</span>
                      </p>
                      <p className="text-slate-600 leading-relaxed font-semibold">
                        {currentLanguage === "ar" ? disp.resolutionAr : disp.resolutionEn}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-gray-400 font-semibold">
                  <span>{currentLanguage === "ar" ? `حررت في: ${new Date(disp.createdAt).toLocaleDateString()}` : `Filed: ${new Date(disp.createdAt).toLocaleDateString()}`}</span>
                  
                  {isGov && disp.status !== "resolved" && (
                    <button
                      onClick={() => {
                        setSelectedDispute(disp);
                        setGovResolutionAr("");
                        setGovResolutionEn("");
                      }}
                      className="bg-[#1E293B] hover:bg-slate-800 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      {currentLanguage === "ar" ? "إصدار قرار فض النزاع" : "Draft Resolution"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOGISTICS SECTION */}
      {activeSubTab === "logistics" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
              {currentLanguage === "ar" ? "تتبع الشحنات والربط اللوجستي القومي" : "National Integrated Shipment & Fleet Tracking"}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {currentLanguage === "ar" 
                ? "تكامل ذكي لتتبع حركة المنتجات الصادرة والواردة من المستودعات الوطنية ومطابقة سلامة سلسلة الإمداد الفيدرالية."
                : "Real-time supply chain oversight matching commodity shipments directly to regional customs and port logistics centers."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shipments.map((shp) => (
              <div key={shp.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-sudan-green transition-all duration-300 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-mono font-bold px-2.5 py-0.5 rounded">
                      {shp.trackingNumber}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      shp.status === "delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      shp.status === "transit" ? "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse" :
                      "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      {shp.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-[#1E293B] text-sm">
                    {currentLanguage === "ar" ? `الناقل المعتمد: ${shp.carrier}` : `Carrier: ${shp.carrier}`}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px] leading-relaxed text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "نقطة الانطلاق" : "Origin"}</p>
                    <p className="font-extrabold text-slate-800">{shp.origin}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "الوجهة النهائية" : "Destination"}</p>
                    <p className="font-extrabold text-slate-800">{shp.destination}</p>
                  </div>
                </div>

                <div className="text-[11px] space-y-1">
                  <p className="text-gray-400 font-bold uppercase text-[9px]">{currentLanguage === "ar" ? "الموقع الحالي المسجل بالـ GPS" : "Current GPS Transit Lock"}</p>
                  <p className="font-bold text-sudan-green flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-sudan-green animate-ping" />
                    <span>{shp.currentLocation}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-gray-400 font-semibold font-mono">
                  <span>{currentLanguage === "ar" ? `تاريخ آخر تحديث: ${new Date(shp.lastUpdated).toLocaleString()}` : `Last Updated: ${new Date(shp.lastUpdated).toLocaleString()}`}</span>
                  <button onClick={() => alert(currentLanguage === "ar" ? "جاري الاستعلام عن بيانات الإشارات الجغرافية الفورية للقافلة" : "Polling GPS nodes...")} className="text-sudan-green font-bold cursor-pointer">
                    {currentLanguage === "ar" ? "تتبع فوري" : "Live GPS"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {isInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full text-slate-800 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
              <h3 className="font-bold text-base">
                {currentLanguage === "ar" ? "إصدار فاتورة ضريبية إلكترونية موحدة" : "Issue National E-Invoice"}
              </h3>
              <button onClick={() => setIsInvoiceOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اختر الشركة الرقمية المصدرة *" : "Issuer Digital Merchant *"}</label>
                <select
                  required
                  value={issuerId}
                  onChange={(e) => setIssuerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                >
                  <option value="">{currentLanguage === "ar" ? "--- اختر المتجر المعتمد ---" : "--- Select Verified Store ---"}</option>
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>
                      {currentLanguage === "ar" ? b.storeNameAr : b.storeNameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم العميل المشتري *" : "Buyer Customer Name *"}</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="شركة استيراد الأغذية الكبرى"
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "القيمة الإجمالية شاملة الضريبة (SDG) *" : "Total Amount Inclusive of VAT (SDG) *"}</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="25000"
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsInvoiceOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer">
                  {currentLanguage === "ar" ? "تأكيد وإصدار الفاتورة" : "Confirm & Issue Ledger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Raise Dispute Modal */}
      {isDisputeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full text-slate-800 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
              <h3 className="font-bold text-base">
                {currentLanguage === "ar" ? "تسجيل نزاع تجاري إلكتروني رسمي" : "Raise Official Commerce Dispute"}
              </h3>
              <button onClick={() => setIsDisputeOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDispute} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اختر المتجر المشكو ضده *" : "Disputed Digital Merchant *"}</label>
                <select
                  required
                  value={disputeBizId}
                  onChange={(e) => setDisputeBizId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                >
                  <option value="">{currentLanguage === "ar" ? "--- اختر المتجر المعتمد ---" : "--- Select Verified Store ---"}</option>
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>
                      {currentLanguage === "ar" ? b.storeNameAr : b.storeNameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المستهلك الشاكي *" : "Claimant Name *"}</label>
                  <input
                    type="text"
                    required
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                    placeholder="جمال مبارك"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "هاتف الشاكي *" : "Claimant Phone *"}</label>
                  <input
                    type="tel"
                    required
                    value={consumerPhone}
                    onChange={(e) => setConsumerPhone(e.target.value)}
                    placeholder="+249XXXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "نوع المخالفة/الشكوى *" : "Dispute Type *"}</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                >
                  <option value="non_delivery">{currentLanguage === "ar" ? "عدم توصيل المنتج المباع" : "Non-Delivery of Paid Goods"}</option>
                  <option value="defective_product">{currentLanguage === "ar" ? "وصول منتج معيب أو تالف" : "Defective or Damaged Product"}</option>
                  <option value="price_mismatch">{currentLanguage === "ar" ? "تلاعب بالأسعار واحتكار" : "Price Gouging or Monopoly"}</option>
                  <option value="fraud">{currentLanguage === "ar" ? "احتيال أو سلع مقلدة ومغشوشة" : "Fraud or Counterfeit Product"}</option>
                  <option value="other">{currentLanguage === "ar" ? "أسباب مخالفة أخرى" : "Other violations"}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "تفاصيل المشكلة والوقائع بالكامل *" : "Full Facts & Details *"}</label>
                <textarea
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsDisputeOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer">
                  {currentLanguage === "ar" ? "تسجيل تذكرة الشكوى" : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Dispute Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full text-slate-800 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
              <h3 className="font-bold text-base">
                {currentLanguage === "ar" ? "إصدار قرار التسوية الفيدرالي الملزم" : "Draft Binding Federal Resolution"}
              </h3>
              <button onClick={() => setSelectedDispute(null)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleResolve} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "القرار الصادر (بالعربية) *" : "Resolution (Arabic) *"}</label>
                <textarea
                  required
                  rows={3}
                  value={govResolutionAr}
                  onChange={(e) => setGovResolutionAr(e.target.value)}
                  placeholder="تم مراجعة الفواتير وبوابات الدفع وقرر مجلس التجارة استرجاع المبلغ فورياً للمشتري لمخالفة البائع..."
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "القرار الصادر (بالإنجليزية) *" : "Resolution (English) *"}</label>
                <textarea
                  required
                  rows={3}
                  value={govResolutionEn}
                  onChange={(e) => setGovResolutionEn(e.target.value)}
                  placeholder="Following review of transaction ledgers, the board has authorized an immediate refund to buyer due to seller default..."
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedDispute(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer">
                  {currentLanguage === "ar" ? "إصدار وتطبيق القرار السيادي" : "Publish & Enforce"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
