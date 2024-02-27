const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const PR = sequelize.define('purchase_req', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pr_num:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_needed: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  used_for: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  masterlist_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = PR;
