const express=require("express")
const QrCode=require("../models/qrcode")
const qr = require('qr-image');
const Student=require("../models/student")
const studentExitModel=require("../models/studentExitModel")
const  requestModel=require("../models/hodRequestModel")

const router=express.Router()


router.post('/createQrCode', async (req, res) => {
    try {
        const { studentName, studentId, admissionno, requestId } = req.body;

        // Generate QR code data from studentName and admissionNumber
        const qrCodeData = generateQRCode(studentName, admissionno);

        // Create a new QR code document
        const qrCode = new QrCode({
            studentName,
            studentId,
            qrCodeData,
            admissionno
        });

        // Save the QR code document to the database
        await qrCode.save();

        await requestModel.findByIdAndUpdate( requestId , { status: "accepted" });

       // res.status(201).json({ success: true, message: 'QR code created successfully' });
       res.json({status:"success"}) 

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create QR code' });
    }
});



// Function to generate QR code data
function generateQRCode(studentName, admissionno) {
    // Generate QR code data using qr-image module
    const qrData = {
        studentName,
        admissionno
    };
    return JSON.stringify(qrData);
}



router.post('/getQrCodeImage', async (req, res) => {
    try {
        const { studentId } = req.body;

        // Query the database to find the QR code document by studentID
        const qrCodeDocument = await QrCode.findOne({ studentId });
        console.log("student id is:"+studentId);
        console.log(qrCodeDocument);
        if (!qrCodeDocument) {
            return res.status(404).json({ success: false, message: 'QR code not found' });
        }

        // Generate QR code image from the QR code data stored in the document
        const qrImage = qr.image(qrCodeDocument.qrCodeData, { type: 'png' });

        // Set content-type header to indicate image/png
        res.set('Content-Type', 'image/png');

        // Send the QR code image as the response
        qrImage.pipe(res);
        console.log("Success");
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to get QR code image' });
    }
});


  
 
router.post('/validateQRCode', async (req, res) => {
    const { studentName, admissionNumber } = req.body;
  
    try {
      // Find the corresponding QrCode record using studentName and admissionNumber
      const qrCodeRecord = await QrCode.findOne({ studentName, admissionno: admissionNumber });
  
      if (!qrCodeRecord) {
        return res.status(404).json({ valid: false, message: 'QR code data is not valid' });
      }
  
      // Retrieve studentId from the QrCode record
      const studentId = qrCodeRecord.studentId;
  
      // Find the corresponding student details using studentId
      const studentDetails = await Student.findById(studentId);
  
      if (!studentDetails) {
        return res.status(404).json({ valid: false, message: 'Student details not found' });
      }
  
      // Return the details of the student
      console.log(studentDetails);
      res.status(200).json(studentDetails);
    } catch (error) {
      console.error('Error validating QR code:', error);
      res.status(500).json({ valid: false, message: 'Internal server error' });
    }
  });



// POST endpoint to store student details in studentLog table and delete corresponding record from QrCode table
router.post('/storeStudentDetails', async (req, res) => {
  try {
    let data= req.body;
    const currentDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true });
    const exitTime = `${currentDate} ${currentTime}`;
    data.exitTime = exitTime;
    const studentId =data.studentId

    // Store student details in studentLog table

    let package = new studentExitModel(data);
    let result = await package.save();

    // Delete corresponding record from QrCode table
    const deletedMember = await QrCode.findOneAndDelete({ studentId });
    if (!deletedMember) {
        console.log("Deletion unsuccessful");
    }
    res.status(200).json({ status:"success" });
  } catch (error) {
    console.error('Error storing student details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports=router;


