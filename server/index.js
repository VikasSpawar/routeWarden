const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin = process.env.CORS_ORIGIN || '*'; 

app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(express.json());

// --- 1. PROXY AGENT LOGIC ---
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
      validateStatus: () => true, // Allow 404/500 responses to pass through
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


// --- 2. SERVING REACT FRONTEND LOGIC ---
// Define the path to the built client files (client/dist)
const buildPath = path.join(__dirname, '../client/dist');

// Serve the static files (CSS, JS, Images)
app.use(express.static(buildPath));

// --- 3. FALLBACK ROUTE (Express v5 Compatible Fix) ---
// We use app.use() here because app.get('*') causes a crash in Express v5.
// This catches any request that isn't the /proxy endpoint or a static file
// and sends back index.html so React Router can handle the URL.
app.use((req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});