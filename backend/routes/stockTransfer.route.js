const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { StockTransfer, StockTransfer_prod, StockTransfer_spare} = require("../db/models/associations"); 
const session = require('express-session');
const StockTransfer_assembly = require('../db/models/stockTransfer_assembly.model');
const StockTransfer_subpart = require('../db/models/stockTransfer_subpart.model');

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



  router.route('/create').post(async (req, res) => {
    try {
       const {source, destination, reference_code, col_id, remarks, addProductbackend} = req.body;
        
          const StockTransfer_newData = await StockTransfer.create({
            source: source,
            destination: destination,
            reference_code: reference_code,
            col_id: col_id,
            remarks: remarks
          });

          const createdID = StockTransfer_newData.stock_id;

          

          for (const prod of addProductbackend) {
            const prod_value = prod.value;
            const prod_quantity = prod.quantity;
            const prod_desc = prod.desc;
            const prod_type= prod.type;


            if (prod_type === "Product"){

              await StockTransfer_prod.create({
                pr_id: createdID,
                product_id: prod_value,
                quantity: prod_quantity,
                description: prod_desc,              
              } );
            } 
            else if (prod_type === "Assembly"){
              await StockTransfer_assembly.create({
                pr_id: createdID,
                assembly_id: prod_value,
                quantity: prod_quantity,
                description: prod_desc,              
              } );
            }
            else if (prod_type === "Spare"){
              await StockTransfer_spare.create({
                pr_id: createdID,
                spare_id: prod_value,
                quantity: prod_quantity,
                description: prod_desc,              
              } );
              console.log('Spare insert')
            }
            else if (prod_type === "SubPart"){
              await StockTransfer_subpart.create({
                pr_id: createdID,
                subPart_id: prod_value,
                quantity: prod_quantity,
                description: prod_desc,              
              } );
              console.log('SubPart insert')
            }

          }
    
    
          res.status(200).json();
        
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});


router.route('/fetchView').get(async (req, res) => {
  try {
   
    const data = await StockTransfer.findOne({
        where: {
          stock_id: req.query.id
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