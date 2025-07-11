// index.js - Simple Express backend for coin list

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Enable CORS so your React frontend can access this API
app.use(cors());

// API endpoint to get all coins list from CoinGecko
app.get('/api/coins', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    res.json(response.data);  // send coin list JSON to frontend
  } catch (error) {
    console.error('Error fetching coins:', error.message);
    res.status(500).json({ error: 'Failed to fetch coin list' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
