import * as React from "react"
import { ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface ChartWrapperProps {
  children: React.ReactElement
  className?: string
  height?: number | string
  width?: number | string
}

const ChartWrapper = React.forwardRef<HTMLDivElement, ChartWrapperProps>(
  ({ children, className, height = 300, width = "100%", ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <ResponsiveContainer width={width} height={height}>
          {children}
        </ResponsiveContainer>
      </div>
    )
  }
)

ChartWrapper.displayName = "ChartWrapper"

export { ChartWrapper }