import Link from "next/link";
import { Post, User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type PostWithAuthor = Post & { author: Pick<User, "name"> };

export function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {post.author.name ?? "Неизвестный автор"} ·{" "}
          {post.createdAt.toLocaleDateString("ru-RU")}
        </p>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
    </Card>
  );
}
