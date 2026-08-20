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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CreatePostValues = z.infer<typeof createPostSchema>;

export default function NewPostPage() {
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
    router.push(`/posts/${result.postId}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Новый пост</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <Textarea
              placeholder="Что нового?"
              rows={8}
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <FieldError errors={[form.formState.errors.content]} />
            )}

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Публикуем..." : "Опубликовать"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
