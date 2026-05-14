import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ArchitectProfile, CollaborationSession, FeedbackItem, FeedbackStatus } from "@/types/collaboration";

interface CollaborationState {
  session: CollaborationSession | null;
  selectedArchitect: ArchitectProfile | null;
  availableArchitects: ArchitectProfile[];
  isMatching: boolean;

  startSession: (projectId: string) => void;
  selectArchitect: (architect: ArchitectProfile) => void;
  addFeedback: (feedback: Omit<FeedbackItem, "id" | "timestamp" | "status">) => void;
  updateFeedbackStatus: (id: string, status: FeedbackStatus) => void;
  setSessionStatus: (status: CollaborationSession["status"]) => void;
  signProject: (signatureUrl: string) => void;
}

// Mock Data for Architects
const MOCK_ARCHITECTS: ArchitectProfile[] = [
  {
    id: "arch-01",
    name: "Ar. Vikram Sethi",
    title: "Senior Residential Architect",
    avatar: "/avatars/arch1.png",
    specialization: ["Residential", "Interior"],
    style: ["Modern Minimalist", "Tropical Modern"],
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 128,
    consultationFee: 15000,
    locality: "Mumbai, MH",
    languages: ["English", "Hindi", "Marathi"],
    bio: "Specializing in luxury residential villas with a focus on sustainable materials and Vastu-compliant spatial planning.",
    portfolio: [
      { id: "p1", title: "Glass House", imageUrl: "/renders/render_exterior.png", category: "Villa" }
    ],
    verified: true
  },
  {
    id: "arch-02",
    name: "Ar. Ananya Iyer",
    title: "Sustainable Design Lead",
    avatar: "/avatars/arch2.png",
    specialization: ["Residential", "Sustainability"],
    style: ["Eco-Contemporary", "Vernacular"],
    experienceYears: 9,
    rating: 4.8,
    reviewCount: 84,
    consultationFee: 12000,
    locality: "Bangalore, KA",
    languages: ["English", "Kannada", "Tamil"],
    bio: "Expert in climate-responsive architecture and low-carbon construction techniques.",
    portfolio: [
      { id: "p2", title: "Earth Retreat", imageUrl: "/renders/render_interior.png", category: "Resort" }
    ],
    verified: true
  },
  {
    id: "arch-03",
    name: "Ar. Rahul Varma",
    title: "BIM & Technical Consultant",
    avatar: "/avatars/arch3.png",
    specialization: ["Commercial", "Industrial"],
    style: ["Industrial Chic", "High-Tech"],
    experienceYears: 11,
    rating: 4.7,
    reviewCount: 92,
    consultationFee: 20000,
    locality: "Delhi, NCR",
    languages: ["English", "Hindi", "Punjabi"],
    bio: "Focusing on large-scale execution feasibility and technical accuracy in complex structures.",
    portfolio: [],
    verified: true
  }
];

export const useCollaborationStore = create<CollaborationState>()(
  persist(
    (set) => ({
      session: null,
      selectedArchitect: null,
      availableArchitects: MOCK_ARCHITECTS,
      isMatching: false,

      startSession: (projectId) => {
        set({
          session: {
            projectId,
            architectId: null,
            status: "matching",
            feedback: [],
            chatHistory: [],
            startedAt: new Date().toISOString(),
            lastUpdate: new Date().toISOString(),
            isSigned: false
          }
        });
      },

      selectArchitect: (architect) => {
        set((state) => ({
          selectedArchitect: architect,
          session: state.session ? {
            ...state.session,
            architectId: architect.id,
            status: "consulting",
            lastUpdate: new Date().toISOString()
          } : null
        }));
      },

      addFeedback: (feedback) => {
        set((state) => {
          if (!state.session) return state;
          const newItem: FeedbackItem = {
            ...feedback,
            id: `fb-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            status: "open"
          };
          return {
            session: {
              ...state.session,
              feedback: [...state.session.feedback, newItem],
              lastUpdate: new Date().toISOString(),
              status: "refining"
            }
          };
        });
      },

      updateFeedbackStatus: (id, status) => {
        set((state) => {
          if (!state.session) return state;
          return {
            session: {
              ...state.session,
              feedback: state.session.feedback.map(f => f.id === id ? { ...f, status } : f),
              lastUpdate: new Date().toISOString()
            }
          };
        });
      },

      setSessionStatus: (status) => {
        set((state) => ({
          session: state.session ? { ...state.session, status, lastUpdate: new Date().toISOString() } : null
        }));
      },

      signProject: (signatureUrl) => {
        set((state) => ({
          session: state.session ? {
            ...state.session,
            status: "approved",
            isSigned: true,
            signatureUrl,
            approvalDate: new Date().toISOString(),
            lastUpdate: new Date().toISOString()
          } : null
        }));
      }
    }),
    {
      name: "archai-collaboration",
    }
  )
);
