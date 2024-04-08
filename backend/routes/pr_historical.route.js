const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {PR, 
       PR_history,
       PR_Rejustify,
       Inventory,
       Inventory_Assembly,
       Inventory_Spare,
       Inventory_Subpart,
       ProductTAGSupplier,
       Assembly_Supplier,
       SparePart_Supplier,
       Subpart_supplier,
       Assembly,
       SparePart,
       SubPart,
       Product,
       MasterList,
      Department} = require('../db/models/associations')
const session = require('express-session');
const { route } = require('./masterlist.route');
const moment = require('moment');
const fs = require('fs');

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


// Update the fetchPRhistory endpoint to fetch only unread notifications
// router.route('/fetchPRhistory').get(async (req, res) => {
//   try {
//     const data = await PR_history.findAll({
//       where: {
//         isRead: false, // Fetch only unread notifications
//       },
//       attributes: ['pr_id', [sequelize.fn('max', sequelize.col('createdAt')), 'latestCreatedAt']],
//       group: ['pr_id'],
//       raw: true,
//     });

//     const prIds = data.map(entry => entry.pr_id);

//     const latestData = await PR_history.findAll({
//       where: {
//         pr_id: {
//           [Op.in]: prIds,
//         },
//         createdAt: {
//           [Op.in]: data.map(entry => entry.latestCreatedAt),
//         },
//       },
//     });

//     if (latestData) {
//       return res.json(latestData);
//     } else {
//       res.status(400);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json("Error");
//   }
// });
router.route('/fetchPRhistory').get(async (req, res) => {
  try {
    const data = await PR_history.findAll({
      attributes: ['pr_id', [sequelize.fn('max', sequelize.col('createdAt')), 'latestCreatedAt']],
      group: ['pr_id'],
      raw: true,
    });

    const prIds = data.map(entry => entry.pr_id);

    const latestData = await PR_history.findAll({
      where: {
        pr_id: {
          [Op.in]: prIds,
        },
        createdAt: {
          [Op.in]: data.map(entry => entry.latestCreatedAt),
        },
      },
    });

    if (latestData) {
      return res.json(latestData);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});




  router.route("/LowOnstockProduct").get(async (req, res) => {
    try {
      const lowStockItems = [];
      const productData = await Inventory.findAll({
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
  
      const groupedProductData = {};
      const encounteredProductNames = {}; // Modify to store both boolean value and productThreshold
      let invProductId;

      productData.forEach((item) => {
        const InventoryProductId = item.inventory_id;
        invProductId = item.product_tag_supplier?.product?.product_id;
        const productCode = item.product_tag_supplier?.product?.product_code;
        const productName = item.product_tag_supplier?.product?.product_name;
        const productThreshold = item.product_tag_supplier?.product?.product_threshold;
        const Price = item.price;
        const quantity = item.quantity;
  
        if (productCode && productName) {
          const key = `${productCode}_${productName}`;
  
          if (!groupedProductData[key]) {
            groupedProductData[key] = {
              // productID: productID,
              product_code: productCode,
              product_name: productName,
              productThreshold: productThreshold,
              totalQuantity: 0,
              price: Price,
              products: [],
            };


          }
  
          groupedProductData[key].totalQuantity += quantity;
          groupedProductData[key].products.push(item);
  
          // Check if the product name has been encountered
          if (!encounteredProductNames[productName]) {
            encounteredProductNames[productName] = {
              encountered: true,
              threshold: productThreshold,
            };
          }
        }
      });
  
      const finalResult_PRD = Object.values(groupedProductData);
      let sumQuantityProduct = {};
  
      finalResult_PRD.forEach((product) => {
        if (!sumQuantityProduct[product.product_name]) {
          sumQuantityProduct[product.product_name] = 0;
        }
        sumQuantityProduct[product.product_name] += product.totalQuantity;
      });
  
      Object.keys(encounteredProductNames).forEach((productName) => {
        const productThreshold = encounteredProductNames[productName].threshold;
        const currentQuantity = sumQuantityProduct[productName]; // Get the quantity for the current productName
        
        if (currentQuantity <= productThreshold) {
          lowStockItems.push({
            type: "product",
            name: productName,
            currentQuantity: currentQuantity,
            threshold: productThreshold,
            invId: invProductId,
          });
        }
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
              },
            ],
          },
        ],
      });
      
      const groupedAsmData = {};
      const encounteredAssemblyNames = {};
      let invAssemblyId;

      assemblyData.forEach((item) => {
        const inventoryAssemblyId = item.inventory_id;
        invAssemblyId = item.assembly_supplier?.assembly?.id;
        const productCode = item.assembly_supplier?.assembly?.assembly_code;
        const productName = item.assembly_supplier?.assembly?.assembly_name;
        const productThreshold = item.assembly_supplier?.assembly?.threshhold;
        const Price = item.price;
        const quantity = item.quantity;
      
        // Ensure that productCode and productName are truthy before using them
        if (productCode && productName) {
          const key = `${productCode}_${productName}_${Price}`;
      
          if (!groupedAsmData[key]) {
            groupedAsmData[key] = {
              // productID: productID,
              product_code: productCode,
              product_name: productName,
              productThreshold: productThreshold,
              totalQuantity: 0,
              price: Price,
              products: [],
            };
          }
      
          groupedAsmData[key].totalQuantity += quantity;
          groupedAsmData[key].products.push(item);
      
          // Check if the assembly name has been encountered
          if (!encounteredAssemblyNames[productName]) {
            encounteredAssemblyNames[productName] = {
              encountered: true,
              threshold: productThreshold,
            };
          }
        }
      });
      
      const finalResult_asm = Object.values(groupedAsmData);
      const sumQuantityAssembly = {}; // Initialize as an empty object

      finalResult_asm.forEach((assembly) => {
        const productName = assembly.product_name;
        if (!sumQuantityAssembly[productName]) {
          sumQuantityAssembly[productName] = 0;
        }
        sumQuantityAssembly[productName] += assembly.totalQuantity;
      });
      
      Object.keys(encounteredAssemblyNames).forEach((productName) => {
        const productThreshold = encounteredAssemblyNames[productName].threshhold;
        const currentQuantity = sumQuantityAssembly[productName]; // Get the quantity for the current assembly name

        if (currentQuantity <= productThreshold) {
          lowStockItems.push({
            type: "assembly",
            name: productName,
            currentQuantity: currentQuantity,
            threshold: productThreshold,
            invId: invAssemblyId
          });
        }
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
              },
            ],
          },
        ],
      });
      
      // Grouping the product data by warehouse_id
      const groupedSpareData = {};
      const encounteredSpareNames = {};
      let invSpareId;

      spareData.forEach((item) => {
         const inventorySpareId = item.inventory_id;
        invSpareId = item.sparepart_supplier?.sparePart?.id;
        const productCode = item.sparepart_supplier?.sparePart?.spareParts_code;
        const productName = item.sparepart_supplier?.sparePart?.spareParts_name;
        const productThreshold = item.sparepart_supplier?.sparePart?.threshhold;
        const quantity = item.quantity;
        const Price = item.price;
      
        // Ensure that productCode and productName are truthy before using them
        if (productCode && productName) {
          const key = `${productCode}_${productName}`;
      
          if (!groupedSpareData[key]) {
            groupedSpareData[key] = {
              // productID: productID,
              product_code: productCode,
              product_name: productName,
              productThreshold: productThreshold,
              totalQuantity: 0,
              price: Price,
              products: [],
            };
          }
      
          groupedSpareData[key].totalQuantity += quantity;
          groupedSpareData[key].products.push(item);
      
          // Check if the spare name has been encountered
          if (!encounteredSpareNames[productName]) {
            encounteredSpareNames[productName] = {
              encountered: true,
              threshold: productThreshold,
            };
          }
        }

      });
      
      const finalResult_spare = Object.values(groupedSpareData);
      const sumQuantitySpare = {}; // Initialize as an empty object
      
      finalResult_spare.forEach((spare) => {
        const productName = spare.product_name;
        if (!sumQuantitySpare[productName]) {
          sumQuantitySpare[productName] = 0;
        }
        sumQuantitySpare[productName] += spare.totalQuantity;
      });
      
      Object.keys(encounteredSpareNames).forEach((productName) => {
        const productThreshold = encounteredSpareNames[productName].threshold;
        const currentQuantity = sumQuantitySpare[productName]; // Get the quantity for the current spare part name

        if (currentQuantity <= productThreshold) {
          lowStockItems.push({
            type: "spare",
            name: productName,
            currentQuantity: currentQuantity,
            threshold: productThreshold,
            invId: invSpareId
          });
        }
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
              },
            ],
          },
        ],
      });
      
      const groupedSubpartData = {};
      const encounteredSubpartNames = {};
      let invSubpartId;

      subpartData.forEach((item) => {
        const inventorySubpartId = item.inventory_id;
        invSubpartId = item.subpart_supplier?.subPart?.id;
        const productCode = item.subpart_supplier?.subPart?.subPart_code;
        const productName = item.subpart_supplier?.subPart?.subPart_name;
        const productThreshold = item.subpart_supplier?.subPart?.threshhold;
        const quantity = item.quantity;
        const Price = item.price;
      
        // Ensure that productCode and productName are truthy before using them
        if (productCode && productName) {
          const key = `${productCode}_${productName}_${Price}`;
      
          if (!groupedSubpartData[key]) {
            groupedSubpartData[key] = {
              // productID: productID,
              product_code: productCode,
              product_name: productName,
              productThreshold: productThreshold,
              totalQuantity: 0,
              price: Price,
              products: [],
            };
          }
      
          groupedSubpartData[key].totalQuantity += quantity;
          groupedSubpartData[key].products.push(item);
      
          // Check if the subpart name has been encountered
          if (!encounteredSubpartNames[productName]) {
            encounteredSubpartNames[productName] = {
              encountered: true,
              threshold: productThreshold,
            }
          }
        }
      });
      
      const finalResult_subpart = Object.values(groupedSubpartData);
      const sumQuantitySub = {};
      
      finalResult_subpart.forEach((subpart) => {
        const productName = subpart.product_name;
        if (!sumQuantitySub[productName]) {
          sumQuantitySub[productName] = 0;
        }
        sumQuantitySub[productName] += subpart.totalQuantity;
      });
      
      Object.keys(encounteredSubpartNames).forEach((productName) => {
        const productThreshold = encounteredSubpartNames[productName].threshold;
        const currentQuantity = sumQuantitySub[productName];


        if (currentQuantity <= productThreshold) {
          lowStockItems.push({
            type: "subpart",
            name: productName,
            currentQuantity: currentQuantity,
            threshold: productThreshold,
            invId: invSubpartId
          });
        }
      });
      
      res.json(lowStockItems);
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });

  router.route('/NomovementNotification').get(async (req, res) => {
    try {
      const prRecords = await PR.findAll({
        where: {
          masterlist_id: {[Op.ne]: 1}
        }
      });
  
      const notifications = prRecords.filter(record => {
        const DateCreated = new Date(record.createdAt);
        const DateUpdated = new Date(record.updatedAt);
        const status = record.status;
  
        const DateCreatedPlus2Months = new Date(DateCreated);
        DateCreatedPlus2Months.setMonth(DateCreatedPlus2Months.getMonth() + 2);
        const DateUpdatedPlus2Months = new Date(DateUpdated);
        DateUpdatedPlus2Months.setMonth(DateUpdatedPlus2Months.getMonth() + 2);
  
        if (
          DateCreated.getTime() === DateUpdated.getTime() &&
          (status === 'For-Approval' ||
            status === 'For-Canvassing' ||
            status === 'On-Canvass' ||
            status === 'For-Approval (PO)' ||
            status === 'To-Receive' ||
            status === 'For-Rejustify' ||
            status === 'For-Rejustify (PO)') &&
          Date.now() >= DateCreatedPlus2Months.getTime()
        ) {
          return true;
        } else if (
          DateCreated.getTime() !== DateUpdated.getTime() &&
          (status === 'For-Approval' ||
            status === 'For-Canvassing' ||
            status === 'On-Canvass' ||
            status === 'For-Approval (PO)' ||
            status === 'To-Receive' ||
            status === 'For-Rejustify' ||
            status === 'For-Rejustify (PO)') &&
          Date.now() >= DateUpdatedPlus2Months.getTime()
        ) {
          return true;
        }
        return false;
      });
  
      res.status(200).json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // router.route('/NomovementNotification').get(async (req, res) => {
  //   try {
  //     const prRecords = await PR.findAll();

  //     const DateCreated = prRecords.map(record => record.createdAt);
  //     const DateUpdated = prRecords.map(record => record.updatedAt);
  //     const status = prRecords.map(record => record.status);
  
  //     const DateCreatedPlus2Months = DateCreated.map(date => {
  //       const newDate = new Date(date);
  //       newDate.setMonth(newDate.getMonth() + 2);
  //       return newDate;
  //     });
  
  //     const DateUpdatedPlus2Months = DateUpdated.map(date => {
  //       const newDate = new Date(date);
  //       newDate.setMonth(newDate.getMonth() + 2);
  //       return newDate;
  //     });
  
  //     // for (let i = 0; i < prRecords.length; i++) {
  //     //   const record = prRecords[i];
  //     //   const createdAt = new Date(record.createdAt);
  //     //   const updatedAt = new Date(record.updatedAt);
  //     //   const status = record.status;
  

  //       if (
  //         DateCreated === DateUpdated &&
  //         (status === 'For-Approval' ||
  //           status === 'For-Canvassing' ||
  //           status === 'On-Canvass' ||
  //           status === 'For-Approval (PO)' ||
  //           status === 'To-Receive' ||
  //           status === 'For-Rejustify' ||
  //           status === 'For-Rejustify (PO)') &&
  //           DateCreated >= DateCreatedPlus2Months
  //       ) {
  //         return res.status(200).json({ message: 'No movement in status for 2 months' });
  //       } else if (
  //         DateCreated !== DateUpdated &&
  //         (status === 'For-Approval' ||
  //           status === 'For-Canvassing' ||
  //           status === 'On-Canvass' ||
  //           status === 'For-Approval (PO)' ||
  //           status === 'To-Receive' ||
  //           status === 'For-Rejustify' ||
  //           status === 'For-Rejustify (PO)') &&
  //           DateUpdated >= DateUpdatedPlus2Months
  //       ) {
  //         return res.status(200).json({ message: 'No movement in status for 2 months' });
  //       }

  //     // }
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });

  router.route('/fetchSpecificPR').get(async (req, res) => {
    try {
      const data = await PR.findAll({
        include: [{
          model: MasterList,
          required: true,

            include: [{
              model: Department,
              required: true
            }]
        }],
          where: {
            id: req.query.id
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

  
  router.route('/markAsRead/:pr_id').put(async (req, res) => {
    try {
      const { pr_id } = req.params;
      
      // Update the isRead column for the specific pr_id
      await PR_history.update({ isRead: true }, { where: { pr_id } });
  
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });


  // router.route('/markLowStockAsRead/:invId').put(async (req, res) => {
  //   try {
  //     const { invId } = req.params; // Extract inventory ID from URL params
  //     const { typeofProduct } = req.body;
  //     if(typeofProduct === 'product'){
  //       await Inventory.update({ isRead: true }, { where: { inventory_id: invId} });
  //     } else if (typeofProduct === 'assembly'){
  //       await Inventory_Assembly.update({ isRead: true }, { where: { inventory_id: invId} });
  //     } else if (typeofProduct === 'spare'){
  //       await Inventory_Spare.update({ isRead: true }, { where: { inventory_id: invId} });
  //     } else if (typeofProduct === 'subpart'){
  //       await Inventory_Subpart.update({ isRead: true }, { where: { inventory_id: invId} });
  //     }
  
  //     res.status(200).json({ message: 'Low stock Notification marked as read' });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json("Error");
  //   }
  // });


  router.route("/fetchdropdownData").get(async (req, res) => {
    try {
      const data = await PR_history.findAll({
        include: [
          {
            model: PR,
            required: true,
          },
        ],
        where: { pr_id: req.query.id },
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

  router.route('/fetchRejustifyRemarks').get(async (req, res) => {
    try {
      const { pr_id } = req.query;
      const data = await PR_Rejustify.findOne({
        where: {
          pr_id: pr_id 
        },  
      });
  
     res.json(data)
    } catch (err) {
      console.error(err);
    }
  });

  

  
  // router.get('/fetchRejustifyFile/:pr_id', async (req, res) => {
  //   try {
  //     const { pr_id } = req.params;
  //     const data = await PR_Rejustify.findOne({
  //       where: { pr_id: pr_id }
  //     });
  
  //     if (!data) {
  //       return res.status(404).json({ message: 'File not found' });
  //     }
  
  //     // Determine content type based on file extension
  //     let contentType;
  //     if (data.fileType === 'pdf') {
  //       contentType = 'application/pdf';
  //     } else if (data.fileType === 'png') {
  //       contentType = 'image/png';
  //     } else if (data.fileType === 'jpg' || data.fileType === 'jpeg') {
  //       contentType = 'image/jpeg';
  //     } else {
  //       contentType = 'application/octet-stream'; // Default to binary data
  //     }
  
  //     const fileBuffer = data.file; 

  //     res.setHeader('Content-Disposition', 'attachment; filename="Rejustify-File-Attached"');
  //     res.setHeader('Content-Type', 'application/pdf'); 
      
  //     res.send(fileBuffer);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });



module.exports = router;