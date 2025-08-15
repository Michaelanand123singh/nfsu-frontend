import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Building2 } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Section */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* No container or padding here - let pages control their own layout */}
        <Outlet />
      </main>

      {/* Footer Section */}
      <footer className="flex-shrink-0 mt-auto border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                © 2024 NFSU Hostel Booking. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
              <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;