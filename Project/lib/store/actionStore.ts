import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Insight } from "@/lib/utils/insightsGenerator";

const getUserActionStorageKey = () => {
  if (typeof window === "undefined") return "action-store";
  const userEmail = localStorage.getItem("profectia_user_email");
  return userEmail ? `action-store-${userEmail}` : "action-store";
};

interface ActionStore {
  actions: Insight[];
  setActions: (actions: Insight[]) => void;
  removeAction: (id: string) => void;
  clearActions: () => void;
}

export const useActionStore = create<ActionStore>()(
  persist(
    (set) => ({
      actions: [],
      setActions: (actions) => set({ actions }),
      removeAction: (id) =>
        set((state) => ({
          actions: state.actions.filter((action) => action.id !== id),
        })),
      clearActions: () => set({ actions: [] }),
    }),
    {
      name: "action-store",
      storage: {
        getItem: () => {
          if (typeof window === "undefined") return null;
          const key = getUserActionStorageKey();
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: (_, value) => {
          if (typeof window === "undefined") return;
          const key = getUserActionStorageKey();
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: () => {
          if (typeof window === "undefined") return;
          const key = getUserActionStorageKey();
          localStorage.removeItem(key);
        },
      },
    },
  ),
);
