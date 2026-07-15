/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Search, Plus, CheckCircle, Clock, X, FileText, 
  MapPin, ShieldCheck, QrCode, AlertCircle, TrendingUp, Users, 
  DollarSign, RefreshCw, Send, AlertTriangle, Shield, Layers, 
  HelpCircle, FileCheck, Share2, Award, Calendar, ArrowRight, 
  Download, BookOpen, UserCheck, FileCode, Check, Trash2, Edit2, 
  RotateCcw, History, Sparkles, Book
} from "lucide-react";
import { CommercialNameReservation, NameClassificationType, ApplicationStatus } from "../types";

// Government restricted keywords & reserved terms
const GOVERNMENT_RESERVED_WORDS = [
  "سودان", "جمهورية", "وزارة", "حكومة", "سيادي", "رئاسي", "عسكري", "الجيش", "شرطة", "بلدية",
  "sudan", "republic", "ministry", "government", "sovereign", "presidential", "military", "army", "police"
];

const OFFENSIVE_RESTRICTED_WORDS = [
  "فاشل", "نصاب", "محتال", "كذاب", "فاسد", "رشوة", "إرهاب", "عنصري",
  "fail", "fraud", "scam", "corrupt", "bribe", "terror", "racist"
];

const CLASSIFICATION_CATEGORIES = [
  { id: "commercial", labelAr: "تجاري", labelEn: "Commercial", descAr: "أنشطة الاستيراد والتصدير والتجارة العامة والمطاعم", descEn: "Import, export, general trading, and food service" },
  { id: "industrial", labelAr: "صناعي", labelEn: "Industrial", descAr: "صناعات تحويلية، مصانع الأغذية والأدوية والنسيج", descEn: "Manufacturing, food processing, and pharmaceuticals" },
  { id: "professional", labelAr: "مهني", labelEn: "Professional", descAr: "استشارات هندسية، قانونية، طبية وتقنية", descEn: "Engineering, legal, medical, and technical consulting" },
  { id: "investment", labelAr: "استثماري", labelEn: "Investment", descAr: "إدارة المحافظ والمشاريع التنموية والمدن الصناعية", descEn: "Portfolio management, development, and industrial cities" },
  { id: "service", labelAr: "خدمي", labelEn: "Service Activities", descAr: "خدمات لوجستية، نظافة وتطهير، صيانة وتدريب", descEn: "Logistics, maintenance, training, and support services" }
];

interface CommercialNamesProps {
  currentLanguage: "ar" | "en";
  isAdmin: boolean;
  companies?: any[]; // for linking commercial name with registration!
}

export default function CommercialNamesModule({
  currentLanguage,
  isAdmin,
  companies = []
}: CommercialNamesProps) {
  // Tabs: search, reservation, verify, documents
  const [activeTab, setActiveTab] = useState<"search" | "reservations" | "verification" | "specs">("search");
  const [selectedRole, setSelectedRole] = useState<string>("citizen"); // citizen, merchant, rep, officer, manager, director, minister, admin
  
  // Reservations State - Loaded from LocalStorage or seeded with initial values
  const [reservations, setReservations] = useState<CommercialNameReservation[]>([]);
  const [searchNameAr, setSearchNameAr] = useState("");
  const [searchNameEn, setSearchNameEn] = useState("");
  const [searchCategory, setSearchCategory] = useState<NameClassificationType>("commercial");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    messages: { type: "error" | "warning" | "success"; textAr: string; textEn: string }[];
    similars: string[];
    suggestions: string[];
  } | null>(null);

  // New Reservation Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formNameAr, setFormNameAr] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formCategory, setFormCategory] = useState<NameClassificationType>("commercial");
  const [formApplicantName, setFormApplicantName] = useState("");
  const [formApplicantRole, setFormApplicantRole] = useState<"citizen" | "merchant" | "representative">("citizen");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newRefNumber, setNewRefNumber] = useState("");

  // Management actions modals
  const [selectedReservation, setSelectedReservation] = useState<CommercialNameReservation | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [amendmentNameAr, setAmendmentNameAr] = useState("");
  const [amendmentNameEn, setAmendmentNameEn] = useState("");
  const [isAmendOpen, setIsAmendOpen] = useState(false);
  const [transferOwnerName, setTransferOwnerName] = useState("");
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Verification search
  const [verificationRef, setVerificationRef] = useState("");
  const [verificationResultRecord, setVerificationResultRecord] = useState<CommercialNameReservation | null>(null);
  const [verificationError, setVerificationError] = useState("");

  // AI Assistant floating suggestions in names
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Initialize data
  useEffect(() => {
    const localReservations = localStorage.getItem("sdmci_names_reservations");
    if (localReservations) {
      setReservations(JSON.parse(localReservations));
    } else {
      const seeded: CommercialNameReservation[] = [
        {
          id: "res-1",
          nameAr: "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
          nameEn: "Khartoum Unified Gum Arabic Export Co.",
          classification: "commercial",
          applicantName: "أحمد محمد عثمان",
          applicantRole: "merchant",
          status: "approved",
          refNumber: "SDN-NAME-2026-90412",
          createdAt: "2026-07-01T10:00:00Z",
          expiryDate: "2026-09-01T10:00:00Z",
          linkedRegistrationId: "comp-1",
          history: [
            { id: "h-1", actionAr: "تقديم طلب حجز اسم", actionEn: "Reservation Request Submitted", timestamp: "2026-07-01T10:00:00Z", actorRole: "merchant", actorName: "أحمد محمد عثمان" },
            { id: "h-2", actionAr: "اعتماد حجز الاسم من قبل مسجل الأسماء", actionEn: "Reservation Approved by Name Registrar", timestamp: "2026-07-01T14:30:00Z", actorRole: "registry_officer", actorName: "عاصم الطيب" },
            { id: "h-3", actionAr: "ربط الاسم التجاري بسجل تجاري نشط", actionEn: "Linked Commercial Name with Active Registration", timestamp: "2026-07-02T12:00:00Z", actorRole: "registry_officer", actorName: "عاصم الطيب" }
          ]
        },
        {
          id: "res-2",
          nameAr: "مؤسسة البحر الأحمر للخدمات الملاحية والتجارة",
          nameEn: "Red Sea Maritime Services & Trade",
          classification: "service",
          applicantName: "فاطمة الزهراء علي",
          applicantRole: "merchant",
          status: "approved",
          refNumber: "SDN-NAME-2026-30219",
          createdAt: "2026-07-03T11:00:00Z",
          expiryDate: "2026-09-03T11:00:00Z",
          linkedRegistrationId: "comp-2",
          history: [
            { id: "h-4", actionAr: "تقديم طلب حجز اسم", actionEn: "Reservation Request Submitted", timestamp: "2026-07-03T11:00:00Z", actorRole: "merchant", actorName: "فاطمة الزهراء علي" },
            { id: "h-5", actionAr: "الموافقة والاعتماد", actionEn: "Approved & Issued", timestamp: "2026-07-03T16:15:00Z", actorRole: "registry_officer", actorName: "منال عبدالحليم" }
          ]
        },
        {
          id: "res-3",
          nameAr: "مصنع سكر النيلين الحديث ذ.م.م",
          nameEn: "Neelain Modern Sugar Factory Ltd",
          classification: "industrial",
          applicantName: "عبدالرحمن فضل الله",
          applicantRole: "representative",
          status: "pending",
          refNumber: "SDN-NAME-2026-55102",
          createdAt: "2026-07-14T09:00:00Z",
          expiryDate: "2026-09-14T09:00:00Z",
          history: [
            { id: "h-6", actionAr: "تقديم طلب حجز الاسم عبر البوابة الموحدة", actionEn: "Reservation Request Submitted via Portal", timestamp: "2026-07-14T09:00:00Z", actorRole: "representative", actorName: "عبدالرحمن فضل الله" }
          ]
        },
        {
          id: "res-4",
          nameAr: "شركة الفهد للتجارة والخدمات المحدودة",
          nameEn: "Al-Fahd Trade & Services Co. Ltd",
          classification: "commercial",
          applicantName: "ياسر عوض الجاك",
          applicantRole: "citizen",
          status: "expired",
          refNumber: "SDN-NAME-2026-21045",
          createdAt: "2026-05-10T12:00:00Z",
          expiryDate: "2026-07-10T12:00:00Z",
          history: [
            { id: "h-7", actionAr: "تقديم طلب حجز اسم", actionEn: "Reservation Request Submitted", timestamp: "2026-05-10T12:00:00Z", actorRole: "citizen", actorName: "ياسر عوض الجاك" },
            { id: "h-8", actionAr: "الاعتماد لستين يوماً", actionEn: "Approved for 60 Days", timestamp: "2026-05-10T15:00:00Z", actorRole: "registry_officer", actorName: "عاصم الطيب" },
            { id: "h-9", actionAr: "انتهاء فترة صلاحية حجز الاسم التلقائي دون تمديد", actionEn: "Name Reservation Expired Automatically Without Extension", timestamp: "2026-07-10T12:00:00Z", actorRole: "system", actorName: "سيرفر الحجز المركزي" }
          ]
        }
      ];
      setReservations(seeded);
      localStorage.setItem("sdmci_names_reservations", JSON.stringify(seeded));
    }
  }, []);

  // Save utility helper
  const saveReservations = (updated: CommercialNameReservation[]) => {
    setReservations(updated);
    localStorage.setItem("sdmci_names_reservations", JSON.stringify(updated));
    // Write audit log to console or simulate writing to database
    console.log(`[AUDIT LOG] Commercial Names state updated at ${new Date().toISOString()}`);
  };

  // Automated name validation engine
  const handleValidateName = (ar: string, en: string) => {
    if (!ar && !en) {
      setValidationResult(null);
      return;
    }

    const messages: { type: "error" | "warning" | "success"; textAr: string; textEn: string }[] = [];
    let isValid = true;

    // Check Arabic Name length
    if (ar && ar.trim().length < 4) {
      messages.push({
        type: "error",
        textAr: "يجب أن يتكون الاسم العربي من 4 أحرف على الأقل",
        textEn: "Arabic name must be at least 4 characters long"
      });
      isValid = false;
    }

    // Check English Name length
    if (en && en.trim().length < 4) {
      messages.push({
        type: "error",
        textAr: "يجب أن يتكون الاسم الإنجليزي من 4 أحرف على الأقل",
        textEn: "English name must be at least 4 characters long"
      });
      isValid = false;
    }

    // Check suffix rules (legal entity structure)
    const suffixAr = ["محدودة", "مساهمة", "شراكة", "ذ.م.م", "شركة"];
    const suffixEn = ["ltd", "co", "llc", "corp", "company", "partnership"];
    const hasSuffixAr = ar ? suffixAr.some(s => ar.toLowerCase().includes(s)) : false;
    const hasSuffixEn = en ? suffixEn.some(s => en.toLowerCase().includes(s)) : false;

    if (ar && !hasSuffixAr) {
      messages.push({
        type: "warning",
        textAr: "توصية: يفضل تذييل الاسم بالصيغة القانونية المناسبة (مثل: شركة، محدودة، ذ.م.م)",
        textEn: "Recommendation: Name is missing a legal corporate form suffix (e.g., Ltd, Co., LLC)"
      });
    }

    // Check restricted offensive words
    const containsOffAr = ar ? OFFENSIVE_RESTRICTED_WORDS.some(w => ar.toLowerCase().includes(w)) : false;
    const containsOffEn = en ? OFFENSIVE_RESTRICTED_WORDS.some(w => en.toLowerCase().includes(w)) : false;

    if (containsOffAr || containsOffEn) {
      messages.push({
        type: "error",
        textAr: "مخالف للوائح الآداب العامة: الاسم يحتوي على كلمات محظورة أو مسيئة",
        textEn: "Public Decency Violation: Naming request contains offensive or restricted words"
      });
      isValid = false;
    }

    // Check government reserved words
    const containsGovAr = ar ? GOVERNMENT_RESERVED_WORDS.some(w => ar.toLowerCase().includes(w)) : false;
    const containsGovEn = en ? GOVERNMENT_RESERVED_WORDS.some(w => en.toLowerCase().includes(w)) : false;

    if (containsGovAr || containsGovEn) {
      messages.push({
        type: "error",
        textAr: "يتطلب موافقة مجلس الوزراء السيادي: يحتوي الاسم على مصطلحات تتبع لجهات حكومية أو رئاسية",
        textEn: "Requires Sovereign Council clearance: Name contains keywords reserved for government or military entities"
      });
      isValid = false;
    }

    // Check exact matches in existing database
    const exactMatch = reservations.find(r => 
      (ar && r.nameAr.trim().toLowerCase() === ar.trim().toLowerCase()) ||
      (en && r.nameEn.trim().toLowerCase() === en.trim().toLowerCase())
    );

    if (exactMatch) {
      messages.push({
        type: "error",
        textAr: `اسم تجاري غير متاح: الاسم مسجل بالفعل بالرقم المرجعي (${exactMatch.refNumber}) وحالته (${exactMatch.status})`,
        textEn: `Name Unavailable: This exact name is already registered under Ref (${exactMatch.refNumber}) with status (${exactMatch.status})`
      });
      isValid = false;
    }

    // Check partial similarities (levenshtein or simple overlap)
    const similarMatches: string[] = [];
    if (ar || en) {
      reservations.forEach(r => {
        if (ar && r.nameAr !== ar && r.nameAr.includes(ar.substring(0, Math.min(ar.length, 6)))) {
          similarMatches.push(r.nameAr);
        }
        if (en && r.nameEn !== en && r.nameEn.toLowerCase().includes(en.toLowerCase().substring(0, Math.min(en.length, 6)))) {
          similarMatches.push(r.nameEn);
        }
      });
    }

    if (similarMatches.length > 0) {
      messages.push({
        type: "warning",
        textAr: `تم كشف أسماء مشابهة مسجلة في قاعدة البيانات الموحدة قد تسبب تضليلاً للجمهور`,
        textEn: `Similar Registered Names Detected: May cause public confusion under consumer protection acts`
      });
    }

    // Standard Success
    if (isValid && messages.filter(m => m.type === "error").length === 0) {
      messages.push({
        type: "success",
        textAr: "الاسم متاح للتسجيل والتحقق الفوري. يتطابق مع المعايير الحكومية المعتمدة لعام 2026",
        textEn: "Name is available for instant digital reservation. Fully compliant with 2026 federal guidelines"
      });
    }

    // AI Naming suggestions generators
    const suggestions: string[] = [];
    if (ar && ar.trim().length > 2) {
      const cleanAr = ar.replace(/شركة|محدودة|ذ\.م\.م|لتصدير|للتجارة/g, "").trim();
      suggestions.push(`مجموعة ${cleanAr} القابضة`);
      suggestions.push(`${cleanAr} الموحدة لخدمات الاستثمار`);
      suggestions.push(`${cleanAr} السودانية للتجارة الرقمية`);
    } else {
      suggestions.push("مؤسسة النيلين للحلول المتكاملة");
      suggestions.push("شركة البركة للأمن الغذائي والزراعي");
      suggestions.push("ريد سيتي للحلول الهندسية والصناعية");
    }

    setValidationResult({
      isValid,
      messages,
      similars: similarMatches,
      suggestions
    });
  };

  // Submit New Reservation Request
  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameAr || !formNameEn || !formApplicantName) {
      return;
    }

    const ref = `SDN-NAME-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRes: CommercialNameReservation = {
      id: `res-${Date.now()}`,
      nameAr: formNameAr,
      nameEn: formNameEn,
      classification: formCategory,
      applicantName: formApplicantName,
      applicantRole: formApplicantRole,
      status: "pending",
      refNumber: ref,
      createdAt: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
      history: [
        {
          id: `h-${Date.now()}`,
          actionAr: "تقديم طلب حجز الاسم عبر البوابة الموحدة",
          actionEn: "Reservation Request Submitted via Digital Portal",
          timestamp: new Date().toISOString(),
          actorRole: formApplicantRole,
          actorName: formApplicantName,
          notes: "بانتظار التحقق والمطابقة والاعتماد"
        }
      ]
    };

    const updated = [newRes, ...reservations];
    saveReservations(updated);
    setNewRefNumber(ref);
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsFormOpen(false);
      setFormNameAr("");
      setFormNameEn("");
      setFormApplicantName("");
    }, 2500);
  };

  // Reservation Status Change (Reviewer/Admin Actions)
  const handleUpdateStatus = (id: string, newStatus: "approved" | "rejected" | "suspended") => {
    const updated = reservations.map(r => {
      if (r.id === id) {
        const actionTextAr = newStatus === "approved" ? "تمت الموافقة على حجز الاسم وإصدار الشهادة" :
                             newStatus === "rejected" ? "تم رفض طلب حجز الاسم التجاري لمخالفته المعايير" :
                             "تم تعليق / تجميد الاسم التجاري بقرار وزاري";
        const actionTextEn = newStatus === "approved" ? "Reservation Approved & Certificate Issued" :
                             newStatus === "rejected" ? "Reservation Request Rejected due to compliance mismatch" :
                             "Sovereign Suspension enforced on Commercial Name";
        
        return {
          ...r,
          status: newStatus,
          notes: reviewNotes,
          history: [
            ...r.history,
            {
              id: `h-${Date.now()}`,
              actionAr: actionTextAr,
              actionEn: actionTextEn,
              timestamp: new Date().toISOString(),
              actorRole: selectedRole,
              actorName: "مسجل الأسماء المعتمد",
              notes: reviewNotes
            }
          ]
        };
      }
      return r;
    });

    saveReservations(updated);
    setReviewNotes("");
    // Sync current modal view
    if (selectedReservation && selectedReservation.id === id) {
      setSelectedReservation(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Amendment Service (تعديل الاسم)
  const handleAmendName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReservation || !amendmentNameAr || !amendmentNameEn) return;

    const updated = reservations.map(r => {
      if (r.id === selectedReservation.id) {
        return {
          ...r,
          nameAr: amendmentNameAr,
          nameEn: amendmentNameEn,
          history: [
            ...r.history,
            {
              id: `h-${Date.now()}`,
              actionAr: `تعديل الاسم التجاري من (${r.nameAr}) إلى (${amendmentNameAr})`,
              actionEn: `Amended Commercial Name from (${r.nameEn}) to (${amendmentNameEn})`,
              timestamp: new Date().toISOString(),
              actorRole: "merchant",
              actorName: r.applicantName,
              notes: "طلب تعديل بموجب الرسوم والقرارات المحدثة"
            }
          ]
        };
      }
      return r;
    });

    saveReservations(updated);
    setIsAmendOpen(false);
    setSelectedReservation(null);
  };

  // Ownership Transfer Service (نقل الملكية والتنازل)
  const handleTransferOwnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReservation || !transferOwnerName) return;

    const updated = reservations.map(r => {
      if (r.id === selectedReservation.id) {
        return {
          ...r,
          applicantName: transferOwnerName,
          history: [
            ...r.history,
            {
              id: `h-${Date.now()}`,
              actionAr: `التنازل ونقل ملكية الاسم التجاري إلى: ${transferOwnerName}`,
              actionEn: `Transferred Commercial Name Ownership to: ${transferOwnerName}`,
              timestamp: new Date().toISOString(),
              actorRole: "merchant",
              actorName: r.applicantName,
              notes: "توثيق التنازل الرسمي وقوانين الملكية الفكرية المطبقة"
            }
          ]
        };
      }
      return r;
    });

    saveReservations(updated);
    setIsTransferOpen(false);
    setSelectedReservation(null);
  };

  // Extension Service (تمديد الحجز)
  const handleExtendReservation = (id: string) => {
    const updated = reservations.map(r => {
      if (r.id === id) {
        const currentExp = new Date(r.expiryDate).getTime();
        const extendedExp = new Date(currentExp + 60 * 24 * 60 * 60 * 1000).toISOString(); // +60 days
        return {
          ...r,
          expiryDate: extendedExp,
          history: [
            ...r.history,
            {
              id: `h-${Date.now()}`,
              actionAr: "تمديد صلاحية حجز الاسم التجاري لستين يوماً إضافية",
              actionEn: "Extended name reservation validity for 60 additional days",
              timestamp: new Date().toISOString(),
              actorRole: "merchant",
              actorName: r.applicantName,
              notes: "رسوم تجديد مسددة تلقائياً عبر الدفع الرقمي"
            }
          ]
        };
      }
      return r;
    });

    saveReservations(updated);
    // Update selected visual state
    if (selectedReservation && selectedReservation.id === id) {
      setSelectedReservation(prev => prev ? { ...prev, expiryDate: new Date(new Date(prev.expiryDate).getTime() + 60 * 24 * 60 * 60 * 1000).toISOString() } : null);
    }
  };

  // Cancel/Reactivate Name
  const handleCancelReservation = (id: string) => {
    const updated = reservations.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: "expired" as any,
          history: [
            ...r.history,
            {
              id: `h-${Date.now()}`,
              actionAr: "إلغاء حجز الاسم التجاري طواعية بطلب من العميل",
              actionEn: "Voluntarily cancelled commercial name reservation",
              timestamp: new Date().toISOString(),
              actorRole: "merchant",
              actorName: r.applicantName
            }
          ]
        };
      }
      return r;
    });
    saveReservations(updated);
    if (selectedReservation && selectedReservation.id === id) {
      setSelectedReservation(prev => prev ? { ...prev, status: "expired" } : null);
    }
  };

  // Reactivate Name
  const handleReactivateName = (id: string) => {
    const updated = reservations.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: "approved" as any,
          expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          history: [
            ...r.history,
            {
              id: `h-${Date.now()}`,
              actionAr: "إعادة تفعيل وتنشيط حجز الاسم التجاري الموثق",
              actionEn: "Reactivated and refreshed commercial name reservation",
              timestamp: new Date().toISOString(),
              actorRole: "registry_officer",
              actorName: "مسجل الأسماء المعتمد"
            }
          ]
        };
      }
      return r;
    });
    saveReservations(updated);
    if (selectedReservation && selectedReservation.id === id) {
      setSelectedReservation(prev => prev ? { ...prev, status: "approved" } : null);
    }
  };

  // Link Commercial Name to Commercial Registration
  const handleLinkRegistration = (resId: string, companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return;

    const updated = reservations.map(r => {
      if (r.id === resId) {
        return {
          ...r,
          linkedRegistrationId: companyId,
          history: [
            ...r.history,
            {
              id: `h-${Date.now()}`,
              actionAr: `ربط رسمي بالسجل التجاري رقم: ${company.registrationNumber}`,
              actionEn: `Linked to official Commercial Registry ID: ${company.registrationNumber}`,
              timestamp: new Date().toISOString(),
              actorRole: "registry_officer",
              actorName: "مسجل الأسماء المعتمد"
            }
          ]
        };
      }
      return r;
    });

    saveReservations(updated);
    if (selectedReservation && selectedReservation.id === resId) {
      setSelectedReservation(prev => prev ? { ...prev, linkedRegistrationId: companyId } : null);
    }
  };

  // Search Verification
  const handleVerifyRef = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");
    setVerificationResultRecord(null);

    if (!verificationRef) return;

    const found = reservations.find(r => r.refNumber.trim().toLowerCase() === verificationRef.trim().toLowerCase());
    if (found) {
      // Append verification record audit on each check
      const updated = reservations.map(r => {
        if (r.id === found.id) {
          return {
            ...r,
            verificationRecord: {
              verifiedAt: new Date().toISOString(),
              verifiedByIp: "196.29.54.10",
              statusAr: "نشط ومعتمد رسمياً",
              statusEn: "Officially active and certified"
            }
          };
        }
        return r;
      });
      saveReservations(updated);
      setVerificationResultRecord(found);
    } else {
      setVerificationError(currentLanguage === "ar" ? "الرقم المرجعي المدخل غير صحيح أو منتهي الصلاحية" : "The provided reference number is invalid or has been archived");
    }
  };

  // Sovereign AI Suggestion Assistant Mock
  const handleAiNamingCheck = () => {
    if (!aiPrompt) return;
    setAiLoading(true);

    setTimeout(() => {
      const p = aiPrompt.toLowerCase();
      let suggestions: string[] = [];
      let explanation = "";

      if (p.includes("صمغ") || p.includes("gum") || p.includes("زراعي")) {
        suggestions = [
          "شركة صمغ الهشاب الفيدرالية المحدودة",
          "شركة النيل لتعبئة وتصدير الصمغ العربي",
          "مؤسسة السافانا لإنتاج الصمغ والمنتجات الغابية"
        ];
        explanation = "تنص المادة 14 من قانون تنظيم الاستثمار لعام 2026 على تسهيل حجز أسماء الأنشطة الزراعية وتصدير الصمغ العربي مع تمديد فترات الصلاحية مجاناً دعماً للاقتصاد الوطني.";
      } else if (p.includes("تكنولوجيا") || p.includes("tech") || p.includes("برمجيات")) {
        suggestions = [
          "شركة كوش لحلول الذكاء الاصطناعي السحابية",
          "مؤسسة سنار للبرمجيات المتطورة والأنظمة",
          "الشركة السودانية لخدمات تكنولوجيا الحوكمة الرقمية"
        ];
        explanation = "يسمح قانون تكنولوجيا المعلومات الجديد باستخدام مصطلحات البرمجة والتقنيات الرقمية المتقدمة شريطة إلحاق لاحقة نوع التخصص بالاسم باللغتين.";
      } else {
        suggestions = [
          `شركة ${aiPrompt} لخدمات التجارة العامة`,
          `مجموعة ${aiPrompt} للتنمية والاستثمار العقاري`,
          `مجمع ${aiPrompt} للصناعات الهندسية المحدودة`
        ];
        explanation = "يوصى بدمج كلمة تشير إلى النشاط الحقيقي (صناعي، مهني، خدمي) لتفادي رفض المعاملة أثناء التدقيق الآلي.";
      }

      setAiSuggestions(suggestions);
      setAiExplanation(explanation);
      setAiLoading(false);
    }, 1200);
  };

  return (
    <div id="commercial-names-system" className="space-y-6">
      
      {/* Upper Brand Intro Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
        <div className="space-y-1">
          <span className="bg-sudan-green/10 text-sudan-green text-[10px] px-3 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {currentLanguage === "ar" ? "مجمع السجل الفيدرالي الموحد" : "Unified Federal Register Hub"}
          </span>
          <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sudan-green" />
            {currentLanguage === "ar" ? "نظام حجز وتوثيق الأسماء التجارية السيادي" : "Sovereign Commercial Names Reservation Platform"}
          </h2>
          <p className="text-xs text-gray-400">
            {currentLanguage === "ar" 
              ? "تحقق رقمي ذكي، فحص مشابهات، تسوية أوضاع قانونية، وحجز وتصدير شهادات معتمدة" 
              : "Intelligent matching, conflict checks, ownership management, and instant digital certificates."}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick simulation role toggle within names platform */}
          <div className="bg-[#F4F6F5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <span className="text-gray-400 text-[10px] uppercase font-bold">{currentLanguage === "ar" ? "دور المحاكاة:" : "Scope Sim:"}</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent text-[#1E293B] outline-none font-bold cursor-pointer"
            >
              <option value="citizen">{currentLanguage === "ar" ? "مواطن / طالب خدمة" : "Citizen / Applicant"}</option>
              <option value="merchant">{currentLanguage === "ar" ? "تاجر / مستثمر معتمد" : "Merchant / Investor"}</option>
              <option value="registry_officer">{currentLanguage === "ar" ? "مسجل الأسماء الميداني" : "Registry Officer"}</option>
              <option value="dept_manager">{currentLanguage === "ar" ? "مدير الإدارة العامة" : "Department Manager"}</option>
              <option value="minister">{currentLanguage === "ar" ? "ديوان معالي الوزير" : "Ministerial Executive"}</option>
            </select>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 shrink-0"
          >
            <Plus className="h-4.5 w-4.5" />
            {currentLanguage === "ar" ? "حجز اسم تجاري جديد" : "Reserve New Name"}
          </button>
        </div>
      </div>

      {/* Internal Tabs for Commercial Names Platform */}
      <div className="flex border-b border-gray-200 bg-white p-2 rounded-2xl gap-1 shadow-xs">
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
            activeTab === "search" ? "bg-sudan-green text-white shadow-sm" : "text-gray-500 hover:text-sudan-green hover:bg-slate-50"
          }`}
        >
          <Search className="h-4 w-4" />
          {currentLanguage === "ar" ? "البحث والتدقيق الفوري" : "Instant Search & Check"}
        </button>
        <button
          onClick={() => setActiveTab("reservations")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
            activeTab === "reservations" ? "bg-sudan-green text-white shadow-sm" : "text-gray-500 hover:text-sudan-green hover:bg-slate-50"
          }`}
        >
          <Layers className="h-4 w-4" />
          {currentLanguage === "ar" ? "إدارة طلبات حجز الأسماء" : "Manage Reservations"}
          <span className="bg-[#C5A059] text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
            {reservations.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("verification")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
            activeTab === "verification" ? "bg-sudan-green text-white shadow-sm" : "text-gray-500 hover:text-sudan-green hover:bg-slate-50"
          }`}
        >
          <QrCode className="h-4 w-4" />
          {currentLanguage === "ar" ? "بوابة التحقق الرسمية" : "Public Verification Portal"}
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
            activeTab === "specs" ? "bg-sudan-green text-white shadow-sm" : "text-gray-500 hover:text-sudan-green hover:bg-slate-50"
          }`}
        >
          <Book className="h-4 w-4" />
          {currentLanguage === "ar" ? "حزمة تقارير الاعتماد الفيدرالي" : "Sovereign Implementation Reports"}
        </button>
      </div>

      {/* Main Views Container */}
      <div className="space-y-6">
        
        {/* TAB 1: Search & Intelligent Validation */}
        {activeTab === "search" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Search Input Box */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-[#1E293B] border-b border-gray-100 pb-2">
                  {currentLanguage === "ar" ? "محاكي فحص الأسماء التجارية المعتمد" : "AI Naming Verification Simulator"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">
                      {currentLanguage === "ar" ? "الاسم التجاري المقترح (بالعربية)" : "Proposed Name (Arabic)"}
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: النيلين لتصدير الصمغ العربي"
                      value={searchNameAr}
                      onChange={(e) => {
                        setSearchNameAr(e.target.value);
                        handleValidateName(e.target.value, searchNameEn);
                      }}
                      className="w-full bg-[#F4F6F5] border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">
                      {currentLanguage === "ar" ? "الاسم التجاري المقترح (بالإنجليزية)" : "Proposed Name (English)"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Neelain Gum Arabic Export"
                      value={searchNameEn}
                      onChange={(e) => {
                        setSearchNameEn(e.target.value);
                        handleValidateName(searchNameAr, e.target.value);
                      }}
                      className="w-full bg-[#F4F6F5] border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">
                      {currentLanguage === "ar" ? "التصنيف التجاري للاسم" : "Name Classification"}
                    </label>
                    <select
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value as NameClassificationType)}
                      className="w-full bg-[#F4F6F5] border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                    >
                      {CLASSIFICATION_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>
                          {currentLanguage === "ar" ? c.labelAr : c.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => handleValidateName(searchNameAr, searchNameEn)}
                      className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {currentLanguage === "ar" ? "تحديث الفحص الفوري" : "Run Security Analysis"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Validation Results Panel */}
              {validationResult && (
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-500">
                      {currentLanguage === "ar" ? "سجل كشف المطابقة الآلي لوزارة التجارة" : "Automated Ministry Registry Verification Report"}
                    </h4>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase border ${
                      validationResult.isValid ? "bg-emerald-100 text-emerald-850 border-emerald-200" : "bg-rose-100 text-rose-850 border-rose-200"
                    }`}>
                      {validationResult.isValid ? (currentLanguage === "ar" ? "مطابق وقابل للحجز" : "PASSED COMPLIANCE") : (currentLanguage === "ar" ? "غير مطابق / تضارب" : "FAILED COMPLIANCE")}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {validationResult.messages.map((m, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3.5 rounded-2xl flex items-start gap-2.5 border text-xs leading-relaxed ${
                          m.type === "error" ? "bg-rose-50 border-rose-100 text-rose-800" :
                          m.type === "warning" ? "bg-amber-50 border-amber-100 text-amber-800" :
                          "bg-emerald-50 border-emerald-100 text-emerald-800"
                        }`}
                      >
                        {m.type === "error" ? <AlertTriangle className="h-4.5 w-4.5 shrink-0" /> :
                         m.type === "warning" ? <AlertCircle className="h-4.5 w-4.5 shrink-0" /> :
                         <CheckCircle className="h-4.5 w-4.5 shrink-0" />}
                        <span>{currentLanguage === "ar" ? m.textAr : m.textEn}</span>
                      </div>
                    ))}
                  </div>

                  {/* Similar Matches */}
                  {validationResult.similars.length > 0 && (
                    <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl space-y-2 text-xs">
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        {currentLanguage === "ar" ? "أسماء مماثلة مسجلة بالفعل :" : "Conflicting Similars in Unified Database:"}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {validationResult.similars.map((s, idx) => (
                          <span key={idx} className="bg-slate-200 text-slate-800 border border-slate-300 px-2.5 py-1 rounded-lg font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Alternatives suggestions */}
                  <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-2 text-xs">
                    <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-sudan-green" />
                      {currentLanguage === "ar" ? "بدائل متاحة مقترحة من المعالج الذكي للوزارة:" : "AI Suggested Clean Alternatives:"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                      {validationResult.suggestions.map((s, idx) => (
                        <button 
                          key={idx}
                          onClick={() => {
                            // Extract Arabic/English representation roughly
                            setSearchNameAr(s);
                            handleValidateName(s, searchNameEn);
                          }}
                          className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-100 p-2 rounded-xl text-center font-bold cursor-pointer transition-colors hover:border-sudan-green"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: AI Assistant for naming rules */}
            <div className="space-y-6">
              
              {/* Sovereign AI Naming Regulation Helper */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl border border-sudan-gold/30 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-sudan-green rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4.5 w-4.5 text-sudan-gold" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-sudan-gold">
                      {currentLanguage === "ar" ? "المستشار القانوني الذكي للأسماء" : "AI Sovereign Regulations Coach"}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold">{currentLanguage === "ar" ? "ذكاء اصطناعي سيادي سوداني" : "Sudanese National LLM Context"}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "اطرح فكرة نشاطك التجاري، ليقوم المستشار الذكي باقتراح أسماء تجارية مطابقة ومتاحة، وشرح المعايير القانونية الصادرة لعام 2026."
                    : "Enter your startup concept or industry focus to generate compliant, secure, and officially pre-vetted brand name ideas."}
                </p>

                <div className="space-y-2">
                  <textarea
                    placeholder={currentLanguage === "ar" ? "مثال: مصنع لإنتاج وتجفيف الفواكه الاستوائية في سنار..." : "e.g., Tropical fruit processing plant in Sennar state..."}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-800 text-white border border-white/10 text-xs p-3 rounded-xl outline-none focus:border-sudan-gold resize-none"
                  />
                  <button
                    onClick={handleAiNamingCheck}
                    disabled={aiLoading || !aiPrompt}
                    className="w-full bg-sudan-gold hover:bg-amber-500 text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    {aiLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {currentLanguage === "ar" ? "توليد اقتراحات الأسماء القانونية" : "Generate Pre-Vetted Names"}
                  </button>
                </div>

                {/* AI Outputs */}
                {aiSuggestions.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-white/10 text-xs animate-fade-in">
                    <p className="font-bold text-sudan-gold text-[10px] uppercase">{currentLanguage === "ar" ? "الأسماء المقترحة المتاحة:" : "Compliant Name Recommendations:"}</p>
                    <div className="space-y-1.5">
                      {aiSuggestions.map((s, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setSearchNameAr(s);
                            handleValidateName(s, "");
                          }}
                          className="bg-slate-800 border border-white/5 hover:border-sudan-gold/50 p-2 rounded-lg cursor-pointer transition-colors text-[11px] font-bold text-slate-100 flex items-center justify-between"
                        >
                          <span>{s}</span>
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                      ))}
                    </div>
                    {aiExplanation && (
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl leading-relaxed text-[11px] text-gray-350">
                        {aiExplanation}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Legal Check Guidelines */}
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-extrabold text-xs text-[#1E293B]">
                  {currentLanguage === "ar" ? "لوائح الأسماء المعتمدة بقرار 2026" : "Naming Rules Reference Sheet"}
                </h4>
                <ul className="space-y-2 text-xs text-gray-500 list-disc list-inside leading-relaxed">
                  <li>{currentLanguage === "ar" ? "يجب ألا يحتوي الاسم على ألقاب عائلية دون إثبات الملكية." : "Must not use family surnames without ownership deeds."}</li>
                  <li>{currentLanguage === "ar" ? "تمنع كلياً الأسماء المشابهة لشركات عالمية كبرى تلافياً للمساءلة." : "Protection of global trademarks under federal trade treaties."}</li>
                  <li>{currentLanguage === "ar" ? "يجب أن يتطابق اللفظ والمعنى بين الاسمين العربي والإنجليزي." : "High phonetical congruence between Arabic and English text."}</li>
                  <li>{currentLanguage === "ar" ? "صلاحية الحجز الرقمي 60 يوماً كحد أقصى قابلة للتمديد." : "Default digital block holds name for 60 days maximum."}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Manage Reservations List (Citizen & Reviewer queues) */}
        {activeTab === "reservations" && (
          <div className="space-y-6">
            
            {/* Quick stats on Reservations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{currentLanguage === "ar" ? "إجمالي الأسماء المحجوزة" : "Total Reserved Names"}</p>
                  <p className="text-xl font-black text-[#1E293B]">{reservations.filter(r => r.status === "approved").length}</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{currentLanguage === "ar" ? "طلبات قيد المراجعة" : "Pending Approvals"}</p>
                  <p className="text-xl font-black text-[#1E293B]">{reservations.filter(r => r.status === "pending").length}</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{currentLanguage === "ar" ? "حجوزات منتهية" : "Expired Reservations"}</p>
                  <p className="text-xl font-black text-[#1E293B]">{reservations.filter(r => r.status === "expired").length}</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sudan-green/10 text-sudan-green border border-sudan-green/20">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{currentLanguage === "ar" ? "مرتبطة بسجلات تجارية" : "Linked Registrations"}</p>
                  <p className="text-xl font-black text-[#1E293B]">{reservations.filter(r => r.linkedRegistrationId).length}</p>
                </div>
              </div>
            </div>

            {/* List Table container */}
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="bg-slate-50 border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#1E293B]">{currentLanguage === "ar" ? "قائمة معاملات وسجلات حجز الأسماء الفيدرالية" : "Federal Naming Ledger & Applications"}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{currentLanguage === "ar" ? "نظام المعاملات المحدث بلحظة والمسجل في سجل التدقيق" : "Real-time ledger synchronizing every submission and action logs"}</p>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-[10px] uppercase font-bold bg-slate-200 text-slate-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Shield className="h-3 w-3 text-sudan-green" />
                    {currentLanguage === "ar" ? `صلاحية المراجعة: ${selectedRole}` : `Review Privilege: ${selectedRole}`}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100 overflow-x-auto">
                {reservations.map(r => (
                  <div key={r.id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors">
                    
                    {/* Left block Name Info */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                          r.status === "approved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                          r.status === "pending" ? "bg-amber-100 text-amber-800 border-amber-200" :
                          r.status === "suspended" ? "bg-red-100 text-red-800 border-red-200" :
                          "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {r.status === "approved" ? (currentLanguage === "ar" ? "موافق ومعتمد" : "APPROVED") :
                           r.status === "pending" ? (currentLanguage === "ar" ? "قيد التدقيق" : "UNDER AUDIT") :
                           r.status === "suspended" ? (currentLanguage === "ar" ? "معلق سيادياً" : "SUSPENDED") :
                           (currentLanguage === "ar" ? "منتهي / ملغي" : "EXPIRED")}
                        </span>
                        <span className="text-xs font-mono font-bold text-sudan-gold">{r.refNumber}</span>
                        <span className="text-[10px] bg-[#F4F6F5] border border-gray-200 px-2 py-0.5 rounded-md font-bold text-gray-500">
                          {CLASSIFICATION_CATEGORIES.find(c => c.id === r.classification)?.labelAr}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-base text-[#1E293B]">{r.nameAr}</h4>
                        <p className="text-xs text-gray-400 font-semibold">{r.nameEn}</p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-bold pt-2 border-t border-gray-100/50">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-gray-400" />
                          {currentLanguage === "ar" ? "مقدم الطلب:" : "Applicant:"} {r.applicantName} ({r.applicantRole})
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {currentLanguage === "ar" ? "تاريخ الحجز:" : "Reserved:"} {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 text-rose-600">
                          <Clock className="h-3.5 w-3.5" />
                          {currentLanguage === "ar" ? "ينتهي في:" : "Expires:"} {new Date(r.expiryDate).toLocaleDateString()}
                        </span>
                        {r.linkedRegistrationId && (
                          <span className="text-emerald-700 font-black flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {currentLanguage === "ar" ? "مرتبط بسجل تجاري معتمد" : "Linked with Registry"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right block Actions depending on simulated role */}
                    <div className="flex flex-wrap items-center gap-2 lg:self-center">
                      
                      {/* Public/Merchant Actions */}
                      {r.status === "approved" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedReservation(r);
                              setAmendmentNameAr(r.nameAr);
                              setAmendmentNameEn(r.nameEn);
                              setIsAmendOpen(true);
                            }}
                            className="bg-white hover:bg-slate-50 text-[#1E293B] border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            {currentLanguage === "ar" ? "طلب تعديل" : "Amend Name"}
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedReservation(r);
                              setTransferOwnerName("");
                              setIsTransferOpen(true);
                            }}
                            className="bg-white hover:bg-slate-50 text-[#1E293B] border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            {currentLanguage === "ar" ? "نقل ملكية" : "Transfer Name"}
                          </button>

                          <button
                            onClick={() => handleExtendReservation(r.id)}
                            className="bg-slate-100 hover:bg-slate-200 text-sudan-green px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            {currentLanguage === "ar" ? "تمديد 60 يوماً" : "Extend Block"}
                          </button>

                          <button
                            onClick={() => handleCancelReservation(r.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {currentLanguage === "ar" ? "إلغاء الحجز" : "Cancel"}
                          </button>
                        </>
                      )}

                      {r.status === "expired" && (
                        <button
                          onClick={() => handleReactivateName(r.id)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          {currentLanguage === "ar" ? "إعادة تفعيل الاسم" : "Reactivate Block"}
                        </button>
                      )}

                      {/* Linking option if approved but not linked */}
                      {r.status === "approved" && !r.linkedRegistrationId && companies.length > 0 && (
                        <div className="bg-[#F4F6F5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                          <span className="text-gray-400">{currentLanguage === "ar" ? "ربط بسجل:" : "Link Registry:"}</span>
                          <select
                            onChange={(e) => {
                              if (e.target.value) handleLinkRegistration(r.id, e.target.value);
                            }}
                            className="bg-transparent text-sudan-green outline-none font-bold cursor-pointer"
                            defaultValue=""
                          >
                            <option value="">{currentLanguage === "ar" ? "اختر شركة..." : "Select..."}</option>
                            {companies.map(c => (
                              <option key={c.id} value={c.id}>
                                {currentLanguage === "ar" ? c.companyNameAr : c.companyNameEn}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* REVIEWER & ADMIN CONSOLE */}
                      {(selectedRole === "registry_officer" || selectedRole === "dept_manager" || selectedRole === "minister") && (
                        <div className="bg-[#F4F6F5] p-2 rounded-xl border border-gray-200 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={currentLanguage === "ar" ? "ملاحظات التدقيق..." : "Audit notes..."}
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            className="bg-white border border-gray-200 text-[11px] px-2.5 py-1 rounded-lg outline-none max-w-[120px]"
                          />
                          {r.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(r.id, "approved")}
                                className="bg-sudan-green text-white text-[10px] px-2.5 py-1.5 rounded-lg font-bold cursor-pointer hover:opacity-90"
                              >
                                {currentLanguage === "ar" ? "اعتماد" : "Approve"}
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(r.id, "rejected")}
                                className="bg-red-600 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-bold cursor-pointer hover:opacity-90"
                              >
                                {currentLanguage === "ar" ? "رفض" : "Reject"}
                              </button>
                            </>
                          )}
                          {r.status === "approved" && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, "suspended")}
                              className="bg-amber-600 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-bold cursor-pointer hover:opacity-90"
                            >
                              {currentLanguage === "ar" ? "تعليق سيادي" : "Suspend"}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Certificate Generator View Button */}
                      {r.status === "approved" && (
                        <button
                          onClick={() => {
                            setSelectedReservation(r);
                            setActiveTab("verification");
                            setVerificationRef(r.refNumber);
                            // Simulate verify search trigger
                            setVerificationResultRecord(r);
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-sudan-gold p-2 rounded-xl border border-sudan-gold/20 hover:scale-105 transition-all"
                          title={currentLanguage === "ar" ? "عرض وطباعة الشهادة المعتمدة" : "Print Official Certificate"}
                        >
                          <QrCode className="h-4.5 w-4.5" />
                        </button>
                      )}

                      {/* Display Audit logs/History modal */}
                      <button
                        onClick={() => {
                          setSelectedReservation(r);
                        }}
                        className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl"
                        title={currentLanguage === "ar" ? "عرض سجل حركات الإجراءات والتدقيق" : "View Naming Audit Log"}
                      >
                        <History className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Public Verification Portal & Certificates Viewer */}
        {activeTab === "verification" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Verification Form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-sudan-green" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#1E293B]">
                    {currentLanguage === "ar" ? "بوابة التحقق الفيدرالي الفوري" : "National Verification gateway"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {currentLanguage === "ar" ? "تحقق من صلاحية شهادات وحجوزات الأسماء التجارية الموثقة برمز QR ومستخرجات الوزارة الرسمية" : "Instantly verify registry entries, blockchain ref codes, and paper certificate integrity."}
                  </p>
                </div>

                <form onSubmit={handleVerifyRef} className="space-y-3.5 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الرقم المرجعي الموحد للشهادة *" : "Unified Certificate Reference *"}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SDN-NAME-2026-90412"
                      value={verificationRef}
                      onChange={(e) => setVerificationRef(e.target.value)}
                      className="w-full bg-[#F4F6F5] border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green font-mono font-bold"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="h-4 w-4 text-sudan-gold" />
                    {currentLanguage === "ar" ? "استعلام والتحقق الرقمي" : "Query Federal Ledger"}
                  </button>
                </form>

                {verificationError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-xs flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{verificationError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Printable Certificate Showcase */}
            <div className="lg:col-span-2">
              {verificationResultRecord ? (
                <div className="bg-[#0B150F] text-slate-100 rounded-3xl p-8 border-2 border-sudan-gold/40 shadow-xl space-y-6 relative overflow-hidden">
                  
                  {/* Decorative background vectors for government credentials */}
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
                    <svg width="350" height="350" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M50 0 L100 100 L0 100 Z" />
                    </svg>
                  </div>
                  
                  {/* Certificate Header Emblem */}
                  <div className="flex flex-col items-center text-center space-y-2 border-b border-sudan-gold/20 pb-6 relative z-10">
                    <div className="h-16 w-16 bg-white/5 rounded-full border border-sudan-gold flex items-center justify-center mb-1">
                      <ShieldCheck className="h-9 w-9 text-sudan-gold" />
                    </div>
                    <span className="text-[10px] tracking-widest text-sudan-gold font-bold uppercase">{currentLanguage === "ar" ? "جمهورية السودان" : "REPUBLIC OF THE SUDAN"}</span>
                    <h2 className="text-sm font-black text-white">{currentLanguage === "ar" ? "وزارة التجارة والصناعة الاتحادية" : "FEDERAL MINISTRY OF COMMERCE & INDUSTRY"}</h2>
                    <p className="text-[10px] text-emerald-400 font-bold">{currentLanguage === "ar" ? "الإدارة العامة للسجل التجاري والأسماء" : "General Administration of Commercial Names & Registry"}</p>
                    
                    <div className="bg-white/5 border border-sudan-gold/35 text-sudan-gold font-bold text-xs px-6 py-2 rounded-xl mt-3">
                      {currentLanguage === "ar" ? "شهادة حجز اسم تجاري رسمي" : "OFFICIAL COMMERCIAL NAME BLOCK CERTIFICATE"}
                    </div>
                  </div>

                  {/* Certificate Body details */}
                  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-4 text-xs text-slate-350 relative z-10">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "الرقم المرجعي الموحد" : "Unified Ledger Ref"}</span>
                      <span className="font-mono text-sudan-gold font-black text-sm">{verificationResultRecord.refNumber}</span>
                    </div>

                    <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">{currentLanguage === "ar" ? "الاسم التجاري المحجوز المعتمد" : "Sovereign Certified Commercial Name"}</span>
                      <span className="text-white font-extrabold text-base tracking-wide">{verificationResultRecord.nameAr}</span>
                      <span className="text-xs text-gray-400 italic font-medium">{verificationResultRecord.nameEn}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/5 pb-2">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">{currentLanguage === "ar" ? "صاحب الحجز / مقدم الطلب" : "Applicant / License Owner"}</span>
                        <span className="text-white font-bold text-[13px]">{verificationResultRecord.applicantName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">{currentLanguage === "ar" ? "التصنيف والنشاط" : "Sector & Classification"}</span>
                        <span className="text-white font-bold text-[13px]">
                          {CLASSIFICATION_CATEGORIES.find(c => c.id === verificationResultRecord.classification)?.labelAr} / {CLASSIFICATION_CATEGORIES.find(c => c.id === verificationResultRecord.classification)?.labelEn}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-1">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">{currentLanguage === "ar" ? "تاريخ اعتماد الحجز" : "Issuing Authority Date"}</span>
                        <span className="text-white font-bold">{new Date(verificationResultRecord.createdAt).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">{currentLanguage === "ar" ? "تاريخ نهاية صلاحية الحجز" : "Expiration Milestone"}</span>
                        <span className="text-rose-400 font-bold">{new Date(verificationResultRecord.expiryDate).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR code validation row */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-sudan-green/10 border border-sudan-green/20 p-4 rounded-2xl relative z-10">
                    <div className="bg-white p-2 rounded-xl shrink-0 border border-sudan-gold">
                      <QrCode className="h-12 w-12 text-slate-900" />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <h5 className="text-xs font-extrabold text-sudan-gold uppercase tracking-wider">{currentLanguage === "ar" ? "توثيق التوقيع الرقمي السيادي" : "Federal Signature & Verification"}</h5>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        {currentLanguage === "ar" 
                          ? "تم توقيع وتشفير هذا المستند رقمياً بموجب نظام التوقيع الإلكتروني لوزارة التجارة بجمهورية السودان لعام 2026. أي كشط أو تعديل يبطلها." 
                          : "This document is officially signed using sovereign public-key infrastructure (PKI) keys certified for federal trade registries."}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono pt-2 border-t border-white/5">
                    <span>IP AUDIT LOGGED: 196.29.54.10</span>
                    <button
                      onClick={() => window.print()}
                      className="bg-white/5 hover:bg-white/10 text-sudan-gold border border-sudan-gold/20 px-4 py-2 rounded-xl text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {currentLanguage === "ar" ? "تحميل بصيغة PDF وطباعة" : "Print PDF"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 text-center py-20 rounded-3xl space-y-4 shadow-xs">
                  <Building2 className="h-14 w-14 text-slate-300 mx-auto" />
                  <div>
                    <h4 className="text-[#1E293B] font-extrabold text-sm">{currentLanguage === "ar" ? "بانتظار الاستعلام والتحقق" : "Awaiting Verification Query"}</h4>
                    <p className="text-gray-400 text-xs mt-1">
                      {currentLanguage === "ar" ? "أدخل رقم الشهادة أو امسح رمز الـ QR من القائمة لإنتاج الشهادة الموثقة" : "Please input a valid reference identifier or select a record to load the state credential template."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Sovereign Specifications & Government Blueprints */}
        {activeTab === "specs" && (
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            
            {/* Header tab specifications */}
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-black text-[#1E293B] flex items-center gap-2">
                <FileCode className="h-5 w-5 text-sudan-green" />
                {currentLanguage === "ar" ? "حزمة تقارير الاعتماد الفيدرالي للأسماء التجارية" : "Commercial Names Sovereign Implementation Specifications"}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {currentLanguage === "ar" ? "المستندات الرسمية والتقارير الفنية المصممة للمجلس السيادي والوزير ومسؤولي الأنظمة السحابية" : "Sovereign blueprints detailing database schemas, permissions, verification frameworks, and AI guidelines."}
              </p>
            </div>

            {/* Grid of Accordions/Details representing the exact final deliverables */}
            <div className="space-y-4">
              
              {/* Deliverable 1 */}
              <details className="group bg-[#F4F6F5] border border-gray-200 rounded-2xl overflow-hidden" open>
                <summary className="font-extrabold text-xs md:text-sm text-[#1E293B] px-5 py-4 cursor-pointer hover:bg-slate-200/50 flex justify-between items-center transition-colors">
                  <span>1. {currentLanguage === "ar" ? "التقرير الوطني الشامل وخطة تنفيذ المنصة التجارية" : "National Commercial Names Master Implementation Report"}</span>
                  <span className="text-sudan-green text-[10px] bg-sudan-green/10 px-2.5 py-1 rounded-full font-bold">SPEC APPROVED</span>
                </summary>
                <div className="px-6 py-5 border-t border-gray-200/70 bg-white text-xs text-gray-600 leading-relaxed space-y-3">
                  <p className="font-bold text-slate-800 text-sm">
                    {currentLanguage === "ar" ? "الملخص التنفيذي والاستراتيجية الفيدرالية 2026-2035:" : "Executive Summary & Federal Roadmap 2026-2035:"}
                  </p>
                  <p>
                    {currentLanguage === "ar" 
                      ? "تمثل هذه المنصة الركيزة السيادية الأساسية لإطلاق الجيل الجديد من المعاملات التجارية الميسرة والمحمية رقمياً في جمهورية السودان. تم ربط نظام الأسماء التجارية مباشرة بقاعدة بيانات السجل التجاري والشركات الفيدرالي، لضمان مواءمة تامة تمنع تسجيل أي كيان تجاري دون حيازة اسم سليم وقانوني معتمد مسبقاً."
                      : "This specification acts as the definitive architecture blueprint for commercial names protection. By linking names directly to the central registry ledger, we eliminate duplicate naming claims and secure intellectual assets under federal trade laws."}
                  </p>
                  <p className="font-bold text-slate-800 pt-2">
                    {currentLanguage === "ar" ? "أهداف المنصة الاستراتيجية:" : "Strategic Objectives:"}
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{currentLanguage === "ar" ? "تقليص زمن معالجة حجز الأسماء التجارية من 5 أيام عمل إلى 2 ثانية (فحص فوري)." : "Reduction of name reservation cycles from 5 business days to under 2 seconds."}</li>
                    <li>{currentLanguage === "ar" ? "توفير بيئة تحقق عامة ومفتوحة لتعزيز الثقة في الكيانات الاستثمارية والشركات." : "Providing secure public APIs for banks and legal entities to verify reservations."}</li>
                    <li>{currentLanguage === "ar" ? "حماية الأسماء التجارية والماركات الوطنية من الانتحال والتعدي." : "Integration with international trademark databases under COMESA and local acts."}</li>
                  </ul>
                </div>
              </details>

              {/* Deliverable 2 */}
              <details className="group bg-[#F4F6F5] border border-gray-200 rounded-2xl overflow-hidden">
                <summary className="font-extrabold text-xs md:text-sm text-[#1E293B] px-5 py-4 cursor-pointer hover:bg-slate-200/50 flex justify-between items-center transition-colors">
                  <span>2. {currentLanguage === "ar" ? "المخطط الهيكلي لقاعدة بيانات Firestore وتمديد السجلات" : "Firestore Data Extension Plan & Schema Mapping"}</span>
                  <span className="text-sudan-green text-[10px] bg-sudan-green/10 px-2.5 py-1 rounded-full font-bold">DATABASE SCHEMA</span>
                </summary>
                <div className="px-6 py-5 border-t border-gray-200/70 bg-white text-xs text-gray-600 leading-relaxed space-y-4 font-mono">
                  <p className="font-bold text-slate-800 text-xs font-sans">
                    {currentLanguage === "ar" ? "تمديد هيكل المجموعات الفيدرالية في قاعدة البيانات Firestore:" : "Extending the Firestore collection schemas for Commercial Names:"}
                  </p>
                  
                  <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl border border-slate-800 space-y-2">
                    <p>// Collection: /commercial_names_reservations</p>
                    <p>{"{"}</p>
                    <p className="pl-4">id: string // Unique identifier</p>
                    <p className="pl-4">nameAr: string // Registered name in Arabic</p>
                    <p className="pl-4">nameEn: string // Registered name in English</p>
                    <p className="pl-4">classification: "commercial" | "industrial" | "professional" | "investment" | "service"</p>
                    <p className="pl-4">applicantName: string // Full applicant name</p>
                    <p className="pl-4">applicantRole: "citizen" | "merchant" | "representative"</p>
                    <p className="pl-4">status: "pending" | "approved" | "rejected" | "expired" | "suspended"</p>
                    <p className="pl-4">refNumber: string // Formatted SDN-NAME-YYYY-XXXXX</p>
                    <p className="pl-4">createdAt: timestamp // System timestamp</p>
                    <p className="pl-4">expiryDate: timestamp // Auto expiry at T+60 days</p>
                    <p className="pl-4">linkedRegistrationId: string | null // Reference to commercial registration</p>
                    <p className="pl-4">history: Array // Array of action audit logs</p>
                    <p>{"}"}</p>
                  </div>
                </div>
              </details>

              {/* Deliverable 3 */}
              <details className="group bg-[#F4F6F5] border border-gray-200 rounded-2xl overflow-hidden">
                <summary className="font-extrabold text-xs md:text-sm text-[#1E293B] px-5 py-4 cursor-pointer hover:bg-slate-200/50 flex justify-between items-center transition-colors">
                  <span>3. {currentLanguage === "ar" ? "نظام وإطار العمل للتدقيق والتحقق الذكي والتحذيرات" : "Intelligent Name Validation Framework Specification"}</span>
                  <span className="text-sudan-green text-[10px] bg-sudan-green/10 px-2.5 py-1 rounded-full font-bold">VERIFICATION ALGORITHMS</span>
                </summary>
                <div className="px-6 py-5 border-t border-gray-200/70 bg-white text-xs text-gray-600 leading-relaxed space-y-3">
                  <p className="font-bold text-slate-800">
                    {currentLanguage === "ar" ? "منهجية الفحص الذاتي والتحذيرات التلقائية:" : "Automated validation stages & legal validation pipelines:"}
                  </p>
                  <p>
                    {currentLanguage === "ar" 
                      ? "يتكون إطار العمل المطور من خمس مراحل من الفلاتر المعالجة المتتالية لضمان النزاهة القانونية للاسم التجاري المقترح:"
                      : "The validation engine comprises five sequential filter stages running prior to registry submission:"}
                  </p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      <strong>{currentLanguage === "ar" ? "فلتر التكرار المطابق (Exact Match Filter):" : "Exact Match Filter:"}</strong>{" "}
                      {currentLanguage === "ar" ? "البحث الفوري المتزامن في السجلات الفيدرالية عن أي تطابق تام للاسم باللغتين العربية أو الإنجليزية." : "Pre-index lookup in approved reservations and registrations."}
                    </li>
                    <li>
                      <strong>{currentLanguage === "ar" ? "فلتر المشابهات اللفظية والصوتية (Phonetic similarity analyzer):" : "Phonetic Similarity Analyzer:"}</strong>{" "}
                      {currentLanguage === "ar" ? "استخدام خوارزميات مثل Double Metaphone لتجنب تسجيل أسماء قد تسبب التباساً أو غشاً تجارياً للجمهور." : "Prevents register fraud by analyzing phonetic distance metrics."}
                    </li>
                    <li>
                      <strong>{currentLanguage === "ar" ? "مصفاة المصطلحات السيادية والمحجوزة (Reserved keywords check):" : "Reserved Keywords Check:"}</strong>{" "}
                      {currentLanguage === "ar" ? "حظر الكلمات المخصصة للدولة والوزارات والألقاب الرسمية دون الحصول على مرسوم وزاري." : "Prevents the unauthorized usage of words such as 'ministry', 'military', or 'republic'."}
                    </li>
                  </ol>
                </div>
              </details>

              {/* Deliverable 4 */}
              <details className="group bg-[#F4F6F5] border border-gray-200 rounded-2xl overflow-hidden">
                <summary className="font-extrabold text-xs md:text-sm text-[#1E293B] px-5 py-4 cursor-pointer hover:bg-slate-200/50 flex justify-between items-center transition-colors">
                  <span>4. {currentLanguage === "ar" ? "مصفوفة الصلاحيات والأدوار الموحدة للأسماء التجارية" : "Role & Permission Security Matrix (RBAC)"}</span>
                  <span className="text-sudan-green text-[10px] bg-sudan-green/10 px-2.5 py-1 rounded-full font-bold">RBAC CONTROL MAP</span>
                </summary>
                <div className="px-6 py-5 border-t border-gray-200/70 bg-white text-xs text-gray-600 leading-relaxed space-y-4">
                  <p className="font-bold text-slate-800">
                    {currentLanguage === "ar" ? "توزيع الصلاحيات عبر مستويات الإدارة الحكومية والمستفيدين:" : "Permissions breakdown for citizens, registry staff, and government managers:"}
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-gray-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-100 text-[#1E293B] font-bold">
                        <tr>
                          <th className="p-2 border-b border-gray-200">{currentLanguage === "ar" ? "الدور الوظيفي" : "Role"}</th>
                          <th className="p-2 border-b border-gray-200">{currentLanguage === "ar" ? "البحث والتدقيق" : "Search & Check"}</th>
                          <th className="p-2 border-b border-gray-200">{currentLanguage === "ar" ? "طلب حجز" : "Submit Request"}</th>
                          <th className="p-2 border-b border-gray-200">{currentLanguage === "ar" ? "الاعتماد والرفض" : "Approve / Reject"}</th>
                          <th className="p-2 border-b border-gray-200">{currentLanguage === "ar" ? "تعديل ونقل ملكية" : "Amend / Transfer"}</th>
                          <th className="p-2 border-b border-gray-200">{currentLanguage === "ar" ? "التعليق السيادي" : "Sovereign Actions"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150">
                        <tr>
                          <td className="p-2 font-bold text-[#1E293B]">{currentLanguage === "ar" ? "المواطن والتاجر" : "Citizen / Merchant"}</td>
                          <td className="p-2 text-emerald-600 font-bold">YES</td>
                          <td className="p-2 text-emerald-600 font-bold">YES</td>
                          <td className="p-2 text-rose-600 font-bold">NO</td>
                          <td className="p-2 text-emerald-600 font-bold">YES (Own)</td>
                          <td className="p-2 text-rose-600 font-bold">NO</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-[#1E293B]">{currentLanguage === "ar" ? "مسؤول السجل" : "Registry Officer"}</td>
                          <td className="p-2 text-emerald-600 font-bold">YES</td>
                          <td className="p-2 text-rose-600 font-bold">NO</td>
                          <td className="p-2 text-emerald-600 font-bold">YES</td>
                          <td className="p-2 text-emerald-600 font-bold">YES (All)</td>
                          <td className="p-2 text-rose-600 font-bold">NO</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-[#1E293B]">{currentLanguage === "ar" ? "المدير والوزير" : "Director / Minister"}</td>
                          <td className="p-2 text-emerald-600 font-bold">YES</td>
                          <td className="p-2 text-rose-600 font-bold">NO</td>
                          <td className="p-2 text-emerald-600 font-bold">YES</td>
                          <td className="p-2 text-emerald-600 font-bold">YES</td>
                          <td className="p-2 text-emerald-600 font-bold">YES (Override)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>

              {/* Deliverable 5 */}
              <details className="group bg-[#F4F6F5] border border-gray-200 rounded-2xl overflow-hidden">
                <summary className="font-extrabold text-xs md:text-sm text-[#1E293B] px-5 py-4 cursor-pointer hover:bg-slate-200/50 flex justify-between items-center transition-colors">
                  <span>5. {currentLanguage === "ar" ? "دليل توجيه وإدارة مسار إجراءات حجز الأسماء" : "Workflow Configuration Guide & Lifecycle States"}</span>
                  <span className="text-sudan-green text-[10px] bg-sudan-green/10 px-2.5 py-1 rounded-full font-bold">PROCESS WORKFLOW</span>
                </summary>
                <div className="px-6 py-5 border-t border-gray-200/70 bg-white text-xs text-gray-600 leading-relaxed space-y-3">
                  <p className="font-bold text-slate-800">
                    {currentLanguage === "ar" ? "مراحل دورة حياة الاسم التجاري المقيد:" : "Lifecycle states of reserved names:"}
                  </p>
                  <p>
                    {currentLanguage === "ar" 
                      ? "يمر حجز الاسم التجاري بمسار مغلق مؤمن بالكامل لضمان سلامة التعاملات ومنع التضارب:"
                      : "Sovereign names progress sequentially through robust validation gates to prevent registry collision:"}
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 font-sans text-slate-700">
                    <li><strong>{currentLanguage === "ar" ? "تقديم الطلب (Submission Stage):" : "Submission Stage:"}</strong> {currentLanguage === "ar" ? "إدخال الاسم المزدوج، واختيار التصنيف بدقة." : "Applicant drafts naming pairs and binds classification."}</li>
                    <li><strong>{currentLanguage === "ar" ? "التدقيق الآلي والتحذيرات (Intelligent Validation Gate):" : "Intelligent Validation Gate:"}</strong> {currentLanguage === "ar" ? "يعمل تلقائياً لمعالجة الألفاظ والتكرار في السحابة." : "Cloud filters check for government reserved words, spelling length, and phonetics."}</li>
                    <li><strong>{currentLanguage === "ar" ? "مراجعة مسجل الأسماء (Registry Review):" : "Registry Review:"}</strong> {currentLanguage === "ar" ? "مراجعة بشرية للتاكد من توافق النشاط التجاري." : "Sovereign officers cross-examine requests for compliance with intellectual property guidelines."}</li>
                    <li><strong>{currentLanguage === "ar" ? "تصدير الشهادة المشفرة (Certificate & Validation):" : "Certificate & Validation:"}</strong> {currentLanguage === "ar" ? "توليد الرمز المرجعي والـ QR وتفعيل حجب حيازة الاسم." : "Secures the reservation block with QR validation metadata."}</li>
                  </ol>
                </div>
              </details>

              {/* Deliverable 6 */}
              <details className="group bg-[#F4F6F5] border border-gray-200 rounded-2xl overflow-hidden">
                <summary className="font-extrabold text-xs md:text-sm text-[#1E293B] px-5 py-4 cursor-pointer hover:bg-slate-200/50 flex justify-between items-center transition-colors">
                  <span>6. {currentLanguage === "ar" ? "تحديث التقارير والإحصائيات وتوزيعات الحجز الفيدرالية" : "Sovereign Reporting & Dashboard Enhancement Report"}</span>
                  <span className="text-sudan-green text-[10px] bg-sudan-green/10 px-2.5 py-1 rounded-full font-bold">ANALYTICS & BI</span>
                </summary>
                <div className="px-6 py-5 border-t border-gray-200/70 bg-white text-xs text-gray-600 leading-relaxed space-y-4">
                  <p className="font-bold text-slate-800">
                    {currentLanguage === "ar" ? "مؤشرات وتوزيعات حجز الأسماء التجارية الفيدرالية:" : "National naming analytics and distribution metrics:"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#F4F6F5] rounded-xl border border-gray-200 space-y-2">
                      <p className="font-bold text-slate-800">{currentLanguage === "ar" ? "توزيع الفئات المعتمدة:" : "Category Distribution:"}</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>{currentLanguage === "ar" ? "القطاع التجاري العام: 45%" : "General Commercial: 45%"}</li>
                        <li>{currentLanguage === "ar" ? "القطاع الخدمي واللوجستي: 25%" : "Service & Logistics: 25%"}</li>
                        <li>{currentLanguage === "ar" ? "القطاع الصناعي والاستثماري: 20%" : "Industrial & investment: 20%"}</li>
                        <li>{currentLanguage === "ar" ? "القطاعات المهنية المحدودة: 10%" : "Professional consultancies: 10%"}</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-[#F4F6F5] rounded-xl border border-gray-200 space-y-2">
                      <p className="font-bold text-slate-800">{currentLanguage === "ar" ? "أوقات المعالجة ومعدل التجديد:" : "Processing & Renewal Statistics:"}</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>{currentLanguage === "ar" ? "متوسط زمن اتخاذ القرار: 4.2 دقيقة" : "Average review duration: 4.2 minutes"}</li>
                        <li>{currentLanguage === "ar" ? "معدل تجديد وتمديد الحجوزات: 18.4%" : "Extension & renew rate: 18.4%"}</li>
                        <li>{currentLanguage === "ar" ? "نسبة تحويل الأسماء إلى سجلات نشطة: 85.2%" : "Names integrated to registered firms: 85.2%"}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>

      {/* Form Dialog for New Reservation */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-5 w-5 text-sudan-gold" />
                  <h3 className="font-bold text-base">
                    {currentLanguage === "ar" ? "طلب حجز اسم تجاري جديد" : "Reserve New Commercial Name"}
                  </h3>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full text-white cursor-pointer transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {currentLanguage === "ar" ? "تم تقديم طلب الحجز بنجاح!" : "Name Reserved Successfully!"}
                  </h3>
                  <p className="text-sm text-slate-500 font-mono font-bold">
                    {newRefNumber}
                  </p>
                  <p className="text-xs text-gray-400">
                    {currentLanguage === "ar" ? "بانتظار التحقق من سلامة الاسم وموافقة المسجل الفيدرالي في غضون دقائق" : "Awaiting final confirmation from federal agents within minutes."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreateReservation} className="p-6 space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الاسم المطلوب باللغة العربية *" : "Arabic Commercial Name *"}</label>
                      <input
                        type="text"
                        required
                        value={formNameAr}
                        onChange={(e) => setFormNameAr(e.target.value)}
                        placeholder="مثال: شركة سنار للحلول الهندسية المحدودة"
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                        dir="rtl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الاسم المطلوب باللغة الإنجليزية *" : "English Commercial Name *"}</label>
                      <input
                        type="text"
                        required
                        value={formNameEn}
                        onChange={(e) => setFormNameEn(e.target.value)}
                        placeholder="e.g. Sennar Engineering Solutions Ltd"
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "التصنيف التجاري للاسم *" : "Name Classification *"}</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as NameClassificationType)}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      >
                        {CLASSIFICATION_CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>
                            {currentLanguage === "ar" ? c.labelAr : c.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم مقدم الطلب الرباعي *" : "Applicant Full Name *"}</label>
                      <input
                        type="text"
                        required
                        value={formApplicantName}
                        onChange={(e) => setFormApplicantName(e.target.value)}
                        placeholder="مثال: ياسر عوض الجاك فضل"
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الصفة الاعتبارية لمقدم الطلب *" : "Applicant Legal Status *"}</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="applicantRole"
                          checked={formApplicantRole === "citizen"}
                          onChange={() => setFormApplicantRole("citizen")}
                        />
                        <span>{currentLanguage === "ar" ? "مواطن سوداني معتمد" : "Sudanese Citizen"}</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="applicantRole"
                          checked={formApplicantRole === "merchant"}
                          onChange={() => setFormApplicantRole("merchant")}
                        />
                        <span>{currentLanguage === "ar" ? "تاجر مسجل" : "Registered Merchant"}</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="applicantRole"
                          checked={formApplicantRole === "representative"}
                          onChange={() => setFormApplicantRole("representative")}
                        />
                        <span>{currentLanguage === "ar" ? "مفوض / وكيل شركة" : "Company Representative"}</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 leading-relaxed">
                      {currentLanguage === "ar" 
                        ? "تقر بمسؤوليتك الكاملة وصحة البيانات المدخلة وموافقتها التامة لقانون الأسماء التجارية جمهورية السودان وقرارات التحول الرقمي الموثقة لعام 2026." 
                        : "You acknowledge that all drafted name pairs are legally authentic and comply with commercial naming guidelines of the Republic of Sudan."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-sm font-semibold">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
                    >
                      {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2.5 rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                    >
                      {currentLanguage === "ar" ? "تقديم طلب الحجز" : "Reserve Name Block"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Audit Logs / History Modal */}
      <AnimatePresence>
        {selectedReservation && !isAmendOpen && !isTransferOpen && activeTab !== "verification" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
                <div className="flex items-center gap-2">
                  <History className="h-4.5 w-4.5 text-sudan-gold" />
                  <h3 className="font-bold text-xs md:text-sm">
                    {currentLanguage === "ar" ? "سجل تتبع الإجراءات وحركات التدقيق" : "Naming Transactions Audit Log"}
                  </h3>
                </div>
                <button onClick={() => setSelectedReservation(null)} className="text-gray-400 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="bg-[#F4F6F5] p-4 rounded-xl border border-gray-200 space-y-1.5">
                  <p className="font-bold text-slate-800">{currentLanguage === "ar" ? "الاسم التجاري:" : "Commercial Name:"} {selectedReservation.nameAr}</p>
                  <p className="text-gray-450 font-mono text-[10px]">{selectedReservation.refNumber} • {selectedReservation.status.toUpperCase()}</p>
                </div>

                <div className="relative border-r border-gray-200 pr-4 mr-2 space-y-5">
                  {selectedReservation.history.map((h, idx) => (
                    <div key={h.id || idx} className="relative">
                      {/* Circle indicator */}
                      <span className="absolute -right-[21px] top-0.5 h-3.5 w-3.5 rounded-full bg-sudan-green border-2 border-white flex items-center justify-center">
                        <Check className="h-2 w-2 text-white" />
                      </span>
                      
                      <div className="space-y-1">
                        <p className="font-extrabold text-[#1E293B]">{currentLanguage === "ar" ? h.actionAr : h.actionEn}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                          <span>{new Date(h.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span>{h.actorName} ({h.actorRole})</span>
                        </div>
                        {h.notes && (
                          <p className="text-[10px] bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-500 mt-1 leading-normal italic">
                            {h.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-150 flex justify-end">
                  <button
                    onClick={() => setSelectedReservation(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    {currentLanguage === "ar" ? "إغلاق السجل" : "Close Audit"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AMENDMENT DIALOG */}
      <AnimatePresence>
        {isAmendOpen && selectedReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
                <h3 className="font-bold text-sm">
                  {currentLanguage === "ar" ? "تقديم طلب تعديل الاسم المعتمد" : "Request Name Amendment"}
                </h3>
                <button onClick={() => setIsAmendOpen(false)} className="text-gray-400 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAmendName} className="p-6 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الاسم العربي المعدل *" : "Amended Name (Arabic) *"}</label>
                  <input
                    type="text"
                    required
                    value={amendmentNameAr}
                    onChange={(e) => setAmendmentNameAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الاسم الإنجليزي المعدل *" : "Amended Name (English) *"}</label>
                  <input
                    type="text"
                    required
                    value={amendmentNameEn}
                    onChange={(e) => setAmendmentNameEn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none"
                    dir="ltr"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAmendOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="bg-sudan-green text-white px-6 py-2.5 rounded-xl font-bold cursor-pointer shadow-md"
                  >
                    {currentLanguage === "ar" ? "حفظ وتعديل الاسم" : "Confirm Amendment"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OWNERSHIP TRANSFER DIALOG */}
      <AnimatePresence>
        {isTransferOpen && selectedReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
                <h3 className="font-bold text-sm">
                  {currentLanguage === "ar" ? "التنازل ونقل ملكية الاسم التجاري" : "Transfer Naming Rights"}
                </h3>
                <button onClick={() => setIsTransferOpen(false)} className="text-gray-400 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleTransferOwnership} className="p-6 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المتنازل له الرباعي *" : "New Owner Name *"}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: صالح عبدالله عثمان مصطفى"
                    value={transferOwnerName}
                    onChange={(e) => setTransferOwnerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none"
                  />
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 leading-normal text-[10px] text-amber-800">
                  {currentLanguage === "ar" 
                    ? "انتباه: يؤدي نقل ملكية حجز الاسم إلى حذف حيازتك القانونية وإتاحة انتقال الرقم المرجعي الموحد للمالك الجديد فوراً بموجب عقود التنازل."
                    : "Caution: This will transfer all legal certificates and future linkages to the specified recipient under federal trade protocols."}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTransferOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="bg-sudan-green text-white px-6 py-2.5 rounded-xl font-bold cursor-pointer shadow-md"
                  >
                    {currentLanguage === "ar" ? "اعتماد نقل الملكية" : "Confirm Transfer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
