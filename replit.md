# replit.md

## Overview

This is a full-stack web application for KSR Agros, an agricultural equipment company. The application serves as a product catalog and company website with an admin panel for content management. It features a React frontend with a Node.js/Express backend, using PostgreSQL for data storage via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (July 2025)

✓ **Image Upload System**: Implemented local image upload functionality with Base64 conversion
✓ **Category-Product Relationships**: Fixed API queries to properly filter products by category
✓ **Enhanced Admin Panel**: Added ImageUpload component and category selection for products
✓ **Improved UI/UX**: 
  - Modern gradient header with stylish navigation
  - Enhanced floating WhatsApp button with "Contact Us!" text
  - Better category page navigation with "View All Categories" button
✓ **Performance Optimization**: Local image storage for faster loading times
✓ **Product Organization**: Products now properly grouped by categories on main products page
✓ **Telugu Translation System**: 
  - Complete bilingual support (English/Telugu) with toggle button in header
  - Product names remain in English as requested, all other content translates
  - Covers all pages: home, categories, products, header, floating WhatsApp
  - Persistent language selection stored in localStorage
✓ **Enhanced Image Upload System**:
  - Automatic image compression and resizing for better performance
  - Comprehensive error handling with user-friendly messages
  - Increased server payload limit to 10MB
  - Proper static file serving for uploaded images
  - Better validation for file types and sizes
  - Toast notifications for upload success/failure

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state management
- **UI Components**: Radix UI primitives with custom Tailwind CSS styling (shadcn/ui)
- **Styling**: Tailwind CSS with custom agricultural theme colors
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with JSON responses
- **Middleware**: Custom logging, error handling, and JSON parsing
- **Development**: Hot module replacement via Vite integration

### Database Architecture
- **Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Schema Location**: Shared schema in `/shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Database Schema
- **carousel_images**: Hero carousel management
- **categories**: Product categorization
- **products**: Product catalog with features, pricing, and categorization
- **admins**: Admin user authentication

### API Endpoints
- **Carousel Management**: GET/POST/PUT/DELETE `/api/carousel`
- **Categories**: Full CRUD operations for product categories
- **Products**: Product management with featured/related product support
- **Authentication**: Admin login system at `/api/auth/login`

### Frontend Pages
- **Home**: Hero carousel, featured products, company info (bilingual)
- **Categories**: Category listing and category-specific product views (bilingual)
- **Products**: Complete product catalog (bilingual)
- **Product Detail**: Individual product pages with related products
- **About**: Company information and story
- **Contact**: Contact form and company details
- **Admin**: Protected admin panel for content management

### Internationalization
- **Language Context**: React context for language state management
- **Translation System**: Comprehensive English/Telugu translation support
- **UI Elements**: Language toggle button in header (desktop & mobile)
- **Data Persistence**: Language preference stored in localStorage
- **Selective Translation**: Product names remain in English, all other content translates

### Authentication System
- **Client-side**: Local storage-based admin session management
- **Server-side**: Session-based authentication (infrastructure in place)
- **Protected Routes**: Admin panel requires authentication

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack React Query
2. **Server Processing**: Express routes handle requests and interact with database
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Handling**: JSON responses with proper error handling
5. **Client Updates**: React Query manages cache invalidation and UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL driver for Neon Database
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **wouter**: Client-side routing
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **drizzle-kit**: Database migration and introspection tool
- **@replit/vite-plugin-***: Replit-specific development plugins

### Third-party Integrations
- **WhatsApp Business**: Direct customer communication via WhatsApp links
- **Unsplash**: Placeholder images for products and content

## Deployment Strategy

### Development
- **Client**: Vite dev server with hot module replacement
- **Server**: tsx with automatic restarts on file changes
- **Database**: Drizzle push for schema synchronization

### Production Build
- **Client**: Vite build to `/dist/public`
- **Server**: esbuild bundle to `/dist/index.js`
- **Database**: Drizzle migrations via `drizzle-kit`

### Environment Configuration
- **Database**: `DATABASE_URL` environment variable required
- **Build**: Separate client and server build processes
- **Serving**: Express serves static files in production

### Key Architectural Decisions

1. **Monorepo Structure**: Client, server, and shared code in single repository for easier development and deployment
2. **Shared Schema**: TypeScript schema definitions shared between client and server for type safety
3. **Static File Serving**: Express serves built React app in production with API routes
4. **Database-First**: Schema-driven development with Drizzle ORM providing type safety
5. **Component Library**: Radix UI + Tailwind for accessible, customizable components
6. **Agricultural Theme**: Custom color palette and branding for agricultural industry
7. **Mobile-First**: Responsive design with mobile optimization
8. **WhatsApp Integration**: Direct customer communication channel for inquiries
9. **Admin Panel**: Separate authentication system for content management
10. **Performance**: React Query for efficient data fetching and caching