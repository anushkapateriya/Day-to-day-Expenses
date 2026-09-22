const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

const sendForgotPasswordEmail= async (email, resetUrl) => {
    
    const response= await brevo.transactionalEmails.sendTransacEmail({
        sender:{
            name: "Expense Tracker",
            email: process.env.BREVO_SENDER_EMAIL
        },

        to:[
            {
                email:email
            }
        ],
        subject:"Forgot Password",

        textContent:
        `Click this link to reset your password:\n\n${resetUrl}`
    });
    
    return response;
}

module.exports = {
    sendForgotPasswordEmail
};

