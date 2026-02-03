const Analysis = require('../models/Analysis'); // استدعاء الموديل
const aiService = require('../services/aiService');
const fileParser = require('../utils/fileParser');

exports.analyzeFile = async (req, res) => {
    try {
        // 1. استخراج النص
        const text = await fileParser.extractTextFromWord(req.file.buffer);

        // 2. تحليل الـ AI
        const aiAnalysis = await aiService.analyzeStudentData(text);

        // 3. حفظ في MongoDB
        const newAnalysis = new Analysis({
            fileName: req.file.originalname,
            originalText: text,
            aiResult: aiAnalysis
        });

        const savedData = await newAnalysis.save();

        // 4. الرد على العميل
        res.status(200).json({
            success: true,
            id: savedData._id, // هتحتاج الـ ID ده عشان الـ Next.js يعرض الصفحة لاحقاً
            data: savedData.aiResult
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};