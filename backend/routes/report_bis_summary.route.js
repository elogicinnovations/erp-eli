const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const moment = require("moment-timezone");
const {
    CostCenter, IssuedApproveProduct, Inventory, ProductTAGSupplier, Product, Category, Issuance, MasterList, Department, IssuedApproveAssembly, Inventory_Assembly, Assembly_Supplier, Assembly,
    IssuedApproveSpare,
    Inventory_Spare,
    SparePart_Supplier,
    SparePart,
    IssuedApproveSubpart,
    Inventory_Subpart,
    Subpart_supplier,
    SubPart
} = require("../db/models/associations");
const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/content_fetch").get(async (req, res) => {
  try {

    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    const currentDate = moment();
    const firstDateOfMonth = currentDate.clone().startOf("month").startOf('day');
    const lastDateOfMonth = currentDate.clone().endOf("month").endOf('day');


    const data_prd = await IssuedApproveProduct.findAll({
        where: {
            quantity: { [Op.ne]: 0 },
            createdAt: {
                [Op.between]: [
                    firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                    lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                ],
              },
        },
        include: [{
            model: Inventory,
            required: true,
                include: [{
                    model: ProductTAGSupplier,
                    required: true,

                        include: [{
                            model: Product,
                            required: true,
                                include: [{
                                    model: Category,
                                    required: true
                                }]
                        }]
                }]
        },{
            model: Issuance,
            required: true,

            include: [{
                model: CostCenter,
                required: true,

                    include: [{
                        model: MasterList,
                        required: true,

                            include: Department,
                            required: true
                    }]
            }]

        }]
    })

    const data_asm = await IssuedApproveAssembly.findAll({
        where: {
            quantity: { [Op.ne]: 0 },
            createdAt: {
                [Op.between]: [
                    firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                    lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                ],
              },
        },
        include: [{
            model: Inventory_Assembly,
            required: true,
                include: [{
                    model: Assembly_Supplier,
                    required: true,

                        include: [{
                            model: Assembly,
                            required: true,
                                include: [{
                                    model: Category,
                                    required: true
                                }]
                        }]
                }]
        },{
            model: Issuance,
            required: true,

            include: [{
                model: CostCenter,
                required: true,

                    include: [{
                        model: MasterList,
                        required: true,

                            include: Department,
                            required: true
                    }]
            }]

        }]
    })

     const data_spare = await IssuedApproveSpare.findAll({
        where: {
            quantity: { [Op.ne]: 0 },
            createdAt: {
                [Op.between]: [
                    firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                    lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                ],
              },
        },
        include: [{
            model: Inventory_Spare,
            required: true,
                include: [{
                    model: SparePart_Supplier,
                    required: true,

                        include: [{
                            model: SparePart,
                            required: true,
                                include: [{
                                    model: Category,
                                    required: true
                                }]
                        }]
                }]
        },{
            model: Issuance,
            required: true,

            include: [{
                model: CostCenter,
                required: true,

                    include: [{
                        model: MasterList,
                        required: true,

                            include: Department,
                            required: true
                    }]
            }]

        }]
    })

    const data_subpart = await IssuedApproveSubpart.findAll({
        where: {
            quantity: { [Op.ne]: 0 },
            createdAt: {
                [Op.between]: [
                    firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                    lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss"),
                ],
              },
        },
        include: [{
            model: Inventory_Subpart,
            required: true,
                include: [{
                    model: Subpart_supplier,
                    required: true,

                        include: [{
                            model: SubPart,
                            required: true,
                                include: [{
                                    model: Category,
                                    required: true
                                }]
                        }]
                }]
        },{
            model: Issuance,
            required: true,

            include: [{
                model: CostCenter,
                required: true,

                    include: [{
                        model: MasterList,
                        required: true,

                            include: Department,
                            required: true
                    }]
            }]

        }]
    })


    const category = await Category.findAll({
        order: [
          ['category_name', 'ASC'] 
        ]
      });
    // category.forEach(data => {
    //     console.log(`${data.category_code}`)
    // });

    const cost_center = await CostCenter.findAll({
        order: [
          ['name', 'ASC'] 
        ]
      });
        
      const dataArray = [];

      // Initialize an object to hold category codes as keys and their respective prices as values
      const categoryPrices = {};
      
      // Assign initial prices of 0 to all categories
      category.forEach(cat => {
          categoryPrices[cat.category_code] = 0;
      });
      
      // Iterate over Cost Centers and initialize their data
      cost_center.forEach(costCenter => {
          const costCenterData = {
                costCenterName: costCenter.name,
                costCenterId: costCenter.id,
                prices: { ...categoryPrices } // Clone the categoryPrices object to avoid reference sharing
          };
          dataArray.push(costCenterData);
      });
      
      // Iterate through data_prd and update prices for each Cost Center and category

      [data_prd, data_asm, data_spare, data_subpart].forEach(
        (data) => {
          data.forEach((data) => {
            const costCenterId = data.issuance.cost_center.id;
            const mappingCategoryCode = data.inventory_prd
            ? data.inventory_prd.product_tag_supplier.product
            : data.inventory_assembly
            ? data.inventory_assembly.assembly_supplier.assembly
            : data.inventory_spare
            ? data.inventory_spare.sparepart_supplier.sparePart
            : data.inventory_subpart.subpart_supplier.subPart;
            const categoryCode = mappingCategoryCode.category.category_code;

            const mappingInventory = data.inventory_prd
            ? data.inventory_prd
            : data.inventory_assembly
            ? data.inventory_assembly
            : data.inventory_spare
            ? data.inventory_spare
            : data.inventory_subpart;
            const price = (mappingInventory.price + mappingInventory.freight_cost + mappingInventory.custom_cost) * data.quantity;
        
            // Find the index of the Cost Center in dataArray
            const costCenterIndex = dataArray.findIndex(item => item.costCenterId === costCenterId);
        
            // If the Cost Center exists in dataArray, update the price for the corresponding category
            if (costCenterIndex !== -1) {
                // If the category exists for the Cost Center, update its price
                if (dataArray[costCenterIndex].prices.hasOwnProperty(categoryCode)) {
                    dataArray[costCenterIndex].prices[categoryCode] += price;
                }
            }

          })})
      
      res.json(dataArray)

  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});


router.route("/filter").get(async (req, res) => {
    try {

        const {strDate, enDate } = req.query

        const startDates = new Date(strDate);
        startDates.setDate(startDates.getDate() + 1);
        const startDate = startDates.toISOString().slice(0, 10) + " 00:00:00";

        const endDates = new Date(enDate);
        endDates.setDate(endDates.getDate() + 1);
        const endDate = endDates.toISOString().slice(0, 10) + " 23:59:59";
    
    
        const data_prd = await IssuedApproveProduct.findAll({
            where: {
                quantity: { [Op.ne]: 0 },
                createdAt: {
                    [Op.between]: [
                        startDate,
                        endDate
                    ],
                  },
            },
            include: [{
                model: Inventory,
                required: true,
                    include: [{
                        model: ProductTAGSupplier,
                        required: true,
    
                            include: [{
                                model: Product,
                                required: true,
                                    include: [{
                                        model: Category,
                                        required: true
                                    }]
                            }]
                    }]
            },{
                model: Issuance,
                required: true,
    
                include: [{
                    model: CostCenter,
                    required: true,
    
                        include: [{
                            model: MasterList,
                            required: true,
    
                                include: Department,
                                required: true
                        }]
                }]
    
            }]
        })
    
        const data_asm = await IssuedApproveAssembly.findAll({
            where: {
                quantity: { [Op.ne]: 0 },
                createdAt: {
                    [Op.between]: [
                        startDate,
                        endDate
                    ],
                  },
            },
            include: [{
                model: Inventory_Assembly,
                required: true,
                    include: [{
                        model: Assembly_Supplier,
                        required: true,
    
                            include: [{
                                model: Assembly,
                                required: true,
                                    include: [{
                                        model: Category,
                                        required: true
                                    }]
                            }]
                    }]
            },{
                model: Issuance,
                required: true,
    
                include: [{
                    model: CostCenter,
                    required: true,
    
                        include: [{
                            model: MasterList,
                            required: true,
    
                                include: Department,
                                required: true
                        }]
                }]
    
            }]
        })
    
         const data_spare = await IssuedApproveSpare.findAll({
            where: {
                quantity: { [Op.ne]: 0 },
                createdAt: {
                    [Op.between]: [
                        startDate,
                        endDate
                    ],
                  },
            },
            include: [{
                model: Inventory_Spare,
                required: true,
                    include: [{
                        model: SparePart_Supplier,
                        required: true,
    
                            include: [{
                                model: SparePart,
                                required: true,
                                    include: [{
                                        model: Category,
                                        required: true
                                    }]
                            }]
                    }]
            },{
                model: Issuance,
                required: true,
    
                include: [{
                    model: CostCenter,
                    required: true,
    
                        include: [{
                            model: MasterList,
                            required: true,
    
                                include: Department,
                                required: true
                        }]
                }]
    
            }]
        })
    
        const data_subpart = await IssuedApproveSubpart.findAll({
            where: {
                quantity: { [Op.ne]: 0 },
                createdAt: {
                    [Op.between]: [
                        startDate,
                        endDate
                    ],
                  },
            },
            include: [{
                model: Inventory_Subpart,
                required: true,
                    include: [{
                        model: Subpart_supplier,
                        required: true,
    
                            include: [{
                                model: SubPart,
                                required: true,
                                    include: [{
                                        model: Category,
                                        required: true
                                    }]
                            }]
                    }]
            },{
                model: Issuance,
                required: true,
    
                include: [{
                    model: CostCenter,
                    required: true,
    
                        include: [{
                            model: MasterList,
                            required: true,
    
                                include: Department,
                                required: true
                        }]
                }]
    
            }]
        })
    
    
        const category = await Category.findAll({
            order: [
              ['category_name', 'ASC'] 
            ]
          });
        // category.forEach(data => {
        //     console.log(`${data.category_code}`)
        // });
    
        const cost_center = await CostCenter.findAll({
            order: [
              ['name', 'ASC'] 
            ]
          });
            
          const dataArray = [];
    
          // Initialize an object to hold category codes as keys and their respective prices as values
          const categoryPrices = {};
          
          // Assign initial prices of 0 to all categories
          category.forEach(cat => {
              categoryPrices[cat.category_code] = 0;
          });
          
          // Iterate over Cost Centers and initialize their data
          cost_center.forEach(costCenter => {
              const costCenterData = {
                    costCenterName: costCenter.name,
                    costCenterId: costCenter.id,
                    prices: { ...categoryPrices } // Clone the categoryPrices object to avoid reference sharing
              };
              dataArray.push(costCenterData);
          });
          
          // Iterate through data_prd and update prices for each Cost Center and category
    
          [data_prd, data_asm, data_spare, data_subpart].forEach(
            (data) => {
              data.forEach((data) => {
                const costCenterId = data.issuance.cost_center.id;
                const mappingCategoryCode = data.inventory_prd
                ? data.inventory_prd.product_tag_supplier.product
                : data.inventory_assembly
                ? data.inventory_assembly.assembly_supplier.assembly
                : data.inventory_spare
                ? data.inventory_spare.sparepart_supplier.sparePart
                : data.inventory_subpart.subpart_supplier.subPart;
                const categoryCode = mappingCategoryCode.category.category_code;
    
                const mappingInventory = data.inventory_prd
                ? data.inventory_prd
                : data.inventory_assembly
                ? data.inventory_assembly
                : data.inventory_spare
                ? data.inventory_spare
                : data.inventory_subpart;
                const price = (mappingInventory.price + mappingInventory.freight_cost + mappingInventory.custom_cost) * data.quantity;
            
                // Find the index of the Cost Center in dataArray
                const costCenterIndex = dataArray.findIndex(item => item.costCenterId === costCenterId);
            
                // If the Cost Center exists in dataArray, update the price for the corresponding category
                if (costCenterIndex !== -1) {
                    // If the category exists for the Cost Center, update its price
                    if (dataArray[costCenterIndex].prices.hasOwnProperty(categoryCode)) {
                        dataArray[costCenterIndex].prices[categoryCode] += price;
                    }
                }
    
              })})
          
          res.json(dataArray)
    
      } catch (err) {
        console.error(err);
        res.status(500).json("Error");
      }
});
  
module.exports = router;
