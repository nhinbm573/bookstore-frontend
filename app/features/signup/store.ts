import { create } from "zustand";

interface SignUpState {
  signUpOpen: boolean;
  showActivation: boolean;
  userEmail: string;
  userFullName: string;
  onChangeSignUpOpen: () => void;
  setShowActivation: (show: boolean) => void;
  setUserEmail: (email: string) => void;
  handleSignUpSuccess: ({
    email,
    fullName,
  }: {
    email: string;
    fullName: string;
  }) => void;
  resetSignUpState: () => void;
}

export const useSignupStore = create<SignUpState>((set) => ({
  signUpOpen: true,
  showActivation: false,
  userEmail: "",
  userFullName: "",
  onChangeSignUpOpen: () => {
    set((state) => ({
      signUpOpen: !state.signUpOpen,
    }));
  },
  setShowActivation: (show) => set({ showActivation: show }),
  setUserEmail: (email) => set({ userEmail: email }),
  handleSignUpSuccess: ({ email, fullName }) => {
    set({
      userEmail: email,
      userFullName: fullName,
      showActivation: true,
    });
  },
  resetSignUpState: () => {
    set({
      showActivation: false,
      userFullName: "",
      userEmail: "",
    });
  },
}));
