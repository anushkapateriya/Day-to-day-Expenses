const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "PENDING"
    }
});

module.exports = Order;