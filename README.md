# 🧠 AI-Powered Healthcare Chatbot System

A complete AI-driven appointment scheduling chatbot built using Next.js, Node.js, and Python (LangChain). This system demonstrates end-to-end architecture for a healthcare/dental — featuring secure authentication, real-time chat, and intelligent appointment management.

## 🏗️ System Architecture

### 1. Frontend (Next.js / React)

* Real-time chatbot UI using Socket.IO
* Secure session-based authentication
* Responsive design with TailwindCSS
* Role-based interaction support
* Voice input (speech-to-text) integration

### 2. Backend API (Node.js + Express)

* REST API layer for user management and token handling
* `/api/chatbot/token` endpoint for short-lived JWT generation
* Middleware for:
  * Request validation
  * Authentication
  * Rate limiting
  * Logging
* Socket.IO integration for real-time communication
* MongoDB used for message persistence

### 3. Python Microservice (FastAPI + LangChain)

* Handles intelligent conversation flows and appointment scheduling
* Integrates with LangChain and an LLM provider (e.g., OpenAI)
* Implements:
  * Context-aware dialogue
  * Appointment creation/cancellation
  * Session-based chat management
* WebSocket support for real-time bot replies
* Logging for conversation analytics

### 4. Database Schema (PostgreSQL + MongoDB)

* PostgreSQL stores structured data:
  * `users` → authentication & profile
  * `appointments` → appointment metadata
  * `chat_sessions` → chat room/session linkage
* MongoDB stores unstructured chat messages:
  * `messages` → real-time message history (sender, content, timestamps)

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, TailwindCSS |
| Backend | Node.js, Express, Socket.IO |
| Microservice | Python, FastAPI, LangChain |
| Databases | PostgreSQL, MongoDB |
| Auth | JWT, Session-based |
| Realtime | WebSockets |
| AI/LLM | LangChain + OpenAI / Anthropic |

### 5. Set Up

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/chatbot.git
cd chatbot
```

### 2️⃣ Checkout Each Branch

#### UI
```bash
git checkout chatbot-ui-updated
cd frontend
npm install
npm run dev
```

Runs at → `http://localhost:3000`

#### Backend
```bash
git checkout chatbot-be-updated
cd backend
npm install
node src/server.js
```

Runs at → `http://localhost:3001`

#### AI (Python)
```bash
git checkout chatbot-ai-updated
cd python-be-final
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Runs at → `http://localhost:8000`


Create `.env` files in each service:

#### 🟢 Node.js Backend (`/chatbot/.env`)
```env
PORT=3001
JWT_SECRET=your_secret_key
POSTGRES_URL=postgresql://user:password@localhost:5432/chatbot
MONGO_URI=mongodb://localhost:27017/chatbot_messages
PYTHON_API_BASE=http://localhost:8000
```

#### 🟣 Python Microservice (`/python-be-final/.env`)
```env
GOOGLE_API_KEY=your_secret_key
NODE_API_BASE=http://localhost:3001
```

#### 🔵 Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001  
```


## 🔒 Security Highlights

* JWT-based authentication with token expiry

## 📈 Future Improvements
* Add calendar sync with Google Calendar API
* Add dashboard for appointment analytics
* Enhance natural language understanding with retrieval-augmented generation (RAG)

## 👨‍💻 Author
**Anushika Ajith**  
Full Stack & AI Engineer

## 🧾 Note
⚠️ **Disclaimer:** This project's AI microservice uses Google Gemini 2.5 Flash (via LangChain integration). While it performs well for real-time conversational tasks, you may occasionally encounter minor inconsistencies or delayed responses due to model latency or context handling. These behaviors are expected and do not affect the overall functionality of the system.
