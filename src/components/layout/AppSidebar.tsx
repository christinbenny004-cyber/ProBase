"use client";

import {
  Building2,
  FileText,
  LayoutGrid,
  Mail,
  PanelLeft,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  active?: boolean;
}

const PLATFORM_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "hospitals", label: "Hospitals", icon: Building2, active: true },
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
  const renderSidebarBody = (isMobileDrawer: boolean) => {
    const isCompact = !isMobileDrawer && collapsed;

    return (
      <div className="flex h-full flex-col justify-between border-r border-white/12 bg-[#1a1a1a] px-[12px] py-[20px] select-none">
        <div className="flex flex-col gap-[2px]">
          {isMobileDrawer && (
            <div className="mb-3 flex items-center justify-between px-[12px]">
              <div className="flex items-center gap-[10px]">
                <div className="h-[22px] w-[22px] rounded-[6px] bg-[#1c75b3]" />
                <span className="font-display text-[16px] font-semibold leading-[24px] text-white">
                  probase
                </span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="rounded-[6px] p-1 text-[#a0a0a0] hover:bg-white/[0.06] hover:text-white cursor-pointer"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>
          )}

          {!isCompact && (
            <div className="pb-[6px] pl-[12px]">
              <span className="text-[12px] font-normal leading-[16px] tracking-[0.96px] uppercase text-[#707070]">
                PLATFORM
              </span>
            </div>
          )}

          <nav aria-label="Platform navigation" className="flex flex-col gap-[2px]">
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
                    "flex items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] font-display text-[14px] font-medium leading-[20px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3]",
                    isCompact && "justify-center px-0",
                    item.active
                      ? "bg-[#1f1f1f] text-white"
                      : "text-[#a0a0a0] hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  <Icon
                    strokeWidth={1.6}
                    className={cn(
                      "h-[20px] w-[20px] shrink-0",
                      item.active ? "text-white" : "text-[#a0a0a0]"
                    )}
                  />
                  {!isCompact && <span className="truncate">{item.label}</span>}
                </a>
              );
            })}
          </nav>
        </div>

        {!isMobileDrawer && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] text-[#a0a0a0] transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3]"
            >
              <PanelLeft strokeWidth={1.6} className="h-[18px] w-[18px]" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 transition-[width] duration-200 ease-out lg:block",
          collapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
        <div className="sticky top-[64px] h-[calc(100vh-64px)]">
          {renderSidebarBody(false)}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/65"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full w-[240px]">
            {renderSidebarBody(true)}
          </aside>
        </div>
      )}
    </>
  );
}
