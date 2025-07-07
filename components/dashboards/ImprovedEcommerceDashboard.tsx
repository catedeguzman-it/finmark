'use client';

import React from 'react';
import { faker } from '@faker-js/faker';
import { showExportOptions, showDummyAction, type ExportData } from '@/utils/exportUtils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard } from '@/components/ui/metric-card';
import { ChartCard } from '@/components/ui/chart-card';
import { ChartWrapper } from '@/components/ui/chart-wrapper';
import { DashboardGrid, DashboardSection } from '@/components/ui/dashboard-grid';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Package,
  TrendingUp,
  Star,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Generate dummy data
const generateSalesData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: faker.date.recent({ days: 30 - i }).toISOString().split('T')[0],
    shopee: faker.number.int({ min: 1000, max: 5000 }),
    lazada: faker.number.int({ min: 800, max: 4000 }),
    tokopedia: faker.number.int({ min: 600, max: 3500 }),
    total: 0
  })).map(item => ({
    ...item,
    total: item.shopee + item.lazada + item.tokopedia
  }));
};

const generateProductData = () => {
  return Array.from({ length: 20 }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
    sold: faker.number.int({ min: 50, max: 1000 }),
    revenue: 0,
    rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
    stock: faker.number.int({ min: 0, max: 200 }),
    platform: faker.helpers.arrayElement(['Shopee', 'Lazada', 'Tokopedia'])
  })).map(item => ({
    ...item,
    revenue: item.price * item.sold
  }));
};

const generateOrderData = () => {
  return Array.from({ length: 25 }, () => ({
    id: faker.string.alphanumeric(8).toUpperCase(),
    customer: faker.person.fullName(),
    items: faker.number.int({ min: 1, max: 5 }),
    total: faker.number.float({ min: 25, max: 500, fractionDigits: 2 }),
    status: faker.helpers.arrayElement(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
    date: faker.date.recent({ days: 7 }),
    platform: faker.helpers.arrayElement(['Shopee', 'Lazada', 'Tokopedia'])
  }));
};

const platformColors = {
  Shopee: '#ee4d2d',
  Lazada: '#0f146d',
  Tokopedia: '#42b883'
};

export default function ImprovedEcommerceDashboard() {
  const salesData = generateSalesData();
  const productData = generateProductData().sort((a, b) => b.revenue - a.revenue);
  const orderData = generateOrderData().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate metrics
  const totalRevenue = productData.reduce((sum, product) => sum + product.revenue, 0);
  const totalOrders = orderData.length;
  const totalCustomers = faker.number.int({ min: 1200, max: 2500 });
  const avgOrderValue = totalRevenue / totalOrders;

  // Platform distribution data
  const platformData = [
    { name: 'Shopee', value: 45, color: platformColors.Shopee },
    { name: 'Lazada', value: 32, color: platformColors.Lazada },
    { name: 'Tokopedia', value: 23, color: platformColors.Tokopedia }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Delivered': 'bg-green-100 text-green-800',
      'Shipped': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status] || ''}>
        {status}
      </Badge>
    );
  };

  const handleExportReport = () => {
    const exportData: ExportData = {
      title: 'E-commerce Analytics Report',
      subtitle: 'Multi-platform sales tracking and performance insights',
      data: productData.slice(0, 10),
      columns: [
        { header: 'Product', dataKey: 'name' },
        { header: 'Category', dataKey: 'category' },
        { header: 'Platform', dataKey: 'platform' },
        { header: 'Price', dataKey: 'price' },
        { header: 'Sold', dataKey: 'sold' },
        { header: 'Revenue', dataKey: 'revenue' },
        { header: 'Rating', dataKey: 'rating' },
        { header: 'Stock', dataKey: 'stock' }
      ],
      summary: [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}` },
        { label: 'Total Orders', value: totalOrders.toLocaleString() },
        { label: 'Total Customers', value: totalCustomers.toLocaleString() },
        { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}` }
      ]
    };
    showExportOptions(exportData);
  };

  const handleViewTrends = () => {
    showDummyAction('Trends Analysis Opened');
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <DashboardSection
        title="E-commerce Analytics"
        description="Multi-platform sales tracking and performance insights"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportReport}>
              <FileText className="size-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm" onClick={handleViewTrends}>
              <TrendingUp className="size-4 mr-2" />
              View Trends
            </Button>
          </div>
        }
      >
        <div></div>
      </DashboardSection>

      {/* Key Metrics */}
      <DashboardGrid cols={{ default: 1, md: 2, lg: 4 }}>
        <MetricCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{
            value: 12.5,
            label: "from last month",
            direction: 'up'
          }}
        />
        
        <MetricCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={ShoppingCart}
          trend={{
            value: 8.3,
            label: "from last month",
            direction: 'up'
          }}
        />
        
        <MetricCard
          title="Active Customers"
          value={totalCustomers.toLocaleString()}
          icon={Users}
          trend={{
            value: 15.2,
            label: "from last month",
            direction: 'up'
          }}
        />
        
        <MetricCard
          title="Avg Order Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          icon={Package}
          trend={{
            value: 4.1,
            label: "from last month",
            direction: 'up'
          }}
        />
      </DashboardGrid>

      {/* Charts Section */}
      <DashboardGrid cols={{ default: 1, lg: 2 }}>
        <ChartCard
          title="Sales Trend (Last 30 Days)"
          description="Daily sales across all platforms"
          actions={{
            onExport: () => console.log('Export sales chart'),
            onExpand: () => console.log('Expand sales chart')
          }}
        >
          <ChartWrapper>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="shopee" stackId="1" stroke={platformColors.Shopee} fill={platformColors.Shopee} />
              <Area type="monotone" dataKey="lazada" stackId="1" stroke={platformColors.Lazada} fill={platformColors.Lazada} />
              <Area type="monotone" dataKey="tokopedia" stackId="1" stroke={platformColors.Tokopedia} fill={platformColors.Tokopedia} />
            </AreaChart>
          </ChartWrapper>
        </ChartCard>

        <ChartCard
          title="Platform Distribution"
          description="Sales distribution across platforms"
          badge={{ text: "Live", variant: "outline" }}
        >
          <ChartWrapper>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartWrapper>
        </ChartCard>
      </DashboardGrid>

      {/* Data Tables */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ChartCard title="Top Performing Products" description="Products ranked by revenue generated" autoHeight>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productData.slice(0, 10).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: platformColors[product.platform as keyof typeof platformColors], color: 'white' }}>
                          {product.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{product.sold}</TableCell>
                      <TableCell className="text-right font-semibold">${product.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          {product.rating}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={product.stock < 20 ? 'text-red-600 font-semibold' : ''}>
                          {product.stock}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </TabsContent>

        <TabsContent value="orders">
          <ChartCard title="Recent Orders" description="Latest orders across all platforms" autoHeight>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderData.slice(0, 15).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell className="font-medium">{order.customer}</TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: platformColors[order.platform as keyof typeof platformColors], color: 'white' }}>
                          {order.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{order.items}</TableCell>
                      <TableCell className="text-right font-semibold">${order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">{order.date.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </TabsContent>

        <TabsContent value="performance">
          <DashboardGrid cols={{ default: 1, md: 2 }}>
            <MetricCard
              title="Conversion Rate"
              value="3.2%"
              trend={{
                value: 0.5,
                label: "from last week",
                direction: 'up'
              }}
              size="lg"
            />
            
            <MetricCard
              title="Cart Abandonment"
              value="68.4%"
              trend={{
                value: -2.1,
                label: "from last week",
                direction: 'down'
              }}
              size="lg"
            />
          </DashboardGrid>
        </TabsContent>
      </Tabs>
    </div>
  );
}