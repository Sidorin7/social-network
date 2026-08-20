import { Skeleton } from "@/components/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="border-b border-border pb-6">
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="mb-1.5 h-4 w-full" />
      <Skeleton className="mb-1.5 h-4 w-5/6" />
      <Skeleton className="mb-4 h-4 w-2/3" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  );
}
