const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Product = sequelize.define('product', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  product_code: {
    type: DataTypes.STRING,
    // type: DataTypes.INTEGER,
    allowNull: true,
  },
  product_name: {
    type: DataTypes.STRING, // Change the column name to col_roleID
    allowNull: true,
    unique: false,
  },
  product_category: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  product_unit: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  product_location: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  product_unitMeasurement: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  product_details: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  product_threshold: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  product_image: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  product_imageType: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  product_manufacturer: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  }
});



module.exports = Product;
