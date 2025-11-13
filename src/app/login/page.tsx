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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { TrendingUp, TrendingDown, Users, ShoppingCart, Eye, EyeOff, Mail, Lock, Sparkles, AlertCircle } from "lucide-react";
import { authApi } from '@/lib/api-client';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use PHP API instead of old Next.js API route
      const response = await authApi.login(identifier, password);

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      console.log('Login successful:', response.data);
      
      // Token is automatically saved by authApi.login()
      // Optionally save user data to localStorage
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      router.push('/dashboard'); // Redirect to dashboard on success

    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/30 flex relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float"></div>
      </div>

      {/* Left Side - Branding & Illustration */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden z-10">
        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center elevation-2">
            {companyLogo ? (
              <img src={companyLogo} alt="Logo" className="w-full h-full object-contain p-1.5" />
            ) : (
              <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
          </div>
          <span className="text-2xl font-bold text-foreground">{companyName}</span>
        </div>

        {/* Floating Stats Cards - Enhanced */}
        <div className="absolute top-32 left-12 animate-float">
          <Card className="w-52 elevation-3 border border-green-200/20 bg-gradient-to-br from-card to-green-50/30 dark:from-card dark:to-green-900/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-bold">+22%</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">155k</h3>
              <p className="text-sm font-medium text-muted-foreground">Total Registered Members</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Last 4 Month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="absolute top-24 right-16 animate-float-delay-1">
          <Card className="w-52 elevation-3 border border-primary/20 bg-gradient-to-br from-card to-primary/5 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                  <TrendingDown className="w-3 h-3" />
                  <span className="text-xs font-bold">8.1%</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">2,856</h3>
              <p className="text-sm font-medium text-muted-foreground">New Customers</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="absolute bottom-32 right-24 animate-float-delay-2">
          <Card className="w-60 elevation-3 border border-cyan-200/20 bg-gradient-to-br from-card to-cyan-50/30 dark:from-card dark:to-cyan-900/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-3xl font-bold text-foreground">$38.5k</h3>
                  <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-bold">+62%</span>
                </div>
              </div>
              <div className="h-20 relative">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00acc1" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00acc1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="url(#chartGradient)"
                    stroke="none"
                    points="0,40 0,30 15,25 30,28 45,20 60,15 75,18 90,10 100,8 100,40"
                  />
                  <polyline
                    fill="none"
                    stroke="#00acc1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="0,30 15,25 30,28 45,20 60,15 75,18 90,10 100,8"
                  />
                  <circle cx="100" cy="8" r="4" fill="#00acc1" className="animate-pulse" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Character Illustration - Enhanced */}
        <div className="relative z-10 group">
          {/* Glow effect behind character */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl scale-110 opacity-50 group-hover:opacity-70 transition-opacity"></div>
          
          <svg className="w-96 h-96 relative z-10 drop-shadow-2xl" viewBox="0 0 200 240" fill="none">
            {/* Shadow */}
            <ellipse cx="100" cy="220" rx="40" ry="8" fill="#000" opacity="0.1" />
            
            {/* Legs */}
            <rect x="80" y="145" width="15" height="70" rx="7" fill="#2c2c2c" />
            <rect x="105" y="145" width="15" height="70" rx="7" fill="#2c2c2c" />
            
            {/* Shoes */}
            <ellipse cx="87" cy="215" rx="12" ry="8" fill="#1a1a1a" />
            <ellipse cx="113" cy="215" rx="12" ry="8" fill="#1a1a1a" />
            
            {/* Body */}
            <rect x="70" y="85" width="60" height="65" rx="30" fill="#673ab7" />
            
            {/* Arms */}
            <rect x="50" y="95" width="18" height="50" rx="9" fill="#f5d4b0" />
            <rect x="132" y="95" width="18" height="50" rx="9" fill="#f5d4b0" />
            
            {/* Hands - Holding tablet */}
            <circle cx="59" cy="145" r="8" fill="#f5d4b0" />
            <circle cx="141" cy="145" r="8" fill="#f5d4b0" />
            
            {/* Tablet/Device */}
            <rect x="70" y="120" width="60" height="45" rx="4" fill="#1a1a1a" className="elevation-2" />
            <rect x="75" y="125" width="50" height="35" rx="2" fill="#5e35b1" opacity="0.3" />
            
            {/* Code lines on tablet */}
            <line x1="80" y1="130" x2="110" y2="130" stroke="#9575cd" strokeWidth="2" opacity="0.6" />
            <line x1="80" y1="137" x2="105" y2="137" stroke="#7e57c2" strokeWidth="2" opacity="0.6" />
            <line x1="80" y1="144" x2="115" y2="144" stroke="#b39ddb" strokeWidth="2" opacity="0.6" />
            <line x1="80" y1="151" x2="100" y2="151" stroke="#9575cd" strokeWidth="2" opacity="0.6" />
            
            {/* Neck */}
            <rect x="90" y="75" width="20" height="12" rx="5" fill="#f5d4b0" />
            
            {/* Head */}
            <circle cx="100" cy="55" r="28" fill="#f5d4b0" />
            
            {/* Hair */}
            <path d="M 75 50 Q 72 35 85 30 Q 100 25 115 30 Q 128 35 125 50" fill="#4a3728" />
            
            {/* Glasses */}
            <rect x="80" y="50" width="16" height="16" rx="8" fill="none" stroke="#333" strokeWidth="2.5" opacity="0.7" />
            <rect x="104" y="50" width="16" height="16" rx="8" fill="none" stroke="#333" strokeWidth="2.5" opacity="0.7" />
            <line x1="96" y1="58" x2="104" y2="58" stroke="#333" strokeWidth="2.5" opacity="0.7" />
            
            {/* Eyes behind glasses */}
            <circle cx="88" cy="56" r="4" fill="#333" opacity="0.8" />
            <circle cx="112" cy="56" r="4" fill="#333" opacity="0.8" />
            
            {/* Smile */}
            <path d="M 85 68 Q 100 73 115 68" stroke="#d4a574" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Floating elements around character */}
            <g className="animate-float" opacity="0.6">
              <circle cx="40" cy="80" r="6" fill="#5e35b1" />
              <circle cx="42" cy="78" r="3" fill="#7e57c2" />
            </g>
            <g className="animate-float-delay-1" opacity="0.6">
              <circle cx="160" cy="100" r="8" fill="#00acc1" />
              <circle cx="162" cy="97" r="4" fill="#26c6da" />
            </g>
            <g className="animate-float-delay-2" opacity="0.6">
              <path d="M 150 50 L 155 55 L 150 60 L 145 55 Z" fill="#fb8c00" />
            </g>
          </svg>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8 relative">
          {/* Decorative glassmorphism card behind form */}
          <div className="absolute inset-0 bg-card/40 backdrop-blur-xl rounded-3xl -z-10 elevation-4"></div>
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center elevation-2">
                {companyLogo ? (
                  <img src={companyLogo} alt="Logo" className="w-full h-full object-contain p-1.5" />
                ) : (
                  <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
              <span className="text-xl font-bold text-foreground">{companyName}</span>
            </div>
          </div>

          {/* Welcome Header */}
          <div className="space-y-3 p-6 lg:p-8">
            <div className="inline-block">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-gradient">
                Welcome to {companyName}! 👋
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mt-2"></div>
            </div>
            <p className="text-muted-foreground text-lg">
              Please sign-in to your account and start the adventure
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 p-6 lg:p-8">
            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border-2 border-destructive/20 flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email or Username
              </Label>
              <div className="relative group">
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or username"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  required
                  className="h-12 border-2 border-border focus:border-primary pl-11 transition-all duration-300 group-hover:border-primary/50"
                />
                <Mail className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-hover:text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="h-12 border-2 border-border focus:border-primary pl-11 pr-11 transition-all duration-300 group-hover:border-primary/50"
                />
                <Lock className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-hover:text-primary" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Remember Me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </Button>

            <div className="text-center relative">
              <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 border border-primary/10">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <p className="text-sm text-muted-foreground">
                  New on our platform?{' '}
                  <Link href="/register" className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-colors inline-flex items-center gap-1">
                    Create an account
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 