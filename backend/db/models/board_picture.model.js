const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Board_Image = sequelize.define('board_picture', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    board_id: {
      type: DataTypes.INTEGER,
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

  module.exports = Board_Image;
