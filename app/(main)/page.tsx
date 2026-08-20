import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { CreatePostCard } from "@/components/create-post-card";
import { GuestCtaCard } from "@/components/guest-cta-card";

export default async function FeedPage() {
  const session = await auth();
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div className="flex flex-col gap-4">
      {session?.user ? <CreatePostCard /> : <GuestCtaCard />}

      {posts.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Пока нет постов
        </p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
