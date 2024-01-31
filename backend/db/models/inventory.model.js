const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Inventory = sequelize.define('inventory_prd', {
  inventory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  product_tag_supp_id: {
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
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Inventory;
