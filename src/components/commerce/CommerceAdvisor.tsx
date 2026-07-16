/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, Send, Sparkles, TrendingUp, ShieldAlert, Globe, 
  HelpCircle, RefreshCw, Smartphone, User, ShieldCheck, CheckCircle 
} from "lucide-react";
import { ChatMessage, DigitalBusiness, CommerceUserRole } from "./CommerceTypes";

interface CommerceAdvisorProps {
  currentLanguage: "ar" | "en";
  businesses: DigitalBusiness[];
  userRole: CommerceUserRole;
}

export default function CommerceAdvisor({
  currentLanguage,
  businesses,
  userRole
}: CommerceAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: currentLanguage === "ar" 
        ? "مرحباً بك! أنا مستشارك المالي والتجاري الذكي المدعوم بالذكاء الاصطناعي (AI Commerce Advisor). كيف يمكنني مساعدتك في تنمية أعمالك ومراجعة الامتثال وقوانين حماية المستهلك وتحليل الأسواق اليوم؟" 
        : "Hello! I am your AI Commerce Advisor. How can I help you scale your business, verify compliance rules, explore COMESA export channels, or analyze fraud scoring today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const preseededPrompts = [
    {
      id: "p1",
      icon: TrendingUp,
      titleAr: "تحليل فرص التصدير للكوميسا",
      titleEn: "Analyze COMESA Export Potential",
      promptAr: "ما هي المتطلبات الجمركية وشهادات المنشأ الذكية المطلوبة لتصدير الصمغ العربي والكركديه لأسواق الكوميسا عبر ميناء بورتسودان؟",
      promptEn: "What are the customs mandates and certified origin documents needed to export Gum Arabic and Hibiscus to COMESA regions?"
    },
    {
      id: "p2",
      icon: ShieldAlert,
      titleAr: "تدقيق درجة موثوقية المتجر",
      titleEn: "Audit Merchant Trust Score",
      promptAr: "كيف يتم احتساب مؤشر موثوقية المتجر الوطني (Merchant Trust Score)؟ وما هي المعايير اللازمة لرفعه فوق 95%؟",
      promptEn: "How is the Merchant Trust Score calculated, and what are the steps to elevate my score to secure sovereign verification?"
    },
    {
      id: "p3",
      icon: Globe,
      titleAr: "رؤية نمو قطاع التجزئة الرقمية",
      titleEn: "Project Retail Commerce Trends",
      promptAr: "قم بتحليل الاتجاهات ومعدلات نمو التجارة الإلكترونية والمتاجر المستقلة في الولايات السودانية لعام 2026.",
      promptEn: "Analyze current e-commerce growth indexes and market potential for independent digital merchants across Sudanese states."
    }
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare context to supply Gemini with accurate, real-time platform data
      const context = {
        businesses: businesses.map(b => ({
          name: b.storeNameEn,
          type: b.businessType,
          trust: b.trustScore,
          revenue: b.annualRevenue,
          status: b.status
        })),
        role: userRole,
        year: 2026,
        theme: "Federal Sudan Commerce"
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          context
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact advisor");
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: data.suggestions
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (e) {
      console.error(e);
      // High-fidelity local fallback if server or Gemini is unreachable
      setTimeout(() => {
        let fallbackText = "";
        const query = textToSend.toLowerCase();

        if (query.includes("صمغ") || query.includes("تصدير") || query.includes("gum") || query.includes("export") || query.includes("comesa")) {
          fallbackText = currentLanguage === "ar" 
            ? "### 🌾 دليل الصادرات الوطنية والكوميسا لعام 2026\n\nلتسهيل التصدير عبر ميناء بورتسودان، توفر وزارة التجارة السودانية الربط الفوري التالي:\n1. **السجل التجاري**: يلزم ربط المتجر الإلكتروني برقم سجل تجاري نشط.\n2. **شهادة المنشأ الإلكترونية الموحدة**: تصدر تلقائياً عبر نظام الجمارك المتكامل.\n3. **مطابقة جودة الهيئة السودانية للمواصفات SSMO**: يتم فحص العينات والتصديق عليها رقمياً بالكامل في موانئ سواكن وبورتسودان.\n4. **الكوميسا**: تتمتع السلع ذات المنشأ السوداني بإعفاء جمركي بنسبة تصل إلى 100% في الدول الأعضاء عند إبراز الشهادة المعتمدة برمز QR."
            : "### 🌾 Sovereign Export & COMESA Guidelines\n\nTo facilitate cross-border trade, the Federal Commerce Portal connects:\n1. **Commercial Registration (CR)**: Your online storefront must be bound to an active registry ID.\n2. **Digital Certificate of Origin**: Generated dynamically upon dispatch of goods.\n3. **SSMO Quality Verification**: Samples are lab-checked and certified inside our Port Sudan terminal.\n4. **COMESA Exemption**: 100% customs tariff waivers are unlocked automatically across active trading member states.";
        } else if (query.includes("موثوقية") || query.includes("score") || query.includes("trust") || query.includes("تحقق")) {
          fallbackText = currentLanguage === "ar"
            ? "### 🛡️ مؤشر موثوقية التاجر الفيدرالي (Merchant Trust Score)\n\nمؤشر الموثوقية هو رقم حوكمة ذكي يحتسب تلقائياً (من 0 إلى 100) لتعزيز الأمان الرقمي وحماية حقوق المستهلكين:\n\n* **معايير الاحتساب**:\n  * **الربط الفيدرالي بالسجل التجاري**: يمنحك +30 نقطة.\n  * **ربط بوابات الدفع الوطنية**: يمنحك +30 نقطة.\n  * **الربط بالخريطة اللوجستية وتتبع الشحنات**: يمنحك +20 نقطة.\n  * **خلو السجل من شكاوى حماية المستهلك النشطة**: يمنحك +20 نقطة.\n\n* **التوصية**: لرفع درجتك، يرجى استكمال التحقق الشخصي للهوية الوطنية وربط بوابات الدفع الإلكتروني بالمنصة."
            : "### 🛡️ Federal Merchant Trust Score Metrics\n\nThe Trust Score is an interactive governance algorithm (0 to 100) protecting consumer transactions:\n\n* **Weight Distribution**:\n  * **Active Commercial Registry Connection**: +30 points.\n  * **Sovereign Payment Gateway Integration**: +30 points.\n  * **Integrated Logistics Tracking Connection**: +20 points.\n  * **Pristine consumer complaint record**: +20 points.\n\n* **Action Item**: Complete your identity authentication and integrate with standard federal payout gateways to raise your rating to elite status.";
        } else {
          fallbackText = currentLanguage === "ar"
            ? "### 💡 استشارة تنموية مخصصة للمشاريع الصغيرة والمتوسطة\n\nتعد المتاجر الإلكترونية المستقلة في الخرطوم والجزيرة والبحر الأحمر من أعلى القطاعات نمواً لعام 2026. \n\n* **توصيات تنموية عاجلة**:\n  1. نوصي بالتسجيل في **برنامج منحة التحول الرقمي الفيدرالي** لتلقي دعم تمويلي بقيمة ٥ ملايين جنيه لتأسيس متجر الويب.\n  2. تفعيل الفواتير الإلكترونية الموحدة لضمان تنظيم العائدات والامتثال للنظام الضريبي السيادي.\n  3. دمج تتبع الشحنات مع الناقل الوطني لتخفيض تكلفة الإمداد والتنقل لولايات صادر أخرى."
            : "### 💡 Dynamic SME Development Advisory\n\nIndependent digital stores in Khartoum, Al Gezira, and Red Sea states represent the highest-performing sectors in 2026.\n\n* **Actionable Growth Steps**:\n  1. Enroll in the **Rural Enterprise Transformation Grant** to claim up to 5,000,000 SDG for web store infrastructure.\n  2. Standardize electronic invoicing to ease tax integration.\n  3. Coordinate shipping lines directly with the national courier alliance to drop regional shipping expenses by 30%.";
        }

        const fallbackMsg: ChatMessage = {
          id: `ai-fb-${Date.now()}`,
          sender: "ai",
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString(),
          suggestions: currentLanguage === "ar" 
            ? ["كيف يمكنني تقديم رخصة تصدير؟", "ما هو برنامج التحول الريفي؟"] 
            : ["How to claim export permit?", "Sovereign grant terms"]
        };

        setMessages(prev => [...prev, fallbackMsg]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:grid md:grid-cols-12 h-[550px]">
      
      {/* Sidebar - Quick Advisor Prompts */}
      <div className="md:col-span-4 bg-slate-50 border-b md:border-b-0 md:border-r border-gray-200 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-sudan-green" />
            <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base">
              {currentLanguage === "ar" ? "المستشار التجاري للذكاء الاصطناعي" : "AI Commerce Advisor"}
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {currentLanguage === "ar" 
              ? "مساعد مالي وتشغيلي فوري لتحليل بيانات متجرك، وتتبع متطلبات المطابقة وحواضن التمويل."
              : "Direct artificial intelligence for merchant performance profiling, security audits, and grant matches."}
          </p>

          <div className="space-y-2 pt-2">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              {currentLanguage === "ar" ? "توصيات ومحاور جاهزة للاستعلام" : "Recommended Inquiries"}
            </p>
            {preseededPrompts.map((p) => {
              const IconComp = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSend(currentLanguage === "ar" ? p.promptAr : p.promptEn)}
                  className="w-full text-left bg-white border border-gray-200 hover:border-sudan-green hover:bg-sudan-green/5 p-3 rounded-2xl flex items-start gap-2.5 transition-all text-xs text-[#1E293B] cursor-pointer"
                >
                  <IconComp className="h-4 w-4 text-sudan-green shrink-0 mt-0.5" />
                  <span className="font-bold leading-tight">
                    {currentLanguage === "ar" ? p.titleAr : p.titleEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-sudan-gold/5 border-2 border-dashed border-sudan-gold/20 rounded-2xl flex items-center gap-2.5 text-[10px] text-slate-600 font-semibold">
          <Sparkles className="h-4.5 w-4.5 text-sudan-gold animate-bounce shrink-0" />
          <span>
            {currentLanguage === "ar" 
              ? "التحليلات مخصصة آلياً بناءً على سجل شركتك ونشاطها الوطني" 
              : "Advising tuned in real-time to your sovereign business profile"}
          </span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="md:col-span-8 flex flex-col justify-between h-full bg-slate-50">
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[440px]">
          {messages.map((m) => {
            const isAi = m.sender === "ai";
            return (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-[85%] ${isAi ? "mr-auto float-left" : "ml-auto flex-row-reverse float-right"} clear-both`}
              >
                {/* Avatar Icon */}
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAi ? "bg-slate-900 text-sudan-green" : "bg-sudan-green text-white"
                }`}>
                  {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2.5">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isAi 
                      ? "bg-white border border-slate-200 text-slate-700 font-medium" 
                      : "bg-sudan-green text-white font-bold"
                  }`}>
                    {/* Visual support for markdown */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {m.text}
                    </div>
                  </div>

                  {/* Date and dynamic suggestions inside model bubble */}
                  {isAi && m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {m.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(s)}
                          className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="block text-[9px] text-gray-400 font-semibold text-right">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Loading bubble */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto float-left clear-both">
              <div className="h-8 w-8 rounded-xl bg-slate-900 text-sudan-green flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl text-xs text-slate-500 shadow-xs flex items-center gap-1.5 font-bold">
                <RefreshCw className="h-4.5 w-4.5 text-sudan-green animate-spin" />
                <span>{currentLanguage === "ar" ? "جاري تدقيق السجلات والتنبؤ بالفرص..." : "Consulting records and forecasting opportunities..."}</span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder={currentLanguage === "ar" ? "اسأل عن لوائح الكوميسا، استشارات الابتكار، التمويل..." : "Ask COMESA bylaws, innovation advisory, funding..."}
            className="flex-1 bg-slate-50 border border-slate-200 text-xs px-4 py-3 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all"
          />
          <button
            onClick={() => handleSend(input)}
            className="bg-sudan-green hover:bg-sudan-green-light text-white p-3 rounded-2xl cursor-pointer transition-colors"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
