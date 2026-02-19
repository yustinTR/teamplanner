import { create } from "zustand";

interface UiState {
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isOnline: true,
  setIsOnline: (online) => set({ isOnline: online }),
}));
