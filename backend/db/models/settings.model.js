const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Settings = sequelize.define('setting', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  steet: {
    type: DataTypes.STRING,
  },
  barangay: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  zipcode: {
    type: DataTypes.STRING,
  }
});



module.exports = Settings;
