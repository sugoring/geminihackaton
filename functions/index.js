const { onRequest } = require("firebase-functions/v2/https");
const cors = require('cors')({ origin: true, credentials: true });
const { handleImageUpload } = require('./imageUpload');
const { generateHandsomeScore } = require('./generateHandsomeScore');

exports.analyzeImage = onRequest({ cors: true }, async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    try {
      const { imageBuffer, imageFileName } = await handleImageUpload(req);

      if (!imageBuffer) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const result = await generateHandsomeScore(imageBuffer, imageFileName);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});
