require("dotenv").config();

module.exports = {
    development: {
        username: "root",
        password: process.env.DB_PASSWORD,
        database: "day_to_day_expenses",
        host: "localhost",
        dialect: "mysql"
    }
};