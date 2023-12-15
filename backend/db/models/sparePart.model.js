const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const SpareParts = sequelize.define("spareParts", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  spareParts_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  spareParts_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  spareParts_desc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = SpareParts;
