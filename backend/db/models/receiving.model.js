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
    totalReceived:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    freight_cost:{
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
    }
  });

  module.exports = Receiving;
