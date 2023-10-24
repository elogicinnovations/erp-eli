const UserRole = require("./userRole.model");
const MasterList = require("./masterlist.model");

MasterList.belongsTo(UserRole, { foreignKey: "col_roleID"});
// UserRole.hasMany(MasterList, { foreignKey: "col_roleID"});

module.exports = { MasterList, UserRole };