'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  icon: React.ReactNode;
  iconBgColor: string;
  tasks: {
    completed: number;
    total: number;
  };
  status?: 'active' | 'pending' | 'completed';
}

interface ProjectListProps {
  projects: Project[];
  title?: string;
  subtitle?: string;
}

export function ProjectList({ projects, title = 'Project List', subtitle }: ProjectListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View All</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => {
            const progress = (project.tasks.completed / project.tasks.total) * 100;
            
            return (
              <div
                key={project.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {/* Icon */}
                <div className={`p-3 rounded-lg ${project.iconBgColor}`}>
                  {project.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm truncate">{project.name}</h4>
                    {project.status && (
                      <Badge
                        variant={
                          project.status === 'completed'
                            ? 'default'
                            : project.status === 'active'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="ml-2 text-xs"
                      >
                        {project.status}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Task {project.tasks.completed}/{project.tasks.total}
                    </span>
                    <Progress value={progress} className="h-1.5 flex-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Timeline Component
interface TimelineItem {
  id: string;
  title: string;
  assignee: string;
  progress: number;
  color: string;
  startDate?: string;
  endDate?: string;
}

interface ProjectTimelineProps {
  items: TimelineItem[];
  title?: string;
  subtitle?: string;
}

export function ProjectTimeline({ items, title = 'Project Timeline', subtitle }: ProjectTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{item.assignee}</span>
                  <span className="text-muted-foreground mx-2">•</span>
                  <span className="text-muted-foreground">{item.title}</span>
                </div>
                {item.endDate && (
                  <span className="text-xs text-muted-foreground">{item.endDate}</span>
                )}
              </div>
              <div className="relative">
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg flex items-center px-3 text-xs font-medium text-white transition-all duration-500"
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor: item.color,
                    }}
                  >
                    {item.progress > 20 && `${item.progress}%`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}



