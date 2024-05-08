const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Product_Spare_Parts = sequelize.define('product_spare_parts', {
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
    tag_product_spare_parts: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});
module.exports = Product_Spare_Parts;    