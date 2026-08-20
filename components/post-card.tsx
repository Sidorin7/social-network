"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post, User } from "@prisma/client";
import { Heart, MessageCircle, MoreVertical, Repeat2, Eye } from "lucide-react";
import { updatePost, deletePost } from "@/lib/actions/posts";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PostWithAuthor = Post & { author: Pick<User, "name"> };

function usePostTimeLabel(date: Date) {
  // Начальное значение не зависит от "текущего момента", поэтому совпадает
  // на сервере и при первом клиентском рендере — без этого React ловит
  // hydration mismatch, т.к. formatRelativeTime(date) меняется каждую минуту.
  const [label, setLabel] = useState(() => date.toLocaleDateString("ru-RU"));

  useEffect(() => {
    setLabel(formatRelativeTime(date));
    const id = setInterval(() => setLabel(formatRelativeTime(date)), 60_000);
    return () => clearInterval(id);
  }, [date]);

  return label;
}

export function PostCard({
  post,
  currentUserId,
  linkToPost = true,
  onUpdated,
  onDeleted,
}: {
  post: PostWithAuthor;
  currentUserId?: string;
  linkToPost?: boolean;
  onUpdated?: (content: string) => void;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const isOwner = currentUserId === post.authorId;
  const authorName = post.author.name ?? "Неизвестный автор";
  const initial = authorName.charAt(0).toUpperCase();
  const timeLabel = usePostTimeLabel(post.createdAt);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setIsSaving(true);
    const result = await updatePost(post.id, { content: draft });
    setIsSaving(false);
    if (!result.success) {
      setError(result.error ?? "Что-то пошло не так");
      return;
    }
    setIsEditing(false);
    onUpdated?.(draft);
  }

  async function handleDelete() {
    if (!window.confirm("Удалить пост?")) return;
    setIsDeleting(true);
    const result = await deletePost(post.id);
    setIsDeleting(false);
    if (!result.success) {
      setError(result.error ?? "Что-то пошло не так");
      return;
    }
    if (onDeleted) {
      onDeleted();
    } else {
      router.push("/");
    }
  }

  const text = (
    <p className="whitespace-pre-wrap font-serif text-[19px] leading-[1.2] text-foreground">
      {post.content}
    </p>
  );

  return (
    <article className="border-b border-cloud pb-6">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cloud text-sm font-medium text-ink">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {authorName}
            </p>
            <p className="text-xs text-muted-foreground">{timeLabel}</p>
          </div>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Действия с постом"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <MoreVertical className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? "Удаляем..." : "Удалить"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isEditing ? (
        <div>
          <Textarea
            autoFocus
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="bg-paper"
          />
          {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
          <div className="mt-2 flex gap-2">
            <Button size="sm" type="button" disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Сохраняем..." : "Сохранить"}
            </Button>
            <Button
              size="sm"
              type="button"
              variant="secondary"
              disabled={isSaving}
              onClick={() => {
                setDraft(post.content);
                setIsEditing(false);
                setError(null);
              }}
            >
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <>
          {linkToPost ? <Link href={`/posts/${post.id}`}>{text}</Link> : text}
          {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Heart className="size-5" strokeWidth={2} />
            0
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageCircle className="size-5" strokeWidth={2} />
            0
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Repeat2 className="size-5" strokeWidth={2} />
            0
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Eye className="size-5" strokeWidth={2} />
          0
        </span>
      </div>
    </article>
  );
}
