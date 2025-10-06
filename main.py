from fastapi import FastAPI, Body
from services.chat import handle_chat
from fastapi.responses import StreamingResponse
import google.generativeai as genai
import os
from dotenv import load_dotenv
import asyncio
import google.generativeai as genai


load_dotenv()

app = FastAPI(title="Chatbot AI Microservice")

@app.get("/")
def root():
    return {"message": "LangChain Chatbot microservice running 🚀"}

@app.post("/chat")
async def chat(user_input: str = Body(..., embed=True)):
    response = await handle_chat(user_input)
    return {"response": response}

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))



@app.get("/chat/stream")
async def stream_chat(query: str):
    """
    Streams a Gemini response as Server-Sent Events (SSE)
    using the v1 API.
    """
    model = genai.GenerativeModel("gemini-1.5-flash")

    async def event_stream():
        try:
            response = model.generate_content(
                query,
                stream=True
            )
            for chunk in response:
                text = chunk.text if hasattr(chunk, "text") else None
                if text:
                    yield f"data: {text}\n\n"
                    await asyncio.sleep(0)
            yield "data: [END]\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
