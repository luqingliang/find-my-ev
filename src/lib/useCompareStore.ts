import { create } from "zustand";
import { carMap } from "@/data/cars";

type CompareStore = {
  ids: string[];
  toggleId: (id: string) => void;
  clear: () => void;
  setIds: (ids: string[]) => void;
};

function sanitizeIds(ids: string[]): string[] {
  const unique: string[] = [];
  const seen = new Set<string>();

  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    if (!carMap.has(id)) continue;
    seen.add(id);
    unique.push(id);
    if (unique.length >= 4) break;
  }

  return unique;
}

export const useCompareStore = create<CompareStore>((set) => ({
  ids: [],
  toggleId: (id) =>
    set((state) => {
      if (!carMap.has(id)) {
        return state;
      }
      if (state.ids.includes(id)) {
        return { ids: state.ids.filter((x) => x !== id) };
      }
      if (state.ids.length >= 4) {
        return state;
      }
      return { ids: [...state.ids, id] };
    }),
  clear: () => set({ ids: [] }),
  setIds: (ids) => set({ ids: sanitizeIds(ids) })
}));
