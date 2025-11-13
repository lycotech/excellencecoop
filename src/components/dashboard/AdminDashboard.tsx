'use client'; // Mark as client component for hooks

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Users,
  UserCheck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Smartphone,
  Briefcase,
} from 'lucide-react';
import { StatsCard, cardColorSchemes } from './StatsCard';
import { WelcomeCard } from './WelcomeCard';
import { DonutChart, LineChartCard, BarChartCard } from './Charts';
import { ProjectList, ProjectTimeline } from './ProjectList';
import { StatsGridSkeleton } from '@/components/ui/loading-skeletons';

// Interface for fetched dashboard data
interface DashboardData {
    totalSavings: number | null;
    totalCommodity: number | null;
    totalActiveMembers: number;
    totalApplicants: number;
    loanCounts: {
        total: number;
        declined: number;
        pending: number;
        active: number;
    };
    memberLoanStats: {
        totalActiveMembers: number;
        membersOnActiveLoan: number;
    };
}

// Helper to safely calculate percentage (copied from original page.tsx)
const calculatePercentage = (part: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
}

// Helper to format currency (copied from original page.tsx)
const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '0.00';
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// This is now the Admin Dashboard Component
export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/dashboard/summary'); // Admin summary endpoint
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch admin dashboard data');
        }
        const result: DashboardData = await response.json();
        setData(result);
      } catch (err) {
        console.error("Fetch admin dashboard data error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const loanSummary = data ? {
    totalLoan: {
        value: data.loanCounts.total,
        percentage: 100
    },
    declined: {
        value: data.loanCounts.declined,
        percentage: calculatePercentage(data.loanCounts.declined, data.loanCounts.total)
    },
    pending: {
        value: data.loanCounts.pending,
        percentage: calculatePercentage(data.loanCounts.pending, data.loanCounts.total)
    },
    active: {
        value: data.loanCounts.active,
        percentage: calculatePercentage(data.loanCounts.active, data.loanCounts.total)
    },
    membersOnLoan: {
        value: data.memberLoanStats.membersOnActiveLoan,
        percentage: calculatePercentage(data.memberLoanStats.membersOnActiveLoan, data.memberLoanStats.totalActiveMembers)
    },
    membersWithoutLoan: {
        value: data.memberLoanStats.totalActiveMembers - data.memberLoanStats.membersOnActiveLoan,
        percentage: calculatePercentage(
            data.memberLoanStats.totalActiveMembers - data.memberLoanStats.membersOnActiveLoan,
            data.memberLoanStats.totalActiveMembers
        )
    },
  } : { // Default values for loading
    totalLoan: { value: 0, percentage: 0 },
    declined: { value: 0, percentage: 0 },
    pending: { value: 0, percentage: 0 },
    active: { value: 0, percentage: 0 },
    membersOnLoan: { value: 0, percentage: 0 },
    membersWithoutLoan: { value: 0, percentage: 0 },
  };


  // Sample data for charts (replace with real data from API)
  const weeklyData = [
    { name: 'Mon', value: 30000 },
    { name: 'Tue', value: 20000 },
    { name: 'Wed', value: 45000 },
    { name: 'Thu', value: 35000 },
    { name: 'Fri', value: 50000 },
    { name: 'Sat', value: 40000 },
    { name: 'Sun', value: 30000 },
  ];

  const memberActivityData = [
    { name: 'Active', value: data?.totalActiveMembers || 0, color: '#3b82f6' },
    { name: 'Inactive', value: 15, color: '#ef4444' },
    { name: 'Pending', value: data?.totalApplicants || 0, color: '#f59e0b' },
  ];

  const projectsData = [
    {
      id: '1',
      name: 'Loan Processing',
      icon: <DollarSign className="w-5 h-5 text-purple-600" />,
      iconBgColor: 'bg-purple-100 dark:bg-purple-900/50',
      tasks: { completed: loanSummary.active.value, total: loanSummary.totalLoan.value },
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Member Applications',
      icon: <UserCheck className="w-5 h-5 text-green-600" />,
      iconBgColor: 'bg-green-100 dark:bg-green-900/50',
      tasks: { completed: data?.totalActiveMembers || 0, total: (data?.totalActiveMembers || 0) + (data?.totalApplicants || 0) },
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'Contributions',
      icon: <Wallet className="w-5 h-5 text-blue-600" />,
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/50',
      tasks: { completed: 85, total: 100 },
      status: 'active' as const,
    },
  ];

  const timelineData = [
    {
      id: '1',
      title: 'Contribution Processing',
      assignee: 'Finance Team',
      progress: 80,
      color: '#3b82f6',
      endDate: 'Dec 2025',
    },
    {
      id: '2',
      title: 'Loan Approvals',
      assignee: 'Admin Team',
      progress: 60,
      color: '#10b981',
      endDate: 'Jan 2026',
    },
    {
      id: '3',
      title: 'Member Onboarding',
      assignee: 'HR Team',
      progress: 45,
      color: '#f59e0b',
      endDate: 'Feb 2026',
    },
  ];

  // Render Logic
  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatsGridSkeleton count={4} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="h-96 animate-pulse">
              <CardContent className="p-6 h-full bg-muted/50 rounded-lg" />
            </Card>
          </div>
          <Card className="h-96 animate-pulse">
            <CardContent className="p-6 h-full bg-muted/50 rounded-lg" />
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <p className="text-destructive font-semibold">Error loading dashboard</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Row - Welcome Card */}
      <div>
        <WelcomeCard
          userName="Admin"
          title="Welcome"
          subtitle="Administration Dashboard"
          primaryMetric={{
            value: `₦${formatCurrency(data?.totalSavings)}`,
            label: 'Total Savings',
            trend: '+22%'
          }}
          actionLabel="View Details"
        />
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Savings"
          value={`₦${formatCurrency(data?.totalSavings)}`}
          change={15}
          changeLabel="vs last month"
          icon={Wallet}
          {...cardColorSchemes.purple}
          trend="up"
        />
        <StatsCard
          title="Active Members"
          value={data?.totalActiveMembers || 0}
          change={8}
          changeLabel="vs last month"
          icon={Users}
          {...cardColorSchemes.cyan}
          trend="up"
        />
        <StatsCard
          title="Active Loans"
          value={loanSummary.active.value}
          change={-3}
          changeLabel="vs last month"
          icon={CreditCard}
          {...cardColorSchemes.orange}
          trend="down"
        />
        <StatsCard
          title="Pending"
          value={loanSummary.pending.value + (data?.totalApplicants || 0)}
          change={12}
          changeLabel="vs last month"
          icon={UserCheck}
          {...cardColorSchemes.pink}
          trend="up"
        />
      </div>

      {/* Charts & Analytics Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Donut Chart */}
        <DonutChart
          data={memberActivityData}
          title="Member Activity"
          centerValue={`${data?.totalActiveMembers || 0}`}
          centerLabel="2025"
        />

        {/* Project Timeline */}
        <div className="lg:col-span-2">
          <ProjectTimeline
            items={timelineData}
            title="Project Timeline"
            subtitle="Total 840 Tasks Completed"
          />
        </div>
      </div>

      {/* Bottom Row - Charts & Projects */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Line Chart */}
        <div className="lg:col-span-2">
          <LineChartCard
            data={weeklyData}
            title="Weekly Overview"
            color="#3b82f6"
          />
        </div>

        {/* Project List */}
        <ProjectList
          projects={projectsData}
          title="Activity Overview"
          subtitle="Track ongoing operations"
        />
      </div>
    </div>
  );
} 