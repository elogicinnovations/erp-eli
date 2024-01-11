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
  bin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assembly_unitMeasurement: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  assembly_manufacturer: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  assembly_image: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  assembly_imageType: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  assembly_desc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  threshhold: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  category_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assembly_status: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Assembly;
