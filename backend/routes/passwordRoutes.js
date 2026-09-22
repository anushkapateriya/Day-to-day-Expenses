const express = require("express");

const router = express.Router();

const {
    forgotPassword,
    resetPasswordPage,
    resetPassword
} = require("../controllers/passwordController");

router.post("/password/forgotpassword", forgotPassword);

router.get("/password/resetpassword/:id", resetPasswordPage);

router.post("/password/resetpassword/:id", resetPassword);

module.exports = router;