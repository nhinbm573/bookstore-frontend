import { create } from "zustand";

interface BooksState {
  searchKeyword: string;
  onChangeSearchKeyword: (keyword: string) => void;
}

export const useBooksStore = create<BooksState>((set) => ({
  searchKeyword: "",
  onChangeSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}));
