import * as z from "zod";

export const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().min(6, { message: "Please enter a valid phone number." }),
    fullName: z.string().min(2, { message: "Full name is required." }),
    birthday: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Birthday must be in YYYY-MM-DD format",
      })
      .refine(
        (dateString) => {
          const date = new Date(dateString);
          const [year, month, day] = dateString.split("-").map(Number);
          return (
            date.getFullYear() === year &&
            date.getMonth() + 1 === month &&
            date.getDate() === day
          );
        },
        { message: "Invalid date. Please enter a real date." },
      )
      .refine(
        (dateString) => {
          const [year] = dateString.split("-").map(Number);
          const currentYear = new Date().getFullYear();
          return year <= currentYear;
        },
        { message: "Birth year cannot be in the future" },
      ),
    password: z.object({
      oldPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters." }),
      newPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters." }),
      confirmNewPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters." }),
    }),
  })
  .refine(
    (data) => data.password.newPassword === data.password.confirmNewPassword,
    {
      message: "Passwords do not match.",
      path: ["password", "confirmNewPassword"],
    },
  );
