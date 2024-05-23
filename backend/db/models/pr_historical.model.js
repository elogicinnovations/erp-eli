const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const PR_history = sequelize.define('purchase_req_history', {
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
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_approved: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // masterlist_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = PR_history;
