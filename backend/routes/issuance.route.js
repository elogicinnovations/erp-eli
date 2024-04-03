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
          required: true,
        },
        {
          model: CostCenter,
          required: true,
        },
      ],
      // where: {
      //     issuance_id: req.query.id
      // }
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

router.route("/fetchApprove").get(async (req, res) => {
  try {
    const productData = await IssuedProduct.findAll({
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

    const asmData = await IssuedAssembly.findAll({
      include: [
        {
          model: Assembly,
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

    const spareData = await IssuedSpare.findAll({
      include: [
        {
          model: SparePart,
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

    const subpartData = await IssuedSubpart.findAll({
      include: [
        {
          model: SubPart,
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

    return res.json({
      product: productData,
      assembly: asmData,
      spare: spareData,
      subpart: subpartData,
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
  const assembly = req.query.fetchAssembly;
  const spare = req.query.fetchSpare;
  const subpart = req.query.fetchSubpart;
  const userId = req.query.userId;


  const approve = await Issuance.update(
      {
          status: 'Approved'
      },
      {
          where:{
              issuance_id: req.query.id
          }
      }

  )
  if(approve){
    
  if (product && product.length > 0) {
    for (const prod of product) {
      let remainingQuantity = prod.quantity;
      const productName = prod.product.product_name;
      const checkPrd = await Inventory.findAll({
        where: {
          warehouse_id: warehouseId,
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

      checkPrd.forEach(inventory => {
        console.log(
          `Inventory ID: ${inventory.inventory_id}, Quantity: ${inventory.quantity}, Warehouse: ${inventory.warehouse.warehouse_name}`
        );
        if (remainingQuantity <= inventory.quantity) {
          console.log(
            `Enough inventory found in inventory ${inventory.inventory_id}. Deducting ${remainingQuantity}.`
          );
           Inventory.update({ quantity: inventory.quantity - remainingQuantity }, {
              where: { inventory_id: inventory.inventory_id }
          });

           IssuedApproveProduct.create({
            inventory_id: inventory.inventory_id,
            issuance_id: id,
            quantity: remainingQuantity
          })
          remainingQuantity = 0;
        //   ; // Break the loop since remainingQuantity is now 0
        } else {
          console.log(
            `Not enough inventory in inventory ${inventory.inventory_id}. Deducting ${inventory.quantity}.`
          );
          remainingQuantity -= inventory.quantity;
           Inventory.update({ quantity: 0 }, {
              where: { inventory_id: inventory.inventory_id }
          });

           IssuedApproveProduct.create({
            inventory_id: inventory.inventory_id,
            issuance_id: id,
            quantity: inventory.quantity 
          })
        }
      })

      const findIssuance = await Issuance.findOne({
        where: {
          issuance_id: id
        },
        include: [{
          model: CostCenter,
          required: true
        }]
      })
      
      const nameCostcenter = findIssuance.cost_center.name;
      
      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Issuance: Approved the requested issued product ${productName} to ${nameCostcenter}`,
      });
    }
  }

  if (assembly && assembly.length > 0) {
    for (const prod of assembly) {
      let remainingQuantity = prod.quantity;
      const AssemblyName = prod.assembly.assembly_name;
      // console.log(`Assembly ${prod.assembly.assembly_name}`);
      const checkPrd = await Inventory_Assembly.findAll({
        where: {
          warehouse_id: warehouseId,
        },
        include: [
          {
            model: Assembly_Supplier,
            required: true,

            include: [
              {
                model: Assembly,
                required: true,

                where: {
                  id: prod.product_id,
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

      checkPrd.forEach(inventory => {
        console.log(
          `Inventory ID: ${inventory.inventory_id}, Quantity: ${inventory.quantity}, Warehouse: ${inventory.warehouse.warehouse_name}`
        );
        if (remainingQuantity <= inventory.quantity) {
          console.log(
            `Enough inventory found in inventory ${inventory.inventory_id}. Deducting ${remainingQuantity}.`
          );
          Inventory_Assembly.update({ quantity: inventory.quantity - remainingQuantity }, {
              where: { inventory_id: inventory.inventory_id }
          });

           IssuedApproveAssembly.create({
            inventory_id: inventory.inventory_id,
            issuance_id: id,
            quantity: remainingQuantity
          })
          remainingQuantity = 0;
        //   ; // Break the loop since remainingQuantity is now 0
        } else {
          console.log(
            `Not enough inventory in inventory ${inventory.inventory_id}. Deducting ${inventory.quantity}.`
          );
          remainingQuantity -= inventory.quantity;
          Inventory_Assembly.update({ quantity: 0 }, {
              where: { inventory_id: inventory.inventory_id }
          });

          IssuedApproveAssembly.create({
            inventory_id: inventory.inventory_id,
            issuance_id: id,
            quantity: inventory.quantity 
          })
        }
      })
      const findIssuance = await Issuance.findOne({
        where: {
          issuance_id: id
        },
        include: [{
          model: CostCenter,
          required: true
        }]
      })
      
      const nameCostcenter = findIssuance.cost_center.name;
      
      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Issuance: Approved the request issued product ${AssemblyName} to ${nameCostcenter}`,
      });
    }
  }

  if (spare && spare.length > 0) {
    for (const prod of spare) {
      let remainingQuantity = prod.quantity;
      const spareName = prod.sparePart.spareParts_name
      // console.log(`Spare part ${prod.sparePart.spareParts_name}`);
      const checkPrd = await Inventory_Spare.findAll({
        where: {
          warehouse_id: warehouseId,
        },
        include: [
          {
            model: SparePart_Supplier,
            required: true,

            include: [
              {
                model: SparePart,
                required: true,

                where: {
                  id: prod.product_id,
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

      checkPrd.forEach(inventory => {
        console.log(
          `Inventory ID: ${inventory.inventory_id}, Quantity: ${inventory.quantity}, Warehouse: ${inventory.warehouse.warehouse_name}`
        );
        if (remainingQuantity <= inventory.quantity) {
          console.log(
            `Enough inventory found in inventory ${inventory.inventory_id}. Deducting ${remainingQuantity}.`
          );
          Inventory_Spare.update({ quantity: inventory.quantity - remainingQuantity }, {
              where: { inventory_id: inventory.inventory_id }
          });

           IssuedApproveSpare.create({
            inventory_id: inventory.inventory_id,
            issuance_id: id,
            quantity: remainingQuantity
          })
          remainingQuantity = 0;
        //   ; // Break the loop since remainingQuantity is now 0
        } else {
          console.log(
            `Not enough inventory in inventory ${inventory.inventory_id}. Deducting ${inventory.quantity}.`
          );
          remainingQuantity -= inventory.quantity;
          Inventory_Spare.update({ quantity: 0 }, {
              where: { inventory_id: inventory.inventory_id }
          });

          IssuedApproveSpare.create({
            inventory_id: inventory.inventory_id,
            issuance_id: id,
            quantity: inventory.quantity 
          })
        }
      })
      const findIssuance = await Issuance.findOne({
        where: {
          issuance_id: id
        },
        include: [{
          model: CostCenter,
          required: true
        }]
      })
      
      const nameCostcenter = findIssuance.cost_center.name;
      
      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Issuance: Approved the requested issued product ${spareName} to ${nameCostcenter}`,
      });
    }
  }

  if (subpart && subpart.length > 0) {
    for (const prod of subpart) {
      let remainingQuantity = prod.quantity;
      const subpartName = prod.subPart.subPart_name;
      // console.log(`Subpart ${prod.subPart.subPart_name}`);
      const checkPrd = await Inventory_Subpart.findAll({
        where: {
          warehouse_id: warehouseId,
        },
        include: [
          {
            model: Subpart_supplier,
            required: true,

            include: [
              {
                model: SubPart,
                required: true,

                where: {
                  id: prod.product_id,
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

      checkPrd.forEach(inventory => {
        console.log(
          `Inventory ID: ${inventory.inventory_id}, Quantity: ${inventory.quantity}, Warehouse: ${inventory.warehouse.warehouse_name}`
        );
        if (remainingQuantity <= inventory.quantity) {
          console.log(
            `Enough inventory found in inventory ${inventory.inventory_id}. Deducting ${remainingQuantity}.`
          );
          Inventory_Subpart.update({ quantity: inventory.quantity - remainingQuantity }, {
              where: { inventory_id: inventory.inventory_id }
          });

           IssuedApproveSubpart.create({
            inventory_id: inventory.inventory_id,
            issuance_id: id,
            quantity: remainingQuantity
          })
          remainingQuantity = 0;
        //   ; // Break the loop since remainingQuantity is now 0
        } else {
          console.log(
            `Not enough inventory in inventory ${inventory.inventory_id}. Deducting ${inventory.quantity}.`
          );
          remainingQuantity -= inventory.quantity;
          Inventory_Subpart.update({ quantity: 0 }, {
              where: { inventory_id: inventory.inventory_id }
          });

          IssuedApproveSubpart.create({
            inventory_id: inventory.inventory_id,
            issuance_id: id,
            quantity: inventory.quantity 
          })
        }
      })

      const findIssuance = await Issuance.findOne({
        where: {
          issuance_id: id
        },
        include: [{
          model: CostCenter,
          required: true
        }]
      })
      
      const nameCostcenter = findIssuance.cost_center.name;
      
      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Issuance: Approved the requested issued product ${subpartName} to ${nameCostcenter}`,
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
      issuance_id: req.query.id
    },
    include: [{
      model: CostCenter,
      required: true
    }]
  })
  
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
          required: true,
        },
        {
          model: CostCenter,
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
        {
          model: MasterList,
          required: true,
        },
        {
          model: CostCenter,
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
    const Issue_newData = await Issuance.create({
      from_site: req.body.fromSite,
      issued_to: req.body.issuedTo,
      with_accountability: req.body.withAccountability,
      accountability_refcode: req.body.accountabilityRefcode,
      serial_number: req.body.serialNumber,
      job_order_refcode: req.body.jobOrderRefcode,
      received_by: req.body.receivedBy,
      transported_by: req.body.transportedBy,
      mrs: req.body.mrs,
      remarks: req.body.remarks,
      status: "Pending",
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
          id: req.body.issuedTo
        }
      })

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

module.exports = router;
