const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const Product = require('../db/models/product.model')
const session = require('express-session')
const multer = require('multer'); // Import multer


// const storage = multer.memoryStorage();
// const uploader = multer({ storage });
const mime = require('mime-types');
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
      attributes: ['product_code', 'product_name', 'product_unitMeasurement', 'createdAt', 'updatedAt']
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
            product_code: req.query.id,
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
        
        // Check if the supplier code is already exists in the table
        const existingDataCode = await Product.findOne({
          where: {
            // product_code: req.body.binLocationName, //dapat ma generate pag meron na assembly at parts
            product_name: req.body.name,
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
          });
    
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
          product_name: req.body.name,
          product_code: { [Op.ne]: req.body.id },
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
            where: { product_code: req.body.id },
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

  Product.destroy({
    where : {
      product_code: id
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