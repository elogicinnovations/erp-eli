const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Supplier_SparePart = require('../db/models/sparePart_supplier..model')
const   {   
            PR_PO, PR_PO_asmbly, 
            PR_PO_spare, PR_PO_subpart,
            ProductTAGSupplier, Assembly_Supplier,
            SparePart_Supplier, Subpart_supplier,
            Product, SparePart, SubPart, Assembly,
            PR, Supplier
        } = require("../db/models/associations"); 
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));



router.route('/PO_PRD').get(async (req, res) => {
    try {
     
      const data = await PR_PO.findAll({
          include:[ {
            model: ProductTAGSupplier,
            required: true,
            
               include: [{
                model: Product,
                required: true
               },
                {
                    model: Supplier,
                    required: true
                }]
            },
            {
                model: PR,
                required: true,
                where: {
                    status: 'Delivered'
                }
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

  
router.route('/PO_asmbly').get(async (req, res) => {
    try {
     
        const data = await PR_PO_asmbly.findAll({
            include:[ {
              model: Assembly_Supplier,
              required: true,
              
                 include: [{
                  model: Assembly,
                  required: true
                 },
                  {
                      model: Supplier,
                      required: true
                  }]
              },
              {
                  model: PR,
                  required: true,
                  where: {
                      status: 'Delivered'
                  }
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

  
router.route('/PO_spare').get(async (req, res) => {
    try {
     
        const data = await PR_PO_spare.findAll({
            include:[ {
              model: SparePart_Supplier,
              required: true,
              
                 include: [{
                  model: SparePart,
                  required: true
                 },
                  {
                      model: Supplier,
                      required: true
                  }]
              },
              {
                  model: PR,
                  required: true,
                  where: {
                      status: 'Delivered'
                  }
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

  
router.route('/PO_subpart').get(async (req, res) => {
    try {
     
        const data = await PR_PO_subpart.findAll({
            include:[ {
              model: Subpart_supplier,
              required: true,
              
                 include: [{
                  model: SubPart,
                  required: true
                 },
                  {
                      model: Supplier,
                      required: true
                  }]
              },
              {
                  model: PR,
                  required: true,
                  where: {
                      status: 'Delivered'
                  }
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



module.exports = router;