const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const BinLocation = sequelize.define('binLocation', {
  bin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  bin_name: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  bin_subname: {
    type: DataTypes.STRING, 
    allowNull: true,
    unique: false,
  },
  bin_remarks: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  }
});



module.exports = BinLocation;
