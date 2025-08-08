const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  src: { type: String, required: true },
  uploaded: { type: Date, default: Date.now },
  pixelationLevel: { type: Number, default: 0 },
  inBin: { type: Boolean, default: false },
  restoredFromBin: { type: Boolean, default: false }
});

const Image = mongoose.model('Image', ImageSchema);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = { connectDB, Image };