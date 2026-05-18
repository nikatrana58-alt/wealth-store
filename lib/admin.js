const FALLBACK_ADMIN_EMAILS = ["nikatrana58@gmail.com"];

export function getAdminEmails() {
  const configuredEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS;

  if (!configuredEmails) {
    return FALLBACK_ADMIN_EMAILS;
  }

  return configuredEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  if (!email) {
    return false;
  }

  const adminEmails = getAdminEmails();
  return adminEmails.includes("*") || adminEmails.includes(email.toLowerCase());
}
