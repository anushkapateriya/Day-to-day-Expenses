const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/auth");

const { addExpense, 
        getExpenses,
        deleteExpense } = require("../controllers/expenseController");

router.post("/expenses", authenticateUser, addExpense);
router.get("/expenses", authenticateUser, getExpenses);
router.delete("/expenses/:id", authenticateUser, deleteExpense);

module.exports = router;