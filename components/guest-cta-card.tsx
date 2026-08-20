import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        <Button nativeButton={false} render={<Link href="/login" />}>
          Войти
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/register" />}
        >
          Регистрация
        </Button>
      </CardContent>
    </Card>
  );
}
