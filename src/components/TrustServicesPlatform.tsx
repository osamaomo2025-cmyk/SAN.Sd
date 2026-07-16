/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * National Digital Identity & Trust Services Platform v1.0.0
 * Government-Grade PKI, Multi-Signature Engine, & Sovereign Document Trust Center
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, Key, Fingerprint, Award, CheckCircle2, AlertTriangle, XCircle, 
  Search, RefreshCw, Play, Send, Lock, Eye, Check, X, Server, Terminal, 
  Layers, Users, FileCheck, FileCode, History, Database, Cpu, HelpCircle, 
  Sparkles, Plus, Trash2, Sliders, BarChart3, Download, FileText, QrCode, 
  Workflow, CheckSquare, Clock, Globe, ShieldAlert, Landmark, Building2,
  LockKeyhole, KeyRound, Radio, Network, FileSignature, CheckCircle, ShieldCheck
} from "lucide-react";

import { UserRole } from "../types";

interface TrustServicesPlatformProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
}

// Digital Identity Schema
interface DigitalIdentity {
  uid: string;
  fullNameAr: string;
  fullNameEn: string;
  type: string;
  typeAr: string;
  status: "verified" | "verifying" | "revoked" | "compromised";
  authMethods: string[];
  role: string;
  trustLevel: "Sovereign" | "High" | "Standard";
  securityLevel: "L3-Hardware" | "L2-Software" | "L1-Basic";
  lastActive: string;
  auditTrail: {
    timestamp: string;
    actionAr: string;
    actionEn: string;
    ipAddress: string;
    node: string;
  }[];
}

// Digital Document Template to Sign
interface SignableDocument {
  id: string;
  titleAr: string;
  titleEn: string;
  type: "registration" | "license" | "contract" | "official_letter";
  initiatorAr: string;
  initiatorEn: string;
  signersRequired: string[];
  signedBy: string[];
  status: "pending" | "partially_signed" | "fully_signed";
  createdDate: string;
  secureHash?: string;
  timestampSeal?: string;
}

// CA Node Schema
interface CANode {
  id: string;
  nameAr: string;
  nameEn: string;
  type: "Root" | "Intermediate" | "Subordinate";
  issuer: string;
  validUntil: string;
  status: "active" | "suspended" | "expired";
  pkiAlgorithm: string;
  serialNumber: string;
}

// Initial Digital Identities in the sovereign database
const initialIdentities: DigitalIdentity[] = [
  {
    uid: "SUD-ID-9482-10",
    fullNameAr: "أحمد بن محمد الفاضل",
    fullNameEn: "Ahmed Bin Mohammed Al-Fadel",
    type: "Citizen",
    typeAr: "مواطن",
    status: "verified",
    authMethods: ["Password", "SMS OTP", "Biometrics (Fingerprint)", "FIDO2 Key"],
    role: "Company Founder",
    trustLevel: "High",
    securityLevel: "L3-Hardware",
    lastActive: "3 minutes ago",
    auditTrail: [
      { timestamp: "2026-07-15 05:14:12", actionAr: "توقيع ميثاق الشراكة", actionEn: "Signed partnership deed", ipAddress: "197.251.12.82", node: "NGIP-ID-NODE1" },
      { timestamp: "2026-07-15 03:02:18", actionAr: "مصادقة ثنائية ناجحة", actionEn: "Successful FIDO2 authentication", ipAddress: "197.251.12.82", node: "NGIP-ID-NODE1" }
    ]
  },
  {
    uid: "SUD-ID-3021-93",
    fullNameAr: "البروفيسور علي الطيب عثمان",
    fullNameEn: "Prof. Ali El-Tayeb Osman",
    type: "Government Employee",
    typeAr: "موظف حكومي",
    status: "verified",
    authMethods: ["Password", "Authenticator App", "FIDO2 Key"],
    role: "Senior License Registrar",
    trustLevel: "Sovereign",
    securityLevel: "L3-Hardware",
    lastActive: "Just now",
    auditTrail: [
      { timestamp: "2026-07-15 06:22:11", actionAr: "إصدار شهادة تسجيل تجاري لشركة النيل", actionEn: "Issued CR for Nile Mining Ltd", ipAddress: "10.120.2.45", node: "SDMCI-REGISTRAR-02" },
      { timestamp: "2026-07-15 06:00:03", actionAr: "تجديد المفتاح المصدق", actionEn: "Renewed certified signing key", ipAddress: "10.120.2.45", node: "SDMCI-REGISTRAR-02" }
    ]
  },
  {
    uid: "SUD-ID-8201-44",
    fullNameAr: "رونالد فيرنر شوماخر",
    fullNameEn: "Ronald Werner Schumacher",
    type: "Foreign Investor",
    typeAr: "مستثمر أجنبي",
    status: "verified",
    authMethods: ["Password", "Email OTP", "Authenticator App"],
    role: "Managing Director",
    trustLevel: "High",
    securityLevel: "L2-Software",
    lastActive: "15 minutes ago",
    auditTrail: [
      { timestamp: "2026-07-15 06:10:45", actionAr: "تقديم طلب أرض صناعية بورتسودان", actionEn: "Submitted industrial land request", ipAddress: "84.22.103.11", node: "INVEST-GATEWAY-1" }
    ]
  },
  {
    uid: "SUD-ID-1029-77",
    fullNameAr: "فاطمة إبراهيم الشريف",
    fullNameEn: "Fatima Ibrahim Al-Sharif",
    type: "Lawyer / Auditor",
    typeAr: "محامٍ وموثق قانوني",
    status: "verified",
    authMethods: ["Password", "SMS OTP", "Biometrics (FaceID)"],
    role: "Notary Public",
    trustLevel: "High",
    securityLevel: "L2-Software",
    lastActive: "1 hour ago",
    auditTrail: [
      { timestamp: "2026-07-15 05:12:00", actionAr: "توثيق عقد شراكة تأسيسي", actionEn: "Notarized articles of association", ipAddress: "197.251.44.12", node: "NGIP-NOTARY-GATE" }
    ]
  },
  {
    uid: "SUD-ID-4921-08",
    fullNameAr: "ياسر عوض الكريم جاد الله",
    fullNameEn: "Yasser Awad El-Karim",
    type: "Inspector",
    typeAr: "مفتش ميداني",
    status: "verified",
    authMethods: ["Password", "SMS OTP", "Biometrics (Fingerprint)"],
    role: "Industrial Health Inspector",
    trustLevel: "Standard",
    securityLevel: "L2-Software",
    lastActive: "3 hours ago",
    auditTrail: [
      { timestamp: "2026-07-15 03:14:02", actionAr: "توقيع تقرير تفتيش مصنع تعبئة", actionEn: "Signed inspection audit for packaging mill", ipAddress: "197.251.98.5", node: "FIELD-MOBILE-04" }
    ]
  },
  {
    uid: "SUD-ID-0001-99",
    fullNameAr: "الوزير المفوض لتكنولوجيا المعلومات",
    fullNameEn: "Sovereign Super Administrator",
    type: "Super Administrator",
    typeAr: "مسؤول النظام السيادي الأعلى",
    status: "verified",
    authMethods: ["Password", "Biometrics (Retina)", "Hardware Key (HSM)", "Multi-Signature Approved"],
    role: "Sovereign Root Administrator",
    trustLevel: "Sovereign",
    securityLevel: "L3-Hardware",
    lastActive: "4 seconds ago",
    auditTrail: [
      { timestamp: "2026-07-15 06:27:00", actionAr: "تحديث سياسة جدران الحماية للـ API", actionEn: "Updated API firewall security policies", ipAddress: "10.0.1.1", node: "SOVEREIGN-SEC-CORE" },
      { timestamp: "2026-07-15 05:00:00", actionAr: "تدقيق سجل المفاتيح الموقعة", actionEn: "Audited signed key vault logs", ipAddress: "10.0.1.1", node: "SOVEREIGN-SEC-CORE" }
    ]
  }
];

// Initial PKI Nodes Configuration
const initialPKINodes: CANode[] = [
  {
    id: "SUDAN-ROOT-CA",
    nameAr: "سلطة التصديق الجذري القومية - جمهورية السودان",
    nameEn: "Sudan Sovereign National Root Certificate Authority",
    type: "Root",
    issuer: "Sovereign Self-Signed",
    validUntil: "2051-12-31",
    status: "active",
    pkiAlgorithm: "RSA-4096 / SHA-384 (Sovereign Certified)",
    serialNumber: "SN-SUDAN-0000000000000001"
  },
  {
    id: "SUDAN-COMMERCE-SUB-CA",
    nameAr: "السلطة الفرعية لوزارة التجارة والصناعة (SDMCI CA)",
    nameEn: "Sudan Commerce & Industry Government Issuing CA",
    type: "Intermediate",
    issuer: "Sudan Sovereign National Root Certificate Authority",
    validUntil: "2036-07-15",
    status: "active",
    pkiAlgorithm: "RSA-2048 / SHA-256",
    serialNumber: "SN-SUDAN-0000000000003021"
  },
  {
    id: "SUDAN-FINANCIAL-SUB-CA",
    nameAr: "سلطة التصديق والتبادل المالي الفيدرالي",
    nameEn: "Sovereign Federal Financial Exchange Intermediate CA",
    type: "Intermediate",
    issuer: "Sudan Sovereign National Root Certificate Authority",
    validUntil: "2036-07-15",
    status: "active",
    pkiAlgorithm: "ECC-384 / SHA-384",
    serialNumber: "SN-SUDAN-0000000000005012"
  },
  {
    id: "SUDAN-CIVIL-ID-SUB-CA",
    nameAr: "سلطة تصديق الهويات المدنية والبطاقة القومية",
    nameEn: "Sudan National Civil ID Card Signing Sub-CA",
    type: "Subordinate",
    issuer: "Sudan Sovereign National Root Certificate Authority",
    validUntil: "2031-12-31",
    status: "active",
    pkiAlgorithm: "RSA-2048 / SHA-256",
    serialNumber: "SN-SUDAN-0000000000009401"
  }
];

// Initial list of signable documents for simulation
const initialDocuments: SignableDocument[] = [
  {
    id: "DOC-2026-CR-001",
    titleAr: "طلب تأسيس شركة النيل لصمغ الصادر المحدودة",
    titleEn: "Incorporation Application: Nile Export Gum Arabic LLC",
    type: "registration",
    initiatorAr: "أحمد بن محمد الفاضل",
    initiatorEn: "Ahmed Bin Mohammed Al-Fadel",
    signersRequired: ["SUD-ID-9482-10", "SUD-ID-1029-77", "SUD-ID-3021-93"],
    signedBy: ["SUD-ID-9482-10"],
    status: "partially_signed",
    createdDate: "2026-07-14",
    secureHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    timestampSeal: "2026-07-14 11:24:02 UTC"
  },
  {
    id: "DOC-2026-LIC-821",
    titleAr: "رخصة استيراد وتصنيع الآلات الثقيلة للذهب",
    titleEn: "Heavy Machinery Gold Mining Import License",
    type: "license",
    initiatorAr: "رونالد فيرنر شوماخر",
    initiatorEn: "Ronald Werner Schumacher",
    signersRequired: ["SUD-ID-8201-44", "SUD-ID-3021-93"],
    signedBy: [],
    status: "pending",
    createdDate: "2026-07-15",
    secureHash: "f1a238fb819c118a8f90ee81a8b92efb1a23891001bcde91aa92eefbcda9e230"
  },
  {
    id: "DOC-2026-DEC-091",
    titleAr: "قرار وزاري بتخصيص الأرض الصناعية بالبحر الأحمر",
    titleEn: "Ministerial Decision: Industrial Land Plot in Red Sea Port",
    type: "official_letter",
    initiatorAr: "الأمانة العامة للوزارة",
    initiatorEn: "General Secretariat of SDMCI",
    signersRequired: ["SUD-ID-3021-93", "SUD-ID-0001-99"],
    signedBy: ["SUD-ID-3021-93", "SUD-ID-0001-99"],
    status: "fully_signed",
    createdDate: "2026-07-15",
    secureHash: "a9fd76e8d6f512c0a6b1062955fba2ef01de61928fb2110c1f2ea1e028b03120",
    timestampSeal: "2026-07-15 06:12:55 UTC"
  }
];

export default function TrustServicesPlatform({ currentLanguage, role }: TrustServicesPlatformProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<"dashboard" | "identities" | "pki" | "signatures" | "verification" | "mfa" | "ai" | "specs">("dashboard");

  // Core Dynamic States
  const [identities, setIdentities] = useState<DigitalIdentity[]>(initialIdentities);
  const [pkiNodes, setPkiNodes] = useState<CANode[]>(initialPKINodes);
  const [documents, setDocuments] = useState<SignableDocument[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [docSearchQuery, setDocSearchQuery] = useState("");
  
  // Signature Simulator state
  const [selectedDoc, setSelectedDoc] = useState<SignableDocument>(initialDocuments[0]);
  const [signingIdentity, setSigningIdentity] = useState<string>("SUD-ID-1029-77"); // Fatima (Lawyer)
  const [isSigning, setIsSigning] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);

  // Verification Portal States
  const [verifyInput, setVerifyInput] = useState("DOC-2026-DEC-091");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifyingProgress, setVerifyingProgress] = useState(false);

  // MFA policies by role config state
  const [mfaPolicies, setMfaPolicies] = useState({
    gov_minister: { sms: true, email: true, app: true, biometric: true, fido2: true, minTrust: "Sovereign" },
    gov_executive: { sms: true, email: true, app: true, biometric: true, fido2: true, minTrust: "Sovereign" },
    gov_employee: { sms: true, email: false, app: true, biometric: true, fido2: false, minTrust: "High" },
    business_investor: { sms: true, email: true, app: true, biometric: false, fido2: false, minTrust: "High" },
    public_citizen: { sms: true, email: true, app: false, biometric: false, fido2: false, minTrust: "Standard" }
  });

  // AI Assistant Interactions states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: "user" | "ai"; text: string; codeBlock?: string }[]>([
    {
      sender: "ai",
      text: currentLanguage === "ar" 
        ? "مرحباً بك في المركز الوطني للتحقق واستشارات الهوية السيادية. يمكنني توجيهك حول معايير التواقيع الرقمية والمصادقة بموجب قانون المعاملات الإلكترونية السوداني 2026."
        : "Welcome to the Sovereign Digital Identity and Trust Services AI Co-Pilot. I am ready to guide you on PKI protocols, multi-signature setup, and identity verification regulations in Sudan."
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // New Certificate Issuance modal state
  const [showCertModal, setShowCertModal] = useState(false);
  const [newCertName, setNewCertName] = useState("");
  const [newCertType, setNewCertType] = useState<"Intermediate" | "Subordinate">("Subordinate");
  const [newCertAlgorithm, setNewCertAlgorithm] = useState("ECC-256 / SHA-256");

  // New Identity Creation Modal state
  const [showIdModal, setShowIdModal] = useState(false);
  const [newIdNameAr, setNewIdNameAr] = useState("");
  const [newIdNameEn, setNewIdNameEn] = useState("");
  const [newIdType, setNewIdType] = useState("Resident");
  const [newIdRole, setNewIdRole] = useState("Auditor");
  const [newIdTrust, setNewIdTrust] = useState<"Standard" | "High">("High");
  const [newIdSecurity, setNewIdSecurity] = useState<"L2-Software" | "L3-Hardware">("L2-Software");

  // Specs Archive Active Deliverable ID (1 to 14)
  const [activeSpecId, setActiveSpecId] = useState<number>(14); // Default to the master report

  // Real-time ping ticker simulation to make trust metrics look alive
  const [successRate, setSuccessRate] = useState(99.98);
  const [activeCount, setActiveCount] = useState(148291);
  const [alerts, setAlerts] = useState<string[]>([
    "mTLS handshake successful for Ministry of Finance Node v2",
    "Certificate CRL checks synced with national HSM cluster"
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Small fluctuation in auth success rate
      setSuccessRate(prev => Math.max(99.91, Math.min(100, prev + (Math.random() * 0.04 - 0.02))));
      // Increase active identities slightly
      setActiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Action: Launch document signing process
  const triggerDocumentSignature = () => {
    if (!selectedDoc || !signingIdentity) return;
    setIsSigning(true);
    setSignSuccess(false);

    setTimeout(() => {
      setIsSigning(false);
      setSignSuccess(true);
      
      setDocuments(prev => prev.map(doc => {
        if (doc.id === selectedDoc.id) {
          const updatedSigned = doc.signedBy.includes(signingIdentity) 
            ? doc.signedBy 
            : [...doc.signedBy, signingIdentity];
          const isFully = updatedSigned.length >= doc.signersRequired.length;
          return {
            ...doc,
            signedBy: updatedSigned,
            status: isFully ? "fully_signed" : "partially_signed",
            secureHash: `sha256-sig-${Math.random().toString(36).substring(2, 18)}`,
            timestampSeal: new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC"
          };
        }
        return doc;
      }));

      // Append signature event to identity audit trail
      setIdentities(prev => prev.map(ident => {
        if (ident.uid === signingIdentity) {
          return {
            ...ident,
            lastActive: "Just now",
            auditTrail: [
              {
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                actionAr: `وقع إلكترونياً على المستند: ${selectedDoc.titleAr}`,
                actionEn: `Signed document digitally: ${selectedDoc.titleEn}`,
                ipAddress: "197.251.5.11",
                node: "SDMCI-TRUST-ENGINE"
              },
              ...ident.auditTrail
            ]
          };
        }
        return ident;
      }));

      // Update selected doc view
      const freshDoc = documents.find(d => d.id === selectedDoc.id);
      if (freshDoc) {
        setSelectedDoc({
          ...freshDoc,
          signedBy: freshDoc.signedBy.includes(signingIdentity) ? freshDoc.signedBy : [...freshDoc.signedBy, signingIdentity],
          status: (freshDoc.signedBy.length + 1) >= freshDoc.signersRequired.length ? "fully_signed" : "partially_signed",
          secureHash: `sha256-sig-${Math.random().toString(36).substring(2, 18)}`,
          timestampSeal: new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC"
        });
      }

      setTimeout(() => setSignSuccess(false), 4000);
    }, 2000);
  };

  // Action: Launch public document verification
  const handleVerifyDocument = () => {
    setVerifyingProgress(true);
    setVerificationResult(null);

    setTimeout(() => {
      setVerifyingProgress(false);
      const doc = documents.find(d => d.id === verifyInput || d.secureHash === verifyInput);
      if (doc) {
        const signersDetails = doc.signedBy.map(uid => {
          const idObj = identities.find(i => i.uid === uid);
          return idObj ? `${idObj.fullNameEn} (${idObj.role})` : uid;
        });

        const pendingSigners = doc.signersRequired
          .filter(uid => !doc.signedBy.includes(uid))
          .map(uid => {
            const idObj = identities.find(i => i.uid === uid);
            return idObj ? `${idObj.fullNameEn} (${idObj.role})` : uid;
          });

        setVerificationResult({
          valid: true,
          titleAr: doc.titleAr,
          titleEn: doc.titleEn,
          type: doc.type,
          createdDate: doc.createdDate,
          hash: doc.secureHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          timestampSeal: doc.timestampSeal || "Pending Signature Completion",
          signerNames: signersDetails,
          pendingNames: pendingSigners,
          tampered: false,
          pkiChain: "Root CA -> Intermediate SDMCI CA -> Verified Node",
          longTermValidation: doc.status === "fully_signed" ? "LTV ENABLED (Legally Valid)" : "LTV Pending (Incomplete signatures)"
        });
      } else {
        // Mock non-existent or tampered result
        setVerificationResult({
          valid: false,
          titleAr: "مستند مجهول / تالف",
          titleEn: "Unknown or Untrusted Cryptographic Signature",
          tampered: true,
          hash: verifyInput,
          reasonAr: "فشل التحقق من صحة التوقيع الرقمي للمستند أو تم تعديل المحتوى بعد التوقيع.",
          reasonEn: "The digital signature hash does not match national PKI registries. The document is tampered or issued by an untrusted authority."
        });
      }
    }, 1500);
  };

  // Action: Issue CA Certificate
  const handleIssueCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim()) return;

    const newCert: CANode = {
      id: `SUDAN-SUB-${newCertName.toUpperCase().replace(/\s+/g, '-')}`,
      nameAr: `سلطة تصديق ${newCertName}`,
      nameEn: `Sudan Issued Sub-CA: ${newCertName}`,
      type: newCertType,
      issuer: "SUDAN-ROOT-CA",
      validUntil: "2031-12-31",
      status: "active",
      pkiAlgorithm: newCertAlgorithm,
      serialNumber: `SN-SUDAN-00000000${Math.floor(Math.random() * 90000) + 10000}`
    };

    setPkiNodes([...pkiNodes, newCert]);
    setNewCertName("");
    setShowCertModal(false);

    // Alert
    setAlerts(prev => [`New Issuing Subordinate CA launched: ${newCert.id}`, ...prev]);
  };

  // Action: Register new identity
  const handleRegisterIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdNameAr || !newIdNameEn) return;

    const newId: DigitalIdentity = {
      uid: `SUD-ID-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 90) + 10}`,
      fullNameAr: newIdNameAr,
      fullNameEn: newIdNameEn,
      type: newIdType,
      typeAr: newIdType === "Resident" ? "مقيم" : newIdType === "Lawyer / Auditor" ? "محام وموثق" : "مواطن",
      status: "verified",
      authMethods: ["Password", "SMS OTP"],
      role: newIdRole,
      trustLevel: newIdTrust,
      securityLevel: newIdSecurity === "L3-Hardware" ? "L3-Hardware" : "L2-Software",
      lastActive: "Just now",
      auditTrail: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actionAr: "تسجيل وتفعيل الهوية الرقمية الوطنية",
          actionEn: "Registered and activated National Digital Identity",
          ipAddress: "197.251.1.1",
          node: "SUD-ID-MASTER"
        }
      ]
    };

    setIdentities([...identities, newId]);
    setNewIdNameAr("");
    setNewIdNameEn("");
    setShowIdModal(false);

    // Alert
    setAlerts(prev => [`Registered new Digital Identity: ${newId.uid}`, ...prev]);
  };

  // Action: Toggle CA Node status
  const toggleCertStatus = (id: string) => {
    setPkiNodes(prev => prev.map(node => {
      if (node.id === id) {
        const nextStatus = node.status === "active" ? "suspended" : "active";
        return { ...node, status: nextStatus };
      }
      return node;
    }));
    setAlerts(prev => [`Certificate Node state changed for ${id}`, ...prev]);
  };

  // Action: Multi-Factor authentication configuration update
  const toggleMfaPolicy = (roleKey: string, method: "sms" | "email" | "app" | "biometric" | "fido2") => {
    setMfaPolicies(prev => {
      const updatedRole = { ...prev[roleKey as keyof typeof prev] };
      updatedRole[method] = !updatedRole[method];
      return {
        ...prev,
        [roleKey]: updatedRole
      };
    });
  };

  // Action: AI Chat logic for Identity Assistant
  const handleAiPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userMsg = aiPrompt;
    setAiChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setAiPrompt("");
    setAiLoading(true);

    setTimeout(() => {
      setAiLoading(false);
      let reply = "";
      let codeBlock = undefined;

      const lower = userMsg.toLowerCase();
      if (lower.includes("foreign") || lower.includes("أجنب") || lower.includes("مستثمر")) {
        reply = currentLanguage === "ar"
          ? "يخضع المستثمرون الأجانب لسياسة 'مستوى الثقة العالي' (High Trust Level). للتسجيل:\n1. يجب التحقق من جواز السفر ومطابقته لدى وزارة الخارجية والسفارة السودانية.\n2. يتم ربطه بالبريد الإلكتروني وتطبيق المصدق الثنائي OTP.\n3. عند إصدار رخصة استيراد، يتم تفعيل التوقيع الرقمي من فئة الفرد-المستثمر بمصادقة ذات مستوى أمان L2 أو أعلى."
          : "Foreign investors are mapped under high-trust digital profiles. Setup demands passport verification cross-referenced with national civil records or ministry portals, authenticated dynamically via e-mail OTP + Authenticator app.";
      } else if (lower.includes("sign") || lower.includes("توقيع") || lower.includes("عقد")) {
        reply = currentLanguage === "ar"
          ? "للتوقيع الرقمي على عقود تأسيس الشركات بموجب قانون المعاملات الإلكترونية:\n- نقوم بإنشاء ترويسة أمنية تحمل بصمة SHA-256 للمستند.\n- نطلب مصادقة الأطراف المعنية واحداً تلو الآخر عبر رمز التشفير المحفوظ في شريحة التوقيع.\n- بمجرد اكتمال توقيعات الشركاء والمسجل، تُدمج شهادة الفاليديشن الطويل (LTV) ويُختم المستند بختم الوزارة الرقمي السيادي."
          : "To sign corporate contracts legally, the document is first digested into a unique SHA-256 hash. Stakeholders approve sequentially using their private key (FIDO2 or mobile keystore), generating an asymmetric cryptosignature with full non-repudiation seals.";
        codeBlock = `// Asymmetric Signature Validation Hook
import { generateSHA256, signPayload } from "@sudan-pki/sovereign-trust";

async function processOfficialSignature(docId, certId) {
  const hash = await generateSHA256(docId);
  const signature = await signPayload(hash, certId);
  return {
    signature,
    timestamp: new Date().toISOString(),
    pkiAnchor: "SUDAN-COMMERCE-SUB-CA"
  };
}`;
      } else if (lower.includes("pki") || lower.includes("certificate") || lower.includes("صلاحية")) {
        reply = currentLanguage === "ar"
          ? "أقوم حالياً بفحص سجل شهادات الـ PKI في جمهورية السودان. جميع العقد الوسيطة تعمل بشكل سليم. يتم جلب قوائم الإلغاء (CRL) كل ساعة عبر بروتوكول OCSP لضمان دقة التحقق في بوابات الدفع والجمارك القومية."
          : "Retrieving status of Sudanese Certificate Authorities. Root CA and all Subordinate CAs are functional. CRL files are distributed across Red Sea Port networks, while OCSP responders validate active tokens within 12ms.";
      } else if (lower.includes("anomaly") || lower.includes("شذوذ") || lower.includes("اختراق")) {
        reply = currentLanguage === "ar"
          ? "فحص الأمان الاستباقي للذكاء الاصطناعي السيادي:\n⚠️ تم رصد 3 محاولات مصادقة فاشلة من عنوان IP خارجي على حساب الموثق القانوني 'فاطمة إبراهيم' في الخرطوم بحري. تم تفعيل المصادقة الجغرافية ورفع القيود إلى مستوى L3-Hardware كإجراء وقائي."
          : "AI Security Advisory: We detected 3 failed login anomalies from external IP ranges on notary credentials. Out-of-band push authentication is now enforced for these nodes, forcing L3 security validations.";
      } else {
        reply = currentLanguage === "ar"
          ? "بصفتي مستشار الهوية الرقمية والـ PKI لوزارة التجارة والصناعة، يمكنني إرشادك لكافة السياسات الفيدرالية وقواعد التشفير والتوقيع المتطابقة مع المعايير الدولية والوطنية لجمهورية السودان."
          : "As your sovereign trust advisor, I can assist you with certificate parameters, cryptographic signatures, zero-trust rules, and administrative validation pipelines under the Sudanese e-Transactions Law.";
      }

      setAiChatHistory(prev => [...prev, { sender: "ai", text: reply, codeBlock }]);
    }, 1200);
  };

  // Preset AI queries
  const triggerAiPreset = (presetText: string) => {
    setAiPrompt(presetText);
  };

  // Specs array - details of the 14 deliverables
  const deliverables = [
    {
      id: 1,
      titleAr: "1. هيكلية الهوية الرقمية الوطنية",
      titleEn: "1. National Digital Identity Architecture",
      standard: "eIDAS & W3C DID Standards",
      text: "هيكل الهوية الوطنية لجمهورية السودان يقوم على مبدأ الهوية اللامركزية (Decentralized Identity - DID). يعتمد النظام على رقم وطني فريد (Unique Sovereign ID) مرتبط ببيانات حيوية مشفرة محفوظة لدى السجل المدني. يدعم النظام تصنيف المستخدمين إلى 10 فئات: مواطنين، مقيمين، موظفي حكومة، شركات ومؤسسات، مستثمرين، محامين، مدققين، مفتشين، مستثمرين أجانب، ومسؤولين سياديين. ترتبط الهوية بنظام التواقيع الرقمية المشفرة بمستوى ثقة يتطابق مع معايير eIDAS الأوروبية، مما يضمن الاعتماد المتبادل للمستثمرين الدوليين وحماية الأصول الاقتصادية الوطنية."
    },
    {
      id: 2,
      titleAr: "2. إطار العمل الموحد للتوقيع الإلكتروني",
      titleEn: "2. Electronic Signature Framework",
      standard: "Sudan e-Transactions Act 2026",
      text: "يتوافق إطار التواقيع الإلكترونية مع قانون المعاملات الإلكترونية السوداني. يدعم النظام أربعة مستويات من التوقيع: التوقيع الشخصي الفردي، التوقيع بالختم المؤسسي للشركات والمصانع، توقيع الموظف والمسجل الحكومي المعتمد، والتوقيع المتعدد والمنسق هرمياً لاعتماد المعاملات الوزارية. يمر المستند بمراحل التشفير Asymmetric Encryption عبر مفتاح خاص مشفر داخل شريحة HSM أو Keystore آمنة في الهاتف، ثم يتم توليد ختم زمني مشفر لمنع التراجع (Non-Repudiation)."
    },
    {
      id: 3,
      titleAr: "3. مواصفات تصميم البنية التحتية للمفاتيح العامة (PKI)",
      titleEn: "3. PKI Design Specification",
      standard: "ITU-T X.509 v3 Certificates",
      text: "تتكون البنية التحتية للمفاتيح العامة السودانية (Sovereign PKI) من هيكلية ثلاثية الطبقات: سلطة التصديق الوطنية الجذرية (Sovereign Root CA) وهي معزولة تماماً وغير متصلة بالشبكة (Air-Gapped Root CA) ومحفوظة بمبنى البنك المركزي، تليها سلطات التصديق الفرعية والقطاعية مثل (SDMCI Commerce CA) التي تصدر الشهادات الرقمية للشركات والمسجلين. تعتمد على خوارزميات التشفير المتقدمة RSA-4096 لتوقيع الشهادات الجذرية و ECDSA-384 للشهادات الفرعية."
    },
    {
      id: 4,
      titleAr: "4. بنية خدمات الثقة الرقمية السيادية",
      titleEn: "4. Trust Services Architecture",
      standard: "RFC 3161 (Trusted Timestamping)",
      text: "بنية خدمات الثقة الرقمية تشتمل على: 1. خدمة الختم الزمني الوطني المعتمد (Trusted Timestamping Server) المربوط بساعة التوقيت الدولي ببنك السودان المركزي. 2. ختم التوقيع طويل المدى (LTV - Long-Term Validation) الذي يحتفظ بحالة الشهادة وقت التوقيع حتى لو انتهت صلاحيتها لاحقاً. 3. منصة التوافق التبادلي للتحقق الفوري من صحة التواقيع والشهادات الصادرة من جهات أخرى."
    },
    {
      id: 5,
      titleAr: "5. دليل ترقية المصادقة متعددة العوامل",
      titleEn: "5. Authentication Enhancement Guide",
      standard: "FIDO2 & W3C WebAuthn Protocols",
      text: "دليل ترقية المصادقة لوزارة التجارة يضع معايير صارمة للمصادقة متعددة العوامل (MFA) بناء على حساسية الدور والمنصب. تشمل الخيارات: كلمات المرور المعقدة، والرموز المؤقتة SMS OTP (للمواطنين)، والرموز المعتمدة على تطبيق المصدق Google/Microsoft Authenticator، والبصمات الحيوية (الوجه والأصابع)، والمفاتيح الفيزيائية للأجهزة (Hardware Security Keys FIDO2) والمفروضة على المسؤولين السياديين ومدراء السجلات لحظر كافة هجمات الاختراق السيبراني والصيد الإلكتروني."
    },
    {
      id: 6,
      titleAr: "6. مواصفات دورة حياة الشهادات الرقمية",
      titleEn: "6. Digital Certificate Lifecycle Specification",
      standard: "RFC 5280 PKI Standards",
      text: "تحدد المواصفات المراحل الست لدورة حياة الشهادة الرقمية: 1. التقديم والتحقق من الهوية (Enrollment) عبر بوابة الربط القومي. 2. توليد المفاتيح والإصدار (Issuance). 3. النشر والتشغيل النشط. 4. التجديد الدوري (Renewal) لتحديث مستويات الأمان. 5. الإلغاء والتعليق الفوري (Revocation) في حال فقدان المفتاح أو الاشتباه باختراق. 6. الأرشفة المشفرة للشهادات التاريخية لضمان صحة المعاملات القديمة قانونياً."
    },
    {
      id: 7,
      titleAr: "7. دليل تصميم لوحة التحكم والتحليل",
      titleEn: "7. Identity & Trust Dashboard Design",
      standard: "Sovereign Operations Center Standards",
      text: "تصميم لوحة التحكم مخصص لمسؤولي الثقة والأمان بوزارة التجارة. يعرض إحصائيات فورية حول: الهويات الرقمية النشطة، والشهادات الصادرة والملغاة، ومعدلات نجاح المصادقة، والإنذارات الأمنية الفورية، ومحاولات الدخول الفاشلة والمشبوهة. ترتبط اللوحة بذكاء اصطناعي سيادي لتحليل أنماط الهجمات السيبرانية وتقديم التوصيات التصحيحية بشكل فوري لمنع أي انقطاع بالبنية التحتية."
    },
    {
      id: 8,
      titleAr: "8. خطة تعزيز وتحصين الأمن السيبراني",
      titleEn: "8. Security Hardening Plan",
      standard: "Zero Trust Network Architecture",
      text: "خطة التحصين القومية قائمة على معايير 'Zero Trust' (لا تثق بأحد، تحقق دائماً). تفرض الخطة تشفير قنوات التبادل والبيانات بين وزارة التجارة والضرائب والجمارك عبر شهادات mTLS ثنائية، وتشفير قواعد البيانات الحساسة بمستويات AES-256، والتدقيق الجغرافي للاتصالات، وحظر طلبات الـ API المشبوهة، مع الفحص الدوري للثغرات البرمجية والالتزام بتدوير الرموز السرية للموظفين كل 30 يوماً."
    },
    {
      id: 9,
      titleAr: "9. دليل المساعد الذكي للهوية الرقمية",
      titleEn: "9. AI Identity Assistant Guide",
      standard: "Sovereign Conversational AI",
      text: "دليل تشغيل المساعد الذكي للهوية والتحقق. المساعد مدرب على قواعد تشفير الـ PKI الوطنية والتشريعات التجارية لتبسيط الإجراءات للمستثمرين. يتمكن الذكي من تشخيص حالات تعطل الشهادات، واقتراح الإجراء التصحيحي في حال فشل التوقيع، وتدقيق ملفات المستندات للتحقق من عدم تلاعبها، وتقديم تقارير شذوذ المعاملات لمسؤولي الأمان عبر واجهة تفاعلية فورية وموثوقة."
    },
    {
      id: 10,
      titleAr: "10. استراتيجية الفحص والتحقق والاعتماد",
      titleEn: "10. Testing & Validation Strategy",
      standard: "ISO/IEC 29115 Level of Assurance",
      text: "استراتيجية الفحص تضمن تماسك النظام عبر: 1. اختبارات الحمولة القصوى (Load Testing) لعمليات التوقيع المتزامن. 2. فحص الثغرات (Penetration Testing) لوحدات حفظ المفاتيح. 3. التحقق من تطابق قوائم الإلغاء CRL تحت كافة سيناريوهات فشل الشبكة. 4. محاكاة توقيعات باطلة ومتلاعب بها للتأكد من التقاطها الفوري من بوابات التفتيش والتحقق."
    },
    {
      id: 11,
      titleAr: "11. تقييم التطابق والامتثال القانوني الدولي",
      titleEn: "11. Compliance Assessment",
      standard: "ISO 27001 & UNCITRAL Model Law",
      text: "تقييم امتثال المنصة يؤكد مواءمتها لقوانين الأونسيترال الدولية للمعاملات والتجارة الإلكترونية، ومعايير أمن المعلومات العالمية ISO 27001. المعاملات والتواقيع الصادرة من وزارة التجارة السودانية عبر منصة NGIP تحمل صفة الحجية القانونية المطلقة أمام المحاكم والهيئات القضائية الوطنية والدولية، مما يعزز مناخ الاستثمار ويسهل تصدير المحاصيل والمنتجات السودانية عالمياً."
    },
    {
      id: 12,
      titleAr: "12. خطة التعافي من الكوارث واستمرارية الخدمة",
      titleEn: "12. Disaster Recovery Plan",
      standard: "ISO 22301 Business Continuity",
      text: "خطة التعافي وضعت لضمان عمل منصة الهوية والثقة بنسبة 99.99% حتى في أحوال انقطاع الشبكات أو الكوارث. تشمل الخطة: تكرار خوادم الـ PKI وقواعد البيانات جغرافياً بين مركز بيانات الخرطوم ومركز بيانات بورتسودان الاحتياطي الفيدرالي، ومزامنة سجلات التواقيع المشفرة فورياً، مع توفر نسخة جيب جغرافية معزولة من قوائم الإلغاء CRL للعمل محلياً بالمنافذ الجمركية كبورتسودان عند انقطاع الكابل البحري الدولي."
    },
    {
      id: 13,
      titleAr: "13. دليل تشغيل خدمات الثقة الرقمية الوطنية",
      titleEn: "13. National Trust Services Operations Manual",
      standard: "Sovereign Trust Practice Statements",
      text: "دليل التشغيل الوطني لخدمات الثقة يحدد مهام وصلاحيات مسؤولي الثقة وموظفي الدعم الفني بالوزارة. يتضمن بروتوكولات ترخيص جهات التصديق الفرعية، وآلية استقبال بلاغات فقدان المفاتيح الخاصة، وإجراءات حرق وإلغاء الشهادات الأمنية فوراً، بجانب ضوابط الصيانة الدورية لوحدات الـ HSM وبرامج تشفير التواقيع لضمان الجاهزية العالية والنزاهة المطلقة للبيانات الحكومية."
    },
    {
      id: 14,
      titleAr: "14. التقرير الرئيسي الشامل لتنفيذ الهوية الرقمية الوطنية وخدمات الثقة",
      titleEn: "14. National Digital Identity & Trust Services Master Implementation Report",
      standard: "Official Sovereign Blue Book 2026",
      text: "يمثل هذا التقرير الرئيسي وثيقة الاعتماد الرسمية الموجهة للوزير وديوان مجلس الوزراء السوداني لتشغيل البنية الفيدرالية لتبادل الهوية والثقة. يعلن التقرير عن اكتمال دمج منصة الهوية الرقمية المشفرة مع السجل التجاري، ونظام الأسماء، وطلبات التراخيص، والمنصة الصناعية والاستثمارية. يدمج التقرير خدمات الـ PKI الوطنية لتشغيل بوابات التحقق والتحصيل المالي في ثوانٍ معدودة وبنزاهة قصوى ومكافحة شاملة لغسيل الأموال وتهريب الذهب والمحاصيل، تطبيقاً للسيادة الرقمية وبناء لبوابة الغد المشرق للاقتصاد الوطني لجمهورية السودان."
    }
  ];

  const activeSpec = deliverables.find(d => d.id === activeSpecId) || deliverables[13];

  // Helper filters
  const filteredIdList = identities.filter(ident => 
    ident.fullNameAr.includes(searchQuery) || 
    ident.fullNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ident.uid.includes(searchQuery) ||
    ident.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocList = documents.filter(doc => 
    doc.titleAr.includes(docSearchQuery) || 
    doc.titleEn.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
    doc.id.includes(docSearchQuery)
  );

  return (
    <div className="space-y-6" id="trust-platform-wrapper">
      {/* Dynamic Sovereign Badge & Alert bar */}
      <div className="bg-slate-900 border-l-4 border-amber-500 p-3 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs font-mono text-gray-300">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          <span><strong className="text-amber-400">SUDAN TRUST SHIELD FEED:</strong> {alerts[0]}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-emerald-400" /> Root CA Active</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> zero Trust Enforced</span>
        </div>
      </div>

      {/* Main Header Presentation */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 rounded-2xl shadow-xl border border-emerald-800/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-amber-500 text-slate-950 text-xs px-2.5 py-1 rounded-full font-bold tracking-wider font-mono">
                SOVEREIGN TRUST & CA GATEWAY
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30 flex items-center gap-1">
                <Fingerprint className="w-3 h-3 animate-pulse" />
                {currentLanguage === "ar" ? "قانون المعاملات الإلكترونية 2026" : "E-Transactions Law Compliant"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-arabic)" }}>
              {currentLanguage === "ar" 
                ? "منصة الهوية الرقمية القومية وخدمات الثقة" 
                : "National Digital Identity & Trust Services Platform"}
            </h1>
            <p className="text-gray-300 text-sm max-w-3xl mt-1">
              {currentLanguage === "ar"
                ? "الهيكل الفيدرالي لإصدار التواقيع الرقمية المشفرة والمصادقة متعددة العوامل وإدارة المفاتيح العامة (PKI) وتوثيق مستندات السجل والترخيص لجمهورية السودان."
                : "Sovereign cryptographic trust foundation, hosting cross-agency PKI certificate management, multi-signature approval pipelines, and document integrity validation."}
            </p>
          </div>

          <div className="flex flex-col xs:flex-row items-center gap-4 w-full lg:w-auto self-stretch lg:self-auto">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5 flex-1 lg:flex-initial">
              <Users className="w-10 h-10 text-amber-500" />
              <div className="font-mono text-left">
                <div className="text-[10px] text-gray-400 uppercase">{currentLanguage === "ar" ? "الهويات النشطة" : "Active Identities"}</div>
                <div className="text-lg font-bold text-white">{activeCount.toLocaleString()}</div>
              </div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5 flex-1 lg:flex-initial">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              <div className="font-mono text-left">
                <div className="text-[10px] text-gray-400 uppercase">{currentLanguage === "ar" ? "نسبة نجاح التوقيع" : "Signing Success"}</div>
                <div className="text-lg font-bold text-emerald-400">{successRate.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Sub-Menu */}
        <div className="flex flex-wrap gap-1.5 mt-6 border-t border-slate-800 pt-4 relative z-10" id="trust-nav-tabs">
          {[
            { id: "dashboard", labelAr: "لوحة المراقبة السيادية", labelEn: "Sovereign Monitor", icon: BarChart3 },
            { id: "identities", labelAr: "سجل الهويات والمصادقة", labelEn: "Identity Registry", icon: Users },
            { id: "pki", labelAr: "مفاتيح وبنية الـ PKI", labelEn: "PKI Console", icon: KeyRound },
            { id: "signatures", labelAr: "التواقيع وتأسيس المستندات", labelEn: "Multi-Signature Engine", icon: FileSignature },
            { id: "verification", labelAr: "بوابة فحص المستندات", labelEn: "Verification Portal", icon: FileCheck },
            { id: "mfa", labelAr: "سياسات المصادقة MFA", labelEn: "MFA Policies", icon: Sliders },
            { id: "ai", labelAr: "مساعد الهوية الذكي", labelEn: "AI Co-Pilot", icon: Sparkles },
            { id: "specs", labelAr: "مجلد وثائق الاعتماد", labelEn: "Implementation Deliverables", icon: FileCode }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md" 
                    : "bg-slate-900/50 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-slate-800"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs Layout Rendering Pipeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 150 }}
        >
          {/* TAB 1: SOVEREIGN MONITOR (DASHBOARD) */}
          {activeTab === "dashboard" && (
            <div className="space-y-6" id="trust-dashboard-tab">
              {/* Stat Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block font-semibold uppercase">{currentLanguage === "ar" ? "شهادات المصادقة النشطة" : "Active Certificates"}</span>
                    <span className="text-2xl font-bold font-mono text-slate-950">29,182</span>
                    <span className="text-xs text-emerald-500 block mt-1">100% Secure Key Storage</span>
                  </div>
                  <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600"><LockKeyhole className="w-6 h-6" /></div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block font-semibold uppercase">{currentLanguage === "ar" ? "إجمالي التواقيع الرقمية" : "Signed Transactions"}</span>
                    <span className="text-2xl font-bold font-mono text-slate-950">1,482,094</span>
                    <span className="text-xs text-emerald-500 block mt-1">Legally Valid (Non-Repudiable)</span>
                  </div>
                  <div className="bg-sky-50 p-2.5 rounded-lg text-sky-600"><FileCheck className="w-6 h-6" /></div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block font-semibold uppercase">{currentLanguage === "ar" ? "محاولات دخول مشبوهة" : "Blocked Anomalies"}</span>
                    <span className="text-2xl font-bold font-mono text-red-600">3</span>
                    <span className="text-xs text-red-500 block mt-1">IP Blocked & Rolled Back</span>
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-red-600"><ShieldAlert className="w-6 h-6" /></div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block font-semibold uppercase">{currentLanguage === "ar" ? "شهادات ملغاة (CRL)" : "Revoked Certificates"}</span>
                    <span className="text-2xl font-bold font-mono text-slate-700">14</span>
                    <span className="text-xs text-gray-500 block mt-1">Blacklisted & Suspended Nodes</span>
                  </div>
                  <div className="bg-slate-100 p-2.5 rounded-lg text-slate-700"><Trash2 className="w-6 h-6" /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Security Alerts and HSM Feeds */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
                      <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                      {currentLanguage === "ar" ? "مراقبة الأمان والتبادل الثنائي (mTLS & HSM Feed)" : "Security & HSM Cryptographic Live Feeds"}
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Live Nodes</span>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    {[
                      { time: "06:27:14", type: "SUCCESS", msg: "mTLS session validated: Central Bank Core. Certificate serial SN-CBOS-029", node: "GATEWAY-0" },
                      { time: "06:25:02", type: "INFO", msg: "OCSP request processed for Certificate SUD-ID-3021-93. Response: GOOD", node: "OCSP-RESP-2" },
                      { time: "06:20:11", type: "SUCCESS", msg: "HSM cluster synced: Generated signature block for doc-CR-001. Signature size 512b", node: "HSM-CORE-1" },
                      { time: "06:14:52", type: "WARNING", msg: "Failed authentication attempt (Password error) for user SUD-ID-1029-77 from IP 197.251.12.3", node: "SUD-ID-MASTER" },
                      { time: "05:00:00", type: "INFO", msg: "Daily Certificate Revocation List (CRL) successfully exported to all federal customs gates", node: "ROOT-CRL-GEN" }
                    ].map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-all border border-gray-100 flex flex-col sm:flex-row justify-between gap-1.5 text-gray-700">
                        <div className="flex items-start sm:items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-semibold">{item.time}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            item.type === "SUCCESS" ? "bg-emerald-100 text-emerald-800" :
                            item.type === "WARNING" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
                          }`}>{item.type}</span>
                          <span className="text-slate-800 break-all">{item.msg}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 self-end sm:self-center font-bold">{item.node}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Security Hardening Overview */}
                <div className="bg-slate-950 text-white p-5 rounded-xl border border-slate-900 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "تحصين الأمان الاستباقي" : "Zero Trust Hardening"}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {currentLanguage === "ar"
                      ? "تعتمد منصتنا الفيدرالية على بنية صفر ثقة. يتم تجديد جلسات الموثقين دورياً، كما تخضع كافة الاتصالات الفيدرالية لتشفير طبقة النقل ثنائي الاتجاه (mTLS) مع التحقق الفوري من شهادة العميل والختم الرقمي."
                      : "Our digital framework implements dynamic zero trust policies. Authentication workflows are governed by client roles, verifying geographic origin and device trust levels."}
                  </p>

                  <div className="space-y-3 font-mono text-xs pt-2">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <span className="text-gray-400">AES-256 Storage Encryption</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <span className="text-gray-400">Double-Sided mTLS</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <span className="text-gray-400">CRL & OCSP Synchronization</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> 12ms Response</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Long-Term Validation (LTV)</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> ENFORCED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTITY REGISTRY */}
          {activeTab === "identities" && (
            <div className="space-y-6" id="trust-identities-tab">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={currentLanguage === "ar" ? "ابحث عن هوية رقمية عبر الاسم أو الرقم الوطني..." : "Search digital directory by name, role, or unique ID..."}
                    className="w-full pl-9 pr-4 py-2 bg-white text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                  />
                </div>
                
                <button
                  onClick={() => setShowIdModal(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5 self-stretch md:self-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>{currentLanguage === "ar" ? "تسجيل هوية رقمية معتمدة" : "Create Verified Identity"}</span>
                </button>
              </div>

              {/* Identity Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdList.map(ident => (
                  <div key={ident.uid} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all space-y-4 relative overflow-hidden">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-gray-400 font-mono text-[10px] block">{ident.uid}</span>
                        <h4 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-arabic)" }}>
                          {currentLanguage === "ar" ? ident.fullNameAr : ident.fullNameEn}
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ident.status === "verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {ident.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-gray-50 p-3 rounded-lg text-gray-600">
                      <div>
                        <span className="text-gray-400 text-[10px] block uppercase">{currentLanguage === "ar" ? "الفئة" : "Type"}</span>
                        <span className="font-semibold text-slate-800">{currentLanguage === "ar" ? ident.typeAr : ident.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block uppercase">{currentLanguage === "ar" ? "مستوى الأمان" : "Sec Level"}</span>
                        <span className="font-semibold text-amber-600">{ident.securityLevel}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-gray-200 mt-1">
                        <span className="text-gray-400 text-[10px] block uppercase">{currentLanguage === "ar" ? "الدور والمنصب" : "Sovereign Role"}</span>
                        <span className="font-semibold text-emerald-700">{ident.role}</span>
                      </div>
                    </div>

                    {/* Authenticator policies used */}
                    <div>
                      <span className="text-gray-400 font-mono text-[9px] uppercase tracking-wider block mb-1.5">{currentLanguage === "ar" ? "وسائل التحقق المفعلة" : "Active Authentication Factors"}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {ident.authMethods.map((method, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Miniature Audit Trail */}
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-gray-400 font-mono text-[9px] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <History className="w-3 h-3 text-emerald-600" />
                        {currentLanguage === "ar" ? "آخر الأنشطة التوثيقية" : "Asymmetric Audit Trail (Recent)"}
                      </span>
                      <div className="space-y-1.5 text-[10px] font-mono text-gray-500 max-h-24 overflow-y-auto">
                        {ident.auditTrail.map((trail, idx) => (
                          <div key={idx} className="flex justify-between border-b border-gray-50 pb-1">
                            <span>{currentLanguage === "ar" ? trail.actionAr : trail.actionEn}</span>
                            <span className="text-[9px] text-gray-400">{trail.timestamp.split(" ")[1] || trail.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Identity Modal Mockup */}
              {showIdModal && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-md w-full p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <h4 className="font-bold text-gray-900 text-base flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
                        <Fingerprint className="w-5 h-5 text-emerald-700" />
                        {currentLanguage === "ar" ? "تسجيل هوية رقمية قومية جديدة" : "Enroll New Digital Identity"}
                      </h4>
                      <button onClick={() => setShowIdModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
                    </div>

                    <form onSubmit={handleRegisterIdentity} className="space-y-3.5 text-xs text-gray-700">
                      <div className="space-y-1">
                        <label className="block font-semibold">{currentLanguage === "ar" ? "الاسم الكامل (عربي)" : "Full Name (Arabic)"}</label>
                        <input required type="text" value={newIdNameAr} onChange={(e) => setNewIdNameAr(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans" />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-semibold">{currentLanguage === "ar" ? "الاسم الكامل (إنجليزي)" : "Full Name (English)"}</label>
                        <input required type="text" value={newIdNameEn} onChange={(e) => setNewIdNameEn(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-semibold">{currentLanguage === "ar" ? "الفئة" : "Type"}</label>
                          <select value={newIdType} onChange={(e) => setNewIdType(e.target.value)} className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                            <option value="Citizen">Citizen / مواطن</option>
                            <option value="Resident">Resident / مقيم</option>
                            <option value="Lawyer / Auditor">Lawyer / محام</option>
                            <option value="Foreign Investor">Investor / مستثمر</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-semibold">{currentLanguage === "ar" ? "الدور والمنصب" : "Role Description"}</label>
                          <input required type="text" value={newIdRole} onChange={(e) => setNewIdRole(e.target.value)} placeholder="e.g. Chief Audit Executive" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-semibold">{currentLanguage === "ar" ? "مستوى الثقة" : "Trust Level"}</label>
                          <select value={newIdTrust} onChange={(e) => setNewIdTrust(e.target.value as any)} className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                            <option value="Standard">Standard</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-semibold">{currentLanguage === "ar" ? "حماية الأمان" : "Security Level"}</label>
                          <select value={newIdSecurity} onChange={(e) => setNewIdSecurity(e.target.value as any)} className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                            <option value="L2-Software">L2 Software OTP</option>
                            <option value="L3-Hardware">L3 FIDO2 Key</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t border-gray-100 pt-3 mt-4">
                        <button type="button" onClick={() => setShowIdModal(false)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold cursor-pointer">
                          {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                        <button type="submit" className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold cursor-pointer flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>{currentLanguage === "ar" ? "تسجيل وتفعيل" : "Register & Activate"}</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PKI DESIGN & CERTIFICATE CONSOLE */}
          {activeTab === "pki" && (
            <div className="space-y-6" id="trust-pki-tab">
              {/* Architecture Map Visualization */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
                      <KeyRound className="w-5 h-5 text-emerald-600" />
                      {currentLanguage === "ar" ? "خارطة التصديق الجذري وهرمية المفاتيح السيادية" : "Sudanese National PKI Hierarchical Chain"}
                    </h3>
                    <span className="text-xs text-gray-500 mt-1 block">X.509 v3 Federated Certificate Chain for Government Decryption and signing</span>
                  </div>
                  
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{currentLanguage === "ar" ? "إنشاء عقدة تصديق فرعية" : "Deploy Subordinate CA"}</span>
                  </button>
                </div>

                {/* Simulated visual hierarchy tree */}
                <div className="p-4 bg-slate-950 text-emerald-300 font-mono text-xs rounded-xl space-y-4 border border-slate-900">
                  <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-amber-500" />
                      <div>
                        <span className="text-amber-400 font-bold block text-[10px] uppercase">🇸🇩 ROOT AUTHORITY Node</span>
                        <span className="text-white text-xs font-semibold">{pkiNodes[0].nameEn}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span>{pkiNodes[0].pkiAlgorithm}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-400 text-[9px] font-bold">SECURE AIR-GAPPED</span>
                    </div>
                  </div>

                  <div className="pl-6 border-l-2 border-emerald-900/60 space-y-3 pt-1">
                    {pkiNodes.slice(1).map(node => (
                      <div key={node.id} className="p-3 bg-slate-900 hover:bg-slate-900/80 transition-all rounded-lg border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 animate-pulse" />
                          <div>
                            <span className="text-amber-500 font-semibold block text-[10px] uppercase">{node.type} CA</span>
                            <span className="text-white font-medium text-xs">{currentLanguage === "ar" ? node.nameAr : node.nameEn}</span>
                            <span className="text-gray-500 text-[10px] block mt-0.5">SN: {node.serialNumber} | Expires: {node.validUntil}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 self-end sm:self-center">
                          <span className="text-[10px] text-gray-400">{node.pkiAlgorithm}</span>
                          <button
                            onClick={() => toggleCertStatus(node.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer uppercase ${
                              node.status === "active" ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-red-950 text-red-400 border border-red-900"
                            }`}
                          >
                            {node.status}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deploy Cert Modal */}
              {showCertModal && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-sm w-full p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <h4 className="font-bold text-gray-900 text-base flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
                        <Key className="w-5 h-5 text-emerald-700" />
                        {currentLanguage === "ar" ? "ترخيص سلطة فرعية جديدة (Subordinate CA)" : "Deploy New Subordinate CA"}
                      </h4>
                      <button onClick={() => setShowCertModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
                    </div>

                    <form onSubmit={handleIssueCert} className="space-y-3.5 text-xs text-gray-700">
                      <div className="space-y-1">
                        <label className="block font-semibold">{currentLanguage === "ar" ? "اسم القطاع أو الخدمة" : "Sub-CA Scope Name"}</label>
                        <input required type="text" value={newCertName} onChange={(e) => setNewCertName(e.target.value)} placeholder="e.g. Port Sudan Customs Gate" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-semibold">{currentLanguage === "ar" ? "نوع الترخيص" : "CA Type"}</label>
                        <select value={newCertType} onChange={(e) => setNewCertType(e.target.value as any)} className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                          <option value="Intermediate">Intermediate CA</option>
                          <option value="Subordinate">Subordinate Signing Node</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block font-semibold">{currentLanguage === "ar" ? "خوارزمية التوقيع والـ KeySize" : "Cryptographic Suite"}</label>
                        <select value={newCertAlgorithm} onChange={(e) => setNewCertAlgorithm(e.target.value)} className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                          <option value="ECC-256 / SHA-256">ECDSA-256 / SHA-256 (High Perf)</option>
                          <option value="ECC-384 / SHA-384">ECDSA-384 / SHA-384 (Sovereign Recommended)</option>
                          <option value="RSA-2048 / SHA-256">RSA-2048 / SHA-256 (Legacy Compatible)</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-2 border-t border-gray-100 pt-3 mt-4">
                        <button type="button" onClick={() => setShowCertModal(false)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold cursor-pointer">
                          {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                        <button type="submit" className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold cursor-pointer flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>{currentLanguage === "ar" ? "تصدير المفتاح وتفعيله" : "Sign & Deploy Node"}</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ELECTRONIC MULTI-SIGNATURE WORKFLOW SIMULATOR */}
          {activeTab === "signatures" && (
            <div className="space-y-6" id="trust-signatures-tab">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Documents list */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                  <div className="border-b border-gray-100 pb-2">
                    <h4 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "معاملات قيد الاعتماد والتوقيع" : "Pending Signature Pipeline"}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono block">Sequential and co-signing approvals</span>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {documents.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer block ${
                          selectedDoc.id === doc.id 
                            ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                            : "bg-gray-50 border-gray-100 hover:bg-gray-100/60"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <span className="text-[10px] text-gray-400 font-mono">{doc.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            doc.status === "fully_signed" ? "bg-emerald-100 text-emerald-800" :
                            doc.status === "partially_signed" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
                          }`}>{doc.status.toUpperCase().replace('_', ' ')}</span>
                        </div>
                        <h5 className="font-bold text-xs text-slate-900 line-clamp-2" style={{ fontFamily: "var(--font-arabic)" }}>
                          {currentLanguage === "ar" ? doc.titleAr : doc.titleEn}
                        </h5>
                        <div className="mt-2 text-[10px] text-gray-500 font-mono flex justify-between">
                          <span>By: {doc.initiatorEn}</span>
                          <span>{doc.signedBy.length} / {doc.signersRequired.length} Signatures</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Signing Canvas & controls */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-2 space-y-5">
                  <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-amber-600 font-mono font-bold tracking-wider uppercase block">{selectedDoc.id}</span>
                      <h4 className="font-bold text-gray-950 text-sm" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? selectedDoc.titleAr : selectedDoc.titleEn}
                      </h4>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">Date: {selectedDoc.createdDate}</span>
                  </div>

                  {/* Multi-signer progress circles */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase tracking-wider">{currentLanguage === "ar" ? "قائمة التواقيع المتعددة المطلوبة" : "Sequential Multi-Signing Progress"}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedDoc.signersRequired.map((uid, idx) => {
                        const idObj = identities.find(i => i.uid === uid);
                        const isSigned = selectedDoc.signedBy.includes(uid);
                        return (
                          <div key={uid} className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                            isSigned ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-gray-200 text-gray-600"
                          }`}>
                            <div className={`p-1 rounded-full ${isSigned ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                              {isSigned ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            <div className="font-mono text-[10px] leading-tight">
                              <span className="font-bold block truncate">{idObj ? (currentLanguage === "ar" ? idObj.fullNameAr : idObj.fullNameEn) : uid}</span>
                              <span className="text-[9px] text-gray-400 truncate block">{idObj ? idObj.role : "Sovereign Signer"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hash and Seal meta if signed */}
                  {selectedDoc.secureHash && (
                    <div className="p-3.5 bg-slate-950 text-emerald-400 font-mono text-[10px] rounded-lg border border-slate-900 space-y-1.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 text-slate-800 pointer-events-none"><QrCode className="w-16 h-16 opacity-30" /></div>
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase font-bold">SOVEREIGN SEAL HASH (SHA-256)</span>
                        <span className="text-white break-all">{selectedDoc.secureHash}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1.5 border-t border-slate-900">
                        <span>TIMESTAMP SEAL: <strong className="text-white">{selectedDoc.timestampSeal}</strong></span>
                        <span className="text-amber-400 font-semibold">LTV VALID</span>
                      </div>
                    </div>
                  )}

                  {/* Sign Action form */}
                  <div className="border-t border-gray-100 pt-4 space-y-4">
                    <h5 className="font-bold text-xs text-slate-800" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "محاكي التوقيع الرقمي السيادي" : "Secure Asymmetric Signature Hub"}
                    </h5>
                    
                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                      <div className="space-y-1 flex-1 w-full text-xs">
                        <label className="block text-gray-500 font-semibold">{currentLanguage === "ar" ? "حدد الهوية الرقمية الموقعة" : "1. Select Authenticated Identity Profile"}</label>
                        <select
                          value={signingIdentity}
                          onChange={(e) => setSigningIdentity(e.target.value)}
                          className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                        >
                          {selectedDoc.signersRequired.map(uid => {
                            const idObj = identities.find(i => i.uid === uid);
                            const hasSigned = selectedDoc.signedBy.includes(uid);
                            return (
                              <option key={uid} value={uid} disabled={hasSigned}>
                                {idObj ? (currentLanguage === "ar" ? idObj.fullNameAr : idObj.fullNameEn) : uid} ({idObj ? idObj.role : "Signer"}) {hasSigned ? "✓ (SIGNED)" : ""}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <button
                        onClick={triggerDocumentSignature}
                        disabled={isSigning || selectedDoc.status === "fully_signed" || selectedDoc.signedBy.includes(signingIdentity)}
                        className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 self-stretch sm:self-auto justify-center h-9"
                      >
                        {isSigning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSignature className="w-4 h-4" />}
                        <span>{currentLanguage === "ar" ? "وقع المستند مشفراً" : "Apply Cryptosignature"}</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {signSuccess && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-bold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>{currentLanguage === "ar" ? "تم توقيع المستند بنجاح وتوليد المعرف التشفيري وختم الوقت الوطني!" : "Cryptosignature applied! Long-Term Validation certificate (LTV) appended successfully to HSM audit logs."}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PUBLIC DOCUMENT VERIFICATION PORTAL */}
          {activeTab === "verification" && (
            <div className="space-y-6" id="trust-verification-tab">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                <div className="text-center max-w-xl mx-auto space-y-2 pb-2">
                  <QrCode className="w-12 h-12 text-emerald-700 mx-auto" />
                  <h3 className="font-bold text-gray-950 text-lg" style={{ fontFamily: "var(--font-arabic)" }}>
                    {currentLanguage === "ar" ? "البوابة الوطنية الموحدة للتحقق من صحة المستندات" : "National Public Cryptographic Verification Portal"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {currentLanguage === "ar"
                      ? "أدخل الرقم المرجعي للمستند أو الرمز التشفيري SHA-256 للتحقق الفوري من سلامته وشهادات التوقيع الرقمية الصادرة عن الوزارة."
                      : "Validate legal certificates, trade licenses, or ministerial decisions issued across the Republic of Sudan by entering their unique reference code."}
                  </p>
                </div>

                <div className="max-w-xl mx-auto flex gap-2">
                  <input
                    type="text"
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="Enter Certificate ID or SHA-256 Hash..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 text-sm font-mono rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <button
                    onClick={handleVerifyDocument}
                    disabled={verifyingProgress}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-200 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {verifyingProgress ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>{currentLanguage === "ar" ? "تحقق" : "Verify Document"}</span>
                  </button>
                </div>

                {/* Verification result visual feedback */}
                <AnimatePresence mode="wait">
                  {verificationResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="max-w-2xl mx-auto border rounded-xl overflow-hidden shadow-md"
                    >
                      {verificationResult.valid ? (
                        <div>
                          {/* Success Box Header */}
                          <div className="bg-emerald-900 text-white p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            <div>
                              <span className="text-[10px] text-emerald-300 font-mono font-bold tracking-wider uppercase">VERIFICATION PASSED</span>
                              <h4 className="font-bold text-sm" style={{ fontFamily: "var(--font-arabic)" }}>
                                {currentLanguage === "ar" ? verificationResult.titleAr : verificationResult.titleEn}
                              </h4>
                            </div>
                          </div>

                          <div className="p-5 bg-white space-y-4 text-xs font-mono text-gray-700">
                            <div className="grid grid-cols-2 gap-3.5 border-b border-gray-100 pb-3">
                              <div>
                                <span className="text-gray-400 text-[10px] block uppercase">Document ID</span>
                                <span className="font-bold text-slate-950">{verifyInput}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] block uppercase">LTV Status</span>
                                <span className="font-bold text-emerald-700">{verificationResult.longTermValidation}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] block uppercase">Issuance Date</span>
                                <span className="font-bold text-slate-800">{verificationResult.createdDate}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] block uppercase">Security Integrity</span>
                                <span className="font-bold text-emerald-700">✓ PASS (No Modifications)</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-gray-400 text-[10px] block uppercase">Cryptographic Signatures Verified</span>
                              <div className="space-y-1">
                                {verificationResult.signerNames.map((name: string, i: number) => (
                                  <div key={i} className="bg-gray-50 px-2.5 py-1.5 rounded text-emerald-950 font-bold flex justify-between items-center border border-gray-100">
                                    <span>{name}</span>
                                    <span className="text-[9px] text-emerald-700">Asymmetric signature OK</span>
                                  </div>
                                ))}

                                {verificationResult.pendingNames.length > 0 && (
                                  <div className="mt-2.5">
                                    <span className="text-gray-400 text-[10px] block uppercase mb-1">Awaiting Signatures</span>
                                    {verificationResult.pendingNames.map((name: string, i: number) => (
                                      <div key={i} className="bg-amber-50/50 px-2.5 py-1 rounded text-amber-800 flex justify-between items-center border border-amber-100 text-[10px]">
                                        <span>{name}</span>
                                        <span>Pending...</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-slate-950 text-emerald-400 p-3 rounded-lg text-[10px] space-y-1">
                              <div>SHA-256 HASH: <span className="text-white">{verificationResult.hash}</span></div>
                              <div>TIMELOCK SEAL: <span className="text-white">{verificationResult.timestampSeal}</span></div>
                              <div>PKI CHAIN: <span className="text-white">{verificationResult.pkiChain}</span></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* Failure Box Header */}
                          <div className="bg-red-950 text-white p-4 flex items-center gap-3 border-b border-red-900">
                            <XCircle className="w-6 h-6 text-red-500" />
                            <div>
                              <span className="text-[10px] text-red-400 font-mono font-bold tracking-wider uppercase">TRUST VERIFICATION FAILED</span>
                              <h4 className="font-bold text-sm" style={{ fontFamily: "var(--font-arabic)" }}>
                                {currentLanguage === "ar" ? verificationResult.titleAr : verificationResult.titleEn}
                              </h4>
                            </div>
                          </div>

                          <div className="p-5 bg-white space-y-4 text-xs font-mono text-gray-700">
                            <div className="p-3 bg-red-50 text-red-950 rounded-lg border border-red-200">
                              <h5 className="font-bold text-red-900 mb-1">Warning: Unknown Cryptographic Hash</h5>
                              <p>{currentLanguage === "ar" ? verificationResult.reasonAr : verificationResult.reasonEn}</p>
                            </div>

                            <div className="bg-slate-950 text-red-400 p-3 rounded-lg text-[10px]">
                              <div>QUERY HASH: <span className="text-white break-all">{verificationResult.hash}</span></div>
                              <div>STATUS: <span className="text-red-500 font-bold">UNREGISTERED / MODIFIED</span></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* TAB 6: MFA POLICIES BY ROLE CONFIGURATOR */}
          {activeTab === "mfa" && (
            <div className="space-y-6" id="trust-mfa-tab">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
                    <Sliders className="w-5 h-5 text-emerald-600" />
                    {currentLanguage === "ar" ? "إعدادات سياسات المصادقة متعددة العوامل حسب الصلاحيات" : "Role-Based Multi-Factor Authentication Policies"}
                  </h3>
                  <span className="text-xs text-gray-500 mt-1 block">Enforce authentication requirements on federal nodes depending on user security clears.</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase text-[10px]">
                        <th className="p-3">{currentLanguage === "ar" ? "الدور والمنصب" : "Sovereign Role"}</th>
                        <th className="p-3">SMS OTP</th>
                        <th className="p-3">Email OTP</th>
                        <th className="p-3">Authenticator App</th>
                        <th className="p-3">Biometric MFA</th>
                        <th className="p-3">FIDO2 Security Key</th>
                        <th className="p-3">{currentLanguage === "ar" ? "أدنى مستوى ثقة" : "Min Trust Clear"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-slate-700">
                      {[
                        { key: "gov_minister", labelAr: "ديوان الوزير", labelEn: "Sovereign Minister" },
                        { key: "gov_executive", labelAr: "المتابعة التنفيذية", labelEn: "Executive Admin" },
                        { key: "gov_employee", labelAr: "الموظف الرقمي", labelEn: "Ministry Staff" },
                        { key: "business_investor", labelAr: "المستثمر والمواطن", labelEn: "Investor & Citizen" }
                      ].map(roleObj => {
                        const policy = mfaPolicies[roleObj.key as keyof typeof mfaPolicies];
                        return (
                          <tr key={roleObj.key} className="hover:bg-gray-50/50 transition-all">
                            <td className="p-3 font-semibold text-slate-900 font-sans">{currentLanguage === "ar" ? roleObj.labelAr : roleObj.labelEn}</td>
                            
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={policy.sms}
                                onChange={() => toggleMfaPolicy(roleObj.key, "sms")}
                                className="w-4 h-4 text-emerald-600 accent-emerald-600 cursor-pointer"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={policy.email}
                                onChange={() => toggleMfaPolicy(roleObj.key, "email")}
                                className="w-4 h-4 text-emerald-600 accent-emerald-600 cursor-pointer"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={policy.app}
                                onChange={() => toggleMfaPolicy(roleObj.key, "app")}
                                className="w-4 h-4 text-emerald-600 accent-emerald-600 cursor-pointer"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={policy.biometric}
                                onChange={() => toggleMfaPolicy(roleObj.key, "biometric")}
                                className="w-4 h-4 text-emerald-600 accent-emerald-600 cursor-pointer"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={policy.fido2}
                                onChange={() => toggleMfaPolicy(roleObj.key, "fido2")}
                                className="w-4 h-4 text-emerald-600 accent-emerald-600 cursor-pointer"
                              />
                            </td>

                            <td className="p-3 font-bold text-emerald-700 uppercase">{policy.minTrust}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SOVEREIGN AI IDENTITY ASSISTANT */}
          {activeTab === "ai" && (
            <div className="space-y-6" id="trust-ai-tab">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI chat interface */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col h-[500px]">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-100 bg-emerald-950 text-white rounded-t-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <div>
                        <h4 className="font-bold text-xs" style={{ fontFamily: "var(--font-arabic)" }}>
                          {currentLanguage === "ar" ? "مساعد الهوية الرقمية والتواقيع الذكي" : "AI Trust & PKI Advisor"}
                        </h4>
                        <span className="text-[9px] text-emerald-300 font-mono">Expert security bot for digital transformation</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages container */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                    {aiChatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2.5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                      >
                        <div className={`p-1 rounded-full flex-shrink-0 h-7 w-7 flex items-center justify-center ${
                          msg.sender === "user" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {msg.sender === "user" ? <Users className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        </div>

                        <div className="space-y-2">
                          <div className={`p-3 rounded-2xl leading-relaxed ${
                            msg.sender === "user" ? "bg-amber-50 text-slate-900 rounded-tr-none" : "bg-gray-100 text-slate-800 rounded-tl-none"
                          }`}>
                            <p className="whitespace-pre-line">{msg.text}</p>
                          </div>

                          {msg.codeBlock && (
                            <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-[10px] rounded-lg overflow-x-auto border border-slate-900 max-w-full">
                              <code>{msg.codeBlock}</code>
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}

                    {aiLoading && (
                      <div className="flex gap-2.5 max-w-[80%] mr-auto items-center text-gray-400">
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                        <span className="font-mono">AI compiling cryptographic audit guidelines...</span>
                      </div>
                    )}
                  </div>

                  {/* Chat input form */}
                  <form onSubmit={handleAiPromptSubmit} className="p-3.5 border-t border-gray-100 flex gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "اسأل حول متطلبات التوقيع، المصادقة، أو تشخيص الشهادات..." : "Ask about PKI cert revocation, zero-trust policies, audit trail laws..."}
                      className="flex-1 px-3 py-2 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button type="submit" className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl cursor-pointer">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Predefined prompts / anomalous advisor */}
                <div className="bg-slate-50 p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 text-xs">
                  <div className="border-b border-gray-200 pb-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5" style={{ fontFamily: "var(--font-arabic)" }}>
                      <HelpCircle className="w-4 h-4 text-emerald-700" />
                      {currentLanguage === "ar" ? "سيناريوهات التحقق الاستباقي" : "Interactive Verification Scenarios"}
                    </h4>
                  </div>

                  <p className="text-gray-500 leading-relaxed text-[11px]">
                    {currentLanguage === "ar"
                      ? "اختر أحد الأسئلة الجاهزة المبرمجة بالأسفل لمساعدة المستثمرين ومسؤولي الأمن الرقمي على فهم متطلبات الثقة وهياكل التوقيع."
                      : "Trigger pre-configured diagnostic queries regarding foreign investors, asymmetrically encrypted contracts, and anomalies."}
                  </p>

                  <div className="space-y-2">
                    {[
                      { textAr: "ما متطلبات الهوية للمستثمرين الأجانب؟", textEn: "Identity rules for foreign investors", prompt: "Explain digital identity requirements for foreign investors" },
                      { textAr: "كيف يتم توثيق عقد تأسيس الشركة قانونياً؟", textEn: "Legally sign incorporation deed", prompt: "How do I securely sign a company incorporation contract?" },
                      { textAr: "هل توجد محاولات شذوذ مصادقة مسجلة؟", textEn: "Check active security anomalies", prompt: "Report authentication anomalies detected in the last hour" },
                      { textAr: "كيف يفحص النظام صلاحية شهادات الـ PKI؟", textEn: "How does Sudan PKI validate certs?", prompt: "How does Sudan PKI validate certificate status?" }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => triggerAiPreset(item.prompt)}
                        className="w-full text-left p-2.5 rounded bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition-all font-mono text-[10px] block cursor-pointer text-slate-800"
                      >
                        {currentLanguage === "ar" ? item.textAr : item.textEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MASTER IMPLEMENTATION SPECIFICATIONS ARCHIVE */}
          {activeTab === "specs" && (
            <div className="space-y-6" id="trust-specs-tab">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* List of 14 deliverables */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 lg:col-span-1 max-h-[550px] overflow-y-auto">
                  <div className="border-b border-gray-100 pb-2 mb-2">
                    <h4 className="font-bold text-gray-950 text-sm" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "وثائق الاعتماد السيادية" : "Sovereign Documents"}
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400 block">14 Mandatory Deliverables</span>
                  </div>

                  <div className="space-y-1.5">
                    {deliverables.map(spec => (
                      <button
                        key={spec.id}
                        onClick={() => setActiveSpecId(spec.id)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all cursor-pointer block truncate ${
                          activeSpecId === spec.id 
                            ? "bg-amber-500 text-slate-950 font-bold shadow-sm" 
                            : "bg-gray-50 text-slate-700 hover:bg-gray-100"
                        }`}
                        style={{ fontFamily: "var(--font-arabic)" }}
                      >
                        {currentLanguage === "ar" ? spec.titleAr : spec.titleEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document reading pane */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-3 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Document Seal Header */}
                  <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                        Standard: {activeSpec.standard}
                      </span>
                      <h3 className="font-bold text-gray-950 text-lg mt-1" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? activeSpec.titleAr : activeSpec.titleEn}
                      </h3>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{currentLanguage === "ar" ? "تصدير الوثيقة" : "Print / Export Spec"}</span>
                    </button>
                  </div>

                  {/* Document Body */}
                  <div className="space-y-4 text-xs leading-relaxed text-gray-700 font-sans whitespace-pre-line bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                    <p className="font-bold text-slate-900 border-b border-gray-200 pb-2 mb-3 font-mono">
                      REPUBLIC OF SUDAN | NATIONAL DIGITAL COOPERATION ARCHIVE
                    </p>
                    
                    {activeSpec.text}

                    <div className="pt-6 border-t border-gray-200 mt-6 flex justify-between items-center text-[10px] font-mono text-gray-400">
                      <span>CLASSIFICATION: <strong className="text-emerald-800 uppercase">Sovereign Confident</strong></span>
                      <span>DATE OF REVISION: 2026-07-15</span>
                      <span>NODE VERIFIED: TRUST-OK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
