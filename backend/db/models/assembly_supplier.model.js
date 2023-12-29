const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Supplier_Assembly = sequelize.define('assembly_supplier', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  assembly_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  supplier_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  supplier_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  }
});

module.exports = Supplier_Assembly;
