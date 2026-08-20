"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatePost, deletePost } from "@/lib/actions/posts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function PostBody({
  postId,
  content,
  isOwner,
  linkToPost = true,
  onUpdated,
  onDeleted,
}: {
  postId: string;
  content: string;
  isOwner: boolean;
  linkToPost?: boolean;
  onUpdated?: (content: string) => void;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setIsSaving(true);
    const result = await updatePost(postId, { content: draft });
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
    const result = await deletePost(postId);
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

  if (isEditing) {
    return (
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
              setDraft(content);
              setIsEditing(false);
              setError(null);
            }}
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  const text = (
    <p className="whitespace-pre-wrap font-serif text-[19px] leading-[1.2] text-foreground">
      {content}
    </p>
  );

  return (
    <div>
      {linkToPost ? <Link href={`/posts/${postId}`}>{text}</Link> : text}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      {isOwner && (
        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
          <button
            type="button"
            className="hover:text-foreground"
            onClick={() => setIsEditing(true)}
          >
            Редактировать
          </button>
          <button
            type="button"
            className="hover:text-foreground"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Удаляем..." : "Удалить"}
          </button>
        </div>
      )}
    </div>
  );
}
