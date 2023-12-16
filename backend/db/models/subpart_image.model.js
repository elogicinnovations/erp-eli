const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const SubPart_image = sequelize.define('subPart_image', {
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
    subpart_image: {
        type: DataTypes.BLOB('long'),
        allowNull: false
    }
  });
  
  module.exports = SubPart_image;