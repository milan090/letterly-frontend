import create from "zustand";

export const useGameStore = create((set) => ({
  gameState: {},
  setGameState: (state) => set({ gameState: state }),
}))