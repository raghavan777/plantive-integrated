const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const Farmer = require('../models/Farmer');
const Plot = require('../models/Plot');
const Submission = require('../models/Submission');
const AIResult = require('../models/AIResult');

class ReportService {
    constructor() {
        this.reportsDir = path.join(process.cwd(), 'reports');
        this.ensureDirectory();
    }

    ensureDirectory() {
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    /**
     * Generate farmers summary report
     */
    async generateFarmersReport(filters = {}, format = 'pdf') {
        const query = { status: 'active' };
        if (filters.regions?.length) query['location.region'] = { $in: filters.regions };

        const farmers = await Farmer.find(query)
            .populate('plots', 'area cropType healthStatus')
            .lean();

        const data = {
            summary: {
                totalFarmers: farmers.length,
                totalPlots: farmers.reduce((sum, f) => sum + (f.plots?.length || 0), 0),
                totalArea: farmers.reduce((sum, f) => sum + (f.totalArea || 0), 0),
                regions: [...new Set(farmers.map(f => f.location?.region).filter(Boolean))]
            },
            farmers: farmers.map(f => ({
                id: f._id,
                name: f.name,
                location: f.location,
                contact: f.contact,
                plotCount: f.plots?.length || 0,
                totalArea: f.totalArea,
                createdAt: f.createdAt
            }))
        };

        if (format === 'pdf') {
            return this.generatePDF('Farmers Summary Report', data);
        } else if (format === 'excel') {
            return this.generateExcel('Farmers', data);
        }

        return data;
    }

    /**
     * Generate plots health report
     */
    async generatePlotsReport(filters = {}, format = 'pdf') {
        const query = {};
        if (filters.cropTypes?.length) query.cropType = { $in: filters.cropTypes };
        if (filters.healthStatus?.length) query.healthStatus = { $in: filters.healthStatus };

        const plots = await Plot.find(query)
            .populate('farmer', 'name contact')
            .lean();

        const healthDistribution = plots.reduce((acc, plot) => {
            acc[plot.healthStatus] = (acc[plot.healthStatus] || 0) + 1;
            return acc;
        }, {});

        const data = {
            summary: {
                totalPlots: plots.length,
                totalArea: plots.reduce((sum, p) => sum + (p.area?.value || 0), 0),
                healthDistribution,
                cropTypes: [...new Set(plots.map(p => p.cropType))]
            },
            plots: plots.map(p => ({
                id: p._id,
                plotId: p.plotId,
                name: p.name,
                farmer: p.farmer,
                cropType: p.cropType,
                healthStatus: p.healthStatus,
                healthScore: p.healthScore,
                area: p.area,
                riskLevel: p.riskLevel
            }))
        };

        if (format === 'pdf') {
            return this.generatePDF('Plots Health Report', data);
        } else if (format === 'excel') {
            return this.generateExcel('Plots', data);
        }

        return data;
    }

    /**
     * Generate damage assessment report
     */
    async generateDamageReport(dateRange = {}, format = 'pdf') {
        const query = {
            submissionType: 'damage_report',
            status: 'verified'
        };

        if (dateRange.start || dateRange.end) {
            query.createdAt = {};
            if (dateRange.start) query.createdAt.$gte = new Date(dateRange.start);
            if (dateRange.end) query.createdAt.$lte = new Date(dateRange.end);
        }

        const submissions = await Submission.find(query)
            .populate('farmer', 'name location')
            .populate('plot', 'cropType area')
            .lean();

        const severityDistribution = submissions.reduce((acc, sub) => {
            const severity = sub.data?.damagePercentage > 50 ? 'severe' :
                sub.data?.damagePercentage > 25 ? 'moderate' : 'mild';
            acc[severity] = (acc[severity] || 0) + 1;
            return acc;
        }, {});

        const totalDamage = submissions.reduce((sum, sub) =>
            sum + ((sub.data?.damagePercentage || 0) * (sub.plot?.area?.value || 0) / 100), 0);

        const data = {
            summary: {
                totalIncidents: submissions.length,
                severityDistribution,
                estimatedAreaAffected: totalDamage,
                totalCompensationEstimate: totalDamage * 1000 // Example calculation
            },
            incidents: submissions.map(s => ({
                id: s._id,
                submissionId: s.submissionId,
                farmer: s.farmer,
                plot: s.plot,
                damagePercentage: s.data?.damagePercentage,
                description: s.description,
                verifiedAt: s.verification?.verifiedAt,
                images: s.images?.length || 0
            }))
        };

        if (format === 'pdf') {
            return this.generatePDF('Damage Assessment Report', data);
        } else if (format === 'excel') {
            return this.generateExcel('Damage Assessment', data);
        }

        return data;
    }

    /**
     * Generate PDF report
     */
    async generatePDF(title, data) {
        const filename = `report-${Date.now()}.pdf`;
        const filepath = path.join(this.reportsDir, filename);

        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header
        doc.fontSize(25).text('Plantive Agricultural Dashboard', 50, 50);
        doc.fontSize(20).text(title, 50, 100);
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, 50, 140);

        // Summary
        doc.fontSize(16).text('Summary', 50, 180);
        doc.fontSize(12);
        let y = 210;

        Object.entries(data.summary).forEach(([key, value]) => {
            if (typeof value === 'object') {
                doc.text(`${key}:`, 70, y);
                y += 20;
                Object.entries(value).forEach(([k, v]) => {
                    doc.text(`  ${k}: ${v}`, 90, y);
                    y += 20;
                });
            } else {
                doc.text(`${key}: ${value}`, 70, y);
                y += 20;
            }
        });

        // Details
        if (data.farmers || data.plots || data.incidents) {
            y += 20;
            doc.addPage();
            doc.fontSize(16).text('Detailed Data', 50, 50);
            doc.fontSize(10);

            const items = data.farmers || data.plots || data.incidents;
            let detailY = 80;

            items.slice(0, 50).forEach((item, index) => { // Limit to 50 items for PDF
                if (detailY > 700) {
                    doc.addPage();
                    detailY = 50;
                }
                doc.text(`${index + 1}. ${JSON.stringify(item).substring(0, 200)}...`, 50, detailY);
                detailY += 40;
            });
        }

        doc.end();

        return new Promise((resolve, reject) => {
            stream.on('finish', () => {
                resolve({
                    filename,
                    path: filepath,
                    url: `/reports/${filename}`,
                    size: fs.statSync(filepath).size
                });
            });
            stream.on('error', reject);
        });
    }

    /**
     * Generate Excel report
     */
    async generateExcel(sheetName, data) {
        const filename = `report-${Date.now()}.xlsx`;
        const filepath = path.join(this.reportsDir, filename);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        // Add summary
        worksheet.addRow(['Summary']);
        Object.entries(data.summary).forEach(([key, value]) => {
            if (typeof value !== 'object') {
                worksheet.addRow([key, value]);
            }
        });

        worksheet.addRow([]);

        // Add details
        const items = data.farmers || data.plots || data.incidents;
        if (items && items.length > 0) {
            const headers = Object.keys(items[0]);
            worksheet.addRow(headers);

            items.forEach(item => {
                worksheet.addRow(headers.map(h => {
                    const val = item[h];
                    return typeof val === 'object' ? JSON.stringify(val) : val;
                }));
            });
        }

        await workbook.xlsx.writeFile(filepath);

        return {
            filename,
            path: filepath,
            url: `/reports/${filename}`,
            size: fs.statSync(filepath).size
        };
    }

    /**
     * Cleanup old reports
     */
    async cleanupOldReports(maxAgeHours = 24) {
        const files = fs.readdirSync(this.reportsDir);
        const now = Date.now();
        const maxAge = maxAgeHours * 60 * 60 * 1000;

        for (const file of files) {
            const filepath = path.join(this.reportsDir, file);
            const stats = fs.statSync(filepath);

            if (now - stats.mtime.getTime() > maxAge) {
                fs.unlinkSync(filepath);
                logger.info(`Deleted old report: ${file}`);
            }
        }
    }
}

module.exports = new ReportService();