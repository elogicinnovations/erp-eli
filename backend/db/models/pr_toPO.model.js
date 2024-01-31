const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const PR_PO = sequelize.define('purchase_req_canvassed_prd', {
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
  product_tag_supplier_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity_received: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  quality_assurance: {
    type: DataTypes.STRING,
    allowNull: true,
  }
  
});

module.exports = PR_PO;
