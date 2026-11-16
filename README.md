 Active Hospitals Management UI

A production-quality frontend implementation of the **ProBase Platform – Active Hospitals Dashboard**, built with Next.js (App Router), TypeScript, Tailwind CSS, Lucide React, React Hook Form, and Zod.

## Features

- **Enterprise Dark Application Shell**:
  - Fixed, collapsible left sidebar (`Dashboard`, `Hospitals`, `Invitations`, `Audit Trail`, `Settings`) with mobile drawer support.
  - Top navigation header with breadcrumbs (`Platform > Hospitals > Active hospitals`), global search, workspace selector (`ProBase Platform`), and administrator avatar (`PA`).
- **Hospital Database Table**:
  - Semantic HTML table with horizontal scrolling on narrow viewports.
  - 20 realistic mock hospital records (`ORG-001` through `ORG-020`).
  - Individual row selection and select-all page checkbox.
  - Per-row contextual action menu (`View details`, `Edit hospital`, `Copy Organisation ID`).
- **Search, Sort, Filter & View Controls**:
  - Debounced search across hospital name, Organisation ID, administrator name, and admin email.
  - Ascending/descending sorting via column headers or the toolbar `Sort` menu.
  - Created date range filtering (`All`, `Last 7 days`, `Last 30 days`, `November 2026`, `October 2026`) and view mode selector.
  - Loading skeletons, empty state, and simulated API error state with retry.
- **Set Up & Edit Hospital Dialog**:
  - Form validation using React Hook Form + Zod (`name`, `organisationId`, `administrator`, `adminEmail`).
  - Live updates to the mock store and immediate table refresh.
- **Pagination & CSV Export**:
  - Working pagination (`Previous`, `Next`, `Page X of Y`), rows-per-page selector (`10`, `20`, `50`), and total hospital count.
  - RFC 4180-safe CSV export for the filtered dataset (or selected rows).

## Architecture

```text
src/
  app/
    api/hospitals/route.ts    # Next.js mock API route handlers (GET, POST, PATCH)
    hospitals/page.tsx        # Active Hospitals route
    globals.css               # Dark theme design tokens & scrollbar styles
    layout.tsx                # Root layout with Inter font
    page.tsx                  # Redirects to /hospitals
  components/
    layout/                   # AppShell, AppSidebar, TopHeader, Breadcrumbs
    hospitals/                # HospitalsView, Toolbar, Table, Pagination, Dialogs
    ui/                       # Reusable Button, Checkbox, Dropdown, Dialog
  hooks/
    useHospitals.ts           # Query state, abort-safe fetching, selection state
  mocks/
    hospital.data.ts          # 20 initial mock hospital records
    hospital.handlers.ts      # Simulated latency, search, sort, filter, pagination
  services/
    hospital.service.ts       # Typed Fetch API client
  types/
    hospital.ts               # Shared TypeScript interfaces
  lib/
    utils.ts                  # Class merging, date formatting, CSV export
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation & Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. It automatically redirects to `/hospitals`.

### Production Build & Lint

```bash
npm run lint
npm run build
npm run start
```
