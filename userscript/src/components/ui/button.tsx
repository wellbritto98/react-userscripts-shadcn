import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "ppm:inline-flex ppm:items-center ppm:justify-center ppm:gap-2 ppm:whitespace-nowrap ppm:rounded-md ppm:text-sm ppm:font-medium ppm:transition-all ppm:disabled:pointer-events-none ppm:disabled:opacity-50 ppm:[&_svg]:pointer-events-none ppm:[&_svg:not([class*=size-])]:size-4 ppm:shrink-0 ppm:[&_svg]:shrink-0 ppm:outline-none ppm:focus-visible:border-ring ppm:focus-visible:ring-ring/50 ppm:focus-visible:ring-[3px] ppm:aria-invalid:ring-destructive/20 ppm:dark:aria-invalid:ring-destructive/40 ppm:aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "ppm:bg-primary ppm:text-primary-foreground ppm:shadow-xs ppm:hover:bg-primary/90",
        destructive:
          "ppm:bg-destructive ppm:text-white ppm:shadow-xs ppm:hover:bg-destructive/90 ppm:focus-visible:ring-destructive/20 ppm:dark:focus-visible:ring-destructive/40 ppm:dark:bg-destructive/60",
        outline:
          "ppm:border ppm:bg-background ppm:shadow-xs ppm:hover:bg-accent ppm:hover:text-accent-foreground ppm:dark:bg-input/30 ppm:dark:border-input ppm:dark:hover:bg-input/50",
        secondary:
          "ppm:bg-secondary ppm:text-secondary-foreground ppm:shadow-xs ppm:hover:bg-secondary/80",
        ghost:
          "ppm:hover:bg-accent ppm:hover:text-accent-foreground ppm:dark:hover:bg-accent/50",
        link: "ppm:text-primary ppm:underline-offset-4 ppm:hover:underline",
      },
      size: {
        default: "ppm:h-9 ppm:px-4 ppm:py-2 ppm:has-[>svg]:px-3",
        sm: "ppm:h-8 ppm:rounded-md ppm:gap-1.5 ppm:px-3 ppm:has-[>svg]:px-2.5",
        lg: "ppm:h-10 ppm:rounded-md ppm:px-6 ppm:has-[>svg]:px-4",
        icon: "ppm:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
