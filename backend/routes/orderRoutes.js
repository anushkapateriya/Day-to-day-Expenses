const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/auth");

const { createOrder, verifyPayment } = require("../controllers/orderController");

router.post("/create-order", authenticateUser, createOrder);
router.get("/verify-payment", authenticateUser, verifyPayment);

module.exports = router;