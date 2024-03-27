const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Inventory_Spare = sequelize.define('inventory_spare', {
  inventory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  spare_tag_supp_id: { 
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

module.exports = Inventory_Spare;
