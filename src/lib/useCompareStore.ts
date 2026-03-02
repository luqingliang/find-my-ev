import { create } from "zustand";

type CompareStore = {
  ids: string[];
  toggleId: (id: string) => void;
  clear: () => void;
  setIds: (ids: string[]) => void;
};

export const useCompareStore = create<CompareStore>((set) => ({
  ids: [],
  toggleId: (id) =>
    set((state) => {
      if (state.ids.includes(id)) {
        return { ids: state.ids.filter((x) => x !== id) };
      }
      if (state.ids.length >= 4) {
        return state;
      }
      return { ids: [...state.ids, id] };
    }),
  clear: () => set({ ids: [] }),
  setIds: (ids) => set({ ids: ids.slice(0, 4) })
}));
