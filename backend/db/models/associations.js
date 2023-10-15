const UserRole = require  ("./userRole.model");
const MasterList = require ("./masterlist.model");

MasterList.belongsTo(UserRole, { foreignKey: "col_role_name"});
UserRole.hasMany(MasterList, { foreignKey: "col_role_name"});



module.exports = { MasterList, UserRole };