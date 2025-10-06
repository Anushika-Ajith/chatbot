# 🤖 AI Appointment Chatbot System

A modular, microservice-based AI assistant that helps users **schedule appointments** through natural conversation.

Built using **LangChain**, **Google Gemini (LLM)**, **FastAPI**, **Node.js**, **PostgreSQL**, and **MongoDB**.

---

## 🧱 Project Architecture

```bash
chatbot-project/
│
├── chatbot-be/                  # 🟢 Node.js Backend (Express + Prisma)
│   ├── src/
│   │   ├── routes/
│   │   │   └── appointments.routes.js
│   │   ├── controllers/
│   │   │   └── appointments.controller.js
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── server.js
│   ├── swagger/
│   ├── .env
│   └── package.json
│
├── chatbot-ai/                  # 🐍 Python Microservice (LangChain + Gemini)
│   ├── services/
│   │   ├── chat.py              # LangChain conversation flow
│   │   ├── scheduler.py         # Node API bridge
│   ├── main.py                  # FastAPI app entry
│   ├── .env
│   ├── requirements.txt
│   └── venv/
│
└── README.md

# Full Stack AI Chatbot Project

## 🚀 Features

| Component | Description |
| :--- | :--- |
| **🤖 AI Chatbot** | Uses **LangChain + Gemini** (LLM) to handle user conversations |
| **🗓️ Appointment Scheduling** | Integrates with **Node.js API** to check, hold, and confirm slots |
| **🔐 JWT Authentication** | Secured access for all backend routes |
| **🧩 Modular Microservices** | Independent **Python** and **Node** services connected via REST |
| **💬 MongoDB Message Logging** | Stores chat transcripts for analytics |
| **📊 PostgreSQL (via Prisma)** | Stores structured entities: users, appointments, sessions |
| **🧠 Contextual Flow Management** | LangChain templates manage chat logic and flow |
| **📈 Swagger API Docs** | Auto-generated documentation for backend APIs |
| **⚡ Gemini Streaming Support** | Real-time streaming responses (ChatGPT-style typing) |

---

## 🧠 High-Level Flow

### Frontend (React / Next.js)
User chats with the bot &rarr; sends message to `/chat` or `/chat/stream`.

### Python Microservice (FastAPI + LangChain)
1. Detects intent (`book`, `check availability`, `confirm`)
2. Calls `SchedulerService` (Node API)
3. Uses **Gemini LLM** for conversational replies

### Node.js API (Express + Prisma)
1. Validates **JWT** token
2. Interacts with **PostgreSQL**
3. Provides `/check-availability`, `/hold`, `/confirm` endpoints

### PostgreSQL + MongoDB
* **PostgreSQL:** structured data (users, appointments, chat sessions)
* **MongoDB:** raw chat message logs (for analytics)

---

## ⚙️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React / Next.js |
| **AI Microservice** | Python, FastAPI, LangChain, Google Gemini |
| **Backend API** | Node.js (Express) + Prisma |
| **Databases** | PostgreSQL, MongoDB |
| **Auth** | JWT |
| **ORM** | Prisma (Postgres) + Mongoose (Mongo) |
| **Docs** | Swagger UI |

# 🧩 Database Overview

## 🐘 PostgreSQL (via Prisma)

### Appointment Model
```prisma
model Appointment {
  id            String            @id @default(uuid())
  user          User?             @relation("UserAppointments", fields: [userId], references: [id])
  userId        String?
  provider      User?             @relation("ProviderAppointments", fields: [providerId], references: [id])
  providerId    String?
  chatSession   ChatSession?      @relation(fields: [chatSessionId], references: [id])
  chatSessionId String?
  startTime     DateTime
  endTime       DateTime
  status        AppointmentStatus @default(PENDING)
  metadata      Json?
  createdAt     DateTime          @default(now())
}
🍃 MongoDB (via Mongoose)
{
  chatSessionId: String,
  sender: String, // "user" or "bot"
  content: String,
  model: String,
  tokensUsed: Number,
  rawResponse: Object,
  createdAt: Date
}

🧩 API Endpoints
🐍 FastAPI (Chatbot Microservice)
Method	Endpoint	Description
POST	/chat	Processes user input via LangChain & Gemini
GET	/chat/stream?query=	Streams Gemini LLM responses in real time
GET	/	Health check endpoint
🟢 Node.js API
Method	Endpoint	Description
GET	/api/appointments/check-availability	Checks slot availability
POST	/api/appointments/hold	Holds a slot temporarily
POST	/api/appointments/confirm/:id	Confirms an appointment
POST	/api/users/login	Generates JWT token
GET	/api/users/me	Returns authenticated user info
🔑 Environment Variables
.env (Python Microservice)
GOOGLE_API_KEY=AIzaSyXXXX
NODE_API_BASE=http://localhost:3000/api
JWT_TOKEN=<node_jwt_token>
.env (Node.js Backend)
DATABASE_URL="postgresql://user:password@localhost:5432/chatbot"
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/chatbot
PORT=3000
⚡ Running Locally (No Docker)
1️⃣ Install and Start Databases
PostgreSQL
Install PostgreSQL locally
Create a database:
createdb chatbot
MongoDB
Install MongoDB Community Edition
Start the MongoDB service:
brew services start mongodb-community
(or use mongod manually on Linux/Windows)
2️⃣ Run Node.js Backend
cd chatbot-be
npm install
npx prisma migrate dev
npm run start:dev
Swagger UI: http://localhost:3000/api-docs
3️⃣ Run Python AI Microservice
cd chatbot-ai
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
4️⃣ Test Chat API
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"user_input": "Book appointment at 10am"}'
Expected response:
{"response": "✅ Slot held for 2025-10-10T10:00:00Z. Please confirm to finalize booking."}
🧠 Example Flow
User:
Hi, can you help me book an appointment with Dr. Mehta tomorrow morning?
Bot:
Let me check the available slots for tomorrow morning...
✅ Slot held for 2025-10-10T10:00:00Z.
Please confirm to finalize the booking.
User:
Yes, confirm it.
Bot:
✅ Your appointment has been confirmed successfully.
🧰 Future Enhancements
✅ Add LangChain memory for context retention
✅ Integrate natural language date/time extraction (Duckling or Chrono)
✅ Add appointment reminders via email or SMS
✅ Frontend chat UI with live streaming (ChatGPT-style typing)
✅ Analytics dashboard for appointment patterns
🧑‍💻 Contributors
Name	Role
Anushika Ajith	AI Engineer / Full Stack Developer
📜 License
MIT License © 2025 — AI Appointment Chatbot System
Developed for AI Engineer Skills Assessment Project
