const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "day_to_day_expenses",
    "root",
    "Anshu@123",
    {
        host: "localhost",
        dialect: "mysql"
    }
);

module.exports = sequelize;

