import { Prisma } from "@prisma/client";

/**
 * Общий набор связанных данных для поста: имя автора (без остальных
 * полей User — см. security-фикс с утечкой hashedPassword), количество
 * лайков и лайк-ли-я-сам (через несуществующий id, если пользователь
 * не залогинен, — тогда массив всегда пустой без if/else в коде).
 */
export function postInclude(currentUserId?: string) {
  return {
    author: { select: { name: true } },
    _count: { select: { likes: true, comments: true } },
    likes: {
      where: { userId: currentUserId ?? "__none__" },
      select: { id: true },
    },
  } satisfies Prisma.PostInclude;
}

export type PostWithAuthor = Prisma.PostGetPayload<{
  include: ReturnType<typeof postInclude>;
}>;
