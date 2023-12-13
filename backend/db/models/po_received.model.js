const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const POReceived = sequelize.define('po_received', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pr_po_id:{
    type: DataTypes.INTEGER,
  },
  pr_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  quantity_received: {
    type: DataTypes.INTEGER,
  },
  quality_assurance: {
    type: DataTypes.STRING,
  }

});
module.exports = POReceived;
