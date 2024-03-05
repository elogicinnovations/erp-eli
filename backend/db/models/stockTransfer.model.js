const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const StockTransfer = sequelize.define('stock_transfer', {
  stock_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  source: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  destination: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reference_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  col_id: {
    type: DataTypes.INTEGER,
  },
  remarks: {
    type: DataTypes.STRING,
  },
  status:{
    type: DataTypes.STRING,
    
  }
});



module.exports = StockTransfer;
