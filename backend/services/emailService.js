const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

const sendForgotPasswordEmail = async (email) => {

    const response = await brevo.transactionalEmails.sendTransacEmail({
        sender: {
            name: "Expense Tracker",
            email: process.env.BREVO_SENDER_EMAIL
        },

        to: [
            {
                email: email
            }
        ],

        subject: "Forgot Password",

        textContent:
            "This is a dummy email from your Expense Tracker. You requested a password reset."
    });

    return response;
};

module.exports = {
    sendForgotPasswordEmail
};

