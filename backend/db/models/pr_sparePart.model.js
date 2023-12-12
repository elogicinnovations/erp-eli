const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const PR_spare= sequelize.define('purchase_req_spare', {
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
  spare_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = PR_spare;
