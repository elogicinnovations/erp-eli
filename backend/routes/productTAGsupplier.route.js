const router = require('express').Router();
const { Op } = require('sequelize');
const sequelize = require('../db/config/sequelize.config');
const { ProductTAGSupplier, Product, PR, Supplier, Category } = require("../db/models/associations"); 


router.route('/fetchTable').get(async (req, res) => {
    try {
      
      console.log(req.query.id)
      const data = await ProductTAGSupplier.findAll({
        include:[{
          model: Supplier,
          required: true
        }],
        
        where: {product_id: req.query.id}
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


  router.route('/fetchCanvass').get(async (req, res) => {
    try {
      
      console.log(req.query.id)
      const data = await ProductTAGSupplier.findAll({
        include: [{
          model: Product,
          required: true,

          include: [{
            model: Category,
            required: true
          }]
        },
        {
          model: Supplier,
          required: true
        }
      ],
        where: {product_id: req.query.id}
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


router.route('/fetchProduct').get(async (req, res) => { // for fetching product that is tag to supplier (supplier module)
  try {
    // console.log(req.query.id)

    const data = await ProductTAGSupplier.findAll({
      where: { supplier_code: req.query.id },
      include: {
        model: Product,
        required: true,
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



module.exports = router;
