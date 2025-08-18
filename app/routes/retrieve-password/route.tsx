import { X } from "lucide-react";

import { redirect, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useAuthStore } from "~/features/auth/store";
import { useRetrievePasswordStore } from "~/features/retrieve-password/store";
import { RetrievePasswordForm } from "./retrieve-password-form";
import { RetrievePasswordActivation } from "./retrieve-password-activation";

export async function clientLoader() {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  if (isAuthenticated) {
    return redirect("/");
  }
}

export default function RetrievePassword() {
  const navigate = useNavigate();

  const isOpen = useRetrievePasswordStore(
    (state) => state.retrievePasswordOpen,
  );
  const showActivation = useRetrievePasswordStore(
    (state) => state.showActivation,
  );

  const onClose = () => {
    navigate("/");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-none sm:rounded-lg [&>button]:hidden">
        <DialogHeader className="bg-sky-300 p-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-white text-xl font-bold">
            RETRIEVE PASSWORD
          </DialogTitle>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-0 h-auto hover:bg-sky-600"
          >
            <X className="w-6 h-6 text-white" />
          </Button>
        </DialogHeader>
        {!showActivation ? (
          <RetrievePasswordForm />
        ) : (
          <RetrievePasswordActivation />
        )}
      </DialogContent>
    </Dialog>
  );
}
