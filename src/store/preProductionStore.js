import { create } from "zustand";

export const usePreProductionStore = create((set, get) => ({
    fabricAssignData: null,
    yarnAssignData: null,
    sequenceAssignData: null,
    designAssignData: null,

    // Set device ID
    setFabricAssignData: (fabricAssignData) => set({ fabricAssignData }),
    setYarnAssignData: (yarnAssignData) => set({ yarnAssignData }),
    setSequenceAssignData: (sequenceAssignData) => set({ sequenceAssignData }),
    setDesignAssignData: (designAssignData) => set({ designAssignData }),

    // Get device ID
    getFabricAssignData: () => get().fabricAssignData,
    getYarnAssignData: () => get().yarnAssignData,
    getSequenceAssignData: () => get().sequenceAssignData,
    getDesignAssignData: () => get().designAssignData,

    // Clear device ID
    clearPreProductionData: () => set({ fabricAssignData: null, yarnAssignData: null, sequenceAssignData: null, designAssignData: null }),
}));

export default usePreProductionStore;
