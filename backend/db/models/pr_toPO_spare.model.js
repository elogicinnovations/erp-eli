const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const PR_PO_spare = sequelize.define('purchase_req_canvassed_spare', {
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
  po_id:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  spare_suppliers_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  days_from: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  days_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  quantity_received: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  quality_assurance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_approved: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = PR_PO_spare;