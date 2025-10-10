
import os
import asyncio
import httpx
from datetime import datetime, timedelta
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage
from langchain.memory import ConversationBufferMemory
import dateparser

NODE_API_BASE = os.getenv("NODE_API_BASE", "http://localhost:3001")

# ---------------------- SESSION CLASS ----------------------
class Session:
    def __init__(self, session_id: str, user_id: str):
        self.session_id = session_id
        self.user_id = user_id
        self.memory = ConversationBufferMemory(return_messages=True)
        self.logs = []
        self.created_at = datetime.now().isoformat()


# ---------------------- CHATBOT SERVICE ----------------------
class ChatbotService:
    def __init__(self):
        self.model = ChatGoogleGenerativeAI(
            model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            streaming=True,
        )
        self.sessions = {}
        self.http_client = httpx.AsyncClient(timeout=20.0)

    # ---------------- SESSION HELPERS ----------------
    def create_session(self, session_id, user_id):
        s = Session(session_id, user_id)
        self.sessions[session_id] = s
        return s

    def get_session(self, session_id):
        return self.sessions.get(session_id)

    # ---------------- NODE API CALLS ----------------
    async def _fetch_doctors(self):
        """Fetch all doctors from Node backend"""
        try:
            res = await self.http_client.get(f"{NODE_API_BASE}/api/doctors")
            res.raise_for_status()
            return res.json().get("data") or res.json()
        except Exception as e:
            print("⚠️ Error fetching doctors:", e)
            return []

    async def _fetch_availability(self, doctor_id: str):
        """Fetch a specific doctor’s availability"""
        try:
            res = await self.http_client.get(f"{NODE_API_BASE}/api/doctors/{doctor_id}/availability")
            res.raise_for_status()
            return res.json().get("data") or res.json()
        except Exception as e:
            print("⚠️ Error fetching availability:", e)
            return []

    async def _fetch_existing_appointments(self, provider_id: str):
        """Fetch all existing appointments for a doctor"""
        print(f"🔍 Checking existing appointments for provider {provider_id}")
        url = f"{NODE_API_BASE}/api/appointments/provider/{provider_id}"
        try:
            res = await self.http_client.get(url)
            print("Response status:", res.status_code)
            res.raise_for_status()
            data = res.json()
            # Normalize structure
            if isinstance(data, dict):
                if "data" in data:
                    return data["data"]
                if "appointments" in data:
                    return data["appointments"]
            if isinstance(data, list):
                return data
            return []
        except Exception as e:
            print(f"⚠️ Error fetching existing appointments for {provider_id}: {e}")
            return []

    async def _book_appointment(self, user_id: str, doctor_id: str, start_time: str, end_time: str, session_id: str):
        """Book an appointment"""
        try:
            payload = {
                "userId": user_id,
                "providerId": doctor_id,
                "chatSessionId": session_id,
                "startTime": start_time,
                "endTime": end_time,
            }
            res = await self.http_client.post(f"{NODE_API_BASE}/api/appointments", json=payload)
            res.raise_for_status()
            return res.json()
        except Exception as e:
            print("⚠️ Error booking appointment:", e)
            return None

    # ---------------- HELPER UTILS ----------------
    def _overlaps(self, start_a, end_a, start_b, end_b):
        """Check if two time windows overlap."""
        return max(start_a, start_b) < min(end_a, end_b)

    # ---------------- MAIN HANDLER ----------------
    async def handle_user_message(self, session: Session, user_text: str, websocket):
        print(f"💬 USER TEXT: {user_text}")
        session.memory.chat_memory.add_message(HumanMessage(content=user_text))
        lower_text = user_text.lower()

        # 1️⃣ Doctor listing
        if "doctor" in lower_text and any(w in lower_text for w in ["available", "list", "show", "who"]):
            doctors = await self._fetch_doctors()
            if not doctors:
                await websocket.send_text("⚠️ Couldn’t fetch doctor list.")
                return
            msg = "🩺 Available doctors:\n" + "\n".join(
                [f"• {d['name']} ({d.get('specialty','General')})" for d in doctors[:5]]
            )
            await websocket.send_text(msg)
            return

        # 2️⃣ Booking logic
        if any(w in lower_text for w in ["book", "appointment", "schedule"]):
            await websocket.send_text("🔍 Checking availability and existing bookings...")

            doctors = await self._fetch_doctors()
            chosen = None
            for d in doctors:
                if d["name"].split()[-1].lower() in lower_text:
                    chosen = d
                    break

            if not chosen:
                await websocket.send_text("Please specify which doctor you want to book with.")
                return

            avail = await self._fetch_availability(chosen["id"])
            if not avail:
                await websocket.send_text(f"❌ Couldn’t fetch availability for {chosen['name']}.")
                return

            parsed_dt = dateparser.parse(user_text)
            if not parsed_dt:
                await websocket.send_text("🕒 Please specify a time (e.g. '10am tomorrow').")
                return

            weekday = parsed_dt.weekday()
            requested_time = parsed_dt.strftime("%H:%M")
            matching_slots = [s for s in avail if s["dayOfWeek"] == weekday]

            if not matching_slots:
                suggestion = avail[0]
                await websocket.send_text(
                    f"❌ {chosen['name']} isn’t available that day.\n"
                    f"✅ Next available: {suggestion['dayOfWeek']} {suggestion['startTime']}–{suggestion['endTime']}."
                )
                return

            selected_slot = None
            for s in matching_slots:
                if s["startTime"] <= requested_time <= s["endTime"]:
                    selected_slot = s
                    break

            if not selected_slot:
                await websocket.send_text(
                    f"❌ That time isn’t available. ✅ Available: "
                    + ", ".join([f"{s['startTime']}–{s['endTime']}" for s in matching_slots])
                )
                return

            start_req = parsed_dt
            end_req = start_req + timedelta(minutes=30)

            # ✅ Fetch and check existing appointments
            existing = await self._fetch_existing_appointments(chosen["id"])
            print(f"Existing appointments for {chosen['name']}: {existing}")

            conflict = False
            for a in existing:
                try:
                    a_start = datetime.fromisoformat(a["startTime"].replace("Z", "+00:00"))
                    a_end = datetime.fromisoformat(a["endTime"].replace("Z", "+00:00"))
                    if self._overlaps(start_req, end_req, a_start, a_end):
                        print(f"⛔ Conflict found with {a_start}–{a_end}")
                        conflict = True
                        break
                except Exception as err:
                    print("⚠️ Bad appointment data:", a, err)

            if conflict:
                await websocket.send_text(
                    f"❌ That time is already booked for {chosen['name']}.\n"
                    "✅ Try another time today: "
                    + ", ".join([f"{s['startTime']}–{s['endTime']}" for s in matching_slots])
                )
                return

            # ✅ Book if free
            booking = await self._book_appointment(
                session.user_id,
                chosen["id"],
                start_req.isoformat(),
                end_req.isoformat(),
                session.session_id,
            )

            if booking:
                await websocket.send_text(
                    f"✅ Appointment booked successfully!\n"
                    f"Doctor: {chosen['name']}\n"
                    f"Time: {start_req.strftime('%A %H:%M')}"
                )
            else:
                await websocket.send_text("❌ Couldn’t complete booking. Please try again.")
            return

        # 3️⃣ Default Gemini fallback
        prompt = session.memory.buffer_as_str + "\nUser: " + user_text + "\nAssistant:"
        try:
            async for chunk in self.model.astream(prompt):
                token = getattr(chunk, "content", None)
                if token:
                    await websocket.send_text(token)
        except Exception as e:
            await websocket.send_text(f"[Error from LLM: {str(e)}]")
            print(f"⚠️ Gemini error: {e}")
        await websocket.send_text("[END]")