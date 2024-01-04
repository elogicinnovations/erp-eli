const router = require('express').Router();
const { Op } = require('sequelize');
const sequelize = require('../db/config/sequelize.config');
const {productTAGsupplierHistory, Product, Supplier} = require("../db/models/associations"); 

router.route('/fetchPriceHistory').get(async (req, res) => {
    try {
      const data = await productTAGsupplierHistory.findAll({
        include: [{
          model: Product,
          required: true,
        },
        {
          model: Supplier,
          required: true
        }
      ],
        where: {product_id: req.query.product_id}
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