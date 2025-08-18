import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPassword from "./route";
import { BrowserRouter } from "react-router";
import { toast } from "sonner";

const mockResetPasswordMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const mockNavigate = vi.fn();
const mockParams = { uidb64: "test-uid", token: "test-token" };

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

vi.mock("~/features/auth/api", () => ({
  useResetPassword: vi.fn(() => mockResetPasswordMutation),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ResetPassword", () => {
  const renderResetPassword = () => {
    return render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockResetPasswordMutation.isPending = false;
    mockParams.uidb64 = "test-uid";
    mockParams.token = "test-token";
  });

  afterEach(() => {
    cleanup();
  });

  describe("rendering with valid params", () => {
    it("should render form with password fields when valid params are provided", () => {
      renderResetPassword();

      expect(screen.getByText("Reset your password")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Password (min 6 characters)"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /update password/i }),
      ).toBeInTheDocument();
    });

    it("should have submit button disabled initially", () => {
      renderResetPassword();

      const submitButton = screen.getByRole("button", {
        name: /update password/i,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("rendering with invalid params", () => {
    it("should render error message when uidb64 is missing", () => {
      mockParams.uidb64 = "";
      renderResetPassword();

      expect(
        screen.getByText(
          "Invalid reset link. Please check your email for the correct link.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Go to Home")).toBeInTheDocument();
      expect(screen.queryByText("Reset your password")).not.toBeInTheDocument();
    });

    it("should render error message when token is missing", () => {
      mockParams.token = "";
      renderResetPassword();

      expect(
        screen.getByText(
          "Invalid reset link. Please check your email for the correct link.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Go to Home")).toBeInTheDocument();
      expect(screen.queryByText("Reset your password")).not.toBeInTheDocument();
    });
  });

  describe("form validation", () => {
    it("should show error for short password", async () => {
      renderResetPassword();
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

    it("should show error when passwords do not match", async () => {
      renderResetPassword();
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(
        "Password (min 6 characters)",
      );
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "differentpassword");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
      });
    });

    it("should enable submit button with valid matching passwords", async () => {
      renderResetPassword();
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(
        "Password (min 6 characters)",
      );
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password123");

      await waitFor(() => {
        const submitButton = screen.getByRole("button", {
          name: /update password/i,
        });
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("form submission", () => {
    const fillValidPasswordData = async () => {
      const user = userEvent.setup();

      await user.type(
        screen.getByLabelText("Password (min 6 characters)"),
        "newpassword123",
      );
      await user.type(
        screen.getByLabelText("Confirm Password"),
        "newpassword123",
      );
    };

    it("should call reset password mutation with correct data on submit", async () => {
      renderResetPassword();
      await fillValidPasswordData();

      mockResetPasswordMutation.mutateAsync.mockResolvedValueOnce({});

      const submitButton = screen.getByRole("button", {
        name: /update password/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockResetPasswordMutation.mutateAsync).toHaveBeenCalledWith({
          uidb64: "test-uid",
          token: "test-token",
          newPassword: "newpassword123",
        });
      });
    });

    it("should show success toast and navigate to signin after successful reset", async () => {
      renderResetPassword();
      await fillValidPasswordData();

      mockResetPasswordMutation.mutateAsync.mockResolvedValueOnce({});

      const submitButton = screen.getByRole("button", {
        name: /update password/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Password reset successfully! You can now log in with your new password.",
        );
      });

      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });

    it("should show generic error toast on unknown error", async () => {
      renderResetPassword();
      await fillValidPasswordData();

      const unknownError = new Error("Network error");
      mockResetPasswordMutation.mutateAsync.mockRejectedValueOnce(unknownError);

      const submitButton = screen.getByRole("button", {
        name: /update password/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "An unexpected error occurred. Please try again.",
        );
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
