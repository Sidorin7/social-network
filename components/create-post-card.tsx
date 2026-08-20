"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createPost } from "@/lib/actions/posts";
import { createPostSchema } from "@/lib/validations/posts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field";
import type { PostWithAuthor } from "@/components/post-card";

type CreatePostValues = z.infer<typeof createPostSchema>;

export function CreatePostCard({
  onCreated,
}: {
  onCreated: (post: PostWithAuthor) => void;
}) {
  const form = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { content: "" },
  });

  async function onSubmit(values: CreatePostValues) {
    const result = await createPost(values);
    if (!result.success || !result.post) {
      toast.error(result.error ?? "Не удалось опубликовать пост");
      return;
    }
    form.reset();
    onCreated(result.post);
  }

  return (
    <div className="rounded-xl bg-muted/60 p-5">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Textarea
          placeholder="Что нового?"
          rows={3}
          className="bg-background"
          {...form.register("content")}
        />
        {form.formState.errors.content && (
          <FieldError errors={[form.formState.errors.content]} />
        )}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="self-end"
        >
          {form.formState.isSubmitting ? "Публикуем..." : "Опубликовать"}
        </Button>
      </form>
    </div>
  );
}
