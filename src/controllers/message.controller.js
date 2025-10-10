
import { Message } from "../models/message.model.js"; 
import { prisma } from "../config/db.js";

export async function createMessage(req, res) {
  try {
    const { chatSessionId, sender, content, userId } = req.body;
    const userMessage = await Message.create({
      chatSessionId,
      sender,
      content,
    });

    const pythonResponse = await fetch("http://localhost:8000/chat/ws", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_input: content,
        user_id: userId,
        chat_session_id: chatSessionId,
      }),
    });

    if (!pythonResponse.ok) {
      const errorBody = await pythonResponse.text();
      throw new Error(
        `Python service failed [${pythonResponse.status}]: ${errorBody}`
      );
    }

    const aiResponseData = await pythonResponse.json();
    const botReply =
      typeof aiResponseData === "string"
        ? aiResponseData
        : aiResponseData.response || "Sorry, I couldn’t understand that.";

    const botMessage = await Message.create({
      chatSessionId,
      sender: "bot",
      content: botReply,
      model: "gemini-1.5-flash",
    });

    res.status(201).json({
      message: "Message processed successfully",
      userMessage,
      botMessage,
      aiRawResponse: aiResponseData,
    });
  } catch (error) {
    console.error("Message create error:", error.message);
    res.status(500).json({
      error: "Failed to process message or AI service error",
      details: error.message,
    });
  }
}

export const getMessages = async (req, res) => {
  try {
    const { chatSessionId } = req.params;

    const messages = await Message.find({ chatSessionId })
      .sort({ createdAt: 1 })
      .lean(); 

    if (messages.length === 0) {
      return res.status(200).json({
        message: "No messages found for this session.",
        messages: []
      });
    }


    res.status(200).json(messages);

  } catch (error) {
    console.error("Error fetching messages (Mongoose):", error);
    res.status(500).json({ error: "Failed to fetch messages due to server error." });
  }
};