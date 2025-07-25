import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "ppm:flex ppm:items-center ppm:gap-2 ppm:text-sm ppm:leading-none ppm:font-medium ppm:select-none ppm:group-data-[disabled=true]:pointer-events-none ppm:group-data-[disabled=true]:opacity-50 ppm:peer-disabled:cursor-not-allowed ppm:peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
