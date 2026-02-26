import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
