import { generateSocialContent } from "../services/openaiService.js";

const VALID_CONTENT_TYPES = ["creative", "descriptive", "professional", "funny", "inspirational"];

export const generateAiContent = async (req, res) => {
  try {
    const { topic, contentType = "creative" } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    if (!VALID_CONTENT_TYPES.includes(contentType)) {
      return res.status(400).json({ 
        message: `Invalid content type. Must be one of: ${VALID_CONTENT_TYPES.join(", ")}` 
      });
    }

    const result = await generateSocialContent(topic, contentType);
    return res.json(result);
  } catch (error) {
    console.error("AI generation failed:", error.message);
    if (error.details) {
      console.error("Error details:", error.details);
    }
    console.error("Full error:", error);
    return res.status(502).json({
      message: "AI generation failed: " + error.message,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
