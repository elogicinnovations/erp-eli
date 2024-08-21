const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Receiving = sequelize.define("receiving_po", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pr_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  po_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalReceived: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  freight_cost: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  customFee: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  ref_code: {
    // system reference no.
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  receivedSite: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  initialReceive: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isComplete: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  masterlist_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date_approved: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  DR: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  SI: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Receiving;
