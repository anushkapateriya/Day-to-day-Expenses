const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/auth");

const {
    showLeaderboard
} = require("../controllers/premiumController");

router.get("/premium/showleaderboard", authenticateUser, showLeaderboard);

module.exports = router;