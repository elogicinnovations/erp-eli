const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Board = sequelize.define("board_reply", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  board_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reply_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  message: {
    type: DataTypes.STRING(10000),
    allowNull: false,
  },
});

module.exports = Board;
