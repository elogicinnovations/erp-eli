const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const moment = require("moment-timezone");
// const Supplier_SparePart = require('../db/models/sparePart_supplier..model')
const {
  Inventory,
  Product,
  Category,
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
  PR_PO_spare,
  PR_PO_subpart,
  IssuedApproveProduct,
  Issuance,
  IssuedApproveAssembly,
  IssuedApproveSpare,
  IssuedApproveSubpart,
  Receiving_PO,
  Receiving_Prd,
  Receiving_initial_asm,
  Receiving_Asm,
  Receiving_initial_spare,
  Receiving_Spare,
  Receiving_initial_subpart,
  Receiving_Subpart,
} = require("../db/models/associations");
const session = require("express-session");
const ReceivingInitial_Prd = require("../db/models/receiving_initial_prd.model");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/inventoryPRD").get(async (req, res) => {
  try {
    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    // Get the current date in Manila timezone
    const currentDate = moment();

    // Get the first date of the current month
    const firstDateOfMonth = currentDate.clone().startOf("month");

    // Get the last date of the current month
    const lastDateOfMonth = currentDate.clone().endOf("month");

    // console.log("First date of current month:", firstDateOfMonth.format('YYYY-MM-DD'));
    // console.log("Last date of current month:", lastDateOfMonth.format('YYYY-MM-DD'));

    const data = await Inventory.findAll({
      include: [
        {
          model: ProductTAGSupplier,
          required: true,
          include: [
            {
              model: Product,
              required: true,
            
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
    });

    const groupedProductData = {};

    // Define a function to calculate the total quantity from PR_PO
    const calculatePRQuantity = async (productID) => {
      const prItems = await PR_PO.findAll({
        include: [
          {
            model: ProductTAGSupplier,
            required: true,
            where: {
              // Filter PR_PO by productID
              product_id: productID,
            },
          },
          {
            model: PR,
            required: true,
            where: {
              status: "To-Receive",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPRQuantity = 0; // New variable for total quantity from PR_PO
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPRQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPRQuantity}`);
      return totalPRQuantity;
    };

    const calculatePR_INtransit_Quantity = async (productID) => {
      const prItems = await ReceivingInitial_Prd.findAll({
        include: [
          {
            model: PR_PO,
            required: true,

            include: [
              {
                model: ProductTAGSupplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  product_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "In-transit",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_intransit_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_intransit_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_intransit_Quantity}`);
      return totalPR_intransit_Quantity;
    };

    const calculatePR_Approval_Quantity = async (productID) => {
      const prItems = await Receiving_Prd.findAll({
        include: [
          {
            model: PR_PO,
            required: true,

            include: [
              {
                model: ProductTAGSupplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  product_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "For Approval",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_Approval_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_Approval_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_Approval_Quantity;
    };

    const calculatePR_received_Quantity = async (productID) => {
      const prItems = await Receiving_Prd.findAll({
        include: [
          {
            model: PR_PO,
            required: true,

            include: [
              {
                model: ProductTAGSupplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  product_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: { [Op.ne]: "For Approval" },
              // status:{ [Op.ne]: 'In-transit'},
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_received_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_received_Quantity = prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_received_Quantity;
    };

    // Define a function to calculate the total quantity from issued
    const calculateIssuanceQuantity = async (productID) => {
      const IssuedItems = await IssuedApproveProduct.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              firstDateOfMonth.format("YYYY-MM-DD"),
              lastDateOfMonth.format("YYYY-MM-DD"),
            ],
          },
        },
        include: [
          {
            model: Inventory,
            required: true,

            include: [
              {
                model: ProductTAGSupplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  product_id: productID,
                },
              },
            ],
          },
        ],
      });

      let totalIssuedQuantity = 0; // New variable for total quantity from issued
      // Sum up the quantity from issued
      IssuedItems.forEach((prItem) => {
        totalIssuedQuantity += prItem.quantity;
      });
      console.log(
        `Total Quantity Issuance for Product ID ${productID}: ${totalIssuedQuantity}`
      );
      return totalIssuedQuantity;
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
            
            totalQuantity: 0,
            totalPRQuantity: 0,
            totalPR_intransit_Quantity: 0,
            totalPR_Approval_Quantity: 0,
            totalIssuedQuantity: 0,
            totalPR_received_Quantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        // Calculate the total quantity from PR_PO
        const totalPRQuantity = await calculatePRQuantity(productID);
        const totalPR_Approval_Quantity = await calculatePR_Approval_Quantity(
          productID
        );
        const totalPR_intransit_Quantity = await calculatePR_INtransit_Quantity(
          productID
        );
        const totalIssuedQuantity = await calculateIssuanceQuantity(productID);
        const totalPR_received_Quantity = await calculatePR_received_Quantity(
          productID
        );

        groupedProductData[key].totalPR_received_Quantity +=
          totalPR_received_Quantity;
        groupedProductData[key].totalPR_Approval_Quantity +=
          totalPR_Approval_Quantity;
        groupedProductData[key].totalPR_intransit_Quantity +=
          totalPR_intransit_Quantity;
        groupedProductData[key].totalPRQuantity += totalPRQuantity;
        groupedProductData[key].totalIssuedQuantity += totalIssuedQuantity;

        groupedProductData[key].totalQuantity += item.quantity;
        groupedProductData[key].products.push(item);
      }
    }

    const finalResult_PRD = Object.values(groupedProductData);

    return res.json(finalResult_PRD);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/inventoryASM").get(async (req, res) => {
  try {
    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    // Get the current date in Manila timezone
    const currentDate = moment();

    // Get the first date of the current month
    const firstDateOfMonth = currentDate.clone().startOf("month");

    // Get the last date of the current month
    const lastDateOfMonth = currentDate.clone().endOf("month");

    // console.log("First date of current month:", firstDateOfMonth.format('YYYY-MM-DD'));
    // console.log("Last date of current month:", lastDateOfMonth.format('YYYY-MM-DD'));

    const data_asm = await Inventory_Assembly.findAll({
      include: [
        {
          model: Assembly_Supplier,
          required: true,
          include: [
            {
              model: Assembly,
              required: true,
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
    });

    const groupedProductData_asm = {};

    // Define a function to calculate the total quantity from issued
    const calculateIssuanceQuantity = async (productID) => {
      const IssuedItems = await IssuedApproveAssembly.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              firstDateOfMonth.format("YYYY-MM-DD"),
              lastDateOfMonth.format("YYYY-MM-DD"),
            ],
          },
        },
        include: [
          {
            model: Inventory_Assembly,
            required: true,

            include: [
              {
                model: Assembly_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  assembly_id: productID,
                },
              },
            ],
          },
        ],
      });

      let totalIssuedQuantity = 0; // New variable for total quantity from issued
      // Sum up the quantity from issued
      IssuedItems.forEach((prItem) => {
        totalIssuedQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity Issuance for Product ID ${productID}: ${totalIssuedQuantity}`);
      return totalIssuedQuantity;
    };

    // Define a function to calculate the total quantity from PR_PO
    const calculatePRQuantity_asm = async (productID) => {
      const prItems_asm = await PR_PO_asmbly.findAll({
        include: [
          {
            model: Assembly_Supplier,
            required: true,
            where: {
              // Filter PR_PO by productID
              assembly_id: productID,
            },
          },
          {
            model: PR,
            required: true,
            where: {
              status: "To-Receive",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPRQuantity_asm = 0; // New variable for total quantity from PR_PO
      // Sum up the quantity from PR_PO
      prItems_asm.forEach((prItem) => {
        totalPRQuantity_asm += prItem.quantity;
      });
      console.log(
        `Total Quantity for Product ID ${productID}: ${totalPRQuantity_asm}`
      );
      return totalPRQuantity_asm;
    };

    const calculatePR_INtransit_Quantity = async (productID) => {
      const prItems = await Receiving_initial_asm.findAll({
        include: [
          {
            model: PR_PO_asmbly,
            required: true,

            include: [
              {
                model: Assembly_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  assembly_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "In-transit",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_intransit_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_intransit_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_intransit_Quantity}`);
      return totalPR_intransit_Quantity;
    };

    const calculatePR_Approval_Quantity = async (productID) => {
      const prItems = await Receiving_Asm.findAll({
        include: [
          {
            model: PR_PO_asmbly,
            required: true,

            include: [
              {
                model: Assembly_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  assembly_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "For Approval",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_Approval_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_Approval_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_Approval_Quantity;
    };

    const calculatePR_received_Quantity = async (productID) => {
      const prItems = await Receiving_Asm.findAll({
        include: [
          {
            model: PR_PO_asmbly,
            required: true,

            include: [
              {
                model: Assembly_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  assembly_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: { [Op.ne]: "For Approval" },
              status:{ [Op.ne]: 'In-transit'},
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_received_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_received_Quantity = prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_received_Quantity;
    };

    // Loop through each inventory item
    for (const item of data_asm) {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.assembly_supplier?.assembly?.id;
      const productCode = item.assembly_supplier?.assembly?.assembly_code;
      const productName = item.assembly_supplier?.assembly?.assembly_name;

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
            
            totalQuantity: 0,
            totalPRQuantity_asm: 0,
            totalPR_intransit_Quantity: 0,
            totalPR_Approval_Quantity: 0,
            totalIssuedQuantity: 0,
            totalPR_received_Quantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        // Calculate the total quantity from PR_PO
        const totalPRQuantity_asm = await calculatePRQuantity_asm(productID);
        const totalIssuedQuantity = await calculateIssuanceQuantity(productID);
        const totalPR_Approval_Quantity = await calculatePR_Approval_Quantity(
          productID
        );
        const totalPR_intransit_Quantity = await calculatePR_INtransit_Quantity(
          productID
        );
        const totalPR_received_Quantity = await calculatePR_received_Quantity(
          productID
        );

        groupedProductData_asm[key].totalPR_received_Quantity +=
          totalPR_received_Quantity;
        groupedProductData_asm[key].totalPR_Approval_Quantity +=
          totalPR_Approval_Quantity;
        groupedProductData_asm[key].totalPR_intransit_Quantity +=
          totalPR_intransit_Quantity;
        groupedProductData_asm[key].totalPRQuantity_asm += totalPRQuantity_asm; // Update the new variable
        groupedProductData_asm[key].totalQuantity += item.quantity;

        groupedProductData_asm[key].totalIssuedQuantity += totalIssuedQuantity; // Update the new variable
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

router.route("/inventorySPR").get(async (req, res) => {
  try {
    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    // Get the current date in Manila timezone
    const currentDate = moment();

    // Get the first date of the current month
    const firstDateOfMonth = currentDate.clone().startOf("month");

    // Get the last date of the current month
    const lastDateOfMonth = currentDate.clone().endOf("month");

    // console.log("First date of current month:", firstDateOfMonth.format('YYYY-MM-DD'));
    // console.log("Last date of current month:", lastDateOfMonth.format('YYYY-MM-DD'));

    const data = await Inventory_Spare.findAll({
      include: [
        {
          model: SparePart_Supplier,
          required: true,
          include: [
            {
              model: SparePart,
              required: true,
             
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
    });

    const groupedProductData = {};

    // Define a function to calculate the total quantity from PR_PO
    const calculatePRQuantity = async (productID) => {
      const prItems = await PR_PO_spare.findAll({
        include: [
          {
            model: SparePart_Supplier,
            required: true,
            where: {
              // Filter PR_PO by productID
              sparePart_id: productID,
            },
          },
          {
            model: PR,
            required: true,
            where: {
              status: "To-Receive",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPRQuantity = 0; // New variable for total quantity from PR_PO
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPRQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPRQuantity}`);
      return totalPRQuantity;
    };

    // Define a function to calculate the total quantity from issued
    const calculateIssuanceQuantity = async (productID) => {
      const IssuedItems = await IssuedApproveSpare.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              firstDateOfMonth.format("YYYY-MM-DD"),
              lastDateOfMonth.format("YYYY-MM-DD"),
            ],
          },
        },
        include: [
          {
            model: Inventory_Spare,
            required: true,

            include: [
              {
                model: SparePart_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  sparePart_id: productID,
                },
              },
            ],
          },
        ],
      });

      let totalIssuedQuantity = 0; // New variable for total quantity from issued
      // Sum up the quantity from issued
      IssuedItems.forEach((prItem) => {
        totalIssuedQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity Issuance for Product ID ${productID}: ${totalIssuedQuantity}`);
      return totalIssuedQuantity;
    };

    const calculatePR_INtransit_Quantity = async (productID) => {
      const prItems = await Receiving_initial_spare.findAll({
        include: [
          {
            model: PR_PO_spare,
            required: true,

            include: [
              {
                model: SparePart_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  sparePart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "In-transit",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_intransit_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_intransit_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_intransit_Quantity}`);
      return totalPR_intransit_Quantity;
    };

    const calculatePR_Approval_Quantity = async (productID) => {
      const prItems = await Receiving_Spare.findAll({
        include: [
          {
            model: PR_PO_spare,
            required: true,

            include: [
              {
                model: SparePart_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  sparePart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "For Approval",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_Approval_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_Approval_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_Approval_Quantity;
    };

    const calculatePR_received_Quantity = async (productID) => {
      const prItems = await Receiving_Spare.findAll({
        include: [
          {
            model: PR_PO_spare,
            required: true,

            include: [
              {
                model: SparePart_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  sparePart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: { [Op.ne]: "For Approval" },
              // status:{ [Op.ne]: 'In-transit'},
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_received_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_received_Quantity = prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_received_Quantity;
    };

    // Loop through each inventory item
    for (const item of data) {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.sparepart_supplier?.sparePart?.id;
      const productCode = item.sparepart_supplier?.sparePart?.spareParts_code;
      const productName = item.sparepart_supplier?.sparePart?.spareParts_name;
     
      const Price = item.price;
      const inventory_id = item.inventory_id;
      const UOM =
        item.sparepart_supplier?.sparePart?.spareParts_unitMeasurement;
      const createdAtt = item.sparepart_supplier?.sparePart?.createdAt;

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
        
            totalQuantity: 0,
            totalPRQuantity: 0,
            totalIssuedQuantity: 0,
            totalPR_intransit_Quantity: 0,
            totalPR_Approval_Quantity: 0,
            totalPR_received_Quantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        // Calculate the total quantity from PR_PO
        const totalPRQuantity = await calculatePRQuantity(productID);
        const totalIssuedQuantity = await calculateIssuanceQuantity(productID);
        const totalPR_Approval_Quantity = await calculatePR_Approval_Quantity(
          productID
        );
        const totalPR_intransit_Quantity = await calculatePR_INtransit_Quantity(
          productID
        );
        const totalPR_received_Quantity = await calculatePR_received_Quantity(
          productID
        );

        groupedProductData[key].totalPR_received_Quantity +=
          totalPR_received_Quantity;
        groupedProductData[key].totalPR_Approval_Quantity +=
          totalPR_Approval_Quantity;
        groupedProductData[key].totalPR_intransit_Quantity +=
          totalPR_intransit_Quantity;
        groupedProductData[key].totalIssuedQuantity += totalIssuedQuantity;
        groupedProductData[key].totalPRQuantity += totalPRQuantity;

        groupedProductData[key].totalQuantity += item.quantity;
        groupedProductData[key].products.push(item);
      }
    }

    const finalResult_spr = Object.values(groupedProductData);

    return res.json(finalResult_spr);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/inventorySBP").get(async (req, res) => {
  try {
    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    // Get the current date in Manila timezone
    const currentDate = moment();

    // Get the first date of the current month
    const firstDateOfMonth = currentDate.clone().startOf("month");

    // Get the last date of the current month
    const lastDateOfMonth = currentDate.clone().endOf("month");

    // console.log("First date of current month:", firstDateOfMonth.format('YYYY-MM-DD'));
    // console.log("Last date of current month:", lastDateOfMonth.format('YYYY-MM-DD'));

    const data = await Inventory_Subpart.findAll({
      include: [
        {
          model: Subpart_supplier,
          required: true,
          include: [
            {
              model: SubPart,
              required: true,
              
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
    });

    const groupedProductData = {};

    // Define a function to calculate the total quantity from PR_PO
    const calculatePRQuantity = async (productID) => {
      const prItems = await PR_PO_subpart.findAll({
        include: [
          {
            model: Subpart_supplier,
            required: true,
            where: {
              // Filter PR_PO by productID
              subpart_id: productID,
            },
          },
          {
            model: PR,
            required: true,
            where: {
              status: "To-Receive",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPRQuantity = 0; // New variable for total quantity from PR_PO
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPRQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPRQuantity}`);
      return totalPRQuantity;
    };

    const calculatePR_INtransit_Quantity = async (productID) => {
      const prItems = await Receiving_initial_subpart.findAll({
        include: [
          {
            model: PR_PO_subpart,
            required: true,

            include: [
              {
                model: Subpart_supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  subpart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "In-transit",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_intransit_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_intransit_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_intransit_Quantity}`);
      return totalPR_intransit_Quantity;
    };

    const calculatePR_Approval_Quantity = async (productID) => {
      const prItems = await Receiving_Subpart.findAll({
        include: [
          {
            model: PR_PO_subpart,
            required: true,

            include: [
              {
                model: Subpart_supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  subpart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "For Approval",
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_Approval_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_Approval_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_Approval_Quantity;
    };

    const calculatePR_received_Quantity = async (productID) => {
      const prItems = await Receiving_Subpart.findAll({
        include: [
          {
            model: PR_PO_subpart,
            required: true,

            include: [
              {
                model: Subpart_supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  subpart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: { [Op.ne]: "For Approval" },
              // status:{ [Op.ne]: 'In-transit'},
              createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
            },
          },
        ],
      });

      let totalPR_received_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_received_Quantity = prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_received_Quantity;
    };

    // Define a function to calculate the total quantity from issued
    const calculateIssuanceQuantity = async (productID) => {
      const IssuedItems = await IssuedApproveSubpart.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              firstDateOfMonth.format("YYYY-MM-DD"),
              lastDateOfMonth.format("YYYY-MM-DD"),
            ],
          },
        },
        include: [
          {
            model: Inventory_Subpart,
            required: true,

            include: [
              {
                model: Subpart_supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  subpart_id: productID,
                },
              },
            ],
          },
        ],
      });

      let totalIssuedQuantity = 0; // New variable for total quantity from issued
      // Sum up the quantity from issued
      IssuedItems.forEach((prItem) => {
        totalIssuedQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity Issuance for Product ID ${productID}: ${totalIssuedQuantity}`);
      return totalIssuedQuantity;
    };

    // Loop through each inventory item
    for (const item of data) {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.subpart_supplier?.subPart?.id;
      const productCode = item.subpart_supplier?.subPart?.subPart_code;
      const productName = item.subpart_supplier?.subPart?.subPart_name;

      const Price = item.price;

      const inventory_id = item.inventory_id;
      const UOM = item.subpart_supplier?.subPart?.subPart_unitMeasurement;
      const createdAtt = item.subpart_supplier?.subPart?.createdAt;

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

            totalQuantity: 0,
            totalPRQuantity: 0,
            totalIssuedQuantity: 0,
            totalPR_intransit_Quantity: 0,
            totalPR_Approval_Quantity: 0,
            totalPR_received_Quantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        // Calculate the total quantity from PR_PO
        const totalPRQuantity = await calculatePRQuantity(productID);
        const totalIssuedQuantity = await calculateIssuanceQuantity(productID);
        const totalPR_Approval_Quantity = await calculatePR_Approval_Quantity(
          productID
        );
        const totalPR_intransit_Quantity = await calculatePR_INtransit_Quantity(
          productID
        );
        const totalPR_received_Quantity = await calculatePR_received_Quantity(
          productID
        );

        groupedProductData[key].totalPR_received_Quantity +=
          totalPR_received_Quantity;
        groupedProductData[key].totalPR_Approval_Quantity +=
          totalPR_Approval_Quantity;
        groupedProductData[key].totalPR_intransit_Quantity +=
          totalPR_intransit_Quantity;
        groupedProductData[key].totalIssuedQuantity += totalIssuedQuantity;
        groupedProductData[key].totalPRQuantity += totalPRQuantity;

        groupedProductData[key].totalQuantity += item.quantity;
        groupedProductData[key].products.push(item);
      }
    }

    const finalResult_PRD = Object.values(groupedProductData);

    return res.json(finalResult_PRD);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/Filtered_prd").get(async (req, res) => {
  try {
    const { slctCategory, slctWarehouse, strDate, enDate } = req.query;

    const startDates = new Date(strDate);
    startDates.setDate(startDates.getDate() + 1);
    const startDate = startDates.toISOString().slice(0, 10) + " 00:00:00";

    const endDates = new Date(enDate);
    endDates.setDate(endDates.getDate() + 1);
    const endDate = endDates.toISOString().slice(0, 10) + " 23:59:59";

    //   const startDates = new Date(strDate);
    // startDates.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    // const startDate = startDates.toISOString().slice(0, 10) + ' 00:00:00';

    // const endDates = new Date(enDate);
    // endDates.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    // const endDate = endDates.toISOString().slice(0, 10) + ' 11:59:59';
    const whereClause = {};

    // Check if slctWarehouse is not "All", then add it to whereClause
    if (slctWarehouse !== "All") {
      whereClause.warehouse_id = slctWarehouse;
    }

    // Check if slctCategory is not "All", then add it to whereClause
    if (slctCategory !== "All") {
      // Adjust the include and where clauses to target the Product model
      whereClause['$product_tag_supplier.product.product_category$'] = slctCategory;
    }
    
    
    
    const data = await Inventory.findAll({
      where: whereClause,
      include: [
        {
          model: ProductTAGSupplier,
          required: true,
          include: [
            {
              model: Product,
              required: true,
              // where: whereClause, // Include where clause for Product model
             
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
    });
    

    const groupedProductData = {};

    // Define a function to calculate the total quantity from PR_PO
    const calculatePRQuantity = async (productID) => {
      const prItems = await PR_PO.findAll({
        include: [
          {
            model: ProductTAGSupplier,
            required: true,
            where: {
              // Filter PR_PO by productID
              product_id: productID,
            },
          },
          {
            model: PR,
            required: true,
            where: {
              status: "To-Receive",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPRQuantity = 0; // New variable for total quantity from PR_PO
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPRQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPRQuantity}`);
      return totalPRQuantity;
    };

    const calculatePR_INtransit_Quantity = async (productID) => {
      const prItems = await ReceivingInitial_Prd.findAll({
        include: [
          {
            model: PR_PO,
            required: true,

            include: [
              {
                model: ProductTAGSupplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  product_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "In-transit",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_intransit_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_intransit_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_intransit_Quantity}`);
      return totalPR_intransit_Quantity;
    };

    const calculatePR_Approval_Quantity = async (productID) => {
      const prItems = await Receiving_Prd.findAll({
        include: [
          {
            model: PR_PO,
            required: true,

            include: [
              {
                model: ProductTAGSupplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  product_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "For Approval",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_Approval_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_Approval_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_Approval_Quantity;
    };

    const calculatePR_received_Quantity = async (productID) => {
      const prItems = await Receiving_Prd.findAll({
        include: [
          {
            model: PR_PO,
            required: true,

            include: [
              {
                model: ProductTAGSupplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  product_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: { [Op.ne]: "For Approval" },
              // status:{ [Op.ne]: 'In-transit'},
              // status:{ [Op.ne]: 'In-transit (Complete)'},

              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_received_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_received_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_received_Quantity;
    };

    // Define a function to calculate the total quantity from issued
    const calculateIssuanceQuantity = async (productID) => {
      const IssuedItems = await IssuedApproveProduct.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: Inventory,
            required: true,

            include: [
              {
                model: ProductTAGSupplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  product_id: productID,
                },
              },
            ],
          },
        ],
      });

      let totalIssuedQuantity = 0; // New variable for total quantity from issued
      // Sum up the quantity from issued
      IssuedItems.forEach((prItem) => {
        totalIssuedQuantity += prItem.quantity;
      });
      console.log(
        `Total Quantity Issuance for Product ID ${productID}: ${totalIssuedQuantity}`
      );
      return totalIssuedQuantity;
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
           
            totalQuantity: 0,
            totalPRQuantity: 0,
            totalPR_intransit_Quantity: 0,
            totalPR_Approval_Quantity: 0,
            totalIssuedQuantity: 0,
            totalPR_received_Quantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        // Calculate the total quantity from PR_PO
        const totalPR_received_Quantity = await calculatePR_received_Quantity(
          productID
        );
        const totalPRQuantity = await calculatePRQuantity(productID);
        const totalPR_Approval_Quantity = await calculatePR_Approval_Quantity(
          productID
        );
        const totalPR_intransit_Quantity = await calculatePR_INtransit_Quantity(
          productID
        );

        const totalIssuedQuantity = await calculateIssuanceQuantity(productID);

        groupedProductData[key].totalPR_received_Quantity +=
          totalPR_received_Quantity;
        groupedProductData[key].totalPR_Approval_Quantity +=
          totalPR_Approval_Quantity;
        groupedProductData[key].totalPR_intransit_Quantity +=
          totalPR_intransit_Quantity;
        groupedProductData[key].totalPRQuantity += totalPRQuantity;
        groupedProductData[key].totalIssuedQuantity += totalIssuedQuantity;

        groupedProductData[key].totalQuantity += item.quantity;
        groupedProductData[key].products.push(item);
      }
    }

    const finalResult_PRD = Object.values(groupedProductData);

    console.log(startDate);
    console.log(endDate);
    return res.json(finalResult_PRD);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/Filtered_asm").get(async (req, res) => {
  try {
    const { slctCategory, slctWarehouse, strDate, enDate } = req.query;

    const startDates = new Date(strDate);
    startDates.setDate(startDates.getDate() + 1);
    const startDate = startDates.toISOString().slice(0, 10) + " 00:00:00";

    const endDates = new Date(enDate);
    endDates.setDate(endDates.getDate() + 1);
    const endDate = endDates.toISOString().slice(0, 10) + " 23:59:59";

    const whereClause = {};
    if (slctCategory !== "All") {
      // whereClause.category_code = slctCategory;
      whereClause["$Assembly_Supplier.Assembly.category_code$"] =
        slctCategory;
    }

    // Check if slctWarehouse is not "All", then add it to whereClause
    if (slctWarehouse !== "All") {
      whereClause.warehouse_id = slctWarehouse;
    }

    const data_asm = await Inventory_Assembly.findAll({
      where: whereClause,
      include: [
        {
          model: Assembly_Supplier,
          required: true,
          include: [
            {
              model: Assembly,
              required: true,
              
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
    });

    const groupedProductData_asm = {};

    // Define a function to calculate the total quantity from issued
    const calculateIssuanceQuantity = async (productID) => {
      const IssuedItems = await IssuedApproveAssembly.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: Inventory_Assembly,
            required: true,

            include: [
              {
                model: Assembly_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  assembly_id: productID,
                },
              },
            ],
          },
        ],
      });

      let totalIssuedQuantity = 0; // New variable for total quantity from issued
      // Sum up the quantity from issued
      IssuedItems.forEach((prItem) => {
        totalIssuedQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity Issuance for Product ID ${productID}: ${totalIssuedQuantity}`);
      return totalIssuedQuantity;
    };

    // Define a function to calculate the total quantity from PR_PO
    const calculatePRQuantity_asm = async (productID) => {
      const prItems_asm = await PR_PO_asmbly.findAll({
        include: [
          {
            model: Assembly_Supplier,
            required: true,
            where: {
              // Filter PR_PO by productID
              assembly_id: productID,
            },
          },
          {
            model: PR,
            required: true,
            where: {
              status: "To-Receive",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPRQuantity_asm = 0; // New variable for total quantity from PR_PO
      // Sum up the quantity from PR_PO
      prItems_asm.forEach((prItem) => {
        totalPRQuantity_asm += prItem.quantity;
      });
      console.log(
        `Total Quantity for Product ID ${productID}: ${totalPRQuantity_asm}`
      );
      return totalPRQuantity_asm;
    };

    const calculatePR_INtransit_Quantity = async (productID) => {
      const prItems = await Receiving_initial_asm.findAll({
        include: [
          {
            model: PR_PO_asmbly,
            required: true,

            include: [
              {
                model: Assembly_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  assembly_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "In-transit",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_intransit_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_intransit_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_intransit_Quantity}`);
      return totalPR_intransit_Quantity;
    };

    const calculatePR_Approval_Quantity = async (productID) => {
      const prItems = await Receiving_Asm.findAll({
        include: [
          {
            model: PR_PO_asmbly,
            required: true,

            include: [
              {
                model: Assembly_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  assembly_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "For Approval",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_Approval_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_Approval_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_Approval_Quantity;
    };

    const calculatePR_received_Quantity = async (productID) => {
      const prItems = await Receiving_Asm.findAll({
        include: [
          {
            model: PR_PO_asmbly,
            required: true,

            include: [
              {
                model: Assembly_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  assembly_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: { [Op.ne]: "For Approval" },
              // status:{ [Op.ne]: 'In-transit'},
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_received_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_received_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_received_Quantity;
    };

    // Loop through each inventory item
    for (const item of data_asm) {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.assembly_supplier?.assembly?.id;
      const productCode = item.assembly_supplier?.assembly?.assembly_code;
      const productName = item.assembly_supplier?.assembly?.assembly_name;

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
            
            totalQuantity: 0,
            totalPRQuantity_asm: 0,
            totalPR_intransit_Quantity: 0,
            totalPR_Approval_Quantity: 0,
            totalIssuedQuantity: 0,
            totalPR_received_Quantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        // Calculate the total quantity from PR_PO
        const totalPRQuantity_asm = await calculatePRQuantity_asm(productID);
        const totalIssuedQuantity = await calculateIssuanceQuantity(productID);
        const totalPR_Approval_Quantity = await calculatePR_Approval_Quantity(
          productID
        );
        const totalPR_intransit_Quantity = await calculatePR_INtransit_Quantity(
          productID
        );
        const totalPR_received_Quantity = await calculatePR_received_Quantity(
          productID
        );

        groupedProductData_asm[key].totalPR_received_Quantity +=
          totalPR_received_Quantity;
        groupedProductData_asm[key].totalPR_Approval_Quantity +=
          totalPR_Approval_Quantity;
        groupedProductData_asm[key].totalPR_intransit_Quantity +=
          totalPR_intransit_Quantity;
        groupedProductData_asm[key].totalPRQuantity_asm += totalPRQuantity_asm; // Update the new variable
        groupedProductData_asm[key].totalQuantity += item.quantity;

        groupedProductData_asm[key].totalIssuedQuantity += totalIssuedQuantity; // Update the new variable
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

router.route("/Filtered_spare").get(async (req, res) => {
  try {
    const { slctCategory, slctWarehouse, strDate, enDate } = req.query;

    const startDates = new Date(strDate);
    startDates.setDate(startDates.getDate() + 1);
    const startDate = startDates.toISOString().slice(0, 10) + " 00:00:00";

    const endDates = new Date(enDate);
    endDates.setDate(endDates.getDate() + 1);
    const endDate = endDates.toISOString().slice(0, 10) + " 23:59:59";

    const whereClause = {};
    // Check if slctCategory is not "All", then add it to whereClause
    if (slctCategory !== "All") {
      // whereClause.category_code = slctCategory;
      whereClause["$SparePart_Supplier.SparePart.category_code$"] =
        slctCategory;
    }

    // Check if slctWarehouse is not "All", then add it to whereClause
    if (slctWarehouse !== "All") {
      whereClause.warehouse_id = slctWarehouse;
    }

    const data = await Inventory_Spare.findAll({
      where: whereClause,
      include: [
        {
          model: SparePart_Supplier,
          required: true,
          include: [
            {
              model: SparePart,
              required: true,
              // where: whereClause,
            
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
    });

    const groupedProductData = {};

    // Define a function to calculate the total quantity from PR_PO
    const calculatePRQuantity = async (productID) => {
      const prItems = await PR_PO_spare.findAll({
        include: [
          {
            model: SparePart_Supplier,
            required: true,
            where: {
              // Filter PR_PO by productID
              sparePart_id: productID,
            },
          },
          {
            model: PR,
            required: true,
            where: {
              status: "To-Receive",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPRQuantity = 0; // New variable for total quantity from PR_PO
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPRQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPRQuantity}`);
      return totalPRQuantity;
    };

    // Define a function to calculate the total quantity from issued
    const calculateIssuanceQuantity = async (productID) => {
      const IssuedItems = await IssuedApproveSpare.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: Inventory_Spare,
            required: true,

            include: [
              {
                model: SparePart_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  sparePart_id: productID,
                },
              },
            ],
          },
        ],
      });

      let totalIssuedQuantity = 0; // New variable for total quantity from issued
      // Sum up the quantity from issued
      IssuedItems.forEach((prItem) => {
        totalIssuedQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity Issuance for Product ID ${productID}: ${totalIssuedQuantity}`);
      return totalIssuedQuantity;
    };

    const calculatePR_INtransit_Quantity = async (productID) => {
      const prItems = await Receiving_initial_spare.findAll({
        include: [
          {
            model: PR_PO_spare,
            required: true,

            include: [
              {
                model: SparePart_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  sparePart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "In-transit",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_intransit_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_intransit_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_intransit_Quantity}`);
      return totalPR_intransit_Quantity;
    };

    const calculatePR_Approval_Quantity = async (productID) => {
      const prItems = await Receiving_Spare.findAll({
        include: [
          {
            model: PR_PO_spare,
            required: true,

            include: [
              {
                model: SparePart_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  sparePart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "For Approval",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_Approval_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_Approval_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_Approval_Quantity;
    };

    const calculatePR_received_Quantity = async (productID) => {
      const prItems = await Receiving_Spare.findAll({
        include: [
          {
            model: PR_PO_spare,
            required: true,

            include: [
              {
                model: SparePart_Supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  sparePart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: { [Op.ne]: "For Approval" },
              // status:{ [Op.ne]: 'In-transit'},
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_received_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_received_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_received_Quantity;
    };

    // Loop through each inventory item
    for (const item of data) {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.sparepart_supplier?.sparePart?.id;
      const productCode = item.sparepart_supplier?.sparePart?.spareParts_code;
      const productName = item.sparepart_supplier?.sparePart?.spareParts_name;
   
      const Price = item.price;
      const inventory_id = item.inventory_id;
      const UOM =
        item.sparepart_supplier?.sparePart?.spareParts_unitMeasurement;
      const createdAtt = item.sparepart_supplier?.sparePart?.createdAt;

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
        
            totalQuantity: 0,
            totalPRQuantity: 0,
            totalIssuedQuantity: 0,
            totalPR_intransit_Quantity: 0,
            totalPR_Approval_Quantity: 0,
            totalPR_received_Quantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        // Calculate the total quantity from PR_PO
        const totalPRQuantity = await calculatePRQuantity(productID);
        const totalIssuedQuantity = await calculateIssuanceQuantity(productID);
        const totalPR_Approval_Quantity = await calculatePR_Approval_Quantity(
          productID
        );
        const totalPR_intransit_Quantity = await calculatePR_INtransit_Quantity(
          productID
        );
        const totalPR_received_Quantity = await calculatePR_received_Quantity(
          productID
        );

        groupedProductData[key].totalPR_received_Quantity +=
          totalPR_received_Quantity;
        groupedProductData[key].totalPR_Approval_Quantity +=
          totalPR_Approval_Quantity;
        groupedProductData[key].totalPR_intransit_Quantity +=
          totalPR_intransit_Quantity;
        groupedProductData[key].totalIssuedQuantity += totalIssuedQuantity;
        groupedProductData[key].totalPRQuantity += totalPRQuantity;

        groupedProductData[key].totalQuantity += item.quantity;
        groupedProductData[key].products.push(item);
      }
    }

    const finalResult_spr = Object.values(groupedProductData);

    return res.json(finalResult_spr);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/Filtered_subpart").get(async (req, res) => {
  try {
    const { slctCategory, slctWarehouse, strDate, enDate } = req.query;

    const startDates = new Date(strDate);
    startDates.setDate(startDates.getDate() + 1);
    const startDate = startDates.toISOString().slice(0, 10) + " 00:00:00";

    const endDates = new Date(enDate);
    endDates.setDate(endDates.getDate() + 1);
    const endDate = endDates.toISOString().slice(0, 10) + " 23:59:59";

    const whereClause = {};
    // Check if slctCategory is not "All", then add it to whereClause
    if (slctCategory !== "All") {
      // whereClause.product_category = slctCategory;
      whereClause["$Subpart_supplier.SubPart.category_code$"] =
        slctCategory;
    }

    // Check if slctWarehouse is not "All", then add it to whereClause
    if (slctWarehouse !== "All") {
      whereClause.warehouse_id = slctWarehouse;
    }

    const data = await Inventory_Subpart.findAll({
      where: whereClause,
      include: [
        {
          model: Subpart_supplier,
          required: true,
          include: [
            {
              model: SubPart,
              required: true,
              // where: whereClause,
            
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
    });

    const groupedProductData = {};

    // Define a function to calculate the total quantity from PR_PO
    const calculatePRQuantity = async (productID) => {
      const prItems = await PR_PO_subpart.findAll({
        include: [
          {
            model: Subpart_supplier,
            required: true,
            where: {
              // Filter PR_PO by productID
              subpart_id: productID,
            },
          },
          {
            model: PR,
            required: true,
            where: {
              status: "To-Receive",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPRQuantity = 0; // New variable for total quantity from PR_PO
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPRQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPRQuantity}`);
      return totalPRQuantity;
    };

    const calculatePR_INtransit_Quantity = async (productID) => {
      const prItems = await Receiving_initial_subpart.findAll({
        include: [
          {
            model: PR_PO_subpart,
            required: true,

            include: [
              {
                model: Subpart_supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  subpart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "In-transit",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_intransit_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_intransit_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_intransit_Quantity}`);
      return totalPR_intransit_Quantity;
    };

    const calculatePR_Approval_Quantity = async (productID) => {
      const prItems = await Receiving_Subpart.findAll({
        include: [
          {
            model: PR_PO_subpart,
            required: true,

            include: [
              {
                model: Subpart_supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  subpart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: "For Approval",
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_Approval_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_Approval_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_Approval_Quantity;
    };

    const calculatePR_received_Quantity = async (productID) => {
      const prItems = await Receiving_Subpart.findAll({
        include: [
          {
            model: PR_PO_subpart,
            required: true,

            include: [
              {
                model: Subpart_supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  subpart_id: productID,
                },
              },
            ],
          },
          {
            model: Receiving_PO,
            required: true,

            where: {
              status: { [Op.ne]: "For Approval" },
              // status:{ [Op.ne]: 'In-transit'},
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      let totalPR_received_Quantity = 0; // New variable for total quantity from PR_PO received in davao
      // Sum up the quantity from PR_PO
      prItems.forEach((prItem) => {
        totalPR_received_Quantity += prItem.received_quantity;
      });
      // console.log(`Total Quantity for Product ID ${productID}: ${totalPR_received_Quantity}`);
      return totalPR_received_Quantity;
    };

    // Define a function to calculate the total quantity from issued
    const calculateIssuanceQuantity = async (productID) => {
      const IssuedItems = await IssuedApproveSubpart.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: Inventory_Subpart,
            required: true,

            include: [
              {
                model: Subpart_supplier,
                required: true,
                where: {
                  // Filter PR_PO by productID
                  subpart_id: productID,
                },
              },
            ],
          },
        ],
      });

      let totalIssuedQuantity = 0; // New variable for total quantity from issued
      // Sum up the quantity from issued
      IssuedItems.forEach((prItem) => {
        totalIssuedQuantity += prItem.quantity;
      });
      // console.log(`Total Quantity Issuance for Product ID ${productID}: ${totalIssuedQuantity}`);
      return totalIssuedQuantity;
    };

    // Loop through each inventory item
    for (const item of data) {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.subpart_supplier?.subPart?.id;
      const productCode = item.subpart_supplier?.subPart?.subPart_code;
      const productName = item.subpart_supplier?.subPart?.subPart_name;

      const Price = item.price;

      const inventory_id = item.inventory_id;
      const UOM = item.subpart_supplier?.subPart?.subPart_unitMeasurement;
      const createdAtt = item.subpart_supplier?.subPart?.createdAt;

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
       
            totalQuantity: 0,
            totalPRQuantity: 0,
            totalIssuedQuantity: 0,
            totalPR_intransit_Quantity: 0,
            totalPR_Approval_Quantity: 0,
            totalPR_received_Quantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        // Calculate the total quantity from PR_PO
        const totalPRQuantity = await calculatePRQuantity(productID);
        const totalIssuedQuantity = await calculateIssuanceQuantity(productID);
        const totalPR_Approval_Quantity = await calculatePR_Approval_Quantity(
          productID
        );
        const totalPR_intransit_Quantity = await calculatePR_INtransit_Quantity(
          productID
        );
        const totalPR_received_Quantity = await calculatePR_received_Quantity(
          productID
        );

        groupedProductData[key].totalPR_received_Quantity +=
          totalPR_received_Quantity;
        groupedProductData[key].totalPR_Approval_Quantity +=
          totalPR_Approval_Quantity;
        groupedProductData[key].totalPR_intransit_Quantity +=
          totalPR_intransit_Quantity;
        groupedProductData[key].totalIssuedQuantity += totalIssuedQuantity;
        groupedProductData[key].totalPRQuantity += totalPRQuantity;

        groupedProductData[key].totalQuantity += item.quantity;
        groupedProductData[key].products.push(item);
      }
    }

    const finalResult_PRD = Object.values(groupedProductData);

    return res.json(finalResult_PRD);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

module.exports = router;
