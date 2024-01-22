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
  productsID: { // for consolidating of tagging items codes from assembly, spare, subpart
    type: DataTypes.STRING,
    allowNull: true,
  },
  product_name: {
    type: DataTypes.STRING, 
    allowNull: true,
    unique: false,
  },
  product_category: {
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
  product_manufacturer: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  product_status: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});



module.exports = Product;
