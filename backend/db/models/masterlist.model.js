const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const MasterList = sequelize.define('masterlist', {
  col_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  col_role_name: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  col_Fname: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  col_email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  col_Pass: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  col_status: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  }
});

module.exports = MasterList;
