/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Cpu, Plus, Search, BookOpen, Layers, Award, 
  DollarSign, RefreshCw, Globe, ChevronDown, ChevronUp, AlertCircle 
} from "lucide-react";
import { ResearchProject, InnovationUserRole } from "./InnovationTypes";

interface ResearchManagementProps {
  currentLanguage: "ar" | "en";
  projects: ResearchProject[];
  onAddProject: (newProj: ResearchProject) => void;
  onUpdateProgress: (id: string, progress: number, outcomeAr?: string, outcomeEn?: string) => void;
  userRole: InnovationUserRole;
}

export default function ResearchManagement({
  currentLanguage,
  projects,
  onAddProject,
  onUpdateProgress,
  userRole
}: ResearchManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form states
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [leadResearcherName, setLeadResearcherName] = useState("");
  const [institutionAr, setInstitutionAr] = useState("");
  const [institutionEn, setInstitutionEn] = useState("");
  const [fundingSourceAr, setFundingSourceAr] = useState("");
  const [fundingSourceEn, setFundingSourceEn] = useState("");
  const [allocatedBudget, setAllocatedBudget] = useState<number>(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [collaboratorInput, setCollaboratorInput] = useState("");
  const [isInternational, setIsInternational] = useState(false);
  const [intlPartnerInput, setIntlPartnerInput] = useState("");
  const [programAr, setProgramAr] = useState("");
  const [programEn, setProgramEn] = useState("");

  // Progress update inline state
  const [tempProgress, setTempProgress] = useState<number>(0);
  const [outcomeArInput, setOutcomeArInput] = useState("");
  const [outcomeEnInput, setOutcomeEnInput] = useState("");
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !titleEn || !leadResearcherName || !institutionAr) return;

    const newProject: ResearchProject = {
      id: `res-${Date.now()}`,
      titleAr,
      titleEn,
      leadResearcherId: `rec-${Math.floor(100 + Math.random() * 900)}`,
      leadResearcherName,
      institutionAr,
      institutionEn,
      fundingSourceAr: fundingSourceAr || (currentLanguage === "ar" ? "تمويل ذاتي" : "Self-funded"),
      fundingSourceEn: fundingSourceEn || (currentLanguage === "ar" ? "تمويل ذاتي" : "Self-funded"),
      allocatedBudget: Number(allocatedBudget) || 0,
      progressPercentage: 0,
      status: "submitted",
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: endDate || new Date().toISOString().split("T")[0],
      collaborators: collaboratorInput ? collaboratorInput.split(",").map(c => c.trim()) : [],
      publications: [],
      outcomesAr: "",
      outcomesEn: "",
      isInternational,
      internationalPartners: intlPartnerInput ? intlPartnerInput.split(",").map(i => i.trim()) : [],
      programAr: programAr || undefined,
      programEn: programEn || undefined
    };

    onAddProject(newProject);
    setIsFormOpen(false);

    // Reset Form
    setTitleAr("");
    setTitleEn("");
    setLeadResearcherName("");
    setInstitutionAr("");
    setInstitutionEn("");
    setFundingSourceAr("");
    setFundingSourceEn("");
    setAllocatedBudget(0);
    setStartDate("");
    setEndDate("");
    setCollaboratorInput("");
    setIsInternational(false);
    setIntlPartnerInput("");
    setProgramAr("");
    setProgramEn("");
  };

  const handleProgressSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    onUpdateProgress(id, tempProgress, outcomeArInput, outcomeEnInput);
    setActiveUpdateId(null);
    setOutcomeArInput("");
    setOutcomeEnInput("");
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.leadResearcherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institutionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institutionEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const isResearcherOrAdmin = [
    InnovationUserRole.SUPER_ADMIN,
    InnovationUserRole.SUPER_ADMIN as string,
    InnovationUserRole.MINISTER,
    InnovationUserRole.RESEARCHER,
    InnovationUserRole.UNIVERSITY_ADMIN,
    InnovationUserRole.TECH_TRANSFER_OFFICER,
    InnovationUserRole.DEPARTMENT_MANAGER
  ].includes(userRole);

  return (
    <div className="space-y-6">
      
      {/* Banner / Info */}
      <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-[#1E293B] text-base md:text-lg">
            {currentLanguage === "ar" ? "نظام إدارة ومتابعة البحوث العلمية الفيدرالي" : "Federal Research Management & Tracker System"}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {currentLanguage === "ar" 
              ? "متابعة التقدم الفني، مخرجات النشر، الشراكات الدولية والبرامج البحثية الحكومية الموحدة."
              : "Track milestone deliverables, academic publications, international networks, and sovereign research initiatives."}
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>{currentLanguage === "ar" ? "تسجيل مشروع بحثي جديد" : "Register Research Project"}</span>
        </button>
      </div>

      {/* Dynamic Registration Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <BookOpen className="h-5 w-5 text-sudan-green" />
            <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">
              {currentLanguage === "ar" ? "تفاصيل المشروع البحثي والتمويل الموحد" : "Research Project Dossier & Funding Specifications"}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Title Ar */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "عنوان البحث العلمي (بالعربية) *" : "Research Title (Arabic) *"}
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "مثال: دراسة تنقية وتحليل صمغ الكوردوفان" : "e.g. Gum Arabic Kordofan Purification Study"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Title En */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "عنوان البحث العلمي (بالإنجليزية) *" : "Research Title (English) *"}
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Gum Arabic Kordofan Purification Study"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Lead Researcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "الباحث الرئيسي (مسؤول الاتصال) *" : "Lead Researcher (PI) *"}
              </label>
              <input
                type="text"
                required
                value={leadResearcherName}
                onChange={(e) => setLeadResearcherName(e.target.value)}
                placeholder={currentLanguage === "ar" ? "د. طارق الطيب" : "e.g. Dr. Tarig Al-Tayeb"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Institution Ar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "المنشأة البحثية الحاضنة (بالعربية) *" : "Host Institution (Arabic) *"}
              </label>
              <input
                type="text"
                required
                value={institutionAr}
                onChange={(e) => setInstitutionAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "مثال: جامعة الخرطوم" : "e.g. University of Khartoum"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Institution En */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "المنشأة البحثية الحاضنة (بالإنجليزية)" : "Host Institution (English)"}
              </label>
              <input
                type="text"
                value={institutionEn}
                onChange={(e) => setInstitutionEn(e.target.value)}
                placeholder="e.g. University of Khartoum"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Funding Source Ar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "جهة ومصدر التمويل (بالعربية)" : "Funding Sponsor Name (Arabic)"}
              </label>
              <input
                type="text"
                value={fundingSourceAr}
                onChange={(e) => setFundingSourceAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "صندوق الابتكار الوطني الفيدرالي" : "e.g. National Fund"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Funding Source En */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "جهة ومصدر التمويل (بالإنجليزية)" : "Funding Sponsor Name (English)"}
              </label>
              <input
                type="text"
                value={fundingSourceEn}
                onChange={(e) => setFundingSourceEn(e.target.value)}
                placeholder="e.g. Federal National Fund"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Allocated Budget */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "ميزانية البحث المعتمدة (بالجنيه السوداني)" : "Allocated Budget (SDG)"}
              </label>
              <input
                type="number"
                value={allocatedBudget}
                onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "تاريخ بدء المشروع" : "Start Date"}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "تاريخ انتهاء المشروع" : "Estimated Completion Date"}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Collaborators */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "أسماء المتعاونين والباحثين المشاركين (مفصولة بفاصلة)" : "Collaborators (comma separated)"}
              </label>
              <input
                type="text"
                value={collaboratorInput}
                onChange={(e) => setCollaboratorInput(e.target.value)}
                placeholder={currentLanguage === "ar" ? "مثال: د. منى عبد الباقي، م. عثمان فرج" : "e.g. Dr. Mona, Eng. Osman"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Gov Program Ar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "البرنامج البحثي الحكومي المستهدف (بالعربية)" : "Sovereign Program Alignment (Arabic)"}
              </label>
              <input
                type="text"
                value={programAr}
                onChange={(e) => setProgramAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "مبادرة حماية الغذاء والابتكار الزراعي" : "e.g. Agri-Food Security Initiative"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Gov Program En */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "البرنامج البحثي الحكومي المستهدف (بالإنجليزية)" : "Sovereign Program Alignment (English)"}
              </label>
              <input
                type="text"
                value={programEn}
                onChange={(e) => setProgramEn(e.target.value)}
                placeholder="e.g. Sovereign Food Security Program"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* International Collaboration toggle */}
            <div className="space-y-3 flex items-center gap-2 mt-4 md:col-span-2">
              <input
                type="checkbox"
                id="isInternational"
                checked={isInternational}
                onChange={(e) => setIsInternational(e.target.checked)}
                className="h-4.5 w-4.5 accent-sudan-green rounded cursor-pointer"
              />
              <label htmlFor="isInternational" className="text-xs font-bold text-slate-700 cursor-pointer">
                {currentLanguage === "ar" ? "هذا البحث العلمي مدعوم بشراكة دولية (COMESA / شركاء عالميين)" : "This project includes international partnership (e.g. COMESA)"}
              </label>
            </div>

            {isInternational && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 block">
                  {currentLanguage === "ar" ? "الشركاء الدوليين (مفصولين بفاصلة)" : "International Partners (comma separated)"}
                </label>
                <input
                  type="text"
                  value={intlPartnerInput}
                  onChange={(e) => setIntlPartnerInput(e.target.value)}
                  placeholder="e.g. Nairobi University, ICARDA"
                  className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                />
              </div>
            )}

          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#1E293B] text-xs font-bold rounded-xl cursor-pointer"
            >
              {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              {currentLanguage === "ar" ? "تأجيل وتسجيل البحث" : "Register & Freeze"}
            </button>
          </div>
        </form>
      )}

      {/* Filter / Search */}
      <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={currentLanguage === "ar" ? "بحث عن البحوث، المؤسسات..." : "Search by title, host..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs pl-8 pr-3.5 py-2 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all cursor-pointer"
        >
          <option value="all">{currentLanguage === "ar" ? "كل حالات المشاريع" : "All Research States"}</option>
          <option value="submitted">{currentLanguage === "ar" ? "مقدمة حديثاً" : "Submitted"}</option>
          <option value="funding_review">{currentLanguage === "ar" ? "مراجعة الميزانية" : "Funding Review"}</option>
          <option value="active">{currentLanguage === "ar" ? "نشطة وقائمة" : "Active"}</option>
          <option value="completed">{currentLanguage === "ar" ? "منجزة ومصدقة" : "Completed"}</option>
        </select>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((p) => {
            const isExpanded = expandedId === p.id;
            const isUpdating = activeUpdateId === p.id;

            return (
              <div 
                key={p.id}
                className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4"
              >
                
                {/* Header / Summary Block */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    
                    {/* Status Badge & Program Alignment */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                        p.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : p.status === "active"
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : p.status === "funding_review"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}>
                        {currentLanguage === "ar" ? p.status : p.status}
                      </span>

                      {p.programAr && (
                        <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Layers className="h-3 w-3 text-sudan-green" />
                          <span>{currentLanguage === "ar" ? p.programAr : p.programEn}</span>
                        </span>
                      )}

                      {p.isInternational && (
                        <span className="bg-teal-50 border border-teal-100 text-teal-700 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Globe className="h-3 w-3 text-teal-600" />
                          <span>{currentLanguage === "ar" ? "شراكة دولية" : "International Partners"}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base leading-snug">
                      {currentLanguage === "ar" ? p.titleAr : p.titleEn}
                    </h4>

                    <div className="text-[11px] text-slate-500 font-semibold space-x-2 flex flex-wrap gap-y-1 items-center">
                      <span className="text-sudan-green font-bold">{p.leadResearcherName}</span>
                      <span className="text-gray-300">|</span>
                      <span>{currentLanguage === "ar" ? p.institutionAr : p.institutionEn}</span>
                    </div>

                  </div>

                  {/* Budget Display */}
                  <div className="text-right flex flex-col justify-between items-end gap-2 shrink-0">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">
                        {currentLanguage === "ar" ? "الموازنة المرصودة" : "Allocated Budget"}
                      </span>
                      <span className="font-mono text-sm md:text-base font-extrabold text-[#1E293B]">
                        {p.allocatedBudget.toLocaleString()} SDG
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{isExpanded ? (currentLanguage === "ar" ? "إخفاء التفاصيل" : "Hide info") : (currentLanguage === "ar" ? "عرض المخرجات والمستندات" : "View outcomes")}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Progress Bar indicator */}
                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                    <span>{currentLanguage === "ar" ? "التقدم الفني ونسبة التوطين" : "Technical Milestones Delivered"}</span>
                    <span className="font-mono">{p.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-sudan-green h-full rounded-full transition-all duration-500"
                      style={{ width: `${p.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Details section */}
                {isExpanded && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs space-y-4">
                    
                    {/* Outcomes / Collaborators / Pubs */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      
                      {/* Left: Collaborators & Publications */}
                      <div className="md:col-span-4 space-y-3 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                            {currentLanguage === "ar" ? "الفريق العلمي المشارك" : "Scientific Investigators"}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {p.collaborators.map((c, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 text-slate-700 font-bold text-[9px] px-2 py-0.5 rounded-md">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        {p.publications.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                              {currentLanguage === "ar" ? "النشر العلمي المصدق" : "Certified Publications"}
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-[10px] font-bold text-slate-600">
                              {p.publications.map((pub, idx) => (
                                <li key={idx} className="truncate">{pub}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {p.isInternational && p.internationalPartners && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                              {currentLanguage === "ar" ? "الشركاء الدوليين" : "Global Partners"}
                            </span>
                            <p className="font-bold text-[#1E293B] text-[10px]">{p.internationalPartners.join(", ")}</p>
                          </div>
                        )}
                      </div>

                      {/* Right: Technical Outcomes Summary */}
                      <div className="md:col-span-8 space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                            {currentLanguage === "ar" ? "النتائج والمخرجات الابتكارية السيادية" : "Sovereign Innovation Output & Results"}
                          </span>
                          <p className="font-bold text-[#1E293B] leading-relaxed">
                            {p.outcomesAr ? (currentLanguage === "ar" ? p.outcomesAr : p.outcomesEn) : (currentLanguage === "ar" ? "لم يتم الإعلان عن نتائج تجريبية منجزة بعد." : "No empirical outcomes cataloged yet.")}
                          </p>
                        </div>

                        {/* PI or Admin Update Form */}
                        {isResearcherOrAdmin && (
                          <div className="border-t border-slate-200 pt-3 space-y-2">
                            {!isUpdating ? (
                              <button
                                onClick={() => {
                                  setTempProgress(p.progressPercentage);
                                  setOutcomeArInput(p.outcomesAr || "");
                                  setOutcomeEnInput(p.outcomesEn || "");
                                  setActiveUpdateId(p.id);
                                }}
                                className="bg-slate-900 text-[#FFD700] text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-slate-850"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                                {currentLanguage === "ar" ? "تحديث مخرجات وتقدم البحث" : "Update research output & milestones"}
                              </button>
                            ) : (
                              <form onSubmit={(e) => handleProgressSubmit(e, p.id)} className="space-y-3 bg-white border border-slate-200 rounded-xl p-3">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                  
                                  {/* Progress slider */}
                                  <div className="md:col-span-4 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 flex justify-between">
                                      <span>{currentLanguage === "ar" ? "التقدم الفني %" : "Progress %"}</span>
                                      <span className="font-mono">{tempProgress}%</span>
                                    </label>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={tempProgress}
                                      onChange={(e) => setTempProgress(Number(e.target.value))}
                                      className="w-full accent-sudan-green h-1.5 bg-slate-100 rounded-full cursor-pointer"
                                    />
                                  </div>

                                  {/* Output Ar */}
                                  <div className="md:col-span-4 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 block">{currentLanguage === "ar" ? "النتيجة الفنية (بالعربية)" : "Technical Outcome (Ar)"}</label>
                                    <input
                                      type="text"
                                      value={outcomeArInput}
                                      onChange={(e) => setOutcomeArInput(e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 text-[10px] px-2 py-1 rounded"
                                    />
                                  </div>

                                  {/* Output En */}
                                  <div className="md:col-span-4 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 block">{currentLanguage === "ar" ? "النتيجة الفنية (بالإنجليزية)" : "Technical Outcome (En)"}</label>
                                    <input
                                      type="text"
                                      value={outcomeEnInput}
                                      onChange={(e) => setOutcomeEnInput(e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 text-[10px] px-2 py-1 rounded"
                                    />
                                  </div>

                                </div>

                                <div className="flex justify-end gap-1.5 pt-1 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => setActiveUpdateId(null)}
                                    className="bg-slate-100 hover:bg-slate-200 text-[#1E293B] text-[10px] font-bold px-2 py-1 rounded"
                                  >
                                    {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-bold px-2.5 py-1 rounded"
                                  >
                                    {currentLanguage === "ar" ? "حفظ التعديل" : "Save changes"}
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-200 p-8 rounded-3xl text-center text-slate-400 font-semibold">
            <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            {currentLanguage === "ar" ? "لا توجد أبحاث علمية قيد المتابعة مطابقة للبحث" : "No ongoing research projects matches search parameters"}
          </div>
        )}
      </div>

    </div>
  );
}
