import { create } from "zustand";

interface RetrievePasswordState {
  retrievePasswordOpen: boolean;
  showActivation: boolean;
  email: string;
  onChangeRetrievePasswordOpen: () => void;
  setShowActivation: (show: boolean) => void;
  handleRetrievePasswordSuccess: ({ email }: { email: string }) => void;
  resetRetrievePasswordState: () => void;
}

export const useRetrievePasswordStore = create<RetrievePasswordState>(
  (set) => ({
    retrievePasswordOpen: true,
    showActivation: false,
    email: "",
    onChangeRetrievePasswordOpen: () => {
      set((state) => ({
        retrievePasswordOpen: !state.retrievePasswordOpen,
      }));
    },
    setShowActivation: (show) => set({ showActivation: show }),
    handleRetrievePasswordSuccess: ({ email }) => {
      set({
        showActivation: true,
        email: email,
      });
    },
    resetRetrievePasswordState: () => {
      set({
        showActivation: false,
        email: "",
      });
    },
  }),
);
