import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

export const breakTask = async (task: string) => {
  const models = ["gemini-1.5-flash", "gemini-flash-latest"];
  let lastError = "";

  for (const modelName of models) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Break down task "${task}" into JSON array: [{"title": "string", "estimated_minutes": number}]` }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const data: any = await response.json();

      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        let resultText = data.candidates[0].content.parts[0].text;
        resultText = resultText.replace(/```json|```/g, "").trim();
        return JSON.parse(resultText);
      }
      
      lastError = data.error?.message || "Unknown error";
      console.warn(`Model ${modelName} failed: ${lastError}`);
      
    } catch (error: any) {
      lastError = error.message;
      continue;
    }
  }

  throw new Error(`AI Quota Error: ${lastError}. Please ensure you created the API key in a BRAND NEW project.`);
};