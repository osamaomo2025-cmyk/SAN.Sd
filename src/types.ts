/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  PUBLIC_CITIZEN = "public_citizen",
  BUSINESS_INVESTOR = "business_investor",
  GOVERNMENT_MINISTER = "gov_minister",
  GOVERNMENT_EXECUTIVE = "gov_executive",
  GOVERNMENT_EMPLOYEE = "gov_employee"
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  organization?: string;
  idNumber?: string;
  createdAt: string;
}

export enum ApplicationStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  REVISION_REQUIRED = "revision_required"
}

// Module 02: Commercial Registration
export interface CommercialRegistration {
  id: string;
  companyNameAr: string;
  companyNameEn: string;
  registrationNumber: string;
  activityType: string;
  capital: number; // in SDG or USD
  partners: string[];
  addressState: string; // Khartoum, Red Sea, River Nile, etc.
  addressCity: string;
  status: ApplicationStatus;
  applicantId: string;
  createdAt: string;
  updatedAt: string;
  qrCodeUrl?: string;
  notes?: string;
}

// Module 03: Industrial Platform
export interface FactoryRegistration {
  id: string;
  factoryName: string;
  industrialSector: "food" | "chemical" | "textile" | "engineering" | "pharmaceutical" | "other";
  locationState: string;
  productionCapacity: string;
  energySource: string;
  productionLinesCount: number;
  status: ApplicationStatus;
  applicantId: string;
  createdAt: string;
  updatedAt: string;
  inspectionStatus?: "pending" | "passed" | "failed";
  lastInspectionDate?: string;
}

// Module 04: Import & Export
export interface ImportExportLicense {
  id: string;
  licenseType: "import" | "export";
  companyId: string;
  companyName: string;
  goodsDescription: string;
  annualValueEstimate: number;
  status: ApplicationStatus;
  applicantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateOfOrigin {
  id: string;
  certificateNumber: string;
  exporterName: string;
  importerName: string;
  importerCountry: string;
  hsCode: string; // Harmonized System tariff code
  goodsDescriptionAr: string;
  goodsDescriptionEn: string;
  weightNet: number; // in kg
  weightGross: number; // in kg
  portOfLoading: string; // e.g. Port Sudan
  portOfDischarge: string;
  invoiceValue: number;
  currency: string; // SDG, USD, EUR
  status: ApplicationStatus;
  applicantId: string;
  createdAt: string;
}

// Module 05: Investment Portal
export interface InvestmentOpportunity {
  id: string;
  titleAr: string;
  titleEn: string;
  sectorAr: string;
  sectorEn: string;
  locationAr: string;
  locationEn: string;
  descriptionAr: string;
  descriptionEn: string;
  requiredCapital: string;
  incentivesAr: string;
  incentivesEn: string;
  imageUrl?: string;
}

export interface LandApplication {
  id: string;
  investorId: string;
  investorName: string;
  opportunityId: string;
  proposedProject: string;
  requestedAreaSqm: number;
  preferredIndustrialZone: string; // e.g., Giad, Port Sudan Free Zone, El Bagair, Khartoum North
  status: ApplicationStatus;
  createdAt: string;
}

// Module 06: Consumer Protection
export interface ConsumerComplaint {
  id: string;
  reporterName?: string;
  reporterPhone?: string;
  violationType: "price_gouging" | "expired_goods" | "monopoly" | "counterfeit" | "other";
  storeName: string;
  state: string;
  city: string;
  details: string;
  status: "new" | "investigating" | "resolved" | "dismissed";
  createdAt: string;
  investigationNotes?: string;
}

// AI Assistant types
export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestions?: string[];
  suggestedAction?: {
    type: string;
    payload: any;
  };
}
