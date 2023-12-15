const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { StockTransfer} = require("../db/models/associations"); 
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route('/fetchTable').get(async (req, res) => {
    try {
      const data = await StockTransfer.findAll();
  
      if (data) {
        // console.log("******************"+data);
        return res.json(data);
      } else {
        res.status(400);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });

  router.route('/lastPRNumber').get(async (req, res) => {
    try {

        const latestPR = await StockTransfer.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('reference_code')), 'latestPRNumber']],
          });
        const latestPRNumber = latestPR.getDataValue('latestPRNumber');

        // console.log('Latest PR Number:', latestPRNumber);
        return res.json(latestPRNumber);


    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });

  module.exports = router;