const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Product_Subparts = sequelize.define('product_subpart', {
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
    subPart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});
module.exports = Product_Subparts;    