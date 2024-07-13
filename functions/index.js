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

        function fileToGenerativePart(path, mimeType) {
          return {
            inlineData: {
              data: Buffer.from(fs.readFileSync(path)).toString("base64"),
              mimeType
            },
          };
        }
        
        const filePart1 = fileToGenerativePart(tempFilePath, "image/jpeg")
        const imageParts = [filePart1];

        const prompt = `Instruction... (생략)`;

        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          safetySetting: [
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_UNSPECIFIED, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
          generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();
        
        fs.unlinkSync(tempFilePath);

        console.log(text)

        res.status(200).json(JSON.parse(text));
      } catch (error) {
        console.error("Error analyzing image:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    busboy.end(req.rawBody);
  });
});
