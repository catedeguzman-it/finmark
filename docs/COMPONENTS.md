# FinMark Components Documentation

## Overview

FinMark uses a component-based architecture with React and TypeScript. Components are organized into logical groups with clear separation between UI components, business logic components, and page-specific components.

## Component Structure

```
components/
├── dashboards/           # Dashboard-specific components
├── ui/                   # Reusable UI components (shadcn/ui)
├── AdminDemo.tsx         # Admin demonstration component
├── AuthDivider.tsx       # Authentication form divider
├── ExportDemo.tsx        # Data export demonstration
└── NavBar.tsx            # Main navigation component
```

## UI Components (`components/ui/`)

### Core Components

#### Button (`button.tsx`)
Versatile button component with multiple variants and sizes.

**Props:**
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<Button variant="default" size="lg">
  Click me
</Button>
```

#### Card (`card.tsx`)
Container component for grouping related content.

**Components:**
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Description text
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
    <CardDescription>Financial overview</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Input (`input.tsx`)
Form input component with consistent styling.

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
```

#### Table (`table.tsx`)
Data table components for displaying structured data.

**Components:**
- `Table`: Main table container
- `TableHeader`: Table header
- `TableBody`: Table body
- `TableRow`: Table row
- `TableHead`: Header cell
- `TableCell`: Data cell

### Form Components

#### Form (`form.tsx`)
Form wrapper with validation support using react-hook-form.

**Usage:**
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

#### Select (`select.tsx`)
Dropdown selection component.

**Components:**
- `Select`: Main select container
- `SelectTrigger`: Trigger button
- `SelectContent`: Dropdown content
- `SelectItem`: Individual option
- `SelectValue`: Selected value display

### Navigation Components

#### Navigation Menu (`navigation-menu.tsx`)
Main navigation component for site-wide navigation.

#### Breadcrumb (`breadcrumb.tsx`)
Breadcrumb navigation for hierarchical pages.

**Usage:**
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Dashboard</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Data Display Components

#### Chart (`chart.tsx`)
Chart wrapper component using Recharts.

**Props:**
```typescript
interface ChartProps {
  data: any[];
  type: 'line' | 'bar' | 'area' | 'pie';
  config: ChartConfig;
  className?: string;
}
```

#### Badge (`badge.tsx`)
Small status or category indicators.

**Variants:**
- `default`: Standard badge
- `secondary`: Secondary styling
- `destructive`: Error/warning states
- `outline`: Outlined style

#### Avatar (`avatar.tsx`)
User profile image component with fallback support.

**Components:**
- `Avatar`: Main container
- `AvatarImage`: Profile image
- `AvatarFallback`: Fallback text/icon

### Layout Components

#### Sidebar (`sidebar.tsx`)
Collapsible sidebar navigation component.

#### Sheet (`sheet.tsx`)
Slide-out panel component for mobile navigation and forms.

#### Dialog (`dialog.tsx`)
Modal dialog component for overlays and forms.

**Components:**
- `Dialog`: Main dialog container
- `DialogTrigger`: Trigger element
- `DialogContent`: Modal content
- `DialogHeader`: Header section
- `DialogTitle`: Dialog title
- `DialogDescription`: Description text

### Feedback Components

#### Alert (`alert.tsx`)
Alert messages for user feedback.

**Variants:**
- `default`: Standard alert
- `destructive`: Error alerts

**Usage:**
```tsx
<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Something went wrong.
  </AlertDescription>
</Alert>
```

#### Toast (`sonner.tsx`)
Toast notifications using Sonner library.

#### Progress (`progress.tsx`)
Progress bar component for loading states.

## Dashboard Components (`components/dashboards/`)

### DashboardLayout (`DashboardLayout.tsx`)
Main layout wrapper for dashboard pages.

**Props:**
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}
```

### Financial Dashboards

#### FinancialAnalyticsDashboard (`FinancialAnalyticsDashboard.tsx`)
Comprehensive financial analytics dashboard with multiple chart types.

**Features:**
- Revenue and expense tracking
- Cash flow analysis
- Profit/loss visualization
- Account balance overview

#### ImprovedFinancialDashboard (`ImprovedFinancialDashboard.tsx`)
Enhanced version with additional metrics and improved UX.

**Features:**
- Real-time data updates
- Interactive charts
- Export functionality
- Responsive design

### Business Domain Dashboards

#### EcommerceDashboard (`EcommerceDashboard.tsx`)
E-commerce specific metrics and KPIs.

**Metrics:**
- Sales performance
- Customer acquisition
- Product analytics
- Revenue trends

#### ExecutiveOverviewDashboard (`ExecutiveOverviewDashboard.tsx`)
High-level executive summary dashboard.

**Features:**
- Key performance indicators
- Trend analysis
- Executive summaries
- Strategic metrics

#### MarketingDashboard (`MarketingDashboard.tsx`)
Marketing campaign and performance tracking.

#### HealthcareDashboard (`HealthcareDashboard.tsx`)
Healthcare industry specific metrics.

#### ManufacturingDashboard (`ManufacturingDashboard.tsx`)
Manufacturing and production metrics.

## Shared Components

### NavBar (`NavBar.tsx`)
Main application navigation bar.

**Features:**
- User authentication status
- Organization switching
- Profile menu
- Responsive design

**Props:**
```typescript
interface NavBarProps {
  user?: User;
  organizations?: Organization[];
}
```

### AuthDivider (`AuthDivider.tsx`)
Visual divider for authentication forms.

**Usage:**
```tsx
<AuthDivider text="or continue with" />
```

### AdminDemo (`AdminDemo.tsx`)
Administrative interface demonstration component.

**Features:**
- User management
- Organization settings
- System configuration
- Demo data generation

### ExportDemo (`ExportDemo.tsx`)
Data export functionality demonstration.

**Features:**
- PDF export
- CSV export
- JSON export
- Custom formatting options

## Custom Hooks (`hooks/`)

### useAdminMode (`use-admin-mode.tsx`)
Hook for managing admin interface state.

**Returns:**
```typescript
{
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  setAdminMode: (enabled: boolean) => void;
}
```

### useMobile (`use-mobile.tsx`)
Hook for responsive design and mobile detection.

**Returns:**
```typescript
{
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
```

## Component Development Guidelines

### 1. Component Structure
```tsx
// Component imports
import React from 'react';
import { cn } from '@/lib/utils';

// Type definitions
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Component implementation
export const Component = ({ className, children, ...props }: ComponentProps) => {
  return (
    <div className={cn('default-classes', className)} {...props}>
      {children}
    </div>
  );
};

// Default export
export default Component;
```

### 2. Styling Guidelines
- Use Tailwind CSS classes for styling
- Use `cn()` utility for conditional classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography

### 3. TypeScript Best Practices
- Define explicit prop interfaces
- Use proper React types (`React.ReactNode`, `React.ComponentProps`)
- Extend HTML element props when appropriate
- Use generic types for reusable components

### 4. Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation support
- Maintain color contrast ratios
- Use semantic HTML elements

### 5. Performance Optimization
- Use React.memo for expensive components
- Implement proper key props for lists
- Lazy load heavy components
- Optimize re-renders with useCallback and useMemo

## Testing Components

### Unit Testing
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Integration Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from './form';

test('form submission works correctly', async () => {
  const onSubmit = jest.fn();
  render(<Form onSubmit={onSubmit} />);
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(onSubmit).toHaveBeenCalled();
});
```

## Component Customization

### Theming
Components support theming through CSS custom properties:

```css
:root {
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
}
```

### Variant System
Many components use a variant system for different styles:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
  }
);
```

### Custom Components
When creating custom components:

1. Follow the existing naming conventions
2. Use the established prop patterns
3. Implement proper TypeScript types
4. Include documentation and examples
5. Add to the appropriate component category