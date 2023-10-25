const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Category = sequelize.define('category', {
  category_code: {
    type: DataTypes.STRING,
    allowNull: true,
    primaryKey: true,
  },
  category_name: {
    type: DataTypes.STRING, // Change the column name to col_roleID
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
