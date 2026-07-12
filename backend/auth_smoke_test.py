#!/usr/bin/env python3
"""Smoke-test implemented authentication endpoints against a running backend.

Prerequisites:
  1. Configure .env with a reachable PostgreSQL DATABASE_URL.
  2. Run: backend/.venv/bin/alembic -c backend/alembic.ini upgrade head
  3. Start the API: backend/.venv/bin/uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000
  4. Run: backend/.venv/bin/python backend/auth_smoke_test.py

Optional environment variables:
  API_BASE_URL=http://localhost:8000
  AUTH_EMAIL=john.doe@odoo.com
  AUTH_PASSWORD=Test123!
"""

from __future__ import annotations

import os
import sys
from dataclasses import dataclass
from typing import Any

import httpx


@dataclass
class TestContext:
    base_url: str
    email: str
    password: str
    access_token: str | None = None
    refresh_token: str | None = None
    rotated_refresh_token: str | None = None


def assert_status(response: httpx.Response, expected_status: int, label: str) -> dict[str, Any]:
    if response.status_code != expected_status:
        raise AssertionError(
            f"{label}: expected HTTP {expected_status}, got {response.status_code}: {response.text}"
        )

    if response.content:
        return response.json()
    return {}


def assert_has_keys(payload: dict[str, Any], keys: set[str], label: str) -> None:
    missing = keys - payload.keys()
    if missing:
        raise AssertionError(f"{label}: missing response keys: {', '.join(sorted(missing))}")


def run_step(label: str, func) -> None:
    print(f"\n▶ {label}")
    func()
    print(f"✓ {label}")


def main() -> int:
    context = TestContext(
        base_url=os.environ.get("API_BASE_URL", "http://localhost:8000").rstrip("/"),
        email=os.environ.get("AUTH_EMAIL", "john.doe@odoo.com"),
        password=os.environ.get("AUTH_PASSWORD", "Test123!"),
    )

    print("Authentication smoke test")
    print(f"Base URL: {context.base_url}")
    print(f"User: {context.email}")

    with httpx.Client(base_url=context.base_url, timeout=10.0) as client:
        def health_check() -> None:
            payload = assert_status(client.get("/health"), 200, "health check")
            if payload.get("status") != "healthy":
                raise AssertionError(f"health check: expected healthy status, got {payload}")

        def invalid_login_fails() -> None:
            payload = assert_status(
                client.post(
                    "/api/v1/auth/login",
                    json={"email": context.email, "password": "definitely-wrong-password"},
                ),
                401,
                "invalid login",
            )
            if "detail" not in payload:
                raise AssertionError(f"invalid login: expected error detail, got {payload}")

        def valid_login_returns_tokens() -> None:
            payload = assert_status(
                client.post(
                    "/api/v1/auth/login",
                    json={"email": context.email, "password": context.password},
                    headers={"user-agent": "auth-smoke-test"},
                ),
                200,
                "valid login",
            )
            assert_has_keys(
                payload,
                {"access_token", "refresh_token", "token_type", "expires_in", "user"},
                "valid login",
            )
            if payload["token_type"] != "bearer":
                raise AssertionError(f"valid login: expected bearer token type, got {payload['token_type']!r}")
            if payload["expires_in"] <= 0:
                raise AssertionError(f"valid login: expected positive expires_in, got {payload['expires_in']}")

            user = payload["user"]
            assert_has_keys(user, {"id", "full_name", "role_id", "must_change_password", "provider"}, "login user")
            context.access_token = payload["access_token"]
            context.refresh_token = payload["refresh_token"]

        def me_requires_bearer_token() -> None:
            assert_status(client.get("/api/v1/auth/me"), 403, "me without token")

        def me_returns_current_user() -> None:
            response = client.get(
                "/api/v1/auth/me",
                headers={"Authorization": f"Bearer {context.access_token}"},
            )
            payload = assert_status(response, 200, "me with access token")
            assert_has_keys(payload, {"id", "full_name", "role_id", "status"}, "me response")
            if payload["status"] != "active":
                raise AssertionError(f"me response: expected active status, got {payload['status']!r}")

        def refresh_rotates_tokens() -> None:
            payload = assert_status(
                client.post("/api/v1/auth/refresh", json={"refresh_token": context.refresh_token}),
                200,
                "refresh token",
            )
            assert_has_keys(payload, {"access_token", "refresh_token", "token_type", "expires_in"}, "refresh token")
            if payload["refresh_token"] == context.refresh_token:
                raise AssertionError("refresh token: expected rotated refresh token to differ from old token")
            context.access_token = payload["access_token"]
            context.rotated_refresh_token = payload["refresh_token"]

        def old_refresh_token_is_revoked() -> None:
            assert_status(
                client.post("/api/v1/auth/refresh", json={"refresh_token": context.refresh_token}),
                401,
                "reusing old refresh token",
            )

        def logout_revokes_current_refresh_token() -> None:
            assert_status(
                client.post("/api/v1/auth/logout", json={"refresh_token": context.rotated_refresh_token}),
                200,
                "logout",
            )
            assert_status(
                client.post("/api/v1/auth/refresh", json={"refresh_token": context.rotated_refresh_token}),
                401,
                "refresh after logout",
            )

        run_step("health endpoint is reachable", health_check)
        run_step("invalid password is rejected", invalid_login_fails)
        run_step("valid login returns JWT access and refresh tokens", valid_login_returns_tokens)
        run_step("protected endpoint rejects missing bearer token", me_requires_bearer_token)
        run_step("access token authorizes /api/v1/auth/me", me_returns_current_user)
        run_step("refresh endpoint rotates refresh token", refresh_rotates_tokens)
        run_step("old refresh token cannot be reused", old_refresh_token_is_revoked)
        run_step("logout revokes the current refresh token", logout_revokes_current_refresh_token)

    print("\n✅ Authentication smoke test passed")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except httpx.ConnectError as exc:
        print(f"\n❌ Could not connect to API: {exc}", file=sys.stderr)
        print("Start the backend first, then rerun this script.", file=sys.stderr)
        raise SystemExit(1)
    except Exception as exc:
        print(f"\n❌ Authentication smoke test failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
