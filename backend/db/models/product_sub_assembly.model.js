const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Product_Sub_Assembly = sequelize.define('product_sub_assembly', {
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
    tag_product_sub_assembly: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});
module.exports = Product_Sub_Assembly;    