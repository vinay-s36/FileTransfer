const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
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

app.get('/', (req, res) => {
  res.send('V-Tech FileSend');
});

app.post('/upload', upload.array('files', 10), async (req, res) => {
  const files = req.files;
  const emails = req.body.emails;
  const emails1 = JSON.parse(emails);

  if (!files || !emails1 || !Array.isArray(emails1) || emails1.length === 0) {
    return res.status(400).json({ error: 'Files and emails are required.' });
  }

  try {
    const attachments = files.map(file => ({
      filename: file.originalname,
      path: file.path,
    }));

    // Send emails to all addresses in the `emails` array
    for (const email of emails1) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your uploaded files',
        text: 'Here are your files.',
        attachments: attachments,
      };

      await transporter.sendMail(mailOptions);
    }

    // Delete the files after sending the emails
    files.forEach(file => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('Failed to delete file:', err);
        }
      });
    });

    res.status(200).json({ message: 'Files sent successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error sending email.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
