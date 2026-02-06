"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

// =====================
// Types
// =====================

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    color?: string
  }
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within ChartContainer")
  }
  return context
}

// =====================
// Container
// =====================

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ReactNode
  }
>(({ className, children, config, ...props }, ref) => {
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs",
          className
        )}
        {...props}
      >
        <ResponsiveContainer>
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

// =====================
// Tooltip
// =====================

type TooltipItem = {
  name?: string
  value?: number | string
  dataKey?: string
  color?: string
}

type ChartTooltipProps = {
  active?: boolean
  payload?: TooltipItem[]
  label?: string | number
  className?: string
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipProps
>(({ active, payload, label, className }, ref) => {
  const { config } = useChart()

  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-background p-2 text-xs shadow",
        className
      )}
    >
      {label && (
        <div className="mb-1 font-medium">
          {label}
        </div>
      )}

      <div className="space-y-1">
        {payload.map((item, index) => {
          const key = String(item.dataKey ?? index)
          const itemConfig = config[key]

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{
                    backgroundColor:
                      item.color || itemConfig?.color,
                  }}
                />
                <span className="text-muted-foreground">
                  {itemConfig?.label ?? item.name}
                </span>
              </div>
              {item.value !== undefined && (
                <span className="font-mono">
                  {item.value}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

// =====================
// Legend
// =====================

type LegendItem = {
  dataKey?: string
  value?: string
  color?: string
}

type ChartLegendProps = {
  payload?: LegendItem[]
  className?: string
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendProps
>(({ payload, className }, ref) => {
  const { config } = useChart()

  if (!payload || payload.length === 0) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap justify-center gap-4 text-xs",
        className
      )}
    >
      {payload.map((item, index) => {
        const key = String(item.dataKey ?? index)
        const itemConfig = config[key]

        return (
          <div
            key={key}
            className="flex items-center gap-1.5"
          >
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span>
              {itemConfig?.label ?? item.value}
            </span>
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"

// =====================
// Exports
// =====================

export {
  ChartContainer,
  Tooltip as ChartTooltip,
  ChartTooltipContent,
  Legend as ChartLegend,
  ChartLegendContent,
}
