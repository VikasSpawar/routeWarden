const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS Origin for Decoupled Deployment:
// Should be set to your Vercel URL in production (e.g., https://routewarden.vercel.app)
const allowedOrigin = process.env.CORS_ORIGIN || '*'; 

app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(express.json());

// --- 1. PROXY AGENT LOGIC (Your Core API) ---
app.post('/proxy', async (req, res) => {
    const { url, method, headers, body } = req.body;
    const startTime = process.hrtime();

    console.log(`🚀 Sending ${method} request to: ${url}`);

    try {
        const response = await axios({
            url,
            method,
            headers: headers || {},
            data: body,
            validateStatus: () => true, 
        });

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

// --- NEW: Simple Root Endpoint Check ---
// We add this to verify the server is running on Render, as the root 
// path is no longer handled by the client's index.html.
app.get('/', (req, res) => {
    res.json({ 
        status: 'RouteWarden Proxy Server is Running 🟢',
        origin: allowedOrigin
    });
});


// 🔥 REMOVED SECTIONS 2 & 3:
// Removed: const buildPath = path.join(__dirname, '../client/dist');
// Removed: app.use(express.static(buildPath));
// Removed: app.use((req, res) => { res.sendFile(path.join(buildPath, 'index.html')); });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});