import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Navigation } from "./index";
import { BrowserRouter } from "react-router";
import { useScreenSize } from "hooks/use-screen-size";
import { DropdownMenu } from "~/components/ui/dropdown-menu";

const mockNavigate = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, vi.fn()],
  };
});

vi.mock("hooks/use-screen-size", () => ({
  useScreenSize: vi.fn(),
}));

vi.mock("~/features/categories/api", () => ({
  useCategories: vi.fn(() => ({
    data: [
      { id: 1, name: "Fiction" },
      { id: 2, name: "Non-Fiction" },
      { id: 3, name: "Science" },
    ],
  })),
}));

const mockOnChangeSearchKeyword = vi.fn();
const mockOnChangeCategory = vi.fn();

vi.mock("~/features/books/store", () => ({
  useBooksStore: vi.fn((selector) => {
    const state = {
      onChangeSearchKeyword: mockOnChangeSearchKeyword,
    };
    return selector(state);
  }),
}));

vi.mock("~/features/categories/store", () => ({
  useCategoriesStore: vi.fn((selector) => {
    const state = {
      activeCategory: null,
      onChangeCategory: mockOnChangeCategory,
    };
    return selector(state);
  }),
}));

describe("Navigation", () => {
  const mockOnClose = vi.fn();

  const renderNavigation = () => {
    return render(
      <BrowserRouter>
        <DropdownMenu open={true}>
          <Navigation onClose={mockOnClose} />
        </DropdownMenu>
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useScreenSize).mockReturnValue({
      isMobile: true,
      isTablet: true,
      isDesktop: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("basic rendering", () => {
    it("should render BROWSE section", () => {
      renderNavigation();

      expect(screen.getByText("BROWSE")).toBeInTheDocument();
    });

    it("should render All Categories button", () => {
      renderNavigation();

      expect(
        screen.getByRole("button", { name: "All Categories" }),
      ).toBeInTheDocument();
    });

    it("should render category buttons", () => {
      renderNavigation();

      expect(
        screen.getByRole("button", { name: "Fiction" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Non-Fiction" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Science" }),
      ).toBeInTheDocument();
    });
  });

  describe("mobile-specific rendering", () => {
    it("should show search bar on mobile", async () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
      renderNavigation();

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("should show GUEST USER section on mobile", async () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });

      renderNavigation();

      expect(screen.getByText("GUEST USER")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Sign in" }),
      ).toBeInTheDocument();
    });
  });

  describe("search functionality", () => {
    it("should handle search input change on mobile", async () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
      renderNavigation();

      const searchInput = screen.getByPlaceholderText(
        "Search...",
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: "test book" } });

      expect(searchInput.value).toBe("test book");
    });

    it("should trigger search and close on Enter key", async () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });

      renderNavigation();

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test book" } });
      fireEvent.keyDown(searchInput, { key: "Enter" });

      expect(mockOnChangeSearchKeyword).toHaveBeenCalledWith("test book");
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should not trigger search on other keys", async () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });

      renderNavigation();

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test" } });
      fireEvent.keyDown(searchInput, { key: "Tab" });

      expect(mockOnChangeSearchKeyword).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("category selection", () => {
    it("should handle All Categories click", () => {
      renderNavigation();

      const allCategoriesButton = screen.getByRole("button", {
        name: "All Categories",
      });
      fireEvent.click(allCategoriesButton);

      expect(mockOnChangeCategory).toHaveBeenCalledWith(
        "All Categories",
        mockNavigate,
        "",
      );
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should handle specific category click", () => {
      renderNavigation();

      const fictionButton = screen.getByRole("button", { name: "Fiction" });
      fireEvent.click(fictionButton);

      expect(mockOnChangeCategory).toHaveBeenCalledWith(
        "Fiction",
        mockNavigate,
        "",
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("dropdown content properties", () => {
    it("should render with correct styling", () => {
      renderNavigation();

      const dropdownContent = screen.getByTestId("navigation-dropdown-content");
      expect(dropdownContent).toHaveClass(
        "bg-sky-300",
        "shadow-lg",
        "rounded-none",
      );
      expect(dropdownContent).toHaveStyle({ width: "100vw" });
    });
  });
});
