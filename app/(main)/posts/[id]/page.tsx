import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { postInclude } from "@/lib/posts";
import { getComments } from "@/lib/actions/comments";
import { PostCard } from "@/components/post-card";
import { CommentSection } from "@/components/comment-section";

type PageProps = {
  // В Next.js 15+ params — это Promise, его нужно await-нуть
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  // Пост и комментарии независимы друг от друга — грузим параллельно,
  // а не один за другим (каждый round-trip до БД стоит ~200-250ms).
  const [post, comments] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: postInclude(session?.user?.id),
    }),
    getComments(id),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <PostCard post={post} currentUserId={session?.user?.id} linkToPost={false} />
      <CommentSection
        postId={id}
        initialComments={comments}
        currentUserId={session?.user?.id}
      />
    </div>
  );
}
