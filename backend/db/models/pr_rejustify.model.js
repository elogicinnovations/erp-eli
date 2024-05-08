const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const PR_Rejustify = sequelize.define('purchase_req_rejustify', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pr_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  po_id:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  file: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
    // get() {
    //   const value = this.getDataValue('file')
    //   return value ? value.toString('base64') : null
    // },
    // set(value){
    //   this.setDataValue('file', Buffer.from(value, 'base64'));
    // }
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileExtension: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = PR_Rejustify;
