const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const SparePart_image = sequelize.define('sparePart_image', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    sparepart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sparepart_image: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
        get() {
          const value = this.getDataValue('sparepart_image')
          return value ? value.toString('base64') : null
        },
        set(value){
          this.setDataValue('sparepart_image', Buffer.from(value, 'base64'));
        }
    }
  });

  module.exports = SparePart_image;
