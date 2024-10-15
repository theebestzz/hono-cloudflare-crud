import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors";
import { postRoutes } from "./api/postRoutes";

const app = new Hono();

// CORS Middleware'i ekle
app.use("*", corsMiddleware);

// Post rotalarını ekle
app.route("/api", postRoutes);

export default app;
