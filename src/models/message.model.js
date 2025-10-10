import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true, 
    },
    sender: {
      type: String,
      enum: ["user", "bot", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    model: {
      type: String, 
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    rawResponse: {
      type: Object, 
      default: {},
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
