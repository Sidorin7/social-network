import { Suspense } from "react";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { getPosts } from "@/lib/actions/posts";
import { GuestCtaCard } from "@/components/guest-cta-card";
import { InfiniteFeed } from "@/components/infinite-feed";
import { Skeleton } from "@/components/skeleton";
import { PostCardSkeleton } from "@/components/post-card-skeleton";

export default async function FeedPage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-8">
      {!session?.user && <GuestCtaCard />}

      {/*
        Suspense оборачивает только сами данные ленты, а не весь page.tsx —
        специально не используем файловый loading.tsx: он создал бы Suspense-
        границу для ВСЕЙ подветки (main), включая /posts/[id] и /users/[username],
        и там же поймали баг — notFound() перестаёт возвращать статус 404,
        потому что стриминг успевает уйти клиенту как 200 ещё до того, как
        страница узнаёт, что поста не существует.
      */}
      <Suspense fallback={<FeedSkeleton />}>
        <Feed session={session} />
      </Suspense>
    </div>
  );
}

async function Feed({ session }: { session: Session | null }) {
  const { posts, nextCursor } = await getPosts(undefined, session?.user?.id);

  return (
    <InfiniteFeed
      initialPosts={posts}
      initialCursor={nextCursor}
      currentUserId={session?.user?.id}
      canCreate={!!session?.user}
    />
  );
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-32 w-full rounded-xl" />
      {Array.from({ length: 4 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
