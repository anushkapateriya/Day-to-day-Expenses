const User = require("../models/user");
const {
    sendForgotPasswordEmail
} = require("../services/emailService");

const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await sendForgotPasswordEmail(email);

        res.status(200).json({
            message: "Email sent successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    forgotPassword
};

