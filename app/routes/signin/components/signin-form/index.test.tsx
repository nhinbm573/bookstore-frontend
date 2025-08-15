import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "./index";
import { BrowserRouter } from "react-router";
import { toast } from "sonner";

const mockSignInMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const mockGoogleSignInMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const mockNavigate = vi.fn();
const mockResetSigninState = vi.fn();
const mockSetCaptchaToken = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("~/features/auth/api", () => ({
  useSignIn: vi.fn(() => mockSignInMutation),
  useGoogleSignIn: vi.fn(() => mockGoogleSignInMutation),
}));

vi.mock("~/features/signin/store", () => ({
  useSigninStore: vi.fn((selector) => {
    const state = {
      captchaRequired: false,
      captchaToken: null,
      setCaptchaToken: mockSetCaptchaToken,
      resetSigninState: mockResetSigninState,
    };
    return selector(state);
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("react-google-recaptcha", () => ({
  default: vi.fn(({ onChange, onExpired }) => (
    <div data-testid="recaptcha">
      <button onClick={() => onChange("test-token")}>Captcha Success</button>
      <button onClick={() => onExpired()}>Captcha Expired</button>
    </div>
  )),
}));

vi.mock("@react-oauth/google", () => ({
  GoogleLogin: vi.fn(({ onSuccess, onError, ...props }) => (
    <div data-slot="google-login" {...props}>
      <button
        onClick={() => onSuccess({ credential: "test-credential" })}
        data-slot="google-success"
      >
        Google Success
      </button>
      <button onClick={() => onError()} data-slot="google-error">
        Google Error
      </button>
    </div>
  )),
}));

describe("SignInForm", () => {
  const renderSignInForm = () => {
    return render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInMutation.isPending = false;
    mockGoogleSignInMutation.isPending = false;
  });

  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render all form fields", () => {
      renderSignInForm();

      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Password (min 6 characters)"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your email"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your password"),
      ).toBeInTheDocument();
    });

    it("should render submit button", () => {
      renderSignInForm();

      const submitButton = screen.getByRole("button", { name: /login/i });
      expect(submitButton).toBeInTheDocument();
    });

    it("should render forgot password link", () => {
      renderSignInForm();

      const forgotPasswordLink = screen.getByText("Forgot your password?");
      expect(forgotPasswordLink).toBeInTheDocument();
    });

    it("should render signup link", () => {
      renderSignInForm();

      const signupLink = screen.getByText("Signup");
      expect(signupLink).toBeInTheDocument();
    });

    it("should render Google login", () => {
      renderSignInForm();
      const signinGoogleButton = screen.getByTestId("google-login");
      expect(signinGoogleButton).toBeInTheDocument();
      expect(signinGoogleButton.getAttribute("data-testid")).toBe(
        "google-signin",
      );
    });

    it("should not render captcha when not required", () => {
      renderSignInForm();
      expect(screen.queryByTestId("recaptcha")).not.toBeInTheDocument();
    });
  });

  describe("form validation", () => {
    it("should show error for invalid email", async () => {
      renderSignInForm();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText("Email Address");
      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
      });
    });

    it("should show error for short password", async () => {
      renderSignInForm();
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
    };

    it("should call signin mutation with correct data on submit", async () => {
      renderSignInForm();
      await fillValidFormData();

      mockSignInMutation.mutateAsync.mockResolvedValueOnce({});

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignInMutation.mutateAsync).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });
    });

    it("should navigate to home page after successful signin", async () => {
      renderSignInForm();
      await fillValidFormData();

      mockSignInMutation.mutateAsync.mockResolvedValueOnce({});

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("should handle signin error gracefully", async () => {
      renderSignInForm();
      await fillValidFormData();

      const error = new Error("Signin failed");
      mockSignInMutation.mutateAsync.mockRejectedValueOnce(error);

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignInMutation.mutateAsync).toHaveBeenCalled();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should show loading state during submission", () => {
      mockSignInMutation.isPending = true;
      renderSignInForm();

      const submitButton = screen.getByRole("button", {
        name: /logging in.../i,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Google signin", () => {
    it("should handle Google signin success", async () => {
      renderSignInForm();

      mockGoogleSignInMutation.mutateAsync.mockResolvedValueOnce({});

      const googleSuccessButton = screen.getByTestId("google-success");
      fireEvent.click(googleSuccessButton);

      await waitFor(() => {
        expect(mockGoogleSignInMutation.mutateAsync).toHaveBeenCalledWith({
          credential: "test-credential",
        });
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("should handle Google signin error", () => {
      renderSignInForm();

      const googleErrorButton = screen.getByTestId("google-error");
      fireEvent.click(googleErrorButton);

      expect(toast.error).toHaveBeenCalledWith(
        "Google signin failed: Unable to authenticate with Google",
      );
    });
  });

  describe("navigation", () => {
    it("should navigate to signup page when signup link is clicked", () => {
      renderSignInForm();

      const signupButton = screen.getByText("Signup");
      fireEvent.click(signupButton);

      expect(mockNavigate).toHaveBeenCalledWith("/signup");
    });
  });

  describe("component cleanup", () => {
    it("should reset signin state on unmount", () => {
      const { unmount } = renderSignInForm();

      unmount();

      expect(mockResetSigninState).toHaveBeenCalled();
    });
  });
});
