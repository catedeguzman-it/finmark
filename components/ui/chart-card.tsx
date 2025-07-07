import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LucideIcon, MoreHorizontal, Download, Maximize2 } from "lucide-react"

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  actions?: {
    onExport?: () => void
    onExpand?: () => void
    onMore?: () => void
  }
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  icon?: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  autoHeight?: boolean
}

const ChartCard = React.forwardRef<HTMLDivElement, ChartCardProps>(
  ({ 
    title, 
    description, 
    children, 
    className, 
    actions, 
    badge, 
    icon: Icon, 
    size = 'md',
    loading = false,
    autoHeight = false,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: {
        header: 'p-3 pb-2',
        content: 'p-3 pt-0',
        title: 'text-sm',
        description: 'text-xs',
        height: 'h-48'
      },
      md: {
        header: 'p-4 pb-2',
        content: 'p-4 pt-0',
        title: 'text-base',
        description: 'text-sm',
        height: 'h-64'
      },
      lg: {
        header: 'p-6 pb-3',
        content: 'p-6 pt-0',
        title: 'text-lg',
        description: 'text-base',
        height: 'h-80'
      }
    }

    return (
      <Card ref={ref} className={cn("transition-all duration-200 hover:shadow-md", className)} {...props}>
        <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", sizeClasses[size].header)}>
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {Icon && <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <CardTitle className={cn("font-semibold truncate", sizeClasses[size].title)}>
                  {title}
                </CardTitle>
                {badge && (
                  <Badge variant={badge.variant || 'outline'} className="text-xs flex-shrink-0">
                    {badge.text}
                  </Badge>
                )}
              </div>
              {description && (
                <CardDescription className={cn("mt-1", sizeClasses[size].description)}>
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center space-x-1 flex-shrink-0">
              {actions.onExport && (
                <Button variant="ghost" size="sm" onClick={actions.onExport}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {actions.onExpand && (
                <Button variant="ghost" size="sm" onClick={actions.onExpand}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
              {actions.onMore && (
                <Button variant="ghost" size="sm" onClick={actions.onMore}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent className={cn(sizeClasses[size].content)}>
          <div className={cn("relative", autoHeight ? "min-h-0" : sizeClasses[size].height)}>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              children
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

ChartCard.displayName = "ChartCard"

export { ChartCard }