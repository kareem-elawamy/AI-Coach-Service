// src/services/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// التحقق من وجود مفتاح الـ API
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeStudentData = async (rawText) => {
  try {
    // نستخدم موديل gemini-pro لأنه الأنسب للنصوص
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
        You are an expert sports nutritionist and data analyst.
        Analyze the following text extracted from a player's data sheet (in Arabic).
        Extract key information and format it into a STRICT JSON object.

        Text to analyze:
        "${rawText}"

        Output Schema (JSON keys must be exactly as below):
        {
            "personal_summary": "String (Summary of name, age, education level, and family status)",
            "medical_history": ["String", "String"], (List of past injuries, surgeries, chronic diseases, or specific health issues. If none, return empty array)",
            "nutritional_habits": ["String", "String"], (List of eating habits, protein intake, fast food usage, sugar consumption)",
            "environmental_factors": ["String", "String"], (List of living conditions, pollution exposure, passive smoking)",
            "psychological_plan": ["String", "String"], (List of current psychological handling methods mentioned in the text)",
            "recommended_activities": ["String", "String"] (Generate 3-4 initial recommendations based on the analysis, e.g., 'Reduce fast food', 'Increase water intake')
        }

        IMPORTANT INSTRUCTIONS:
        1. Return ONLY valid JSON.
        2. Do not include markdown formatting (like \`\`\`json).
        3. Translate the extracted values to Arabic language suitable for the user.
        4. If a field is missing in the text, make a reasonable inference or leave it empty/generic.
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResponse = response.text();

    // تنظيف الرد: إزالة علامات الكود التي قد يضيفها Gemini أحيانًا
    textResponse = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // تحويل النص إلى كائن JavaScript (JSON Object)
    const jsonResponse = JSON.parse(textResponse);

    return jsonResponse;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error(
      "حدث خطأ أثناء تحليل البيانات بواسطة الذكاء الاصطناعي: " + error.message,
    );
  }
};
