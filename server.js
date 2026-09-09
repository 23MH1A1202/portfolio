import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use(express.static(path.join(__dirname, '')));

app.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
});
