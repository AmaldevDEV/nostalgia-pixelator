require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const { connectDB, Image } = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

connectDB();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
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

app.post('/api/upload', async (req, res) => {
  try {
    const { name, src, pixelationLevel } = req.body;
    if (!src) {
      return res.status(400).json({ error: 'Image data is missing.' });
    }
    const newImage = new Image({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      src,
      pixelationLevel,
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Failed to upload image.', details: err.message });
  }
});

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
    
    if (imageToRestore.restoredFromBin) {
      return res.status(200).json({ blankCanvas: true });
    }

    const prompt = `Restore this low-fidelity, pixelated image. Return only the restored base64-encoded image data and nothing else. Do not add any text, descriptions, or explanations.`;
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
    
    if (!responseText) {
      return res.status(500).json({ error: 'Failed to restore image with AI.', details: 'Invalid AI response.' });
    }
    
    if (imageToRestore.inBin) {
      await Image.findOneAndUpdate({ id: imageId }, { restoredFromBin: true });
    }
    
    res.json({ restoredImage: responseText });
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to restore image with AI.', details: error.message });
  }
});

app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find({});
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve images.' });
  }
});

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