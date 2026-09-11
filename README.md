You're right, bro. I misunderstood.

You want **one single clean Markdown code block containing the entire `README.md`**, so you can click **Copy** once and paste it directly into GitHub/VS Code.

Here it is — **nothing outside the code block**:

````markdown
# SupportSphere

## AI-Powered Customer Support & Ticket Management Platform

SupportSphere is a full-stack customer support platform built to demonstrate modern backend engineering, multi-tenant architecture, RBAC, AI integration, RAG-based company knowledge, audit logging, and production deployment.

Organizations can manage support tickets, control member access through roles, analyze tickets using AI, upload company knowledge, and interact with a grounded AI assistant.

---

## 🚀 Features

- 🔐 JWT-based authentication
- 🏢 Multi-organization / workspace architecture
- 👥 Organization membership and role-based access control
- 🎫 Ticket creation, viewing, updating, and closing
- 🔎 Organization-scoped ticket access
- 🤖 AI-powered ticket analysis
- 📚 Company knowledge management
- 📄 PDF upload and processing
- 🧠 Embedding-based semantic search
- 🗄️ PostgreSQL with pgvector
- ⚡ HNSW vector indexing
- 💬 Grounded AI company knowledge assistant
- 📋 Organization-level audit logging
- 📊 Support dashboard
- ☁️ Cloudinary PDF storage
- 🌐 Production deployment with Vercel, Render, and Neon PostgreSQL

---

## 🏗️ Architecture

```text
                              End User
                                  │
                                  ▼
                       ┌────────────────────┐
                       │   React + Vite     │
                       │      Vercel        │
                       └─────────┬──────────┘
                                 │
                              HTTPS / REST
                                 │
                                 ▼
                       ┌────────────────────┐
                       │   Express.js API   │
                       │      Render        │
                       └─────────┬──────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
      ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
      │ PostgreSQL   │   │ AI Services  │   │  Cloudinary  │
      │    Neon      │   │  OpenRouter  │   │ PDF Storage  │
      │   Prisma     │   │              │   │              │
      │   pgvector   │   │ Embeddings   │   │              │
      │    HNSW      │   │    + LLM     │   │              │
      └──────────────┘   └──────────────┘   └──────────────┘
````

---

## 🛠️ Tech Stack

| Layer               | Technologies                                                       |
| ------------------- | ------------------------------------------------------------------ |
| **Frontend**        | React.js, Vite, Tailwind CSS, Axios, React Router                  |
| **Backend**         | Node.js, Express.js, JWT, bcrypt, Zod, Multer                      |
| **Database**        | PostgreSQL, Neon, Prisma ORM                                       |
| **AI / RAG**        | OpenRouter, Embeddings, pgvector, HNSW, Vector Similarity Search   |
| **Documents**       | Cloudinary, PDF Text Extraction, Custom Chunking                   |
| **Security**        | JWT Authentication, RBAC, Organization-Level Isolation, Audit Logs |
| **Deployment**      | Vercel, Render, Neon PostgreSQL                                    |
| **Language**        | JavaScript                                                         |
| **Version Control** | Git, GitHub                                                        |

---

## 🧠 AI & RAG Pipeline

SupportSphere uses Retrieval-Augmented Generation (RAG) to provide answers grounded in an organization's uploaded knowledge.

```text
PDF Document
     │
     ▼
Cloudinary Storage
     │
     ▼
PDF Text Extraction
     │
     ▼
Text Chunking
     │
     ▼
Embedding Generation
     │
     ▼
PostgreSQL + pgvector
     │
     ▼
HNSW Vector Index
     │
     ▼
Semantic Similarity Search
     │
     ▼
Relevant Knowledge Chunks
     │
     ▼
OpenRouter LLM
     │
     ▼
Grounded AI Response
```

---

## 🏢 Multi-Tenant Architecture

SupportSphere uses an organization-based multi-tenant architecture.

Each organization has its own members, tickets, knowledge documents, and audit logs.

```text
Organization
     │
     ├── Members
     │
     ├── Tickets
     │
     ├── Knowledge Documents
     │
     └── Audit Logs
```

Organization context is enforced through backend middleware and authorization checks to ensure users can only access resources belonging to their active organization.

---

## 👥 Role-Based Access Control

SupportSphere implements organization-level RBAC.

| Role         | Access                                  |
| ------------ | --------------------------------------- |
| **OWNER**    | Full organization access                |
| **ADMIN**    | Organization and member management      |
| **AGENT**    | Support operations and knowledge access |
| **CUSTOMER** | Customer-facing support functionality   |

Authorization is enforced on the backend rather than relying only on frontend visibility.

---

## 🎫 Ticket Management

SupportSphere provides the core support-ticket workflow:

```text
Create Ticket
      │
      ▼
View Tickets
      │
      ▼
Update Ticket
      │
      ▼
Close Ticket
```

Tickets are organization-scoped and protected by authentication and authorization middleware.

---

## 🤖 AI Ticket Analysis

SupportSphere integrates AI-powered ticket analysis through OpenRouter.

The AI layer can analyze support ticket content and provide useful support insights while keeping the core ticket management system independent from the AI service.

---

## 📚 Company Knowledge

Organizations can upload company documentation in PDF format.

The knowledge pipeline handles:

1. PDF upload
2. Cloudinary storage
3. PDF text extraction
4. Text chunking
5. Embedding generation
6. Vector storage
7. Semantic similarity search
8. Grounded AI response

Knowledge documents are organization-scoped and protected by role-based access control.

---

## 📋 Audit Logging

SupportSphere maintains organization-level audit logs for important system actions.

Currently tracked events include:

* Ticket Created
* Ticket Updated
* Ticket Closed
* AI Analysis Created
* Organization Member Added
* Member Role Updated
* Member Removed
* Knowledge Document Uploaded
* Knowledge Document Deleted
* Knowledge Query Submitted

Knowledge-related actions are logged throughout the document and AI workflow.

```text
Document Upload
      │
      ▼
Document Processing
      │
      ▼
Audit Log

Document Delete
      │
      ▼
Audit Log

Knowledge Query
      │
      ▼
Semantic Search
      │
      ▼
AI Response
      │
      ▼
Audit Log
```

Sensitive full question and answer content is not stored in audit metadata by default.

---

## 🗄️ Database

SupportSphere uses PostgreSQL with Prisma ORM.

Production database infrastructure:

* PostgreSQL
* Neon
* Prisma ORM
* pgvector
* HNSW vector indexing

Core entities include:

```text
User
 │
 ├── Organization Membership
 │
 └── Tickets

Organization
 │
 ├── Members
 ├── Tickets
 ├── Knowledge Documents
 └── Audit Logs

Knowledge Document
 │
 └── Knowledge Chunks
        │
        └── Embeddings
```

---

## ☁️ File Storage

PDF knowledge documents are stored using Cloudinary.

```text
PDF Upload
    │
    ▼
Cloudinary
    │
    ▼
PDF Processing
    │
    ▼
Text Extraction
    │
    ▼
Chunking + Embeddings
```

---

## 🌐 Production Deployment

SupportSphere is deployed using:

```text
Frontend
   │
   ▼
Vercel
   │
   │ HTTPS
   ▼
Backend API
   │
   ▼
Render
   │
   ├──────────────► Neon PostgreSQL
   │
   ├──────────────► OpenRouter
   │
   └──────────────► Cloudinary
```

### Deployment Stack

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Neon PostgreSQL
* **File Storage:** Cloudinary
* **AI Provider:** OpenRouter

---

## 🔒 Security

Security measures implemented in SupportSphere include:

* JWT authentication
* Password hashing with bcrypt
* Request validation with Zod
* Role-based authorization
* Organization-level data isolation
* HTTP security headers with Helmet
* CORS configuration
* Protected API routes
* Organization context validation
* Audit logging
* Environment-based configuration

Secrets and credentials are managed through environment variables and are not committed to the repository.

---

## 📁 Project Structure

```text
Supportsphere/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   │
│   └── ...
│
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── tickets/
│   │   │   ├── organizations/
│   │   │   ├── audit/
│   │   │   ├── knowledge/
│   │   │   └── ...
│   │   ├── routes/
│   │   ├── shared/
│   │   └── utils/
│   │
│   └── ...
│
├── .gitignore
└── README.md
```

---

## ⚙️ Local Development

### Clone the Repository

```bash
git clone https://github.com/supportsphereindia-cloud/SupportsphereCustSuppAI.git
cd SupportsphereCustSuppAI
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Configure Environment Variables

Create the required environment files using the provided environment variable examples.

Do not commit `.env` files or API credentials to Git.

### Run the Backend

```bash
cd server
npm run dev
```

### Run the Frontend

```bash
cd client
npm run dev
```

---

## 🔌 API

The backend exposes a versioned REST API:

```text
/api/v1
```

Major API modules include:

```text
Authentication
Organizations
Members
Tickets
AI Analysis
Knowledge
Audit Logs
Health
```

---

## 🎯 Engineering Focus

SupportSphere demonstrates practical full-stack and backend engineering concepts including:

* REST API design
* Authentication and authorization
* Multi-tenant architecture
* Role-Based Access Control
* Organization-scoped data access
* PostgreSQL data modeling
* Prisma ORM
* Vector search
* Semantic retrieval
* RAG architecture
* AI/LLM integration
* PDF processing
* Cloud file storage
* Audit logging
* API validation
* Production deployment
* Frontend/backend integration

---

## 📈 Current Status

SupportSphere is deployed and operational with the following major capabilities:

* Authentication
* Organization onboarding
* Organization switching
* RBAC
* Ticket management
* AI ticket analysis
* Company knowledge management
* PDF upload and processing
* Embedding-based semantic retrieval
* RAG-powered company knowledge assistant
* Audit logging
* Production deployment

The platform can be extended with additional capabilities such as real-time communication, notifications, advanced analytics, background processing, and AI-driven ticket escalation.

---

## 👨‍💻 Author

**Aaryan Yerunkar**

Full Stack Developer | Backend & Systems

GitHub: [https://github.com/supportsphereindia-cloud](https://github.com/supportsphereindia-cloud)

```
```