"use client";

import { useEffect, useRef, useState } from "react";
import { PostCard, type PostWithAuthor } from "@/components/post-card";
import { getPosts } from "@/lib/actions/posts";

export function InfiniteFeed({
  initialPosts,
  initialCursor,
  currentUserId,
}: {
  initialPosts: PostWithAuthor[];
  initialCursor: string | null;
  currentUserId?: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef(cursor);
  const isLoadingRef = useRef(isLoading);
  cursorRef.current = cursor;
  isLoadingRef.current = isLoading;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursorRef.current && !isLoadingRef.current) {
          loadMore();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMore() {
    setIsLoading(true);
    const result = await getPosts(cursorRef.current ?? undefined);
    setPosts((prev) => [...prev, ...result.posts]);
    setCursor(result.nextCursor);
    setIsLoading(false);
  }

  function handleUpdated(postId: string, content: string) {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, content } : p)));
  }

  function handleDeleted(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  if (posts.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">Пока нет постов</p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onUpdated={(content) => handleUpdated(post.id, content)}
          onDeleted={() => handleDeleted(post.id)}
        />
      ))}
      {cursor && <div ref={sentinelRef} aria-hidden className="h-1" />}
      {isLoading && (
        <p className="text-center text-sm text-muted-foreground">Загружаем...</p>
      )}
    </div>
  );
}
