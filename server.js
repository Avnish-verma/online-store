const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Database Connectivity Routine
connectDB();

// Global Middlewares Pipeline
app.use(cors({
  origin: [
        'http://localhost:3000', // Keep this so you can still test locally
        'http://172.28.40.104:3000', // Keep this if you use this specific local IP
        'https://online-store-frontend-tau.vercel.app' // ADD YOUR VERCEL URL HERE
    ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Expose Static Upload Assets Routing Vector
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Core Routing Bindings
app.use('/api', apiRoutes);

// Fallback Route Handling Matrix
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: "Requested path not located" } });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Execution Server Running via Port: ${PORT}`);
});
