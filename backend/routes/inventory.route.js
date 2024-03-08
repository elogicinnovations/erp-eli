const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
// const Assembly_SparePart = require('../db/models/assembly_spare.model')
const {
  Inventory,
  Inventory_Assembly,
  Inventory_Spare,
  Inventory_Subpart,
  Product,
  ProductTAGSupplier,
  Assembly_Supplier,
  SparePart_Supplier,
  Subpart_supplier,
  Manufacturer,
  BinLocation,
  Category,
  Supplier,
  Assembly,
  SparePart,
  SubPart,
  Warehouses,
} = require("../db/models/associations");

const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/fetchInventory_group").get(async (req, res) => {
  try {
    const productData = await Inventory.findAll({
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
          required: true,
        },
      ],
    });

    // Grouping the product data by warehouse_id
    const groupedProductData = {};
    productData.forEach((item) => {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.product_tag_supplier?.product?.product_id;
      const productCode = item.product_tag_supplier?.product?.product_code;
      const productName = item.product_tag_supplier?.product?.product_name;
      const Manufacturer =
        item.product_tag_supplier?.product?.manufacturer?.manufacturer_name;
      const Price = item.price;
      // Ensure that productCode and productName are truthy before using them
      if (productCode && productName && Price) {
        const key = `${productCode}_${productName}_${Price}`;

        if (!groupedProductData[key]) {
          groupedProductData[key] = {
            productID: productID,
            warehouseId: warehouseId,
            product_code: productCode,
            product_name: productName,
            manufacturer: Manufacturer,
            totalQuantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        groupedProductData[key].totalQuantity += item.quantity;
        groupedProductData[key].products.push(item);
      }
    });

    const finalResult_PRD = Object.values(groupedProductData);
    // console.log('Productdddfdsfd', JSON.stringify(finalResult, null, 2));

    const assemblyData = await Inventory_Assembly.findAll({
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
          required: true,
        },
      ],
    });

    // Grouping the product data by warehouse_id
    const groupedAsmData = {};
    assemblyData.forEach((item) => {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.assembly_supplier?.assembly?.id;
      const productCode = item.assembly_supplier?.assembly?.assembly_code;
      const productName = item.assembly_supplier?.assembly?.assembly_name;
      const Manufacturer =
        item.assembly_supplier?.assembly?.manufacturer?.manufacturer_name;
      const Price = item.price;
      // Ensure that productCode and productName are truthy before using them
      if (productCode && productName && Price) {
        const key = `${productCode}_${productName}_${Price}`;

        if (!groupedAsmData[key]) {
          groupedAsmData[key] = {
            productID: productID,
            warehouseId: warehouseId,
            product_code: productCode,
            product_name: productName,
            manufacturer: Manufacturer,
            totalQuantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        groupedAsmData[key].totalQuantity += item.quantity;
        groupedAsmData[key].products.push(item);
      }
    });

    const finalResult_asm = Object.values(groupedAsmData);

    const spareData = await Inventory_Spare.findAll({
      include: [
        {
          model: SparePart_Supplier,
          required: true,

          include: [
            {
              model: SparePart,
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
          required: true,
        },
      ],
    });

    // Grouping the product data by warehouse_id
    const groupedSpareData = {};
    spareData.forEach((item) => {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.sparepart_supplier?.sparePart?.id;
      const productCode = item.sparepart_supplier?.sparePart?.spareParts_code;
      const productName = item.sparepart_supplier?.sparePart?.spareParts_name;
      const Manufacturer =
        item.sparepart_supplier?.sparePart?.manufacturer?.manufacturer_name;
      const Price = item.price;
      // Ensure that productCode and productName are truthy before using them
      if (productCode && productName && Price) {
        const key = `${productCode}_${productName}_${Price}`;

        if (!groupedSpareData[key]) {
          groupedSpareData[key] = {
            productID: productID,
            warehouseId: warehouseId,
            product_code: productCode,
            product_name: productName,
            manufacturer: Manufacturer,
            totalQuantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        groupedSpareData[key].totalQuantity += item.quantity;
        groupedSpareData[key].products.push(item);
      }
    });

    const finalResult_spare = Object.values(groupedSpareData);

    const subpartData = await Inventory_Subpart.findAll({
      include: [
        {
          model: Subpart_supplier,
          required: true,

          include: [
            {
              model: SubPart,
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
          required: true,
        },
      ],
    });

    const groupedSubpartData = {};
    subpartData.forEach((item) => {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.subpart_supplier?.subPart?.id;
      const productCode = item.subpart_supplier?.subPart?.subPart_code;
      const productName = item.subpart_supplier?.subPart?.subPart_name;
      const Manufacturer =
        item.subpart_supplier?.subPart?.manufacturer?.manufacturer_name;
      const Price = item.price;
      // Ensure that productCode and productName are truthy before using them
      if (productCode && productName && Price) {
        const key = `${productCode}_${productName}_${Price}`;

        if (!groupedSubpartData[key]) {
          groupedSubpartData[key] = {
            productID: productID,
            warehouseId: warehouseId,
            product_code: productCode,
            product_name: productName,
            manufacturer: Manufacturer,
            totalQuantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        groupedSubpartData[key].totalQuantity += item.quantity;
        groupedSubpartData[key].products.push(item);
      }
    });

    const finalResult_subpart = Object.values(groupedSubpartData);

    return res.json({
      product: finalResult_PRD,
      assembly: finalResult_asm,
      spare: finalResult_spare,
      subpart: finalResult_subpart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchWarehouseInvetory").get(async (req, res) => {
  try {
    const productData = await Inventory.findAll({
      include: [
        {
          model: ProductTAGSupplier,
          required: true,

          include: [
            {
              model: Product,
              required: true,

              where: {
                product_id: req.query.id,
              },

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
          required: true,
        },
      ],
    });

    // Grouping the product data by warehouse_id
    const groupedProductData = {};
    productData.forEach((item) => {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.product_tag_supplier?.product?.product_id;
      const productCode = item.product_tag_supplier?.product?.product_code;
      const productName = item.product_tag_supplier?.product?.product_name;
      const Manufacturer =
        item.product_tag_supplier?.product?.manufacturer?.manufacturer_name;
      const Price = item.price;
      // Ensure that productCode and productName are truthy before using them
      if (warehouseId && productCode && productName && Price) {
        const key = `${warehouseId}_${productCode}_${productName}_${Price}`;

        if (!groupedProductData[key]) {
          groupedProductData[key] = {
            productID: productID,
            warehouseId: warehouseId,
            product_code: productCode,
            product_name: productName,
            manufacturer: Manufacturer,
            totalQuantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        groupedProductData[key].totalQuantity += item.quantity;
        groupedProductData[key].products.push(item);
      }
    });

    const finalResult_PRD = Object.values(groupedProductData);
    // console.log('Productdddfdsfd', JSON.stringify(finalResult, null, 2));

    return res.json(finalResult_PRD);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchWarehouseInvetory_asm").get(async (req, res) => {
  try {
    const assemblyData = await Inventory_Assembly.findAll({
      include: [
        {
          model: Assembly_Supplier,
          required: true,

          include: [
            {
              model: Assembly,
              required: true,

              where: { id: req.query.id },

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
          required: true,
        },
      ],
    });

    // Grouping the product data by warehouse_id
    const groupedAsmData = {};
    assemblyData.forEach((item) => {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.assembly_supplier?.assembly?.id;
      const productCode = item.assembly_supplier?.assembly?.assembly_code;
      const productName = item.assembly_supplier?.assembly?.assembly_name;
      const Manufacturer =
        item.assembly_supplier?.assembly?.manufacturer?.manufacturer_name;
      const Price = item.price;
      // Ensure that productCode and productName are truthy before using them
      if (warehouseId && productCode && productName && Price) {
        const key = `${warehouseId}_${warehouseId}_${productName}_${Price}`;

        if (!groupedAsmData[key]) {
          groupedAsmData[key] = {
            productID: productID,
            warehouseId: warehouseId,
            product_code: productCode,
            product_name: productName,
            manufacturer: Manufacturer,
            totalQuantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        groupedAsmData[key].totalQuantity += item.quantity;
        groupedAsmData[key].products.push(item);
      }
    });

    const finalResult_asm = Object.values(groupedAsmData);

    return res.json(finalResult_asm);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchWarehouseInvetory_spare").get(async (req, res) => {
  try {
    const spareData = await Inventory_Spare.findAll({
      include: [
        {
          model: SparePart_Supplier,
          required: true,

          include: [
            {
              model: SparePart,
              required: true,

              where: {
                id: req.query.id,
              },

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
          required: true,
        },
      ],
    });

    // Grouping the product data by warehouse_id
    const groupedSpareData = {};
    spareData.forEach((item) => {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.sparepart_supplier?.sparePart?.id;
      const productCode = item.sparepart_supplier?.sparePart?.spareParts_code;
      const productName = item.sparepart_supplier?.sparePart?.spareParts_name;
      const Manufacturer =
        item.sparepart_supplier?.sparePart?.manufacturer?.manufacturer_name;
      const Price = item.price;
      // Ensure that productCode and productName are truthy before using them
      if (warehouseId && productCode && productName && Price) {
        const key = `${warehouseId}_${productCode}_${productName}_${Price}`;

        if (!groupedSpareData[key]) {
          groupedSpareData[key] = {
            productID: productID,
            warehouseId: warehouseId,
            product_code: productCode,
            product_name: productName,
            manufacturer: Manufacturer,
            totalQuantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        groupedSpareData[key].totalQuantity += item.quantity;
        groupedSpareData[key].products.push(item);
      }
    });

    const finalResult_spare = Object.values(groupedSpareData);

    return res.json(finalResult_spare);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchWarehouseInvetory_subpart").get(async (req, res) => {
  try {
    const subpartData = await Inventory_Subpart.findAll({
      include: [
        {
          model: Subpart_supplier,
          required: true,

          include: [
            {
              model: SubPart,
              required: true,

              where:{id: req.query.id},

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
          required: true,
        },
      ],
    });

    const groupedSubpartData = {};
    subpartData.forEach((item) => {
      const warehouseId = item.warehouse_id;
      const warehouse_name = item.warehouse?.warehouse_name;
      const productID = item.subpart_supplier?.subPart?.id;
      const productCode = item.subpart_supplier?.subPart?.subPart_code;
      const productName = item.subpart_supplier?.subPart?.subPart_name;
      const Manufacturer =
        item.subpart_supplier?.subPart?.manufacturer?.manufacturer_name;
      const Price = item.price;
      // Ensure that productCode and productName are truthy before using them
      if (warehouseId && productCode && productName && Price) {
        const key = `${warehouseId}_${productCode}_${productName}_${Price}`;

        if (!groupedSubpartData[key]) {
          groupedSubpartData[key] = {
            productID: productID,
            warehouseId: warehouseId,
            product_code: productCode,
            product_name: productName,
            manufacturer: Manufacturer,
            totalQuantity: 0,
            warehouse_name: warehouse_name,
            price: Price,
            products: [],
          };
        }

        groupedSubpartData[key].totalQuantity += item.quantity;
        groupedSubpartData[key].products.push(item);
      }
    });

    const finalResult_subpart = Object.values(groupedSubpartData);
    return res.json(finalResult_subpart);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchInventory").get(async (req, res) => {
  try {
    const productData = await Inventory.findAll({
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
          required: true,
        },
      ],
    });

    const assemblyData = await Inventory_Assembly.findAll({
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
          required: true,
        },
      ],
    });

    const spareData = await Inventory_Spare.findAll({
      include: [
        {
          model: SparePart_Supplier,
          required: true,

          include: [
            {
              model: SparePart,
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
          required: true,
        },
      ],
    });

    const subpartData = await Inventory_Subpart.findAll({
      include: [
        {
          model: Subpart_supplier,
          required: true,

          include: [
            {
              model: SubPart,
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
          required: true,
        },
      ],
    });

    return res.json({
      product: productData,
      assembly: assemblyData,
      spare: spareData,
      subpart: subpartData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchView").get(async (req, res) => {
  try {
    const data = await Product.findAll({
      where: {
        product_id: req.query.id,
      },
      include: [
        {
          model: Category,
          required: true,
        },
        {
          model: BinLocation,
          required: true,
        },
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchView_assembly").get(async (req, res) => {
  try {
    const data = await Assembly.findAll({
      where: {
        id: req.query.id,
      },
      include: [
        {
          model: Category,
          required: true,
        },
        {
          model: BinLocation,
          required: true,
        },
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchView_spare").get(async (req, res) => {
  try {
    const data = await SparePart.findAll({
      where: {
        id: req.query.id,
      },
      include: [
        {
          model: Category,
          required: true,
        },
        {
          model: BinLocation,
          required: true,
        },
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchView_subpart").get(async (req, res) => {
  try {
    const data = await SubPart.findAll({
      where: {
        id: req.query.id,
      },
      include: [
        {
          model: Category,
          required: true,
        },
        {
          model: BinLocation,
          required: true,
        },
      ],
    });

    if (data) {
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchToIssueProduct").get(async (req, res) => {
  // para sa pag fetch ng product for issuance
  try {
    // console.log( 'product' + req.query.id)
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
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchToIssueAssembly").get(async (req, res) => {
  // para sa pag fetch ng product for issuance
  try {
    // console.log(req.query.id)
    const data = await Inventory_Assembly.findAll({
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
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchToIssueSpare").get(async (req, res) => {
  // para sa pag fetch ng product for issuance
  try {
    // console.log(req.query.id)
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
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchToIssueSubpart").get(async (req, res) => {
  // para sa pag fetch ng product for issuance
  try {
    // console.log(req.query.id)
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
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

// ------------------ fetch inventory per warehouse  ---------------------//
router.route("/fetchInvetory_assembly_warehouse").get(async (req, res) => {
  try {
    const { warehouse } = req.query;
    const data = await Inventory_Assembly.findAll({
      where: {
        warehouse_id: warehouse,
      },
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
      ],
    });

    if (data) {
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchInvetory_product_warehouse").get(async (req, res) => {
  try {
    const { warehouse } = req.query;
    const data = await Inventory.findAll({
      where: {
        warehouse_id: warehouse,
      },
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
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchInvetory_spare_warehouse").get(async (req, res) => {
  try {
    const { warehouse } = req.query;
    const data = await Inventory_Spare.findAll({
      where: {
        warehouse_id: warehouse,
      },
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
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchInvetory_subpart_warehouse").get(async (req, res) => {
  try {
    const { warehouse } = req.query;
    const data = await Inventory_Subpart.findAll({
      where: {
        warehouse_id: warehouse,
      },
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
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

module.exports = router;
