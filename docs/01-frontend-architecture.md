# Frontend Architecture Specification

Version: 1.0

Status: Frozen

Owner: Frontend Team

Last Updated: July 2026

---

# Purpose

This document defines the architecture of the frontend application.

Every developer and AI coding agent must follow this specification.

The objective is to ensure that the application remains scalable, maintainable, modular and production-ready throughout development.

This document intentionally avoids UI implementation details. Visual design is documented separately.

---

# Architecture Philosophy

The frontend follows a Feature-First Architecture.

Business logic, UI, routing, services and state management are separated by responsibility.

Core principles:

- Feature isolation
- Component reusability
- Single responsibility
- Composition over inheritance
- Type safety
- Predictable state
- API abstraction
- Clear separation of concerns

---

# High-Level Architecture

```text
                Next.js App Router
                        │
        ┌───────────────┴───────────────┐
        │                               │
 Public Routes                  Protected Routes
        │                               │
 Landing Pages                  Dashboard Layout
        │                               │
 Shared Components        Feature Modules
        │                               │
        └─────────── Service Layer ───────────┐
                                              │
                                     React Query
                                              │
                                       FastAPI Backend
```

---

# Application Structure

```
frontend/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │
│   ├── components/
│   │
│   ├── features/
│   │
│   ├── providers/
│   │
│   ├── services/
│   │
│   ├── hooks/
│   │
│   ├── store/
│   │
│   ├── shared/
│   │
│   ├── types/
│   │
│   ├── mocks/
│   │
│   ├── constants/
│   │
│   ├── lib/
│   │
│   ├── styles/
│   │
│   └── assets/
│
├── package.json
│
└── tsconfig.json
```

---

# App Router

The application uses the Next.js App Router.

```
app/

(layout)

(auth)

(dashboard)

(api if required)

loading.tsx

error.tsx

not-found.tsx

layout.tsx

page.tsx
```

Never place business logic inside route files.

Pages only compose feature modules.

---

# Route Groups

```
app

├── (marketing)
│
├── (auth)
│
├── (dashboard)
```

Purpose

Marketing pages remain completely isolated from dashboard code.

---

# Public Routes

```
/

/features

/about

/contact

/login

/register

/forgot-password

/reset-password
```

No authentication required.

---

# Protected Routes

```
/dashboard

/environment

/social

/governance

/team

/reports

/settings

/profile
```

Authentication required.

---

# Dashboard Layout

Dashboard Layout is shared across every authenticated page.

```
Dashboard

├── Sidebar

├── Header

├── Breadcrumb

├── Page Container

└── Content
```

Never recreate dashboard layouts.

---

# Feature Architecture

Each feature owns:

- components
- hooks
- services
- types
- constants

Example

```
features/

dashboard/

environment/

social/

governance/

reports/

team/

settings/

profile/
```

Every feature should be independently maintainable.

---

# Components

Shared components belong here.

```
components/

ui/

layout/

navigation/

charts/

tables/

forms/

feedback/

common/
```

Rules

Feature-specific components should never live here.

---

# Providers

```
providers/

ThemeProvider

QueryProvider

AuthProvider
```

Only application-wide providers belong here.

---

# Services

All API communication happens here.

```
services/

auth.service.ts

dashboard.service.ts

department.service.ts

environment.service.ts

social.service.ts

governance.service.ts

report.service.ts
```

Components must never call fetch() directly.

---

# React Query Strategy

Every API request should use React Query.

```
Query

Mutation

Optimistic Updates

Cache Invalidation
```

Rules

Never manually cache server state.

---

# Zustand Strategy

Only UI state belongs inside Zustand.

Examples

- Sidebar collapsed
- Theme
- Notifications
- User preferences

Never store server data inside Zustand.

---

# Hooks

Shared hooks

```
hooks/

useAuth

useTheme

useDebounce

useBreakpoint

useToast

usePagination
```

Feature-specific hooks stay inside features.

---

# Type System

```
types/

auth.ts

user.ts

department.ts

dashboard.ts

report.ts

challenge.ts

api.ts
```

Never duplicate interfaces.

---

# Mock Layer

During frontend development,

services consume mock data.

```
mocks/

users.ts

dashboard.ts

departments.ts

reports.ts
```

Backend integration replaces mock services later.

---

# Constants

```
constants/

routes.ts

roles.ts

permissions.ts

theme.ts

api.ts
```

Never hardcode routes.

---

# Shared Utilities

```
lib/

api-client.ts

validators.ts

helpers.ts

formatters.ts

date.ts

storage.ts
```

---

# State Ownership

Component State

↓

React useState

Feature State

↓

Feature Hooks

Global UI

↓

Zustand

Server Data

↓

React Query

---

# Authentication

Authentication is handled globally.

Flow

```
Login

↓

Receive Tokens

↓

Store Securely

↓

Fetch Profile

↓

Initialize Session

↓

Dashboard
```

Protected pages should never perform authentication logic themselves.

---

# Error Handling

Every API request must provide:

Loading

Success

Error

Empty

States.

Never render blank screens.

---

# Loading Strategy

Every page must include:

Skeleton

↓

Content

Never show spinning loaders for page initialization.

---

# Error Boundaries

App Level

↓

Feature Level

↓

Component Level

Critical errors should never crash the entire application.

---

# Folder Ownership

Pages

Routing

Features

Business UI

Components

Reusable UI

Services

API

Providers

Global Providers

Hooks

Logic

Store

Global UI State

---

# Naming Conventions

Components

PascalCase

Hooks

camelCase

Files

kebab-case

Types

PascalCase

Constants

UPPER_SNAKE_CASE

---

# Imports

Order

1.

React

2.

Next

3.

Third-party

4.

Shared

5.

Features

6.

Relative

---

# Styling

Tailwind CSS

No inline styles.

Reusable variants through CVA.

---

# Motion

Landing

GSAP

Dashboard

Framer Motion

Never mix animation libraries on the same screen.

---

# Performance

Dynamic imports

Lazy loading

Suspense

Image optimization

Memoization only when necessary

Avoid premature optimization.

---

# Accessibility

Semantic HTML

Keyboard support

ARIA labels

Visible focus

Proper heading hierarchy

---

# Security

Never expose secrets.

Never trust frontend validation.

Always validate forms.

Escape dynamic HTML.

---

# Development Workflow

Feature

↓

Components

↓

Services

↓

Mock Data

↓

Integration

↓

Testing

---

# Final Principle

Every feature should be removable without breaking the rest of the application.

If removing one feature breaks another,

the architecture needs improvement.