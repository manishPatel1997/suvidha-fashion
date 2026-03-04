import { create } from "zustand";

export const usePreProductionStore = create((set, get) => ({
    fabricAssignData: null,
    yarnAssignData: null,
    sequenceAssignData: null,

    // Set device ID
    setFabricAssignData: (fabricAssignData) => set({ fabricAssignData }),
    setYarnAssignData: (yarnAssignData) => set({ yarnAssignData }),
    setSequenceAssignData: (sequenceAssignData) => set({ sequenceAssignData }),

    // Get device ID
    getFabricAssignData: () => get().fabricAssignData,
    getYarnAssignData: () => get().yarnAssignData,
    getSequenceAssignData: () => get().sequenceAssignData,

    // Clear device ID
    clearPreProductionData: () => set({ fabricAssignData: null, yarnAssignData: null, sequenceAssignData: null }),
}));

export default usePreProductionStore;
