"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleLike(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Требуется вход в систему" };
  }
  const userId = session.user.id;

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { userId, postId } });
  }

  return { success: true as const, liked: !existing };
}
