import { prisma } from "@/lib/prisma";

/**
 * Та же логика, что и backfill в миграции 20260820210155_add_user_username:
 * локальная часть email, только [a-z0-9_], при занятости — числовой суффикс.
 */
export async function generateUniqueUsername(email: string) {
  const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "") || "user";

  let candidate = base;
  let suffix = 1;
  while (
    await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    })
  ) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }

  return candidate;
}
