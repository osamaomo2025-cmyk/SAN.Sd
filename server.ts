/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory & File-backed persistent Database to prevent state loss
const DB_FILE = path.join(process.cwd(), "database.json");

interface DBState {
  companies: any[];
  factories: any[];
  licenses: any[];
  certificates: any[];
  landApplications: any[];
  complaints: any[];
}

const defaultDBState: DBState = {
  companies: [
    {
      id: "c-1",
      companyNameAr: "شركة النيل للمنتجات الغذائية المحدودة",
      companyNameEn: "Nile Food Products Co. Ltd",
      registrationNumber: "SD-2026-94829",
      activityType: "صناعات تحويلية غذائية وتعبئة",
      capital: 25000000,
      partners: ["عمر يوسف الفكي", "صالح محمد أحمد"],
      addressState: "الخرطوم",
      addressCity: "بحري المنطقة الصناعية",
      status: "approved",
      applicantId: "user-default",
      createdAt: new Date("2026-02-15").toISOString(),
      updatedAt: new Date("2026-02-15").toISOString()
    },
    {
      id: "c-2",
      companyNameAr: "المؤسسة الوطنية لتطوير الصمغ العربي",
      companyNameEn: "National Gum Arabic Development Corp",
      registrationNumber: "SD-2026-10293",
      activityType: "تصدير المحاصيل النقدية والصناعية",
      capital: 100000000,
      partners: ["وزارة التجارة والصناعة (شراكة)", "المستثمر خالد بن سعيد"],
      addressState: "البحر الأحمر",
      addressCity: "بورتسودان",
      status: "approved",
      applicantId: "user-default",
      createdAt: new Date("2026-03-01").toISOString(),
      updatedAt: new Date("2026-03-01").toISOString()
    }
  ],
  factories: [
    {
      id: "f-1",
      factoryName: "مصنع الخرطوم لتدوير النسيج الحديث",
      industrialSector: "textile",
      locationState: "الخرطوم",
      productionCapacity: "100,000 متر مربع شهرياً",
      energySource: "الشبكة القومية للكهرباء + مولدات طاقة شمسية مساندة",
      productionLinesCount: 4,
      status: "approved",
      applicantId: "user-default",
      createdAt: new Date("2026-04-10").toISOString(),
      updatedAt: new Date("2026-04-10").toISOString(),
      inspectionStatus: "passed",
      lastInspectionDate: "2026-06-12"
    }
  ],
  licenses: [
    {
      id: "l-1",
      licenseType: "export",
      companyId: "c-2",
      companyName: "المؤسسة الوطنية لتطوير الصمغ العربي",
      goodsDescription: "الصمغ العربي السوداني الخام (الهشاب والطلح)",
      annualValueEstimate: 5000000,
      status: "approved",
      applicantId: "user-default",
      createdAt: new Date("2026-05-02").toISOString(),
      updatedAt: new Date("2026-05-02").toISOString()
    }
  ],
  certificates: [
    {
      id: "cer-1",
      certificateNumber: "CO-SD-2026-5541",
      exporterName: "المؤسسة الوطنية لتطوير الصمغ العربي",
      importerName: "Al-Baraka Food Industries",
      importerCountry: "المملكة العربية السعودية",
      hsCode: "1301.90.10",
      goodsDescriptionAr: "صمغ عربي طبيعي نقي 100% درجة ممتازة",
      goodsDescriptionEn: "100% Pure Natural Gum Arabic Premium Grade",
      weightNet: 25000,
      weightGross: 25300,
      portOfLoading: "ميناء بورتسودان الجنوبي",
      portOfDischarge: "ميناء جدة الإسلامي",
      invoiceValue: 125000,
      currency: "USD",
      status: "approved",
      applicantId: "user-default",
      createdAt: new Date("2026-06-20").toISOString()
    }
  ],
  landApplications: [
    {
      id: "la-1",
      investorId: "user-default",
      investorName: "خالد بن سعيد",
      opportunityId: "opp-1",
      proposedProject: "مجمع متكامل لتصنيع وتعبئة عصائر المانجو والبلح السوداني",
      requestedAreaSqm: 15000,
      preferredIndustrialZone: "منطقة الباقير الصناعية",
      status: "approved",
      createdAt: new Date("2026-06-05").toISOString()
    }
  ],
  complaints: [
    {
      id: "comp-1",
      violationType: "price_gouging",
      storeName: "سوبرماركت البركة الحديث",
      state: "الخرطوم",
      city: "أم درمان",
      details: "زيادة غير مبررة في أسعار السكر والدقيق الوطني بنسبة 45% عن الأسعار المعلنة من الوزارة.",
      status: "investigating",
      createdAt: new Date("2026-07-01").toISOString(),
      investigationNotes: "تم توجيه مفتش حماية المستهلك بفرع أم درمان لزيارة الموقع ومراجعة فواتير الشراء للتأكد من تسعيرة المصانع."
    },
    {
      id: "comp-2",
      violationType: "expired_goods",
      storeName: "مستودع المشروبات الغازية بالمنطقة الصناعية",
      state: "البحر الأحمر",
      city: "بورتسودان",
      details: "تخزين وتوزيع عصائر ومشروبات منتهية الصلاحية منذ أكثر من شهر في ظروف تخزين سيئة وعالية الحرارة.",
      status: "resolved",
      createdAt: new Date("2026-07-05").toISOString(),
      investigationNotes: "تم ضبط ومصادرة الكميات المنتهية الصلاحية وإتلافها رسمياً بالتنسيق مع السلطات البلدية، وتحرير مخالفة مالية وغلق الموقع لمدة أسبوعين."
    }
  ]
};

// Read database from file or create new
function getDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Failed to read database.json, initializing default", e);
  }
  saveDB(defaultDBState);
  return defaultDBState;
}

function saveDB(state: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write database.json", e);
  }
}

// Ensure database file is initialized
getDB();

// --- LAZY INITIALIZATION OF GEMINI SDK ---
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiInstance;
}

// --- API ENDPOINTS ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Database Fetch / Write Endpoints
app.get("/api/companies", (req, res) => {
  const db = getDB();
  res.json(db.companies);
});

app.post("/api/companies", (req, res) => {
  const db = getDB();
  const newCompany = {
    id: `c-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.companies.unshift(newCompany);
  saveDB(db);
  res.json({ success: true, company: newCompany });
});

// Update company status (Gov role)
app.post("/api/companies/:id/status", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { status, notes } = req.body;
  const company = db.companies.find((c) => c.id === id);
  if (company) {
    company.status = status;
    if (notes) company.notes = notes;
    company.updatedAt = new Date().toISOString();
    saveDB(db);
    res.json({ success: true, company });
  } else {
    res.status(404).json({ error: "Company not found" });
  }
});

// Factories
app.get("/api/factories", (req, res) => {
  const db = getDB();
  res.json(db.factories);
});

app.post("/api/factories", (req, res) => {
  const db = getDB();
  const newFactory = {
    id: `f-${Date.now()}`,
    status: "pending",
    inspectionStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.factories.unshift(newFactory);
  saveDB(db);
  res.json({ success: true, factory: newFactory });
});

app.post("/api/factories/:id/inspect", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { inspectionStatus, lastInspectionDate, status } = req.body;
  const factory = db.factories.find((f) => f.id === id);
  if (factory) {
    if (inspectionStatus) factory.inspectionStatus = inspectionStatus;
    if (lastInspectionDate) factory.lastInspectionDate = lastInspectionDate;
    if (status) factory.status = status;
    factory.updatedAt = new Date().toISOString();
    saveDB(db);
    res.json({ success: true, factory });
  } else {
    res.status(404).json({ error: "Factory not found" });
  }
});

// Licenses
app.get("/api/licenses", (req, res) => {
  const db = getDB();
  res.json(db.licenses);
});

app.post("/api/licenses", (req, res) => {
  const db = getDB();
  const newLicense = {
    id: `l-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.licenses.unshift(newLicense);
  saveDB(db);
  res.json({ success: true, license: newLicense });
});

// Certificates of Origin
app.get("/api/certificates", (req, res) => {
  const db = getDB();
  res.json(db.certificates);
});

app.post("/api/certificates", (req, res) => {
  const db = getDB();
  const count = db.certificates.length + 1;
  const newCertificate = {
    id: `cer-${Date.now()}`,
    certificateNumber: `CO-SD-2026-${1000 + count}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.certificates.unshift(newCertificate);
  saveDB(db);
  res.json({ success: true, certificate: newCertificate });
});

// Land Applications
app.get("/api/land-applications", (req, res) => {
  const db = getDB();
  res.json(db.landApplications);
});

app.post("/api/land-applications", (req, res) => {
  const db = getDB();
  const newApplication = {
    id: `la-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.landApplications.unshift(newApplication);
  saveDB(db);
  res.json({ success: true, application: newApplication });
});

// Consumer Complaints
app.get("/api/complaints", (req, res) => {
  const db = getDB();
  res.json(db.complaints);
});

app.post("/api/complaints", (req, res) => {
  const db = getDB();
  const newComplaint = {
    id: `comp-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.complaints.unshift(newComplaint);
  saveDB(db);
  res.json({ success: true, complaint: newComplaint });
});

app.post("/api/complaints/:id/resolve", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { status, investigationNotes } = req.body;
  const complaint = db.complaints.find((c) => c.id === id);
  if (complaint) {
    complaint.status = status;
    complaint.investigationNotes = investigationNotes;
    saveDB(db);
    res.json({ success: true, complaint });
  } else {
    res.status(404).json({ error: "Complaint not found" });
  }
});

// Reset database endpoint (for debug or testing)
app.post("/api/db/reset", (req, res) => {
  saveDB(defaultDBState);
  res.json({ success: true, message: "Database reset to defaults" });
});

// --- GOOGLE GEMINI AI ASSISTANT ENDPOINT ---
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history = [], context = {} } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    // If API Key is missing, respond with beautiful system mock advice to keep things functional and instructive
    if (!ai) {
      console.warn("GEMINI_API_KEY is not defined in environment. Using high-fidelity fallback simulator.");
      
      let mockReply = "";
      const query = message.toLowerCase();
      
      if (query.includes("سجل") || query.includes("register") || query.includes("شركة")) {
        mockReply = "مرحباً بك! لتسجيل شركة جديدة في منصتنا الرقمية لعام 2035، يُرجى الانتقال إلى وحدة **السجل التجاري (Commercial Registration)** وتعبئة البيانات الأساسية (الاسم التجاري، رأس المال، الشركاء، الولاية). بعد الإرسال، سيتم توليد رمز استجابة سريعة (QR Code) موثق للتحقق الفوري من حالة السجل.";
      } else if (query.includes("مصنع") || query.includes("صناعي") || query.includes("factory")) {
        mockReply = "أهلاً بك في بوابة التصنيع السودانية 2035. يمكنك تسجيل منشأتك الصناعية من خلال **المنصة الصناعية (Industrial Platform)**. تحتاج لتقديم معلومات عن خطوط الإنتاج، الطاقة الاستيعابية، ومصادر الطاقة لتسهيل جدولة عمليات التفتيش الصناعي الذكي وحساب حصص دعم الطاقة المخصصة.";
      } else if (query.includes("تصدير") || query.includes("استيراد") || query.includes("منشأ") || query.includes("export") || query.includes("import")) {
        mockReply = "لتسجيل المصدرين والمستوردين أو استخراج **شهادة المنشأ الرقمية (Certificate of Origin)**، يرجى ملء طلبات الاستيراد والتصدير مباشرة من الوحدة المخصصة. يتم تدقيق رموز التعريف المنسق (HS Code) تلقائياً لتسريع الإفراج الجمركي بميناء بورتسودان.";
      } else if (query.includes("استثمار") || query.includes("فرصة") || query.includes("أرض") || query.includes("investment")) {
        mockReply = "رؤية السودان الاقتصادية 2035 تتيح فرصاً استثمارية هائلة في مجالات الصمغ العربي، الطاقة المتجددة، والصناعات الغذائية. تفضل بزيارة **بوابة الاستثمار (Investment Portal)** لاستعراض خارطة المدن الصناعية وحجز الأراضي الاستثمارية إلكترونياً.";
      } else if (query.includes("شكوى") || query.includes("حماية") || query.includes("بلاغ") || query.includes("complaint")) {
        mockReply = "تلتزم إدارة **حماية المستهلك (Consumer Protection)** بمراقبة الأسواق وضبط الأسعار. يمكنك تقديم بلاغ عاجل عن غش تجاري أو احتكار أو زيادة أسعار غير قانونية، وسيتم توجيه مفتش ميداني للموقع فوراً مع إخطارك بالحل في لوحة التحكم الخاصة بك.";
      } else {
        mockReply = "أهلاً بك في منصة وزارة التجارة والصناعة السودانية الرقمية 2035. أنا مساعدك الذكي المتكامل للوزارة الرقمية السودانية 2035. يمكنني إرشادك في شؤون السجل التجاري، التراخيص الصناعية، شهادات المنشأ، تتبع الاستثمارات، أو رفع شكاوى حماية المستهلك. كيف يمكنني خدمتك اليوم؟";
      }

      return res.json({
        text: `💡 (ملاحظة: يعمل المساعد حالياً بنظام محاكاة الذكاء الاصطناعي لعدم توفر مفتاح GEMINI_API_KEY في الإعدادات)\n\n${mockReply}`,
        suggestions: [
          "كيف يمكنني تسجيل شركة جديدة؟",
          "ما هي الفرص الاستثمارية في السودان 2035؟",
          "كيف أستخرج شهادة منشأ لتصدير الصمغ العربي؟",
          "تقديم بلاغ لحماية المستهلك"
        ]
      });
    }

    // System instruction to guide Gemini perfectly
    const systemInstruction = `
      You are the Sudan Digital Ministry of Commerce & Industry AI Assistant (مساعد وزارة التجارة والصناعة السودانية الرقمية الذكي - رؤية 2035).
      Your role is to guide and advise users (citizens, local businesses, international investors, and government employees) about policies, registrations, trade regulations, consumer protection, and industrial development in Sudan.
      
      Always frame responses around Sudan's "Vision 2035" for digital transformation, including:
      - Quick, modern commercial registration (السجل التجاري الرقمي).
      - Modernizing industrial factories and smart manufacturing (المنصة الصناعية الذكية).
      - Seamless export/import certifications and digitized certificates of origin (شهادة المنشأ الرقمية وميناء بورتسودان الذكي).
      - Investment opportunities in golden sectors (الصمغ العربي, agriculture, gold, industrial zones like Giad, Port Sudan Free Zone, El Bagair).
      - Active consumer protection and market surveillance (حماية المستهلك وضبط الأسواق).

      Be extremely professional, encouraging, and formally polite. Use Sudan government administrative terms appropriately.
      Always respond in Arabic by default unless the user communicates in English.
      If the user is asking how to do something, provide step-by-step instructions and refer to the specific modules in this system.
      
      Current system context:
      ${JSON.stringify(context)}
    `;

    // Map history to Google GenAI schema format
    const formattedContents = [];
    for (const h of history) {
      if (h.sender === "user") {
        formattedContents.push({ role: "user", parts: [{ text: h.text }] });
      } else {
        formattedContents.push({ role: "model", parts: [{ text: h.text }] });
      }
    }
    // Add current query
    formattedContents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "عذراً، لم أتمكن من معالجة الطلب في الوقت الحالي.";

    // Generate smart follow-up suggestions dynamically
    const suggestionsResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `بناءً على الرد التالي، اقترح 3 أسئلة متابعة قصيرة جداً ومناسبة يمكن للمستثمر أو المواطن السوداني طرحها. عد بـ JSON كصفوف نصوص بسيطة فقط:
      الرد: "${responseText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: { type: "string" }
        }
      }
    });

    let suggestions = [
      "كيف أبدأ بتسجيل شركتي؟",
      "ما هي شروط ترخيص منشأة صناعية؟",
      "ما هي تكلفة إصدار شهادة المنشأ؟"
    ];

    try {
      if (suggestionsResponse.text) {
        const parsed = JSON.parse(suggestionsResponse.text.trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          suggestions = parsed;
        }
      }
    } catch (e) {
      // Ignore parse errors, use defaults
    }

    res.json({
      text: responseText,
      suggestions: suggestions.slice(0, 4)
    });

  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({
      error: "فشل مساعد الذكاء الاصطناعي في الاتصال بـ Gemini",
      details: error.message
    });
  }
});

// --- VITE MIDDLEWARE & STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Check if dist exists, if not, alert
    if (!fs.existsSync(distPath)) {
      console.warn("WARNING: 'dist' folder not found. Please build the frontend first!");
    }

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SDMCI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
