const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Assembly_Price_History = sequelize.define('assembly_price_history', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  assembly_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  supplier_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  supplier_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  }
});

module.exports = Assembly_Price_History;
