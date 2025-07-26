import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "ppm:inline-flex ppm:items-center ppm:justify-center ppm:rounded-md ppm:border ppm:px-2 ppm:py-0.5 ppm:text-xs ppm:font-medium ppm:w-fit ppm:whitespace-nowrap ppm:shrink-0 ppm:[&>svg]:size-3 ppm:gap-1 ppm:[&>svg]:pointer-events-none ppm:focus-visible:border-ring ppm:focus-visible:ring-ring/50 ppm:focus-visible:ring-[3px] ppm:aria-invalid:ring-destructive/20 ppm:dark:aria-invalid:ring-destructive/40 ppm:aria-invalid:border-destructive ppm:transition-[color,box-shadow] ppm:overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "ppm:border-transparent ppm:bg-primary ppm:text-primary-foreground ppm:[a&]:hover:bg-primary/90",
        secondary:
          "ppm:border-transparent ppm:bg-secondary ppm:text-secondary-foreground ppm:[a&]:hover:bg-secondary/90",
        destructive:
          "ppm:border-transparent ppm:bg-destructive ppm:text-white ppm:[a&]:hover:bg-destructive/90 ppm:focus-visible:ring-destructive/20 ppm:dark:focus-visible:ring-destructive/40 ppm:dark:bg-destructive/60",
        outline:
          "ppm:text-foreground ppm:[a&]:hover:bg-accent ppm:[a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
