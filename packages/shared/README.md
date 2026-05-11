# @audience-builder/shared

The **Single Source of Truth** for types and constants in the Audience Builder monorepo.

## 🏛️ Purpose

This package ensures that the frontend and backend boundaries are perfectly synchronized. By sharing interfaces and enums, we eliminate runtime type errors and ensure that data payloads are consistent across the entire stack.

## 📦 Contents

- **Interfaces**: `User`, `Message`, `Conversation`, `Signal`, `ApiResponse`.
- **Enums/Constants**: `UserRole`.

## 🚀 Usage

This package is a workspace dependency. To use it in a new app:

```json
{
  "dependencies": {
    "@audience-builder/shared": "workspace:*"
  }
}
```
