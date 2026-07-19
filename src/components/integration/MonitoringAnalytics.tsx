import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { LineChart, Line } from "recharts";
import { Activity, ShieldAlert, FileText, Search, RefreshCw, BarChart2, Star, AlertTriangle, TrendingUp, Cpu } from "lucide-react";

interface MonitoringAnalyticsProps {
  currentLanguage: "ar" | "en";
}

export default function MonitoringAnalytics({ currentLanguage }: MonitoringAnalyticsProps) {
  const [liveLogSearch, setLiveLogSearch] = useState("");
  const [syslogs, setSyslogs] = useState([
    { id: "LOG-01", type: "INFO", message: "mTLS Handshake completed with Central Bank (cbs)", source: "Gateway", time: "11:15:02" },
    { id: "LOG-02", type: "WARN", message: "OWASP Shield: Rate-limiting window triggered for IP 196.1.200.12", source: "WAF", time: "11:15:12" },
    { id: "LOG-03", type: "INFO", message: "SAML 2.0 Identity Federated for Ahmed Bin Mohammed (Civil Registry)", source: "IdP", time: "11:15:18" },
    { id: "LOG-04", type: "ERROR", message: "Database connection Timeout to Customs Port-09 server - Auto failing over", source: "DB-Proxy", time: "11:15:24" },
    { id: "LOG-05", type: "INFO", message: "Sovereign SHA-256 Stamp Applied to Import License Certificate #CO-821", source: "ESB-Sealer", time: "11:15:31" }
  ]);

  // Generate mock live traffic data
  const trafficData = [
    { name: "11:10", reqs: 1450, ping: 12 },
    { name: "11:11", reqs: 1820, ping: 14 },
    { name: "11:12", reqs: 1650, ping: 11 },
    { name: "11:13", reqs: 2300, ping: 19 },
    { name: "11:14", reqs: 2900, ping: 25 },
    { name: "11:15", reqs: 2450, ping: 15 }
  ];

  // Agency transaction volume data for Recharts
  const agencyData = [
    { name: currentLanguage === "ar" ? "العدل" : "MOJ", count: 42000, color: "#10b981" },
    { name: currentLanguage === "ar" ? "الضرائب" : "Taxes", count: 85000, color: "#3b82f6" },
    { name: currentLanguage === "ar" ? "المركزي" : "CBS", count: 124000, color: "#f59e0b" },
    { name: currentLanguage === "ar" ? "الجمارك" : "Customs", count: 68000, color: "#6366f1" },
    { name: currentLanguage === "ar" ? "السجل المدني" : "Civil ID", count: 190000, color: "#ec4899" }
  ];

  const filteredLogs = syslogs.filter(log => 
    log.message.toLowerCase().includes(liveLogSearch.toLowerCase()) ||
    log.type.toLowerCase().includes(liveLogSearch.toLowerCase()) ||
    log.source.toLowerCase().includes(liveLogSearch.toLowerCase())
  );

  return (
    <div className="space-y-6" id="module-monitoring-analytics">
      {/* SECTION A: EXECUTIVE NATIONAL GOV DASHBOARD (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="national-dashboard-kpis">
        {[
          { labelAr: "معدل الرقمنة الشامل", labelEn: "Zero Paper Integration", value: "98.4%", descAr: "الاستغناء الكامل عن الورق", descEn: "Target 100% by Dec 2026", color: "border-emerald-500 text-emerald-600", bg: "bg-emerald-50/30" },
          { labelAr: "تكامل السجل المدني الفيدرالي", labelEn: "SSO Identity Coverage", value: "100%", descAr: "ربط كامل الفئات المستهدفة", descEn: "Federal Civil Registry SSO active", color: "border-blue-500 text-blue-600", bg: "bg-blue-50/30" },
          { labelAr: "متوسط زمن المعاملة البينية", labelEn: "Interoperability Speed", value: "1.4s", descAr: "من الموثق للمركزي للجمارك", descEn: "Average approval workflow lag", color: "border-amber-500 text-amber-600", bg: "bg-amber-50/30" },
          { labelAr: "أحداث الأمن السيبراني المحمية", labelEn: "Security WAF Blocks", value: "1,249", descAr: "حظر تلقائي للمحاولات غير المشروعة", descEn: "Zero data leaks or breaches", color: "border-purple-500 text-purple-600", bg: "bg-purple-50/30" }
        ].map((kpi, idx) => (
          <div key={idx} className={`p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between ${kpi.bg}`}>
            <div>
              <span className="text-gray-400 text-[10px] block font-bold uppercase tracking-wider">
                {currentLanguage === "ar" ? kpi.labelAr : kpi.labelEn}
              </span>
              <span className="text-3xl font-extrabold font-mono text-slate-900 block mt-1">{kpi.value}</span>
            </div>
            <span className="text-gray-500 text-[10.5px] mt-2 block font-medium">
              {currentLanguage === "ar" ? kpi.descAr : kpi.descEn}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart A: Live traffic metrics AreaChart (Module 8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <div>
              <h4 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-arabic)" }}>
                {currentLanguage === "ar" ? "رصد حركة البيانات والكمون اللحظي عبر البوابة" : "Sovereign Gateway Traffic & Latency"}
              </h4>
              <p className="text-xs text-gray-400">{currentLanguage === "ar" ? "رصد حي لحجم الطلبات req/sec والسرعة" : "Real-time auditing of API gateway load and response delays"}</p>
            </div>
            <Activity className="w-5 h-5 text-emerald-600 animate-pulse shrink-0" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="reqs" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReqs)" name="Requests/sec" />
                <Line type="monotone" dataKey="ping" stroke="#f59e0b" strokeWidth={2} name="Ping (ms)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Agency Volumes BarChart (Module 9) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <div>
              <h4 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-arabic)" }}>
                {currentLanguage === "ar" ? "حجم المعاملات حسب الجهة الحكومية" : "Cumulative Volumes by Agency"}
              </h4>
              <p className="text-xs text-gray-400">{currentLanguage === "ar" ? "مجموع المزامنات والتحويلات الناجحة" : "Reconciled ledger transactions"}</p>
            </div>
            <BarChart2 className="w-5 h-5 text-emerald-600 shrink-0" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Reconciliations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION C: SEARCHABLE SYSTEM LOGS AUDITING TERMINAL (Module 8/10) */}
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border border-slate-800">
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-500 animate-spin" />
            <div>
              <span className="font-mono text-xs font-bold text-gray-300">SECURE SOVEREIGN CORRESPONDENCE SYSLOG v2.0</span>
              <span className="text-[10px] text-emerald-500 block">ENFORCING CRYPTOGRAPHIC REGULATORY COMPLIANCE</span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={liveLogSearch}
              onChange={(e) => setLiveLogSearch(e.target.value)}
              placeholder={currentLanguage === "ar" ? "ابحث في سجل الحماية (WAF, DB...)" : "Filter syslogs..."}
              className="pl-9 pr-4 py-1.5 bg-slate-900 text-xs rounded-lg border border-slate-800 focus:border-emerald-500 focus:outline-none w-full sm:w-64 font-mono transition-all text-white"
            />
          </div>
        </div>

        <div className="p-5 font-mono text-xs space-y-2 max-h-48 overflow-y-auto leading-relaxed">
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <div key={log.id} className="flex flex-col sm:flex-row gap-2 border-b border-slate-950/40 pb-2">
                <span className="text-gray-500 shrink-0">[{log.time}]</span>
                <span className={`font-bold shrink-0 text-[10px] px-1.5 py-0.2 rounded ${
                  log.type === "INFO" ? "bg-emerald-950 text-emerald-400" : log.type === "WARN" ? "bg-amber-950 text-amber-400" : "bg-red-950 text-red-400"
                }`}>
                  {log.type}
                </span>
                <span className="text-slate-400 shrink-0">({log.source}):</span>
                <span className="text-slate-200" style={{ fontFamily: "var(--font-arabic)" }}>{log.message}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-6">No matching syslog rows. Try filtering by "WAF", "mTLS", or "SAML".</div>
          )}
        </div>
      </div>
    </div>
  );
}
