const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Assembly_SparePart = require('../db/models/assembly_spare.model')
const {Inventory, Product, ProductTAGSupplier, Manufacturer, BinLocation,  Category, Supplier} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));



router.route('/fetchInvetory').get(async (req, res) => {
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





module.exports = router;