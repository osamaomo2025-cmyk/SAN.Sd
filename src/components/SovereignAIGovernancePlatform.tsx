/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * National AI Governance & Smart Government Platform (NAIGSGP) v1.0.0
 * Compliance with ISO/IEC 42001, NIST AI RMF & OECD Principles
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, Shield, Eye, ShieldAlert, Sparkles, Database, Workflow, Send, CheckCircle2,
  AlertTriangle, RefreshCw, Layers, Plus, FileText, BarChart3, HelpCircle, UserCheck,
  Zap, Lock, Gauge, History, Trash2, Sliders, ChevronRight, Play, Check, X, Info
} from "lucide-react";
import { UserRole } from "../types";

interface SovereignAIGovernancePlatformProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
}

// ---------------------- TYPES & INTERFACES ----------------------

interface RegisteredModel {
  id: string;
  name: string;
  type: string;
  version: string;
  accuracy: number;
  driftRate: number;
  biasScore: "Negligible" | "Low" | "Medium" | "High";
  explainability: number; // percentage
  status: "Approved" | "Pending Review" | "Suspended";
  owner: string;
  trainingDataset: string;
}

interface AIAgent {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  status: "idle" | "thinking" | "executing";
  accuracy: number;
  tools: string[];
}

interface AIRiskItem {
  id: string;
  threatAr: string;
  threatEn: string;
  impact: "Critical" | "High" | "Medium" | "Low";
  status: "Mitigated" | "Active Monitoring" | "Action Required";
  mitigationAr: string;
  mitigationEn: string;
}

interface RAGDocument {
  id: string;
  titleAr: string;
  titleEn: string;
  source: string;
  chunksCount: number;
  qualityScore: number;
  lastIndexed: string;
}

interface RPAWorkflow {
  id: string;
  nameAr: string;
  nameEn: string;
  status: "active" | "paused" | "running";
  successRate: number;
  runsCount: number;
  lastRun: string;
}

interface AIIncident {
  id: string;
  title: string;
  severity: "High" | "Medium" | "Low";
  date: string;
  status: "Resolved" | "Under Investigation";
  description: string;
}

// ---------------------- SEED DATA ----------------------

const initialModels: RegisteredModel[] = [
  {
    id: "M-LLM-SUDAN-1.0",
    name: "Sudan Commerce Core-LLM",
    type: "Large Language Model",
    version: "1.0.4",
    accuracy: 94.2,
    driftRate: 1.2,
    biasScore: "Low",
    explainability: 88,
    status: "Approved",
    owner: "National AI Lab (SDRC)",
    trainingDataset: "Sudan Commerce Registry Corpus v3"
  },
  {
    id: "M-SLM-ARABIC-BERT",
    name: "AraLegal-Bert-Mini",
    type: "Small Language Model (Legal)",
    version: "2.1.0",
    accuracy: 96.8,
    driftRate: 0.4,
    biasScore: "Negligible",
    explainability: 95,
    status: "Approved",
    owner: "Sovereign Legal Council",
    trainingDataset: "Federal Legislation & Supreme Court Rulings"
  },
  {
    id: "M-OCR-FACTORY-DENSE",
    name: "Sudan-OCR Industrial-Scan",
    type: "Computer Vision / OCR",
    version: "1.2.0",
    accuracy: 91.5,
    driftRate: 3.4,
    biasScore: "Negligible",
    explainability: 99,
    status: "Approved",
    owner: "Smart Inspection Directorate",
    trainingDataset: "National Factories Technical Audits 2018-2025"
  },
  {
    id: "M-PRED-INVEST-MACRO",
    name: "Sdn-Invest Demand-Predictor",
    type: "Predictive Analytics",
    version: "4.0.1",
    accuracy: 87.3,
    driftRate: 5.8,
    biasScore: "Medium",
    explainability: 72,
    status: "Pending Review",
    owner: "Investment & Economic Forecasting Dept",
    trainingDataset: "COMESA-East Africa Trade Statistics & Central Bank Macro Indices"
  }
];

const initialAgents: AIAgent[] = [
  {
    id: "agent-registry",
    nameAr: "عميل السجل التجاري الذكي",
    nameEn: "Commercial Registry Agent",
    roleAr: "المطابقة التلقائية وفحص تكرار الأسماء والملاك المستفيدين",
    roleEn: "Automated compliance, corporate structure verification, and owner cross-checking",
    status: "idle",
    accuracy: 97.4,
    tools: ["CheckOwnerIdentity", "SearchDuplicates", "VerifyUBO"]
  },
  {
    id: "agent-licensing",
    nameAr: "عميل التراخيص الفيدرالي",
    nameEn: "Licensing & Permit Agent",
    roleAr: "فحص رخص المنشآت الصناعية والمطابقة الفنية للمواصفات",
    roleEn: "Evaluation of industrial plant applications and technical standard alignments",
    status: "idle",
    accuracy: 95.8,
    tools: ["ValidateSpecs", "CalculateExemptions", "IssuePermitTicket"]
  },
  {
    id: "agent-consumer",
    nameAr: "عميل مراقبة الأسواق وحماية المستهلك",
    nameEn: "Consumer Protection Watchdog Agent",
    roleAr: "كشف الغش التجاري والتلاعب بالأسعار واحتكار السلع",
    roleEn: "Sensing market manipulation, cartels, false pricing, and hoarding schemes",
    status: "idle",
    accuracy: 92.1,
    tools: ["AnalyzePrices", "DetectAnomaly", "FlagViolations"]
  },
  {
    id: "agent-decision",
    nameAr: "العميل السيادي لدعم القرار والتحليل الاقتصادي",
    nameEn: "Executive Decision Support Agent",
    roleAr: "محاكاة السياسات الاقتصادية والنمو الصناعي وتوفير الذكاء للمستشارين",
    roleEn: "Policy simulation, macro-industrial forecasting, and strategic executive briefings",
    status: "idle",
    accuracy: 89.5,
    tools: ["RunPolicySimulation", "BuildEconomicForecast", "GenerateMinisterReport"]
  }
];

const initialRisks: AIRiskItem[] = [
  {
    id: "RSK-001",
    threatAr: "هلوسة نماذج الـ LLM في الاستفسارات القانونية للشركاء والمواطنين",
    threatEn: "LLM hallucinations in strategic corporate law queries",
    impact: "High",
    status: "Mitigated",
    mitigationAr: "فرض تقنية RAG الحصرية وربط الإجابات بالنصوص القانونية والجريدة الرسمية فقط",
    mitigationEn: "Forced RAG grounding linked exclusively to official Gazette laws with strict temperature=0"
  },
  {
    id: "RSK-002",
    threatAr: "تحيز تنبؤات الاستثمار للمناطق الأكثر تطوراً وإهمال الأقاليم الناشئة",
    threatEn: "Socio-economic regional bias in investment allocation predictions",
    impact: "High",
    status: "Action Required",
    mitigationAr: "إعادة موازنة أوزان التدريب للنموذج لتشمل الحوافز السيادية للولايات الأقل نمواً",
    mitigationEn: "Retraining models with federal incentives and lower weights for developed hubs"
  },
  {
    id: "RSK-003",
    threatAr: "تسميم نماذج الـ OCR عبر مستندات مزيفة للتهرب من تفتيش المصانع",
    threatEn: "Adversarial attacks on OCR verification engines via corrupted PDF uploads",
    impact: "Medium",
    status: "Active Monitoring",
    mitigationAr: "فحص المستندات بنظام فحص فيروسي وثنائي أبعاد للكشف عن البكسلات المشبوهة",
    mitigationEn: "File scanning and multi-pass cryptographic validation for document integrity"
  }
];

const initialRAGDocs: RAGDocument[] = [
  {
    id: "RAG-LAW-01",
    titleAr: "قانون الشركات السوداني لسنة 2025 وتعديلاته",
    titleEn: "Sudanese Companies Act of 2025 and Amendments",
    source: "وزارة العدل - الجريدة الرسمية",
    chunksCount: 1420,
    qualityScore: 99.2,
    lastIndexed: "2026-07-10 09:12"
  },
  {
    id: "RAG-REG-02",
    titleAr: "لائحة تشجيع الاستثمار وتنظيم المدن الصناعية",
    titleEn: "Investment Encouragement & Industrial Cities Regulation",
    source: "وزارة الاستثمار والتعاون الدولي",
    chunksCount: 840,
    qualityScore: 98.5,
    lastIndexed: "2026-07-12 14:00"
  },
  {
    id: "RAG-STD-03",
    titleAr: "المواصفات القياسية السودانية لتعبئة وتصدير الصمغ العربي",
    titleEn: "SSO Quality Standards for Gum Arabic Packing & Export",
    source: "الهيئة السودانية للمواصفات والمقاييس",
    chunksCount: 310,
    qualityScore: 100.0,
    lastIndexed: "2026-07-15 11:30"
  }
];

const initialRPAWorkflows: RPAWorkflow[] = [
  {
    id: "RPA-01",
    nameAr: "التحقق التلقائي من السجلات الضريبية وتحديث صلاحيات الموردين",
    nameEn: "Automated Vendor Tax Compliance Check",
    status: "active",
    successRate: 99.8,
    runsCount: 14290,
    lastRun: "منذ 3 دقائق"
  },
  {
    id: "RPA-02",
    nameAr: "جدولة وتوزيع مهام التفتيش على المصانع استناداً لمؤشر الخطورة البيئية",
    nameEn: "Risk-based Smart Factory Inspection Scheduler",
    status: "active",
    successRate: 98.4,
    runsCount: 3209,
    lastRun: "منذ ساعة"
  },
  {
    id: "RPA-03",
    nameAr: "مطابقة رخص الصادرات الغذائية ببورتسودان وصرف شهادات المنشأ",
    nameEn: "Export Clearance Reconciliation & Certification",
    status: "running",
    successRate: 99.1,
    runsCount: 8492,
    lastRun: "الآن"
  }
];

export default function SovereignAIGovernancePlatform({ currentLanguage, role }: SovereignAIGovernancePlatformProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<"governance" | "registry" | "agents" | "rag" | "automation" | "observability">("governance");

  // Core App States
  const [models, setModels] = useState<RegisteredModel[]>(initialModels);
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);
  const [risks, setRisks] = useState<AIRiskItem[]>(initialRisks);
  const [ragDocs, setRagDocs] = useState<RAGDocument[]>(initialRAGDocs);
  const [workflows, setWorkflows] = useState<RPAWorkflow[]>(initialRPAWorkflows);
  
  // Interaction and Playground States
  const [selectedModel, setSelectedModel] = useState<RegisteredModel>(initialModels[0]);
  const [auditingModelId, setAuditingModelId] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  // RAG Query Playground States
  const [ragQuery, setRagQuery] = useState("");
  const [ragResponse, setRagResponse] = useState<any>(null);
  const [ragSearching, setRagSearching] = useState(false);

  // Multi-Agent Collaboration Simulation
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [isSimulatingAgents, setIsSimulatingAgents] = useState(false);

  // RPA Runner Simulation
  const [runningRPAId, setRunningRPAId] = useState<string | null>(null);
  const [rpaLogs, setRpaLogs] = useState<string[]>([]);

  // AI Incident form
  const [incidents, setIncidents] = useState<AIIncident[]>([
    {
      id: "INC-901",
      title: "Model Drift on SDN-Invest Macro",
      severity: "Medium",
      date: "2026-07-14",
      status: "Resolved",
      description: "Macro economics model accuracy declined due to currency exchange updates. Model retrained and approved."
    }
  ]);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState<"High" | "Medium" | "Low">("Medium");
  const [incidentDesc, setIncidentDesc] = useState("");

  // Statistics
  const totalQueriesToday = 145920;
  const avgResponseTimeMs = 45;
  const overallSafetyRate = 99.98;
  const complianceIndex = 98.4; // %

  // Check role authorization for model approvals or high-security audits
  const isAuthorizedToApprove = role === UserRole.GOVERNMENT_MINISTER || role === UserRole.GOVERNMENT_EXECUTIVE;

  // 1. Simulator: Ethical Audit for selected model
  const triggerEthicalAudit = (modelId: string) => {
    setAuditingModelId(modelId);
    setAuditResult(null);

    const target = models.find(m => m.id === modelId);
    if (!target) return;

    setTimeout(() => {
      setAuditingModelId(null);
      
      const accDiff = (Math.random() * 2).toFixed(2);
      const isCompliant = target.biasScore !== "Medium" && target.explainability > 80;

      setAuditResult(
        currentLanguage === "ar"
          ? `📋 تقرير التدقيق الأخلاقي والمطابقة السيادية (${target.name}):\n\n` +
            `• نسبة دقة التصنيف المعتمدة: %${target.accuracy} (الانحراف الهامشي: %${accDiff}+/-)\n` +
            `• مؤشر الشفافية والقابلية للتفسير (XAI): %${target.explainability} (${target.explainability > 85 ? "ممتاز ومتوافق مع المادة 12" : "مقبول مع شروط التوضيح البشرية"})\n` +
            `• معدل التحيز الإقليمي والجندري: ${target.biasScore} (${isCompliant ? "متوافق مع المعايير الفيدرالية" : "يتطلب تصحيحاً فورياً لأوزان الأقاليم"})\n` +
            `• توافق مع ISO/IEC 42001: ${isCompliant ? "مكتمل ومصدق ✅" : "يتطلب تدخلاً بشرياً ومراجعة من CDO ⚠️"}\n` +
            `• حالة درع الأمان السيادي: مؤمن بالكامل ومفصول عن الإنترنت الخارجي.`
          : `📋 Ethical Audit & Sovereign Compliance Report for (${target.name}):\n\n` +
            `• Verified Accuracy Index: ${target.accuracy}% (Margin drift: +/-${accDiff}%)\n` +
            `• Explainable AI (XAI) Score: ${target.explainability}% (${target.explainability > 85 ? "Excellent - ISO 42001 Compliant" : "Conditional approval with Human-in-the-loop overrides"})\n` +
            `• Demographic & Regional Bias: ${target.biasScore} (${isCompliant ? "Passed National Fairness Bounds" : "Requires retraining of socio-economic data points"})\n` +
            `• Regulatory Status: ${isCompliant ? "FULLY CERTIFIED ✅" : "CONDITIONAL STATUS / Action Required ⚠️"}\n` +
            `• Cybersecurity Guardrail: Air-gapped deployment verified.`
      );

      // if pending, let's auto transition or update accuracy slightly
      setModels(prev => prev.map(m => {
        if (m.id === modelId) {
          return {
            ...m,
            driftRate: Math.max(0.1, Number((m.driftRate * 0.9).toFixed(2)))
          };
        }
        return m;
      }));
    }, 1500);
  };

  // 2. Action: Approve a Model (Role dependent)
  const handleApproveModel = (modelId: string) => {
    if (!isAuthorizedToApprove) return;
    setModels(prev => prev.map(m => {
      if (m.id === modelId) {
        return { ...m, status: "Approved" };
      }
      return m;
    }));
  };

  // 3. Simulator: Grounded RAG Query
  const runRAGQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;

    setRagSearching(true);
    setRagResponse(null);

    setTimeout(() => {
      setRagSearching(false);
      const isCompaniesAct = ragQuery.includes("شرك") || ragQuery.toLowerCase().includes("compan");
      const isGumArabic = ragQuery.includes("صمغ") || ragQuery.toLowerCase().includes("gum");

      if (isCompaniesAct) {
        setRagResponse({
          answerAr: "بناءً على المادة 45 من قانون الشركات السوداني لسنة 2025، يُشترط لتأسيس الشركة ذات المسؤولية المحدودة (LLC) ألا يقل عدد الشركاء عن اثنين ولا يزيد عن خمسين شريكاً، ويجب إيداع رأس المال التأسيسي كاملاً في بنك مرخص وتأكيده عبر إشعار السجل الفيدرالي الرقمي المترابط.",
          answerEn: "Pursuant to Article 45 of the Sudanese Companies Act of 2025, establishing a Limited Liability Company (LLC) requires a minimum of 2 and a maximum of 50 shareholders. The initial capital must be fully deposited in an approved bank and confirmed via the interconnected federal digital registry.",
          confidence: 99.4,
          sources: [
            { id: "RAG-LAW-01", pages: "ص 12، الفقرة 3", textAr: "تأسيس الشراكات ذات المسؤولية المحدودة وضوابط الإيداع المصرفي لرأس المال" }
          ],
          explainabilityPath: "Sudan Commerce Core-LLM -> Context injected via AraLegal-Bert-Mini -> Strict ground check passed."
        });
      } else if (isGumArabic) {
        setRagResponse({
          answerAr: "تُحدد المواصفة القياسية السودانية لتعبئة الصمغ العربي (المواصفة رقم 492) شروط التعبئة في أكياس مفرغة من الهواء ومصنوعة من بولي إيثيلين من فئة الغذاء بسعة 25 كجم كحد أقصى، مع إلزامية وضع الباركود السيادي وشهادة المنشأ الرقمية الصادرة من منصة الاستيراد والتصدير.",
          answerEn: "SGS/SSO Standard No. 492 for Gum Arabic packaging mandates vacuum sealing in food-grade polyethylene bags of 25kg maximum capacity, with mandatory application of the sovereign QR barcode and digital origin certificates issued from the SDMCI trade portal.",
          confidence: 98.8,
          sources: [
            { id: "RAG-STD-03", pages: "ص 4، البند ب", textAr: "ضوابط تعبئة وجودة وتسميم صادرات الصمغ الطبيعي والمحاصيل النقدية" }
          ],
          explainabilityPath: "Sudan Commerce Core-LLM -> Retrieved SSO chunk #310 -> Grounding validation confirmed."
        });
      } else {
        setRagResponse({
          answerAr: "مرحباً. تفيد منصة الحوكمة والذكاء الاصطناعي بأن استفسارك يتعلق بالسياسات العامة للتجارة والصناعة في جمهورية السودان. تم استرجاع الوثائق التنظيمية المتاحة لتقديم أفضل إجابة مدعومة بالبراهين السيادية المعتمدة.",
          answerEn: "Hello. The AI Governance Platform has processed your inquiry regarding general trade and industrial policies in the Republic of Sudan. Regulatory documents have been scanned to provide an explainable, grounded answer.",
          confidence: 91.2,
          sources: [
            { id: "RAG-REG-02", pages: "ص 2", textAr: "الخطوط التوجيهية للخدمات واللوائح الاقتصادية الموحدة" }
          ],
          explainabilityPath: "Sudan Commerce Core-LLM -> Generic retrieval fallback -> Strict guardrails active."
        });
      }
    }, 1800);
  };

  // 4. Simulator: Multi-Agent MCP Workflow Orchestration
  const runAgentCollaborationSim = () => {
    setIsSimulatingAgents(true);
    setAgentLogs([]);
    
    const logs: string[] = [];
    setAgents(prev => prev.map(a => ({ ...a, status: "thinking" })));

    const appendLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setAgentLogs(prev => [...prev, msg]);
      }, delay);
    };

    appendLog(`🤖 [${new Date().toLocaleTimeString()}] [MCP HOST] Initializing Secure Agent-to-Agent Mesh (Zero-Trust Session)...`, 100);
    appendLog(`🔐 [${new Date().toLocaleTimeString()}] [MCP PROTOCOL] Shared context established with 256-bit ephemeral keys.`, 400);
    
    appendLog(`📨 [${new Date().toLocaleTimeString()}] [Investment Agent] Dispatching request: "Evaluate feasibility of Gum Arabic processing hub in Omdurman Industrial Zone"`, 800);
    
    appendLog(`⚙️ [${new Date().toLocaleTimeString()}] [Licensing Agent] INVOKED MCP Tool: ValidateSpecs() to inspect zone capacity and environmental footprint.`, 1300);
    appendLog(`✅ [${new Date().toLocaleTimeString()}] [Licensing Agent] Result: Omdurman Sector 3 has 1,500m² available with direct power & water lines.`, 1800);
    
    appendLog(`🔍 [${new Date().toLocaleTimeString()}] [Commercial Registry Agent] Checking corporate structures of founders. INVOKED: VerifyUBO().`, 2300);
    appendLog(`🛡️ [${new Date().toLocaleTimeString()}] [Commercial Registry Agent] Status: Verified. Founders have no legal blocks and are compliant with Sudan AML guidelines.`, 2800);
    
    appendLog(`⚖️ [${new Date().toLocaleTimeString()}] [Legal Agent] Applying Investment Encouragement Act Article 8 tax-holiday incentives automatically.`, 3300);
    
    appendLog(`✨ [${new Date().toLocaleTimeString()}] [Executive Decision Support Agent] Aggregating multi-agent results to build Strategic Investment Docket.`, 3800);
    appendLog(`🏁 [${new Date().toLocaleTimeString()}] [Executive Decision Support Agent] SUCCESS: Docket generated & transmitted to Minister's sovereign dashboard.`, 4300);

    setTimeout(() => {
      setIsSimulatingAgents(false);
      setAgents(prev => prev.map(a => ({ ...a, status: "idle" })));
    }, 4500);
  };

  // 5. Simulator: RPA Workflow runner
  const triggerRPAWorkflow = (id: string) => {
    setRunningRPAId(id);
    setRpaLogs([]);

    const workflow = workflows.find(w => w.id === id);
    if (!workflow) return;

    const appendRPALog = (msg: string, delay: number) => {
      setTimeout(() => {
        setRpaLogs(prev => [...prev, msg]);
      }, delay);
    };

    appendRPALog(`🚀 [${new Date().toLocaleTimeString()}] Launching RPA automation daemon for: "${currentLanguage === 'ar' ? workflow.nameAr : workflow.nameEn}"`, 200);
    appendRPALog(`⛓️ [${new Date().toLocaleTimeString()}] Establishing API Gateway pipeline and fetching unresolved queue items...`, 500);
    appendRPALog(`📊 [${new Date().toLocaleTimeString()}] Processing batch of 12 incoming registrations.`, 900);
    appendRPALog(`🔒 [${new Date().toLocaleTimeString()}] Validating cryptographic tokens with Civil Registry & Tax gateways...`, 1300);
    appendRPALog(`📝 [${new Date().toLocaleTimeString()}] Updating local database records and syncing compliance indices.`, 1800);
    appendRPALog(`✅ [${new Date().toLocaleTimeString()}] Batch successfully completed. Zero errors reported.`, 2200);

    setTimeout(() => {
      setRunningRPAId(null);
      // update runs count
      setWorkflows(prev => prev.map(w => {
        if (w.id === id) {
          return {
            ...w,
            runsCount: w.runsCount + 12,
            lastRun: currentLanguage === "ar" ? "الآن" : "Just now",
            successRate: Number((99.0 + Math.random()).toFixed(1))
          };
        }
        return w;
      }));
    }, 2400);
  };

  // 6. Action: File new AI incident (observability and accountability)
  const submitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle.trim() || !incidentDesc.trim()) return;

    const newInc: AIIncident = {
      id: `INC-${Math.floor(Math.random() * 900) + 100}`,
      title: incidentTitle,
      severity: incidentSeverity,
      date: new Date().toISOString().split("T")[0],
      status: "Under Investigation",
      description: incidentDesc
    };

    setIncidents([newInc, ...incidents]);
    setIncidentTitle("");
    setIncidentDesc("");
    setShowIncidentForm(false);
  };

  return (
    <div className="space-y-6" id="ai-governance-platform-wrapper">
      {/* Sovereign Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white p-6 rounded-2xl shadow-xl border border-indigo-900/40 relative overflow-hidden" id="naigsgp-header-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-indigo-500/30 font-mono tracking-wider">
                NAIGSGF v1.0.0 (ISO/IEC 42001)
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                {currentLanguage === "ar" ? "الحوكمة والتدقيق الأمني نشط" : "Active Security Auditing"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2" style={{ fontFamily: "var(--font-arabic)" }}>
              {currentLanguage === "ar" ? "الإطار الوطني لحوكمة الذكاء الاصطناعي والحكومة الذكية" : "National AI Governance & Smart Government Platform"}
            </h1>
            <p className="text-gray-300 text-sm max-w-4xl">
              {currentLanguage === "ar" 
                ? "المنصة الاتحادية لتسجيل ونمذجة ورقابة أنظمة الذكاء الاصطناعي والأتمتة الذكية والوكلاء الرقميين عبر كافة إدارات وزارة التجارة والصناعة لضمان الشفافية والأخلاقيات والامتثال لمرئيات السودان الرقمية 2035."
                : "Sovereign platform for registering, auditing, and operationalizing machine learning, RAG systems, and autonomous multi-agent networks, securing alignment with strict ethical guidelines, accountability, and Sudan's 2035 Digital Strategy."}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-indigo-900 self-stretch md:self-auto justify-center">
            <Cpu className="w-10 h-10 text-indigo-400 animate-pulse" />
            <div className="text-right font-mono text-xs">
              <div className="text-gray-400">{currentLanguage === "ar" ? "مؤشر حوكمة البيانات" : "Compliance Index"}</div>
              <div className="text-lg font-bold text-indigo-400">{complianceIndex}%</div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Nav Menu */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-800 pt-4 relative z-10" id="naigsgp-tabs">
          {[
            { id: "governance", labelAr: "لوحة الحوكمة والتحكم السيادي", labelEn: "Sovereign Executive Center", icon: Shield },
            { id: "registry", labelAr: "سجل النماذج الوطني", labelEn: "National Model Registry", icon: Database },
            { id: "agents", labelAr: "منصة الوكلاء الذاتيين (MCP)", labelEn: "Multi-Agent Platform (MCP)", icon: Workflow },
            { id: "rag", labelAr: "مستودع المعرفة الموثوق (RAG)", labelEn: "Grounded Knowledge (RAG)", icon: FileText },
            { id: "automation", labelAr: "الأتمتة الذكية والـ RPA", labelEn: "Intelligent RPA Workflows", icon: Zap },
            { id: "observability", labelAr: "المرونة والأخلاقيات والسلامة", labelEn: "AI Safety & Observability", icon: Gauge }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg font-bold border border-indigo-500" 
                    : "bg-slate-950/40 text-slate-300 hover:bg-slate-900/60 hover:text-white border border-slate-800"
                }`}
              >
                <IconComponent className="w-4 h-4 text-indigo-400" />
                <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sub-Tab Render Pipeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 200 }}
        >
          {/* TAB 1: SOVEREIGN EXECUTIVE CENTER */}
          {activeTab === "governance" && (
            <div className="space-y-6" id="tab-gov-exec">
              {/* Top Stats Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "الاستعلامات اليومية المصونة" : "SAFE QUERIES TODAY"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-slate-900">{(totalQueriesToday).toLocaleString()}</span>
                    <span className="text-emerald-500 text-xs block mt-1 font-semibold">100% {currentLanguage === "ar" ? "مدققة بالمرشحات السيادية" : "Filtered & Audited"}</span>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "زمن الاستجابة الوطني" : "MEDIAN LATENCY"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-slate-900">{avgResponseTimeMs} ms</span>
                    <span className="text-emerald-500 text-xs block mt-1 font-semibold">{currentLanguage === "ar" ? "استدلال فوري فائق السرعة" : "Edge-Accelerated Inference"}</span>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-xl">
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "سلامة النماذج ضد الهلوسة" : "HALLUCINATION-FREE RATE"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-slate-900">{overallSafetyRate}%</span>
                    <span className="text-emerald-500 text-xs block mt-1 font-semibold">{currentLanguage === "ar" ? "بفضل التقييد الصارم بالنصوص" : "Grounded by Strict RAG Bounds"}</span>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-xl">
                    <Sliders className="w-6 h-6 text-sky-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "نسبة الأتمتة الإجمالية (RPA)" : "GOVERNMENT AUTO-RATE"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-purple-600">74.2%</span>
                    <span className="text-indigo-500 text-xs block mt-1 font-semibold">{currentLanguage === "ar" ? "من المعاملات بلا تدخل يدوي" : "No Manual Intervention"}</span>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <Workflow className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Bento Grid layout for Strategic Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel 1: Federal AI Risks register */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "سجل مخاطر الذكاء الاصطناعي الفيدرالي" : "Sovereign AI Risks Register (ISO 23894)"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {currentLanguage === "ar" ? "تقييم الرقابة والتحيز والامتثال الأخلاقي والأمني" : "Real-time threat evaluation, socio-demographic bias, and mitigations"}
                      </p>
                    </div>
                    <span className="bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-100 flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>{currentLanguage === "ar" ? "تدقيق نشط" : "Continuous Auditing"}</span>
                    </span>
                  </div>

                  <div className="space-y-4">
                    {risks.map((risk) => {
                      const isCritical = risk.impact === "Critical" || risk.impact === "High";
                      const isMitigated = risk.status === "Mitigated";

                      return (
                        <div key={risk.id} className="p-4 rounded-xl bg-slate-50 border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2 max-w-xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-slate-500">[{risk.id}]</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isCritical ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {risk.impact.toUpperCase()} IMPACT
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isMitigated ? "bg-emerald-100 text-emerald-800" : risk.status === "Active Monitoring" ? "bg-sky-100 text-sky-800" : "bg-purple-100 text-purple-800"
                              }`}>
                                {currentLanguage === "ar" 
                                  ? risk.status === "Mitigated" ? "تمت المعالجة" : risk.status === "Active Monitoring" ? "مراقبة نشطة" : "إجراء مطلوب"
                                  : risk.status}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs" style={{ fontFamily: "var(--font-arabic)" }}>
                              {currentLanguage === "ar" ? risk.threatAr : risk.threatEn}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium">
                              <strong className="text-slate-700">{currentLanguage === "ar" ? "آلية الحماية: " : "Mitigation Protocol: "}</strong>
                              {currentLanguage === "ar" ? risk.mitigationAr : risk.mitigationEn}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-center">
                            {risk.status !== "Mitigated" && isAuthorizedToApprove && (
                              <button
                                onClick={() => {
                                  setRisks(prev => prev.map(r => r.id === risk.id ? { ...r, status: "Mitigated" } : r));
                                }}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer transition-all"
                              >
                                {currentLanguage === "ar" ? "اعتماد المعالجة" : "Approve Mitigation"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Panel 2: CDO / Minister Policy Directives */}
                <div className="bg-gradient-to-br from-indigo-950 to-slate-950 text-white rounded-2xl border border-indigo-900/30 p-6 space-y-4 shadow-lg flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-bold text-white text-base border-b border-indigo-900 pb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
                      <Shield className="w-5 h-5 text-indigo-400" />
                      <span>{currentLanguage === "ar" ? "موجهات الحوكمة السيادية" : "Sovereign AI Directives"}</span>
                    </h3>

                    <p className="text-xs text-indigo-200 leading-relaxed">
                      {currentLanguage === "ar"
                        ? "تنفيذاً للجريدة الرسمية، تُحظر معالجة أي بيانات تجارية للمستثمرين خارج حدود خوادم السحابة السيادية لوزارة التجارة والصناعة. يجب إخضاع جميع نماذج LLM لمرشحات الخصوصية وحذف أرقام الهوية قبل الاستعلام."
                        : "Under Federal Decrees, no merchant data may transit outside sovereign cloud boundaries. LLMs must deploy privacy scrubs to remove civil ID numbers pre-inference."}
                    </p>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-indigo-900/60 space-y-2">
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-indigo-300">ISO 42001 Readiness</span>
                        <span className="text-emerald-400 font-bold">100% Fully Compliant</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-indigo-300">Human-in-the-Loop Threshold</span>
                        <span className="text-amber-400 font-bold">Risk Level ≥ 7.0</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-indigo-300">Model Drifts Tolerated</span>
                        <span className="text-emerald-400 font-bold">≤ 3.0% Max</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="text-xs text-indigo-300 font-bold mb-1 uppercase tracking-wider">{currentLanguage === "ar" ? "قناة الدعم والتحكيم" : "Decision Arbiter"}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="font-semibold">{currentLanguage === "ar" ? "ديوان وزير الاتصالات والتحول الرقمي" : "Ministry of Digital Strategy"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NATIONAL MODEL REGISTRY */}
          {activeTab === "registry" && (
            <div className="space-y-6" id="tab-model-registry">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Models list */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "سجل النماذج الفيدرالي المصادق عليه" : "Federal AI Model Catalog"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {currentLanguage === "ar" ? "متابعة دقة، انحراف، وتحيز النماذج النشطة في الأنظمة الحيوية" : "Track verification state, drift, bias, and explainability score"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {models.map((model) => {
                      const isSelected = selectedModel.id === model.id;
                      const isPending = model.status === "Pending Review";

                      return (
                        <div 
                          key={model.id}
                          onClick={() => setSelectedModel(model)}
                          className={`p-4 rounded-xl border text-xs leading-relaxed cursor-pointer transition-all ${
                            isSelected 
                              ? "bg-indigo-50/20 border-indigo-500/60 shadow-sm" 
                              : "bg-white hover:bg-gray-50 border-gray-100"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <Cpu className={`w-4 h-4 ${isSelected ? "text-indigo-600" : "text-gray-400"}`} />
                              <span className="font-bold text-slate-900 text-xs">{model.name}</span>
                              <span className="text-gray-400">({model.version})</span>
                            </div>

                            <span className={`px-2 py-0.5 rounded-[6px] font-bold text-[9px] uppercase tracking-wider self-start sm:self-auto ${
                              model.status === "Approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {currentLanguage === "ar" 
                                ? model.status === "Approved" ? "معتمد سيادياً" : "قيد المراجعة"
                                : model.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-600">
                            <div>
                              <span className="text-gray-400 block text-[9px]">{currentLanguage === "ar" ? "فئة النموذج" : "Architecture Type"}</span>
                              <span className="font-semibold text-slate-800">{model.type}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[9px]">{currentLanguage === "ar" ? "نسبة الدقة الحالية" : "Current Accuracy"}</span>
                              <span className="font-semibold text-slate-800">{model.accuracy}%</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[9px]">{currentLanguage === "ar" ? "مؤشر الانحراف (Drift)" : "Model Drift"}</span>
                              <span className={`font-semibold ${model.driftRate > 3.0 ? "text-amber-600 font-bold" : "text-slate-800"}`}>{model.driftRate}%</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[9px]">{currentLanguage === "ar" ? "التفسير الأخلاقي (XAI)" : "Explainability (XAI)"}</span>
                              <span className="font-semibold text-slate-800">{model.explainability}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Selected Model Detail & Audit Action */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                      Selected Model Sheet
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg mt-1" style={{ fontFamily: "var(--font-arabic)" }}>
                      {selectedModel.name}
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{currentLanguage === "ar" ? "الجهة المالكة للنموذج" : "Model Owner"}</span>
                        <span className="font-semibold text-slate-800">{selectedModel.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{currentLanguage === "ar" ? "مجموعة البيانات التدريبية" : "Training Dataset"}</span>
                        <span className="font-semibold text-slate-800 text-right">{selectedModel.trainingDataset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{currentLanguage === "ar" ? "تقييم مستوى التحيز" : "Bias Assessment"}</span>
                        <span className={`font-semibold ${selectedModel.biasScore === "High" ? "text-red-600" : "text-emerald-600"}`}>{selectedModel.biasScore}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => triggerEthicalAudit(selectedModel.id)}
                        disabled={!!auditingModelId}
                        className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center justify-center gap-1.5"
                      >
                        {auditingModelId ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{currentLanguage === "ar" ? "يجري تدقيق الخوارزمية..." : "Auditing Algorithm..."}</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4" />
                            <span>{currentLanguage === "ar" ? "بدء تدقيق المطابقة الأخلاقية" : "Trigger Ethical Auditing Compliance"}</span>
                          </>
                        )}
                      </button>

                      {selectedModel.status === "Pending Review" && isAuthorizedToApprove && (
                        <button
                          onClick={() => handleApproveModel(selectedModel.id)}
                          className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>{currentLanguage === "ar" ? "اعتماد وترخيص تشغيل النموذج" : "Approve Model Deployment"}</span>
                        </button>
                      )}
                    </div>

                    {auditResult && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-slate-900 text-gray-200 rounded-xl border border-slate-800 font-mono text-[10.5px] leading-relaxed whitespace-pre-wrap"
                      >
                        {auditResult}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MULTI-AGENT PLATFORM & MCP */}
          {activeTab === "agents" && (
            <div className="space-y-6" id="tab-multi-agent">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Agent Mesh Dashboard */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                    {currentLanguage === "ar" ? "الشبكة الذكية للوكلاء الحكوميين" : "Smart Government Agent Network"}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {currentLanguage === "ar"
                      ? "يتعاون الوكلاء الرقميون في بيئة معزولة وآمنة لإنهاء معاملات التراخيص والاستثمار، مع استخدام بروتوكول MCP الفيدرالي لمشاركة السياق والذاكرة والوظائف المعتمدة."
                      : "Ministry agents collaborate securely to settle complex trade licensing dossiers via the Model Context Protocol (MCP) securely sharing authenticated context."}
                  </p>

                  <div className="space-y-3">
                    {agents.map(ag => {
                      const isThinking = ag.status === "thinking";
                      return (
                        <div key={ag.id} className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${isThinking ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
                              {currentLanguage === "ar" ? ag.nameAr : ag.nameEn}
                            </span>
                            <span className="font-mono text-[10px] text-indigo-600 font-bold">{ag.accuracy}% Acc</span>
                          </div>
                          <p className="text-gray-500 text-[11px] font-medium leading-normal">
                            {currentLanguage === "ar" ? ag.roleAr : ag.roleEn}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {ag.tools.map((t, i) => (
                              <span key={i} className="bg-indigo-50 text-indigo-700 text-[9px] px-2 py-0.5 rounded font-mono font-bold">
                                🛠️ {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Live MCP Tool Invocation Terminal */}
                <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-slate-800 min-h-[450px]">
                  <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-indigo-400 animate-spin-slow" />
                      <span className="font-mono text-xs font-bold text-gray-300">
                        MCP AGENT-TO-AGENT ORCHESTRATION TERMINAL
                      </span>
                    </div>

                    <button
                      onClick={runAgentCollaborationSim}
                      disabled={isSimulatingAgents}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-gray-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1"
                    >
                      {isSimulatingAgents ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>SIMULATING SECURE CHAIN...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>RUN MULTI-AGENT COLLABORATION</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-end bg-slate-950/60 font-mono text-[11px] overflow-y-auto space-y-2">
                    {agentLogs.length > 0 ? (
                      agentLogs.map((log, idx) => (
                        <div key={idx} className="whitespace-pre-wrap leading-relaxed text-gray-300">
                          {log}
                        </div>
                      ))
                    ) : (
                      <div className="text-center space-y-3 py-16 text-gray-500">
                        <Cpu className="w-12 h-12 text-indigo-500/20 mx-auto" />
                        <p>{currentLanguage === "ar" ? "انقر على زر التشغيل لبدء محاكاة تواصل عملاء الـ MCP الفيدراليين وإنهاء تراخيص المستثمرين." : "Click 'RUN' above to trigger safe Model Context Protocol communication between core agents."}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RAG TRUSTED KNOWLEDGE HUB */}
          {activeTab === "rag" && (
            <div className="space-y-6" id="tab-rag-grounding">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* RAG Indexed Regulatory Source Files */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                    {currentLanguage === "ar" ? "قاعدة الوثائق والقوانين المؤرشفة (RAG)" : "Grounded Regulatory Corpus (RAG)"}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {currentLanguage === "ar"
                      ? "يتم تفتيت وفهرسة الجرائد الرسمية والتشريعات الصادرة وتخزين متجهات الهوية في قاعدة البيانات المتجهية السيادية لضمان تطابق ردود الذكاء الاصطناعي مع القوانين."
                      : "Regulatory codes, laws, and SSO standards are parsed, vector-embedded, and verified to ensure grounded zero-temperature context checks."}
                  </p>

                  <div className="space-y-3">
                    {ragDocs.map(doc => (
                      <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">{currentLanguage === "ar" ? doc.titleAr : doc.titleEn}</span>
                          <span className="font-mono text-[10px] text-slate-400">{doc.id}</span>
                        </div>
                        <div className="text-gray-400 text-[10px] flex justify-between">
                          <span>{currentLanguage === "ar" ? `المصدر: ${doc.source}` : `Source: ${doc.source}`}</span>
                          <span className="text-emerald-600 font-bold">QS: {doc.qualityScore}%</span>
                        </div>
                        <div className="text-gray-400 text-[9px] flex justify-between pt-1 border-t border-dashed border-gray-200">
                          <span>{currentLanguage === "ar" ? `${doc.chunksCount} قسم معنون` : `${doc.chunksCount} Vector Chunks`}</span>
                          <span>{doc.lastIndexed}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grounding playground query console */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "مختبر الاستعلام القانوني والتحقق من المرجعية" : "Sovereign Grounded RAG Query Console"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {currentLanguage === "ar"
                          ? "أدخل سؤالاً عن قوانين الشركات أو المواصفات وسيسترجع النظام الوثيقة المعتمدة ويقوم بصياغة إجابة دقيقة لا تحتمل الهلوسة."
                          : "Input a policy or law query. System retrieves the vector chunk, validates references, and builds a strict grounded response."}
                      </p>
                    </div>

                    <form onSubmit={runRAGQuery} className="flex gap-2">
                      <input
                        type="text"
                        value={ragQuery}
                        onChange={(e) => setRagQuery(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "مثال: شروط تأسيس الشركات ذات المسؤولية المحدودة أو تعبئة الصمغ العربي..." : "e.g., rules for starting LLC companies in Sudan, or SSO standard of Gum Arabic..."}
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                      />
                      <button
                        type="submit"
                        disabled={ragSearching}
                        className="px-5 bg-indigo-700 hover:bg-indigo-800 disabled:bg-gray-200 text-white font-bold rounded-xl text-xs cursor-pointer transition-all flex items-center gap-1"
                      >
                        {ragSearching ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>RETRIEVING...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{currentLanguage === "ar" ? "استعلام موثوق" : "Grounded Query"}</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Result with explanation path */}
                    {ragResponse && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-4 border-t border-gray-100"
                      >
                        <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold text-emerald-800">
                            <span>🛡️ GROUNDED TRUSTED RESPONSE</span>
                            <span>CONFIDENCE: {ragResponse.confidence}%</span>
                          </div>
                          <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            {currentLanguage === "ar" ? ragResponse.answerAr : ragResponse.answerEn}
                          </p>
                        </div>

                        {/* Document Source link cards */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-gray-400 uppercase font-mono font-bold">{currentLanguage === "ar" ? "المراجع المستند إليها:" : "Retrieved Grounding Chunks:"}</span>
                          {ragResponse.sources.map((src: any, i: number) => (
                            <div key={i} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center text-xs">
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-800 text-[11px] block">{src.id}</span>
                                <span className="text-gray-400 block text-[10px]">{src.pages}</span>
                              </div>
                              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold font-mono">Verified Match</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-900 text-gray-300 font-mono text-[9px] p-2 rounded-lg border border-slate-800">
                          <span className="text-indigo-400 font-bold block uppercase mb-0.5">Explainable AI (XAI) Attribution:</span>
                          {ragResponse.explainabilityPath}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <p className="text-[10.5px] text-gray-400 text-center italic mt-4">
                    Grounding architecture strictly audited in compliance with UNESCO Ethic guidelines.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INTELLIGENT AUTOMATION & RPA */}
          {activeTab === "automation" && (
            <div className="space-y-6" id="tab-automation">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Automation flows */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "روبوتات الأتمتة الذكية والعمليات المترابطة (RPA)" : "Intelligent RPA Automated Workflows"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {currentLanguage === "ar" ? "متابعة وتشغيل مهام التزامن والمطابقة التلقائية للمعاملات" : "Monitor, trigger, and update background RPA daemons and sync flows"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {workflows.map(wf => {
                      const isRunning = wf.id === runningRPAId || wf.status === "running";
                      return (
                        <div key={wf.id} className="p-4 rounded-xl bg-slate-50 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Zap className={`w-4 h-4 ${isRunning ? "text-amber-500 animate-bounce" : "text-gray-400"}`} />
                              <span className="font-bold text-slate-900 text-xs">{currentLanguage === "ar" ? wf.nameAr : wf.nameEn}</span>
                            </div>
                            <div className="text-gray-500 font-medium flex gap-3 flex-wrap">
                              <span>{currentLanguage === "ar" ? `مرات التشغيل: ${wf.runsCount}` : `Total Runs: ${wf.runsCount}`}</span>
                              <span>{currentLanguage === "ar" ? `نسبة النجاح: ${wf.successRate}%` : `Success Rate: ${wf.successRate}%`}</span>
                              <span>{currentLanguage === "ar" ? `آخر معالجة: ${wf.lastRun}` : `Last Run: ${wf.lastRun}`}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => triggerRPAWorkflow(wf.id)}
                            disabled={!!runningRPAId}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{currentLanguage === "ar" ? "تشغيل الآن" : "Trigger RPA"}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: RPA run terminal logs */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 min-h-[350px] flex flex-col justify-between shadow-lg">
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-300 text-xs font-mono border-b border-slate-800 pb-2 uppercase tracking-wider">
                      RPA Runtime Logs Console
                    </h3>

                    <div className="space-y-2 font-mono text-[10px] text-gray-300 leading-relaxed overflow-y-auto max-h-[300px]">
                      {rpaLogs.length > 0 ? (
                        rpaLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-center py-12">
                          <History className="w-10 h-10 text-slate-800 mx-auto mb-2 animate-spin-slow" />
                          <span>Waiting to launch RPA daemon...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[9.5px] text-gray-400 font-mono italic">
                    All RPA runs are cryptographically signed and stored in immutable ledger logs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: OBSERVABILITY, SAFETY & ETHICS */}
          {activeTab === "observability" && (
            <div className="space-y-6" id="tab-observability">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Safety metrics & incident history */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "سجل الحوادث والرقابة الأخلاقية" : "AI Incidents & Safety Auditing logs"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {currentLanguage === "ar" ? "رصد المشكلات الفنية والهلوسة واتخاذ القرارات التصحيحية فوراً" : "Track anomalies, data drift, privacy checks, and register formal incidents"}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowIncidentForm(!showIncidentForm)}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{currentLanguage === "ar" ? "إبلاغ عن عطل ذكي" : "File AI Incident"}</span>
                    </button>
                  </div>

                  {/* Incident form */}
                  {showIncidentForm && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      onSubmit={submitIncident}
                      className="bg-rose-50/40 p-4 rounded-xl border border-rose-100 text-xs space-y-3"
                    >
                      <div className="font-bold text-rose-900">{currentLanguage === "ar" ? "تسجيل عطل ذكي جديد (مسؤولية الخوارزمية)" : "File Algorithmic / AI Incident Ticket"}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-gray-700">{currentLanguage === "ar" ? "عنوان الحادثة" : "Incident Title"}</label>
                          <input
                            type="text"
                            required
                            value={incidentTitle}
                            onChange={(e) => setIncidentTitle(e.target.value)}
                            placeholder="e.g., SudanLLM Drift in Omdurman coordinates"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-gray-700">{currentLanguage === "ar" ? "مستوى الخطورة" : "Severity Level"}</label>
                          <select
                            value={incidentSeverity}
                            onChange={(e) => setIncidentSeverity(e.target.value as any)}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none"
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">{currentLanguage === "ar" ? "الوصف الفني والخطوات العلاجية المطلوبة" : "Technical description & remediation"}</label>
                        <textarea
                          required
                          value={incidentDesc}
                          onChange={(e) => setIncidentDesc(e.target.value)}
                          rows={2}
                          placeholder="e.g., High temperature setting caused minor hallucinations in tariff categories. Reduced temperature to 0.1."
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg cursor-pointer text-xs"
                        >
                          {currentLanguage === "ar" ? "إرسال البلاغ" : "Submit Incident"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowIncidentForm(false)}
                          className="px-4 py-1.5 bg-gray-200 text-slate-700 font-bold rounded-lg cursor-pointer text-xs"
                        >
                          {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                      </div>
                    </motion.form>
                  )}

                  <div className="space-y-3">
                    {incidents.map(inc => (
                      <div key={inc.id} className="p-4 rounded-xl bg-slate-50 border border-gray-100 text-xs">
                        <div className="flex justify-between items-center border-b border-gray-200/60 pb-2 mb-2 font-mono">
                          <div className="flex items-center gap-2">
                            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold uppercase text-[9px]">{inc.severity} Severity</span>
                            <span className="font-bold text-slate-900">{inc.title}</span>
                          </div>
                          <span className="text-gray-400 text-[10px]">{inc.date}</span>
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed">{inc.description}</p>
                        <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-gray-400">
                          <span>ID: {inc.id}</span>
                          <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">{inc.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Algorithmic safety guardrails list */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <span>{currentLanguage === "ar" ? "مرشحات وموانع الأمان الفيدرالية" : "National AI Guardrails"}</span>
                  </h3>

                  <div className="space-y-4 text-xs font-medium text-slate-700">
                    <div className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>{currentLanguage === "ar" ? "قمع الأرقام الحساسة (PII): " : "PII Redaction: "}</strong>
                        {currentLanguage === "ar" ? "إخفاء تلقائي لأرقام الهواتف والبطاقات القومية" : "Auto-scrubbing of cellular IDs, names, and fiscal records."}
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>{currentLanguage === "ar" ? "حماية موجه الاستعلام: " : "Prompt Injection Shield: "}</strong>
                        {currentLanguage === "ar" ? "اكتشاف وتجميد أي محاولة لتغيير سياسة الخصوصية" : "Fending off structural system instructions overrides."}
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>{currentLanguage === "ar" ? "تدقيق الانحياز المستمر: " : "Bias Drift Protection: "}</strong>
                        {currentLanguage === "ar" ? "ضمان عدالة التوصيات الجغرافية عبر الولايات السودانية" : "Ensuring fair spatial distribution of infrastructure budgets."}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50/30 rounded-xl border border-indigo-100 space-y-1 text-xs">
                    <span className="font-bold text-indigo-800 uppercase block tracking-wider text-[10px]">Audit Certification</span>
                    <p className="text-gray-500 leading-relaxed">
                      All models are verified under ISO/IEC 42001 (Artificial Intelligence Management System) specifications by Sudan National Cyber Safety center.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
