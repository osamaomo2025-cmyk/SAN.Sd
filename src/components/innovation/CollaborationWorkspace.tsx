/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Network, Send, Plus, Search, FileText, Download, Users, 
  MessageSquare, Layers, CheckSquare, AlertCircle, ChevronDown 
} from "lucide-react";
import { WorkspaceProject, InnovationUserRole } from "./InnovationTypes";

interface CollaborationWorkspaceProps {
  currentLanguage: "ar" | "en";
  workspaces: WorkspaceProject[];
  onAddWorkspace: (newWork: WorkspaceProject) => void;
  onPostDiscussion: (workspaceId: string, message: string, sender: string, org: string) => void;
  onAddMilestone: (workspaceId: string, milestone: any) => void;
  onUploadDocument: (workspaceId: string, doc: any) => void;
  userRole: InnovationUserRole;
}

export default function CollaborationWorkspace({
  currentLanguage,
  workspaces,
  onAddWorkspace,
  onPostDiscussion,
  onAddMilestone,
  onUploadDocument,
  userRole
}: CollaborationWorkspaceProps) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(workspaces[0]?.id || "");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states (Create Workspace)
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");

  // Post message state
  const [msgInput, setMsgInput] = useState("");

  // Add milestone state
  const [msTitleAr, setMsTitleAr] = useState("");
  const [msTitleEn, setMsTitleEn] = useState("");
  const [msDueDate, setMsDueDate] = useState("");

  // Document upload state
  const [docName, setDocName] = useState("");

  const activeWorkspace = workspaces.find(w => w.id === selectedWorkspaceId) || workspaces[0];

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !descAr) return;

    const newWork: WorkspaceProject = {
      id: `work-${Date.now()}`,
      nameAr,
      nameEn: nameEn || nameAr,
      descriptionAr: descAr,
      descriptionEn: descEn || descAr,
      members: [
        { name: "بروفايل معتمد", role: "منسق الأبحاث والاتصال", organization: "وزارة التجارة والصناعة" }
      ],
      documents: [],
      discussions: [
        { id: "disc-init", sender: "نظام التحالفات", organization: "SDMCI Portal", text: "تم فتح مساحة العمل المشترك الفيدرالية الموثوقة بنجاح.", timestamp: new Date().toISOString() }
      ],
      milestones: []
    };

    onAddWorkspace(newWork);
    setSelectedWorkspaceId(newWork.id);
    setIsFormOpen(false);

    // Reset Form
    setNameAr("");
    setNameEn("");
    setDescAr("");
    setDescEn("");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const senderName = currentLanguage === "ar" ? "باحث معتمد" : "Verified Researcher";
    const senderOrg = currentLanguage === "ar" ? "وزارة التجارة" : "Ministry TTO";

    onPostDiscussion(activeWorkspace.id, msgInput, senderName, senderOrg);
    setMsgInput("");
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitleAr || !msDueDate) return;

    const newMs = {
      id: `wm-${Date.now()}`,
      titleAr: msTitleAr,
      titleEn: msTitleEn || msTitleAr,
      status: "pending" as const,
      dueDate: msDueDate
    };

    onAddMilestone(activeWorkspace.id, newMs);

    // Reset Form
    setMsTitleAr("");
    setMsTitleEn("");
    setMsDueDate("");
  };

  const handleMockUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    const newDoc = {
      id: `wd-${Date.now()}`,
      name: docName.endsWith(".pdf") ? docName : `${docName}.pdf`,
      size: "1.8 MB",
      uploadedBy: currentLanguage === "ar" ? "مخترع مسجل" : "Registered Innovator",
      uploadedAt: new Date().toISOString().split("T")[0]
    };

    onUploadDocument(activeWorkspace.id, newDoc);
    setDocName("");
  };

  return (
    <div className="space-y-6">
      
      {/* Banner / Info */}
      <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-[#1E293B] text-base md:text-lg">
            {currentLanguage === "ar" ? "مساحات العمل والتحالفات المشتركة المشفرة" : "Sovereign Encrypted Working Groups & Collaboration Workspaces"}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {currentLanguage === "ar" 
              ? "بيئة مغلقة ومحمية للتعاون الفني بين الجامعات، المراكز البحثية، المستثمرين، وهيئات التفتيش والمطابقة الفيدرالية."
              : "Sovereign secure environments enabling end-to-end encrypted tech transfer discussions, milestones alignment, and PDF sharing."}
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>{currentLanguage === "ar" ? "تأسيس مساحة تحالف جديدة" : "Form Collaboration Workspace"}</span>
        </button>
      </div>

      {/* Creation form */}
      {isFormOpen && (
        <form onSubmit={handleCreateWorkspace} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Network className="h-5 w-5 text-sudan-green animate-pulse" />
            <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">
              {currentLanguage === "ar" ? "نموذج تشكيل تحالف عملي مشترك ومغلق" : "Form New Closed Sovereign Workspace"}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Name Ar */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "اسم التحالف ومجموعة العمل (بالعربية) *" : "Workspace Name (Arabic) *"}
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "فريق دراسة الموارد الجينية للكركديه" : "e.g. Hibiscus Genome Working Team"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Name En */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "اسم التحالف ومجموعة العمل (بالإنجليزية)" : "Workspace Name (English)"}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Hibiscus Genome Working Team"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Desc Ar */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "وصف ومجالات البحث والمستهدفات (بالعربية) *" : "Scope & Collaborative Targets (Arabic) *"}
              </label>
              <textarea
                required
                rows={3}
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Desc En */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "وصف ومجالات البحث والمستهدفات (بالإنجليزية)" : "Scope & Collaborative Targets (English)"}
              </label>
              <textarea
                rows={3}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
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
              {currentLanguage === "ar" ? "تأسيس مجموعة العمل" : "Form Working Group"}
            </button>
          </div>
        </form>
      )}

      {/* Main Workspace Frame */}
      {activeWorkspace ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar selector (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm space-y-3">
              <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider text-slate-400">
                {currentLanguage === "ar" ? "مجموعات العمل والتحالفات النشطة" : "Active Group Alliances"}
              </h4>

              <div className="space-y-2">
                {workspaces.map((work) => (
                  <button
                    key={work.id}
                    onClick={() => setSelectedWorkspaceId(work.id)}
                    className={`w-full text-right p-3 rounded-2xl border text-xs font-bold flex flex-col gap-1 transition-all cursor-pointer ${
                      selectedWorkspaceId === work.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <span>{currentLanguage === "ar" ? work.nameAr : work.nameEn}</span>
                    <span className={`text-[10px] font-semibold ${selectedWorkspaceId === work.id ? "text-sudan-gold" : "text-slate-400"}`}>
                      {work.members.length} {currentLanguage === "ar" ? "مشاركين" : "Collaborators"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN Workspace Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="border-b border-gray-100 pb-4 space-y-1.5">
                <h4 className="font-extrabold text-[#1E293B] text-base md:text-lg">
                  {currentLanguage === "ar" ? activeWorkspace.nameAr : activeWorkspace.nameEn}
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {currentLanguage === "ar" ? activeWorkspace.descriptionAr : activeWorkspace.descriptionEn}
                </p>

                {/* Member list */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] text-slate-400 font-bold">
                  <Users className="h-4 w-4 text-sudan-green" />
                  <span>{currentLanguage === "ar" ? "الأعضاء الحاضرون:" : "Active Members:"}</span>
                  <div className="flex flex-wrap gap-1">
                    {activeWorkspace.members.map((m, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {m.name} ({m.organization})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid content: Discussions & Document Sharing / Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Discussion Area (7 cols) */}
                <div className="md:col-span-7 space-y-3">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-sudan-green" />
                    <span>{currentLanguage === "ar" ? "قناة الاتصال المشفرة الفيدرالية" : "Sovereign Encrypted Chat Channel"}</span>
                  </span>

                  {/* Message log thread */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 h-64 overflow-y-auto space-y-3 flex flex-col">
                    {activeWorkspace.discussions.map((disc) => (
                      <div key={disc.id} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                          <span className="text-sudan-green">{disc.sender} ({disc.organization})</span>
                          <span className="font-mono">{disc.timestamp.split("T")[1]?.slice(0, 5) || disc.timestamp}</span>
                        </div>
                        <div className="bg-white border border-slate-200 p-2.5 rounded-xl font-bold text-slate-700 shadow-sm leading-relaxed">
                          {disc.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat sender input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={currentLanguage === "ar" ? "اكتب رسالة فنية مشفرة..." : "Type technical encrypted message..."}
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                    />
                    <button
                      type="submit"
                      className="bg-sudan-green hover:bg-sudan-green-light text-white p-2 rounded-xl cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>

                {/* Right: Documents & Milestones (5 cols) */}
                <div className="md:col-span-5 space-y-4 border-l border-gray-100 pl-4">
                  
                  {/* Documents section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-sudan-green" />
                        <span>{currentLanguage === "ar" ? "الوثائق والملفات المشتركة" : "Shared PDF Files"}</span>
                      </span>
                    </div>

                    {/* Doc list */}
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {activeWorkspace.documents.length > 0 ? (
                        activeWorkspace.documents.map((doc) => (
                          <div key={doc.id} className="bg-slate-50 border border-slate-150 p-2 rounded-xl flex justify-between items-center text-[10px] font-bold">
                            <div className="space-y-0.5 truncate flex-1">
                              <p className="text-slate-700 truncate">{doc.name}</p>
                              <span className="text-[8px] text-slate-400 font-semibold">{doc.size} • {doc.uploadedBy}</span>
                            </div>
                            <button className="text-sudan-green p-1 hover:bg-slate-200 rounded cursor-pointer">
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-[9px] text-slate-400 italic block">{currentLanguage === "ar" ? "لم يتم مشاركة ملفات حتى الآن." : "No shared files."}</span>
                      )}
                    </div>

                    {/* Mock document upload trigger */}
                    <form onSubmit={handleMockUploadDoc} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={currentLanguage === "ar" ? "اسم المستند..." : "Doc title..."}
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-[10px] px-2 py-1 rounded w-full outline-none"
                      />
                      <button type="submit" className="bg-slate-900 text-white text-[9px] px-2.5 rounded cursor-pointer font-bold">
                        {currentLanguage === "ar" ? "رفع" : "Upload"}
                      </button>
                    </form>
                  </div>

                  {/* Milestones Section */}
                  <div className="space-y-2 border-t border-gray-100 pt-3">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <CheckSquare className="h-3.5 w-3.5 text-sudan-green" />
                      <span>{currentLanguage === "ar" ? "الأهداف ومواعيد التسليم" : "Milestones Ledger"}</span>
                    </span>

                    {/* Milestones list */}
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {activeWorkspace.milestones.length > 0 ? (
                        activeWorkspace.milestones.map((ms) => (
                          <div key={ms.id} className="bg-slate-50 border border-slate-150 p-2 rounded-xl text-[10px] flex items-center justify-between font-bold">
                            <div className="space-y-0.5">
                              <p className="text-slate-700">{currentLanguage === "ar" ? ms.titleAr : ms.titleEn}</p>
                              <span className="text-[9px] text-slate-400 block">{currentLanguage === "ar" ? `الموعد: ${ms.dueDate}` : `Due: ${ms.dueDate}`}</span>
                            </div>
                            <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[9px] px-2 py-0.5 rounded-full">
                              pending
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-[9px] text-slate-400 italic block">{currentLanguage === "ar" ? "لا توجد أهداف مجدولة." : "Zero milestones."}</span>
                      )}
                    </div>

                    {/* Add Milestone Form */}
                    <form onSubmit={handleCreateMilestone} className="space-y-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        required
                        placeholder={currentLanguage === "ar" ? "عنوان الهدف (عربي)..." : "Milestone..."}
                        value={msTitleAr}
                        onChange={(e) => setMsTitleAr(e.target.value)}
                        className="bg-white border border-slate-200 text-[10px] px-2 py-1 rounded w-full outline-none"
                      />
                      <div className="flex gap-1">
                        <input
                          type="date"
                          required
                          value={msDueDate}
                          onChange={(e) => setMsDueDate(e.target.value)}
                          className="bg-white border border-slate-200 text-[9px] px-2 py-0.5 rounded w-full outline-none"
                        />
                        <button type="submit" className="bg-sudan-green text-white text-[9px] px-2 rounded cursor-pointer font-bold shrink-0">
                          {currentLanguage === "ar" ? "+ أضف" : "+ Add"}
                        </button>
                      </div>
                    </form>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-8 rounded-3xl text-center text-slate-400 font-semibold">
          <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2 animate-bounce" />
          {currentLanguage === "ar" ? "لا توجد مساحات عمل تم تشكيلها بعد" : "No collaboration workspaces formed yet"}
        </div>
      )}

    </div>
  );
}
