"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/actions/posts";
import { createPostSchema } from "@/lib/validations/posts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field";

type CreatePostValues = z.infer<typeof createPostSchema>;

export function CreatePostCard() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { content: "" },
  });

  async function onSubmit(values: CreatePostValues) {
    setServerError(null);
    const result = await createPost(values);
    if (!result.success) {
      setServerError(result.error ?? "Что-то пошло не так");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <div className="rounded-xl bg-cloud/60 p-5">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Textarea
          placeholder="Что нового?"
          rows={3}
          className="bg-paper"
          {...form.register("content")}
        />
        {form.formState.errors.content && (
          <FieldError errors={[form.formState.errors.content]} />
        )}
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

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
