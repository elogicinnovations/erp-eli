const UserRole = require("./userRole.model");
const MasterList = require("./masterlist.model");
const Product = require("./product.model");
const Category = require("./category.model");
const BinLocation = require("./binLocation.model");
const Manufacturer = require("./manufacturer.model");
const Supplier = require("./supplier.model");
const ProductTAGSupplier = require("./productTAGsupplier.model");

MasterList.hasMany(UserRole, { foreignKey: "col_roleID"});
// UserRole.hasMany(MasterList, { foreignKey: "col_roleID"});

Category.hasMany(Product, { foreignKey: "product_category"});
Product.belongsTo(Category, { foreignKey: "product_category"});

BinLocation.hasMany(Product, { foreignKey: "product_location"});
Product.belongsTo(BinLocation, { foreignKey: "product_location"});

Manufacturer.hasMany(Product, { foreignKey: "product_manufacturer"});
Product.belongsTo(Manufacturer, { foreignKey: "product_manufacturer"});

Product.hasMany(ProductTAGSupplier, { foreignKey: "product_code"});
ProductTAGSupplier.belongsTo(Product, { foreignKey: "product_code"});


Supplier.hasMany(ProductTAGSupplier, { foreignKey: "supplier_code"});
ProductTAGSupplier.belongsTo(Product, { foreignKey: "supplier_code"});

module.exports = { 
                    MasterList, 
                    UserRole,  
                    Product, 
                    Category, 
                    BinLocation, 
                    Manufacturer,
                    ProductTAGSupplier,
                    Supplier
                };