# 💼 Corporate Cooperative Management System

A comprehensive, modern web application for managing cooperative societies, member contributions, loans, transactions, and financial operations with an intuitive and beautiful user interface.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black)
![React](https://img.shields.io/badge/React-19.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## 🌟 Features

### 👥 Member Management
- **Member Registration & Profiles**: Complete member onboarding with profile management
- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Member Status Tracking**: Track active, inactive, retired, suspended, and terminated members
- **Bulk Upload**: Excel-based bulk member upload with validation

### 💰 Contribution Management
- **Monthly Contributions**: Track and manage member contributions
- **Contribution Changes**: Request and approve contribution amount changes
- **Balance Tracking**: Real-time balance updates for each member
- **Batch Processing**: Upload and approve contribution batches
- **Transaction History**: Complete audit trail of all contributions

### 🏦 Loan Management
- **Loan Applications**: Members can apply for various types of loans
- **Guarantor System**: Built-in guarantor request and approval workflow
- **Loan Tracking**: Monitor loan status, repayments, and balances
- **Batch Approvals**: Admin can process loan applications in batches
- **Interest Calculation**: Automated interest rate calculations
- **Repayment Schedules**: Track monthly repayments and outstanding balances

### 📊 Reports & Analytics
- **Dashboard Analytics**: Real-time insights with beautiful visualizations
- **Member Reports**: Comprehensive member activity and balance reports
- **Loan Reports**: Track active loans, pending applications, and repayments
- **Contribution Reports**: Monitor contribution patterns and trends
- **Transaction Reports**: Detailed transaction history and summaries
- **Guarantor Reports**: Track guarantorship obligations

### 🔐 Security & Access Control
- **Role-Based Access**: SuperAdmin and Member user types
- **JWT Authentication**: Secure token-based authentication
- **Password Reset**: Secure password recovery workflow
- **Session Management**: Automatic session timeout and renewal
- **Middleware Protection**: Route-level security enforcement

### 🎨 Modern UI/UX
- **Beautiful Design**: Modern gradient-based design with smooth animations
- **Responsive**: Fully responsive design for all screen sizes
- **Dark Mode Ready**: Built with theme support (can be extended)
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: Real-time feedback for user actions
- **Accessible**: Built with accessibility best practices

## 🚀 Tech Stack

### Frontend
- **Next.js 15.3** - React framework with App Router
- **React 19.0** - UI library
- **TypeScript 5** - Type safety
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Shadcn/UI** - High-quality UI components
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MySQL 2** - Database client
- **JWT (Jose)** - Authentication tokens
- **bcrypt** - Password hashing

### Database
- **MySQL 8.0+** - Relational database

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 20.x or higher
- **npm** or **yarn** or **pnpm**
- **MySQL** 8.0 or higher
- **Git**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd coorp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Database Setup

#### Create Database
```bash
mysql -u root -p < Schema.sql
```

This will create the `cooperative_db` database with all required tables.

#### Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=cooperative_db
DB_PORT=3306

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secure_jwt_secret_key_here_min_32_chars

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security Note**: Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Create Super Admin User

Run the setup script to create the initial super admin account:

```bash
npx ts-node scripts/create-superadmin.ts
```

Default credentials:
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Staff No**: `admin`

**Important**: Change these credentials immediately after first login!

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📖 Usage Guide

### For Members

1. **Register**: Navigate to `/register` and create your account
2. **Login**: Access your dashboard at `/dashboard`
3. **View Balance**: Check your contribution and loan balances
4. **Apply for Loan**: Submit loan applications with required details
5. **Track History**: View your contribution and transaction history
6. **Update Profile**: Manage your personal information

### For Administrators

1. **Login**: Use admin credentials to access admin dashboard
2. **Member Management**:
   - Upload new members via Excel
   - Approve membership applications
   - Manage user accounts
3. **Contribution Processing**:
   - Upload monthly contribution batches
   - Review and approve contributions
   - Track member balances
4. **Loan Processing**:
   - Review loan applications
   - Approve or reject loans
   - Track repayments
5. **Reports**:
   - Generate various financial reports
   - Export data for analysis
   - Monitor system health

## 📁 Project Structure

```
coorp/
├── public/              # Static assets
├── scripts/             # Setup and utility scripts
│   ├── create-superadmin.ts
│   └── setup-db.ts
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── api/        # API routes
│   │   │   ├── auth/   # Authentication endpoints
│   │   │   ├── contributions/
│   │   │   ├── loans/
│   │   │   ├── members/
│   │   │   └── transactions/
│   │   ├── dashboard/  # Dashboard pages
│   │   └── ...         # Other pages
│   ├── components/     # React components
│   │   ├── dashboard/  # Dashboard-specific components
│   │   └── ui/         # Shadcn UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   │   ├── auth.ts     # Authentication utilities
│   │   ├── db.ts       # Database connection
│   │   └── utils.ts    # Helper functions
│   └── middleware.ts   # Next.js middleware
├── Schema.sql          # Database schema
├── package.json
└── README.md
```

## 🔧 Configuration

### Adding Shadcn/UI Components

```bash
npx shadcn@latest add <component-name>
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | MySQL database host | Yes |
| `DB_USER` | MySQL username | Yes |
| `DB_PASSWORD` | MySQL password | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_PORT` | MySQL port (default: 3306) | No |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## 🗃️ Database Schema

The system uses the following main tables:
- **MEMBERS** - Member information and profiles
- **USERS** - Authentication and login credentials
- **TRANSACTIONS** - Financial transactions
- **CONTRIBUTIONS** - Member contributions
- **LOANS** - Loan applications and tracking
- **GUARANTORS** - Loan guarantor information
- **MEMBER_BALANCES** - Real-time balance tracking
- **TRANSACTION_TYPES** - Types of transactions
- **UPLOAD_BATCHES** - Batch upload tracking
- **TEMP_*** tables - Staging tables for batch processing

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [WORKFLOW.md](./WORKFLOW.md) for detailed development workflow.

## 📝 License

This project is proprietary software. All rights reserved.

## 🐛 Known Issues

- File upload size limits not yet configured
- Email notification system pending implementation
- Advanced reporting features in development

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the [documentation](./docs)

## 🗺️ Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and improvements.

## 📚 Additional Documentation

- [Product Requirements Document](./PRD.md)
- [Development Workflow](./WORKFLOW.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [UI/UX Improvements](./UI_UX_IMPROVEMENTS.md) ✨
- [Modern Dashboard Design](./MODERN_DASHBOARD_DESIGN.md) ✨ **NEW**
- [Component Examples](./EXAMPLES.md) ✨
- [API Documentation](./docs/API.md) (Coming Soon)

## ✨ Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)

---

Made with 💜 for cooperatives worldwide | © 2025 Corporate Cooperative Management System
