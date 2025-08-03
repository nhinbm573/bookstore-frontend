import { create } from "zustand";

interface CategoriesState {
  activeCategory: string | null;
  onChangeCategory: (
    category: string | null,
    navigate: (to: string) => void,
    searchParams?: string,
  ) => void;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  activeCategory: "All Categories",
  onChangeCategory: (category, navigate, searchParams) => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(
        searchParams || window.location.search,
      );
      params.set("page", "1");
      navigate(`?${params.toString()}`);
    }
    set({ activeCategory: category });
  },
}));
