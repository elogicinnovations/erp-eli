const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Spare_Assembly = sequelize.define('spare_assembly', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  assembly_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sparePart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Spare_Assembly;
