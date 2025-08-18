import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { openEmailClient } from "./email-helper";

describe("openEmailClient", () => {
  const originalOpen = window.open;
  let mockOpen: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOpen = vi.fn();
    window.open = mockOpen;
  });

  afterEach(() => {
    window.open = originalOpen;
    vi.clearAllMocks();
  });

  describe("when email is not provided", () => {
    it("should open Gmail as fallback", () => {
      openEmailClient();
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open Gmail when email is undefined", () => {
      openEmailClient(undefined);
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open Gmail when email is empty string", () => {
      openEmailClient("");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("when email is provided with known domain", () => {
    it("should open Gmail for gmail.com email", () => {
      openEmailClient("user@gmail.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open Yahoo Mail for yahoo.com email", () => {
      openEmailClient("user@yahoo.com");
      expect(mockOpen).toHaveBeenCalledWith("https://mail.yahoo.com", "_blank");
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open Outlook for outlook.com email", () => {
      openEmailClient("user@outlook.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://outlook.live.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open Outlook for hotmail.com email", () => {
      openEmailClient("user@hotmail.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://outlook.live.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open Outlook for live.com email", () => {
      openEmailClient("user@live.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://outlook.live.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open Outlook for msn.com email", () => {
      openEmailClient("user@msn.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://outlook.live.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open iCloud Mail for icloud.com email", () => {
      openEmailClient("user@icloud.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://www.icloud.com/mail",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open iCloud Mail for me.com email", () => {
      openEmailClient("user@me.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://www.icloud.com/mail",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open iCloud Mail for mac.com email", () => {
      openEmailClient("user@mac.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://www.icloud.com/mail",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open AOL Mail for aol.com email", () => {
      openEmailClient("user@aol.com");
      expect(mockOpen).toHaveBeenCalledWith("https://mail.aol.com", "_blank");
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open Yandex Mail for yandex.com email", () => {
      openEmailClient("user@yandex.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.yandex.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open ProtonMail for protonmail.com email", () => {
      openEmailClient("user@protonmail.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.protonmail.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should open Zoho Mail for zoho.com email", () => {
      openEmailClient("user@zoho.com");
      expect(mockOpen).toHaveBeenCalledWith("https://mail.zoho.com", "_blank");
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("when email is provided with unknown domain", () => {
    it("should default to Gmail for unknown domains", () => {
      openEmailClient("user@example.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should default to Gmail for custom company domains", () => {
      openEmailClient("user@company.org");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should default to Gmail for subdomains of known providers", () => {
      openEmailClient("user@mail.gmail.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should handle email with multiple @ symbols", () => {
      openEmailClient("user@name@gmail.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should handle email with uppercase domain", () => {
      openEmailClient("user@GMAIL.COM");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should handle email with mixed case domain", () => {
      openEmailClient("user@YaHoO.cOm");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should handle email without @ symbol", () => {
      openEmailClient("userexample.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should handle email with special characters", () => {
      openEmailClient("user+tag@gmail.com");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://mail.google.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should handle email with dots in username", () => {
      openEmailClient("first.last@yahoo.com");
      expect(mockOpen).toHaveBeenCalledWith("https://mail.yahoo.com", "_blank");
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("should handle very long email addresses", () => {
      const longEmail = "very.long.email.address.with.many.parts@outlook.com";
      openEmailClient(longEmail);
      expect(mockOpen).toHaveBeenCalledWith(
        "https://outlook.live.com",
        "_blank",
      );
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("window.open behavior", () => {
    it("should always open in new tab with _blank target", () => {
      const testEmails = ["user@gmail.com", "user@unknown.com", undefined, ""];

      testEmails.forEach((email) => {
        mockOpen.mockClear();
        openEmailClient(email);
        expect(mockOpen).toHaveBeenCalledWith(expect.any(String), "_blank");
      });
    });

    it("should only call window.open once per invocation", () => {
      openEmailClient("user@gmail.com");
      expect(mockOpen).toHaveBeenCalledTimes(1);

      mockOpen.mockClear();
      openEmailClient("user@yahoo.com");
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });
  });
});
