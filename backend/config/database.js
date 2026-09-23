const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "day_to_day_expenses",
    "root",
    process.env.DB_PASSWORD,
    {
        host: "localhost",
        dialect: "mysql"
    }
);

module.exports = sequelize;

