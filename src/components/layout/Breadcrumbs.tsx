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
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-[6px] text-[14px] font-normal leading-[20px]"
    >
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-[6px]">
          {index > 0 && (
            <ChevronRight
              className="h-[14px] w-[14px] text-[#707070]"
              aria-hidden="true"
            />
          )}
          <span
            aria-current={item.current ? "page" : undefined}
            className={
              item.current
                ? "text-white whitespace-nowrap"
                : "text-[#707070] whitespace-nowrap"
            }
          >
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  );
}
