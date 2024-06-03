const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  StockTransfer,
  StockTransfer_prod,
  StockTransfer_spare,
  MasterList,
  StockTransfer_assembly,
  Product,
  Assembly,
  SparePart,
  SubPart,
  Assembly_Supplier,
  Supplier,
  Activity_Log,
  Warehouses,
  Inventory,
  Inventory_Assembly,
  Inventory_Spare,
  Inventory_Subpart,
  ProductTAGSupplier,
  SparePart_Supplier,
  Subpart_supplier,
  Stock_Rejustify,
  Stock_History,
  ST_REJECT
} = require("../db/models/associations");
const session = require("express-session");
const StockTransfer_subpart = require("../db/models/stockTransfer_subpart.model");
const multer = require('multer');
const moment = require('moment-timezone');
// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/generateRefCodess").get(async (req, res) => {
  try {
    const currentDate = moment().tz("Asia/Manila").toDate();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}`;

    // Fetch the latest ref_code
    const latestReceiving = await StockTransfer.findOne({
      where: {
        reference_code: {
          [Op.like]: `${currentMonth}%`
        }
      },
      order: [['createdAt', 'DESC']]
    });

    let newRefCode;
    if (latestReceiving && latestReceiving.reference_code) {
      const latestRefCode = latestReceiving.reference_code;
      const refCodeParts = latestRefCode.split('-');
      if (refCodeParts.length === 3 && !isNaN(refCodeParts[2])) {
        const latestSequence = parseInt(refCodeParts[2], 10);
        const newSequence = String(latestSequence + 1).padStart(5, '0');
        newRefCode = `${currentMonth}-${newSequence}`;
      } else {
        // If the refCode doesn't split correctly or sequence is not a number
        newRefCode = `${currentMonth}-00001`;
      }
    } else {
      newRefCode = `${currentMonth}-00001`;
    }


    console.log(newRefCode)
    res.json({ refCode: newRefCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.route("/fetchTable").get(async (req, res) => {
  try {
    const data = await StockTransfer.findAll({
      include: [
        {
          model: Warehouses,
          as: "SourceWarehouse", // alias for the source warehouse
          attributes: ["warehouse_name"],
          foreignKey: "source",
          required: true
        },
        {
          model: Warehouses,
          as: "DestinationWarehouse", // alias for the destination warehouse
          attributes: ["warehouse_name"],
          foreignKey: "destination",
          required: true
        },
        {
          model: MasterList,
          as: "requestor",
          attributes: ["col_Fname"],
          foreignKey: "col_id",
          required: true
        }
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

router.route("/fetchTableReceiving").get(async (req, res) => {
  try {
    const data = await StockTransfer.findAll({
      where: {
        status: "To-Receive",
      },
      include: [
        {
          model: Warehouses,
          as: "SourceWarehouse", // alias for the source warehouse
          attributes: ["warehouse_name"],
          foreignKey: "source",
          required: true
        },
        {
          model: Warehouses,
          as: "DestinationWarehouse", // alias for the destination warehouse
          attributes: ["warehouse_name"],
          foreignKey: "destination",
          required: true
        },
        {
          model: MasterList,
          as: "approver",
          attributes: ["col_Fname"],
          foreignKey: "masterlist_id",
          required: true
        }
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

router.route("/fetchdropdownData").get(async (req, res) => {
  try {
    const data = await Stock_History.findAll({
      include: [
        {
          model: StockTransfer,
          required: true,
        },
      ],
      where: { stockTransfer_id: req.query.stock_id },
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

//selected products to transfer fetching
router.route("/fetchProdutsPreview").get(async (req, res) => {
  try {
    const prd = await StockTransfer_prod.findAll({
      where: {
        stockTransfer_id: req.query.id,
      },
      include: [
        {
          model: Product,
          required: true,
        },
      ],
    });

    const asm = await StockTransfer_assembly.findAll({
      where: {
        stockTransfer_id: req.query.id,
      },
      include: [
        {
          model: Assembly,
          required: true,
        },
      ],
    });

    const spare = await StockTransfer_spare.findAll({
      where: {
        stockTransfer_id: req.query.id,
      },
      include: [
        {
          model: SparePart,
          required: true,
        },
      ],
    });

    const subpart = await StockTransfer_subpart.findAll({
      where: {
        stockTransfer_id: req.query.id,
      },
      include: [
        {
          model: SubPart,
          required: true,
        },
      ],
    });

    // console.log(prd);

    return res.json({
      product_db: prd,
      asm_db: asm,
      spare_db: spare,
      subpart_db: subpart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route('/fetchRejustifyRemarks').get(async (req, res) => {
  try {
    const { stock_id } = req.query;
    const data = await Stock_Rejustify.findOne({
      where: {
        stockTransfer_id: stock_id 
      },  
    });

   res.json(data)
  } catch (err) {
    console.error(err);
  }
});
// router.route('/latestRefcode').get(async (req, res) => {
//   try {
//     const latestPR = await StockTransfer.findOne({
//       attributes: [[sequelize.fn('max', sequelize.col('reference_code')), 'latestNumber']],
//     });
//     let latestNumber = latestPR.getDataValue('latestNumber');

//     console.log('Latest Number:', latestNumber);

//     // Increment the latestNumber by 1 for a new entry
//     latestNumber = latestNumber !== null ? (parseInt(latestNumber, 10) + 1).toString() : '1';

//     // Do not create a new entry, just return the incremented value
//     return res.json(latestNumber.padStart(3, '0'));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json("Error");
//   }
// });

// router.route('/lastPRNumber').get(async (req, res) => {
//   try {

//       const latestPR = await StockTransfer.findOne({
//           attributes: [[sequelize.fn('max', sequelize.col('reference_code')), 'latestPRNumber']],
//         });
//       const latestPRNumber = latestPR.getDataValue('latestPRNumber');

//       // console.log('Latest PR Number:', latestPRNumber);
//       return res.json(latestPRNumber);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json("Error");
//   }
// });
router.route("/fetchWarehouseData").get(async (req, res) => {
  try {
    const stockTransfers = await StockTransfer.findAll({
      where: {
        stock_id: req.query.id,
      },
      include: [
        {
          model: Warehouses,
          as: "SourceWarehouse", // alias for the source warehouse
          attributes: ["warehouse_name"],
          foreignKey: "source",
        },
        {
          model: Warehouses,
          as: "DestinationWarehouse", // alias for the destination warehouse
          attributes: ["warehouse_name"],
          foreignKey: "destination",
        },
      ],
    });

    // Extract the source and destination warehouse names
    const sourceWarehouses = stockTransfers.map(
      (transfer) => transfer.SourceWarehouse?.warehouse_name
    );
    const destinationWarehouses = stockTransfers.map(
      (transfer) => transfer.DestinationWarehouse?.warehouse_name
    );

    res.status(200).json({
      sourceWarehouses,
      destinationWarehouses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/create").post(async (req, res) => {
  try {
    const {
      selectedWarehouse,
      destination,
      referenceCode,
      col_id,
      remarks,
      addProductbackend,
      userId,
    } = req.body;

    const StockTransfer_newData = await StockTransfer.create({
      source: selectedWarehouse,
      destination: destination,
      reference_code: referenceCode,
      col_id: col_id,
      remarks: remarks,
      status: "Pending",
    });



    // console.log("Warehouse IDdsadsadasdsa" + destination);
    const createdID = StockTransfer_newData.stock_id;

    await Stock_History.create({
      stockTransfer_id: createdID,
      status: "Pending",
      remarks: remarks,
    })
    
      for (const prod of addProductbackend) {
        const prod_id = prod.product_id;
        const prod_quantity = prod.quantity;
        const prod_desc = prod.desc;
        const prod_type = prod.type;
  
        let productName;
  
        // console.log(`dddddksdkskd ${prod_id}`);
        if (prod_type === "Product") {
          await StockTransfer_prod.create({
            stockTransfer_id: createdID,
            product_id: prod_id,
            quantity: prod_quantity,
            description: prod_desc,
          });
  
          const getProdName = await StockTransfer_prod.findOne({
            where: {
              stockTransfer_id: createdID
            },
            include: [{
                  model: Product,
                  required: true
              }],
          });
  
          productName = getProdName.product.product_name;
  
          console.log("Product name" + productName);
  
        } else if (prod_type === "Assembly") {
          await StockTransfer_assembly.create({
            stockTransfer_id: createdID,
            product_id: prod_id,
            quantity: prod_quantity,
            description: prod_desc,
          });
  
          const getAssemblyName = await StockTransfer_assembly.findOne({
            where: {
              stockTransfer_id: createdID
            },
            include: [{
                model: Assembly,
                required: true
              }],
          });
  
          productName = getAssemblyName.assembly.assembly_name;
  
        } else if (prod_type === "Spare") {
          await StockTransfer_spare.create({
            stockTransfer_id: createdID,
            product_id: prod_id,
            quantity: prod_quantity,
            description: prod_desc,
          });
  
          const getSpareName = await StockTransfer_spare.findOne({
            where: {
              stockTransfer_id: createdID
            },
            include: [{
                model: SparePart
              }],
          });
  
          productName = getSpareName.sparePart.spareParts_name;
  
        } else if (prod_type === "SubPart") {
          await StockTransfer_subpart.create({
            stockTransfer_id: createdID,
            product_id: prod_id,
            quantity: prod_quantity,
            description: prod_desc,
          });
  
          const getSubName = await StockTransfer_subpart.findOne({
            where: {
              stockTransfer_id: createdID
            },
            include: [{
                model: SubPart,
                required: true
              }],
          });
  
          productName = getSubName.subPart.subPart_name;
        }
  
        const Warehousename = await Warehouses.findOne({
          where: {
            id: destination,
          },
        });
  
        const warename = Warehousename.warehouse_name;
  
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Stock Transfer: Product ${productName} with quantity ${prod_quantity} is being transfer on ${warename} with reference code ${referenceCode}`,
        });
      }
    

    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/fetchView").get(async (req, res) => {
  try {
    const data = await StockTransfer.findAll({
      where: {
        stock_id: req.query.id,
      },
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

//Delete
router.route("/delete/:param_id").delete(async (req, res) => {
  try {
    const id = req.params.param_id;
    const userId = req.query.userId;

    const stockData = await StockTransfer.findOne({
      where: {
        stock_id: id,
      },
    });

    const stockRefcode = stockData.reference_code;

    const del = await StockTransfer.destroy({
      where: {
        stock_id: id,
      },
    });

    if (del) {
      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `The stock transfer is being cancelled with the reference code of ${stockRefcode}`,
      });
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error("Error cancelling stock transfer:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.route("/viewToReceiveStockTransfer").get(async (req, res) => {
  try {
    const data = await StockTransfer.findAll({
      where: {
        stock_id: req.query.id,
      },
      include: [
        {
          model: MasterList,
          as: "approver", 
          attributes: ["col_Fname"],
          foreignKey: "masterlist_id",
          required: true,
        },
        {
          model: Warehouses,
          as: "SourceWarehouse", // alias for the source warehouse
          attributes: ["warehouse_name", "id"],
          foreignKey: "source",
          required: true,
        },
        {
          model: Warehouses,
          as: "DestinationWarehouse", // alias for the destination warehouse
          attributes: ["warehouse_name", "id"],
          foreignKey: "destination",
          required: true,
        },
      ],
    });

    if (!data) {
      // No record found
      return res.status(404).json({ message: "stock transfer not found" });
    }
    // console.log(data)
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.route("/fetchView_asmbly").get(async (req, res) => {
  try {
    const data = await StockTransfer_assembly.findAll({
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
      where: {
        pr_id: req.query.id,
      },
    });

    if (data) {
      return res.json(data);
    } else {
      res.status(400).json({ error: "Data not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/receivedAssembly").post(async (req, res) => {
  try {
    const { totalValue, id, qualityAssuranceASM } = req.body;

    const received_newData = await StockTransfer_assembly.update(
      {
        received: totalValue,
      },
      {
        where: { id: id },
      }
    );
    //    await Inventory_Assembly.update({
    //     quantity: totalValue,
    //     warehouse: destination,
    //  });

    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/approve").post(async (req, res) => {
  try {
    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);
  
  // Get the current datetime in Manila timezone
  const currentDateTimeInManila = moment();


    const approve = await StockTransfer.update(
      {
        status: "To-Receive",
        date_approved: currentDateTimeInManila
      },
      {
        where: { stock_id: req.query.id },
      }
    );

    await Stock_History.create({
      stockTransfer_id: req.query.id,
      status: "To-Receive",
      remarks: req.query.remarks
    })

    const findStock = await StockTransfer.findOne({
      where: {
        stock_id: req.query.id,
      },
    })

    const stockRefcode = findStock.reference_code;

  
    await Activity_Log.create({
      masterlist_id: req.query.userId,
      action_taken: `Stock transfer: Approved the stock transfer requested with the reference code of ${stockRefcode}`
    });


    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/reject").post(async (req, res) => {
  try {
    const reject = await StockTransfer.update(
      {
        status: "Rejected",
      },
      {
        where: { stock_id: req.query.id },
      }
    );

    if (reject){

      await ST_REJECT.create({
        stocktransfer_id: req.query.id,
        masterlist_id: req.query.userId,
        status: "Rejected",
        remarks: req.query.remarks
      })

      await Stock_History.create({
        stockTransfer_id: req.query.id,
        status: "Rejected",
        remarks: req.query.remarks
      })

      const findStock = await StockTransfer.findOne({
        where: {
          stock_id: req.query.id,
        },
      })
  
      const stockRefcode = findStock.reference_code;
  
    
      await Activity_Log.create({
        masterlist_id: req.query.userId,
        action_taken: `Stock transfer: Rejected the stock transfer requested with the reference code of ${stockRefcode}`
      });
      res.status(200).json();
    }

   

   
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});


router.route("/fetchRejectHistory").get(async (req, res) => {
  try {
    const { id } = req.query;
    // Fetch the data
    const RejectData = await ST_REJECT.findAll({
      where: { stocktransfer_id: id },
      include: [{ model: MasterList, required: true }],
    });


    const RejustifyData = await Stock_Rejustify.findAll({
      where: { stockTransfer_id: id },
      include: [{ model: MasterList, required: true }],
    });

    // Extract the dataValues from each result and add a source field
    const RejectValues = RejectData.map((item) => ({
      ...item.dataValues,
      source: "REJECTION",
    }));


    const RejustifyValues = RejustifyData.map((item) => ({
      ...item.dataValues,
      source: `REJUSTIFICATION`,
    }));

    // Combine the dataValues into one array
    const combinedData = [
      ...RejectValues,
      ...RejustifyValues,
    ];

    // Sort the combined data by createdAt column in ascending order
    combinedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Send the sorted data as a response
    res.json(combinedData);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.post('/rejustifystock', upload.single('file'), async (req, res) => {
  try {
    const { id, remarks, userId } = req.body;
    const file = req.file;

    const mimeType = file.mimetype;
    const fileExtension = file.originalname.split('.').pop();

    const result = await Stock_Rejustify.create({
      file: file.buffer,
      stockTransfer_id: id,  
      masterlist_id: userId,
      remarks: remarks, 
      mimeType: mimeType,
      fileExtension: fileExtension,
    });

    
    const stock_historical = await Stock_History.create({
      stockTransfer_id: id,
      status: 'Rejustified',
      remarks: remarks
    });


    const stock_newData = await StockTransfer.update({
      status: 'Rejustified'
    },
    {
      where: { 
        stock_id: id
       }
    }); 

    if(stock_newData){
      const forStock = await StockTransfer.findOne({
        where: {
          stock_id: id,
        }
      });

      const StockRef = forStock.reference_code;

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Stock transfer requested has been rejustified with reference code ${StockRef}`,
    });
  }

    console.log('File data and additional data inserted successfully');
    res.status(200).json();
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route("/receivingProducts").post(async (req, res) => {
  try {
    const {
      fromWarehouse_id,
      toWarehouse_id,
      id,
      addProductbackend,
      addAsmbackend,
      addSparebackend,
      addSubpartbackend,
      userId
    } = req.query;

    if (addProductbackend && addProductbackend.length > 0) {
      for (const prod of addProductbackend) {
        let remainingQuantity = prod.quantity;

        const checkPrd = await Inventory.findAll({
          where: {
            warehouse_id: fromWarehouse_id,
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



        for (const inventory of checkPrd) {
          // console.log(`Inventory ID: ${inventory.inventory_id}, Quantity: ${inventory.quantity}, Warehouse: ${inventory.warehouse.warehouse_name}`);
          if (remainingQuantity <= inventory.quantity) {
            // console.log(
            //   `Enough inventory found in inventory ${inventory.inventory_id}. Deducting ${remainingQuantity}.`
            // );

            const remaining = inventory.quantity - remainingQuantity; //output of the remaining

            const inserting = await Inventory.findAll({
              where: {
                warehouse_id: toWarehouse_id,
                price: inventory.price,
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

            const findWarehousefrom = await Warehouses.findOne({
              where: {
                id: fromWarehouse_id
              },
            });

            const fromWarehouseName = findWarehousefrom.warehouse_name;

            const findWarehouseto = await Warehouses.findOne({
              where: {
                id: toWarehouse_id
              },
            });

            const toWarehouseName = findWarehouseto.warehouse_name;

            const productName = inventory.product_tag_supplier.product.product_name;
            
            if (inserting && inserting > 0) {
              const inv_id = inserting.inventory_id;

              await Inventory.update(
                { quantity: remainingQuantity },
                {
                  where: { inventory_id: inv_id },
                }
              );
            } else {
              await Inventory.create({
                product_tag_supp_id: inventory.product_tag_supp_id,
                quantity: remainingQuantity,
                price: inventory.price,
                freight_cost: inventory.freight_cost,
                custom_cost: inventory.custom_cost,
                reference_number: inventory.reference_number,
                warehouse_id: toWarehouse_id,
              });
            }

            await Inventory.update(
              { quantity: remaining },
              {
                where: { inventory_id: inventory.inventory_id },
              }
            );
            remainingQuantity = 0;

            await Activity_Log.create({
              masterlist_id: userId,
              action_taken: `Stock transfer: Received the ${inventory.quantity} quantities of product ${productName} requested to transfer from ${fromWarehouseName} into ${toWarehouseName} `
            });
            break; // Break the loop since remainingQuantity is now 0


          } else {
            console.log(
              `Not enough inventory in inventory ${inventory.inventory_id}. Deducting ${inventory.quantity}.`
            );
            remainingQuantity -= inventory.quantity;

            const inserting = await Inventory.findAll({
              where: {
                warehouse_id: toWarehouse_id,
                price: inventory.price,
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

            const findWarehousefrom = await Warehouses.findOne({
              where: {
                id: fromWarehouse_id
              },
            });

            const fromWarehouseName = findWarehousefrom.warehouse_name;

            const findWarehouseto = await Warehouses.findOne({
              where: {
                id: toWarehouse_id
              },
            });

            const toWarehouseName = findWarehouseto.warehouse_name;

            const productName = inventory.product_tag_supplier.product.product_name;
            console.log("PRODUCT NAME checkPrd" + productName)

            if (inserting && inserting > 0) {
              const inv_id = inserting.inventory_id;

              await Inventory.update(
                { quantity: inventory.quantity },
                {
                  where: { inventory_id: inv_id },
                }
              );
            } else {
              await Inventory.create({
                product_tag_supp_id: inventory.product_tag_supp_id,
                quantity: inventory.quantity,
                price: inventory.price,
                freight_cost: inventory.freight_cost,
                custom_cost: inventory.custom_cost,
                reference_number: inventory.reference_number,
                warehouse_id: toWarehouse_id,
              });
            }

            await Inventory.update(
              { quantity: 0 },
              {
                where: { inventory_id: inventory.inventory_id },
              }
            );

            await Activity_Log.create({
              masterlist_id: userId,
              action_taken: `Stock transfer: Received the ${inventory.quantity} quantities of product ${productName} requested to transfer from ${fromWarehouseName} into ${toWarehouseName} `
            });
          }
        }

        if (remainingQuantity > 0) {
          console.log(
            `Insufficient inventory to fulfill the order. Remaining quantity: ${remainingQuantity}`
          );
          // Handle the case where there's not enough inventory to fulfill the order
        }
      }
    }

    if (addAsmbackend && addAsmbackend.length > 0) {
      for (const prod of addAsmbackend) {
        let remainingQuantity = prod.quantity;

        const checkPrd = await Inventory_Assembly.findAll({
          where: {
            warehouse_id: fromWarehouse_id,
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


        

        for (const inventory of checkPrd) {
          // console.log(`Inventory ID: ${inventory.inventory_id}, Quantity: ${inventory.quantity}, Warehouse: ${inventory.warehouse.warehouse_name}`);
          if (remainingQuantity <= inventory.quantity) {
            console.log(
              `Enough inventory found in inventory ${inventory.inventory_id}. Deducting ${remainingQuantity}.`
            );

            const remaining = inventory.quantity - remainingQuantity; //output of the remaining

            const inserting = await Inventory_Assembly.findAll({
              where: {
                warehouse_id: toWarehouse_id,
                price: inventory.price,
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

            const findWarehousefrom = await Warehouses.findOne({
              where: {
                id: fromWarehouse_id
              },
            });

            const fromWarehouseName = findWarehousefrom.warehouse_name;

            const findWarehouseto = await Warehouses.findOne({
              where: {
                id: toWarehouse_id
              },
            });

            const toWarehouseName = findWarehouseto.warehouse_name;


            const AssemblyName = inventory.assembly_supplier.assembly.assembly_name;

            if (inserting && inserting > 0) {
              const inv_id = inserting.inventory_id;

              await Inventory_Assembly.update(
                { quantity: remainingQuantity },
                {
                  where: { inventory_id: inv_id },
                }
              );
            } else {
              await Inventory_Assembly.create({
                assembly_tag_supp_id: inventory.assembly_tag_supp_id,
                quantity: remainingQuantity,
                price: inventory.price,
                freight_cost: inventory.freight_cost,
                custom_cost: inventory.custom_cost,
                reference_number: inventory.reference_number,
                warehouse_id: toWarehouse_id,
              });
            }

            await Inventory_Assembly.update(
              { quantity: remaining },
              {
                where: { inventory_id: inventory.inventory_id },
              }
            );

            remainingQuantity = 0;

            await Activity_Log.create({
              masterlist_id: userId,
              action_taken: `Stock transfer: Received the ${inventory.quantity} quantities of product ${AssemblyName} requested to transfer from ${fromWarehouseName} into ${toWarehouseName} `
            });
            break; // Break the loop since remainingQuantity is now 0
          } else {
            console.log(
              `Not enough inventory in inventory ${inventory.inventory_id}. Deducting ${inventory.quantity}.`
            );
            remainingQuantity -= inventory.quantity;

            const inserting = await Inventory_Assembly.findAll({
              where: {
                warehouse_id: toWarehouse_id,
                price: inventory.price,
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

            const findWarehousefrom = await Warehouses.findOne({
              where: {
                id: fromWarehouse_id
              },
            });

            const fromWarehouseName = findWarehousefrom.warehouse_name;

            const findWarehouseto = await Warehouses.findOne({
              where: {
                id: toWarehouse_id
              },
            });

            const toWarehouseName = findWarehouseto.warehouse_name;


            const AssemblyName = inventory.assembly_supplier.assembly.assembly_name;

            if (inserting && inserting > 0) {
              const inv_id = inserting.inventory_id;

              await Inventory_Assembly.update(
                { quantity: inventory.quantity },
                {
                  where: { inventory_id: inv_id },
                }
              );
            } else {
              await Inventory_Assembly.create({
                assembly_tag_supp_id: inventory.assembly_tag_supp_id,
                quantity: inventory.quantity,
                price: inventory.price,
                freight_cost: inventory.freight_cost,
                custom_cost: inventory.custom_cost,
                reference_number: inventory.reference_number,
                warehouse_id: toWarehouse_id,
              });
            }

            await Inventory_Assembly.update(
              { quantity: 0 },
              {
                where: { inventory_id: inventory.inventory_id },
              }
            );

            await Activity_Log.create({
              masterlist_id: userId,
              action_taken: `Stock transfer: Received the ${inventory.quantity} quantities of product ${AssemblyName} requested to transfer from ${fromWarehouseName} into ${toWarehouseName} `
            });
          }
        }

        if (remainingQuantity > 0) {
          console.log(
            `Insufficient inventory to fulfill the order. Remaining quantity: ${remainingQuantity}`
          );
          // Handle the case where there's not enough inventory to fulfill the order
        }
      }
    }

    if (addSparebackend && addSparebackend.length > 0) {
      for (const prod of addSparebackend) {
        let remainingQuantity = prod.quantity;

        const checkPrd = await Inventory_Spare.findAll({
          where: {
            warehouse_id: fromWarehouse_id,
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




        for (const inventory of checkPrd) {
          // console.log(`Inventory ID: ${inventory.inventory_id}, Quantity: ${inventory.quantity}, Warehouse: ${inventory.warehouse.warehouse_name}`);
          if (remainingQuantity <= inventory.quantity) {
            console.log(
              `Enough inventory found in inventory ${inventory.inventory_id}. Deducting ${remainingQuantity}.`
            );

            const remaining = inventory.quantity - remainingQuantity; //output of the remaining

            const inserting = await Inventory_Spare.findAll({
              where: {
                warehouse_id: toWarehouse_id,
                price: inventory.price,
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

            const findWarehousefrom = await Warehouses.findOne({
              where: {
                id: fromWarehouse_id
              },
            });

            const fromWarehouseName = findWarehousefrom.warehouse_name;

            const findWarehouseto = await Warehouses.findOne({
              where: {
                id: toWarehouse_id
              },
            });

            const toWarehouseName = findWarehouseto.warehouse_name;

            const Sparename = inventory.sparepart_supplier.sparePart.spareParts_name;

            if (inserting && inserting > 0) {
              const inv_id = inserting.inventory_id;

              await Inventory_Spare.update(
                { quantity: remainingQuantity },
                {
                  where: { inventory_id: inv_id },
                }
              );
            } else {
              await Inventory_Spare.create({
                spare_tag_supp_id: inventory.spare_tag_supp_id,
                quantity: remainingQuantity,
                price: inventory.price,
                freight_cost: inventory.freight_cost,
                custom_cost: inventory.custom_cost,
                reference_number: inventory.reference_number,
                warehouse_id: toWarehouse_id,
              });
            }

            await Inventory_Spare.update(
              { quantity: remaining },
              {
                where: { inventory_id: inventory.inventory_id },
              }
            );

            remainingQuantity = 0;
            await Activity_Log.create({
              masterlist_id: userId,
              action_taken: `Stock transfer: Received the ${inventory.quantity} quantities of product ${Sparename} requested to transfer from ${fromWarehouseName} into ${toWarehouseName} `
            });
            break; // Break the loop since remainingQuantity is now 0
          } else {
            console.log(
              `Not enough inventory in inventory ${inventory.inventory_id}. Deducting ${inventory.quantity}.`
            );
            remainingQuantity -= inventory.quantity;

            const inserting = await Inventory_Spare.findAll({
              where: {
                warehouse_id: toWarehouse_id,
                price: inventory.price,
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

            const findWarehousefrom = await Warehouses.findOne({
              where: {
                id: fromWarehouse_id
              },
            });

            const fromWarehouseName = findWarehousefrom.warehouse_name;

            const findWarehouseto = await Warehouses.findOne({
              where: {
                id: toWarehouse_id
              },
            });

            const toWarehouseName = findWarehouseto.warehouse_name;

            const Sparename = inventory.sparepart_supplier.sparePart.spareParts_name;

            if (inserting && inserting > 0) {
              const inv_id = inserting.inventory_id;

              await Inventory_Spare.update(
                { quantity: inventory.quantity },
                {
                  where: { inventory_id: inv_id },
                }
              );
            } else {
              await Inventory_Spare.create({
                spare_tag_supp_id: inventory.spare_tag_supp_id,
                quantity: inventory.quantity,
                price: inventory.price,
                freight_cost: inventory.freight_cost,
                custom_cost: inventory.custom_cost,
                reference_number: inventory.reference_number,
                warehouse_id: toWarehouse_id,
              });
            }

            await Inventory_Spare.update(
              { quantity: 0 },
              {
                where: { inventory_id: inventory.inventory_id },
              }
            );

            await Activity_Log.create({
              masterlist_id: userId,
              action_taken: `Stock transfer: Received the ${inventory.quantity} quantities of product ${Sparename} requested to transfer from ${fromWarehouseName} into ${toWarehouseName} `
            });
          }
        }

        if (remainingQuantity > 0) {
          console.log(
            `Insufficient inventory to fulfill the order. Remaining quantity: ${remainingQuantity}`
          );
          // Handle the case where there's not enough inventory to fulfill the order
        }
      }
    }

    if (addSubpartbackend && addSubpartbackend.length > 0) {
      for (const prod of addSubpartbackend) {
        let remainingQuantity = prod.quantity;

        const checkPrd = await Inventory_Subpart.findAll({
          where: {
            warehouse_id: fromWarehouse_id,
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




        for (const inventory of checkPrd) {
          // console.log(`Inventory ID: ${inventory.inventory_id}, Quantity: ${inventory.quantity}, Warehouse: ${inventory.warehouse.warehouse_name}`);
          if (remainingQuantity <= inventory.quantity) {
            console.log(
              `Enough inventory found in inventory ${inventory.inventory_id}. Deducting ${remainingQuantity}.`
            );

            const remaining = inventory.quantity - remainingQuantity; //output of the remaining

            const inserting = await Inventory_Subpart.findAll({
              where: {
                warehouse_id: toWarehouse_id,
                price: inventory.price,
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

            const findWarehousefrom = await Warehouses.findOne({
              where: {
                id: fromWarehouse_id
              },
            });

            const fromWarehouseName = findWarehousefrom.warehouse_name;

            const findWarehouseto = await Warehouses.findOne({
              where: {
                id: toWarehouse_id
              },
            });

            const toWarehouseName = findWarehouseto.warehouse_name;

            const subpartName = inventory.subpart_supplier.subPart.subPart_name;

            if (inserting && inserting > 0) {
              const inv_id = inserting.inventory_id;

              await Inventory_Subpart.update(
                { quantity: remainingQuantity },
                {
                  where: { inventory_id: inv_id },
                }
              );
            } else {
              await Inventory_Subpart.create({
                subpart_tag_supp_id: inventory.subpart_tag_supp_id,
                quantity: remainingQuantity,
                price: inventory.price,
                freight_cost: inventory.freight_cost,
                custom_cost: inventory.custom_cost,
                reference_number: inventory.reference_number,
                warehouse_id: toWarehouse_id,
              });
            }

            await Inventory_Subpart.update(
              { quantity: remaining },
              {
                where: { inventory_id: inventory.inventory_id },
              }
            );

            remainingQuantity = 0;
            await Activity_Log.create({
              masterlist_id: userId,
              action_taken: `Stock transfer: Received the ${inventory.quantity} quantities of product ${subpartName} requested to transfer from ${fromWarehouseName} into ${toWarehouseName} `
            });
            break; // Break the loop since remainingQuantity is now 0
          } else {
            console.log(
              `Not enough inventory in inventory ${inventory.inventory_id}. Deducting ${inventory.quantity}.`
            );
            remainingQuantity -= inventory.quantity;

            const inserting = await Inventory_Subpart.findAll({
              where: {
                warehouse_id: toWarehouse_id,
                price: inventory.price,
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


            const findWarehousefrom = await Warehouses.findOne({
              where: {
                id: fromWarehouse_id
              },
            });

            const fromWarehouseName = findWarehousefrom.warehouse_name;

            const findWarehouseto = await Warehouses.findOne({
              where: {
                id: toWarehouse_id
              },
            });

            const toWarehouseName = findWarehouseto.warehouse_name;

            const subpartName = inventory.subpart_supplier.subPart.subPart_name;

            if (inserting && inserting > 0) {
              const inv_id = inserting.inventory_id;

              await Inventory_Subpart.update(
                { quantity: inventory.quantity },
                {
                  where: { inventory_id: inv_id },
                }
              );
            } else {
              await Inventory_Subpart.create({
                subpart_tag_supp_id: inventory.subpart_tag_supp_id,
                quantity: inventory.quantity,
                price: inventory.price,
                freight_cost: inventory.freight_cost,
                custom_cost: inventory.custom_cost,
                reference_number: inventory.reference_number,
                warehouse_id: toWarehouse_id,
              });
            }

            await Inventory_Subpart.update(
              { quantity: 0 },
              {
                where: { inventory_id: inventory.inventory_id },
              }
            );

            await Activity_Log.create({
              masterlist_id: userId,
              action_taken: `Stock transfer: Received the ${inventory.quantity} quantities of product ${subpartName} requested to transfer from ${fromWarehouseName} into ${toWarehouseName} `
            });
          }
        }

        if (remainingQuantity > 0) {
          console.log(
            `Insufficient inventory to fulfill the order. Remaining quantity: ${remainingQuantity}`
          );
          // Handle the case where there's not enough inventory to fulfill the order
        }
      }
    }

    const update = await StockTransfer.update(
      {
        status: "Delivered",
      },
      {
        where: {
          stock_id: id,
        },
      }
    );


    if (update){
      res.status(200).json()
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

module.exports = router;
