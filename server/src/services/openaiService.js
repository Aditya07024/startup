import OpenAI from "openai";
import { env } from "../config/env.js";

const AI_PROMPT_TEMPLATE = (
  topic,
) => `Create social media content for the topic "${topic}".
Return valid JSON only with keys hook, caption, hashtags.
hashtags must be an array of exactly 10 hashtags.`;

const isConfiguredKey = (apiKey) => {
  if (!apiKey) {
    return false;
  }

  const normalized = apiKey.trim().toLowerCase();
  return !normalized.startsWith("your_") && normalized !== "change_me";
};

const buildFallbackResponse = (
  topic,
  reason = "Configure GEMINI_API_KEY or OPENAI_API_KEY for real output.",
) => ({
  hook: `Stop scrolling: ${topic} starts here.`,
  caption: `Create stronger momentum around ${topic} with a simple, audience-first message. ${reason}`,
  hashtags: [
    "#viral",
    "#socialmedia",
    "#contentcreator",
    "#marketing",
    "#growth",
    "#branding",
    "#reels",
    "#instagramtips",
    "#creatorbusiness",
    "#engagement",
  ],
});

const openAiClient = isConfiguredKey(env.openAiApiKey)
  ? new OpenAI({ apiKey: env.openAiApiKey })
  : null;

const normalizeHashtags = (hashtags) => {
  if (Array.isArray(hashtags)) {
    return hashtags
      .map((item) => String(item).trim())
      .filter(Boolean)
      .map((item) => (item.startsWith("#") ? item : `#${item}`))
      .slice(0, 10);
  }

  if (typeof hashtags === "string") {
    return hashtags
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => item.replace(/^#+/, ""))
      .map((item) => `#${item}`)
      .slice(0, 10);
  }

  return [];
};

const normalizeAiPayload = (payload) => ({
  hook: typeof payload?.hook === "string" ? payload.hook.trim() : "",
  caption: typeof payload?.caption === "string" ? payload.caption.trim() : "",
  hashtags: normalizeHashtags(payload?.hashtags),
});

const extractField = (text, key) => {
  const patterns = {
    hook: /"hook"\s*:\s*"([\s\S]*?)"\s*,/i,
    caption: /"caption"\s*:\s*"([\s\S]*?)"\s*,/i,
    hashtags: /"hashtags"\s*:\s*\[([\s\S]*?)\]/i,
  };

  const match = text.match(patterns[key]);
  if (!match) {
    return key === "hashtags" ? [] : "";
  }

  if (key !== "hashtags") {
    return match[1].replace(/\\"/g, '"').replace(/\\n/g, " ").trim();
  }

  return match[1]
    .split(",")
    .map((item) => item.replace(/["'\n\r]/g, "").trim())
    .filter(Boolean);
};

const parseJsonFromText = (text) => {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  const jsonBlock = trimmed.match(/\{[\s\S]*\}/);
  const candidate = jsonBlock ? jsonBlock[0] : trimmed;

  try {
    return normalizeAiPayload(JSON.parse(candidate));
  } catch (_error) {
    const repaired = {
      hook: extractField(candidate, "hook"),
      caption: extractField(candidate, "caption"),
      hashtags: extractField(candidate, "hashtags"),
    };

    const normalized = normalizeAiPayload(repaired);
    if (normalized.hook || normalized.caption || normalized.hashtags.length) {
      return normalized;
    }

    throw new Error("Unable to parse AI response");
  }
};

const generateWithGemini = async (topic) => {
  if (!isConfiguredKey(env.geminiApiKey)) {
    return buildFallbackResponse(
      topic,
      "Configure GEMINI_API_KEY for real output.",
    );
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: AI_PROMPT_TEMPLATE(topic),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`Gemini request failed: ${response.status}`);
    error.status = response.status;
    error.details = errorText;
    throw error;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return parseJsonFromText(text);
};

const generateWithHuggingFace = async (topic) => {
  if (!isConfiguredKey(env.huggingFaceApiKey)) {
    return buildFallbackResponse(
      topic,
      "Configure HUGGINGFACE_API_KEY for real output.",
    );
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.huggingFaceApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.huggingFaceModel,
          messages: [
            {
              role: "system",
              content: "You return only valid JSON.",
            },
            {
              role: "user",
              content: AI_PROMPT_TEMPLATE(topic),
            },
          ],
          response_format: {
            type: "json_object",
          },
          max_tokens: 300,
          temperature: 0.8,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(
        `Hugging Face request failed: ${response.status}`,
      );
      error.status = response.status;
      error.details = errorText;
      throw error;
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Hugging Face returned an empty response");
    }

    return parseJsonFromText(text);
  } catch (error) {
    console.error("Hugging Face error:", error);
    throw error;
  }
};

const generateWithOpenAi = async (topic) => {
  if (!openAiClient) {
    return buildFallbackResponse(
      topic,
      "Configure OPENAI_API_KEY for real output.",
    );
  }

  try {
    const response = await openAiClient.responses.create({
      model: "gpt-4.1-mini",
      input: AI_PROMPT_TEMPLATE(topic),
    });

    return parseJsonFromText(response.output_text || "");
  } catch (error) {
    if (error?.status === 401 || error?.code === "invalid_api_key") {
      return buildFallbackResponse(
        topic,
        "The configured OpenAI key is invalid.",
      );
    }

    throw error;
  }
};

export const generateSocialContent = async (topic) => {
  try {
    if (env.aiProvider === "huggingface") {
      return await generateWithHuggingFace(topic);
    }

    if (env.aiProvider === "openai") {
      return await generateWithOpenAi(topic);
    }

    return await generateWithGemini(topic);
  } catch (error) {
    if ([400, 401, 403, 429].includes(error?.status)) {
      return buildFallbackResponse(
        topic,
        "The configured AI provider is unavailable or rate-limited.",
      );
    }

    throw error;
  }
};
