"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFollow(targetUserId: string, targetUsername: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Требуется вход в систему" };
  }
  const followerId = session.user.id;

  if (followerId === targetUserId) {
    return { success: false as const, error: "Нельзя подписаться на себя" };
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId: targetUserId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({ data: { followerId, followingId: targetUserId } });
  }

  revalidatePath(`/users/${targetUsername}`);
  return { success: true as const, following: !existing };
}
