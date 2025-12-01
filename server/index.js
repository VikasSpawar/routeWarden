const express = require('express');
const cors = require('cors');
const axios = require('axios');
// 💡 REQUIRED: Import the 'path' module
const path = require('path'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- PROXY AGENT LOGIC --- (Updated with timing logic)
app.post('/proxy', async (req, res) => {
  const { url, method, headers, body } = req.body;
  const startTime = process.hrtime(); // Start timing

  console.log(`🚀 Sending ${method} request to: ${url}`);

  try {
    const response = await axios({
      url,
      method,
      headers: headers || {},
      data: body,
      validateStatus: () => true, 
    });

    // Calculate actual request duration
    const endTime = process.hrtime(startTime);
    const durationInMs = (endTime[0] * 1000) + (endTime[1] / 1000000);

    res.json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      time: `${Math.round(durationInMs)} ms`, 
      size: JSON.stringify(response.data).length + " bytes"
    });

  } catch (error) {
    console.error("Proxy Error:", error.message);
    res.status(500).json({ 
      error: 'Error sending request', 
      details: error.message 
    });
  }
});


// --- NEW: SERVING REACT FRONTEND LOGIC ---
// Define the path to the built client files (client/dist)
const buildPath = path.join(__dirname, '../client/dist');

// Serve the static files (CSS, JS)
app.use(express.static(buildPath));

// Fallback: For all other GET requests, serve the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});