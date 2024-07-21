const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const sanitize = require('sanitize-filename');
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

archiver.registerFormat('zip-encryptable', require('archiver-zip-encryptable'));

app.get('/', (req, res) => {
  res.send('V-Tech FileSend');
});

app.post('/upload', upload.array('files', 10), async (req, res) => {
  const files = req.files;
  const emails = JSON.parse(req.body.emails);
  const password = req.body.password;

  if (!files || !emails || !Array.isArray(emails) || emails.length === 0 || !password) {
    return res.status(400).json({ error: 'Files, emails, and password are required.' });
  }

  try {
    const zipPath = path.join(__dirname, 'uploads', 'files.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver.create('zip-encryptable', {
      zlib: { level: 9 },
      encryptionMethod: 'aes256',
      password: password,
    });

    output.on('close', async () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log('Archiver has been finalized and the output file descriptor has closed.');

      for (const email of emails) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your uploaded files',
          text: 'Here are your files in a password-protected zip archive.',
          attachments: [
            {
              filename: `${Date.now()}_files.zip`,
              path: zipPath,
            },
          ],
        };

        await transporter.sendMail(mailOptions);
      }

      // Delete the zip file
      fs.unlink(zipPath, (err) => {
        if (err) {
          console.error('Failed to delete zip file:', err);
        }
      });

      // Delete the individual uploaded files
      files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Failed to delete file:', err);
          }
        });
      });

      res.status(200).json({ message: 'Files sent successfully.' });
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn(err);
      } else {
        throw err;
      }
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    for (const file of files) {
      const sanitizedFileName = sanitize(file.originalname);
      archive.file(file.path, { name: sanitizedFileName });
    }

    archive.finalize();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing files.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
