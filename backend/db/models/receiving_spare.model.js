const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Receiving_Spare = sequelize.define('receiving_spare', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  canvassed_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  remaining_quantity:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  received_quantity:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  set_quantity:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  freight_cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  ref_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.BLOB("long"),
    allowNull: true,
    get() {
      const value = this.getDataValue("product_image");
      return value ? value.toString("base64") : null;
    },
    set(value) {
      this.setDataValue("product_image", Buffer.from(value, "base64"));
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Receiving_Spare;
