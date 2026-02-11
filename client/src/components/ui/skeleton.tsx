import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gradient-to-r from-[#da1069] to-[#3559AC] animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
