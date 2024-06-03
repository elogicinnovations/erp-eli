const UserRole = require("./userRole.model");
const MasterList = require("./masterlist.model");
const Department = require("./department.model");
const Product = require("./product.model");
const Category = require("./category.model");
const BinLocation = require("./binLocation.model");
const Manufacturer = require("./manufacturer.model");
const Supplier = require("./supplier.model");
const CostCenter = require("./costcenter.model");
const Activity_Log = require("./activity_log.model");

const productTAGsupplierHistory = require("./productTAGSupplierHistory.model");
const ProductTAGSupplier = require("./productTAGsupplier.model");
const Product_Subparts = require("./product_subparts.model");
const Product_Spareparts = require("./product_spare.model");
const Product_Assembly = require("./product_assembly.model");
const Product_image = require("./product_image.model");
const Product_Assm = require("./product_assm.model");
const Product_Sub_Assembly = require("./product_sub_assembly.model");
const Product_Spare_Parts = require("./product_spareparts.model")


const SubPart = require("./subpart.model");
const Subpart_supplier = require("./subpart_supplier.model");
const Subpart_image = require("./subpart_image.model");
const Subpart_Price_History = require("./subpart_price_history.model");

const SparePart = require("./sparePart.model");
const SparePart_SubPart = require("./sparePart_subPart.model");
const SparePart_Supplier = require("./sparePart_supplier..model");
const SparePart_image = require("./sparepart_image.model");
const SparePartPrice_history = require("./sparePart_price_history.model");

const Assembly = require("./assembly.model");
const Assembly_Supplier = require("./assembly_supplier.model");
const Assembly_SparePart = require("./assembly_spare.model");
const Assembly_SubPart = require("./asssembly_subparts.model");
const AssemblyPrice_History = require("./assembly_price_history.model");
const Assembly_image = require("./assembly_image.model");

const Inventory = require("./inventory.model");
const Inventory_Assembly = require("./inventory_assembly.model");
const Inventory_Spare = require("./inventory_spare.model");
const Inventory_Subpart = require("./inventory_subpart.model");

const Issuance = require("./issuance.model");
const IssuedProduct = require("./issued_product.model");
const IssuedAssembly = require("./issued_assembly.model");
const IssuedSpare = require("./issued_spare.model");
const IssuedSubpart = require("./issued_subpart.model");

const IssuedApproveProduct = require("./issued_approve_prd.model");
const IssuedApproveAssembly = require("./issued_approve_asm.model");
const IssuedApproveSpare = require("./issued_approve_spare.model");
const IssuedApproveSubpart = require("./issued_approve_subpart.model");

const IssuedReturn = require("./issued_return.model"); // for product
const IssuedReturn_asm = require("./issued_return_asm.model");
const IssuedReturn_spare = require("./issued_return_spare.model");
const IssuedReturn_subpart = require("./issued_return_subpart.model");

const PR = require("./pr.model");
const PR_product = require("./pr_products.model");
const PR_assembly = require("./pr_assembly.model");
const PR_sparePart = require("./pr_sparePart.model");
const PR_subPart = require("./pr_subPart.model");
const PR_history = require("./pr_historical.model");
const PR_Rejustify = require("./pr_rejustify.model");
const PR_PO = require("./pr_toPO.model");
const PO_REJECT = require("./pr_PO_Reject.model");
const PR_REJECT = require("./pr_Reject.model");
const PR_PO_asmbly = require("./pr_toPO_asmbly.model");
const PR_PO_spare = require("./pr_toPO_spare.model");
const PR_PO_subpart = require("./pr_toPO_subpart.model");
const PO_Received = require("./po_received.model");


const Receiving_PO = require("./receiving.model");
const Receiving_Prd = require("./receiving_prd.model");
const Receiving_Asm = require("./receiving_asm.model");
const Receiving_Spare = require("./receiving_spare.model");
const Receiving_Subpart = require("./receiving_subpart.model");
const Receiving_Image = require("./receiving_picture.model");

const Receiving_initial_prd = require("./receiving_initial_prd.model")
const Receiving_initial_asm = require("./receiving_initial_asm.model")
const Receiving_initial_spare = require("./receiving_initial_spare.model")
const Receiving_initial_subpart = require("./receiving_initial_subpart.model")

const StockTransfer = require("./stockTransfer.model");
const Stock_Rejustify = require("./stockTransfer_rejustify.model")
const Stock_History = require("./stockTransfer_history.model")
const StockTransfer_prod = require("./stockTransfer_product.model");
const StockTransfer_assembly = require("./stockTransfer_assembly.model");
const StockTransfer_spare = require("./stockTransfer_spare.model");
const StockTransfer_subpart = require("./stockTransfer_subpart.model");
const ST_REJECT = require("./stockTransfer_reject.model");

const Warehouses = require("./warehouse.model");

// const SparePart = require("./sparePart.model");
// const Supplier_SparePart = require("./supplier_sparePart.model");

UserRole.hasMany(MasterList, { foreignKey: "col_roleID" });
MasterList.belongsTo(UserRole, { foreignKey: "col_roleID" });

Department.hasMany(MasterList, { foreignKey: "department_id" });
MasterList.belongsTo(Department, { foreignKey: "department_id" });

Category.hasMany(Product, { foreignKey: "product_category" });
Product.belongsTo(Category, { foreignKey: "product_category" });

BinLocation.hasMany(Product, { foreignKey: "product_location" });
Product.belongsTo(BinLocation, { foreignKey: "product_location" });

Manufacturer.hasMany(Product, { foreignKey: "product_manufacturer" }); // ginamit ng product
Product.belongsTo(Manufacturer, { foreignKey: "product_manufacturer" }); // gumamit sa manufacturer

MasterList.hasMany(Activity_Log, { foreignKey: "masterlist_id" });
Activity_Log.belongsTo(MasterList, { foreignKey: "masterlist_id" });

//subpart tag supplier table
SubPart.hasMany(Subpart_supplier, { foreignKey: "subpart_id" });
Subpart_supplier.belongsTo(SubPart, { foreignKey: "subpart_id" });

Supplier.hasMany(Subpart_supplier, { foreignKey: "supplier_code" });
Subpart_supplier.belongsTo(Supplier, { foreignKey: "supplier_code" });

//subpart tag in bin location
BinLocation.hasMany(SubPart, { foreignKey: "bin_id" });
SubPart.belongsTo(BinLocation, { foreignKey: "bin_id" });

//subpart tag in manufacturer
Manufacturer.hasMany(SubPart, { foreignKey: "subPart_Manufacturer" });
SubPart.belongsTo(Manufacturer, { foreignKey: "subPart_Manufacturer" });

//subpart tag category
Category.hasMany(SubPart, { foreignKey: "category_code" });
SubPart.belongsTo(Category, { foreignKey: "category_code" });

//subpart tag image
SubPart.hasMany(Subpart_image, { foreignKey: "subpart_id" });
Subpart_image.belongsTo(SubPart, { foreignKey: "subpart_id" });

//subpart price history table
SubPart.hasMany(Subpart_Price_History, { foreignKey: "subpart_id" });
Subpart_Price_History.belongsTo(SubPart, { foreignKey: "subpart_id" });

Supplier.hasMany(Subpart_Price_History, { foreignKey: "supplier_code" });
Subpart_Price_History.belongsTo(Supplier, { foreignKey: "supplier_code" });

//product tag supplier table
Product.hasMany(ProductTAGSupplier, { foreignKey: "product_id" });
ProductTAGSupplier.belongsTo(Product, { foreignKey: "product_id" });

Supplier.hasMany(ProductTAGSupplier, { foreignKey: "supplier_code" });
ProductTAGSupplier.belongsTo(Supplier, { foreignKey: "supplier_code" });

// product_assemblies` table
Product.hasMany(Product_Assembly, { foreignKey: "product_id" });
Product_Assembly.belongsTo(Product, { foreignKey: "product_id" });

Assembly.hasMany(Product_Assembly, { foreignKey: "assembly_id" });
Product_Assembly.belongsTo(Assembly, { foreignKey: "assembly_id" });

Assembly.hasMany(Assembly_image, { foreignKey: "assembly_id" });
Assembly_image.belongsTo(Assembly, { foreignKey: "assembly_id" });

Product.hasMany(Product_image, { foreignKey: "product_id" });
Product_image.belongsTo(Product, { foreignKey: "product_id" });

//product type assembly
Product.hasMany(Product_Assm, { foreignKey: "product_id", as: "product" });
Product_Assm.belongsTo(Product, { foreignKey: "product_id", as: "product" });

Product.hasMany(Product_Assm, { foreignKey: "tag_product_assm", as: "tagged_product_assemblies" });
Product_Assm.belongsTo(Product, { foreignKey: "tag_product_assm", as: "tagged_product_assemblies" });

//product type sub assembly
Product.hasMany(Product_Sub_Assembly, { foreignKey: "product_id", as: "productIncremented" }); //Product ID
Product_Sub_Assembly.belongsTo(Product, { foreignKey: "product_id", as: "productIncremented" });

Product.hasMany(Product_Sub_Assembly, { foreignKey: "tag_product_sub_assembly", as: "tag_sub_assemblies"  }); // Tag product sub assembly
Product_Sub_Assembly.belongsTo(Product, { foreignKey: "tag_product_sub_assembly", as: "tag_sub_assemblies"  });

//product type spare parts
Product.hasMany(Product_Spare_Parts, { foreignKey: "product_id", as: "IncrementedProduct" }); //Product ID
Product_Spare_Parts.belongsTo(Product, { foreignKey: "product_id", as: "IncrementedProduct" });

Product.hasMany(Product_Spare_Parts, { foreignKey: "tag_product_spare_parts", as: "tag_product_spares" }); 
Product_Spare_Parts.belongsTo(Product, { foreignKey: "tag_product_spare_parts", as: "tag_product_spares" }); // Tag product Spare Parts

Product.hasMany(PR_product, { foreignKey: "product_id" });
PR_product.belongsTo(Product, { foreignKey: "product_id" });

PR.hasMany(PR_product, { foreignKey: "pr_id" });
PR_product.belongsTo(PR, { foreignKey: "pr_id" });

Assembly.hasMany(PR_assembly, { foreignKey: "assembly_id" });
PR_assembly.belongsTo(Assembly, { foreignKey: "assembly_id" });

SparePart.hasMany(PR_sparePart, { foreignKey: "spare_id" });
PR_sparePart.belongsTo(SparePart, { foreignKey: "spare_id" });

SubPart.hasMany(PR_subPart, { foreignKey: "subPart_id" });
PR_subPart.belongsTo(SubPart, { foreignKey: "subPart_id" });

// Product.belongsToMany(Assembly, {through: Product_Assembly, foreignKey: "product_id"});
// Assembly.belongsToMany(Product, {through: Product_Assembly, foreignKey: "assembly_id"});
Warehouses.hasMany(StockTransfer, { foreignKey: "destination", as: "DestinationWarehouse" });
StockTransfer.belongsTo(Warehouses, { foreignKey: "destination", as: "DestinationWarehouse" });

Warehouses.hasMany(StockTransfer, { foreignKey: "source", as: "SourceWarehouse" });
StockTransfer.belongsTo(Warehouses, { foreignKey: "source", as: "SourceWarehouse" });




// product_spareparts` table
Product.hasMany(Product_Spareparts, { foreignKey: "product_id" });
Product_Spareparts.belongsTo(Product, { foreignKey: "product_id" });

SparePart.hasMany(Product_Spareparts, { foreignKey: "sparePart_id" });
Product_Spareparts.belongsTo(SparePart, { foreignKey: "sparePart_id" });

// product_subparts` table
Product.hasMany(Product_Subparts, { foreignKey: "product_id" });
Product_Subparts.belongsTo(Product, { foreignKey: "product_id" });

SubPart.hasMany(Product_Subparts, { foreignKey: "subPart_id" });
Product_Subparts.belongsTo(SubPart, { foreignKey: "subPart_id" });

//Sparepart image
SparePart.hasMany(SparePart_image, { foreignKey: "sparepart_id" });
SparePart_image.belongsTo(SparePart, { foreignKey: "sparepart_id" });

// product price history table
Product.hasMany(productTAGsupplierHistory, { foreignKey: "product_id" });
productTAGsupplierHistory.belongsTo(Product, { foreignKey: "product_id" });

Supplier.hasMany(productTAGsupplierHistory, { foreignKey: "supplier_code" });
productTAGsupplierHistory.belongsTo(Supplier, { foreignKey: "supplier_code" });

MasterList.hasMany(CostCenter, { foreignKey: "col_id" });
CostCenter.belongsTo(MasterList, { foreignKey: "col_id" });

ProductTAGSupplier.hasMany(Inventory, { foreignKey: "product_tag_supp_id" });
Inventory.belongsTo(ProductTAGSupplier, { foreignKey: "product_tag_supp_id" });

Assembly_Supplier.hasMany(Inventory_Assembly, {
  foreignKey: "assembly_tag_supp_id",
});
Inventory_Assembly.belongsTo(Assembly_Supplier, {
  foreignKey: "assembly_tag_supp_id",
});

SparePart_Supplier.hasMany(Inventory_Spare, {
  foreignKey: "spare_tag_supp_id",
});
Inventory_Spare.belongsTo(SparePart_Supplier, {
  foreignKey: "spare_tag_supp_id",
});

Subpart_supplier.hasMany(Inventory_Subpart, {
  foreignKey: "subpart_tag_supp_id",
});
Inventory_Subpart.belongsTo(Subpart_supplier, {
  foreignKey: "subpart_tag_supp_id",
});

MasterList.hasMany(Issuance, { foreignKey: "received_by" });
Issuance.belongsTo(MasterList, { foreignKey: "received_by" });

MasterList.hasMany(Issuance, { foreignKey: "transported_by" });
Issuance.belongsTo(MasterList, { foreignKey: "transported_by" });

CostCenter.hasMany(Issuance, { foreignKey: "issued_to" });
Issuance.belongsTo(CostCenter, { foreignKey: "issued_to" });

//issuance product table
Issuance.hasMany(IssuedProduct, { foreignKey: "issuance_id" });
IssuedProduct.belongsTo(Issuance, { foreignKey: "issuance_id" });

Product.hasMany(IssuedProduct, { foreignKey: "product_id" });
IssuedProduct.belongsTo(Product, { foreignKey: "product_id" });

//issuance assembly table
Issuance.hasMany(IssuedAssembly, { foreignKey: "issuance_id" });
IssuedAssembly.belongsTo(Issuance, { foreignKey: "issuance_id" });

Assembly.hasMany(IssuedAssembly, {foreignKey: "product_id",});
IssuedAssembly.belongsTo(Assembly, {foreignKey: "product_id"});

//issuance spare table
Issuance.hasMany(IssuedSpare, { foreignKey: "issuance_id" });
IssuedSpare.belongsTo(Issuance, { foreignKey: "issuance_id" });

SparePart.hasMany(IssuedSpare, { foreignKey: "product_id" });
IssuedSpare.belongsTo(SparePart, { foreignKey: "product_id" });

//issuance subpart table
Issuance.hasMany(IssuedSubpart, { foreignKey: "issuance_id" });
IssuedSubpart.belongsTo(Issuance, { foreignKey: "issuance_id" });

SubPart.hasMany(IssuedSubpart, {foreignKey: "product_id",});
IssuedSubpart.belongsTo(SubPart, {foreignKey: "product_id",});


// IF iSSUANCE is approved prd
Issuance.hasMany(IssuedApproveProduct, { foreignKey: "issuance_id" });
IssuedApproveProduct.belongsTo(Issuance, { foreignKey: "issuance_id" });

Inventory.hasMany(IssuedApproveProduct, { foreignKey: "inventory_id" });
IssuedApproveProduct.belongsTo(Inventory, { foreignKey: "inventory_id" });

// IF iSSUANCE is approved asm
Issuance.hasMany(IssuedApproveAssembly, { foreignKey: "issuance_id" });
IssuedApproveAssembly.belongsTo(Issuance, { foreignKey: "issuance_id" });

Inventory_Assembly.hasMany(IssuedApproveAssembly, { foreignKey: "inventory_id" });
IssuedApproveAssembly.belongsTo(Inventory_Assembly, { foreignKey: "inventory_id" });


// IF iSSUANCE is approved spare
Issuance.hasMany(IssuedApproveSpare, { foreignKey: "issuance_id" });
IssuedApproveSpare.belongsTo(Issuance, { foreignKey: "issuance_id" });

Inventory_Spare.hasMany(IssuedApproveSpare, { foreignKey: "inventory_id" });
IssuedApproveSpare.belongsTo(Inventory_Spare, { foreignKey: "inventory_id" });

// IF iSSUANCE is approved spare
Issuance.hasMany(IssuedApproveSubpart, { foreignKey: "issuance_id" });
IssuedApproveSubpart.belongsTo(Issuance, { foreignKey: "issuance_id" });

Inventory_Subpart.hasMany(IssuedApproveSubpart, { foreignKey: "inventory_id" });
IssuedApproveSubpart.belongsTo(Inventory_Subpart, { foreignKey: "inventory_id" });


//Issuance Return tab for product
Inventory.hasMany(IssuedReturn, { foreignKey: "inventory_id" });
IssuedReturn.belongsTo(Inventory, { foreignKey: "inventory_id" });

Issuance.hasMany(IssuedReturn, { foreignKey: "issued_id" });
IssuedReturn.belongsTo(Issuance, { foreignKey: "issued_id" });

MasterList.hasMany(IssuedReturn, { foreignKey: "return_by" });
IssuedReturn.belongsTo(MasterList, { foreignKey: "return_by" });

//Issuance Return tab for Assmebly
Inventory_Assembly.hasMany(IssuedReturn_asm, { foreignKey: "inventory_id" });
IssuedReturn_asm.belongsTo(Inventory_Assembly, { foreignKey: "inventory_id" });

Issuance.hasMany(IssuedReturn_asm, { foreignKey: "issued_id" });
IssuedReturn_asm.belongsTo(Issuance, { foreignKey: "issued_id" });

MasterList.hasMany(IssuedReturn_asm, { foreignKey: "return_by" });
IssuedReturn_asm.belongsTo(MasterList, { foreignKey: "return_by" });

//Issuance Return tab for SparePart
Inventory_Spare.hasMany(IssuedReturn_spare, { foreignKey: "inventory_id" });
IssuedReturn_spare.belongsTo(Inventory_Spare, { foreignKey: "inventory_id" });

Issuance.hasMany(IssuedReturn_spare, { foreignKey: "issued_id" });
IssuedReturn_spare.belongsTo(Issuance, { foreignKey: "issued_id" });

MasterList.hasMany(IssuedReturn_spare, { foreignKey: "return_by" });
IssuedReturn_spare.belongsTo(MasterList, { foreignKey: "return_by" });

//Issuance Return tab for Subpart
Inventory_Subpart.hasMany(IssuedReturn_subpart, { foreignKey: "inventory_id" });
IssuedReturn_subpart.belongsTo(Inventory_Subpart, {
  foreignKey: "inventory_id",
});

Issuance.hasMany(IssuedReturn_subpart, { foreignKey: "issued_id" });
IssuedReturn_subpart.belongsTo(Issuance, { foreignKey: "issued_id" });

MasterList.hasMany(IssuedReturn_subpart, { foreignKey: "return_by" });
IssuedReturn_subpart.belongsTo(MasterList, { foreignKey: "return_by" });

Warehouses.hasMany(Issuance, { foreignKey: "from_site" });
Issuance.belongsTo(Warehouses, { foreignKey: "from_site" });

// `sparepart_subparts
SubPart.hasMany(SparePart_SubPart, { foreignKey: "subPart_id" });
SparePart_SubPart.belongsTo(SubPart, { foreignKey: "subPart_id" });

SparePart.hasMany(SparePart_SubPart, { foreignKey: "sparePart_id" });
SparePart_SubPart.belongsTo(SparePart, { foreignKey: "sparePart_id" });

// `sparepart_suPPLIER
SparePart.hasMany(SparePart_Supplier, { foreignKey: "sparePart_id" });
SparePart_Supplier.belongsTo(SparePart, { foreignKey: "sparePart_id" });

Manufacturer.hasMany(SparePart, { foreignKey: "spareParts_manufacturer" });
SparePart.belongsTo(Manufacturer, { foreignKey: "spareParts_manufacturer" });

BinLocation.hasMany(SparePart, { foreignKey: "spareParts_location" });
SparePart.belongsTo(BinLocation, { foreignKey: "spareParts_location" });

Supplier.hasMany(SparePart_Supplier, { foreignKey: "supplier_code" });
SparePart_Supplier.belongsTo(Supplier, { foreignKey: "supplier_code" });

// `sparepart price history
SparePart.hasMany(SparePartPrice_history, { foreignKey: "sparePart_id" });
SparePartPrice_history.belongsTo(SparePart, { foreignKey: "sparePart_id" });

Supplier.hasMany(SparePartPrice_history, { foreignKey: "supplier_code" });
SparePartPrice_history.belongsTo(Supplier, { foreignKey: "supplier_code" });

//assembly tag category
Category.hasMany(SparePart, { foreignKey: "category_code" });
SparePart.belongsTo(Category, { foreignKey: "category_code" });

//purchase_req_canvassed_subpart TAble (subparts)
PR.hasMany(PR_PO_subpart, { foreignKey: "pr_id" });
PR_PO_subpart.belongsTo(PR, { foreignKey: "pr_id" });

//For requested by
MasterList.hasMany(PR, { foreignKey: "masterlist_id" });
PR.belongsTo(MasterList, { foreignKey: "masterlist_id" });

Subpart_supplier.hasMany(PR_PO_subpart, { foreignKey: "subpart_suppliers_ID" });
PR_PO_subpart.belongsTo(Subpart_supplier, {
  foreignKey: "subpart_suppliers_ID",
});

PR.hasMany(PR_history, { foreignKey: "pr_id" });
PR_history.belongsTo(PR, { foreignKey: "pr_id" });

//Assembly Sub parts PR_PO_asmbly
Assembly.hasMany(Assembly_SubPart, { foreignKey: "assembly_id" });
Assembly_SubPart.belongsTo(Assembly, { foreignKey: "assembly_id" });

SubPart.hasMany(Assembly_SubPart, { foreignKey: "subPart_id" });
Assembly_SubPart.belongsTo(SubPart, { foreignKey: "subPart_id" });

//Assembly Spare Parts
Assembly.hasMany(Assembly_SparePart, { foreignKey: "assembly_id" });
Assembly_SparePart.belongsTo(Assembly, { foreignKey: "assembly_id" });

SparePart.hasMany(Assembly_SparePart, { foreignKey: "sparePart_id" });
Assembly_SparePart.belongsTo(SparePart, { foreignKey: "sparePart_id" });

//Assembly_supplier
Assembly.hasMany(Assembly_Supplier, { foreignKey: "assembly_id" });
Assembly_Supplier.belongsTo(Assembly, { foreignKey: "assembly_id" });

Supplier.hasMany(Assembly_Supplier, { foreignKey: "supplier_code" });
Assembly_Supplier.belongsTo(Supplier, { foreignKey: "supplier_code" });

//Assembly Price history
Assembly.hasMany(AssemblyPrice_History, { foreignKey: "assembly_id" });
AssemblyPrice_History.belongsTo(Assembly, { foreignKey: "assembly_id" });

Supplier.hasMany(AssemblyPrice_History, { foreignKey: "supplier_code" });
AssemblyPrice_History.belongsTo(Supplier, { foreignKey: "supplier_code" });

//assembly tag category
Category.hasMany(Assembly, { foreignKey: "category_code" });
Assembly.belongsTo(Category, { foreignKey: "category_code" });

//assembly tag bin location
BinLocation.hasMany(Assembly, { foreignKey: "bin_id" });
Assembly.belongsTo(BinLocation, { foreignKey: "bin_id" });

//assembly tag manufacturer
Manufacturer.hasMany(Assembly, { foreignKey: "assembly_manufacturer" });
Assembly.belongsTo(Manufacturer, { foreignKey: "assembly_manufacturer" });

//--------------Stock Transfer Masterlist table
MasterList.hasMany(StockTransfer, { foreignKey: "col_id", as: "requestor" });
StockTransfer.belongsTo(MasterList, { foreignKey: "col_id", as: "requestor" });

MasterList.hasMany(StockTransfer, { foreignKey: "masterlist_id", as: "approver" });
StockTransfer.belongsTo(MasterList, { foreignKey: "masterlist_id", as: "approver" });

MasterList.hasMany(ST_REJECT, { foreignKey: "masterlist_id" });
ST_REJECT.belongsTo(MasterList, { foreignKey: "masterlist_id" });

StockTransfer.hasMany(ST_REJECT, { foreignKey: "stocktransfer_id" });
ST_REJECT.belongsTo(StockTransfer, { foreignKey: "stocktransfer_id" });

//--------------Stock Transfer Product table
StockTransfer.hasMany(StockTransfer_prod, { foreignKey: "stockTransfer_id" });
StockTransfer_prod.belongsTo(StockTransfer, { foreignKey: "stockTransfer_id" });



Product.hasMany(StockTransfer_prod, { foreignKey: "product_id" });
StockTransfer_prod.belongsTo(Product, { foreignKey: "product_id" });

//-------------Stock Transfer Assembly table
StockTransfer.hasMany(StockTransfer_assembly, { foreignKey: "stockTransfer_id" });
StockTransfer_assembly.belongsTo(StockTransfer, { foreignKey: "stockTransfer_id" });

Assembly.hasMany(StockTransfer_assembly, { foreignKey: "product_id" });
StockTransfer_assembly.belongsTo(Assembly, { foreignKey: "product_id" });

// Assembly_Supplier.hasMany(StockTransfer_assembly, { foreignKey: "stockTransfer_id" });
// StockTransfer_assembly.belongsTo(Assembly_Supplier, { foreignKey: "stockTransfer_id" });

//-------------Stock Transfer Spare table
StockTransfer.hasMany(StockTransfer_spare, { foreignKey: "stockTransfer_id" });
StockTransfer_spare.belongsTo(StockTransfer, { foreignKey: "stockTransfer_id" });

SparePart.hasMany(StockTransfer_spare, { foreignKey: "product_id" });
StockTransfer_spare.belongsTo(SparePart, { foreignKey: "product_id" });

//-------------Stock Transfer Subpart table
StockTransfer.hasMany(StockTransfer_subpart, { foreignKey: "stockTransfer_id" });
StockTransfer_subpart.belongsTo(StockTransfer, { foreignKey: "stockTransfer_id" });

SubPart.hasMany(StockTransfer_subpart, { foreignKey: "product_id" });
StockTransfer_subpart.belongsTo(SubPart, { foreignKey: "product_id" });

//--------------Stock Transfer rejustify
StockTransfer.hasMany(Stock_Rejustify, { foreignKey: "stockTransfer_id" });
Stock_Rejustify.belongsTo(StockTransfer, { foreignKey: "stockTransfer_id" });

MasterList.hasMany(Stock_Rejustify, { foreignKey: "masterlist_id" });
Stock_Rejustify.belongsTo(MasterList, { foreignKey: "masterlist_id" });

//--------------Stock Transfer history
StockTransfer.hasMany(Stock_History, { foreignKey: "stockTransfer_id" });
Stock_History.belongsTo(StockTransfer, { foreignKey: "stockTransfer_id" });

//------------ Warehouse Product Inventory
Warehouses.hasMany(Inventory, { foreignKey: "warehouse_id" });
Inventory.belongsTo(Warehouses, { foreignKey: "warehouse_id" });

//------------ Warehouse Assembly Inventory
Warehouses.hasMany(Inventory_Assembly, { foreignKey: "warehouse_id" });
Inventory_Assembly.belongsTo(Warehouses, { foreignKey: "warehouse_id" });

//------------ Warehouse Spare parts Inventory
Warehouses.hasMany(Inventory_Spare, { foreignKey: "warehouse_id" });
Inventory_Spare.belongsTo(Warehouses, { foreignKey: "warehouse_id" });

//------------ Warehouse Subpart Inventory
Warehouses.hasMany(Inventory_Subpart, { foreignKey: "warehouse_id" });
Inventory_Subpart.belongsTo(Warehouses, { foreignKey: "warehouse_id" });

//------------- Purchase Order Product------------
PR.hasMany(PR_PO, { foreignKey: "pr_id" });
PR_PO.belongsTo(PR, { foreignKey: "pr_id" });

ProductTAGSupplier.hasMany(PR_PO, { foreignKey: "product_tag_supplier_ID" });
PR_PO.belongsTo(ProductTAGSupplier, { foreignKey: "product_tag_supplier_ID" });

//-------------PO reject with remarks -------------------
PR.hasMany(PO_REJECT, { foreignKey: "pr_id" });
PO_REJECT.belongsTo(PR, { foreignKey: "pr_id" });

MasterList.hasMany(PO_REJECT, { foreignKey: "masterlist_id" });
PO_REJECT.belongsTo(MasterList, { foreignKey: "masterlist_id" });

//-------------Pr reject with remarks -------------------
PR.hasMany(PR_REJECT, { foreignKey: "pr_id" });
PR_REJECT.belongsTo(PR, { foreignKey: "pr_id" });

MasterList.hasMany(PR_REJECT, { foreignKey: "masterlist_id" });
PR_REJECT.belongsTo(MasterList, { foreignKey: "masterlist_id" });

//------------- Purchase Order Assembly------------
PR.hasMany(PR_PO_asmbly, { foreignKey: "pr_id" });
PR_PO_asmbly.belongsTo(PR, { foreignKey: "pr_id" });

Assembly_Supplier.hasMany(PR_PO_asmbly, {
  foreignKey: "assembly_suppliers_ID",
});
PR_PO_asmbly.belongsTo(Assembly_Supplier, {
  foreignKey: "assembly_suppliers_ID",
});

//------------- Purchase Order Spare------------
PR.hasMany(PR_PO_spare, { foreignKey: "pr_id" });
PR_PO_spare.belongsTo(PR, { foreignKey: "pr_id" });

SparePart_Supplier.hasMany(PR_PO_spare, { foreignKey: "spare_suppliers_ID" });
PR_PO_spare.belongsTo(SparePart_Supplier, { foreignKey: "spare_suppliers_ID" });

//------------- Purchase Order Subpart------------
PR.hasMany(PR_PO_subpart, { foreignKey: "pr_id" });
PR_PO_subpart.belongsTo(PR, { foreignKey: "pr_id" });

Subpart_supplier.hasMany(PR_PO_subpart, { foreignKey: "subpart_suppliers_ID" });
PR_PO_subpart.belongsTo(Subpart_supplier, {
  foreignKey: "subpart_suppliers_ID",
});

PR_PO.hasMany(Receiving_Prd, { foreignKey: "canvassed_id" });
Receiving_Prd.belongsTo(PR_PO, { foreignKey: "canvassed_id" });

PR_PO_asmbly.hasMany(Receiving_Asm, { foreignKey: "canvassed_id" });
Receiving_Asm.belongsTo(PR_PO_asmbly, { foreignKey: "canvassed_id" });

PR_PO_spare.hasMany(Receiving_Spare, { foreignKey: "canvassed_id" });
Receiving_Spare.belongsTo(PR_PO_spare, { foreignKey: "canvassed_id" });

PR_PO_subpart.hasMany(Receiving_Subpart, { foreignKey: "canvassed_id" });
Receiving_Subpart.belongsTo(PR_PO_subpart, { foreignKey: "canvassed_id" });

Receiving_PO.hasMany(Receiving_Prd, { foreignKey: "receiving_po_id" });
Receiving_Prd.belongsTo(Receiving_PO, { foreignKey: "receiving_po_id" });

MasterList.hasMany(Receiving_PO, { foreignKey: "masterlist_id" });
Receiving_PO.belongsTo(MasterList, { foreignKey: "masterlist_id" });

Receiving_PO.hasMany(Receiving_Asm, { foreignKey: "receiving_po_id" });
Receiving_Asm.belongsTo(Receiving_PO, { foreignKey: "receiving_po_id" });

Receiving_PO.hasMany(Receiving_Spare, { foreignKey: "receiving_po_id" });
Receiving_Spare.belongsTo(Receiving_PO, { foreignKey: "receiving_po_id" });

Receiving_PO.hasMany(Receiving_Subpart, { foreignKey: "receiving_po_id" });
Receiving_Subpart.belongsTo(Receiving_PO, { foreignKey: "receiving_po_id" });



//for initial received (davao received)
PR_PO.hasMany(Receiving_initial_prd, { foreignKey: "canvassed_id" });
Receiving_initial_prd.belongsTo(PR_PO, { foreignKey: "canvassed_id" });

PR_PO_asmbly.hasMany(Receiving_initial_asm, { foreignKey: "canvassed_id" });
Receiving_initial_asm.belongsTo(PR_PO_asmbly, { foreignKey: "canvassed_id" });

PR_PO_spare.hasMany(Receiving_initial_spare, { foreignKey: "canvassed_id" });
Receiving_initial_spare.belongsTo(PR_PO_spare, { foreignKey: "canvassed_id" });

PR_PO_subpart.hasMany(Receiving_initial_subpart, { foreignKey: "canvassed_id" });
Receiving_initial_subpart.belongsTo(PR_PO_subpart, { foreignKey: "canvassed_id" });

Receiving_PO.hasMany(Receiving_initial_prd, { foreignKey: "receiving_po_id" });
Receiving_initial_prd.belongsTo(Receiving_PO, { foreignKey: "receiving_po_id" });

Receiving_PO.hasMany(Receiving_initial_asm, { foreignKey: "receiving_po_id" });
Receiving_initial_asm.belongsTo(Receiving_PO, { foreignKey: "receiving_po_id" });

Receiving_PO.hasMany(Receiving_initial_spare, { foreignKey: "receiving_po_id" });
Receiving_initial_spare.belongsTo(Receiving_PO, { foreignKey: "receiving_po_id" });

Receiving_PO.hasMany(Receiving_initial_subpart, { foreignKey: "receiving_po_id" });
Receiving_initial_subpart.belongsTo(Receiving_PO, { foreignKey: "receiving_po_id" });

PR.hasMany(Receiving_PO, { foreignKey: "pr_id" });
Receiving_PO.belongsTo(PR, { foreignKey: "pr_id" });

PR.hasMany(Receiving_Image, { foreignKey: "pr_id" });
Receiving_Image.belongsTo(PR, { foreignKey: "pr_id" });

PR.hasMany(PR_Rejustify, { foreignKey: "pr_id" });
PR_Rejustify.belongsTo(PR, { foreignKey: "pr_id" });

MasterList.hasMany(PR_Rejustify, { foreignKey: "masterlist_id" });
PR_Rejustify.belongsTo(MasterList, { foreignKey: "masterlist_id" });

module.exports = {
  MasterList,
  UserRole,
  Product,
  Activity_Log,

  ProductTAGSupplier,
  Product_Assembly,
  Product_Spareparts,
  Product_Subparts,
  Product_image,
  productTAGsupplierHistory,
  Product_Sub_Assembly,
  Product_Spare_Parts,
  Product_Assm,

  Category,
  BinLocation,
  Manufacturer,

  Supplier,
  CostCenter,

  SubPart,
  Subpart_supplier,
  Subpart_image,
  Subpart_Price_History,

  SparePart,
  SparePart_SubPart,
  SparePart_Supplier,
  SparePart_image,
  SparePartPrice_history,

  Assembly,
  Assembly_Supplier,
  Assembly_SparePart,
  Assembly_SubPart,
  AssemblyPrice_History,
  Assembly_image,

  Inventory,
  Inventory_Assembly,
  Inventory_Spare,
  Inventory_Subpart,
  Issuance,
  IssuedProduct,
  IssuedAssembly,
  IssuedSpare,
  IssuedSubpart,
  IssuedApproveProduct,
  IssuedApproveAssembly,
  IssuedApproveSpare,
  IssuedApproveSubpart,

  IssuedReturn,
  IssuedReturn_asm,
  IssuedReturn_spare,
  IssuedReturn_subpart,

  PR,
  PR_product,
  PR_assembly,
  PR_sparePart,
  PR_subPart,
  PR_history,
  PR_Rejustify,
  PR_PO,
  PR_REJECT,
  PO_REJECT,
  PR_PO_asmbly,
  PR_PO_spare,
  PR_PO_subpart,
  PO_Received,

  Receiving_PO,
  Receiving_Prd,
  Receiving_Asm,
  Receiving_Spare,
  Receiving_Subpart,
  Receiving_Image,
  Receiving_initial_prd,
  Receiving_initial_asm,
  Receiving_initial_spare,
  Receiving_initial_subpart,


  StockTransfer,
  StockTransfer_prod,
  StockTransfer_assembly,
  StockTransfer_spare,
  StockTransfer_subpart,
  Stock_Rejustify,
  Stock_History,
  ST_REJECT,

  Warehouses,
  Department,
};
