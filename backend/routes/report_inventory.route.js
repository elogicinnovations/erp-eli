const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
// const Supplier_SparePart = require('../db/models/sparePart_supplier..model')
const {
  Inventory,
  Product,
  ProductTAGSupplier,
  Inventory_Assembly,
  Assembly,
  SparePart,
  Manufacturer,
  Supplier,
  SubPart,
  Inventory_Spare,
  Inventory_Subpart,
  Assembly_Supplier,
  SparePart_Supplier,
  Subpart_supplier,
  Warehouses,
  PR_PO,
  PR,
  PR_PO_asmbly,
} = require("../db/models/associations");
const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/inventoryPRD").get(async (req, res) => {
  try {
    const data = await Inventory.findAll({
      include: [
        {
          model: ProductTAGSupplier,
          required: true,
          include: [
            {
              model: Product,
              required: true,
              include: [
                {
                  model: Manufacturer,
                  required: true,
                },
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
        {
          model: Warehouses,
          required: true
        }
      ],
    });

    const groupedProductData = {};

    // Define a function to calculate the total quantity from PR_PO
    const calculatePRQuantity = async (productID) => {
      const prItems = await PR_PO.findAll({
       include: [{
        model: ProductTAGSupplier,
        required: true,
        where: {
          // Filter PR_PO by productID
          product_id: productID,
        }
       },
        {
          model: PR,
          required: true,
          where:{
            status: 'To-Receive'
          }
        }
      ]
      });

      let totalPRQuantity = 0; // New variable for total quantity from PR_PO
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPRQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPRQuantity}`);
      return totalPRQuantity;
    };

    // Loop through each inventory item
    for (const item of data) {
      const inventory_id = item.inventory_id;
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.product_tag_supplier?.product?.product_id;
      const productCode = item.product_tag_supplier?.product?.product_code;
      const productName = item.product_tag_supplier?.product?.product_name;
      const UOM = item.product_tag_supplier?.product?.product_unitMeasurement;
      const createdAtt = item.product_tag_supplier?.product?.createdAt;
      const Manufacturer = item.product_tag_supplier?.product?.manufacturer?.manufacturer_name;
      const Price = item.price;

      if (warehouseId && productCode && productName) {
        const key = `${warehouseId}_${productCode}_${productName}`;

        if (!groupedProductData[key]) {
          groupedProductData[key] = {
            createdAt: createdAtt,
            UOM: UOM,
            inventory_id: inventory_id,
            productID: productID,
            warehouseId: warehouseId,
            product_code: productCode,
            product_name: productName,
            manufacturer: Manufacturer,
            totalQuantity: 0,
            totalPRQuantity: 0, // New variable for total quantity from PR_PO
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        // Calculate the total quantity from PR_PO
        const totalPRQuantity = await calculatePRQuantity(productID);

        groupedProductData[key].totalPRQuantity += totalPRQuantity; // Update the new variable
        groupedProductData[key].totalQuantity += item.quantity; // Update the existing totalQuantity
        groupedProductData[key].products.push(item);
      }
    }

    const finalResult_PRD = Object.values(groupedProductData);




    // --------------------------------- ASSEMBLY -----------------------------


   

    return res.json(finalResult_PRD);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});



router.route("/inventoryASM").get(async (req, res) => {
  try {
    const data_asm = await Inventory_Assembly.findAll({
      include: [
        {
          model: Assembly_Supplier,
          required: true,
          include: [
            {
              model: Assembly,
              required: true,
              include: [
                {
                  model: Manufacturer,
                  required: true,
                },
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
        {
          model: Warehouses,
          required: true
        }
      ],
    });

    const groupedProductData_asm = {};

    // Define a function to calculate the total quantity from PR_PO
    const calculatePRQuantity_asm = async (productID) => {
      const prItems_asm = await PR_PO_asmbly.findAll({
       include: [{
        model: Assembly_Supplier,
        required: true,
        where: {
          // Filter PR_PO by productID
          assembly_id: productID,
        }
       },
        {
          model: PR,
          required: true,
          where:{
            status: 'To-Receive'
          }
        }
      ]
      });

      let totalPRQuantity_asm = 0; // New variable for total quantity from PR_PO
      // Sum up the quantity from PR_PO
      prItems_asm.forEach((prItem) => {
        totalPRQuantity_asm += prItem.quantity;
      });
      console.log(`Total Quantity for Product ID ${productID}: ${totalPRQuantity_asm}`);
      return totalPRQuantity_asm;
    };

    // Loop through each inventory item
    for (const item of data_asm) {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.assembly_supplier?.assembly?.id;
      const productCode = item.assembly_supplier?.assembly?.assembly_code;
      const productName = item.assembly_supplier?.assembly?.assembly_name;
      const Manufacturer =
        item.assembly_supplier?.assembly?.manufacturer?.manufacturer_name;
      const Price = item.price;
    
      const inventory_id = item.inventory_id;
      const UOM = item.assembly_supplier?.assembly?.assembly_unitMeasurement;
      const createdAtt = item.assembly_supplier?.assembly?.createdAt;

      if (warehouseId && productCode && productName) {
        const key = `${warehouseId}_${productCode}_${productName}`;

        if (!groupedProductData_asm[key]) {
          groupedProductData_asm[key] = {
            createdAt: createdAtt,
            UOM: UOM,
            inventory_id: inventory_id,
            productID: productID,
            warehouseId: warehouseId,
            product_code: productCode,
            product_name: productName,
            manufacturer: Manufacturer,
            totalQuantity: 0,
            totalPRQuantity_asm: 0, // New variable for total quantity from PR_PO
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        // Calculate the total quantity from PR_PO
        const totalPRQuantity_asm = await calculatePRQuantity_asm(productID);

        groupedProductData_asm[key].totalPRQuantity_asm += totalPRQuantity_asm; // Update the new variable
        groupedProductData_asm[key].totalQuantity += item.quantity; // Update the existing totalQuantity
        groupedProductData_asm[key].products.push(item);
      }
    }

    const finalResult_asm = Object.values(groupedProductData_asm);

   

    return res.json(finalResult_asm);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

module.exports = router;
