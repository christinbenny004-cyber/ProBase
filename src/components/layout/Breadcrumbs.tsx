import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px]">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1.5">
          {index > 0 && (
            <ChevronRight
              className="h-3.5 w-3.5 text-[var(--text-muted)]"
              aria-hidden="true"
            />
          )}
          <span
            aria-current={item.current ? "page" : undefined}
            className={
              item.current
                ? "font-medium text-[var(--text-primary)]"
                : "text-[var(--text-subtle)] transition-colors hover:text-[var(--text-body)]"
            }
          >
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  );
}
