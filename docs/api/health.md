# 🩺 System Health API

Endpoints for monitoring the system status and connectivity.

## 💓 Liveness Probe

Checks if the API service is up and running.

- **URL**: `/health`
- **Method**: `GET`
- **Auth required**: No

### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```

---

## 📈 Readiness Probe

Checks if the service is ready to handle traffic (all dependencies are connected).

- **URL**: `/health/readiness`
- **Method**: `GET`
- **Auth required**: No
