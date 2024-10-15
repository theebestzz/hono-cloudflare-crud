import { MiddlewareHandler } from "hono";

export const corsMiddleware: MiddlewareHandler = async (c, next) => {
  // CORS başlıklarını ekliyoruz
  c.res.headers.set("Access-Control-Allow-Origin", "*");
  c.res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  c.res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Eğer OPTIONS isteği ise 204 No Content döndür
  if (c.req.method === "OPTIONS") {
    return c.text("", 204);
  }

  // Normal işlemlere devam et
  await next();
};
