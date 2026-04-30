//app.js
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// // 
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://localhost:80'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// }));


// 
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:3001'];

// app.use(cors({
//     origin: allowedOrigins,
//     credentials: true
// }));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      console.log(`✅ CORS allowed for origin: ${origin}`);
    } else {
      callback(new Error('Not allowed by CORS'));
      console.warn(`⚠️ CORS blocked for origin: ${origin}`);
    }
  },
  credentials: true
}));

app.use(express.json());

// 
app.use('/api/tasks', taskRoutes);

module.exports = app;