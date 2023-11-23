const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Inventory = sequelize.define('inventory', {
  inventory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  product_tag_supp_id: { //id from product_tag_suppliers
    type: DataTypes.INTEGER,
    allowNull: true, 
    unique: false,
  }, 
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false
  }
});

module.exports = Inventory;