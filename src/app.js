require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const Analysis = require('./models/Analysis'); // استدعاء الموديل
const fileParser = require('./utils/fileParser');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Setup Multer
const upload = multer({ storage: multer.memoryStorage() });

// Database Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coaching_db';
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Routes ---

// 1. Route التحليل (الأساسي)

// Route تجريبي
app.get('/', (req, res) => res.send('AI Coaching API is running...'));

// Route مؤقت للتجربة
app.post('/test-upload', upload.single('file'), async (req, res) => {
    try {
        const fileParser = require('./utils/fileParser');
        const text = await fileParser.extractTextFromWord(req.file.buffer);

        // هيرجع لك النص اللي الـ AI هيشوفه
        res.status(200).send({
            fileName: req.file.originalname,
            extractedContent: text
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/analyze', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "File is missing" });

        const fileParser = require('./utils/fileParser');
        const text = await fileParser.extractTextFromWord(req.file.buffer);

        // حفظ مبدئي في الداتا بيز
        const newRecord = new Analysis({
            fileName: req.file.originalname,
            rawExtractedText: text,
            status: 'pending'
        });

        const savedRecord = await newRecord.save();

        res.status(200).json({
            success: true,
            message: "Data saved to DB. Ready for AI Analysis.",
            recordId: savedRecord._id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Route لزميلك (يجيب كل البيانات المحفوظة)
app.get('/api/history', async (req, res) => {
    try {
        const history = await Analysis.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => res.send('AI Coaching API is running...'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));