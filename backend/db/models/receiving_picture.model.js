const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Assembly_image = sequelize.define('receiving_picture', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    pr_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    po_num: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    image: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
        get() {
          const value = this.getDataValue('image')
          return value ? value.toString('base64') : null
        },
        set(value){
          this.setDataValue('image', Buffer.from(value, 'base64'));
        }
    }
  });

  module.exports = Assembly_image;
