import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';

export const AppLayout = ({ sidebar, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-background border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Mobile Header for opening sidebar */}
        <div className="lg:hidden h-14 flex items-center px-4 border-b border-border bg-background flex-shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-2 font-medium">IZEI Vision</span>
        </div>
        
        {/* Workspace Area */}
        <main className="flex-1 overflow-y-auto w-full h-full relative">
          {children}
        </main>
      </div>
    </div>
  );
};
