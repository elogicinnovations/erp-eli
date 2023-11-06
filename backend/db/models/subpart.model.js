const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const SubPart = sequelize.define('subPart', {
  subPart_code: {
    type: DataTypes.STRING,
    allowNull: true,
    primaryKey: true,
  },
  subPart_name: { 
    type: DataTypes.STRING, // Change the column name to col_roleID
    allowNull: true,
    unique: false,
  },
  supplier: {
    type: DataTypes.STRING, // Change the column name to col_roleID
    allowNull: true,
    unique: false,
  },
  subPart_desc: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  }
});



module.exports = SubPart;
