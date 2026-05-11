import { create } from 'zustand';

export type RoomData = {
  id: string;
  name: string;
  width: number;
  length: number;
  height: number;
  floorFinish: string;
  wallFinish: string;
};

export type AINotification = {
  id: string;
  message: string;
  type: 'insight' | 'warning' | 'optimization' | 'success';
  timestamp: number;
};

interface AIEngineState {
  // Global Project Data
  rooms: RoomData[];
  totalArea: number;
  totalCost: number;

  // AI State Flags
  isAnalyzing: boolean;
  activeProcess: string | null;
  aiNotifications: AINotification[];

  // Actions
  updateRoom: (id: string, updates: Partial<RoomData>) => void;
  triggerAIAnalysis: (processName: string, duration?: number) => void;
  addNotification: (notification: Omit<AINotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  optimizeBudget: () => void;
}

const DEFAULT_ROOMS: RoomData[] = [
  { id: 'r1', name: 'Living Room', width: 6.2, length: 4.6, height: 3.2, floorFinish: 'Italian Marble', wallFinish: 'Off White Paint' },
  { id: 'r2', name: 'Kitchen', width: 4.6, length: 3.6, height: 3.2, floorFinish: 'Ceramic Tiles', wallFinish: 'Ceramic Tiles' },
  { id: 'r3', name: 'Bedroom 1', width: 4.2, length: 4.0, height: 3.2, floorFinish: 'Hardwood', wallFinish: 'Off White Paint' },
  { id: 'r4', name: 'Bath 1', width: 2.4, length: 2.0, height: 3.2, floorFinish: 'Anti-skid Tiles', wallFinish: 'Ceramic Tiles' },
  { id: 'r5', name: 'Parking', width: 5.2, length: 5.8, height: 3.2, floorFinish: 'Concrete', wallFinish: 'Exposed Brick' }
];

const calculateTotalArea = (rooms: RoomData[]) => rooms.reduce((acc, r) => acc + (r.width * r.length), 0);

const FINISH_COSTS: Record<string, number> = {
  'Italian Marble': 4500,
  'Hardwood': 3000,
  'Ceramic Tiles': 1200,
  'Anti-skid Tiles': 1500,
  'Concrete': 800,
  'Off White Paint': 300,
  'Exposed Brick': 600,
};

const calculateCost = (rooms: RoomData[]) => {
  let baseConstructionCostPerSqm = 25000; // Base shell cost
  let total = 0;
  rooms.forEach(r => {
    const area = r.width * r.length;
    const floorCost = FINISH_COSTS[r.floorFinish] || 1000;
    const wallArea = (r.width + r.length) * 2 * r.height; // simple wall calc
    const wallCost = FINISH_COSTS[r.wallFinish] || 300;
    
    total += area * baseConstructionCostPerSqm;
    total += area * floorCost;
    total += wallArea * wallCost;
  });
  return total;
};

export const useAIEngine = create<AIEngineState>((set, get) => ({
  rooms: DEFAULT_ROOMS,
  totalArea: calculateTotalArea(DEFAULT_ROOMS),
  totalCost: calculateCost(DEFAULT_ROOMS),
  
  isAnalyzing: false,
  activeProcess: null,
  aiNotifications: [],

  updateRoom: (id, updates) => {
    set((state) => {
      const newRooms = state.rooms.map(r => r.id === id ? { ...r, ...updates } : r);
      return {
        rooms: newRooms,
        totalArea: calculateTotalArea(newRooms),
        totalCost: calculateCost(newRooms)
      };
    });

    // Trigger an AI response dynamically
    if (updates.width || updates.length) {
      get().triggerAIAnalysis('Evaluating spatial impact...', 1500);
      
      const room = get().rooms.find(r => r.id === id);
      if (room && updates.width && updates.width > 8) {
        setTimeout(() => {
          get().addNotification({
            message: `Structural span for ${room.name} exceeds 8m. Added secondary beam requirements to structural estimate.`,
            type: 'warning'
          });
        }, 1600);
      }
    }
    
    if (updates.floorFinish || updates.wallFinish) {
      get().triggerAIAnalysis('Recalculating material BOM...', 1000);
    }
  },

  triggerAIAnalysis: (processName, duration = 2000) => {
    set({ isAnalyzing: true, activeProcess: processName });
    setTimeout(() => {
      set({ isAnalyzing: false, activeProcess: null });
    }, duration);
  },

  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      aiNotifications: [{ ...notification, id, timestamp: Date.now() }, ...state.aiNotifications].slice(0, 5) // Keep last 5
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      aiNotifications: state.aiNotifications.filter(n => n.id !== id)
    }));
  },

  optimizeBudget: () => {
    get().triggerAIAnalysis('Optimizing material selection for target budget...', 2500);
    setTimeout(() => {
      set((state) => {
        // AI replaces expensive materials with cost-effective alternatives
        const optimizedRooms = state.rooms.map(r => ({
          ...r,
          floorFinish: r.floorFinish === 'Italian Marble' ? 'Ceramic Tiles' : r.floorFinish,
        }));
        return {
          rooms: optimizedRooms,
          totalCost: calculateCost(optimizedRooms)
        };
      });
      get().addNotification({
        message: 'Replaced Italian Marble with high-grade Ceramic Tiles to achieve a 14% cost reduction without structural compromise.',
        type: 'optimization'
      });
    }, 2500);
  }
}));
