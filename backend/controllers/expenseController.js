const Expense = require("../models/expense");
const User = require("../models/user");
const { categorizeExpense } = require("../services/aiService");

const addExpense = async (req, res) => {

    const { amount, description } = req.body;

    const transaction = await User.sequelize.transaction();

    try {
        const category = await categorizeExpense(description);

        const expense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            UserId: req.userId
        },{
            transaction: transaction
        });

        const user = await User.findByPk(req.userId, {
            transaction: transaction
        });

        user.totalExpense = user.totalExpense + Number(amount);

        await user.save({
            transaction: transaction
        });

        await transaction.commit();

        res.status(201).json({
            message: "Expense added successfully",
            expense: expense
        });

    } catch (error) {

        await transaction.rollback();

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

    const transaction = await User.sequelize.transaction();

    try {

        const expense = await Expense.findOne({
            where:{
                id: id,
                UserId: req.userId
            },
            transaction: transaction
        });

        if (!expense) {

            await transaction.rollback();

            return res.status(404).json({
                message: "Expense not found"
            });
        }
        const user = await User.findByPk(req.userId,{
            transaction: transaction
        });

        user.totalExpense = user.totalExpense - Number(expense.amount);

        await user.save({
            transaction:transaction
        });

        await expense.destroy({
            transaction: transaction
        });

        await transaction.commit();

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {

        await transaction.rollback();

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