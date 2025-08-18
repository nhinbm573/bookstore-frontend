import type { Route } from ".react-router/types/app/routes/signup/+types/route";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useSignupStore } from "~/features/signup/store";
import { SignupForm } from "./components/signup-form";
import { AccountActivation } from "./components/account-activation";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BookStore | Homepage" },
    { name: "description", content: "Welcome to BookStore!" },
  ];
}

export default function SignUp() {
  const isOpen = useSignupStore((state) => state.signUpOpen);
  const showActivation = useSignupStore((state) => state.showActivation);
  const resetSignUpState = useSignupStore((state) => state.resetSignUpState);

  const navigate = useNavigate();

  const onClose = () => {
    navigate("/");
  };

  useEffect(() => {
    return () => {
      resetSignUpState();
    };
  }, [resetSignUpState]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-none sm:rounded-lg [&>button]:hidden">
        <DialogHeader className="bg-sky-300 p-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-white text-xl font-bold">
            {showActivation ? "ACCOUNT ACTIVATION" : "SIGN UP"}
          </DialogTitle>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-0 h-auto hover:bg-sky-600"
          >
            <X className="w-6 h-6 text-white" />
          </Button>
        </DialogHeader>
        {showActivation ? <AccountActivation /> : <SignupForm />}
      </DialogContent>
    </Dialog>
  );
}
