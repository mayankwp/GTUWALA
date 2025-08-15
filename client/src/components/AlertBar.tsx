import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function AlertBar() {
  const [dismissed, setDismissed] = useState(false);

  const { data: notifications } = useQuery({
    queryKey: ['/api/notifications/active'],
  });

  const activeNotification = Array.isArray(notifications) ? notifications[0] : null;

  useEffect(() => {
    // Reset dismissed state when notification changes
    if (activeNotification) {
      const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
      setDismissed(dismissedNotifications.includes(activeNotification.id));
    }
  }, [activeNotification]);

  const handleDismiss = () => {
    if (activeNotification) {
      const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
      dismissedNotifications.push(activeNotification.id);
      localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
      setDismissed(true);
    }
  };

  if (!activeNotification || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-3 px-4 text-center text-sm font-medium relative">
      <span>{activeNotification.content}</span>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
