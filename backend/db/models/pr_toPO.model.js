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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  }
});

module.exports = PR_PO;
