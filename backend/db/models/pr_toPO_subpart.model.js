const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const PR_PO_subpart = sequelize.define('purchase_req_canvassed_subpart', {
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
  subpart_suppliers_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = PR_PO_subpart;