const express = require("express");

const router = express.Router();

const {
    forgotPassword
} = require("../controllers/passwordController");

router.post("/password/forgotpassword", forgotPassword);

module.exports = router;