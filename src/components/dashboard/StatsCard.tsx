'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: 'up' | 'down';
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = '',
  trend = 'up',
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden hover:elevation-2 transition-all duration-300', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Icon className={cn('h-8 w-8', iconColor)} strokeWidth={1.5} />
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <h3 className="text-3xl font-semibold text-foreground">{value}</h3>
            {changeLabel && (
              <p className="text-xs text-muted-foreground">{changeLabel}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Material Design color schemes - Purple theme
export const cardColorSchemes = {
  purple: {
    iconColor: 'text-[#5e35b1] dark:text-[#7e57c2]',
  },
  green: {
    iconColor: 'text-[#43a047] dark:text-[#66bb6a]',
  },
  orange: {
    iconColor: 'text-[#fb8c00] dark:text-[#ffa726]',
  },
  cyan: {
    iconColor: 'text-[#00acc1] dark:text-[#26c6da]',
  },
  pink: {
    iconColor: 'text-[#d81b60] dark:text-[#f06292]',
  },
  indigo: {
    iconColor: 'text-[#3949ab] dark:text-[#5c6bc0]',
  },
};


