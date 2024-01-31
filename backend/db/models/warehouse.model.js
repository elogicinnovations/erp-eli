const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Warehouses = sequelize.define('warehouse', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    warehouse_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    details: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  });
  
  module.exports = Warehouses;