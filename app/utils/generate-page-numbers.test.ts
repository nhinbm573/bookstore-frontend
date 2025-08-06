import { describe, it, expect } from "vitest";
import { generatePageNumbers } from "./generate-page-numbers";

describe("generatePageNumbers", () => {
  describe("when total pages is 6 or less", () => {
    it("should return all page numbers for 1 page", () => {
      expect(generatePageNumbers(1, 1)).toEqual([1]);
    });

    it("should return all page numbers for 3 pages", () => {
      expect(generatePageNumbers(1, 3)).toEqual([1, 2, 3]);
    });

    it("should return all page numbers for 6 pages", () => {
      expect(generatePageNumbers(3, 6)).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("when total pages is more than 6", () => {
    describe("when current page is at the beginning (1-3)", () => {
      it("should show first 4 pages, ellipsis, and last page for page 1", () => {
        expect(generatePageNumbers(1, 10)).toEqual([1, 2, 3, 4, "...", 10]);
      });

      it("should show first 4 pages, ellipsis, and last page for page 2", () => {
        expect(generatePageNumbers(2, 10)).toEqual([1, 2, 3, 4, "...", 10]);
      });

      it("should show first 4 pages, ellipsis, and last page for page 3", () => {
        expect(generatePageNumbers(3, 10)).toEqual([1, 2, 3, 4, "...", 10]);
      });
    });

    describe("when current page is at the end (last 3 pages)", () => {
      it("should show first page, ellipsis, and last 4 pages for page 8 of 10", () => {
        expect(generatePageNumbers(8, 10)).toEqual([1, "...", 7, 8, 9, 10]);
      });

      it("should show first page, ellipsis, and last 4 pages for page 9 of 10", () => {
        expect(generatePageNumbers(9, 10)).toEqual([1, "...", 7, 8, 9, 10]);
      });

      it("should show first page, ellipsis, and last 4 pages for last page", () => {
        expect(generatePageNumbers(10, 10)).toEqual([1, "...", 7, 8, 9, 10]);
      });
    });

    describe("when current page is in the middle", () => {
      it("should show first, ellipsis, current with neighbors, ellipsis, last for page 5 of 10", () => {
        expect(generatePageNumbers(5, 10)).toEqual([
          1,
          "...",
          4,
          5,
          6,
          "...",
          10,
        ]);
      });

      it("should show first, ellipsis, current with neighbors, ellipsis, last for page 6 of 10", () => {
        expect(generatePageNumbers(6, 10)).toEqual([
          1,
          "...",
          5,
          6,
          7,
          "...",
          10,
        ]);
      });

      it("should work correctly for large page numbers", () => {
        expect(generatePageNumbers(50, 100)).toEqual([
          1,
          "...",
          49,
          50,
          51,
          "...",
          100,
        ]);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle exactly 7 pages with current page at start", () => {
      expect(generatePageNumbers(1, 7)).toEqual([1, 2, 3, 4, "...", 7]);
    });

    it("should handle exactly 7 pages with current page at end", () => {
      expect(generatePageNumbers(7, 7)).toEqual([1, "...", 4, 5, 6, 7]);
    });

    it("should handle exactly 7 pages with current page in middle", () => {
      expect(generatePageNumbers(4, 7)).toEqual([1, "...", 3, 4, 5, "...", 7]);
    });
  });
});
