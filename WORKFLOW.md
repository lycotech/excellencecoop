# ⚙️ Development Workflow

## Corporate Cooperative Management System - Development Guidelines

This document outlines the development workflow, coding standards, best practices, and contribution guidelines for the Corporate Cooperative Management System.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Git Workflow](#git-workflow)
4. [Coding Standards](#coding-standards)
5. [Component Development](#component-development)
6. [API Development](#api-development)
7. [Database Guidelines](#database-guidelines)
8. [Testing Guidelines](#testing-guidelines)
9. [Code Review Process](#code-review-process)
10. [Deployment Process](#deployment-process)
11. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
# Required versions
Node.js: v20.x or higher
npm: v10.x or higher
MySQL: v8.0 or higher
Git: v2.x or higher
```

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd coorp

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Set up database
mysql -u root -p < Schema.sql

# 5. Create super admin
npx ts-node scripts/create-superadmin.ts

# 6. Run development server
npm run dev
```

### Verify Installation

```bash
# Check Node.js version
node -v

# Check npm version
npm -v

# Check MySQL connection
mysql -u root -p -e "SHOW DATABASES;"

# Run the application
npm run dev
# Visit http://localhost:3000
```

---

## 💻 Development Environment

### Required Tools

#### Code Editor
- **VS Code** (Recommended) with extensions:
  - ESLint
  - Prettier (optional)
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
  - Auto Rename Tag
  - Path Intellisense

#### Browser Tools
- Chrome DevTools / Firefox Developer Tools
- React Developer Tools Extension
- Redux DevTools Extension (if needed)

#### Database Tools
- MySQL Workbench
- TablePlus
- DBeaver
- phpMyAdmin

### Environment Variables

Create `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cooperative_db
DB_PORT=3306

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: For production
# DB_HOST=your-production-db-host
# DB_SSL=true
```

### Project Structure

```
coorp/
├── public/                 # Static files
│   ├── images/
│   └── icons/
├── scripts/                # Utility scripts
│   ├── create-superadmin.ts
│   └── setup-db.ts
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # Authentication endpoints
│   │   │   ├── contributions/
│   │   │   ├── loans/
│   │   │   ├── members/
│   │   │   ├── transactions/
│   │   │   └── ...
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   │   ├── dashboard/     # Dashboard-specific
│   │   ├── ui/            # Shadcn UI components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useCurrentUser.ts
│   │   └── useCurrentUserType.ts
│   ├── lib/               # Utility libraries
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── db.ts          # Database connection
│   │   └── utils.ts       # Helper functions
│   ├── middleware.ts      # Next.js middleware
│   └── types/             # TypeScript type definitions (create as needed)
├── .env.local             # Environment variables (not committed)
├── .gitignore
├── components.json        # Shadcn UI config
├── next.config.js
├── package.json
├── Schema.sql             # Database schema
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔀 Git Workflow

### Branch Strategy

We follow **Git Flow** methodology:

```
main (production)
  ↑
develop (integration)
  ↑
feature/* (new features)
bugfix/* (bug fixes)
hotfix/* (urgent production fixes)
```

### Branch Naming Convention

```bash
# Features
feature/member-dashboard
feature/loan-calculator
feature/email-notifications

# Bug fixes
bugfix/login-redirect-issue
bugfix/balance-calculation-error

# Hotfixes
hotfix/security-vulnerability
hotfix/critical-bug-fix

# Improvements
improvement/performance-optimization
improvement/ui-enhancement
```

### Commit Message Format

We use **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, etc.

#### Examples

```bash
# Feature
git commit -m "feat(auth): add two-factor authentication"

# Bug fix
git commit -m "fix(loan): correct interest calculation formula"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(dashboard): optimize data fetching logic"
```

### Development Workflow

#### 1. Start New Feature

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat(scope): description"

# Push to remote
git push origin feature/your-feature-name
```

#### 2. Keep Branch Updated

```bash
# Regularly sync with develop
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git merge develop

# Resolve conflicts if any
# Then continue working
```

#### 3. Submit Pull Request

```bash
# Push latest changes
git push origin feature/your-feature-name

# Create PR on GitHub/GitLab
# - Title: Clear description of changes
# - Description: What, why, how
# - Link related issues
# - Request reviewers
```

#### 4. After PR Approval

```bash
# Merge to develop (via PR)
# Delete feature branch
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
```

### Git Best Practices

1. **Commit Often**: Small, focused commits are better than large ones
2. **Write Clear Messages**: Follow commit message format
3. **Review Before Commit**: Use `git diff` to review changes
4. **Don't Commit Sensitive Data**: Never commit `.env` files or secrets
5. **Pull Before Push**: Always pull latest changes before pushing
6. **Use .gitignore**: Ensure build files and dependencies are ignored

---

## 📝 Coding Standards

### TypeScript Guidelines

#### General Principles

1. **Use TypeScript Strictly**: Enable strict mode in `tsconfig.json`
2. **Explicit Types**: Define types for function parameters and return values
3. **Interfaces Over Types**: Use interfaces for object shapes
4. **Avoid `any`**: Use proper types or `unknown` when type is uncertain

#### Examples

```typescript
// ✅ Good
interface User {
  id: number;
  name: string;
  email: string;
  role: 'Member' | 'SuperAdmin';
}

function getUser(id: number): Promise<User | null> {
  // implementation
}

// ❌ Bad
function getUser(id: any): any {
  // implementation
}
```

#### Type Definitions

```typescript
// Create interfaces for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Use discriminated unions for complex types
type TransactionType = 
  | { type: 'contribution'; amount: number; date: string }
  | { type: 'loan'; amount: number; interestRate: number }
  | { type: 'withdrawal'; amount: number; reason: string };
```

### React/Next.js Guidelines

#### Component Structure

```typescript
// ✅ Good - Functional component with TypeScript
'use client'; // Only if using client-side features

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface MemberCardProps {
  memberId: number;
  name: string;
  balance: number;
  onUpdate?: () => void;
}

export function MemberCard({ 
  memberId, 
  name, 
  balance, 
  onUpdate 
}: MemberCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Side effects
  }, []);

  const handleClick = () => {
    // Event handler
  };

  return (
    <Card>
      <h2>{name}</h2>
      <p>Balance: ₦{balance.toLocaleString()}</p>
    </Card>
  );
}
```

#### File Naming

```
// Components (PascalCase)
MemberCard.tsx
LoanCalculator.tsx
DashboardHeader.tsx

// Pages (kebab-case)
app/member-details/page.tsx
app/loan-application/page.tsx

// Utilities (camelCase)
lib/authUtils.ts
lib/dateFormatter.ts

// Hooks (camelCase with use prefix)
hooks/useCurrentUser.ts
hooks/useLoanCalculator.ts
```

#### Import Order

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Next.js imports
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 3. Third-party libraries
import { format } from 'date-fns';
import { toast } from 'sonner';

// 4. UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 5. Custom components
import { MemberCard } from '@/components/MemberCard';

// 6. Utilities and hooks
import { formatCurrency } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// 7. Types
import type { Member } from '@/types';
```

### CSS/Tailwind Guidelines

#### Tailwind Best Practices

```typescript
// ✅ Good - Organized, readable
<div className="
  flex items-center justify-between
  p-4 rounded-lg
  bg-white shadow-md
  hover:shadow-lg transition-shadow
">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
  <Button className="bg-blue-500 hover:bg-blue-600">Action</Button>
</div>

// ❌ Bad - Hard to read
<div className="flex items-center justify-between p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
```

#### Using `cn` Utility

```typescript
import { cn } from '@/lib/utils';

<Card className={cn(
  "base-styles",
  isActive && "active-styles",
  isDisabled && "disabled-styles"
)}>
```

#### Component Variants with CVA

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        outline: "border border-input bg-transparent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-11 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

---

## 🧩 Component Development

### Shadcn/UI Components

#### Adding New Components

```bash
# Add specific component
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# Components are added to src/components/ui/
```

#### Customizing Components

```typescript
// Modify src/components/ui/button.tsx
// Changes will apply across the app

import { buttonVariants } from './variants';

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

### Creating Custom Components

#### Component Template

```typescript
// src/components/MemberCard.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MemberCardProps {
  member: {
    id: number;
    name: string;
    regNo: string;
    status: 'Active' | 'Inactive';
    balance: number;
  };
  className?: string;
  onClick?: () => void;
}

export function MemberCard({ member, className, onClick }: MemberCardProps) {
  return (
    <Card 
      className={cn("cursor-pointer hover:shadow-lg transition-shadow", className)}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{member.name}</CardTitle>
          <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
            {member.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{member.regNo}</p>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ₦{member.balance.toLocaleString()}
        </div>
        <p className="text-sm text-muted-foreground">Current Balance</p>
      </CardContent>
    </Card>
  );
}
```

### Component Best Practices

1. **Single Responsibility**: One component, one purpose
2. **Reusability**: Make components generic and reusable
3. **Props Interface**: Always define TypeScript interfaces
4. **Default Props**: Use default values for optional props
5. **Composition**: Prefer composition over complex components
6. **Accessibility**: Include ARIA attributes
7. **Error Boundaries**: Wrap components that may fail

---

## 🔌 API Development

### API Route Structure

```typescript
// src/app/api/members/[staffNo]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/members/[staffNo]
export async function GET(
  request: NextRequest,
  { params }: { params: { staffNo: string } }
) {
  try {
    // 1. Authenticate user
    const currentUser = await requireAuth(request);

    // 2. Validate input
    const { staffNo } = params;
    if (!staffNo) {
      return NextResponse.json(
        { success: false, error: 'Staff number required' },
        { status: 400 }
      );
    }

    // 3. Check authorization
    if (currentUser.type !== 'SuperAdmin' && currentUser.staffNo !== staffNo) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 4. Database query
    const pool = getDbPool();
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM MEMBERS WHERE staff_no = ?',
      [staffNo]
    );

    // 5. Handle not found
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    // 6. Return response
    return NextResponse.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/members/[staffNo]
export async function POST(
  request: NextRequest,
  { params }: { params: { staffNo: string } }
) {
  // Implementation
}
```

### API Response Format

```typescript
// Success response
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful" // Optional
}

// Error response
{
  "success": false,
  "error": "Error message",
  "details": { // Optional
    "field": "validation error"
  }
}

// List response with pagination
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### API Best Practices

1. **Authentication**: Always verify user authentication
2. **Authorization**: Check user permissions
3. **Input Validation**: Validate all inputs
4. **Error Handling**: Use try-catch blocks
5. **Status Codes**: Return appropriate HTTP status codes
6. **Logging**: Log errors and important operations
7. **Rate Limiting**: Implement rate limiting (pending)

---

## 🗄️ Database Guidelines

### Query Best Practices

```typescript
// ✅ Good - Parameterized query (prevents SQL injection)
const [rows] = await pool.query(
  'SELECT * FROM MEMBERS WHERE staff_no = ? AND status = ?',
  [staffNo, 'Active']
);

// ❌ Bad - String concatenation (SQL injection vulnerability)
const [rows] = await pool.query(
  `SELECT * FROM MEMBERS WHERE staff_no = '${staffNo}'`
);
```

### Transaction Handling

```typescript
import { getDbPool } from '@/lib/db';

async function transferFunds(fromMember: string, toMember: string, amount: number) {
  const pool = getDbPool();
  const connection = await pool.getConnection();

  try {
    // Start transaction
    await connection.beginTransaction();

    // Debit from sender
    await connection.query(
      'UPDATE MEMBER_BALANCES SET current_balance = current_balance - ? WHERE reg_no = ?',
      [amount, fromMember]
    );

    // Credit to receiver
    await connection.query(
      'UPDATE MEMBER_BALANCES SET current_balance = current_balance + ? WHERE reg_no = ?',
      [amount, toMember]
    );

    // Record transaction
    await connection.query(
      'INSERT INTO TRANSACTIONS (reg_no, amount, description) VALUES (?, ?, ?)',
      [fromMember, -amount, `Transfer to ${toMember}`]
    );

    // Commit transaction
    await connection.commit();

    return { success: true };

  } catch (error) {
    // Rollback on error
    await connection.rollback();
    throw error;

  } finally {
    // Release connection
    connection.release();
  }
}
```

### Database Migrations

```sql
-- migrations/001_add_email_verification.sql
-- Add email_verified column to USERS table

ALTER TABLE USERS ADD COLUMN email_verified TINYINT(1) DEFAULT 0 AFTER email;
ALTER TABLE USERS ADD COLUMN verification_token VARCHAR(255) AFTER email_verified;
ALTER TABLE USERS ADD COLUMN verification_expiry TIMESTAMP NULL AFTER verification_token;

-- Update existing users to verified
UPDATE USERS SET email_verified = 1 WHERE login_status = 'Active';
```

---

## 🧪 Testing Guidelines

### Unit Testing (Pending Implementation)

```typescript
// __tests__/lib/utils.test.ts
import { formatCurrency, calculateInterest } from '@/lib/utils';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('formats numbers with commas and 2 decimals', () => {
      expect(formatCurrency(1000)).toBe('1,000.00');
      expect(formatCurrency(1234567.89)).toBe('1,234,567.89');
    });

    it('handles null and undefined', () => {
      expect(formatCurrency(null)).toBe('0.00');
      expect(formatCurrency(undefined)).toBe('0.00');
    });
  });

  describe('calculateInterest', () => {
    it('calculates simple interest correctly', () => {
      const result = calculateInterest(10000, 5, 12);
      expect(result).toBe(500);
    });
  });
});
```

### Component Testing (Pending)

```typescript
// __tests__/components/MemberCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemberCard } from '@/components/MemberCard';

describe('MemberCard', () => {
  const mockMember = {
    id: 1,
    name: 'John Doe',
    regNo: 'REG-001',
    status: 'Active',
    balance: 50000,
  };

  it('renders member information', () => {
    render(<MemberCard member={mockMember} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('REG-001')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<MemberCard member={mockMember} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 👀 Code Review Process

### Before Submitting PR

**Checklist**:
- [ ] Code follows coding standards
- [ ] All tests pass (when available)
- [ ] No console.log statements (unless intentional)
- [ ] No commented-out code
- [ ] TypeScript types are properly defined
- [ ] Error handling is in place
- [ ] Code is documented (if complex)
- [ ] UI is responsive
- [ ] Accessibility considerations

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
- [ ] Tested locally
- [ ] Tested on staging
- [ ] Manual testing performed

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review performed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

### Review Guidelines

#### For Reviewers

1. **Be Respectful**: Provide constructive feedback
2. **Check Logic**: Verify business logic is correct
3. **Security**: Look for security vulnerabilities
4. **Performance**: Consider performance implications
5. **Consistency**: Ensure code follows project patterns
6. **Test**: Pull branch and test locally if needed

#### For Authors

1. **Respond Promptly**: Address review comments quickly
2. **Explain Decisions**: Justify your approach when questioned
3. **Accept Feedback**: Be open to suggestions
4. **Update Documentation**: Keep docs in sync with code

---

## 🚀 Deployment Process

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup created
- [ ] Rollback plan prepared

### Deployment Platforms

This project can be deployed to multiple platforms:
- **cPanel Hosting**: For shared hosting environments
- **Vercel**: Recommended for Next.js applications (easiest)
- **DigitalOcean/VPS**: For full control and scalability
- **AWS**: For enterprise-grade deployments

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for each platform.**

### Quick Deployment Steps

#### 1. Build Application

```bash
# Run build
npm run build

# Verify build
npm run start
```

#### 2. Database Migration

```bash
# Run migrations on staging first
mysql -h staging-db -u user -p database < migration.sql

# Verify migration
mysql -h staging-db -u user -p -e "DESCRIBE TABLE_NAME;"
```

#### 3. Deploy to Staging

```bash
# Deploy to staging environment
# Test all functionality
# Get stakeholder approval
```

#### 4. Deploy to Production

```bash
# Deploy to production
# Monitor logs
# Verify functionality
```

### Post-deployment

1. **Monitor**: Watch error logs and metrics
2. **Verify**: Test critical user flows
3. **Communicate**: Notify team of successful deployment
4. **Document**: Update changelog

### Rollback Procedure

```bash
# If issues detected
git checkout previous-stable-tag
npm run build
# Deploy previous version
```

**For detailed platform-specific instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Fails

```bash
# Check environment variables
echo $DB_HOST
echo $DB_USER

# Test MySQL connection
mysql -h $DB_HOST -u $DB_USER -p

# Check if database exists
mysql -e "SHOW DATABASES;"
```

#### JWT Token Issues

```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# Regenerate if needed
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Build Errors

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install

# Rebuild
npm run build
```

#### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update types
npm install --save-dev @types/node @types/react
```

---

## 📞 Getting Help

### Resources

- **Documentation**: Check this WORKFLOW.md, README.md, and PRD.md
- **Team Chat**: Slack/Discord (if applicable)
- **Issues**: Create GitHub issue for bugs
- **Stack Overflow**: Search for Next.js, React, TypeScript questions

### Contacts

- **Technical Lead**: [contact]
- **DevOps**: [contact]
- **Product Manager**: [contact]

---

Made with 💜 for cooperative excellence | © 2025 Corporate Cooperative Management System

