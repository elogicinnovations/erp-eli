const UserRole = require("./userRole.model");
const MasterList = require("./masterlist.model");
const Product = require("./product.model");
const Category = require("./category.model");
const BinLocation = require("./binLocation.model");
const Manufacturer = require("./manufacturer.model");
const Supplier = require("./supplier.model");
const ProductTAGSupplier = require("./productTAGsupplier.model");
const Product_Subparts = require("./product_subparts.model");
const Product_Spareparts = require("./product_spare.model");
const Product_Assembly = require("./product_assembly.model");
const CostCenter = require("./costcenter.model");

const SubPart = require("./subpart.model");
const Subpart_supplier = require("./subpart_supplier.model")

const SparePart = require("./sparePart.model");
const SparePart_SubPart = require("./sparePart_subPart.model");
const SparePart_Supplier = require("./sparePart_supplier..model");

const Assembly = require("./assembly.model");
const Assembly_Supplier = require("./assembly_supplier.model");
const Assembly_SparePart = require("./assembly_spare.model");
const Assembly_SubPart = require("./asssembly_subparts.model");


const Inventory = require("./inventory.model");
const Inventory_Assembly = require("./inventory_assembly.model");
const Inventory_Spare = require("./inventory_spare.model");
const Inventory_Subpart = require("./inventory_subpart.model");

const Issuance = require("./issuance.model");
const IssuedProduct = require("./issued_product.model");
const IssuedReturn = require("./issued_return.model");



const PR = require("./pr.model");
const PR_product = require("./pr_products.model");
const PR_assembly = require("./pr_assembly.model");
const PR_sparePart = require("./pr_sparePart.model");
const PR_subPart = require("./pr_subPart.model");
const PR_history = require("./pr_historical.model");
const PR_Rejustify = require("./pr_rejustify.model");
const PR_PO = require("./pr_toPO.model");
const PR_PO_asmbly = require("./pr_toPO_asmbly.model");
const PR_PO_spare = require("./pr_toPO_spare.model");
const PR_PO_subpart = require("./pr_toPO_subpart.model");


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


//subpart tag supplier table
SubPart.hasMany(Subpart_supplier, { foreignKey: "subpart_id"});
Subpart_supplier.belongsTo(SubPart, { foreignKey: "subpart_id"});

Supplier.hasMany(Subpart_supplier, { foreignKey: "supplier_code"});
Subpart_supplier.belongsTo(Supplier, { foreignKey: "supplier_code"});

//product tag supplier table
Product.hasMany(ProductTAGSupplier, { foreignKey: "product_id"});
ProductTAGSupplier.belongsTo(Product, { foreignKey: "product_id"});

Supplier.hasMany(ProductTAGSupplier, { foreignKey: "supplier_code"});
ProductTAGSupplier.belongsTo(Supplier, { foreignKey: "supplier_code"});

// product_assemblies` table
Product.hasMany(Product_Assembly, { foreignKey: "product_id"});
Product_Assembly.belongsTo(Product, { foreignKey: "product_id"});

Assembly.hasMany(Product_Assembly, { foreignKey: "assembly_id"});
Product_Assembly.belongsTo(Assembly, { foreignKey: "assembly_id"});



// product_spareparts` table
Product.hasMany(Product_Spareparts, { foreignKey: "product_id"});
Product_Spareparts.belongsTo(Product, { foreignKey: "product_id"});

SparePart.hasMany(Product_Spareparts, { foreignKey: "sparePart_id"});
Product_Spareparts.belongsTo(SparePart, { foreignKey: "sparePart_id"});



// product_subparts` table
Product.hasMany(Product_Subparts, { foreignKey: "product_id"});
Product_Subparts.belongsTo(Product, { foreignKey: "product_id"});

SubPart.hasMany(Product_Subparts, { foreignKey: "subPart_id"});
Product_Subparts.belongsTo(SubPart, { foreignKey: "subPart_id"});




MasterList.hasMany(CostCenter, { foreignKey: "col_id" });
CostCenter.belongsTo(MasterList, { foreignKey: "col_id"});

ProductTAGSupplier.hasMany(Inventory, { foreignKey: "product_tag_supp_id"});
Inventory.belongsTo(ProductTAGSupplier, {foreignKey: "product_tag_supp_id"});

Assembly_Supplier.hasMany(Inventory_Assembly, { foreignKey: "assembly_tag_supp_id"});
Inventory_Assembly.belongsTo(Assembly_Supplier, {foreignKey: "assembly_tag_supp_id"});

SparePart_Supplier.hasMany(Inventory_Spare, { foreignKey: "spare_tag_supp_id"});
Inventory_Spare.belongsTo(SparePart_Supplier, {foreignKey: "spare_tag_supp_id"});

Subpart_supplier.hasMany(Inventory_Subpart, { foreignKey: "subpart_tag_supp_id"});
Inventory_Subpart.belongsTo(Subpart_supplier, {foreignKey: "subpart_tag_supp_id"});


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

//`purchase_req_products` table
PR.hasMany(PR_product, { foreignKey: "pr_id"});
PR_product.belongsTo(PR, { foreignKey: "pr_id"});

Product.hasMany(PR_product, { foreignKey: "product_id"});
PR_product.belongsTo(Product, { foreignKey: "product_id"});


//`purchase_req_assemblies` table
PR.hasMany(PR_assembly, { foreignKey: "pr_id"});
PR_assembly.belongsTo(PR, { foreignKey: "pr_id"});

Assembly.hasMany(PR_assembly, { foreignKey: "assembly_id"});
PR_assembly.belongsTo(Assembly, { foreignKey: "assembly_id"});

//`purchase_req_spares` table
PR.hasMany(PR_sparePart, { foreignKey: "pr_id"});
PR_sparePart.belongsTo(PR, { foreignKey: "pr_id"});

SparePart.hasMany(PR_sparePart, { foreignKey: "spare_id"});
PR_sparePart.belongsTo(SparePart, { foreignKey: "spare_id"});

//`purchase_req_subParts` table
PR.hasMany(PR_subPart, { foreignKey: "pr_id"});
PR_subPart.belongsTo(PR, { foreignKey: "pr_id"});

SubPart.hasMany(PR_subPart, { foreignKey: "subPart_id"});
PR_subPart.belongsTo(SubPart, { foreignKey: "subPart_id"});


PR.hasMany(PR_history, { foreignKey: "pr_id"});
PR_history.belongsTo(PR, { foreignKey: "pr_id"});

PR.hasMany(PR_Rejustify, { foreignKey: "pr_id"});
PR_Rejustify.belongsTo(PR, { foreignKey: "pr_id"});

//purchase_req_canvassed_prds TAble (Product)
PR.hasMany(PR_PO, { foreignKey: "pr_id"});
PR_PO.belongsTo(PR, { foreignKey: "pr_id"});

ProductTAGSupplier.hasMany(PR_PO, { foreignKey: "product_tag_supplier_ID"});
PR_PO.belongsTo(ProductTAGSupplier, { foreignKey: "product_tag_supplier_ID"});


//purchase_req_canvassed_asmbly TAble (Assembly)
PR.hasMany(PR_PO_asmbly, { foreignKey: "pr_id"});
PR_PO_asmbly.belongsTo(PR, { foreignKey: "pr_id"});

Assembly_Supplier.hasMany(PR_PO_asmbly, { foreignKey: "assembly_suppliers_ID"});
PR_PO_asmbly.belongsTo(Assembly_Supplier, { foreignKey: "assembly_suppliers_ID"});

//purchase_req_canvassed_spares TAble (spareparts)
PR.hasMany(PR_PO_spare, { foreignKey: "pr_id"});
PR_PO_spare.belongsTo(PR, { foreignKey: "pr_id"});

SparePart_Supplier.hasMany(PR_PO_spare, { foreignKey: "spare_suppliers_ID"});
PR_PO_spare.belongsTo(SparePart_Supplier, { foreignKey: "spare_suppliers_ID"});

//purchase_req_canvassed_subpart TAble (subparts)
PR.hasMany(PR_PO_subpart, { foreignKey: "pr_id"});
PR_PO_subpart.belongsTo(PR, { foreignKey: "pr_id"});

Subpart_supplier.hasMany(PR_PO_subpart, { foreignKey: "subpart_suppliers_ID"});
PR_PO_subpart.belongsTo(Subpart_supplier, { foreignKey: "subpart_suppliers_ID"});


//Assembly Sub parts PR_PO_asmbly
Assembly.hasMany(Assembly_SubPart, { foreignKey: "assembly_id"});
Assembly_SubPart.belongsTo(Assembly, { foreignKey: "assembly_id"});

SubPart.hasMany(Assembly_SubPart, { foreignKey: "subPart_id"});
Assembly_SubPart.belongsTo(SubPart, { foreignKey: "subPart_id"});


//Assembly Spare Parts
Assembly.hasMany(Assembly_SparePart, {foreignKey: "assembly_id"});
Assembly_SparePart.belongsTo(Assembly, {foreignKey: "assembly_id"});

SparePart.hasMany(Assembly_SparePart, {foreignKey: "sparePart_id"});
Assembly_SparePart.belongsTo(SparePart, {foreignKey: "sparePart_id"});


//Assembly_supplier
Assembly.hasMany(Assembly_Supplier, { foreignKey: "assembly_id"});
Assembly_Supplier.belongsTo(Assembly, { foreignKey: "assembly_id"});

Supplier.hasMany(Assembly_Supplier, { foreignKey: "supplier_code"});
Assembly_Supplier.belongsTo(Supplier, { foreignKey: "supplier_code"});



module.exports = { 
                    MasterList, 
                    UserRole,  
                    Product, 
                    
                    ProductTAGSupplier,
                    Product_Assembly,
                    Product_Spareparts,
                    Product_Subparts,

                    Category, 
                    BinLocation, 
                    Manufacturer,
                    
                    Supplier,
                    CostCenter,

                    SubPart,
                    Subpart_supplier,
                    
                    SparePart,
                    SparePart_SubPart,
                    SparePart_Supplier, 

                    Assembly,            
                    Assembly_Supplier,
                    Assembly_SparePart,
                    Assembly_SubPart,
                    
                    Inventory,
                    Inventory_Assembly,
                    Inventory_Spare,
                    Inventory_Subpart,
                    Issuance,
                    IssuedProduct,
                    IssuedReturn,


                    PR,
                    PR_product,
                    PR_assembly,
                    PR_sparePart,
                    PR_subPart,
                    PR_history,
                    PR_Rejustify,
                    PR_PO,
                    PR_PO_asmbly,
                    PR_PO_spare,
                    PR_PO_subpart
                };