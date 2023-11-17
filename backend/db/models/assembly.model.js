const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Assembly = sequelize.define('assembly', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  assembly_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assembly_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  assembly_desc: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Assembly;
