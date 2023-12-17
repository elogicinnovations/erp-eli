const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { SparePart_Supplier, SparePart_SubPart, SparePart, Inventory_Spare } = require("../db/models/associations"); 
// const SparePart = require('../db/models/sparePart.model')
// const Supplier_SparePart = require('../db/models/sparePart_supplier..model')
// const SubPart_SparePart = require('../db/models/sparePart_subPart.model')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route('/fetchTableEdit').get(async (req, res) => {
  try {
    
    const data = await SparePart.findAll({
      where: {
        id: req.query.id,
    },
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
       const {code, name, supp, desc, SubParts, SpareaddPriceInput, unit, slct_binLocation, slct_manufacturer, thresholds, unitMeasurement} = req.body;

        // Check if the supplier code is already exists in the table
        console.log(code);
        const existingDataCode = await SparePart.findOne({
          where: {
            spareParts_code: code,
          },
        });
    
        if (existingDataCode) {
          return res.status(201).send('Exist');
        } else {
          const threshholdValue = thresholds === '' ? "0" : thresholds; 
          const spare_newData = await SparePart.create({
            spareParts_code: code.toUpperCase(),
            spareParts_name: name,
            spareParts_desc: desc,
            spareParts_unit: unit,
            spareParts_unit: unit,
            spareParts_location: slct_binLocation,
            spareParts_manufacturer: slct_manufacturer,
            threshhold: threshholdValue,
            spareParts_unitMeasurement: unitMeasurement
          });

          const createdID = spare_newData.id;

          for (const supplier of SpareaddPriceInput) {
            const supplierValue = supplier.code;
            const supplierPrices = supplier.price;
    
            const SupplierSpare_ID = await SparePart_Supplier.create({
                sparePart_id: createdID,
                supplier_code: supplierValue,
                supplier_price: supplierPrices
            });

            
            await Inventory_Spare.create({
              spare_tag_supp_id: SupplierSpare_ID.id,
              quantity: 0
            });
          }

          if(Array.isArray(SubParts)){
          for (const subPart of SubParts) {
            const subPartValue = subPart.value;

            console.log('subpart id' + subPartValue)
    
            await SparePart_SubPart.create({
                sparePart_id: createdID,
                subPart_id: subPartValue,
            });
          }
          }
    
          return res.status(200).json();
        }
      } catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred');
      }
});


router.route('/update').put(async (req, res) => {
  try {
    const {id, code, name, supp, desc, SubParts, addPriceInput, unit, slct_binLocation, unitMeasurement, slct_manufacturer, thresholds} = req.body;
    // Check if the email already exists in the table for other records
    const existingData = await SparePart.findOne({
      where: {
        spareParts_code: code,
        id: { [Op.ne]: id }, // Exclude the current record
      },
    });

    if (existingData) {
      res.status(201).send('Exist');
    } else {

      const threshholdValue = thresholds === '' ? "0" : thresholds; 
      // Update the record in the table
      const affectedRows = await SparePart.update(
        {
          spareParts_code: code ? code.toUpperCase() : null,
          spareParts_name: name,
          spareParts_desc: desc,
          spareParts_unit: unit,
          spareParts_location: slct_binLocation,
          spareParts_unitMeasurement: unitMeasurement,
          spareParts_manufacturer: slct_manufacturer,
          threshhold: threshholdValue
        },
        {
          where: { id: id },
        }
      );

      if(affectedRows){
        const deletesubpart  = SparePart_SubPart.destroy({
          where : {
            sparePart_id: id
          }
        })
        if(deletesubpart){

          if(Array.isArray(SubParts)){
            for (const subPart of SubParts) {
            const subPartValue = subPart.value;
  
              console.log('subpart value: ' + subPartValue)
          
              await SparePart_SubPart.create({
                  sparePart_id: id,
                subPart_id: subPartValue,
              });
        }
          }
      }

        const deletesupp  = SparePart_Supplier.destroy({
          where : {
            sparePart_id: id
          }
        })
        if(deletesupp){
          for (const supplier of addPriceInput) {
            const supplierValue = supplier.code;
            const supplierPrice = supplier.price;
    
            await SparePart_Supplier.create({
                sparePart_id: id,
                supplier_code: supplierValue,
                supplier_price: supplierPrice
            });
          }
  
        }

      }

      // for (const supplier of req.query.supp) {
      //   const supplierValue = supplier.value;

      //   console.log(supplierValue)
      //   await SparePart_Supplier.bulkCreate({
      //       supplier: supplierValue,
      //   },
      //   {
      //     where: { sparePart_id: req.query.id },
      //   }
      //   );
      // }

      // for (const subPart of req.query.SubParts) {
      //   const subPartValue = subPart.value;

      //   console.log('subpart id' + subPartValue)

      //   await SparePart_SubPart.bulkCreate({
      //       subPart_code: subPartValue,
      //   },
      //   {
      //     where: { sparePart_id: req.query.id },
      //   }
      //   );
      // }

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


                    SparePart_Supplier.destroy({
                      where : {
                        sparePart_id: id
                      }
                    })
                    .then(
                        (del) => {
                            if(del){
                                
                              
                              SparePart_SubPart.destroy({
                                where : {
                                  sparePart_id: id
                                }
                              })
                              .then(
                                  (del) => {
                                      if(del){
                                          return res.status(200).json({success : true})
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
