
const User = require("../models/user");
const { logError } = require("../logger");


const showLeaderboard = async (req, res) => {

    try {

        const user = await User.findByPk(req.userId);

        if (!user || !user.isPremium) {
            return res.status(403).json({
                message: "Only premium users can access the leaderboard"
            });
        }

        const leaderboard = await User.findAll({
            attributes: ["name", "totalExpense"],
            order: [["totalExpense", "DESC"]]
        });

        res.status(200).json({
            leaderboard: leaderboard
        });

    } catch (error) {

        logError(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    showLeaderboard
};