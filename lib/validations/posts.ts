import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа").max(120),
  content: z.string().min(10, "Минимум 10 символов"),
});
