const User = require("../models/user");
const Expense = require("../models/expense");
const DownloadHistory = require("../models/downloadHistory");
const { uploadFile } = require("../services/s3Service");
const { logError } = require("../logger");

const downloadExpenses = async (req, res) => {

    try {

        // Check logged-in user
        const user = await User.findByPk(req.userId);

        // Check premium membership
        if (!user || !user.isPremium) {

            return res.status(401).json({
                message: "Unauthorized. Premium membership required."
            });

        }

        // Get all expenses of this user
        const expenses = await Expense.findAll({
            where: {
                UserId: req.userId
            },
            order: [
                ["createdAt", "DESC"]
            ]
        });

        // Create CSV file content
        let csv = "Date,Amount,Description,Category\n";

        expenses.forEach((expense) => {

            csv += `"${expense.createdAt}","${expense.amount}","${expense.description}","${expense.category}"\n`;

        });

        // Create unique file name
        const fileName = `reports/user-${req.userId}-${Date.now()}.csv`;

        // Upload file to S3
        const fileUrl = await uploadFile(fileName, csv);

        await DownloadHistory.create({
            userId: req.userId,
            fileUrl: fileUrl
        });

        // Send S3 URL to frontend
        res.status(200).json({
            message: "Report generated successfully",
            fileUrl: fileUrl
        });

    } catch (error) {

        logError(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }
};

const getDownloadHistory = async (req, res) => {

    try {

        const history = await DownloadHistory.findAll({
            where: {
                userId: req.userId
            },
            order: [
                ["downloadDate", "DESC"]
            ]
        });

        res.status(200).json(history);

    } catch (error) {

        logError(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }
};

module.exports = {
    downloadExpenses,
    getDownloadHistory
};