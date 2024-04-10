const router = require("express").Router();
const { where, Op, fn, col, gt, gte, lt, lte, sqlz } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const { startOfMonth, endOfMonth, format } = require("date-fns"); // You may need to install the date-fns library
const moment = require("moment-timezone"); 

const {
  Issuance,
  MasterList,
  CostCenter,
  Inventory,
  IssuedProduct,
  IssuedAssembly,
  IssuedSpare,
  IssuedSubpart,
  Inventory_Assembly,
  Inventory_Spare,
  Inventory_Subpart,
  ProductTAGSupplier,
  Supplier,
  PR,
  Product,
  Assembly_Supplier,
  Assembly,
  SparePart_Supplier,
  SparePart,
  Subpart_supplier,
  SubPart,
  Warehouses,
  PR_PO,
  Receiving_PO,
  Receiving_Prd,
  PR_PO_asmbly,
  Receiving_initial_asm,
  Receiving_Asm,
  PR_PO_spare,
  Receiving_initial_spare,
  Receiving_Spare,
  PR_PO_subpart,
  Receiving_initial_subpart,
  Receiving_Subpart,
} = require("../db/models/associations");
const ReceivingInitial_Prd = require("../db/models/receiving_initial_prd.model");

// Get count all the issued products for DASHBOARD

router.route("/fetchCountIssued").get(async (req, res) => {
  try {
    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    const currentDate = moment();
    const firstDateOfMonth = currentDate.clone().startOf("month").startOf('day');
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf('day');

    // Count issued products for the current month
    const countProduct = await IssuedProduct.count({
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
      include: [
        {
          model: Issuance,
          required: true,

          where: {
            status: "Approved",
          },
        },
      ],
    });

    // Similar counts for other tables (IssuedAssembly, IssuedSpare, IssuedSubpart)

    const countAssembly = await IssuedAssembly.count({
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
      include: [
        {
          model: Issuance,
          required: true,

          where: {
            status: "Approved",
          },
        },
      ],
    });

    const countSpare = await IssuedSpare.count({
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },

      include: [
        {
          model: Issuance,
          required: true,

          where: {
            status: "Approved",
          },
        },
      ],
    });

    const countSubpart = await IssuedSubpart.count({
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
      include: [
        {
          model: Issuance,
          required: true,

          where: {
            status: "Approved",
          },
        },
      ],
    });

    const totalIssuedCount =
      countProduct + countAssembly + countSpare + countSubpart;

    return res.json(totalIssuedCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get count all the invnetory products for DASHBOARD
router.route("/fetchCountInventory").get(async (req, res) => {
  try {
    // Get the start and end dates of the current month
    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    const currentDate = moment();
    const firstDateOfMonth = currentDate.clone().startOf("month").startOf('day');
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf('day');


    const countProductQuantity = await Inventory.sum("quantity", {
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
    });

    const sumAsmblyQuantity = await Inventory_Assembly.sum("quantity", {
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
    });
    const sumSpareQuantity = await Inventory_Spare.sum("quantity", {
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
    });
    const sumSubQuantity = await Inventory_Subpart.sum("quantity", {
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
    });

    const totalInventoryCount =
      countProductQuantity +
      sumAsmblyQuantity +
      sumSpareQuantity +
      sumSubQuantity;

    return res.json(totalInventoryCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get count all the inventory value for DASHBOARD
router.route("/fetchValueInventory").get(async (req, res) => {
  try {
    // Get the start and end dates of the current month
    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    const currentDate = moment();
    const firstDateOfMonth = currentDate.clone().startOf("month").startOf('day');
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf('day');

    let sumPRD = 0;
    let sumAsmbly = 0;
    let sumSpare = 0;
    let sumSub = 0;

    const invPrd = await Inventory.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
    });

    invPrd.forEach((inv) => {
      sumPRD += (inv.price + inv.freight_cost + inv.custom_cost) * inv.quantity;
    });

    // -----------------------------------------------------

    const invasm = await Inventory_Assembly.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
    });

    invasm.forEach((inv) => {
      sumAsmbly += (inv.price + inv.freight_cost + inv.custom_cost) * inv.quantity;
    });

    // -----------------------------------------------------

    const invspare = await Inventory_Spare.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
    });

    invspare.forEach((inv) => {
      sumSpare += (inv.price + inv.freight_cost + inv.custom_cost) * inv.quantity;
    });

    // -----------------------------------------------------

    const invSub = await Inventory_Subpart.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        ],
        },
      },
    });

    invSub.forEach((inv) => {
      sumSub += (inv.price + inv.freight_cost + inv.custom_cost) * inv.quantity;
    });

    const totalValue = sumPRD + sumAsmbly + sumSpare + sumSub;
    const formattedTotalValue = totalValue.toFixed(2).toLocaleString();
    res.json(formattedTotalValue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Get count all the suppplier for DASHBOARD
router.route("/fetchCountSupplier").get(async (req, res) => {
  try {
    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    const currentDate = moment();
    const firstDateOfMonth = currentDate.clone().startOf("month").startOf('day');
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf('day');

    const countSupplier = await Supplier.count({
      where: {
        supplier_status: "Active",
        createdAt: {
          [Op.between]: [
              firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
              lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
      },
    });
    res.json(countSupplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get count all the inventory products for DASHBOARD
router.route("/fetchCountOrdered").get(async (req, res) => {
  try {
    // ----------------Product on order ------------------
    let orderedCountPRD = 0;
    let orderedCountASM = 0;
    let orderedCountSPR = 0;
    let orderedCountSBP = 0;

    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    const currentDate = moment();
    const firstDateOfMonth = currentDate.clone().startOf("month").startOf('day');
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf('day');

    const ordered_canvassed = await PR_PO.findAll({
      include: [
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
            date_approved: {
              [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                  lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
              ],
            },
          },
        },
        {
          model: ProductTAGSupplier,
          required: true,
        },
      ],
    });

    const productCount = {};

    ordered_canvassed.forEach((order_quantity) => {
      const product_id = order_quantity.product_tag_supplier.product_id;

      // Check if product_id already exists in productCount
      if (!productCount[product_id]) {
        // If not, increment orderedCountPRD and mark the product_id as counted
        orderedCountPRD++;
        productCount[product_id] = true;
      }
    });

    // ----------------Assembly on order ------------------

    const ordered_canvassed_ASM = await PR_PO_asmbly.findAll({
      include: [
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
            date_approved: {
              [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                  lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
              ],
            },
          },
        },
        {
          model: Assembly_Supplier,
        },
      ],
    });

    const ASMCount = {};
    ordered_canvassed_ASM.forEach((order_quantity) => {
      const product_id = order_quantity.assembly_supplier.assembly_id;

      // Check if product_id already exists in ASMCount
      if (!ASMCount[product_id]) {
        // If not, increment orderedCountASM and mark the product_id as counted
        orderedCountASM++;
        ASMCount[product_id] = true;
      }
    });

    // ----------------Sparepart on order ------------------

    const ordered_canvassed_SPR = await PR_PO_spare.findAll({
      include: [
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
            date_approved: {
              [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                  lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
              ],
            },
          },
        },
        {
          model: SparePart_Supplier,
          required: true,
        },
      ],
    });

    const spareCount = {};

    ordered_canvassed_SPR.forEach((order_quantity) => {
      const product_id = order_quantity.sparepart_supplier.sparePart_id;

      // Check if product_id already exists in spareCount
      if (!spareCount[product_id]) {
        // If not, increment orderedCountSPR and mark the product_id as counted
        orderedCountSPR++;
        spareCount[product_id] = true;
      }
    });

    // ----------------Subpart on order ------------------

    const ordered_canvassed_SBP = await PR_PO_subpart.findAll({
      include: [
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
            date_approved: {
              [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                  lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
              ],
            },
          },
        },
        {
          model: Subpart_supplier,
          required: true,
        },
      ],
    });

    const subpCount = {};

    ordered_canvassed_SBP.forEach((order_quantity) => {
      const product_id = order_quantity.subpart_supplier.subpart_id;

      // Check if product_id already exists in subpCount
      if (!subpCount[product_id]) {
        // If not, increment orderedCountSBP and mark the product_id as counted
        orderedCountSBP++;
        subpCount[product_id] = true;
      }
    });

    const totalOnOrder =
      orderedCountPRD + orderedCountASM + orderedCountSPR + orderedCountSBP;

    res.json(totalOnOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/fetchLowStock").get(async (req, res) => {
  try {
    let countLowStock_Product = 0;
    let countLowStock_Assembly = 0;
    let countLowStock_Spare = 0;
    let countLowStock_Subpart = 0;

    const lowStockCount_prd = await Inventory.findAll({
      include: [
        {
          model: ProductTAGSupplier,
          required: true,
          include: [
            {
              model: Product,
              required: true,
            },
          ],
        },
      ],
    });

    const quantities = {};

    lowStockCount_prd.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.product_tag_supplier.product_id;

      if (quantities[product_id] === undefined) {
        // If the product_id is encountered for the first time, initialize its quantity
        quantities[product_id] = inventoryQuantity;
      } else {
        // If the product_id already exists, add the current quantity to it
        quantities[product_id] += inventoryQuantity;
      }
    });

    // Display the accumulated quantities and check against thresholds
    for (const product_id in quantities) {
      console.log(
        `Accumulated quantity for product_id ${product_id}: ${quantities[product_id]}`
      );

      const productThreshold = lowStockCount_prd.find(
        (item) => item.product_tag_supplier.product_id === parseInt(product_id)
      ).product_tag_supplier.product.product_threshold;

      if (
        quantities[product_id] <= productThreshold &&
        quantities[product_id] !== 0
      ) {
        countLowStock_Product += 1;
      }
    }

    console.log(`Count of low stock products: ${countLowStock_Product}`);

    //====================ASEMBLY

    const lowStockCount_asmbly = await Inventory_Assembly.findAll({
      include: [
        {
          model: Assembly_Supplier,
          required: true,
          include: [
            {
              model: Assembly,
              required: true,
            },
          ],
        },
      ],
    });

    const quantities_asm = {};
    lowStockCount_asmbly.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.assembly_supplier.assembly_id;

      if (quantities_asm[product_id] === undefined) {
        // If the product_id is encountered for the first time, initialize its quantity
        quantities_asm[product_id] = inventoryQuantity;
      } else {
        // If the product_id already exists, add the current quantity to it
        quantities_asm[product_id] += inventoryQuantity;
      }
    });

    for (const product_id in quantities_asm) {
      const productThreshold = lowStockCount_asmbly.find(
        (item) => item.assembly_supplier.assembly_id === parseInt(product_id)
      ).assembly_supplier.assembly.threshhold;

      if (
        quantities_asm[product_id] <= productThreshold &&
        quantities_asm[product_id] !== 0
      ) {
        countLowStock_Assembly += 1;
      }
    }

    console.log(`Count of low stock asm: ${countLowStock_Assembly}`);

    //====================Spare

    const lowStockCount_spare = await Inventory_Spare.findAll({
      include: [
        {
          model: SparePart_Supplier,
          required: true,
          include: [
            {
              model: SparePart,
              required: true,
            },
          ],
        },
      ],
    });

    const quantities_spare = {};

    lowStockCount_spare.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.sparepart_supplier.sparePart_id;

      if (quantities_spare[product_id] === undefined) {
        // If the product_id is encountered for the first time, initialize its quantity
        quantities_spare[product_id] = inventoryQuantity;
      } else {
        // If the product_id already exists, add the current quantity to it
        quantities_spare[product_id] += inventoryQuantity;
      }
    });

    for (const product_id in quantities_spare) {
      const productThreshold = lowStockCount_spare.find(
        (item) => item.sparepart_supplier.sparePart_id === parseInt(product_id)
      ).sparepart_supplier.sparePart.threshhold;

      if (
        quantities_spare[product_id] <= productThreshold &&
        quantities_spare[product_id] !== 0
      ) {
        countLowStock_Spare += 1;
      }
    }

    console.log(`Count of low stock spare: ${countLowStock_Spare}`);

    //====================Subpart

    const lowStockCount_subpart = await Inventory_Subpart.findAll({
      include: [
        {
          model: Subpart_supplier,
          required: true,
          include: [
            {
              model: SubPart,
              required: true,
            },
          ],
        },
      ],
    });

    const quantities_subpart = {};
    lowStockCount_subpart.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.subpart_supplier.subpart_id;

      if (quantities_subpart[product_id] === undefined) {
        quantities_subpart[product_id] = inventoryQuantity;
      } else {
        quantities_subpart[product_id] += inventoryQuantity;
      }
    });

    for (const product_id in quantities_subpart) {
      console.log(
        `Accumulated quantity for product_id ${product_id}: ${quantities_subpart[product_id]}`
      );

      const productThreshold = lowStockCount_subpart.find(
        (item) => item.subpart_supplier.subpart_id === parseInt(product_id)
      ).subpart_supplier.subPart.threshhold;

      if (
        quantities_subpart[product_id] <= productThreshold &&
        quantities_subpart[product_id] !== 0
      ) {
        countLowStock_Subpart += 1;
      }
    }
    console.log(`Count of low stock subpart: ${countLowStock_Subpart}`);

    res.json(
      countLowStock_Product +
        countLowStock_Assembly +
        countLowStock_Spare +
        countLowStock_Subpart
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/fetchInStock").get(async (req, res) => {
  try {
    let countStock_Product = 0;
    let countStock_Assembly = 0;
    let countStock_Spare = 0;
    let countStock_Subpart = 0;

    const StockCount_prd = await Inventory.findAll({
      include: [
        {
          model: ProductTAGSupplier,
          required: true,
          include: [
            {
              model: Product,
              required: true,
            },
          ],
        },
      ],
    });

    const quantities = {};
    StockCount_prd.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.product_tag_supplier.product_id;

      if (quantities[product_id] === undefined) {
        // If the product_id is encountered for the first time, initialize its quantity
        quantities[product_id] = inventoryQuantity;
      } else {
        // If the product_id already exists, add the current quantity to it
        quantities[product_id] += inventoryQuantity;
      }
    });

    for (const product_id in quantities) {
      console.log(
        `Accumulated quantity for product_id ${product_id}: ${quantities[product_id]}`
      );

      const productThreshold = StockCount_prd.find(
        (item) => item.product_tag_supplier.product_id === parseInt(product_id)
      ).product_tag_supplier.product.product_threshold;

      if (
        quantities[product_id] > productThreshold &&
        quantities[product_id] !== 0
      ) {
        countStock_Product += 1;
      }
    }

    console.log(`Count of in stock products: ${countStock_Product}`);

    //====================ASEMBLY

    const StockCount_asmbly = await Inventory_Assembly.findAll({
      include: [
        {
          model: Assembly_Supplier,
          required: true,
          include: [
            {
              model: Assembly,
              required: true,
            },
          ],
        },
      ],
    });

    const quantities_asm = {};
    StockCount_asmbly.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.assembly_supplier.assembly_id;

      // console.log(inventoryQuantity);
      // console.log(productThreshold);

      if (quantities_asm[product_id] === undefined) {
        // If the product_id is encountered for the first time, initialize its quantity
        quantities_asm[product_id] = inventoryQuantity;
      } else {
        // If the product_id already exists, add the current quantity to it
        quantities_asm[product_id] += inventoryQuantity;
      }
    });

    for (const product_id in quantities_asm) {
      const productThreshold = StockCount_asmbly.find(
        (item) => item.assembly_supplier.assembly_id === parseInt(product_id)
      ).assembly_supplier.assembly.threshhold;

      if (
        quantities_asm[product_id] > productThreshold &&
        quantities_asm[product_id] !== 0
      ) {
        countStock_Assembly += 1;
      }
    }
    console.log(`Count of in stock asm: ${countStock_Assembly}`);

    //====================Spare

    const StockCount_spare = await Inventory_Spare.findAll({
      include: [
        {
          model: SparePart_Supplier,
          required: true,
          include: [
            {
              model: SparePart,
              required: true,
            },
          ],
        },
      ],
    });

    const quantities_spare = {};
    StockCount_spare.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.sparepart_supplier.sparePart_id;
      if (quantities_spare[product_id] === undefined) {
        // If the product_id is encountered for the first time, initialize its quantity
        quantities_spare[product_id] = inventoryQuantity;
      } else {
        // If the product_id already exists, add the current quantity to it
        quantities_spare[product_id] += inventoryQuantity;
      }
    });

    for (const product_id in quantities_spare) {
      const productThreshold = StockCount_spare.find(
        (item) => item.sparepart_supplier.sparePart_id === parseInt(product_id)
      ).sparepart_supplier.sparePart.threshhold;

      if (
        quantities_spare[product_id] > productThreshold &&
        quantities_spare[product_id] !== 0
      ) {
        countStock_Spare += 1;
      }
    }
    console.log(`Count of in stock spare: ${countStock_Spare}`);

    //====================subpart

    const StockCount_subpart = await Inventory_Subpart.findAll({
      include: [
        {
          model: Subpart_supplier,
          required: true,
          include: [
            {
              model: SubPart,
              required: true,
            },
          ],
        },
      ],
    });
    const quantities_subpart = {};
    StockCount_subpart.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.subpart_supplier.subpart_id;

      if (quantities_subpart[product_id] === undefined) {
        quantities_subpart[product_id] = inventoryQuantity;
      } else {
        quantities_subpart[product_id] += inventoryQuantity;
      }
    });
    for (const product_id in quantities_subpart) {
      console.log(
        `Accumulated quantity for product_id ${product_id}: ${quantities_subpart[product_id]}`
      );

      const productThreshold = StockCount_subpart.find(
        (item) => item.subpart_supplier.subpart_id === parseInt(product_id)
      ).subpart_supplier.subPart.threshhold;

      if (
        quantities_subpart[product_id] > productThreshold &&
        quantities_subpart[product_id] !== 0
      ) {
        countStock_Subpart += 1;
      }
    }
    console.log(`Count of in stock subpart: ${countStock_Subpart}`);

    // If you want to log the entire array, uncomment the line below
    // console.log("------------instock---------",countStock_Product + countStock_Assembly + countStock_Spare + countStock_Subpart );

    res.json(
      countStock_Product +
        countStock_Assembly +
        countStock_Spare +
        countStock_Subpart
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/fetchOutStock").get(async (req, res) => {
  try {
    let countStock_Product = 0;
    let countStock_Assembly = 0;
    let countStock_Spare = 0;
    let countStock_Subpart = 0;

    const StockCount_prd = await Inventory.findAll({
      include: [
        {
          model: ProductTAGSupplier,
          required: true,
          include: [
            {
              model: Product,
              required: true,
            },
          ],
        },
      ],
    });
    const quantities = {};
    StockCount_prd.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.product_tag_supplier.product_id;

      if (quantities[product_id] === undefined) {
        // If the product_id is encountered for the first time, initialize its quantity
        quantities[product_id] = inventoryQuantity;
      } else {
        // If the product_id already exists, add the current quantity to it
        quantities[product_id] += inventoryQuantity;
      }
    });

    for (const product_id in quantities) {
      console.log(
        `Accumulated quantity for product_id ${product_id}: ${quantities[product_id]}`
      );

      if (quantities[product_id] === 0) {
        countStock_Product += 1;
      }
    }

    console.log(`Count of out stock products: ${countStock_Product}`);

    //====================ASEMBLY

    const StockCount_asmbly = await Inventory_Assembly.findAll({
      include: [
        {
          model: Assembly_Supplier,
          required: true,
          include: [
            {
              model: Assembly,
              required: true,
            },
          ],
        },
      ],
    });
    const quantities_asm = {};
    StockCount_asmbly.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.assembly_supplier.assembly_id;

      // console.log(inventoryQuantity);
      // console.log(productThreshold);

      if (quantities_asm[product_id] === undefined) {
        // If the product_id is encountered for the first time, initialize its quantity
        quantities_asm[product_id] = inventoryQuantity;
      } else {
        // If the product_id already exists, add the current quantity to it
        quantities_asm[product_id] += inventoryQuantity;
      }
    });
    for (const product_id in quantities_asm) {
      if (quantities_asm[product_id] === 0) {
        countStock_Assembly += 1;
      }
    }
    console.log(`Count of out stock asm: ${countStock_Assembly}`);

    //====================Spare

    const StockCount_spare = await Inventory_Spare.findAll({
      include: [
        {
          model: SparePart_Supplier,
          required: true,
          include: [
            {
              model: SparePart,
              required: true,
            },
          ],
        },
      ],
    });

    const quantities_spare = {};
    StockCount_spare.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.sparepart_supplier.sparePart_id;
      if (quantities_spare[product_id] === undefined) {
        // If the product_id is encountered for the first time, initialize its quantity
        quantities_spare[product_id] = inventoryQuantity;
      } else {
        // If the product_id already exists, add the current quantity to it
        quantities_spare[product_id] += inventoryQuantity;
      }
    });

    for (const product_id in quantities_spare) {
      if (quantities_spare[product_id] === 0) {
        countStock_Spare += 1;
      }
    }
    console.log(`Count of out stock spare: ${countStock_Spare}`);

    //====================Subpart
    const quantities_subpart = {};
    const StockCount_subpart = await Inventory_Subpart.findAll({
      include: [
        {
          model: Subpart_supplier,
          required: true,
          include: [
            {
              model: SubPart,
              required: true,
            },
          ],
        },
      ],
    });

    StockCount_subpart.forEach((item) => {
      const inventoryQuantity = item.quantity;
      const product_id = item.subpart_supplier.subpart_id;

      if (quantities_subpart[product_id] === undefined) {
        quantities_subpart[product_id] = inventoryQuantity;
      } else {
        quantities_subpart[product_id] += inventoryQuantity;
      }
    });

    for (const product_id in quantities_subpart) {
      console.log(
        `Accumulated quantity for product_id ${product_id}: ${quantities_subpart[product_id]}`
      );

      if (quantities_subpart[product_id] === 0) {
        countStock_Subpart += 1;
      }
    }
    console.log(`Count of out stock subpart: ${countStock_Subpart}`);

    res.json(
      countStock_Product +
        countStock_Assembly +
        countStock_Spare +
        countStock_Subpart
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.route("/countInventoryGraph").get(async (req, res) => {
  try {
// Get the current date
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

// Get the last day of December for the current year
const lastDayOfDecemberCurrentYear = new Date(currentYear, 11, 31); // Months are 0-indexed, so December is 11
lastDayOfDecemberCurrentYear.setHours(23, 59, 59); // Set to end of day (23:59:59)

// Get the first day of January for the current year
const firstDayOfJanuaryCurrentYear = new Date(currentYear, 0, 1); // January is 0
firstDayOfJanuaryCurrentYear.setHours(0, 0, 0); // Set to beginning of day (00:00:00)

// For last year
const lastYear = currentYear - 1;
// Get the last day of December for the last year
const lastDayOfDecemberLastYear = new Date(lastYear, 11, 31);
lastDayOfDecemberLastYear.setHours(23, 59, 59); // Set to end of day (23:59:59)

// Get the first day of January for the last year
const firstDayOfJanuaryLastYear = new Date(lastYear, 0, 1);
firstDayOfJanuaryLastYear.setHours(0, 0, 0); // Set to beginning of day (00:00:00)

// Format dates into desired string format
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


const currentYear_StartDate = formatDate(firstDayOfJanuaryCurrentYear)
const currentYear_EndDate = formatDate(lastDayOfDecemberCurrentYear)

const lastYear_StartDate = formatDate(firstDayOfJanuaryLastYear)
const lastYear_EndDate = formatDate(lastDayOfDecemberLastYear)

console.log("Last day of December, current year:", currentYear_EndDate);
console.log("First day of January, current year:", currentYear_StartDate);
console.log("Last day of December, last year:", lastYear_EndDate);
console.log("First day of January, last year:", lastYear_StartDate);



const dataCounts = await Inventory.findAll({
  include: [{
    model: ProductTAGSupplier,
    required: true
  }],
  where: {
    createdAt: {
      [Op.between]: [
        lastYear_StartDate,
        currentYear_EndDate,
      ],
    },
  },
});


const dataCounts_asm = await Inventory_Assembly.findAll({
  include: [{
    model: Assembly_Supplier,
    required: true
  }],
  where: {
    createdAt: {
      [Op.between]: [
        lastYear_StartDate,
        currentYear_EndDate,
      ],
    },
  },
});

const dataCounts_spare = await Inventory_Spare.findAll({
  include: [{
    model: SparePart_Supplier,
    required: true
  }],
  where: {
    createdAt: {
      [Op.between]: [
        lastYear_StartDate,
        currentYear_EndDate,
      ],
    },
  },
});

const dataCounts_subpart = await Inventory_Subpart.findAll({
  include: [{
    model: Subpart_supplier,
    required: true
  }],
  where: {
    createdAt: {
      [Op.between]: [
        lastYear_StartDate,
        currentYear_EndDate,
      ],
    },
  },
});


// Array of month names
const monthNames = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

const combinedQuantities = {};

// Loop through each inventory item
[dataCounts, dataCounts_asm, dataCounts_spare, dataCounts_subpart].forEach((data) => {
  data.forEach((item) => {
    const inventoryQuantity = item.static_quantity;
    const product_id = item.product_tag_supplier ? item.product_tag_supplier.product_id : item.assembly_supplier ? item.assembly_supplier.assembly_id : item.sparepart_supplier ? item.sparepart_supplier.sparePart_id : item.subpart_supplier.subpart_id ; // Check if it's from Inventory or Inventory_Assembly

    // Get the year and month from the createdAt field of the inventory item
    const createdAt = new Date(item.createdAt);
    const currentYear = createdAt.getFullYear();
    const month = createdAt.getMonth();

    // Determine if it's last year or this year
    const yearLabel = currentYear === new Date().getFullYear() ? "ThisYear" : "LastYear";

    if (!combinedQuantities[yearLabel]) {
      combinedQuantities[yearLabel] = {};
    }

    if (!combinedQuantities[yearLabel][month]) {
      combinedQuantities[yearLabel][month] = {};
    }

    if (!combinedQuantities[yearLabel][month][product_id]) {
      // If the product_id is encountered for the first time in this year and month, initialize its quantity
      combinedQuantities[yearLabel][month][product_id] = inventoryQuantity;
    } else {
      // If the product_id already exists in this year and month, add the current quantity to it
      combinedQuantities[yearLabel][month][product_id] += inventoryQuantity;
    }
  });
});

// Create the array to hold the final result
const array = [];

// Loop through each month name
monthNames.forEach((monthName, index) => {
  const monthData = {
    month: monthName,
    ThisYear: 0,
    LastYear: 0
  };

  // Check if the month exists in ThisYear
  if (combinedQuantities["ThisYear"] && combinedQuantities["ThisYear"][index]) {
    for (const product_id in combinedQuantities["ThisYear"][index]) {
      monthData.ThisYear += combinedQuantities["ThisYear"][index][product_id];
    }
  }

  // Check if the month exists in LastYear
  if (combinedQuantities["LastYear"] && combinedQuantities["LastYear"][index]) {
    for (const product_id in combinedQuantities["LastYear"][index]) {
      monthData.LastYear += combinedQuantities["LastYear"][index][product_id];
    }
  }

  array.push(monthData);
});

// console.log(array);
   
    res.json(array);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.route("/fetchMostReqItem").get(async (req, res) => {
  try {

    const productInfoArray = [];
    const ordered_canvassed = await PR_PO.findAll({
      include: [
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
          },
        },
        {
          model: ProductTAGSupplier,
          required: true,
          include: [{
            model: Product,
            required: true
          }]
        },
      ],
    });
    
    // Create an array to store product information and counts
    
    
    // Create an object to store counts of each product_id
    const productCounts = {};
    
    ordered_canvassed.forEach((order_quantity) => {
      const product_id = order_quantity.product_tag_supplier.product_id;
    
      // Increment the count for the current product_id
      if (productCounts[product_id]) {
        productCounts[product_id]++;
      } else {
        productCounts[product_id] = 1;
      }
    });
    
    // Loop through the productCounts object to gather product information and counts
    for (const productId in productCounts) {
      const productName = ordered_canvassed.find(
        (item) => item.product_tag_supplier.product_id === parseInt(productId)
      ).product_tag_supplier.product.product_name;
    
      const productCode = ordered_canvassed.find(
        (item) => item.product_tag_supplier.product_id === parseInt(productId)
      ).product_tag_supplier.product.product_code;
    
      // Push product information and count into the productInfoArray
      productInfoArray.push({
        productCode: productCode,
        productName: productName,
        count: productCounts[productId]
      });
    }


    const ordered_canvassed_asm = await PR_PO_asmbly.findAll({
      include: [
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
          },
        },
        {
          model: Assembly_Supplier,
          required: true,
          include: [{
            model: Assembly,
            required: true
          }]
        },
      ],
    });
    
    // Create an array to store product information and counts
    
    
    // Create an object to store counts of each product_id
    const productCounts_asm = {};
    
    ordered_canvassed_asm.forEach((order_quantity) => {
      const product_id = order_quantity.assembly_supplier.assembly_id;
    
      // Increment the count for the current product_id
      if (productCounts_asm[product_id]) {
        productCounts_asm[product_id]++;
      } else {
        productCounts_asm[product_id] = 1;
      }
    });
    
    // Loop through the productCounts object to gather product information and counts
    for (const productId in productCounts_asm) {
      const productName = ordered_canvassed_asm.find(
        (item) => item.assembly_supplier.assembly_id === parseInt(productId)
      ).assembly_supplier.assembly.assembly_name;
    
      const productCode = ordered_canvassed_asm.find(
        (item) => item.assembly_supplier.assembly_id === parseInt(productId)
      ).assembly_supplier.assembly.assembly_code;
    
      // Push product information and count into the productInfoArray
      productInfoArray.push({
        productCode: productCode,
        productName: productName,
        count: productCounts_asm[productId]
      });
    }


    const ordered_canvassed_spr = await PR_PO_spare.findAll({
      include: [
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
          },
        },
        {
          model: SparePart_Supplier,
          required: true,
          include: [{
            model: SparePart,
            required: true
          }]
        },
      ],
    });
    
    // Create an array to store product information and counts
    
    
    // Create an object to store counts of each product_id
    const productCounts_spare = {};
    
    ordered_canvassed_spr.forEach((order_quantity) => {
      const product_id = order_quantity.sparepart_supplier.sparePart_id;
    
      // Increment the count for the current product_id
      if (productCounts_spare[product_id]) {
        productCounts_spare[product_id]++;
      } else {
        productCounts_spare[product_id] = 1;
      }
    });
    
    // Loop through the productCounts object to gather product information and counts
    for (const productId in productCounts_spare) {
      const productName = ordered_canvassed_spr.find(
        (item) => item.sparepart_supplier.sparePart_id === parseInt(productId)
      ).sparepart_supplier.sparePart.spareParts_name;
    
      const productCode = ordered_canvassed_spr.find(
        (item) => item.sparepart_supplier.sparePart_id === parseInt(productId)
      ).sparepart_supplier.sparePart.spareParts_code;
    
      // Push product information and count into the productInfoArray
      productInfoArray.push({
        productCode: productCode,
        productName: productName,
        count: productCounts_spare[productId]
      });
    }


    const ordered_canvassed_sbp = await PR_PO_subpart.findAll({
      include: [
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
          },
        },
        {
          model: Subpart_supplier,
          required: true,
          include: [{
            model: SubPart,
            required: true
          }]
        },
      ],
    });
    
    // Create an array to store product information and counts
    
    
    // Create an object to store counts of each product_id
    const productCounts_subpart = {};
    
    ordered_canvassed_sbp.forEach((order_quantity) => {
      const product_id = order_quantity.subpart_supplier.subpart_id;
    
      // Increment the count for the current product_id
      if (productCounts_subpart[product_id]) {
        productCounts_subpart[product_id]++;
      } else {
        productCounts_subpart[product_id] = 1;
      }
    });
    
    // Loop through the productCounts object to gather product information and counts
    for (const productId in productCounts_subpart) {
      const productName = ordered_canvassed_sbp.find(
        (item) => item.subpart_supplier.subpart_id === parseInt(productId)
      ).subpart_supplier.subPart.subPart_name;
    
      const productCode = ordered_canvassed_sbp.find(
        (item) => item.subpart_supplier.subpart_id === parseInt(productId)
      ).subpart_supplier.subPart.subPart_code;
    
      // Push product information and count into the productInfoArray
      productInfoArray.push({
        productCode: productCode,
        productName: productName,
        count: productCounts_subpart[productId]
      });
    }
    
    // // Now productInfoArray contains the required information
    // console.log(productInfoArray);
    productInfoArray.sort((a, b) => b.count - a.count);

    return res.json(productInfoArray)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/fetchReceivedOrdered").get(async (req, res) => {
  try {

    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    const currentDate = moment();
    const firstDateOfMonth = currentDate.clone().startOf("month").startOf('day');
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf('day');


    // ----------------Product on order ------------------
    let orderedCountPRD = 0;
    let orderedCountASM = 0;
    let orderedCountSPR = 0;
    let orderedCountSBP = 0;

    const ordered_canvassed = await Receiving_Prd.findAll({
      include: [
        {
          model: Receiving_PO,
          required: true,
          where: {
            status: { [Op.ne]: 'For Approval' },
            status:{ [Op.ne]: 'In-transit'},
            status:{ [Op.ne]: 'In-transit (Complete)'},
            date_approved: {
              [Op.between]: [
                firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
               ],
             },

          },
        },
        {
          model: PR_PO,
          required: true,
            include: [{
              model: ProductTAGSupplier,
              required: true
            }]
        },
      ],
    });

    const productCount = {};

    ordered_canvassed.forEach((order_quantity) => {
      const product_id = order_quantity.purchase_req_canvassed_prd.product_tag_supplier.product_id;

     

      // Check if product_id already exists in productCount
      if (!productCount[product_id]) {
        // If not, increment orderedCountPRD and mark the product_id as counted
        orderedCountPRD++;
        productCount[product_id] = true;
      }
    });

    // console.log(`orderedCountPRDsss ${orderedCountPRD}`)

    // ----------------Assembly on order ------------------

    const ordered_canvassed_ASM = await Receiving_Asm.findAll({
      include: [
        {
          model: Receiving_PO,
          required: true,
          where: {
            status: { [Op.ne]: 'For Approval' },
            status:{ [Op.ne]: 'In-transit'},
            status:{ [Op.ne]: 'In-transit (Complete)'},
            date_approved: {
             [Op.between]: [
              firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
              lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
              ],
            },
          },
        },
        {
          model: PR_PO_asmbly,
          required: true,
            include: [{
              model: Assembly_Supplier,
              required: true
            }]
        },
      ],
    });

    const ASMCount = {};
    ordered_canvassed_ASM.forEach((order_quantity) => {
      const product_id = order_quantity.purchase_req_canvassed_asmbly.assembly_supplier.assembly_id;

      // Check if product_id already exists in ASMCount
      if (!ASMCount[product_id]) {
        // If not, increment orderedCountASM and mark the product_id as counted
        orderedCountASM++;
        ASMCount[product_id] = true;
      }
    });

    // console.log(`orderedCountASMsss ${orderedCountASM}`)

    // ----------------Sparepart on order ------------------

    const ordered_canvassed_SPR = await Receiving_Spare.findAll({
      include: [
        {
          model: Receiving_PO,
          required: true,
          where: {
            status: { [Op.ne]: 'For Approval' },
            status:{ [Op.ne]: 'In-transit'},
            status:{ [Op.ne]: 'In-transit (Complete)'},
            date_approved: {
              [Op.between]: [
                firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
               ],
             },
          },
        },
        {
          model: PR_PO_spare,
          required: true,
            include: [{
              model: SparePart_Supplier,
              required: true
            }]
        },
      ],
    });

    const spareCount = {};

    ordered_canvassed_SPR.forEach((order_quantity) => {
      const product_id = order_quantity.purchase_req_canvassed_spare.sparepart_supplier.sparePart_id;

      // Check if product_id already exists in spareCount
      if (!spareCount[product_id]) {
        // If not, increment orderedCountSPR and mark the product_id as counted
        orderedCountSPR++;
        spareCount[product_id] = true;
      }
    });

    // console.log(`orderedCountSPRssss ${orderedCountSPR}`)

    // ----------------Subpart on order ------------------

    const ordered_canvassed_SBP = await Receiving_Subpart.findAll({
      include: [
        {
          model: Receiving_PO,
          required: true,
          where: {
            status: { [Op.ne]: 'For Approval' },
            status:{ [Op.ne]: 'In-transit'},
            status:{ [Op.ne]: 'In-transit (Complete)'},
            date_approved: {
              [Op.between]: [
                 firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                 lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
               ],
             },
          },
        },
        {
          model: PR_PO_subpart,
          required: true,
            include: [{
              model: Subpart_supplier,
              required: true
            }]
        },
      ],
    });

    const subpCount = {};

    ordered_canvassed_SBP.forEach((order_quantity) => {
      const product_id = order_quantity.purchase_req_canvassed_subpart.subpart_supplier.subpart_id;

      // Check if product_id already exists in subpCount
      if (!subpCount[product_id]) {
        // If not, increment orderedCountSBP and mark the product_id as counted
        orderedCountSBP++;
        subpCount[product_id] = true;
      }
    });

    console.log(`orderedCountSBPssss ${orderedCountSBP}`)

    const totalOnOrder =
      orderedCountPRD + orderedCountASM + orderedCountSPR + orderedCountSBP;

    res.json(totalOnOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.route("/countOrderGraph").get(async (req, res) => {
  try {
// Get the current date
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

// Get the last day of December for the current year
const lastDayOfDecemberCurrentYear = new Date(currentYear, 11, 31); // Months are 0-indexed, so December is 11
lastDayOfDecemberCurrentYear.setHours(23, 59, 59); // Set to end of day (23:59:59)

// Get the first day of January for the current year
const firstDayOfJanuaryCurrentYear = new Date(currentYear, 0, 1); // January is 0
firstDayOfJanuaryCurrentYear.setHours(0, 0, 0); // Set to beginning of day (00:00:00)

// For last year
const lastYear = currentYear - 1;
// Get the last day of December for the last year
const lastDayOfDecemberLastYear = new Date(lastYear, 11, 31);
lastDayOfDecemberLastYear.setHours(23, 59, 59); // Set to end of day (23:59:59)

// Get the first day of January for the last year
const firstDayOfJanuaryLastYear = new Date(lastYear, 0, 1);
firstDayOfJanuaryLastYear.setHours(0, 0, 0); // Set to beginning of day (00:00:00)

// Format dates into desired string format
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


const currentYear_StartDate = formatDate(firstDayOfJanuaryCurrentYear)
const currentYear_EndDate = formatDate(lastDayOfDecemberCurrentYear)

const lastYear_StartDate = formatDate(firstDayOfJanuaryLastYear)
const lastYear_EndDate = formatDate(lastDayOfDecemberLastYear)

// console.log("Last day of December, current year:", currentYear_EndDate);
// console.log("First day of January, current year:", currentYear_StartDate);
// console.log("Last day of December, last year:", lastYear_EndDate);
// console.log("First day of January, last year:", lastYear_StartDate);



const dataCounts = await Inventory.findAll({
  include: [{
    model: ProductTAGSupplier,
    required: true
  }],
  where: {
    createdAt: {
      [Op.between]: [
        currentYear_StartDate,
        currentYear_EndDate,
      ],
    },
  },
});


const dataCounts_asm = await Inventory_Assembly.findAll({
  include: [{
    model: Assembly_Supplier,
    required: true
  }],
  where: {
    createdAt: {
      [Op.between]: [
        currentYear_StartDate,
        currentYear_EndDate,
      ],
    },
  },
});

const dataCounts_spare = await Inventory_Spare.findAll({
  include: [{
    model: SparePart_Supplier,
    required: true
  }],
  where: {
    createdAt: {
      [Op.between]: [
        currentYear_StartDate,
        currentYear_EndDate,
      ],
    },
  },
});

const dataCounts_subpart = await Inventory_Subpart.findAll({
  include: [{
    model: Subpart_supplier,
    required: true
  }],
  where: {
    createdAt: {
      [Op.between]: [
        currentYear_StartDate,
        currentYear_EndDate,
      ],
    },
  },
});


// Array of month names
const monthNames = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

const combinedQuantities = {};

// Loop through each inventory item
[dataCounts, dataCounts_asm, dataCounts_spare, dataCounts_subpart].forEach((data) => {
  data.forEach((item) => {
    const inventoryQuantity = item.static_quantity;
    const product_id = item.product_tag_supplier ? item.product_tag_supplier.product_id : item.assembly_supplier ? item.assembly_supplier.assembly_id : item.sparepart_supplier ? item.sparepart_supplier.sparePart_id : item.subpart_supplier.subpart_id ; // Check if it's from Inventory or Inventory_Assembly

    // Get the year and month from the createdAt field of the inventory item
    const createdAt = new Date(item.createdAt);
    const currentYear = createdAt.getFullYear();
    const month = createdAt.getMonth();

    // Determine if it's last year or this year
    const yearLabel = currentYear === new Date().getFullYear() ? "ThisYear" : "LastYear";

    if (!combinedQuantities[yearLabel]) {
      combinedQuantities[yearLabel] = {};
    }

    if (!combinedQuantities[yearLabel][month]) {
      combinedQuantities[yearLabel][month] = {};
    }

    if (!combinedQuantities[yearLabel][month][product_id]) {
      // If the product_id is encountered for the first time in this year and month, initialize its quantity
      combinedQuantities[yearLabel][month][product_id] = inventoryQuantity;
    } else {
      // If the product_id already exists in this year and month, add the current quantity to it
      combinedQuantities[yearLabel][month][product_id] += inventoryQuantity;
    }
  });
});

// Create the array to hold the final result
const array = [];

// Loop through each month name
monthNames.forEach((monthName, index) => {
  const monthData = {
    month: monthName,
    ThisYear: 0,
    LastYear: 0
  };

  // Check if the month exists in ThisYear
  if (combinedQuantities["ThisYear"] && combinedQuantities["ThisYear"][index]) {
    for (const product_id in combinedQuantities["ThisYear"][index]) {
      monthData.ThisYear += combinedQuantities["ThisYear"][index][product_id];
    }
  }

  // Check if the month exists in LastYear
  if (combinedQuantities["LastYear"] && combinedQuantities["LastYear"][index]) {
    for (const product_id in combinedQuantities["LastYear"][index]) {
      monthData.LastYear += combinedQuantities["LastYear"][index][product_id];
    }
  }

  array.push(monthData);
});

// console.log(array);
   
    res.json(array);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
