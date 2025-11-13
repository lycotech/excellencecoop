'use client';

import { useState } from 'react';
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
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Even on errors like 404 (user not found), show a generic message
        // to avoid revealing if an email/identifier is registered.
        // Only reveal specific errors for server issues (500).
        if (response.status >= 500) {
           throw new Error(data.error || 'Failed to process request due to a server error.');
        } else {
             // For 4xx errors (like user not found), still show the generic success message.
             setMessage('If an account with that email or staff number exists, a password reset link has been sent.');
             console.log("Potential user not found or other client error, but showing generic message.", data.error);
        }
      } else {
         setMessage('If an account with that email or staff number exists, a password reset link has been sent.');
      }

    } catch (err) {
      console.error("Request password reset error:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error("Error", { description: errorMessage }); // Show toast on actual error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center elevation-2">
            <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Forgot Password?
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Enter your email or staff number to reset your password</p>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-xl font-semibold">Reset Password</CardTitle>
              <CardDescription>
                We'll send you a secure link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  Email / Staff Number
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="m@example.com or M001"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {message && (
                <div className="p-3 text-sm text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                  {message}
                </div>
              )}
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                  {error}
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
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          © 2025 Corporate Cooperative Management System
        </div>
      </div>
    </div>
  );
} 