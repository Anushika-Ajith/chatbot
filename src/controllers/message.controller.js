import { Message } from "../models/message.model.js";

/**
 * Create a new chat message
 */
export async function createMessage(req, res) {
  try {
    const { chatSessionId, sender, content, model, tokensUsed, rawResponse } = req.body;

    const message = await Message.create({
      chatSessionId,
      sender,
      content,
      model,
      tokensUsed,
      rawResponse,
    });

    res.status(201).json({ message: "Message saved", data: message });
  } catch (error) {
    console.error("Message create error:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
}

/**
 * Get messages for a chat session
 */
export async function getMessages(req, res) {
  try {
    const { chatSessionId } = req.params;

    const messages = await Message.find({ chatSessionId }).sort({ createdAt: 1 });

    res.json({ chatSessionId, messages });
  } catch (error) {
    console.error("Message fetch error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}
