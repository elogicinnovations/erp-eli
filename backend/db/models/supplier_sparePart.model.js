const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Supplier_SparePart = sequelize.define('supplier_sparePart', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  sparePart_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Supplier_SparePart;
