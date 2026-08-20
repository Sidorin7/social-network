import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";

type PageProps = {
  // В Next.js 15+ params — это Promise, его нужно await-нуть
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <PostCard post={post} currentUserId={session?.user?.id} linkToPost={false} />
    </div>
  );
}
