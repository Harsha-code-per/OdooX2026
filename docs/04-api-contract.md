# API Contract Specification

Version: 1.0

Status: Frozen

Owner: Backend Team + Frontend Team

Last Updated: July 2026

---

# Purpose

This document defines the API contract between the frontend and backend.

Frontend development must rely only on the endpoints documented here.

No frontend component should assume undocumented fields or create custom payloads.

All APIs return JSON.

Base URL during development:

/api/v1

---

# Authentication

---

## POST /auth/register

Purpose

Register a new user.

Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "********"
}
```

Success

```json
{
  "message":"Registration successful",
  "user_id":"uuid"
}
```

Errors

400 Validation Error

409 Email Already Exists

500 Server Error

---

## POST /auth/login

Request

```json
{
  "email":"john@example.com",
  "password":"********"
}
```

Success

```json
{
  "access_token":"jwt",
  "refresh_token":"jwt",
  "expires_in":3600,
  "user":{
      "id":"uuid",
      "name":"John",
      "email":"john@example.com",
      "role":"OWNER"
  }
}
```

Errors

401 Invalid Credentials

423 Account Locked

500 Internal Error

---

## POST /auth/logout

Request

None

Response

```json
{
  "message":"Logged out successfully"
}
```

---

## POST /auth/refresh

Request

```json
{
  "refresh_token":"..."
}
```

Response

```json
{
  "access_token":"..."
}
```

---

## POST /auth/forgot-password

Request

```json
{
  "email":"john@example.com"
}
```

Response

```json
{
  "message":"Password reset email sent."
}
```

---

## POST /auth/reset-password

Request

```json
{
  "token":"...",
  "password":"..."
}
```

Response

```json
{
  "message":"Password updated."
}
```

---

# Current User

---

## GET /users/me

Purpose

Fetch logged-in user.

Response

```json
{
  "id":"uuid",
  "name":"John",
  "email":"john@example.com",
  "role":"OWNER",
  "department":"Engineering",
  "avatar":"..."
}
```

---

# Dashboard

---

## GET /dashboard/summary

Purpose

Fetch command center summary.

Response

```json
{
  "overall_esg":84,
  "environment":82,
  "social":87,
  "governance":83,

  "carbon_saved":120,

  "employees":145,

  "departments":8,

  "pending_approvals":3,

  "active_challenges":6
}
```

---

## GET /dashboard/charts

Response

```json
{
  "monthly_esg":[...],

  "carbon_trend":[...],

  "department_scores":[...],

  "participation":[...]
}
```

---

## GET /dashboard/activity

Response

```json
[
    {
        "id":"...",
        "type":"approval",
        "title":"New Department Created",
        "time":"..."
    }
]
```

---

# Departments

---

## GET /departments

Response

```json
[
    {
        "id":"...",
        "name":"Engineering",
        "manager":"John",
        "employees":35,
        "esg_score":82
    }
]
```

---

## GET /departments/{id}

Response

```json
{
    "id":"...",
    "name":"Engineering",
    "manager":"John",
    "employees":[...],
    "scores":{},
    "activities":[]
}
```

---

## POST /departments

Request

```json
{
    "name":"Finance"
}
```

Response

Department Created

---

## PATCH /departments/{id}

Update Department

---

## DELETE /departments/{id}

Archive Department

---

# Members

---

## GET /users

Returns

List of users.

---

## POST /users/invite

Request

```json
{
    "email":"...",
    "role":"EMPLOYEE",
    "department":"..."
}
```

---

## PATCH /users/{id}

Update User

---

## DELETE /users/{id}

Deactivate User

---

# Roles

---

## GET /roles

Returns

Available roles.

---

# Environmental

---

## GET /environment/overview

Response

```json
{
    "score":82,
    "carbon_saved":140,
    "energy":340,
    "water":500
}
```

---

## GET /environment/activities

Returns

Environmental activities.

---

## POST /environment/activity

Create Activity

---

# Social

---

## GET /social/overview

Response

```json
{
    "participation":81,
    "csr_events":12,
    "volunteer_hours":450
}
```

---

## GET /social/events

Returns

Social events.

---

## POST /social/event

Create Event

---

# Governance

---

## GET /governance/overview

Returns

Compliance metrics.

---

## GET /governance/policies

Returns

Policies.

---

## POST /governance/policy

Create Policy

---

# Reports

---

## GET /reports

Returns

Generated reports.

---

## POST /reports/generate

Request

```json
{
    "type":"environment",
    "format":"pdf"
}
```

Response

```json
{
    "download_url":"..."
}
```

---

# Notifications

---

## GET /notifications

Returns

Notification list.

---

## PATCH /notifications/read

Mark notifications as read.

---

# Profile

---

## GET /profile

Returns

Current profile.

---

## PATCH /profile

Update profile.

---

## PATCH /profile/password

Update password.

---

# Settings

---

## GET /settings

Returns

Application settings.

---

## PATCH /settings

Update settings.

---

# Standard Response Format

Success

```json
{
    "success":true,
    "data":{}
}
```

Failure

```json
{
    "success":false,
    "message":"Something went wrong.",
    "errors":[]
}
```

---

# HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

---

# Pagination

Standard

```json
{
    "items":[],
    "page":1,
    "limit":10,
    "total":100,
    "pages":10
}
```

---

# Frontend Rules

- Never hardcode API URLs.
- Always use service classes.
- Always use React Query.
- Never fetch directly inside components.
- Never assume undocumented response fields.
- All requests must be typed.
- All mutations must invalidate appropriate queries.

---

# Future APIs (Not in Hackathon Scope)

Audit Logs

Activity History

AI Recommendations

Organization Settings

Export Scheduling

Real-time Notifications

Multi-tenancy

Slack Integration

Microsoft Teams Integration

Webhook Support

---

# End of API Contract