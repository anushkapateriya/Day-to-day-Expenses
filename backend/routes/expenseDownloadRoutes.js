const express = require("express");

const router = express.Router();

const { downloadExpenses,
        getDownloadHistory
    } = require("../controllers/expenseDownloadController");

const auth = require("../middleware/auth");

router.get("/download-expenses", auth, downloadExpenses);
router.get("/download-history", auth, getDownloadHistory);

module.exports = router;