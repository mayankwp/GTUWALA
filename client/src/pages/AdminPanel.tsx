import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { isUnauthorizedError } from '../lib/authUtils';
import { apiRequest } from '../lib/queryClient';
import { Shield, Bell, Settings, Plus, Edit, Save, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function AdminPanel() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Check admin status
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (isAuthenticated) {
      apiRequest('GET', '/api/admin/check')
        .then(() => {
          setIsAdmin(true);
          setCheckingAdmin(false);
        })
        .catch((error) => {
          if (isUnauthorizedError(error)) {
            toast({
              title: "Unauthorized",
              description: "You are logged out. Logging in again...",
              variant: "destructive",
            });
            setTimeout(() => {
              window.location.href = "/api/login";
            }, 500);
            return;
          }
          toast({
            title: "Access Denied",
            description: "Admin access required to view this page.",
            variant: "destructive",
          });
          setCheckingAdmin(false);
        });
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: notifications } = useQuery({
    queryKey: ['/api/admin/notifications'],
    enabled: isAdmin,
  });

  const { data: resourceCards } = useQuery({
    queryKey: ['/api/resource-cards/all'],
    enabled: isAdmin,
  });

  const notificationMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: any }) => {
      if (id) {
        await apiRequest('PUT', `/api/admin/notifications/${id}`, data);
      } else {
        await apiRequest('POST', '/api/admin/notifications', data);
      }
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Notification updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/active'] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update notification.",
        variant: "destructive",
      });
    },
  });

  const resourceCardMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest('PUT', `/api/admin/resource-cards/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Resource card updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/resource-cards'] });
      queryClient.invalidateQueries({ queryKey: ['/api/resource-cards'] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update resource card.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || checkingAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center space-x-3 mb-8">
        <Shield className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Panel
        </h1>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Settings className="w-4 h-4 mr-2" />
            Resource Cards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Notifications</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Control the alert notifications displayed site-wide
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.isArray(notifications) && notifications.map((notification: any) => (
                <NotificationEditor
                  key={notification.id}
                  notification={notification}
                  onSave={(data) => notificationMutation.mutate({ id: notification.id, data })}
                  isLoading={notificationMutation.isPending}
                />
              ))}
              
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Add New Notification</h3>
                <NotificationEditor
                  onSave={(data) => notificationMutation.mutate({ data })}
                  isLoading={notificationMutation.isPending}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Homepage Cards</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure all homepage cards including Study Resources, GTU Toolbox, and Features
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Study Resources Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                  📚 Explore GTU Study Resources
                </h3>
                {Array.isArray(resourceCards) && resourceCards
                  .filter((card: any) => card.category === 'resources')
                  .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                  .map((card: any) => (
                    <ResourceCardEditor
                      key={card.id}
                      card={card}
                      onSave={(data) => resourceCardMutation.mutate({ id: card.id, data })}
                      isLoading={resourceCardMutation.isPending}
                    />
                  ))}
              </div>

              {/* GTU Toolbox Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                  🔧 GTU Toolbox
                </h3>
                {Array.isArray(resourceCards) && resourceCards
                  .filter((card: any) => card.category === 'toolbox')
                  .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                  .map((card: any) => (
                    <ResourceCardEditor
                      key={card.id}
                      card={card}
                      onSave={(data) => resourceCardMutation.mutate({ id: card.id, data })}
                      isLoading={resourceCardMutation.isPending}
                    />
                  ))}
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                  ✨ Platform Features
                </h3>
                {Array.isArray(resourceCards) && resourceCards
                  .filter((card: any) => card.category === 'features')
                  .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                  .map((card: any) => (
                    <ResourceCardEditor
                      key={card.id}
                      card={card}
                      onSave={(data) => resourceCardMutation.mutate({ id: card.id, data })}
                      isLoading={resourceCardMutation.isPending}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationEditor({
  notification,
  onSave,
  isLoading
}: {
  notification?: any;
  onSave: (data: any) => void;
  isLoading: boolean;
}) {
  const [content, setContent] = useState(notification?.content || '');
  const [isActive, setIsActive] = useState(notification?.isActive ?? true);

  const handleSave = () => {
    if (content.trim()) {
      onSave({ content: content.trim(), isActive });
      if (!notification) {
        setContent('');
        setIsActive(true);
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Notification Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter notification message..."
          rows={2}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="active">Active</Label>
        </div>
        
        <Button
          onClick={handleSave}
          disabled={isLoading || !content.trim()}
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          {notification ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
}

function ResourceCardEditor({
  card,
  onSave,
  isLoading
}: {
  card: any;
  onSave: (data: any) => void;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [redirectUrl, setRedirectUrl] = useState(card.redirectUrl || '');
  const [isActive, setIsActive] = useState(card.isActive);
  const [selectedIcon, setSelectedIcon] = useState(card.icon);

  // Available icons (50+ icons from Lucide React)
  const availableIcons = [
    'FileText', 'Book', 'GraduationCap', 'Calculator', 'Megaphone', 'Calendar', 'TrendingUp',
    'Lightbulb', 'Users', 'ArrowUpDown', 'AlertTriangle', 'Percent', 'Clock', 'Timer',
    'FileInput', 'Heart', 'Zap', 'RotateCcw', 'Gift', 'Star', 'Shield', 'Award',
    'Target', 'Bookmark', 'Download', 'Upload', 'Search', 'Filter', 'Globe', 'Mail',
    'Phone', 'MessageSquare', 'Video', 'Image', 'Music', 'Play', 'Pause', 'Stop',
    'SkipForward', 'SkipBack', 'Home', 'User', 'Settings', 'Edit', 'Trash', 'Plus',
    'Minus', 'Check', 'X', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronDown',
    'Database', 'Server', 'Wifi', 'Bluetooth', 'Battery', 'Power', 'Lock', 'Unlock'
  ];

  const handleSave = () => {
    onSave({
      title,
      description,
      icon: selectedIcon,
      redirectUrl: redirectUrl || null,
      isActive
    });
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white">
          {card.category === 'resources' ? '📚 Study Resources' : 
           card.category === 'toolbox' ? '🔧 GTU Toolbox' : 
           card.category === 'features' ? '✨ Features' : 'Card'} - {card.title}
        </h4>
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          Order: {card.sortOrder}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="redirectUrl">Redirect URL</Label>
          <Input
            id="redirectUrl"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="/path/to/page or https://external.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>
        <Select value={selectedIcon} onValueChange={setSelectedIcon}>
          <SelectTrigger>
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {availableIcons.map((iconName) => (
              <SelectItem key={iconName} value={iconName}>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{iconName}</span>
                  <span className="text-xs text-gray-500">({iconName})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Card description"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="cardActive"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="cardActive">Active</Label>
        </div>
        
        <Button
          onClick={handleSave}
          disabled={isLoading || !title.trim() || !description.trim()}
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Update Card
        </Button>
      </div>
    </div>
  );
}
