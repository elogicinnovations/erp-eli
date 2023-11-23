const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const IssuedReturn = sequelize.define('issued_return', {
  issued_return_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    unique: false,
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

module.exports = IssuedReturn;
