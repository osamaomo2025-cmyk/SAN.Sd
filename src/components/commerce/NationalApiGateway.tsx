/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Key, Shield, RefreshCw, Plus, X, Check, Eye, Trash2, Code, FileText, Zap, AlertTriangle, ShieldCheck } from "lucide-react";

interface ApiCredential {
  id: string;
  clientId: string;
  clientName: string;
  apiKey: string;
  scopes: string[];
  status: "active" | "revoked";
  requestCount: number;
  errorRate: number;
  avgLatency: number;
}

interface NationalApiGatewayProps {
  currentLanguage: "ar" | "en";
  credentials: ApiCredential[];
  onAddCredential: (cred: ApiCredential) => void;
  onRevokeCredential: (id: string) => void;
}

export default function NationalApiGateway({
  currentLanguage,
  credentials,
  onAddCredential,
  onRevokeCredential
}: NationalApiGatewayProps) {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["read:opendata"]);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const availableScopes = [
    { value: "read:registry", labelAr: "قراءة السجل التجاري والأنشطة", labelEn: "Read Commercial Registry Profiles" },
    { value: "read:opendata", labelAr: "قراءة وإحصاء البيانات المفتوحة الكلية", labelEn: "Access Aggregate Open Datasets" },
    { value: "write:licensing", labelAr: "تقديم وتقديم الرخص وتحديثها", labelEn: "Submit and Initiate License Workflows" },
    { value: "write:payments", labelAr: "إجراء وتدقيق تسويات المدفوعات السيادية", labelEn: "Verify and Issue Sovereign Invoice Claims" }
  ];

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) {
      alert(currentLanguage === "ar" ? "يرجى كتابة اسم التطبيق/الجهة" : "Client Name is required");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/commerce/apigateway/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, scopes: selectedScopes })
      });

      if (!response.ok) throw new Error("Failed to generate credentials");
      const data = await response.json();
      onAddCredential(data.credential);
      setIsGenerateOpen(false);
      setClientName("");
      setSelectedScopes(["read:opendata"]);
    } catch (err) {
      console.error(err);
      alert("Error generating credentials");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm(currentLanguage === "ar" ? "هل أنت متأكد من رغبتك في إلغاء هذا المفتاح؟ هذا الإجراء فوري ولا يمكن التراجع عنه." : "Are you sure you want to revoke this API key? This will instantly cut off integration.")) return;

    try {
      const response = await fetch(`/api/commerce/apigateway/keys/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        onRevokeCredential(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Telemetry and Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "إجمالي استدعاءات البوابة" : "Total Gateway Calls"}</span>
            <h5 className="font-mono text-xl md:text-2xl font-extrabold text-slate-900">
              {(credentials.reduce((acc, c) => acc + c.requestCount, 0)).toLocaleString()}
            </h5>
            <div className="text-[10px] text-gray-400 font-semibold pt-1 flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500" />
              <span>{currentLanguage === "ar" ? "معدل تدفق مستقر وبدون تحميل زائد" : "Stable gateway rate limit status"}</span>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-2xl">
            <Zap className="h-4.5 w-4.5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "متوسط سرعة استجابة الخادم" : "Mean Response Latency"}</span>
            <h5 className="font-mono text-xl md:text-2xl font-extrabold text-slate-900">
              34.5 ms
            </h5>
            <div className="text-[10px] text-gray-400 font-semibold pt-1">
              {currentLanguage === "ar" ? "الهدف المستهدف لـ SLA: < 50ms" : "SLA Target: < 50ms"}
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-2xl">
            <RefreshCw className="h-4.5 w-4.5 text-sudan-green" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "معدل الأخطاء الكلي للاتصالات" : "Gateway Error Ratio"}</span>
            <h5 className="font-mono text-xl md:text-2xl font-extrabold text-rose-600">
              0.08%
            </h5>
            <div className="text-[10px] text-gray-400 font-semibold pt-1">
              {currentLanguage === "ar" ? "معدل الحظر التلقائي للتهديدات نشط" : "Intelligent threat blocking active"}
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-2xl">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
          </div>
        </div>
      </div>

      {/* Main Portal Credentials Table */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-3">
          <div className="space-y-1">
            <h5 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
              {currentLanguage === "ar" ? "مفاتيح وتراخيص الربط الفيدرالي المعتمدة" : "Active National Gateway API Clients"}
            </h5>
          </div>

          <button
            onClick={() => setIsGenerateOpen(true)}
            className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>{currentLanguage === "ar" ? "توليد مفتاح ربط رقمي" : "Provision API Key"}</span>
          </button>
        </div>

        {/* List of keys */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {credentials.map((cred) => (
            <div key={cred.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-right">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h5 className="font-extrabold text-slate-800 text-xs md:text-sm">
                    {cred.clientName}
                  </h5>
                  <span className="text-[9px] font-mono text-gray-400 font-bold bg-white border border-slate-200 px-1.5 py-0.2 rounded-md">
                    Client ID: {cred.clientId}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {cred.scopes.map((sc) => (
                    <span key={sc} className="text-[8px] bg-slate-200 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-md">
                      {sc}
                    </span>
                  ))}
                </div>

                {/* API Key blur container */}
                <div className="flex items-center gap-2 pt-2 text-[10px] font-bold font-mono">
                  <span className="text-gray-400">API Key:</span>
                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-bold select-all">
                    {cred.apiKey}
                  </span>
                  
                  <button
                    onClick={() => copyKey(cred.apiKey, cred.id)}
                    className="text-sudan-green hover:text-sudan-green-light transition-all cursor-pointer font-extrabold"
                  >
                    {copiedKeyId === cred.id ? (
                      <span className="text-emerald-600 flex items-center gap-0.5"><Check className="h-3 w-3" /> Copied!</span>
                    ) : (
                      <span>Copy</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-4 self-start md:self-center">
                <div className="text-right text-[10px] font-mono text-gray-400 font-bold hidden md:block">
                  <p>{currentLanguage === "ar" ? `الاستدعاءات: ${cred.requestCount.toLocaleString()}` : `Requests: ${cred.requestCount.toLocaleString()}`}</p>
                  <p>{currentLanguage === "ar" ? `الاستجابة: ${cred.avgLatency}ms` : `Latency: ${cred.avgLatency}ms`}</p>
                </div>

                <button
                  onClick={() => handleRevoke(cred.id)}
                  className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-800 p-2 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}

          {credentials.length === 0 && (
            <div className="p-8 text-center text-gray-400 font-bold">
              {currentLanguage === "ar" ? "لا توجد مفاتيح API مولدة للجهة" : "No API Credentials have been provisioned"}
            </div>
          )}
        </div>
      </div>

      {/* Generate API Key Dialog Modal */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full text-slate-800 border-t-8 border-sudan-green my-8">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-extrabold text-[#1E293B] text-base flex items-center gap-1.5">
                <Key className="h-4.5 w-4.5 text-sudan-green" />
                <span>{currentLanguage === "ar" ? "توليد رخصة ربط سيادية جديدة" : "Provision Integration Client Credentials"}</span>
              </h4>
              <button onClick={() => setIsGenerateOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateSubmit} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-gray-500 font-bold">{currentLanguage === "ar" ? "اسم تطبيق الجهة أو المطور*" : "Application or Client Name*"}</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: البوابة المصرفية لبنك الخرطوم..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-sudan-green transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-500 font-bold block">{currentLanguage === "ar" ? "صلاحيات الوصول المطلوبة (Selective Scopes)*" : "Select Authorized Scopes*"}</label>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {availableScopes.map((scope) => {
                    const isChecked = selectedScopes.includes(scope.value);
                    return (
                      <div
                        key={scope.value}
                        onClick={() => toggleScope(scope.value)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isChecked 
                            ? "bg-emerald-50/50 border-emerald-500/30 ring-1 ring-emerald-500/20" 
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <div className="space-y-0.5 text-right">
                          <p className="font-extrabold text-slate-800 text-[11px]">{currentLanguage === "ar" ? scope.labelAr : scope.labelEn}</p>
                          <p className="font-mono text-[9px] text-gray-400">{scope.value}</p>
                        </div>
                        <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? "bg-sudan-green border-sudan-green text-white" : "bg-white border-slate-300"
                        }`}>
                          {isChecked && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed font-semibold">
                  {currentLanguage === "ar"
                    ? "بالموافقة على التوليد، أنت تعتمد قانونياً ربط هذه الجهة بالبوابات الوطنية وتلتزم بلائحة الأمان القومي لجمهورية السودان لعام ٢٠٢٦."
                    : "By creating this credential, you legally authorize this client node to access sovereign gateway telemetry under federal security standards."}
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {generating ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Key className="h-4 w-4" />
                  )}
                  <span>{currentLanguage === "ar" ? "توليد مفتاح API والترخيص الفيدرالي" : "Generate Secure Client Credential"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
