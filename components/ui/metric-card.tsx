import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  description?: string
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, icon: Icon, description, trend, badge, className, size = 'md', ...props }, ref) => {
    const formatValue = (val: string | number) => {
      if (typeof val === 'number') {
        return val.toLocaleString()
      }
      return val
    }

    const getTrendIcon = () => {
      if (!trend) return null
      
      switch (trend.direction) {
        case 'up':
          return <TrendingUp className="h-3 w-3 text-green-500" />
        case 'down':
          return <TrendingDown className="h-3 w-3 text-red-500" />
        case 'neutral':
          return <Minus className="h-3 w-3 text-gray-500" />
        default:
          return null
      }
    }

    const getTrendColor = () => {
      if (!trend) return 'text-muted-foreground'
      
      switch (trend.direction) {
        case 'up':
          return 'text-green-600'
        case 'down':
          return 'text-red-600'
        case 'neutral':
          return 'text-gray-600'
        default:
          return 'text-muted-foreground'
      }
    }

    const sizeClasses = {
      sm: {
        card: 'p-3',
        title: 'text-xs',
        value: 'text-lg',
        icon: 'h-3 w-3',
        trend: 'text-xs'
      },
      md: {
        card: 'p-4',
        title: 'text-sm',
        value: 'text-2xl',
        icon: 'h-4 w-4',
        trend: 'text-xs'
      },
      lg: {
        card: 'p-6',
        title: 'text-base',
        value: 'text-3xl',
        icon: 'h-5 w-5',
        trend: 'text-sm'
      }
    }

    return (
      <Card ref={ref} className={cn("transition-all duration-200 hover:shadow-md", className)} {...props}>
        <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", sizeClasses[size].card)}>
          <div className="flex items-center space-x-2">
            <CardTitle className={cn("font-medium", sizeClasses[size].title)}>
              {title}
            </CardTitle>
            {badge && (
              <Badge variant={badge.variant || 'outline'} className="text-xs">
                {badge.text}
              </Badge>
            )}
          </div>
          {Icon && <Icon className={cn("text-muted-foreground", sizeClasses[size].icon)} />}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className={cn("font-bold", sizeClasses[size].value)}>
            {formatValue(value)}
          </div>
          
          {(trend || description) && (
            <div className="flex items-center justify-between">
              {trend && (
                <div className={cn("flex items-center space-x-1", getTrendColor(), sizeClasses[size].trend)}>
                  {getTrendIcon()}
                  <span>
                    {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
                  </span>
                </div>
              )}
              
              {description && !trend && (
                <p className={cn("text-muted-foreground", sizeClasses[size].trend)}>
                  {description}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

MetricCard.displayName = "MetricCard"

export { MetricCard }