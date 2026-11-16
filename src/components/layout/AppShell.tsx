"use client";

import * as React from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopHeader } from "@/components/layout/TopHeader";

interface AppShellProps {
  children: React.ReactNode;
  globalSearch?: string;
  onGlobalSearchChange?: (value: string) => void;
}

export function AppShell({
  children,
  globalSearch = "",
  onGlobalSearchChange,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[var(--bg-app)] text-[var(--text-primary)]">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          globalSearch={globalSearch}
          onGlobalSearchChange={onGlobalSearchChange ?? (() => {})}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
