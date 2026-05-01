import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || "change_me",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  aiProvider: process.env.AI_PROVIDER || "gemini",
  openAiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  huggingFaceApiKey: process.env.HUGGINGFACE_API_KEY,
  huggingFaceModel:
    process.env.HUGGINGFACE_MODEL || "mistralai/Mistral-7B-Instruct-v0.3",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
};
