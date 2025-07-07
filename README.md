# FinMark - Modern Financial Management System

A cloud-native financial management application built with **Next.js 15**, **Supabase**, and **TypeScript**. FinMark provides comprehensive financial tracking, analytics, and reporting capabilities for organizations of all sizes.

## 🚀 Features

- **Multi-tenant Architecture**: Organization-based data isolation and user management
- **Real-time Financial Dashboards**: Interactive charts and analytics using Recharts
- **Secure Authentication**: Supabase-powered authentication with role-based access control
- **Comprehensive Financial Tracking**: Accounts, transactions, categories, and budgeting
- **Data Export**: PDF, CSV, and JSON export capabilities
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type-safe Database**: Drizzle ORM with full TypeScript integration

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router for SSR/SSG
- **React 19** for component-based UI
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Recharts** for data visualization

### Backend & Database
- **Supabase** for authentication and database
- **PostgreSQL** as primary database
- **Drizzle ORM** for type-safe database operations
- **Row Level Security (RLS)** for data protection

### Development & Deployment
- **Vercel** for hosting and deployment
- **Drizzle Kit** for database migrations
- **ESLint** and **TypeScript** for code quality

## 📚 Documentation

### Core Documentation
- **[Setup Guide](docs/SETUP.md)** - Complete installation and configuration guide
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[API Documentation](docs/API.md)** - Server actions, database queries, and API endpoints
- **[Database Schema](docs/DATABASE.md)** - Database design, queries, and migrations
- **[Component Library](docs/COMPONENTS.md)** - UI components and usage examples
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment and configuration

### Legacy Documentation
- **[MS2 Documentation](docs/MS2_Documentation.md)** - Original prototype documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finmark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database Management
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database inspection

## 🏗️ Project Structure

```
finmark/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication routes
│   ├── dashboard/                # Dashboard pages and components
│   ├── login/                    # Login page and actions
│   └── profile/                  # User profile pages
├── components/                   # Reusable React components
│   ├── dashboards/               # Dashboard-specific components
│   ├── ui/                       # shadcn/ui components
│   └── *.tsx                     # Shared components
├── db/                           # Database layer
│   ├── queries/                  # Database query functions
│   ├── index.ts                  # Database connection
│   └── schema.ts                 # Drizzle schema definitions
├── docs/                         # Documentation
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
├── utils/                        # Utility functions
│   ├── supabase/                 # Supabase client configurations
│   └── *.ts                      # Helper functions
└── styles/                       # Global styles
```

## 🔐 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Organization-scoped data** - Multi-tenant data isolation
- **JWT-based authentication** - Secure session management
- **Input validation** - Zod schema validation
- **HTTPS enforcement** - Secure data transmission
- **Environment variable protection** - Secure configuration management

## 🎯 Key Features

### Financial Management
- **Account Management**: Multiple account types (checking, savings, credit, investment)
- **Transaction Tracking**: Detailed transaction records with categorization
- **Category Management**: Custom income and expense categories
- **Balance Tracking**: Real-time account balance updates

### Analytics & Reporting
- **Interactive Dashboards**: Multiple dashboard types for different business domains
- **Chart Visualizations**: Revenue, expenses, cash flow, and profit analysis
- **Export Capabilities**: PDF, CSV, and JSON data export
- **Real-time Updates**: Live data synchronization

### User Management
- **Multi-tenant Architecture**: Organization-based user management
- **Role-based Access**: Admin, member, and viewer roles
- **Profile Management**: User profile and preferences
- **Authentication**: Email/password with confirmation

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your Git repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
```

For detailed deployment instructions, see the [Deployment Guide](docs/DEPLOYMENT.md).

## 🧪 Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled with proper typing
- **Components**: PascalCase naming, arrow functions preferred
- **Imports**: Use `@/` alias for root imports
- **Styling**: Tailwind CSS with `cn()` utility
- **Database**: Drizzle ORM with type inference

### Best Practices
- Follow the established component patterns
- Use server components for data fetching
- Implement proper error handling
- Write type-safe database queries
- Follow security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](docs/) directory for detailed guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions for questions and ideas

## 🔄 Version History

- **v1.0.0** - Initial release with core financial management features
- **v0.9.0** - Beta release with dashboard and authentication
- **v0.8.0** - Alpha release with basic functionality

## 🙏 Acknowledgments

- **Next.js** team for the excellent framework
- **Supabase** for the backend-as-a-service platform
- **shadcn/ui** for the beautiful UI components
- **Drizzle** team for the type-safe ORM
- **Vercel** for the deployment platform

---

**FinMark** - Modernizing financial management for the cloud era.