"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createCommentSchema } from "@/lib/validations/comments";

export async function getComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: { author: { select: { name: true } } },
  });
}

export async function createComment(
  postId: string,
  values: z.infer<typeof createCommentSchema>
) {
  const parsed = createCommentSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false as const, error: "Некорректные данные" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Требуется вход в систему" };
  }

  const comment = await prisma.comment.create({
    data: {
      content: parsed.data.content,
      postId,
      authorId: session.user.id,
    },
    include: { author: { select: { name: true } } },
  });

  revalidatePath(`/posts/${postId}`);
  return { success: true as const, comment };
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Требуется вход в систему" };
  }

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.authorId !== session.user.id) {
    return { success: false as const, error: "Недостаточно прав" };
  }

  await prisma.comment.delete({ where: { id: commentId } });

  revalidatePath(`/posts/${comment.postId}`);
  return { success: true as const };
}
