// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());           // <-- allow all origins
app.use(express.json());   // <-- parse JSON bodies

const DATA_FILE = path.join(__dirname, 'stores.json');

// simple health-check endpoint
app.get('/', (req, res) => {
  res.send('API is up and running');
});

app.post('/createStore', async (req, res) => {
  const newStore = req.body;
  let stores = [];

  try {
    // read existing stores.json (if any)
    const data = await fs.readFile(DATA_FILE, 'utf8');
    stores = JSON.parse(data);
    if (!Array.isArray(stores)) stores = [];
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error reading stores.json:', err);
      return res.status(500).json({ error: 'Could not read data file.' });
    }
    // ENOENT means file didn't exist — we'll create it below
  }

  stores.push(newStore);

  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(stores, null, 2));
    res.status(201).json({ message: 'Store created.' });
  } catch (err) {
    console.error('Error writing stores.json:', err);
    res.status(500).json({ error: 'Could not write data file.' });
  }
});

const PORT = 3020;
app.listen(PORT, () => {
  console.log(`⚡️ Backend running on http://localhost:${PORT}`);
});
