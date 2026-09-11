# SupportSphere

## AI-Powered Customer Support & Ticket Management Platform

SupportSphere is a full-stack customer support platform built to demonstrate
modern backend engineering, multi-tenant architecture, RBAC, AI integration,
RAG-based company knowledge, audit logging, and production deployment.

The platform allows organizations to manage support tickets, control member
access through roles, analyze tickets using AI, upload company knowledge, and
ask a grounded AI assistant questions about that knowledge.

---

## 🚀 Features

- 🔐 JWT-based authentication
- 🏢 Multi-organization / workspace support
- 👥 Organization membership and role-based access control
- 🎫 Ticket creation, viewing, updating, and closing
- 🤖 AI-powered ticket analysis
- 📚 Company knowledge upload and processing
- 🧠 Embedding-based semantic knowledge retrieval
- 💬 Grounded AI company knowledge assistant
- 📋 Organization-level audit logging
- 📊 Support dashboard
- 🔒 Organization-scoped data access
- 🌐 Production deployment with Vercel, Render, and Neon PostgreSQL

---

## 🏗️ Architecture

```text
                         End User
                            │
                            ▼
                  ┌──────────────────┐
                  │ React + Vite     │
                  │     Vercel       │
                  └────────┬─────────┘
                           │ HTTPS / REST
                           ▼
                  ┌──────────────────┐
                  │ Express.js API   │
                  │     Render       │
                  └────────┬─────────┘
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │ PostgreSQL  │  │ AI Services │  │  Cloudinary │
   │    Neon     │  │ OpenRouter  │  │ PDF Storage │
   │   Prisma    │  │             │  │             │
   │  pgvector   │  │             │  │             │
   └─────────────┘  └─────────────┘  └─────────────┘
----

🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js, JWT, bcrypt, Zod, Multer
- **Database:** PostgreSQL, Neon, Prisma ORM
- **AI / RAG:** OpenRouter, embeddings, pgvector, HNSW, vector similarity search
- **Documents:** Cloudinary, PDF text extraction, custom chunking
- **Security:** JWT authentication, RBAC, organization-level isolation, audit logs
- **Deployment:** Vercel (Frontend), Render (Backend), Neon (Database)
- **Language:** JavaScript
- **Version Control:** Git, GitHub