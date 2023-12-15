const router = require('express').Router()
const {where, Op, fn, col, gt, gte, lt, lte} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { startOfMonth, endOfMonth, format } = require('date-fns'); // You may need to install the date-fns library

const { Issuance, MasterList, 
        CostCenter, Inventory, 
        IssuedProduct, IssuedAssembly,
        IssuedSpare, IssuedSubpart, 
        Inventory_Assembly, Inventory_Spare, 
        Inventory_Subpart, ProductTAGSupplier, 
        Supplier, PR, Product, Assembly_Supplier, Assembly, SparePart_Supplier, SparePart, Subpart_supplier, SubPart
    } = require("../db/models/associations"); 
        
// const Issued_Product = require('../db/models/issued_product.model')
// const Inventory = require('../db/models/issued_product.model')


// Get count all the issued products for DASHBOARD

router.route('/fetchCountIssued').get(async (req, res) => {
  try {
    // Get the start and end dates of the current month
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);

    // Count issued products for the current month
    const countProduct = await IssuedProduct.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Similar counts for other tables (IssuedAssembly, IssuedSpare, IssuedSubpart)

    const countAssembly = await IssuedAssembly.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const countSpare = await IssuedSpare.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const countSubpart = await IssuedSubpart.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const totalIssuedCount = countProduct + countAssembly + countSpare + countSubpart;

    return res.json(totalIssuedCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get count all the invnetory products for DASHBOARD
router.route('/fetchCountInventory').get(async (req, res) => 
{
    try {

         // Get the start and end dates of the current month
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);


        const countProduct = await Inventory.count({
            where: {
                updatedAt: {
                  [Op.between]: [startDate, endDate],
                },
              },
        });
        const countAssembly = await Inventory_Assembly.count({
            where: {
                updatedAt: {
                  [Op.between]: [startDate, endDate],
                },
              },
        });
        const countSpare = await Inventory_Spare.count({
            where: {
                updatedAt: {
                  [Op.between]: [startDate, endDate],
                },
              },
        });
        const countSubpart = await Inventory_Subpart.count({
            where: {
                updatedAt: {
                  [Op.between]: [startDate, endDate],
                },
              },
        });


        const totalInventoryCount = countProduct + countAssembly + countSpare + countSubpart
    
        return res.json(totalInventoryCount);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

// Get count all the inventory products for DASHBOARD
router.route('/fetchValueInventory').get(async (req, res) => {
    try {
        // Get the start and end dates of the current month
        const currentDate = new Date();
        const startDate = startOfMonth(currentDate);
        const endDate = endOfMonth(currentDate);

        // Sum of inventory products for the current month
        const sumPRD = await Inventory.sum('price', {
            where: {
                updatedAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });

        // Sum of inventory assembly for the current month
        const sumAsmbly = await Inventory_Assembly.sum('price', {
            where: {
                updatedAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });

        // Sum of inventory spare for the current month
        const sumSpare = await Inventory_Spare.sum('price', {
            where: {
                updatedAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });

        // Sum of inventory subpart for the current month
        const sumSub = await Inventory_Subpart.sum('price', {
            where: {
                updatedAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });

        const totalValue = sumPRD + sumAsmbly + sumSpare + sumSub;
        res.json(totalValue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// Get count all the suppplier for DASHBOARD
router.route('/fetchCountSupplier').get(async (req, res) => {
    try {

        const countSupplier = await Supplier.count({
          where: {
            supplier_status: 'Active'
          }
        });
        res.json(countSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get count all the inventory products for DASHBOARD
router.route('/fetchCountOrdered').get(async (req, res) => {
    try {

        const orderedCount = await PR.count({
            where: {
                status: 'To-Receive'
            }
        });
        // console.log(totalValue)
        res.json(orderedCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.route('/fetchLowStock').get(async (req, res) => {
  try {


    
    let countLowStock_Product = 0;
    let countLowStock_Assembly = 0;
    let countLowStock_Spare = 0;
    let countLowStock_Subpart = 0;


    const lowStockCount_prd = await Inventory.findAll({
      include: [{
        model: ProductTAGSupplier,
        required: true,
        include: [{
          model: Product,
          required: true,
        }],
      }],
    });


    lowStockCount_prd.forEach(item => {
      const inventoryQuantity = item.quantity;
      const Threshold = item.product_tag_supplier.product.product_threshold;

      const productThreshold = Threshold !== null ? Threshold : 0;
      
      // console.log(inventoryQuantity);
      // console.log(productThreshold);

      if (inventoryQuantity <= productThreshold && inventoryQuantity !== 0) {
        countLowStock_Product += 1; // Use the += operator to increment the count
      }
    });


    //====================ASEMBLY

    const lowStockCount_asmbly = await Inventory_Assembly.findAll({
      include: [{
        model: Assembly_Supplier,
        required: true,
        include: [{
          model: Assembly,
          required: true,
        }],
      }],
    });

    lowStockCount_asmbly.forEach(item => {
      const inventoryQuantity = item.quantity;
      const Threshold = item.assembly_supplier.assembly.threshhold;

      const productThreshold = Threshold !== null ? Threshold : 0;
      
      // console.log(inventoryQuantity);
      // console.log(productThreshold);

      if (inventoryQuantity <= productThreshold && inventoryQuantity !== 0) {
        countLowStock_Assembly += 1; // Use the += operator to increment the count
      }
    });


        //====================Spare

        const lowStockCount_spare = await Inventory_Spare.findAll({
          include: [{
            model: SparePart_Supplier,
            required: true,
            include: [{
              model: SparePart,
              required: true,
            }],
          }],
        });
    
        lowStockCount_spare.forEach(item => {
          const inventoryQuantity = item.quantity;
          const Threshold = item.sparepart_supplier.sparePart.threshhold;
    
          const productThreshold = Threshold !== null ? Threshold : 0;
      
          // console.log(inventoryQuantity);
          // console.log(productThreshold);
    
          if (inventoryQuantity <= productThreshold && inventoryQuantity !== 0) {
            countLowStock_Spare += 1; // Use the += operator to increment the count
          }
        });

          //====================Spare

          const lowStockCount_subpart = await Inventory_Subpart.findAll({
            include: [{
              model: Subpart_supplier,
              required: true,
              include: [{
                model: SubPart,
                required: true,
              }],
            }],
          });
      
          lowStockCount_subpart.forEach(item => {
            const inventoryQuantity = item.quantity;
            const Threshold = item.subpart_supplier.subPart.threshhold;

            const productThreshold = Threshold !== null ? Threshold : 0;
      
            // console.log(inventoryQuantity);
            // console.log(productThreshold);
      
            if (inventoryQuantity <= productThreshold && inventoryQuantity !== 0) {
              countLowStock_Spare += 1; // Use the += operator to increment the count
            }
          });

    // If you want to log the entire array, uncomment the line below
    // console.log("---------------------",countLowStock_Product + countLowStock_Assembly + countLowStock_Spare + countLowStock_Subpart );

    res.json(countLowStock_Product + countLowStock_Assembly + countLowStock_Spare + countLowStock_Subpart );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.route('/fetchInStock').get(async (req, res) => {
  try {


    
    let countStock_Product = 0;
    let countStock_Assembly = 0;
    let countStock_Spare = 0;
    let countStock_Subpart = 0;


    const StockCount_prd = await Inventory.findAll({
      include: [{
        model: ProductTAGSupplier,
        required: true,
        include: [{
          model: Product,
          required: true,
        }],
      }],
    });


    StockCount_prd.forEach(item => {
      const inventoryQuantity = item.quantity;
      const Threshold = item.product_tag_supplier.product.product_threshold;

      const productThreshold = Threshold !== null ? Threshold : 0;
      
      // console.log(inventoryQuantity);
      // console.log(productThreshold);

      if (inventoryQuantity > productThreshold && inventoryQuantity !== 0) {
        countStock_Product += 1; // Use the += operator to increment the count
      }
    });


    //====================ASEMBLY

    const StockCount_asmbly = await Inventory_Assembly.findAll({
      include: [{
        model: Assembly_Supplier,
        required: true,
        include: [{
          model: Assembly,
          required: true,
        }],
      }],
    });

    StockCount_asmbly.forEach(item => {
      const inventoryQuantity = item.quantity;
      const Threshold = item.assembly_supplier.assembly.threshhold;

      const productThreshold = Threshold !== null ? Threshold : 0;
      
      // console.log(inventoryQuantity);
      // console.log(productThreshold);

      if (inventoryQuantity > productThreshold && inventoryQuantity !== 0) {
        countStock_Assembly += 1; // Use the += operator to increment the count
      }
    });


        //====================Spare

        const StockCount_spare = await Inventory_Spare.findAll({
          include: [{
            model: SparePart_Supplier,
            required: true,
            include: [{
              model: SparePart,
              required: true,
            }],
          }],
        });
    
        StockCount_spare.forEach(item => {
          const inventoryQuantity = item.quantity;
          const Threshold = item.sparepart_supplier.sparePart.threshhold;
    
          const productThreshold = Threshold !== null ? Threshold : 0;
      
          // console.log(inventoryQuantity);
          // console.log(productThreshold);
    
          if (inventoryQuantity > productThreshold && inventoryQuantity !== 0) {
            countStock_Spare += 1; // Use the += operator to increment the count
          }
        });

          //====================Spare

          const StockCount_subpart = await Inventory_Subpart.findAll({
            include: [{
              model: Subpart_supplier,
              required: true,
              include: [{
                model: SubPart,
                required: true,
              }],
            }],
          });
      
          StockCount_subpart.forEach(item => {
            const inventoryQuantity = item.quantity;
            const Threshold = item.subpart_supplier.subPart.threshhold;

            const productThreshold = Threshold !== null ? Threshold : 0;
      
            // console.log(inventoryQuantity);
            // console.log(productThreshold);
      
            if (inventoryQuantity > productThreshold && inventoryQuantity !== 0) {
              countStock_Spare += 1; // Use the += operator to increment the count
            }
          });

    // If you want to log the entire array, uncomment the line below
    // console.log("------------instock---------",countStock_Product + countStock_Assembly + countStock_Spare + countStock_Subpart );

    res.json(countStock_Product + countStock_Assembly + countStock_Spare + countStock_Subpart );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.route('/fetchOutStock').get(async (req, res) => {
  try {


    
    let countStock_Product = 0;
    let countStock_Assembly = 0;
    let countStock_Spare = 0;
    let countStock_Subpart = 0;


    const StockCount_prd = await Inventory.findAll({
      include: [{
        model: ProductTAGSupplier,
        required: true,
        include: [{
          model: Product,
          required: true,
        }],
      }],
    });


    StockCount_prd.forEach(item => {
      const inventoryQuantity = item.quantity;
      const Threshold = item.product_tag_supplier.product.product_threshold;

      const productThreshold = Threshold !== null ? Threshold : 0;
      
      // console.log(inventoryQuantity);
      // console.log(productThreshold);

      if (inventoryQuantity === 0) {
        countStock_Product += 1; // Use the += operator to increment the count
      }
    });


    //====================ASEMBLY

    const StockCount_asmbly = await Inventory_Assembly.findAll({
      include: [{
        model: Assembly_Supplier,
        required: true,
        include: [{
          model: Assembly,
          required: true,
        }],
      }],
    });

    StockCount_asmbly.forEach(item => {
      const inventoryQuantity = item.quantity;
      const Threshold = item.assembly_supplier.assembly.threshhold;

      const productThreshold = Threshold !== null ? Threshold : 0;
      
      // console.log(inventoryQuantity);
      // console.log(productThreshold);

      if (inventoryQuantity === 0) {
        countStock_Assembly += 1; // Use the += operator to increment the count
      }
    });


        //====================Spare

        const StockCount_spare = await Inventory_Spare.findAll({
          include: [{
            model: SparePart_Supplier,
            required: true,
            include: [{
              model: SparePart,
              required: true,
            }],
          }],
        });
    
        StockCount_spare.forEach(item => {
          const inventoryQuantity = item.quantity;
          const Threshold = item.sparepart_supplier.sparePart.threshhold;
    
          const productThreshold = Threshold !== null ? Threshold : 0;
      
          // console.log(inventoryQuantity);
          // console.log(productThreshold);
    
          if (inventoryQuantity === 0) {
            countStock_Spare += 1; // Use the += operator to increment the count
          }
        });

          //====================Spare

          const StockCount_subpart = await Inventory_Subpart.findAll({
            include: [{
              model: Subpart_supplier,
              required: true,
              include: [{
                model: SubPart,
                required: true,
              }],
            }],
          });
      
          StockCount_subpart.forEach(item => {
            const inventoryQuantity = item.quantity;
            const Threshold = item.subpart_supplier.subPart.threshhold;

            const productThreshold = Threshold !== null ? Threshold : 0;
      
            // console.log(inventoryQuantity);
            // console.log(productThreshold);
      
            if (inventoryQuantity === 0) {
              countStock_Spare += 1; // Use the += operator to increment the count
            }
          });

    // If you want to log the entire array, uncomment the line below
    // console.log("------------out---------",countStock_Product + countStock_Assembly + countStock_Spare + countStock_Subpart );

    res.json(countStock_Product + countStock_Assembly + countStock_Spare + countStock_Subpart );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.route('/countInventory').get(async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    console.log('Current Year:', currentYear);

    const startDate = new Date(`${currentYear - 1}-01-01T00:00:00Z`);
    const endDate = new Date(`${currentYear + 1}-01-01T00:00:00Z`);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    const dataCounts = await Inventory.findAll({
      attributes: [
        [sequelize.literal('MONTH(createdAt)'), 'month'],
        [sequelize.fn('COUNT', '*'), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      group: [sequelize.literal('MONTH(createdAt)')],
    });

    // Create an array with objects for each month
    const monthData = Array.from({ length: 12 }, (_, i) => {
      const monthNumber = i + 1;
      const monthName = new Date(currentYear, monthNumber - 1, 1)
        .toLocaleString('en-US', { month: 'long' });

      const dataForMonth = dataCounts.find(item => item.month === monthNumber);

      const countThisYear = dataForMonth ? dataForMonth.get('count') : 0;

      // Assuming you also have data for LastYear from somewhere
      const countLastYear = 2400; // Replace with actual data from LastYear

      return {
        month: monthName,
        ThisYear: countThisYear,
        LastYear: countLastYear,
      };
    });

    console.log(monthData);
    res.json(monthData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// router.route('/countInventory').get(async (req, res) => {
//   try {
//     const currentYear = new Date().getFullYear();

//     const dataCounts = await Inventory.findAll({
//       attributes: [
//         [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
//         [sequelize.fn('COUNT', '*'), 'count'],
//       ],
//       where: {
//         createdAt: {
//           [Op.gte]: new Date(`${currentYear - 1}-01-01T00:00:00Z`),
//           [Op.lt]: new Date(`${currentYear + 1}-01-01T00:00:00Z`),
//         },
//       },
//       group: [sequelize.fn('MONTH', sequelize.col('createdAt'))],
//     });

//     // Create an array with objects for each month
//     const monthData = Array.from({ length: 12 }, (_, i) => {
//       const monthNumber = i + 1;
//       const monthName = new Date(currentYear, monthNumber - 1, 1)
//         .toLocaleString('en-US', { month: 'long' });

//       const dataForMonth = dataCounts.find(item => item.month === monthNumber);
//       const countThisYear = dataForMonth ? dataForMonth.get('count') : 0;

//       // Assuming you also have data for LastYear from somewhere
//       const countLastYear = 2400; // Replace with actual data from LastYear

//       return {
//         month: monthName,
//         ThisYear: countThisYear,
//         LastYear: countLastYear,
//       };
//     });

//     console.log(monthData);
//     // res.json(monthData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });








 
module.exports = router;