"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import type { getComments } from "@/lib/actions/comments";
import { createComment, deleteComment } from "@/lib/actions/comments";
import { createCommentSchema } from "@/lib/validations/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field";

type CommentWithAuthor = Awaited<ReturnType<typeof getComments>>[number];
type CreateCommentValues = z.infer<typeof createCommentSchema>;

export function CommentSection({
  postId,
  initialComments,
  currentUserId,
}: {
  postId: string;
  initialComments: CommentWithAuthor[];
  currentUserId?: string;
}) {
  const [comments, setComments] = useState(initialComments);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<CreateCommentValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: "" },
  });

  async function onSubmit(values: CreateCommentValues) {
    setServerError(null);
    const result = await createComment(postId, values);
    if (!result.success) {
      setServerError(result.error ?? "Что-то пошло не так");
      return;
    }
    form.reset();
    setComments((prev) => [...prev, result.comment]);
  }

  async function handleDelete(commentId: string) {
    if (!window.confirm("Удалить комментарий?")) return;
    const result = await deleteComment(commentId);
    if (!result.success) return;
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  return (
    <div className="mt-6">
      <h2 className="mb-4 text-sm font-semibold text-foreground">
        Комментарии{comments.length > 0 && ` (${comments.length})`}
      </h2>

      {currentUserId && (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-6 flex flex-col gap-2"
        >
          <Textarea
            placeholder="Написать комментарий..."
            rows={2}
            {...form.register("content")}
          />
          {form.formState.errors.content && (
            <FieldError errors={[form.formState.errors.content]} />
          )}
          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting}
            className="self-end"
          >
            {form.formState.isSubmitting ? "Отправляем..." : "Отправить"}
          </Button>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {comments.map((comment) => {
          const authorName = comment.author.name ?? "Неизвестный автор";
          const initial = authorName.charAt(0).toUpperCase();
          const isOwner = currentUserId === comment.authorId;

          return (
            <div key={comment.id} className="flex items-start gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cloud text-xs font-medium text-ink">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {authorName}
                </p>
                <p className="whitespace-pre-wrap text-sm text-foreground">
                  {comment.content}
                </p>
              </div>
              {isOwner && (
                <button
                  type="button"
                  aria-label="Удалить комментарий"
                  onClick={() => handleDelete(comment.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
