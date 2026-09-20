const Expense = require("../models/expense");
const User = require("../models/user");
const { categorizeExpense } = require("../services/aiService");

const addExpense = async (req, res) => {

    const { amount, description } = req.body;

    try {
        const category = await categorizeExpense(description);

        const expense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            UserId: req.userId
        });

        const user = await User.findByPk(req.userId);

        user.totalExpense = user.totalExpense + Number(amount);

        await user.save();

        res.status(201).json({
            message: "Expense added successfully",
            expense: expense
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

const getExpenses = async (req, res) => {

    try {

        const expenses = await Expense.findAll({
            where: {
                UserId: req.userId
            }
        });

        res.status(200).json({
            expenses: expenses
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

const deleteExpense = async (req, res) => {

    const id = req.params.id;

    try {

        const expense = await Expense.findOne({
            where:{
                id: id,
                UserId: req.userId
            }
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }
        const user = await User.findByPk(req.userId);

        user.totalExpense = user.totalExpense - Number(expense.amount);

        await user.save();

        await expense.destroy();

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense
};