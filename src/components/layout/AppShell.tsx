"use client";

import * as React from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopHeader } from "@/components/layout/TopHeader";

interface AppShellProps {
  children: React.ReactNode;
  globalSearch?: string;
  onGlobalSearchChange?: (value: string) => void;
  currentBreadcrumbLabel?: string;
}

export function AppShell({
  children,
  globalSearch = "",
  onGlobalSearchChange,
  currentBreadcrumbLabel,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#121212] text-white">
      <TopHeader
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        globalSearch={globalSearch}
        onGlobalSearchChange={onGlobalSearchChange ?? (() => {})}
        currentBreadcrumbLabel={currentBreadcrumbLabel}
      />

      <div className="flex min-h-0 flex-1">
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex min-w-0 flex-1 flex-col bg-[#121212]">
          {children}
        </main>
      </div>
    </div>
  );
}
