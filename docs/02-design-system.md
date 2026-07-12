# EcoSphere Design Language Specification

Version: 1.0

Status: Frozen

Owner: Frontend Team

Last Updated: July 2026

---

# Purpose

This document defines the complete visual language for EcoSphere.

Every interface, component, animation, interaction and layout must follow this specification.

The objective is to create a premium enterprise SaaS experience comparable to products developed by companies such as Microsoft, Stripe, Vercel and Linear.

This document serves as the single source of truth for visual consistency.

---

# Design Philosophy

EcoSphere is not a marketing website.

EcoSphere is an Enterprise Operating System.

The interface should communicate:

• Trust

• Professionalism

• Intelligence

• Simplicity

• Sustainability

Every screen should feel calm.

Never overwhelming.

Never cluttered.

Never playful.

Instead:

Professional.

Minimal.

Confident.

---

# Design Principles

## 1. Clarity over Decoration

Every UI element must exist for a reason.

Never add visual elements simply because they "look cool."

---

## 2. Information First

Users should immediately understand:

Where they are

What they are seeing

What action they can perform

---

## 3. White Space is a Feature

Large spacing is encouraged.

Avoid cramped layouts.

Let content breathe.

---

## 4. Motion with Purpose

Animations should explain.

Never distract.

Motion should improve comprehension.

---

## 5. Consistency

Every button

Every card

Every modal

Every table

Every spacing

Every radius

Must feel like they belong to the same product.

---

# Brand Identity

Product Name

EcoSphere

Tagline

Enterprise ESG Intelligence Platform

Brand Personality

Professional

Innovative

Reliable

Modern

Human

Data-Driven

---

# Visual Inspiration

Primary References

• Linear

• Stripe Dashboard

• Microsoft Fabric

• Vercel Dashboard

• GitHub

Secondary References

• Notion

• Arc Browser

Avoid copying Odoo visually.

Instead,

create something cleaner and more premium.

---

# Typography

Primary Font

Inter

Fallback

system-ui

Font Philosophy

Readable.

Neutral.

Professional.

---

# Font Scale

Display

56px

H1

40px

H2

32px

H3

28px

H4

24px

H5

20px

H6

18px

Body Large

18px

Body

16px

Small

14px

Caption

12px

Line Height

1.5

Font Weight

Regular

Medium

Semibold

Bold

Never use ExtraBold.

---

# Spacing System

Use an 8-point spacing system.

Allowed spacing values:

4

8

12

16

20

24

32

40

48

56

64

80

96

Never invent arbitrary spacing values.

---

# Border Radius

Small

8px

Medium

12px

Large

16px

Extra Large

24px

Cards

12px

Dialogs

16px

Buttons

10px

---

# Elevation

Use subtle shadows.

Never create floating UI everywhere.

Levels

Level 0

None

Level 1

Cards

Level 2

Dropdowns

Level 3

Dialogs

Level 4

Command Palette

Shadow opacity should remain below 15%.

---

# Color Philosophy

Green should represent success.

Not the entire application.

The UI should primarily be neutral.

Green highlights ESG.

---

# Primary Palette

Primary

Emerald 600

#059669

Primary Hover

Emerald 700

#047857

Secondary

Blue 600

#2563EB

Accent

Amber 500

#F59E0B

Success

Green 600

#16A34A

Warning

Orange 500

#F97316

Danger

Rose 600

#E11D48

Info

Sky 500

#0EA5E9

---

# Neutral Palette

Background

Slate 50

Surface

White

Border

Slate 200

Text Primary

Slate 900

Text Secondary

Slate 600

Muted

Slate 500

Dark Background

Slate 950

Dark Surface

Slate 900

Dark Border

Slate 800

---

# Light Theme

Background

#F8FAFC

Cards

White

Text

Slate 900

Borders

Slate 200

---

# Dark Theme

Background

#020617

Cards

#0F172A

Text

White

Borders

Slate 800

---

# Iconography

Library

Lucide

Rules

Outlined icons only.

No filled icons.

Consistent size.

Default

20px

Navigation

22px

Headers

24px

---

# Buttons

Variants

Primary

Secondary

Ghost

Outline

Destructive

Link

States

Default

Hover

Active

Disabled

Loading

Never use gradients.

---

# Inputs

Rounded

12px

Label always visible.

Support helper text.

Support validation.

Support error state.

---

# Cards

Cards are the primary information container.

Padding

24px

Radius

12px

Border

1px

Shadow

Very subtle

Never use glassmorphism.

---

# Tables

Enterprise tables.

Features

Sorting

Filtering

Pagination

Search

Sticky Header

Responsive

Alternating row hover

---

# Charts

Library

Recharts

Theme

Minimal

Charts

Line

Bar

Area

Pie

Radar

Donut

Avoid 3D charts.

---

# Navigation

Sidebar

Collapsed

Expanded

Floating tooltips

Active indicators

Header

Sticky

Transparent on scroll only for landing page.

Solid inside dashboard.

---

# Forms

Always use

React Hook Form

+

Zod

Validation

Realtime

Errors

Inline

Never rely on browser validation.

---

# Empty States

Every page must have

Illustration

Description

CTA

---

# Loading States

Use Skeletons.

Avoid centered spinners.

---

# Toasts

Top Right

Duration

3 seconds

Variants

Success

Error

Warning

Info

---

# Motion Philosophy

Motion communicates hierarchy.

Never decorate.

---

# Landing Page Motion

Library

GSAP

Allowed

Hero Reveal

Scroll Storytelling

Feature Reveal

Counters

Parallax

Timeline

Logo animation

Avoid

Looping animations

Heavy particles

Distracting effects

---

# Dashboard Motion

Library

Framer Motion

Allowed

Fade

Slide

Scale

Hover

Modal transitions

Sidebar animation

Dropdown animation

Card reveal

Forbidden

Parallax

Long entrance animations

Scroll hijacking

---

# Animation Duration

Fast

150ms

Normal

250ms

Slow

400ms

Never exceed 500ms.

---

# Grid System

Desktop

12 Columns

Tablet

8 Columns

Mobile

4 Columns

---

# Page Width

Maximum

1440px

Content Width

1280px

Centered

Always

---

# Accessibility

Minimum

WCAG AA

Focus Rings

Required

Keyboard Navigation

Required

Color Contrast

Required

Screen Reader Support

Required

---

# Micro Interactions

Allowed

Button hover

Card hover

Tooltip

Dropdown

Toggle

Switch

Accordion

Progress animation

Counter animation

Forbidden

Continuous animation

Autoplay animations

Attention-seeking movement

---

# Responsive Philosophy

Desktop First

Tablet

Mobile

Never hide functionality on mobile.

Only simplify layout.

---

# Component Quality Rules

Every component must support:

Loading

Empty

Error

Disabled

Success

Hover

Focus

Keyboard

Dark Mode

---

# Final Principle

Every screen should answer three questions within three seconds:

Where am I?

What is important here?

What can I do next?

If a user cannot answer those questions immediately,

the design has failed.
