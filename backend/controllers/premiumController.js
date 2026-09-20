const Expense = require("../models/expense");
const User = require("../models/user");
const { Sequelize } = require("sequelize");

const showLeaderboard = async (req, res) => {

    try {

        const user = await User.findByPk(req.userId);

        if (!user || !user.isPremium) {
            return res.status(403).json({
                message: "Only premium users can access the leaderboard"
            });
        }

        const leaderboard = await Expense.findAll({
            attributes: [
                "UserId",
                [Sequelize.fn("SUM", Sequelize.col("amount")), "totalExpense"]
            ],

            include: [
                {
                    model: User,
                    attributes: ["name"]
                }
            ],

            group: ["UserId", "User.id", "User.name"],

            order: [
                [Sequelize.fn("SUM", Sequelize.col("amount")), "DESC"]
            ]
        });

        res.status(200).json({
            leaderboard: leaderboard
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    showLeaderboard
};