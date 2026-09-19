const { Cashfree } = require("cashfree-pg");

const cashfree = new Cashfree(
    "SANDBOX",
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
);

module.exports = cashfree;