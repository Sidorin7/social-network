import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPosts } from "@/lib/actions/posts";
import { InfiniteFeed } from "@/components/infinite-feed";
import { FollowButton } from "@/components/follow-button";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      _count: { select: { posts: true, followedBy: true, following: true } },
      followedBy: {
        where: { followerId: session?.user?.id ?? "__none__" },
        select: { id: true },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === user.id;
  const { posts, nextCursor } = await getPosts(undefined, session?.user?.id, user.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-xl font-medium text-foreground">
              {(user.name ?? user.username).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-medium text-foreground">
                {user.name ?? user.username}
              </h1>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          {!isOwnProfile && (
            <FollowButton
              targetUserId={user.id}
              targetUsername={user.username}
              initialFollowing={user.followedBy.length > 0}
              isAuthenticated={!!session?.user}
            />
          )}
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{user._count.posts}</span>{" "}
            постов
          </span>
          <span>
            <span className="font-semibold text-foreground">
              {user._count.followedBy}
            </span>{" "}
            подписчиков
          </span>
          <span>
            <span className="font-semibold text-foreground">{user._count.following}</span>{" "}
            подписок
          </span>
        </div>
      </div>

      <InfiniteFeed
        initialPosts={posts}
        initialCursor={nextCursor}
        currentUserId={session?.user?.id}
        canCreate={false}
        authorId={user.id}
        emptyMessage="У этого пользователя пока нет постов"
      />
    </div>
  );
}
