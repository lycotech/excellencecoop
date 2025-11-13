import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDbPool } from "@/lib/db"; // Import DB pool function
import mysql from 'mysql2/promise'; // Import mysql types
import { 
  Users, 
  PiggyBank, 
  HandCoins, 
  Shield, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

// Function to test DB connection
async function checkDbConnection(): Promise<{ connected: boolean; error: string | null }> {
  let connection: mysql.PoolConnection | null = null;
  try {
    console.log("Checking DB connection...");
    const pool = getDbPool();
    if (!pool) {
      return { connected: false, error: "Database pool not initialized - check environment variables" };
    }
    connection = await pool.getConnection();
    // Simple query to test connection
    await connection.query('SELECT 1');
    console.log("DB Connection Successful!");
    return { connected: true, error: null };
  } catch (error) {
    console.error("DB Connection Failed:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { connected: false, error: errorMessage };
  } finally {
    if (connection) {
      try {
        connection.release();
        console.log("DB Connection released.");
      } catch (releaseError) {
        console.error("DB Release Error:", releaseError);
      }
    }
  }
}

// Make the component async to perform server-side actions
export default async function Home() {

  // Check DB connection status on the server when the page loads
  const dbStatus = await checkDbConnection();

  return (
    <div className="min-h-screen bg-background">
      {/* Database Status Bar */}
      <div className="bg-card elevation-1">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">System Status:</span>
              {dbStatus.connected ? (
                <Badge>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
            {dbStatus.error && (
              <span className="text-xs text-muted-foreground truncate max-w-md">
                {dbStatus.error}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="mx-auto w-20 h-20 bg-primary rounded-lg flex items-center justify-center mb-6 elevation-2">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
              Corporate Cooperative<br />
              Management System
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your cooperative operations with our comprehensive platform for managing 
              contributions, loans, and member activities
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/login">
              <Button size="lg" className="min-w-[200px]">
                Login to Your Account
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Register as Member
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:elevation-3 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg font-semibold">Member Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Comprehensive member registration, profile management, and status tracking with intuitive dashboards
              </p>
            </CardContent>
          </Card>

          <Card className="hover:elevation-3 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-[#388e3c] rounded-lg flex items-center justify-center mb-4">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Contribution Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Monitor monthly contributions, savings balance, and financial growth with analytics
              </p>
            </CardContent>
          </Card>

          <Card className="hover:elevation-3 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-[#7b1fa2] rounded-lg flex items-center justify-center mb-4">
                <HandCoins className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Loan Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Apply for loans, track repayments, and manage approvals with streamlined workflows
              </p>
            </CardContent>
          </Card>

          <Card className="hover:elevation-3 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-[#f57c00] rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Secure Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Advanced security features with role-based access and enterprise-grade data protection
              </p>
            </CardContent>
          </Card>

          <Card className="hover:elevation-3 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-[#0097a7] rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Detailed financial reports and interactive analytics for data-driven decision making
              </p>
            </CardContent>
          </Card>

          <Card className="hover:elevation-3 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg font-semibold">Real-time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Stay updated with instant notifications, live status changes, and real-time synchronization
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-primary rounded-lg p-12 text-center elevation-3">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">
            Ready to Transform Your Cooperative?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-6 max-w-2xl mx-auto">
            Join cooperatives using our platform to streamline operations and empower members
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="min-w-[250px]">
              Create Your Account Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card elevation-1 py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Corporate Cooperative Management System
          </p>
        </div>
      </footer>
    </div>
  );
}
