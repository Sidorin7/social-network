"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleFollow } from "@/lib/actions/follows";
import { Button } from "@/components/ui/button";

export function FollowButton({
  targetUserId,
  targetUsername,
  initialFollowing,
  isAuthenticated,
  onToggle,
}: {
  targetUserId: string;
  targetUsername: string;
  initialFollowing: boolean;
  isAuthenticated: boolean;
  onToggle?: (nowFollowing: boolean) => void;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [isToggling, setIsToggling] = useState(false);

  async function handleClick() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isToggling) return;

    const nextFollowing = !following;
    setFollowing(nextFollowing);
    onToggle?.(nextFollowing);
    setIsToggling(true);

    const result = await toggleFollow(targetUserId, targetUsername);
    setIsToggling(false);

    if (!result.success) {
      setFollowing(!nextFollowing);
      onToggle?.(!nextFollowing);
      toast.error(result.error ?? "Не удалось изменить подписку");
    }
  }

  return (
    <Button
      type="button"
      variant={following ? "secondary" : "default"}
      disabled={isToggling}
      onClick={handleClick}
    >
      {following ? "Вы подписаны" : "Подписаться"}
    </Button>
  );
}
