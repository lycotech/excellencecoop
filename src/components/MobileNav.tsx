'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

// Import menu items from Sidebar (or redefine)
import {
  Users,
  CreditCard,
  HandCoins,
  ReceiptText,
  AreaChart,
  Settings,
  SlidersHorizontal,
  UserCog,
  UserCheck,
  UploadCloud,
  UserCircle,
  BookUser,
  FileText,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: MenuItem[];
  roles?: string[];
}

const adminMenu: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Member",
    href: "/dashboard/member",
    icon: Users,
    roles: ["SuperAdmin"],
    subItems: [
      { name: "Manage Users", href: "/dashboard/member/manage-users", icon: UserCog, roles: ["SuperAdmin"] },
      { name: "Membership Approval", href: "/dashboard/member/membership-approval", icon: UserCheck, roles: ["SuperAdmin"] },
      { name: "Upload User", href: "/dashboard/member/upload-user", icon: UploadCloud, roles: ["SuperAdmin"] },
    ],
  },
  { name: "Contribution", href: "/dashboard/contribution", icon: CreditCard, roles: ["SuperAdmin"] },
  { name: "Loan", href: "/dashboard/loan", icon: HandCoins, roles: ["SuperAdmin"] },
  { name: "Transactions", href: "/dashboard/transactions", icon: ReceiptText, roles: ["SuperAdmin"] },
  { name: "Reports", href: "/dashboard/reports", icon: AreaChart, roles: ["SuperAdmin"] },
  { name: "Admin Settings", href: "/dashboard/admin-settings", icon: Settings, roles: ["SuperAdmin"] },
  { name: "Preferences", href: "/dashboard/preferences", icon: SlidersHorizontal },
];

const memberMenu: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Personal Details",
    href: "#",
    icon: UserCircle,
    subItems: [
      { name: "View/Update Details", href: "/dashboard/personal/details", icon: UserCog },
      { name: "Membership Form", href: "/dashboard/personal/membership-form", icon: BookUser },
    ]
  },
  { name: "Transaction Details", href: "/dashboard/member-transactions", icon: FileText },
  {
    name: "Contributions",
    href: "#",
    icon: CreditCard,
    subItems: [
      { name: "Monthly Contribution", href: "/dashboard/personal/contribution-change", icon: CreditCard },
      { name: "Contribution History", href: "/dashboard/member-contributions", icon: FileText },
    ]
  },
  {
    name: "Loan",
    href: "#",
    icon: HandCoins,
    subItems: [
      { name: "My Loans", href: "/dashboard/personal/loans", icon: ReceiptText },
      { name: "Apply for loan", href: "/dashboard/loan/apply", icon: FileCheck2 },
      { name: "Guarantor", href: "/dashboard/loan/guarantor", icon: ShieldCheck },
    ],
  },
];

interface MobileNavProps {
  userType: string | null;
}

export function MobileNav({ userType }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({});

  // Determine which menu to use
  const menuItems = userType === 'Member' ? memberMenu : adminMenu;

  // Filter menu items based on user type
  const filteredMenuItems = menuItems.filter(item => {
    const hasAccess = !item.roles || item.roles.includes(userType || '');
    if (!hasAccess) return false;

    if (item.subItems) {
      const visibleSubItems = item.subItems.filter(sub => 
        !sub.roles || sub.roles.includes(userType || '')
      );
      return visibleSubItems.length > 0;
    }
    return true;
  });

  const handleOpenChange = (itemName: string, isOpen: boolean) => {
    setOpenState(prev => ({ ...prev, [itemName]: isOpen }));
  };

  const renderLink = (item: MenuItem, isSubItem = false) => {
    const isActiveStrict = pathname === item.href;
    const isActiveBranch = item.href !== '#' && item.href !== '/dashboard' && pathname.startsWith(item.href);
    const isActive = isActiveStrict || isActiveBranch;

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
          isSubItem && "pl-8 py-2",
          isActive
            ? isSubItem 
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500"
              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
            : "hover:bg-blue-50 dark:hover:bg-blue-950 text-foreground"
        )}
      >
        <item.icon className="h-4 w-4 flex-shrink-0" />
        {item.name}
      </Link>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-6 border-b border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Coop Portal
              </SheetTitle>
              <p className="text-xs text-muted-foreground font-medium">Management System</p>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            if (item.subItems && item.subItems.length > 0) {
              const isParentActive = item.subItems.some(sub => sub.href !== '#' && pathname.startsWith(sub.href));
              const isOpen = openState[item.name] ?? false;

              return (
                <Collapsible
                  key={item.name}
                  open={isOpen}
                  onOpenChange={(open) => handleOpenChange(item.name, open)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isParentActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                          : "hover:bg-blue-50 dark:hover:bg-blue-950 text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {item.name}
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isOpen && "rotate-90"
                        )}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-1">
                    {item.subItems.map((subItem) => renderLink(subItem, true))}
                  </CollapsibleContent>
                </Collapsible>
              );
            } else if (!item.subItems) {
              return renderLink(item);
            }
            return null;
          })}
        </nav>

        <div className="p-4 border-t border-border bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50">
          <div className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {userType ? `✨ ${userType} Portal` : '👋 Guest User'}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}



