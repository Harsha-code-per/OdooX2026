# Google OAuth Setup Guide

Complete guide to setting up Google OAuth authentication for Odoo X Backend.

## Prerequisites

- Google Cloud account
- Backend server running and accessible

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity"
   - Enable the API

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Configure the consent screen (first time only):
   - Choose "External" user type
   - Add app name, developer contact info
   - Add required scopes: `openid`, `email`, `profile`
   - Save and continue
4. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Name: "Odoo X Backend"
   - Authorized redirect URIs:
     - Development: `http://localhost:8000/api/v1/auth/google/callback`
     - Production: `https://yourdomain.com/api/v1/auth/google/callback`
   - Click "Create"

## Step 3: Configure Backend

Update your `.env` file with the Google credentials:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
```

## Step 4: Test Google OAuth

### 1. Get Authorization URL

```bash
curl http://localhost:8000/api/v1/auth/google/login
```

Response:
```json
{
  "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=openid%20email%20profile&access_type=offline",
  "state": "random-state-string"
}
```

### 2. Authorize via Browser

1. Copy the `authorization_url` from the response
2. Open it in your browser
3. Sign in with your Google account
4. Authorize the application
5. You'll be redirected to your callback URL with a `code` parameter

### 3. Complete Authentication

```bash
POST http://localhost:8000/api/v1/auth/google/callback
Content-Type: application/json

{
  "code": "authorization-code-from-redirect",
  "state": "state-from-step-1"
}
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 10800,
  "user": {
    "id": "user-uuid",
    "full_name": "John Doe",
    "role_id": 4,
    "must_change_password": false,
    "provider": "google",
    "profile_picture": "https://lh3.googleusercontent.com/..."
  },
  "is_new_user": true
}
```

## User Flow

### New Google Users

1. User clicks "Sign in with Google"
2. Redirects to Google for authentication
3. On successful auth, user account is automatically created
4. User is created as employee (role_id = 4)
5. No email verification required
6. No department assigned (admin assigns later)

### Existing Email Users Linking Google

1. User logs in with email/password
2. Goes to account settings
3. Clicks "Link Google Account"
4. Follows Google OAuth flow
5. Google account linked to existing account
6. Can now use either auth method

### Security Considerations

- Google users don't have passwords set
- Unlinking Google requires setting a password first
- Email verification not required for Google users
- Google ID is unique and immutable

## Troubleshooting

### "Google OAuth not configured"
- Ensure `GOOGLE_CLIENT_ID` is set in `.env`
- Restart the server after updating `.env`

### "Invalid redirect URI"
- Check Google Cloud Console redirect URIs match your callback URL
- Ensure the exact URI (including port) is configured

### "Failed to obtain access token"
- Verify Google Client Secret is correct
- Check that the authorization code hasn't expired
- Ensure Google+ API is enabled

### "Email already registered"
- This occurs when Google email matches existing email user
- User can link Google account instead of creating new one

## Production Deployment

For production:

1. **Use HTTPS**: Update redirect URIs to use `https://`
2. **Domain Verification**: Verify your domain in Google Console
3. **Security Review**: Complete Google security review for verified apps
4. **Rate Limiting**: Implement rate limiting for OAuth endpoints
5. **Monitoring**: Monitor OAuth success/failure rates

## API Endpoints

### Get Google Login URL
```
GET /api/v1/auth/google/login
```

### Handle Google Callback
```
POST /api/v1/auth/google/callback
```

### Link Google Account (Authenticated)
```
POST /api/v1/auth/google/link
Authorization: Bearer your-access-token
```

### Unlink Google Account (Authenticated)
```
POST /api/v1/auth/google/unlink
Authorization: Bearer your-access-token
```

## Advanced Configuration

### Custom Scopes
To request additional Google scopes, modify the authorization URL generation in `GoogleAuthService.get_authorization_url()`.

### Custom User Fields
You can collect additional fields from Google (locale, timezone, etc.) by updating the `handle_google_callback` method.

### State Management
The current implementation uses random state strings for CSRF protection. For production, consider implementing more robust state validation.