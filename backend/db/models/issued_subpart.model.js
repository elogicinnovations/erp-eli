const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const IssuedSubpart = sequelize.define('issued_subpart', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  inventory_Subpart_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  issuance_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.STRING
  }

});

module.exports = IssuedSubpart;