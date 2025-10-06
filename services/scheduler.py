# import os
# import requests
# from dotenv import load_dotenv

# load_dotenv()

# class SchedulerService:
#     def __init__(self):
#         self.base_url = os.getenv("NODE_API_BASE", "http://localhost:3000/api")
#         print(self.base_url)
#         self.headers = {
#             "Authorization": f"Bearer {os.getenv('JWT_TOKEN')}",
#             "Content-Type": "application/json",
#         }
#         print(self.headers)

#     def check_availability(self, provider_id, start_time, end_time):
#         try:
#             url = f"{self.base_url}/appointments/check-availability"
#             params = {
#                 "providerId": provider_id,
#                 "startTime": start_time,
#                 "endTime": end_time,
#             }
#             response = requests.get(url, headers=self.headers, params=params)
#             return response.json()
#         except Exception as e:
#             print("Error checking availability:", e)
#             return {"available": False}

#     def hold_slot(self, user_id, provider_id, chat_session_id, start_time, end_time):
#         try:
#             url = f"{self.base_url}/appointments/hold"
#             data = {
#                 "userId": user_id,
#                 "providerId": provider_id,
#                 "chatSessionId": chat_session_id,
#                 "startTime": start_time,
#                 "endTime": end_time,
#             }
#             response = requests.post(url, headers=self.headers, json=data)
#             return response.json().get("appointment", {})
#         except Exception as e:
#             print("Error holding slot:", e)
#             return {}

#     def confirm_appointment(self, appointment_id):
#         try:
#             url = f"{self.base_url}/appointments/confirm/{appointment_id}"
#             response = requests.post(url, headers=self.headers)
#             return response.json()
#         except Exception as e:
#             print("Error confirming appointment:", e)
#             return {}


import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_BASE = os.getenv("NODE_API_BASE", "http://localhost:3000/api")
JWT_TOKEN = os.getenv("JWT_TOKEN")

HEADERS = {
    "Authorization": f"Bearer {JWT_TOKEN}",
    "Content-Type": "application/json"
}


class SchedulerService:
    def __init__(self):
        self.base_url = f"{API_BASE}/appointments"

    def check_availability(self, provider_id: str, start_time: str, end_time: str):
        """
        Calls Node.js API /appointments/check-availability
        """
        try:
            url = f"{self.base_url}/check-availability"
            params = {
                "providerId": provider_id,
                "start": start_time,
                "end": end_time
            }

            print("📡 Checking availability:", url, params)
            response = requests.get(url, params=params, headers=HEADERS, timeout=5)
            print("🔁 Response status:", response.status_code)
            print("🔍 Response body:", response.text)

            return response.json()
        except Exception as e:
            print("🚨 Error checking availability:", e)
            return {"available": False, "error": str(e)}

    def hold_slot(self, user_id, provider_id, chat_session_id, start_time, end_time):
        """
        Calls Node.js API /appointments/hold
        """
        try:
            url = f"{self.base_url}/hold"
            payload = {
                "userId": user_id,
                "providerId": provider_id,
                "chatSessionId": chat_session_id,
                "startTime": start_time,
                "endTime": end_time,
                "status": "HOLD"
            }

            print("📦 Holding slot:", url, payload)
            response = requests.post(url, json=payload, headers=HEADERS, timeout=5)
            print("🔁 Response status:", response.status_code)
            print("🔍 Response body:", response.text)

            return response.json()
        except Exception as e:
            print("🚨 Error holding slot:", e)
            return {"error": str(e)}

    def confirm_appointment(self, appointment_id):
        """
        Calls Node.js API /appointments/confirm/:id
        """
        try:
            url = f"{self.base_url}/confirm/{appointment_id}"
            print("✅ Confirming appointment:", url)
            response = requests.post(url, headers=HEADERS, timeout=5)
            print("🔁 Response status:", response.status_code)
            print("🔍 Response body:", response.text)

            return response.json()
        except Exception as e:
            print("🚨 Error confirming appointment:", e)
            return {"error": str(e)}
