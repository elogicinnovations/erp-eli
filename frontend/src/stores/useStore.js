import create from "zustand";

const useStore = create((set) => ({
  showSidebar: false,
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
  closeSidebar: () => set({ showSidebar: false }),
}));

export default useStore;
