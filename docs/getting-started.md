# 🚀 Getting Started

This guide will help you get your local development environment set up and running.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20 or higher (LTS recommended)
- **pnpm**: v9 or higher
- **Git**: For version control
- **Docker**: Optional (required for "Production Mirror" mode)

---

## 📥 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repo/audience-builder.git
   cd audience-builder
   ```

2. **Run the Setup Script**:
   This project features a one-click bootstrap command that installs dependencies, generates Prisma clients, and applies database migrations.

   ```bash
   pnpm run setup
   ```

---

## ⚙️ Environment Configuration

You must configure the environment variables for the backend to function correctly.

1. Navigate to the backend directory:

   ```bash
   cd apps/backend
   ```

2. Create a `.env` file (you can copy `.env.example` if it exists):

   ```env
   DATABASE_URL="postgresql://user:password@neon-host.neon.tech/audience_builder?sslmode=require"
   REDIS_URL="redis://default:password@upstash-host.upstash.io:6379"
   JWT_SECRET="your-high-entropy-secret"
   GEMINI_API_KEY="your-google-ai-api-key"
   PORT=3000
   ```

---

## 🏃 Running the Application

### Local Development Mode

This mode provides the fastest feedback loop with Instant HMR (Hot Module Replacement).

```bash
# From the project root
pnpm dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

### Production Mirror Mode (Docker)

To verify how the application behaves in a containerized environment:

```bash
# Build and start containers
pnpm docker:build

# Stop containers
pnpm docker:down
```

---

## 🗄️ Database Management

We use **PostgreSQL (Neon)** and **Prisma**. For local development, you can either use a local PostgreSQL instance or a free tier project on [Neon.tech](https://neon.tech/).

> [!TIP]
> **Neon Setup**: When using Neon, ensure your `DATABASE_URL` includes `?sslmode=require`.

- **View Data**: Use Prisma Studio to inspect your database visually.

  ```bash
  cd apps/backend
  pnpm dlx prisma studio
  ```

- **Seeding**: To populate the database with initial taxonomy data:

  ```bash
  pnpm run db:seed
  ```

---

## 🧪 Testing

Run the full test suite across the monorepo:

```bash
pnpm test
```

For interactive testing in watch mode:

```bash
pnpm test:watch
```
