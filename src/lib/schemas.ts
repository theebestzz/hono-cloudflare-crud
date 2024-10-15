import { z } from "zod";

// Zod ile Post doğrulama şeması
const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export { postSchema };
