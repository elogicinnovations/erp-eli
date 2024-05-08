const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');
const Product = require('./product.model'); // Import Product model

const Product_Assm = sequelize.define('product_as_semblies', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tag_product_assm: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});
module.exports = Product_Assm;    