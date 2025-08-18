import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import ActivateRoute, { loader } from "./route";
import { activateAccount } from "~/features/auth/services";
import { toast } from "sonner";

vi.mock("~/features/auth/services", () => ({
  activateAccount: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

const { useLoaderData } = await import("react-router");

describe("ActivateRoute", () => {
  const renderActivateRoute = () => {
    return render(
      <BrowserRouter>
        <ActivateRoute />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("loader function", () => {
    const createLoaderArgs = (
      params: Record<string, string | undefined>,
    ): LoaderFunctionArgs =>
      ({
        params,
        request: new Request("http://localhost:3000"),
        context: {},
      }) as LoaderFunctionArgs;

    it("should return error when uidb64 is missing", async () => {
      const result = await loader(createLoaderArgs({ token: "test-token" }));

      expect(result).toEqual({
        success: false,
        message:
          "Invalid activation link. Please check your email for the correct link.",
        shouldRedirect: true,
      });
    });

    it("should return error when token is missing", async () => {
      const result = await loader(createLoaderArgs({ uidb64: "test-uid" }));

      expect(result).toEqual({
        success: false,
        message:
          "Invalid activation link. Please check your email for the correct link.",
        shouldRedirect: true,
      });
    });

    it("should call activateAccount with correct parameters", async () => {
      const mockResponse = {
        message: "Account activated successfully!",
        status: 200,
      };
      vi.mocked(activateAccount).mockResolvedValueOnce(mockResponse);

      const result = await loader(
        createLoaderArgs({ uidb64: "test-uid", token: "test-token" }),
      );

      expect(activateAccount).toHaveBeenCalledWith({
        uidb64: "test-uid",
        token: "test-token",
      });

      expect(result).toEqual({
        success: true,
        message: "Account activated successfully!",
      });
    });

    it("should use default success message when response has no message", async () => {
      vi.mocked(activateAccount).mockResolvedValueOnce({
        message: "",
        status: 200,
      });

      const result = await loader(
        createLoaderArgs({ uidb64: "test-uid", token: "test-token" }),
      );

      expect(result).toEqual({
        success: true,
        message: "Your account has been successfully activated!",
      });
    });

    it("should handle activation errors properly", async () => {
      const errorMessage = "Token has expired";
      vi.mocked(activateAccount).mockRejectedValueOnce(new Error(errorMessage));

      const result = await loader(
        createLoaderArgs({ uidb64: "test-uid", token: "test-token" }),
      );

      expect(result).toEqual({
        success: false,
        message: errorMessage,
      });
    });

    it("should handle non-Error exceptions", async () => {
      vi.mocked(activateAccount).mockRejectedValueOnce("Unknown error");

      const result = await loader(
        createLoaderArgs({ uidb64: "test-uid", token: "test-token" }),
      );

      expect(result).toEqual({
        success: false,
        message: "Activation failed. The link may be expired or invalid.",
      });
    });
  });

  describe("component rendering - success state", () => {
    beforeEach(() => {
      vi.mocked(useLoaderData).mockReturnValue({
        success: true,
        message: "Your account has been successfully activated!",
      });
      renderActivateRoute();
    });

    it("should render success UI elements", () => {
      expect(screen.getByText("Account Activated!")).toBeInTheDocument();
      expect(
        screen.getByText("Your account has been successfully activated!"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Go to Login" }),
      ).toBeInTheDocument();
    });

    it("should display success icon", () => {
      const successContainer = screen
        .getByText("Account Activated!")
        .closest("div");
      const iconContainer = successContainer?.querySelector(".bg-green-100");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should link to login page", () => {
      const loginLink = screen.getByRole("link", { name: "Go to Login" });
      expect(loginLink).toHaveAttribute("href", "/signin");
    });

    it("should show success toast", async () => {
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Your account has been successfully activated!",
        );
      });
    });
  });

  describe("component rendering - error state", () => {
    beforeEach(() => {
      vi.mocked(useLoaderData).mockReturnValue({
        success: false,
        message: "The activation link has expired.",
      });
      renderActivateRoute();
    });

    it("should render error UI elements", () => {
      expect(screen.getByText("Activation Failed")).toBeInTheDocument();
      expect(
        screen.getByText("The activation link has expired."),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Try Signing Up Again" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Go to Home" }),
      ).toBeInTheDocument();
    });

    it("should display error icon", () => {
      const errorContainer = screen
        .getByText("Activation Failed")
        .closest("div");
      const iconContainer = errorContainer?.querySelector(".bg-red-100");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should link to signup page", () => {
      const signupLink = screen.getByRole("link", {
        name: "Try Signing Up Again",
      });
      expect(signupLink).toHaveAttribute("href", "/signup");
    });

    it("should link to home page", () => {
      const homeLink = screen.getByRole("link", { name: "Go to Home" });
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("should show error toast", async () => {
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "The activation link has expired.",
        );
      });
    });
  });

  describe("component rendering - redirect state", () => {
    beforeEach(() => {
      vi.mocked(useLoaderData).mockReturnValue({
        success: false,
        message:
          "Invalid activation link. Please check your email for the correct link.",
        shouldRedirect: true,
      });
      renderActivateRoute();
    });

    it("should render redirect UI", () => {
      expect(
        screen.getByText(
          "Invalid activation link. Please check your email for the correct link.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Go to Home" }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Activation Failed")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Try Signing Up Again" }),
      ).not.toBeInTheDocument();
    });

    it("should have correct home link in redirect state", () => {
      const homeLink = screen.getByRole("link", { name: "Go to Home" });
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("should show error toast for redirect state", async () => {
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Invalid activation link. Please check your email for the correct link.",
        );
      });
    });
  });

  describe("styling and layout", () => {
    it("should apply correct styles for success state", () => {
      vi.mocked(useLoaderData).mockReturnValue({
        success: true,
        message: "Account activated!",
      });

      renderActivateRoute();

      const loginButton = screen.getByRole("link", { name: "Go to Login" });
      expect(loginButton.className).toContain("bg-orange-500");
      expect(loginButton.className).toContain("text-white");
    });

    it("should apply correct styles for error state", () => {
      vi.mocked(useLoaderData).mockReturnValue({
        success: false,
        message: "Activation failed",
      });

      renderActivateRoute();

      const signupButton = screen.getByRole("link", {
        name: "Try Signing Up Again",
      });
      expect(signupButton.className).toContain("bg-orange-500");
      expect(signupButton.className).toContain("text-white");

      const homeButton = screen.getByRole("link", { name: "Go to Home" });
      expect(homeButton.className).toContain("bg-gray-200");
      expect(homeButton.className).toContain("text-gray-700");
    });

    it("should have centered layout", () => {
      vi.mocked(useLoaderData).mockReturnValue({
        success: true,
        message: "Success",
      });

      const { container } = renderActivateRoute();

      const mainContainer = container.querySelector(
        ".h-full.flex.items-center.justify-center",
      );
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty message gracefully", () => {
      vi.mocked(useLoaderData).mockReturnValue({
        success: true,
        message: "",
      });

      renderActivateRoute();

      expect(screen.getByText("Account Activated!")).toBeInTheDocument();
    });

    it("should handle very long messages", () => {
      const longMessage = "A".repeat(500);
      vi.mocked(useLoaderData).mockReturnValue({
        success: false,
        message: longMessage,
      });

      renderActivateRoute();

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });
});
