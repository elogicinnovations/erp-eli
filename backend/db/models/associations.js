const UserRole = require("./userRole.model");
const MasterList = require("./masterlist.model");
const Product = require("./product.model");
const Category = require("./category.model");
const BinLocation = require("./binLocation.model");
const Manufacturer = require("./manufacturer.model");
const Supplier = require("./supplier.model");
const ProductTAGSupplier = require("./productTAGsupplier.model");
const CostCenter = require("./costcenter.model");

const SubPart = require("./subpart.model");

const SparePart = require("./sparePart.model");
const SparePart_SubPart = require("./sparePart_subPart.model");
const SparePart_Supplier = require("./sparePart_supplier..model");

const Assembly = require("./assembly.model");
const Assembly_Supplier = require("./assembly_supplier.model");
const Assembly_SparePart = require("./assembly_spare.model");



const Inventory = require("./inventory.model");
const Issuance = require("./issuance.model");
const IssuedProduct = require("./issued_product.model");
const IssuedReturn = require("./issued_return.model");



const PR = require("./pr.model");
const PR_product = require("./pr_products.model");

// const SparePart = require("./sparePart.model");
// const Supplier_SparePart = require("./supplier_sparePart.model");

UserRole.hasMany(MasterList, { foreignKey: "col_roleID"});
MasterList.belongsTo(UserRole, { foreignKey: "col_roleID"});

Category.hasMany(Product, { foreignKey: "product_category"});
Product.belongsTo(Category, { foreignKey: "product_category"});

BinLocation.hasMany(Product, { foreignKey: "product_location"});
Product.belongsTo(BinLocation, { foreignKey: "product_location"});

Manufacturer.hasMany(Product, { foreignKey: "product_manufacturer"}); // ginamit ng product
Product.belongsTo(Manufacturer, { foreignKey: "product_manufacturer"}); // gumamit sa manufacturer
 
Product.hasMany(ProductTAGSupplier, { foreignKey: "product_id"});
ProductTAGSupplier.belongsTo(Product, { foreignKey: "product_id"});

Supplier.hasMany(ProductTAGSupplier, { foreignKey: "supplier_code"});
ProductTAGSupplier.belongsTo(Supplier, { foreignKey: "supplier_code"});

MasterList.hasMany(CostCenter, { foreignKey: "col_id" });
CostCenter.belongsTo(MasterList, { foreignKey: "col_id"});

ProductTAGSupplier.hasMany(Inventory, { foreignKey: "product_tag_supp_id"});
Inventory.belongsTo(ProductTAGSupplier, {foreignKey: "product_tag_supp_id"});

Supplier.hasMany(Assembly_Supplier, { foreignKey: "supplier_code"});
Assembly_Supplier.belongsTo(Supplier, { foreignKey: "supplier_code"});

MasterList.hasMany(Issuance, { foreignKey: "received_by" });
Issuance.belongsTo(MasterList, { foreignKey: "received_by" });

MasterList.hasMany(Issuance, { foreignKey: "transported_by"});
Issuance.belongsTo(MasterList, { foreignKey: "transported_by" });

CostCenter.hasMany(Issuance, { foreignKey: "issued_to" });
Issuance.belongsTo(CostCenter, { foreignKey: "issued_to" });

Issuance.hasMany(IssuedProduct, { foreignKey: "issuance_id" });
IssuedProduct.belongsTo(Issuance, { foreignKey: "issuance_id" });

Inventory.hasMany(IssuedProduct, { foreignKey: "inventory_id" });
IssuedProduct.belongsTo(Inventory, { foreignKey: "inventory_id"});

Inventory.hasMany(IssuedReturn, { foreignKey: "inventory_id" });
IssuedReturn.belongsTo(Inventory, { foreignKey: "inventory_id" });

Issuance.hasMany(IssuedReturn, { foreignKey: "issued_id" });
IssuedReturn.belongsTo(Issuance, { foreignKey: "issued_id" });

MasterList.hasMany(IssuedReturn, { foreignKey: "return_by" });
IssuedReturn.belongsTo(MasterList, { foreignKey: "return_by" });

// `sparepart_subparts
SubPart.hasMany(SparePart_SubPart, { foreignKey: "subPart_id"});
SparePart_SubPart.belongsTo(SubPart, { foreignKey: "subPart_id"});

SparePart.hasMany(SparePart_SubPart, { foreignKey: "sparePart_id"});
SparePart_SubPart.belongsTo(SparePart, { foreignKey: "sparePart_id"});


// `sparepart_suPPLIER
SparePart.hasMany(SparePart_Supplier, { foreignKey: "sparePart_id"});
SparePart_Supplier.belongsTo(SparePart, { foreignKey: "sparePart_id"});

Supplier.hasMany(SparePart_Supplier, { foreignKey: "supplier_code"});
SparePart_Supplier.belongsTo(Supplier, { foreignKey: "supplier_code"});

//purchase request
PR.hasMany(PR_product, { foreignKey: "pr_id"});
PR_product.belongsTo(PR, { foreignKey: "pr_id"});

Product.hasMany(PR_product, { foreignKey: "product_id"});
PR_product.belongsTo(Product, { foreignKey: "product_id"});

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
                    SubPart,
                    SparePart,
                    SparePart_SubPart,
                    SparePart_Supplier,             
                    Assembly_Supplier,
                    Inventory,
                    Issuance,
                    IssuedProduct,
                    IssuedReturn,
                    PR,
                    PR_product
                };