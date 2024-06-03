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
  set_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false
  },
  static_quantity: { // for dashboard count
    type: DataTypes.INTEGER,
    allowNull: true,

  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true,

  },
  freight_cost: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  custom_cost: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  reference_number: {
    type: DataTypes.STRING,
    allowNull: true,
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
  }
});

module.exports = Inventory;
