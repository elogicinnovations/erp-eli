const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {Assembly, Assembly_image} = require('../db/models/associations')
const session = require('express-session')

router.route('/fetchAssemblyImage').get(async (req, res) => {
    try {
      const data = await Assembly_image.findAll({
        include:[{
          model: Assembly,
          required: true
        }],
        where: {
            assembly_id: req.query.id,
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