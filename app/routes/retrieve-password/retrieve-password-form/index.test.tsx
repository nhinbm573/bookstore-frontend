import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RetrievePasswordForm } from "./index";
import { toast } from "sonner";

const mockRetrievePasswordMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const mockHandleRetrievePasswordSuccess = vi.fn();

vi.mock("~/features/auth/api", () => ({
  useRetrievePassword: vi.fn(() => mockRetrievePasswordMutation),
}));

vi.mock("~/features/retrieve-password/store", () => ({
  useRetrievePasswordStore: vi.fn((selector) => {
    const state = {
      handleRetrievePasswordSuccess: mockHandleRetrievePasswordSuccess,
    };
    return selector(state);
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("RetrievePasswordForm", () => {
  const renderRetrievePasswordForm = () => {
    return render(<RetrievePasswordForm />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRetrievePasswordMutation.isPending = false;
  });

  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render email input field", () => {
      renderRetrievePasswordForm();

      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your email"),
      ).toBeInTheDocument();
    });

    it("should render submit button", () => {
      renderRetrievePasswordForm();

      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toBeInTheDocument();
    });

    it("should have submit button disabled initially", () => {
      renderRetrievePasswordForm();

      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("form validation", () => {
    it("should show error for invalid email", async () => {
      renderRetrievePasswordForm();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText("Email Address");
      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
      });
    });

    it("should enable submit button for valid email", async () => {
      renderRetrievePasswordForm();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText("Email Address");
      await user.type(emailInput, "test@example.com");

      await waitFor(() => {
        const submitButton = screen.getByRole("button", { name: /submit/i });
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("form submission", () => {
    const fillValidEmail = async () => {
      const user = userEvent.setup();
      await user.type(
        screen.getByLabelText("Email Address"),
        "test@example.com",
      );
    };

    it("should call retrieve password mutation with correct email on submit", async () => {
      renderRetrievePasswordForm();
      await fillValidEmail();

      mockRetrievePasswordMutation.mutateAsync.mockResolvedValueOnce({});

      const submitButton = screen.getByRole("button", { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRetrievePasswordMutation.mutateAsync).toHaveBeenCalledWith({
          email: "test@example.com",
        });
      });
    });

    it("should call handleRetrievePasswordSuccess after successful submission", async () => {
      renderRetrievePasswordForm();
      await fillValidEmail();

      mockRetrievePasswordMutation.mutateAsync.mockResolvedValueOnce({});

      const submitButton = screen.getByRole("button", { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockHandleRetrievePasswordSuccess).toHaveBeenCalledWith({
          email: "test@example.com",
        });
      });
    });

    it("should show error toast when submission fails", async () => {
      renderRetrievePasswordForm();
      await fillValidEmail();

      const error = new Error("Network error");
      mockRetrievePasswordMutation.mutateAsync.mockRejectedValueOnce(error);

      const submitButton = screen.getByRole("button", { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Failed to retrieve password. Please try again.",
        );
      });
    });

    it("should not call handleRetrievePasswordSuccess when submission fails", async () => {
      renderRetrievePasswordForm();
      await fillValidEmail();

      const error = new Error("Network error");
      mockRetrievePasswordMutation.mutateAsync.mockRejectedValueOnce(error);

      const submitButton = screen.getByRole("button", { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRetrievePasswordMutation.mutateAsync).toHaveBeenCalled();
      });

      expect(mockHandleRetrievePasswordSuccess).not.toHaveBeenCalled();
    });
  });
});
