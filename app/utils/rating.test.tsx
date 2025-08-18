import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { renderStars } from "./rating";

describe("renderStars", () => {
  describe("when there are no ratings", () => {
    it("should return 5 empty stars when totalRatingCount is 0", () => {
      const stars = renderStars(0, 0);
      expect(stars).toHaveLength(5);

      const { container } = render(<>{stars}</>);
      const emptyStars = container.querySelectorAll(".text-gray-300");
      expect(emptyStars).toHaveLength(5);
    });

    it("should return 5 empty stars when rating calculates to 0", () => {
      const stars = renderStars(0, 10);
      expect(stars).toHaveLength(5);

      const { container } = render(<>{stars}</>);
      const emptyStars = container.querySelectorAll(".text-gray-300");
      expect(emptyStars).toHaveLength(5);
    });
  });

  describe("when rendering full stars only", () => {
    it("should render 1 full star for rating 1", () => {
      const stars = renderStars(10, 10);
      expect(stars).toHaveLength(5);

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(".fill-orange-400");
      const emptyStars = container.querySelectorAll(".text-gray-300");
      expect(fullStars).toHaveLength(1);
      expect(emptyStars).toHaveLength(4);
    });

    it("should render 3 full stars for rating 3", () => {
      const stars = renderStars(30, 10);
      expect(stars).toHaveLength(5);

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(".fill-orange-400");
      const emptyStars = container.querySelectorAll(".text-gray-300");
      expect(fullStars).toHaveLength(3);
      expect(emptyStars).toHaveLength(2);
    });

    it("should render 5 full stars for rating 5", () => {
      const stars = renderStars(50, 10);
      expect(stars).toHaveLength(5);

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(".fill-orange-400");
      expect(fullStars).toHaveLength(5);
    });
  });

  describe("when rendering half stars", () => {
    it("should render half star for rating 0.5", () => {
      const stars = renderStars(5, 10); // 5/10 = 0.5
      expect(stars).toHaveLength(5);

      const { container } = render(<>{stars}</>);
      const halfStarContainer = container.querySelector(".relative.w-4.h-4");
      expect(halfStarContainer).toBeTruthy();

      const halfStarOverlay = container.querySelector(".w-1\\/2");
      expect(halfStarOverlay).toBeTruthy();
    });

    it("should render 2 full stars and 1 half star for rating 2.5", () => {
      const stars = renderStars(25, 10);
      expect(stars).toHaveLength(5);

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(".fill-orange-400");
      const halfStarContainer = container.querySelector(".relative.w-4.h-4");
      const emptyStars = container.querySelectorAll(".text-gray-300");

      expect(fullStars).toHaveLength(3);
      expect(halfStarContainer).toBeTruthy();
      expect(emptyStars).toHaveLength(3); // 2 empty + 1 base of half star
    });

    it("should render 4 full stars and 1 half star for rating 4.5", () => {
      const stars = renderStars(45, 10); // 45/10 = 4.5
      expect(stars).toHaveLength(5);

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(".fill-orange-400");
      const halfStarContainer = container.querySelector(".relative.w-4.h-4");

      expect(fullStars).toHaveLength(5); // 4 full + 1 in half star overlay
      expect(halfStarContainer).toBeTruthy();
    });
  });

  describe("rounding behavior", () => {
    it("should round 2.3 to 2.5 (half star)", () => {
      const stars = renderStars(23, 10); // 23/10 = 2.3 -> rounds to 2.5

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(
        "svg.fill-orange-400:not(.relative svg)",
      );
      const halfStarContainer = container.querySelector(".relative.w-4.h-4");

      expect(fullStars).toHaveLength(2);
      expect(halfStarContainer).toBeTruthy();
    });

    it("should round 2.7 to 2.5 (half star)", () => {
      const stars = renderStars(27, 10);

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(
        "svg.fill-orange-400:not(.relative svg)",
      );
      const halfStarContainer = container.querySelector(".relative.w-4.h-4");

      expect(fullStars).toHaveLength(2);
      expect(halfStarContainer).toBeTruthy();
    });

    it("should round 2.8 to 3 (full stars)", () => {
      const stars = renderStars(28, 10);

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(".fill-orange-400");
      const halfStarContainer = container.querySelector(".relative.w-4.h-4");

      expect(fullStars).toHaveLength(3);
      expect(halfStarContainer).toBeFalsy();
    });

    it("should round 2.2 to 2 (full stars)", () => {
      const stars = renderStars(22, 10);

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(".fill-orange-400");
      const halfStarContainer = container.querySelector(".relative.w-4.h-4");

      expect(fullStars).toHaveLength(2);
      expect(halfStarContainer).toBeFalsy();
    });
  });

  describe("edge cases", () => {
    it("should handle very large numbers", () => {
      const stars = renderStars(10000, 2500);
      expect(stars).toHaveLength(5);

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(".fill-orange-400");
      expect(fullStars).toHaveLength(4);
    });

    it("should handle decimal inputs that result in half stars", () => {
      const stars = renderStars(7.5, 2);
      expect(stars).toHaveLength(5);

      const { container } = render(<>{stars}</>);
      const fullStars = container.querySelectorAll(".fill-orange-400");
      expect(fullStars).toHaveLength(4);
    });
  });
});
