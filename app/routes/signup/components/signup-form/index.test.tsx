import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "./index";
import { BrowserRouter } from "react-router";

const mockSignupMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const mockHandleSignupSuccess = vi.fn();

vi.mock("~/features/auth/api", () => ({
  useSignUp: vi.fn(() => mockSignupMutation),
}));

vi.mock("~/features/signup/store", () => ({
  useSignupStore: vi.fn((selector) => {
    const state = {
      handleSignUpSuccess: mockHandleSignupSuccess,
    };
    return selector(state);
  }),
}));

describe("SignupForm", () => {
  const renderSignupForm = () => {
    return render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignupMutation.isPending = false;
    renderSignupForm();
  });

  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render all form fields", () => {
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Password (min 6 characters)"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone No.")).toBeInTheDocument();
      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByText("Birthday (DD/MM/YYYY)")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("DD")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("MM")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("YYYY")).toBeInTheDocument();
    });

    it("should render submit button", () => {
      const submitButton = screen.getByRole("button", { name: /sign up/i });
      expect(submitButton).toBeInTheDocument();
    });

    it("should render submit button as disabled initially", () => {
      const submitButton = screen.getByRole("button", { name: /sign up/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("form validation", () => {
    it("should show error for invalid email", async () => {
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText("Email Address");
      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
      });
    });

    it("should show error for short password", async () => {
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(
        "Password (min 6 characters)",
      );
      await user.type(passwordInput, "12345");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("Password must be at least 6 characters."),
        ).toBeInTheDocument();
      });
    });

    it("should show error when passwords don't match", async () => {
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(
        "Password (min 6 characters)",
      );
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password456");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
      });
    });

    it("should show error for invalid phone number", async () => {
      const user = userEvent.setup();

      const phoneInput = screen.getByLabelText("Phone No.");
      await user.type(phoneInput, "123");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid phone number."),
        ).toBeInTheDocument();
      });
    });

    it("should show error for short full name", async () => {
      const user = userEvent.setup();

      const fullNameInput = screen.getByLabelText("Full Name");
      await user.type(fullNameInput, "A");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Full name is required.")).toBeInTheDocument();
      });
    });

    it("should show error for invalid birth day", async () => {
      const user = userEvent.setup();

      const dayInput = screen.getByPlaceholderText("DD");
      await user.type(dayInput, "32");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid day")).toBeInTheDocument();
      });
    });

    it("should show error for invalid birth month", async () => {
      const user = userEvent.setup();

      const monthInput = screen.getByPlaceholderText("MM");
      await user.type(monthInput, "13");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid month")).toBeInTheDocument();
      });
    });

    it("should show error for invalid birth year", async () => {
      const user = userEvent.setup();

      const yearInput = screen.getByPlaceholderText("YYYY");
      await user.type(yearInput, "abc");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid year")).toBeInTheDocument();
      });
    });

    it("should show error for future birth year", async () => {
      const user = userEvent.setup();

      const yearInput = screen.getByPlaceholderText("YYYY");
      const futureYear = new Date().getFullYear() + 1;
      await user.type(yearInput, futureYear.toString());
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("Birth year cannot be in the future"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("form submission", () => {
    const fillValidFormData = async () => {
      const user = userEvent.setup();

      await user.type(
        screen.getByLabelText("Email Address"),
        "test@example.com",
      );
      await user.type(
        screen.getByLabelText("Password (min 6 characters)"),
        "password123",
      );
      await user.type(screen.getByLabelText("Confirm Password"), "password123");
      await user.type(screen.getByLabelText("Phone No."), "1234567890");
      await user.type(screen.getByLabelText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("DD"), "15");
      await user.type(screen.getByPlaceholderText("MM"), "06");
      await user.type(screen.getByPlaceholderText("YYYY"), "1990");
      // Trigger onBlur on the last field to validate the entire form
      await user.tab();
    };

    it("should enable submit button when form is valid", async () => {
      await fillValidFormData();

      const submitButton = screen.getByRole("button", { name: /sign up/i });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it("should call signup mutation with correct data on submit", async () => {
      await fillValidFormData();

      mockSignupMutation.mutateAsync.mockResolvedValueOnce({});

      const submitButton = screen.getByRole("button", { name: /sign up/i });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignupMutation.mutateAsync).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
          phone: "1234567890",
          fullName: "John Doe",
          birthDay: "15",
          birthMonth: "06",
          birthYear: "1990",
        });
      });
    });

    it("should call handleSignupSuccess after successful signup", async () => {
      await fillValidFormData();

      mockSignupMutation.mutateAsync.mockResolvedValueOnce({});

      const submitButton = screen.getByRole("button", { name: /sign up/i });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockHandleSignupSuccess).toHaveBeenCalledWith({
          email: "test@example.com",
          fullName: "John Doe",
        });
      });
    });

    it("should handle signup error gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      await fillValidFormData();

      const error = new Error("Signup failed");
      mockSignupMutation.mutateAsync.mockRejectedValueOnce(error);

      const submitButton = screen.getByRole("button", { name: /sign up/i });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Signup error:", error);
      });

      expect(mockHandleSignupSuccess).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("form submission - loading states", () => {
    beforeEach(() => {
      cleanup();
      vi.clearAllMocks();
    });

    it("should show loading state during submission", async () => {
      mockSignupMutation.isPending = true;
      renderSignupForm();

      const submitButton = screen.getByRole("button", {
        name: /signing up.../i,
      });
      expect(submitButton).toBeDisabled();
    });

    it("should disable button while form is pending", async () => {
      mockSignupMutation.isPending = true;
      renderSignupForm();

      const fillValidFormData = async () => {
        const user = userEvent.setup();

        await user.type(
          screen.getByLabelText("Email Address"),
          "test@example.com",
        );
        await user.type(
          screen.getByLabelText("Password (min 6 characters)"),
          "password123",
        );
        await user.type(
          screen.getByLabelText("Confirm Password"),
          "password123",
        );
        await user.type(screen.getByLabelText("Phone No."), "1234567890");
        await user.type(screen.getByLabelText("Full Name"), "John Doe");
        await user.type(screen.getByPlaceholderText("DD"), "15");
        await user.type(screen.getByPlaceholderText("MM"), "06");
        await user.type(screen.getByPlaceholderText("YYYY"), "1990");
        await user.tab();
      };

      await fillValidFormData();

      const submitButton = screen.getByRole("button", {
        name: /signing up.../i,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("input field interactions", () => {
    it("should update email field value", async () => {
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(
        "Email Address",
      ) as HTMLInputElement;
      await user.type(emailInput, "test@example.com");

      expect(emailInput.value).toBe("test@example.com");
    });

    it("should mask password field", () => {
      const passwordInput = screen.getByLabelText(
        "Password (min 6 characters)",
      ) as HTMLInputElement;
      expect(passwordInput.type).toBe("password");
    });

    it("should mask confirm password field", () => {
      const confirmPasswordInput = screen.getByLabelText(
        "Confirm Password",
      ) as HTMLInputElement;
      expect(confirmPasswordInput.type).toBe("password");
    });

    it("should set phone input type to tel", () => {
      const phoneInput = screen.getByLabelText("Phone No.") as HTMLInputElement;
      expect(phoneInput.type).toBe("tel");
    });

    it("should limit birth day input to 2 characters", () => {
      const dayInput = screen.getByPlaceholderText("DD") as HTMLInputElement;
      expect(dayInput.maxLength).toBe(2);
    });

    it("should limit birth month input to 2 characters", () => {
      const monthInput = screen.getByPlaceholderText("MM") as HTMLInputElement;
      expect(monthInput.maxLength).toBe(2);
    });

    it("should limit birth year input to 4 characters", () => {
      const yearInput = screen.getByPlaceholderText("YYYY") as HTMLInputElement;
      expect(yearInput.maxLength).toBe(4);
    });
  });

  describe("form reset behavior", () => {
    it("should clear errors when correcting invalid input", async () => {
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText("Email Address");
      await user.type(emailInput, "invalid");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
      });

      await user.clear(emailInput);
      await user.type(emailInput, "valid@example.com");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.queryByText("Invalid email address."),
        ).not.toBeInTheDocument();
      });
    });
  });
});
