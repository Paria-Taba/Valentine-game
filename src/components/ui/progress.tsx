"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value = 0, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "progress-root relative w-full rounded-full border border-black bg-white overflow-hidden",
      className
    )}
    style={{
      height: "20px",
      padding: 0,
      boxSizing: "border-box",
    }}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="progress-indicator"
      style={{
        width: `${value}%`,
        height: "30px",
        backgroundColor: " #998cd9",
        borderRadius: "9999px",
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
      }}
    />
  </ProgressPrimitive.Root>
))

Progress.displayName = ProgressPrimitive.Root.displayName
export { Progress }
