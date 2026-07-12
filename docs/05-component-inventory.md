# Component Inventory Specification

Version: 1.0

Status: Frozen

Owner: Frontend Team

Last Updated: July 2026

---

# Purpose

This document defines every reusable frontend component.

No developer or AI agent should create duplicate components without updating this document.

Shared components belong inside:

src/components

Feature-specific components belong inside:

src/features/<feature>/components

---

# Component Philosophy

Every component must be:

- Reusable
- Composable
- Accessible
- Responsive
- Theme-aware
- Typed
- Documented

Components should solve one problem only.

---

# Folder Structure

```
components/

ui/
layout/
navigation/
dashboard/
cards/
charts/
tables/
forms/
feedback/
common/
```

---

# UI Components

## Button

Variants

Primary

Secondary

Outline

Ghost

Destructive

Link

Icon

States

Default

Hover

Active

Loading

Disabled

---

## Input

Supports

Label

Helper Text

Prefix

Suffix

Validation

Error

Disabled

Loading

---

## Password Input

Supports

Show Password

Hide Password

Strength Meter

Validation

---

## Textarea

Autosize

Validation

Counter

---

## Select

Searchable

Keyboard Accessible

Multi Select (Future)

---

## Checkbox

---

## Radio Group

---

## Switch

---

## Badge

Variants

Success

Warning

Danger

Info

Neutral

Primary

---

## Avatar

Image

Fallback

Status

Size Variants

---

## Tooltip

---

## Popover

---

## Dialog

---

## Drawer

---

## Sheet

---

## Dropdown Menu

---

## Command Menu

---

## Accordion

---

## Tabs

---

## Separator

---

## Progress

Linear

Circular (Future)

---

## Spinner

Used only for inline actions.

Never page loading.

---

## Skeleton

Text

Card

Table

Chart

Avatar

List

---

## Toast

Success

Error

Warning

Info

---

## Alert

Success

Warning

Danger

Info

---

# Layout Components

---

## AppLayout

Application root layout.

---

## DashboardLayout

Sidebar

Header

Content

---

## Header

Contains

Breadcrumb

Search

Quick Actions

Notifications

Theme Toggle

Profile

---

## Sidebar

Expanded

Collapsed

Mobile Drawer

Role Aware

---

## Breadcrumb

---

## Footer

Landing only.

---

## PageContainer

Standard page wrapper.

---

## PageHeader

Contains

Title

Description

Primary Action

Secondary Action

---

## Section

Reusable content section.

---

# Navigation Components

---

## SidebarItem

---

## SidebarGroup

---

## NavigationMenu

---

## ThemeToggle

---

## UserMenu

---

## NotificationBell

---

## GlobalSearch

---

# Dashboard Components

---

## KPI Card

Shows

Title

Icon

Value

Trend

Subtitle

---

## ESG Score Card

Displays

Overall ESG

Environmental

Social

Governance

---

## Insight Card

Displays

Recommendation

Severity

CTA

---

## Activity Card

Displays

Recent Activity

---

## Leaderboard Card

Displays

Top Employees

Departments

---

## Quick Actions Card

Contains

Action Buttons

---

## Recommendation Card

AI-ready

---

# Workspace Components

---

## Department Card

---

## Member Card

---

## Role Badge

---

## Department Overview

---

## Member List

---

## Invite Dialog

---

# Environmental Components

---

## Carbon Card

---

## Energy Card

---

## Water Card

---

## Waste Card

---

## Sustainability Goal Card

---

## Carbon Progress

---

# Social Components

---

## Participation Card

---

## CSR Activity Card

---

## Volunteer Card

---

## Leaderboard

---

# Governance Components

---

## Compliance Card

---

## Policy Card

---

## Audit Card

---

## Risk Card

---

# Report Components

---

## Report Card

---

## Export Dialog

---

## Analytics Summary

---

# Chart Components

---

## Line Chart

---

## Area Chart

---

## Bar Chart

---

## Pie Chart

---

## Donut Chart

---

## Radar Chart

---

## Trend Chart

---

## KPI Trend

---

## Chart Container

Shared wrapper.

---

# Table Components

---

## Data Table

Supports

Sorting

Filtering

Pagination

Search

Row Actions

Loading

---

## Member Table

---

## Department Table

---

## Report Table

---

## Policy Table

---

## Activity Table

---

# Form Components

---

## Login Form

---

## Register Form

---

## Forgot Password Form

---

## Reset Password Form

---

## Invite Member Form

---

## Department Form

---

## Policy Form

---

## Report Filter Form

---

# Profile Components

---

## Profile Card

---

## Account Details

---

## Security Panel

---

## Connected Accounts

---

# Feedback Components

---

## Empty State

Illustration

Title

Description

CTA

---

## Error State

Illustration

Retry

Message

---

## Success State

Animation

Title

CTA

---

## Offline State

---

## Maintenance State

---

## Permission Denied

---

# Common Components

---

## Logo

---

## LogoMark

---

## LogoFull

---

## Section Title

---

## Stat

---

## Metric

---

## Search Bar

---

## Filter Bar

---

## Date Picker

---

## Pagination

---

## Status Indicator

---

## Copy Button

---

## Theme Provider

---

## Scroll Area

---

## Loading Overlay

---

## Animated Counter

---

## Count Up

---

## Number Formatter

---

## Divider

---

## Chip

---

## Timeline

---

## Calendar

Future

---

# Animation Components

---

## Fade In

---

## Slide Up

---

## Stagger Container

---

## Reveal Section

Landing Only

---

## Scroll Progress

Landing Only

---

## Counter Animation

---

## Hover Card

---

## Floating Card

Landing Only

---

# Component Rules

Every reusable component must support:

Light Theme

Dark Theme

Loading

Disabled

Hover

Focus

Keyboard Navigation

Responsive Layout

Accessibility

TypeScript Props

Forward Ref (where applicable)

---

# Components NOT Allowed

Duplicate Buttons

Duplicate Cards

Duplicate Tables

Duplicate Forms

Page-specific shared components

Hardcoded UI

Inline Styles

Inline Fetch Calls

---

# Ownership

Shared Components

src/components

Feature Components

src/features/*/components

Never mix them.

---

# Future Components

AI Assistant Panel

Command Palette

Activity Timeline

Chat Widget

Real-time Notification Center

Organization Tree

Calendar

Advanced Filters

Markdown Editor

File Upload

Audit Timeline

---

# End of Component Inventory