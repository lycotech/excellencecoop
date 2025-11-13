'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

// Placeholder for fetching user data - replace with actual logic
// e.g., fetch from context, zustand store, or server component prop
const useUser = () => {
  // In a real app, you would get this from the JWT payload decoded
  // in middleware or fetched based on the session.
  // For now, let's use a placeholder.
  return {
    name: "Admin User",
    initials: "AU", // Fallback initials
    imageUrl: undefined, // Or a URL string like "/path/to/avatar.jpg"
  };
};

interface HeaderProps {
  userType?: string | null;
}

export function Header({ userType }: HeaderProps = {}) {
  const router = useRouter();
  const user = useUser();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Redirect to login page after successful logout
      router.push('/login');
      router.refresh(); // Refresh state after logout
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error (e.g., show a toast message)
    }
  };

  return (
    <header className="flex h-16 items-center gap-4 px-4 md:px-6 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/75 border-b border-border/50 shadow-sm">
      {/* Mobile Navigation */}
      <MobileNav userType={userType || null} />
      
      {/* Page title with vibrant styling */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
        <div>
          <div className="text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Dashboard</div>
          <div className="hidden sm:block text-xs text-muted-foreground">Cooperative Management</div>
        </div>
      </div>
      
      {/* Header actions */}
      <div className="ml-auto flex items-center gap-4">
        {/* Theme Toggle with vibrant styling */}
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-100/50 dark:border-blue-800/50">
          <ThemeToggle />
        </div>
        
        {/* User menu with enhanced avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-transparent bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:border-blue-200 transition-all duration-200">
              <Avatar className="h-9 w-9">
                {user.imageUrl && <AvatarImage src={user.imageUrl} alt={user.name} />}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold">{user.initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 shadow-lg border border-border">
            <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {user.imageUrl && <AvatarImage src={user.imageUrl} alt={user.name} />}
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-bold">{user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Corporate Member</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-3 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 mr-3">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-3 px-3 rounded-md hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900 mr-3">
                <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 