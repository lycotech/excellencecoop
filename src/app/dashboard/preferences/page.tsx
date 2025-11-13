'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  SlidersHorizontal,
  User,
  Bell,
  Monitor,
  Shield,
  Key,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Globe,
  Palette,
  Languages,
  Clock,
  Database,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Settings,
  Building2,
  Upload,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

// Dashboard widget configuration
const availableWidgets = [
  { id: 'balance', name: 'Account Balance', description: 'Your current savings and loan balance', category: 'Financial' },
  { id: 'contributions', name: 'Monthly Contributions', description: 'Track your contribution history', category: 'Financial' },
  { id: 'loans', name: 'Active Loans', description: 'Your loan status and payments', category: 'Financial' },
  { id: 'transactions', name: 'Recent Transactions', description: 'Latest account activities', category: 'Financial' },
  { id: 'announcements', name: 'Announcements', description: 'Important cooperative updates', category: 'Communication' },
  { id: 'calendar', name: 'Calendar Events', description: 'Upcoming meetings and events', category: 'Communication' },
  { id: 'quick-actions', name: 'Quick Actions', description: 'Frequently used functions', category: 'Navigation' },
  { id: 'statistics', name: 'Statistics Overview', description: 'Key performance metrics', category: 'Analytics' },
];

const widgetSizes = ['small', 'medium', 'large'];

export default function PreferencesPage() {
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('Corporate Cooperative');

  const [preferences, setPreferences] = useState({
    // Dashboard preferences
    widgets: availableWidgets.map(widget => ({
      ...widget,
      isVisible: true,
      displayOrder: widget.id === 'balance' ? 1 : 
                   widget.id === 'contributions' ? 2 :
                   widget.id === 'loans' ? 3 : Math.floor(Math.random() * 10),
      size: 'medium'
    })),
    
    // Company branding
    company: {
      name: 'Corporate Cooperative',
      tagline: 'Management System',
      logo: null as string | null,
    },
    
    // Profile preferences
    profile: {
      displayName: user?.staffNo || user?.email?.split('@')[0] || '',
      email: user?.email || '',
      phone: '', // User object doesn't have phone property yet
      showEmail: true,
      showPhone: true,
      showLastLogin: false,
    },
    
    // Notification preferences
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      contributionReminders: true,
      loanReminders: true,
      meetingNotifications: true,
      systemUpdates: true,
      marketingEmails: false,
      frequency: 'immediate', // immediate, daily, weekly
    },
    
    // Display preferences
    display: {
      theme: 'system', // light, dark, system
      language: 'en',
      timezone: 'Africa/Lagos',
      dateFormat: 'dd/MM/yyyy',
      currency: 'NGN',
      numberFormat: 'en-NG',
      dashboardRefresh: 'auto', // auto, manual
      showHelperText: true,
    },
    
    // Privacy preferences
    privacy: {
      profileVisibility: 'members', // public, members, private
      showOnlineStatus: true,
      allowDataExport: true,
      shareUsageData: false,
      twoFactorEnabled: false,
    },
    
    // Account preferences
    account: {
      sessionTimeout: 30, // minutes
      requirePasswordChange: false,
      loginNotifications: true,
      accountActivity: true,
      downloadData: false,
    }
  });

  const [isSaving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load company logo on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('companyLogo');
    const savedName = localStorage.getItem('companyName');
    if (savedLogo) {
      setCompanyLogo(savedLogo);
      setPreferences(prev => ({
        ...prev,
        company: { ...prev.company, logo: savedLogo }
      }));
    }
    if (savedName) {
      setCompanyName(savedName);
      setPreferences(prev => ({
        ...prev,
        company: { ...prev.company, name: savedName }
      }));
    }
  }, []);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [preferences]);

  const handleWidgetToggle = (widgetId: string) => {
    setPreferences(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, isVisible: !widget.isVisible } : widget
      )
    }));
  };

  const handleWidgetSizeChange = (widgetId: string, size: string) => {
    setPreferences(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, size } : widget
      )
    }));
  };

  const updatePreference = (category: string, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Logo file must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoData = reader.result as string;
        setCompanyLogo(logoData);
        setPreferences(prev => ({
          ...prev,
          company: { ...prev.company, logo: logoData }
        }));
        toast.success('Logo uploaded! Click Save to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setCompanyLogo(null);
    setPreferences(prev => ({
      ...prev,
      company: { ...prev.company, logo: null }
    }));
    toast.success('Logo removed! Click Save to apply.');
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would save to the database
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Save company branding separately for easy access
      if (preferences.company.logo) {
        localStorage.setItem('companyLogo', preferences.company.logo);
      } else {
        localStorage.removeItem('companyLogo');
      }
      localStorage.setItem('companyName', preferences.company.name);
      localStorage.setItem('companyTagline', preferences.company.tagline);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new Event('companyBrandingUpdated'));
      
      setHasChanges(false);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    try {
      setSaving(true);
      
      // Reset to default values
      setPreferences({
        ...preferences,
        widgets: availableWidgets.map(widget => ({
          ...widget,
          isVisible: true,
          displayOrder: Math.floor(Math.random() * 10),
          size: 'medium'
        }))
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Preferences reset to defaults!');
    } catch (error) {
      toast.error('Failed to reset preferences');
    } finally {
      setSaving(false);
    }
  };

  const exportData = () => {
    const dataToExport = {
      preferences,
      exportDate: new Date().toISOString(),
      userId: user?.userId
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user-preferences-export.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Preferences exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
            <p className="text-muted-foreground">Customize your experience and manage your settings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isSaving}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset All Preferences</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all your preferences to their default values. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetToDefaults}>
                  Reset Preferences
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button 
            onClick={savePreferences} 
            disabled={isSaving || !hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Preferences Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                <CardTitle>Dashboard Widgets</CardTitle>
              </div>
              <CardDescription>
                Customize which widgets appear on your dashboard and how they're displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(
                preferences.widgets.reduce((acc, widget) => {
                  if (!acc[widget.category]) acc[widget.category] = [];
                  acc[widget.category].push(widget);
                  return acc;
                }, {} as Record<string, typeof preferences.widgets>)
              ).map(([category, widgets]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{category} Widgets</h4>
                    <Badge variant="outline">{widgets.length}</Badge>
                  </div>
                  <div className="grid gap-4">
                    {widgets.map(widget => (
                      <div key={widget.id} className={cn(
                        "flex items-center justify-between p-4 rounded-lg transition-all",
                        widget.isVisible 
                          ? "bg-primary/5 elevation-1" 
                          : "bg-muted/30"
                      )}>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={widget.isVisible}
                            onCheckedChange={() => handleWidgetToggle(widget.id)}
                          />
                          <div>
                            <p className={cn(
                              "font-medium",
                              widget.isVisible ? "text-foreground" : "text-muted-foreground"
                            )}>{widget.name}</p>
                            <p className="text-sm text-muted-foreground">{widget.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={widget.size}
                            onValueChange={(size) => handleWidgetSizeChange(widget.id, size)}
                            disabled={!widget.isVisible}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {widgetSizes.map(size => (
                                <SelectItem key={size} value={size}>
                                  {size.charAt(0).toUpperCase() + size.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Company Branding</CardTitle>
              </div>
              <CardDescription>
                Customize your company logo and branding information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-logo">Company Logo</Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    Upload your company logo. Recommended size: 200x200px. Max file size: 2MB
                  </p>
                  
                  <div className="flex items-start gap-4">
                    {/* Logo Preview */}
                    <div className="flex-shrink-0">
                      {companyLogo ? (
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-lg elevation-2 overflow-hidden bg-card">
                            <img 
                              src={companyLogo} 
                              alt="Company Logo" 
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleRemoveLogo}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-lg elevation-1 flex items-center justify-center bg-muted">
                          <Building2 className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1 space-y-2">
                      <Input
                        id="company-logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Label
                        htmlFor="company-logo"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground elevation-2 hover:elevation-3 cursor-pointer transition-all"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Label>
                      
                      {companyLogo && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveLogo}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Logo
                        </Button>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: JPG, PNG, SVG, WEBP
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={preferences.company.name}
                      onChange={(e) => updatePreference('company', 'name', e.target.value)}
                      placeholder="Corporate Cooperative"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-tagline">Tagline</Label>
                    <Input
                      id="company-tagline"
                      value={preferences.company.tagline}
                      onChange={(e) => updatePreference('company', 'tagline', e.target.value)}
                      placeholder="Management System"
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Logo Guidelines</p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Use a square image (1:1 ratio) for best results</li>
                        <li>Ensure logo has good contrast on both light and dark backgrounds</li>
                        <li>Logo will be displayed in sidebar, login page, and other areas</li>
                        <li>Changes will take effect after clicking "Save Changes"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Profile Settings</CardTitle>
              </div>
              <CardDescription>
                Manage your personal information and profile visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={preferences.profile.displayName}
                    onChange={(e) => updatePreference('profile', 'displayName', e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={preferences.profile.email}
                    onChange={(e) => updatePreference('profile', 'email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={preferences.profile.phone}
                  onChange={(e) => updatePreference('profile', 'phone', e.target.value)}
                  placeholder="+234-xxx-xxx-xxxx"
                />
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Profile Visibility</h4>
                <div className="space-y-3">
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.profile.showEmail ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <div className="flex items-center gap-2">
                      <Mail className={cn("h-4 w-4", preferences.profile.showEmail ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm">Show email to other members</span>
                    </div>
                    <Switch
                      checked={preferences.profile.showEmail}
                      onCheckedChange={(checked) => updatePreference('profile', 'showEmail', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.profile.showPhone ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <div className="flex items-center gap-2">
                      <Phone className={cn("h-4 w-4", preferences.profile.showPhone ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm">Show phone to other members</span>
                    </div>
                    <Switch
                      checked={preferences.profile.showPhone}
                      onCheckedChange={(checked) => updatePreference('profile', 'showPhone', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.profile.showLastLogin ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <div className="flex items-center gap-2">
                      <Clock className={cn("h-4 w-4", preferences.profile.showLastLogin ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm">Show last login time</span>
                    </div>
                    <Switch
                      checked={preferences.profile.showLastLogin}
                      onCheckedChange={(checked) => updatePreference('profile', 'showLastLogin', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
              <CardDescription>
                Choose how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notification Channels</h4>
                <div className="space-y-3">
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.notifications.emailNotifications ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <div className="flex items-center gap-2">
                      <Mail className={cn("h-4 w-4", preferences.notifications.emailNotifications ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm">Email notifications</span>
                    </div>
                    <Switch
                      checked={preferences.notifications.emailNotifications}
                      onCheckedChange={(checked) => updatePreference('notifications', 'emailNotifications', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.notifications.smsNotifications ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <div className="flex items-center gap-2">
                      <Phone className={cn("h-4 w-4", preferences.notifications.smsNotifications ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm">SMS notifications</span>
                    </div>
                    <Switch
                      checked={preferences.notifications.smsNotifications}
                      onCheckedChange={(checked) => updatePreference('notifications', 'smsNotifications', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.notifications.pushNotifications ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <div className="flex items-center gap-2">
                      <Bell className={cn("h-4 w-4", preferences.notifications.pushNotifications ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm">Push notifications</span>
                    </div>
                    <Switch
                      checked={preferences.notifications.pushNotifications}
                      onCheckedChange={(checked) => updatePreference('notifications', 'pushNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.notifications.contributionReminders ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Contribution reminders</span>
                    <Switch
                      checked={preferences.notifications.contributionReminders}
                      onCheckedChange={(checked) => updatePreference('notifications', 'contributionReminders', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.notifications.loanReminders ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Loan payment reminders</span>
                    <Switch
                      checked={preferences.notifications.loanReminders}
                      onCheckedChange={(checked) => updatePreference('notifications', 'loanReminders', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.notifications.meetingNotifications ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Meeting notifications</span>
                    <Switch
                      checked={preferences.notifications.meetingNotifications}
                      onCheckedChange={(checked) => updatePreference('notifications', 'meetingNotifications', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.notifications.systemUpdates ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">System updates</span>
                    <Switch
                      checked={preferences.notifications.systemUpdates}
                      onCheckedChange={(checked) => updatePreference('notifications', 'systemUpdates', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.notifications.marketingEmails ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Marketing emails</span>
                    <Switch
                      checked={preferences.notifications.marketingEmails}
                      onCheckedChange={(checked) => updatePreference('notifications', 'marketingEmails', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select
                  value={preferences.notifications.frequency}
                  onValueChange={(value) => updatePreference('notifications', 'frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily digest</SelectItem>
                    <SelectItem value="weekly">Weekly summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Display Settings</CardTitle>
              </div>
              <CardDescription>
                Customize the appearance and localization of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={preferences.display.theme}
                    onValueChange={(value) => updatePreference('display', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={preferences.display.language}
                    onValueChange={(value) => updatePreference('display', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ha">Hausa</SelectItem>
                      <SelectItem value="yo">Yoruba</SelectItem>
                      <SelectItem value="ig">Igbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={preferences.display.timezone}
                    onValueChange={(value) => updatePreference('display', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">Lagos (WAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={preferences.display.dateFormat}
                    onValueChange={(value) => updatePreference('display', 'dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Interface Options</h4>
                <div className="space-y-3">
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.display.showHelperText ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Show helper text and tooltips</span>
                    <Switch
                      checked={preferences.display.showHelperText}
                      onCheckedChange={(checked) => updatePreference('display', 'showHelperText', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.display.dashboardRefresh === 'auto' ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Auto-refresh dashboard</span>
                    <Switch
                      checked={preferences.display.dashboardRefresh === 'auto'}
                      onCheckedChange={(checked) => updatePreference('display', 'dashboardRefresh', checked ? 'auto' : 'manual')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Privacy Settings</CardTitle>
              </div>
              <CardDescription>
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={preferences.privacy.profileVisibility}
                  onValueChange={(value) => updatePreference('privacy', 'profileVisibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="members">Members Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Privacy Options</h4>
                <div className="space-y-3">
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.privacy.showOnlineStatus ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Show online status</span>
                    <Switch
                      checked={preferences.privacy.showOnlineStatus}
                      onCheckedChange={(checked) => updatePreference('privacy', 'showOnlineStatus', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.privacy.allowDataExport ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Allow data export</span>
                    <Switch
                      checked={preferences.privacy.allowDataExport}
                      onCheckedChange={(checked) => updatePreference('privacy', 'allowDataExport', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.privacy.shareUsageData ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Share usage data for improvements</span>
                    <Switch
                      checked={preferences.privacy.shareUsageData}
                      onCheckedChange={(checked) => updatePreference('privacy', 'shareUsageData', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-lg transition-all",
                  preferences.privacy.twoFactorEnabled ? "bg-primary/5 elevation-1" : "bg-muted/30"
                )}>
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={preferences.privacy.twoFactorEnabled}
                    onCheckedChange={(checked) => {
                      updatePreference('privacy', 'twoFactorEnabled', checked);
                      if (checked) {
                        toast.info('Two-factor authentication setup would be initiated here');
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>Account Settings</CardTitle>
              </div>
              <CardDescription>
                Manage your account security and data preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select
                  value={preferences.account.sessionTimeout.toString()}
                  onValueChange={(value) => updatePreference('account', 'sessionTimeout', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Security Notifications</h4>
                <div className="space-y-3">
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.account.loginNotifications ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Notify me of new logins</span>
                    <Switch
                      checked={preferences.account.loginNotifications}
                      onCheckedChange={(checked) => updatePreference('account', 'loginNotifications', checked)}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    preferences.account.accountActivity ? "bg-primary/5" : "bg-muted/30"
                  )}>
                    <span className="text-sm">Account activity alerts</span>
                    <Switch
                      checked={preferences.account.accountActivity}
                      onCheckedChange={(checked) => updatePreference('account', 'accountActivity', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Data Management</h4>
                <div className="space-y-3">
                  <Button variant="outline" onClick={exportData} className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download my data
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full justify-start">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete my account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => toast.error('Account deletion would be processed here')}
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes Banner */}
      {hasChanges && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">You have unsaved changes</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setHasChanges(false)}>
                  Discard
                </Button>
                <Button size="sm" onClick={savePreferences} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
