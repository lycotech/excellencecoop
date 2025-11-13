'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface WelcomeCardProps {
  userName: string;
  title?: string;
  subtitle?: string;
  primaryMetric?: {
    value: string;
    label: string;
    trend?: string;
  };
  actionLabel?: string;
  onAction?: () => void;
}

export function WelcomeCard({
  userName,
  title = 'Welcome',
  subtitle = 'Overview Dashboard',
  primaryMetric = {
    value: '₦420,800',
    label: '78% of target',
    trend: '+22%'
  },
  actionLabel = 'View Details',
  onAction,
}: WelcomeCardProps) {
  return (
    <Card className="overflow-hidden bg-primary text-primary-foreground elevation-3">
      <CardContent className="p-8 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <p className="text-sm font-medium opacity-90 uppercase tracking-wider">{subtitle}</p>
              <h3 className="text-3xl font-semibold">
                {title}, {userName}
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h2 className="text-5xl font-bold">{primaryMetric.value}</h2>
                {primaryMetric.trend && (
                  <span className="flex items-center gap-1 text-sm font-medium bg-white/20 px-3 py-1.5 rounded-md">
                    <TrendingUp className="w-4 h-4" strokeWidth={2} />
                    {primaryMetric.trend}
                  </span>
                )}
              </div>
              <p className="text-sm opacity-90">{primaryMetric.label}</p>
            </div>
            
            <Button
              onClick={onAction}
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 font-medium shadow-lg group"
            >
              {actionLabel}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


