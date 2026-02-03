'use client';

import React, { useState } from 'react';
import { MockDataProvider } from '../../lib/context/MockDataContext';
import { Breadcrumbs, Footer, Header, Sidebar } from '../layout';

// ==========================================
// Master Layout Component
// ==========================================

interface MasterLayoutProps {
  children: React.ReactNode;
}

export function MasterLayout({ children }: MasterLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <MockDataProvider>
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Header */}
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div
          className={`
            pt-16   /* Header height */
            transition-all duration-300
            ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
          `}
        >
          {/* Main Content */}
          <main className="min-h-[calc(100vh-4rem-3rem)] p-6">
            <Breadcrumbs />
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </MockDataProvider>
  );
}

export default MasterLayout;
