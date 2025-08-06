import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { PaginationControl } from "./index";
import type { Pagination } from "~/types";
import { useScreenSize } from "hooks/use-screen-size";

vi.mock("hooks/use-screen-size", () => ({
  useScreenSize: vi.fn(),
}));

vi.mock("~/utils/generate-page-numbers", () => ({
  generatePageNumbers: vi.fn((current, total) => {
    if (total <= 6) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    }
    return [1, "...", current - 1, current, current + 1, "...", total];
  }),
}));

describe("PaginationControl", () => {
  const mockOnPageChange = vi.fn();
  const mockOnItemsPerPageChange = vi.fn();

  const defaultPagination: Pagination = {
    currentPage: 1,
    totalPages: 10,
    limit: 10,
    totalItems: 100,
    hasNext: true,
    hasPrevious: false,
  };

  const renderPaginationControl = (props: Partial<Pagination> = {}) => {
    const paginationProps = { ...defaultPagination, ...props };
    return render(
      <PaginationControl
        pagination={paginationProps}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useScreenSize).mockReturnValue({
      isMobile: false,
      isTablet: true,
      isDesktop: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("basic rendering", () => {
    it("should render pagination controls", () => {
      renderPaginationControl();

      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Pre")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.getByText("Last")).toBeInTheDocument();
      expect(screen.getByText("Items/page")).toBeInTheDocument();
    });

    it("should render page numbers", () => {
      renderPaginationControl();

      expect(screen.getByTestId("select-page-button-1")).toBeInTheDocument();
      expect(screen.getByTestId("select-page-button-2")).toBeInTheDocument();
      expect(screen.getByTestId("select-page-button-3")).toBeInTheDocument();
      expect(screen.getByTestId("select-page-button-4")).toBeInTheDocument();
      expect(screen.getByTestId("select-page-button-10")).toBeInTheDocument();
    });

    it("should highlight current page", () => {
      const pagination = { ...defaultPagination, currentPage: 3 };
      renderPaginationControl(pagination);

      const currentPageButton = screen.getByRole("button", { name: "3" });
      expect(currentPageButton).toHaveClass("bg-sky-500", "text-white");
    });
  });

  describe("navigation buttons", () => {
    it("should disable First and Pre buttons on first page", () => {
      renderPaginationControl();

      const firstButton = screen.getByText("First");
      const preButton = screen.getByText("Pre");

      expect(firstButton).toBeDisabled();
      expect(preButton).toBeDisabled();
    });

    it("should disable Next and Last buttons on last page", () => {
      const pagination = {
        ...defaultPagination,
        currentPage: 10,
        hasNext: false,
        hasPrev: true,
      };
      renderPaginationControl(pagination);

      const nextButton = screen.getByText("Next");
      const lastButton = screen.getByText("Last");

      expect(nextButton).toBeDisabled();
      expect(lastButton).toBeDisabled();
    });

    it("should call onPageChange with correct page when clicking First", () => {
      const pagination = { ...defaultPagination, currentPage: 5 };
      renderPaginationControl(pagination);

      fireEvent.click(screen.getByText("First"));
      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it("should call onPageChange with previous page when clicking Pre", () => {
      const pagination = { ...defaultPagination, currentPage: 5 };
      renderPaginationControl(pagination);

      fireEvent.click(screen.getByText("Pre"));
      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it("should call onPageChange with next page when clicking Next", () => {
      const pagination = { ...defaultPagination, currentPage: 5 };
      renderPaginationControl(pagination);

      fireEvent.click(screen.getByText("Next"));
      expect(mockOnPageChange).toHaveBeenCalledWith(6);
    });

    it("should call onPageChange with last page when clicking Last", () => {
      const pagination = { ...defaultPagination, currentPage: 5 };
      renderPaginationControl(pagination);

      fireEvent.click(screen.getByText("Last"));
      expect(mockOnPageChange).toHaveBeenCalledWith(10);
    });
  });

  describe("page number buttons", () => {
    it("should call onPageChange when clicking a page number", () => {
      renderPaginationControl();

      fireEvent.click(screen.getByRole("button", { name: "3" }));
      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it("should render ellipsis as non-clickable element", () => {
      const pagination = { ...defaultPagination, currentPage: 5 };
      renderPaginationControl(pagination);

      const ellipses = screen.getAllByText("...");
      ellipses.forEach((ellipsis) => {
        expect(ellipsis.tagName).toBe("SPAN");
        expect(ellipsis).toHaveClass("text-gray-400");
      });
    });
  });

  describe("items per page selector", () => {
    it("should display items per page selector on desktop", () => {
      renderPaginationControl();

      expect(screen.getByText("Items/page")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should hide items per page selector on mobile", () => {
      vi.mocked(useScreenSize).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
      renderPaginationControl();

      expect(screen.queryByText("Items/page")).not.toBeInTheDocument();
    });

    it("should set default value from pagination limit", () => {
      const pagination = { ...defaultPagination, limit: 20 };
      renderPaginationControl(pagination);

      const selectTrigger = screen.getByRole("combobox");
      expect(selectTrigger).toHaveTextContent("20");
    });
  });

  describe("edge cases", () => {
    it("should handle single page pagination", () => {
      const pagination = {
        ...defaultPagination,
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };
      renderPaginationControl(pagination);

      expect(screen.getByText("First")).toBeDisabled();
      expect(screen.getByText("Pre")).toBeDisabled();
      expect(screen.getByText("Next")).toBeDisabled();
      expect(screen.getByText("Last")).toBeDisabled();
      expect(screen.getByRole("button", { name: "1" })).toHaveClass(
        "bg-sky-500",
      );
    });
  });
});
