# 📚 UI Component Examples & Usage Guide

## Corporate Cooperative Management System - Component Examples

---

## 🎨 Dark Mode

### Basic Usage

The dark mode is automatically available throughout the app via the theme toggle in the header.

```tsx
// Users can switch themes via the header dropdown
// Themes: Light | Dark | System
```

### Programmatic Control

```tsx
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
```

### Dark Mode Tailwind Classes

```tsx
// Use dark: prefix for dark mode styles
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-blue-600 dark:text-blue-400">
    This adapts to theme
  </h1>
</div>
```

---

## ⏳ Loading Skeletons

### Dashboard Cards

```tsx
import { DashboardCardSkeleton, StatsGridSkeleton } from '@/components/ui/loading-skeletons';

export function DashboardStats() {
  const { data, isLoading } = useDashboardData();
  
  if (isLoading) {
    return <StatsGridSkeleton count={4} />;
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {data.map(stat => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}
```

### Data Tables

```tsx
import { TableSkeleton } from '@/components/ui/loading-skeletons';

export function MembersTable() {
  const { members, isLoading } = useMembers();
  
  if (isLoading) {
    return <TableSkeleton rows={10} columns={6} />;
  }
  
  return (
    <Table>
      {/* ... table content */}
    </Table>
  );
}
```

### Forms

```tsx
import { FormSkeleton } from '@/components/ui/loading-skeletons';

export function MemberForm() {
  const { isLoading } = useFormData();
  
  if (isLoading) {
    return <FormSkeleton fields={8} />;
  }
  
  return (
    <form>{/* ... form fields */}</form>
  );
}
```

### Full Page Loading

```tsx
import { PageSkeleton } from '@/components/ui/loading-skeletons';

export default function ReportsPage() {
  const { data, isLoading } = useReports();
  
  if (isLoading) {
    return <PageSkeleton />;
  }
  
  return (
    <div>
      <h1>Reports</h1>
      {/* ... page content */}
    </div>
  );
}
```

---

## ♿ Accessibility

### Skip to Content

Already included in dashboard layout - no additional code needed!

```tsx
// In your root layout
import { SkipToContent } from '@/components/AccessibleComponent';

<SkipToContent />
// ... rest of layout
```

### Live Announcements

```tsx
'use client';

import { useAnnouncer } from '@/components/AccessibleComponent';
import { Button } from '@/components/ui/button';

export function SaveButton() {
  const { announce } = useAnnouncer();
  const [loading, setLoading] = useState(false);
  
  const handleSave = async () => {
    setLoading(true);
    try {
      await saveData();
      announce("Data saved successfully");
    } catch (error) {
      announce("Failed to save data");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button onClick={handleSave} disabled={loading}>
      {loading ? 'Saving...' : 'Save'}
    </Button>
  );
}
```

### Accessible Buttons

```tsx
import { AccessibleButton } from '@/components/AccessibleComponent';

export function SubmitForm() {
  const [loading, setLoading] = useState(false);
  
  return (
    <AccessibleButton
      onClick={handleSubmit}
      ariaLabel="Submit registration form"
      loading={loading}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg"
    >
      Submit Form
    </AccessibleButton>
  );
}
```

### Accessible Form Fields

```tsx
import { AccessibleFormField } from '@/components/AccessibleComponent';
import { Input } from '@/components/ui/input';

export function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  return (
    <form>
      <AccessibleFormField
        id="email"
        label="Email Address"
        required
        error={error}
        description="We'll never share your email with anyone else."
      >
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
      </AccessibleFormField>
    </form>
  );
}
```

### Keyboard Navigation

```tsx
import { useKeyboardNavigation } from '@/components/AccessibleComponent';

export function Modal({ isOpen, onClose }) {
  // Escape closes the modal
  useKeyboardNavigation(onClose);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="bg-white p-6 rounded-lg">
        {/* Modal content */}
      </div>
    </div>
  );
}
```

---

## 💬 Tooltips

### Basic Tooltip

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function InfoTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center">
            <Info className="h-4 w-4 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is helpful information</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

### Tooltip with Rich Content

```tsx
export function DetailedTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted cursor-help">
            Interest Rate
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">How Interest is Calculated</p>
            <p className="text-sm">
              Interest is calculated monthly at 2% per annum on the outstanding balance.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

### Form Field with Tooltip

```tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function FormFieldWithTooltip() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="amount">Loan Amount</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Maximum loan amount is 3x your contribution balance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input
        id="amount"
        type="number"
        placeholder="Enter amount"
      />
    </div>
  );
}
```

---

## 📱 Mobile Navigation

### Automatic Mobile Menu

The mobile navigation is automatically included in the Header component:

```tsx
// No additional code needed!
// Mobile menu appears automatically on screens < 768px

// Component structure:
<Header userType={userType} />
  ├── <MobileNav />  // Shows on mobile
  └── Desktop actions // Shows on desktop
```

### Custom Mobile Behavior

```tsx
'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div>
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}

// Create the hook if it doesn't exist
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}
```

---

## 🎯 Common Patterns

### Loading State Pattern

```tsx
export function DataComponent() {
  const { data, isLoading, error } = useData();
  
  // Loading state
  if (isLoading) {
    return <TableSkeleton />;
  }
  
  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load data</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }
  
  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data found</p>
      </div>
    );
  }
  
  // Success state
  return (
    <div>
      {data.map(item => (
        <ItemCard key={item.id} {...item} />
      ))}
    </div>
  );
}
```

### Dark Mode Aware Colors

```tsx
// Using Tailwind dark mode classes
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>

// Using CSS variables (preferred)
<div className="bg-card text-card-foreground">
  <h1 className="text-foreground">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Responsive Grid Pattern

```tsx
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {items.map(item => (
    <Card key={item.id}>
      {/* Card content */}
    </Card>
  ))}
</div>
```

### Accessible Modal Pattern

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AccessibleDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎨 Styling Best Practices

### Use CSS Variables

```tsx
// ✅ Good - Uses theme variables
<div className="bg-card text-card-foreground border border-border">

// ❌ Bad - Hardcoded colors
<div className="bg-white text-black border border-gray-200">
```

### Dark Mode Support

```tsx
// ✅ Good - Works in both themes
<div className="bg-background text-foreground">

// ✅ Also Good - Explicit dark mode
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// ❌ Bad - No dark mode support
<div className="bg-white text-black">
```

### Mobile First

```tsx
// ✅ Good - Mobile first approach
<div className="text-sm md:text-base lg:text-lg">

// ❌ Bad - Desktop first
<div className="text-lg lg:text-base sm:text-sm">
```

---

## 📦 Component Checklist

When creating new components:

- [ ] Dark mode support (test in both themes)
- [ ] Loading state (use skeleton components)
- [ ] Empty state (when no data)
- [ ] Error state (when data fails to load)
- [ ] Mobile responsive (test on small screens)
- [ ] Keyboard accessible (tab navigation)
- [ ] Screen reader friendly (ARIA labels)
- [ ] Proper semantic HTML
- [ ] TypeScript types defined
- [ ] Props documented

---

## 🚀 Quick Start Templates

### Page Template

```tsx
'use client';

import { useState, useEffect } from 'react';
import { PageSkeleton } from '@/components/ui/loading-skeletons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  if (isLoading) {
    return <PageSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Title</h1>
        <p className="text-muted-foreground">Page description</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Section</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Content */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Form Template

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnnouncer } from '@/components/AccessibleComponent';
import { toast } from 'sonner';

export function MyForm() {
  const router = useRouter();
  const { announce } = useAnnouncer();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed');
      
      toast.success('Form submitted successfully');
      announce('Form submitted successfully');
      router.push('/success');
    } catch (error) {
      toast.error('Failed to submit form');
      announce('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
```

---

Made with 💜 for cooperative excellence | © 2025 Corporate Cooperative Management System



