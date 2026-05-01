import { generateSocialContent } from "../services/openaiService.js";

export const generateAiContent = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const result = await generateSocialContent(topic);
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
