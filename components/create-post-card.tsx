"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/actions/posts";
import { createPostSchema } from "@/lib/validations/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CreatePostValues = z.infer<typeof createPostSchema>;

export function CreatePostCard() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: "", content: "" },
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
    <Card>
      <CardHeader>
        <CardTitle>Что нового?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.title}>
              <FieldLabel htmlFor="title">Заголовок</FieldLabel>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <FieldError errors={[form.formState.errors.title]} />
              )}
            </Field>

            <Field data-invalid={!!form.formState.errors.content}>
              <FieldLabel htmlFor="content">Текст</FieldLabel>
              <Textarea id="content" rows={4} {...form.register("content")} />
              {form.formState.errors.content && (
                <FieldError errors={[form.formState.errors.content]} />
              )}
            </Field>

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Публикуем..." : "Опубликовать"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
