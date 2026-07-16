import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, FileText, CheckCircle2, 
  Search, Sparkles, Send, Eye, Shield, ListCollapse, PlusCircle,
  HelpCircle, UserCheck, Trash2, Scale, ClipboardList, Key, RefreshCw, 
  Lock, Terminal, Activity, Server, Fingerprint, Network, ChevronRight, Check, X, ShieldX, Briefcase, BarChart2, Cpu, Globe, Users
} from "lucide-react";

interface SovereignSOCPlatformProps {
  currentLanguage: "ar" | "en";
  role: string;
}

export default function SovereignSOCPlatform({ currentLanguage, role }: SovereignSOCPlatformProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"soc-dashboard" | "siem-logs" | "soar-incidents" | "pki-trust" | "vuln-mgmt" | "zero-trust" | "ai-advisor" | "deliverables">("soc-dashboard");
  
  // Impersonated SOC Role for demonstration
  const [socRole, setSocRole] = useState<string>("CISO");

  // Data States
  const [events, setEvents] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [threatIntel, setThreatIntel] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  
  // Interaction/UI states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // SIEM Filter state
  const [siemSearch, setSiemSearch] = useState("");
  const [siemSourceFilter, setSiemSourceFilter] = useState("all");
  const [siemSeverityFilter, setSiemSeverityFilter] = useState("all");

  // Manual incident addition form
  const [newIncidentForm, setNewIncidentForm] = useState({
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    category: "unauthorized_access",
    severity: "high"
  });

  // Selected Active Incident for Timeline & resolution
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [newTimelineAction, setNewTimelineAction] = useState("");
  
  // Incident Mitigation State
  const [mitigationForm, setMitigationForm] = useState({
    containmentAr: "",
    containmentEn: "",
    rootCauseAr: "",
    rootCauseEn: "",
    lessonsLearnedAr: "",
    lessonsLearnedEn: "",
    nextStatus: "resolved"
  });

  // HSM Validator State
  const [hsmInput, setHsmInput] = useState("SDMCI-CONTRACT-SIGN-2026-X89");
  const [hsmSignature, setHsmSignature] = useState("");
  const [hsmVerifying, setHsmVerifying] = useState(false);
  const [hsmResult, setHsmResult] = useState<"idle" | "success" | "error">("idle");

  // Conditional Access Rule Form
  const [newPolicyForm, setNewPolicyForm] = useState({
    titleAr: "",
    titleEn: "",
    type: "conditional_access",
    rulesAr: "",
    rulesEn: "",
    status: "enforced"
  });

  // AI Cyber Defense Advisor state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiScenario, setAiScenario] = useState("threat_hunting");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch all Cybersecurity SOC data from backend APIs
  const fetchSOCData = async () => {
    setLoading(true);
    try {
      const [evs, incs, vuls, intel, certs, pols, kp, logs] = await Promise.all([
        fetch("/api/sec/events").then(r => r.json()),
        fetch("/api/sec/incidents").then(r => r.json()),
        fetch("/api/sec/vulnerabilities").then(r => r.json()),
        fetch("/api/sec/threat-intel").then(r => r.json()),
        fetch("/api/sec/certificates").then(r => r.json()),
        fetch("/api/sec/policies").then(r => r.json()),
        fetch("/api/sec/kpis").then(r => r.json()),
        fetch("/api/sec/audit-logs").then(r => r.json())
      ]);

      setEvents(evs);
      setIncidents(incs);
      setVulnerabilities(vuls);
      setThreatIntel(intel);
      setCertificates(certs);
      setPolicies(pols);
      setKpis(kp);
      setAuditLogs(logs);

      // Maintain active selected incident reference if open
      if (selectedIncident) {
        const fresh = incs.find((i: any) => i.id === selectedIncident.id);
        if (fresh) setSelectedIncident(fresh);
      }
    } catch (err) {
      console.error("Failed to load cybersecurity data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSOCData();
  }, []);

  // Quick Flash message helper
  const flashMessage = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // Simulating Live Security Attack/Ingestion
  const handleSimulateAttack = async (type: "ddos" | "brute" | "insider") => {
    setSubmitting(true);
    try {
      let payload: any = {};
      if (type === "ddos") {
        payload = {
          source: "Sovereign Gateway WAF",
          category: "network",
          severity: "critical",
          messageAr: "فيضان طلبات شبكي عارم يستهدف بوابة التراخيص والمطابقة الوطنية",
          messageEn: "Sovereign WAF Warning: High volume HTTP request flood detected on national licensing hub",
          actor: "Foreign Botnet Network",
          ipAddress: "198.51.100.85",
          status: "flagged",
          payload: "HTTP FLOOD - 120k requests per second"
        };
      } else if (type === "brute") {
        payload = {
          source: "National Interoperability Hub",
          category: "authentication",
          severity: "high",
          messageAr: "محاولة اختراق كلمات مرور متكررة لحساب ديوان معالي الوزير",
          messageEn: "Brute-force alert: Repeated failed login attempts on Sovereign Minister credentials",
          actor: "Unknown Hacking Entity",
          ipAddress: "198.51.100.201",
          status: "blocked",
          payload: "Failed logins: 45 | Target: gov_minister"
        };
      } else {
        payload = {
          source: "Commercial Registry Database",
          category: "data_access",
          severity: "medium",
          messageAr: "تنزيل جماعي غير مصرح به لسجلات عقود الموردين بفرع بورتسودان",
          messageEn: "Unusual activity: Mass bulk download of supplier contracts at Port Sudan logistic node",
          actor: "Staff Account - sdn_staff_7721",
          ipAddress: "196.29.112.50",
          status: "flagged",
          payload: "Downloaded 150 documents in 5 seconds"
        };
      }

      const res = await fetch("/api/sec/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        flashMessage(currentLanguage === "ar" 
          ? "تمت محاكاة الحدث الأمني وتوليده بنجاح! راقب التنبيهات ونظام الـ SIEM" 
          : "Security event simulated successfully! Watch the live SIEM & SOAR alerts."
        );
        fetchSOCData();
      }
    } catch (err) {
      flashMessage("Failed to simulate attack event", true);
    } finally {
      setSubmitting(false);
    }
  };

  // Adding Custom Manual Incident
  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentForm.titleAr || !newIncidentForm.titleEn) {
      flashMessage(currentLanguage === "ar" ? "الرجاء تعبئة العناوين باللغتين" : "Please provide titles in both languages", true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/sec/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newIncidentForm,
          assignedTo: socRole === "SOC Analyst" ? "soc_analyst" : "security_manager"
        })
      });
      if (res.ok) {
        flashMessage(currentLanguage === "ar" ? "تم تسجيل تذكرة بلاغ الطوارئ السيبرانية بنجاح!" : "Sovereign Incident ticket registered successfully!");
        setNewIncidentForm({
          titleAr: "",
          titleEn: "",
          descriptionAr: "",
          descriptionEn: "",
          category: "unauthorized_access",
          severity: "high"
        });
        fetchSOCData();
      }
    } catch (err) {
      flashMessage("Failed to register manual incident", true);
    } finally {
      setSubmitting(false);
    }
  };

  // Timeline Action Addition
  const handleAddTimelineAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineAction.trim() || !selectedIncident) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/sec/incidents/${selectedIncident.id}/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionAr: `إجراء تحقيق: ${newTimelineAction}`,
          actionEn: `Investigation action: ${newTimelineAction}`,
          actor: socRole
        })
      });
      if (res.ok) {
        setNewTimelineAction("");
        flashMessage(currentLanguage === "ar" ? "تم تسجيل خطوة التحقيق بنجاح!" : "Investigation step recorded in timeline!");
        fetchSOCData();
      }
    } catch (err) {
      flashMessage("Failed to append timeline action", true);
    } finally {
      setSubmitting(false);
    }
  };

  // Mitigating / Closing Incident
  const handleResolveIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;
    if (!mitigationForm.containmentAr || !mitigationForm.rootCauseAr) {
      flashMessage(currentLanguage === "ar" ? "الرجاء ملء حقول الاحتواء والسبب الجذري" : "Please fill containment & root cause fields", true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/sec/incidents/${selectedIncident.id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          containmentActionAr: mitigationForm.containmentAr,
          containmentActionEn: mitigationForm.containmentEn || mitigationForm.containmentAr,
          rootCauseAr: mitigationForm.rootCauseAr,
          rootCauseEn: mitigationForm.rootCauseEn || mitigationForm.rootCauseAr,
          lessonsLearnedAr: mitigationForm.lessonsLearnedAr,
          lessonsLearnedEn: mitigationForm.lessonsLearnedEn || mitigationForm.lessonsLearnedAr,
          nextStatus: mitigationForm.nextStatus
        })
      });
      if (res.ok) {
        flashMessage(currentLanguage === "ar" ? "تم عزل البلاغ الأمني وتصنيفه وحل التذكرة بنجاح!" : "Incident mitigated and resolved successfully!");
        setMitigationForm({
          containmentAr: "",
          containmentEn: "",
          rootCauseAr: "",
          rootCauseEn: "",
          lessonsLearnedAr: "",
          lessonsLearnedEn: "",
          nextStatus: "resolved"
        });
        fetchSOCData();
      }
    } catch (err) {
      flashMessage("Failed to resolve incident", true);
    } finally {
      setSubmitting(false);
    }
  };

  // Apply Vulnerability Patch (Updates Status)
  const handlePatchVulnerability = async (id: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/sec/vulnerabilities/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "patched" })
      });
      if (res.ok) {
        flashMessage(currentLanguage === "ar" 
          ? "تم تطبيق الرقعة البرمجية وتأمين المكون بنجاح! تراجع مؤشر الخطر القومي الموحد." 
          : "Patch compiled and deployed successfully! Unified National Cyber Risk lowered."
        );
        fetchSOCData();
      }
    } catch (err) {
      flashMessage("Failed to patch vulnerability", true);
    } finally {
      setSubmitting(false);
    }
  };

  // Revoke Digital Certificate
  const handleRevokeCertificate = async (id: string) => {
    if (!confirm(currentLanguage === "ar" ? "هل أنت متأكد من سحب وإلغاء هذه الشهادة الرقمية فورياً؟" : "Are you sure you want to immediately revoke this cryptographic certificate?")) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/sec/certificates/${id}/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reasonAr: "تم إلغاء الشهادة يدوياً لأسباب أمنية طارئة وتحديث معايير التشفير",
          reasonEn: "Manual emergency revocation for cryptographic key rotation and security upgrade"
        })
      });
      if (res.ok) {
        flashMessage(currentLanguage === "ar" ? "تم إلغاء الشهادة وسحبها في قائمة الـ CRL الوطنية." : "Certificate revoked and propagated to National CRL.");
        fetchSOCData();
      }
    } catch (err) {
      flashMessage("Failed to revoke certificate", true);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Zero Trust Conditional Access Policy
  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyForm.titleAr || !newPolicyForm.rulesAr) {
      flashMessage(currentLanguage === "ar" ? "الرجاء ملء تفاصيل السياسة" : "Please fill policy details", true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/sec/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPolicyForm,
          actor: socRole
        })
      });
      if (res.ok) {
        flashMessage(currentLanguage === "ar" ? "تم نشر وفرض سياسة الوصول التكيفي المشددة!" : "Adaptive conditional access policy enforced!");
        setNewPolicyForm({
          titleAr: "",
          titleEn: "",
          type: "conditional_access",
          rulesAr: "",
          rulesEn: "",
          status: "enforced"
        });
        fetchSOCData();
      }
    } catch (err) {
      flashMessage("Failed to enforce policy", true);
    } finally {
      setSubmitting(false);
    }
  };

  // HSM RSA-4096 Signature Simulation
  const handleSimulateHSMSignature = () => {
    setHsmVerifying(true);
    setHsmResult("idle");
    setTimeout(() => {
      // Simulate unique cryptographic signature based on text block input
      let hash = 0;
      for (let i = 0; i < hsmInput.length; i++) {
        hash = (hash << 5) - hash + hsmInput.charCodeAt(i);
        hash |= 0;
      }
      const uniqueSig = `SIG-RSA4096-SUDAN-NCSC-FIPS-${Math.abs(hash).toString(16).toUpperCase()}-${Date.now().toString().slice(-6)}`;
      setHsmSignature(uniqueSig);
      setHsmVerifying(false);
      setHsmResult("success");
      flashMessage(currentLanguage === "ar" ? "تم التوقيع الرقمي بنجاح عبر خادم HSM العسكري" : "Digitally signed with Military-grade HSM successfully!");
    }, 1200);
  };

  // AI Cyber Defense Advisor Query Execution
  const handleCallAIDefense = async (scenarioSelected?: string) => {
    setAiLoading(true);
    setAiResponse("");
    const selected = scenarioSelected || aiScenario;
    try {
      const res = await fetch("/api/sec/ai-defense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          scenario: selected,
          context: {
            lastIp: events[0]?.ipAddress || "198.51.100.77",
            activeIncidentCount: incidents.filter(i => i.status !== "resolved" && i.status !== "closed").length,
            riskScore: kpis.find(k => k.id === "skpi-1")?.value || 18
          }
        })
      });
      const data = await res.json();
      setAiResponse(data.text || "No response received");
    } catch (err) {
      console.error(err);
      setAiResponse(currentLanguage === "ar" ? "عذراً، فشل الاتصال بمستشار الدفاع السيبراني الذكي" : "Failed to connect to AI Cyber Advisor");
    } finally {
      setAiLoading(false);
    }
  };

  // Clean custom markdown simple parser
  const renderMarkdownText = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return <h3 key={idx} className="text-lg font-bold text-sudan-green mt-4 mb-2 border-b border-gray-200 pb-1">{trimmed.replace("###", "")}</h3>;
      }
      if (trimmed.startsWith("####")) {
        return <h4 key={idx} className="text-base font-bold text-sudan-gold mt-3 mb-1">{trimmed.replace("####", "")}</h4>;
      }
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        return <p key={idx} className="font-bold text-gray-800 my-1">{trimmed.replace(/\*\*/g, "")}</p>;
      }
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        // bold subparts inside list
        const cleanLine = trimmed.replace(/^[\*\-\s]+/, "");
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-gray-700 my-1">
            {cleanLine}
          </li>
        );
      }
      if (trimmed === "---") {
        return <hr key={idx} className="my-4 border-gray-200" />;
      }
      return <p key={idx} className="text-sm text-gray-700 leading-relaxed my-1.5">{line}</p>;
    });
  };

  // KPIs Extraction for convenient references
  const riskScoreKpi = kpis.find(k => k.id === "skpi-1")?.value || 18;
  const mttdKpi = kpis.find(k => k.id === "skpi-2")?.value || 4.2;
  const mttrKpi = kpis.find(k => k.id === "skpi-3")?.value || 12.5;
  const certKpi = kpis.find(k => k.id === "skpi-4")?.value || 100;

  // Filtered SIEM logs
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.source.toLowerCase().includes(siemSearch.toLowerCase()) || 
                          e.actor.toLowerCase().includes(siemSearch.toLowerCase()) ||
                          e.messageAr.toLowerCase().includes(siemSearch.toLowerCase()) ||
                          e.messageEn.toLowerCase().includes(siemSearch.toLowerCase());
    const matchesSource = siemSourceFilter === "all" || e.source === siemSourceFilter;
    const matchesSeverity = siemSeverityFilter === "all" || e.severity === siemSeverityFilter;
    return matchesSearch && matchesSource && matchesSeverity;
  });

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-md" id="cybersec-platform-root">
      
      {/* Title Header with Sudanese Flag Ribbon */}
      <div className="border-b border-[#F3F4F6] pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-red-50 text-red-600 rounded-lg shadow-sm">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-sans text-gray-900 leading-tight">
                {currentLanguage === "ar" ? "منصة العمليات السيبرانية السيادية والإنذار المبكر" : "Sovereign Cybersecurity & National SOC Platform"}
              </h2>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {currentLanguage === "ar" ? "وزارة التجارة والصناعة الرقمية • ربط فيدرالي موحد" : "Sudan Ministry of Commerce & Industry • Unified National Defense Node"}
              </p>
            </div>
          </div>
        </div>

        {/* Sovereign Role & Context Selector */}
        <div className="flex items-center gap-2 bg-[#F9FAFB] p-1.5 rounded-xl border border-gray-100">
          <span className="text-xs text-gray-500 font-medium px-2">
            {currentLanguage === "ar" ? "هوية الـ SOC النشطة:" : "Active SOC Role:"}
          </span>
          <select 
            value={socRole} 
            onChange={(e) => setSocRole(e.target.value)}
            className="text-xs font-bold text-sudan-green bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-sudan-green"
          >
            <option value="SOC Analyst">SOC Analyst ({currentLanguage === "ar" ? "محلل عمليات" : "Operations Analyst"})</option>
            <option value="CISO">CISO ({currentLanguage === "ar" ? "رئيس أمن المعلومات" : "Chief InfoSec Officer"})</option>
            <option value="Security Engineer">Security Engineer ({currentLanguage === "ar" ? "مهندس أمن" : "Engineer"})</option>
            <option value="Threat Hunter">Threat Hunter ({currentLanguage === "ar" ? "صائد مهددات" : "Threat Hunter"})</option>
            <option value="Digital Forensics Specialist">Digital Forensics Specialist ({currentLanguage === "ar" ? "خبير جنائي" : "Forensics"})</option>
            <option value="Undersecretary">Undersecretary ({currentLanguage === "ar" ? "وكيل الوزارة" : "Undersecretary"})</option>
            <option value="Minister">Minister ({currentLanguage === "ar" ? "ديوان معالي الوزير" : "Minister Office"})</option>
          </select>
        </div>
      </div>

      {/* Success / Error Messages */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-gray-100 mb-6 pb-px scrollbar-hide">
        {[
          { id: "soc-dashboard", labelAr: "لوحة القيادة السيبرانية", labelEn: "Sovereign Overview", icon: BarChart2 },
          { id: "siem-logs", labelAr: "مجمع السجلات SIEM", labelEn: "SIEM Log Feed", icon: Terminal },
          { id: "soar-incidents", labelAr: "إدارة البلاغات والـ SOAR", labelEn: "Incidents & SOAR", icon: Activity },
          { id: "vuln-mgmt", labelAr: "إدارة الثغرات والترقيع", labelEn: "Vulnerability & Patch", icon: ShieldX },
          { id: "pki-trust", labelAr: "شهادات التشفير الرقمي PKI", labelEn: "Digital PKI & Trust", icon: Key },
          { id: "zero-trust", labelAr: "الهوية المشددة والـ Zero Trust", labelEn: "Zero-Trust & IAM", icon: Fingerprint },
          { id: "ai-advisor", labelAr: "مستشار الدفاع الذكي (AI)", labelEn: "AI Cyber Advisor", icon: Sparkles },
          { id: "deliverables", labelAr: "وثائق الحوكمة والمستندات السيادية", labelEn: "Governance & Frameworks", icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                active 
                  ? "bg-sudan-green text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: SOC OVERVIEW / DASHBOARD */}
        {activeTab === "soc-dashboard" && (
          <motion.div 
            key="soc-dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Top Cards Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Risk Score (Dynamic) */}
              <div className="bg-gradient-to-br from-gray-900 to-slate-800 text-white rounded-xl p-5 shadow-sm border border-gray-800 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10">
                  <Shield className="w-32 h-32 text-white" />
                </div>
                <p className="text-xs font-bold text-gray-400">
                  {currentLanguage === "ar" ? "مؤشر المخاطر السيبرانية الموحد" : "National Cyber Risk Score"}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-sudan-gold font-mono">{riskScoreKpi}</span>
                  <span className="text-xs text-emerald-400 font-bold font-mono">/ 100</span>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  {currentLanguage === "ar" 
                    ? "✓ الحالة: ممتاز (تحت خط الحذر 25)" 
                    : "✓ Level: Excellent (Below warnings threshold)"}
                </p>
              </div>

              {/* Card 2: MTTD */}
              <div className="bg-[#FAFBFB] rounded-xl p-5 shadow-sm border border-gray-100 relative">
                <div className="absolute right-4 top-4 text-[#C5A059] bg-[#FAF6EB] p-2 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-500">
                  {currentLanguage === "ar" ? "متوسط وقت الرصد والإنذار" : "Mean Time to Detect (MTTD)"}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900 font-mono">{mttdKpi}</span>
                  <span className="text-xs text-gray-500">{currentLanguage === "ar" ? "دقائق" : "minutes"}</span>
                </div>
                <p className="text-[10px] text-emerald-600 mt-3 font-semibold">
                  {currentLanguage === "ar" ? "⚡ أسرع بـ 16% من الحد الفيدرالي المستهدف" : "⚡ 16% faster than national target"}
                </p>
              </div>

              {/* Card 3: MTTR */}
              <div className="bg-[#FAFBFB] rounded-xl p-5 shadow-sm border border-gray-100 relative">
                <div className="absolute right-4 top-4 text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-500">
                  {currentLanguage === "ar" ? "متوسط وقت الاستجابة والاحتواء" : "Mean Time to Respond (MTTR)"}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900 font-mono">{mttrKpi}</span>
                  <span className="text-xs text-gray-500">{currentLanguage === "ar" ? "دقائق" : "minutes"}</span>
                </div>
                <p className="text-[10px] text-emerald-600 mt-3 font-semibold">
                  {currentLanguage === "ar" ? "✓ تم تحسينه عقب عزل ثغرة الدفع القديمة" : "✓ Refined after patching legacy payment"}
                </p>
              </div>

              {/* Card 4: PKI Trust */}
              <div className="bg-[#FAFBFB] rounded-xl p-5 shadow-sm border border-gray-100 relative">
                <div className="absolute right-4 top-4 text-blue-600 bg-blue-50 p-2 rounded-lg">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-500">
                  {currentLanguage === "ar" ? "معدل تغطية الهوية الرقمية والـ PKI" : "Identity & Certificate Coverage"}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900 font-mono">{certKpi}</span>
                  <span className="text-xs text-gray-500 font-mono">%</span>
                </div>
                <p className="text-[10px] text-emerald-600 mt-3 font-semibold">
                  {currentLanguage === "ar" ? "✓ جميع بوابات التجارة والمشتريات مؤمنة بالكامل" : "✓ Fully enforced on all commerce/tender hubs"}
                </p>
              </div>

            </div>

            {/* Attack Simulation Playgrounds */}
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-sudan-green" />
                {currentLanguage === "ar" ? "منطقة محاكاة واختبار الهجمات السيبرانية (SOC Pen-Testing Playground)" : "SOC Attack Ingestion & Response Simulator"}
              </h4>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                {currentLanguage === "ar" 
                  ? "اختر سيناريو هجوم لاختبار نظام الـ SIEM ومحرك الاستجابة التلقائية للـ SOAR. ستولد المنصة تلقائياً إنذاراً وسجلات أمنية وتقوم بتوليد بلاغ فوري في حال تخطي عتبة الخطر." 
                  : "Launch a controlled mock cyberattack to evaluate SIEM detection logic and automated SOAR containment playbooks."}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSimulateAttack("ddos")}
                  disabled={submitting}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Activity className="w-3.5 h-3.5" />
                  {currentLanguage === "ar" ? "هجوم DDoS فيضان عارم (120k req/s)" : "Simulate WAF HTTP Flood (120k/s)"}
                </button>
                <button
                  onClick={() => handleSimulateAttack("brute")}
                  disabled={submitting}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {currentLanguage === "ar" ? "محاولة تخمين Brute-Force على ديوان الوزير" : "Simulate Brute-Force on Minister Portal"}
                </button>
                <button
                  onClick={() => handleSimulateAttack("insider")}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  {currentLanguage === "ar" ? "سلوك غير معتاد (تنزيل جماعي مشبوه)" : "Simulate Insider Threat Behavior (Bulk Download)"}
                </button>
                <button
                  onClick={fetchSOCData}
                  disabled={loading}
                  className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all ml-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  {currentLanguage === "ar" ? "تحديث البيانات" : "Refresh SOC"}
                </button>
              </div>
            </div>

            {/* Bottom Row: Core threat visual & active incidents */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Threat intelligence feeds (8 columns) */}
              <div className="lg:col-span-8 bg-white border border-gray-150 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sudan-gold" />
                    {currentLanguage === "ar" ? "مؤشرات الاختراق النشطة وقنوات الاستخبارات (Threat Intelligence Feed)" : "Active Indicators of Compromise (IOC) & Intelligence Feed"}
                  </h3>
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full font-mono border border-amber-100">
                    MITRE ATT&CK MAPPED
                  </span>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {threatIntel.map((intel) => (
                    <div 
                      key={intel.id} 
                      className={`p-3 rounded-xl border flex justify-between items-center ${
                        intel.severity === "critical" ? "bg-red-50/50 border-red-100" :
                        intel.severity === "high" ? "bg-amber-50/50 border-amber-100" : "bg-gray-50/50 border-gray-150"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-gray-800 bg-white border px-2 py-0.5 rounded-lg">
                            {intel.ioc}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase font-mono ${
                            intel.severity === "critical" ? "bg-red-100 text-red-800" :
                            intel.severity === "high" ? "bg-amber-100 text-amber-800" : "bg-gray-200 text-gray-700"
                          }`}>
                            {intel.severity}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-3">
                          <span><strong>{currentLanguage === "ar" ? "المهاجم:" : "Actor:"}</strong> {intel.threatActor}</span>
                          <span><strong>{currentLanguage === "ar" ? "مصفوفة ميتري:" : "MITRE:"}</strong> {intel.mitreMapping}</span>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-xs font-bold text-gray-800 font-mono">
                          {intel.confidenceScore}% {currentLanguage === "ar" ? "ثقة" : "Confidence"}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {intel.source}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active warnings and mini incident checklist (4 columns) */}
              <div className="lg:col-span-4 bg-white border border-gray-150 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                  {currentLanguage === "ar" ? "بلاغات الطوارئ النشطة (SOAR Queue)" : "Active Sovereign SOAR Queue"}
                </h3>
                
                <div className="space-y-3">
                  {incidents.filter(i => i.status !== "resolved" && i.status !== "closed").length === 0 ? (
                    <div className="py-8 text-center text-gray-400 space-y-1">
                      <ShieldCheck className="w-10 h-10 mx-auto text-emerald-500" />
                      <p className="text-xs font-bold">
                        {currentLanguage === "ar" ? "✓ لا توجد بلاغات نشطة معلقة" : "✓ No active threat tickets"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {currentLanguage === "ar" ? "النظام يعمل بأعلى مستويات الثقة" : "SOC platform completely secure"}
                      </p>
                    </div>
                  ) : (
                    incidents.filter(i => i.status !== "resolved" && i.status !== "closed").map((inc) => (
                      <div 
                        key={inc.id}
                        onClick={() => {
                          setSelectedIncident(inc);
                          setActiveTab("soar-incidents");
                        }}
                        className="p-3 bg-red-50/40 border border-red-100 rounded-xl cursor-pointer hover:bg-red-50/80 transition-all space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-gray-900 truncate max-w-[200px]">
                            {currentLanguage === "ar" ? inc.titleAr : inc.titleEn}
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                            inc.severity === "critical" ? "bg-red-200 text-red-800 animate-bounce" : "bg-amber-100 text-amber-800"
                          }`}>
                            {inc.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                          {currentLanguage === "ar" ? inc.descriptionAr : inc.descriptionEn}
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                          <span>ID: {inc.id}</span>
                          <span className="text-sudan-green font-bold uppercase">{inc.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 2: SIEM CENTRALIZED LOG FEED */}
        {activeTab === "siem-logs" && (
          <motion.div 
            key="siem-logs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {/* SIEM Searching and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-150">
              
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={currentLanguage === "ar" ? "ابحث في سجلات الـ SIEM المصدرية..." : "Search SIEM unified database logs..."}
                  value={siemSearch}
                  onChange={(e) => setSiemSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-sudan-green bg-white"
                />
              </div>

              <div>
                <select
                  value={siemSourceFilter}
                  onChange={(e) => setSiemSourceFilter(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none bg-white font-semibold text-gray-700"
                >
                  <option value="all">{currentLanguage === "ar" ? "كل المصادر الفيدرالية" : "All Federal Sources"}</option>
                  <option value="Sovereign Payment Gateway API">Sovereign Payment Gateway API</option>
                  <option value="Sovereign Gateway WAF">Sovereign Gateway WAF</option>
                  <option value="National Interoperability Hub">National Interoperability Hub</option>
                  <option value="Commercial Registry Database">Commercial Registry Database</option>
                  <option value="Import & Export Licensing Platform">Import & Export Licensing Platform</option>
                </select>
              </div>

              <div>
                <select
                  value={siemSeverityFilter}
                  onChange={(e) => setSiemSeverityFilter(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none bg-white font-semibold text-gray-700"
                >
                  <option value="all">{currentLanguage === "ar" ? "كل مستويات الخطورة" : "All Severities"}</option>
                  <option value="critical">Critical ({currentLanguage === "ar" ? "حرج للغاية" : "Critical"})</option>
                  <option value="high">High ({currentLanguage === "ar" ? "مرتفع" : "High"})</option>
                  <option value="medium">Medium ({currentLanguage === "ar" ? "متوسط" : "Medium"})</option>
                  <option value="low">Low ({currentLanguage === "ar" ? "منخفض" : "Low"})</option>
                </select>
              </div>

            </div>

            {/* SIEM Raw Logs Table */}
            <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-gray-700 text-xs font-bold">
                    <th className="p-3 text-right">{currentLanguage === "ar" ? "الوقت والمصدر" : "Timestamp & Source"}</th>
                    <th className="p-3 text-right">{currentLanguage === "ar" ? "التفاصيل الأمنية" : "Security Details / Activity"}</th>
                    <th className="p-3 text-right">{currentLanguage === "ar" ? "الفاعل وعنوان IP" : "Actor & IP Address"}</th>
                    <th className="p-3 text-center">{currentLanguage === "ar" ? "الخطورة" : "Severity"}</th>
                    <th className="p-3 text-center">{currentLanguage === "ar" ? "الإجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 text-xs font-medium">
                        {currentLanguage === "ar" ? "لا توجد سجلات مطابقة للبحث حالياً" : "No matching security logs found in SIEM."}
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50/50 text-xs transition-colors">
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="font-mono text-gray-400 text-[10px]">
                            {new Date(ev.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="font-semibold text-gray-800 flex items-center gap-1">
                            <Server className="w-3 h-3 text-sudan-green" />
                            {ev.source}
                          </div>
                        </td>
                        
                        <td className="p-3 text-right">
                          <p className="font-semibold text-gray-900 leading-normal">
                            {currentLanguage === "ar" ? ev.messageAr : ev.messageEn}
                          </p>
                          {ev.payload && (
                            <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded mt-1 inline-block">
                              {ev.payload}
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <div className="font-medium text-gray-800">{ev.actor}</div>
                          <div className="font-mono text-[10px] text-gray-400">{ev.ipAddress}</div>
                        </td>

                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            ev.severity === "critical" ? "bg-red-100 text-red-800" :
                            ev.severity === "high" ? "bg-amber-100 text-amber-800" :
                            ev.severity === "medium" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"
                          }`}>
                            {ev.severity}
                          </span>
                        </td>

                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            ev.status === "blocked" ? "bg-red-50 text-red-600 border border-red-100" :
                            ev.status === "flagged" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>
                            {ev.status === "blocked" ? (currentLanguage === "ar" ? "حظر فوري" : "Blocked") :
                             ev.status === "flagged" ? (currentLanguage === "ar" ? "رصد ومتابعة" : "Flagged") :
                             (currentLanguage === "ar" ? "سماح آمن" : "Allowed")}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 3: SOAR & ACTIVE INCIDENT WORKFLOWS */}
        {activeTab === "soar-incidents" && (
          <motion.div 
            key="soar-incidents"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            
            {/* Left Panel: Incident List (5 cols) */}
            <div className="lg:col-span-5 bg-[#FAFBFB] p-4 rounded-xl border border-gray-150 space-y-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-200">
                {currentLanguage === "ar" ? "قائمة التذاكر والبلاغات الأمنية" : "Incident Response & SOAR Tickets"}
              </h3>
              
              <div className="space-y-3 overflow-y-auto max-h-[500px]">
                {incidents.map((inc) => {
                  const isSelected = selectedIncident?.id === inc.id;
                  return (
                    <div
                      key={inc.id}
                      onClick={() => {
                        setSelectedIncident(inc);
                        // pre-fill mitigation form with existing values if any
                        setMitigationForm({
                          containmentAr: inc.containmentActionAr || "",
                          containmentEn: inc.containmentActionEn || "",
                          rootCauseAr: inc.rootCauseAr || "",
                          rootCauseEn: inc.rootCauseEn || "",
                          lessonsLearnedAr: inc.lessonsLearnedAr || "",
                          lessonsLearnedEn: inc.lessonsLearnedEn || "",
                          nextStatus: inc.status === "new" || inc.status === "investigating" ? "resolved" : inc.status
                        });
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all space-y-2 ${
                        isSelected 
                          ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                          : "bg-white border-gray-150 text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold truncate max-w-[180px]">
                          {currentLanguage === "ar" ? inc.titleAr : inc.titleEn}
                        </span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                          inc.severity === "critical" ? "bg-red-200 text-red-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {inc.severity}
                        </span>
                      </div>

                      <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                        {currentLanguage === "ar" ? inc.descriptionAr : inc.descriptionEn}
                      </p>

                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className={isSelected ? "text-gray-400" : "text-gray-400"}>{inc.id}</span>
                        <span className={`font-bold uppercase ${
                          inc.status === "mitigated" || inc.status === "resolved" || inc.status === "closed"
                            ? "text-emerald-500"
                            : "text-red-500 animate-pulse"
                        }`}>
                          {inc.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Create manual emergency incident ticket */}
              <form onSubmit={handleCreateIncident} className="p-3 bg-white border border-gray-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <PlusCircle className="w-4 h-4 text-sudan-green" />
                  {currentLanguage === "ar" ? "فتح تذكرة بلاغ طارئ جديدة" : "Open Emergency Incident Ticket"}
                </h4>
                
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    placeholder={currentLanguage === "ar" ? "عنوان البلاغ (بالعربية)" : "Incident Title (Arabic)"}
                    value={newIncidentForm.titleAr}
                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, titleAr: e.target.value })}
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-sudan-green"
                  />
                  <input
                    type="text"
                    required
                    placeholder={currentLanguage === "ar" ? "عنوان البلاغ (بالأرقام والإنجليزية)" : "Incident Title (English)"}
                    value={newIncidentForm.titleEn}
                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, titleEn: e.target.value })}
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-sudan-green"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newIncidentForm.category}
                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, category: e.target.value })}
                    className="p-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="unauthorized_access">Unauthorized Access</option>
                    <option value="ddos">DDoS Attack</option>
                    <option value="ransomware">Ransomware</option>
                    <option value="data_leak">Data Leak (DLP)</option>
                    <option value="insider_threat">Insider Threat</option>
                  </select>
                  
                  <select
                    value={newIncidentForm.severity}
                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, severity: e.target.value })}
                    className="p-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-2 rounded-lg shadow transition-all"
                >
                  {currentLanguage === "ar" ? "فتح بلاغ الطوارئ السيادي" : "Open Incident Ticket"}
                </button>
              </form>

            </div>

            {/* Right Panel: Selected Incident Forensics, Timeline & Mitigation (7 cols) */}
            <div className="lg:col-span-7 bg-white p-5 border border-gray-150 rounded-xl space-y-6">
              {!selectedIncident ? (
                <div className="py-24 text-center text-gray-400 space-y-2">
                  <ClipboardList className="w-16 h-16 mx-auto text-gray-200 animate-bounce" />
                  <h4 className="text-xs font-bold text-gray-700">
                    {currentLanguage === "ar" ? "اختر بلاغاً أمنياً من القائمة لبدء التحقيق الجنائي" : "Select an Incident from the Queue"}
                  </h4>
                  <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
                    {currentLanguage === "ar" 
                      ? "يتيح لك المعالج إثبات الأدلة والتحقق من الجدول الزمني، وعزل مصادر التهديد وتعميم الدروس المستفادة." 
                      : "Access the timeline auditing, SOAR isolation buttons, forensics verification, and final remediation logs."}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Incident Header Details */}
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 border px-2 py-0.5 rounded">
                        ID: {selectedIncident.id}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-2">
                        {currentLanguage === "ar" ? selectedIncident.titleAr : selectedIncident.titleEn}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {currentLanguage === "ar" ? selectedIncident.descriptionAr : selectedIncident.descriptionEn}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold block text-center uppercase font-mono ${
                        selectedIncident.status === "mitigated" || selectedIncident.status === "resolved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                      }`}>
                        {selectedIncident.status}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-mono">
                        {new Date(selectedIncident.loggedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Incident Timeline (Investigative Log) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Terminal className="w-4 h-4 text-sudan-green" />
                      {currentLanguage === "ar" ? "الجدول الزمني والتحقيق الجنائي الرقمي (SOC Timeline)" : "Forensics Auditing & Response Timeline"}
                    </h4>
                    
                    <div className="border-l-2 border-gray-100 ml-3 pl-4 space-y-4 pt-1 pb-2">
                      {selectedIncident.timeline?.map((step: any, sIdx: number) => (
                        <div key={sIdx} className="relative">
                          <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-sudan-green border-2 border-white ring-2 ring-sudan-green/25" />
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-gray-400 font-mono block">
                              {new Date(step.timestamp).toLocaleTimeString()} • {step.actor}
                            </span>
                            <p className="text-xs font-semibold text-gray-800">
                              {currentLanguage === "ar" ? step.actionAr : step.actionEn}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Timeline step addition form */}
                    {selectedIncident.status !== "resolved" && selectedIncident.status !== "closed" && (
                      <form onSubmit={handleAddTimelineAction} className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder={currentLanguage === "ar" ? "أدخل خطوة تحقيق جديدة (مثال: عزل خوادم قاعدة البيانات...)" : "Enter forensic investigation update..."}
                          value={newTimelineAction}
                          onChange={(e) => setNewTimelineAction(e.target.value)}
                          className="flex-1 p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-sudan-green"
                        />
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-sudan-green hover:bg-[#006E2E] text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {currentLanguage === "ar" ? "إضافة" : "Append"}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Playbook Containment & Root Cause Submission Form */}
                  <form onSubmit={handleResolveIncident} className="p-4 bg-slate-50 border border-gray-150 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {currentLanguage === "ar" ? "تأمين وحل البلاغ (SOAR Playbook Execution & Resolution)" : "SOAR Playbook Mitigation & Mitigation Closure"}
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">
                          {currentLanguage === "ar" ? "إجراءات العزل والاحتواء المتخذة (Containment Actions):" : "Containment / Mitigation Actions:"}
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={mitigationForm.containmentAr}
                          onChange={(e) => setMitigationForm({ ...mitigationForm, containmentAr: e.target.value })}
                          placeholder={currentLanguage === "ar" ? "اكتب تفاصيل الاحتواء (مثال: تفعيل ميكرو تجزئة وتدوير شهادة بنك السودان)" : "Details of containment (e.g., isolated container, enforced GEO-IP firewall rules)"}
                          className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:border-sudan-green"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-1">
                            {currentLanguage === "ar" ? "السبب الجذري للمهدد (Root Cause):" : "Verified Root Cause:"}
                          </label>
                          <input
                            type="text"
                            required
                            value={mitigationForm.rootCauseAr}
                            onChange={(e) => setMitigationForm({ ...mitigationForm, rootCauseAr: e.target.value })}
                            placeholder={currentLanguage === "ar" ? "السبب الجذري" : "Root cause details"}
                            className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-1">
                            {currentLanguage === "ar" ? "الدروس المستفادة والتحوط المستقبلي:" : "Lessons Learned & Security Baseline Update:"}
                          </label>
                          <input
                            type="text"
                            value={mitigationForm.lessonsLearnedAr}
                            onChange={(e) => setMitigationForm({ ...mitigationForm, lessonsLearnedAr: e.target.value })}
                            placeholder={currentLanguage === "ar" ? "التحوطات والدروس" : "Lessons learned details"}
                            className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-gray-500">
                            {currentLanguage === "ar" ? "حالة الإغلاق:" : "Closure Status:"}
                          </label>
                          <select
                            value={mitigationForm.nextStatus}
                            onChange={(e) => setMitigationForm({ ...mitigationForm, nextStatus: e.target.value })}
                            className="p-1 text-xs border border-gray-200 rounded bg-white text-gray-800 font-bold"
                          >
                            <option value="resolved">Resolved</option>
                            <option value="mitigated">Mitigated</option>
                            <option value="closed">Closed / Solved</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all"
                        >
                          {currentLanguage === "ar" ? "✓ حفظ وإغلاق البلاغ أمنياً" : "Mitigate & Close Incident"}
                        </button>
                      </div>
                    </div>

                  </form>

                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* TAB 4: PKI & DIGITAL TRUST SERVICES */}
        {activeTab === "pki-trust" && (
          <motion.div 
            key="pki-trust"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Top Row: PKI Overview and Signature Verification Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Signature verification widget (5 cols) */}
              <div className="lg:col-span-5 bg-slate-50 border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-3">
                  <Fingerprint className="w-5 h-5 text-sudan-green" />
                  {currentLanguage === "ar" ? "جهاز التحقق والتوقيع الرقمي السيادي (HSM Multi-Device)" : "Sovereign HSM Cryptographic Digital Signer"}
                </h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "يقوم هذا المحاكي بالاتصال بوحدات الأمان الصلبة (HSM) التابعة للدولة للتوقيع والتحقق من مصداقية المستندات الفيدرالية وتذاكر الدفع والعطاءات لوزارة التجارة." 
                    : "Simulate secure digital signing of federal logs, tender agreements, and licenses via National Cryptographic HSM (FIPS 140-3)."}
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">
                      {currentLanguage === "ar" ? "النص البرمجي أو معرف الوثيقة للتوقيع:" : "Text Block / Document Identifier to Sign:"}
                    </label>
                    <input
                      type="text"
                      value={hsmInput}
                      onChange={(e) => setHsmInput(e.target.value)}
                      className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white font-mono"
                    />
                  </div>

                  <button
                    onClick={handleSimulateHSMSignature}
                    disabled={hsmVerifying}
                    className="w-full bg-sudan-green hover:bg-[#006E2E] text-white text-xs font-bold py-2 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${hsmVerifying ? "animate-spin" : ""}`} />
                    {currentLanguage === "ar" ? "التوقيع والتحقق عبر الـ HSM الفيدرالي" : "Validate & Sign with RSA-4096 HSM Peer"}
                  </button>

                  {hsmSignature && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-mono text-[10px] space-y-1.5"
                    >
                      <p className="font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "تم التحقق من التوقيع بنجاح!" : "HSM Cryptographic Signature Verified!"}
                      </p>
                      <p className="truncate"><strong>Signature:</strong> {hsmSignature}</p>
                      <p className="text-gray-400"><strong>Issuer:</strong> {certificates[0]?.subjectEn || "National Root CA"}</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right Column: Public certificates list (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-gray-150 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-3">
                  <Key className="w-5 h-5 text-sudan-gold" />
                  {currentLanguage === "ar" ? "شهادات التشفير والمفاتيح العامة للمؤسسات (PKI Certificates)" : "National Public Key Infrastructure (PKI) Certificate Cycle"}
                </h3>
                
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="p-3 bg-gray-50 rounded-xl border border-gray-150 relative space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-gray-400 block uppercase">
                            Serial: {cert.serialNumber}
                          </span>
                          <span className="text-xs font-bold text-gray-900 block mt-1">
                            {currentLanguage === "ar" ? cert.subjectAr : cert.subjectEn}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          cert.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}>
                          {cert.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 font-mono">
                        <div><strong>Issuer:</strong> {cert.issuer}</div>
                        <div><strong>Algorithm:</strong> {cert.keyAlgorithm}</div>
                        <div><strong>Valid From:</strong> {cert.issueDate}</div>
                        <div><strong>Expires At:</strong> {cert.expiryDate}</div>
                      </div>

                      {cert.status === "revoked" && cert.revocationReasonAr && (
                        <div className="p-2 bg-red-50 text-red-800 rounded border border-red-100 text-[10px] leading-relaxed">
                          <strong>{currentLanguage === "ar" ? "سبب الإلغاء:" : "Revocation Reason:"}</strong>{" "}
                          {currentLanguage === "ar" ? cert.revocationReasonAr : cert.revocationReasonEn}
                        </div>
                      )}

                      {cert.status === "active" && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleRevokeCertificate(cert.id)}
                            disabled={submitting}
                            className="text-red-600 hover:text-white hover:bg-red-600 border border-red-150 text-[10px] font-bold px-2 py-1 rounded transition-all"
                          >
                            {currentLanguage === "ar" ? "سحب وإلغاء الشهادة فوراً" : "Revoke Certificate"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 5: VULNERABILITY MANAGEMENT & SCANS */}
        {activeTab === "vuln-mgmt" && (
          <motion.div 
            key="vuln-mgmt"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Run dynamic scan button row */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  {currentLanguage === "ar" ? "الفحص الأمني المؤتمت للثغرات والشيفرات المصدرية" : "Automated Security Vulnerability Assessment Scanner"}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  {currentLanguage === "ar" 
                    ? "يقوم المحرك بفحص خوادم بوابة الوزارة ومقارنتها بقاعدة بيانات CVE العالمية لرصد ثغرات المكونات الخارجية." 
                    : "Inspect SDMCI application stacks, APIs, and cloud microservices against up-to-date NVD / CVE definitions."}
                </p>
              </div>
              <button
                onClick={() => {
                  setLoading(true);
                  flashMessage(currentLanguage === "ar" ? "جاري تشغيل الفحص الأمني التلقائي لخوادم بورتسودان وسوبا..." : "Running fully automated security scans on all regional federal servers...");
                  setTimeout(() => {
                    setLoading(false);
                    flashMessage(currentLanguage === "ar" ? "تم الانتهاء من الفحص! لم يتم اكتشاف ثغرات جديدة خارج الجدول." : "Scan finished successfully! Zero new untracked vulnerabilities discovered.");
                  }, 1500);
                }}
                disabled={loading}
                className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all self-stretch md:self-auto text-center justify-center"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                {currentLanguage === "ar" ? "بدء فحص الثغرات الآن" : "Trigger Security Audit Scan"}
              </button>
            </div>

            {/* Vulnerability list cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vulnerabilities.map((vuln) => (
                <div key={vuln.id} className="bg-white border border-gray-150 rounded-xl p-4 space-y-3 shadow-sm relative">
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-gray-400 bg-gray-100 border px-2 py-0.5 rounded">
                        {vuln.cveId}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 mt-2">
                        {currentLanguage === "ar" ? vuln.titleAr : vuln.titleEn}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">
                        <strong>Component:</strong> {vuln.component}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        vuln.severity === "critical" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        CVSS {vuln.score} • {vuln.severity}
                      </span>
                    </div>
                  </div>

                  {/* CVSS indicator bar */}
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${vuln.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`}
                      style={{ width: `${vuln.score * 10}%` }}
                    />
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded text-[11px] leading-relaxed text-gray-600">
                    <strong>{currentLanguage === "ar" ? "خطة الترقيع والمعالجة الفيدرالية:" : "Sovereign Remediation Plan:"}</strong>{" "}
                    {currentLanguage === "ar" ? vuln.remediationPlanAr : vuln.remediationPlanEn}
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <span className={`text-[10px] font-bold ${vuln.status === "patched" ? "text-emerald-600" : "text-amber-500"}`}>
                      ● Status: {vuln.status === "patched" ? (currentLanguage === "ar" ? "تمت الترقية والإغلاق" : "Patched & Secure") : (currentLanguage === "ar" ? "قيد الانتظار" : "Awaiting Patch")}
                    </span>

                    {vuln.status !== "patched" && (
                      <button
                        onClick={() => handlePatchVulnerability(vuln.id)}
                        disabled={submitting}
                        className="bg-sudan-green hover:bg-[#006E2E] text-white text-[10px] font-bold px-2.5 py-1.5 rounded shadow-sm transition-all"
                      >
                        {currentLanguage === "ar" ? "تطبيق الرقعة البرمجية والترقية" : "Apply Patch & Verify"}
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </motion.div>
        )}

        {/* TAB 6: ZERO TRUST & IAM POLICIES */}
        {activeTab === "zero-trust" && (
          <motion.div 
            key="zero-trust"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Rules Form and conceptual visualizer (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-3">
                <ShieldCheck className="w-5 h-5 text-sudan-green" />
                {currentLanguage === "ar" ? "صياغة سياسات الثقة المعدومة (Zero-Trust Guard)" : "Conditional Access Policy Designer"}
              </h3>
              
              <form onSubmit={handleCreatePolicy} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">
                    {currentLanguage === "ar" ? "اسم السياسة الفيدرالية:" : "Policy Subject / Title:"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPolicyForm.titleAr}
                    onChange={(e) => setNewPolicyForm({ ...newPolicyForm, titleAr: e.target.value, titleEn: e.target.value })}
                    placeholder={currentLanguage === "ar" ? "مثال: منع الدخول خارج السودان" : "e.g., Geo-block access outside Sudan"}
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">
                    {currentLanguage === "ar" ? "صنف القاعدة وأسلوب التحقق:" : "Adaptive Rule Category:"}
                  </label>
                  <select
                    value={newPolicyForm.type}
                    onChange={(e) => setNewPolicyForm({ ...newPolicyForm, type: e.target.value })}
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white outline-none"
                  >
                    <option value="conditional_access">Conditional Access (التحقق التكيفي)</option>
                    <option value="dlp_rule">DLP Block (منع تسريب البيانات)</option>
                    <option value="session_timeout">Session Lifetime (محدد الجلسات)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">
                    {currentLanguage === "ar" ? "الشروط والقواعد التفصيلية:" : "Enforcement Rules (Mandates):"}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newPolicyForm.rulesAr}
                    onChange={(e) => setNewPolicyForm({ ...newPolicyForm, rulesAr: e.target.value, rulesEn: e.target.value })}
                    placeholder={currentLanguage === "ar" ? "اكتب قيود الصلاحيات ومصفوفة التحقق هنا..." : "Define the least privilege constraints, role requirement, or device trust indicators..."}
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:border-sudan-green"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-2 rounded-lg shadow-sm transition-all"
                >
                  {currentLanguage === "ar" ? "✓ فرض ونشر قاعدة الامتثال والوصول" : "Enforce Zero Trust Policy"}
                </button>
              </form>

              {/* Zero Trust segmentation diagram */}
              <div className="bg-white border p-3 rounded-lg border-gray-200 space-y-2">
                <h5 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Network className="w-3.5 h-3.5 text-blue-500" />
                  {currentLanguage === "ar" ? "مخطط التجزئة الدقيقة التلقائي (Micro-Segmentation)" : "Micro-Segmentation Node Mapping"}
                </h5>
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-[10px] font-mono text-gray-500">
                  <span>Portal (UI)</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-emerald-600 font-bold">WAF Verify</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-blue-600 font-bold">MFA Required</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span>Sovereign DB</span>
                </div>
              </div>

            </div>

            {/* Right Column: Policies list (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-gray-150 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-3">
                <Fingerprint className="w-5 h-5 text-sudan-gold" />
                {currentLanguage === "ar" ? "سياسات الدخول التكيفي المشددة المفروضة حالياً" : "Active Identity & Access Management (IAM) Policies"}
              </h3>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {policies.map((pol) => (
                  <div key={pol.id} className="p-3 bg-gray-50 rounded-xl border border-gray-150 relative space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-gray-400 block uppercase">
                          ID: {pol.id} • Type: {pol.type}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 mt-1">
                          {currentLanguage === "ar" ? pol.titleAr : pol.titleEn}
                        </h4>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase">
                        {pol.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-normal bg-white p-2 rounded border border-gray-100">
                      {currentLanguage === "ar" ? pol.rulesAr : pol.rulesEn}
                    </p>

                    <div className="text-[10px] text-gray-400 font-mono text-right">
                      {currentLanguage === "ar" ? "المشرف:" : "Enforced By:"} {pol.updatedBy} • {new Date(pol.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 7: AI CYBER DEFENSE ADVISOR */}
        {activeTab === "ai-advisor" && (
          <motion.div 
            key="ai-advisor"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* AI Control Panel */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
              
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sudan-gold animate-spin" />
                  <h3 className="text-base font-bold font-sans">
                    {currentLanguage === "ar" ? "مستشار الدفاع السيبراني والتحليل الاستباقي الذكي" : "Sovereign AI Cyber Defense & Forensics Advisor"}
                  </h3>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  {currentLanguage === "ar" 
                    ? "يقوم المستشار المدعوم بنظام الذكاء الاصطناعي السيادي بتحليل شامل لملفات الـ SIEM، وبلاغات الطوارئ النشطة، وسجلات الموظفين لتوقع الهجمات المشتركة، واكتشاف ثغرات التحصيل المالي، وصياغة التقارير القومية لوزير التجارة." 
                    : "Leverage state-owned sovereign Gemini AI models to analyze logs, trace insider anomalies, prioritize CVE patching, and generate institutional digital trust summaries."}
                </p>

                {/* Scenarios Preset Selection */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {currentLanguage === "ar" ? "اختر سيناريو التحليل التنبئي:" : "Select Cyber Security Analytical Target:"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "threat_hunting", labelAr: "صيد التهديدات النشطة", labelEn: "Sovereign Threat Hunting" },
                      { id: "anomaly_detection", labelAr: "تحليل السلوك الشاذ والمهاجمين", labelEn: "UEBA / Insider Threat Detection" },
                      { id: "fraud_prevention", labelAr: "التنبؤ بالاحتيال والتلاعب المالي", labelEn: "Financial Fraud Auditing" },
                      { id: "executive_report", labelAr: "صياغة التقرير الاستخباراتي الوطني للوزير", labelEn: "Ministerial Intelligence Report" }
                    ].map((scen) => (
                      <button
                        key={scen.id}
                        type="button"
                        onClick={() => {
                          setAiScenario(scen.id);
                          handleCallAIDefense(scen.id);
                        }}
                        className={`text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                          aiScenario === scen.id 
                            ? "bg-sudan-gold text-slate-950 shadow-sm" 
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {currentLanguage === "ar" ? scen.labelAr : scen.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Input field */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder={currentLanguage === "ar" ? "أدخل استفساراً أمنياً مخصصاً للمستشار الذكي..." : "Enter custom security query or incident ID to analyze..."}
                    className="flex-1 p-2.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-sudan-gold"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCallAIDefense();
                    }}
                  />
                  <button
                    onClick={() => handleCallAIDefense()}
                    disabled={aiLoading}
                    className="bg-sudan-gold hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-all"
                  >
                    {aiLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {currentLanguage === "ar" ? "حلل" : "Analyze"}
                  </button>
                </div>

              </div>

              {/* Status checklist summary cards */}
              <div className="md:col-span-4 bg-slate-800 border border-slate-700 rounded-xl p-4 self-center space-y-3 font-mono text-[10px] text-slate-300">
                <div className="text-xs font-bold text-sudan-gold border-b border-slate-700 pb-2 mb-1 flex items-center gap-1">
                  <Server className="w-4 h-4" />
                  {currentLanguage === "ar" ? "إحصائيات المدخلات الجنائية" : "Live Forensic Context"}
                </div>
                <div>● Total SIEM Logs: {events.length}</div>
                <div>● Vulnerability Count: {vulnerabilities.filter(v => v.status !== "patched").length} open</div>
                <div>● Open Incidents: {incidents.filter(i => i.status !== "resolved" && i.status !== "closed").length}</div>
                <div>● Active Digital Certs: {certificates.filter(c => c.status === "active").length}</div>
                <div className="pt-2 border-t border-slate-700 text-[9px] text-slate-400">
                  * Automatically synced with all federal databases.
                </div>
              </div>

            </div>

            {/* AI Advisor Response Area */}
            {aiLoading ? (
              <div className="bg-slate-50 border rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-sudan-gold border-t-transparent animate-spin mx-auto" />
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    {currentLanguage === "ar" ? "جاري تشغيل محرك الاستخبارات الدفاعية وتحليل مصفوفة ميتري للمهددات..." : "Analyzing SIEM databases, matching CVE patches & generating national threat forecast..."}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {currentLanguage === "ar" ? "يرجى الانتظار لصياغة التقرير الحكومي المشفر" : "Processing sovereign cryptographic telemetry logs..."}
                  </p>
                </div>
              </div>
            ) : aiResponse ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 relative"
              >
                <div className="absolute right-4 top-4 bg-sudan-gold/10 text-sudan-gold font-bold px-2 py-0.5 rounded-full text-[9px] uppercase font-mono">
                  Sovereign AI Decrypted
                </div>
                <div className="prose prose-sm max-w-none text-right">
                  {renderMarkdownText(aiResponse)}
                </div>
              </motion.div>
            ) : null}

          </motion.div>
        )}

        {/* TAB 8: GOVERNMENT GOVERNANCE DELIVERABLES & FRAMEWORKS */}
        {activeTab === "deliverables" && (
          <motion.div 
            key="deliverables"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Sidebar list of master documents */}
            <div className="md:col-span-4 bg-gray-50 border border-gray-150 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-extrabold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-1">
                <FileText className="w-4 h-4 text-sudan-green" />
                {currentLanguage === "ar" ? "قائمة المستندات والمواثيق الأمنية" : "Sovereign Framework Documents"}
              </h3>
              
              <div className="space-y-1">
                {[
                  { id: "doc-1", titleAr: "الهيكل العام والمسار الوطني للمركز SOC", titleEn: "National SOC Architecture Blueprint" },
                  { id: "doc-2", titleAr: "إطار الأمن السيبراني الشامل للوزارة", titleEn: "Enterprise Cybersecurity Framework" },
                  { id: "doc-3", titleAr: "مواصفات تصميم أنظمة SIEM & SOAR", titleEn: "SIEM & SOAR Design Specification" },
                  { id: "doc-4", titleAr: "معمارية الهوية الرقمية والوصول الموحد", titleEn: "Sovereign IAM Architecture Manual" },
                  { id: "doc-5", titleAr: "منهجية فرض الثقة المعدومة (Zero-Trust)", titleEn: "Zero-Trust Security Implementation" },
                  { id: "doc-6", titleAr: "الميثاق الاستراتيجي للحوكمة والامتثال", titleEn: "Security Governance & Auditing Pact" },
                  { id: "doc-7", titleAr: "دليل إدارة الكوارث والمرونة السيبرانية", titleEn: "Disaster Recovery & Cyber Resilience" },
                  { id: "doc-8", titleAr: "التقرير النهائي الشامل للمركز SOC 2026", titleEn: "Master Implementation Final Report" }
                ].map((doc, dIdx) => (
                  <button
                    key={doc.id}
                    className="w-full text-right p-2 rounded-lg text-xs font-semibold hover:bg-white hover:text-sudan-green hover:shadow-sm transition-all text-gray-600 block leading-normal"
                    onClick={() => {
                      const el = document.getElementById(doc.id);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {dIdx + 1}. {currentLanguage === "ar" ? doc.titleAr : doc.titleEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Document details scrolling sheet */}
            <div className="md:col-span-8 bg-white border border-gray-150 rounded-xl p-6 space-y-12 max-h-[600px] overflow-y-auto">
              
              {/* Deliverable 1 */}
              <section id="doc-1" className="space-y-3">
                <h4 className="text-sm font-extrabold text-sudan-green border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-sudan-gold" />
                  {currentLanguage === "ar" 
                    ? "1. معمارية مركز العمليات السيبراني الوطني (National SOC Architecture)" 
                    : "1. National SOC Architecture Blueprint"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "يقوم التصميم الهيكلي للمركز السيادي للعمليات SOC على هيكل ثلاثي الطبقات يضم: وكلاء الرصد والاستشعار (WAF Nodes)، طبقة التحليل والارتباط (Correlation Layer) المدعومة بالـ SIEM في بورتسودان وسوبا، والطبقة الاستخباراتية التنبؤية بالذكاء الاصطناعي للتنبؤ وحظر التهديدات قبل حدوثها."
                    : "The National SOC Architecture details a highly available active-active deployment spanning redundant federal cloud zones (Port Sudan & Soba). Real-time telemetry endpoints capture transactional logs from the Commerce Ledger, Customs gateway, and payment processors."}
                </p>
                <div className="p-3 bg-gray-50 rounded-lg text-[10px] font-mono text-gray-500">
                  * Deployment Standard: ISO/IEC 27035 (Information security incident management) & FIPS 140-3 Hardware Trust.
                </div>
              </section>

              {/* Deliverable 2 */}
              <section id="doc-2" className="space-y-3">
                <h4 className="text-sm font-extrabold text-sudan-green border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-sudan-gold" />
                  {currentLanguage === "ar" 
                    ? "2. إطار الأمن السيبراني الشامل للوزارة (Enterprise Cybersecurity Framework)" 
                    : "2. Enterprise Cybersecurity Framework"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "تتبنى وزارة التجارة إطار الأمن المنسجم مع مصفوفة NIST والمعدل وطنياً ليناسب استراتيجية السودان للتحول الرقمي 2035. يشمل الإطار التحكم الصارم بالوصول، والتكامل المتين مع سلطة التصديق الوطنية، والمراجعة الفورية التلقائية للامتثال."
                    : "Aligned with NIST CSF v2.0 and regional COMESA guidelines, this framework enforces mandatory continuous control validation across all 21 SDMCI enterprise domains. Core pillars focus on Identify, Protect, Detect, Respond, and Recover."}
                </p>
              </section>

              {/* Deliverable 3 */}
              <section id="doc-3" className="space-y-3">
                <h4 className="text-sm font-extrabold text-sudan-green border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-sudan-gold" />
                  {currentLanguage === "ar" 
                    ? "3. مواصفات تصميم أنظمة SIEM & SOAR القومية" 
                    : "3. SIEM & SOAR Design Specification"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "يتم تجميع كافة السجلات في قاعدة بيانات مركزية غير قابلة للتعديل أو العبث. تفعل المنصة كتيبات استجابة تلقائية SOAR (Playbooks) لعزل عناوين الـ IP المهاجمة وتجميد الحسابات المشبوهة تلقائياً في حال تجاوز عتبة الخطر المبرمجة."
                    : "Specification details the automated ingestion pipelines capable of handling millions of security events daily. SOAR orchestrator automates containment such as triggering adaptive MFA challenges and blacklisting malicious IPs at the border routing layers."}
                </p>
              </section>

              {/* Deliverable 4 */}
              <section id="doc-4" className="space-y-3">
                <h4 className="text-sm font-extrabold text-sudan-green border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sudan-gold" />
                  {currentLanguage === "ar" 
                    ? "4. معمارية الهوية الرقمية والوصول الموحد (SSO & IAM Architecture)" 
                    : "4. Sovereign IAM Architecture Manual"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "تطبيق التحقق الثنائي التكيفي والمصادقة البيومترية الموثقة للموظفين والوزراء لضمان دقة الهوية ومنع هجمات انتحال الشخصيات أو استخدام كلمات المرور الضعيفة، مع توفير سجلات حظر وتحكم دائم."
                    : "Establishes secure Single Sign-On (SSO) integrated with National Identity databases. Implements Attribute-Based Access Control (ABAC) where high-value actions in the GRC, procurement, and payment systems require biometric confirmation."}
                </p>
              </section>

              {/* Deliverable 5 */}
              <section id="doc-5" className="space-y-3">
                <h4 className="text-sm font-extrabold text-sudan-green border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-sudan-gold" />
                  {currentLanguage === "ar" 
                    ? "5. إطار تطبيق الـ Zero-Trust السيادي" 
                    : "5. Zero-Trust Security Implementation Framework"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "تطبيق معايير الثقة المعدومة بشكل حاسم: 'لا تثق بأي مستخدم أو شبكة بشكل افتراضي، وتحقق دائماً'. يشمل التجزئة الدقيقة للشبكات وقصر صلاحيات الوصول إلى الحد الأدنى المفروض لكل مهمة وظيفية."
                    : "Applies continuous verification based on location, device posture, and transactional value. Micro-segmentation restricts data traversal between the Investment Lands portal and the payment database except through secure APIs."}
                </p>
              </section>

              {/* Deliverable 6 */}
              <section id="doc-6" className="space-y-3">
                <h4 className="text-sm font-extrabold text-sudan-green border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-sudan-gold" />
                  {currentLanguage === "ar" 
                    ? "6. الميثاق الاستراتيجي للحوكمة والتدقيق الأمني" 
                    : "6. Security Governance Framework"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "تأسيس لجان حوكمة الأمن السيبراني بالتكامل مع سجلات التدقيق المالي والإداري التابع للـ GRC لضمان المطابقة الكاملة للقوانين الاتحادية والشفافية التامة في مواجهة الثغرات والمحاولات التخريبية."
                    : "Governs roles, responsibilities, and auditing pathways for the CISO, SOC Analysts, and regulatory underwriters. Ensures that security vulnerabilities are translated directly into operational risk logs with resolution timelines."}
                </p>
              </section>

              {/* Deliverable 7 */}
              <section id="doc-7" className="space-y-3">
                <h4 className="text-sm font-extrabold text-sudan-green border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-sudan-gold" />
                  {currentLanguage === "ar" 
                    ? "7. دليل إدارة الكوارث واستعادة الأنظمة السيادية" 
                    : "7. Disaster Recovery & Cyber Resilience Integration Guide"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "تفصيل خطط استمرارية الأعمال الموثقة واستعادة قواعد البيانات عند الكوارث عبر النسخ الاحتياطية المشفرة متعددة المواقع لضمان استمرارية المعاملات التجارية الوطنية دون تأخير."
                    : "Outlines emergency recovery parameters to guarantee zero data loss (RPO = 0) and high-availability operations. Encrypted distributed backups ensure Ministry operations survive localized outages and critical hardware failures."}
                </p>
              </section>

              {/* Deliverable 8 */}
              <section id="doc-8" className="space-y-3">
                <h4 className="text-sm font-extrabold text-sudan-green border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sudan-gold" />
                  {currentLanguage === "ar" 
                    ? "8. التقرير الوطني الشامل للمركز SOC (Sovereign InfoSec Master Report)" 
                    : "8. Master Implementation Final Report"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold text-slate-800">
                  {currentLanguage === "ar" 
                    ? "✓ تم دمج وتطوير نظام العمليات الموحد بنجاح تام وهو متصل بكافة خوادم وسجلات التطبيق. المنصة الآن جاهزة للإنتاج، ومحصنة سيادياً، وذكية بالكامل وتطابق رؤية السودان الرقمية 2035."
                    : "✓ This master report confirms the successful integration of the unified SOC & InfoSec platform across all SDMCI modules. The system stands fully production-ready, zero-trust certified, AI-powered, and future-proof to protect Sudan's digital commerce."}
                </p>
              </section>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* Decorative Sudan Design Border */}
      <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-400 font-mono gap-2">
        <div className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-sudan-green" />
          <span>{currentLanguage === "ar" ? "الهيكل الفيدرالي لوزارة التجارة والصناعة الرقمية 2035 ©" : "Federal digital Ministry of Commerce & Industry System 2035 ©"}</span>
        </div>
        <div className="flex gap-3">
          <span>{currentLanguage === "ar" ? "رقم المطور: SD-SOC-2026-FIPS" : "Node Hash: SD-SOC-2026-FIPS"}</span>
          <span className="text-sudan-green">● {currentLanguage === "ar" ? "الربط آمن" : "Secure Line Connected"}</span>
        </div>
      </div>

    </div>
  );
}
