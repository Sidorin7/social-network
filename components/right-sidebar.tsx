import { Search } from "lucide-react";

export function RightSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 flex-col gap-6 overflow-y-auto p-4 xl:flex">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Поиск по Social Network"
          disabled
          className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      <div className="rounded-xl bg-card p-5">
        <h2 className="mb-1 font-serif text-xl font-medium text-foreground">
          Рекомендации
        </h2>
        <p className="text-sm text-muted-foreground">
          Скоро здесь появятся авторы и посты, которые стоит почитать.
        </p>
      </div>
    </aside>
  );
}
