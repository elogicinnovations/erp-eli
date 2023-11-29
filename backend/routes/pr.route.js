const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const PR = require('../db/models/pr.model')
const {PR, PR_product} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/lastPRNumber').get(async (req, res) => {
    try {

        const latestPR = await PR.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('pr_num')), 'latestPRNumber']],
          });
        const latestPRNumber = latestPR.getDataValue('latestPRNumber');

        // console.log('Latest PR Number:', latestPRNumber);
        return res.json(latestPRNumber);


    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });

  
router.route('/create').post(async (req, res) => {
    try {
       const {prNum, dateNeed, useFor, remarks, addProductbackend} = req.body;
        
          const PR_newData = await PR.create({
            pr_num: prNum,
            date_needed: dateNeed,
            used_for: useFor,
            remarks: remarks,
          });

          const createdID = PR_newData.id;

          for (const prod of addProductbackend) {
            const prod_value = prod.value;
            const prod_quantity = prod.quantity;
            const prod_desc = prod.desc;

            await PR_product.create({
                pr_id: createdID,
                product_id: prod_value,
                quantity: prod_quantity,
                description: prod_desc
            });
          }
    
    
          res.status(200).json();
        
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});



module.exports = router;