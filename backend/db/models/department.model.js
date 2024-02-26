const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Department = sequelize.define('department', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    department_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  });
  
  module.exports = Department;