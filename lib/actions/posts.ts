"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/lib/validations/posts";

export async function createPost(values: z.infer<typeof createPostSchema>) {
  const parsed = createPostSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Некорректные данные" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Требуется вход в систему" };
  }

  const post = await prisma.post.create({
    data: {
      content: parsed.data.content,
      authorId: session.user.id,
    },
  });

  return { success: true, postId: post.id };
}
