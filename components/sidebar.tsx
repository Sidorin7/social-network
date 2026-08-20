"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [{ href: "/", label: "Лента" }];

export function Sidebar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between border-r border-border p-4">
      <div>
        <Link href="/" className="mb-6 block text-lg font-semibold">
          Social Network
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium hover:bg-muted",
                pathname === item.href && "bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {session?.user ? (
        <div className="flex flex-col gap-2">
          <p className="truncate px-3 text-sm text-muted-foreground">
            {session.user.name ?? session.user.email}
          </p>
          <form action={signOutAction}>
            <Button type="submit" variant="outline" className="w-full">
              Выйти
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button render={<Link href="/login" />}>Войти</Button>
          <Button variant="outline" render={<Link href="/register" />}>
            Регистрация
          </Button>
        </div>
      )}
    </aside>
  );
}
