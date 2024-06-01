// server.js
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors('https://v-transfer.vercel.app/'));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get('/', (req, res) => {
  res.send('V-Tech FileSend');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const email = req.body.email;

  if (!file || !email) {
    return res.status(400).json({ error: 'File and email are required.' });
  }

  try {
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

    await transporter.sendMail(mailOptions);

    // Delete the file after sending the email
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Failed to delete file:', err);
      }
    });

    res.status(200).json({ message: 'File uploaded and email sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
