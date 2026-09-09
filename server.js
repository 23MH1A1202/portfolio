import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API to list images available in assets folder
app.get('/api/assets', (req, res) => {
  const assetsDir = path.join(__dirname, 'assets');
  try {
    const files = fs.readdirSync(assetsDir);
    const images = files
      .filter(f => /\.(png|jpe?g|webp|svg|gif)$/i.test(f))
      .map(f => ({
        name: f.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        filename: f,
        path: `assets/${f}`
      }));
    res.json({ assets: images });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read assets directory' });
  }
});

// API to upload resume PDF
app.post('/api/upload-resume', (req, res) => {
  try {
    const filename = req.query.filename || (req.body && req.body.filename) || 'resume.pdf';

    if (req.is('application/octet-stream') || req.headers['content-type'] === 'application/octet-stream') {
      const targetPath = path.join(__dirname, 'assets', 'resume.pdf');
      const writeStream = fs.createWriteStream(targetPath);
      
      req.pipe(writeStream);
      
      writeStream.on('finish', () => {
        let size = 0;
        try { size = fs.statSync(targetPath).size; } catch(e) {}
        res.json({
          success: true,
          url: 'assets/resume.pdf',
          filename: filename,
          size: size,
          updatedAt: new Date().toISOString()
        });
      });

      writeStream.on('error', (err) => {
        console.error('Upload write error:', err);
        res.status(500).json({ error: 'Upload write failed' });
      });
      return;
    }

    const { base64, filename: bodyFilename } = req.body;
    if (!base64) {
      return res.status(400).json({ error: 'No resume data provided' });
    }
    const cleanBase64 = base64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const targetPath = path.join(__dirname, 'assets', 'resume.pdf');
    fs.writeFileSync(targetPath, buffer);
    res.json({ 
      success: true, 
      url: 'assets/resume.pdf',
      filename: bodyFilename || 'resume.pdf',
      size: buffer.length,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ error: 'Failed to save resume file' });
  }
});

// API to get current resume info
app.get('/api/resume-info', (req, res) => {
  const targetPath = path.join(__dirname, 'assets', 'resume.pdf');
  if (fs.existsSync(targetPath)) {
    const stats = fs.statSync(targetPath);
    res.json({
      exists: true,
      url: 'assets/resume.pdf',
      size: stats.size,
      updatedAt: stats.mtime.toISOString()
    });
  } else {
    res.json({ exists: false });
  }
});

app.use(express.static(path.join(__dirname, '')));

app.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
});
