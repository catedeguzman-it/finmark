import * as React from "react"
import { cn } from "@/lib/utils"

interface DashboardGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'sm' | 'md' | 'lg'
}

const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
  ({ children, className, cols = { default: 1, md: 2, lg: 3 }, gap = 'md', ...props }, ref) => {
    const gapClasses = {
      sm: 'gap-3',
      md: 'gap-6',
      lg: 'gap-8'
    }

    const getGridCols = () => {
      const classes = ['grid']
      
      if (cols.default) classes.push(`grid-cols-${cols.default}`)
      if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
      if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
      if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
      if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
      
      return classes.join(' ')
    }

    return (
      <div 
        ref={ref} 
        className={cn(getGridCols(), gapClasses[gap], className)} 
        {...props}
      >
        {children}
      </div>
    )
  }
)

DashboardGrid.displayName = "DashboardGrid"

interface DashboardSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

const DashboardSection = React.forwardRef<HTMLDivElement, DashboardSectionProps>(
  ({ title, description, children, className, action, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {(title || description || action) && (
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
        {children}
      </div>
    )
  }
)

DashboardSection.displayName = "DashboardSection"

export { DashboardGrid, DashboardSection }