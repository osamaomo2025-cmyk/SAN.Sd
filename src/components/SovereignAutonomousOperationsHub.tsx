/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * National Autonomous Government Operations Hub & Future Innovation Lab
 * Unified Sovereign Self-Optimizing & Self-Healing Platform (Vision 2035 - 2050)
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  Shield, Landmark, Users, TrendingUp, AlertTriangle, Cpu, Globe, Scale, Network, Database, 
  Sparkles, FileText, Download, Play, Sliders, RefreshCw, Layers, CheckCircle, Clock, MapPin, 
  SlidersHorizontal, Radio, Activity, Eye, Printer, Terminal, Send, Search, Bell, AlertOctagon, 
  BookOpen, ChevronRight, Briefcase, BarChart3, HelpCircle, FileCheck, CheckCircle2, Compass,
  Zap, Heart, Leaf, GraduationCap, ShieldAlert, Check, X, Flame, Rocket, Fingerprint, Coins
} from "lucide-react";
import { UserRole } from "../types";

interface SovereignAutonomousOperationsHubProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
}

// ---------------------- TYPES & INTERFACES ----------------------

type StrategicRole = 
  | "gov_minister" 
  | "gov_executive" 
  | "chief_digital_officer" 
  | "chief_ai_officer" 
  | "chief_innovation_officer" 
  | "enterprise_architect" 
  | "data_scientist" 
  | "super_admin";

interface AIAgent {
  id: string;
  nameAr: string;
  nameEn: string;
  role: string;
  status: "idle" | "active" | "optimizing" | "mitigating";
  latency: string;
  accuracy: string;
  lastActionAr: string;
  lastActionEn: string;
  kpiContribution: string;
}

interface ObservabilityNode {
  id: string;
  nameAr: string;
  nameEn: string;
  category: "app" | "api" | "db" | "network" | "ai" | "security" | "infra";
  health: number; // 0-100
  load: number; // %
  status: "nominal" | "warning" | "degraded" | "healing";
  metrics: string;
}

interface SelfHealingEvent {
  id: string;
  timestamp: string;
  nodeNameAr: string;
  nodeNameEn: string;
  issueAr: string;
  issueEn: string;
  resolutionAr: string;
  resolutionEn: string;
  status: "detected" | "mitigating" | "resolved";
  recoveryTimeSec: number;
}

interface OptimizationRecommendation {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  impactAr: string;
  impactEn: string;
  category: "process" | "database" | "api" | "ai" | "infra" | "cost";
  estimatedGain: string;
  approved: boolean;
  rejected: boolean;
  dateDetected: string;
}

interface MaturityDimension {
  id: string;
  nameAr: string;
  nameEn: string;
  score: number; // 1-5
  target: number; // 1-5
  descAr: string;
  descEn: string;
}

interface InnovationIdea {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: "quantum" | "edge_ai" | "blockchain" | "cbdc" | "6g_iot" | "metaverse";
  status: "ideation" | "sandbox" | "pilot" | "production";
  funding: string;
  impactScore: number; // 1-100
}

export default function SovereignAutonomousOperationsHub({ currentLanguage, role: initialRole }: SovereignAutonomousOperationsHubProps) {
  // Navigation & Role State
  const [activeRole, setActiveRole] = useState<StrategicRole>(
    initialRole === "gov_minister" ? "gov_minister" : "chief_ai_officer"
  );
  
  const [activeTab, setActiveTab] = useState<
    "observability" | "agents" | "optimization" | "maturity" | "sustainability" | "innovation" | "reports"
  >("observability");

  // Dynamic simulation data states
  const [isSelfHealingActive, setIsSelfHealingActive] = useState(true);
  const [healingLogs, setHealingLogs] = useState<SelfHealingEvent[]>([
    {
      id: "SH-401",
      timestamp: "05:01:14",
      nodeNameAr: "قاعدة بيانات السجل التجاري القومي",
      nodeNameEn: "Sovereign Commercial Registry DB",
      issueAr: "تأخر الاستعلام وتراكم في طابور العمليات (Replica Lag)",
      issueEn: "Query latency spike and replication queue build-up",
      resolutionAr: "تم إعادة بناء الفهارس التالفة ونقل حركة القراءة تلقائياً إلى العقدة الاحتياطية",
      resolutionEn: "Automated index rebuilding and read traffic failed over to secondary replica",
      status: "resolved",
      recoveryTimeSec: 14
    },
    {
      id: "SH-402",
      timestamp: "04:45:22",
      nodeNameAr: "مخدم البوابة الموحدة للمطابقة والتفتيش",
      nodeNameEn: "Unified Inspection Platform API Gateway",
      issueAr: "محاولة هجوم حجب خدمة موزع (DDoS Traffic Overflow)",
      issueEn: "DDoS brute force traffic detected on authentication endpoints",
      resolutionAr: "تفعيل جدار الحماية الذكي وتصفية وحجب 42,000 عنوان IP مشبوه تلقائياً",
      resolutionEn: "Triggered cloud-native WAF scrubbing; dynamically blacklisted 42,000 malicious IPs",
      status: "resolved",
      recoveryTimeSec: 8
    },
    {
      id: "SH-403",
      timestamp: "04:12:05",
      nodeNameAr: "محرك التقييم التنبئي لتراخيص الصادرات",
      nodeNameEn: "Gum Arabic Export Predictive Model",
      issueAr: "انحراف دقة النموذج الإحصائي عن العتبة المحددة (Model Drift)",
      issueEn: "Predictive precision drifted below safety baseline of 94%",
      resolutionAr: "بدء إعادة تدريب تلقائية للنموذج بالاعتماد على آخر بيانات الاستيراد الفيدرالية",
      resolutionEn: "Initiated automated incremental fine-tuning on latest federal cargo streams",
      status: "resolved",
      recoveryTimeSec: 122
    }
  ]);

  // AI Agent Status State
  const [agents, setAgents] = useState<AIAgent[]>([
    { id: "AG-01", nameAr: "وكيل التوجيه التنفيذي", nameEn: "Executive Agent", role: "Sovereign Foresight", status: "idle", latency: "14ms", accuracy: "99.8%", lastActionAr: "تحديث تقديرات أثر النمو الصناعي للربع القادم", lastActionEn: "Updated industrial growth forecast parameters for Q3", kpiContribution: "+4.1% Plan Alignment" },
    { id: "AG-02", nameAr: "وكيل العمليات الفيدرالية", nameEn: "Operations Agent", role: "Self-Healing Controller", status: "active", latency: "8ms", accuracy: "99.4%", lastActionAr: "تحسين موازنة حمل الشبكة بين الوزارات الاتحادية", lastActionEn: "Rebalanced network routing load between federal departments", kpiContribution: "99.99% Core SLA Up" },
    { id: "AG-03", nameAr: "وكيل المراجعة القانونية والتشريعية", nameEn: "Legal Agent", role: "Compliance Watchdog", status: "idle", latency: "38ms", accuracy: "100%", lastActionAr: "تدقيق معايير المطابقة لاتفاقية التجارة الحرة الأفريقية", lastActionEn: "Audited export procedures for compliance with AfCFTA guidelines", kpiContribution: "Zero Compliance Alerts" },
    { id: "AG-04", nameAr: "وكيل الدفاع والتحليل السيبراني", nameEn: "Cybersecurity Agent", role: "Zero Trust Warden", status: "mitigating", latency: "2ms", accuracy: "99.9%", lastActionAr: "صد محاولة اختراق على واجهات ترخيص بورتسودان", lastActionEn: "Blocked automated brute force threat vector on Port Sudan licensing portal", kpiContribution: "42K Malicious IPs Curtailed" },
    { id: "AG-05", nameAr: "وكيل رأس المال البشري والرواتب", nameEn: "HR Agent", role: "Workforce Optimization", status: "idle", latency: "45ms", accuracy: "98.7%", lastActionAr: "تحليل سد فجوات المهارات الرقمية لولاية نهر النيل", lastActionEn: "Identified specialized technical skills gaps for River Nile State team", kpiContribution: "100% Payroll Integrity" },
    { id: "AG-06", nameAr: "وكيل المشتريات والتعاقد الذكي", nameEn: "Procurement Agent", role: "Supply Chain Oracle", status: "idle", latency: "12ms", accuracy: "99.1%", lastActionAr: "جدولة عروض عقود المدخلات العضوية الخضراء تلقائياً", lastActionEn: "Auto-evaluated multi-vendor eco-packaging tenders for SMEs", kpiContribution: "22% Proc. Cost Savings" },
    { id: "AG-07", nameAr: "وكيل الاستدامة والبيئة والـ ESG", nameEn: "Sustainability Agent", role: "Green IT Optimizer", status: "optimizing", latency: "11ms", accuracy: "98.2%", lastActionAr: "تحويل عمليات المعالجة المجمعة لساعات الليل منخفضة الانبعاثات", lastActionEn: "Shifted heavy batch computational operations to low-carbon off-peak intervals", kpiContribution: "-18% Core Server Carbon" },
    { id: "AG-08", nameAr: "وكيل الابتكار وبراءات الاختراع", nameEn: "Innovation Agent", role: "Emerging Tech Scout", status: "idle", latency: "60ms", accuracy: "95.5%", lastActionAr: "تقييم بروتوكول التشفير المقاوم للكم لبوابة الهوية الوطنية", lastActionEn: "Evaluated Post-Quantum cryptography suites for trusted identity layer", kpiContribution: "2 Prototypes Graduated" }
  ]);

  // Selected Agent for Interaction
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(agents[0]);
  const [agentQuery, setAgentQuery] = useState("");
  const [agentInteractionHistory, setAgentInteractionHistory] = useState<{ query: string; responseAr: string; responseEn: string }[]>([]);
  const [isAgentThinking, setIsAgentThinking] = useState(false);

  // Observability Nodes State
  const [nodes, setNodes] = useState<ObservabilityNode[]>([
    { id: "N-APP", nameAr: "بوابة المواطن والمستثمر (Super App)", nameEn: "Unified Citizen Portal (Super App)", category: "app", health: 98, load: 44, status: "nominal", metrics: "1.2M Active Users/Day" },
    { id: "N-API-CR", nameAr: "واجهة السجل التجاري وتأسيس الشركات", nameEn: "Corporate Registry & Startup Incorporation API", category: "api", health: 99, load: 38, status: "nominal", metrics: "240 trans/sec | Latency: 12ms" },
    { id: "N-DB-SOV", nameAr: "مستودع البيانات السيادي الاتحادي", nameEn: "Federal Sovereign Data Lake (Durable Cloud)", category: "db", health: 96, load: 54, status: "nominal", metrics: "Postgres Cluster | Replica Lag: <1s" },
    { id: "N-NET-BACK", nameAr: "الشبكة الحكومية والربط البيني الآمن", nameEn: "Federal Interoperability Encryption Network", category: "network", health: 100, load: 28, status: "nominal", metrics: "IPsec VPN Grid | Zero Packet Loss" },
    { id: "N-AI-FORE", nameAr: "محرك الاستشراف والتنبؤ الاقتصادي", nameEn: "Sovereign Foresight & Economic AI Model", category: "ai", health: 94, load: 82, status: "nominal", metrics: "Gemini Orchestrator | Drift: Nominal" },
    { id: "N-SEC-SOC", nameAr: "منظومة جدار الحماية والـ SOC السيادي", nameEn: "Sovereign CyberSOC Monitoring Perimeter", category: "security", health: 99, load: 15, status: "nominal", metrics: "Zero Trust Rules Audited | MFA 100%" },
    { id: "N-INF-WHS", nameAr: "السحابة الفيدرالية ومراكز البيانات الوطنية", nameEn: "Sudan National Digital Center Cloud Nodes", category: "infra", health: 87, load: 89, status: "warning", metrics: "Node Khartoum: 89% CPU, Node Port Sudan: 42% CPU" }
  ]);

  // Optimization Recommendations State
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([
    {
      id: "REC-01",
      titleAr: "أتمتة الفحص الذكي للعلامات التجارية المتكررة",
      titleEn: "Smart Trademark Collision Pre-Check Automation",
      descriptionAr: "تحويل الفحص المبدئي للأسماء التجارية المتقدمة من فحص يدوي إلى تقييم لغوي ودلالي مؤتمت بالكامل بالذكاء الاصطناعي.",
      descriptionEn: "Transition initial trademark assessment from manual review to automated semantic and linguistic NLP similarity mapping.",
      impactAr: "تقليص زمن الانتظار للمستثمرين من 7 أيام عمل إلى دقيقة واحدة، مع دقة تصنيف 99.8٪.",
      impactEn: "Slashes investor wait times from 7 business days to under 60 seconds with 99.8% classification accuracy.",
      category: "process",
      estimatedGain: "98% Efficiency Boost",
      approved: false,
      rejected: false,
      dateDetected: "2026-07-17"
    },
    {
      id: "REC-02",
      titleAr: "تنظيف وجدولة استعلامات قاعدة بيانات السجلات التاريخية",
      titleEn: "Historical Archival Ledger Query Partitioning",
      descriptionAr: "فصل وأرشفة سجلات الشركات الملغاة والمجمدة منذ ما قبل عام 2015 في مستودع بيانات بارد لتخفيف العبء على قاعدة البيانات النشطة.",
      descriptionEn: "Partition and archive inactive corporate records from before 2015 into cold storage to accelerate live transaction queries.",
      impactAr: "تحسين سرعة استعلامات منصة التأسيس بنسبة 40٪ وخفض استهلاك الذاكرة في المخدمات الرئيسية.",
      impactEn: "Improves corporate setup query times by 40% while slashing primary cloud database RAM footprint by 18%.",
      category: "database",
      estimatedGain: "40% Faster Ingestion",
      approved: false,
      rejected: false,
      dateDetected: "2026-07-16"
    },
    {
      id: "REC-03",
      titleAr: "توجيه حمل معالجات الذكاء الاصطناعي الثقيلة نحو فترات الطاقة المتجددة",
      titleEn: "Foresight Compute Shifting to Solar-Hybrid Off-Peak",
      descriptionAr: "جدولة عمليات التنبؤ التحليلي الكبرى ومحاكاة السيناريوهات التي يقوم بها الذكاء الاصطناعي لتتم بين الساعة 10 صباحاً و 2 ظهراً بالتزامن مع ذروة توليد محطات الطاقة الشمسية بمدينة جياد الصناعية.",
      descriptionEn: "Schedule resource-heavy deep learning training and scenario generations to compile exclusively during peak solar production hours (10 AM to 2 PM) at Giad Industrial Solar array.",
      impactAr: "خفض انبعاثات الكربون الناتجة عن مراكز البيانات بنسبة 25٪ وتوفير تكاليف الكهرباء الفيدرالية.",
      impactEn: "Slashes cloud data center carbon overhead by 25% and reduces national grid peak demand surcharge fees.",
      category: "infra",
      estimatedGain: "-25% Carbon Footprint",
      approved: false,
      rejected: false,
      dateDetected: "2026-07-15"
    }
  ]);

  // Digital Maturity Score System
  const [maturityDimensions, setMaturityDimensions] = useState<MaturityDimension[]>([
    { id: "DM-01", nameAr: "النضج الرقمي الشامل للخدمات", nameEn: "Service Digital Maturity", score: 4.2, target: 4.8, descAr: "رقمنة العمليات وتبسيط تجربة المستفيد", descEn: "Digitization of citizen flows and modern UI/UX excellence" },
    { id: "DM-02", nameAr: "تبني الذكاء الاصطناعي السيادي", nameEn: "Sovereign AI Implementation Maturity", score: 3.8, target: 4.7, descAr: "دمج الذكاء الاصطناعي التوليدي والتنبئي في حوكمة اتخاذ القرار", descEn: "Integration of predictive modeling and LLM assistance into administration" },
    { id: "DM-03", nameAr: "الأمن السيبراني والـ Zero Trust", nameEn: "Sovereign Cybersecurity & Zero Trust", score: 4.5, target: 5.0, descAr: "مرونة الدفاعات الفيدرالية وحصانة سجلات البيانات", descEn: "Robustness of federal defenses, continuous threat response and data integrity" },
    { id: "DM-04", nameAr: "دقة وجودة حوكمة البيانات", nameEn: "Data Governance & Sovereignty Maturity", score: 4.0, target: 4.8, descAr: "أمان تبادل السجلات وشفافية الأرشفة الرقمية القومية", descEn: "Security of inter-agency data exchanges and ledger immutability" },
    { id: "DM-05", nameAr: "الابتكار التكنولوجي وصندوق التجارب", nameEn: "Technology Innovation & Sandboxing", score: 3.5, target: 4.6, descAr: "سرعة تبني وجاهزية التقنيات المستقبلية", descEn: "Agility in running emerging tech pilot projects (Quantum, CBDC, Edge AI)" },
    { id: "DM-06", nameAr: "المهارات الرقمية للكادر الوطني", nameEn: "Workforce Digital & AI Literacy", score: 3.6, target: 4.5, descAr: "تدريب وتأهيل الكادر الفيدرالي على تشغيل المنصات الذكية", descEn: "Up-skilling and certification of public sector personnel in modern analytics" }
  ]);

  // Sustainability ESG Tracker
  const [electricityConsumption, setElectricityConsumption] = useState(4520); // kWh per day
  const [paperlessPercentage, setPaperlessPercentage] = useState(94.2); // %
  const [serverEfficiency, setServerEfficiency] = useState(92.4); // PUE equivalent %
  const [activeFdiSolarPortion, setActiveFdiSolarPortion] = useState(38); // % of industrial projects powered by green energy

  // Innovation Portfolio & Sandbox Ideas
  const [innovationIdeas, setInnovationIdeas] = useState<InnovationIdea[]>([
    { id: "INN-01", titleAr: "الربط الآمن بالعملة الرقمية للبنك المركزي (CBDC)", titleEn: "Federal Central Bank Digital Currency (CBDC) API Integration", descriptionAr: "دمج بوابة الدفع الوطنية الفيدرالية بالعملة الرقمية السيادية لتسريع التخليص الجمركي الفوري للمستندات في بورتسودان.", descriptionEn: "Interconnect the National Payment Gateway with sovereign Central Bank Digital Currency to enable real-time smart contract custom clearance.", category: "cbdc", status: "sandbox", funding: "$450,000 Allocated", impactScore: 92 },
    { id: "INN-02", titleAr: "بروتوكول تشفير مقاوم للحوسبة الكمومية", titleEn: "Post-Quantum Cryptography (PQC) Security Upgrade", descriptionAr: "ترقية واجهات تبادل السجلات الاتحادية الحساسة إلى خوارزميات مقاومة لفك التشفير بواسطة الحواسب الكمية المستقبلية.", descriptionEn: "Pilot implementation of NIST-approved lattice-based encryption algorithms for high-security commercial registries.", category: "quantum", status: "ideation", funding: "$200,000 Under Review", impactScore: 96 },
    { id: "INN-03", titleAr: "إنترنت الأشياء والحوسبة الحافة (Edge AI) في المنصة الصناعية", titleEn: "Industrial IoT Edge AI for Preventive Factory Maintenance", descriptionAr: "توزيع معالجات ذكية متناهية الصغر على مصانع الأغذية في الباقير وجياد لمراقبة الجودة والأعطال دون الاعتماد الدائم على السحابة.", descriptionEn: "Deploy tinyML computing nodes to food safety fabrication lines at El Bagair to track sanitation metrics in zero-latency offline mode.", category: "edge_ai", status: "pilot", funding: "$310,000 Active Pilot", impactScore: 88 },
    { id: "INN-04", titleAr: "المكتب الافتراضي التفاعلي للمستثمر في الميتافيرس", titleEn: "Virtual Invest-Sudan Metaverse Diplomatic Office", descriptionAr: "إنشاء جناح استثماري رقمي تفاعلي ثلاثي الأبعاد يتيح للشركات العالمية مقابلة الكادر الوزاري والمراجعة القانونية من أي مكان في العالم.", descriptionEn: "Develop a high-fidelity immersive web3 consulate permitting international conglomerates to interact, review parcels, and issue charters.", category: "metaverse", status: "pilot", funding: "$150,000 Active Pilot", impactScore: 74 }
  ]);

  const [newIdeaTitleAr, setNewIdeaTitleAr] = useState("");
  const [newIdeaTitleEn, setNewIdeaTitleEn] = useState("");
  const [newIdeaCategory, setNewIdeaCategory] = useState<any>("quantum");
  const [newIdeaDescAr, setNewIdeaDescAr] = useState("");
  const [newIdeaDescEn, setNewIdeaDescEn] = useState("");

  // Report Generator configuration states
  const [reportTimeframe, setReportTimeframe] = useState<"current_hour" | "today" | "q3_2026" | "annual_2026">("today");
  const [reportFormat, setReportFormat] = useState<"pdf" | "excel" | "json">("pdf");
  const [reportScope, setReportScope] = useState({
    observability: true,
    agents: true,
    optimization: true,
    maturity: true,
    sustainability: true,
    innovation: true
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<{ id: string; timestamp: string; title: string; size: string }[]>([]);

  // Simulation of automated live metrics
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Random load fluctuation on nodes
      setNodes(prev => prev.map(n => {
        const loadDiff = Math.floor(Math.random() * 7) - 3;
        const nextLoad = Math.max(10, Math.min(95, n.load + loadDiff));
        // Recalculate status based on load
        let status: any = "nominal";
        if (nextLoad > 85) status = "warning";
        else if (n.health < 90) status = "degraded";
        return { ...n, load: nextLoad, status };
      }));

      // 2. Fluctuations in energy / carbon metrics
      setElectricityConsumption(prev => Math.max(4000, Math.min(5000, prev + Math.floor(Math.random() * 21) - 10)));
      
      // 3. Spontaneous self-healing events simulation
      if (isSelfHealingActive && Math.random() < 0.1) {
        // Pick a degraded node and heal it
        const targetNode = nodes[Math.floor(Math.random() * nodes.length)];
        if (targetNode.load > 75) {
          const newEvent: SelfHealingEvent = {
            id: `SH-${Math.floor(Math.random() * 900) + 100}`,
            timestamp: new Date().toTimeString().split(" ")[0],
            nodeNameAr: targetNode.nameAr,
            nodeNameEn: targetNode.nameEn,
            issueAr: `ارتفاع الحمل المؤثر على الخدمة (${targetNode.load}%)`,
            issueEn: `Elevated service computational bottleneck (${targetNode.load}%)`,
            resolutionAr: "تم تخصيص سعة معالجة احتياطية فورية وخفض أولوية المعالجات الخلفية",
            resolutionEn: "Allocated auxiliary memory cache and throttled non-urgent background workers",
            status: "resolved",
            recoveryTimeSec: Math.floor(Math.random() * 15) + 3
          };
          setHealingLogs(prev => [newEvent, ...prev.slice(0, 9)]);
          // Briefly adjust the target node load
          setNodes(prev => prev.map(n => n.id === targetNode.id ? { ...n, load: 45, health: 99, status: "nominal" } : n));
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [isSelfHealingActive, nodes]);

  // Compute platform-wide performance index based on dynamic stats
  const performanceKPIs = useMemo(() => {
    const averageNodeHealth = nodes.reduce((acc, n) => acc + n.health, 0) / nodes.length;
    const resolvedEventsCount = healingLogs.filter(e => e.status === "resolved").length;
    
    // Calculated scores
    const enterpriseOptimizationIndex = Math.min(98.5, 85 + (resolvedEventsCount * 0.5) + (paperlessPercentage * 0.1));
    const innovationIndex = Math.min(95.0, 70 + (innovationIdeas.length * 4) + (activeFdiSolarPortion * 0.2));
    const digitalTransformationScore = Math.min(97.2, (maturityDimensions.reduce((acc, d) => acc + d.score, 0) / 30) * 100 + 10);
    const aiEffectiveness = Math.min(99.9, 94.2 + (agents.filter(a => a.status === "active" || a.status === "optimizing").length * 0.5));
    const automationRate = Math.min(99.0, 88.4 + (paperlessPercentage * 0.08));
    const citizenSatisfaction = 93.8;
    const governmentEfficiency = Math.min(98.0, 91.2 + (resolvedEventsCount * 0.2));
    const sustainabilityScore = Math.min(100, (paperlessPercentage + (100 - (electricityConsumption / 6000) * 100) + activeFdiSolarPortion) / 2.5 + 40);

    return {
      enterpriseOptimizationIndex: Math.round(enterpriseOptimizationIndex * 10) / 10,
      innovationIndex: Math.round(innovationIndex * 10) / 10,
      digitalTransformationScore: Math.round(digitalTransformationScore * 10) / 10,
      aiEffectiveness: Math.round(aiEffectiveness * 10) / 10,
      automationRate: Math.round(automationRate * 10) / 10,
      citizenSatisfaction,
      governmentEfficiency: Math.round(governmentEfficiency * 10) / 10,
      sustainabilityScore: Math.round(sustainabilityScore * 10) / 10
    };
  }, [nodes, healingLogs, paperlessPercentage, innovationIdeas, activeFdiSolarPortion, maturityDimensions, electricityConsumption, agents]);

  // Handle recommendation action
  const handleRecommendationAction = (id: string, approve: boolean) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        return { ...rec, approved: approve, rejected: !approve };
      }
      return rec;
    }));

    if (approve) {
      // Simulate real-time improvement on indices
      if (id === "REC-01") {
        setPaperlessPercentage(prev => Math.min(100, prev + 2.1));
        setMaturityDimensions(prev => prev.map(d => d.id === "DM-01" ? { ...d, score: Math.min(5.0, d.score + 0.3) } : d));
      } else if (id === "REC-02") {
        setNodes(prev => prev.map(n => n.id === "N-DB-SOV" ? { ...n, health: 99, load: 32 } : n));
        setMaturityDimensions(prev => prev.map(d => d.id === "DM-04" ? { ...d, score: Math.min(5.0, d.score + 0.2) } : d));
      } else if (id === "REC-03") {
        setElectricityConsumption(prev => Math.max(3800, prev - 450));
        setServerEfficiency(prev => Math.min(99.0, prev + 2.5));
      }
    }
  };

  // Agent Chat / Prompt Handler
  const handleAgentPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentQuery.trim() || !selectedAgent) return;

    setIsAgentThinking(true);
    const userMsg = agentQuery;
    setAgentQuery("");

    setTimeout(() => {
      let responseAr = "";
      let responseEn = "";

      const queryLower = userMsg.toLowerCase();

      if (selectedAgent.id === "AG-01") { // Executive Agent
        if (queryLower.includes("gdp") || queryLower.includes("نمو") || queryLower.includes("صناعة")) {
          responseAr = "وكيل التوجيه التنفيذي: بناءً على النماذج التنبؤية، نقترح مواءمة عوائد الرخص لترقية البنية التحتية بمصانع الباقير، مما يرفع إجمالي الناتج الصناعي بنسبة 1.4% إضافية بحلول الربع القادم.";
          responseEn = "Executive Agent: Based on foresight models, we suggest aligning license revenue structures to fund immediate utility upgrades at El Bagair, projecting a 1.4% industrial GDP bump next quarter.";
        } else {
          responseAr = "وكيل التوجيه التنفيذي: أراقب باستمرار مؤشرات الخطة الاستراتيجية 2035. جميع أهداف الحوكمة والربط البيني ممتازة وتحقق المخطط التنموي الفيدرالي.";
          responseEn = "Executive Agent: I am continuously supervising the 2035 blueprint variables. Structural milestones for inter-agency database synchronization are perfectly matched with national targets.";
        }
      } else if (selectedAgent.id === "AG-04") { // Cybersecurity Agent
        responseAr = "وكيل الدفاع السيبراني: قمت بتحصين مسار البيانات الفيدرالي. لا توجد اختراقات نشطة حالياً، وتم تطبيق تصفية مشددة على حزم البيانات الواردة لمنافذ التفتيش والمطابقة.";
        responseEn = "Cybersecurity Agent: Federal data tunnels are secure. I have completed zero-trust path inspections; traffic into Port Sudan inspection endpoints is running fully filtered with zero latency overhead.";
      } else if (selectedAgent.id === "AG-07") { // Sustainability Agent
        responseAr = "وكيل الاستدامة والـ ESG: لقد قمت بجدولة مهام المعالجة الضخمة لتزامن ذروة التوليد من الألواح الكهروضوئية بجياد. تم تقليص كثافة الكربون بمركز البيانات الفيدرالي بمقدار 45 كجم اليوم.";
        responseEn = "Sustainability Agent: Dynamic batch compute-shifting is successfully synchronized with Giad Solar Array peak generation, preventing approximately 45kg of daily CO2 equivalent emissions.";
      } else {
        responseAr = `وكيل ${selectedAgent.nameAr}: تم استلام استعلامك وجاري التنسيق عبر بروتوكولات حوكمة الوكلاء MCP لمعالجة الطلب بكفاءة كاملة.`;
        responseEn = `Agent ${selectedAgent.nameEn}: Request verified. Initiating internal federated collaboration protocol with neighboring agents via sovereign metadata exchange layers.`;
      }

      setAgentInteractionHistory(prev => [
        ...prev,
        { query: userMsg, responseAr, responseEn }
      ]);
      setIsAgentThinking(false);
    }, 1200);
  };

  // Add Custom Innovation Sandbox Idea
  const handleAddInnovationIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitleAr.trim() || !newIdeaTitleEn.trim()) return;

    const newId = `INN-0${innovationIdeas.length + 1}`;
    const newIdea: InnovationIdea = {
      id: newId,
      titleAr: newIdeaTitleAr,
      titleEn: newIdeaTitleEn,
      descriptionAr: newIdeaDescAr || "مشروع بحثي جديد تم تقديمه عبر مركز الابتكار السيادي.",
      descriptionEn: newIdeaDescEn || "New pilot program registered in the sovereign innovation sandbox.",
      category: newIdeaCategory,
      status: "ideation",
      funding: "Under Initial Evaluation",
      impactScore: Math.floor(Math.random() * 21) + 75
    };

    setInnovationIdeas([...innovationIdeas, newIdea]);
    setNewIdeaTitleAr("");
    setNewIdeaTitleEn("");
    setNewIdeaDescAr("");
    setNewIdeaDescEn("");
  };

  // Generate Report Action
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      const reportTitle = currentLanguage === "ar" 
        ? `تقرير التحسين التلقائي السيادي الشامل - ${reportTimeframe.toUpperCase()}`
        : `Comprehensive Sovereign Autonomous Optimization Report - ${reportTimeframe.toUpperCase()}`;
      
      const newReport = {
        id: `REP-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        title: reportTitle,
        size: `${Math.floor(Math.random() * 120) + 40} KB`
      };

      setGeneratedReports(prev => [newReport, ...prev]);
      setIsGeneratingReport(false);
    }, 1500);
  };

  // Structured Roadmap milestones for 2026-2050 based on average maturity score
  const roadmapMilestones = [
    { period: "2026 - 2030", titleAr: "مرحلة الأتمتة الكاملة والتكامل السيادي بالذكاء الاصطناعي", titleEn: "Sovereign AI Integration & Total Automation Phase", descAr: "تحقيق الربط البيني بنسبة 100% بين كافة الولايات، وأتمتة تأسيس الشركات بالكامل، والتحول إلى بيئة لاورقية بنسبة 99% مع تفعيل معالجات SOC التنبؤية بالكامل.", descEn: "100% inter-agency ledger synchronization across states, real-time startup incorporation, achieving a 99% paperless operational efficiency, and deploying active self-healing perimeters." },
    { period: "2031 - 2040", titleAr: "الاستشراف الكمي والتحول للطاقة النظيفة الهجينة (الرؤية الوطنية الثانية)", titleEn: "Post-Quantum Cryptography & Carbon-Neutral Computing Phase", descAr: "دمج بروتوكولات الحوسبة المقاومة للكم لحماية الهوية الوطنية، وتشغيل مراكز البيانات الفيدرالية بالكامل بطاقة شمسية بنسبة 100%، وبناء نماذج التنبؤ الاقتصادي الذاتية.", descEn: "Migration to post-quantum cryptographic standards to safeguard national records, powering cloud compute arrays 100% with sustainable green microgrids, and executing predictive export dispatch models." },
    { period: "2041 - 2050", titleAr: "الحكومة الذاتية المستقلة والتكامل التام مع شبكات 6G الذكية", titleEn: "Autonomous Predictive Governance & Advanced Spatial Services", descAr: "تمكين نظام اتخاذ القرار السيادي اللامركزي المدعوم بالكامل بخرائط الميتافيرس المترابطة، والتحقق التلقائي المتكامل لسلامة سلاسل الإمداد بموانئ السودان بنسبة 100%.", descEn: "Implementing fully decentralized spatial governance modules inside interactive virtual consular corridors, backed by 6G automated IoT edge arrays regulating cargo corridors without human friction." }
  ];

  // Radar chart structure for maturity scoring
  const maturityChartData = maturityDimensions.map(d => ({
    subject: currentLanguage === "ar" ? d.nameAr.substring(0, 25) + "..." : d.nameEn.substring(0, 20) + "...",
    "Current Score": d.score,
    "Target 2035": d.target,
    fullMark: 5
  }));

  // Role details mapping
  const strategicRolesInfo = [
    { id: "gov_minister", labelAr: "معالي الوزير القومي للتجارة والصناعة", labelEn: "HE Federal Minister" },
    { id: "gov_executive", labelAr: "السيد الوكيل الاتحادي والمنسق العام", labelEn: "Federal Undersecretary" },
    { id: "chief_digital_officer", labelAr: "مدير الشؤون الرقمية والربط البيني (CDO)", labelEn: "Chief Digital Officer (CDO)" },
    { id: "chief_ai_officer", labelAr: "مدير الذكاء الاصطناعي والاستشراف السيادي (CAIO)", labelEn: "Chief AI Officer (CAIO)" },
    { id: "chief_innovation_officer", labelAr: "رئيس مختبرات الابتكار والتحول الفيدرالي", labelEn: "Chief Innovation Officer (CInO)" },
    { id: "enterprise_architect", labelAr: "كبير مهندسي معمارية الأنظمة القومية", labelEn: "Sovereign Enterprise Architect" },
    { id: "data_scientist", labelAr: "خبير نمذجة البيانات والتحليل التنبئي", labelEn: "National Lead Data Scientist" },
    { id: "super_admin", labelAr: "مدير الأنظمة السيادية والتشغيل الذاتي", labelEn: "Sovereign Systems Super Administrator" }
  ];

  return (
    <div className="space-y-6 text-gray-900" id="autonomous-hub-root">
      
      {/* HEADER HERO CARD */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Animated Background Gradients & Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 font-mono font-extrabold tracking-wider">
                <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                AUTONOMOUS SYSTEM ONLINE
              </span>
              <span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-2.5 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1 font-mono font-extrabold tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                ISO/IEC 25010 AUDITED
              </span>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 font-mono font-extrabold tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                REAL-TIME INFERENCE ACTIVE
              </span>
            </div>
            
            <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
              {currentLanguage === "ar" 
                ? "منظومة التشغيل الذاتي والتحسين التلقائي وبحيرة البيانات القومية" 
                : "Sovereign Autonomous Operations, Self-Healing & AI Optimization Engine"}
            </h2>
            <p className="text-slate-400 text-xs max-w-3xl leading-relaxed">
              {currentLanguage === "ar" 
                ? "المنصة الاتحادية المركزية للمراقبة المتقدمة والشفافية التامة، مدعومة ببيئة معالجة آمنة (Zero Trust) مع وكلاء ذكاء اصطناعي مترابطين عبر بروتوكولات حوكمة مرنة للاستباقية التنفيذية وحل الاختناقات الحكومية تلقائياً."
                : "Central federal hub executing containerized self-healing scripts, microservices health checks, and cross-agent collaborative reasoning. Features real-time ESG metrics, post-quantum crypto prototyping, and interactive decision sandboxes."}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {currentLanguage === "ar" ? "الهوية القيادية النشطة" : "Active Strategic Level"}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as StrategicRole)}
                className="bg-slate-950 text-emerald-400 text-xs border border-slate-700 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-none font-bold"
              >
                {strategicRolesInfo.map(r => (
                  <option key={r.id} value={r.id}>
                    {currentLanguage === "ar" ? r.labelAr : r.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[9px] text-emerald-500/80 font-mono">
              Role Permission Level: Sovereign High-Trust
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC PERFORMANCE INDEX STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[
          { labelAr: "مؤشر التحسين المؤسسي", labelEn: "Enterprise Optimization", val: `${performanceKPIs.enterpriseOptimizationIndex}%`, icon: Sliders, color: "text-emerald-500", bg: "bg-emerald-50/50" },
          { labelAr: "مؤشر الابتكار الوطني", labelEn: "National Innovation Index", val: `${performanceKPIs.innovationIndex}%`, icon: Rocket, color: "text-indigo-500", bg: "bg-indigo-50/50" },
          { labelAr: "نتيجة النضج والتحول", labelEn: "Transformation Score", val: `${performanceKPIs.digitalTransformationScore}%`, icon: Layers, color: "text-purple-500", bg: "bg-purple-50/50" },
          { labelAr: "فاعلية الذكاء الاصطناعي", labelEn: "AI Model Accuracy", val: `${performanceKPIs.aiEffectiveness}%`, icon: Cpu, color: "text-amber-500", bg: "bg-amber-50/50" },
          { labelAr: "نسبة الأتمتة الإجمالية", labelEn: "Workflow Automation", val: `${performanceKPIs.automationRate}%`, icon: Zap, color: "text-pink-500", bg: "bg-pink-50/50" },
          { labelAr: "معدل الرضا الحكومي", labelEn: "Citizen Satisfaction", val: `${performanceKPIs.citizenSatisfaction}%`, icon: Heart, color: "text-teal-500", bg: "bg-teal-50/50" },
          { labelAr: "كفاءة المخرجات الفيدرالية", labelEn: "Sovereign Efficiency", val: `${performanceKPIs.governmentEfficiency}%`, icon: Landmark, color: "text-blue-500", bg: "bg-blue-50/50" },
          { labelAr: "مؤشر البيئة والاستدامة", labelEn: "Sustainability ESG", val: `${performanceKPIs.sustainabilityScore}%`, icon: Leaf, color: "text-green-500", bg: "bg-green-50/50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between text-center relative hover:shadow-md transition-all">
            <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-tight h-8 flex items-center justify-center">
              {currentLanguage === "ar" ? stat.labelAr : stat.labelEn}
            </div>
            <div className="text-lg font-black font-mono mt-1 text-slate-900">{stat.val}</div>
          </div>
        ))}
      </div>

      {/* CORE INTERACTIVE NAV TABS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="border-b border-gray-100 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5" id="autonomous-control-tabs">
            {[
              { id: "observability", labelAr: "مرصد الأنظمة والصحة الذاتية", labelEn: "Observability & Self-Healing", icon: Activity },
              { id: "agents", labelAr: "منظومة الوكلاء المترابطة (MCP)", labelEn: "AI Agent Ecosystem", icon: Network },
              { id: "optimization", labelAr: "محرك تحسين العمليات والـ Bottlenecks", labelEn: "Process Optimization", icon: Sliders },
              { id: "maturity", labelAr: "مؤشرات النضج وخريطة الطريق 2050", labelEn: "Digital Maturity Roadmap", icon: Layers },
              { id: "sustainability", labelAr: "بوابة الاستدامة والبيئة والـ ESG", labelEn: "Sustainability & ESG Portal", icon: Leaf },
              { id: "innovation", labelAr: "مختبر التجريب والابتكار التقني", labelEn: "Innovation Lab & Sandbox", icon: Rocket },
              { id: "reports", labelAr: "توليد تقارير الأداء التنفيذي", labelEn: "Executive Report Generator", icon: FileText }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-md" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{currentLanguage === "ar" ? "أجهزة المراقبة الخلفية: نشطة ومأمونة" : "SOVEREIGN ENGINE: ACTIVE"}</span>
          </div>
        </div>

        {/* TAB WORKSPACE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 150 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            
            {/* LEFT CONTAINER (COVERS 2 COLUMNS FOR HEAVY VISUALIZATIONS AND CARDS) */}
            <div className="xl:col-span-2 space-y-6">

              {/* TAB 1: OBSERVABILITY & SELF-HEALING CONTROL CENTER */}
              {activeTab === "observability" && (
                <div className="space-y-6">
                  
                  {/* HEALTH TILES */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      {currentLanguage === "ar" ? "الحالة اللحظية للأنظمة والشبكات ومحركات الذكاء الاصطناعي" : "Sovereign Observability & Load Metrics"}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {nodes.map(node => (
                        <div key={node.id} className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-3 hover:border-slate-300 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest bg-slate-200 px-1.5 py-0.5 rounded">
                                {node.category}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                                {currentLanguage === "ar" ? node.nameAr : node.nameEn}
                              </h4>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                node.status === "nominal" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {node.status === "nominal" ? "Nominal" : "Warning"}
                              </span>
                              <span className="text-xs font-extrabold font-mono text-slate-900">
                                {node.health}% Health
                              </span>
                            </div>
                          </div>

                          {/* Load progress line */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                              <span>SLA Load Level: {node.load}%</span>
                              <span>{node.metrics}</span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  node.load > 85 ? "bg-rose-500" : node.load > 65 ? "bg-amber-500" : "bg-emerald-500"
                                }`}
                                style={{ width: `${node.load}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SELF HEALING MODULE */}
                  <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl border border-slate-800 font-mono space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
                        <h4 className="text-xs font-black tracking-widest text-white">
                          {currentLanguage === "ar" ? "نظام التشخيص الفيدرالي والإصلاح التلقائي" : "SOVEREIGN AGENT SELF-HEALING LEDGER"}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{currentLanguage === "ar" ? "المعالجة التلقائية:" : "Self-Healing State:"}</span>
                        <button
                          onClick={() => setIsSelfHealingActive(!isSelfHealingActive)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer ${
                            isSelfHealingActive ? "bg-emerald-500 text-slate-950" : "bg-rose-950 text-rose-400"
                          }`}
                        >
                          {isSelfHealingActive ? "ENABLED" : "PAUSED"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                      {healingLogs.map(log => (
                        <div key={log.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>ID: {log.id} | TIMESTAMP: {log.timestamp}</span>
                            <span className="text-emerald-400 font-bold">RECOVERED IN {log.recoveryTimeSec}s</span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-slate-200">
                              <span className="text-rose-400 font-bold">[EVENT DETECTED]:</span> {currentLanguage === "ar" ? log.issueAr : log.issueEn}
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              <span className="text-emerald-500 font-bold">[AUTONOMOUS RESOLUTION]:</span> {currentLanguage === "ar" ? log.resolutionAr : log.resolutionEn}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: AI AGENT ECOSYSTEM */}
              {activeTab === "agents" && (
                <div className="space-y-6">
                  
                  {/* AGENTS GRID */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      {currentLanguage === "ar" ? "وكلاء الذكاء الاصطناعي السياديين المترابطين" : "Active AI Agent Ledger & Core Latency"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {agents.map(agent => {
                        const isSelected = selectedAgent?.id === agent.id;
                        return (
                          <div 
                            key={agent.id}
                            onClick={() => setSelectedAgent(agent)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-4 ${
                              isSelected 
                                ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                                : "bg-white text-slate-900 border-gray-100 hover:border-gray-300 shadow-sm"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${
                                  agent.status === "active" ? "bg-emerald-400 animate-ping" : agent.status === "optimizing" ? "bg-indigo-400 animate-pulse" : "bg-gray-400"
                                }`} />
                                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">
                                  {agent.role}
                                </span>
                              </div>
                              
                              <h4 className="text-xs font-bold" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                                {currentLanguage === "ar" ? agent.nameAr : agent.nameEn}
                              </h4>
                              
                              <p className={`text-[10px] line-clamp-1 ${isSelected ? "text-slate-300" : "text-gray-500"}`}>
                                {currentLanguage === "ar" ? agent.lastActionAr : agent.lastActionEn}
                              </p>
                            </div>

                            <div className="text-right shrink-0 space-y-1">
                              <div className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">
                                {agent.kpiContribution}
                              </div>
                              <div className="text-[9px] text-gray-400 font-mono">
                                Acc: {agent.accuracy} | Lat: {agent.latency}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CHAT/PROMPT TO SELECTED AGENT */}
                  {selectedAgent && (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-indigo-600" />
                          <div>
                            <span className="text-[10px] uppercase font-mono text-gray-400 block">INTERACTION CHANNEL ACTIVE</span>
                            <h4 className="text-xs font-bold text-slate-800">
                              {currentLanguage === "ar" ? `مخاطبة المساعد: ${selectedAgent.nameAr}` : `Inference Console: ${selectedAgent.nameEn}`}
                            </h4>
                          </div>
                        </div>
                        <span className="bg-slate-900 text-white text-[9px] font-mono px-2 py-0.5 rounded uppercase">
                          MCP secure routing
                        </span>
                      </div>

                      {/* Conversation History */}
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2 text-xs">
                        {agentInteractionHistory.map((item, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="bg-indigo-50 p-2.5 rounded-lg text-slate-800 text-right" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                              <span className="font-bold text-[9px] text-indigo-600 block mb-0.5">YOU:</span>
                              {item.query}
                            </div>
                            <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg" dir="ltr">
                              <span className="font-bold text-[9px] text-emerald-500 block mb-0.5 uppercase">
                                {selectedAgent.nameEn} Response:
                              </span>
                              {currentLanguage === "ar" ? item.responseAr : item.responseEn}
                            </div>
                          </div>
                        ))}

                        {isAgentThinking && (
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono animate-pulse">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Agent is collaborating via MCP protocol...</span>
                          </div>
                        )}
                      </div>

                      {/* Send Form */}
                      <form onSubmit={handleAgentPromptSubmit} className="flex gap-2">
                        <input
                          type="text"
                          value={agentQuery}
                          onChange={(e) => setAgentQuery(e.target.value)}
                          placeholder={
                            currentLanguage === "ar" 
                              ? `اطلب تحليلاً أو توصية سياسات من ${selectedAgent.nameAr}...`
                              : `Prompt ${selectedAgent.nameEn} for policy evaluations...`
                          }
                          className="flex-1 bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          type="submit"
                          disabled={!agentQuery.trim() || isAgentThinking}
                          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-200 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>{currentLanguage === "ar" ? "إرسال" : "Inference"}</span>
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: ENTERPRISE PROCESS OPTIMIZATION */}
              {activeTab === "optimization" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "الاختناقات المكتشفة بالذكاء الاصطناعي وتوصيات التطوير" : "AI Bottleneck Detection & Autonomous Interventions"}
                    </h3>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {recommendations.filter(r => !r.approved && !r.rejected).length} Open Optimization Opportunities
                    </span>
                  </div>

                  <div className="space-y-4">
                    {recommendations.map(rec => (
                      <div key={rec.id} className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4 relative overflow-hidden">
                        
                        {/* Dynamic category badge */}
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                              {rec.category} Optimization
                            </span>
                            <h4 className="text-sm font-bold text-slate-900" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                              {currentLanguage === "ar" ? rec.titleAr : rec.titleEn}
                            </h4>
                          </div>
                          
                          <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                            {rec.estimatedGain}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed">
                          {currentLanguage === "ar" ? rec.descriptionAr : rec.descriptionEn}
                        </p>

                        <div className="bg-slate-50 p-3 rounded-lg text-xs">
                          <span className="font-extrabold text-slate-800 block mb-1">
                            {currentLanguage === "ar" ? "التأثير المتوقع:" : "Simulated Strategic Impact:"}
                          </span>
                          <span className="text-gray-600">
                            {currentLanguage === "ar" ? rec.impactAr : rec.impactEn}
                          </span>
                        </div>

                        {/* Interactive Workflow Trigger */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                          <span className="text-gray-400 font-mono">Detected: {rec.dateDetected}</span>
                          
                          <div className="flex gap-2">
                            {rec.approved ? (
                              <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {currentLanguage === "ar" ? "تم الموافقة والتشغيل" : "Authorized & Implemented"}
                              </span>
                            ) : rec.rejected ? (
                              <span className="bg-rose-100 text-rose-800 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
                                <X className="w-3.5 h-3.5 text-rose-600" />
                                {currentLanguage === "ar" ? "مرفوضة" : "Archived/Declined"}
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleRecommendationAction(rec.id, false)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                                >
                                  {currentLanguage === "ar" ? "رفض وأرشفة" : "Archive"}
                                </button>
                                <button
                                  onClick={() => handleRecommendationAction(rec.id, true)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
                                >
                                  <Play className="w-3 h-3 text-white" />
                                  <span>{currentLanguage === "ar" ? "موافقة واعتماد فوري" : "Approve & Execute"}</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DIGITAL MATURITY MANAGEMENT */}
              {activeTab === "maturity" && (
                <div className="space-y-6">
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-1/2 h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={maturityChartData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" fontSize={9} stroke="#475569" />
                          <PolarRadiusAxis angle={30} domain={[0, 5]} />
                          <Radar name="Current Maturity" dataKey="Current Score" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                          <Radar name="Target 2035" dataKey="Target 2035" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} />
                          <Legend wrapperStyle={{ fontSize: 10 }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="w-full md:w-1/2 space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-slate-900" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                        {currentLanguage === "ar" ? "تقييم جاهزية النضج التقني الفيدرالي" : "Federal Maturity Assessment Matrix"}
                      </h4>
                      <p className="text-gray-500 leading-relaxed">
                        {currentLanguage === "ar" 
                          ? "تقيس المنصة تلقائياً مستويات النضج والمهارات الفيدرالية ومعدلات تأهيل القوى البشرية لمواكبة تشغيل الخدمات القومية وإدارتها بكفاءة."
                          : "We map digital skills indexes, model drift parameters, and regulatory automation thresholds across all ministries dynamically to build the federal excellence matrix."}
                      </p>
                      
                      <div className="space-y-2">
                        {maturityDimensions.map(d => (
                          <div key={d.id} className="space-y-1">
                            <div className="flex justify-between font-mono font-bold text-[10px]">
                              <span>{currentLanguage === "ar" ? d.nameAr : d.nameEn}</span>
                              <span className="text-emerald-600">{d.score} / {d.target}</span>
                            </div>
                            <div className="w-full bg-gray-200 h-1 rounded-full">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(d.score / 5) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ROADMAP TIMELINE */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest">
                      {currentLanguage === "ar" ? "خريطة طريق التميز والتحول القومي للأنظمة (2026 - 2050)" : "Enterprise Evolution Roadmap Plan (2026 - 2050)"}
                    </h4>

                    <div className="space-y-3">
                      {roadmapMilestones.map((milestone, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-xl border border-gray-100 flex gap-4 items-start relative hover:border-indigo-200 transition-all">
                          <span className="bg-slate-900 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded">
                            {milestone.period}
                          </span>
                          
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-900">
                              {currentLanguage === "ar" ? milestone.titleAr : milestone.titleEn}
                            </h5>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                              {currentLanguage === "ar" ? milestone.descAr : milestone.descEn}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: SUSTAINABILITY & ESG PORTAL */}
              {activeTab === "sustainability" && (
                <div className="space-y-6">
                  
                  {/* CHARTS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-3 text-center">
                      <Leaf className="w-8 h-8 text-emerald-600 mx-auto" />
                      <span className="text-[10px] text-gray-500 block">DAILY SERVER POWER LOAD</span>
                      <span className="text-3xl font-black font-mono text-slate-900">
                        {electricityConsumption} kWh
                      </span>
                      <p className="text-[11px] text-gray-400">
                        {currentLanguage === "ar" ? "توفير 18% مقارنة بالفترة السابقة بفضل الحوسبة الذكية" : "-18% compared to non-optimized cloud arrays"}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-3 text-center">
                      <FileCheck className="w-8 h-8 text-indigo-600 mx-auto" />
                      <span className="text-[10px] text-gray-500 block">PAPERLESS GOVERNMENT COEFFICIENT</span>
                      <span className="text-3xl font-black font-mono text-indigo-600">
                        {paperlessPercentage}%
                      </span>
                      <p className="text-[11px] text-gray-400">
                        {currentLanguage === "ar" ? "وفرنا ما يقرب من 8,400 شجرة هذا العام" : "Saved approximately 8,400 trees with automated digital files"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 space-y-4">
                    <h4 className="text-xs font-bold text-emerald-950 uppercase">
                      {currentLanguage === "ar" ? "مؤشرات التقييم البيئي للمنشآت والمصانع (ESG)" : "National Industrial ESG Compliance Rating"}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 bg-white rounded-lg border border-emerald-100">
                        <span className="text-gray-400 text-[10px] block">Server PUE Score</span>
                        <span className="text-base font-bold font-mono text-slate-800">{serverEfficiency}% Efficiency</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-emerald-100">
                        <span className="text-gray-400 text-[10px] block">Green FDI Industrial Inflow</span>
                        <span className="text-base font-bold font-mono text-slate-800">{activeFdiSolarPortion}% Solar-hybrid</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-emerald-100">
                        <span className="text-gray-400 text-[10px] block">Water Recycling Rate</span>
                        <span className="text-base font-bold font-mono text-slate-800">42.5% Average</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 6: INNOVATION LAB & emerginG tech SANDBOX */}
              {activeTab === "innovation" && (
                <div className="space-y-6">
                  
                  {/* IDEA SUBMIT FORM */}
                  <form onSubmit={handleAddInnovationIdea} className="bg-slate-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase">
                        {currentLanguage === "ar" ? "تسجيل فكرة أو نموذج ريادي في صندوق الابتكار" : "Register Emerging Technology Pilot Concept"}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">{currentLanguage === "ar" ? "العنوان بالعربية:" : "Title (Arabic):"}</label>
                        <input
                          type="text"
                          required
                          value={newIdeaTitleAr}
                          onChange={(e) => setNewIdeaTitleAr(e.target.value)}
                          placeholder="مثال: ترقية الخصوصية بنموذج ZK-Proofs"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">{currentLanguage === "ar" ? "العنوان بالإنجليزية:" : "Title (English):"}</label>
                        <input
                          type="text"
                          required
                          value={newIdeaTitleEn}
                          onChange={(e) => setNewIdeaTitleEn(e.target.value)}
                          placeholder="e.g. ZK-Proofs for Privacy Compliance"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">Future Technology Domain</label>
                        <select
                          value={newIdeaCategory}
                          onChange={(e) => setNewIdeaCategory(e.target.value as any)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                        >
                          <option value="quantum">Quantum-Resistant Cryptography</option>
                          <option value="edge_ai">Edge AI & TinyML</option>
                          <option value="blockchain">Sovereign Blockchain Ledgers</option>
                          <option value="cbdc">Central Bank Digital Currency (CBDC)</option>
                          <option value="6g_iot">6G Networks & Smart Sensors</option>
                          <option value="metaverse">Metaverse Virtual Government</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">Status Stage</label>
                        <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded">
                          Ideation & Design Sandbox
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">{currentLanguage === "ar" ? "التفاصيل والمقترح (عربي):" : "Concept Outline (Arabic):"}</label>
                        <textarea
                          rows={2}
                          value={newIdeaDescAr}
                          onChange={(e) => setNewIdeaDescAr(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">{currentLanguage === "ar" ? "التفاصيل والمقترح (إنجليزي):" : "Concept Outline (English):"}</label>
                        <textarea
                          rows={2}
                          value={newIdeaDescEn}
                          onChange={(e) => setNewIdeaDescEn(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>{currentLanguage === "ar" ? "تسجيل النموذج في السحابة الفيدرالية" : "Deploy Pilot Proposal"}</span>
                      </button>
                    </div>
                  </form>

                  {/* ACTIVE INNOVATION IDEAS PORTFOLIO */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest">
                      {currentLanguage === "ar" ? "المحفظة النشطة لتجارب المستقبل والريادة" : "Sovereign Emerging Technology Sandbox Portfolio"}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {innovationIdeas.map(idea => (
                        <div key={idea.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm space-y-3 relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-mono text-gray-400">[{idea.id}]</span>
                              <h5 className="text-xs font-bold text-slate-900" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                                {currentLanguage === "ar" ? idea.titleAr : idea.titleEn}
                              </h5>
                            </div>

                            <span className="bg-indigo-50 text-indigo-700 text-[8px] font-bold uppercase px-2 py-0.5 rounded">
                              {idea.category}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            {currentLanguage === "ar" ? idea.descriptionAr : idea.descriptionEn}
                          </p>

                          <div className="flex justify-between items-center text-[10px] border-t border-gray-50 pt-2 font-mono">
                            <span className="text-gray-400">{idea.funding}</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">
                              Impact: {idea.impactScore}/100
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 7: EXECUTIVE REPORT GENERATOR */}
              {activeTab === "reports" && (
                <div className="space-y-6">
                  
                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                    <h4 className="text-xs font-bold text-slate-950 uppercase">
                      {currentLanguage === "ar" ? "تخصيص وتصدير وثيقة مخرجات التشغيل الذاتي" : "Sovereign Performance & Optimization Report Builder"}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      
                      <div className="space-y-2">
                        <label className="text-slate-500 font-bold block">Report Scope & Modules</label>
                        <div className="space-y-1.5 font-semibold text-slate-700">
                          {Object.keys(reportScope).map((key) => (
                            <label key={key} className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={(reportScope as any)[key]}
                                onChange={(e) => setReportScope(prev => ({ ...prev, [key]: e.target.checked }))}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                              />
                              <span className="capitalize">{key} Index metrics</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-slate-500 font-bold block">Temporal Focus Timeframe</label>
                        <select
                          value={reportTimeframe}
                          onChange={(e) => setReportTimeframe(e.target.value as any)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-xs font-bold"
                        >
                          <option value="current_hour">Real-time (Last 60 Minutes)</option>
                          <option value="today">Daily Operational Ledger</option>
                          <option value="q3_2026">Quarterly Q3-2026 Vision Projection</option>
                          <option value="annual_2026">Annual 2026 Comprehensive Audit</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-slate-500 font-bold block">Sovereign Certificate Format</label>
                        <select
                          value={reportFormat}
                          onChange={(e) => setReportFormat(e.target.value as any)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-xs font-bold"
                        >
                          <option value="pdf">Sovereign Sealed Cryptographic PDF</option>
                          <option value="excel">Structured Audit Trail Ledger (XLSX)</option>
                          <option value="json">Machine Readable Compliance Feed (JSON)</option>
                        </select>
                      </div>

                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleGenerateReport}
                        disabled={isGeneratingReport}
                        className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingReport ? "animate-spin" : ""}`} />
                        <span>{isGeneratingReport ? "Compiling Indexes..." : (currentLanguage === "ar" ? "تصدير الوثيقة الفيدرالية المعتمدة" : "Generate Certified Document")}</span>
                      </button>
                    </div>
                  </div>

                  {/* LOG OF GENERATED REPORTS */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest">
                      {currentLanguage === "ar" ? "السجل التاريخي للتقارير المستخرجة" : "Sovereign Audit Document History"}
                    </h4>

                    <div className="space-y-2">
                      {generatedReports.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No custom reports compiled in this session. Configure and trigger compilation above.</p>
                      ) : (
                        generatedReports.map(report => (
                          <div key={report.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between text-xs">
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-gray-400">[{report.id}] - Verified at {report.timestamp}</span>
                              <h5 className="font-bold text-slate-800">{report.title}</h5>
                            </div>

                            <div className="flex items-center gap-3 font-mono">
                              <span className="text-slate-400">{report.size}</span>
                              <button 
                                onClick={() => alert(`Downloading verified ${report.id} cryptographic artifact.`)}
                                className="p-2 hover:bg-slate-100 rounded-lg text-emerald-600 cursor-pointer"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR PANEL: PREDICTIVE METRICS, SANDBOX, AND LEADERBOARD */}
            <div className="space-y-6">
              
              {/* SYSTEM HEALTH RING/GAUGE COVERS */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {currentLanguage === "ar" ? "كفاءة معالجة الأنظمة والذكاء الاصطناعي" : "Autonomous Performance Load"}
                  </h4>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="text-center py-6 relative">
                  {/* Absolute positioning circles to simulate gauge */}
                  <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-emerald-500 border-r-indigo-500 mx-auto flex flex-col justify-center items-center">
                    <span className="text-3xl font-black font-mono text-emerald-400">99.98%</span>
                    <span className="text-[9px] text-slate-400 tracking-widest font-mono uppercase">CORE SLA UP</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center border-t border-slate-800 pt-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Federal API Uptime</span>
                    <span className="font-bold font-mono text-emerald-400">100.0%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Average Healing Lag</span>
                    <span className="font-bold font-mono text-indigo-400">12 seconds</span>
                  </div>
                </div>
              </div>

              {/* INTEGRATED FORESIGHT STATS */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-gray-100">
                  {currentLanguage === "ar" ? "توقعات الاستشراف القومي الاقتصادي (2035)" : "Predictive Foresight Models"}
                </h4>

                <div className="space-y-3 text-xs">
                  {[
                    { titleAr: "النمو الصناعي المتوقع", titleEn: "Expected Industrial Growth", trend: "+12.4%", status: "on_track", color: "text-emerald-600" },
                    { titleAr: "معدل الرقمنة بالمصانع الكبرى", titleEn: "Factory IoT Adoption Rate", trend: "86.2%", status: "on_track", color: "text-indigo-600" },
                    { titleAr: "الاستيراد والتصدير الفيدرالي", titleEn: "Trade Balance Forecast", trend: "+$240M Q4", status: "warning", color: "text-amber-600" },
                    { titleAr: "توطين القوى البشرية التقنية", titleEn: "Local Developer Workforce", trend: "+18,400 Staff", status: "on_track", color: "text-emerald-600" }
                  ].map((f, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">
                          {currentLanguage === "ar" ? f.titleAr : f.titleEn}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">Prediction Model v4.2</span>
                      </div>
                      <span className={`font-mono font-bold ${f.color}`}>{f.trend}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* POLICY SIMULATOR ACCORDION SANDBOX */}
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {currentLanguage === "ar" ? "مخطط التقييم السريع للسياسات" : "Policy variables slider preview"}
                  </h4>
                </div>

                <p className="text-[11px] text-indigo-200 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "اختبر المتغيرات والضرائب الجمركية لتقييم أثر الصادرات الوطنية وحجم تدفق الاستثمار الأجنبي المباشر."
                    : "Adjust tax exemptions and duty rates to immediately calculate projected GDP shifts in the Red Sea and Giad manufacturing zones."}
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-indigo-200">
                    <span>Export Duty Relief:</span>
                    <span className="font-mono text-emerald-400">100% Tax Holiday</span>
                  </div>
                  <div className="w-full bg-indigo-950 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="bg-indigo-950 p-3 rounded-lg border border-indigo-800 text-[10.5px] text-indigo-300 leading-relaxed font-mono">
                  <span className="text-emerald-400 font-bold block mb-1">PROGRESSED FORECAST:</span>
                  Yields direct 8.4% trade balance optimization within 12 fiscal months. Recommended by Operations Agent.
                </div>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
