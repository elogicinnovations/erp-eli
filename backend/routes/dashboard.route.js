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

router.route("/fetchPrApproveProduct").get(async (req, res) => {
  try {
    const data = await PR_PO.findAll({
      include: [
        {
          model: PR,
          required: true,
        },
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
      ],
      where: {
        date_approved: {
          [Op.ne]: null,
        },
        quantity: {
          [Op.gt]: 0, // Quantity greater than 0
        },
      },
    });

    if (data) {
      console.log("asasa");
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/Costing").post(async (req, res) => {
  try {
    const { receiving_id, customFee, shippingFee, shippingFeeBool, ref_code } =
      req.body;

    console.log(
      `shippingFeeBool ${shippingFeeBool} shippingFee${shippingFee} customFee${customFee}`
    );

    let final_status;
    if (
      (shippingFee === "" || shippingFee === 0) &&
      (customFee === null || customFee === "")
    ) {
      final_status = "Delivered (Lack of Cost)";
    } else if (shippingFee === "" || shippingFee === 0) {
      final_status = "Delivered (Lack of FreightCost)";
    } else if (customFee === null || customFee === "") {
      final_status = "Delivered (Lack of CustomCost)";
    } else {
      final_status = "Delivered";
    }
    const inventory_fetch_sum = await Inventory.sum("static_quantity", {
      where: {
        reference_number: ref_code,
      },
    });

    const inventory_fetch_asm_sum = await Inventory_Assembly.sum(
      "static_quantity",
      {
        where: {
          reference_number: ref_code,
        },
      }
    );

    const inventory_fetch_spare_sum = await Inventory_Spare.sum(
      "static_quantity",
      {
        where: {
          reference_number: ref_code,
        },
      }
    );

    const inventory_fetch_subpart_sum = await Inventory_Subpart.sum(
      "static_quantity",
      {
        where: {
          reference_number: ref_code,
        },
      }
    );

    // Sum up the static_quantity values from all tables
    const total_static_quantity =
      inventory_fetch_sum +
      inventory_fetch_asm_sum +
      inventory_fetch_spare_sum +
      inventory_fetch_subpart_sum;

    // console.log("Total Static Quantity:", total_static_quantity);

    let finalCostFright;

    if (shippingFeeBool === true) {
      finalCostFright = shippingFee;
    } else {
      finalCostFright = shippingFee / total_static_quantity;
    }

    // console.log(`finalCostFright ${finalCostFright}`)

    const inventory_fetch = await Inventory.findAll({
      where: {
        reference_number: ref_code,
      },
    });

    const inventory_fetch_asm = await Inventory_Assembly.findAll({
      where: {
        reference_number: ref_code,
      },
    });

    const inventory_fetch_spare = await Inventory_Spare.findAll({
      where: {
        reference_number: ref_code,
      },
    });

    const inventory_fetch_subpart = await Inventory_Subpart.findAll({
      where: {
        reference_number: ref_code,
      },
    });

    inventory_fetch.forEach((item) => {
      console.log(
        `inventory_id ${item.inventory_id} static_quantity ${item.static_quantity} `
      );

      Inventory.update(
        {
          custom_cost: customFee,
          freight_cost: finalCostFright,
        },

        {
          where: {
            inventory_id: item.inventory_id,
          },
        }
      );
    });

    inventory_fetch_asm.forEach((item) => {
      console.log(
        `inventory_id ${item.inventory_id} static_quantity ${item.static_quantity} `
      );

      Inventory_Assembly.update(
        {
          custom_cost: customFee,
          freight_cost: finalCostFright,
        },

        {
          where: {
            inventory_id: item.inventory_id,
          },
        }
      );
    });

    inventory_fetch_spare.forEach((item) => {
      console.log(
        `inventory_id ${item.inventory_id} static_quantity ${item.static_quantity} `
      );

      Inventory_Spare.update(
        {
          custom_cost: customFee,
          freight_cost: finalCostFright,
        },

        {
          where: {
            inventory_id: item.inventory_id,
          },
        }
      );
    });

    inventory_fetch_subpart.forEach((item) => {
      console.log(
        `inventory_id ${item.inventory_id} static_quantity ${item.static_quantity} `
      );

      Inventory_Subpart.update(
        {
          custom_cost: customFee,
          freight_cost: finalCostFright,
        },

        {
          where: {
            inventory_id: item.inventory_id,
          },
        }
      );
    });

    const update = Receiving_PO.update(
      {
        status: final_status,
        customFee: customFee,
        freight_cost: finalCostFright,
      },
      {
        where: { id: receiving_id },
      }
    );

    if (update) {
      return res.status(200).json();
    } else {
      return res.status(500).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/fetchCountIssued").get(async (req, res) => {
  try {
    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    const currentDate = moment();
    const firstDateOfMonth = currentDate
      .clone()
      .startOf("month")
      .startOf("day");
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf("day");

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

    return res.json(countProduct);
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
    const firstDateOfMonth = currentDate
      .clone()
      .startOf("month")
      .startOf("day");
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf("day");

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

    return res.json(countProductQuantity === null ? 0 : countProductQuantity);
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
    const firstDateOfMonth = currentDate
      .clone()
      .startOf("month")
      .startOf("day");
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf("day");

    let sumPRD = 0;

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

    // const totalValue = sumPRD + sumAsmbly + sumSpare + sumSub;
    const formattedTotalValue = sumPRD.toFixed(2).toLocaleString();
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
    const firstDateOfMonth = currentDate
      .clone()
      .startOf("month")
      .startOf("day");
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf("day");

    const countSupplier = await Supplier.count({
      where: {
        supplier_status: "Active",
        // createdAt: {
        //   [Op.between]: [
        //     firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        //     lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
        //   ],
        // },
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

    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    const currentDate = moment();
    const firstDateOfMonth = currentDate
      .clone()
      .startOf("month")
      .startOf("day");
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf("day");

    const ordered_canvassed = await PR_PO.findAll({
      where: {
        status: "To-Receive",
        date_approved: {
          [Op.between]: [
            firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
            lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
      },
      include: [
        {
          model: PR,
          required: true,
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

    res.json(orderedCountPRD);
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
      // console.log(
      //   `Accumulated quantity for product_id ${product_id}: ${quantities[product_id]}`
      // );

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
      // console.log(
      //   `Accumulated quantity for product_id ${product_id}: ${quantities_subpart[product_id]}`
      // );

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
      // console.log(
      //   `Accumulated quantity for product_id ${product_id}: ${quantities[product_id]}`
      // );

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
      // console.log(
      //   `Accumulated quantity for product_id ${product_id}: ${quantities_subpart[product_id]}`
      // );

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
      // console.log(
      //   `Accumulated quantity for product_id ${product_id}: ${quantities[product_id]}`
      // );

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
      // console.log(
      //   `Accumulated quantity for product_id ${product_id}: ${quantities_subpart[product_id]}`
      // );

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
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const currentYear_StartDate = formatDate(firstDayOfJanuaryCurrentYear);
    const currentYear_EndDate = formatDate(lastDayOfDecemberCurrentYear);

    const lastYear_StartDate = formatDate(firstDayOfJanuaryLastYear);
    const lastYear_EndDate = formatDate(lastDayOfDecemberLastYear);

    console.log("Last day of December, current year:", currentYear_EndDate);
    console.log("First day of January, current year:", currentYear_StartDate);
    console.log("Last day of December, last year:", lastYear_EndDate);
    console.log("First day of January, last year:", lastYear_StartDate);

    const dataCounts = await Inventory.findAll({
      include: [
        {
          model: ProductTAGSupplier,
          required: true,
        },
      ],
      where: {
        createdAt: {
          [Op.between]: [lastYear_StartDate, currentYear_EndDate],
        },
      },
    });

    // const dataCounts_asm = await Inventory_Assembly.findAll({
    //   include: [
    //     {
    //       model: Assembly_Supplier,
    //       required: true,
    //     },
    //   ],
    //   where: {
    //     createdAt: {
    //       [Op.between]: [lastYear_StartDate, currentYear_EndDate],
    //     },
    //   },
    // });

    // const dataCounts_spare = await Inventory_Spare.findAll({
    //   include: [
    //     {
    //       model: SparePart_Supplier,
    //       required: true,
    //     },
    //   ],
    //   where: {
    //     createdAt: {
    //       [Op.between]: [lastYear_StartDate, currentYear_EndDate],
    //     },
    //   },
    // });

    // const dataCounts_subpart = await Inventory_Subpart.findAll({
    //   include: [
    //     {
    //       model: Subpart_supplier,
    //       required: true,
    //     },
    //   ],
    //   where: {
    //     createdAt: {
    //       [Op.between]: [lastYear_StartDate, currentYear_EndDate],
    //     },
    //   },
    // });

    // Array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const combinedQuantities = {};

    // Loop through each inventory item
    [dataCounts].forEach((data) => {
      data.forEach((item) => {
        const inventoryQuantity = item.static_quantity;
        const product_id = item.product_tag_supplier.product_id;

        // Get the year and month from the createdAt field of the inventory item
        const createdAt = new Date(item.createdAt);
        const currentYear = createdAt.getFullYear();
        const month = createdAt.getMonth();

        // Determine if it's last year or this year
        const yearLabel =
          currentYear === new Date().getFullYear() ? "ThisYear" : "LastYear";

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
        LastYear: 0,
      };

      // Check if the month exists in ThisYear
      if (
        combinedQuantities["ThisYear"] &&
        combinedQuantities["ThisYear"][index]
      ) {
        for (const product_id in combinedQuantities["ThisYear"][index]) {
          monthData.ThisYear +=
            combinedQuantities["ThisYear"][index][product_id];
        }
      }

      // Check if the month exists in LastYear
      if (
        combinedQuantities["LastYear"] &&
        combinedQuantities["LastYear"][index]
      ) {
        for (const product_id in combinedQuantities["LastYear"][index]) {
          monthData.LastYear +=
            combinedQuantities["LastYear"][index][product_id];
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
      where: {
        status: {
          [Op.or]: ["To-Receive", "Received"],
        },
      },
      include: [
        {
          model: PR,
          required: true,
        },
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
        count: productCounts[productId],
      });
    }

    // // Now productInfoArray contains the required information
    // console.log(productInfoArray);
    productInfoArray.sort((a, b) => b.count - a.count);

    return res.json(productInfoArray);
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
    const firstDateOfMonth = currentDate
      .clone()
      .startOf("month")
      .startOf("day");
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf("day");

    // ----------------Product on order ------------------
    let orderedCountPRD = 0;

    const ordered_canvassed = await Receiving_Prd.findAll({
      include: [
        {
          model: Receiving_PO,
          required: true,
          where: {
            status: { [Op.ne]: "For Approval" },
            status: { [Op.ne]: "In-transit" },
            status: { [Op.ne]: "In-transit (Complete)" },
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
          include: [
            {
              model: ProductTAGSupplier,
              required: true,
            },
          ],
        },
      ],
    });

    const productCount = {};

    ordered_canvassed.forEach((order_quantity) => {
      const product_id =
        order_quantity.purchase_req_canvassed_prd.product_tag_supplier
          .product_id;

      // Check if product_id already exists in productCount
      if (!productCount[product_id]) {
        // If not, increment orderedCountPRD and mark the product_id as counted
        orderedCountPRD++;
        productCount[product_id] = true;
      }
    });

    // console.log(`orderedCountPRDsss ${orderedCountPRD}`)

    res.json(orderedCountPRD);
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

    // Format dates into desired string format
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const currentYear_StartDate = formatDate(firstDayOfJanuaryCurrentYear);
    const currentYear_EndDate = formatDate(lastDayOfDecemberCurrentYear);

    // console.log("Last day of December, current year:", currentYear_EndDate);
    // console.log("First day of January, current year:", currentYear_StartDate);

    const monthlyCounts = [
      { month: "January", Ordered: 0, Received: 0 },
      { month: "February", Ordered: 0, Received: 0 },
      { month: "March", Ordered: 0, Received: 0 },
      { month: "April", Ordered: 0, Received: 0 },
      { month: "May", Ordered: 0, Received: 0 },
      { month: "June", Ordered: 0, Received: 0 },
      { month: "July", Ordered: 0, Received: 0 },
      { month: "August", Ordered: 0, Received: 0 },
      { month: "September", Ordered: 0, Received: 0 },
      { month: "October", Ordered: 0, Received: 0 },
      { month: "November", Ordered: 0, Received: 0 },
      { month: "December", Ordered: 0, Received: 0 },
    ];

    const dataCounts_order = await PR_PO.findAll({
      where: {
        status: "To-Receive",
        date_approved: {
          [Op.between]: [currentYear_StartDate, currentYear_EndDate],
        },
      },
      include: [
        {
          model: ProductTAGSupplier,
          required: true,
        },
        {
          model: PR,
          required: true,
        },
      ],
    });

    // Object to keep track of unique product IDs for each month
    const uniqueProductIdsByMonth = {};

    // Update the counts for each month
    dataCounts_order.forEach((item) => {
      const product_id = item.product_tag_supplier.product_id;
      const createdAtMonthIndex = new Date(
        item.purchase_req.date_approved
      ).getMonth(); // Get the month index
      const createdAtMonthName = new Date(
        item.purchase_req.date_approved
      ).toLocaleString("default", { month: "long" }); // Get the name of the month

      // If the month key doesn't exist, create it and initialize an empty Set to store unique product IDs
      if (!uniqueProductIdsByMonth.hasOwnProperty(createdAtMonthName)) {
        uniqueProductIdsByMonth[createdAtMonthName] = new Set();
      }

      // Add the product_id to the corresponding month's set
      uniqueProductIdsByMonth[createdAtMonthName].add(product_id);
    });

    // Update the counts in the monthlyCounts array
    for (const monthData of monthlyCounts) {
      const monthName = monthData.month;
      monthData.Ordered = uniqueProductIdsByMonth[monthName]
        ? uniqueProductIdsByMonth[monthName].size
        : 0;
    }

    const dataCounts_received = await Receiving_Prd.findAll({
      include: [
        {
          model: PR_PO,
          required: true,
          include: [
            {
              model: ProductTAGSupplier,
              required: true,
            },
          ],
        },
        {
          model: Receiving_PO,
          required: true,
          where: {
            status: {
              [Op.notIn]: [
                "For Approval",
                "In-transit",
                "In-transit (Complete)",
              ],
            },
            date_approved: {
              [Op.between]: [currentYear_StartDate, currentYear_EndDate],
            },
          },
        },
      ],
    });

    // Object to keep track of unique product IDs received for each month
    const uniqueReceivedProductIdsByMonth = {};

    // Update the counts for each month
    dataCounts_received.forEach((item) => {
      const product_id =
        item.purchase_req_canvassed_prd.product_tag_supplier.product_id;
      const createdAtMonthName = new Date(
        item.receiving_po.date_approved
      ).toLocaleString("default", { month: "long" }); // Get the name of the month

      // If the month key doesn't exist, create it and initialize an empty Set to store unique product IDs
      if (!uniqueReceivedProductIdsByMonth.hasOwnProperty(createdAtMonthName)) {
        uniqueReceivedProductIdsByMonth[createdAtMonthName] = new Set();
      }

      // Add the product_id to the corresponding month's set
      uniqueReceivedProductIdsByMonth[createdAtMonthName].add(product_id);
    });

    // Update the counts in the monthlyCounts array for 'Received'
    for (const monthData of monthlyCounts) {
      const monthName = monthData.month;
      monthData.Received = uniqueReceivedProductIdsByMonth[monthName]
        ? uniqueReceivedProductIdsByMonth[monthName].size
        : 0;
    }
    /// -------------------------------------ASSEMBLY ----------------------------------------

    const uniqueProductIdsByMonth_asm = {};
    const uniqueReceivedProductIdsByMonth_asm = {};
    // Counting and updating for assembly products similar to regular products
    const dataCounts_order_asm = await PR_PO_asmbly.findAll({
      include: [
        {
          model: Assembly_Supplier,
          required: true,
        },
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
            date_approved: {
              [Op.between]: [currentYear_StartDate, currentYear_EndDate],
            },
          },
        },
      ],
    });

    dataCounts_order_asm.forEach((item) => {
      const product_id = item.assembly_supplier.assembly_id;
      const createdAtMonthName = new Date(
        item.purchase_req.date_approved
      ).toLocaleString("default", { month: "long" });

      // If the month key doesn't exist, create it and initialize an empty Set to store unique assembly product IDs
      if (!uniqueProductIdsByMonth_asm.hasOwnProperty(createdAtMonthName)) {
        uniqueProductIdsByMonth_asm[createdAtMonthName] = new Set();
      }

      // Add the product_id to the corresponding month's set
      uniqueProductIdsByMonth_asm[createdAtMonthName].add(product_id);
    });

    // Counting and updating for received assembly products
    const dataCounts_received_asm = await Receiving_Asm.findAll({
      include: [
        {
          model: PR_PO_asmbly,
          required: true,
          include: [
            {
              model: Assembly_Supplier,
              required: true,
            },
          ],
        },
        {
          model: Receiving_PO,
          required: true,
          where: {
            status: {
              [Op.notIn]: [
                "For Approval",
                "In-transit",
                "In-transit (Complete)",
              ],
            },
            date_approved: {
              [Op.between]: [currentYear_StartDate, currentYear_EndDate],
            },
          },
        },
      ],
    });

    dataCounts_received_asm.forEach((item) => {
      const product_id =
        item.purchase_req_canvassed_asmbly.assembly_supplier.assembly_id;
      const createdAtMonthName = new Date(
        item.receiving_po.date_approved
      ).toLocaleString("default", { month: "long" });

      // If the month key doesn't exist, create it and initialize an empty Set to store unique received assembly product IDs
      if (
        !uniqueReceivedProductIdsByMonth_asm.hasOwnProperty(createdAtMonthName)
      ) {
        uniqueReceivedProductIdsByMonth_asm[createdAtMonthName] = new Set();
      }

      // Add the product_id to the corresponding month's set
      uniqueReceivedProductIdsByMonth_asm[createdAtMonthName].add(product_id);
    });

    // Updating the counts in the monthlyCounts array for assembly products
    for (const monthData of monthlyCounts) {
      const monthName = monthData.month;
      monthData.Ordered += uniqueProductIdsByMonth_asm[monthName]
        ? uniqueProductIdsByMonth_asm[monthName].size
        : 0;
      monthData.Received += uniqueReceivedProductIdsByMonth_asm[monthName]
        ? uniqueReceivedProductIdsByMonth_asm[monthName].size
        : 0;
    }

    /// -------------------------------------Spare PArt ----------------------------------------

    const uniqueProductIdsByMonth_spare = {};
    const uniqueReceivedProductIdsByMonth_spare = {};
    // Counting and updating for assembly products similar to regular products
    const dataCounts_order_spare = await PR_PO_spare.findAll({
      include: [
        {
          model: SparePart_Supplier,
          required: true,
        },
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
            date_approved: {
              [Op.between]: [currentYear_StartDate, currentYear_EndDate],
            },
          },
        },
      ],
    });

    dataCounts_order_spare.forEach((item) => {
      const product_id = item.sparepart_supplier.sparePart_id;
      const createdAtMonthName = new Date(
        item.purchase_req.date_approved
      ).toLocaleString("default", { month: "long" });

      // If the month key doesn't exist, create it and initialize an empty Set to store unique assembly product IDs
      if (!uniqueProductIdsByMonth_spare.hasOwnProperty(createdAtMonthName)) {
        uniqueProductIdsByMonth_spare[createdAtMonthName] = new Set();
      }

      // Add the product_id to the corresponding month's set
      uniqueProductIdsByMonth_spare[createdAtMonthName].add(product_id);
    });

    // Counting and updating for received assembly products
    const dataCounts_received_spare = await Receiving_Spare.findAll({
      include: [
        {
          model: PR_PO_spare,
          required: true,
          include: [
            {
              model: SparePart_Supplier,
              required: true,
            },
          ],
        },
        {
          model: Receiving_PO,
          required: true,
          where: {
            status: {
              [Op.notIn]: [
                "For Approval",
                "In-transit",
                "In-transit (Complete)",
              ],
            },
            date_approved: {
              [Op.between]: [currentYear_StartDate, currentYear_EndDate],
            },
          },
        },
      ],
    });

    dataCounts_received_spare.forEach((item) => {
      const product_id =
        item.purchase_req_canvassed_spare.sparepart_supplier.sparePart_id;
      const createdAtMonthName = new Date(
        item.receiving_po.date_approved
      ).toLocaleString("default", { month: "long" });

      // If the month key doesn't exist, create it and initialize an empty Set to store unique received assembly product IDs
      if (
        !uniqueReceivedProductIdsByMonth_spare.hasOwnProperty(
          createdAtMonthName
        )
      ) {
        uniqueReceivedProductIdsByMonth_spare[createdAtMonthName] = new Set();
      }

      // Add the product_id to the corresponding month's set
      uniqueReceivedProductIdsByMonth_spare[createdAtMonthName].add(product_id);
    });

    // Updating the counts in the monthlyCounts array for assembly products
    for (const monthData of monthlyCounts) {
      const monthName = monthData.month;
      monthData.Ordered += uniqueProductIdsByMonth_spare[monthName]
        ? uniqueProductIdsByMonth_spare[monthName].size
        : 0;
      monthData.Received += uniqueReceivedProductIdsByMonth_spare[monthName]
        ? uniqueReceivedProductIdsByMonth_spare[monthName].size
        : 0;
    }

    /// -------------------------------------Subpart ----------------------------------------

    const uniqueProductIdsByMonth_subpart = {};
    const uniqueReceivedProductIdsByMonth_subpart = {};
    // Counting and updating for assembly products similar to regular products
    const dataCounts_order_subpart = await PR_PO_subpart.findAll({
      include: [
        {
          model: Subpart_supplier,
          required: true,
        },
        {
          model: PR,
          required: true,
          where: {
            status: "To-Receive",
            date_approved: {
              [Op.between]: [currentYear_StartDate, currentYear_EndDate],
            },
          },
        },
      ],
    });

    dataCounts_order_subpart.forEach((item) => {
      const product_id = item.subpart_supplier.subpart_id;
      const createdAtMonthName = new Date(
        item.purchase_req.date_approved
      ).toLocaleString("default", { month: "long" });

      // If the month key doesn't exist, create it and initialize an empty Set to store unique assembly product IDs
      if (!uniqueProductIdsByMonth_subpart.hasOwnProperty(createdAtMonthName)) {
        uniqueProductIdsByMonth_subpart[createdAtMonthName] = new Set();
      }

      // Add the product_id to the corresponding month's set
      uniqueProductIdsByMonth_subpart[createdAtMonthName].add(product_id);
    });

    // Counting and updating for received assembly products
    const dataCounts_received_subpart = await Receiving_Subpart.findAll({
      include: [
        {
          model: PR_PO_subpart,
          required: true,
          include: [
            {
              model: Subpart_supplier,
              required: true,
            },
          ],
        },
        {
          model: Receiving_PO,
          required: true,
          where: {
            status: {
              [Op.notIn]: [
                "For Approval",
                "In-transit",
                "In-transit (Complete)",
              ],
            },
            date_approved: {
              [Op.between]: [currentYear_StartDate, currentYear_EndDate],
            },
          },
        },
      ],
    });

    dataCounts_received_subpart.forEach((item) => {
      const product_id =
        item.purchase_req_canvassed_subpart.subpart_supplier.subpart_id;
      const createdAtMonthName = new Date(
        item.receiving_po.date_approved
      ).toLocaleString("default", { month: "long" });

      // If the month key doesn't exist, create it and initialize an empty Set to store unique received assembly product IDs
      if (
        !uniqueReceivedProductIdsByMonth_subpart.hasOwnProperty(
          createdAtMonthName
        )
      ) {
        uniqueReceivedProductIdsByMonth_subpart[createdAtMonthName] = new Set();
      }

      // Add the product_id to the corresponding month's set
      uniqueReceivedProductIdsByMonth_subpart[createdAtMonthName].add(
        product_id
      );
    });

    // Updating the counts in the monthlyCounts array for assembly products
    for (const monthData of monthlyCounts) {
      const monthName = monthData.month;
      monthData.Ordered += uniqueProductIdsByMonth_subpart[monthName]
        ? uniqueProductIdsByMonth_subpart[monthName].size
        : 0;
      monthData.Received += uniqueReceivedProductIdsByMonth_subpart[monthName]
        ? uniqueReceivedProductIdsByMonth_subpart[monthName].size
        : 0;
    }

    // Output the updated array
    // console.log(monthlyCounts);

    // console.log(monthlyCounts);
    res.json(monthlyCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/countSupplierLeadGraph").get(async (req, res) => {
  try {
    const dataCount = await Receiving_PO.findAll({
      include: [
        {
          model: PR,
          required: true,
        },
      ],
    });

    const maxCreatedAtPerPoId = {};

    dataCount.forEach((item) => {
      const pr_id = item.pr_id;
      const createdAt = new Date(item.createdAt); // Convert createdAt to Date object
      createdAt.setHours(0, 0, 0, 0); // Set time to midnight to exclude the time
      const po_id = item.po_id;
      const prApproved = new Date(item.purchase_req.date_approved); // Convert prApproved to Date object
      prApproved.setHours(0, 0, 0, 0); // Set time to midnight to exclude the time

      // Check if this po_id already has a maxCreatedAt recorded
      if (
        !maxCreatedAtPerPoId[po_id] ||
        createdAt > maxCreatedAtPerPoId[po_id].createdAt
      ) {
        // If not, or if the current createdAt is greater, update the maxCreatedAt for this po_id
        maxCreatedAtPerPoId[po_id] = { createdAt, pr_id, prApproved };
      }
    });

    const po_id_list = Object.keys(maxCreatedAtPerPoId);

    const promises = [];

    // Define the queries for each table
    const queries = [
      {
        model: PR_PO,
        include: [
          {
            model: ProductTAGSupplier,
            required: true,
            include: [
              {
                model: Supplier,
                required: true,
              },
            ],
          },
        ],
      },
      // {
      //   model: PR_PO_asmbly,
      //   include: [
      //     {
      //       model: Assembly_Supplier,
      //       required: true,
      //       include: [
      //         {
      //           model: Supplier,
      //           required: true,
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   model: PR_PO_spare,
      //   include: [
      //     {
      //       model: SparePart_Supplier,
      //       required: true,
      //       include: [
      //         {
      //           model: Supplier,
      //           required: true,
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   model: PR_PO_subpart,
      //   include: [
      //     {
      //       model: Subpart_supplier,
      //       required: true,
      //       include: [
      //         {
      //           model: Supplier,
      //           required: true,
      //         },
      //       ],
      //     },
      //   ],
      // },
    ];

    // Execute the queries for each table
    queries.forEach((query) => {
      promises.push(
        query.model.findAll({
          include: query.include,
          where: {
            po_id: po_id_list,
          },
        })
      );
    });

    // Wait for all queries to complete
    const results = await Promise.all(promises);

    const displayedSuppliers = {};

    const supplierData = [];

    // Process each result
    results.forEach((suppliers, index) => {
      suppliers.forEach((supplier) => {
        const supp_name = supplier.product_tag_supplier.supplier_name;

        const po_id = supplier.po_id; // Get PO ID from the result

        // Check if a supplier for this supplier name has already been displayed
        if (!displayedSuppliers[supp_name]) {
          const daysPassed = Math.floor(
            (maxCreatedAtPerPoId[po_id].createdAt -
              maxCreatedAtPerPoId[po_id].prApproved) /
              (1000 * 60 * 60 * 24)
          ); // Calculate days passed

          // Push the supplier data into the array
          supplierData.push({ name: supp_name, days: daysPassed });

          // Mark this supplier name as displayed
          displayedSuppliers[supp_name] = true;
        }
      });
    });
    // console.log(`supplierData`);
    // console.log(supplierData); // Output the array

    //filter only 5 supplier will push
    supplierData.sort((a, b) => a.days - b.days);
    const topFiveSuppliers = supplierData.slice(0, 5);
    return res.json(topFiveSuppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/receivingOverView").get(async (req, res) => {
  const receiving_po = await Receiving_PO.findAll({
    include: [
      {
        model: PR,
        required: true,
      },
    ],
    where: {
      status: {
        [Op.or]: [
          "Delivered (Lack of Cost)",
          "Delivered (Lack of FreightCost)",
          "Delivered (Lack of CustomCost)",
        ],
      },
    },
  });

  // console.log(receiving_po)
  return res.json(receiving_po);
});

module.exports = router;
