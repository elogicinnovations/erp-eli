const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {SparePart, SparePart_image} = require('../db/models/associations')
const session = require('express-session')

router.route('/fetchsparepartImage').get(async (req, res) => {
    try {
      const data = await SparePart_image.findAll({
        include:[{
          model: SparePart,
          required: true
        }],
        where: {
            sparepart_id: req.query.id,
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