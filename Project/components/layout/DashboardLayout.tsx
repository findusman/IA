'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <ProtectedLayout>
      <div className='flex h-screen bg-light-background dark:bg-dark-background'>
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Container */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          {/* Header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Dynamic Content Container */}
          <main className='flex-1 overflow-y-auto p-6 bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary '>
            {children}
          </main>
        </div>
      </div>
    </ProtectedLayout>
  );
}
