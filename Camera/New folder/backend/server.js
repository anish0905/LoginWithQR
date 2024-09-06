const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const path = require('path');

// Initialize Express
const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload limit
app.use(cors()); // Enable CORS for all origins

// Connect to MongoDB
mongoose.connect('mongodb+srv://endf80641:FkNO2uXlZmxDDxmA@cluster0.efq9s.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose schema and model
const ImageSchema = new mongoose.Schema({
  image: {
    type: String, // Will store image data as base64 string
    required: true,
  },
});

const ImageModel = mongoose.model('Image', ImageSchema);

// Route to handle image upload
app.post('/upload', async (req, res) => {
  try {
    const { image } = req.body; // Expect base64 string
    if (!image) {
      return res.status(400).send('Image is required');
    }

    // Save image in MongoDB
    const newImage = new ImageModel({ image });
    await newImage.save();

    res.status(200).json({ message: 'Image uploaded successfully', data: newImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving image' });
  }
});

// Route to fetch all images (optional)
app.get('/images', async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.status(200).json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching images' });
  }
});

// Serve the uploads folder (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
