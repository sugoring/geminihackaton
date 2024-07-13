const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const sharp = require('sharp');
const os = require('os');
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
const cors = require('cors')({ origin: true, credentials: true });
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

exports.analyzeImage = onRequest({ cors: true }, async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const busboy = Busboy({ headers: req.headers });
    let imageBuffer;
    let imageFileName;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      if (fieldname !== 'image') {
        file.resume();
        return;
      }

      const chunks = [];
      file.on('data', (chunk) => chunks.push(chunk));
      file.on('end', () => {
        imageBuffer = Buffer.concat(chunks);
        imageFileName = filename;
      });
    });

    busboy.on('finish', async () => {
      if (!imageBuffer) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      try {
        const processedImageBuffer = await sharp(imageBuffer)
          .resize(512, 512)
          .jpeg()
          .toBuffer();
        
        const tempFilePath = path.join(os.tmpdir(), `image_${Date.now()}.jpg`);
        fs.writeFileSync(tempFilePath, processedImageBuffer);

        // 나머지 코드 여기에 추가
      } catch (error) {
        console.error("Error analyzing image:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    busboy.end(req.rawBody);
  });
});
