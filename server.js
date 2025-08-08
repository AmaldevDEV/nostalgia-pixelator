require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const multer = require('multer');
const { connectDB, Image } = require('./database');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

connectDB();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-pro-vision",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    }
  ]
});

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper function to convert data URI to base64 and MIME type
const dataUriToInlinePart = (dataUri) => {
  const parts = dataUri.split(';base64,');
  const mimeType = parts[0].split(':')[1];
  const data = parts[1];
  return {
    inlineData: {
      data,
      mimeType,
    },
  };
};

// API Endpoint to upload an image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, src, pixelationLevel } = req.body;
    const newImage = new Image({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      src,
      pixelationLevel,
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload image.', details: err.message });
  }
});

// API Endpoint for AI restoration
app.post('/api/restore', async (req, res) => {
  const { imageId } = req.body;
  
  if (!imageId) {
    return res.status(400).json({ error: 'Image ID is required.' });
  }
  
  try {
    const imageToRestore = await Image.findOne({ id: imageId });
    if (!imageToRestore) {
      return res.status(404).json({ error: 'Image not found.' });
    }
    
    // The "Bin" feature logic: if restored from bin, return a blank page
    if (imageToRestore.restoredFromBin) {
      return res.status(200).send('<body style="background-color:white;"></body>');
    }

    const prompt = `Restore this low-fidelity, pixelated image. Invent plausible, but not perfectly accurate, details to fill in the missing information. The result should look like a plausible, but slightly uncanny, high-resolution version of the original. Only return the restored image as a base64 encoded string.`;
    const imagePart = dataUriToInlinePart(imageToRestore.src);
    
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [
          { text: prompt },
          imagePart
        ]
      }]
    });

    const responseText = result.response.candidates[0].content.parts[0].text;
    
    // Update the image as "restored from bin" if applicable
    if (imageToRestore.inBin) {
      await Image.findOneAndUpdate({ id: imageId }, { restoredFromBin: true });
    }
    
    res.json({ restoredImage: responseText });
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to restore image with AI.', details: error.message });
  }
});

// API Endpoint to get all images
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find({});
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve images.' });
  }
});

// API Endpoint to move image to bin
app.put('/api/bin/:id', async (req, res) => {
  try {
    const updatedImage = await Image.findOneAndUpdate(
      { id: req.params.id },
      { inBin: true },
      { new: true }
    );
    if (!updatedImage) {
      return res.status(404).json({ error: 'Image not found.' });
    }
    res.json(updatedImage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to move image to bin.' });
  }
});

// API Endpoint to restore from bin
app.put('/api/restore-from-bin/:id', async (req, res) => {
  try {
    const updatedImage = await Image.findOneAndUpdate(
      { id: req.params.id },
      { inBin: false, restoredFromBin: true },
      { new: true }
    );
    if (!updatedImage) {
      return res.status(404).json({ error: 'Image not found.' });
    }
    res.json(updatedImage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to restore image from bin.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});