const ForgotPasswordRequest = require("../models/forgotPasswordRequest");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const {
    sendForgotPasswordEmail
} = require("../services/emailService");
const { logError } = require("../logger");

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

        const requestId = uuidv4();

        await ForgotPasswordRequest.create({
            id: requestId,
            userId: user.id,
            isActive: true
        });

        const resetUrl =
            `${process.env.BACKEND_URL}/password/resetpassword/${requestId}`;
        
        await sendForgotPasswordEmail(email, resetUrl);
        
        res.status(200).json({
            message: "Email sent successfully"
        });

    } catch (error) {

        logError(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

const resetPasswordPage = async (req, res) => {

    const request = await ForgotPasswordRequest.findOne({
        where: {
            id: req.params.id,
            isActive: true
        }
    });

    if (!request) {
        return res.status(400).send("Invalid or expired reset link");
    }

    res.send(`
        <h2>Reset Password</h2>

        <form method="POST"
              action="/password/resetpassword/${req.params.id}">

            <input
                type="password"
                name="password"
                placeholder="Enter new password"
                required
            />

            <button type="submit">
                Reset Password
            </button>

        </form>
    `);
};

const resetPassword= async (req,res)=>{
    const {password}=req.body;
    try {
        const request = await ForgotPasswordRequest.findOne({
            where: {
                id: req.params.id,
                isActive: true
            }
        });

        if (!request) {
            return res.status(400).send("Invalid or expired reset link");        
        }
        
        const user = await User.findByPk(request.userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        const bcrypt = require("bcrypt");

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.update({
            password:hashedPassword
        });

        await request.update({
            isActive:false
        });

        res.send("Password reset successful. You can now login with your new password.");


    } catch (error) {

        logError(error);
       
        res.status(500).send("Something went wrong");
        
    }
};


module.exports = {
    forgotPassword,
    resetPasswordPage,
    resetPassword
};

