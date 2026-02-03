const { GoogleGenerativeAI } = require("@google/generative-ai");

// ضع المفتاح الجديد هنا بين علامتي التنصيص
const apiKey = "";

async function testDirect() {
  console.log("... تجربة المفتاح الجديد ...");
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent("Test connection");
    console.log("✅ نجاح! المفتاح يعمل.");
    console.log(result.response.text());
  } catch (error) {
    console.error("❌ الخطأ:", error.message);
  }
}

testDirect();

// to run  file using => (node test-key.js)
