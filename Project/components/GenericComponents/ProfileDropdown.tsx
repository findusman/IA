'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

const ProfileDropdown: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleProfileClick = () => {
    router.push('/dashboard/profile-role');
    setProfileOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [profileOpen]);

  return (
    <div className='relative' ref={ref}>
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        aria-label='Open profile menu'
        className='w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 bg-linear-to-br from-cyan-500 to-blue-600'
      >
        <User className='w-5 h-5 text-white' />
      </button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='absolute right-0 mt-2 w-56 bg-light-surface dark:bg-dark-surface backdrop-blur-xl border border-light-border dark:border-dark-border rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/50 py-2 z-50 origin-top-right'
          >
            <div className='px-4 py-3 border-b border-light-border dark:border-dark-border'>
              <p className='text-sm font-semibold text-light-text-primary dark:text-dark-text-primary'>
                {user?.name || 'User'}
              </p>
              <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleProfileClick}
              className='w-full px-4 py-2 hover:bg-light-border dark:hover:bg-dark-border flex items-center gap-3 transition-colors'
            >
              <User className='w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary' />
              <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                Profile & Role
              </span>
            </button>
            <div className='border-t border-light-border dark:border-dark-border mt-2 pt-2'>
              <button
                onClick={handleLogout}
                className='w-full px-4 py-2 hover:bg-red-500/10 flex items-center gap-3 transition-colors group'
              >
                <LogOut className='w-4 h-4 text-red-400' />
                <span className='text-sm text-red-400 group-hover:text-red-300'>
                  Logout
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
