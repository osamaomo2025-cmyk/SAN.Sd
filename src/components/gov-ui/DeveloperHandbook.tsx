/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Code, Folder, FolderTree, File, Terminal, Layers, Shield, 
  Settings, CheckCircle2, AlertCircle, RefreshCw, Cpu, 
  HelpCircle, ChevronRight, ChevronDown, Check, Play, BookOpen, 
  GitBranch, Server, Globe, Sparkles, Key, AlertTriangle, 
  Lock, Copy, ExternalLink, Download, FileText
} from "lucide-react";

interface DeveloperHandbookProps {
  currentLanguage: "ar" | "en";
  role?: string;
}

// 1. Folder Structure Types & Data
interface FolderNode {
  name: string;
  type: "folder" | "file";
  descAr: string;
  descEn: string;
  children?: FolderNode[];
}

const PROJECT_STRUCTURE_TREE: FolderNode[] = [
  {
    name: "/app",
    type: "folder",
    descAr: "التوجيه الأساسي وتهيئة المحرك ونقاط الدخول للمنصة.",
    descEn: "Root application entry point, core routing tree, and system level setups.",
    children: [
      { name: "layout.tsx", type: "file", descAr: "التخطيط الفيدرالي الشامل للهيكل الخارجي للمنصة.", descEn: "Sovereign global page wraps and shared state templates." },
      { name: "page.tsx", type: "file", descAr: "الصفحة الرئيسية لجمهور وزارة التجارة.", descEn: "Primary gateway viewport for landing and authentication." }
    ]
  },
  {
    name: "/components",
    type: "folder",
    descAr: "مكتبة المكونات التفاعلية الموحدة المستهلكة لرموز التصميم.",
    descEn: "Atomic UI design elements. Strictly consumes the Design Token system.",
    children: [
      { name: "atoms.tsx", type: "file", descAr: "المكونات الذرية البسيطة (أزرار، حقول نصية، شارات سيادية).", descEn: "Basic atomic controls (SovereignButton, SovereignBadge, etc)." },
      { name: "molecules.tsx", type: "file", descAr: "المكونات المتوسطة (نماذج الإدخال، شارات التبويب، النوافذ).", descEn: "Secondary interactive constructs (OTP validations, search bars)." },
      { name: "organisms.tsx", type: "file", descAr: "الكتل المعقدة المستقلة (الجداول التفاعلية، قارئ المستندات الشامل).", descEn: "High-density widgets (SovereignDataGrid, OCR file viewers)." }
    ]
  },
  {
    name: "/features",
    type: "folder",
    descAr: "تقسيم النطاقات والوحدات الوظيفية المستقلة (Domain-Driven Features).",
    descEn: "Domain feature blocks, separating logic by national commerce business domains.",
    children: [
      {
        name: "/commercial-registry",
        type: "folder",
        descAr: "وحدة السجل التجاري الموحد الفيدرالي للشركات.",
        descEn: "Sovereign corporate identities & central trade logs.",
        children: [
          { name: "RegistryWizard.tsx", type: "file", descAr: "معالج تسجيل الشركات متعدد المراحل المساعد ذكياً.", descEn: "Interactive wizard for legal company registration." },
          { name: "registry-types.ts", type: "file", descAr: "النماذج والمخططات والمحددات الخاصة بالسجلات التجارية.", descEn: "Commercial registry types and data models." }
        ]
      },
      {
        name: "/industrial-licensing",
        type: "folder",
        descAr: "إجراءات التراخيص والمصانع الفيدرالية.",
        descEn: "Industrial permits, plant inspections, and environmental compliance audits.",
        children: [
          { name: "LicenseRequestForm.tsx", type: "file", descAr: "استمارة طلب تراخيص المنشآت الصناعية الكبرى.", descEn: "Form submission pipeline for heavy industry clearances." }
        ]
      },
      {
        name: "/ai-assistant",
        type: "folder",
        descAr: "الذكاء الاصطناعي السيادي وشرح القوانين التجارية للمستثمرين.",
        descEn: "Generative AI commerce helpers, simplifying federal regulations for foreign investors.",
        children: [
          { name: "CommerceAgent.ts", type: "file", descAr: "محرك الربط مع الـ SDK لنموذج Gemini Server-Side.", descEn: "Server-side client handling secure Gemini models API." }
        ]
      }
    ]
  },
  {
    name: "/services",
    type: "folder",
    descAr: "واجهات برمجية مخصصة للربط مع السيرفر والتحقق السيادي.",
    descEn: "Network clients, Firestore bridges, and secure external platform proxies.",
    children: [
      { name: "api-client.ts", type: "file", descAr: "المحرك الموحد لطلبات الخادم وإدارة الرموز الأمنية.", descEn: "Unified Axios/fetch service configured with automatic CSRF tokens." },
      { name: "audit-logger.ts", type: "file", descAr: "تسجيل العمليات الإدارية الحساسة لتدقيق الهيئة الفيدرالية.", descEn: "Pristine client log dispatchers for transparency validation." }
    ]
  },
  {
    name: "/themes",
    type: "folder",
    descAr: "نظام المظهر المتعدد بما يطابق معايير الرموز (SGDS).",
    descEn: "Pre-validated design theme styles including high contrast and dark mode.",
    children: [
      { name: "tokens.ts", type: "file", descAr: "المعايير الرياضية لقيم الفراغات والخطوط والظلال.", descEn: "Sovereign design token variables mapping (8px padding grid)." }
    ]
  }
];

// 2. TypeScript Coding Guideline Examples
interface CodeExample {
  titleAr: string;
  titleEn: string;
  problemCode: string;
  solutionCode: string;
  ruleExplanationAr: string;
  ruleExplanationEn: string;
}

const TS_GUIDELINES: CodeExample[] = [
  {
    titleAr: "قاعدة منع استخدام النوع العشوائي 'any'",
    titleEn: "Enforced Zero 'any' Constraint",
    problemCode: `// ❌ CODE ERROR: Violates Strict Enterprise Standards
function processCommercialRegister(data: any): any {
  console.log("Saving entity:", data.companyName);
  return { status: "OK", id: data.id };
}`,
    solutionCode: `// ✅ ENTERPRISE STANDARD: Strictly Typed Domain Models
export interface CompanyRegistryPayload {
  companyId: string;
  legalTradeName: string;
  capitalAmountInSDG: number;
  incorporationDate: string;
}

export interface RegistryResponse {
  operationStatus: "approved" | "pending_audit" | "rejected";
  sovereignReceiptId: string;
}

export function processCommercialRegister(
  data: CompanyRegistryPayload
): RegistryResponse {
  console.log("Saving entity:", data.legalTradeName);
  return { 
    operationStatus: "pending_audit", 
    sovereignReceiptId: \`SD-MCI-CR-\${data.companyId}\` 
  };
}`,
    ruleExplanationAr: "يحظر استخدام 'any' نهائياً. يجب كتابة واجهات (Interfaces) صريحة لكل معاملة لضمان أمان البيانات ومطابقة شروط البناء البرمجي.",
    ruleExplanationEn: "Using 'any' is strictly forbidden. Developers must declare absolute interfaces for all payloads to guarantee safety and compile-time verification."
  },
  {
    titleAr: "كتابة المكونات الجينيريك الآمنة من حيث النوع (Generic Components)",
    titleEn: "Type-Safe Generic Tables & Data Grids",
    problemCode: `// ❌ CODE ERROR: Custom table without structured generics
interface LegacyTableProps {
  rows: any[];
  onRowClick: (row: any) => void;
}`,
    solutionCode: `// ✅ ENTERPRISE STANDARD: Generic Type Constraints
interface SovereignTableProps<T extends { id: string | number }> {
  items: T[];
  columns: {
    header: string;
    accessor: (item: T) => React.ReactNode;
  }[];
  onSelectionChange: (selectedItem: T) => void;
}

export function SovereignTable<T extends { id: string | number }>({
  items,
  columns,
  onSelectionChange
}: SovereignTableProps<T>) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr>{columns.map((col, idx) => <th key={idx}>{col.header}</th>)}</tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id} onClick={() => onSelectionChange(item)}>
            {columns.map((col, idx) => <td key={idx}>{col.accessor(item)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
    ruleExplanationAr: "يتم هيكلة الجداول وقوائم البيانات المعقدة باستخدام معاملات الأنواع العمومية (T extends id) لمنع تداخل حقول الهويات بمختلف البوابات.",
    ruleExplanationEn: "Dynamic grids and data views must be typed as generic structures to prevent run-time indexing exceptions."
  }
];

export const DeveloperHandbook: React.FC<DeveloperHandbookProps> = ({
  currentLanguage,
  role = "Enterprise Chief Architect"
}) => {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"structure" | "ts-standards" | "state-routing" | "security-auth" | "cicd-testing">("structure");
  
  // Interactive Folder tree state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "/app": true,
    "/components": true,
    "/features": true
  });
  const [selectedDocNode, setSelectedDocNode] = useState<FolderNode | null>(PROJECT_STRUCTURE_TREE[0]);

  // Code Copied indicator
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // CI/CD Simulator state
  const [cicdStatus, setCicdStatus] = useState<"idle" | "linting" | "testing" | "security-scan" | "building" | "success" | "failed">("idle");
  const [cicdLogs, setCicdLogs] = useState<string[]>([]);
  const [activeStepProgress, setActiveStepProgress] = useState(0);

  // Toggle expanded folder
  const toggleNode = (name: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Helper to copy text/code
  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // CI/CD Simulator function
  const runSimulatedPipeline = () => {
    setCicdStatus("linting");
    setActiveStepProgress(0);
    setCicdLogs([]);
    
    const logs = [
      { status: "linting", msg: currentLanguage === "ar" ? "● جاري تشغيل لافتاً الأكواد (npm run lint)... لا يوجد أخطاء هيكلية." : "● Executing ESLint (npm run lint)... 0 syntax issues detected." },
      { status: "testing", msg: currentLanguage === "ar" ? "● جاري تشغيل اختبارات المكونات (tsc --noEmit)... تم مطابقة 42 فحص وحدات." : "● Testing unit rules (tsc --noEmit)... 42 specs passed successfully." },
      { status: "security-scan", msg: currentLanguage === "ar" ? "● فحص الثغرات (Firebase Audit)... التحقق من قواعد الحماية والأدوار: ممتاز." : "● Auditing database schemas & rules... App Check and RBAC secure." },
      { status: "building", msg: currentLanguage === "ar" ? "● جاري ضغط الملفات وبناء السيرفر (Vite Build && esbuild server)... تم الإنتاج." : "● Compiling distribution build to /dist/server.cjs... Output size 1.2MB." },
      { status: "success", msg: currentLanguage === "ar" ? "✔ تم النشر بنجاح ببيئة وزارة التجارة الرقمية! جاهز للعرض الفوري." : "✔ Deployment completed successfully to Federal Cloud Run container!" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setCicdStatus(logs[currentStep].status as any);
        setCicdLogs(prev => [...prev, logs[currentStep].msg]);
        setActiveStepProgress((currentStep + 1) * 20);
        currentStep++;
      } else {
        setCicdStatus("success");
        clearInterval(interval);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP BANNER AND HERO */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#007A33]/15 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#007A33] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                MCI Standard Framework v1.0
              </span>
              <span className="text-sudan-gold text-xs font-mono font-bold flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-sudan-gold" />
                Sovereign Architecture Guard
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight">
              {currentLanguage === "ar" ? "دليل التطوير وهندسة البرمجيات القياسي" : "Front-End Engineering Standard & Architecture Manual"}
            </h2>
            <p className="text-xs text-gray-400 max-w-4xl">
              {currentLanguage === "ar"
                ? "الدليل الهندسي الشامل لترتيب وهيكلة البرمجيات وتطبيق معايير وزارة التجارة والصناعة بجمهورية السودان. التزام صارم بقواعد TypeScript الصارمة والدمج مع واجهات Google Firebase وقواعد الأمان السيادية."
                : "The official Front-End architectural codex for the Ministry. Mandating highly modular structures, strict TypeScript guidelines, custom security layers, and seamless CI/CD delivery rules."}
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 shrink-0 text-center md:text-right">
            <p className="text-[10px] text-gray-400 uppercase font-black">{currentLanguage === "ar" ? "المهندس المسؤول" : "Responsible Officer"}</p>
            <p className="text-xs font-extrabold text-sudan-gold">{role}</p>
          </div>
        </div>
      </div>

      {/* 2. TAB CONTROL DESK */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-gray-200 overflow-x-auto">
        {[
          { id: "structure", labelAr: "الهيكل ومسارات المجلدات", labelEn: "Folder Architecture", icon: FolderTree },
          { id: "ts-standards", labelAr: "مواصفات لغة TypeScript", labelEn: "TypeScript Standards", icon: Code },
          { id: "state-routing", labelAr: "إدارة الحالات والتوجيه", labelEn: "State & Routing", icon: Layers },
          { id: "security-auth", labelAr: "مواصفات الأمان والتحقق", labelEn: "Security & Auth", icon: Lock },
          { id: "cicd-testing", labelAr: "التحقق وخط الأتمتة CI/CD", labelEn: "CI/CD & Testing", icon: GitBranch }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "text-gray-500 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* 3. DYNAMIC CONTENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ==================================== TAB A: FOLDER STRUCTURE TREE BROWSER ==================================== */}
        {activeTab === "structure" && (
          <>
            {/* Folder Tree Left Side (5 Cols) */}
            <div className="lg:col-span-5 p-5 bg-white border border-gray-200 rounded-3xl space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-[#007A33] font-bold block uppercase tracking-wider">Interactive File Explorer</span>
                <h3 className="text-sm font-black flex items-center gap-1.5 text-slate-900">
                  <Terminal className="h-4 w-4 text-sudan-gold" />
                  {currentLanguage === "ar" ? "هيكل المجلدات التفاعلي" : "Standard Project Directory Tree"}
                </h3>
              </div>

              {/* Recursive directory tree visualizer */}
              <div className="border border-gray-100 rounded-2xl p-3 bg-slate-50 font-mono text-[11px] text-slate-800 space-y-2 max-h-96 overflow-y-auto">
                {PROJECT_STRUCTURE_TREE.map((node, idx) => {
                  const isExpanded = expandedNodes[node.name];
                  return (
                    <div key={idx} className="space-y-1">
                      <button
                        onClick={() => {
                          toggleNode(node.name);
                          setSelectedDocNode(node);
                        }}
                        className="w-full text-left ltr:text-right flex items-center gap-2 py-1 px-1.5 hover:bg-slate-150 rounded-md cursor-pointer transition-all"
                      >
                        <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                        <span className="font-extrabold">{node.name}</span>
                        {node.children && (
                          isExpanded ? <ChevronDown className="h-3.5 w-3.5 ml-auto" /> : <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                        )}
                      </button>

                      {node.children && isExpanded && (
                        <div className="pl-6 ltr:pr-6 border-l ltr:border-r border-gray-200/65 space-y-1 mt-1">
                          {node.children.map((child, cIdx) => (
                            <div key={cIdx} className="space-y-1">
                              {child.type === "folder" ? (
                                <>
                                  <button
                                    onClick={() => {
                                      toggleNode(child.name);
                                      setSelectedDocNode(child);
                                    }}
                                    className="w-full flex items-center gap-2 py-0.5 px-1.5 hover:bg-slate-150 rounded-md cursor-pointer text-slate-700"
                                  >
                                    <Folder className="h-3.5 w-3.5 text-amber-500" />
                                    <span className="font-extrabold text-[10px]">{child.name}</span>
                                    {child.children && (
                                      expandedNodes[child.name] ? <ChevronDown className="h-3 w-3 ml-auto" /> : <ChevronRight className="h-3 w-3 ml-auto" />
                                    )}
                                  </button>
                                  {child.children && expandedNodes[child.name] && (
                                    <div className="pl-4 ltr:pr-4 border-l border-gray-150 space-y-1">
                                      {child.children.map((subChild, scIdx) => (
                                        <button
                                          key={scIdx}
                                          onClick={() => setSelectedDocNode(subChild)}
                                          className="w-full text-left flex items-center gap-1.5 py-0.5 px-1 text-slate-600 hover:text-slate-900"
                                        >
                                          <File className="h-3 w-3 text-gray-400" />
                                          <span className="text-[10px]">{subChild.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <button
                                  onClick={() => setSelectedDocNode(child)}
                                  className="w-full text-left flex items-center gap-1.5 py-0.5 px-1.5 text-slate-600 hover:text-slate-900"
                                >
                                  <File className="h-3.5 w-3.5 text-gray-400" />
                                  <span className="text-[10px]">{child.name}</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Folder Tree Right Details (7 Cols) */}
            <div className="lg:col-span-7 p-6 bg-white border border-gray-200 rounded-3xl space-y-5">
              {selectedDocNode ? (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-[9px] bg-slate-900 text-sudan-gold px-2 py-0.5 rounded font-black uppercase font-mono">
                      {selectedDocNode.type === "folder" ? "DIRECTORY EXPLANATION" : "FILE PROTOCOL"}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-2">{selectedDocNode.name}</h3>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-800">{currentLanguage === "ar" ? "الوصف الوظيفي والمسؤولية:" : "Responsibility & Standard Scope:"}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {currentLanguage === "ar" ? selectedDocNode.descAr : selectedDocNode.descEn}
                    </p>
                  </div>

                  {/* Standard guidelines for folder use */}
                  <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-sudan-green" />
                      {currentLanguage === "ar" ? "قوانين البناء المعتمدة لهذا النطاق:" : "Approved Construction Rules for this Path:"}
                    </h4>
                    <ul className="space-y-2 text-[11px] text-gray-500 list-disc pl-4 ltr:pr-4">
                      <li>
                        {currentLanguage === "ar"
                          ? "يحظر نهائياً تكرار المكونات أو إنشاء ملفات تنسيق عشوائية خارج هذا المسار."
                          : "Do not invent ad-hoc styles. All elements must consume unified typography and design-tokens."}
                      </li>
                      <li>
                        {currentLanguage === "ar"
                          ? "يجب ربط الكتل الوظيفية بالاستيراد المطلق باستخدام المعرفات المسجلة بملف config."
                          : "Maintain modular file sizes. Break large functions into clean custom hooks or sub-renderers."}
                      </li>
                      <li>
                        {currentLanguage === "ar"
                          ? "كل مسار أو عنصر تفاعلي بهذا المجلد يجب تزويده بشهادة فحص الوصول ومطابقة الـ ARIA."
                          : "Every entry within this workspace must be covered by structured TypeScript interface models."}
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3 text-gray-400">
                  <HelpCircle className="h-10 w-10 mx-auto" />
                  <p className="text-xs">Select any directory on the tree to browse corporate structural requirements.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ==================================== TAB B: TYPESCRIPT CODING GUIDELINES ==================================== */}
        {activeTab === "ts-standards" && (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-3xl space-y-1">
              <span className="text-[10px] text-[#007A33] font-bold block uppercase tracking-wider">Rigorous Typing Directives</span>
              <h3 className="text-sm font-black flex items-center gap-1.5 text-slate-900">
                <Code className="h-4 w-4 text-sudan-gold" />
                {currentLanguage === "ar" ? "قوانين ومواصفات لغة TypeScript الصارمة" : "Strict Type Enforcement Policies"}
              </h3>
              <p className="text-xs text-gray-400">
                {currentLanguage === "ar"
                  ? "توضيح قواعد الأمان وكتابة المعاملات الرياضية والتحقق البرمجي لمنع الأخطاء في الخادم الرئيسي بوزارة التجارة."
                  : "How our platform maintains compilation stability across all federal transactions."}
              </p>
            </div>

            {/* Loop through examples */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TS_GUIDELINES.map((example, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">0{idx+1}</span>
                      {currentLanguage === "ar" ? example.titleAr : example.titleEn}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {currentLanguage === "ar" ? example.ruleExplanationAr : example.ruleExplanationEn}
                    </p>
                  </div>

                  {/* Code displays */}
                  <div className="space-y-3 font-mono text-[10px] leading-normal">
                    {/* Problem */}
                    <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-xl space-y-1">
                      <div className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-black max-w-fit uppercase">
                        INCORRECT / FORBIDDEN
                      </div>
                      <pre className="overflow-x-auto text-rose-800">{example.problemCode}</pre>
                    </div>

                    {/* Solution */}
                    <div className="bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl space-y-1.5 relative">
                      <div className="text-[8px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black max-w-fit uppercase">
                        APPROVED STANDARD
                      </div>
                      <pre className="overflow-x-auto text-slate-800 font-extrabold">{example.solutionCode}</pre>
                      
                      <button
                        onClick={() => handleCopyCode(example.solutionCode, `ts-sol-${idx}`)}
                        className="absolute top-2 right-2 p-1.5 bg-white border border-gray-150 rounded-lg hover:bg-slate-100 cursor-pointer"
                        title="Copy approved code block"
                      >
                        {copiedCode === `ts-sol-${idx}` ? <Check className="h-3 w-3 text-sudan-green" /> : <Copy className="h-3 w-3 text-slate-500" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================== TAB C: STATE STRATEGY & ROUTING ==================================== */}
        {activeTab === "state-routing" && (
          <>
            {/* State management guidelines (6 Cols) */}
            <div className="lg:col-span-6 p-6 bg-white border border-gray-200 rounded-3xl space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] text-[#007A33] font-bold block uppercase tracking-wider">Telemetry & Reactive Architecture</span>
                <h3 className="text-sm font-black flex items-center gap-1.5 text-slate-900">
                  <Layers className="h-4 w-4 text-sudan-gold" />
                  {currentLanguage === "ar" ? "1. هندسة تقسيم الحالات الرقمية (State Strategy)" : "1. Client State Management Architecture"}
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {currentLanguage === "ar"
                    ? "لتجنب استهلاك موارد الأجهزة الضعيفة وشبكات الإنترنت القروية بالسودان، نتبع مبدأ تقسيم الحالة الصارم لمنع تكرار التحميل العشوائي للمكونات."
                    : "To optimize rendering for lower-end consumer hardware and unstable rural connections, we enforce strict compartmentalization of React rendering nodes."}
                </p>

                {/* State Layer Bento Cards */}
                <div className="space-y-3 text-xs">
                  {/* Layer 1: Transient Local State */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-150 flex gap-3">
                    <span className="h-6 w-6 shrink-0 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">A</span>
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? "الحالة المحلية المؤقتة (UI State)" : "Transient Local UI State"}</p>
                      <p className="text-[10px] text-gray-400">Manage locally using standard React state hooks. Strictly confined to accordion collapses, tabs selection, and active input overlays.</p>
                    </div>
                  </div>

                  {/* Layer 2: Persistent Server State */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-150 flex gap-3">
                    <span className="h-6 w-6 shrink-0 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">B</span>
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? "الحالة المركزية المزامنة (Server State)" : "Persistent Centralized State"}</p>
                      <p className="text-[10px] text-gray-400">Sourced via secure backend bridges and Firestore real-time watchers. Employs aggressive client caching to avoid expensive DB roundtrips.</p>
                    </div>
                  </div>

                  {/* Layer 3: Offline queue State */}
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex gap-3">
                    <span className="h-6 w-6 shrink-0 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">C</span>
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-amber-900">{currentLanguage === "ar" ? "المسودات المخزنة محلياً (Offline Queue)" : "Offline Resilient Dispatcher"}</p>
                      <p className="text-[10px] text-amber-700">Intercepts transactions when networks degrade. Holds records inside local storage indices, auto-syncing when signal locks again.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Routing structures (6 Cols) */}
            <div className="lg:col-span-6 p-6 bg-white border border-gray-200 rounded-3xl space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] text-[#007A33] font-bold block uppercase tracking-wider">Access Guard & Path Maps</span>
                <h3 className="text-sm font-black flex items-center gap-1.5 text-slate-900">
                  <Globe className="h-4 w-4 text-sudan-gold" />
                  {currentLanguage === "ar" ? "2. معايير التوجيه وبوابات الوصول (Routing & Guards)" : "2. Unified Route Map & Safety Enforcements"}
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {currentLanguage === "ar"
                    ? "تنقسم بوابات المنصة إلى ثلاثة مستويات حماية رئيسية يمنع تخطيها دون مطابقة التوقيع والتحقق الرقمي الفيدرالي."
                    : "The portal directory hierarchy routes traffic into three strictly partitioned environments, guarded by sovereign role checks."}
                </p>

                {/* Interactive Routing Matrix */}
                <div className="space-y-3 font-mono text-[10px]">
                  {/* Public portal */}
                  <div className="border border-emerald-100 bg-emerald-50/15 p-3 rounded-xl flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className="font-black text-slate-800">/portal/home</p>
                      <p className="text-[9px] text-gray-400">Public trade catalogs, legal guides, standard fees</p>
                    </div>
                    <span className="bg-[#007A33] text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">PUBLIC</span>
                  </div>

                  {/* Investor workspace */}
                  <div className="border border-amber-100 bg-amber-50/15 p-3 rounded-xl flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className="font-black text-slate-800">/investor/dashboard</p>
                      <p className="text-[9px] text-gray-400">Active permits, tax certificates, corporate drafts</p>
                    </div>
                    <span className="bg-amber-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">INVESTOR ONLY</span>
                  </div>

                  {/* Executive Ministry admin */}
                  <div className="border border-slate-200 bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className="font-black text-slate-800">/executive/dashboard</p>
                      <p className="text-[9px] text-gray-400">Central revenue monitors, commercial fraud alerts</p>
                    </div>
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">MINISTRY STAFF</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================================== TAB D: SECURITY & FIREBASE ==================================== */}
        {activeTab === "security-auth" && (
          <>
            {/* Security protocol rules (7 Cols) */}
            <div className="lg:col-span-7 p-6 bg-white border border-gray-200 rounded-3xl space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] text-red-600 font-bold block uppercase tracking-wider">Sovereign Encryption & Permissions</span>
                <h3 className="text-sm font-black flex items-center gap-1.5 text-slate-900">
                  <Shield className="h-4 w-4 text-sudan-gold" />
                  {currentLanguage === "ar" ? "1. معايير حماية البيانات السيادية والأدوار (RBAC)" : "1. Sovereign Data Protection & Access Rules"}
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {currentLanguage === "ar"
                    ? "تطبيق قواعد حماية صارمة على مستوى السيرفر وقاعدة البيانات الموزعة. يمنع منعا باتاً تعديل السجلات التجارية أو التراخيص دون توقيع سيادي مشفر ذكياً."
                    : "Enforcing absolute server-level authorization rules on Firestore databases. Corporate records can only be updated with valid sovereign digital validation certificates."}
                </p>

                {/* Firestore security rules schematic */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                    <span>firestore.rules (Enterprise Spec)</span>
                    <button 
                      onClick={() => handleCopyCode(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper: checks if requester holds official staff authority
    function isMinistryStaff() {
      return request.auth != null && request.auth.token.role == 'ministry_employee';
    }
    
    match /companies/{companyId} {
      allow read: if request.auth != null;
      allow write: if isMinistryStaff() || (request.auth != null && request.auth.uid == resource.data.ownerUid);
    }
  }
}`, "sec-rules")}
                      className="text-gray-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy Schema</span>
                    </button>
                  </div>

                  <div className="bg-slate-950 text-gray-300 font-mono text-[10px] p-4 rounded-xl overflow-x-auto leading-relaxed shadow-inner">
                    <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isMinistryStaff() {
      return request.auth != null && request.auth.token.role == 'ministry_employee';
    }
    
    match /companies/{companyId} {
      allow read: if request.auth != null;
      allow write: if isMinistryStaff() || 
        (request.auth != null && request.auth.uid == resource.data.ownerUid);
    }
  }
}`}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Input sanitizers (5 Cols) */}
            <div className="lg:col-span-5 p-6 bg-white border border-gray-200 rounded-3xl space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Sanitization Guard</span>
                <h3 className="text-sm font-black flex items-center gap-1.5 text-slate-900">
                  <Lock className="h-4 w-4 text-sudan-green" />
                  {currentLanguage === "ar" ? "2. فحص المدخلات ومنع ثغرات الـ XSS" : "2. Input Sanitization Helpers"}
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {currentLanguage === "ar"
                    ? "يتعين على المطورين تمرير جميع البيانات النصية المدخلة بقوائم استمارات السجلات عبر فلاتر التنقية لمنع ثغرات إدخال الرموز الخبيثة."
                    : "All text fields in license submissions must pass through the enterprise sanitizer filter before persistent database storage."}
                </p>

                {/* Helper JS Block */}
                <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl font-mono text-[10px] space-y-2">
                  <p className="font-extrabold text-slate-800">// Enterprise Sanitizer Tool</p>
                  <pre className="text-slate-600 leading-normal overflow-x-auto">
{`export function sanitizeSovereignInput(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}`}
                  </pre>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================================== TAB E: CI/CD & TESTING PLATFORM ==================================== */}
        {activeTab === "cicd-testing" && (
          <>
            {/* QA Testing checklist (6 Cols) */}
            <div className="lg:col-span-6 p-6 bg-white border border-gray-200 rounded-3xl space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] text-[#007A33] font-bold block uppercase tracking-wider">QA Verification Standards</span>
                <h3 className="text-sm font-black flex items-center gap-1.5 text-slate-900">
                  <CheckCircle2 className="h-4 w-4 text-sudan-green" />
                  {currentLanguage === "ar" ? "1. استراتيجية وجدول الاختبارات الشاملة" : "1. Enterprise QA Test Matrix"}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {/* Check list item */}
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-150 space-y-1">
                  <div className="flex items-center justify-between font-extrabold text-slate-800">
                    <span>Unit Testing</span>
                    <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 rounded">Vitest / Jest</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Validate atomic inputs, document verification hashes, and tax calculation formulas. Minimum required coverage: 85%.</p>
                </div>

                {/* E2E Testing */}
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-150 space-y-1">
                  <div className="flex items-center justify-between font-extrabold text-slate-800">
                    <span>E2E & Flow Audits</span>
                    <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 rounded">Playwright</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Validate full wizard tracks: Commercial registration form inputs, files upload, signature, and payment execution.</p>
                </div>

                {/* Accessibility Testing */}
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-150 space-y-1">
                  <div className="flex items-center justify-between font-extrabold text-slate-800">
                    <span>Accessibility Audits</span>
                    <span className="text-[9px] bg-[#007A33] text-white px-1.5 rounded">Axe-Core / WCAG 2.2</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Mandate checks for contrast, logical focus order, keyboard traps, and dynamic voice logs validation on every page commit.</p>
                </div>
              </div>
            </div>

            {/* Interactive CI/CD Pipeline Simulator (6 Cols) */}
            <div className="lg:col-span-6 p-6 bg-white border border-gray-200 rounded-3xl space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Automated Devops Runner</span>
                <h3 className="text-sm font-black flex items-center gap-1.5 text-slate-900">
                  <GitBranch className="h-4 w-4 text-sudan-gold" />
                  {currentLanguage === "ar" ? "2. محاكي الأتمتة والنشر السيادي CI/CD" : "2. CI/CD Integration & Build Pipeline"}
                </h3>
                <p className="text-xs text-gray-400">
                  {currentLanguage === "ar"
                    ? "اختبر تشغيل خط إنتاج الأكواد والتأكد من توافقه الكامل مع خوادم وزارة التجارة الرقمية."
                    : "Simulate real-time checking, lint passes, security validation, and deployment."}
                </p>
              </div>

              {/* Build button */}
              <button
                onClick={runSimulatedPipeline}
                disabled={cicdStatus !== "idle" && cicdStatus !== "success" && cicdStatus !== "failed"}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Play className="h-4 w-4 text-sudan-gold" />
                {cicdStatus === "idle" || cicdStatus === "success" ? (currentLanguage === "ar" ? "بدء تشغيل خط الأتمتة الفيدرالي" : "Execute Deployment Pipeline") : (currentLanguage === "ar" ? "جاري التدقيق وبناء السيرفر..." : "Pipeline Running...")}
              </button>

              {/* Console log display */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase text-gray-400">
                  <span>Pipeline Activity Stream</span>
                  {cicdStatus !== "idle" && <span>{activeStepProgress}% Complete</span>}
                </div>

                {/* Progress bar */}
                {cicdStatus !== "idle" && (
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-gray-150">
                    <motion.div 
                      className="h-full bg-sudan-green" 
                      initial={{ width: "0%" }}
                      animate={{ width: `${activeStepProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 h-40 overflow-y-auto font-mono text-[10px] text-gray-300 space-y-1.5 shadow-inner">
                  {cicdLogs.length === 0 ? (
                    <p className="text-gray-600">[Devops Terminal Idle] Press 'Execute' above to watch step-by-step verification audits.</p>
                  ) : (
                    cicdLogs.map((log, idx) => (
                      <motion.p 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={log.includes("✔") ? "text-sudan-green font-extrabold" : "text-gray-300"}
                      >
                        {log}
                      </motion.p>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}

      </div>

      {/* 4. DESIGN SYSTEM COMPLIANCE MAPPER & GOVERNANCE */}
      <div className="p-6 bg-slate-50 border border-gray-200 rounded-3xl space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200/65 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-sudan-gold font-black uppercase tracking-wider block">Official Ministry Governance Manual</span>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <BookOpen className="h-5 w-5 text-sudan-green" />
              {currentLanguage === "ar" ? "سياسة حوكمة الأكواد وتوجيهات التطوير الذكية للذكاء الاصطناعي" : "AI Coding Compliance & Architectural Governance"}
            </h3>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          {currentLanguage === "ar"
            ? "يتم مراجعة كافة المخرجات والأكواد الناتجة عن مساعدي البرمجة والذكاء الاصطناعي قبل الترحيل للتأكد من مطابقتها بنسبة 100% لمعايير الرموز المعتمدة بوزارة التجارة. لا يسمح للمساعدين بإنشاء ميكانيكيات أو أساليب بناء عشوائية خارجة عن هذا الدليل."
            : "When Generative AI models formulate workspace features, they are bound to strict conformity with this SDK architectural manual. Unsolicited libraries, duplicate controls, or styling shortcuts violate sovereign coding acts and will fail linter compilation."}
        </p>

        {/* Token alignment matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Item 1 */}
          <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-800">Sovereign Color Grid</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/10 text-emerald-700 font-extrabold">Active</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Every class name must refer directly to Tailwind tokens. Custom hex codes in markup are forbidden.
            </p>
          </div>

          {/* Item 2 */}
          <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-800">Dynamic i18n Swapping</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/10 text-emerald-700 font-extrabold">Active</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Direction tags (RTL/LTR) must map padding, text alignments, and coordinate triggers gracefully.
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-800">Keyboard First Principle</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/10 text-emerald-700 font-extrabold">Active</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              No UI dialog or button is deployable without keyboard focus wrappers, esc-handlers, and ARIA descriptors.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
