/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, Search, BookOpen, Download, UserCheck, 
  Layers, Users, Calendar, Trophy, Globe, Award, AlertCircle 
} from "lucide-react";
import { InnovationChallenge, ExpertProfile, KnowledgeDoc } from "./InnovationTypes";

interface KnowledgeEconomyProps {
  currentLanguage: "ar" | "en";
  challenges: InnovationChallenge[];
  experts: ExpertProfile[];
  docs: KnowledgeDoc[];
  onParticipateChallenge: (id: string) => void;
  onDownloadDoc: (id: string) => void;
}

export default function KnowledgeEconomy({
  currentLanguage,
  challenges,
  experts,
  docs,
  onParticipateChallenge,
  onDownloadDoc
}: KnowledgeEconomyProps) {
  const [activeSubTab, setActiveSubTab] = useState<"challenges" | "experts" | "repository">("challenges");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChallenges = challenges.filter((c) => 
    c.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExperts = experts.filter((e) => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.fieldAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.fieldEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocs = docs.filter((d) => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Banner introduction with sub-tabs */}
      <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm space-y-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-[#1E293B] text-base md:text-lg">
            {currentLanguage === "ar" ? "بوابة اقتصاد المعرفة والمنافسات الوطنية" : "Knowledge Economy, Expert Networks & Innovation Challenges"}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {currentLanguage === "ar" 
              ? "مبادرات الابتكار الوطني، التحديات الفيدرالية، أدلة التقييم، شبكة الخبراء السودانية، والمستودع المعرفي الرقمي الموحد."
              : "Federal innovation challenges, technology hackathons, digital guides, verified experts networks, and national research repository."}
          </p>
        </div>

        {/* Sub-tab selection */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => { setActiveSubTab("challenges"); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "challenges"
                ? "bg-sudan-green text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>{currentLanguage === "ar" ? "التحديات والهاكاثونات الوطنية" : "Challenges & Hackathons"}</span>
          </button>

          <button
            onClick={() => { setActiveSubTab("experts"); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "experts"
                ? "bg-sudan-green text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{currentLanguage === "ar" ? "شبكة الاستشاريين والعلماء" : "Consultants & Experts Network"}</span>
          </button>

          <button
            onClick={() => { setActiveSubTab("repository"); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "repository"
                ? "bg-sudan-green text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>{currentLanguage === "ar" ? "المستودع المعرفي والوثائق" : "Sovereign PDF Repository"}</span>
          </button>
        </div>
      </div>

      {/* Unified Search for Sub-tab */}
      <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder={
              activeSubTab === "challenges"
                ? (currentLanguage === "ar" ? "بحث عن التحديات..." : "Search challenges...")
                : activeSubTab === "experts"
                ? (currentLanguage === "ar" ? "بحث في شبكة الاستشاريين..." : "Search experts...")
                : (currentLanguage === "ar" ? "بحث في المستودع المعرفي..." : "Search documents...")
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs pl-8 pr-3.5 py-2 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Render Sub-tab Content */}
      <div className="space-y-4">
        
        {/* Sub-tab 1: Challenges */}
        {activeSubTab === "challenges" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChallenges.length > 0 ? (
              filteredChallenges.map((c) => {
                const isOpen = c.status === "open";
                const isEvaluating = c.status === "evaluating";

                return (
                  <div key={c.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                          isOpen
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isEvaluating
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          {c.status}
                        </span>

                        <span className="font-mono text-xs font-extrabold text-sudan-green">
                          {c.rewardPool.toLocaleString()} SDG {currentLanguage === "ar" ? "جوائز" : "Pool"}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-[#1E293B] text-sm leading-snug">
                        {currentLanguage === "ar" ? c.titleAr : c.titleEn}
                      </h4>

                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {currentLanguage === "ar" ? c.descriptionAr : c.descriptionEn}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                        <Calendar className="h-3.5 w-3.5 text-sudan-gold" />
                        <span>{currentLanguage === "ar" ? `الموعد: ${c.deadline}` : `Deadline: ${c.deadline}`}</span>
                        <span>•</span>
                        <span>{c.participantsCount} {currentLanguage === "ar" ? "مشارك" : "Participants"}</span>
                      </div>

                      {isOpen ? (
                        <button
                          onClick={() => onParticipateChallenge(c.id)}
                          className="bg-slate-900 text-[#FFD700] hover:bg-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="h-3.5 w-3.5 animate-bounce" />
                          <span>{currentLanguage === "ar" ? "تسجيل المشاركة في التحدي" : "Register Participation"}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          {currentLanguage === "ar" ? "مغلق للتحكيم" : "Judging Phase"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-6 text-slate-400 font-semibold bg-white border border-gray-200 rounded-3xl">
                {currentLanguage === "ar" ? "لا توجد تحديات مطابقة للبحث" : "No challenges matches query"}
              </div>
            )}
          </div>
        )}

        {/* Sub-tab 2: Experts Network */}
        {activeSubTab === "experts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExperts.length > 0 ? (
              filteredExperts.map((exp) => (
                <div key={exp.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                      <Users className="h-6 w-6" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base leading-snug">
                        {exp.name}
                      </h4>
                      <p className="text-[11px] font-bold text-sudan-green">
                        {currentLanguage === "ar" ? exp.fieldAr : exp.fieldEn}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {currentLanguage === "ar" ? exp.organizationAr : exp.organizationEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-[10px]">
                    <div className="flex gap-2 font-bold text-slate-600">
                      <span>{exp.publicationsCount} {currentLanguage === "ar" ? "منشور علمي" : "Publications"}</span>
                      <span>•</span>
                      <span>{exp.patentsCount} {currentLanguage === "ar" ? "براءات اختراع" : "Patents"}</span>
                    </div>

                    <a
                      href={`mailto:${exp.email}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1 rounded-lg text-[10px] transition-colors"
                    >
                      {currentLanguage === "ar" ? "طلب استشارة فنية" : "Contact Consultant"}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-6 text-slate-400 font-semibold bg-white border border-gray-200 rounded-3xl">
                {currentLanguage === "ar" ? "لا توجد خبرات مطابقة للبحث" : "No consultants matches query"}
              </div>
            )}
          </div>
        )}

        {/* Sub-tab 3: Document Repository */}
        {activeSubTab === "repository" && (
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="p-4 text-right">{currentLanguage === "ar" ? "عنوان الدليل / الوثيقة المعرفية" : "Document & Guide Title"}</th>
                    <th className="p-4">{currentLanguage === "ar" ? "التصنيف" : "Category"}</th>
                    <th className="p-4">{currentLanguage === "ar" ? "المؤلف" : "Publisher"}</th>
                    <th className="p-4">{currentLanguage === "ar" ? "التاريخ" : "Publish Date"}</th>
                    <th className="p-4 text-center">{currentLanguage === "ar" ? "التنزيلات" : "Downloads"}</th>
                    <th className="p-4 text-center">{currentLanguage === "ar" ? "الإجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Title */}
                        <td className="p-4 text-right">
                          <span className="font-extrabold text-[#1E293B] block max-w-md truncate">
                            {doc.title}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="p-4 font-bold text-slate-600">
                          {doc.category === "patent_guide" 
                            ? (currentLanguage === "ar" ? "أدلة البراءات الفيدرالية" : "Patent Filing Guide")
                            : doc.category === "policy"
                            ? (currentLanguage === "ar" ? "سياسات اقتصاد المعرفة" : "National Policy")
                            : (currentLanguage === "ar" ? "دراسة معملية" : "Research study")}
                        </td>

                        {/* Publisher */}
                        <td className="p-4 text-slate-500 font-bold">{doc.author}</td>

                        {/* Date */}
                        <td className="p-4 text-slate-400 font-bold">{doc.date}</td>

                        {/* Downloads */}
                        <td className="p-4 text-center font-mono font-extrabold text-slate-700">
                          {doc.downloads.toLocaleString()}
                        </td>

                        {/* Download CTA */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => onDownloadDoc(doc.id)}
                            className="p-1.5 bg-sudan-green/5 hover:bg-sudan-green/10 text-sudan-green border border-sudan-green/20 rounded-lg cursor-pointer transition-colors"
                            title={currentLanguage === "ar" ? "تحميل الدليل الرقمي" : "Download PDF"}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400 font-semibold">
                        {currentLanguage === "ar" ? "لا توجد مستندات معتمدة مطابقة للبحث" : "No documents matches query"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
