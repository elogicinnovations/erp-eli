const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Supplier_Assembly = sequelize.define('supplier_assembly', {
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
  }
});

module.exports = Supplier_Assembly;
