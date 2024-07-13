const Busboy = require('busboy');
const sharp = require('sharp');
const os = require('os');
const path = require('path');
const fs = require('fs');

exports.handleImageUpload = (req) => {
  return new Promise((resolve, reject) => {
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
      try {
        if (!imageBuffer) {
          return reject(new Error("No image file uploaded"));
        }

        const processedImageBuffer = await sharp(imageBuffer)
          .resize(512, 512)
          .jpeg()
          .toBuffer();

        resolve({ imageBuffer: processedImageBuffer, imageFileName });
      } catch (error) {
        reject(error);
      }
    });

    busboy.end(req.rawBody);
  });
};
