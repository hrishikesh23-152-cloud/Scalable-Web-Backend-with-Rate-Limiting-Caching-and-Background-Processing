# Scalable API Infrastructure and Asynchronous Task Processing Platform

A production-oriented backend system built with **Node.js, Express.js, TypeScript, PostgreSQL, Redis, BullMQ, Docker and Cloudinary**.

The project focuses on building a scalable backend architecture with **authentication, caching, rate limiting, asynchronous background processing, cloud-based image storage, and PostgreSQL as the primary source of truth**.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - Secure user authentication
  - Protected API routes
  - Role-based access where required

- 🗄️ **PostgreSQL Database**
  - PostgreSQL is used as the **primary source of truth**
  - Database schema and migrations are managed manually
  - Relational data modeling using PostgreSQL

- ⚡ **Redis Caching**
  - Frequently accessed data is cached using Redis
  - Reduces unnecessary database queries
  - Improves API response time

- 🛡️ **Rate Limiting**
  - Redis-backed rate limiting
  - Protects APIs from excessive requests
  - Helps prevent API abuse

- 🔄 **Background Processing**
  - BullMQ is used for asynchronous jobs
  - Redis acts as the queue backend
  - Background workers process long-running tasks without blocking API requests

- ☁️ **Cloudinary Integration**
  - Images are uploaded and stored using Cloudinary
  - The backend stores the relevant image information/reference
  - Keeps media storage separate from the application server

- 🐳 **Docker Compose**
  - PostgreSQL and Redis can be started using Docker Compose
  - Simplifies local development and environment setup

- 🟦 **TypeScript**
  - Strong typing across the backend
  - Better maintainability and developer experience

---

## 🏗️ Architecture

```text
                    Client
                      │
                      ▼
                ┌───────────┐
                │  Express  │
                │    API    │
                └─────┬─────┘
                      │
          ┌───────────┼────────────┐
          │           │            │
          ▼           ▼            ▼
       Auth       Rate Limit     Cache
          │           │            │
          │           └──────┬─────┘
          │                  ▼
          │               Redis
          │                  │
          │             ┌────┴────┐
          │             │         │
          │          BullMQ     Cache
          │             │
          │             ▼
          │        Background
          │          Worker
          │
          ▼
      PostgreSQL
   Source of Truth
          │
          │
          ▼
      Cloudinary
    Image Storage
```
🧰 Tech Stack
Backend
Node.js
Express.js
TypeScript
Database
PostgreSQL
Manual database migrations
Caching & Queue
Redis
BullMQ
Authentication
JWT-based authentication
File Storage
Cloudinary
Infrastructure
Docker
Docker Compose

🐳 Running PostgreSQL and Redis with Docker

The project includes a Docker Compose configuration for running PostgreSQL and Redis locally.

Start the services:

docker compose up -d

Check running containers:

docker compose ps

Stop the services:

docker compose down
🔧 Environment Variables

Create a .env file:

PORT=5000

DATABASE_URL=your_postgresql_connection_string

REDIS_URL=redis://localhost:6379

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Do not commit .env to Git.

🗃️ Database Migrations

The PostgreSQL database schema is migrated manually.

The migration process is used to keep the database structure synchronized with the application's expected schema.

Application Schema
       ↓
Migration
       ↓
PostgreSQL
▶️ Running the Project
1. Clone the repository
git clone <your-repository-url>
cd <project-directory>
2. Install dependencies
npm install
3. Start PostgreSQL and Redis
docker compose up -d
4. Configure environment variables

Create .env and add the required credentials.

5. Run database migrations
<your-migration-command>
6. Start the development server
npm run dev
