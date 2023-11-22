const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Product = require('../db/models/product.model')
const { ProductTAGSupplier, Product, Inventory } = require("../db/models/associations"); 
const session = require('express-session')
const multer = require('multer'); // Import multer


// const storage = multer.memoryStorage();
// const uploader = multer({ storage });
const mime = require('mime-types');
// const productTAGsupplier = require('../db/models/productTAGsupplier.model');
// Create a multer instance to handle file uploads
const upload = multer();

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));



router.route('/fetchTable').get(async (req, res) => {
  try {
  //   const data = await MasterList.findAll({
  //     include: {
  //       model: UserRole,
  //       required: false,
  //     },
  //   });
    const data = await Product.findAll({
      attributes: ['product_id', 'product_code', 'product_name', 'product_unitMeasurement', 'createdAt', 'updatedAt']
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



router.route('/fetchTableEdit').get(async (req, res) => {
 
  // const suppCode = req.query.id; // Access query parameter using req.query
  //  console.log('pasok: ' + req.query.id)

    try {
        const data = await Product.findAll({
        where: {
            product_id: req.query.id,
        },
        });

        if (!data) {
        // No record found
        return res.status(404).json();
        
        }
        // console.log(data)
        return res.json(data);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});






router.route('/create').post(
    upload.fields([
        { name: 'selectedimage', maxCount: 1 },
      ]),
    
    async (req, res) => {
    try {

      let finalThreshold;


      if (req.body.thresholds === ''){
        finalThreshold = 0;
      }else{
        finalThreshold = req.body.thresholds;
      }
        
        // Check if the supplier code is already exists in the table
        const existingDataCode = await Product.findOne({
          where: {
            product_code: req.body.code, 
            // product_name: req.body.name,
          },
        });
    
        if (existingDataCode) {
          res.status(201).send('Exist');
        } else {


            let image_blob, image_blobFiletype;


            // image_blob = req.files.selectedimage[0].buffer;

            // image_blobFiletype = mime.lookup(req.files.selectedimage[0].originalname);

            if (req.files.selectedimage) {
                image_blob = req.files.selectedimage[0].buffer;

                image_blobFiletype = mime.lookup(req.files.selectedimage[0].originalname);

            }
            else{
                image_blob = null;

                image_blobFiletype = null;
            }

            const newData = await Product.create({
            product_code: req.body.code,
            product_name: req.body.name,
            product_category: req.body.slct_category,
            product_unit: req.body.unit,
            product_location: req.body.slct_binLocation,
            product_unitMeasurement: req.body.unitMeasurement,
            product_manufacturer: req.body.slct_manufacturer,
            product_details: req.body.details,
            product_threshold: finalThreshold,
            product_image: image_blob,
            product_imageType: image_blobFiletype
          });


          //para automatic insert if mag insert ng product
          // const generated_product_id = newData.product_id;

          // await Inventory.create({
          //   product_id: generated_product_id,
          //   quantity: 0
          // })


    
          res.status(200).json(newData);
          // console.log(newDa)
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});

router.route('/update').put(
  upload.fields([
      { name: 'selectedimage', maxCount: 1 },
    ]),
  
  async (req, res) => {
  try {
      
      // Check if the supplier code is already exists in the table
      const existingDataCode = await Product.findOne({
        where: {
          // product_code: req.body.binLocationName, //dapat ma generate pag meron na assembly at parts
          product_code: req.body.code,
          product_cid: { [Op.ne]: req.body.id },
        },
      });
  
      if (existingDataCode) {
        res.status(201).send('Exist');
      } else {


          let image_blob, image_blobFiletype;


          // image_blob = req.files.selectedimage[0].buffer;

          // image_blobFiletype = mime.lookup(req.files.selectedimage[0].originalname);

          if (req.files.selectedimage) {
              image_blob = req.files.selectedimage[0].buffer;

              image_blobFiletype = mime.lookup(req.files.selectedimage[0].originalname);

          }
          else{
              image_blob = null;

              image_blobFiletype = null;
          }

          const newData = await Product.update({
          product_name: req.body.name,
          product_category: req.body.slct_category,
          product_unit: req.body.unit,
          product_location: req.body.slct_binLocation,
          product_unitMeasurement: req.body.unitMeasurement,
          product_manufacturer: req.body.slct_manufacturer,
          product_details: req.body.details,
          product_threshold: req.body.thresholds,
          product_image: image_blob,
          product_imageType: image_blobFiletype
        },
          {
            where: { product_id: req.body.id },
          }
        )
        ;
  
        res.status(200).json(newData);
        // console.log(newDa)
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
});




router.route('/delete/:table_id').delete(async (req, res) => {
  const id = req.params.table_id;



  // await ProductTAGSupplier.findAll({
  //   where: {
  //     product_id: id,
  //   },
  // })
  //   .then((check) => {
  //     if (check && check.length > 0) {
  //       res.status(202).json({ success: true });
  //     }

  //     else{
  //       Product.destroy({
  //         where : {
  //           product_id: id
  //         }
  //       }).then(
  //           (del) => {
  //               if(del){
  //                   res.json({success : true})
  //               }
  //               else{
  //                   res.status(400).json({success : false})
  //               }
  //           }
  //       ).catch(
  //           (err) => {
  //               console.error(err)
  //               res.status(409)
  //           }
  //       );
  //     }
  //   })

  Product.destroy({
    where : {
      product_id: id
    }
  }).then(
      (del) => {
          if(del){



            ProductTAGSupplier.destroy({
              where : {
                product_id: id
              }
            }).then(
                (deleted) => {
                    if(deleted){
                      Inventory.destroy({
                        where : {
                          product_id: id
                        }
                      }).then(
                          (deletedInventory) => {
                              if(deletedInventory){
                                  res.status(200).json({success : true})
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