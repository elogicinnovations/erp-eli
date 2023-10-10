const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const UserRole = sequelize.define('userRole', {
  col_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  col_roleID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  col_rolename: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  col_desc: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  col_authorization: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  }
});

module.exports = UserRole;
