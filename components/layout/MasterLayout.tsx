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
      {/* Outer Shell: Fixed viewport with no body scroll */}
      <div className="h-screen overflow-hidden flex flex-col bg-[#F8FAFC]">
        {/* Header - Fixed at top */}
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

        {/* Content Area Wrapper: Takes remaining space with flex-1 */}
        <div
          className={`
            flex-1 flex flex-col min-h-0 overflow-hidden
            pt-16   /* Header height offset */
            transition-all duration-300
            ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
          `}
        >
          {/* Scrollable Main Content Area */}
          <main className="flex-1 overflow-y-auto min-h-0 p-6">
            <Breadcrumbs />
            {children}
          </main>

          {/* Footer - Fixed at bottom, outside scroll area */}
          <Footer />
        </div>
      </div>
    </MockDataProvider>
  );
}

export default MasterLayout;
