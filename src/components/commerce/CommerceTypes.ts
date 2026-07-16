/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CommerceUserRole {
  ENTREPRENEUR = "entrepreneur",
  SME_OWNER = "sme_owner",
  STARTUP_FOUNDER = "startup_founder",
  MARKETPLACE_OPERATOR = "marketplace_operator",
  DIGITAL_MERCHANT = "digital_merchant",
  CONSUMER = "consumer",
  GOVERNMENT_OFFICER = "government_officer",
  SME_ADVISOR = "sme_advisor",
  DEPARTMENT_MANAGER = "department_manager",
  DIRECTOR = "director",
  UNDERSECRETARY = "undersecretary",
  MINISTER = "minister",
  SUPER_ADMIN = "super_admin"
}

export type BusinessType = "online_store" | "marketplace" | "home_based" | "freelancer" | "digital_service";

export interface AuditLog {
  id: string;
  actionAr: string;
  actionEn: string;
  actor: string;
  role: string;
  timestamp: string;
  ip: string;
}

export interface DigitalBusiness {
  id: string;
  digitalId: string; // Unique National Digital Business Identifier, e.g., SD-BIZ-749210
  storeNameAr: string;
  storeNameEn: string;
  businessType: BusinessType;
  ownerName: string;
  email: string;
  phone: string;
  status: "pending" | "verified" | "active" | "suspended" | "archived";
  trustScore: number; // 0 - 100
  sector: string;
  addressState: string;
  addressCity: string;
  registeredAt: string;
  annualRevenue: number;
  paymentPlatformLinked: boolean;
  logisticsLinked: boolean;
  crLink?: string; // Linked Commercial Registration
  licenseLink?: string; // Linked license number
  auditLogs: AuditLog[];
}

export interface SmeProgram {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: "grant" | "incubation" | "accelerator" | "mentorship" | "skills_training";
  sponsor: string;
  fundingAmount?: number;
  eligibilityCriteriaAr: string;
  eligibilityCriteriaEn: string;
  registeredCount: number;
  status: "active" | "closed" | "completed";
}

export interface StartupRecord {
  id: string;
  name: string;
  founder: string;
  descriptionAr: string;
  descriptionEn: string;
  industry: string;
  fundingStage: "pre-seed" | "seed" | "series-a" | "bootstrapped";
  status: "active" | "funded" | "incubating" | "graduated";
  survivalYears: number;
  investmentAmount: number;
  registeredAt: string;
}

export interface MarketplaceProduct {
  id: string;
  businessId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  currency: string;
  category: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  status: "active" | "under_review" | "suspended";
}

export interface ElectronicInvoice {
  id: string;
  invoiceNumber: string;
  issuerId: string;
  buyerName: string;
  buyerTaxId?: string;
  issueDate: string;
  amount: number;
  vatAmount: number;
  status: "paid" | "pending" | "cancelled";
  paymentGatewayRef?: string;
}

export interface DigitalContract {
  id: string;
  contractNumber: string;
  partyA: string;
  partyB: string;
  titleAr: string;
  titleEn: string;
  signedAt?: string;
  status: "draft" | "signed" | "terminated";
  hash: string;
}

export interface DisputeRecord {
  id: string;
  ticketNumber: string;
  businessId: string;
  consumerName: string;
  consumerPhone: string;
  complaintType: "non_delivery" | "defective_product" | "price_mismatch" | "fraud" | "other";
  details: string;
  status: "new" | "under_investigation" | "resolved" | "dismissed";
  createdAt: string;
  resolutionAr?: string;
  resolutionEn?: string;
}

export interface ShipmentRecord {
  id: string;
  trackingNumber: string;
  businessId: string;
  carrier: string;
  origin: string;
  destination: string;
  currentLocation: string;
  status: "pickup" | "transit" | "out_for_delivery" | "delivered" | "exception";
  lastUpdated: string;
  warehouseId?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestions?: string[];
}
