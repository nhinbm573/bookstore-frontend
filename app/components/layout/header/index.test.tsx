import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { Header } from "./index";
import { BrowserRouter } from "react-router";
import { useScreenSize } from "hooks/use-screen-size";
import userEvent from "@testing-library/user-event";

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

describe("Header", () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useScreenSize).mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("basic rendering", () => {
    it("should render logo and brand name", () => {
      renderHeader();

      expect(screen.getByText("In Betweener")).toBeInTheDocument();
      const logo = screen.getByTestId("header-logo");
      expect(logo).toBeInTheDocument();
    });

    it("should render search bar on desktop", () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText("Search...");
      expect(searchInput).toBeInTheDocument();
      expect(screen.getByText("Go")).toBeInTheDocument();
    });

    it("should render category selector on desktop", () => {
      renderHeader();

      const categorySelect = screen.getByRole("combobox");
      expect(categorySelect).toBeInTheDocument();

      const defaultValue = screen.getByTestId("select-value");
      expect(defaultValue).toBeInTheDocument();
      expect(defaultValue).toHaveTextContent("All Categories");
    });

    it("should hide category selector on tablet and mobile", () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: true,
        isTablet: true,
        isDesktop: false,
      });
      renderHeader();

      const categorySelect = screen.queryByRole("combobox");
      expect(categorySelect).not.toBeInTheDocument();
    });

    it("should render shopping cart with badge", () => {
      renderHeader();

      const cart = screen.getByTestId("header-cart");
      expect(cart).toBeInTheDocument();
      expect(screen.getByText("13")).toBeInTheDocument();
    });

    it("should render sign in button on desktop and tablet", () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: true,
      });
      renderHeader();

      expect(screen.getByText("SIGN IN")).toBeInTheDocument();
    });
  });

  describe("search functionality", () => {
    it("should handle search input change", () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText(
        "Search...",
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: "test book" } });

      expect(searchInput.value).toBe("test book");
    });

    it("should trigger search on Enter key", () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test book" } });
      fireEvent.keyDown(searchInput, { key: "Enter" });

      expect(mockOnChangeSearchKeyword).toHaveBeenCalledWith("test book");
    });

    it("should trigger search on Go button click", () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test book" } });

      const goButton = screen.getByText("Go");
      fireEvent.click(goButton);

      expect(mockOnChangeSearchKeyword).toHaveBeenCalledWith("test book");
    });

    it("should not trigger search on other keys", () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test" } });
      fireEvent.keyDown(searchInput, { key: "Tab" });

      expect(mockOnChangeSearchKeyword).not.toHaveBeenCalled();
    });
  });

  describe("category selection", () => {
    it("should display All Categories as default", async () => {
      renderHeader();

      const categoryTrigger = screen.getByRole("combobox");
      expect(categoryTrigger).toHaveTextContent("All Categories");
    });

    it("should handle category change", async () => {
      renderHeader();

      const categoryTrigger = screen.getByRole("combobox");
      fireEvent.click(categoryTrigger);

      await waitFor(() => {
        const fictionOption = screen.getByText("Fiction");
        fireEvent.click(fictionOption);
      });

      expect(mockOnChangeCategory).toHaveBeenCalledWith(
        "Fiction",
        mockNavigate,
        "",
      );
    });
  });

  describe("responsive behavior", () => {
    it("should hide search and categories on mobile", async () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
      renderHeader();

      expect(
        screen.queryByPlaceholderText("Search..."),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("header-category-select"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("SIGN IN")).not.toBeInTheDocument();
    });

    it("should show dropdown menu on mobile/tablet", async () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: true,
        isTablet: true,
        isDesktop: false,
      });
      renderHeader();

      const dropdownMenu = screen.getByTestId("dropdown-menu-trigger");
      expect(dropdownMenu).toBeInTheDocument();
    });

    it("should hide category selector on tablet but show search", async () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
      });
      renderHeader();

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      const categoryTrigger = screen.queryByRole("combobox");
      expect(categoryTrigger).not.toBeInTheDocument();
    });

    it("should not show dropdown menu on desktop", () => {
      renderHeader();

      expect(
        screen.queryByTestId("header-dropdown-menu"),
      ).not.toBeInTheDocument();
    });
  });

  describe("dropdown menu", () => {
    it("should open and close dropdown menu", async () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });

      const user = userEvent.setup();

      renderHeader();

      const dropdownMenu = screen.getByTestId("dropdown-menu-trigger");
      expect(dropdownMenu).toBeInTheDocument();

      await user.click(dropdownMenu);
      await waitFor(() => {
        expect(dropdownMenu).toHaveAttribute("data-state", "open");
      });
    });
  });
});
