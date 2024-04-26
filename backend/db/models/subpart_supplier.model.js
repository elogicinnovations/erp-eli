const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Subpart_supplier = sequelize.define('subpart_supplier', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  subpart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  supplier_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  supplier_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Subpart_supplier;
