import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PageProps = {
  // В Next.js 15+ params — это Promise, его нужно await-нуть
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <article>
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {post.author.name ?? "Неизвестный автор"} ·{" "}
          {post.createdAt.toLocaleDateString("ru-RU")}
        </p>
        <p className="mt-4 whitespace-pre-wrap">{post.content}</p>
      </article>
    </div>
  );
}
