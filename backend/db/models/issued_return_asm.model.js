const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const IssuedReturn_asm = sequelize.define('return_asm', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  issued_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inventory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.STRING
  },
  remarks: {
    type: DataTypes.STRING
  },
  return_by: {
    type: DataTypes.INTEGER
  } 
});

module.exports = IssuedReturn_asm;
