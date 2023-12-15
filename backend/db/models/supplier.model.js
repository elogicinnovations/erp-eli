const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Supplier = sequelize.define("suppliers", {
  supplier_code: {
    type: DataTypes.STRING,
    unique: true,

    primaryKey: true,
  },
  supplier_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  supplier_tin: {
    type: DataTypes.BIGINT,
    allowNull: true,
    unique: false,
  },
  supplier_email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  supplier_address: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  supplier_city: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  supplier_postcode: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  supplier_contactPerson: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  supplier_number: {
    type: DataTypes.BIGINT,
    allowNull: true,
    unique: false,
  },
  supplier_Telnumber: {
    type: DataTypes.BIGINT,
    allowNull: true,
    unique: false,
  },
  supplier_terms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  supplier_vat: {
    type: DataTypes.FLOAT,
    allowNull: true,
    unique: false,
  },
  supplier_country: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  supplier_receiving: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  supplier_status: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
});

module.exports = Supplier;
