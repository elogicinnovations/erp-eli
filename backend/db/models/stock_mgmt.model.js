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
    type: DataTypes.STRING,
  },
  destination: {
    type: DataTypes.STRING,
  },
  reference_code: {
    type: DataTypes.STRING,
  },
  col_id: {
    type: DataTypes.INTEGER,
  },
  remarks: {
    type: DataTypes.STRING,
  }
});



module.exports = StockTransfer;
