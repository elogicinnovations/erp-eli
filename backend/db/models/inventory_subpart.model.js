const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Inventory_Subpart = sequelize.define('inventory_subpart', {
  inventory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  subpart_tag_supp_id: { 
    type: DataTypes.INTEGER,
    allowNull: true, 
    unique: false,
  }, 
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  }
});

module.exports = Inventory_Subpart;
