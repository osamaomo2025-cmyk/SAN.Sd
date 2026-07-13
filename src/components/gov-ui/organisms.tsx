/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ChevronUp, ChevronDown, Award, CheckCircle2, Shield, Eye, FileText, 
  Trash2, Search, ArrowRight, ArrowLeft, Send, Sparkles, AlertCircle, Bookmark, Printer, Loader2
} from "lucide-react";
import { SovereignTypography, SovereignButton, SovereignBadge } from "./atoms";

// ==========================================
// 1. ENTERPRISE DATA GRID
// ==========================================

export interface ColumnDef<T> {
  key: keyof T | string;
  headerAr: string;
  headerEn: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  currentLanguage?: "ar" | "en";
  titleAr: string;
  titleEn: string;
  pageSize?: number;
  rowActions?: (row: T) => React.ReactNode;
}

export function SovereignDataGrid<T extends { id: string | number }>({
  data,
  columns,
  currentLanguage = "ar",
  titleAr,
  titleEn,
  pageSize = 5,
  rowActions
}: DataGridProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Search filter
  const filteredData = data.filter((row) => {
    return Object.values(row).some((val) => {
      if (!val) return false;
      return String(val).toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = (a as any)[sortKey];
    const valB = (b as any)[sortKey];
    if (valA === undefined || valB === undefined) return 0;

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Grid Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <SovereignTypography variant="h3" className="font-extrabold text-sudan-green">
            {currentLanguage === "ar" ? titleAr : titleEn}
          </SovereignTypography>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {currentLanguage === "ar"
              ? `عرض ${filteredData.length} سجل متاح في قاعدة البيانات الاتحادية`
              : `Displaying ${filteredData.length} sovereign items found`}
          </p>
        </div>

        {/* Live Filter input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={currentLanguage === "ar" ? "تصفية فورية..." : "Quick filter..."}
            className="w-full text-xs p-2.5 ltr:pl-9 rtl:pr-9 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-sudan-green focus:ring-1 focus:ring-sudan-green outline-none transition-all"
          />
          <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Actual responsive Table */}
      <div className="overflow-x-auto border border-gray-100 rounded-2xl">
        <table className="w-full text-right border-collapse text-xs" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-bold">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => col.sortable !== false && handleSort(col.key as string)}
                  className={`p-3.5 select-none ${col.sortable !== false ? "cursor-pointer hover:bg-gray-100" : ""} text-right`}
                >
                  <div className="flex items-center gap-1">
                    <span>{currentLanguage === "ar" ? col.headerAr : col.headerEn}</span>
                    {col.sortable !== false && sortKey === col.key && (
                      sortOrder === "asc" ? <ChevronUp className="h-3 w-3 text-sudan-green" /> : <ChevronDown className="h-3 w-3 text-sudan-green" />
                    )}
                  </div>
                </th>
              ))}
              {rowActions && <th className="p-3.5 text-center">{currentLanguage === "ar" ? "خيارات سيادية" : "Actions"}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="p-3.5 align-middle">
                      {col.render ? col.render(row) : String((row as any)[col.key] || "-")}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="p-3.5 text-center align-middle">
                      <div className="flex justify-center items-center gap-2">
                        {rowActions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="text-center p-10 text-gray-400">
                  {currentLanguage === "ar" ? "لا توجد سجلات مطابقة للبحث." : "No matching records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs">
        <span className="text-gray-400">
          {currentLanguage === "ar"
            ? `الصفحة ${currentPage} من ${totalPages}`
            : `Page ${currentPage} of ${totalPages}`}
        </span>

        <div className="flex items-center gap-1">
          <SovereignButton
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-2 rounded-lg"
          >
            {currentLanguage === "ar" ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          </SovereignButton>
          
          <SovereignButton
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-2 rounded-lg"
          >
            {currentLanguage === "ar" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </SovereignButton>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. SOVEREIGN DOCUMENT VIEWER
// ==========================================

interface DocumentViewerProps {
  titleAr: string;
  titleEn: string;
  docId: string;
  issueDate: string;
  expiryDate?: string;
  ownerAr: string;
  ownerEn: string;
  additionalDetails?: { labelAr: string; labelEn: string; value: string }[];
  currentLanguage?: "ar" | "en";
  watermarkTextAr?: string;
}

export const SovereignDocumentViewer: React.FC<DocumentViewerProps> = ({
  titleAr,
  titleEn,
  docId,
  issueDate,
  expiryDate,
  ownerAr,
  ownerEn,
  additionalDetails = [],
  currentLanguage = "ar",
  watermarkTextAr = "جمهورية السودان - وزارة التجارة والصناعة"
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="border border-gray-300 rounded-3xl bg-white shadow-xl max-w-2xl mx-auto overflow-hidden relative print:border-none print:shadow-none">
      {/* Official Government Top Header Ribbon */}
      <div className="bg-gradient-to-r from-[#007A33] via-[#C5A059] to-[#007A33] h-2 w-full" />
      
      {/* Document Watermark overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none z-0">
        <p className="text-4xl md:text-5xl font-black text-center text-sudan-green uppercase tracking-wider rotate-12 leading-relaxed">
          {watermarkTextAr}
        </p>
      </div>

      <div className="p-8 space-y-6 relative z-10">
        
        {/* State Emblem & Crest header row */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-5">
          <div className="text-right">
            <h3 className="font-extrabold text-xs text-sudan-green">جمهورية السودان</h3>
            <p className="text-[10px] text-gray-400 font-bold">وزارة التجارة والصناعة الرقمية</p>
            <p className="text-[9px] text-gray-400 font-bold font-mono">DATE: {issueDate}</p>
          </div>

          {/* Symmetrical Emblem placeholder */}
          <div className="w-12 h-12 bg-sudan-green/5 border border-sudan-gold/20 rounded-2xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-sudan-gold" />
          </div>

          <div className="text-left">
            <h3 className="font-extrabold text-xs text-sudan-green font-sans">Republic of Sudan</h3>
            <p className="text-[10px] text-gray-400 font-bold font-sans">Ministry of Commerce & Industry</p>
            <p className="text-[9px] text-gray-400 font-bold font-mono">REG-ID: {docId}</p>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center py-2 space-y-1">
          <h2 className="text-lg md:text-xl font-black text-sudan-dark">
            {currentLanguage === "ar" ? titleAr : titleEn}
          </h2>
          <span className="inline-block bg-sudan-green/10 text-sudan-green px-3 py-1 rounded-full text-[10px] font-black tracking-wide font-mono">
            {docId}
          </span>
        </div>

        {/* Certificate Owner Name */}
        <div className="bg-slate-50 rounded-2xl p-4.5 border border-gray-100 text-center space-y-1">
          <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
            {currentLanguage === "ar" ? "الجهة الممنوح لها / المستثمر المستفيد" : "Verified Sovereign Beneficiary"}
          </p>
          <h3 className="text-base font-black text-sudan-green">
            {ownerAr}
          </h3>
          <p className="text-xs font-bold text-gray-400 font-sans">
            {ownerEn}
          </p>
        </div>

        {/* Grid of details */}
        <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-gray-100/50">
          <div>
            <p className="text-[10px] text-gray-400 font-bold">
              {currentLanguage === "ar" ? "تاريخ الإصدار" : "Issue Date"}
            </p>
            <p className="font-mono font-bold mt-0.5">{issueDate}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold">
              {currentLanguage === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}
            </p>
            <p className="font-mono font-bold mt-0.5 text-rose-600">{expiryDate || "دائم (Permanent)"}</p>
          </div>

          {additionalDetails.map((detail, idx) => (
            <div key={idx} className="border-t border-gray-100/50 pt-2 col-span-2 sm:col-span-1">
              <p className="text-[10px] text-gray-400 font-bold">
                {currentLanguage === "ar" ? detail.labelAr : detail.labelEn}
              </p>
              <p className="font-bold mt-0.5 text-sudan-dark">{detail.value}</p>
            </div>
          ))}
        </div>

        {/* Security Seals & Stamps Footer */}
        <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Symmetrical QR security seal */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-gray-200">
            <div className="w-12 h-12 bg-white p-1 rounded-lg border border-gray-300 flex items-center justify-center shrink-0">
              {/* Dummy QR code using boxes */}
              <div className="grid grid-cols-3 gap-0.5 w-full h-full p-0.5">
                <div className="bg-black"></div>
                <div className="bg-black"></div>
                <div className="bg-white"></div>
                <div className="bg-white"></div>
                <div className="bg-black"></div>
                <div className="bg-black"></div>
                <div className="bg-black"></div>
                <div className="bg-white"></div>
                <div className="bg-black"></div>
              </div>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold">التحقق الرقمي الموحد</p>
              <p className="text-[9px] font-mono font-extrabold text-sudan-gold">SECURE-QR-SUD-35</p>
            </div>
          </div>

          {/* Signature panel with digital seal icon */}
          <div className="text-center sm:text-left">
            <p className="text-[9px] text-gray-400 font-bold">توقيع وختم المسجل العام للتجارة</p>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sudan-green font-extrabold text-[11px] mt-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>موقّع إلكترونياً (Secured)</span>
            </div>
          </div>

        </div>

        {/* Action Panel for export */}
        <div className="pt-2 flex justify-end gap-2 print:hidden">
          <SovereignButton 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            leftIcon={<Printer className="h-3.5 w-3.5" />}
          >
            {currentLanguage === "ar" ? "طباعة الوثيقة" : "Print/PDF Export"}
          </SovereignButton>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 3. AI CHAT & INSIGHT COMPONENT
// ==========================================

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  confidence?: number;
}

interface AIChatProps {
  currentLanguage?: "ar" | "en";
  initialMessages?: Message[];
  onSendMessage?: (msg: string) => Promise<string>;
}

export const SovereignAIChatWindow: React.FC<AIChatProps> = ({
  currentLanguage = "ar",
  initialMessages = [],
  onSendMessage
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      if (onSendMessage) {
        const reply = await onSendMessage(inputValue);
        const aiMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "model",
          content: reply,
          confidence: 0.98
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Mock default
        setTimeout(() => {
          const aiMsg: Message = {
            id: `msg-${Date.now() + 1}`,
            role: "model",
            content: currentLanguage === "ar" 
              ? "أهلاً بك في بوابة الاستعلام التجاري الذكية. تم تحليل طلبك وتطبيقه على لوائح وزارة التجارة والصناعة لعام 2035 بنجاح." 
              : "Welcome to the smart commerce portal. Your request has been processed and aligned with Ministry regulations for 2035.",
            confidence: 0.95
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
        }, 1200);
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-5 flex flex-col h-[400px] shadow-2xl relative overflow-hidden">
      {/* Symmetrical golden ai ribbon */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-sudan-gold via-sudan-green to-sudan-gold-light" />
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-sudan-gold animate-pulse" />
          <div>
            <h4 className="font-extrabold text-xs">مساعد التجارة الذكي</h4>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Sudan Sovereign AI Agent v1.0</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">● Active</span>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs font-sans">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div 
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  isUser 
                    ? "bg-sudan-green text-white rounded-br-none" 
                    : "bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/50"
                }`}
              >
                <p>{msg.content}</p>
                {!isUser && msg.confidence && (
                  <div className="flex items-center gap-1 mt-2 text-[9px] text-sudan-gold font-mono border-t border-slate-700 pt-1.5">
                    <span>AI Confidence:</span>
                    <span className="font-extrabold">{(msg.confidence * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 text-slate-400 p-3 rounded-2xl flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-sudan-gold" />
              <span className="text-[10px]">{currentLanguage === "ar" ? "المساعد الذكي يحلل اللوائح..." : "Agent thinking..."}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Form */}
      <form onSubmit={handleSend} className="border-t border-slate-800 pt-3 flex gap-2 z-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={currentLanguage === "ar" ? "اسأل عن لوائح الاستيراد، السجلات، وتراخيص 2035..." : "Ask AI about import rules, custom duties..."}
          className="flex-1 text-xs bg-slate-950 border border-slate-800 outline-none p-3 rounded-xl focus:border-sudan-gold text-slate-200"
        />
        <button 
          type="submit" 
          className="bg-sudan-gold hover:bg-sudan-gold-light text-white p-3 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          {currentLanguage === "ar" ? <Send className="h-4 w-4 transform rotate-180" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
};
