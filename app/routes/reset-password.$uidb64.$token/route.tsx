import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router";
import type z from "zod";
import { formSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInputField } from "~/components/common/form-input-field";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { useResetPassword } from "~/features/auth/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function ResetPassword() {
  const params = useParams();
  const navigate = useNavigate();
  const resetPassword = useResetPassword();

  const { uidb64, token } = params;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isValid, isDirty },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await resetPassword.mutateAsync({
        uidb64: uidb64!,
        token: token!,
        newPassword: values.password,
      });
      toast.success(
        "Password reset successfully! You can now log in with your new password.",
      );
      navigate("/signin");
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(`Fail to reset password: ${error.response.data.message}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }

  if (!uidb64 || !token) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <p className="text-gray-600 mb-4">
            Invalid reset link. Please check your email for the correct link.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-center mx-auto max-w-sm space-y-6">
      <h1 className="text-xl font-semibold text-center text-gray-900">
        Reset your password
      </h1>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInputField
            control={form.control}
            name="password"
            label="Password (min 6 characters)"
            placeholder="Enter your password"
            type="password"
          />
          <FormInputField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter your password"
            type="password"
          />
          <Button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid || !isDirty}
          >
            Update password
          </Button>
        </form>
      </Form>
    </div>
  );
}
