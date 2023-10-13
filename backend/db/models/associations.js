const UserRole = require  ("./userRole.model");
const MasterList = require ("./masterlist.model");

MasterList.belongsTo(UserRole, { foreignKey: "col_role_name", as: 'userRole' });
UserRole.hasMany(MasterList, { foreignKey: "col_role_name", as: 'masterlists' });



module.exports = { MasterList, UserRole };