const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {Product, Product_image} = require('../db/models/associations')
const session = require('express-session')

router.route('/fetchproductImage').get(async (req, res) => {
    try {
      const data = await Product_image.findAll({
        include:[{
          model: Product,
          required: true
        }],
        where: {
            product_id: req.query.id,
        },
      });
  
      if (data) {
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