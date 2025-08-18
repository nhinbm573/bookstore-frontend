import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { FormInputField } from "~/components/common/form-input-field";
import { Form } from "~/components/ui/form";
import { formSchema } from "../../schema";
import { Button } from "~/components/ui/button";
import { Link, useNavigate } from "react-router";
import { Separator } from "~/components/ui/separator";
import { useSignIn, useGoogleSignIn } from "~/features/auth/api";
import { useSigninStore } from "~/features/signin/store";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef } from "react";
import {
  GoogleLogin,
  type GoogleCredentialResponse,
} from "@react-oauth/google";
import { toast } from "sonner";

export function SignInForm() {
  const navigate = useNavigate();
  const signInMutation = useSignIn();
  const googleSignInMutation = useGoogleSignIn();
  const captchaRequired = useSigninStore((state) => state.captchaRequired);
  const captchaToken = useSigninStore((state) => state.captchaToken);
  const setCaptchaToken = useSigninStore((state) => state.setCaptchaToken);
  const resetSigninState = useSigninStore((state) => state.resetSigninState);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload =
        captchaRequired && captchaToken ? { ...values, captchaToken } : values;
      await signInMutation.mutateAsync(payload);
      navigate("/");
    } catch {
      if (recaptchaRef.current && captchaRequired) {
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      }
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleGoogleSigninSuccess = async (
    credentialResponse: GoogleCredentialResponse,
  ) => {
    if (credentialResponse.credential) {
      await googleSignInMutation.mutateAsync({
        credential: credentialResponse.credential,
      });
      navigate("/");
    } else {
      toast.error("Google signin failed: No credential received");
    }
  };

  const handleGoogleSigninError = () => {
    toast.error("Google signin failed: Unable to authenticate with Google");
  };

  useEffect(() => {
    return () => {
      resetSigninState();
    };
  }, [resetSigninState]);

  return (
    <Form {...form}>
      <form className="px-4 pb-6 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormInputField
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="Enter your email"
          />
          <FormInputField
            control={form.control}
            name="password"
            label="Password (min 6 characters)"
            placeholder="Enter your password"
            type="password"
          />
        </div>
        <div className="flex justify-center w-full my-4 text-sm text-blue-600 hover:no-underline cursor-pointer">
          <Link to="/retrieve-password">Forgot your password?</Link>
        </div>

        {captchaRequired && (
          <div className="flex justify-center mb-4 relative z-50">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_SITE_KEY}
              onChange={handleCaptchaChange}
              onExpired={() => handleCaptchaChange(null)}
            />
          </div>
        )}
        <Button
          type="submit"
          className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? "Logging in..." : "Login"}
        </Button>
        <p className="my-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 text-blue-600 hover:no-underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup
          </Button>
        </p>
        <div className="relative my-6 flex items-center">
          <Separator className="flex-1 bg-gray-300" />{" "}
          <span className="mx-4 text-xs uppercase text-gray-500">Or</span>
          <Separator className="flex-1 bg-gray-300" />
        </div>
        <GoogleLogin
          onSuccess={handleGoogleSigninSuccess}
          onError={handleGoogleSigninError}
          data-testid="google-signin"
        />
      </form>
    </Form>
  );
}
