const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Board = sequelize.define("board", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  message: {
    type: DataTypes.STRING(10000),
    allowNull: false,
  },
});

module.exports = Board;
