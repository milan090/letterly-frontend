import shortUUID from "short-uuid";
import create from "zustand";
import { persist } from "zustand/middleware";

export const useSessionStore = create(
  persist(
    (set, get) => ({
      sessionID: "",
      setSessionID: (sessionID) => set({ sessionID }),
    }),
    {
      name: "session-storage", // unique name
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
