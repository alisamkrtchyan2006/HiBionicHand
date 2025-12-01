# Admin Panel Documentation

## Overview

The admin panel is a comprehensive CRUD interface built with React and Material-UI (MUI) for managing all content on the hiBionicHand platform.

## Structure

```
frontend/src/
├── app/admin/
│   ├── layout.tsx                    # Admin layout with sidebar
│   ├── page.tsx                       # Dashboard (to be created)
│   ├── products/
│   │   ├── page.tsx                   # Products list
│   │   ├── new/page.tsx               # Create product
│   │   └── [id]/edit/page.tsx         # Edit product
│   ├── news/
│   │   ├── page.tsx                   # News list
│   │   ├── new/page.tsx               # Create news
│   │   └── [id]/edit/page.tsx         # Edit news
│   ├── team/
│   │   ├── page.tsx                   # Team/users list
│   │   ├── new/page.tsx               # Create user (to be created)
│   │   └── [id]/edit/page.tsx         # Edit user (to be created)
│   ├── partners/
│   │   ├── page.tsx                   # Partners list
│   │   ├── new/page.tsx               # Create partner
│   │   └── [id]/edit/page.tsx         # Edit partner
│   └── reviews/
│       ├── page.tsx                   # Reviews list
│       └── [id]/edit/page.tsx         # Edit review
│
└── components/admin/
    ├── DataTable.tsx                  # Reusable data table
    ├── StatusChip.tsx                  # Status indicator chip
    ├── ProductForm.tsx                 # Product form component
    ├── NewsForm.tsx                    # News form component
    ├── PartnerForm.tsx                 # Partner form component
    └── ReviewForm.tsx                  # Review form component
```

## Features

### 1. Products Management
- List all products with pagination
- Create new products with multilanguage support
- Edit existing products
- Delete products
- Product form includes:
  - Basic information (type, slug, SKU, status)
  - Multilanguage translations (EN, RU, ARM)
  - Product specifications

### 2. News Management
- List all news articles with pagination
- Create new articles
- Edit existing articles
- Delete articles
- News form includes:
  - Basic information (slug, status, published date)
  - Multilanguage translations (EN, RU, ARM)
  - SEO metadata

### 3. Team Management
- List all users/team members
- View user details
- Edit user information
- Delete users
- Filter by role and status

### 4. Partners Management
- List all partners
- Create new partners
- Edit existing partners
- Delete partners
- Partner form includes:
  - Basic information (name, logo, website)
  - Multilanguage descriptions

### 5. Reviews Management
- List all reviews with status filter
- Edit review status (pending/approved/rejected)
- Mark reviews as featured
- Delete reviews
- Review form includes:
  - Basic information (author, rating, status)
  - Multilanguage translations

## Components

### DataTable
Reusable table component with:
- Pagination
- Sorting
- Action buttons (Edit, Delete, View)
- Custom column formatting
- Empty state handling

### StatusChip
Color-coded status indicator:
- Success (green): Published, Approved, Active
- Warning (yellow): Draft, Pending
- Error (red): Archived, Rejected, Inactive

### Form Components
All form components follow the same pattern:
- Tabbed interface for organization
- Multilanguage support
- Validation
- Loading states
- Error handling

## API Integration

All components use the `apiClient` from `@/lib/api/client` which:
- Automatically adds authentication tokens
- Handles errors
- Redirects to login on 401 errors

## Authentication

The admin panel requires authentication. The layout component checks for authentication and redirects to login if needed.

## Usage

1. Navigate to `/admin` (requires login)
2. Use the sidebar to navigate between sections
3. Click "Add" buttons to create new items
4. Click edit icon to modify existing items
5. Click delete icon to remove items (with confirmation)

## Environment Variables

Required:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3000/api/v1)

## Dependencies

- `@mui/material` - Material-UI components
- `@mui/icons-material` - Material-UI icons
- `axios` - HTTP client
- `next/navigation` - Next.js navigation

## Future Enhancements

- [ ] Dashboard with statistics
- [ ] Bulk operations
- [ ] Advanced filtering
- [ ] Export functionality
- [ ] Media library integration
- [ ] Rich text editor for content
- [ ] Image upload component
- [ ] User form component
- [ ] Activity log

