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

// Expanded government-grade roles for the Commercial Names Platform permissions
export enum CommercialNamesRole {
  CITIZEN = "citizen",
  MERCHANT = "merchant",
  COMPANY_REPRESENTATIVE = "company_rep",
  REGISTRY_OFFICER = "registry_officer",
  DEPARTMENT_MANAGER = "dept_manager",
  DIRECTOR = "director",
  UNDERSECRETARY = "undersecretary",
  MINISTER = "minister",
  SUPER_ADMIN = "super_admin"
}

export type NameClassificationType = "commercial" | "industrial" | "professional" | "investment" | "service";

export interface CommercialNameReservation {
  id: string;
  nameAr: string;
  nameEn: string;
  classification: NameClassificationType;
  applicantName: string;
  applicantRole: "citizen" | "merchant" | "representative";
  status: "pending" | "approved" | "rejected" | "expired" | "suspended";
  refNumber: string;
  createdAt: string;
  expiryDate: string;
  notes?: string;
  linkedRegistrationId?: string; // Links to CommercialRegistration
  history: {
    id: string;
    actionAr: string;
    actionEn: string;
    timestamp: string;
    actorRole: string;
    actorName: string;
    notes?: string;
  }[];
  verificationRecord?: {
    verifiedAt: string;
    verifiedByIp: string;
    statusAr: string;
    statusEn: string;
  };
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

export enum EntityType {
  SOLE_PROPRIETORSHIP = "sole_proprietorship",
  GENERAL_PARTNERSHIP = "general_partnership",
  LIMITED_PARTNERSHIP = "limited_partnership",
  LLC = "llc",
  JOINT_STOCK = "joint_stock",
  NON_PROFIT = "non_profit",
  COOPERATIVE = "cooperative",
  FOREIGN_BRANCH = "foreign_branch",
  GOVERNMENT_OWNED = "government_owned"
}

export interface Shareholder {
  id: string;
  name: string;
  type: "individual" | "corporate";
  nationality: string;
  percentage: number;
  capitalContribution: number;
  votingRights: boolean;
  sharesCount: number;
}

export interface Director {
  id: string;
  name: string;
  role: "chairman" | "board_member" | "managing_director" | "ceo" | "authorized_signatory";
  nationality: string;
  appointedDate: string;
  status: "active" | "resigned" | "replaced";
  delegatedAuthority?: string;
}

export interface Branch {
  id: string;
  name: string;
  state: string;
  city: string;
  manager: string;
  activities: string[];
  status: "active" | "closed" | "relocated";
  licenseNumber?: string;
}

export interface CorporateDocument {
  id: string;
  name: string;
  type: "aoi" | "moa" | "board_resolution" | "shareholder_resolution" | "capital_certificate" | "supporting";
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  version: number;
  previewUrl: string;
}

export interface AuditLogEntry {
  id: string;
  actionAr: string;
  actionEn: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
  notes?: string;
}

export interface CorporateAmendment {
  id: string;
  companyId: string;
  type: "capital_increase" | "capital_reduction" | "activity_change" | "address_change" | "director_change" | "shareholder_change" | "merger" | "division" | "conversion" | "dissolution" | "liquidation";
  descriptionAr: string;
  descriptionEn: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  approvedAt?: string;
  notes?: string;
}

export interface CorporateCompany {
  id: string;
  legalNameAr: string;
  legalNameEn: string;
  commercialNameAr: string;
  commercialNameEn: string;
  commercialNameId?: string;
  registrationNumber: string;
  entityType: EntityType;
  establishmentDate: string;
  capital: number;
  addressState: string;
  addressCity: string;
  status: "draft" | "submitted" | "legal_review" | "dept_review" | "approved" | "rejected" | "dissolved" | "archived";
  shareholders: Shareholder[];
  directors: Director[];
  branches: Branch[];
  documents: CorporateDocument[];
  amendments: CorporateAmendment[];
  auditHistory: AuditLogEntry[];
  activities: string[];
  contactEmail: string;
  contactPhone: string;
  applicantId: string;
  createdAt: string;
  updatedAt: string;
  qrCodeUrl?: string;
}

// Module 08: National Licensing Platform Types
export type LicenseStatus = "draft" | "pending" | "under_review" | "technical_review" | "compliance_review" | "approved" | "active" | "suspended" | "reactivated" | "cancelled" | "expired" | "archived";

export type ComplianceStatus = "compliant" | "non_compliant" | "critical_violation" | "pending_inspection";

export interface InspectionRecord {
  id: string;
  date: string;
  inspectorName: string;
  status: "passed" | "failed" | "pending";
  notesAr: string;
  notesEn: string;
  violationsFoundAr: string[];
  violationsFoundEn: string[];
}

export interface RenewalRecord {
  id: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  feePaid: number;
  expiryDate: string;
  notesAr: string;
  notesEn: string;
}

export interface LicenseAmendmentRequest {
  id: string;
  licenseId: string;
  type: "activity_change" | "address_change" | "branch_addition" | "branch_removal" | "ownership_update" | "representative_update" | "capacity_increase" | "capacity_reduction";
  descriptionAr: string;
  descriptionEn: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  approvedAt?: string;
}

export interface LicensingDocument {
  id: string;
  nameAr: string;
  nameEn: string;
  type: "license" | "technical" | "compliance" | "supporting" | "inspection";
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  version: number;
}

export interface SovereignLicense {
  id: string;
  licenseNumber: string;
  licenseTypeAr: string;
  licenseTypeEn: string;
  category: "commercial" | "industrial" | "special";
  linkedCompanyId: string;
  linkedCompanyNameAr: string;
  linkedCompanyNameEn: string;
  registrationNumber: string;
  linkedBranchId?: string;
  linkedBranchNameAr?: string;
  linkedBranchNameEn?: string;
  businessActivitiesAr: string[];
  businessActivitiesEn: string[];
  issueDate?: string;
  expiryDate?: string;
  status: LicenseStatus;
  complianceStatus: ComplianceStatus;
  inspections: InspectionRecord[];
  renewals: RenewalRecord[];
  amendments: LicenseAmendmentRequest[];
  documents: LicensingDocument[];
  auditHistory: AuditLogEntry[];
  notesAr?: string;
  notesEn?: string;
  qrCodeUrl?: string;
  capacityLimit?: string; // for industrial plants
  createdAt: string;
  updatedAt: string;
}

