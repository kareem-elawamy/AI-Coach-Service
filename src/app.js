// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');

// استدعاء الكونترولر (تأكد أنك أنشأت الملف في الخطوات السابقة)
const analysisController = require('./controllers/analysisController');
const Analysis = require('./models/Analysis'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// إعداد Multer (لرفع الملفات في الذاكرة)
const upload = multer({ storage: multer.memoryStorage() });

// Database Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coaching_db';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        console.log('💡 Hint: Make sure MongoDB is installed and running on your machine!');
    });

// --- Routes ---

// 1. الترحيب
app.get('/', (req, res) => res.send('AI Coaching API is running... 🚀'));

// 2. مسار التحليل الرئيسي (يستخدم الـ Controller والـ AI)
// هذا هو الرابط الذي سنستخدمه في Postman
app.post('/api/analyze', upload.single('file'), analysisController.analyzeFile);

// 3. مسار لعرض كل التحليلات السابقة (للداشبورد)
app.get('/api/history', async (req, res) => {
    try {
        const history = await Analysis.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));