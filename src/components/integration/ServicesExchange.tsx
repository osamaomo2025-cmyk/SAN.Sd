import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Workflow, Share2, Search, CheckSquare, Sparkles, RefreshCw, HelpCircle, ArrowRight, Check, Play, ClipboardList, ShieldCheck } from "lucide-react";

interface ServicesExchangeProps {
  currentLanguage: "ar" | "en";
}

export default function ServicesExchange({ currentLanguage }: ServicesExchangeProps) {
  const [exchService, setExchService] = useState("SRV-REG-LLC");
  const [exchWorkflowLogs, setExchWorkflowLogs] = useState<string[]>([]);
  const [exchWorkflowStep, setExchWorkflowStep] = useState(0);
  const [isRoutingService, setIsRoutingService] = useState(false);
  const [certVerifyInput, setCertVerifyInput] = useState("CO-SD-2026-5541");
  const [certVerifyResult, setCertVerifyResult] = useState<any>(null);
  const [isVerifyingCert, setIsVerifyingCert] = useState(false);

  const workflowSteps = [
    { agency: "sdmci", labelAr: "وزارة التجارة - تقديم الطلب", labelEn: "SDMCI Inbound Ingress" },
    { agency: "registry", labelAr: "السجل المدني - مطابقة الهوية", labelEn: "Civil Registry Audit" },
    { agency: "tax", labelAr: "ديوان الضرائب - خلو طرف ساري", labelEn: "Tax Clearance Verification" },
    { agency: "cbs", labelAr: "البنك المركزي - إيداع رأس المال", labelEn: "Central Bank Capital Verification" },
    { agency: "justice", labelAr: "وزارة العدل - توثيق العقد", labelEn: "Ministry of Justice Notarization" }
  ];

  const handleRunWorkflowRouter = () => {
    setIsRoutingService(true);
    setExchWorkflowStep(0);
    const logs: string[] = [];
    logs.push(`[${new Date().toLocaleTimeString()}] INGRESS: Service Request registered on ESB platform.`);
    setExchWorkflowLogs([...logs]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setExchWorkflowStep(step);
      
      const currentStep = workflowSteps[step];
      if (currentStep) {
        logs.push(`[${new Date().toLocaleTimeString()}] ROUTING: Handing off payload securely to: ${currentStep.labelEn}`);
        setExchWorkflowLogs([...logs]);
      }

      if (step >= workflowSteps.length - 1) {
        clearInterval(interval);
        setIsRoutingService(false);
        logs.push(`[${new Date().toLocaleTimeString()}] SUCCESS: Inter-ministerial workflow completed with full cryptographic seals.`);
        setExchWorkflowLogs([...logs]);
      }
    }, 1200);
  };

  const runVerifyCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certVerifyInput.trim()) return;
    setIsVerifyingCert(true);
    setCertVerifyResult(null);

    setTimeout(() => {
      setIsVerifyingCert(false);
      setCertVerifyResult({
        certId: certVerifyInput,
        valid: true,
        entityNameAr: "المؤسسة الوطنية لتطوير الصمغ العربي",
        entityNameEn: "National Gum Arabic Development Corp",
        issueDate: "2026-06-20",
        governingLawAr: "المادة 14 لقانون معايير فرز وتصدير الصمغ العربي لجمهورية السودان لعام 2026",
        governingLawEn: "Section 14 of Gum Arabic Standards & Export Regulation 2026",
        signatureHash: `sha256-cert_sig_${Math.random().toString(36).substring(2, 18).toUpperCase()}`,
        status: "VALID / SOVEREIGN RECORD MATCHED"
      });
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6" id="module-services-exchange">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
          <Workflow className="w-5 h-5 text-emerald-600" />
          <span>{currentLanguage === "ar" ? "منصة تبادل الخدمات الرقمية والمسارات الحكومية" : "Government Digital Services Exchange & Router"}</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {currentLanguage === "ar"
            ? "كتالوج ومحرك المسارات المشتركة لتشغيل وتتبع المعاملات المعقدة بين الوزارات والهيئات الاتحادية وتدقيق الوثائق السيادية."
            : "Centralized routing and service exchange mapping multi-agency workflows, cross-ministerial approvals, and digital certificate validation."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Workflows Router */}
        <div className="lg:col-span-7 bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              {currentLanguage === "ar" ? "محاكي المسارات بين الوزارات" : "Cross-Agency Workflow Router"}
            </h4>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Sovereign ESB</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "الخدمة المشتركة المستهدفة" : "Target Shared Service Workflow"}</label>
              <select
                value={exchService}
                onChange={(e) => setExchService(e.target.value)}
                disabled={isRoutingService}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none"
              >
                <option value="SRV-REG-LLC">{currentLanguage === "ar" ? "تأسيس شركة ذات مسؤولية محدودة مدمجة" : "Incorporation of LLC - Fully Integrated"}</option>
                <option value="SRV-LIC-IND">{currentLanguage === "ar" ? "رخصة تشغيل صناعي للمصانع" : "Factory Industrial Operating Permit"}</option>
                <option value="SRV-PERM-IMP">{currentLanguage === "ar" ? "رخصة استيراد سنوية للشركات" : "Annual Corporate Import Permit"}</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunWorkflowRouter}
                disabled={isRoutingService}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1"
              >
                {isRoutingService ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>ROUTING TRANSACTION...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{currentLanguage === "ar" ? "تشغيل وتتبع مسار المعاملة" : "Initiate Cross-Agency Routing"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Graphical Step-by-Step workflow router status */}
          <div className="space-y-3 pt-2">
            <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">{currentLanguage === "ar" ? "حالة مسار الموافقات المتعددة" : "Multi-Stage Routing Sequence"}</div>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 bg-white p-4 rounded-xl border border-gray-200">
              {workflowSteps.map((step, idx) => {
                const isCurrent = exchWorkflowStep === idx;
                const isDone = exchWorkflowStep > idx;
                return (
                  <React.Fragment key={step.agency}>
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isDone 
                          ? "bg-emerald-600 text-white" 
                          : isCurrent 
                          ? "bg-amber-500 text-slate-950 animate-pulse" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="text-[10px] font-bold text-gray-700 leading-tight">
                        <span className="block font-semibold">{step.agency.toUpperCase()}</span>
                        <span className="text-[9px] text-gray-400">{currentLanguage === "ar" ? step.labelAr : step.labelEn}</span>
                      </div>
                    </div>
                    {idx < workflowSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Workflow logs terminal */}
          {exchWorkflowLogs.length > 0 && (
            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-mono mb-1 uppercase">Sovereign Routing Logs</label>
              <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 font-mono text-[10px] overflow-y-auto max-h-32 space-y-1 leading-relaxed">
                {exchWorkflowLogs.map((log, index) => (
                  <div key={index} className="flex gap-1">
                    <span className="text-emerald-500 font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Digital Certificate Verification */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-4 shadow-sm flex-1">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
              <span>{currentLanguage === "ar" ? "مدقق التواقيع والشهادات السيادية" : "Sovereign Certificate Verifier"}</span>
            </h4>

            <p className="text-xs text-gray-500 leading-normal">
              {currentLanguage === "ar"
                ? "أدخل رمز المعرف الموحد لأي ترخيص أو شهادة منشأ للتحقق من سلامتها السيادية ومطابقتها للسجلات الحية."
                : "Verify the legal authenticity of any state-issued document or compliance clearance certificate against the synchronized national registry ledger."}
            </p>

            <form onSubmit={runVerifyCertificate} className="flex gap-2">
              <input
                type="text"
                value={certVerifyInput}
                onChange={(e) => setCertVerifyInput(e.target.value)}
                placeholder="e.g. CO-SD-2026-5541"
                className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs font-mono font-bold focus:outline-none"
              />
              <button
                type="submit"
                disabled={isVerifyingCert}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                {isVerifyingCert ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckSquare className="w-3.5 h-3.5" />}
                <span>{currentLanguage === "ar" ? "تدقيق" : "Verify"}</span>
              </button>
            </form>

            <AnimatePresence mode="wait">
              {certVerifyResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-emerald-50/20 border border-emerald-100 space-y-2 text-[11px] font-mono text-slate-700"
                >
                  <div className="flex justify-between items-center border-b border-emerald-100/50 pb-1.5 mb-1.5">
                    <span className="font-bold text-emerald-800">{certVerifyResult.status}</span>
                    <span className="text-[9px] text-emerald-600">MATCHED</span>
                  </div>
                  <div className="space-y-1 text-slate-800">
                    <div>
                      <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "المنشأة المستفيدة" : "Beneficiary Entity"}</span>
                      <span className="font-bold">{currentLanguage === "ar" ? certVerifyResult.entityNameAr : certVerifyResult.entityNameEn}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "الرقم التعريفي" : "Certificate ID"}</span>
                      <span className="font-bold text-amber-700">{certVerifyResult.certId}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "السند التنظيمي والقانوني" : "Governing Decree"}</span>
                      <span className="font-bold leading-relaxed">{currentLanguage === "ar" ? certVerifyResult.governingLawAr : certVerifyResult.governingLawEn}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-gray-400 text-[9px] block uppercase">SHA256 DIGITAL IMMUTABLE SIGNATURE</span>
                      <span className="text-[10px] text-emerald-700 font-bold overflow-hidden text-ellipsis block">{certVerifyResult.signatureHash}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
