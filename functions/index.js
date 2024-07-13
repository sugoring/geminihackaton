const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

exports.sayHello = onRequest(
    { cors: true },
    async (req, res) => {
      exports.sayHello = onRequest(
          { cors: true },
          async (req, res) => {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = "Write a story about a magic backpack.";

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();
            res.status(200).send(text);
          },
      );
    },
);
