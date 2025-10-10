import { Message } from "../models/message.model.js";

export async function saveMessageToMongo({ sessionId, sender, content,metadata = {} }) {
  console.log("sent session id: ",sessionId)
  try {
    const message = new Message({ sessionId, sender, content, metadata });
    console.log("Message: ",message)
    await message.save();
    return message;
  } catch (error) {
    console.error("Error saving message:", error);
  }
}

export async function getMessagesBySession(sessionId) {
  return Message.find({ sessionId }).sort({ createdAt: 1 }).lean();
}

export async function deleteMessagesBySession(sessionId) {
  return Message.deleteMany({ sessionId });
}
