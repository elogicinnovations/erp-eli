const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Supplier_SparePart = sequelize.define('subPart_sparePart', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  sparePart_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subPart_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Supplier_SparePart;
