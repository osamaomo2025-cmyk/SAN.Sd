/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Bell, Mail, MessageSquare, Send, Calendar, Clock, RefreshCw, CheckCircle2, ShieldCheck, Plus, X } from "lucide-react";

interface Notification {
  id: string;
  titleAr: string;
  titleEn: string;
  recipient: string;
  channel: "sms" | "email" | "push" | "all";
  status: "delivered" | "scheduled" | "failed";
  timestamp: string;
  messageAr: string;
  messageEn: string;
  scheduledFor?: string;
}

interface SmartNotificationCenterProps {
  currentLanguage: "ar" | "en";
  notifications: Notification[];
  onAddNotification: (notification: Notification) => void;
  userRole: string;
}

export default function SmartNotificationCenter({
  currentLanguage,
  notifications,
  onAddNotification,
  userRole
}: SmartNotificationCenterProps) {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [recipient, setRecipient] = useState("");
  const [channel, setChannel] = useState<"sms" | "email" | "push" | "all">("all");
  const [messageAr, setMessageAr] = useState("");
  const [messageEn, setMessageEn] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !titleEn || !recipient || !messageAr || !messageEn) {
      alert(currentLanguage === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        titleAr,
        titleEn,
        recipient,
        channel,
        messageAr,
        messageEn,
        scheduledFor: scheduleDate || undefined
      };

      const response = await fetch("/api/commerce/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to send notification");

      const data = await response.json();
      onAddNotification(data.notification);
      setIsComposeOpen(false);

      // Reset
      setTitleAr("");
      setTitleEn("");
      setRecipient("");
      setMessageAr("");
      setMessageEn("");
      setScheduleDate("");
    } catch (err) {
      console.error(err);
      alert("Error enqueuing notification.");
    } finally {
      setSubmitting(false);
    }
  };

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case "sms":
        return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Notifications Header */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h4 className="font-extrabold text-slate-800 text-xs md:text-sm uppercase tracking-wider">
            {currentLanguage === "ar" ? "مركز الإشعارات السيادية الذكي ومتابعة التسليم" : "Sovereign Multi-Channel Notification Dispatcher"}
          </h4>
          <p className="text-gray-400 text-xs font-semibold">
            {currentLanguage === "ar" 
              ? "إرسال وتتبع الرسائل النصية القصيرة (SMS)، رسائل البريد الإلكتروني والإشعارات الفورية للأنشطة والشركات."
              : "Dispatch and monitor real-time SMS, Email, and Push notifications with legal auditing verification logs."}
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ml-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{currentLanguage === "ar" ? "إنشاء وتوجيه إشعار جديد" : "Compose Sovereign Notification"}</span>
        </button>
      </div>

      {/* Notifications Grid / List */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h5 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider">
            {currentLanguage === "ar" ? `سجل الإرسال الكلي (${notifications.length})` : `Multi-channel Dispatch Logs (${notifications.length})`}
          </h5>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {notifications.map((ntf) => (
            <div key={ntf.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-right">
              
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-xl border border-slate-200 shrink-0 mt-0.5">
                  {getChannelIcon(ntf.channel)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h5 className="font-extrabold text-slate-800 text-xs md:text-sm">
                      {currentLanguage === "ar" ? ntf.titleAr : ntf.titleEn}
                    </h5>
                    <span className="text-[9px] font-mono text-gray-400 font-bold bg-white border border-slate-200 px-1.5 py-0.2 rounded-md">
                      {ntf.recipient}
                    </span>
                  </div>

                  <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed font-semibold">
                    {currentLanguage === "ar" ? ntf.messageAr : ntf.messageEn}
                  </p>

                  <div className="text-[9px] text-gray-400 font-bold flex items-center gap-1 font-mono pt-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(ntf.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 sm:self-center self-start">
                {ntf.status === "delivered" && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {currentLanguage === "ar" ? "تم التسليم" : "Delivered"}
                  </span>
                )}
                {ntf.status === "scheduled" && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
                    <Calendar className="h-3 w-3 text-indigo-600" />
                    {currentLanguage === "ar" ? `مجدول: ${new Date(ntf.scheduledFor!).toLocaleDateString()}` : `Scheduled: ${new Date(ntf.scheduledFor!).toLocaleDateString()}`}
                  </span>
                )}
              </div>

            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-8 text-center text-gray-400 font-bold">
              {currentLanguage === "ar" ? "لا توجد رسائل إشعار في قائمة التتبع" : "No dispatched notifications to track"}
            </div>
          )}
        </div>
      </div>

      {/* Compose Notification Dialog Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full text-slate-800 border-t-8 border-sudan-green my-8">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-extrabold text-[#1E293B] text-base flex items-center gap-1.5">
                <Send className="h-4.5 w-4.5 text-sudan-green" />
                <span>{currentLanguage === "ar" ? "صياغة وتوجيه إرسال موثق" : "Compose Multi-Channel Dispatch"}</span>
              </h4>
              <button onClick={() => setIsComposeOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleComposeSubmit} className="p-6 space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold">{currentLanguage === "ar" ? "العنوان (بالعربية)*" : "Title (Arabic)*"}</label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="تفعيل ترخيص الكيان الرقمي..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-sudan-green transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 font-bold">{currentLanguage === "ar" ? "العنوان (بالإنجليزية)*" : "Title (English)*"}</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Sovereign Digital License Approved..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-sudan-green transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold">{currentLanguage === "ar" ? "قناة الإرسال المستهدفة" : "Dispatch Channel"}</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-sudan-green transition-all"
                  >
                    <option value="all">{currentLanguage === "ar" ? "كل القنوات المتاحة" : "All Available Channels"}</option>
                    <option value="sms">{currentLanguage === "ar" ? "رسائل نصية SMS" : "Text Messages (SMS)"}</option>
                    <option value="email">{currentLanguage === "ar" ? "البريد الإلكتروني" : "Direct Email"}</option>
                    <option value="push">{currentLanguage === "ar" ? "الإشعارات الذكية" : "Smart Push Alerts"}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 font-bold">{currentLanguage === "ar" ? "رقم الهاتف / بريد المستلم*" : "Recipient Phone/Email*"}</label>
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="+2499xxxxxx / email@sd.sd"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-sudan-green transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 font-bold">{currentLanguage === "ar" ? "الرسالة (بالعربية)*" : "Message (Arabic)*"}</label>
                <textarea
                  required
                  rows={2}
                  value={messageAr}
                  onChange={(e) => setMessageAr(e.target.value)}
                  placeholder="محتوى الإشعار الموجه باللغة العربية..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-sudan-green transition-all resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 font-bold">{currentLanguage === "ar" ? "الرسالة (بالإنجليزية)*" : "Message (English)*"}</label>
                <textarea
                  required
                  rows={2}
                  value={messageEn}
                  onChange={(e) => setMessageEn(e.target.value)}
                  placeholder="Notification contents in English..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-sudan-green transition-all resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 font-bold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <span>{currentLanguage === "ar" ? "جدولة الإرسال لوقت لاحق (اختياري)" : "Schedule Dispatch (Optional)"}</span>
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-sudan-green transition-all"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{currentLanguage === "ar" ? "إرسال الإشعار السيادي الموثق" : "Dispatch Legal Sovereign Notice"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
