import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { formSchema } from "../schema";
import { toast } from "sonner";
import { Form } from "~/components/ui/form";
import { FormInputField } from "~/components/common/form-input-field";
import { Button } from "~/components/ui/button";
import { useRetrievePasswordStore } from "~/features/retrieve-password/store";
import { useRetrievePassword } from "~/features/auth/api";

export function RetrievePasswordForm() {
  const handleRetrievePasswordSuccess = useRetrievePasswordStore(
    (state) => state.handleRetrievePasswordSuccess,
  );

  const retrievePasswordMutation = useRetrievePassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { isValid, isDirty },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await retrievePasswordMutation.mutateAsync({
        email: values.email,
      });
      handleRetrievePasswordSuccess({
        email: values.email,
      });
    } catch {
      toast.error("Failed to retrieve password. Please try again.");
    }
  }
  return (
    <Form {...form}>
      <form
        className="space-y-6 px-4 pb-6 pt-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInputField
          control={form.control}
          name="email"
          label="Email Address"
          placeholder="Enter your email"
        />
        <Button
          type="submit"
          className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid || !isDirty}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
