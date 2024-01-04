const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Product_image = sequelize.define('product_image', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_image: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
        get() {
          const value = this.getDataValue('product_image')
          return value ? value.toString('base64') : null
        },
        set(value){
          this.setDataValue('product_image', Buffer.from(value, 'base64'));
        }
    }
  });

  module.exports = Product_image;
