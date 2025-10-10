import os
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv
from chatbot_service import ChatbotService

load_dotenv()

app = FastAPI()
chatbot = ChatbotService()

# --------------------------------------------------
# Optional simple browser test page
# --------------------------------------------------
@app.get("/", response_class=HTMLResponse)
async def index():
    return """
    <html><body>
    <h3>Chatbot (demo)</h3>
    <div>
      <label>Session ID: <input id="sess" value="session1"></label>
      <label>User ID: <input id="uid" value="user1"></label>
    </div>
    <textarea id="chat" cols=80 rows=20></textarea><br/>
    <input id="msg" size=80 placeholder="Type message..."/>
    <button onclick="send()">Send</button>
    <script>
      let ws;
      function connect(){
        const sess = document.getElementById('sess').value;
        const uid = document.getElementById('uid').value;
        ws = new WebSocket(`ws://${location.host}/chat/ws?session_id=${sess}&user_id=${uid}`);
        ws.onmessage = (ev)=> {
          document.getElementById('chat').value += ev.data;
        };
        ws.onclose = ()=> { document.getElementById('chat').value += "\\n[Connection closed]\\n"; };
      }
      connect();
      function send(){
        const m = document.getElementById('msg').value;
        ws.send(m);
        document.getElementById('chat').value += "\\nYou: " + m + "\\n";
        document.getElementById('msg').value='';
      }
    </script>
    </body></html>
    """


# --------------------------------------------------
# WebSocket endpoint for Node or browser
# --------------------------------------------------
@app.websocket("/chat/ws")
async def ws_chat(
    websocket: WebSocket,
    session_id: str = Query(...),
    user_id: str = Query(...),
):
    await websocket.accept()
    print(f"🟢 Python WS connected for session {session_id}")

    # Create or reuse session
    session = chatbot.get_session(session_id)
    if not session:
        session = chatbot.create_session(session_id, user_id)
        print(f"🧠 Created new session for user {user_id}")
    else:
        print(f"♻️  Reusing existing session {session_id}")

    try:
        while True:
            # Wait for text message from Node or browser
            data = await websocket.receive_text()
            print(f"💬 Received from client ({user_id}): {data}")

            # Launch background task so we can still receive while streaming
            asyncio.create_task(chatbot.handle_user_message(session, data, websocket))

    except WebSocketDisconnect:
        print(f"🔴 WebSocket disconnected for session {session_id}")
    except Exception as e:
        print(f"❌ WebSocket error ({session_id}):", e)
    finally:
        try:
            await websocket.close()
        except Exception:
            pass
        print(f"🟣 Connection closed for session {session_id}")
