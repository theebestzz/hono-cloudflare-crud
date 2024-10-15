import { Hono } from "hono";
import { postSchema } from "../lib/schemas";

const postRoutes = new Hono();

// Veritabanı bağlantısı (Cloudflare D1)
const db = (c: any) => c.env.DB;

// CREATE - Yeni bir post ekle
postRoutes.post("/posts", async (c) => {
  const body = await c.req.json();

  // Veriyi doğrula
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400);
  }

  const { title, content } = parsed.data;
  await db(c)
    .prepare(`INSERT INTO posts (title, content) VALUES (?, ?)`)
    .bind(title, content)
    .run();

  return c.json({ message: "Post created successfully" });
});

// READ - Tüm postları getir
postRoutes.get("/posts", async (c) => {
  const { results } = await db(c).prepare("SELECT * FROM posts").all();
  return c.json(results);
});

// READ - Tek post getir
postRoutes.get("/posts/:id", async (c) => {
  const id = c.req.param("id");
  const post = await db(c)
    .prepare("SELECT * FROM posts WHERE id = ?")
    .bind(id)
    .first();

  if (!post) return c.json({ error: "Post not found" }, 404);

  return c.json(post);
});

// UPDATE - Post güncelle
postRoutes.put("/posts/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400);
  }

  const { title, content } = parsed.data;
  await db(c)
    .prepare(
      "UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
    .bind(title, content, id)
    .run();

  return c.json({ message: "Post updated successfully" });
});

// DELETE - Post sil
postRoutes.delete("/posts/:id", async (c) => {
  const id = c.req.param("id");
  await db(c).prepare("DELETE FROM posts WHERE id = ?").bind(id).run();

  return c.json({ message: "Post deleted successfully" });
});

export { postRoutes };
