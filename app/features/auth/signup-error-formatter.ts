import type { AxiosError } from "axios";

export interface SignupServerError {
  email?: string[];
  password?: string[];
  phone?: string[];
  fullName?: string[];
  birthday?: string[];
  [key: string]: string[] | undefined;
}

export interface SignupFormattedError {
  message: string;
  fieldErrors: Record<string, string>;
}

export function formatSignupErrors(error: unknown): SignupFormattedError {
  if (!isAxiosError(error)) {
    return {
      message: "An unexpected error occurred during signup",
      fieldErrors: {},
    };
  }

  const data = error.response?.data;

  if (!data || typeof data !== "object") {
    return {
      message: error.message || "Signup failed",
      fieldErrors: {},
    };
  }

  const fieldErrors: Record<string, string> = {};
  const errorMessages: string[] = [];

  for (const [field, messages] of Object.entries(data)) {
    if (Array.isArray(messages) && messages.length > 0) {
      const fieldName = formatFieldName(field);
      fieldErrors[field] = messages[0];
      errorMessages.push(`${fieldName}: ${messages.join(", ")}`);
    }
  }

  const message =
    errorMessages.length > 0
      ? "Signup failed:\n" + errorMessages.join("\n")
      : error.message || "Signup failed";

  return {
    message,
    fieldErrors,
  };
}

function formatFieldName(field: string): string {
  const fieldMap: Record<string, string> = {
    email: "Email",
    password: "Password",
    phone: "Phone",
    fullName: "Full Name",
    birthday: "Birthday",
    birthDay: "Birth Day",
    birthMonth: "Birth Month",
    birthYear: "Birth Year",
  };

  return (
    fieldMap[field] ||
    field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")
  );
}

function isAxiosError(error: unknown): error is AxiosError<SignupServerError> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}
