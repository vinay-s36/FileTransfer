// server.js
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get('/',(req,res)=>{
  res.send('V-Tech FileSend')
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const email = req.body.email;

  if (!file || !email) {
    return res.status(400).send('File and email are required.');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your uploaded file',
    text: 'Here is your file.',
    attachments: [
      {
        filename: file.originalname,
        path: file.path,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    await fs.unlink(file.path);
    console.log('File uploaded and email sent.');
    res.status(200).json('File uploaded and email sent.');
  } catch (error) {
    console.error('Error sending email or deleting file:', error);
    res.status(500).json('Error sending email or deleting file: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
