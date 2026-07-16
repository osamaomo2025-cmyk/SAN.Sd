/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, Award, BookOpen, Users, Lightbulb, ShieldCheck, 
  ArrowRightLeft, Landmark, MessageSquare, MapPin, BrainCircuit, UserCheck 
} from "lucide-react";

import { 
  InnovationUserRole, InnovatorRegistryRecord, ResearchProject, IpRecord, 
  TechTransferAsset, UniversityIndustryPartnership, FundApplication, 
  InnovationChallenge, ExpertProfile, KnowledgeDoc, WorkspaceProject 
} from "./InnovationTypes";

import { 
  initialInnovatorRecords, initialResearchProjects, initialIpRecords, 
  initialTechTransferAssets, initialPartnerships, initialFundApplications, 
  initialChallenges, initialExperts, initialKnowledgeDocs, initialWorkspaceProjects 
} from "./InnovationMockData";

// Import subcomponents
import InnovationRegistry from "./InnovationRegistry";
import ResearchManagement from "./ResearchManagement";
import IntellectualProperty from "./IntellectualProperty";
import TechTransfer from "./TechTransfer";
import InnovationFund from "./InnovationFund";
import KnowledgeEconomy from "./KnowledgeEconomy";
import CollaborationWorkspace from "./CollaborationWorkspace";
import InnovationAnalyticsTab from "./InnovationAnalyticsTab";
import InnovationAdvisor from "./InnovationAdvisor";

interface NationalInnovationPlatformProps {
  currentLanguage: "ar" | "en";
}

export default function NationalInnovationPlatform({ currentLanguage }: NationalInnovationPlatformProps) {
  // 1. Role-Based Access Control State
  const [userRole, setUserRole] = useState<InnovationUserRole>(InnovationUserRole.INNOVATOR);

  // 2. Active Tab State
  const [activeTab, setActiveTab] = useState<string>("registry");

  // 3. Central Reactive Datasets with LocalStorage Persistence
  const [innovators, setInnovators] = useState<InnovatorRegistryRecord[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [ipRecords, setIpRecords] = useState<IpRecord[]>([]);
  const [assets, setAssets] = useState<TechTransferAsset[]>([]);
  const [partnerships, setPartnerships] = useState<UniversityIndustryPartnership[]>([]);
  const [applications, setApplications] = useState<FundApplication[]>([]);
  const [challenges, setChallenges] = useState<InnovationChallenge[]>([]);
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceProject[]>([]);

  // Load from LocalStorage or Fallback to preseeded datasets
  useEffect(() => {
    const storedInnovators = localStorage.getItem("sdmci_innovators");
    const storedProjects = localStorage.getItem("sdmci_projects");
    const storedIp = localStorage.getItem("sdmci_ip");
    const storedAssets = localStorage.getItem("sdmci_assets");
    const storedPartnerships = localStorage.getItem("sdmci_partnerships");
    const storedFunds = localStorage.getItem("sdmci_funds");
    const storedChallenges = localStorage.getItem("sdmci_challenges");
    const storedExperts = localStorage.getItem("sdmci_experts");
    const storedDocs = localStorage.getItem("sdmci_docs");
    const storedWorkspaces = localStorage.getItem("sdmci_workspaces");

    setInnovators(storedInnovators ? JSON.parse(storedInnovators) : initialInnovatorRecords);
    setProjects(storedProjects ? JSON.parse(storedProjects) : initialResearchProjects);
    setIpRecords(storedIp ? JSON.parse(storedIp) : initialIpRecords);
    setAssets(storedAssets ? JSON.parse(storedAssets) : initialTechTransferAssets);
    setPartnerships(storedPartnerships ? JSON.parse(storedPartnerships) : initialPartnerships);
    setApplications(storedFunds ? JSON.parse(storedFunds) : initialFundApplications);
    setChallenges(storedChallenges ? JSON.parse(storedChallenges) : initialChallenges);
    setExperts(storedExperts ? JSON.parse(storedExperts) : initialExperts);
    setDocs(storedDocs ? JSON.parse(storedDocs) : initialKnowledgeDocs);
    setWorkspaces(storedWorkspaces ? JSON.parse(storedWorkspaces) : initialWorkspaceProjects);
  }, []);

  // Save changes to LocalStorage helper
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // --- STATE MUTATORS / CALLBACKS ---

  // Innovators Registry Callbacks
  const handleAddInnovator = (newInnovator: InnovatorRegistryRecord) => {
    const updated = [newInnovator, ...innovators];
    setInnovators(updated);
    saveState("sdmci_innovators", updated);
  };

  const handleUpdateInnovatorStatus = (id: string, status: "verified" | "rejected", log: any) => {
    const updated = innovators.map(i => {
      if (i.id === id) {
        return { ...i, status, auditLogs: [log, ...i.auditLogs] };
      }
      return i;
    });
    setInnovators(updated);
    saveState("sdmci_innovators", updated);
  };

  // Research Projects Callbacks
  const handleAddProject = (newProj: ResearchProject) => {
    const updated = [newProj, ...projects];
    setProjects(updated);
    saveState("sdmci_projects", updated);
  };

  const handleUpdateProjectProgress = (id: string, progressPercentage: number, outcomesAr?: string, outcomesEn?: string) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        const updatedProj = { ...p, progressPercentage };
        if (outcomesAr) updatedProj.outcomesAr = outcomesAr;
        if (outcomesEn) updatedProj.outcomesEn = outcomesEn;
        if (progressPercentage === 100) {
          updatedProj.status = "completed" as const;
        }
        return updatedProj;
      }
      return p;
    });
    setProjects(updated);
    saveState("sdmci_projects", updated);
  };

  // Intellectual Property Callbacks
  const handleAddIpRecord = (newIp: IpRecord) => {
    const updated = [newIp, ...ipRecords];
    setIpRecords(updated);
    saveState("sdmci_ip", updated);
  };

  const handleUpdateIpStatus = (id: string, nextStatus: any, log: any) => {
    const updated = ipRecords.map(ip => {
      if (ip.id === id) {
        return {
          ...ip,
          status: nextStatus,
          auditLogs: [log, ...ip.auditLogs]
        };
      }
      return ip;
    });
    setIpRecords(updated);
    saveState("sdmci_ip", updated);
  };

  const handleAddOpposition = (id: string, opposition: any) => {
    const updated = ipRecords.map(ip => {
      if (ip.id === id) {
        const oppositions = ip.oppositionRecords ? [...ip.oppositionRecords, opposition] : [opposition];
        // Log auditing opposition filing
        const log = {
          status: ip.status,
          actionAr: `تم تسجيل اعتراض قانوني من: ${opposition.opposerName}`,
          actionEn: `Legal objection filed by: ${opposition.opposerName}`,
          timestamp: new Date().toISOString(),
          actor: "نظام الاعتراض الفيدرالي",
          notes: opposition.reasonAr
        };
        return {
          ...ip,
          oppositionRecords: oppositions,
          auditLogs: [log, ...ip.auditLogs]
        };
      }
      return ip;
    });
    setIpRecords(updated);
    saveState("sdmci_ip", updated);
  };

  const handleAddLicensing = (id: string, license: any) => {
    const updated = ipRecords.map(ip => {
      if (ip.id === id) {
        const agreements = ip.licensingAgreements ? [...ip.licensingAgreements, license] : [license];
        const log = {
          status: "licensed" as any,
          actionAr: `تم تسجيل وتوثيق عقد استغلال تجاري لـ: ${license.licensee}`,
          actionEn: `Registered and certified commercial license to: ${license.licensee}`,
          timestamp: new Date().toISOString(),
          actor: "مكتب نقل التكنولوجيا الفيدرالي",
          notes: `قيمة العقد: ${license.fee.toLocaleString()} SDG`
        };
        return {
          ...ip,
          status: "licensed" as any,
          licensingAgreements: agreements,
          auditLogs: [log, ...ip.auditLogs]
        };
      }
      return ip;
    });
    setIpRecords(updated);
    saveState("sdmci_ip", updated);
  };

  // Tech Transfer Callbacks
  const handleAddPartnership = (newPartner: UniversityIndustryPartnership) => {
    const updated = [newPartner, ...partnerships];
    setPartnerships(updated);
    saveState("sdmci_partnerships", updated);
  };

  const handleNegotiateAsset = (id: string) => {
    const updated = assets.map(a => a.id === id ? { ...a, status: "negotiation" as const } : a);
    setAssets(updated);
    saveState("sdmci_assets", updated);
  };

  // Fund Applications Callbacks
  const handleAddApplication = (newApp: FundApplication) => {
    const updated = [newApp, ...applications];
    setApplications(updated);
    saveState("sdmci_funds", updated);
  };

  const handleUpdateAppStatus = (id: string, status: "approved" | "rejected" | "disbursing" | "completed", approvedAmt?: number) => {
    const updated = applications.map(ap => {
      if (ap.id === id) {
        return {
          ...ap,
          status,
          approvedAmount: approvedAmt || ap.requestedAmount
        };
      }
      return ap;
    });
    setApplications(updated);
    saveState("sdmci_funds", updated);
  };

  const handleReleaseMilestone = (appId: string, milestoneId: string) => {
    const updated = applications.map(ap => {
      if (ap.id === appId) {
        const msList = ap.milestones.map(ms => {
          if (ms.id === milestoneId) {
            const nextStatus = ms.status === "pending" ? "approved" : "released";
            return { ...ms, status: nextStatus as any };
          }
          return ms;
        });

        // If all released, complete app status
        const allReleased = msList.every(m => m.status === "released");
        const nextStatus = allReleased ? "completed" as const : "disbursing" as const;

        return {
          ...ap,
          milestones: msList,
          status: nextStatus
        };
      }
      return ap;
    });
    setApplications(updated);
    saveState("sdmci_funds", updated);
  };

  // Knowledge Economy & PDF Repository Callbacks
  const handleParticipateChallenge = (id: string) => {
    const updated = challenges.map(c => c.id === id ? { ...c, participantsCount: c.participantsCount + 1 } : c);
    setChallenges(updated);
    saveState("sdmci_challenges", updated);
  };

  const handleDownloadDoc = (id: string) => {
    const updated = docs.map(d => d.id === id ? { ...d, downloads: d.downloads + 1 } : d);
    setDocs(updated);
    saveState("sdmci_docs", updated);
  };

  // Collaboration Workspaces Callbacks
  const handleAddWorkspace = (newWork: WorkspaceProject) => {
    const updated = [newWork, ...workspaces];
    setWorkspaces(updated);
    saveState("sdmci_workspaces", updated);
  };

  const handlePostDiscussion = (workspaceId: string, text: string, sender: string, org: string) => {
    const updated = workspaces.map(w => {
      if (w.id === workspaceId) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender,
          organization: org,
          text,
          timestamp: new Date().toISOString()
        };
        return {
          ...w,
          discussions: [...w.discussions, newMsg]
        };
      }
      return w;
    });
    setWorkspaces(updated);
    saveState("sdmci_workspaces", updated);
  };

  const handleAddWorkspaceMilestone = (workspaceId: string, milestone: any) => {
    const updated = workspaces.map(w => {
      if (w.id === workspaceId) {
        return {
          ...w,
          milestones: [...w.milestones, milestone]
        };
      }
      return w;
    });
    setWorkspaces(updated);
    saveState("sdmci_workspaces", updated);
  };

  const handleUploadWorkspaceDoc = (workspaceId: string, doc: any) => {
    const updated = workspaces.map(w => {
      if (w.id === workspaceId) {
        return {
          ...w,
          documents: [...w.documents, doc]
        };
      }
      return w;
    });
    setWorkspaces(updated);
    saveState("sdmci_workspaces", updated);
  };

  // Tab definitions
  const tabs = [
    { id: "registry", labelAr: "السجل الوطني للمبتكرين", labelEn: "Innovators Registry", icon: Users },
    { id: "research", labelAr: "المشاريع البحثية", labelEn: "Research Track", icon: Lightbulb },
    { id: "ip", labelAr: "الملكية الفكرية والبراءات", labelEn: "IP & Patents Registry", icon: ShieldCheck },
    { id: "transfer", labelAr: "نقل التكنولوجيا", labelEn: "Tech Transfer", icon: ArrowRightLeft },
    { id: "fund", labelAr: "صندوق الابتكار", labelEn: "Innovation Fund", icon: Landmark },
    { id: "knowledge", labelAr: "اقتصاد المعرفة والتحديات", labelEn: "Knowledge Economy", icon: BookOpen },
    { id: "collaboration", labelAr: "مساحات العمل المشترك", labelEn: "Collaboration Spaces", icon: MessageSquare },
    { id: "analytics", labelAr: "نظام GIS والتحليلات", labelEn: "GIS & Analytics", icon: MapPin },
    { id: "advisor", labelAr: "مستشار الذكاء الاصطناعي", labelEn: "AI Innovation Advisor", icon: BrainCircuit }
  ];

  return (
    <div className="space-y-6">
      
      {/* Platform Header with Role Switcher */}
      <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sudan-green animate-pulse" />
            <span className="text-[10px] font-extrabold text-sudan-green uppercase tracking-wider">
              {currentLanguage === "ar" ? "وزارة التجارة والصناعة الرقمية" : "Digital Ministry of Commerce & Industry"}
            </span>
          </div>

          <h2 className="font-extrabold text-[#1E293B] text-xl md:text-2xl leading-none">
            {currentLanguage === "ar" ? "المنصة الوطنية للابتكار والبحوث والملكية الفكرية" : "National Innovation, Research & Intellectual Property Platform"}
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            {currentLanguage === "ar"
              ? "المنظومة الوطنية المتكاملة لدعم المبتكرين والباحثين، تسجيل براءات الاختراع، ونقل التكنولوجيا تماشياً مع رؤية السودان 2035."
              : "Sovereign unified ecosystem supporting innovators, patent filings, technology transfer, and national grants."}
          </p>
        </div>

        {/* Sovereign Role switcher dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl w-full lg:w-auto shrink-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <UserCheck className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 lg:flex-none">
            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
              {currentLanguage === "ar" ? "بوابة الصلاحيات والتحقق السيادية" : "Sovereign Portal Access"}
            </span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as InnovationUserRole)}
              className="bg-transparent text-xs font-extrabold text-slate-800 outline-none cursor-pointer pr-4"
            >
              <option value={InnovationUserRole.INNOVATOR}>
                {currentLanguage === "ar" ? "مبتكر سوداني مسجل" : "Registered Innovator"}
              </option>
              <option value={InnovationUserRole.RESEARCHER}>
                {currentLanguage === "ar" ? "باحث / أكاديمي" : "Researcher / Academic"}
              </option>
              <option value={InnovationUserRole.UNIVERSITY_ADMIN}>
                {currentLanguage === "ar" ? "مسؤول جامعة / مركز أبحاث" : "University Admin"}
              </option>
              <option value={InnovationUserRole.PATENT_EXAMINER}>
                {currentLanguage === "ar" ? "فاحص براءات الاختراع الفيدرالي" : "Federal Patent Examiner"}
              </option>
              <option value={InnovationUserRole.TRADEMARK_EXAMINER}>
                {currentLanguage === "ar" ? "فاحص علامات تجارية سيادية" : "Trademark Examiner"}
              </option>
              <option value={InnovationUserRole.TECH_TRANSFER_OFFICER}>
                {currentLanguage === "ar" ? "مسؤول مكاتب نقل التكنولوجيا TTO" : "Tech Transfer Officer"}
              </option>
              <option value={InnovationUserRole.INNOVATION_FUND_MANAGER}>
                {currentLanguage === "ar" ? "مدير مخصصات صندوق الابتكار" : "Fund Allocation Manager"}
              </option>
              <option value={InnovationUserRole.MINISTER}>
                {currentLanguage === "ar" ? "معالي الوزير الفيدرالي" : "Minister Office"}
              </option>
              <option value={InnovationUserRole.SUPER_ADMIN}>
                {currentLanguage === "ar" ? "مدير النظام الفيدرالي الشامل" : "Super Administrator"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Main navigation Tabs */}
      <div className="bg-white border border-gray-200 p-2.5 rounded-3xl shadow-sm flex flex-wrap gap-1.5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-sudan-green text-white"
                  : "bg-transparent text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab views rendering conditionally */}
      <div className="transition-all duration-300">
        
        {activeTab === "registry" && (
          <InnovationRegistry
            currentLanguage={currentLanguage}
            records={innovators}
            onAddRecord={handleAddInnovator}
            onUpdateStatus={handleUpdateInnovatorStatus}
            userRole={userRole}
          />
        )}

        {activeTab === "research" && (
          <ResearchManagement
            currentLanguage={currentLanguage}
            projects={projects}
            onAddProject={handleAddProject}
            onUpdateProgress={handleUpdateProjectProgress}
            userRole={userRole}
          />
        )}

        {activeTab === "ip" && (
          <IntellectualProperty
            currentLanguage={currentLanguage}
            ipRecords={ipRecords}
            onAddIpRecord={handleAddIpRecord}
            onUpdateIpStatus={handleUpdateIpStatus}
            onAddOpposition={handleAddOpposition}
            onAddLicensing={handleAddLicensing}
            userRole={userRole}
          />
        )}

        {activeTab === "transfer" && (
          <TechTransfer
            currentLanguage={currentLanguage}
            assets={assets}
            partnerships={partnerships}
            onAddPartnership={handleAddPartnership}
            onNegotiateAsset={handleNegotiateAsset}
            userRole={userRole}
          />
        )}

        {activeTab === "fund" && (
          <InnovationFund
            currentLanguage={currentLanguage}
            applications={applications}
            onAddApplication={handleAddApplication}
            onUpdateAppStatus={handleUpdateAppStatus}
            onReleaseMilestone={handleReleaseMilestone}
            userRole={userRole}
          />
        )}

        {activeTab === "knowledge" && (
          <KnowledgeEconomy
            currentLanguage={currentLanguage}
            challenges={challenges}
            experts={experts}
            docs={docs}
            onParticipateChallenge={handleParticipateChallenge}
            onDownloadDoc={handleDownloadDoc}
          />
        )}

        {activeTab === "collaboration" && (
          <CollaborationWorkspace
            currentLanguage={currentLanguage}
            workspaces={workspaces}
            onAddWorkspace={handleAddWorkspace}
            onPostDiscussion={handlePostDiscussion}
            onAddMilestone={handleAddWorkspaceMilestone}
            onUploadDocument={handleUploadWorkspaceDoc}
            userRole={userRole}
          />
        )}

        {activeTab === "analytics" && (
          <InnovationAnalyticsTab
            currentLanguage={currentLanguage}
          />
        )}

        {activeTab === "advisor" && (
          <InnovationAdvisor
            currentLanguage={currentLanguage}
          />
        )}

      </div>

    </div>
  );
}
