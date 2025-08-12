import { useMutation } from "@tanstack/react-query";
import { signup } from "./services";
import type { SignupRequest } from "./types";
import { toast } from "sonner";
import { formatSignupErrors } from "./signup-error-formatter";

export const useSignUp = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => signup(data),
    onError: (error) => {
      const formattedError = formatSignupErrors(error);
      toast.error(formattedError.message);
    },
  });
};
