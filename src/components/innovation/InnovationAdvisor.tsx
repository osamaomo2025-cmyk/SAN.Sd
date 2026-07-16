/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Send, Brain, Bot, HelpCircle, ArrowRight, CornerDownLeft, Loader2, Users } from "lucide-react";

interface InnovationAdvisorProps {
  currentLanguage: "ar" | "en";
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function InnovationAdvisor({ currentLanguage }: InnovationAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: currentLanguage === "ar"
        ? "مرحباً بك في بوابة المستشار الذكي للابتكار والملكية الفكرية. أنا هنا لإرشادك في صياغة براءات الاختراع، وتقييم الجاهزية التكنولوجية TRL، واقتراح قنوات تمويل ملائمة لمشروعك، وتسهيل تحالفك الصناعي الموحد."
        : "Welcome to the Sovereign Innovation & IP AI Advisor. I am here to guide you through patent drafting rules, TRL evaluations, funding pathways, and industrial partnerships matching."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Predefined prompts/pills
  const presetPills = currentLanguage === "ar" ? [
    { label: "كيف أصيغ بنود الحماية لبراءة اختراع سودانية؟", query: "كيف أصيغ بنود وعناصر الحماية الفنية لبراءة اختراع في السودان بموجب القانون الفيدرالي؟" },
    { label: "مطابقة التمويل لمشروع زراعي ناشئ", query: "ما هي صناديق التمويل والمنح المتاحة لمشروع زراعي ذكي بوعاء ميزانية 50 مليون جنيه؟" },
    { label: "تقييم مستوى TRL ونقل التكنولوجيا للمصانع", query: "كيف أقوم بترقية مستوى الجاهزية التكنولوجية TRL 5 إلى TRL 9 لتسهيل الترخيص التجاري؟" },
    { label: "حماية المؤشرات الجغرافية لإنتاج الصمغ العربي", query: "كيف يمكنني تسجيل مؤشر جغرافي سيادي لحماية الصمغ العربي السوداني دولياً؟" }
  ] : [
    { label: "How to draft patent claims?", query: "How to draft technical patent claims for a mechanical invention under Sudanese IP law?" },
    { label: "Funding for smart agri startups", query: "What funding grants are available for a smart agriculture technology with 50M SDG budget?" },
    { label: "TRL 5 to TRL 9 roadmap", query: "What are the requirements to scale my university prototype from TRL 5 to TRL 9 for industry deployment?" },
    { label: "Gum Arabic geographical protection", query: "How do we register a sovereign geographical indication (GI) for Sudanese Gum Arabic?" }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the server API endpoint for the AI Innovation Advisor
      const response = await fetch("/api/innovation/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMsg,
          lang: currentLanguage
        })
      });

      if (!response.ok) {
        throw new Error("Server response error");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("AI Advisor call failed:", error);
      // Fallback response with professional advice if API is unresponsive
      setTimeout(() => {
        const fallback = currentLanguage === "ar"
          ? `عذراً، واجهت البوابة الفيدرالية مشكلة اتصال مؤقتة. إليك التوصية الفنية المبدئية:\n\n1. **مطابقة التشريعات**: تأكد من مراجعة الباب الرابع لقانون براءات الاختراع والملكية الفكرية السوداني.\n2. **بناء الملف**: قم بإدراج مخطط ميكانيكي هجين كامل ومفصل مع ترجمة عناصر الحماية باللغتين العربية والإنجليزية.\n3. **التمويل الفيدرالي**: يمكنك تقديم طلب تخصيص مباشر عبر شريحة "تمويل تطوير التكنولوجيا" في صندوق الابتكار لعام 2026.`
          : `Apologies, the federal gateway experienced a temporary connection timeout. Here is the sovereign recommendation:\n\n1. **Regulatory Alignment**: Ensure your patent application conforms to Chapter 4 of the Sudanese Patent & Trademark Office bylaws.\n2. **Filing Readiness**: Detail all claims comprehensively, pairing Arabic and English translations of industrial designs.\n3. **Fund Matching**: We recommend filing for an allocation under the "Technology Development Fund" category within the Innovation Fund 2035 portal.`;
        
        setMessages(prev => [...prev, { role: "assistant", content: fallback }]);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
      
      {/* Advisor Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
        <div className="w-10 h-10 rounded-2xl bg-sudan-green/5 text-sudan-green flex items-center justify-center shrink-0">
          <Brain className="h-5.5 w-5.5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base flex items-center gap-1">
            <span>{currentLanguage === "ar" ? "المستشار الفيدرالي الذكي للابتكار والملكيات الفكرية" : "Sovereign AI Innovation & IP Advisor"}</span>
            <span className="bg-[#FFD700]/10 text-sudan-gold border border-[#FFD700]/20 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              Gemini Flash
            </span>
          </h4>
          <p className="text-[10px] text-slate-500 font-medium">
            {currentLanguage === "ar" 
              ? "تحليل السياسات براءات الاختراع، التوفيق بين الجامعات والمصانع، وتقييم ملاءمة ملفات التمويل الفيدرالية."
              : "Analyze patent claims, matchmaking university outputs with factories, and evaluate funding applications."}
          </p>
        </div>
      </div>

      {/* Preset prompt pills */}
      <div className="space-y-1">
        <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
          {currentLanguage === "ar" ? "توصيات ومحاور جاهزة للاستعلام" : "Suggested Consultation Paths"}
        </span>
        <div className="flex flex-wrap gap-2">
          {presetPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(pill.query)}
              disabled={isLoading}
              className="bg-slate-50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 border border-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all text-right"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message Chat Area */}
      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 h-80 overflow-y-auto space-y-4 flex flex-col">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";

          return (
            <div 
              key={idx}
              className={`flex gap-3 max-w-[85%] text-xs ${isUser ? "self-end flex-row-reverse" : "self-start"}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                isUser 
                  ? "bg-slate-900 border-slate-800 text-white" 
                  : "bg-white border-slate-200 text-sudan-green"
              }`}>
                {isUser ? <Users className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`p-3.5 rounded-2xl shadow-sm leading-relaxed whitespace-pre-line font-bold ${
                isUser 
                  ? "bg-slate-900 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 border border-slate-150 rounded-tl-none"
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] text-xs self-start items-center">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-sudan-green flex items-center justify-center shrink-0">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="p-3.5 bg-white text-slate-400 border border-slate-150 rounded-2xl rounded-tl-none font-bold italic">
              {currentLanguage === "ar" ? "المستشار الفيدرالي يقوم بتحليل الملف وتوليد التوصيات..." : "Sovereign Advisor is drafting policy recommendation..."}
            </div>
          </div>
        )}
      </div>

      {/* Chat sender input form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} 
        className="flex gap-2 items-center bg-slate-50 border border-slate-200 p-2 rounded-2xl"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder={currentLanguage === "ar" ? "اسأل المستشار عن القوانين، التمويل، براءات الاختراع..." : "Ask advisor about IP laws, grants, patent drafting..."}
          className="w-full bg-transparent text-xs px-2 py-2 outline-none font-bold text-[#1E293B]"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-sudan-green hover:bg-sudan-green-light text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shrink-0 disabled:opacity-50"
        >
          <span>{currentLanguage === "ar" ? "أرسل الاستشارة" : "Consult"}</span>
          <CornerDownLeft className="h-3.5 w-3.5" />
        </button>
      </form>

    </div>
  );
}
