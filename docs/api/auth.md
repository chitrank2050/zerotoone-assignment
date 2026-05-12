# 🔐 Authentication API

Endpoints for user authentication and session management.

## 🔑 Login

Authenticates a user and returns a JWT access token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth required**: No

### Request Body

```json
{
  "email": "planner@example.com",
  "password": "password123"
}
```

### 📥 Login Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": "user_01",
      "email": "planner@example.com",
      "role": "planner"
    }
  },
  "timestamp": "2024-05-12T10:00:00Z"
}
```

### Error Responses

- **Code**: 401 Unauthorized
- **Content**: `{ "success": false, "error": "AUTH_INVALID_CREDENTIALS" }`

---

## 👤 Get Profile

Retrieves the profile of the currently authenticated user.

- **URL**: `/auth/profile`
- **Method**: `GET`
- **Auth required**: Yes

### 📥 Get Profile Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "data": {
    "id": "user_01",
    "email": "planner@example.com",
    "role": "planner"
  }
}
```
