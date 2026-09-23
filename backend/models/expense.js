const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Expense = sequelize.define("Expense", {
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false
    },

    note: {
        type: DataTypes.STRING,
        allowNull: true
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Expense;