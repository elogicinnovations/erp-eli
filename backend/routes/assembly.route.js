const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const Assembly = require('../db/models/assembly.model')
const Supplier_Assembly = require('../db/models/supplier_assembly.model')
const Spare_Assembly = require('../db/models/spare_assembly.model')
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
    const data = await Assembly.findAll();

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
       const {code, name, supp, desc, spareParts} = req.body;
        // Check if the supplier code is already exists in the table
        const existingDataCode = await Assembly.findOne({
          where: {
            assembly_code: code,
          },
        });
    
        if (existingDataCode) {
          return res.status(201).send('Exist');
        } else {
          const spare_newData = await Assembly.create({
            assembly_code: code.toUpperCase(),
            assembly_name: name,
            assembly_desc: desc
          });

          const createdID = spare_newData.id;

          for (const supplier of supp) {
            const supplierValue = supplier.value;
    
            await Supplier_Assembly.create({
                assembly_id: createdID,
                supplier_code: supplierValue,
            });
          }

          for (const sparePart of spareParts) {
            const sparePartval = sparePart.value;

            // console.log('subpart id' + sparePartval)
    
            await Spare_Assembly.create({
                assembly_id: createdID,
                sparePart_id: sparePartval,
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
          await Assembly.destroy({
          where : {
            id: id
          }
        })
        .then(
            (del) => {
                if(del){


                  Supplier_Assembly.destroy({
                    where : {
                      assembly_id: id
                    }
                  })
                  .then(
                      (del) => {
                          if(del){
                              
                            
                            Spare_Assembly.destroy({
                              where : {
                                assembly_id: id
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