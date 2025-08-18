import { create } from "zustand";

interface SignInState {
  signInOpen: boolean;
  onChangeSignInOpen: () => void;
  captchaRequired: boolean;
  setCaptchaRequired: (required: boolean) => void;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  resetSigninState: () => void;
}

export const useSigninStore = create<SignInState>((set) => ({
  signInOpen: true,
  onChangeSignInOpen: () => {
    set((state) => ({
      signInOpen: !state.signInOpen,
    }));
  },
  captchaRequired: false,
  setCaptchaRequired: (required: boolean) => {
    set({ captchaRequired: required });
  },
  captchaToken: null,
  setCaptchaToken: (token: string | null) => {
    set({ captchaToken: token });
  },
  resetSigninState: () => set({ captchaRequired: false, captchaToken: null }),
}));
