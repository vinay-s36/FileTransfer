// server.js
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
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
        path: file.path
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.log('Error deleting file:', err);
      }
    });

    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).send('Error sending email: ' + error.message);
    }
    res.status(200).send('File uploaded and email sent.');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
