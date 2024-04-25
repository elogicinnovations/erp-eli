const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Category = sequelize.define('category', {
  category_code: {
    type: DataTypes.STRING,
    allowNull: true,
    primaryKey: true,
  },
  category_name: {
    type: DataTypes.STRING, 
    allowNull: true,
    unique: false,
  },
  category_remarks: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  }
});



module.exports = Category;
