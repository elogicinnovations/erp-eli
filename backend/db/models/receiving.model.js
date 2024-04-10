const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Receiving = sequelize.define('receiving_po', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    pr_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    po_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalReceived:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    freight_cost:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    customFee:{
      type: DataTypes.FLOAT,
      allowNull: true,
  },
    ref_code:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    initialReceive:{ //if the receiving site was in davao just for checking the quantity if complete or not
      type: DataTypes.STRING,
      allowNull: true,
  },
  date_approved: {
    type: DataTypes.DATE,
    allowNull: true
  }
  });

  module.exports = Receiving;
