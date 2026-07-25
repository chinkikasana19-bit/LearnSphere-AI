import axios from "axios";

function extractJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

async function chat(messages, jsonMode = false) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing from server/.env");
  }

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages,
      temperature: 0.3,
      ...(jsonMode && { response_format: { type: "json_object" } })
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 60000
    }
  );

  return response.data.choices?.[0]?.message?.content || "";
}

export async function generateSummary(courseTitle, content, style = "exam-oriented") {
  const trimmedContent = content.slice(0, 30000);

  return chat([
    {
      role: "system",
      content:
        "You are an educational assistant. Summarize only the supplied course material. Do not invent facts. Use clear headings and bullet points."
    },
    {
      role: "user",
      content: `Course: ${courseTitle}
Summary style: ${style}

Course material:
${trimmedContent}`
    }
  ]);
}

export async function generateQuiz(courseTitle, content, difficulty, count) {
  const safeCount = Math.min(Math.max(Number(count) || 5, 3), 10);
  const trimmedContent = content.slice(0, 30000);

  const raw = await chat(
    [
      {
        role: "system",
        content: `Generate a quiz using only the supplied material.
Return valid JSON with this exact structure:
{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "explanation": "string"
    }
  ]
}
correctAnswer must be an integer from 0 to 3.`
      },
      {
        role: "user",
        content: `Course: ${courseTitle}
Difficulty: ${difficulty}
Number of questions: ${safeCount}

Course material:
${trimmedContent}`
      }
    ],
    true
  );

  return extractJson(raw);
}
