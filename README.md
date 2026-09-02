SupportSphere

AI-Powered Customer Support & Ticket Management Platform

SupportSphere is a full-stack customer support platform designed to
demonstrate how a modern support system can combine ticket management,
organization-based access control, role-based permissions, AI-assisted
ticket analysis, audit logging, and a production-style deployment
architecture.

The project is built as a portfolio-grade application using the
MERN-style JavaScript ecosystem with PostgreSQL and Prisma rather
than MongoDB, because relational data and organization/member/ticket
relationships are central to the system.

🚀 Project Overview

Customer support applications often need more than a simple CRUD
interface. A useful support platform needs to answer questions such as:

Who owns a ticket?

Which organization does the ticket belong to?

Which users are allowed to access it?

What changed on a ticket?

Can AI help an agent understand or prioritize a ticket?

How can administrators manage organization members and roles?

How can the backend remain secure while supporting a modern
frontend?

How can the application be deployed as separate frontend and backend
services?

SupportSphere addresses these requirements through a modular
full-stack architecture.

The current application provides:

🔐 JWT-based authentication

🏢 Multi-organization/workspace support

👥 Organization membership and RBAC

🎫 Ticket creation, viewing, editing, and closing

🤖 AI-powered ticket analysis

📋 Audit logging

📊 Dashboard-oriented ticket management

🔌 RESTful backend APIs

🗄️ PostgreSQL database with Prisma ORM

🌐 React/Vite frontend

☁️ Production deployment using Render, Vercel, and Neon PostgreSQL

🎯 Why I Built This Project

SupportSphere was built to go beyond a basic "ticket CRUD" project.

The goal was to implement a realistic backend-driven product where
multiple concepts work together:

Authentication → Authorization → Organizations → Tickets → AI → Audit
Logs → Deployment

This project demonstrates practical experience with:

REST API design

Backend architecture

Database modeling

Authentication and authorization

Multi-tenant data isolation

Role-based access control

AI API integration

Frontend/backend integration

Environment configuration

Database migrations

Cloud deployment

Git/GitHub workflows

✨ Core Features

🔐 Authentication

SupportSphere uses token-based authentication to protect application
resources.

Key concepts:

User registration/login flow

JWT access tokens

Protected API routes

Authorization header handling

Frontend token persistence

Authenticated API requests through Axios

🏢 Organizations & Multi-Tenant Architecture

Users can belong to organizations/workspaces.

An organization provides a logical boundary around support data.

For example:

Acme Support
├── Aaryan Yerunkar     → OWNER
└── Other Support Agent → AGENT

NovaTech Customer Care
├── Aaryan Yerunkar     → OWNER
└── Rahul Sharma        → AGENT

The active organization is sent by the frontend using:

X-Organization-Id

The backend then:

Authenticates the user.

Reads the requested organization.

Verifies organization membership.

Resolves the user's role.

Attaches organization context to the request.

Scopes organization-owned data accordingly.

This prevents application logic from treating all tickets as belonging
to one global pool.

👥 Role-Based Access Control

Organization members have roles such as:

OWNER

AGENT

Authorization is enforced on the backend rather than relying only on
frontend UI restrictions.

Organization management includes APIs for:

Listing organizations

Creating organizations

Viewing organization details

Adding members

Listing members

Updating member roles

Removing members

🎫 Ticket Management

SupportSphere provides the core functionality expected from a
customer-support ticketing system.

Users can:

Create tickets

View tickets

View ticket details

Update tickets

Close tickets

Track ticket status

Work with tickets inside their active organization

Current ticket lifecycle:

OPEN
  │
  │ Update / AI Analysis
  │
  ▼
OPEN
  │
  │ Close
  ▼
CLOSED

The backend validates ticket operations and records important changes
through the audit system.

🤖 AI-Powered Ticket Analysis

One of the main differentiators of SupportSphere is its AI integration.

An agent can request AI analysis for a ticket.

The backend sends the relevant ticket information to an AI provider
through OpenRouter, processes the response, and persists the
resulting analysis.

The architecture separates:

Ticket
  ↓
AI Analysis Request
  ↓
AI Provider
  ↓
Analysis Result
  ↓
Database
  ↓
Frontend

This makes the AI feature part of the actual application workflow rather
than a standalone chatbot demo.

AI analysis can be re-triggered when updated analysis is required.

API credentials are stored as environment variables and are never
hard-coded into the frontend or source repository.

📋 Audit Logging

SupportSphere maintains an audit trail for important system actions.

Examples include:

Ticket creation

Ticket updates

Ticket closure

AI analysis creation

Conceptually:

User Action
    ↓
Application Service
    ↓
Business Operation
    ↓
Audit Log Entry

This provides traceability and establishes a foundation for more
advanced enterprise features.

📊 Dashboard

The frontend provides a dashboard-oriented experience for managing
support work.

The dashboard is designed around the information a support agent needs
to quickly understand the current state of tickets and navigate to
relevant actions.

🏗️ System Architecture

High-level architecture:

                    ┌──────────────────────┐
                    │      End User        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ React + Vite Client  │
                    │      Vercel          │
                    └──────────┬───────────┘
                               │ HTTPS / REST
                               ▼
                    ┌──────────────────────┐
                    │ Express.js API       │
                    │      Render          │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌────────────┐  ┌─────────────┐  ┌──────────────┐
        │   Prisma   │  │ AI Service  │  │ Audit Layer  │
        │    ORM     │  │  OpenRouter │  │              │
        └─────┬──────┘  └─────────────┘  └──────────────┘
              │
              ▼
        ┌────────────────┐
        │ PostgreSQL      │
        │ Neon            │
        └────────────────┘

🧰 Tech Stack

Frontend

Technology     Purpose

React.js       UI development
Vite           Frontend tooling and build system
Tailwind CSS   Styling and responsive UI
Axios          HTTP client and API communication

Backend

Technology   Purpose

Node.js      JavaScript runtime
Express.js   REST API framework
JWT          Authentication
Helmet       HTTP security headers
CORS         Cross-origin API access
Morgan       HTTP request logging

Database

Technology   Purpose

PostgreSQL   Relational database
Prisma       ORM and database access
Neon         Cloud PostgreSQL hosting

AI

Technology            Purpose

OpenRouter            AI model gateway
AI analysis service   Ticket analysis and persistence

Development & Deployment

Tool     Purpose

Git      Version control
GitHub   Source-code hosting
Render   Backend deployment
Vercel   Frontend deployment
npm      Dependency management

📁 Project Structure

supportsphere/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   │
│   ├── package.json
│   ├── .env.example
│   └── ...
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── shared/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   ├── .env.example
│   └── ...
│
├── docs/
├── .gitignore
├── LICENSE
└── README.md

The backend follows a modular structure so that business domains can
evolve independently as the application grows.

🗄️ Database Design

The current database contains the following major entities:

User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Organization   Ticket
 │               │
 ▼               ▼
OrganizationMember
 │
 └── Role

Ticket
 │
 ├── AIAnalysis
 │
 └── AuditLog

Main Models

User

Represents an authenticated application user.

Important fields include:

ID

Name

Email

Password hash

Created/updated timestamps

Organization

Represents a customer-support workspace.

Important fields include:

ID

Name

Slug

Created/updated timestamps

OrganizationMember

Connects users to organizations and stores their role.

Example:

User + Organization + Role

Ticket

Represents a customer-support issue.

Includes:

Title

Description

Status

Organization/user relationship

Timestamps

Current status values include:

OPEN
CLOSED

AIAnalysis

Stores AI-generated ticket analysis.

This means AI responses are treated as application data rather than
being discarded after the API call.

AuditLog

Stores important user/system actions for traceability.

🔑 Environment Variables

Client

Create:

client/.env

Example:

VITE_API_BASE_URL=http://localhost:5000/api/v1

For production, the value points to the deployed backend API.

Server

Create:

server/.env

The backend requires environment-specific configuration such as:

PORT=5000
NODE_ENV=development
DATABASE_URL=
JWT_SECRET=
OPENROUTER_API_KEY=

Actual secrets should never be committed to Git.

A sanitized .env.example is included in the repository to document
required configuration.

🛠️ Local Development

1. Clone the repository

git clone https://github.com/supportsphereindia-cloud/SupportsphereCustSuppAI.git
cd SupportsphereCustSuppAI

2. Install backend dependencies

cd server
npm install

3. Configure backend environment variables

Create:

server/.env

and provide the required values.

4. Generate Prisma Client

npx prisma generate

5. Apply database migrations

For a development database:

npx prisma migrate dev

For a deployed database:

npx prisma migrate deploy

6. Start the backend

npm run dev

The development API runs on:

http://localhost:5000

Health endpoint:

http://localhost:5000/api/v1/health

7. Install frontend dependencies

Open another terminal:

cd client
npm install

Create:

client/.env

Example:

VITE_API_BASE_URL=http://localhost:5000/api/v1

8. Start the frontend

npm run dev

Vite will provide the local development URL in the terminal.

🔌 API Overview

The backend exposes versioned REST endpoints under:

/api/v1

Health

GET /api/v1/health

Authentication

Authentication endpoints handle user account access and JWT-based
sessions.

Organizations

POST   /api/v1/organizations
GET    /api/v1/organizations
GET    /api/v1/organizations/:id
POST   /api/v1/organizations/members
GET    /api/v1/organizations/members
PATCH  /api/v1/organizations/members/:memberId/role
DELETE /api/v1/organizations/members/:memberId

Tickets

Ticket endpoints provide the application's main support workflow,
including creation, retrieval, updating, and closing tickets.

AI

POST /api/v1/ai/tickets/:id/analyze

This triggers AI analysis for a ticket and persists the resulting
analysis.

🔒 Authorization Flow

A typical authenticated request works approximately like this:

Frontend
   │
   │ Authorization: Bearer <JWT>
   │ X-Organization-Id: <organization-id>
   ▼
Express API
   │
   ├── Authenticate user
   │
   ├── Resolve organization
   │
   ├── Verify membership
   │
   ├── Determine role
   │
   └── Execute authorized operation
   ▼
Database

This design is important because authorization is enforced at the API
layer rather than trusting the frontend.

🌐 Deployment Architecture

SupportSphere is designed as a separately deployed frontend/backend
application.

                         Internet
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       Vercel Frontend              Render Backend
       React + Vite                 Node + Express
                                           │
                         ┌─────────────────┼─────────────────┐
                         │                 │                 │
                         ▼                 ▼                 ▼
                      Neon DB        OpenRouter        Audit System
                    PostgreSQL           AI

Production Backend

The backend is deployed on Render.

Health endpoint:

https://supportsphere-backend-2w3a.onrender.com/api/v1/health

Production Database

PostgreSQL is hosted using Neon.

Database schema changes are managed through Prisma migrations.

Production Frontend

The React/Vite frontend is deployed through Vercel.

The frontend communicates with the backend through:

VITE_API_BASE_URL=https://supportsphere-backend-2w3a.onrender.com/api/v1

🧪 Build & Verification

Frontend production build

cd client
npm run build

Backend

cd server
npm start

Prisma

Validate the Prisma schema:

npx prisma validate

Generate the Prisma client:

npx prisma generate

Check migration status:

npx prisma migrate status

Deploy migrations:

npx prisma migrate deploy

📌 Engineering Decisions

Why PostgreSQL?

SupportSphere contains strongly related entities:

Users
Organizations
Members
Tickets
AI Analyses
Audit Logs

A relational database makes relationships, constraints, indexing, and
transactional operations natural for this domain.

Why Prisma?

Prisma provides:

Type-safe database access

Declarative schema management

Migration support

Developer-friendly queries

Clear relationship modeling

Why organization context in the request?

Passing:

X-Organization-Id

allows the backend to explicitly determine the workspace in which an
authenticated user is operating.

The backend still verifies membership before accessing
organization-scoped resources.

Why persist AI analysis?

Instead of treating AI as a one-off API response, SupportSphere stores
the result.

This allows future features such as:

Analysis history

AI-assisted dashboards

Agent recommendations

Analytics

Re-analysis comparison

AI quality evaluation

🧭 Future Roadmap

SupportSphere is intentionally structured so that additional
customer-support capabilities can be added without replacing the core
architecture.

Planned directions include:

Customer Support

Customer profiles

Agent/team management

Ticket assignment

Priority levels

Tags

Advanced filtering

Full-text search

Real-Time Support

Live chat

Socket.IO integration

Real-time ticket updates

Agent presence

Knowledge Base

FAQ management

Knowledge-base articles

PDF/DOC document ingestion

Searchable support content

Advanced AI

Retrieval-Augmented Generation (RAG)

AI support chatbot

Suggested responses

Automatic ticket categorization

Priority prediction

Sentiment analysis

Automatic escalation

Knowledge-base grounded answers

Platform Engineering

Redis caching

Background jobs with BullMQ

Email notifications

Cloudinary file storage

Rate limiting

Improved observability

Automated testing

CI/CD pipelines

Analytics

Ticket resolution metrics

Response-time analytics

Agent performance

Customer feedback

AI analysis metrics

Organization-level reporting

💡 What This Project Demonstrates

From a software-engineering perspective, SupportSphere demonstrates
experience with:

Backend Engineering

Express.js REST API development

Modular backend architecture

Middleware

Authentication

Authorization

Error handling

API versioning

Database access

Business logic separation

Database Engineering

PostgreSQL

Relational schema design

Prisma ORM

Foreign-key relationships

Migrations

Organization-level data modeling

Security

JWT authentication

Password hashing

Environment-based secrets

HTTP security headers

CORS configuration

Backend authorization

Organization membership validation

AI Engineering

External AI API integration

AI request/response handling

Persisting AI-generated results

AI integration inside a business workflow

Frontend Engineering

React component architecture

React routing

Axios API integration

Authentication state

Organization context

Dashboard UI

Ticket management workflows

DevOps / Deployment

Git/GitHub

Environment configuration

Cloud PostgreSQL

Backend deployment

Frontend deployment

Production builds

Database migration deployment

📈 Current Project Status

Area                         Status

React frontend               ✅ Implemented
Express backend              ✅ Implemented
PostgreSQL                   ✅ Implemented
Prisma ORM                   ✅ Implemented
JWT authentication           ✅ Implemented
Organizations                ✅ Implemented
RBAC                         ✅ Implemented
Ticket CRUD                  ✅ Implemented
Ticket closing               ✅ Implemented
AI ticket analysis           ✅ Implemented
Audit logging                ✅ Implemented
Neon deployment              ✅ Implemented
Render deployment            ✅ Implemented
Vercel frontend deployment   🚀 Deployment configured
Live chat                    🔜 Planned
Knowledge base               🔜 Planned
RAG                          🔜 Planned
Advanced analytics           🔜 Planned

🧑‍💻 Author

Aaryan Yerunkar

Full-Stack Developer

This project was developed as a portfolio project to demonstrate
practical full-stack development, backend architecture, database design,
authentication/authorization, AI integration, and cloud deployment.

📄 License

This project is licensed under the terms specified in the repository's
LICENSE file.

⭐ If You're Reviewing This Project

If you are a recruiter or engineer reviewing SupportSphere, the
recommended starting points are:

Frontend: client/src/

Backend: server/src/

Database schema: server/prisma/schema.prisma

API routes: server/src/routes/

Business modules: server/src/modules/

Authentication/authorization middleware:
server/src/middleware/

AI integration: AI-related modules under server/src/

Database migrations: server/prisma/migrations/

The project is intentionally structured to show not only the UI, but
also the backend, database, authorization, AI, and deployment
decisions behind the produc