'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  const [staffNo, setStaffNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('Corporate Cooperative');
  const router = useRouter();

  // Load company branding
  useEffect(() => {
    const logo = localStorage.getItem('companyLogo');
    const name = localStorage.getItem('companyName');
    
    if (logo) setCompanyLogo(logo);
    if (name) setCompanyName(name);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_no: staffNo, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      console.log('Registration successful:', data);
      setSuccess('Registration successful! Redirecting to login...');
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo/Branding Section */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 bg-primary rounded-lg flex items-center justify-center elevation-2 overflow-hidden">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Join {companyName}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Create your account to get started</p>
          </div>
        </div>

        {/* Register Card */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-xl font-semibold">Create Your Account</CardTitle>
              <CardDescription>
                Fill in your details to join our cooperative
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staff-no">
                  Staff Number
                </Label>
                <Input
                  id="staff-no"
                  placeholder="Enter your staff number"
                  value={staffNo}
                  onChange={(e) => setStaffNo(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="member@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-sm text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                  {success}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          © 2025 Corporate Cooperative Management System
        </div>
      </div>
    </div>
  );
} 