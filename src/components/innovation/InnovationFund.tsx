/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Landmark, Plus, Search, DollarSign, Briefcase, TrendingUp, 
  CheckSquare, ShieldAlert, FileSpreadsheet, ArrowUpRight, Award, AlertCircle 
} from "lucide-react";
import { FundApplication, FundType, InnovationUserRole } from "./InnovationTypes";

interface InnovationFundProps {
  currentLanguage: "ar" | "en";
  applications: FundApplication[];
  onAddApplication: (newApp: FundApplication) => void;
  onUpdateAppStatus: (id: string, status: "approved" | "rejected" | "disbursing" | "completed", approvedAmt?: number) => void;
  onReleaseMilestone: (appId: string, milestoneId: string) => void;
  userRole: InnovationUserRole;
}

export default function InnovationFund({
  currentLanguage,
  applications,
  onAddApplication,
  onUpdateAppStatus,
  onReleaseMilestone,
  userRole
}: InnovationFundProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFundType, setSelectedFundType] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [projectTitleAr, setProjectTitleAr] = useState("");
  const [projectTitleEn, setProjectTitleEn] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [requestedAmount, setRequestedAmount] = useState<number>(0);
  const [fundType, setFundType] = useState<FundType>("grant");

  // Approval budget input state
  const [tempApprovedAmt, setTempApprovedAmt] = useState<number>(0);
  const [activeApproveId, setActiveApproveId] = useState<string | null>(null);

  const fundTypesList: { value: FundType; ar: string; en: string }[] = [
    { value: "grant", ar: "منحة ابتكار فردية", en: "Innovation Grant" },
    { value: "startup_seed", ar: "تمويل بذور تأسيس للشركات الناشئة", en: "Startup Seed Capital" },
    { value: "research_grant", ar: "منحة تمويل بحث علمي جامعي", en: "University Research Grant" },
    { value: "tech_dev", ar: "صندوق تطوير التكنولوجيا الصناعية", en: "Technology Development Fund" },
    { value: "accelerator", ar: "تمويل مسرعات ومجمعات الأعمال", en: "Accelerator Sponsorship" },
    { value: "commercialization", ar: "برنامج دعم تسويق المنتجات الوطنية", en: "Commercialization Support Program" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitleAr || !applicantName || requestedAmount <= 0) return;

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newApp: FundApplication = {
      id: `fund-${Date.now()}`,
      refCode: `SD-NIF-2026-${randomId}`,
      applicantName,
      applicantId: `rec-${Math.floor(100 + Math.random() * 900)}`,
      projectTitleAr,
      projectTitleEn: projectTitleEn || projectTitleAr,
      type: fundType,
      requestedAmount,
      status: "submitted",
      milestones: [
        { id: `m-${randomId}-1`, titleAr: "مرحلة تدشين النموذج الأولي وموافقة الجودة", titleEn: "Pilot design draft approval", amount: Math.floor(requestedAmount * 0.3), status: "pending" },
        { id: `m-${randomId}-2`, titleAr: "مرحلة الاختبار الميداني بمصانع الإنتاج", titleEn: "Field testing on factory line", amount: Math.floor(requestedAmount * 0.4), status: "pending" },
        { id: `m-${randomId}-3`, titleAr: "الاعتماد السيادي والرفع لبوابة الصادرات", titleEn: "Sovereign validation & export publishing", amount: Math.floor(requestedAmount * 0.3), status: "pending" }
      ],
      impactMetrics: {
        jobsCreated: 0,
        trlProgress: "TRL 1 to TRL 3",
        patentsFiled: 0
      },
      createdAt: new Date().toISOString().split("T")[0]
    };

    onAddApplication(newApp);
    setIsFormOpen(false);

    // Reset Form
    setProjectTitleAr("");
    setProjectTitleEn("");
    setApplicantName("");
    setRequestedAmount(0);
  };

  const handleApprove = (id: string, amt: number) => {
    onUpdateAppStatus(id, "disbursing", amt);
    setActiveApproveId(null);
  };

  const filteredApps = applications.filter((ap) => {
    const matchesSearch = 
      ap.projectTitleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ap.projectTitleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ap.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ap.refCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedFundType === "all" || ap.type === selectedFundType;
    return matchesSearch && matchesType;
  });

  // Calculate statistics from preseeded data
  const totalApprovedSum = applications
    .filter(a => a.status === "disbursing" || a.status === "completed")
    .reduce((sum, a) => sum + (a.approvedAmount || 0), 0);

  const activeJobsCreated = applications
    .reduce((sum, a) => sum + (a.impactMetrics?.jobsCreated || 0), 0);

  const activePatentsFiled = applications
    .reduce((sum, a) => sum + (a.impactMetrics?.patentsFiled || 0), 0);

  const isFundManager = [
    InnovationUserRole.SUPER_ADMIN,
    InnovationUserRole.SUPER_ADMIN as string,
    InnovationUserRole.MINISTER,
    InnovationUserRole.INNOVATION_FUND_MANAGER,
    InnovationUserRole.DEPARTMENT_MANAGER
  ].includes(userRole);

  return (
    <div className="space-y-6">
      
      {/* Upper Metrics Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{currentLanguage === "ar" ? "إجمالي التمويل المنصرف" : "Total Funds Released"}</span>
            <span className="font-mono text-base font-extrabold text-[#1E293B]">{totalApprovedSum.toLocaleString()} SDG</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{currentLanguage === "ar" ? "الوظائف المبتكرة المستحدثة" : "Sovereign Tech Jobs Created"}</span>
            <span className="font-mono text-base font-extrabold text-[#1E293B]">{activeJobsCreated} {currentLanguage === "ar" ? "وظيفة" : "Jobs"}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{currentLanguage === "ar" ? "براءات اختراع تم تمويلها" : "Funded Patents Filed"}</span>
            <span className="font-mono text-base font-extrabold text-[#1E293B]">{activePatentsFiled} {currentLanguage === "ar" ? "براءات" : "Patents"}</span>
          </div>
        </div>

        {/* Apply CTA block */}
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-3xl shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] text-[#FFD700] font-extrabold block uppercase tracking-wider">
              {currentLanguage === "ar" ? "صندوق الابتكار 2035" : "Innovation Fund 2035"}
            </span>
            <span className="text-white text-xs font-bold leading-tight block">
              {currentLanguage === "ar" ? "هل لديك مشروع مبتكر؟" : "Have a technology project?"}
            </span>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-extrabold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{currentLanguage === "ar" ? "طلب تمويل" : "Apply"}</span>
          </button>
        </div>

      </div>

      {/* Application Registration Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Landmark className="h-5 w-5 text-sudan-green" />
            <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">
              {currentLanguage === "ar" ? "طلب تمويل جديد من صندوق الابتكار والتحول الصناعي" : "Sovereign Fund Allocation Application"}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Project Title Ar */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "عنوان المشروع التكنولوجي المقترح (بالعربية) *" : "Proposed Project Title (Arabic) *"}
              </label>
              <input
                type="text"
                required
                value={projectTitleAr}
                onChange={(e) => setProjectTitleAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "مثال: منصة فحص الصادرات الذكية" : "e.g. Export Inspection Tech..."}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Project Title En */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "عنوان المشروع التكنولوجي المقترح (بالإنجليزية)" : "Proposed Project Title (English)"}
              </label>
              <input
                type="text"
                value={projectTitleEn}
                onChange={(e) => setProjectTitleEn(e.target.value)}
                placeholder="e.g. Export Inspection Tech..."
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Applicant Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "اسم المبتكر الفردي / المنشأة الطالبة للتمويل *" : "Applicant Name / Registered Entity *"}
              </label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder={currentLanguage === "ar" ? "م. مازن يوسف" : "e.g. Mazen Youssef"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Fund Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "تصنيف التمويل المطلوب *" : "Fund Allocation Category *"}
              </label>
              <select
                value={fundType}
                onChange={(e) => setFundType(e.target.value as FundType)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              >
                {fundTypesList.map((f) => (
                  <option key={f.value} value={f.value}>
                    {currentLanguage === "ar" ? f.ar : f.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Requested amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "المبلغ المطلوب (بالجنيه السوداني) *" : "Requested Amount (SDG) *"}
              </label>
              <input
                type="number"
                required
                value={requestedAmount || ""}
                onChange={(e) => setRequestedAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

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
              {currentLanguage === "ar" ? "إرسال طلب التمويل" : "Submit & Log Application"}
            </button>
          </div>
        </form>
      )}

      {/* Filter and search bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={currentLanguage === "ar" ? "بحث برمز الملف، عنوان المشروع..." : "Search by code, title, applicant..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs pl-8 pr-3.5 py-2 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <select
          value={selectedFundType}
          onChange={(e) => setSelectedFundType(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all cursor-pointer"
        >
          <option value="all">{currentLanguage === "ar" ? "كل تصنيفات التمويل" : "All Funding Programs"}</option>
          {fundTypesList.map((f) => (
            <option key={f.value} value={f.value}>
              {currentLanguage === "ar" ? f.ar : f.en}
            </option>
          ))}
        </select>
      </div>

      {/* Applications list */}
      <div className="space-y-4">
        {filteredApps.length > 0 ? (
          filteredApps.map((ap) => {
            const isPending = ap.status === "submitted" || ap.status === "under_evaluation";
            const isDisbursing = ap.status === "disbursing";
            const currentTypeObj = fundTypesList.find(t => t.value === ap.type);

            return (
              <div 
                key={ap.id}
                className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4"
              >
                
                {/* Upper block */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-slate-100 text-slate-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-slate-200">
                        {ap.refCode}
                      </span>
                      <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-100">
                        {currentTypeObj ? (currentLanguage === "ar" ? currentTypeObj.ar : currentTypeObj.en) : ap.type}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                        ap.status === "disbursing"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : ap.status === "completed"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        <span className="h-1 w-1 rounded-full bg-current animate-pulse" />
                        <span>{ap.status}</span>
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base leading-snug">
                      {currentLanguage === "ar" ? ap.projectTitleAr : ap.projectTitleEn}
                    </h4>

                    <div className="text-[10px] text-slate-500 font-semibold space-x-2">
                      <span className="text-sudan-green font-bold">{ap.applicantName}</span>
                      <span>|</span>
                      <span>{currentLanguage === "ar" ? `تاريخ الطلب: ${ap.createdAt}` : `Applied at: ${ap.createdAt}`}</span>
                    </div>
                  </div>

                  {/* Fund amounts summary */}
                  <div className="text-right shrink-0 bg-slate-50 border border-slate-150 p-3 rounded-2xl space-y-1">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 font-bold block">{currentLanguage === "ar" ? "المبلغ المطلوب" : "Requested"}</span>
                      <span className="font-mono text-xs font-bold text-slate-600 block">{ap.requestedAmount.toLocaleString()} SDG</span>
                    </div>
                    {ap.approvedAmount && (
                      <div className="space-y-0.5 pt-1.5 border-t border-slate-250">
                        <span className="text-[9px] text-emerald-600 font-bold block">{currentLanguage === "ar" ? "المبلغ المعتمد سيادياً" : "Sovereign Approved"}</span>
                        <span className="font-mono text-sm font-extrabold text-[#1E293B]">{ap.approvedAmount.toLocaleString()} SDG</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Milestones list (Progressive payments releases) */}
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                    {currentLanguage === "ar" ? "شرائح الصرف الفيدرالية والميلستون" : "Federal Release Installments & Milestones"}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {ap.milestones.map((ms) => {
                      const isPendingMilestone = ms.status === "pending";
                      const isApprovedMilestone = ms.status === "approved";
                      const isReleasedMilestone = ms.status === "released";

                      return (
                        <div 
                          key={ms.id} 
                          className={`p-3 rounded-2xl border flex flex-col justify-between gap-3 text-xs ${
                            isReleasedMilestone 
                              ? "bg-emerald-50/50 border-emerald-200" 
                              : isApprovedMilestone 
                              ? "bg-amber-50/50 border-amber-200" 
                              : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
                              {ms.amount.toLocaleString()} SDG
                            </span>
                            <p className="font-bold text-slate-700 leading-tight">
                              {currentLanguage === "ar" ? ms.titleAr : ms.titleEn}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${
                              isReleasedMilestone 
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                                : isApprovedMilestone 
                                ? "bg-amber-100 text-amber-700 border-amber-200" 
                                : "bg-slate-150 text-slate-500 border-slate-200"
                            }`}>
                              {ms.status}
                            </span>

                            {/* Release Milestones for Fund Managers */}
                            {isFundManager && (isPendingMilestone || isApprovedMilestone) && (
                              <button
                                onClick={() => onReleaseMilestone(ap.id, ms.id)}
                                className="bg-slate-900 text-[#FFD700] hover:bg-slate-800 text-[9px] font-extrabold px-2.5 py-1 rounded cursor-pointer transition-all uppercase flex items-center gap-1"
                              >
                                <ArrowUpRight className="h-3 w-3" />
                                <span>{isPendingMilestone ? (currentLanguage === "ar" ? "اعتماد الشريحة" : "Approve") : (currentLanguage === "ar" ? "صرف السيولة" : "Release")}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fund evaluation controls for officials */}
                {isPending && isFundManager && (
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">
                        {currentLanguage === "ar" ? "تدقيق الملاءمة المالية للمشروع" : "Financial Compliance & Due Diligence"}
                      </span>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {currentLanguage === "ar" ? "مراجعة ميزانيات التشغيل والمخرجات المقترحة لتخصيص مبلغ الدعم الفيدرالي الفعلي." : "Confirm milestones structure to authorize disbursement schedule."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder={currentLanguage === "ar" ? "المبلغ المعتمد (SDG)..." : "Approved amount (SDG)..."}
                        value={tempApprovedAmt || ""}
                        onChange={(e) => setTempApprovedAmt(Number(e.target.value))}
                        className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-xl outline-none focus:border-sudan-green transition-all"
                      />
                      <button
                        onClick={() => handleApprove(ap.id, tempApprovedAmt || ap.requestedAmount)}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors"
                      >
                        {currentLanguage === "ar" ? "اعتماد التمويل المالي" : "Authorize Allocation"}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-200 p-8 rounded-3xl text-center text-slate-400 font-semibold">
            <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            {currentLanguage === "ar" ? "لا توجد طلبات تمويل مطابقة لمعايير البحث" : "No fund applications matches search parameters"}
          </div>
        )}
      </div>

    </div>
  );
}
