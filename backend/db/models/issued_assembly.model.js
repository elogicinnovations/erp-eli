const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const IssuedAssembly = sequelize.define('issued_assembly', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  inventory_Assembly_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  issuance_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.STRING
  }

});

module.exports = IssuedAssembly;