const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Supplier_SparePart = sequelize.define('sparepart_supplier', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  sparePart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  supplier_code: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Supplier_SparePart;
