from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from services.scheduler import SchedulerService
import os
from dotenv import load_dotenv

load_dotenv() 

scheduler = SchedulerService()
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.3,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

prompt = ChatPromptTemplate.from_template("""
You are a helpful assistant that helps users book appointments.
If the user requests a date and time, you should check with the scheduling API whether it's available.
If available, ask the user for confirmation to book it.
When user confirms, call the confirm API.

User: {user_input}
""")

async def handle_chat(user_input: str):
    """
    Handles user chat logic and interacts with scheduling API
    """
    # Simple pattern match (you can replace with intent detection later)
    if "available" in user_input.lower() or "book" in user_input.lower():
        # Example: "Book an appointment with provider 123 at 10am tomorrow"
        provider_id = "provider-uuid-here"
        start_time = "2025-10-10T10:00:00Z"
        end_time = "2025-10-10T10:30:00Z"

        availability = scheduler.check_availability(provider_id, start_time, end_time)

        if availability.get("available"):
            # Hold the slot
            appointment = scheduler.hold_slot(
                user_id="user-uuid-here",
                provider_id=provider_id,
                chat_session_id="chat-session-uuid-here",
                start_time=start_time,
                end_time=end_time
            )
            return f"Slot held for {start_time}. Please confirm to finalize booking (Appointment ID: {appointment.get('id')})."
        else:
            return "Sorry, that time slot is not available."

    elif "confirm" in user_input.lower():
        # Assuming last appointment ID is tracked in conversation (simplified)
        appointment_id = "appointment-id-here"
        result = scheduler.confirm_appointment(appointment_id)
        return f"Your appointment has been confirmed ✅"

    else:
        # Normal chat LLM response
        messages = prompt.format_messages(user_input=user_input)
        response = llm(messages)
        return response.content
