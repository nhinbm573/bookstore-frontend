import { create } from "zustand";

interface DialogsState {
  signUpOpen: boolean;
  onChangeSignUpOpen: () => void;
}

export const useDialogsStore = create<DialogsState>((set) => ({
  signUpOpen: true,
  onChangeSignUpOpen: () => {
    set((state) => ({
      signUpOpen: !state.signUpOpen,
    }));
  },
}));
