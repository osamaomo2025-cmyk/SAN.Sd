/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * Sovereign Disaster Recovery, Business Continuity & Digital Resilience Platform (SDRBCP) v1.0.0
 * Compliance with ISO/IEC 22301, ISO 27001 & NIST Cybersecurity Resilience Bounds
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, Activity, Database, Server, RefreshCw, AlertTriangle, 
  CheckCircle2, Clock, Play, FileText, BarChart3, HelpCircle, 
  Layers, Lock, Sliders, Settings, Radio, Send, Users, 
  Compass, HardDrive, Cpu, Terminal, Sparkles, Network, ArrowRightLeft,
  ChevronRight, ArrowUpRight, Flame, Shield, HeartPulse, FileSpreadsheet
} from "lucide-react";
import { UserRole } from "../types";

interface SovereignDRResiliencePlatformProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
}

// ---------------------- TYPES & INTERFACES ----------------------

interface BIAService {
  id: string;
  nameAr: string;
  nameEn: string;
  rto: string; // Recovery Time Objective
  rpo: string; // Recovery Point Objective
  priority: "Critical" | "High" | "Medium";
  readiness: number; // percentage
  status: "Normal" | "Degraded" | "Offline";
}

interface DRPlan {
  id: string;
  titleAr: string;
  titleEn: string;
  primarySite: string;
  drSite: string;
  failoverStatus: "Active" | "Standby" | "Failed Over";
  lastTested: string;
}

interface BackupItem {
  id: string;
  typeAr: string;
  typeEn: string;
  scope: string;
  hash: string;
  size: string;
  status: "Verified" | "Failed Verification" | "Pending";
  timestamp: string;
}

interface HAClusterNode {
  name: string;
  role: "Leader" | "Follower";
  region: string;
  cpu: number;
  ram: number;
  status: "Healthy" | "Degraded" | "Offline";
}

interface IncidentTimeline {
  id: string;
  time: string;
  eventAr: string;
  eventEn: string;
  status: "Resolved" | "Investigating" | "Monitoring";
  severity: "Critical" | "Warning" | "Info";
}

// ---------------------- SEED DATA ----------------------

const initialBiaServices: BIAService[] = [
  {
    id: "BIA-001",
    nameAr: "نظام السجل التجاري الفيدرالي الفوري",
    nameEn: "Federal Commercial Registry Core Engine",
    rto: "5 minutes",
    rpo: "1 minute",
    priority: "Critical",
    readiness: 100,
    status: "Normal"
  },
  {
    id: "BIA-002",
    nameAr: "بوابة الدفع والجباية والتسويات السيادية",
    nameEn: "Sovereign Payment Gateway & Reconciliation",
    rto: "15 minutes",
    rpo: "5 minutes",
    priority: "Critical",
    readiness: 98,
    status: "Normal"
  },
  {
    id: "BIA-003",
    nameAr: "منصة التفتيش والإنفاذ والرقابة الذكية للمصانع",
    nameEn: "Smart Industrial Inspection & Safety Platform",
    rto: "2 hours",
    rpo: "30 minutes",
    priority: "High",
    readiness: 95,
    status: "Normal"
  },
  {
    id: "BIA-004",
    nameAr: "بوابة الاستيراد والتصدير والمطابقة القياسية",
    nameEn: "Import/Export Permits & Standardization Gate",
    rto: "1 hour",
    rpo: "15 minutes",
    priority: "High",
    readiness: 92,
    status: "Normal"
  },
  {
    id: "BIA-005",
    nameAr: "منصة الذكاء الاصطناعي والرقابة وحوكمة النماذج",
    nameEn: "National AI Governance & Intelligence Engine",
    rto: "4 hours",
    rpo: "2 hours",
    priority: "Medium",
    readiness: 89,
    status: "Normal"
  }
];

const initialDRPlans: DRPlan[] = [
  {
    id: "DRP-MCT-01",
    titleAr: "خطة مجابهة الفشل الكلي لمركز البيانات الرئيسي بالخرطوم",
    titleEn: "Khartoum Primary Data Center Total Outage Protocol",
    primarySite: "Khartoum Main Server Farm (Active-A)",
    drSite: "Port Sudan Federal Digital Center (Active-B)",
    failoverStatus: "Active",
    lastTested: "2026-07-01 02:00 UTC"
  },
  {
    id: "DRP-DB-02",
    titleAr: "استعادة السجلات وقاعدة البيانات عند حدوث تلف كلي",
    titleEn: "MySQL/Firestore Master Corruptions Recovery Plan",
    primarySite: "Cloud SQL Main Instance (Primary)",
    drSite: "Multi-Region Read Replica & Cold Vault",
    failoverStatus: "Standby",
    lastTested: "2026-06-15 23:30 UTC"
  },
  {
    id: "DRP-CYBER-03",
    titleAr: "تطويق وفصل الأنظمة المصابة جراء هجوم سيبراني معقد",
    titleEn: "Advanced Ransomware / DDoS Containment & Rebuild",
    primarySite: "Production Network Ingress",
    drSite: "Isolated Sandbox Security Zone (DMZ-DR)",
    failoverStatus: "Standby",
    lastTested: "2026-07-12 04:15 UTC"
  }
];

const initialBackups: BackupItem[] = [
  {
    id: "BKP-DB-9041",
    typeAr: "قاعدة البيانات الشاملة (MySQL Enterprise)",
    typeEn: "Federal Commerce Core DB (MySQL Enterprise)",
    scope: "Full Transaction Ledger & Audits",
    hash: "sha256-a4f78e0d49f0d1109bc48da0...",
    size: "1.4 TB",
    status: "Verified",
    timestamp: "2026-07-17 04:00 UTC"
  },
  {
    id: "BKP-DOC-8942",
    typeAr: "مستندات السجلات وعقود التأسيس المؤرشفة",
    typeEn: "Corporate Deeds & Archive Documents Vault",
    scope: "PDF/A Encrypted Raw Blobs",
    hash: "sha256-9b1e07fc543e0d8900ef65bb...",
    size: "4.8 TB",
    status: "Verified",
    timestamp: "2026-07-17 03:30 UTC"
  },
  {
    id: "BKP-AI-7729",
    typeAr: "أوزان ومعاملات نماذج الذكاء الاصطناعي السيادية",
    typeEn: "Sovereign AI Core Weights & Embedding Models",
    scope: "Tensor Weight Checkpoints",
    hash: "sha256-fc594830de449f880ef201c1...",
    size: "34.2 GB",
    status: "Verified",
    timestamp: "2026-07-16 22:00 UTC"
  },
  {
    id: "BKP-API-3109",
    typeAr: "إعدادات مفاتيح ربط بوابات التكامل الرقمي",
    typeEn: "Interoperability API Gateway Rules & Route Maps",
    scope: "YAML Declarative Blueprint",
    hash: "sha256-1a9c33de00fc88ab0e99881d...",
    size: "850 KB",
    status: "Verified",
    timestamp: "2026-07-17 04:15 UTC"
  }
];

const initialNodes: HAClusterNode[] = [
  { name: "k8s-sdmci-prd-node-01", role: "Leader", region: "Khartoum-West", cpu: 42, ram: 58, status: "Healthy" },
  { name: "k8s-sdmci-prd-node-02", role: "Follower", region: "Khartoum-West", cpu: 31, ram: 49, status: "Healthy" },
  { name: "k8s-sdmci-dr-node-01", role: "Follower", region: "Port-Sudan", cpu: 12, ram: 25, status: "Healthy" },
  { name: "k8s-sdmci-dr-node-02", role: "Follower", region: "Port-Sudan", cpu: 8, ram: 22, status: "Healthy" }
];

const initialTimeline: IncidentTimeline[] = [
  {
    id: "EVT-902",
    time: "2026-07-17 04:02 UTC",
    eventAr: "اكتمال التحقق التلقائي للنسخة الاحتياطية غير القابلة للتعديل بنجاح",
    eventEn: "Automated verification of Immutable Ledger Backup completed successfully",
    status: "Resolved",
    severity: "Info"
  },
  {
    id: "EVT-901",
    time: "2026-07-16 11:34 UTC",
    eventAr: "رصد حمل مروري زائد على نظام الدفع؛ تفعيل معايير التوسيع التلقائي (Auto-scaling)",
    eventEn: "High traffic surge on Payment Gateway; Auto-scaling group spun up 2 new instances",
    status: "Resolved",
    severity: "Info"
  },
  {
    id: "EVT-899",
    time: "2026-07-15 01:22 UTC",
    eventAr: "انقطاع عابر في شبكة الربط مع السجل المدني؛ تحويل المسار تلقائياً للخادم الاحتياطي",
    eventEn: "Transient connection drop with Civil Registry; gateway routed queries to backup node",
    status: "Resolved",
    severity: "Warning"
  }
];

export default function SovereignDRResiliencePlatform({ currentLanguage, role }: SovereignDRResiliencePlatformProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "bcm" | "dr" | "ha" | "backup" | "crisis">("dashboard");

  // Core States
  const [biaServices, setBiaServices] = useState<BIAService[]>(initialBiaServices);
  const [drPlans, setDrPlans] = useState<DRPlan[]>(initialDRPlans);
  const [backups, setBackups] = useState<BackupItem[]>(initialBackups);
  const [clusterNodes, setClusterNodes] = useState<HAClusterNode[]>(initialNodes);
  const [timeline, setTimeline] = useState<IncidentTimeline[]>(initialTimeline);

  // Simulation & Logs States
  const [failoverLogs, setFailoverLogs] = useState<string[]>([]);
  const [isSimulatingFailover, setIsSimulatingFailover] = useState(false);
  const [simulatedFailoverState, setSimulatedFailoverState] = useState<"Primary" | "FailoverInProgress" | "FailedOver" | "FailbackInProgress">("Primary");

  const [backupLogs, setBackupLogs] = useState<string[]>([]);
  const [isSimulatingBackup, setIsSimulatingBackup] = useState(false);

  // AI Resilience Advisor States
  const [aiAdvisorReport, setAiAdvisorReport] = useState<string | null>(null);
  const [isAdvisorAnalyzing, setIsAdvisorAnalyzing] = useState(false);

  // Crisis Dashboard States
  const [crisisLevel, setCrisisLevel] = useState<"Normal" | "Elevated" | "Severe" | "Critical">("Normal");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDesc, setIncidentDesc] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState<"Critical" | "Warning" | "Info">("Warning");

  // Resilience score indices
  const overallResilienceIndex = 99.98; // % availability
  const disasterReadinessScore = 98.5; // %
  const mttrMinutes = 4.2; // Mean Time to Recover

  const isOperatorAuthorized = role === UserRole.GOVERNMENT_MINISTER || role === UserRole.GOVERNMENT_EXECUTIVE;

  // 1. Simulator: Failover Routine (Khartoum -> Port Sudan)
  const triggerFailoverSimulation = () => {
    if (isSimulatingFailover) return;
    setIsSimulatingFailover(true);
    setFailoverLogs([]);
    setSimulatedFailoverState("FailoverInProgress");

    const appendLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setFailoverLogs(prev => [...prev, msg]);
      }, delay);
    };

    appendLog(`🚨 [${new Date().toLocaleTimeString()}] [DR DETECTOR] High Critical Alert: Severe network loss at Khartoum Primary Data Center (Active-A). RTO clock started.`, 100);
    appendLog(`🔍 [${new Date().toLocaleTimeString()}] [DR VALIDATOR] Verifying Cloud database replication status: Sync state within safe RPO boundary (7 seconds lag).`, 500);
    appendLog(`⚖️ [${new Date().toLocaleTimeString()}] [FAILOVER PROTOCOL] Automated declaration approved under Decree No. 104/Resilience.`, 900);
    appendLog(`🔌 [${new Date().toLocaleTimeString()}] [INTELLIGENT GATEWAY] Re-routing global domain entries (DNS API) to Port Sudan Federal Digital Center.`, 1300);
    appendLog(`📦 [${new Date().toLocaleTimeString()}] [KUBERNETES-DR] Auto-scaling replica sets at Port Sudan Site to take full commercial load (4 target nodes).`, 1700);
    appendLog(`🔐 [${new Date().toLocaleTimeString()}] [INTEGRITY CHECK] Verifying cryptographic API secrets and TLS key handshakes in Port Sudan...`, 2100);
    appendLog(`✅ [${new Date().toLocaleTimeString()}] [SUCCESS] Failover complete. All G2G/G2B services active and responsive in Port Sudan. MTTR: 2.1 minutes!`, 2500);

    setTimeout(() => {
      setIsSimulatingFailover(false);
      setSimulatedFailoverState("FailedOver");
      setBiaServices(prev => prev.map(srv => ({
        ...srv,
        status: srv.id === "BIA-001" ? "Normal" : srv.status,
        readiness: 100
      })));
      // Add timeline item
      const newEvt: IncidentTimeline = {
        id: `EVT-${Math.floor(Math.random() * 900) + 100}`,
        time: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
        eventAr: "تم إجراء المحاكاة الكاملة لتحويل المسار الفيدرالي إلى مركز بورتسودان البديل بنجاح",
        eventEn: "Full simulated federal failover to Port Sudan DR Site completed successfully",
        status: "Resolved",
        severity: "Critical"
      };
      setTimeline(prev => [newEvt, ...prev]);
    }, 2700);
  };

  // 2. Simulator: Failback (Port Sudan -> Khartoum)
  const triggerFailbackSimulation = () => {
    if (isSimulatingFailover) return;
    setIsSimulatingFailover(true);
    setFailoverLogs([]);
    setSimulatedFailoverState("FailbackInProgress");

    const appendLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setFailoverLogs(prev => [...prev, msg]);
      }, delay);
    };

    appendLog(`🔄 [${new Date().toLocaleTimeString()}] [DR CONTROLLER] Starting secure failback sequence. Verifying Khartoum primary health...`, 100);
    appendLog(`📊 [${new Date().toLocaleTimeString()}] [DB REPLICATOR] Re-syncing database delta delta changes from Port Sudan back to Khartoum Primary.`, 500);
    appendLog(`🛡️ [${new Date().toLocaleTimeString()}] [DR AUDITOR] Auditing all transaction hashes to guarantee zero loss of merchant registrations.`, 1000);
    appendLog(`🌐 [${new Date().toLocaleTimeString()}] [DNS SWITCH] Gradual traffic redirection: 20% -> 50% -> 100% to Khartoum.`, 1500);
    appendLog(`✅ [${new Date().toLocaleTimeString()}] [SUCCESS] Failback completed. Primary Khartoum Data Center restored as Active-A.`, 2000);

    setTimeout(() => {
      setIsSimulatingFailover(false);
      setSimulatedFailoverState("Primary");
      // Add timeline item
      const newEvt: IncidentTimeline = {
        id: `EVT-${Math.floor(Math.random() * 900) + 100}`,
        time: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
        eventAr: "تمت استعادة العمل من مركز الخرطوم الرئيسي بنجاح وبدون أي فقد للبيانات",
        eventEn: "Production workloads successfully returned to Khartoum Primary site with zero data loss",
        status: "Resolved",
        severity: "Info"
      };
      setTimeline(prev => [newEvt, ...prev]);
    }, 2200);
  };

  // 3. Simulator: Immutable Backup Engine
  const triggerBackupSimulation = () => {
    setIsSimulatingBackup(true);
    setBackupLogs([]);

    const appendBLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setBackupLogs(prev => [...prev, msg]);
      }, delay);
    };

    appendBLog(`💾 [${new Date().toLocaleTimeString()}] Initiating secure, encrypted, immutable backup cycle (ISO 27001 compliant)...`, 100);
    appendBLog(`🔒 [${new Date().toLocaleTimeString()}] Applying AES-256-GCM symmetric block encryption on live system storage snapshot.`, 400);
    appendBLog(`⛓️ [${new Date().toLocaleTimeString()}] Generating decentralized blockchain-grade SHA-256 state signatures to prevent write overrides (WORM structure).`, 800);
    appendBLog(`📦 [${new Date().toLocaleTimeString()}] Transferring binary chunks across multi-region secure fiber backbones to cold vaults.`, 1200);
    appendBLog(`🛡️ [${new Date().toLocaleTimeString()}] Automated verification check: Mount state valid, hashes match exactly. SUCCESS.`, 1600);

    setTimeout(() => {
      setIsSimulatingBackup(false);
      const newBkp: BackupItem = {
        id: `BKP-AUTO-${Math.floor(Math.random() * 9000) + 1000}`,
        typeAr: "قاعدة البيانات والمعاملات المؤتمتة",
        typeEn: "Automated Encrypted Commerce Ledger",
        scope: "Full Transaction Ledger",
        hash: "sha256-7c38de0019fa00bc8e8fa911...",
        size: "1.45 TB",
        status: "Verified",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC"
      };
      setBackups([newBkp, ...backups]);
    }, 1800);
  };

  // 4. Simulator: AI Resilience Advisor Reports
  const runAIAdvisorAnalysis = () => {
    setIsAdvisorAnalyzing(true);
    setAiAdvisorReport(null);

    setTimeout(() => {
      setIsAdvisorAnalyzing(false);
      setAiAdvisorReport(
        currentLanguage === "ar"
          ? "📊 تقرير مستشار الذكاء الاصطناعي للمرونة والتعافي (SDRBCP):\n\n" +
            "• تحليل انحراف الخدمة: تم فحص زمن الاستجابة على بوابة الدفع. نتوقع احتمالية بنسبة %12 لارتفاع زمن الاستجابة في نهاية الشهر بناءً على البيانات التاريخية.\n" +
            "• تحسين التوزيع التلقائي: يوصى بإنقاص عتبة تفعيل الـ CPU التوسيعي من %75 إلى %65 في أنظمة الاستيراد والتصدير قبل فترات الأعياد.\n" +
            "• اكتشاف السلوك الشاذ: لا يوجد أي اختناق حالي في خوادم السجل المدني الفيدرالي. جودة الاتصال وتزامن قواعد البيانات مستقرة بنسبة %100.\n" +
            "• جاهزية بورتسودان: اختبار التحقق التلقائي للربط الاحتياطي يؤكد إمكانية تحمل بورتسودان لـ %120 من حركة العمل الفيدرالية فورياً وبدون إخلال بمستويات الخدمة (SLA)."
          : "📊 Sovereign AI Resilience & Continuity Assessment:\n\n" +
            "• FAILURE PREDICTION: Analysis of Payment Gateway response variance indicates a negligible (12%) risk of processing latency at month-end under standard scaling limits.\n" +
            "• RECONSTRUCTIVE OPTIMIZATION: Advise lowering the CPU threshold of the Import/Export Auto-scaling Group from 75% to 65% in anticipation of the upcoming export season peak.\n" +
            "• ANOMALY MONITORING: Sync lag between Khartoum Primary and Port Sudan DR replicas is perfect (avg 4.2 seconds). Zero cluster health anomalies registered.\n" +
            "• MULTI-SITE CAPACITY: Port Sudan DR Site is verified capable of assuming 120% of federal workload in real-time, meeting full compliance metrics under ISO 22301."
      );
    }, 1500);
  };

  // 5. Action: File new crisis incident alert
  const submitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle.trim() || !incidentDesc.trim()) return;

    const newEvt: IncidentTimeline = {
      id: `EVT-${Math.floor(Math.random() * 900) + 100}`,
      time: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      eventAr: incidentTitle,
      eventEn: incidentTitle,
      status: "Investigating",
      severity: incidentSeverity
    };

    setTimeline([newEvt, ...timeline]);
    setIncidentTitle("");
    setIncidentDesc("");
    setCrisisLevel("Elevated");
  };

  return (
    <div className="space-y-6" id="digital-resilience-platform-wrapper">
      {/* Resilient Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 text-white p-6 rounded-2xl shadow-xl border border-rose-900/40 relative overflow-hidden" id="sdrbcp-header-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-500/20 text-rose-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-rose-500/30 font-mono tracking-wider">
                ISO 22301 & NIST RESILIENT
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                {currentLanguage === "ar" ? "جاهزية الكوارث نشطة %100" : "Disaster Readiness Active 100%"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2" style={{ fontFamily: "var(--font-arabic)" }}>
              {currentLanguage === "ar" ? "المنصة الاتحادية لاستمرارية الأعمال والمرونة الرقمية" : "Sovereign Digital Resilience & Business Continuity"}
            </h1>
            <p className="text-gray-300 text-sm max-w-4xl">
              {currentLanguage === "ar" 
                ? "النظام القومي الموحد لإدارة وتأمين استمرارية الخدمات السيادية لوزارة التجارة والصناعة وتأمين التعافي السريع عند الطوارئ، مع حماية غير قابلة للاختراق لبيانات المستثمرين وسجلات التجارة."
                : "The federal platform managing, monitoring, and executing enterprise disaster recovery, business continuity (BCM), real-time high availability (HA), crisis communications, and immutable immutable backups across all strategic ministry workloads."}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-rose-950 self-stretch md:self-auto justify-center">
            <HeartPulse className="w-10 h-10 text-rose-400 animate-pulse" />
            <div className="text-right font-mono text-xs">
              <div className="text-gray-400">{currentLanguage === "ar" ? "مؤشر الجاهزية الفيدرالي" : "Disaster Readiness"}</div>
              <div className="text-lg font-bold text-rose-400">{disasterReadinessScore}%</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-800 pt-4 relative z-10" id="sdrbcp-tabs">
          {[
            { id: "dashboard", labelAr: "لوحة المرونة والجاهزية", labelEn: "Sovereign Health & Alerts", icon: Activity },
            { id: "bcm", labelAr: "استمرارية الأعمال وتحليل الأثر (BIA)", labelEn: "Business Impact & RTO/RPO", icon: FileText },
            { id: "dr", labelAr: "مجابهة الكوارث وتحويل المسار (DR)", labelEn: "Disaster Failover Panel", icon: ArrowRightLeft },
            { id: "ha", labelAr: "البنية السحابية والمجموعات (HA)", labelEn: "High Availability & Kubernetes", icon: Server },
            { id: "backup", labelAr: "النسخ الاحتياطي غير القابل للتعديل", labelEn: "Immutable Backups Vault", icon: Database },
            { id: "crisis", labelAr: "مركز قيادة الأزمات الفيدرالي", labelEn: "Crisis Command Center", icon: ShieldAlert }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-rose-600 text-white shadow-lg font-bold border border-rose-500" 
                    : "bg-slate-950/40 text-slate-300 hover:bg-slate-900/60 hover:text-white border border-slate-800"
                }`}
              >
                <IconComponent className="w-4 h-4 text-rose-400" />
                <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Render Pipeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 200 }}
        >
          {/* TAB 1: DASHBOARD & ACTIVE ALERTS */}
          {activeTab === "dashboard" && (
            <div className="space-y-6" id="dr-dash-tab">
              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "معدل توفر الخدمة السنوي" : "ANNUAL SERVICE UPTIME"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-emerald-600">{overallResilienceIndex}%</span>
                    <span className="text-gray-500 text-xs block mt-1">{currentLanguage === "ar" ? "متوافق مع مستويات الخدمة SLA" : "Exceeding Target SLA Guidelines"}</span>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl">
                    <HeartPulse className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "متوسط زمن التعافي (MTTR)" : "MEAN RECOVERY TIME"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-slate-900">{mttrMinutes} Mins</span>
                    <span className="text-emerald-500 text-xs block mt-1 font-semibold">⚡ {currentLanguage === "ar" ? "تعافي آلي شبه فوري" : "Automated Replication Sync"}</span>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-rose-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "حالة النسخ الاحتياطي" : "IMMUTABLE VAULT HEALTH"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-indigo-600">100% SECURE</span>
                    <span className="text-emerald-500 text-xs block mt-1 font-semibold">✓ {currentLanguage === "ar" ? "تأكيد فوري رقمي" : "Continuous Cryptographic Check"}</span>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-xl">
                    <Lock className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "حالة الأزمة الفيدرالية" : "CRISIS COMMAND STATE"}
                    </span>
                    <span className={`text-3xl font-bold font-mono ${
                      crisisLevel === "Normal" ? "text-emerald-600" : "text-amber-600"
                    }`}>{crisisLevel.toUpperCase()}</span>
                    <span className="text-gray-500 text-xs block mt-1">{currentLanguage === "ar" ? "لا توجد أخطار نشطة حالياً" : "Zero High-Impact Outages"}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <Radio className="w-6 h-6 text-slate-600 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Real-time Health Monitors */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "حالة الأنظمة الحيوية وبوابات الربط" : "Sovereign Workload Health Index"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {currentLanguage === "ar" ? "مراقبة مستمرة لنقاط النهاية وقواعد البيانات وحوكمة الاستجابة" : "Real-time service indicators, replication lag, and latency alerts"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { nameAr: "قاعدة بيانات السجل التجاري", nameEn: "Commercial Core Database", status: "Healthy", type: "MySQL Cluster", latency: "4ms", rpo: "0 sec" },
                      { nameAr: "بوابة الربط مع السجل المدني", nameEn: "Civil Identity Gateway", status: "Healthy", type: "REST API Tunnel", latency: "12ms", rpo: "Real-time" },
                      { nameAr: "بوابة المطابقة الجمركية والضرائب", nameEn: "Customs & Tax Federation API", status: "Healthy", type: "mTLS Secured API", latency: "22ms", rpo: "Real-time" },
                      { nameAr: "محرك حوكمة الذكاء الاصطناعي", nameEn: "Sovereign AI Inference Engine", status: "Healthy", type: "Tensor-Edge Hub", latency: "45ms", rpo: "Cold Standby" }
                    ].map((srv, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-between">
                        <div className="space-y-1 text-xs">
                          <span className="font-bold text-slate-950 block" style={{ fontFamily: "var(--font-arabic)" }}>
                            {currentLanguage === "ar" ? srv.nameAr : srv.nameEn}
                          </span>
                          <span className="text-gray-400 block text-[10px]">{srv.type} | Latency: {srv.latency}</span>
                          <span className="text-gray-400 block text-[10px]">RPO Target Status: <strong className="text-emerald-600">{srv.rpo}</strong></span>
                        </div>
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200 flex items-center gap-1 shrink-0">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span>HEALTHY</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Resilience Advisor Quick Run */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl min-h-[300px]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                        <span className="font-bold text-sm tracking-wider" style={{ fontFamily: "var(--font-arabic)" }}>
                          {currentLanguage === "ar" ? "مستشار المرونة الرقمية الذكي" : "AI Resilience Advisor"}
                        </span>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2.5 py-0.5 rounded font-mono font-bold">
                        ISO 22301 AGENT
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      {currentLanguage === "ar"
                        ? "قم بتشغيل وكيل الذكاء الاصطناعي للتنبؤ بأي تراجع في أداء الخوادم السحابية، وتحليل فجوات RTO/RPO، والحصول على إرشادات التعافي التلقائي."
                        : "Analyze real-time replication metrics, forecast infrastructure bottleneck events, and receive auto-remediation playbooks."}
                    </p>

                    <button
                      onClick={runAIAdvisorAnalysis}
                      disabled={isAdvisorAnalyzing}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      {isAdvisorAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>RUNNING AI SIMULATOR...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{currentLanguage === "ar" ? "تشغيل مستشار المرونة الذكي" : "Execute AI Advisor"}</span>
                        </>
                      )}
                    </button>

                    {aiAdvisorReport && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed font-mono text-gray-300 whitespace-pre-wrap max-h-[220px] overflow-y-auto"
                      >
                        {aiAdvisorReport}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUSINESS CONTINUITY (BIA) */}
          {activeTab === "bcm" && (
            <div className="space-y-6" id="bcm-bia-tab">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg" style={{ fontFamily: "var(--font-arabic)" }}>
                    {currentLanguage === "ar" ? "تحليل الأثر المالي والتشغيلي (BIA) للخدمات الحيوية" : "Business Impact Analysis (BIA) & Service Prioritization"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {currentLanguage === "ar" ? "تحديد أهداف زمن استعادة الخدمة (RTO) وتفادي فقد البيانات (RPO) بالتكامل مع المخطط الاستراتيجي الفيدرالي" : "Federal alignment of Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) under ISO 22301 limits"}
                  </p>
                </div>

                <div className="space-y-3">
                  {biaServices.map((srv) => {
                    const isCritical = srv.priority === "Critical" || srv.priority === "High";
                    return (
                      <div key={srv.id} className="p-4 rounded-xl bg-slate-50 border border-gray-100 flex flex-col md:flex-row justify-between gap-4 text-xs">
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-gray-400">[{srv.id}]</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              srv.priority === "Critical" ? "bg-red-100 text-red-800" : srv.priority === "High" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {srv.priority.toUpperCase()} PRIORITY
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">
                              Readiness: {srv.readiness}%
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-950 text-xs" style={{ fontFamily: "var(--font-arabic)" }}>
                            {currentLanguage === "ar" ? srv.nameAr : srv.nameEn}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-right md:text-left self-stretch md:self-auto font-semibold text-slate-800">
                          <div>
                            <span className="text-gray-400 block text-[9px] font-normal">{currentLanguage === "ar" ? "هدف زمن الاستعادة RTO" : "RTO Limit"}</span>
                            <span>{srv.rto}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[9px] font-normal">{currentLanguage === "ar" ? "نقطة فقد البيانات RPO" : "RPO Limit"}</span>
                            <span>{srv.rpo}</span>
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <span className="text-gray-400 block text-[9px] font-normal">{currentLanguage === "ar" ? "الحالة التشغيلية" : "Operation State"}</span>
                            <span className="text-emerald-600 flex items-center gap-1 md:justify-start">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                              {srv.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DISASTER RECOVERY FAILOVER CONTROL */}
          {activeTab === "dr" && (
            <div className="space-y-6" id="dr-failover-tab">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Failover Controls & Testing */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "مركز تحويل المسار والتحكم التلقائي الفيدرالي" : "Sovereign Failover Control Center"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLanguage === "ar" ? "تفعيل إجراءات نقل المسار بالكامل إلى بورتسودان في الحالات الطارئة، وإعادة المسار بنقرة واحدة عند استقرار الأنظمة" : "Securely shift full digital commerce traffic from Khartoum Primary to Port Sudan DR site with unified validation"}
                    </p>
                  </div>

                  {/* Visual Failover Status State */}
                  <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2">
                      <span className="text-rose-400 text-xs font-bold uppercase tracking-widest font-mono">DR Workload Target Site</span>
                      <h4 className="text-xl font-bold font-mono">
                        {simulatedFailoverState === "Primary" && "KHARTOUM PRIMARY (ACTIVE)"}
                        {simulatedFailoverState === "FailoverInProgress" && "SHIFTING Workloads to Port Sudan..."}
                        {simulatedFailoverState === "FailedOver" && "PORT SUDAN DR SITE (ACTIVE)"}
                        {simulatedFailoverState === "FailbackInProgress" && "RESTORING Workloads to Khartoum..."}
                      </h4>
                      <p className="text-xs text-gray-400 max-w-md">
                        {currentLanguage === "ar"
                          ? "حالة مزامنة قاعدة البيانات الفيدرالية: متطابقة بنسبة %100 وبدون فقد أي سجلات تجارية."
                          : "Federal commercial SQL database state: Perfect transactional integrity verified."}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      {simulatedFailoverState === "Primary" && isOperatorAuthorized && (
                        <button
                          onClick={triggerFailoverSimulation}
                          disabled={isSimulatingFailover}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          <Flame className="w-4 h-4 animate-pulse text-white" />
                          <span>{currentLanguage === "ar" ? "إعلان الكارثة وتحويل المسار لبورتسودان" : "Declare Disaster & Failover"}</span>
                        </button>
                      )}

                      {simulatedFailoverState === "FailedOver" && isOperatorAuthorized && (
                        <button
                          onClick={triggerFailbackSimulation}
                          disabled={isSimulatingFailover}
                          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{currentLanguage === "ar" ? "استعادة العمل للخرطوم (Failback)" : "Trigger Failback to Khartoum"}</span>
                        </button>
                      )}

                      {isSimulatingFailover && (
                        <div className="px-6 py-3 bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>ORCHESTRATING CLOUD SWITCH...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detailed Simulation Logs */}
                  {failoverLogs.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-bold text-gray-900 text-xs font-mono">{currentLanguage === "ar" ? "سجل تتبع تحويل المسار الفوري:" : "Live Disaster Failover Logs:"}</div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-xs font-mono text-emerald-400 space-y-1 max-h-[220px] overflow-y-auto">
                        {failoverLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Active Plans Document list */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-arabic)" }}>
                    <FileText className="w-4.5 h-4.5 text-rose-600" />
                    <span>{currentLanguage === "ar" ? "خطط مجابهة الطوارئ المعتمدة" : "Active Disaster Recovery Plans"}</span>
                  </h3>

                  <div className="space-y-3">
                    {drPlans.map((plan) => (
                      <div key={plan.id} className="p-3.5 bg-slate-50 border border-gray-100 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center border-b border-gray-200/50 pb-1.5">
                          <span className="font-mono text-[10px] text-gray-400">[{plan.id}]</span>
                          <span className="bg-rose-100 text-rose-800 text-[8px] font-bold px-2 py-0.5 rounded">
                            {plan.failoverStatus}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-950 leading-snug" style={{ fontFamily: "var(--font-arabic)" }}>
                          {currentLanguage === "ar" ? plan.titleAr : plan.titleEn}
                        </h4>
                        <div className="text-[10.5px] text-gray-500 font-medium space-y-1">
                          <div>
                            <strong>Primary:</strong> {plan.primarySite}
                          </div>
                          <div>
                            <strong>DR Target:</strong> {plan.drSite}
                          </div>
                          <div>
                            <strong>Last Verified:</strong> {plan.lastTested}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HIGH AVAILABILITY & KUBERNETES */}
          {activeTab === "ha" && (
            <div className="space-y-6" id="ha-cluster-tab">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "إدارة مجموعات الحوسبة السحابية (Kubernetes HA)" : "High Availability & Kubernetes Cluster Engine"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLanguage === "ar" ? "متابعة توزيع الأحمال، تكرار حاويات التفتيش والـ APIs، وقواعد التوسيع التلقائي الذاتية المعالجة" : "Monitor container pod densities, load balancers, and self-healing cloud instances under NIST controls"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {clusterNodes.map((node, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-gray-100 space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Server className="w-4 h-4 text-rose-600" />
                          <span className="font-bold text-slate-900 font-mono text-[11px]">{node.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          node.role === "Leader" ? "bg-purple-100 text-purple-800" : "bg-slate-200 text-slate-800"
                        }`}>
                          {node.role}
                        </span>
                      </div>

                      <div className="space-y-1 text-gray-600">
                        <div className="flex justify-between">
                          <span>{currentLanguage === "ar" ? "المنطقة الفيدرالية" : "Sovereign Region"}</span>
                          <span className="font-semibold text-slate-800">{node.region}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{currentLanguage === "ar" ? "استهلاك الـ CPU" : "CPU Load"}</span>
                          <span className="font-semibold text-slate-800 font-mono">{node.cpu}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{currentLanguage === "ar" ? "ذاكرة النظام (RAM)" : "RAM Load"}</span>
                          <span className="font-semibold text-slate-800 font-mono">{node.ram}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1.5 border-t border-dashed border-gray-200">
                        <span className="text-gray-400 text-[10px]">{currentLanguage === "ar" ? "حالة الخدمة" : "Status Indicator"}</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          {node.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: IMMUTABLE BACKUPS REGISTRY */}
          {activeTab === "backup" && (
            <div className="space-y-6" id="backups-vault-tab">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Backups Catalog */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "سجل النسخ الاحتياطية غير القابلة للتعديل والمسجلة بالبصمة" : "Sovereign Immutable Ledger & Backups Vault"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {currentLanguage === "ar" ? "نسخ احتياطية مشفرة بالكامل ومعزولة ومزودة ببصمات SHA-256 لمنع الهجمات الخبيثة أو التعديل الخارجي" : "Tamper-proof storage snapshots protecting databases, API logs, certificates, and AI weights under strict security"}
                      </p>
                    </div>

                    <button
                      onClick={triggerBackupSimulation}
                      disabled={isSimulatingBackup}
                      className="px-4 py-2 bg-rose-700 hover:bg-rose-800 disabled:bg-gray-200 text-white font-bold rounded-xl text-xs cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      {isSimulatingBackup ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>BACKING UP...</span>
                        </>
                      ) : (
                        <>
                          <Database className="w-3.5 h-3.5" />
                          <span>{currentLanguage === "ar" ? "أخذ نسخة احتياطية فورية" : "Trigger Instant Backup"}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {backups.map((bkp) => (
                      <div key={bkp.id} className="p-4 rounded-xl bg-slate-50 border border-gray-100 text-xs space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-200/50 pb-2">
                          <div>
                            <span className="font-mono text-gray-400 text-[9px] block">[{bkp.id}]</span>
                            <h4 className="font-bold text-slate-950 text-xs" style={{ fontFamily: "var(--font-arabic)" }}>
                              {currentLanguage === "ar" ? bkp.typeAr : bkp.typeEn}
                            </h4>
                          </div>

                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded self-start sm:self-auto border border-emerald-200">
                            {bkp.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-600 font-medium">
                          <div>
                            <span className="text-gray-400 block text-[9px]">{currentLanguage === "ar" ? "حجم النسخة الاحتياطية" : "File Size"}</span>
                            <span className="text-slate-800 font-mono">{bkp.size}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[9px]">{currentLanguage === "ar" ? "نطاق الحفظ" : "Storage Target Scope"}</span>
                            <span className="text-slate-800">{bkp.scope}</span>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <span className="text-gray-400 block text-[9px]">{currentLanguage === "ar" ? "تاريخ الحفظ والتحقق" : "Timestamp (UTC)"}</span>
                            <span className="text-slate-800 font-mono text-[10px]">{bkp.timestamp}</span>
                          </div>
                        </div>

                        <div className="bg-gray-100 p-2 rounded border border-gray-200 font-mono text-[10px] text-gray-500 overflow-x-auto">
                          <strong>SHA-256 Sign:</strong> {bkp.hash}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Simulated Log of last backup run */}
                <div className="space-y-6">
                  {/* Backup Status summary */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-arabic)" }}>
                      <Lock className="w-4.5 h-4.5 text-indigo-600" />
                      <span>{currentLanguage === "ar" ? "معايير أمان الحفظ الرقمي" : "Resilient Cryptography Standards"}</span>
                    </h3>

                    <div className="space-y-2 text-xs text-gray-600 font-medium leading-relaxed">
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span>Encryption</span>
                        <span className="text-slate-800 font-bold">AES-256 GCM (Enforced)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span>Immutable Vault (WORM)</span>
                        <span className="text-emerald-600 font-bold">Enforced (Active)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span>Multi-Region replication</span>
                        <span className="text-emerald-600 font-bold">3 Federal Vaults Sync</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Automated Verification</span>
                        <span className="text-emerald-600 font-bold">Every 2 Hours</span>
                      </div>
                    </div>
                  </div>

                  {backupLogs.length > 0 && (
                    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-2">
                      <div className="font-bold text-xs font-mono text-rose-400">VAULT SYNC PROTOCOL:</div>
                      <div className="text-[10.5px] font-mono text-gray-300 space-y-1 max-h-[180px] overflow-y-auto">
                        {backupLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CRISIS MANAGEMENT & INCIDENTS TIMELINE */}
          {activeTab === "crisis" && (
            <div className="space-y-6" id="crisis-management-tab">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline and Active alerts */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "سجل الأحداث ومجابهة المخاطر الفوري" : "Sovereign Crisis & Incident Ledger"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLanguage === "ar" ? "رصد المشكلات التشغيلية والأزمات الفيدرالية مع تتبع الحلول والدروس المستفادة" : "Track system interruptions, power anomalies, and recovery tasks under strict audit logging"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {timeline.map((evt) => {
                      const isCritical = evt.severity === "Critical";
                      return (
                        <div key={evt.id} className="p-4 rounded-xl bg-slate-50 border border-gray-100 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-gray-400">[{evt.id}]</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                isCritical ? "bg-red-100 text-red-800" : evt.severity === "Warning" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                              }`}>
                                {evt.severity}
                              </span>
                              <span className="text-gray-400 font-mono text-[10px]">{evt.time}</span>
                            </div>

                            <p className="font-bold text-slate-900" style={{ fontFamily: "var(--font-arabic)" }}>
                              {currentLanguage === "ar" ? evt.eventAr : evt.eventEn}
                            </p>
                          </div>

                          <div className="flex items-center">
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                              {evt.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Report Incident / Crisis Declaration Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "إبلاغ فوري عن أزمة أمنية/تشغيلية" : "File Real-time Incident Alert"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLanguage === "ar" ? "إدراج تنبيه أو تفعيل بروتوكول الأزمات لنظام المرونة والتعافي" : "Add an incident report directly to register crisis response triggers"}
                    </p>
                  </div>

                  <form onSubmit={submitIncident} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">{currentLanguage === "ar" ? "عنوان الحدث الفيدرالي" : "Incident Title"}</label>
                      <input
                        type="text"
                        required
                        value={incidentTitle}
                        onChange={(e) => setIncidentTitle(e.target.value)}
                        placeholder="e.g. Minor replication lag on Port Sudan cluster"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">{currentLanguage === "ar" ? "مستوى الخطورة" : "Incident Severity"}</label>
                      <select
                        value={incidentSeverity}
                        onChange={(e: any) => setIncidentSeverity(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                      >
                        <option value="Info">Info</option>
                        <option value="Warning">Warning</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">{currentLanguage === "ar" ? "الوصف الفني والتفاصيل" : "Incident Details"}</label>
                      <textarea
                        rows={3}
                        required
                        value={incidentDesc}
                        onChange={(e) => setIncidentDesc(e.target.value)}
                        placeholder="Detail replication drift or diagnostic alerts..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>{currentLanguage === "ar" ? "إرسال التنبيه الفوري" : "Dispatch Incident Ticket"}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
