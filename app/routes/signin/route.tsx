import { X } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useSigninStore } from "~/features/signin/store";
import { SignInForm } from "./components/signin-form";

export default function SignIn() {
  const navigate = useNavigate();

  const isOpen = useSigninStore((state) => state.signInOpen);

  const onClose = () => {
    navigate("/");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-visible rounded-none sm:rounded-lg [&>button]:hidden">
        <DialogHeader className="bg-sky-300 p-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-white text-xl font-bold">
            SIGN IN
          </DialogTitle>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-0 h-auto hover:bg-sky-600"
          >
            <X className="w-6 h-6 text-white" />
          </Button>
        </DialogHeader>
        <SignInForm />
      </DialogContent>
    </Dialog>
  );
}
