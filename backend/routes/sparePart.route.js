const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const { Supplier_SparePart, Supplier, SparePart } = require("../db/models/associations"); 
const SparePart = require('../db/models/sparePart.model')
const Supplier_SparePart = require('../db/models/supplier_sparePart.model')
const SubPart_SparePart = require('../db/models/subPart_sparePart.model')
const session = require('express-session')

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
    const data = await SparePart.findAll();

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

router.route('/create').post(async (req, res) => {
    try {
       const {code, name, supp, desc, SubParts} = req.body;
        // Check if the supplier code is already exists in the table
        const existingDataCode = await SparePart.findOne({
          where: {
            spareParts_code: code,
          },
        });
    
        if (existingDataCode) {
          res.status(201).send('Exist');
        } else {
          const spare_newData = await SparePart.create({
            spareParts_code: code.toUpperCase(),
            spareParts_name: name,
            spareParts_desc: desc
          });

          const createdID = spare_newData.id;


          for (const supplier of supp) {
            const supplierValue = supplier.value;
    
            await Supplier_SparePart.create({
                sparePart_id: createdID,
                supplier: supplierValue,
            });
          }

          for (const subPart of SubParts) {
            const subPartValue = subPart.value;

            console.log('subpart id' + subPartValue)
    
            await SubPart_SparePart.create({
                sparePart_id: createdID,
                subPart_code: subPartValue,
            });
          }
    
    
          res.status(200).json();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});

router.route('/delete/:table_id').delete(async (req, res) => {
    const id = req.params.table_id;
  
  
    // await Product.findAll({
    //   where: {
    //     product_manufacturer: id,
    //   },
    // })
    //   .then((check) => {
    //     if (check && check.length > 0) {
    //       res.status(202).json({ success: true });
    //     }
    //     else{
            await SparePart.destroy({
            where : {
              id: id
            }
          })
          .then(
              (del) => {
                  if(del){
                      res.status(200).json({success : true})
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
    //     }
    //   })
  });
  



module.exports = router;