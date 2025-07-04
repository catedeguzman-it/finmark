'use client';

import React from 'react';
import { faker } from '@faker-js/faker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown,
  Star,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
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

const generateCustomerData = () => {
  return Array.from({ length: 15 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    totalOrders: faker.number.int({ min: 1, max: 50 }),
    totalSpent: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
    lastOrder: faker.date.recent({ days: 30 }),
    segment: faker.helpers.arrayElement(['VIP', 'Regular', 'New', 'At Risk']),
    platform: faker.helpers.arrayElement(['Shopee', 'Lazada', 'Tokopedia'])
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

export default function EcommerceDashboard() {
  const salesData = generateSalesData();
  const productData = generateProductData().sort((a, b) => b.revenue - a.revenue);
  const customerData = generateCustomerData().sort((a, b) => b.totalSpent - a.totalSpent);
  const orderData = generateOrderData().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate metrics
  const totalRevenue = productData.reduce((sum, product) => sum + product.revenue, 0);
  const totalOrders = orderData.length;
  const totalCustomers = customerData.length;
  const avgOrderValue = totalRevenue / totalOrders;

  // Platform distribution data
  const platformData = [
    { name: 'Shopee', value: 45, color: platformColors.Shopee },
    { name: 'Lazada', value: 32, color: platformColors.Lazada },
    { name: 'Tokopedia', value: 23, color: platformColors.Tokopedia }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any, className: string }> = {
      'Delivered': { variant: 'default', className: 'bg-green-100 text-green-800' },
      'Shipped': { variant: 'default', className: 'bg-blue-100 text-blue-800' },
      'Processing': { variant: 'default', className: 'bg-yellow-100 text-yellow-800' },
      'Pending': { variant: 'default', className: 'bg-orange-100 text-orange-800' },
      'Cancelled': { variant: 'default', className: 'bg-red-100 text-red-800' }
    };
    
    return (
      <Badge className={variants[status]?.className || ''}>
        {status}
      </Badge>
    );
  };

  const getSegmentBadge = (segment: string) => {
    const variants: Record<string, string> = {
      'VIP': 'bg-purple-100 text-purple-800',
      'Regular': 'bg-blue-100 text-blue-800',
      'New': 'bg-green-100 text-green-800',
      'At Risk': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[segment] || ''}>
        {segment}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-commerce Analytics</h1>
          <p className="text-gray-600 mt-1">Multi-platform sales tracking and performance insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Trends
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              +8.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              +15.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              +4.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend (Last 30 Days)</CardTitle>
            <CardDescription>Daily sales across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Sales distribution across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="customers">Top Customers</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Products ranked by revenue generated</CardDescription>
            </CardHeader>
            <CardContent>
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
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Customers ranked by total spending</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead className="text-right">Last Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.slice(0, 10).map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{getSegmentBadge(customer.segment)}</TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: platformColors[customer.platform as keyof typeof platformColors], color: 'white' }}>
                          {customer.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{customer.totalOrders}</TableCell>
                      <TableCell className="text-right font-semibold">${customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{customer.lastOrder.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 