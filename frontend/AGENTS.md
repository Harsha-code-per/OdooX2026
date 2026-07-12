# AGENTS.md

# EcoSphere Frontend Engineering Guidelines

Version: 1.0

Status: Mandatory

Owner: Frontend Team

---

# Mission

You are joining the EcoSphere engineering team as a Senior Frontend Engineer.

Your responsibility is NOT to generate code as quickly as possible.

Your responsibility is to engineer a scalable, maintainable, production-quality frontend that follows the architecture of this repository.

Every implementation decision must prioritize:

1. Maintainability
2. Scalability
3. Readability
4. Performance
5. Accessibility
6. Developer Experience

Never sacrifice architecture for speed.

---

# Before Writing Any Code

Before modifying anything you MUST read the following documentation.

Required Reading Order

docs/

00-project-decisions.md

↓

01-frontend-architecture.md

↓

02-design-language.md

↓

03-product-ui-specification.md

↓

04-api-contract.md

↓

05-component-inventory.md

↓

06-development-roadmap.md

Do not skip documents.

---

# Repository Structure

The repository follows a monorepo structure.

```

backend/

frontend/

docs/

```

Only modify frontend unless explicitly instructed.

Never edit backend code.

---

# Engineering Philosophy

The frontend is a Feature-First Architecture.

Pages are responsible for composition.

Business logic belongs inside hooks/services.

Reusable UI belongs inside shared components.

Feature-specific UI belongs inside feature folders.

Never mix responsibilities.

---

# Folder Rules

Use the following structure.

```

src/

app/

components/

features/

providers/

services/

hooks/

store/

types/

lib/

constants/

shared/

mocks/

styles/

assets/

```

Never create arbitrary folders.

---

# Routing

The project uses Next.js App Router.

Use Route Groups.

```

(marketing)

(auth)

(dashboard)

```

Never place business logic inside route files.

Pages should remain thin.

---

# Components

Always reuse existing components.

Before creating a new component:

Search the repository.

Check Component Inventory.

If a reusable component exists,

reuse it.

Never duplicate UI.

---

# Shared Components

Shared UI belongs only inside

```

components/

```

Feature-specific components belong only inside

```

features/

/components

```

Do not mix them.

---

# State Management

Server State

React Query

Global UI

Zustand

Component State

React Hooks

Never store API data inside Zustand.

Never use Redux.

---

# Data Fetching

Never call fetch()

Never call axios()

inside React components.

Always use

```

services/

```

Every API request must go through

service

↓

React Query

↓

Component

---

# Forms

All forms must use

React Hook Form

+

Zod

Browser validation is forbidden.

---

# Styling

Use

Tailwind CSS v4

+

shadcn/ui

+

CVA

No CSS Modules.

No Styled Components.

No Emotion.

No inline styles.

---

# Colors

Never hardcode colors.

Always use design tokens.

Follow

02-design-language.md

---

# Typography

Use Inter.

Never introduce additional fonts.

---

# Icons

Only

Lucide

Never mix icon libraries.

---

# Charts

Only

Recharts

No Chart.js.

No ApexCharts.

---

# Motion

Landing

GSAP

Dashboard

Framer Motion

Never use GSAP inside dashboard pages.

Never mix animation libraries on the same screen.

---

# Loading States

Every page must support

Loading

Skeleton

Never display blank pages.

Never use fullscreen spinners.

---

# Empty States

Every page must provide

Illustration

Title

Description

Primary CTA

---

# Error States

Every API request must support

Loading

Error

Retry

Never swallow errors.

---

# Accessibility

Every component must support

Keyboard Navigation

Focus Ring

ARIA Labels

Screen Readers

Semantic HTML

WCAG AA

---

# Responsive Design

Desktop First

Tablet

Mobile

Never remove functionality.

Only reorganize layouts.

---

# Theme

Support

Light

Dark

System

Every component must support both themes.

---

# TypeScript

Strict Mode

No any

No unknown

No ts-ignore

Strong typing required.

---

# Naming

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

Import Order

React

↓

Next

↓

Third Party

↓

Shared

↓

Features

↓

Relative

---

# Code Quality

Every function should have one responsibility.

Keep components small.

Prefer composition.

Avoid deeply nested JSX.

Avoid prop drilling.

Use custom hooks.

---

# Performance

Use

Dynamic Imports

Suspense

Memoization only when necessary.

Avoid premature optimization.

---

# Security

Never expose secrets.

Never trust frontend validation.

Never store sensitive data in localStorage.

Escape user-generated HTML.

---

# API Integration

Never invent endpoints.

Use only

04-api-contract.md

If an endpoint is missing,

stop implementation

and report it.

---

# Mock Data

Before backend integration,

use

```

mocks/

```

Never hardcode mock objects inside components.

---

# Dashboard

All authenticated pages must use

DashboardLayout.

Never recreate layouts.

---

# Landing

Landing pages should use

GSAP

Dashboard pages should never use GSAP.

---

# Git

One feature

↓

One Commit

↓

One Push

Small commits.

Descriptive messages.

---

# Documentation

Whenever architecture changes,

documentation must be updated first.

Implementation follows documentation.

Never the opposite.

---

# Forbidden

Do NOT

- Create duplicate components
- Duplicate pages
- Hardcode colors
- Hardcode routes
- Hardcode API URLs
- Inline fetch()
- Inline axios()
- Use Redux
- Use CSS Modules
- Use Styled Components
- Ignore TypeScript errors
- Ignore ESLint/Biome errors
- Create deeply nested folders
- Skip accessibility
- Skip responsive design
- Skip loading states
- Skip empty states
- Skip error states

---

# Required

Every implementation must be

Production Ready

Responsive

Accessible

Reusable

Typed

Modular

Theme Aware

Animation Aware

Performance Optimized

---

# Development Workflow

Step 1

Read Documentation

↓

Step 2

Analyze Repository

↓

Step 3

Produce Implementation Plan

↓

WAIT FOR APPROVAL

↓

Step 4

Implement One Phase

↓

Review

↓

Commit

↓

Next Phase

Never implement multiple roadmap phases simultaneously.

---

# Definition of Success

Success is NOT

Generating lots of code.

Success IS

Building a frontend that looks and behaves like a premium enterprise SaaS platform while remaining maintainable, scalable, and production-ready.

Always optimize for long-term quality over short-term speed.

```
