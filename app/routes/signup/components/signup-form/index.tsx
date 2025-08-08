import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../schema";
import { FormInputField } from "~/components/common/form-input-field";
import { BirthdayInputField } from "../birthday-input-field";
import { Button } from "~/components/ui/button";

export function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      fullName: "",
      birthDay: "",
      birthMonth: "",
      birthYear: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
        <FormInputField
          control={form.control}
          name="phone"
          label="Phone No."
          placeholder="Enter your phone number"
          type="tel"
        />
        <FormInputField
          control={form.control}
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name"
        />
        <BirthdayInputField control={form.control} />
        <Button
          type="submit"
          className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2"
        >
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
