# 🚀 Deployment Guide

This guide provides instructions for deploying the **AI Audience Builder** platform to production environments.

## 🏗️ Architecture Summary for Deployment

- **Backend**: NestJS (deployed to **Render**)
- **Frontend**: React/Vite (deployed to **Vercel**)
- **Database**: PostgreSQL (Neon.tech recommended)
- **AI Engine**: Groq (LLaMA 3.3 70B)

---

## 🛠️ Backend Deployment (Render)

> [!WARNING]
> **Free Tier Cold Starts**: Deploying to Render's Free Instance type means the service will spin down after 15 minutes of inactivity. The first request after a spin-down will experience a **30-50 second delay** (Cold Start). For production workloads requiring instant response times, upgrade to a "Starter" instance.

### 1. New Web Service

Connect your GitHub repository and select the following settings:

- **Root Directory**: `(leave as project root)`
- **Environment**: `Node`
- **Build Command**: `pnpm install && pnpm run build --filter=@audience-builder/backend...`
- **Start Command**: `pnpm --filter=@audience-builder/backend run start:prod`

### 2. Backend Environment Variables

Add the following variables in the Render dashboard:

| Variable          | Description                                                 |
| :---------------- | :---------------------------------------------------------- |
| `DATABASE_URL`    | Your PostgreSQL connection string (Neon.tech)               |
| `JWT_SECRET`      | A secure random string for signing tokens                   |
| `GROQ_API_KEY`    | Your API key from [Groq Console](https://console.groq.com/) |
| `ALLOWED_ORIGINS` | `https://zerotoone-assignment-frontend.vercel.app`          |
| `NODE_ENV`        | `production`                                                |
| `PORT`            | `3000` (Render usually sets this automatically)             |

---

## ⚡ Frontend Deployment (Vercel)

### 1. New Project

Connect your GitHub repository and select the following settings:

- **Framework Preset**: `Vite`
- **Root Directory**: `(leave as project root)`
- **Build Command**: `pnpm run build --filter=@audience-builder/frontend...`
- **Output Directory**: `apps/frontend/dist`

### 2. Frontend Environment Variables

Add the following variable:

| Variable       | Value                                              |
| :------------- | :------------------------------------------------- |
| `VITE_API_URL` | `https://zerotoone-assignment.onrender.com/api/v1` |

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
