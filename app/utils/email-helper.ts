export const openEmailClient = (email?: string) => {
  if (!email) {
    // Fallback to Gmail
    window.open("https://mail.google.com", "_blank");
    return;
  }

  const emailDomain = email.split("@")[1];

  // Map common email domains to their web mail URLs
  const emailProviders: Record<string, string> = {
    "gmail.com": "https://mail.google.com",
    "yahoo.com": "https://mail.yahoo.com",
    "outlook.com": "https://outlook.live.com",
    "hotmail.com": "https://outlook.live.com",
    "live.com": "https://outlook.live.com",
    "msn.com": "https://outlook.live.com",
    "icloud.com": "https://www.icloud.com/mail",
    "me.com": "https://www.icloud.com/mail",
    "mac.com": "https://www.icloud.com/mail",
    "aol.com": "https://mail.aol.com",
    "yandex.com": "https://mail.yandex.com",
    "protonmail.com": "https://mail.protonmail.com",
    "zoho.com": "https://mail.zoho.com",
  };

  // Default to Gmail if domain not found
  const url = emailProviders[emailDomain] || "https://mail.google.com";
  window.open(url, "_blank");
};
