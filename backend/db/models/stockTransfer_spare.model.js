const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const StockTransfer_spare = sequelize.define('stockTransfer_spare', {
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
  }
});

module.exports = StockTransfer_spare;
