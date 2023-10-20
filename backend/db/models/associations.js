const UserRole = require("./userRole.model");
const MasterList = require("./masterlist.model");

UserRole.belongsTo(MasterList, { foreignKey: "col_role_name" }); // Change the foreignKey to col_roleID
MasterList.hasMany(UserRole, { foreignKey: "col_role_name" }); // Change the foreignKey to col_roleID

module.exports = { MasterList, UserRole };
