import * as z from "zod";

export const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
    phone: z
      .string()
      .min(10, { message: "Please enter a valid phone number." }),
    fullName: z.string().min(2, { message: "Full name is required." }),
    birthDay: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])$/, "Invalid day"),
    birthMonth: z.string().regex(/^(0[1-9]|1[012])$/, "Invalid month"),
    birthYear: z
      .string()
      .regex(/^\d{4}$/, "Invalid year")
      .refine(
        (year) => {
          const currentYear = new Date().getFullYear();
          return parseInt(year, 10) <= currentYear;
        },
        { message: "Birth year cannot be in the future" },
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Path to show the error
  })
  .refine(
    (data) => {
      const { birthDay, birthMonth, birthYear } = data;
      const date = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
      return !isNaN(date.getTime());
    },
    {
      message: "Please enter a valid birth date.",
      path: ["birthYear"],
    },
  );
