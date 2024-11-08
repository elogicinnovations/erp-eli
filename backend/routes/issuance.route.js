const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  Issuance,
  MasterList,
  CostCenter,
  Inventory,
  Inventory_Assembly,
  Inventory_Spare,
  Inventory_Subpart,
  IssuedProduct,
  IssuedAssembly,
  IssuedSpare,
  IssuedSubpart,
  IssuedApproveProduct,
  IssuedApproveAssembly,
  IssuedApproveSpare,
  IssuedApproveSubpart,
  ProductTAGSupplier,
  Product,
  Assembly_Supplier,
  Assembly,
  SparePart_Supplier,
  SparePart,
  Subpart_supplier,
  SubPart,
  Warehouses,
  Activity_Log,
  Accountability,
} = require("../db/models/associations");
// const Issued_Product = require('../db/models/issued_product.model')
// const Inventory = require('../db/models/issued_product.model')

// Get All Issuance
router.route("/getIssuance").get(async (req, res) => {
  try {
    const data = await Issuance.findAll({
      include: [
        {
          model: MasterList,
          as: "receiver", // Specify the alias for received_by association
          attributes: ["col_Fname"],
          foreignKey: "received_by", // Use the foreign key associated with received_by
          required: true,
        },
        {
          model: MasterList,
          as: "sender", // Specify the alias for transported_by association
          attributes: ["col_Fname"],
          foreignKey: "transported_by", // Use the foreign key associated with transported_by
          required: true,
        },
        {
          model: CostCenter,
          required: true,
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
      where: {
        status: "Pending",
      },
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

router.route("/getIssuanceFilter").get(async (req, res) => {
  const { status } = req.query;
  try {
    const data = await Issuance.findAll({
      include: [
        {
          model: MasterList,
          as: "receiver", // Specify the alias for received_by association
          attributes: ["col_Fname"],
          foreignKey: "received_by", // Use the foreign key associated with received_by
          required: true,
        },
        {
          model: MasterList,
          as: "sender", // Specify the alias for transported_by association
          attributes: ["col_Fname"],
          foreignKey: "transported_by", // Use the foreign key associated with transported_by
          required: true,
        },
        {
          model: CostCenter,
          required: true,
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
      where: {
        status: status,
      },
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

router.route("/lastAccRefCode").get(async (req, res) => {
  try {
    const lastCodes = await Issuance.max("accountability_refcode");

    let nextCode;
    if (lastCodes) {
      const lastNumber = parseInt(lastCodes.substring(1), 10);
      nextCode = (lastNumber + 1).toString().padStart(6, "0");
    } else {
      nextCode = "000001"; // Initial category code
    }

    res.json({ nextCode });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchApprove").get(async (req, res) => {
  try {
    const productData_notApprove = await IssuedProduct.findAll({
      include: [
        {
          model: Product,
          required: true,
        },
        {
          model: Issuance,
          required: true,
        },
      ],
      where: {
        issuance_id: req.query.id,
      },
    });

    const productData = await IssuedApproveProduct.findAll({
      include: [
        {
          model: Inventory,
          required: true,

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
        },
        {
          model: Issuance,
          required: true,
        },
      ],
      where: {
        issuance_id: req.query.id,
      },
    });

    return res.json({
      product_notApprove: productData_notApprove,
      product: productData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/approval").post(async (req, res) => {
  const id = req.query.id;
  const warehouseId = req.query.fromSite;
  const product = req.query.fetchProduct;
  const userId = req.query.userId;
  const ReceivedBy = req.query.receivedBy;

  // Get the current date and time in the Philippines time zone
  const currentDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Manila",
  });
  const approve = await Issuance.update(
    {
      status: "Approved",
      date_approved: new Date(currentDate),
      approved_by: userId,
    },
    {
      where: {
        issuance_id: req.query.id,
      },
    }
  );
  if (approve) {
    if (product && product.length > 0) {
      for (const prod of product) {
        let remainingQuantity = prod.quantity;

        // console.log(`${prod.product.product_name} --  ${prod.quantity}`);
        // return;
        const productName = prod.product.product_name;
        const checkPrd = await Inventory.findAll({
          where: {
            warehouse_id: warehouseId,
            quantity: {
              [Op.ne]: 0,
            },
          },
          include: [
            {
              model: ProductTAGSupplier,
              required: true,
              include: [
                {
                  model: Product,
                  required: true,
                  where: {
                    product_id: prod.product_id,
                  },
                },
              ],
            },
            {
              model: Warehouses,
              required: true,
            },
          ],
        });

        // Change from forEach to a for...of loop to handle async properly
        for (const inventory of checkPrd) {
          console.log(
            `Inventory ID: ${inventory.inventory_id}, Quantity: ${inventory.quantity}, Warehouse: ${inventory.warehouse.warehouse_name}`
          );
          if (remainingQuantity <= inventory.quantity) {
            console.log(
              `Enough inventory found in inventory ${inventory.inventory_id}. Deducting ${remainingQuantity}.`
            );
            await Inventory.update(
              // Added await for proper async handling
              { quantity: inventory.quantity - remainingQuantity },
              {
                where: { inventory_id: inventory.inventory_id },
              }
            );

            const getId = await IssuedApproveProduct.create({
              inventory_id: inventory.inventory_id,
              issuance_id: id,
              quantity: remainingQuantity,
            });
            remainingQuantity = 0;

            const ApprovedIssueProduct = getId.id;

            //for accountability
            const checkAccountability = await Issuance.findOne({
              where: {
                issuance_id: id,
                with_accountability: "true",
              },
            });

            if (checkAccountability) {
              await Accountability.create({
                issued_approve_prd_id: ApprovedIssueProduct,
              });
            }
            break; // Break the loop since remainingQuantity is now 0
          } else {
            console.log(
              `-----------------------------Not enough inventory in inventory ${inventory.inventory_id}. Deducting ${inventory.quantity}.`
            );
            remainingQuantity -= inventory.quantity;
            await Inventory.update(
              // Added await for proper async handling
              { quantity: 0 },
              {
                where: { inventory_id: inventory.inventory_id },
              }
            );

            const getId = await IssuedApproveProduct.create({
              inventory_id: inventory.inventory_id,
              issuance_id: id,
              quantity: inventory.quantity,
            });

            const ApprovedIssueProduct = getId.id;

            //for accountability
            const checkAccountability = await Issuance.findOne({
              where: {
                issuance_id: id,
                with_accountability: "true",
              },
            });

            if (checkAccountability) {
              await Accountability.create({
                issued_approve_prd_id: ApprovedIssueProduct,
              });
            }
          }
        }

        //for activity log
        const findIssuance = await Issuance.findOne({
          where: {
            issuance_id: id,
          },
          include: [
            {
              model: CostCenter,
              required: true,
            },
          ],
        });

        const nameCostcenter = findIssuance.cost_center.name;

        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Issuance: Approved the requested issued product ${productName} to ${nameCostcenter}`,
        });
      }
    }

    res.status(200).json();
  }
});

router.route("/reject").post(async (req, res) => {
  await Issuance.update(
    {
      status: "Rejected",
    },
    {
      where: {
        issuance_id: req.query.id,
      },
    }
  );

  const findIssuance = await Issuance.findOne({
    where: {
      issuance_id: req.query.id,
    },
    include: [
      {
        model: CostCenter,
        required: true,
      },
    ],
  });

  const nameCostcenter = findIssuance.cost_center.name;

  await Activity_Log.create({
    masterlist_id: req.query.userId,
    action_taken: `Issuance: Rejected the requested issued product to ${nameCostcenter}`,
  });

  res.status(200).json();
});

router.route("/approvalIssuance").get(async (req, res) => {
  try {
    const data = await Issuance.findAll({
      include: [
        {
          model: MasterList,
          as: "receiver",
          attributes: ["col_Fname", "col_id"],
          foreignKey: "received_by",
          required: true,
        },
        {
          model: MasterList,
          as: "sender",
          attributes: ["col_Fname", "col_id"],
          foreignKey: "transported_by",
          required: true,
        },
        {
          model: CostCenter,
          required: true,
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
      where: {
        issuance_id: req.query.id,
      },
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

router.route("/returnForm").get(async (req, res) => {
  try {
    const data = await Issuance.findAll({
      include: [
        // {
        //   model: MasterList,
        //   required: true,
        // },
        {
          model: CostCenter,
          required: true,
        },
        {
          model: Warehouses,
          required: true,
        },
      ],
      where: {
        issuance_id: req.query.id,
      },
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

//Create Issuance
router.route("/create").post(async (req, res) => {
  const { addProductbackend, userId } = req.body;

  try {
    const checkMRS = await Issuance.findOne({
      where: {
        mrs: req.body.mrs,
      },
    });

    if (checkMRS) {
      return res.status(201).json();
    }

    const Issue_newData = await Issuance.create({
      from_site: req.body.fromSite,
      issued_to: req.body.issuedTo,
      with_accountability: req.body.withAccountability,
      accountability_refcode:
        req.body.withAccountability === "true"
          ? req.body.accountabilityRefcode
          : null,
      serial_number: req.body.serialNumber,
      job_order_refcode: req.body.jobOrderRefcode,
      received_by: req.body.receivedBy,
      transported_by: req.body.transportedBy,
      mrs: req.body.mrs,
      remarks: req.body.remarks,
      status: "Pending",
      date_issued: req.body.date_issued,
      issued_by: req.body.userId,
    });

    const issuanceee_ID = Issue_newData.issuance_id;
    // console.log('issuance_ID' + addProductbackend)

    for (const product_issued of addProductbackend) {
      const product_id = product_issued.product_id;
      const quantityee = product_issued.quantity;
      const Name = product_issued.name;
      const Type = product_issued.type;
      // console.log('value' + inventory_id)
      // console.log('Name' + Name)
      // console.log('quantityee' + quantityee)

      if (Type === "Product") {
        IssuedProduct.create({
          issuance_id: issuanceee_ID,
          product_id: product_id,
          quantity: quantityee,
          status: "",
        });
      } else if (Type === "Assembly") {
        IssuedAssembly.create({
          issuance_id: issuanceee_ID,
          product_id: product_id,
          quantity: quantityee,
          status: "",
        });
      } else if (Type === "Spare") {
        IssuedSpare.create({
          issuance_id: issuanceee_ID,
          product_id: product_id,
          quantity: quantityee,
          status: "",
        });
      } else if (Type === "Subpart") {
        IssuedSubpart.create({
          issuance_id: issuanceee_ID,
          product_id: product_id,
          quantity: quantityee,
          status: "",
        });
      }

      const CostCentername = await CostCenter.findOne({
        where: {
          id: req.body.issuedTo,
        },
      });

      const nameCostcenter = CostCentername.name;

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Issuance: Issued a product ${Name} to ${nameCostcenter}`,
      });
    }

    res.status(200).json(Issue_newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/fetchPreview").get(async (req, res) => {
  try {
    const data = await IssuedApproveProduct.findAll({
      where: {
        quantity: {
          [Op.ne]: 0,
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
              include: [
                {
                  model: Product,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          model: Issuance,
          required: true,
          where: {
            issuance_id: req.query.issuance_id,
            status: "Approved",
          },
          include: [
            {
              model: MasterList,
              as: "receiver",
              attributes: ["col_Fname", "col_id"],
              foreignKey: "received_by",
              required: true,
            },
            {
              model: MasterList,
              as: "sender",
              attributes: ["col_Fname", "col_id"],
              foreignKey: "transported_by",
              required: true,
            },
            {
              model: MasterList,
              as: "issuer",
              attributes: ["col_Fname", "col_id"],
              foreignKey: "issued_by",
              required: true,
            },
            {
              model: MasterList,
              as: "approvers",
              attributes: ["col_Fname", "col_id"],
              foreignKey: "approved_by",
              required: true,
            },
            {
              model: CostCenter,
              required: true,
            },
            {
              model: Warehouses,
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

router.route("/updateDateIssued").post(async (req, res) => {
  const { id, date_issued_to_set } = req.query;
  await Issuance.update(
    { date_issued: date_issued_to_set },
    { where: { issuance_id: id } }
  );
  res.status(200).json();
});

router.route("/retrackIssuance").post(async (req, res) => {
  // dapat ma test if accurate ba ang mga nasa inventory na laman
  const fetchApprovedIssuance = await IssuedApproveProduct.findAll();
  const fetchIssuedProduct = await IssuedProduct.findAll({
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
  if (fetchApprovedIssuance) {
    const promises = fetchApprovedIssuance.map(async (product) => {
      // Decrement the quantity in IssuedApproveProduct first
      // await product.dedelecrement("quantity", {
      //   by: parseFloat(product.quantity),
      // });

      // Increment the quantity in Inventory
      await Inventory.increment("quantity", {
        by: parseFloat(product.quantity),
        where: { inventory_id: product.inventory_id },
      });

      // Delete the product from IssuedApproveProduct
      await IssuedApproveProduct.destroy({
        where: { id: product.id },
      });
    });

    const promises2 = fetchIssuedProduct.map(async (prod) => {
      let remainingQuantity = prod.quantity;
      const checkPrd = await Inventory.findAll({
        where: {
          warehouse_id: prod.issuance.from_site,
          quantity: {
            [Op.ne]: 0,
          },
        },
        include: [
          {
            model: ProductTAGSupplier,
            required: true,
            include: [
              {
                model: Product,
                required: true,
                where: {
                  product_id: prod.product_id,
                },
              },
            ],
          },
          {
            model: Warehouses,
            required: true,
          },
        ],
      });

      // Change from forEach to a for...of loop to handle async properly
      for (const inventory of checkPrd) {
        console.log(
          `Inventory ID: ${inventory.inventory_id}, Quantity: ${inventory.quantity}, Warehouse: ${inventory.warehouse.warehouse_name}`
        );
        if (remainingQuantity <= inventory.quantity) {
          console.log(
            `Enough inventory found in inventory ${inventory.inventory_id}. Deducting ${remainingQuantity}.`
          );
          await Inventory.update(
            // Added await for proper async handling
            { quantity: inventory.quantity - remainingQuantity },
            {
              where: { inventory_id: inventory.inventory_id },
            }
          );

          const getId = await IssuedApproveProduct.create({
            inventory_id: inventory.inventory_id,
            issuance_id: prod.issuance_id,
            quantity: remainingQuantity,
          });
          remainingQuantity = 0;

          const ApprovedIssueProduct = getId.id;

          //for accountability
          const checkAccountability = await Issuance.findOne({
            where: {
              issuance_id: prod.issuance_id,
              with_accountability: "true",
            },
          });

          if (checkAccountability) {
            await Accountability.create({
              issued_approve_prd_id: ApprovedIssueProduct,
            });
          }
          break; // Break the loop since remainingQuantity is now 0
        } else {
          console.log(
            `-----------------------------Not enough inventory in inventory ${inventory.inventory_id}. Deducting ${inventory.quantity}.`
          );
          remainingQuantity -= inventory.quantity;
          await Inventory.update(
            // Added await for proper async handling
            { quantity: 0 },
            {
              where: { inventory_id: inventory.inventory_id },
            }
          );

          const getId = await IssuedApproveProduct.create({
            inventory_id: inventory.inventory_id,
            issuance_id: prod.issuance_id,
            quantity: inventory.quantity,
          });

          const ApprovedIssueProduct = getId.id;

          //for accountability
          const checkAccountability = await Issuance.findOne({
            where: {
              issuance_id: prod.issuance_id,
              with_accountability: "true",
            },
          });

          if (checkAccountability) {
            await Accountability.create({
              issued_approve_prd_id: ApprovedIssueProduct,
            });
          }
        }
      }
    });

    await Promise.all(promises); // Wait for all promises to complete
    await Promise.all(promises2); // Wait for all promises to complete

    console.log("Issuance has been retracted");
    return res.status(200).json();
  }
});

module.exports = router;
