# 🚀 Deployment Guide

This guide provides instructions for deploying the **AI Audience Builder** platform to production environments.

## 🏗️ Architecture Summary for Deployment

- **Backend**: NestJS (deployed to **Render**)
- **Frontend**: React/Vite (deployed to **Vercel**)
- **Database**: PostgreSQL (Neon.tech recommended)
- **AI Engine**: Groq (LLaMA 3.3 70B)

---

## 🛠️ Backend Deployment (Render)

### 1. New Web Service

Connect your GitHub repository and select the following settings:

- **Root Directory**: `apps/backend` (or leave empty and use filter commands)
- **Environment**: `Node`
- **Build Command**: `pnpm install --no-frozen-lockfile && pnpm run db:generate && pnpm run build`
- **Start Command**: `pnpm run start:prod`

### 2. Backend Environment Variables

Add the following variables in the Render dashboard:

| Variable       | Description                                                 |
| :------------- | :---------------------------------------------------------- |
| `DATABASE_URL` | Your PostgreSQL connection string (Neon.tech)               |
| `JWT_SECRET`   | A secure random string for signing tokens                   |
| `GROQ_API_KEY` | Your API key from [Groq Console](https://console.groq.com/) |
| `NODE_ENV`     | `production`                                                |
| `PORT`         | `3000` (Render usually sets this automatically)             |

---

## ⚡ Frontend Deployment (Vercel)

### 1. New Project

Connect your GitHub repository and select the following settings:

- **Framework Preset**: `Vite`
- **Root Directory**: `apps/frontend`
- **Build Command**: `pnpm install --no-frozen-lockfile && pnpm run build`
- **Output Directory**: `dist`

### 2. Frontend Environment Variables

Add the following variable:

| Variable       | Value                                                                                     |
| :------------- | :---------------------------------------------------------------------------------------- |
| `VITE_API_URL` | The URL of your **Render backend** (e.g., `https://audience-backend.onrender.com/api/v1`) |

---

## 🗄️ Database Initialization

Once the backend is deployed, you must seed the taxonomy data if you are using a fresh database:

```bash
# From your local machine, pointing to the PRODUCTION database URL in .env
pnpm db:seed
```

---

## 🔍 Post-Deployment Verification

1. **Auth**: Try logging in with the seeded credentials (`admin@example.com` / `password123`).
2. **AI Stream**: Send a prompt like "Fitness enthusiasts in New York" and verify that the Groq stream completes and signal cards appear.
3. **Taxonomy**: Navigate to the `/taxonomy` route and verify that the placeholder UI loads.
4. **Persistence**: Refresh the page after a chat to ensure the conversation rehydrates from the database.
