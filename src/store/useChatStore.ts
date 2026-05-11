"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Requirements } from "@/types/project";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type?: "text" | "plan-preview" | "insight";
}

export interface MemoryChip {
  label: string;
  value: string;
  color: "blue" | "cyan" | "violet" | "emerald" | "amber";
}

interface ChatState {
  messages: ChatMessage[];
  copilotMessages: ChatMessage[];
  requirements: Requirements;
  memoryChips: MemoryChip[];
  customer: { name?: string; email?: string; phone?: string; role?: string };
  chatStep: number;
  isTyping: boolean;
  copilotTyping: boolean;
  requirementsComplete: boolean;

  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  addCopilotMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setRequirements: (req: Requirements) => void;
  updateRequirement: <K extends keyof Requirements>(key: K, value: Requirements[K]) => void;
  updateCustomer: (key: keyof ChatState["customer"], value: string) => void;
  addMemoryChip: (chip: MemoryChip) => void;
  setTyping: (v: boolean) => void;
  setCopilotTyping: (v: boolean) => void;
  nextStep: () => void;
  setRequirementsComplete: (v: boolean) => void;
  resetChat: () => void;
}

const DEFAULT_REQUIREMENTS: Requirements = {
  bedrooms: 3,
  bathrooms: 2,
  budget: 80,
  style: "modern",
  floors: 2,
  plotSqft: 2400,
  hasGarage: false,
  hasBalcony: true,
  hasStudy: false,
  hasPuja: true,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      copilotMessages: [
        {
          id: "sys-0",
          role: "assistant",
          content: "Hi! I'm your Architectural Copilot. Ask me about code compliance, cost optimization, or design feedback on the current floor plan.",
          timestamp: new Date().toISOString()
        }
      ],
      requirements: DEFAULT_REQUIREMENTS,
      memoryChips: [],
      customer: {},
      chatStep: 0,
      isTyping: false,
      copilotTyping: false,
      requirementsComplete: false,

      addMessage: (msg) => {
        const message: ChatMessage = {
          ...msg,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ messages: [...state.messages, message] }));
      },

      addCopilotMessage: (msg) => {
        const message: ChatMessage = {
          ...msg,
          id: `copilot-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ copilotMessages: [...state.copilotMessages, message] }));
      },

      setRequirements: (req) => set({ requirements: req }),

      updateRequirement: (key, value) =>
        set((state) => ({
          requirements: { ...state.requirements, [key]: value },
        })),

      updateCustomer: (key, value) =>
        set((state) => ({
          customer: { ...state.customer, [key]: value },
        })),

      addMemoryChip: (chip) =>
        set((state) => {
          const existing = state.memoryChips.findIndex(c => c.label === chip.label);
          if (existing >= 0) {
            const updated = [...state.memoryChips];
            updated[existing] = chip;
            return { memoryChips: updated };
          }
          return { memoryChips: [...state.memoryChips, chip] };
        }),

      setTyping: (v) => set({ isTyping: v }),
      setCopilotTyping: (v) => set({ copilotTyping: v }),
      nextStep: () => set((state) => ({ chatStep: state.chatStep + 1 })),
      setRequirementsComplete: (v) => set({ requirementsComplete: v }),

      resetChat: () => set({
        messages: [],
        copilotMessages: [],
        requirements: DEFAULT_REQUIREMENTS,
        memoryChips: [],
        customer: {},
        chatStep: 0,
        isTyping: false,
        copilotTyping: false,
        requirementsComplete: false,
      }),
    }),
    {
      name: "archai-chat",
      partialize: (state) => ({
        messages: state.messages,
        copilotMessages: state.copilotMessages,
        requirements: state.requirements,
        memoryChips: state.memoryChips,
        customer: state.customer,
        requirementsComplete: state.requirementsComplete,
      }),
    }
  )
);
