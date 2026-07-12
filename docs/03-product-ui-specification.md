# Product UI Specification

Version: 1.0

Status: Frozen

Owner: Frontend Team

Last Updated: July 2026

---

# Chapter 1

Global UX Principles

Layout System

Navigation

Responsive Behaviour

---

# Purpose

This document defines the complete user experience of EcoSphere.

Every screen, interaction, layout and workflow described here must be implemented consistently throughout the application.

This document is intentionally implementation-independent.

Developers should focus on behaviour rather than code.

---

# Product Vision

EcoSphere should feel like a modern Enterprise Operating System.

It should combine the simplicity of Linear with the analytical power of Microsoft Fabric and the elegance of Stripe Dashboard.

Users should feel:

• Confident

• Focused

• Productive

• In Control

The interface should never feel cluttered.

Every screen should answer three questions immediately:

1. Where am I?

2. What is important?

3. What should I do next?

---

# UX Principles

## 1. Minimize Cognitive Load

Users should never process more information than necessary.

Group related information.

Hide advanced functionality until required.

Reduce unnecessary decisions.

---

## 2. Progressive Disclosure

Show only what users need.

Reveal complexity gradually.

Example

Owner

↓

Dashboard

↓

Department

↓

Department Details

↓

Employee Details

Never overwhelm users immediately.

---

## 3. Immediate Feedback

Every interaction must produce visible feedback.

Buttons

Hover

Active

Loading

Success

Failure

Forms

Validation

Save

Error

Deletion

Confirmation

---

## 4. Consistency

Every page should follow identical layout patterns.

Headers

Spacing

Cards

Tables

Actions

Navigation

Dialogs

Users should never "learn" a page twice.

---

## 5. Speed

The interface should feel instantaneous.

Perceived performance is as important as actual performance.

Use

Skeletons

Optimistic Updates

Transitions

Never block the UI unnecessarily.

---

# User Personas

The platform supports four user types.

## Organization Owner

Highest authority.

Primary Goals

Monitor organization.

Create departments.

Manage users.

Review ESG.

Generate reports.

Approve activities.

---

## Administrator

Primary Goals

Manage teams.

Moderate activities.

Support organization owner.

---

## Department Manager

Primary Goals

Track department performance.

Approve submissions.

Review department analytics.

---

## Employee

Primary Goals

Complete activities.

Earn rewards.

Track contributions.

Participate in ESG initiatives.

---

# Navigation Philosophy

Navigation should feel shallow.

Users should never click through multiple nested menus.

Maximum navigation depth:

Three Levels

Good

Dashboard

↓

Environmental

↓

Activity

Bad

Dashboard

↓

Workspace

↓

Departments

↓

Engineering

↓

Employee

Avoid excessive nesting.

---

# Primary Navigation

The application consists of two experiences.

Marketing

Application

These remain completely isolated.

---

# Marketing Navigation

Logo

Features

Platform

Security

About

Contact

Login

Get Started

---

# Application Navigation

Sidebar

Dashboard

Workspace

Environmental

Social

Governance

Reports

Settings

Profile

Logout

---

# Sidebar Structure

```
Dashboard

Workspace
    Departments
    Members
    Roles

Environmental
    Overview
    Carbon Tracking
    Sustainability Goals

Social
    CSR Activities
    Participation

Governance
    Policies
    Compliance

Reports
    Analytics
    Exports

Settings

Profile
```

Navigation should support:

Expanded Mode

Collapsed Mode

Mobile Drawer

Keyboard Navigation

---

# Global Layout

Every authenticated page follows the same structure.

```
┌────────────────────────────────────────────┐
│ Header                                     │
├──────────────┬─────────────────────────────┤
│              │                             │
│              │                             │
│              │                             │
│ Sidebar      │ Main Content                │
│              │                             │
│              │                             │
│              │                             │
├──────────────┴─────────────────────────────┤
│ Footer (optional)                          │
└────────────────────────────────────────────┘
```

Never recreate layouts.

Only content changes.

---

# Header

The header is global.

Contains

Breadcrumb

Search

Notifications

Theme Toggle

Profile Menu

Organization Name

Quick Actions

The header remains sticky.

---

# Sidebar

The sidebar is the application's primary navigation.

Requirements

Collapsible

Animated

Keyboard Accessible

Role Aware

Responsive

Persistent between pages

---

# Breadcrumbs

Every page must include breadcrumbs.

Example

Dashboard

↓

Workspace

↓

Departments

↓

Engineering

Users should always know their location.

---

# Page Structure

Every page follows the same hierarchy.

```
Page Header

↓

Quick Actions

↓

Primary Content

↓

Secondary Content

↓

Footer Actions
```

Consistency improves usability.

---

# Page Header

Every page header contains

Title

Description

Primary Action

Secondary Action

Contextual Information

Example

Department

Engineering

Manage employees and ESG performance for this department.

[Invite Employee]

[Export]

---

# Cards

Cards represent a single concept.

Never combine unrelated information.

Good

ESG Score

Bad

ESG Score

Notifications

Charts

Profile

Everything inside one card.

---

# Empty States

Every page must define

Illustration

Headline

Description

Call To Action

Example

No Departments

Create your first department to begin tracking ESG performance.

[Create Department]

---

# Loading States

Every page uses skeletons.

Never display blank pages.

Never use centered loading spinners.

---

# Error States

Every error should explain

What happened

Why

How to recover

Example

Unable to load reports.

Retry

Go Back

Contact Administrator

---

# Notifications

Notification Center

Unread Counter

Grouped by Date

Clickable

Mark All Read

Dismiss

---

# Search

Global Search

Accessible from Header.

Future Scope

Command Palette

Search should support

Users

Departments

Reports

Activities

Settings

---

# Theme

Three Modes

Light

Dark

System

Theme preference persists across sessions.

---

# Responsive Behaviour

Desktop

Primary Experience

Tablet

Adaptive Layout

Mobile

Simplified Layout

Never remove functionality.

Only rearrange content.

---

# Keyboard Accessibility

Required Shortcuts

Ctrl + K

Global Search

Esc

Close Dialog

Tab

Navigate

Enter

Primary Action

---

# Motion Philosophy

Motion reinforces hierarchy.

Never distracts.

Allowed

Page Fade

Card Entrance

Sidebar Collapse

Modal Scale

Toast Slide

Hover Elevation

Forbidden

Long Intro Animations

Infinite Motion

Heavy Background Effects

---

# Success Criteria

Users should be able to:

Navigate intuitively.

Understand every page instantly.

Complete core tasks without guidance.

Feel confident using the application.

---

# End of Chapter 1

# Chapter 2

Landing Experience Specification

---

# Purpose

The landing experience is the public face of EcoSphere.

Its objective is not merely to showcase features.

Its purpose is to establish credibility, communicate the product vision, demonstrate technical sophistication, and encourage users to begin using the platform.

The landing page should feel premium, modern and intentional.

Users should understand the product within one minute.

---

# Experience Philosophy

The landing page should feel like an interactive product presentation.

Not a brochure.

Every section should naturally lead into the next.

The user should feel guided rather than sold to.

---

# Navigation

The navigation bar remains visible throughout the landing experience.

Navigation Items

Logo

Platform

Features

Security

Technology

Contact

Login

Get Started

Behavior

Desktop

Transparent initially.

Becomes solid while scrolling.

Mobile

Drawer Navigation

Sticky

Always visible.

---

# Hero Section

Purpose

Immediately communicate the product's value.

Users should understand:

What EcoSphere is.

Who it is for.

Why it matters.

The Hero must occupy the full viewport.

---

## Layout

```
┌───────────────────────────────────────────────┐
│                                               │
│              Navigation                       │
│                                               │
│  Enterprise ESG Intelligence Platform         │
│                                               │
│  Modern sustainability management for         │
│  organizations that care about measurable     │
│  environmental, social and governance impact. │
│                                               │
│  [ Get Started ] [ Explore Platform ]         │
│                                               │
│                 Dashboard Preview             │
│                                               │
└───────────────────────────────────────────────┘
```

---

## Hero Components

Headline

Supporting Description

Primary CTA

Secondary CTA

Animated Dashboard Preview

Floating ESG Metrics

Background Illustration

---

## Headline

Simple.

Confident.

Professional.

Example

Enterprise ESG Intelligence

for Sustainable Organizations

Avoid buzzwords.

---

## Supporting Text

Maximum

Three lines.

Focus on business value.

Not technology.

---

## Primary CTA

Get Started

Behavior

Navigate to Registration.

---

## Secondary CTA

Explore Platform

Behavior

Scroll to Platform Overview.

---

## Hero Visual

The right side contains

Animated Dashboard Preview

This preview should display

ESG Score

Department Ranking

Carbon Savings

Reports

Challenge Progress

The preview is not interactive.

It demonstrates capability.

---

## Hero Motion

Library

GSAP

Timeline

Logo Fade

↓

Headline Reveal

↓

Description Reveal

↓

Buttons

↓

Dashboard Slide

↓

Floating Metrics

Animations should complete within

1.2 seconds.

Never longer.

---

# Trusted Organizations

Purpose

Immediately establish credibility.

Even if placeholder logos are used during the hackathon.

Layout

Horizontal Logo Marquee

Headline

Trusted by forward-thinking organizations.

---

# Problem Section

Purpose

Educate users.

Not everyone understands ESG.

Headline

Managing sustainability shouldn't require spreadsheets.

Content

Traditional ESG management is fragmented.

Manual.

Difficult to measure.

Hard to visualize.

Poor employee participation.

Use an illustration showing disconnected workflows.

---

# Solution Section

Headline

One Platform.

Complete ESG Visibility.

Explain

Environmental

Social

Governance

Departments

Analytics

Reports

Gamification

Everything unified.

---

# Platform Overview

Purpose

Provide a high-level understanding.

Use large cards.

Layout

```
Environmental

Social

Governance

Analytics

Reports

Gamification
```

Each card includes

Icon

Description

Micro Animation

Hover State

---

# Interactive Module Showcase

This section is scroll-driven.

GSAP Timeline

As users scroll,

cards animate into focus.

Each module receives

Title

Description

Illustration

Business Value

Modules

Environmental

Social

Governance

Workspace

Reports

Rewards

---

# Dashboard Showcase

Purpose

Showcase the application before login.

Large centered mock dashboard.

Features highlighted through animated callouts.

Callouts

Overall ESG Score

Carbon Reduction

Department Ranking

Challenges

Reports

Recent Activity

---

# Analytics Section

Purpose

Demonstrate data intelligence.

Show

Charts

Reports

Insights

KPIs

Animated Counters

---

# Gamification Section

Purpose

Demphasize employee engagement.

Show

Challenges

Leaderboards

Badges

Achievements

Rewards

Illustrations

Minimal.

Professional.

---

# Security Section

Purpose

Build trust.

Features

Role Based Access

JWT Authentication

Google OAuth

Encrypted Sessions

Audit Logging

Responsive Architecture

Use security-themed illustrations.

---

# Technology Section

Purpose

Appeal to technical judges.

Display

Next.js

FastAPI

PostgreSQL

TypeScript

React Query

Tailwind CSS

Docker

Modern Architecture

This section should feel technical,

not promotional.

---

# Call To Action

Large centered section.

Headline

Ready to transform your ESG operations?

Buttons

Start Free

Login

Minimal background animation.

---

# Footer

Contains

Logo

Quick Links

Documentation

Privacy

Terms

GitHub

LinkedIn

Email

Copyright

---

# Motion Specification

Landing Motion

GSAP only.

Rules

Motion follows scroll.

Never loops endlessly.

Never blocks interaction.

Prefer

Opacity

Transform

Scale

Parallax

Avoid

Heavy particles

Confetti

Complex WebGL

Infinite floating objects

---

# Responsive Behaviour

Desktop

Full storytelling.

Tablet

Reduced spacing.

Mobile

Stack sections vertically.

No functionality removed.

---

# Accessibility

Animations respect

prefers-reduced-motion.

Buttons

Keyboard Accessible.

Images

Alt Text.

Semantic HTML throughout.

---

# Performance Targets

Largest Contentful Paint

Below 2.5 seconds.

Hero Animation

Below 1.2 seconds.

Lighthouse

90+

---

# Success Criteria

After viewing the landing page,

users should understand

What EcoSphere does.

Why ESG matters.

How the platform solves the problem.

Why they should sign up.

All within approximately ninety seconds.

---

# End of Chapter 2

# Chapter 3

Authentication Experience

---

# Purpose

The authentication experience is the gateway into EcoSphere.

It should establish trust, security, and professionalism while remaining effortless for first-time users.

The authentication experience must feel premium, lightweight, and distraction-free.

The login flow should never feel like a form.

It should feel like entering the EcoSphere platform.

---

# Authentication Flow

```text
Landing

↓

Get Started

↓

Register

↓

Email Verification (Future)

↓

Login

↓

Authentication

↓

Session Initialization

↓

Command Center
```

Returning users

```text
Landing

↓

Login

↓

Authentication

↓

Command Center
```

---

# Authentication Routes

```
/login

/register

/forgot-password

/reset-password
```

---

# Authentication Layout

Authentication pages share a dedicated layout.

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│                 Blurred Dashboard Preview                 │
│                                                           │
│                                                           │
│               ┌──────────────────────────┐                │
│               │                          │                │
│               │        Login Card        │                │
│               │                          │                │
│               └──────────────────────────┘                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

# Shared Authentication Components

Authentication Layout

Authentication Card

Authentication Header

Authentication Footer

Authentication Divider

Social Login Button

Password Input

Email Input

Submit Button

Remember Me Checkbox

Password Visibility Toggle

Validation Messages

---

# Login Page

## Purpose

Authenticate existing users.

---

## Sections

Logo

Headline

Description

Email

Password

Remember Me

Forgot Password

Continue Button

Google Login

Register Link

---

## Primary CTA

Continue

---

## Secondary CTA

Continue with Google

---

## Footer

Don't have an account?

Create one

---

## Validation

Email Required

Password Required

Email Format

Backend Errors

Invalid Credentials

Locked Account

Expired Session

---

## Loading

Disable Inputs

Loading Button

No Page Refresh

---

## Success

Initialize Session

Redirect

/dashboard

---

## Error States

Invalid Credentials

Account Locked

Network Error

Unknown Error

---

## Motion

Card Fade

Card Scale

Background Blur

Button Ripple

Input Focus Animation

---

# Register Page

## Purpose

Create a new account.

---

## Sections

Name

Email

Password

Confirm Password

Accept Terms

Create Account

Google Registration

Login Link

---

## Validation

Required Fields

Password Strength

Password Match

Email Format

Terms Accepted

---

## Password Rules

Minimum 8 Characters

Uppercase

Lowercase

Number

Special Character

Strength Meter

---

## Success

Registration Complete

Redirect to Login

---

# Forgot Password

Purpose

Recover Account

---

## Sections

Email

Continue Button

Back to Login

---

## Success

Email Sent

Instruction Message

---

# Reset Password

Purpose

Create New Password

---

## Sections

Password

Confirm Password

Update Password

---

## Success

Password Updated

Redirect Login

---

# Session Initialization

After Login

```text
Authenticate

↓

Store Tokens

↓

Fetch User

↓

Fetch Permissions

↓

Fetch Dashboard Summary

↓

Redirect

↓

Dashboard Ready
```

---

# Authentication States

Unauthenticated

Authenticating

Authenticated

Session Expired

Logging Out

Password Reset

---

# Authentication Security

Never expose JWT

Never store passwords

Never trust frontend validation

Always validate server responses

---

# Responsive Behaviour

Desktop

Centered Authentication Card

Tablet

Reduced Width

Mobile

Full Width Card

---

# Accessibility

Keyboard Navigation

Visible Focus

Password Toggle Accessible

ARIA Labels

Semantic Forms

---

# End Chapter 3

---

# Chapter 4

Command Center

---

# Purpose

The Command Center is the executive dashboard of EcoSphere.

It provides organization-wide visibility into ESG performance.

The Command Center answers three questions immediately:

What is happening?

Why is it happening?

What should I do next?

---

# Audience

Owner

Administrator

Manager

Employee (Customized View)

---

# Layout

```
Header

↓

Greeting

↓

KPI Cards

↓

Analytics Grid

↓

Insights

↓

Activity Feed

↓

Recommendations
```

---

# Greeting

Example

Good Morning, Harshavardhan.

Here's the health of your organization today.

---

# KPI Section

Cards

Overall ESG Score

Environmental Score

Social Score

Governance Score

Employees

Departments

Carbon Saved

Participation Rate

Pending Approvals

Challenges Active

---

# KPI Card

Contains

Icon

Title

Primary Value

Trend

Comparison

Status

---

# Analytics Grid

Large Charts

ESG Trend

Department Performance

Monthly Carbon Reduction

Participation Growth

Challenge Completion

---

# Organization Insights

Automatically generated recommendations

Examples

Environmental score dropped 8%.

Finance department participation increased.

Three pending approvals require attention.

Carbon reduction exceeded target.

---

# Department Health

Displays

Department Name

Overall Score

Participation

Risk

Leader

Trend

---

# Leaderboard

Top Departments

Top Employees

Most Improved

Top Contributors

---

# Activity Feed

Recent Actions

Invitations

Challenges

Policy Updates

Approvals

Reports

---

# Quick Actions

Invite Member

Create Department

Generate Report

Create Challenge

Export Data

---

# Notification Panel

Unread Notifications

Approvals

Warnings

Updates

---

# Search

Global Search

Search Users

Departments

Reports

Challenges

---

# Widgets

Widgets may be rearranged in future.

Initial Layout remains fixed.

---

# Empty State

No Organization Data

CTA

Create Department

---

# Loading

Skeleton Cards

Skeleton Charts

Skeleton Tables

---

# Error

Retry

Refresh

Support Message

---

# Motion

Cards Stagger

Charts Fade

Counters Animate

Sidebar Persistent

---

# End Chapter 4

---

# Chapter 5

ESG Modules

---

# Purpose

Provide focused ESG management experiences.

Every module follows the same interaction model.

Summary

↓

Insights

↓

Detailed Data

↓

Actions

---

# Environmental

Purpose

Track environmental initiatives.

---

## Widgets

Environmental Score

Carbon Reduction

Energy Consumption

Water Usage

Waste Management

Emission Trends

Goals

Recent Activities

---

## Charts

Monthly Carbon

Energy Trend

Waste Breakdown

Goal Progress

---

## Actions

Add Initiative

Update Metrics

Export Report

---

# Social

Purpose

Track employee engagement and CSR.

---

## Widgets

Participation

CSR Activities

Volunteer Hours

Training Completion

Employee Satisfaction

Leaderboard

---

## Charts

Participation Trend

Department Engagement

Training Completion

---

## Actions

Create Activity

Invite Members

Export Report

---

# Governance

Purpose

Track governance and compliance.

---

## Widgets

Compliance Score

Policies

Audits

Approvals

Pending Reviews

Risk Overview

---

## Charts

Compliance Trend

Audit History

Risk Distribution

---

## Actions

Create Policy

Approve Submission

Generate Compliance Report

---

# Shared States

Loading

Empty

Error

Success

---

# End Chapter 5

---

# Chapter 6

Workspace

---

# Purpose

Manage organizational structure.

---

# Navigation

Workspace

Departments

Members

Roles

---

# Departments

Widgets

Department List

Department Details

Manager

Employee Count

ESG Score

Participation

---

## Actions

Create Department

Edit

Archive

Assign Manager

---

# Members

Widgets

Member Table

Status

Department

Role

Activity

---

## Actions

Invite

Edit

Deactivate

Reset Password

---

# Roles

Display

Role

Permissions

Assigned Members

---

# Invitation Flow

Invite

↓

Email

↓

Accept

↓

Registration

↓

Login

---

# Empty State

No Members

Invite Your Team

---

# End Chapter 6

---

# Chapter 7

Reports

Settings

Profile

---

# Reports

Purpose

Generate organizational insights.

---

## Sections

Overview

Exports

History

Templates

---

## Reports

Environmental

Social

Governance

Department

Employee

Organization

---

## Export Formats

PDF

CSV

Excel

---

# Settings

Organization

Appearance

Notifications

Security

Preferences

---

# Profile

Avatar

Personal Details

Password

Sessions

Connected Accounts

---

# Notification Center

Grouped

Unread

Read

Actions

Mark All Read

Delete

---

# Session Expired

Display Modal

Save Unsaved Work

Redirect Login

---

# 404

Friendly Illustration

Return Dashboard

---

# Maintenance

System Message

Estimated Recovery

Retry

---

# Global UI States

Every Page Must Support

Loading

Empty

Error

Offline

Permission Denied

Success

---

# Responsive Behaviour

Desktop

12 Columns

Tablet

8 Columns

Mobile

4 Columns

---

# Animation Rules

Landing

GSAP

Application

Framer Motion

Transitions

250ms

Page Changes

Fade

Cards

Stagger

Dialogs

Scale

Toasts

Slide

---

# Success Criteria

The entire application should feel like one cohesive product.

Every page must preserve:

Visual Consistency

Interaction Consistency

Performance

Accessibility

Enterprise Quality

---

# End of Product UI Specification

