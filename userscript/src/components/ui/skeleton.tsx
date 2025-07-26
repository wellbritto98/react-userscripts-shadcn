import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("ppm:bg-accent ppm:animate-pulse ppm:rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
