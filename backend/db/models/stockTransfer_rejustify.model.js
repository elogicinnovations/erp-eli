const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Stock_Rejustify = sequelize.define('stock_transfer_rejustify', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  stockTransfer_id:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  masterlist_id:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  file: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileExtension: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Stock_Rejustify;
