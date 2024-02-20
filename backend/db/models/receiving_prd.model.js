const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Receiving_Prd = sequelize.define('receiving_prd', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  canvassed_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  received_quantity:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  remaining_quantity:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  set_quantity:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  freight_cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  ref_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.BLOB('long'),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Receiving_Prd;
