'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useConnectorStore } from '@/lib/store/connectorStore';
import { useActionStore } from '@/lib/store/actionStore';

interface Notification {
  id: number;
  text: string;
  time: string;
  priority?: 'high' | 'normal';
}

const NotificationDropdown: React.FC = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { connectedConnectors } = useConnectorStore();
  const { actions: insights } = useActionStore();

  const highPriorityNotifications = useMemo(() => {
    const highPriority = insights
      .filter((action) => action.impactScore >= 80)
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 5)
      .map((action, index) => ({
        id: index + 1,
        text: action.title,
        time: `${action.connectorName || 'General'} - ${action.impactScore}% impact`,
        priority: 'high' as const,
      }));

    return highPriority;
  }, [insights]);

  const notificationBadgeCount = useMemo(() => {
    return insights.filter((action) => action.impactScore >= 80).length;
  }, [insights]);

  const notifications: Notification[] =
    highPriorityNotifications.length > 0
      ? highPriorityNotifications
      : [
          {
            id: 1,
            text: 'Connect data sources to see high-priority actions',
            time: 'Ready to help',
            priority: 'normal',
          },
        ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [notificationOpen]);

  return (
    <div className='relative z-50' ref={ref}>
      <button
        onClick={() => setNotificationOpen(!notificationOpen)}
        aria-label='Open notifications'
        className='w-10 h-10 rounded-full cursor-pointer bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80 flex items-center justify-center transition-all duration-200 hover:scale-110 relative'
      >
        <Bell className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary' />
        {notificationBadgeCount > 0 && (
          <span className='absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full animate-pulse flex items-center justify-center text-xs text-white font-bold'>
            {notificationBadgeCount > 9 ? '9+' : notificationBadgeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {notificationOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='absolute right-0 mt-2 w-80 bg-light-surface dark:bg-dark-surface backdrop-blur-xl border border-light-border dark:border-dark-border rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/50 py-2 z-50 origin-top-right'
          >
            <div className='px-4 py-3 border-b border-light-border dark:border-dark-border'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold text-light-text-primary dark:text-dark-text-primary'>
                  High Priority Actions
                </h3>
                {notificationBadgeCount > 0 && (
                  <span className='px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold'>
                    {notificationBadgeCount}
                  </span>
                )}
              </div>
              {connectedConnectors.length > 0 && (
                <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-2'>
                  From {connectedConnectors.length}{' '}
                  {connectedConnectors.length === 1
                    ? 'connector'
                    : 'connectors'}
                </p>
              )}
            </div>
            <div className='max-h-96 overflow-y-auto'>
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className='w-full px-4 py-3 hover:bg-light-border/50 dark:hover:bg-dark-border/50 flex items-start gap-3 transition-colors border-b border-light-border/30 dark:border-dark-border/30 last:border-b-0'
                >
                  {notification.priority === 'high' && (
                    <AlertTriangle className='w-4 h-4 text-red-400 shrink-0 mt-0.5' />
                  )}
                  <div className='flex-1 text-left'>
                    <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary block'>
                      {notification.text}
                    </span>
                    <span className='text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1'>
                      {notification.time}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
