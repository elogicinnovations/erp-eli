// const router = require('express').Router()
// const {where, Op} = require('sequelize')
// const sequelize = require('../db/config/sequelize.config');
// const ProductTAGSupplier = require('../db/models/productTAGsupplier.model');
// // const { Manufacturer, Product } = require("../db/models/associations"); 


// router.route('/taggingSupplier').post(async (req, res) => {
//     try {
//       const productId = req.body.id;
//       const selectedSupplier = req.body.selectedItem;
  
    
//       // Save the selected supplier to the database
//       await ProductTAGSupplier.create({
//         product_code: productId, // Use the appropriate field name in your model
//         supplier_code: selectedSupplier.id, // Use the appropriate field name in your model
//       });
  
//     //   console.log(productId);
//     //   console.log(selectedSupplier.id);
  
//       res.status(200).send('Selected supplier saved successfully');
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('An error occurred');
//     }
//   });






// module.exports = router;



const router = require('express').Router();
const { Op } = require('sequelize');
const sequelize = require('../db/config/sequelize.config');
const ProductTAGSupplier = require('../db/models/productTAGsupplier.model');

router.route('/taggingSupplier').post(async (req, res) => {
  try {
    const productId = req.body.id;
    const selectedSupplier = req.body.selectedItem;

    console.log(selectedSupplier);

    // Check if a record with the same product_code and supplier_code already exists
    const existingRecord = await ProductTAGSupplier.findOrCreate({
      where: {
        product_code: productId,
        supplier_code: selectedSupplier.id,
      },
    });

    if (existingRecord) {
      // Record with the same data already exists, so skip insertion
      console.log('Record already exists');
      res.status(200).send('Record already exists');
    } else {
      // Record doesn't exist, so insert it
      await ProductTAGSupplier.create({
        product_code: productId,
        supplier_code: selectedSupplier.id,
      });
      console.log('Selected supplier saved successfully');
      res.status(200).send('Selected supplier saved successfully');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
