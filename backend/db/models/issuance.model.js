const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Issuance = sequelize.define('issuance', {
  issuance_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  from_site: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  }, 
  issued_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false
  },
  with_accountability: {
    type: DataTypes.STRING
  },
  accountability_refcode: {
    type: DataTypes.STRING
  },
  serial_number: {
    type: DataTypes.STRING
  },
  job_order_refcode: {
    type: DataTypes.STRING
  },
  received_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  transported_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mrs: {
    type: DataTypes.STRING
  },
  remarks: {
    type: DataTypes.STRING
  }

});

module.exports = Issuance;
