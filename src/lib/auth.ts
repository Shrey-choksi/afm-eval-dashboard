export const SESSION_COOKIE = "afm-session";

export function validateCredentials(email: string, password: string) {
  const validEmail = process.env.AUTH_EMAIL || "admin@admin.com";
  const validPassword = process.env.AUTH_PASSWORD || "admin123";

  if (email.toLowerCase() === validEmail.toLowerCase() && password === validPassword) {
    return { email: validEmail, name: "Admin", role: "Admin" };
  }

  return null;
}
