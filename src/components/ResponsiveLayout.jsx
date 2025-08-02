import React, { useState } from 'react';

export const ResponsiveLayout = ({ sidebar, mainContent }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="h-full overflow-y-auto">
          {sidebar}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">AI Project Tracker</h1>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {mainContent}
        </div>
      </div>
    </div>
  );
};

export const MobileOptimizedCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
};

export const ResponsiveGrid = ({ children, cols = { sm: 1, md: 2, lg: 4 } }) => {
  const gridClasses = `grid grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg} gap-4`;
  
  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

export const ResponsiveText = ({ children, className = '', mobileClassName = '' }) => {
  return (
    <div className={`${className} ${mobileClassName}`}>
      {children}
    </div>
  );
}; 