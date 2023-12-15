const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Assembly_SubPart = sequelize.define("assembly_subparts", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  assembly_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subPart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Assembly_SubPart;
