const UserRole = require("./userRole.model");
const MasterList = require("./masterlist.model");
const Product = require("./product.model");
const Category = require("./category.model");
const BinLocation = require("./binLocation.model");
const Manufacturer = require("./manufacturer.model");
const Supplier = require("./supplier.model");
const ProductTAGSupplier = require("./productTAGsupplier.model");
const CostCenter = require("./costcenter.model");
const Assembly = require("./assembly.model");
const Assembly_Supplier = require("./assembly_supplier.model");
const Assembly_SparePart = require("./assembly_spare.model");

const Inventory = require("./inventory.model");
// const SparePart = require("./sparePart.model");
// const Supplier_SparePart = require("./supplier_sparePart.model");

UserRole.hasMany(MasterList, { foreignKey: "col_roleID"});
MasterList.belongsTo(UserRole, { foreignKey: "col_roleID"});

Category.hasMany(Product, { foreignKey: "product_category"});
Product.belongsTo(Category, { foreignKey: "product_category"});

BinLocation.hasMany(Product, { foreignKey: "product_location"});
Product.belongsTo(BinLocation, { foreignKey: "product_location"});

Manufacturer.hasMany(Product, { foreignKey: "product_manufacturer"});
Product.belongsTo(Manufacturer, { foreignKey: "product_manufacturer"});
 
Product.hasMany(ProductTAGSupplier, { foreignKey: "product_id"});
ProductTAGSupplier.belongsTo(Product, { foreignKey: "product_id"});


Supplier.hasMany(ProductTAGSupplier, { foreignKey: "supplier_code"});
ProductTAGSupplier.belongsTo(Supplier, { foreignKey: "supplier_code"});

MasterList.hasMany(CostCenter, { foreignKey: "col_id" });
CostCenter.belongsTo(MasterList, { foreignKey: "col_id"});

Inventory.hasMany(Product, { foreignKey: "product_id"});
Product.belongsTo(Inventory, {foreignKey: "product_id"});


Supplier.hasMany(Assembly_Supplier, { foreignKey: "supplier_code"});
Assembly_Supplier.belongsTo(Supplier, { foreignKey: "supplier_code"});

// Assembly.hasMany(Assembly_SparePart, { foreignKey: "sparePart_id"});
// Assembly_SparePart.belongsTo(Assembly, { foreignKey: "sparePart_id"});

// SparePart.hasMany(Supplier_SparePart, { foreignKey: "subPart_code"});
// Supplier_SparePart.belongsTo(SparePart, { foreignKey: "subPart_code"});


module.exports = { 
                    MasterList, 
                    UserRole,  
                    Product, 
                    Category, 
                    BinLocation, 
                    Manufacturer,
                    ProductTAGSupplier,
                    Supplier,
                    CostCenter,
                    // Assembly,
                    Assembly_Supplier,
                    // Assembly_SparePart
                    Inventory,
                    // Supplier_SparePart,
                    // SparePart
                };