import { auth } from "@/auth";
import { getPosts } from "@/lib/actions/posts";
import { GuestCtaCard } from "@/components/guest-cta-card";
import { InfiniteFeed } from "@/components/infinite-feed";

export default async function FeedPage() {
  const session = await auth();
  const { posts, nextCursor } = await getPosts();

  return (
    <div className="flex flex-col gap-8">
      {!session?.user && <GuestCtaCard />}

      <InfiniteFeed
        initialPosts={posts}
        initialCursor={nextCursor}
        currentUserId={session?.user?.id}
        canCreate={!!session?.user}
      />
    </div>
  );
}
