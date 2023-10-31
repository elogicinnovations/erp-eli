const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Manufacturer = sequelize.define('manufacturer', {
    manufacturer_code: {
        type: DataTypes.STRING,
        allowNull: true,
        primaryKey: true,
    },
    manufacturer_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    manufacturer_remarks: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});


module.exports = Manufacturer;