// Admin auth config. Override via env in production.
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "ms-admin-session-ok";
export const ADMIN_COOKIE = "ms_admin";
