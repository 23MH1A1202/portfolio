import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Basic Auth Middleware for Admin APIs
const authenticate = (req, res, next) => {
  const authheader = req.headers.authorization;
  if (!authheader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Authentication required');
  }

  const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  if (user === (process.env.ADMIN_USERNAME || 'admin') && pass === (process.env.ADMIN_PASSWORD || 'password123')) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Authentication failed');
  }
};

app.get('/api/data', (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');
  if (fs.existsSync(dataPath)) {
    res.sendFile(dataPath);
  } else {
    res.json({ projects: [] });
  }
});

app.post('/api/data', authenticate, (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');
  fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

app.get('/admin-page', authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
