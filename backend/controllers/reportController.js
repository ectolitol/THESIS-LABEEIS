// server/controllers/reportController.js
const { dailyReport } = require('../utils/reportGenerator');

const generateDailyReport = async (req, res) => {
    try {
        const report = await dailyReport();
        return res.status(200).json(report);
    } catch (error) {
        return res.status(500).json({ error: 'Error generating daily report', details: error.message });
    }
};

module.exports = {
    generateDailyReport,
};




// const { dailyReport, weeklyReport, monthlyReport, annualReport, generateCsvReport, generatePdfReport } = require('../utils/reportGenerator');

// exports.generateDailyReport = async (req, res) => {
//     try {
//         const report = await dailyReport();
//         console.log('Report:', report); // Log the generated report to see what it returns
//         // await generateCsvReport(report, 'dailyReport.csv');
//         // await generatePdfReport(report, 'dailyReport.pdf');
//         res.send(report); // Send the raw report data for now
//     } catch (error) {
//         console.error('Error generating daily report:', error); // Log the error details
//         res.status(500).send('Error generating daily report');
//     }
// };

// exports.generateWeeklyReport = async (req, res) => {
//     try {
//         const report = await weeklyReport();
//         await generateCsvReport(report, 'weeklyReport.csv');
//         await generatePdfReport(report, 'weeklyReport.pdf');
//         res.download('weeklyReport.pdf'); // Provide download link for the PDF
//     } catch (error) {
//         res.status(500).send('Error generating weekly report');
//     }
// };

// exports.generateMonthlyReport = async (req, res) => {
//     try {
//         const report = await monthlyReport();
//         await generateCsvReport(report, 'monthlyReport.csv');
//         await generatePdfReport(report, 'monthlyReport.pdf');
//         res.download('monthlyReport.pdf'); // Provide download link for the PDF
//     } catch (error) {
//         res.status(500).send('Error generating monthly report');
//     }
// };

// exports.generateAnnualReport = async (req, res) => {
//     try {
//         const report = await annualReport();
//         await generateCsvReport(report, 'annualReport.csv');
//         await generatePdfReport(report, 'annualReport.pdf');
//         res.download('annualReport.pdf'); // Provide download link for the PDF
//     } catch (error) {
//         res.status(500).send('Error generating annual report');
//     }
// };
