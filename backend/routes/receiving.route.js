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
  const pr_id = req.body.id;
  const po_id = req.body.po_id;
  const userId = req.body.userId;
  const refCode = req.body.refCode;

  let status = "";
  let totalReceived = 0;
  let totalRemaining = 0;
  let freighCost;
  let initialReceiveStatus = "";
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
      totalReceived += parseInt(child.Received_quantity || 0);
      totalRemaining += parseInt(child.Remaining_quantity);
      // console.log(`child.Received_quantity ${child.Received_quantity}`)
    }
  }
  if (totalRemaining === 0) {
    initialReceiveStatus = "Complete";
  } else {
    initialReceiveStatus = "Incomplete";
  }

  freighCost = (shippingFee / totalReceived).toFixed(2);

  const received_PO = await Receiving_PO.create({
    pr_id: pr_id,
    po_id: po_id,
    freight_cost: freighCost === 0 ? null : freighCost,
    customFee: customFee,
    totalReceived: totalReceived,
    ref_code: refCode,
    status: status,
    initialReceive:
      receving_site === "Davao City" ? initialReceiveStatus : null,
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
                set_quantity: child.set_quantity || 0,
                // freight_cost: freighCost,
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
          } else if (child.type === "Product Assembly") {
            const update = PR_PO_asmbly.update(
              {
                quantity: child.ordered_quantity - child.Received_quantity,
              },
              {
                where: { id: child.canvassed_ID },
              }
            );

            if (update) {
              Receiving_Asm.create({
                receiving_po_id: received_PO.id,
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                // freight_cost: freighCost,
                received_quantity: child.Received_quantity,
                remaining_quantity: child.Remaining_quantity,
                // ref_code: `ASM-${formattedDate}`,
                // status: status,
              });

              const getAssemblyName = await PR_PO_asmbly.findOne({
                where: {
                  id: child.canvassed_ID
                },
                include: [{
                    model: Assembly_Supplier,
                    required: true,
                       include:[{
                          model: Assembly,
                          required: true
                       }]
                  }],
              });

              productName = getAssemblyName.assembly_supplier.assembly.assembly_name;
              // console.log("ASSEMBLY NAME AGUSAN" + productName)
            }
          } else if (child.type === "Product Part") {
            const update = PR_PO_spare.update(
              {
                quantity: child.ordered_quantity - child.Received_quantity,
              },
              {
                where: { id: child.canvassed_ID },
              }
            );

            if (update) {
              Receiving_Spare.create({
                receiving_po_id: received_PO.id,
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                // freight_cost: freighCost,
                received_quantity: child.Received_quantity,
                remaining_quantity: child.Remaining_quantity,
                // ref_code: `SPR-${formattedDate}`,
                // status: status,
              });

              const getSpareName = await PR_PO_spare.findOne({
                where: {
                  id: child.canvassed_ID
                },
                include: [{
                    model: SparePart_Supplier,
                    required: true,
                      include: [{
                        model: SparePart,
                        required: true
                      }]
                  }],
              });

              productName = getSpareName.sparepart_supplier.sparePart.spareParts_name;
              // console.log("SPARE NAME AGUSAN" + productName)
            }
          } else if (child.type === "Product Subpart") {
            // console.log(`Subpart ${freighCost}`)

            const update = PR_PO_subpart.update(
              {
                quantity: child.ordered_quantity - child.Received_quantity,
              },
              {
                where: { id: child.canvassed_ID },
              }
            );

            if (update) {
              Receiving_Subpart.create({
                receiving_po_id: received_PO.id,
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                // freight_cost: freighCost,
                received_quantity: child.Received_quantity,
                remaining_quantity: child.Remaining_quantity,
                // ref_code: `SBP-${formattedDate}`,
                // status: status,
              });

              const getSubName = await PR_PO_subpart.findOne({
                where: {
                  id: child.canvassed_ID
                },
                include: [{
                    model: Subpart_supplier,
                    required: true,
                      include: [{
                        model: SubPart,
                        required: true,
                      }]
                  }],
              });

              productName = getSubName.subpart_supplier.subPart.subPart_name;
              // console.log("SUBPART NAME AGUSAN" + productName)
            }
          } else {
            console.log(`Not a Product`);
          }

          await Activity_Log.create({
            masterlist_id: userId,
            action_taken: `Product ${productName} received in ${receving_site} with quantity ${child.Received_quantity} and remaining ${child.Remaining_quantity}`,
          });
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
              // console.log("PRODUCT NAME DAVAO" + productName)
            }
          } else if (child.type === "Product Assembly") {
            const update = PR_PO_asmbly.update(
              {
                quantity: child.ordered_quantity - child.Received_quantity,
              },
              {
                where: { id: child.canvassed_ID },
              }
            );

            if (update) {
              Receiving_initial_asm.create({
                receiving_po_id: received_PO.id,
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                received_quantity: child.Received_quantity,
                remaining_quantity: child.Remaining_quantity,
              });

              const getAssemblyName = await PR_PO_asmbly.findOne({
                where: {
                  id: child.canvassed_ID
                },
                include: [{
                    model: Assembly_Supplier,
                    required: true,
                       include:[{
                          model: Assembly,
                          required: true
                       }]
                  }],
              });

              productName = getAssemblyName.assembly_supplier.assembly.assembly_name;
              // console.log("ASSEMBLY NAME DAVAO" + productName)
            }
          } else if (child.type === "Product Part") {
            const update = PR_PO_spare.update(
              {
                quantity: child.ordered_quantity - child.Received_quantity,
              },
              {
                where: { id: child.canvassed_ID },
              }
            );

            if (update) {
              Receiving_initial_spare.create({
                receiving_po_id: received_PO.id,
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                received_quantity: child.Received_quantity,
                remaining_quantity: child.Remaining_quantity,
              });

              const getSpareName = await PR_PO_spare.findOne({
                where: {
                  id: child.canvassed_ID
                },
                include: [{
                    model: SparePart_Supplier,
                    required: true,
                      include: [{
                        model: SparePart,
                        required: true
                      }]
                  }],
              });

              productName = getSpareName.sparepart_supplier.sparePart.spareParts_name;
              // console.log("SPARE NAME DAVAO" + productName)
            }
          } else if (child.type === "Product Subpart") {
            // console.log(`Subpart ${freighCost}`)

            const update = PR_PO_subpart.update(
              {
                quantity: child.ordered_quantity - child.Received_quantity,
              },
              {
                where: { id: child.canvassed_ID },
              }
            );

            if (update) {
              Receiving_initial_subpart.create({
                receiving_po_id: received_PO.id,
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                received_quantity: child.Received_quantity,
                remaining_quantity: child.Remaining_quantity,
              });

              const getSubName = await PR_PO_subpart.findOne({
                where: {
                  id: child.canvassed_ID
                },
                include: [{
                    model: Subpart_supplier,
                    required: true,
                      include: [{
                        model: SubPart,
                        required: true,
                      }]
                  }],
              });

              productName = getSubName.subpart_supplier.subPart.subPart_name;
              // console.log("SUBPART NAME DAVAO" + productName)
            }
          } else {
            console.log(`Not a Product`);
          }

            await Activity_Log.create({
              masterlist_id: userId,
              action_taken: `Product ${productName} received in ${receving_site} with quantity ${child.Received_quantity} and remaining ${child.Remaining_quantity}`,
            });
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
  let totalRemaining = 0;
  let freighCost;
  let initialReceiveStatus = "";
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
      totalReceived += parseInt(child.Received_quantity || 0);
      totalRemaining += parseInt(child.Remaining_quantity);
      // console.log(`child.Received_quantity ${child.Received_quantity}`)
    }
  }
  if (totalRemaining === 0) {
    initialReceiveStatus = "Complete";
  } else {
    initialReceiveStatus = "Incomplete";
  }

  freighCost = (shippingFee / totalReceived).toFixed(2);

  const updateReceivingPOS = Receiving_PO.update(
    {
      status: "In-transit (Complete)",
    },
    {
      where: { id: receivingPOS_ID },
    }
  );

  if (updateReceivingPOS) {
    const received_PO = await Receiving_PO.create({
      pr_id: pr_id,
      po_id: po_id,
      freight_cost: freighCost === 0 ? null : freighCost,
      customFee: customFee,
      totalReceived: totalReceived,
      ref_code: refCodes,
      status: status,
      initialReceive:
        receving_site === "Davao City" ? initialReceiveStatus : null,
    });

    for (const parent of parentArray) {
      for (const child of parent.serializedArray) {
        const receivedQuantity = parseInt(child.Received_quantity);
        // console.log(child);
        if (!isNaN(receivedQuantity)) {
          let productName;

          if (child.type === "Product") {
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
          } else if (child.type === "Product Assembly") {
            const update = Receiving_initial_asm.update(
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
              Receiving_Asm.create({
                receiving_po_id: received_PO.id,
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                transfered_quantity: child.ordered_quantity,
                received_quantity: child.Received_quantity,
                remaining_quantity: child.Remaining_quantity,
                // ref_code: `ASM-${formattedDate}`,
                // status: status,
              });

              const getAssemblyName = await PR_PO_asmbly.findOne({
                where: {
                  id: child.canvassed_ID
                },
                include: [{
                    model: Assembly_Supplier,
                    required: true,
                       include:[{
                          model: Assembly,
                          required: true
                       }]
                  }],
              });

              productName = getAssemblyName.assembly_supplier.assembly.assembly_name;
              // console.log("ASSEMBLY NAME AGUSAN" + productName)
            }
          } else if (child.type === "Product Part") {
            const update = Receiving_initial_spare.update(
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
              Receiving_Spare.create({
                receiving_po_id: received_PO.id,
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                transfered_quantity: child.ordered_quantity,
                received_quantity: child.Received_quantity,
                remaining_quantity: child.Remaining_quantity,
                // ref_code: `SPR-${formattedDate}`,
                // status: status,
              });

              const getSpareName = await PR_PO_spare.findOne({
                where: {
                  id: child.canvassed_ID
                },
                include: [{
                    model: SparePart_Supplier,
                    required: true,
                      include: [{
                        model: SparePart,
                        required: true
                      }]
                  }],
              });

              productName = getSpareName.sparepart_supplier.sparePart.spareParts_name;
              // console.log("SPARE NAME AGUSAN" + productName)
            }
          } else if (child.type === "Product Subpart") {
            const update = Receiving_initial_subpart.update(
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
              Receiving_Subpart.create({
                receiving_po_id: received_PO.id,
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                transfered_quantity: child.ordered_quantity,
                received_quantity: child.Received_quantity,
                remaining_quantity: child.Remaining_quantity,
                // ref_code: `SBP-${formattedDate}`,
                // status: status,
              });

              const getSubName = await PR_PO_subpart.findOne({
                where: {
                  id: child.canvassed_ID
                },
                include: [{
                    model: Subpart_supplier,
                    required: true,
                      include: [{
                        model: SubPart,
                        required: true,
                      }]
                  }],
              });

              productName = getSubName.subpart_supplier.subPart.subPart_name;
              // console.log("SUBPART NAME AGUSAN" + productName)
            }
          } else {
            console.log(`Not a Product`);
          }

          await Activity_Log.create({
            masterlist_id: userId,
            action_taken: `Product ${productName} received in ${receving_site} with quantity ${child.Received_quantity} and remaining ${child.Remaining_quantity}`,
          });
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

    const assembly = await Receiving_Asm.findAll({
      where: {
        receiving_po_id: receivingParent_id,
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
    return res.status(500).json({ message: "An error occurred" });
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
    const receivingPO_id = req.query.id;

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

    const prPoAsmblyData = await Receiving_initial_asm.findAll({
      where: { receiving_po_id: receivingPO_id },
      include: [
        {
          model: PR_PO_asmbly,
          required: true,

          include: [
            {
              model: Assembly_Supplier,
              required: true,
              attributes: [
                ["id", "id"],
                ["assembly_id", "assembly_id"],
                ["supplier_code", "supplier_code"],
                ["supplier_price", "price"],
                ["createdAt", "createdAt"],
                ["updatedAt", "updatedAt"],
              ],
              include: [
                {
                  model: Assembly,
                  required: true,
                  attributes: [
                    ["assembly_code", "code"],
                    ["assembly_name", "name"],
                    ["assembly_unitMeasurement", "uom"],
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

    const prPoSpareData = await Receiving_initial_spare.findAll({
      where: { receiving_po_id: receivingPO_id },

      include: [
        {
          model: PR_PO_spare,
          required: true,
          include: [
            {
              model: SparePart_Supplier,
              required: true,

              attributes: [
                ["id", "id"],
                ["sparePart_id", "sparePart_id"],
                ["supplier_code", "supplier_code"],
                ["supplier_price", "price"],
                ["createdAt", "createdAt"],
                ["updatedAt", "updatedAt"],
              ],

              include: [
                {
                  model: SparePart,
                  required: true,
                  attributes: [
                    ["spareParts_code", "code"],
                    ["spareParts_name", "name"],
                    ["spareParts_unitMeasurement", "uom"],
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

    const prPoSubpartData = await Receiving_initial_subpart.findAll({
      where: { receiving_po_id: receivingPO_id },
      include: [
        {
          model: PR_PO_subpart,
          required: true,
          include: [
            {
              model: Subpart_supplier,
              required: true,
              attributes: [
                ["id", "id"],
                ["subpart_id", "subpart_id"],
                ["supplier_code", "supplier_code"],
                ["supplier_price", "price"],
                ["createdAt", "createdAt"],
                ["updatedAt", "updatedAt"],
              ],
              include: [
                {
                  model: SubPart,
                  required: true,
                  attributes: [
                    ["subPart_code", "code"],
                    ["subPart_name", "name"],
                    ["subPart_unitMeasurement", "uom"],
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

    prPoAsmblyData.forEach((item) => {
      const po_id = item.purchase_req_canvassed_asmbly.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.purchase_req_canvassed_asmbly.assembly_supplier.assembly,
        suppliers:
          item.purchase_req_canvassed_asmbly.assembly_supplier.supplier,
        suppPrice: item.purchase_req_canvassed_asmbly.assembly_supplier,
      });
    });

    prPoSpareData.forEach((item) => {
      const po_id = item.purchase_req_canvassed_spare.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag:
          item.purchase_req_canvassed_spare.sparepart_supplier.sparePart,
        suppliers:
          item.purchase_req_canvassed_spare.sparepart_supplier.supplier,
        suppPrice: item.purchase_req_canvassed_spare.sparepart_supplier,
      });
    });

    prPoSubpartData.forEach((item) => {
      const po_id = item.purchase_req_canvassed_subpart.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.purchase_req_canvassed_subpart.subpart_supplier.subPart,
        suppliers:
          item.purchase_req_canvassed_subpart.subpart_supplier.supplier,
        suppPrice: item.subpart_supplier,
      });
    });

    // Convert the object values back to an array
    const consolidatedArray = Object.values(consolidatedObject);

    // Sort the consolidated array by po_id
    // consolidatedArray.forEach(group => {
    //   group.items.sort((a, b) => a.po_id.localeCompare(b.po_id));
    // });

    // console.log(consolidatedArray);

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

    // const prPoData = await PR_PO.findAll({
    //   include: [{
    //     model: ProductTAGSupplier,
    //     required: true,

    //       include: [{
    //         model: Product,
    //         required: true,
    //         attributes: [
    //           ['product_code', 'code'],
    //           ['product_name', 'name'],
    //         ],
    //       },
    //       {
    //         model: Supplier,
    //         required: true
    //       }]
    //   }],
    //   where: {
    //     pr_id: pr_id,
    //     po_id: po_num
    //  },
    // });

    const prPoAsmblyData = await Receiving_initial_asm.findAll({
      where: {
        receiving_po_id: id,
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
                  attributes: [
                    ["assembly_code", "code"],
                    ["assembly_name", "name"],
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

    // const prPoAsmblyData = await PR_PO_asmbly.findAll({
    //   include: [{
    //     model: Assembly_Supplier,
    //     required: true,

    //       include: [{
    //         model: Assembly,
    //         required: true,
    //         attributes: [
    //           ['assembly_code', 'code'],
    //           ['assembly_name', 'name'],
    //         ],
    //       },
    //       {
    //         model: Supplier,
    //         required: true
    //       }
    //     ]
    //   }],
    //   where: {
    //     pr_id: pr_id,
    //     po_id: po_num
    //  },
    // });

    const prPoSpareData = await Receiving_initial_spare.findAll({
      where: {
        receiving_po_id: id,
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
                  attributes: [
                    ["spareParts_code", "code"],
                    ["spareParts_name", "name"],
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

    // const prPoSpareData = await PR_PO_spare.findAll({
    //   include: [{
    //     model: SparePart_Supplier,
    //     required: true,

    //       include: [{
    //         model: SparePart,
    //         required: true,
    //         attributes: [
    //           ['spareParts_code', 'code'],
    //           ['spareParts_name', 'name'],
    //         ],
    //       },
    //       {
    //         model: Supplier,
    //         required: true
    //       }]
    //   }],
    //   where: {
    //     pr_id: pr_id,
    //     po_id: po_num
    //  },
    // });

    const prPoSubpartData = await Receiving_initial_subpart.findAll({
      where: {
        receiving_po_id: id,
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
                  attributes: [
                    ["subPart_code", "code"],
                    ["subPart_name", "name"],
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

    // const prPoSubpartData = await PR_PO_subpart.findAll({
    //   include: [{
    //     model: Subpart_supplier,
    //     required: true,

    //       include: [{
    //         model: SubPart,
    //         required: true,
    //         attributes: [
    //           ['subPart_code', 'code'],
    //           ['subPart_name', 'name'],
    //         ],
    //       },
    //       {
    //         model: Supplier,
    //         required: true
    //       }]
    //   }],
    //   where: {
    //     pr_id: pr_id,
    //     po_id: po_num
    //  },
    // });

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

    prPoAsmblyData.forEach((item) => {
      const po_id = item.receiving_po.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.purchase_req_canvassed_asmbly.assembly_supplier.assembly,
        suppliers:
          item.purchase_req_canvassed_asmbly.assembly_supplier.supplier,
        type: "Product Assembly",
      });
    });

    prPoSpareData.forEach((item) => {
      const po_id = item.receiving_po.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag:
          item.purchase_req_canvassed_spare.sparepart_supplier.sparePart,
        suppliers:
          item.purchase_req_canvassed_spare.sparepart_supplier.supplier,
        type: "Product Part",
      });
    });

    prPoSubpartData.forEach((item) => {
      const po_id = item.receiving_po.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.purchase_req_canvassed_subpart.subpart_supplier.subPart,
        suppliers:
          item.purchase_req_canvassed_subpart.subpart_supplier.supplier,
        type: "Product Subpart",
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
  const assemblyArray = req.query.asm;
  const spareArray = req.query.spr;
  const subpartArray = req.query.sbp;


  const manilaTimezone = "Asia/Manila";
moment.tz.setDefault(manilaTimezone);

// Get the current datetime in Manila timezone
const currentDateTimeInManila = moment();

  // console.log(productsArray)
  let final_status


  if (productsArray && productsArray.length > 0) {
    for (const product of productsArray) {
      let set_quantity;
  
      if(product.freight_cost === '0' && product.customFee === '0'){
        final_status = 'Delivered (Lack of Cost)'
      }
      else if (product.freight_cost === '0' ){
        final_status = 'Delivered (Lack of FreightCost)'
      }
      else if (product.customFee === '0'){
        final_status = 'Delivered (Lack of CustomCost)'
      }
      else{
        final_status = 'Delivered'
      }
  
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
  if (assemblyArray && assemblyArray.length > 0) {
    for (const product of assemblyArray) {
      let set_quantity;
  
      if (product.set_quantity === "0") {
        set_quantity = 1;
      } else {
        set_quantity = product.set_quantity;
      }
  
      const finalQuantity = product.Base_quantity * set_quantity;
  
      // console.log(finalQuantity)
      await Inventory_Assembly.create({
        assembly_tag_supp_id: product.product_tag_id,
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

  if (spareArray && spareArray.length > 0) {
    for (const product of spareArray) {
      let set_quantity;
  
      if (product.set_quantity === "0") {
        set_quantity = 1;
      } else {
        set_quantity = product.set_quantity;
      }
  
      const finalQuantity = product.Base_quantity * set_quantity;
  
      // console.log(finalQuantity)
      await Inventory_Spare.create({
        spare_tag_supp_id: product.product_tag_id,
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



  if (subpartArray && subpartArray.length > 0) {
    for (const product of subpartArray) {
      let set_quantity;
  
      if (product.set_quantity === "0") {
        set_quantity = 1;
      } else {
        set_quantity = product.set_quantity;
      }
  
      const finalQuantity = product.Base_quantity * set_quantity;
  
      // console.log(finalQuantity)
      await Inventory_Subpart.create({
        subpart_tag_supp_id: product.product_tag_id,
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
