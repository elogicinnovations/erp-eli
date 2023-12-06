const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Product_Assembly = sequelize.define('product_assembly', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    assembly_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});
module.exports = Product_Assembly;    