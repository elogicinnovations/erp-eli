const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Assembly_image = sequelize.define('assembly_image', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    assembly_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assembly_image: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
        get() {
          const value = this.getDataValue('assembly_image')
          return value ? value.toString('base64') : null
        },
        set(value){
          this.setDataValue('assembly_image', Buffer.from(value, 'base64'));
        }
    }
  });

  module.exports = Assembly_image;
