"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { signOutAction } from "@/lib/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";

export function MobileHeader({ session }: { session: Session | null }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-cloud bg-paper/95 px-4 py-3 backdrop-blur md:hidden">
      <Link href="/" className="font-serif text-xl font-medium text-foreground">
        Social Network
      </Link>

      {session?.user ? (
        <form action={signOutAction}>
          <Button type="submit" variant="secondary" size="sm">
            Выйти
          </Button>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login" className={buttonVariants({ size: "sm" })}>
            Войти
          </Link>
          <Link
            href="/register"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Регистрация
          </Link>
        </div>
      )}
    </header>
  );
}
