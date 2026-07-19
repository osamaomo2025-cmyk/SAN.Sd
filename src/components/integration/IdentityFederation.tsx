import React, { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, ShieldCheck, RefreshCw, Sparkles, Fingerprint, Lock, Globe, FileCode, CheckSquare, ShieldAlert } from "lucide-react";

interface IdentityFederationProps {
  currentLanguage: "ar" | "en";
}

export default function IdentityFederation({ currentLanguage }: IdentityFederationProps) {
  const [fedProvider, setFedProvider] = useState("registry");
  const [fedIdType, setFedIdType] = useState("citizen");
  const [fedIdNumber, setFedIdNumber] = useState("1-1988-829103");
  const [fedSsoResult, setFedSsoResult] = useState<any>(null);
  const [isFederating, setIsFederating] = useState(false);

  const runFederateSSO = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFederating(true);
    setFedSsoResult(null);

    setTimeout(() => {
      setIsFederating(false);
      const randSig = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const timestamp = new Date().toISOString();

      setFedSsoResult({
        meta: {
          iss: "SD-GOV-SSO-FEDERATION-AUTH",
          aud: "sdmci-enterprise-gateway",
          issuedAt: timestamp,
          token_type: "Bearer JWT / SAML 2.0 Assertion",
          signature: `sha256-sig_${randSig.substring(0, 16)}`
        },
        profile: {
          id: fedIdNumber,
          fullNameAr: fedIdType === "employee" ? "عبد الرحمن عثمان الهادي" : "آمنة الطيب الفكي",
          fullNameEn: fedIdType === "employee" ? "Abdelrahman Osman Al-Hadi" : "Amna El-Tayeb Al-Faki",
          clearanceLevel: fedIdType === "employee" ? "Level 3 - Federal Access" : "Level 1 - Public",
          departmentAr: fedIdType === "employee" ? "إدارة التراخيص الصناعية" : "مواطن - السجل المدني",
          departmentEn: fedIdType === "employee" ? "Industrial Licensing Directorate" : "Citizen Profile",
          status: "VERIFIED / ACTIVE",
          organizationAr: fedIdType === "employee" ? "وزارة التجارة والصناعة" : "ديوان الخدمة المدنية",
          organizationEn: fedIdType === "employee" ? "Ministry of Commerce & Industry" : "Civil Registry Service"
        },
        samlAssertion: `<?xml version="1.0"?>\n<saml2:Assertion ID="_s8d9f10f..." IssueInstant="${timestamp}">\n  <saml2:Issuer>SD-GOV-IDP</saml2:Issuer>\n  <saml2:Subject>${fedIdNumber}</saml2:Subject>\n  <saml2:AuthnStatement Clearance="${fedIdType === "employee" ? "L3" : "L1"}"/>\n</saml2:Assertion>`
      });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6" id="module-identity-federation">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
          <KeyRound className="w-5 h-5 text-emerald-600" />
          <span>{currentLanguage === "ar" ? "منصة اتحاد الهوية الرقمية والدخول الموحد SSO" : "Digital Identity Federation & SSO Platform"}</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {currentLanguage === "ar"
            ? "الربط الفيدرالي الموحد مع السجل المدني وبوابات الهوية لتمكين موظفي الحكومة والشركات والمواطنين من الوصول الآمن للخدمات المشتركة."
            : "Federated Identity Provider (IdP) integration enabling unified secure Single Sign-On (SSO) for government employees, merchants, and citizens."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Federate SSO Session */}
        <div className="lg:col-span-5 bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            {currentLanguage === "ar" ? "محاكي بوابات الهوية الوطنية" : "Sovereign Identity Provider Simulator"}
          </h4>

          <form onSubmit={runFederateSSO} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "مزود خدمة الهوية" : "Identity Provider (IdP)"}</label>
              <select
                value={fedProvider}
                onChange={(e) => setFedProvider(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none"
              >
                <option value="registry">{currentLanguage === "ar" ? "السجل المدني القومي (National ID)" : "National Civil Registry (IdP)"}</option>
                <option value="sdmci">{currentLanguage === "ar" ? "بوابة موظفي وزارة التجارة والصناعة" : "SDMCI Employee ID Gate"}</option>
                <option value="telecom">{currentLanguage === "ar" ? "الهوية القومية المشتركة لشركات الاتصالات" : "Sudan Telecom Unified ID"}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "فئة الهوية" : "Identity Profile Type"}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "citizen", labelAr: "مواطن", labelEn: "Citizen" },
                  { id: "employee", labelAr: "موظف حكومي", labelEn: "Staff" },
                  { id: "business", labelAr: "مفوض شركة", labelEn: "Merchant" }
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setFedIdType(type.id);
                      setFedIdNumber(type.id === "employee" ? "SD-EMP-94821" : type.id === "business" ? "SD-BIZ-482109" : "1-1988-829103");
                    }}
                    className={`py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                      fedIdType === type.id
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {currentLanguage === "ar" ? type.labelAr : type.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "الرقم التعريفي الموحد" : "Unified Identity / National ID"}</label>
              <input
                type="text"
                value={fedIdNumber}
                onChange={(e) => setFedIdNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-mono font-bold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isFederating}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              {isFederating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>FEDERATING CREDENTIALS...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>{currentLanguage === "ar" ? "تأسيس الجلسة الفيدرالية الموحدة" : "Establish Federated SSO Session"}</span>
                </>
              )}
            </button>
          </form>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/50 text-[10.5px] text-amber-900 leading-normal">
            <div className="flex gap-1.5 font-bold mb-1 items-center">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Zero-Trust Directory Standards</span>
            </div>
            <p>
              {currentLanguage === "ar"
                ? "يتم تشفير وتوقيع جلسة SSO تلقائياً باستخدام معايير ممتدة لحماية خصوصية البيانات ومكافحة سرقة الهوية."
                : "Active directory federation enforces automated token lifetimes, secure SAML assertions, and signed SHA256 claims."}
            </p>
          </div>
        </div>

        {/* Right Content: Federated ID Hologram or Token */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {isFederating ? (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-500 font-mono">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
              <span>[CRYPTO EXCHANGE] Connecting with National Identity provider...</span>
            </div>
          ) : fedSsoResult ? (
            <div className="space-y-4">
              {/* Sovereign Identity Card Presentation */}
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white p-5 rounded-2xl border border-emerald-800/40 relative overflow-hidden shadow-xl min-h-[220px]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 border-4 border-amber-500/30 rounded-full" />

                <div className="flex justify-between items-start border-b border-emerald-800/50 pb-3 mb-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-wider text-amber-400 font-bold uppercase">SUDAN FEDERATED ID PLATFORM</span>
                    <h5 className="font-bold text-xs" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "جمهورية السودان | الهوية الرقمية الموحدة" : "REPUBLIC OF SUDAN | UNIFIED SSO"}
                    </h5>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "الاسم الكامل" : "Verified Name"}</span>
                        <span className="font-bold text-slate-100" style={{ fontFamily: "var(--font-arabic)" }}>
                          {currentLanguage === "ar" ? fedSsoResult.profile.fullNameAr : fedSsoResult.profile.fullNameEn}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "الرقم الموحد" : "Sovereign ID"}</span>
                        <span className="font-bold font-mono text-amber-400">{fedSsoResult.profile.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "المنظمة والقطاع" : "Authority / Unit"}</span>
                        <span className="font-bold text-slate-200" style={{ fontFamily: "var(--font-arabic)" }}>
                          {currentLanguage === "ar" ? fedSsoResult.profile.organizationAr : fedSsoResult.profile.organizationEn}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "مستوى التصريح" : "SSO Clearance"}</span>
                        <span className="font-bold text-emerald-400 font-mono text-[11px]">{fedSsoResult.profile.clearanceLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-emerald-900/30 self-stretch sm:self-auto flex items-center justify-center shadow-lg">
                    {/* Generates a simple mock visual qr code */}
                    <div className="w-20 h-20 bg-slate-100 flex flex-col items-center justify-center font-mono text-[8px] text-gray-400 text-center rounded border border-gray-200 select-none">
                      <div className="grid grid-cols-4 gap-1 p-1 w-full h-full bg-white text-slate-900">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className={`w-full h-full ${i % 3 === 0 || i % 5 === 1 ? "bg-slate-950" : "bg-white"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-dashed border-emerald-800/40 flex justify-between items-center text-[10px] text-gray-400">
                  <span className="font-mono text-emerald-400">{fedSsoResult.meta.token_type}</span>
                  <span className="font-mono text-gray-500">{fedSsoResult.profile.status}</span>
                </div>
              </div>

              {/* Cryptographic token representation */}
              <div className="space-y-1">
                <label className="block text-gray-500 text-[10px] font-mono mb-1 uppercase">SAML 2.0 / JWT CRYPTOGRAPHIC CLAIMS</label>
                <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 font-mono text-[10px] overflow-x-auto max-h-32 leading-relaxed">
                  <div className="text-amber-400">// HEADER CLMS & SIGNATURE VERIFIED</div>
                  <div>ID_ISSUER: {fedSsoResult.meta.iss}</div>
                  <div>SIGNATURE: {fedSsoResult.meta.signature}</div>
                  <pre className="text-blue-300 mt-2">{fedSsoResult.samlAssertion}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[220px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 text-xs text-gray-400 text-center">
              <Fingerprint className="w-12 h-12 text-gray-300 mb-2 animate-pulse" />
              <p className="font-semibold" style={{ fontFamily: "var(--font-arabic)" }}>
                {currentLanguage === "ar" ? "في انتظار تأسيس جلسة الهوية الرقمية الموحدة" : "Unified identity authentication session pending"}
              </p>
              <p className="text-[10.5px] text-gray-400 mt-1 max-w-sm">
                {currentLanguage === "ar"
                  ? "قم بتحديد مزود الهوية ورقم السجل واضغط على زر تأسيس لتوليد ادعاءات التوقيع وبث رموز الجلسة."
                  : "Choose an ID provider, enter reference national registers, and click authenticate to establish safe cryptographically signed SSO sessions."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
