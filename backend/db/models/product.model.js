const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Product = sequelize.define('product', {
  product_code: {
    type: DataTypes.STRING,
    allowNull: true,
    primaryKey: true,
  },
  product_name: {
    type: DataTypes.STRING, // Change the column name to col_roleID
    allowNull: true,
    unique: false,
  },
  product_location: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  product_category: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  }
});



module.exports = Product;
