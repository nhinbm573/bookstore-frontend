import { useMutation } from "@tanstack/react-query";
import { signin, signup, googleSignin, signout } from "./services";
import type {
  SigninError,
  SigninRequest,
  SignupRequest,
  GoogleSigninRequest,
} from "./types";
import { toast } from "sonner";
import { formatSignupErrors } from "./signup-error-formatter";
import { AxiosError } from "axios";
import { useSigninStore } from "../signin/store";
import { useAuthStore } from "./store";

export const useSignUp = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => signup(data),
    onError: (error) => {
      const formattedError = formatSignupErrors(error);
      toast.error(formattedError.message);
    },
  });
};

export const useSignIn = () => {
  const setCaptchaRequired = useSigninStore(
    (state) => state.setCaptchaRequired,
  );
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: SigninRequest) => signin(data),
    onError: (error: AxiosError<SigninError>) => {
      if (error.response && error.response.data) {
        if (error.response.data.captchaRequired) {
          setCaptchaRequired(true);
        } else {
          setCaptchaRequired(false);
        }
        toast.error("Signin failed: " + error.response.data.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    },
    onSuccess: (response) => {
      setAuth(response.data.access, response.data.account);
      setCaptchaRequired(false);
      useSigninStore.getState().setCaptchaToken(null);
    },
  });
};

export const useGoogleSignIn = () => {
  const setCaptchaRequired = useSigninStore(
    (state) => state.setCaptchaRequired,
  );
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: GoogleSigninRequest) => googleSignin(data),
    onError: (error: AxiosError<SigninError>) => {
      if (error.response && error.response.data) {
        toast.error("Google signin failed: " + error.response.data.message);
      } else {
        toast.error("An unknown error occurred during Google signin.");
      }
    },
    onSuccess: (response) => {
      setAuth(response.data.access, response.data.account);
      setCaptchaRequired(false);
      useSigninStore.getState().setCaptchaToken(null);
    },
  });
};

export const useSignOut = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => signout(),
    onError: (error: AxiosError) => {
      if (error.response && error.response.data) {
        toast.error("Signout failed. Please try again.");
      } else {
        toast.error("An error occurred during signout.");
      }
    },
    onSuccess: () => {
      clearAuth();
      toast.success("You have been signed out successfully.");
    },
  });
};
