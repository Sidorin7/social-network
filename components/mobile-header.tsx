"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { signOutAction } from "@/lib/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileHeader({ session }: { session: Session | null }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
      <Link href="/" className="font-serif text-xl font-medium text-foreground">
        Social Network
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {session?.user ? (
          <form action={signOutAction}>
            <Button type="submit" variant="secondary" size="sm">
              Выйти
            </Button>
          </form>
        ) : (
          <>
            <Link href="/login" className={buttonVariants({ size: "sm" })}>
              Войти
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
