export const SESSION_COOKIE = "ekke_admin";

export function getCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "ekkebar",
  };
}

export function createSessionValue() {
  return process.env.AUTH_SECRET ?? "change-me-in-production";
}

export function isValidSession(value: string | undefined) {
  return value === createSessionValue();
}

export function validateCredentials(username: string, password: string) {
  const { username: expectedUser, password: expectedPass } = getCredentials();
  return username === expectedUser && password === expectedPass;
}
