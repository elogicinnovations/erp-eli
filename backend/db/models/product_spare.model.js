const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Product_Spareparts = sequelize.define('product_sparepart', {
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
    sparePart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});
module.exports = Product_Spareparts;    