const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const PR_history = sequelize.define('purchase_req_PO', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pr_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = PR_history;
