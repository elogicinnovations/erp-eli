const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Sparepart_price_history = sequelize.define('sparepart_price_history', {
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
  },
  supplier_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
});

module.exports = Sparepart_price_history;
