const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const productTAGsupplier = sequelize.define('product_tag_supplier', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    product_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    supplier_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    product_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    }
});


module.exports = productTAGsupplier;