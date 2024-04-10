const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Inventory_Assembly = sequelize.define('inventory_assembly', {
  inventory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  assembly_tag_supp_id: { 
    type: DataTypes.INTEGER,
    allowNull: true, 

  }, 
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,

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
  }
});

module.exports = Inventory_Assembly;
