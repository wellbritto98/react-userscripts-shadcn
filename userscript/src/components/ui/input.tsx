import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "ppm:file:text-foreground ppm:placeholder:text-muted-foreground ppm:selection:bg-primary ppm:selection:text-primary-foreground ppm:dark:bg-input/30 ppm:border-input ppm:flex ppm:h-9 ppm:w-full ppm:min-w-0 ppm:rounded-md ppm:border ppm:bg-transparent ppm:px-3 ppm:py-1 ppm:text-base ppm:shadow-xs ppm:transition-[color,box-shadow] ppm:outline-none ppm:file:inline-flex ppm:file:h-7 ppm:file:border-0 ppm:file:bg-transparent ppm:file:text-sm ppm:file:font-medium ppm:disabled:pointer-events-none ppm:disabled:cursor-not-allowed ppm:disabled:opacity-50 ppm:md:text-sm",
        "ppm:focus-visible:border-ring ppm:focus-visible:ring-ring/50 ppm:focus-visible:ring-[3px]",
        "ppm:aria-invalid:ring-destructive/20 ppm:dark:aria-invalid:ring-destructive/40 ppm:aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
