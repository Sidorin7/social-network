import Link from "next/link";
import { Post, User } from "@prisma/client";

export type PostWithAuthor = Post & { author: Pick<User, "name"> };

export function PostCard({ post }: { post: PostWithAuthor }) {
  const authorName = post.author.name ?? "Неизвестный автор";
  const initial = authorName.charAt(0).toUpperCase();

  return (
    <article className="border-b border-cloud pb-8">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cloud text-sm font-medium text-ink">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {authorName}
          </p>
          <p className="text-xs text-muted-foreground">
            {post.createdAt.toLocaleDateString("ru-RU")}
          </p>
        </div>
      </div>

      <Link href={`/posts/${post.id}`}>
        <p className="whitespace-pre-wrap font-serif text-[19px] leading-[1.2] text-foreground">
          {post.content}
        </p>
      </Link>
    </article>
  );
}
