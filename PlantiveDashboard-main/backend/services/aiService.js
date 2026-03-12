const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const logger = require('../utils/logger');
const AIResult = require('../models/AIResult');
const Image = require('../models/Image');

class AIService {
    constructor() {
        this.apiUrl = process.env.AI_API_URL;
        this.apiKey = process.env.AI_API_KEY;
        this.mockMode = !this.apiUrl || this.apiUrl.includes('localhost:5001');
    }

    /**
     * Analyze image for crop health, diseases, or pests
     * @param {String} imageId - MongoDB Image ID
     * @param {String} analysisType - Type of analysis
     */
    async analyzeImage(imageId, analysisType = 'general_assessment') {
        try {
            const image = await Image.findById(imageId);
            if (!image) {
                throw new Error('Image not found');
            }

            // Update status to processing
            image.analysisStatus = 'processing';
            await image.save();

            let result;

            if (this.mockMode) {
                // Mock analysis for development
                result = await this.mockAnalysis(image, analysisType);
            } else {
                // Real AI API call
                result = await this.callExternalAI(image, analysisType);
            }

            // Save AI result
            const aiResult = await AIResult.create({
                image: imageId,
                analysisType,
                ...result
            });

            // Update image with result
            image.analysisStatus = 'completed';
            image.aiResult = aiResult._id;
            await image.save();

            return aiResult;

        } catch (error) {
            logger.error('AI Analysis error:', error);

            // Update image status to failed
            await Image.findByIdAndUpdate(imageId, {
                analysisStatus: 'failed',
                'metadata.error': error.message
            });

            throw error;
        }
    }

    /**
     * Mock AI analysis for development/testing
     */
    async mockAnalysis(image, analysisType) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        const diseases = [
            { label: 'Leaf Blight', confidence: 0.89, severity: 'medium' },
            { label: 'Powdery Mildew', confidence: 0.76, severity: 'low' },
            { label: 'Healthy', confidence: 0.95, severity: 'none' },
            { label: 'Nitrogen Deficiency', confidence: 0.82, severity: 'medium' }
        ];

        const pests = [
            { label: 'Aphids', confidence: 0.91, severity: 'high' },
            { label: 'Spider Mites', confidence: 0.67, severity: 'low' },
            { label: 'No Pests Detected', confidence: 0.98, severity: 'none' }
        ];

        let results = [];
        let overallHealth = { score: 85, status: 'good' };

        if (analysisType === 'disease_detection') {
            results = [diseases[Math.floor(Math.random() * diseases.length)]];
        } else if (analysisType === 'pest_detection') {
            results = [pests[Math.floor(Math.random() * pests.length)]];
        } else {
            results = [
                diseases[Math.floor(Math.random() * diseases.length)],
                pests[Math.floor(Math.random() * pests.length)]
            ];
        }

        // Adjust health based on detection
        const hasIssues = results.some(r => r.severity !== 'none');
        if (hasIssues) {
            overallHealth = {
                score: Math.floor(Math.random() * 40) + 40,
                status: 'fair'
            };
        }

        return {
            results: results.map(r => ({
                ...r,
                description: `Detected ${r.label} with ${(r.confidence * 100).toFixed(1)}% confidence`,
                treatment: r.severity !== 'none' ? 'Apply appropriate fungicide/pesticide' : 'No treatment needed',
                prevention: 'Maintain proper irrigation and monitor regularly'
            })),
            overallHealth,
            recommendations: results.filter(r => r.severity !== 'none').map(r => ({
                type: 'treatment',
                priority: r.severity === 'high' ? 'urgent' : r.severity,
                action: `Treat ${r.label}`,
                timeframe: r.severity === 'high' ? 'Within 24 hours' : 'Within 3 days'
            })),
            processingTime: 1500,
            modelVersion: 'plantive-v1.0-mock'
        };
    }

    /**
     * Call external AI service
     */
    async callExternalAI(image, analysisType) {
        const form = new FormData();
        form.append('image', fs.createReadStream(image.path));
        form.append('type', analysisType);

        const response = await axios.post(this.apiUrl, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${this.apiKey}`
            },
            timeout: 30000
        });

        return response.data;
    }

    /**
     * Batch analyze multiple images
     */
    async batchAnalyze(imageIds, analysisType) {
        const results = [];
        const errors = [];

        for (const imageId of imageIds) {
            try {
                const result = await this.analyzeImage(imageId, analysisType);
                results.push({ imageId, success: true, result });
            } catch (error) {
                errors.push({ imageId, success: false, error: error.message });
            }
        }

        return { results, errors, total: imageIds.length };
    }

    /**
     * Get analysis statistics
     */
    async getStatistics(dateRange = {}) {
        const matchStage = {};
        if (dateRange.start || dateRange.end) {
            matchStage.createdAt = {};
            if (dateRange.start) matchStage.createdAt.$gte = new Date(dateRange.start);
            if (dateRange.end) matchStage.createdAt.$lte = new Date(dateRange.end);
        }

        const stats = await AIResult.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$analysisType',
                    count: { $sum: 1 },
                    avgConfidence: { $avg: '$results.confidence' },
                    avgProcessingTime: { $avg: '$processingTime' }
                }
            }
        ]);

        const healthDistribution = await AIResult.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$overallHealth.status',
                    count: { $sum: 1 }
                }
            }
        ]);

        return {
            byType: stats,
            healthDistribution,
            totalAnalyses: stats.reduce((sum, s) => sum + s.count, 0)
        };
    }
}

module.exports = new AIService();