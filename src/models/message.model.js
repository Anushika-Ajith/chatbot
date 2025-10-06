import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatSessionId: {
      type: String,
      required: true, // corresponds to Prisma ChatSession.id (UUID)
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
      type: String, // optional: store which LLM model was used
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    rawResponse: {
      type: Object, // store LLM metadata, if any
      default: {},
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export const Message = mongoose.model("Message", messageSchema);
