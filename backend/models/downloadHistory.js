const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DownloadHistory = sequelize.define("DownloadHistory", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    fileUrl: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    downloadDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

});

module.exports = DownloadHistory;