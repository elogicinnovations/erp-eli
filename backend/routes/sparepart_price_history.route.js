const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { SparePartPrice_history, Supplier, SparePart } = require("../db/models/associations"); 
const session = require('express-session')


router.route('/fetchSparehistory').get(async (req, res) => {
    try {
      
      console.log(req.query.spare_ID)
      const data = await SparePartPrice_history.findAll({
        include: [{
          model: SparePart,
          required: true
        },
        {
          model: Supplier,
          required: true
        }
      ],
        where: {sparePart_id: req.query.spare_ID}
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