import { cookies } from "next/headers";
import crypto from "crypto";

const cookieName = "gibson_admin";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "change-me-in-production";
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export async function isAdmin() {
  const jar = await cookies();
  const value = jar.get(cookieName)?.value;
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  return sign(payload) === signature && payload === "admin";
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

export async function setAdminCookie() {
  const jar = await cookies();
  const payload = "admin";
  jar.set(cookieName, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(cookieName);
}

export function verifyPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "admin123";
  return password === expected;
}
