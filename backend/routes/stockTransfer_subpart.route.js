const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const PR = require('../db/models/pr.model')
const {StockTransfer, StockTransfer_subpart, SubPart} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route('/fetchStockTransferSubpart').get(async (req, res) => {
    try {
     
      const data = await StockTransfer_subpart.findAll({
          where: {
            pr_id: req.query.id
          },
          include: {
            model: SubPart,
            required: true
          }
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