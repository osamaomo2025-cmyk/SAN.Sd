import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, Landmark, Check, RefreshCw, AlertTriangle, ShieldCheck, FileSpreadsheet, Sparkles } from "lucide-react";

interface PaymentsIntegrationProps {
  currentLanguage: "ar" | "en";
}

export default function PaymentsIntegration({ currentLanguage }: PaymentsIntegrationProps) {
  const [payFeeType, setPayFeeType] = useState("company");
  const [payAmount, setPayAmount] = useState(150000);
  const [isPayingFee, setIsPayingFee] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<any>(null);

  const feeStructures: { [key: string]: { labelAr: string; labelEn: string; defaultAmt: number } } = {
    company: { labelAr: "رسوم تأسيس وتسجيل الشركة", labelEn: "Corporate Incorporation Fee", defaultAmt: 150000 },
    license: { labelAr: "رسوم تجديد ترخيص الممارسة السنوي", labelEn: "Annual Practice License Renewal", defaultAmt: 85000 },
    permit: { labelAr: "رسوم رخصة تشغيل منشأة صناعية", labelEn: "Industrial Facility Operating Permit Fee", defaultAmt: 320000 },
    penalty: { labelAr: "تسوية غرامة مخالفة تجارية", labelEn: "Settlement of Commercial Non-Compliance Fine", defaultAmt: 50000 }
  };

  const handlePayFee = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPayingFee(true);
    setPaidReceipt(null);

    setTimeout(() => {
      setIsPayingFee(false);
      const randRef = Math.floor(10000000 + Math.random() * 90000000);
      const randHash = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

      setPaidReceipt({
        referenceId: `CBS-TX-${randRef}`,
        gateway: "Central Bank of Sudan - EBS Integration",
        timestamp: new Date().toISOString(),
        amount: payAmount,
        feeType: payFeeType,
        status: "SETTLED / RECONCILED",
        sha256LedgerHash: `0x${randHash}`,
        accountBind: "SDMCI-TREASURY-01"
      });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6" id="module-payments-integration">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
          <CreditCard className="w-5 h-5 text-emerald-600" />
          <span>{currentLanguage === "ar" ? "الربط والبوابة الوطنية للتحصيل والمدفوعات الرقمية" : "National Digital Payments & Fees Settlement"}</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {currentLanguage === "ar"
            ? "الربط الآمن الفوري عبر محول بنك السودان المركزي (EBS) لتحصيل وتسوية رسوم تراخيص وسجلات وزارة التجارة والصناعة."
            : "Authorized gateway integration with the Central Bank of Sudan (EBS) to reconcile and settle licensing and corporate registration fees instantly."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Fees settlement Form */}
        <div className="lg:col-span-5 bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            {currentLanguage === "ar" ? "دفع وتسوية الرسوم الفيدرالية" : "Federal Fee Authorization & Settlement"}
          </h4>

          <form onSubmit={handlePayFee} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "فئة الرسم المستهدف" : "Fee Category"}</label>
              <select
                value={payFeeType}
                onChange={(e) => {
                  setPayFeeType(e.target.value);
                  setPayAmount(feeStructures[e.target.value].defaultAmt);
                }}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none"
              >
                {Object.keys(feeStructures).map(k => (
                  <option key={k} value={k}>
                    {currentLanguage === "ar" ? feeStructures[k].labelAr : feeStructures[k].labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "المبلغ المستحق (جنيه سوداني)" : "Amount Due (SDG)"}</label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-mono font-bold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPayingFee}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1 shadow-md"
            >
              {isPayingFee ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>SECURING EBS INTERFACE...</span>
                </>
              ) : (
                <>
                  <Landmark className="w-4 h-4" />
                  <span>{currentLanguage === "ar" ? "تفويض وتحصيل الرسوم الفوري" : "Authorize Settlement with Central Bank"}</span>
                </>
              )}
            </button>
          </form>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200/50 text-[10.5px] text-blue-900 leading-normal">
            <div className="flex gap-1.5 font-bold mb-1 items-center">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Sovereign mTLS Merchant Guard</span>
            </div>
            <p>
              {currentLanguage === "ar"
                ? "جميع المدفوعات تتم وتوثق عبر قناة VPN مشفرة مباشرة مع البنك المركزي لضمان مطابقة الإيرادات العامة."
                : "All payments and financial events are audited through dedicated mTLS host keys directly on Central Bank ledger APIs."}
            </p>
          </div>
        </div>

        {/* Right Side: Print-friendly receipt design */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {isPayingFee ? (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-500 font-mono">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
              <span>[EBS BANK PROTOCOL] Requesting authorization signature from Central Bank gateway...</span>
            </div>
          ) : paidReceipt ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[300px]"
            >
              {/* Receipt Header styling */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />

              <div className="border-b border-gray-100 pb-3 mb-4 flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-mono text-emerald-700 font-bold uppercase tracking-widest block">TREASURY TAX RECEIPT</span>
                  <h5 className="font-bold text-gray-900 text-xs mt-0.5" style={{ fontFamily: "var(--font-arabic)" }}>
                    {currentLanguage === "ar" ? "وزارة المالية | إيصال سداد سيادي موحد" : "MINISTRY OF FINANCE | SOVEREIGN PAYMENT RECEIPT"}
                  </h5>
                </div>
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Receipt detail rows */}
              <div className="space-y-3 flex-1 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-b border-gray-50 pb-3">
                  <div>
                    <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "رقم المرجع المصرفي" : "Bank Reference"}</span>
                    <span className="font-bold font-mono text-slate-950 text-[11px]">{paidReceipt.referenceId}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "تاريخ ووقت المعاملة" : "Settled At"}</span>
                    <span className="font-bold font-mono text-slate-700">{new Date(paidReceipt.timestamp).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "بند الرسوم المخلص" : "Settled Ledger Item"}</span>
                    <span className="font-bold text-slate-800" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? feeStructures[paidReceipt.feeType].labelAr : feeStructures[paidReceipt.feeType].labelEn}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "بوابة الدفع والخصم" : "Payment Gateway Source"}</span>
                    <span className="font-semibold text-emerald-700 font-mono text-[10px]">{paidReceipt.gateway}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-500 uppercase text-[10px]">{currentLanguage === "ar" ? "المجموع المدفوع بالكامل" : "Total Amount Settled"}</span>
                  <span className="text-xl font-bold font-mono text-emerald-700">{paidReceipt.amount.toLocaleString()} SDG</span>
                </div>

                <div className="pt-2 text-[9px] text-gray-400 font-mono">
                  <span className="block uppercase text-[8px] font-bold text-gray-500">CBS DECENTRALIZED RECONCILIATION HASH</span>
                  <span className="block text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">{paidReceipt.sha256LedgerHash}</span>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-dashed border-gray-200 flex justify-between items-center text-[9px] text-gray-400">
                <span>RECONCILED ACCOUNT: {paidReceipt.accountBind}</span>
                <span className="font-bold text-emerald-600 uppercase flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>PAYMENT CLEAR</span>
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[220px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 text-xs text-gray-400 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mb-2 animate-pulse" />
              <p className="font-semibold" style={{ fontFamily: "var(--font-arabic)" }}>
                {currentLanguage === "ar" ? "في انتظار إرسال طلب الدفع الفوري" : "Fees payment reconciliation pending"}
              </p>
              <p className="text-[10.5px] text-gray-400 mt-1 max-w-sm">
                {currentLanguage === "ar"
                  ? "اختر بند الرسم، حدد القيمة المالية واضغط على تحصيل الرسوم لتشغيل محاكاة معالجة البنك المركزي."
                  : "Select a payment item, enter the total fee structure and click pay to initiate direct mTLS mock gateway reconciliation with the Central Bank of Sudan."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
