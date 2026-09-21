# SBE-Enterprise-BackEnd

Production REST API and Backend services for **Shree Beereshwara Enterprises (SBE)** — Leading industrial manpower supply and facility management agency based in Mysore, Karnataka.

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)](https://vercel.com)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Framework-Express-blue)](https://expressjs.com)

---

## 🌟 Production Message & Root Health

When deployed on Vercel or accessed at the root URL `/`, the server responds with:
```text
SBE enterprise in running in prod
```

And at `/api/health`:
```json
{
  "status": "ok",
  "message": "SBE enterprise in running in prod",
  "timestamp": "2026-09-21T12:00:00.000Z",
  "uptime": 124.5
}
```

---

## 🔐 Authentication & Access Control

### Agency Administrator
- Secured administrator portal with role-based JWT authentication.
- Administrator credentials are authenticated securely against backend records.
- Unauthorized access attempts will be rejected with `401 Unauthorized`.
- Sessions remain persistent in localStorage until explicitly logged out.

### Client HR Portal Credentials
- Each client company registered by the Admin is automatically assigned a cryptographically generated **Strong Password** (16 characters, uppercase, lowercase, digits, symbols), stored securely in the backend.
- Client HR portal allows designated plant coordinators to view workforce deployment for their specific facility.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
# or
npm start
```
Server starts on `http://localhost:5000`.

---

## 🌐 Deploying to Vercel

This repository includes a pre-configured `vercel.json` for zero-config serverless deployment on Vercel:

1. Import this repository in [Vercel Dashboard](https://vercel.com/new).
2. Framework Preset: **Other** (Root directory: `./`).
3. Set Environment Variables (Optional):
   - `JWT_SECRET`: Your custom JWT signing secret (defaults to secure fallback).
   - `PORT`: `5000`
4. Click **Deploy**.
5. Once deployed, visiting your Vercel URL will display: `SBE enterprise in running in prod`.

---

## 📚 API Endpoints Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login as Admin or Client HR | Public |
| `GET` | `/api/auth/me` | Retrieve current authenticated user profile | Bearer Token |

#### Sample Login Request:
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

---

### 2. Client Companies Management (`/api/clients`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/clients` | List all registered client companies and plants |
| `POST` | `/api/clients` | Register a new client company (Auto-generates strong password) |
| `GET` | `/api/clients/:id` | Get details of a specific client company |
| `PUT` | `/api/clients/:id` | Update client company details |
| `DELETE` | `/api/clients/:id` | Remove client company from system |
| `POST` | `/api/clients/:id/regenerate-password` | Generate a new strong password for client company |

#### Sample Add Client Request:
```json
POST /api/clients
Content-Type: application/json

{
  "name": "Apex Precision Automotive",
  "industry": "Automotive Components",
  "location": "Kadakola Industrial Belt, Mysore",
  "assignedWorkers": 45,
  "contactPerson": "Vijay Kumar (HR Manager)",
  "contactEmail": "vijay@apexauto.in",
  "contactPhone": "+91 98450 12345"
}
```
*The response returns `generatedPassword` with 16 characters containing uppercase, lowercase, numbers, and symbols.*

---

### 3. Industrial Workforce Roster (`/api/employees`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/employees` | Search and filter workers (`?search=`, `?clientCompany=`, `?role=`, `?status=`) |
| `GET` | `/api/employees/stats` | Workforce deployment statistics (Headcount, State distribution, Shift quotas) |
| `GET` | `/api/employees/:id` | Get single worker details |
| `POST` | `/api/employees` | Enroll a new industrial worker into roster |
| `PUT` | `/api/employees/:id` | Update worker info or toggle status (`Active` / `In Reserve`) |
| `DELETE` | `/api/employees/:id` | Remove worker record |

---

### 4. Shift Roll-Call & Attendance (`/api/attendance`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/attendance` | Today's shift punch-in status for all active workers |
| `POST` | `/api/attendance/toggle` | Toggle worker status (`Present` ⇄ `Absent` ⇄ `Shift Swapped`) |
| `POST` | `/api/attendance/set` | Set explicit status (`empId`, `status`) |

---

### 5. Proposals & Inbound Requisitions (`/api/proposals`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/proposals` | List all incoming commercial proposals & estimator requests |
| `POST` | `/api/proposals` | Submit new inquiry from Contact Page or Manpower Estimator |
| `PUT` | `/api/proposals/:id` | Update status (`Under Review`, `Approved`, `Dispatched`) |

---

### 6. Reports & Compliance Audits (`/api/reports`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/reports/timesheet` | Itemized monthly billing muster roll & overtime log |
| `GET` | `/api/reports/compliance` | Statutory EPF, ESIC, and Form V compliance docket |
| `GET` | `/api/reports/roster` | Biometric identity & police verification summary |

---

## 🏛️ Architecture & File Structure

```text
backend/
├── data/
│   └── store.js              # In-memory database singleton with initial seed data
├── middleware/
│   └── authMiddleware.js     # JWT verification & role authorization
├── routes/
│   ├── authRoutes.js         # Admin & Client HR authentication
│   ├── clientRoutes.js       # Client plant management & strong password generation
│   ├── employeeRoutes.js     # Worker enrollment & roster management
│   ├── attendanceRoutes.js   # Live shift roll-call and biometric punch-ins
│   ├── proposalRoutes.js     # Inbound manpower requests & proposals
│   └── reportRoutes.js       # Billing timesheets & statutory compliance
├── utils/
│   └── passwordGenerator.js  # Cryptographically secure password generator
├── index.js                  # Main Express entry point with Vercel export
├── package.json              # Backend dependencies & scripts
├── vercel.json               # Vercel serverless deployment routing
├── .gitignore                # Ignored files (node_modules, .env)
└── README.md                 # Project documentation
```

---

## 📄 License
Copyright © 2026 Shree Beereshwara Enterprises (SBE). All rights reserved.
Proprietor: **Pavan Malaiah** | Mysore, Karnataka.
