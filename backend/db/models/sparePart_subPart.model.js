const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const SubPart_SparePart = sequelize.define('sparepart_subpart', {
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
  subPart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = SubPart_SparePart;
