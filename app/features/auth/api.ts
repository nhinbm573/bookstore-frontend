import { useMutation } from "@tanstack/react-query";
import { signup } from "./services";
import type { SignupRequest } from "./types";
import { toast } from "sonner";

export const useSignUp = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => signup(data),
    onError: (error) => {
      toast.error(`Signup failed: ${error.message}`);
    },
  });
};
