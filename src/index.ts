import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

// Veritabanı bağlantısı (Cloudflare D1)
const db = (c: any) => c.env.DB;

// Zod ile Post doğrulama şeması
const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

// CREATE - Yeni bir post ekle
app.post("/posts", async (c) => {
  const body = await c.req.json();

  // Veriyi doğrula
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400);
  }

  // SQL sorgusu ile post ekle
  const { title, content } = parsed.data;
  await db(c)
    .prepare(`INSERT INTO posts (title, content) VALUES (?, ?)`)
    .bind(title, content)
    .run();

  return c.json({ message: "Post created successfully" });
});

// READ - Tüm postları getir
app.get("/posts", async (c) => {
  const { results } = await db(c).prepare("SELECT * FROM posts").all();

  return c.json(results);
});

// READ - Tek post getir
app.get("/posts/:id", async (c) => {
  const id = c.req.param("id");
  const post = await db(c)
    .prepare("SELECT * FROM posts WHERE id = ?")
    .bind(id)
    .first();

  if (!post) return c.json({ error: "Post not found" }, 404);

  return c.json(post);
});

// UPDATE - Post güncelle
app.put("/posts/:id", async (c) => {
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
app.delete("/posts/:id", async (c) => {
  const id = c.req.param("id");
  await db(c).prepare("DELETE FROM posts WHERE id = ?").bind(id).run();

  return c.json({ message: "Post deleted successfully" });
});

export default app;
