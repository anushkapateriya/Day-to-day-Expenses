const express = require("express");

const router = express.Router();

const { addExpense, 
        getExpenses,
        deleteExpense } = require("../controllers/expenseController");

router.post("/expenses", addExpense);
router.get("/expenses", getExpenses);
router.delete("/expenses/:id", deleteExpense);

module.exports = router;