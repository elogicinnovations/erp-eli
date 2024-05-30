const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  Receiving_PO,
  Receiving_Prd,
  Receiving_Asm,
  Receiving_Spare,
  Receiving_Subpart,
  Receiving_initial_prd,
  Receiving_initial_asm,
  Receiving_initial_spare,
  Receiving_initial_subpart,
  PR_PO,
  PR_PO_asmbly,
  PR_PO_spare,
  PR_PO_subpart,
  Receiving_Image,
  Activity_Log,
  ProductTAGSupplier,
  Product,
  Assembly_Supplier,
  Assembly,
  SparePart_Supplier,
  SparePart,
  Subpart_supplier,
  SubPart,
  PR,
  MasterList,
  Department,
  Supplier,
  Inventory,
  Inventory_Assembly,
  Inventory_Spare,
  Inventory_Subpart,
} = require("../db/models/associations");
const session = require("express-session");
const moment = require('moment-timezone');



router.route("/generateRefCodess").get(async (req, res) => {
  try {
    const currentDate = moment().tz("Asia/Manila").toDate();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}`;

    // Fetch the latest ref_code
    const latestReceiving = await Receiving_PO.findOne({
      where: {
        ref_code: {
          [Op.like]: `${currentMonth}%`
        }
      },
      order: [['createdAt', 'DESC']]
    });

    let newRefCode;
    if (latestReceiving && latestReceiving.ref_code) {
      const latestRefCode = latestReceiving.ref_code;
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

    res.json({ refCode: newRefCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//View Receiving
router.route("/viewToReceive").get(async (req, res) => {
  try {
    const data = await PR_PO.findAll({
      include: [{
        model: PR,
        required: true,
          include: [
          {
            model: MasterList,
            required: true,
            include: [
              {
                model: Department,
                required: true,
              },
            ],
          },
        ],
      }],
      where: {
        po_id: req.query.po_id,
      },
    });

    if (!data) {
      // No record found
      return res.status(404).json({ message: "PR not found" });
    }
    // console.log(data)
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.route("/viewToReceiveIntransit").get(async (req, res) => {
  try {
    const data = await Receiving_PO.findAll({
      include: [{
        model: PR,
        required: true,
          include: [
          {
            model: MasterList,
            required: true,
            include: [
              {
                model: Department,
                required: true,
              },
            ],
          },
        ],
      }],
      where: {
        id: req.query.id,
      },
    });

    if (!data) {
      // No record found
      return res.status(404).json({ message: "PR not found" });
    }
    // console.log(data)
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.route("/fetchTableToReceive").get(async (req, res) => {
  try {
    const pr_data = await PR_PO.findAll({
      include: [
        {
         model: PR,
         required: true,

          include: [{
            model: MasterList,
            required: true,
            include: [
              {
                model: Department,
                required: true,
              },
            ],
          }]
        },
      ],
      where: {
        // status: {
        //   [Op.or]: ["To-Receive", "Delivered", "To-Receive (Partial)"],
        // },
        status: "To-Receive"
      },
    }); 

    // Create a map to keep track of unique po_ids
    const uniquePoMap = new Map();

    // Filter data to ensure only unique po_ids
    const uniqueDataPR = pr_data.filter((item) => {
      if (!uniquePoMap.has(item.po_id)) {
        uniquePoMap.set(item.po_id, true);
        return true;
      }
      return false;
    });

    const ReceivingPO = await Receiving_PO.findAll({
      include: [
        {
          model: PR,
          required: true,
          include: [
            {
              model: MasterList,
              required: true,
              include: [
                {
                  model: Department,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
      where: {
        status: {
          [Op.or]: ["For Approval", "In-transit"],
        },
      },
    });

    const po = uniqueDataPR.map(item => ({
      ...item.dataValues,
      source: 'PO'
    }));
    const po_receive = ReceivingPO.map(item => ({
      ...item.dataValues,
      source: 'ReceivingPO'
    }));
  // Combine the dataValues into one array
  const combinedData = [...po, ...po_receive];
  
  // Sort the combined data by createdAt column in descending order
  combinedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      prData: combinedData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});


router.route("/PO_products_primary").get(async (req, res) => { // pinakaunang na received selection if from davao or main agad
  try {
      const po_id = req.query.po_id;
      // Fetch data from all four tables with the specified pr_id
      const prPoData = await PR_PO.findAll({
        include: [{
          model: ProductTAGSupplier,
          required: true,

            include: [{
              model: Product,
              required: true,
              attributes: [
                ['product_code', 'code'],
                ['product_name', 'name'],
                ['UOM_set', 'isSubUnit'],
                ['product_unitMeasurement', 'UOM']
              ],
            
            },
            {
              model: Supplier,
              required: true
            }] 
        }],
        where: { 
          po_id: po_id
       },
      });
  
     
      // Consolidate data into an object with po_id as keys
      const consolidatedObject = {};
  
      prPoData.forEach(item => {
        const po_id = item.po_id;
        consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
        consolidatedObject[po_id].items.push({item, supp_tag: item.product_tag_supplier.product, suppliers: item.product_tag_supplier.supplier, type: 'Product'});
      });
  
      // Convert the object values back to an array
      const consolidatedArray = Object.values(consolidatedObject);
  

      const Image = await Receiving_Image.findAll({
        where: {
            // pr_id: pr_id,
            po_num: po_id
        },
      });

      // console.log(Image)
  
      res.status(200).json({
        consolidatedArray: consolidatedArray,
        image_receiving: Image
      });
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
});

router.route("/insertReceived").post(async (req, res) => {
  const currentDate = new Date();
  const options = {
    timeZone: "Asia/Manila",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDateTime = currentDate.toLocaleString("en-PH", options);
  const formattedDate = formattedDateTime
    .replace(/[/:,]/g, "")
    .replace(/\s/g, "");

  const parentArray = req.body.addReceivebackend;
  const shippingFee = req.body.shippingFee === "" ? null : req.body.shippingFee;
  const customFee = req.body.customFee === "" ? null : req.body.customFee;
  const receving_site = req.body.suppReceving;
  const productImages = req.body.productImages;
  const pr_id = req.body.pr_id;
  const po_id = req.body.po_id;
  const userId = req.body.userId;
  const refCode = req.body.refCode;

  let status = "";
  let totalReceived = 0;
  let totalReceived_toCompute = 0;
  let totalRemaining = 0;
  let freighCost;
  let initialReceiveStatus = "";
  let isComplete = false
  
  // let finalSF;

  // if (shippingFee === "") {
  //   finalSF = null;
  // } else {
  //   finalSF = shippingFee;
  // }

  if (receving_site === "Davao City") {
    status = "In-transit";
    isComplete
  } else if (receving_site === "Agusan Del Sur") {
    status = "For Approval";
  }

  // Output the formatted current date and time in Manila time zone
  // console.log(formattedDate);

  for (const parent of parentArray) {
    for (const child of parent.serializedArray) {
      totalReceived += parseInt(child.Received_quantity || 0);
      totalReceived_toCompute += parseInt((child.Received_quantity * child.set_quantity) || 0);
      totalRemaining += parseInt(child.Remaining_quantity);
      // console.log(`child.Received_quantity ${child.Received_quantity}`)
    }
  }
  if (totalRemaining === 0) {
    initialReceiveStatus = "Complete";
    isComplete = true
  } else {
    initialReceiveStatus = "Incomplete";
    isComplete = false
  }



  freighCost = (shippingFee / totalReceived_toCompute).toFixed(2);


  const updateReceivingPOS = await PR_PO.update(
    {
      status: isComplete === true ? 'Received' : 'To-Receive',
    },
    {
      where: { po_id: po_id },
    }
  );

  if(updateReceivingPOS){
    const received_PO = await Receiving_PO.create({
      pr_id: pr_id,
      po_id: po_id,
      freight_cost: freighCost === '0.00' ? null : freighCost,
      customFee: customFee,
      totalReceived: totalReceived,
      ref_code: refCode,
      status: status,
      receivedSite: receving_site,
      initialReceive: initialReceiveStatus,
    });
  
    // console.log('dwadwa' + received_PO.id)
  
    if (receving_site === "Agusan Del Sur") {
      for (const parent of parentArray) {
        for (const child of parent.serializedArray) {
          const receivedQuantity = parseInt(child.Received_quantity);
          // console.log(child);
          if (!isNaN(receivedQuantity)) {
            let productName;
  
            if (child.type === "Product") {
  
              if(child.Received_quantity !== '0'){
  
                const update = PR_PO.update(
                  {
                    quantity: child.ordered_quantity - child.Received_quantity,
                  },
                  {
                    where: { id: child.canvassed_ID },
                  }
                );
    
                if (update) {
                  
                    Receiving_Prd.create({
                      receiving_po_id: received_PO.id,
                      canvassed_id: child.canvassed_ID,
                      set_quantity: child.set_quantity,
                      received_quantity: child.Received_quantity,
                      remaining_quantity: child.Remaining_quantity,
                    });
      
                    const getProdName = await PR_PO.findOne({
                      where: {
                        id: child.canvassed_ID
                      },
                      include: [{
                          model: ProductTAGSupplier,
                          required: true,
      
                            include: [{
                              model: Product,
                              required: true
                            }]
                        }],
                    });
      
                    productName = getProdName.product_tag_supplier.product.product_name;
                  
                }
              }
    
              await Activity_Log.create({
                masterlist_id: userId,
                action_taken: `Product ${productName} received in ${receving_site} with quantity ${child.Received_quantity} and remaining ${child.Remaining_quantity}`,
              });
              }
              
          }
        }
      }
    } else {
      for (const parent of parentArray) {
        for (const child of parent.serializedArray) {
          const receivedQuantity = parseInt(child.Received_quantity);
          // console.log(child);
          if (!isNaN(receivedQuantity)) {
            let productName;
  
            if (child.type === "Product") {
              if(child.Received_quantity !== '0'){
                const update = PR_PO.update(
                  {
                    quantity: child.ordered_quantity - child.Received_quantity,
                  },
                  {
                    where: { id: child.canvassed_ID },
                  }
                );
    
                if (update) {
    
                  
                    Receiving_initial_prd.create({
                      receiving_po_id: received_PO.id,
                      canvassed_id: child.canvassed_ID,
                      set_quantity: child.set_quantity || 0,
                      received_quantity: child.Received_quantity,
                      remaining_quantity: child.Remaining_quantity,
                    });
      
                    const getProdName = await PR_PO.findOne({
                      where: {
                        id: child.canvassed_ID
                      },
                      include: [{
                          model: ProductTAGSupplier,
                          required: true,
      
                            include: [{
                              model: Product,
                              required: true
                            }]
                        }],
                    });
      
                    productName = getProdName.product_tag_supplier.product.product_name;  
                  
                }
              } 
    
                await Activity_Log.create({
                  masterlist_id: userId,
                  action_taken: `Product ${productName} received in ${receving_site} with quantity ${child.Received_quantity} and remaining ${child.Remaining_quantity}`,
                });
              }
              
          }
        }
      }
    }
  
    const deleteproductImage = Receiving_Image.destroy({
      where: {
        pr_id: pr_id,
        po_num: po_id,
      },
    });
  
    if (deleteproductImage) {
      if (productImages && productImages.length > 0) {
        productImages.forEach(async (i) => {
          await Receiving_Image.create({
            pr_id: pr_id,
            po_num: po_id,
            image: i.image,
          });
        });
      }
    } else {
      console.log("adwjkd");
    }
  
    // console.log(`Total Received: ${totalReceived}`);
    // console.log(`Fr ${freighCost}`);
  
    return res.status(200).json();
  }
  
});

router.route("/insertReceived_Intransit").post(async (req, res) => {
  const currentDate = new Date();
  const options = {
    timeZone: "Asia/Manila",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDateTime = currentDate.toLocaleString("en-PH", options);
  const formattedDate = formattedDateTime
    .replace(/[/:,]/g, "")
    .replace(/\s/g, "");

  const parentArray = req.body.addReceivebackend;
  const shippingFee = req.body.shippingFee === "" ? null : req.body.shippingFee;
  const customFee = req.body.customFee === "" ? null : req.body.customFee;
  const receving_site = req.body.suppReceving;
  const productImages = req.body.productImages;
  const pr_id = req.body.prID;
  const po_id = req.body.poID;
  const userId = req.body.userId;

  const refCodes = req.body.refCodes

  const receivingPOS_ID = req.body.id;

  let status = "";
  let totalReceived = 0;
  let totalReceived_toCompute = 0;
  let totalRemaining = 0;
  let freighCost;
  let initialReceiveStatus = "";
  let isComplete = false;
  // let finalSF;

  // if (shippingFee === "") {
  //   finalSF = null;
  // } else {
  //   finalSF = shippingFee;
  // }

  if (receving_site === "Davao City") {
    status = "In-transit";
  } else if (receving_site === "Agusan Del Sur") {
    status = "For Approval";
  }

  // Output the formatted current date and time in Manila time zone
  // console.log(formattedDate);

  for (const parent of parentArray) {
    for (const child of parent.serializedArray) {
      totalReceived += parseInt(child.Received_quantity  || 0);
      totalReceived_toCompute += parseInt((child.Received_quantity * child.set_quantity) || 0);
      totalRemaining += parseInt(child.Remaining_quantity);
      // console.log(`child.Received_quantity ${child.Received_quantity}`)
    }
  }
  if (totalRemaining === 0) {
    initialReceiveStatus = "Complete";
    status = "In-transit (Complete)";
    isComplete = true
  } else {
    initialReceiveStatus = "Incomplete";
    status = "In-transit";
    isComplete = false
  }

  freighCost = (shippingFee / totalReceived_toCompute).toFixed(2);

  const updateReceivingPOS = Receiving_PO.update(
    {
      status: status,
      isComplete: isComplete,
    },
    {
      where: { id: receivingPOS_ID },
    }
  );

  if (updateReceivingPOS) {
    const received_PO = await Receiving_PO.create({
      pr_id: pr_id,
      po_id: po_id,
      freight_cost: freighCost === '0.00' ? null : freighCost,
      customFee: customFee,
      totalReceived: totalReceived,
      ref_code: refCodes,
      status: 'For Approval',
      initialReceive: initialReceiveStatus,
      receivedSite: receving_site
    });

    for (const parent of parentArray) {
      for (const child of parent.serializedArray) {
        const receivedQuantity = parseInt(child.Received_quantity);
        // console.log(child);
        if (!isNaN(receivedQuantity)) {
          let productName;

          if (child.type === "Product") {
            if(child.Received_quantity !== '0'){
              const update = Receiving_initial_prd.update(
                {
                  received_quantity:
                    child.ordered_quantity - child.Received_quantity,
                  remaining_quantity: child.Remaining_quantity,
                },
                {
                  where: { id: child.initialTB_id },
                }
              );
  
              if (update) {
                Receiving_Prd.create({
                  receiving_po_id: received_PO.id,
                  canvassed_id: child.canvassed_ID,
                  set_quantity: child.set_quantity || 0,
                  transfered_quantity: child.ordered_quantity,
                  received_quantity: child.Received_quantity,
                  remaining_quantity: child.Remaining_quantity,
                  // ref_code: `PRD-${formattedDate}`,
                  // status: status,
                });
  
                const getProdName = await PR_PO.findOne({
                  where: {
                    id: child.canvassed_ID
                  },
                  include: [{
                      model: ProductTAGSupplier,
                      required: true,
  
                        include: [{
                          model: Product,
                          required: true
                        }]
                    }],
                });
  
                productName = getProdName.product_tag_supplier.product.product_name;
                // console.log("PRODUCT NAME AGUSAN" + productName)
              }
  
              await Activity_Log.create({
                masterlist_id: userId,
                action_taken: `Product ${productName} received in ${receving_site} with quantity ${child.Received_quantity} and remaining ${child.Remaining_quantity}`,
              });
            }
            
          } 

          
        }
      }
    }
  }

  const deleteproductImage = Receiving_Image.destroy({
    where: {
      pr_id: pr_id,
      po_num: po_id,
    },
  });

  if (deleteproductImage) {
    if (productImages && productImages.length > 0) {
      productImages.forEach(async (i) => {
        await Receiving_Image.create({
          pr_id: pr_id,
          po_num: po_id,
          image: i.image,
        });
      });
    }
  } else {
    console.log("adwjkd");
  }

  // console.log(`Total Received: ${totalReceived}`);
  // console.log(`Fr ${freighCost}`);

  return res.status(200).json();
});

router.route("/fetchTransaction").get(async (req, res) => {
  try {

    
    const PRD = await Receiving_Prd.findAll({
      include: [
        {
          model: PR_PO,
          required: true,

          include: [
            {
              model: ProductTAGSupplier,
              required: true,
              include: [
                {
                  model: Product,
                  required: true,
                  attributes: [
                    ["product_code", "product_code"],
                    ["product_name", "product_name"],
                  ],
                },
              ],
            },
          ],

         
        },{
          model: Receiving_PO,
          required: true,
          where: {
            pr_id: req.query.pr_id,
            po_id: req.query.po_num,
          },
        }
      ],
    });


    const PRD_dv = await Receiving_initial_prd.findAll({
      include: [
        {
          model: PR_PO,
          required: true,

          include: [
            {
              model: ProductTAGSupplier,
              required: true,
              include: [
                {
                  model: Product,
                  required: true,
                  attributes: [
                    ["product_code", "product_code"],
                    ["product_name", "product_name"],
                  ],
                },
              ],
            },
          ],

         
        },{
          model: Receiving_PO,
          required: true,
          where: {
            pr_id: req.query.pr_id,
            po_id: req.query.po_num,
          },
        }
      ],
    });

    const ASM = await Receiving_Asm.findAll({
      include: [
        {
          model: PR_PO_asmbly,
          required: true,

          include: [
            {
              model: Assembly_Supplier,
              required: true,
              include: [
                {
                  model: Assembly,
                  required: true,
                  attributes: [
                    ["assembly_code", "product_code"],
                    ["assembly_name", "product_name"],
                  ],
                },
              ],
            },
          ],

         
        },
        {
          model: Receiving_PO,
          required: true,
          where: {
            pr_id: req.query.pr_id,
            po_id: req.query.po_num,
          },
        }
      ],
    });


    const ASM_dv = await Receiving_initial_asm.findAll({
      include: [
        {
          model: PR_PO_asmbly,
          required: true,

          include: [
            {
              model: Assembly_Supplier,
              required: true,
              include: [
                {
                  model: Assembly,
                  required: true,
                  attributes: [
                    ["assembly_code", "product_code"],
                    ["assembly_name", "product_name"],
                  ],
                },
              ],
            },
          ],

         
        },
        {
          model: Receiving_PO,
          required: true,
          where: {
            pr_id: req.query.pr_id,
            po_id: req.query.po_num,
          },
        }
      ],
    });

    const SPR = await Receiving_Spare.findAll({
      include: [
        {
          model: PR_PO_spare,
          required: true,

          include: [
            {
              model: SparePart_Supplier,
              required: true,
              include: [
                {
                  model: SparePart,
                  required: true,
                  attributes: [
                    ["spareParts_code", "product_code"],
                    ["spareParts_name", "product_name"],
                  ],
                },
              ],
            },
          ],

        
        },
        {
          model: Receiving_PO,
          required: true,
          where: {
            pr_id: req.query.pr_id,
            po_id: req.query.po_num,
          },
        }
      ],
    });

    const SPR_dv = await Receiving_initial_spare.findAll({
      include: [
        {
          model: PR_PO_spare,
          required: true,

          include: [
            {
              model: SparePart_Supplier,
              required: true,
              include: [
                {
                  model: SparePart,
                  required: true,
                  attributes: [
                    ["spareParts_code", "product_code"],
                    ["spareParts_name", "product_name"],
                  ],
                },
              ],
            },
          ],

        
        },
        {
          model: Receiving_PO,
          required: true,
          where: {
            pr_id: req.query.pr_id,
            po_id: req.query.po_num,
          },
        }
      ],
    });

    const SBP = await Receiving_Subpart.findAll({
      include: [
        {
          model: PR_PO_subpart,
          required: true,

          include: [
            {
              model: Subpart_supplier,
              required: true,
              include: [
                {
                  model: SubPart,
                  required: true,
                  attributes: [
                    ["subPart_code", "product_code"],
                    ["subPart_name", "product_name"],
                  ],
                },
              ],
            },
          ],

        
        },
        {
          model: Receiving_PO,
          required: true,
          where: {
            pr_id: req.query.pr_id,
            po_id: req.query.po_num,
          },
        }
      ],
    });

    const SBP_dv = await Receiving_initial_subpart.findAll({
      include: [
        {
          model: PR_PO_subpart,
          required: true,

          include: [
            {
              model: Subpart_supplier,
              required: true,
              include: [
                {
                  model: SubPart,
                  required: true,
                  attributes: [
                    ["subPart_code", "product_code"],
                    ["subPart_name", "product_name"],
                  ],
                },
              ],
            },
          ],

        
        },
        {
          model: Receiving_PO,
          required: true,
          where: {
            pr_id: req.query.pr_id,
            po_id: req.query.po_num,
          },
        }
      ],
    });

    return res.json({
      prd: PRD,
      asm: ASM,
      spr: SPR,
      sbp: SBP,
      prd_dv: PRD_dv,
      asm_dv: ASM_dv,
      spr_dv: SPR_dv,
      sbp_dv: SBP_dv,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});
router.route("/primaryData").get(async (req, res) => {
  try {
    const primaryData = await Receiving_PO.findOne({
      where: {
        id: req.query.id,
      },
      include: [
        {
          model: PR,
          required: true,
          include: [
            {
              model: MasterList,
              required: true,
              include: [
                {
                  model: Department,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });

    const receivingParent_id = primaryData.id;

    // const products = await Receiving_Prd.findAll({
    //   where: {
    //     receiving_po_id: receivingParent_id,
    //   },
    //   include: [
    //     {
    //       model: PR_PO,
    //       required: true,
    //       include: [
    //         {
    //           model: ProductTAGSupplier,
    //           required: true,
    //           include: [
    //             {
    //               model: Product,
    //               required: true,
    //             },
    //             {
    //               model: Supplier,
    //               required: true,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       model: Receiving_PO,
    //       required: true,
    //     },
    //   ],
    // });

    // const assembly = await Receiving_Asm.findAll({
    //   where: {
    //     receiving_po_id: receivingParent_id,
    //   },
    //   include: [
    //     {
    //       model: PR_PO_asmbly,
    //       required: true,
    //       include: [
    //         {
    //           model: Assembly_Supplier,
    //           required: true,
    //           include: [
    //             {
    //               model: Assembly,
    //               required: true,
    //             },

    //             {
    //               model: Supplier,
    //               required: true,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       model: Receiving_PO,
    //       required: true,
    //     },
    //   ],
    // });

    // const spare = await Receiving_Spare.findAll({
    //   where: {
    //     receiving_po_id: receivingParent_id,
    //   },
    //   include: [
    //     {
    //       model: PR_PO_spare,
    //       required: true,
    //       include: [
    //         {
    //           model: SparePart_Supplier,
    //           required: true,
    //           include: [
    //             {
    //               model: SparePart,
    //               required: true,
    //             },
    //             {
    //               model: Supplier,
    //               required: true,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       model: Receiving_PO,
    //       required: true,
    //     },
    //   ],
    // });

    // const subpart = await Receiving_Subpart.findAll({
    //   where: {
    //     receiving_po_id: receivingParent_id,
    //   },
    //   include: [
    //     {
    //       model: PR_PO_subpart,
    //       required: true,
    //       include: [
    //         {
    //           model: Subpart_supplier,
    //           required: true,
    //           include: [
    //             {
    //               model: SubPart,
    //               required: true,
    //             },

    //             {
    //               model: Supplier,
    //               required: true,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       model: Receiving_PO,
    //       required: true,
    //     },
    //   ],
    // });

    return res.json({
      primary: primaryData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


router.route("/secondaryData").get(async (req, res) => {
  try {

   
    const products = await Receiving_Prd.findAll({
      where: {
        receiving_po_id: req.query.receivingParent_id,
      },
      include: [
        {
          model: PR_PO,
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
                {
                  model: Supplier,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          model: Receiving_PO,
          required: true,
        },
      ],
    });

    const assembly = await Receiving_Asm.findAll({
      where: {
        receiving_po_id: req.query.receivingParent_id,
      },
      include: [
        {
          model: PR_PO_asmbly,
          required: true,
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
        },
        {
          model: Receiving_PO,
          required: true,
        },
      ],
    });

    const spare = await Receiving_Spare.findAll({
      where: {
        receiving_po_id: req.query.receivingParent_id,
      },
      include: [
        {
          model: PR_PO_spare,
          required: true,
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
        },
        {
          model: Receiving_PO,
          required: true,
        },
      ],
    });

    const subpart = await Receiving_Subpart.findAll({
      where: {
        receiving_po_id: req.query.receivingParent_id,
      },
      include: [
        {
          model: PR_PO_subpart,
          required: true,
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
        },
        {
          model: Receiving_PO,
          required: true,
        },
      ],
    });

    return res.json({
      product: products,
      assembly: assembly,
      spare: spare,
      subpart: subpart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
});

//viewing primary data for "In-transit"
router.route("/viewToReceive").get(async (req, res) => {
  try {
    const primaryData = await Receiving_PO.findOne({
      include: [
        {
          model: PR,
          required: true,
          include: [
            {
              model: MasterList,
              required: true,

              include: [
                {
                  model: Department,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
      where: {
        id: req.query.id,
      },
    });

    return res.json({
      primary: primaryData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});
router.route("/fetchPOarray").post(async (req, res) => {
  try {
    const receivingPO_id = req.query.po_id;

    // Fetch data from all four tables with the specified pr_id
    const prPoData = await Receiving_initial_prd.findAll({
      where: { receiving_po_id: receivingPO_id },
      include: [
        {
          model: PR_PO,
          required: true,

          include: [
            {
              model: ProductTAGSupplier,
              required: true,

              attributes: [
                ["id", "id"],
                ["product_id", "product_id"],
                ["supplier_code", "supplier_code"],
                ["product_price", "price"],
                ["createdAt", "createdAt"],
                ["updatedAt", "updatedAt"],
              ],

              include: [
                {
                  model: Product,
                  required: true,
                  attributes: [
                    ["product_code", "code"],
                    ["product_name", "name"],
                    ["product_unitMeasurement", "uom"],
                    ["part_number", "part_number"],
                  ],
                },
                {
                  model: Supplier,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });


    // Consolidate data into an object with po_id as keys
    const consolidatedObject = {};

    prPoData.forEach((item) => {
      const po_id = item.purchase_req_canvassed_prd.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.purchase_req_canvassed_prd.product_tag_supplier.product,
        suppliers:
          item.purchase_req_canvassed_prd.product_tag_supplier.supplier,
        suppPrice: item.purchase_req_canvassed_prd.product_tag_supplier,
      });
    });



    // Convert the object values back to an array
    const consolidatedArray = Object.values(consolidatedObject);

    res.status(200).json(consolidatedArray);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/PO_products").get(async (req, res) => {
  try {
    const pr_id = req.query.pr_id;
    const po_num = req.query.po_number;
    const id = req.query.id;
    // Fetch data from all four tables with the specified pr_id

    const prPoData = await Receiving_initial_prd.findAll({
      where: {
        receiving_po_id: id,
      },
      include: [
        {
          model: PR_PO,
          required: true,

          include: [
            {
              model: ProductTAGSupplier,
              required: true,
              include: [
                {
                  model: Product,
                  required: true,
                  attributes: [
                    ["product_code", "code"],
                    ["product_name", "name"],
                    ['UOM_set', 'isSubUnit'],
                    ['product_unitMeasurement', 'UOM']
                  ],
                },
                {
                  model: Supplier,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          model: Receiving_PO,
          required: true,
        },
      ],
    });

  
    // Consolidate data into an object with po_id as keys
    const consolidatedObject = {};

    prPoData.forEach((item) => {
      const po_id = item.receiving_po.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.purchase_req_canvassed_prd.product_tag_supplier.product,
        suppliers:
          item.purchase_req_canvassed_prd.product_tag_supplier.supplier,
        type: "Product",
      });
    });



    // Convert the object values back to an array
    const consolidatedArray = Object.values(consolidatedObject);

    // Sort the consolidated array by po_id
    // consolidatedArray.forEach(group => {
    //   group.items.sort((a, b) => a.po_id.localeCompare(b.po_id));
    // });

    // console.log(consolidatedArray);

    const Image = await Receiving_Image.findAll({
      where: {
        pr_id: pr_id,
        po_num: po_num,
      },
    });

    // console.log(Image)

    res.status(200).json({
      consolidatedArray: consolidatedArray,
      image_receiving: Image,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/approval").post(async (req, res) => {
  const receiving_po_id = req.query.id;
  const productsArray = req.query.prod;


  const manilaTimezone = "Asia/Manila";
moment.tz.setDefault(manilaTimezone);

// Get the current datetime in Manila timezone
const currentDateTimeInManila = moment();

  // console.log(productsArray)
  let final_status

  if (productsArray && productsArray.length > 0) {
    for (const product of productsArray) {
      if(product.freight_cost === '' && product.customFee === ''){
        final_status = 'Delivered (Lack of Cost)'
      }
      else if (product.freight_cost === '' ){
        final_status = 'Delivered (Lack of FreightCost)'
      }
      else if (product.customFee === ''){
        final_status = 'Delivered (Lack of CustomCost)'
      }
      else{
        final_status = 'Delivered'
      }
    }
  }



  if (productsArray && productsArray.length > 0) {
    for (const product of productsArray) {
      let set_quantity;
  
      if (product.set_quantity === "0") {
        set_quantity = 1;
      } else {
        set_quantity = product.set_quantity;
      }
  
      const finalQuantity = product.Base_quantity * set_quantity;
  
      // console.log(finalQuantity)
      await Inventory.create({
        product_tag_supp_id: product.product_tag_id,
        reference_number: product.ref_code,
        static_quantity: finalQuantity,
        quantity: finalQuantity,
        price: product.price,
        warehouse_id: 1,
        freight_cost: product.freight_cost,
        custom_cost: product.customFee,
      });
    }
  }

  const update = Receiving_PO.update(
    {
      status: final_status,
      date_approved: currentDateTimeInManila.format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      where: { id: receiving_po_id },
    }
  );

  if(update){
    res.status(200).json()
  }

 
});

module.exports = router;
