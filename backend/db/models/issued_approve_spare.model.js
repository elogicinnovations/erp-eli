const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const IssuedApproveSpare= sequelize.define('issued_approve_spare', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  inventory_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  issuance_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

});

module.exports = IssuedApproveSpare;