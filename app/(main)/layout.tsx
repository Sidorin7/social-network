import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { MobileHeader } from "@/components/mobile-header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const currentUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true },
      })
    : null;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col md:flex-row">
      <MobileHeader session={session} />
      <Sidebar session={session} username={currentUser?.username} />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-4 md:px-6 md:py-6">
        {children}
      </main>
      <RightSidebar />
    </div>
  );
}
