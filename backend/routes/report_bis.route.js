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

    return res.json({prd: data_prd, asm: data_asm, spare: data_spare, subpart: data_subpart})
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});


router.route("/filter").get(async (req, res) => {
    try {
  
      const { selectedDepartment, selectedCostcenter, strDate, enDate } = req.query

        const startDates = new Date(strDate);
        startDates.setDate(startDates.getDate() + 1);
        const startDate = startDates.toISOString().slice(0, 10) + " 00:00:00";

        const endDates = new Date(enDate);
        endDates.setDate(endDates.getDate() + 1);
        const endDate = endDates.toISOString().slice(0, 10) + " 23:59:59";


        let whereClause = {
            quantity: { [Op.ne]: 0 },
            createdAt: {
                [Op.between]: [
                  startDate,
                  endDate,
                ],
              },
        };

        if (selectedCostcenter !== "All") {
            whereClause['$issuance.issued_to$'] = selectedCostcenter;
        }

          
        if (selectedDepartment !== "All") {
            whereClause['$issuance.cost_center.masterList.department_id$'] = selectedDepartment;
        }
  
      const data_prd = await IssuedApproveProduct.findAll({
        where: whereClause,
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
                              required: true,
                             
                      }]
              }]
  
          }]
      })
  
  
      const data_asm = await IssuedApproveAssembly.findAll({
        where: whereClause,
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
        where: whereClause,
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
        where: whereClause,
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
  
      return res.json({prd: data_prd, 
        asm: data_asm, spare: data_spare, subpart: data_subpart
    })
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
});
  
module.exports = router;
