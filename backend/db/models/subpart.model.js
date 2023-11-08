const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const SubPart = sequelize.define('subPart', {
  subPart_code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  subPart_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subPart_desc: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = SubPart;
