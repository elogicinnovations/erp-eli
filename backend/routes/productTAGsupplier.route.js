const router = require('express').Router();
const { Op } = require('sequelize');
const sequelize = require('../db/config/sequelize.config');
const { ProductTAGSupplier, Product } = require("../db/models/associations"); 
// const ProductTAGSupplier = require('../db/models/productTAGsupplier.model');


router.route('/fetchTable').get(async (req, res) => {
    try {
      
      console.log(req.query.id)
      const data = await ProductTAGSupplier.findAll({
        where: {product_code: req.query.id}
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


router.route('/fetchProduct').get(async (req, res) => { // for fetching product that is tag to supplier (supplier module)
  try {
    // console.log(req.query.id)

    //  const data = await ProductTAGSupplier.findAll({
    //   include: {
    //     model: Product,
    //     required: true,
    //   },
    //   where: 
    //         {
    //           supplier_code: req.query.id
    //         }
    // });

    const data = await ProductTAGSupplier.findAll({
      where: { supplier_code: req.query.id },
      include: [{
        model: Product,
        required: true
        
      }]
    })


    // const data = await ProductTAGSupplier.findAll({
    //   where: {supplier_code: req.query.id}
    // });

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


router.route('/taggingSupplier').post(async (req, res) => {
  try {
    const productId = req.body.id;
    const selectedSupplier = req.body.selectedItem;

    // console.log(selectedSupplier);

    // Check if a record with the same product_code and supplier_code already exists
    const existingRecord = await ProductTAGSupplier.findOne({
      where: {
        product_code: productId,
        supplier_code: selectedSupplier.id,
      },
    });

    if (existingRecord) {
        // Record already exists, so skip insertion
        console.log('Record already exists');
        res.status(201).send('Record already exists');

        
      } else {
        // Record doesn't exist, so insert it
        const newProduct = await ProductTAGSupplier.create({
          product_code: productId,
          supplier_code: selectedSupplier.id,
        });
      
        console.log('Selected supplier saved successfully');
        res.status(200).json(newProduct); // Send the newly added product data in the response
      }

      // const newProduct = await ProductTAGSupplier.create({
      //   product_code: productId,
      //   supplier_code: selectedSupplier.id,
      // });
    
      // console.log('Selected supplier saved successfully');
      // res.status(200).json(newProduct); // Send the newly added product data in the response
    


  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});



router.route('/updatePrice').put(async (req, res) => {
    try {
      const id = req.body.table_id;
      const price = req.body.price;

      let finalPrice;

      if (price === ''){
        finalPrice = null
      }else{
        finalPrice = price
      }
      // console.log(updatemasterID)
  
      // Update the record in the table
      const [affectedRows] = await ProductTAGSupplier.update(
        {
          product_price: finalPrice,
        },
        {
          where: { id: id },
        }
      );

      res.status(200).json({ message: "Data updated successfully", affectedRows });
    
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });


  
router.route('/delete/:table_id').delete(async (req, res) => {
  const id = req.params.table_id;

  ProductTAGSupplier.destroy({
    where : {
      id: id
    }
  }).then(
      (del) => {
          if(del){
              res.json({success : true})
          }
          else{
              res.status(400).json({success : false})
          }
      }
  ).catch(
      (err) => {
          console.error(err)
          res.status(409)
      }
  );
});



module.exports = router;
