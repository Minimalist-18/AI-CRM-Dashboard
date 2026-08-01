# AI CRM Dashboard 🚀

A modern **AI-powered Customer Relationship Management (CRM)** platform built with the **MERN Stack (MongoDB, Express.js, React, Node.js)**, styled using **Tailwind CSS** with a **hand-built shadcn-style UI**, and powered by **Google Gemini AI**.

Manage leads, contacts, sales pipelines, follow-up tasks, and customer notes from one intuitive dashboard. Boost productivity with AI-generated lead summaries, intelligent email drafting, and pipeline insights—all wrapped in a premium fintech-inspired interface with live analytics.

---

## ✨ Features

### 🔐 User Authentication

- Secure user registration & login
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Auto-login on page refresh

---

### 👥 Leads Management

Manage your sales leads efficiently with:

- Full CRUD operations
- Live search
- Filtering by:
  - Stage
  - Priority
  - Lead Source
- Sortable columns
- Bulk delete
- CSV export
- Table & Card view modes

---

### 📋 Lead Detail Drawer

View complete lead information instantly without leaving the page.

Features include:

- Full lead details
- Inline editing
- Delete lead
- AI-powered actions
- Quick access drawer

---

### 📈 Sales Pipeline (Kanban)

Organize deals using a drag-and-drop Kanban board.

Stages include:

- New
- Qualified
- Proposal
- Won
- Lost

Additional functionality:

- Persistent drag-and-drop ordering
- Stage-wise deal totals
- Revenue tracking

---

### 📇 Contacts Management

Keep customer information organized with:

- Full CRUD operations
- Search functionality
- Favorite contacts
- Tagging system
- Contact detail drawer

---

### 📝 Notes

Attach notes to leads with:

- Rich note management
- Pin important notes
- Content search
- Masonry layout

---

### ✅ Follow-up Tasks

Never miss an important follow-up.

Features include:

- Due dates
- Overdue detection
- Today's tasks
- Status tracking
- Priority management
- Completion progress bar
- Grouped task lists

---

### 📊 Dashboard Analytics

A centralized dashboard displaying:

- KPI cards
- Pipeline engagement chart
- Revenue won trend
- Leads by source donut chart
- Top open deals
- Recent activity feed

All powered from a single optimized aggregation endpoint.

---

## 🤖 AI Features (Google Gemini)

### AI Lead Summary

Generate intelligent summaries for every lead.

AI provides:

- Structured lead summary
- Risk score (0–100)
- Suggested priority
- Recommended next action

---

### ✉️ AI Email Generator

Generate professional sales emails instantly.

Supports:

- Multiple email purposes
- Different writing tones
- AI-generated subject line
- Professional email body

---

### 📈 AI Sales Insights

Analyze your entire sales pipeline with AI.

Receive:

- Pipeline health score
- Data-driven observations
- Actionable recommendations
- Sales improvement insights

---

### 📦 Structured AI Output

Every AI response uses structured JSON output for:

- Reliable responses
- Consistent formatting
- Easier backend parsing
- Better frontend rendering

---

## 📱 Premium UI

Built with:

- React 19
- Tailwind CSS v4
- Hand-built shadcn-style component library

Includes:

- Fully responsive layout
- Modern fintech-inspired design
- Sky-blue dashboard theme
- Smooth animations
- Reusable UI components

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS v4
- React Router
- Axios
- Recharts
- Custom shadcn-style UI Components

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Google Gemini API

### AI

- Google Gemini
- Structured JSON Output
- AI Lead Analysis
- AI Email Generation
- AI Sales Analytics

---

## 📂 Project Structure

```
AICRMDASHBOARD
│
├── Backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── Frontend
│   ├── public
│   ├── src
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone <repository-url>

cd AICRMDASHBOARD
```

---

## Backend Setup

```bash
cd Backend

npm install
```

Create a `.env` file inside the Backend folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_google_gemini_api_key
```

Run the backend:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## Frontend Setup

Open another terminal.

```bash
cd Frontend

npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔒 Security

Implemented security features include:

- JWT Authentication
- bcrypt Password Hashing
- Protected Routes
- Owner-scoped (multi-tenant ready) data
- Centralized Error Handling
- Async Handler Wrapper
- Modular Backend Architecture

---

## 🏗️ Backend Architecture

```
Routes
   ↓
Controllers
   ↓
Services
   ↓
Database
```

Includes:

- Modular folder structure
- Reusable services
- Custom error class
- Central error middleware
- Async request wrapper

---

## 🚀 Application Workflow

```
User Login
      │
      ▼
Dashboard
      │
      ├── Manage Leads
      ├── Manage Contacts
      ├── Manage Tasks
      ├── Manage Notes
      │
      ▼
Google Gemini AI
      │
      ├── Lead Summary
      ├── Email Generator
      └── Sales Insights
      │
      ▼
Analytics Dashboard
```

---

## 📌 Functionalities Implemented

- ✅ Secure Authentication
- ✅ Lead Management
- ✅ Contacts Management
- ✅ Sales Pipeline (Kanban)
- ✅ Drag & Drop Deal Tracking
- ✅ Follow-up Tasks
- ✅ Notes Management
- ✅ Dashboard Analytics
- ✅ AI Lead Summary
- ✅ AI Email Generator
- ✅ AI Sales Insights
- ✅ Structured Gemini Responses
- ✅ Multi-Tenant Data Isolation
- ✅ Responsive Dashboard
- ✅ Premium UI Components

---

## 🔮 Future Enhancements

Potential future improvements:

- Calendar integration
- Team collaboration
- Customer activity timeline
- Role-based access control
- AI meeting summaries
- WhatsApp & Email integrations
- Notification system
- Mobile application
- File attachments for leads
- CRM performance forecasting

---

## 👨‍💻 Author

Built with ❤️ using the MERN Stack, Google Gemini AI, and Tailwind CSS.

---

## 📄 License

This project is licensed under the MIT License.