import httpx
import uuid

def validate():
    url = "https://oodo2026-backend.blacksky-e0f71111.centralindia.azurecontainerapps.io/api/v1/auth/register"
    email = f"test-{uuid.uuid4().hex[:6]}@example.com"
    payload = {
        "email": email,
        "password": "Password123!",
        "full_name": "Test User Live",
        "department_id": None
    }
    print(f"Sending POST to {url} with email {email}...")
    r = httpx.post(url, json=payload, timeout=10.0)
    print(f"Status Code: {r.status_code}")
    print(f"Response: {r.text}")

if __name__ == "__main__":
    validate()
