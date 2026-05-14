import type { IncomingMessage } from "http";

/**
 * Gốc URL nội bộ cho getServerSideProps (gọi API cùng host, hoạt động trên Vercel).
 */
export function getApiBaseFromRequest(req: IncomingMessage): string {
  const host = req.headers.host ?? "localhost:3000";
  const forwarded = req.headers["x-forwarded-proto"] as string | undefined;
  const proto = forwarded ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
