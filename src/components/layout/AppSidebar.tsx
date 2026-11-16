"use client";

import {
  FileText,
  Hospital,
  LayoutDashboard,
  Mail,
  PanelLeft,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

const PLATFORM_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "hospitals", label: "Hospitals", icon: Hospital, active: true },
  { id: "invitations", label: "Invitations", icon: Mail },
  { id: "audit-trail", label: "Audit Trail", icon: FileText },
  { id: "settings", label: "Settings", icon: SlidersHorizontal },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AppSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AppSidebarProps) {
  const sidebarContent = (isMobileDrawer: boolean) => {
    const isCompact = !isMobileDrawer && collapsed;

    return (
      <div className="flex h-full flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] select-none">
        {/* Brand Header */}
        <div
          className={cn(
            "flex h-[64px] shrink-0 items-center border-b border-[var(--border-subtle)]",
            isCompact ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="h-6 w-6 shrink-0 rounded-[5px] bg-[#1686D9] shadow-sm shadow-[#1686D9]/25"
              aria-hidden="true"
            />
            {!isCompact && (
              <span className="text-[16px] font-semibold tracking-tight text-[var(--text-primary)]">
                ProBase
              </span>
            )}
          </div>
          {isMobileDrawer && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4">
          {!isCompact && (
            <div className="mb-2.5 px-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--text-muted)]">
              Platform
            </div>
          )}

          <nav aria-label="Platform navigation" className="space-y-1">
            {PLATFORM_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.active ? "/hospitals" : `#${item.id}`}
                  onClick={(e) => {
                    if (!item.active) {
                      e.preventDefault();
                    }
                    if (isMobileDrawer) {
                      onCloseMobile();
                    }
                  }}
                  title={isCompact ? item.label : undefined}
                  aria-current={item.active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9]",
                    isCompact && "justify-center px-0",
                    item.active
                      ? "bg-[var(--bg-active-nav)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover-subtle)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      item.active
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-subtle)] group-hover:text-[var(--text-body)]"
                    )}
                  />
                  {!isCompact && <span className="truncate">{item.label}</span>}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Collapse Control */}
        {!isMobileDrawer && (
          <div className="border-t border-[var(--border-subtle)] p-2.5">
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[12px] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover-subtle)] hover:text-[var(--text-primary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9]",
                isCompact && "justify-center px-0"
              )}
            >
              <PanelLeft className="h-4 w-4 shrink-0" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop / Tablet Fixed Sidebar */}
      <aside
        className={cn(
          "hidden lg:block shrink-0 transition-[width] duration-200 ease-out",
          collapsed ? "w-[64px]" : "w-[232px]"
        )}
      >
        <div className="sticky top-0 h-screen">{sidebarContent(false)}</div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full w-[240px]">
            {sidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
