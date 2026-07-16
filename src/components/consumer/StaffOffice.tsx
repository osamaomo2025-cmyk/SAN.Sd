/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, UserCheck, Scale, History, MessageSquare, 
  CheckCircle, Clock, FileText, Lock, RefreshCw, AlertTriangle
} from "lucide-react";
import { ConsumerComplaint } from "../../types";

interface StaffOfficeProps {
  currentLanguage: "ar" | "en";
  complaints: ConsumerComplaint[];
  auditLedger: any[];
  onUpdateComplaintStatus: (id: string, status: string, notes?: string) => Promise<any>;
  onAddAuditLog: (logData: any) => Promise<any>;
}

export default function StaffOffice({
  currentLanguage,
  complaints,
  auditLedger,
  onUpdateComplaintStatus,
  onAddAuditLog
}: StaffOfficeProps) {
  const [selectedRole, setSelectedRole] = useState<string>("inspector");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"complaints" | "audit" | "appeals">("complaints");

  // Appeal state
  const [appeals, setAppeals] = useState<any[]>([
    { id: "ap-1", storeName: "سوبرماركت البركة الحديث", fineId: "INV-2026-071504", reason: "الزيادة في السعر كانت ناتجة عن تسعير خاطئ من المورد الفيدرالي وجاري تعديل الخلل", status: "pending", date: "2026-07-10T12:00:00Z" }
  ]);
  const [appealReason, setAppealReason] = useState("");
  const [appealStore, setAppealStore] = useState("");
  const [appealInvoice, setAppealInvoice] = useState("");

  const roles = [
    { value: "inspector", labelAr: "مفتش ميداني", labelEn: "Field Inspector" },
    { value: "officer", labelAr: "ضابط إنفاذ تجاري", labelEn: "Enforcement Officer" },
    { value: "legal", labelAr: "مستشار قانوني", labelEn: "Legal Advisor" },
    { value: "undersecretary", labelAr: "وكيل الوزارة", labelEn: "Undersecretary" },
    { value: "minister", labelAr: "وزير التجارة والصناعة", labelEn: "Minister of Commerce" }
  ];

  const handleUpdateStatus = async (id: string, status: string, notes: string) => {
    try {
      await onUpdateComplaintStatus(id, status, notes);
      
      // Post to immutable audit ledger
      const chars = "abcdef0123456789";
      let mockHash = "";
      for (let i = 0; i < 40; i++) {
        mockHash += chars[Math.floor(Math.random() * chars.length)];
      }

      await onAddAuditLog({
        actionAr: `تحديث حالة البلاغ ${id} إلى ${status} مع الملاحظات: ${notes}`,
        actionEn: `Grievance ${id} status updated to ${status} by role ${selectedRole}`,
        actorName: roles.find(r => r.value === selectedRole)?.labelAr || "مسؤول",
        actorRole: selectedRole,
        hash: mockHash
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealStore || !appealReason) return;

    const newAppeal = {
      id: `ap-${Date.now().toString().slice(-4)}`,
      storeName: appealStore,
      fineId: appealInvoice || "N/A",
      reason: appealReason,
      status: "pending",
      date: new Date().toISOString()
    };

    setAppeals([newAppeal, ...appeals]);
    setAppealStore("");
    setAppealInvoice("");
    setAppealReason("");
  };

  const handleUpdateAppeal = (id: string, status: "approved" | "rejected") => {
    setAppeals(appeals.map(ap => ap.id === id ? { ...ap, status } : ap));
  };

  return (
    <div id="sovereign-enforcement-tab" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Role Selection & Subtabs Left Column */}
      <div className="lg:col-span-1 space-y-4">
        
        {/* Role Selector Card */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <h4 className="text-xs font-black text-slate-800 pb-2 border-b border-gray-100 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-sudan-green" />
            {currentLanguage === "ar" ? "الهوية الحكومية الرقمية" : "Digital Staff Role ID"}
          </h4>
          <div className="space-y-1">
            {roles.map(r => (
              <button
                key={r.value}
                onClick={() => setSelectedRole(r.value)}
                className={`w-full text-right px-3.5 py-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedRole === r.value
                    ? "bg-sudan-green/10 text-sudan-green border-l-4 border-sudan-green font-black"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{currentLanguage === "ar" ? r.labelAr : r.labelEn}</span>
                {selectedRole === r.value && <ShieldCheck className="h-4 w-4 text-sudan-green" />}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Tab list */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-1.5">
          <button
            onClick={() => setActiveWorkspaceTab("complaints")}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeWorkspaceTab === "complaints" ? "bg-slate-100 text-slate-800 font-black" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            {currentLanguage === "ar" ? "حقيبة الشكاوى والبلاغات" : "Active Inboxes"}
          </button>
          <button
            onClick={() => setActiveWorkspaceTab("appeals")}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeWorkspaceTab === "appeals" ? "bg-slate-100 text-slate-800 font-black" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Scale className="h-4 w-4" />
            {currentLanguage === "ar" ? "طلبات الاستئناف التجاري" : "Legal Appeals"}
          </button>
          <button
            onClick={() => setActiveWorkspaceTab("audit")}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeWorkspaceTab === "audit" ? "bg-slate-100 text-slate-800 font-black" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <History className="h-4 w-4" />
            {currentLanguage === "ar" ? "سجل التدقيق الرقمي السيادي" : "Immutable Audit Trails"}
          </button>
        </div>

      </div>

      {/* Interactive Board Right 3 Columns */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          
          {activeWorkspaceTab === "complaints" && (
            <motion.div
              key="workspace-complaints"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "معالجة بلاغات وقضايا الجمهور" : "Grievance Processing Queue"}</h4>
              </div>

              <div className="divide-y divide-gray-100">
                {complaints.map(comp => (
                  <div key={comp.id} className="p-5 space-y-4 hover:bg-slate-50/50 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h5 className="font-extrabold text-slate-800 text-xs md:text-sm">{comp.storeName}</h5>
                        <p className="text-[11px] text-slate-400">{comp.state} - {comp.city}</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        comp.status === "resolved" ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-amber-50 text-amber-800 border-amber-100"
                      }`}>
                        {comp.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-150">
                      {comp.details}
                    </p>

                    {/* Action Panel for inspectors/officers */}
                    {comp.status !== "resolved" && (
                      <div className="pt-3 border-t border-dashed border-gray-200 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleUpdateStatus(comp.id, "investigating", "جاري التحقيق الميداني للتأكد من الموازين والتسعيرة الرسمية عبر المفتشين.")}
                          className="bg-sudan-dark hover:bg-slate-100 text-slate-900 border border-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                        >
                          {currentLanguage === "ar" ? "مباشرة التحقيق الميداني" : "Investigate File"}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(comp.id, "resolved", "تم التأكد من التزام المحل بالتسعيرة وتوقيع العقوبات المقررة وتعهد المالك خطياً.")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-lg cursor-pointer transition-all"
                        >
                          {currentLanguage === "ar" ? "حسم القضية وتغريم التاجر" : "Resolve & Issue Fine"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {complaints.length === 0 && (
                  <div className="p-10 text-center text-slate-400 text-xs">
                    {currentLanguage === "ar" ? "لا توجد بلاغات مسجلة بانتظار المعالجة" : "Complaints inbox is empty"}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeWorkspaceTab === "appeals" && (
            <motion.div
              key="workspace-appeals"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Submission of appeals */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 text-slate-700 text-xs">
                <h4 className="font-extrabold text-slate-800 text-xs md:text-sm uppercase tracking-wider">{currentLanguage === "ar" ? "تقديم طلب تظلم / استئناف تجاري" : "Submit Judicial Appeal"}</h4>
                <p className="text-slate-400 text-[10px]">
                  {currentLanguage === "ar" ? "تتيح الخدمة للتجار الاستئناف ضد قرارات المفتشين الميدانيين أمام الشؤون القانونية للوزارة." : "Permits merchants to legally appeal field citations with legal counsel."}
                </p>

                <form onSubmit={handleAppeal} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "اسم منشأتك المشتكية *" : "Merchant Store *"}</label>
                      <input type="text" required value={appealStore} onChange={(e) => setAppealStore(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "رقم الفاتورة أو الغرامة إن وجد *" : "Fine Invoice ID *"}</label>
                      <input type="text" value={appealInvoice} onChange={(e) => setAppealInvoice(e.target.value)} placeholder="e.g. INV-2026-..." className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "مستندات التظلم الرسمية" : "Appeal Documentation"}</label>
                      <div className="w-full bg-slate-100 border border-dashed border-slate-300 p-2 rounded-xl text-center text-[10px] text-slate-500 font-bold">
                        {currentLanguage === "ar" ? "تحميل عريضة التظلم" : "Upload File"}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">{currentLanguage === "ar" ? "أسباب طلب الاستئناف والتظلم بالتفصيل *" : "Detailed Legal Grounds *"}</label>
                    <textarea required rows={2} value={appealReason} onChange={(e) => setAppealReason(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl resize-none" />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-sudan-green text-white font-black px-6 py-2 rounded-xl cursor-pointer shadow hover:bg-sudan-green-light transition-all">
                      {currentLanguage === "ar" ? "تقديم طلب الاستئناف رسمياً" : "Submit Appeal Order"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Appeals Queue List */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{currentLanguage === "ar" ? "حقيبة طلبات التظلم الجاري تدقيقها" : "Active Appeals Review Queue"}</h4>
                </div>

                <div className="divide-y divide-gray-100">
                  {appeals.map(ap => (
                    <div key={ap.id} className="p-5 space-y-3 hover:bg-slate-50/50">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <h5 className="font-extrabold text-slate-800 text-xs">{ap.storeName}</h5>
                          <p className="text-[10px] text-slate-400">Invoice: {ap.fineId} | Date: {new Date(ap.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          ap.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : ap.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {ap.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                        {ap.reason}
                      </p>

                      {ap.status === "pending" && (selectedRole === "legal" || selectedRole === "undersecretary" || selectedRole === "minister") && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateAppeal(ap.id, "approved")}
                            className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                          >
                            {currentLanguage === "ar" ? "قبول الالتماس وإلغاء الغرامة" : "Approve & Void Fine"}
                          </button>
                          <button
                            onClick={() => handleUpdateAppeal(ap.id, "rejected")}
                            className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                          >
                            {currentLanguage === "ar" ? "رفض الالتماس وتثبيت القرار" : "Reject Appeal"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {activeWorkspaceTab === "audit" && (
            <motion.div
              key="workspace-audit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="h-4.5 w-4.5 text-slate-900" />
                  {currentLanguage === "ar" ? "سجل التدقيق والنزاهة الحكومية الموحد" : "Immutable Sovereign Audit Trails"}
                </h4>
                <p className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "قيد رقمي غير قابل للتعديل يوثق الأنشطة والتوقيعات الإلكترونية للمسؤولين لمنع التلاعب والفساد" : "Unmodifiable cryptographic logging of administrative decisions to guarantee total integrity."}</p>
              </div>

              {/* SHA Ledger Lists */}
              <div className="space-y-4">
                {auditLedger.map(log => (
                  <div key={log.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-2 text-xs">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? log.actionAr : log.actionEn}</p>
                        <p className="text-[10px] text-slate-400">{log.actorName} ({log.actorRole}) | {new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                      <span className="text-[9px] bg-slate-900 text-emerald-400 font-mono px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>INTEGRITY SEALED</span>
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-mono bg-slate-200/50 p-2 rounded truncate">HASH: {log.hash}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
