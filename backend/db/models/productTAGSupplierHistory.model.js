const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const productTAGsupplierHistory = sequelize.define('product_tag_supplier_history', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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


module.exports = productTAGsupplierHistory;