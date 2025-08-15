# Overview

GTUWALA is a student-focused web application designed for GTU (Gujarat Technological University) students aged 17-25. The platform provides comprehensive access to academic resources including question papers, syllabi, study materials, and various educational tools. The application features a modern, responsive design with light/dark mode support, smooth animations, and mobile-optimized layouts. Users can access most content without authentication, while login is only required for interactive features like commenting, resource sharing, and support requests.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React with TypeScript, utilizing modern development practices and a component-based architecture. The frontend implements a Single Page Application (SPA) pattern with client-side routing using Wouter, providing smooth navigation without page reloads. State management is handled through React Query for server state and React Context for global application state like theme preferences.

The UI component system is based on shadcn/ui components built on top of Radix UI primitives, ensuring accessibility and consistent design patterns. Styling is implemented using Tailwind CSS with custom CSS variables for theme management, supporting both light and dark modes with smooth transitions.

## Backend Architecture
The server architecture follows a REST API pattern built with Express.js and TypeScript. The application uses a modular structure with separate route handlers, middleware, and service layers. Authentication is implemented using Replit's OpenID Connect (OIDC) integration with Passport.js, providing secure user sessions stored in PostgreSQL.

The backend implements session-based authentication with optional login functionality, allowing users to access most content without authentication while requiring login only for interactive features like commenting and resource sharing.

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema includes tables for users, blog posts, comments, ratings, notifications, and resource cards. Session storage is handled through connect-pg-simple for reliable session management.

Database migrations are managed through Drizzle Kit, ensuring consistent schema evolution across environments. The connection to PostgreSQL is established using Neon's serverless driver for optimal performance and scalability.

## Theme and UI Management
A comprehensive theming system is implemented using CSS custom properties and Tailwind CSS classes. The application defaults to light mode with a toggle option for dark mode, with user preferences persisted in localStorage. The design includes a scroll progress bar with gradient colors (blue to pink), scroll-to-top functionality, and dismissible alert notifications.

All animations are designed to be smooth and performant, with special attention to mobile responsiveness and touch interactions. The component library provides consistent spacing, typography, and color schemes across the application.

## Routing and Navigation
Client-side routing is implemented using Wouter, providing a lightweight alternative to React Router. The routing system includes protected routes for admin functionality and conditional rendering based on authentication status. The navigation structure supports both authenticated and non-authenticated user flows.

# External Dependencies

## Database and ORM
- **PostgreSQL**: Primary database using Neon serverless driver (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database operations and schema management (drizzle-orm, drizzle-zod)
- **Drizzle Kit**: Database migration and schema management tools

## Authentication and Session Management
- **Replit Auth**: OpenID Connect integration for user authentication
- **Passport.js**: Authentication middleware (openid-client/passport)
- **Express Session**: Session management (express-session)
- **connect-pg-simple**: PostgreSQL session store

## UI and Component Libraries
- **Radix UI**: Primitive components for accessibility (@radix-ui/react-*)
- **shadcn/ui**: Pre-built component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

## Frontend Framework and Tools
- **React**: UI library with TypeScript support
- **Vite**: Build tool and development server
- **React Query**: Server state management (@tanstack/react-query)
- **Wouter**: Lightweight client-side routing
- **React Hook Form**: Form management (@hookform/resolvers)

## Development and Build Tools
- **TypeScript**: Type safety across the application
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **TSX**: TypeScript execution for development server

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utilities
- **class-variance-authority**: Component variant management
- **memoizee**: Function memoization for performance optimization