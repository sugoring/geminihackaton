const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const sharp = require('sharp'); // Import sharp for image processing
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
exports.analyzeImage = onRequest({ cors: true }, async (req, res) => {
  // 나머지 코드 여기에 추가
});
