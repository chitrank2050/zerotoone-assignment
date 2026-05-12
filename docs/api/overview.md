# 🔌 API Documentation

Welcome to the AI Audience Builder API documentation. This API follows RESTful principles and returns JSON-encoded responses.

## 📍 Base URL

- **Development**: `http://localhost:3000`

---

## 🔐 Authentication

Most endpoints require a JSON Web Token (JWT) provided in the `Authorization` header.

```http
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained via the `/auth/login` endpoint.

---

## 📦 Standard Response Format

All API responses follow a consistent wrapper format defined in `@audience-builder/shared`:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "metadata": {
    "requestId": "uuid-v4",
    "executionTime": "45ms"
  },
  "timestamp": "2024-05-12T10:00:00Z"
}
```

- **`success`**: Boolean indicating if the request was successful.
- **`data`**: The payload of the response (can be an object, array, or null).
- **`error`**: A machine-readable error key if `success` is `false`.
- **`metadata`**: Contextual information like correlation IDs and performance metrics.

---

## ⚠️ Error Handling

Errors return a 4xx or 5xx HTTP status code and a JSON body containing an error key.

### Common Error Keys

| Key                           | Description                                       |
| :---------------------------- | :------------------------------------------------ |
| `AUTH_INVALID_CREDENTIALS`    | Incorrect email or password.                      |
| `CHAT_CONVERSATION_NOT_FOUND` | The requested conversation ID does not exist.     |
| `TAXONOMY_INVALID_QUERY`      | The search query for taxonomy signals is invalid. |
| `INTERNAL_SERVER_ERROR`       | An unexpected error occurred on the server.       |

---

## 📑 Resources

- [Authentication](./auth.md)
- [Chat & Conversations](./chat.md)
- [Taxonomy & Signals](./taxonomy.md)
- [System Health](./health.md)
