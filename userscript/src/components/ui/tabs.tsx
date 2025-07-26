import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("ppm:flex ppm:flex-col ppm:gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "ppm:bg-muted ppm:text-muted-foreground ppm:inline-flex ppm:h-9 ppm:w-fit ppm:items-center ppm:justify-center ppm:rounded-lg ppm:p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "ppm:data-[state=active]:bg-background ppm:dark:data-[state=active]:text-foreground ppm:focus-visible:border-ring ppm:focus-visible:ring-ring/50 ppm:focus-visible:outline-ring ppm:dark:data-[state=active]:border-input ppm:dark:data-[state=active]:bg-input/30 ppm:text-foreground ppm:dark:text-muted-foreground ppm:inline-flex ppm:h-[calc(100%-1px)] ppm:flex-1 ppm:items-center ppm:justify-center ppm:gap-1.5 ppm:rounded-md ppm:border ppm:border-transparent ppm:px-2 ppm:py-1 ppm:text-sm ppm:font-medium ppm:whitespace-nowrap ppm:transition-[color,box-shadow] ppm:focus-visible:ring-[3px] ppm:focus-visible:outline-1 ppm:disabled:pointer-events-none ppm:disabled:opacity-50 ppm:data-[state=active]:shadow-sm ppm:[&_svg]:pointer-events-none ppm:[&_svg]:shrink-0 ppm:[&_svg:not([class*=size-])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("ppm:flex-1 ppm:outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
