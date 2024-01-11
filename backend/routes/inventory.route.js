const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Assembly_SparePart = require('../db/models/assembly_spare.model')
const { Inventory, Inventory_Assembly, Inventory_Spare, 
        Inventory_Subpart, Product, ProductTAGSupplier, 
        Assembly_Supplier, SparePart_Supplier, Subpart_supplier, 
        Manufacturer, BinLocation,  Category, Supplier, Assembly, SparePart, SubPart
      } = require('../db/models/associations')

const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));



router.route('/fetchInvetory_product').get(async (req, res) => {
    try {
      const data = await Inventory.findAll({
        include:[ {
          model: ProductTAGSupplier,
          required: true,

              include: [{
                model: Product,
                required: true,

                    include: [{
                      model: Manufacturer,
                      required: true,
                    }]
              },
              {
                model: Supplier,
                required: true
              }],            
        }
        
      ]
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

  
router.route('/fetchInvetory_assembly').get(async (req, res) => {
  try {
    const data = await Inventory_Assembly.findAll({
      include:[ {
        model: Assembly_Supplier,
        required: true,

            include: [{
              model: Assembly,
              required: true,

              include: [{
                model: Manufacturer,
                required: true,
              }]

            },
            {
              model: Supplier,
              required: true
            }],            
      }
      
    ]
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



router.route('/fetchInvetory_spare').get(async (req, res) => {
  try {
    const data = await Inventory_Spare.findAll({
      include:[ {
        model: SparePart_Supplier,
        required: true,

            include: [{
              model: SparePart,
              required: true,

              include: [{
                model: Manufacturer,
                required: true,
              }]

            },
            {
              model: Supplier,
              required: true
            }],            
      }
      
    ]
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



router.route('/fetchInvetory_subpart').get(async (req, res) => {
  try {
    const data = await Inventory_Subpart.findAll({
      include:[ {
        model: Subpart_supplier,
        required: true,

            include: [{
              model: SubPart,
              required: true,

              include: [{
                model: Manufacturer,
                required: true,
              }]

            },
            {
              model: Supplier,
              required: true
            }],            
      }
      
    ]
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


  

router.route('/fetchView').get(async (req, res) => {
  try {
    const data = await Inventory.findAll({
      where: {
        inventory_id: req.query.id
      },
      include:[ {
        model: ProductTAGSupplier,
        required: true,

            include: [{
              model: Product,
              required: true,

                  include: [{
                    model: Category,
                    required: true,
                        
                  },
                  {
                    model: BinLocation,
                    required: true,
                        
                  }]

            },
            {
              model: Supplier,
              required: true
            }]
      }]
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



router.route('/fetchView_assembly').get(async (req, res) => {
  try {
    const data = await Inventory_Assembly.findAll({
      where: {
        inventory_id: req.query.id
      },
      include:[ {
        model: Assembly_Supplier,
        required: true,

            include: [{
              model: Assembly,
              required: true,
            },
            {
              model: Supplier,
              required: true
            }]
      }]
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


router.route('/fetchView_spare').get(async (req, res) => {
  try {
    const data = await Inventory_Spare.findAll({
      where: {
        inventory_id: req.query.id
      },
      include:[ {
        model: SparePart_Supplier,
        required: true,

            include: [{
              model: SparePart,
              required: true,
            },
            {
              model: Supplier,
              required: true
            }]
      }]
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



router.route('/fetchView_subpart').get(async (req, res) => {
  try {
    const data = await Inventory_Subpart.findAll({
      where: {
        inventory_id: req.query.id
      },
      include:[ {
        model: Subpart_supplier,
        required: true,

            include: [{
              model: SubPart,
              required: true,
            },
            {
              model: Supplier,
              required: true
            }]
      }]
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


router.route('/fetchToIssueProduct').get(async (req, res) => { // para sa pag fetch ng product for issuance
  try {
    
    // console.log( 'product' + req.query.id)
    const data = await Inventory.findAll({
      include: [{
        model: ProductTAGSupplier,
        required: true,

        include: [{
          model: Product,
          required: true
        },
        {
          model: Supplier,
          required: true
        }
      ]
      }]
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



router.route('/fetchToIssueAssembly').get(async (req, res) => { // para sa pag fetch ng product for issuance
  try {
    
    // console.log(req.query.id)
    const data = await Inventory_Assembly.findAll({
      include: [{
        model: Assembly_Supplier,
        required: true,

        include: [{
          model: Assembly,
          required: true
        },
        {
          model: Supplier,
          required: true
        }
      ]
      }]
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


router.route('/fetchToIssueSpare').get(async (req, res) => { // para sa pag fetch ng product for issuance
  try {
    
    // console.log(req.query.id)
    const data = await Inventory_Spare.findAll({
      include: [{
        model: SparePart_Supplier,
        required: true,

        include: [{
          model: SparePart,
          required: true
        },
        {
          model: Supplier,
          required: true
        }
      ]
      }]
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


router.route('/fetchToIssueSubpart').get(async (req, res) => { // para sa pag fetch ng product for issuance
  try {
    
    // console.log(req.query.id)
    const data = await Inventory_Subpart.findAll({
      include: [{
        model: Subpart_supplier,
        required: true,

        include: [{
          model: SubPart,
          required: true
        },
        {
          model: Supplier,
          required: true
        }
      ]
      }]
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