const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Receiving_Subpart = sequelize.define('receiving_subpart', {
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
  set_quantity:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  check_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Receiving_Subpart;
