# Hotel Management System - Frontend

A modern, responsive hotel management frontend built with Next.js 16, TypeScript, and Tailwind CSS. This is Phase 2 of the HMS project, implementing a complete UI with mock data for stakeholder review before backend integration.

![Dashboard](./public/screenshots/dashboard.png)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Features

### Dashboard
- **KPI Cards**: Total rooms, daily revenue, guest count, occupancy rate
- **Room Status Grid**: Real-time status (Vacant/Occupied/Dirty/OOO) color-coded display
- **Arrivals/Departures**: Today's check-in/check-out lists with overdue highlighting
- **Revenue Chart**: 7-day revenue trend with interactive Recharts visualization

### CRUD Modules (11 Screens)
All modules feature a consistent Split-View pattern (list + form):

| Module | Route | Description |
|--------|-------|-------------|
| Currencies | `/pricing/currencies` | Manage currency codes (VND, USD, EUR) |
| Room Types | `/rooms/types` | Room type classifications |
| Room Categories | `/rooms/categories` | Detailed room categories with amenities |
| Rooms | `/rooms/list` | Individual room management with status |
| Market Segments | `/marketing/segments` | Customer segment classification |
| Source Codes | `/marketing/sources` | Reservation source tracking |
| Channels | `/marketing/channels` | Distribution channel management |
| Rate Codes | `/pricing/rates` | Pricing with multi-currency support |
| Exchange Rates | `/pricing/exchange` | Currency conversion rates |
| Company Profiles | `/partners/companies` | Corporate/TA partner management |
| Hotels | `/system/hotels` | Hotel configuration settings |

## 🏗️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Heroicons
- **Fonts**: Fira Sans (UI), Fira Code (monospace)

## 📁 Project Structure

```
hotel-management-frontend/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Dashboard route group (with layout)
│   │   ├── marketing/            # Marketing module routes
│   │   ├── partners/             # Partners module routes
│   │   ├── pricing/              # Pricing module routes
│   │   ├── rooms/                # Rooms module routes
│   │   └── system/               # System module routes
│   ├── layout.tsx                # Root layout (Header, Sidebar, Footer)
│   └── page.tsx                  # Dashboard page
├── components/
│   ├── layout/                   # Header, Sidebar, Footer, Breadcrumbs
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx            # Primary/Secondary/Danger buttons
│   │   ├── Input.tsx             # Text/Select/TextArea inputs
│   │   ├── Card.tsx              # Card container
│   │   ├── Table.tsx             # Sortable, searchable table
│   │   ├── Badge.tsx             # Status badges
│   │   └── Modal.tsx             # Confirmation modals
│   └── crud/                     # CRUD pattern components
│       └── SplitView.tsx         # List + Form split layout
├── lib/
│   ├── context/                  # React Context providers
│   │   └── MockDataContext.tsx   # Mock data state management
│   ├── mock-data/                # Static mock data files
│   │   ├── currencies.ts
│   │   ├── rooms.ts
│   │   ├── dashboard.ts
│   │   └── ...
│   ├── schemas/                  # Zod validation schemas
│   │   ├── currency.ts
│   │   ├── room.ts
│   │   └── ...
│   └── types/                    # TypeScript interfaces
│       └── index.ts              # All entity types
└── public/                       # Static assets
```

## 🎨 Design System

### Colors (CSS Variables)
```css
--primary: #1E40AF;       /* Navy - main actions */
--secondary: #64748B;     /* Slate - secondary UI */
--success: #10B981;       /* Green - success states */
--warning: #F59E0B;       /* Amber - warnings */
--danger: #EF4444;        /* Red - errors/delete */
--background: #F8FAFC;    /* Light gray - page bg */
--surface: #FFFFFF;       /* White - cards */
--text: #1E293B;          /* Dark slate - body text */
--text-muted: #64748B;    /* Muted text */
```

### Typography
- **Headings**: Fira Sans 600/700
- **Body**: Fira Sans 400
- **Mono**: Fira Code (codes, numbers)

### Breakpoints
| Name | Width | Target |
|------|-------|--------|
| sm | 640px | Mobile |
| md | 768px | Tablet |
| lg | 1024px | Laptop |
| xl | 1280px | Desktop |

## 📊 Mock Data Structure

Mock data simulates realistic hotel operations:

- **5 Currencies**: VND, USD, EUR, JPY, THB
- **5 Room Types**: Standard, Superior, Deluxe, Suite, Executive
- **10+ Room Categories**: Various configurations with amenities
- **120 Rooms**: Distributed across floors and buildings
- **Dashboard**: Live KPIs, arrivals, departures, revenue chart

## 🔧 Component Usage

### Button
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="medium" onClick={handleSave}>
  Lưu
</Button>
<Button variant="danger" onClick={handleDelete}>
  Xóa
</Button>
```

### Input
```tsx
import { Input, Select } from '@/components/ui/Input';

<Input
  label="Mã tiền tệ"
  placeholder="VND"
  error={errors.code?.message}
  {...register('code')}
/>

<Select label="Loại phòng" {...register('roomTypeId')}>
  {roomTypes.map(rt => (
    <option key={rt.id} value={rt.id}>{rt.name}</option>
  ))}
</Select>
```

### SplitView Pattern
```tsx
import { SplitView } from '@/components/crud/SplitView';

<SplitView
  items={currencies}
  selectedId={selectedId}
  onSelect={handleSelect}
  getDisplayName={(c) => c.code}
  getSubtitle={(c) => c.name}
>
  {/* Form content */}
</SplitView>
```

## 🌐 Localization

The UI is in Vietnamese by default. Key labels:
- **Thêm mới** - Create new
- **Lưu** - Save
- **Hủy** - Cancel
- **Xóa** - Delete
- **Tìm kiếm** - Search

## 📱 Responsive Behavior

| Element | Mobile (<768px) | Desktop (≥768px) |
|---------|-----------------|------------------|
| Sidebar | Slide-out drawer | Fixed left |
| Split View | Stacked vertical | Side-by-side |
| Tables | Horizontal scroll | Full width |
| KPI Cards | 2x2 grid | 1x4 row |

## 🧪 Testing

```bash
# Build check (TypeScript + ESLint)
npm run build

# Lint
npm run lint
```

## 🚀 Deployment

Deploy to Vercel:
```bash
npm run build
npx vercel --prod
```

Or any Node.js hosting platform supporting Next.js.

## 📝 Phase 3: Backend Integration

When ready to integrate with the backend API:

1. **Replace MockDataContext** with API calls in `lib/api/`
2. **Update CRUD operations** to call REST endpoints
3. **Add authentication** (JWT/Session)
4. **Implement real-time updates** if needed

Expected API endpoints per entity:
```
GET    /api/{entity}         # List with pagination
GET    /api/{entity}/:id     # Get single
POST   /api/{entity}         # Create
PUT    /api/{entity}/:id     # Update
DELETE /api/{entity}/:id     # Delete
```

## 📄 License

Proprietary - Hotel Management System

---

Built with ❤️ for Hotel Management
