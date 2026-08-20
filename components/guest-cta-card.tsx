import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export function GuestCtaCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Присоединяйтесь к обсуждению</CardTitle>
        <p className="text-sm text-muted-foreground">
          Войдите или зарегистрируйтесь, чтобы публиковать посты.
        </p>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Link href="/login" className={buttonVariants()}>
          Войти
        </Link>
        <Link href="/register" className={buttonVariants({ variant: "outline" })}>
          Регистрация
        </Link>
      </CardContent>
    </Card>
  );
}
