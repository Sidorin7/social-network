"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/lib/validations/posts";

const POSTS_PAGE_SIZE = 10;

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
    include: { author: { select: { name: true } } },
  });

  revalidatePath("/");
  return { success: true, post };
}

export async function getPosts(cursor?: string) {
  const posts = await prisma.post.findMany({
    take: POSTS_PAGE_SIZE,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return {
    posts,
    nextCursor: posts.length === POSTS_PAGE_SIZE ? posts[posts.length - 1].id : null,
  };
}

export async function updatePost(postId: string, values: z.infer<typeof createPostSchema>) {
  const parsed = createPostSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Некорректные данные" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Требуется вход в систему" };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.user.id) {
    return { success: false, error: "Недостаточно прав" };
  }

  await prisma.post.update({
    where: { id: postId },
    data: { content: parsed.data.content },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  return { success: true };
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Требуется вход в систему" };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.user.id) {
    return { success: false, error: "Недостаточно прав" };
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  return { success: true };
}
