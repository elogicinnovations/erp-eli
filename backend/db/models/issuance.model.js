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
    type: DataTypes.INTEGER,
    allowNull: true,
  }, 
  issued_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false
  },
  with_accountability: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accountability_refcode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serial_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  job_order_refcode: {
    type: DataTypes.STRING,
    allowNull: true,
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_approved: {
    type: DataTypes.DATE,
    allowNull: true
  },
  issued_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },


});

module.exports = Issuance;
