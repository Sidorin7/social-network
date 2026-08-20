import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, "Напишите что-нибудь").max(500),
});
