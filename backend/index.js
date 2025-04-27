// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'stores.json');

// Health-check
app.get('/', (req, res) => {
  res.send('API is up and running');
});

// List all stores
app.get('/stores', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const stores = JSON.parse(data);
    res.json(Array.isArray(stores) ? stores : []);
  } catch (err) {
    if (err.code === 'ENOENT') return res.json([]);
    console.error('Error reading stores.json:', err);
    res.status(500).json({ error: 'Could not read data file.' });
  }
});

// Create a new store (with generated id + email + timestamp)
app.post('/createStore', async (req, res) => {
  const { name, description, categories, password, email } = req.body;
  // simple validation
  if (!name || !description || !categories?.length || !password || !email) {
    return res.status(400).json({ error: 'Missing required field.' });
  }

  const newStore = {
    id: uuidv4(),
    name,
    description,
    categories,
    password,
    email,
    createdAt: new Date().toISOString(),
  };

  let stores = [];
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    stores = JSON.parse(data);
    if (!Array.isArray(stores)) stores = [];
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error reading stores.json:', err);
      return res.status(500).json({ error: 'Could not read data file.' });
    }
  }

  stores.push(newStore);

  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(stores, null, 2));
    res.status(201).json(newStore);
  } catch (err) {
    console.error('Error writing stores.json:', err);
    res.status(500).json({ error: 'Could not write data file.' });
  }
});

const PORT = 3020;
app.listen(PORT, () => {
  console.log(`⚡️ Backend running on http://localhost:${PORT}`);
});
