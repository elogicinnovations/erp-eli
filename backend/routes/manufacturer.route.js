const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Manufacturer = require('../db/models/manufacturer.model');
const { Manufacturer, Product } = require("../db/models/associations"); 




router.route('/add').post(async (req, res) => {
  try {
    // Check if the supplier code is already exists in the table
    const existingDataCode = await Manufacturer.findAll({
      where: {
        [Op.or]: [
          { manufacturer_code: { [Op.eq]: req.body.codeManu } },
          { manufacturer_name: { [Op.eq]: req.body.nameManufacturer } },
        ],
      },
    });

    if (existingDataCode.length > 0) {
      res.status(201).send('Exist');
    } else {
      // Generate the next available code
      const nextCode = await generateNextCode();

      const newData = await Manufacturer.create({
        manufacturer_code: nextCode,
        manufacturer_name: req.body.nameManufacturer,
        manufacturer_remarks: req.body.descriptManufacturer,
      });

      res.status(200).json(newData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

// Function to generate the next available code
const generateNextCode = async () => {
  try {
    const latestManufacturer = await Manufacturer.findOne({
      order: [['manufacturer_code', 'DESC']],
    });

    if (latestManufacturer) {
      const latestCode = latestManufacturer.manufacturer_code;
      const codeNumber = parseInt(latestCode.substring(1)) + 1;
      return `M${codeNumber.toString().padStart(5, '0')}`;
    } else {
      // If no existing data, start with M00001
      return 'M00001';
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

router.route('/nextcode').get(async (req, res) => {
  try {
    // Implement the logic to generate the next available code
    const nextCode = await generateNextCode();
    res.status(200).json({ nextCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});



router.route('/update/:param_id').put(async (req, res) => {
  try {
    const name = req.body.manufacturer_name;
    const updatemasterID = req.params.param_id;
    // console.log(updatemasterID)

    // Check if the email already exists in the table for other records
    const existingData = await Manufacturer.findOne({
      where: {
        manufacturer_name: name,
        manufacturer_code: { [Op.ne]: updatemasterID }, // Exclude the current record
      },
    });

    if (existingData) {
      res.status(202).send('Exist');
    } else {

      // Update the record in the table
      const [affectedRows] = await Manufacturer.update(
        {
          manufacturer_name: req.body.manufacturer_name,
          manufacturer_remarks: req.body.manufacturer_remarks,
        },
        {
          where: { manufacturer_code: updatemasterID },
        }
      );

      res.status(200).json({ message: "Data updated successfully", affectedRows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});




router.route('/retrieve').get(async (req, res) => {
    try {
      const data = await Manufacturer.findAll();
  
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



  
router.route('/delete/:table_id').delete(async (req, res) => {
  const id = req.params.table_id;


  await Product.findAll({
    where: {
      product_manufacturer: id,
    },
  })
    .then((check) => {
      if (check && check.length > 0) {
        res.status(202).json({ success: true });
      }
      else{
         Manufacturer.destroy({
          where : {
            manufacturer_code: id
          }
        })
        .then(
            (del) => {
                if(del){
                    res.json({success : true})
                }
                else{
                    res.status(400).json({success : false})
                }
            }
        )
        .catch(
            (err) => {
                console.error(err)
                res.status(409)
            }
        );
      }
    })
});



module.exports = router;