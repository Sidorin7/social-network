import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";

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
      <PostCard post={post} />
    </div>
  );
}
