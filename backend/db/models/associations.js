const UserRole = require("./userRole.model");
const MasterList = require("./masterlist.model");
const Product = require("./product.model");
const Category = require("./category.model");
const BinLocation = require("./binLocation.model");
const Manufacturer = require("./manufacturer.model");

MasterList.belongsTo(UserRole, { foreignKey: "col_roleID"});
// UserRole.hasMany(MasterList, { foreignKey: "col_roleID"});

Category.hasMany(Product, { foreignKey: "product_category"});
Product.belongsTo(Category, { foreignKey: "product_category"});

BinLocation.hasMany(Product, { foreignKey: "product_location"});
Product.belongsTo(BinLocation, { foreignKey: "product_location"});

Manufacturer.hasMany(Product, { foreignKey: "product_manufacturer"});
Product.belongsTo(Manufacturer, { foreignKey: "product_manufacturer"});

module.exports = { 
                    MasterList, 
                    UserRole,  
                    Product, 
                    Category, 
                    BinLocation, 
                    Manufacturer
                };