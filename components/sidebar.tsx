"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User } from "lucide-react";
import type { Session } from "next-auth";
import { signOutAction } from "@/lib/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [{ href: "/", label: "Лента", icon: Home }];

export function Sidebar({
  session,
  username,
}: {
  session: Session | null;
  username?: string;
}) {
  const pathname = usePathname();
  const navItems = username
    ? [...NAV_ITEMS, { href: `/users/${username}`, label: "Профиль", icon: User }]
    : NAV_ITEMS;

  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col justify-between p-4 md:flex lg:w-60">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-medium text-foreground"
          >
            Social Network
          </Link>
          <ThemeToggle />
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted",
                pathname === item.href && "text-primary"
              )}
            >
              <item.icon className="size-5" strokeWidth={2} />
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
            <Button type="submit" variant="secondary" className="w-full">
              Выйти
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Link href="/login" className={buttonVariants()}>
            Войти
          </Link>
          <Link href="/register" className={buttonVariants({ variant: "outline" })}>
            Регистрация
          </Link>
        </div>
      )}
    </aside>
  );
}
