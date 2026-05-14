export type ArchitectSpecialization = "Residential" | "Commercial" | "Industrial" | "Landscape" | "Sustainability" | "Interior";

export interface ArchitectPortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

export interface ArchitectProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specialization: ArchitectSpecialization[];
  style: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  locality: string;
  languages: string[];
  bio: string;
  portfolio: ArchitectPortfolioItem[];
  verified: boolean;
}

export type FeedbackSeverity = "low" | "medium" | "high" | "critical";
export type FeedbackStatus = "open" | "resolved" | "ignored";

export interface FeedbackItem {
  id: string;
  architectId: string;
  timestamp: string;
  category: "plan" | "technical" | "compliance" | "material" | "cost" | "execution";
  content: string;
  severity: FeedbackSeverity;
  status: FeedbackStatus;
  linkedElementId?: string; // Room ID, BOQ Item ID, etc.
}

export interface CollaborationSession {
  projectId: string;
  architectId: string | null;
  status: "matching" | "consulting" | "reviewing" | "refining" | "approved";
  feedback: FeedbackItem[];
  chatHistory: unknown[]; // For future chat implementation
  startedAt: string;
  lastUpdate: string;
  isSigned: boolean;
  signatureUrl?: string;
  approvalDate?: string;
}
