"use client"

import * as React from "react"
import { ResponsiveContainer } from "recharts"

// Chart configuration type
export interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
    theme?: {
      light?: string
      dark?: string
    }
  }
}

// Chart context
type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

// Chart Container Component
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, children, className, ...props }, ref) => {
    return (
      <ChartContext.Provider value={{ config }}>
        <div ref={ref} className={`flex aspect-video justify-center text-xs ${className || ""}`} {...props}>
          <ChartStyle id="" config={config} />
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

// Chart Style Component for CSS custom properties
interface ChartStyleProps {
  id: string
  config: ChartConfig
}

const ChartStyle = ({ id, config }: ChartStyleProps) => {
  const colorConfig = Object.entries(config).reduce(
    (colors, [key, keyConfig]) => {
      if (keyConfig.color) {
        colors[`--color-${key}`] = keyConfig.color
      }
      return colors
    },
    {} as Record<string, string>,
  )

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(colorConfig)
          .map(([key, value]) => `${key}: ${value};`)
          .join(" "),
      }}
    />
  )
}

// Chart Tooltip Components
interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    color?: string
    dataKey?: string
    value?: string | number
    payload?: any
  }>
  label?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
}

const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipProps & React.HTMLAttributes<HTMLDivElement>>(
  (
    { active, payload, label, hideLabel = false, hideIndicator = false, indicator = "dot", className, ...props },
    ref,
  ) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div ref={ref} className={`rounded-lg border bg-background p-2 shadow-md ${className || ""}`} {...props}>
        <div className="grid gap-2">
          {!hideLabel && label && <div className="font-medium text-foreground">{label}</div>}
          <div className="grid gap-1.5">
            {payload.map((item, index) => {
              const key = `${label}-${item.dataKey}-${index}`
              const itemConfig = config[item.dataKey as keyof typeof config] || {}

              return (
                <div
                  key={key}
                  className="flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground"
                >
                  {!hideIndicator && (
                    <div
                      className={`shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg) ${
                        indicator === "dot" ? "h-2.5 w-2.5" : "w-1"
                      }`}
                      style={
                        {
                          "--color-bg": item.color,
                          "--color-border": item.color,
                        } as React.CSSProperties
                      }
                    />
                  )}
                  <div className="flex flex-1 justify-between leading-none">
                    <div className="grid gap-1.5">
                      <span className="text-muted-foreground">{itemConfig.label || item.dataKey}</span>
                    </div>
                    <span className="font-mono font-medium tabular-nums text-foreground">{item.value}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

// Chart Legend Components
interface ChartLegendProps {
  payload?: Array<{
    value: string
    type?: string
    color?: string
    dataKey?: string
  }>
  verticalAlign?: "top" | "bottom"
}

const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", ...props }, ref) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div ref={ref} className={`flex items-center justify-center gap-4 ${className || ""}`} {...props}>
        {payload.map((item) => {
          const key = item.dataKey || item.value
          const itemConfig = config[key as keyof typeof config] || {}

          return (
            <div
              key={item.value}
              className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            >
              {!hideIcon && (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig.icon && <itemConfig.icon />}
              <span className="text-muted-foreground">{itemConfig.label || item.value}</span>
            </div>
          )
        })}
      </div>
    )
  },
)
ChartLegendContent.displayName = "ChartLegendContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle }
