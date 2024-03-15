const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {PR, 
       PR_history,
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
       Product,} = require('../db/models/associations')
const session = require('express-session');
const { route } = require('./masterlist.route');

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
        invProductId = item.inventory_id;
        const productID = item.product_tag_supplier?.product?.product_id;
        const productCode = item.product_tag_supplier?.product?.product_code;
        const productName = item.product_tag_supplier?.product?.product_name;
        const productThreshold = item.product_tag_supplier?.product?.threshhold;
        const Price = item.price;
        const quantity = item.quantity;
  
        if (productCode && productName) {
          const key = `${productCode}_${productName}`;
  
          if (!groupedProductData[key]) {
            groupedProductData[key] = {
              productID: productID,
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
        invAssemblyId = item.inventory_id;
        const productID = item.assembly_supplier?.assembly?.id;
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
              productID: productID,
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
        invSpareId = item.inventory_id;
        const productID = item.sparepart_supplier?.sparePart?.id;
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
              productID: productID,
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
        invSubpartId = item.inventory_id;
        const productID = item.subpart_supplier?.subPart?.id;
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
              productID: productID,
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
  

  router.route('/fetchSpecificPR').get(async (req, res) => {
    try {
      const data = await PR.findAll({
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


  router.route('/markLowStockAsRead/:inv_id').put(async (req, res) => {
    try {
      const { inventoryID, typeofProduct } = req.body;
      
      if(typeofProduct === 'product'){
        await Inventory.update({ isRead: true }, { where: { inventoryID } });
      } else if (typeofProduct === 'assembly'){
        await Inventory_Assembly.update({ isRead: true }, { where: { inventoryID } });
      } else if (typeofProduct === 'spare'){
        await Inventory_Spare.update({ isRead: true }, { where: { inventoryID } });
      } else if (typeofProduct === 'subpart'){
        await Inventory_Subpart.update({ isRead: true }, { where: { inventoryID } });
      }
  
      res.status(200).json({ message: 'Low stock Notification marked as read' });
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });


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


module.exports = router;