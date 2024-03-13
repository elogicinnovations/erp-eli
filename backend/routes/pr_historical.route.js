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

  // router.route("/LowOnstockProduct").get(async (req, res) => {
  //   try {
  //     const productData = await Inventory.findAll({
  //       include: [
  //         {
  //           model: ProductTAGSupplier,
  //           required: true,
  
  //           include: [
  //             {
  //               model: Product,
  //               required: true,
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     const groupedProductData = {};
  //     const encounteredProductNames = {}; 

  //     productData.forEach((item) => {
  //       const productID = item.product_tag_supplier?.product?.product_id;
  //       const productCode = item.product_tag_supplier?.product?.product_code;
  //       const productName = item.product_tag_supplier?.product?.product_name;
  //       const productThreshold = item.product_tag_supplier?.product?.product_threshold;
  //       const Price = item.price;
  //       const quantity = item.quantity;
  //       // Ensure that productCode and productName are truthy before using them
  //       if (productCode && productName) {
  //         const key = `${productCode}_${productName}`;
  
  //         if (!groupedProductData[key]) {
  //           groupedProductData[key] = {
  //             productID: productID,
  //             product_code: productCode,
  //             product_name: productName,
  //             productThreshold: productThreshold,
  //             totalQuantity: 0,
  //             price: Price,
  //             products: [],
  //           };
  //         }
  
  //         groupedProductData[key].totalQuantity += quantity;
  //         groupedProductData[key].products.push(item);
          
  //         if (!encounteredProductNames[productName]) {
  //         // console.log(productName + productThreshold);
  //         encounteredProductNames[productName] = true;
  //        }
  //       }
  //     });

  //     const finalResult_PRD = Object.values(groupedProductData);
      
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json("Error");
  //   }
  // });

  router.route("/LowOnstockProduct").get(async (req, res) => {
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
              },
            ],
          },
        ],
      });
  
      const groupedProductData = {};
      const encounteredProductNames = {};
  
      productData.forEach((item) => {
        const productID = item.product_tag_supplier?.product?.product_id;
        const productCode = item.product_tag_supplier?.product?.product_code;
        const productName = item.product_tag_supplier?.product?.product_name;
        const productThreshold = item.product_tag_supplier?.product?.product_threshold;
        const Price = item.price;
        const quantity = item.quantity;
  
        // Ensure that productCode and productName are truthy before using them
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
            // console.log(productName + productThreshold);
            encounteredProductNames[productName] = true;
          }
        }
      });
  
      // Now you have grouped product data with total quantities
      const finalResult_PRD = Object.values(groupedProductData);
  
      // If you want to log the sum of all quantities per product name
      Object.keys(encounteredProductNames).forEach((productName) => {
        const sumQuantity = finalResult_PRD.reduce((sum, product) => {
          if (product.product_name === productName) {
            return sum + product.totalQuantity;
          }
          return sum;
        }, 0);
        // console.log(`Total quantity for product ${productName}: ${sumQuantity}`);
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

      assemblyData.forEach((item) => {
        const productID = item.assembly_supplier?.assembly?.id;
        const productCode = item.assembly_supplier?.assembly?.assembly_code;
        const productName = item.assembly_supplier?.assembly?.assembly_name;
        const Price = item.price;
        const quantity = item.quantity;

        // Ensure that productCode and productName are truthy before using them
        if (productCode && productName && Price) {
          const key = `${productCode}_${productName}_${Price}`;
  
          if (!groupedAsmData[key]) {
            groupedAsmData[key] = {
              productID: productID,
              product_code: productCode,
              product_name: productName,
              totalQuantity: 0,
              price: Price,
              products: [],
            };
          }
  
          groupedAsmData[key].totalQuantity += quantity;
          groupedAsmData[key].products.push(item);

          // Check if the assembly name has been encountered
          if (!encounteredAssemblyNames[productName]) {
            // console.log(productName + productThreshold);
            encounteredAssemblyNames[productName] = true;
          }
        }
      });
  
      const finalResult_asm = Object.values(groupedAsmData);
        Object.keys(encounteredAssemblyNames).forEach((productName) => {
          const sumQuantity = finalResult_asm.reduce((sum, product) => {
            if (product.product_name === productName) {
              return sum + product.totalQuantity;
            }
            return sum;
          }, 0);
          // console.log(`Total quantity for assembly ${productName}: ${sumQuantity}`);
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

        spareData.forEach((item) => {
          const productID = item.sparepart_supplier?.sparePart?.id;
          const productCode = item.sparepart_supplier?.sparePart?.spareParts_code;
          const productName = item.sparepart_supplier?.sparePart?.spareParts_name;
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
                totalQuantity: 0,
                price: Price,
                products: [],
              };
            }
    
            groupedSpareData[key].totalQuantity += quantity;
            groupedSpareData[key].products.push(item);

            // Check if the spare name has been encountered
            if (!encounteredSpareNames[productName]) {
              // console.log(productName + productThreshold);
              encounteredSpareNames[productName] = true;
            }
          }
        });
    
        const finalResult_spare = Object.values(groupedSpareData);
        Object.keys(encounteredSpareNames).forEach((productName) => {
          const sumQuantity = finalResult_spare.reduce((sum, product) => {
            if (product.product_name === productName) {
              return sum + product.totalQuantity;
            }
            return sum;
          }, 0);
          console.log(`Total quantity for spare ${productName}: ${sumQuantity}`);
        });
      
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