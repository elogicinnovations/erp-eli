const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const StockTransfer_assembly = sequelize.define('stockTransfer_assembly', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  stockTransfer_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inventory_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  received: {
    type: DataTypes.INTEGER,
  }
});

module.exports = StockTransfer_assembly;
