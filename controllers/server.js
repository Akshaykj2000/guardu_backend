const express = require('express');
const router = express.Router();
const QrCode = require('../models/qrcode');
const QRCode = require('qrcode');

// Route to generate and store QR code using student's name
router.post('/qrcodes', async (req, res) => {
  try {
    const { studentId } = req.body; // Assuming you receive studentId in the request body
    const exitTime = new Date();
    
    // Generate QR code data using student's ID and exit time
    const qrData = JSON.stringify({ studentId, exitTime });

    // Generate QR code image from data
    const qrCodeImage = await QRCode.toDataURL(qrData);

    // Store QR code data in MongoDB
    const qrCode = new QrCode({
      studentId,
      exitTime,
      qrCodeData: qrData, // Updated field name to match the schema
      used: false
    });
    await qrCode.save();

    res.status(201).json({ message: 'QR code generated and stored successfully', qrCodeImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/qrdisplay', async (req, res) => {
    try {
      const { studentId } = req.query; // Retrieve studentId from query parameters
      
      // Find QR code data by student ID
      const qrCodeData = await QrCode.findOne({ studentId });
  
      if (!qrCodeData) {
        return res.status(404).json({ error: 'QR code not found for the given student ID' });
      }
  
      // Return the QR code image
      res.status(200).send(qrCodeData.qrCodeData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

  

module.exports = router;
