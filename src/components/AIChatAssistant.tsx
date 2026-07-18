/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, HelpCircle, Sparkles, User, RefreshCw, AlertCircle, Volume2 } from "lucide-react";
import { ChatMessage } from "../types";

interface AIChatAssistantProps {
  currentLanguage: "ar" | "en";
  userProfile?: any;
}

export default function AIChatAssistant({ currentLanguage, userProfile }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: currentLanguage === "ar" 
        ? "مرحباً بك في منصة وزارة التجارة والصناعة السودانية الرقمية 2035. أنا مساعدك الرقمي المدعم بالذكاء الاصطناعي (Sudan Commerce AI). كيف يمكنني مساعدتك اليوم في شؤون السجل التجاري، التراخيص الصناعية، التصدير والاستيراد، أو حماية المستهلك؟"
        : "Welcome to the Sudan Digital Ministry of Commerce & Industry Platform 2035. I am your Sudan Commerce AI Assistant. How can I assist you today with commercial registration, industrial licenses, imports/exports, or consumer protection?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: currentLanguage === "ar" 
        ? ["كيف أسجل شركة جديدة؟", "أبرز الفرص الاستثمارية لعام 2035", "كيفية إصدار شهادة المنشأ", "تقديم شكوى لحماية المستهلك"]
        : ["How do I register a new company?", "Key investment opportunities 2035", "How to issue Certificate of Origin", "Submit a consumer protection report"]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMinimized]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Keep only recent 8 messages for context to optimize speed
      const recentHistory = messages
        .filter(m => m.id !== "welcome")
        .slice(-8)
        .map(m => ({
          sender: m.sender,
          text: m.text
        }));

      const context = {
        language: currentLanguage,
        userRole: userProfile?.role || "guest",
        userName: userProfile?.fullName || "Guest User"
      };

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: recentHistory,
          context
        })
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI error:", error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: currentLanguage === "ar"
          ? "عذراً، حدث خطأ أثناء الاتصال بمساعد الذكاء الاصطناعي. يرجى تكرار المحاولة."
          : "Sorry, there was an issue communicating with the AI Assistant. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: currentLanguage === "ar"
          ? "تمت إعادة تهيئة المساعد الذكي. كيف يمكنني إرشادك الآن؟"
          : "AI Assistant has been reset. How can I guide you now?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: currentLanguage === "ar"
          ? ["كيف أسجل شركة جديدة؟", "أبرز الفرص الاستثمارية لعام 2035", "كيفية إصدار شهادة المنشأ", "تقديم شكوى لحماية المستهلك"]
          : ["How do I register a new company?", "Key investment opportunities 2035", "How to issue Certificate of Origin", "Submit a consumer protection report"]
      }
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {isMinimized && (
        <motion.button
          id="ai-assistant-launcher"
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 left-6 z-40 bg-sudan-green text-white p-3 rounded-full shadow-2xl flex items-center gap-1.5 hover:bg-sudan-green-light transition-all cursor-pointer border border-sudan-gold duration-300 glow-sudan"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-sudan-gold w-2 h-2 rounded-full animate-ping"></span>
          </div>
          <span className="font-semibold text-xs max-w-0 overflow-hidden md:max-w-xs md:inline-block transition-all duration-300">
            {currentLanguage === "ar" ? "مساعد التجارة الذكي" : "Sudan Commerce AI"}
          </span>
          <Sparkles className="h-3.5 w-3.5 text-sudan-gold" />
        </motion.button>
      )}

      {/* Main Chat Assistant Window */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            id="ai-assistant-window"
            className={`fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto z-40 w-full md:max-w-[330px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[60vh] md:h-[450px] ${
              currentLanguage === "ar" ? "text-right" : "text-left"
            }`}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="bg-sudan-dark text-slate-900 px-3 py-2 flex items-center justify-between border-b border-sudan-gold">
              <div className="flex items-center gap-2">
                <div className="bg-sudan-green p-1.5 rounded-lg border border-sudan-gold flex items-center justify-center">
                  <Bot className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs tracking-wide text-slate-900">
                    {currentLanguage === "ar" ? "مساعد التجارة الذكي" : "Commerce AI"}
                  </h3>
                  <p className="text-[9px] text-slate-700 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
                    {currentLanguage === "ar" ? "رؤية السودان 2035" : "Sudan Vision 2035"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={clearChat} 
                  title={currentLanguage === "ar" ? "إعادة تهيئة المحادثة" : "Reset chat"}
                  className="p-1 hover:bg-sudan-dark-light/20 rounded-lg text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => setIsMinimized(true)} 
                  className="px-1.5 py-0.5 bg-sudan-green hover:bg-sudan-green-light text-white rounded text-[10px] font-bold transition-colors"
                >
                  {currentLanguage === "ar" ? "تصغير" : "Minimize"}
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
                >
                  {msg.sender === "ai" && (
                    <div className="h-7 w-7 rounded-full bg-sudan-green flex items-center justify-center text-white text-xs shrink-0 border border-sudan-gold">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div className="max-w-[85%]">
                    <div 
                      className={`p-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.sender === "user" 
                          ? "bg-sudan-green text-white rounded-tr-none" 
                          : "bg-white text-slate-800 shadow-xs border border-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 block px-1">
                      {msg.timestamp}
                    </span>

                    {/* Suggestions list for AI response */}
                    {msg.sender === "ai" && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(sug)}
                            className="bg-white hover:bg-sudan-gold hover:text-white text-[10px] text-slate-600 font-bold px-2 py-1 rounded-lg border border-slate-200 transition-all hover:scale-102 hover:shadow-xs"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.sender === "user" && (
                    <div className="h-7 w-7 rounded-full bg-sudan-dark flex items-center justify-center text-white text-xs shrink-0 border border-sudan-gold">
                      <User className="h-3.5 w-3.5 text-sudan-gold" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-center gap-1.5">
                  <div className="h-7 w-7 rounded-full bg-sudan-green flex items-center justify-center text-white shrink-0 border border-sudan-gold">
                    <Bot className="h-3.5 w-3.5 animate-bounce" />
                  </div>
                  <div className="bg-white p-2.5 rounded-xl rounded-tl-none shadow-xs border border-slate-200 flex items-center gap-1">
                    <span className="w-1 h-1 bg-sudan-green rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-1 bg-sudan-green rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-1 bg-sudan-green rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input field */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                placeholder={
                  currentLanguage === "ar" 
                    ? "اسأل عن السجل، التراخيص..." 
                    : "Ask about registration, licenses..."
                }
                className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs px-3 py-2 rounded-xl outline-none border border-transparent focus:border-sudan-gold transition-all"
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="bg-sudan-green hover:bg-sudan-green-light disabled:opacity-50 text-white p-2 rounded-xl cursor-pointer transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            
            {/* Info footer */}
            <div className="bg-slate-100 px-3 py-1.5 text-[9px] text-slate-400 flex items-center justify-between border-t border-slate-200">
              <span>{currentLanguage === "ar" ? "الخدمات الموثوقة 🇸🇩" : "Sovereign Portal"}</span>
              <span className="flex items-center gap-0.5 font-mono">
                <Sparkles className="h-2.5 w-2.5 text-sudan-gold fill-sudan-gold" />
                Gemini 3.5
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
