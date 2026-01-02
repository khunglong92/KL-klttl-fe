import { Skeleton } from "@mantine/core";
import { Separator } from "@radix-ui/react-separator";

export default function DetailProductSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-lg bg-muted" />
            <div className="grid grid-cols-5 gap-3">
              <Skeleton className="aspect-square rounded-lg bg-muted" />
              <Skeleton className="aspect-square rounded-lg bg-muted" />
              <Skeleton className="aspect-square rounded-lg bg-muted" />
              <Skeleton className="aspect-square rounded-lg bg-muted" />
              <Skeleton className="aspect-square rounded-lg bg-muted" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4 bg-muted" />
            <Skeleton className="h-5 w-1/2 bg-muted" />
            <Separator />
            <Skeleton className="h-24 w-full rounded-lg bg-muted" />
            <Skeleton className="h-48 w-full rounded-lg bg-muted" />
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-lg bg-muted" />
              <Skeleton className="h-12 w-12 rounded-lg bg-muted" />
              <Skeleton className="h-12 w-12 rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
