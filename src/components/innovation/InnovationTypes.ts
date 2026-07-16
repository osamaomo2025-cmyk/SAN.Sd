/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Unified Roles for National Innovation, Research & Intellectual Property Platform
export enum InnovationUserRole {
  INNOVATOR = "innovator",
  RESEARCHER = "researcher",
  UNIVERSITY_ADMIN = "university_admin",
  PATENT_EXAMINER = "patent_examiner",
  TRADEMARK_EXAMINER = "trademark_examiner",
  TECH_TRANSFER_OFFICER = "tech_transfer_officer",
  INNOVATION_FUND_MANAGER = "innovation_fund_manager",
  LEGAL_ADVISOR = "legal_advisor",
  DEPARTMENT_MANAGER = "dept_manager",
  DIRECTOR = "director",
  UNDERSECRETARY = "undersecretary",
  MINISTER = "minister",
  SUPER_ADMIN = "super_admin"
}

// Participant Registry Types
export type InnovatorType = 
  | "individual" 
  | "researcher" 
  | "university" 
  | "research_center" 
  | "startup" 
  | "tech_company" 
  | "industrial_unit" 
  | "gov_institution" 
  | "innovation_hub";

export interface InnovatorRegistryRecord {
  id: string; // Internal unique ID
  nii: string; // National Innovation Identifier: SD-NII-2026-XXXXX
  nameAr: string;
  nameEn: string;
  type: InnovatorType;
  representative: string;
  email: string;
  phone: string;
  state: string; // Geolocation GIS Link
  city: string;
  specializationAr: string;
  specializationEn: string;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
  auditLogs: {
    actionAr: string;
    actionEn: string;
    timestamp: string;
    actor: string;
  }[];
}

// Research Management Interfaces
export type ResearchStatus = "submitted" | "funding_review" | "active" | "completed" | "terminated";

export interface ResearchProject {
  id: string;
  titleAr: string;
  titleEn: string;
  leadResearcherId: string; // Links to InnovatorRegistryRecord
  leadResearcherName: string;
  institutionAr: string;
  institutionEn: string;
  fundingSourceAr: string;
  fundingSourceEn: string;
  allocatedBudget: number; // in SDG
  progressPercentage: number;
  status: ResearchStatus;
  startDate: string;
  endDate: string;
  collaborators: string[]; // List of names
  publications: string[]; // Publication titles
  outcomesAr: string;
  outcomesEn: string;
  isInternational: boolean;
  internationalPartners?: string[];
  programAr?: string; // Gov Research Program name
  programEn?: string;
}

// Intellectual Property (IP) Types
export type IpType = 
  | "patent" 
  | "utility_model" 
  | "industrial_design" 
  | "trademark" 
  | "copyright" 
  | "trade_secret" 
  | "geographical_indication";

export type IpLifecycleStatus = 
  | "submission" 
  | "technical_examination" 
  | "legal_review" 
  | "publication" 
  | "opposition" 
  | "registered" 
  | "renewed" 
  | "assigned" 
  | "licensed" 
  | "expired";

export interface IpRecord {
  id: string;
  ipNumber: string; // e.g. SD-PAT-2026-XXXX
  titleAr: string;
  titleEn: string;
  type: IpType;
  ownerId: string;
  ownerName: string;
  inventors: string[];
  status: IpLifecycleStatus;
  submissionDate: string;
  registrationDate?: string;
  expiryDate?: string;
  descriptionAr: string;
  descriptionEn: string;
  claimsAr?: string[];
  claimsEn?: string[];
  oppositionRecords?: {
    opposerName: string;
    reasonAr: string;
    reasonEn: string;
    date: string;
    status: "pending" | "dismissed" | "upheld";
  }[];
  licensingAgreements?: {
    licensee: string;
    termsAr: string;
    termsEn: string;
    fee: number;
    date: string;
  }[];
  auditLogs: {
    status: IpLifecycleStatus;
    actionAr: string;
    actionEn: string;
    timestamp: string;
    actor: string;
    notes?: string;
  }[];
}

// Technology Transfer Interfaces
export interface TechTransferAsset {
  id: string;
  titleAr: string;
  titleEn: string;
  sourceInstitutionAr: string;
  sourceInstitutionEn: string;
  trl: number; // Technology Readiness Level: 1 - 9
  licenseType: "exclusive" | "non-exclusive" | "assignment" | "joint_venture";
  askingPrice: number; // in SDG (0 for open-source / negotiated)
  descriptionAr: string;
  descriptionEn: string;
  targetIndustries: string[];
  status: "available" | "negotiation" | "licensed";
}

export interface UniversityIndustryPartnership {
  id: string;
  projectNameAr: string;
  projectNameEn: string;
  universityAr: string;
  universityEn: string;
  industryPartnerAr: string;
  industryPartnerEn: string;
  scopeAr: string;
  scopeEn: string;
  startDate: string;
  milestones: {
    titleAr: string;
    titleEn: string;
    dueDate: string;
    status: "pending" | "completed";
  }[];
}

// National Innovation Fund
export type FundType = "grant" | "startup_seed" | "research_grant" | "tech_dev" | "accelerator" | "commercialization";

export interface FundApplication {
  id: string;
  refCode: string; // SD-NIF-2026-XXXX
  applicantName: string;
  applicantId: string;
  projectTitleAr: string;
  projectTitleEn: string;
  type: FundType;
  requestedAmount: number;
  approvedAmount?: number;
  status: "submitted" | "under_evaluation" | "approved" | "rejected" | "disbursing" | "completed";
  milestones: {
    id: string;
    titleAr: string;
    titleEn: string;
    amount: number;
    status: "pending" | "approved" | "released";
  }[];
  impactMetrics?: {
    jobsCreated: number;
    trlProgress: string;
    patentsFiled: number;
  };
  createdAt: string;
}

// Knowledge Economy Platform
export interface InnovationChallenge {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  rewardPool: number; // SDG
  deadline: string;
  participantsCount: number;
  status: "open" | "evaluating" | "completed";
  winnerName?: string;
}

export interface ExpertProfile {
  id: string;
  name: string;
  fieldAr: string;
  fieldEn: string;
  organizationAr: string;
  organizationEn: string;
  publicationsCount: number;
  patentsCount: number;
  email: string;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: "research" | "patent_guide" | "policy" | "case_study";
  author: string;
  downloads: number;
  date: string;
  url: string;
}

// Collaboration Workspace
export interface WorkspaceProject {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  members: {
    name: string;
    role: string;
    organization: string;
  }[];
  documents: {
    id: string;
    name: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
  }[];
  discussions: {
    id: string;
    sender: string;
    organization: string;
    text: string;
    timestamp: string;
  }[];
  milestones: {
    id: string;
    titleAr: string;
    titleEn: string;
    status: "pending" | "completed";
    dueDate: string;
  }[];
}

// GIS Innovation Node
export interface GisInnovationNode {
  id: string;
  nameAr: string;
  nameEn: string;
  type: "hub" | "university" | "center" | "park" | "incubator";
  stateAr: string;
  stateEn: string;
  coordinates: string;
  x: number; // pixel mapping for map
  y: number; // pixel mapping for map
  activePatents: number;
  researchProjectsCount: number;
  startupsCount: number;
  fundingDisbursed: number; // SDG
}
