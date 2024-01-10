const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {SubPart, Subpart_supplier, Inventory_Subpart, BinLocation, Category, Manufacturer, Subpart_image} = require('../db/models/associations')
const session = require('express-session')
const multer = require('multer');
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
      const data = await SubPart.findAll({
        include: {
          model: Subpart_image,
          required: false
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

  router.route('/fetchsubpartEdit').get(async (req, res) => {
    try {
      const data = await SubPart.findAll({
        where: {
          id: req.query.id,
        },
        include : {
          model: Subpart_image,
          required: false
        }
      });
  
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

  router.route('/createsubpart').post(async (req, res) => {
    try {
       const {code, 
              subpartName, 
              details, 
              SubaddPriceInput, 
              slct_binLocation,
              unitMeasurement,
              slct_manufacturer,
              thresholds,
              slct_category,
              images
            } = req.body;
        // Check if the supplier code is already exists in the table
        console.log(slct_binLocation);
        const existingSubCode = await SubPart.findOne({
          where: {
            subPart_code: code,
          },
        });
    
        if (existingSubCode) {
          return res.status(201).send('Exist');
        } else {
          const subpart_newData = await SubPart.create({
            subPart_code: code.toUpperCase(),
            subPart_name: subpartName,
            subPart_desc: details,
            threshhold: thresholds,
            bin_id: slct_binLocation,
            subPart_unitMeasurement: unitMeasurement,
            subPart_Manufacturer: slct_manufacturer,
            category_code: slct_category
          });

          const createdID = subpart_newData.id;

          for (const supplier of SubaddPriceInput) {
            const supplierValue = supplier.code;
            const supplierPrices = supplier.price;
    
            const SupplierSubpart_ID = await Subpart_supplier.create({
                subpart_id: createdID,
                supplier_code: supplierValue,
                supplier_price: supplierPrices
            });
            await Inventory_Subpart.create({
              subpart_tag_supp_id: SupplierSubpart_ID.id,
              quantity: 0,
              price: supplierPrices
            });
          }

          if(images.length > 0){
            images.forEach(async (i) => {
              await Subpart_image.create({
                subpart_id: createdID,
                subpart_image: i.base64Data
              })
            });
          }

          res.status(200).json();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});
  


// router.route('/update').put(  
//   async (req, res) => {
//   try {
//       const existingDataCode = await SubPart.findOne({
//         where: {
//           id: { [Op.ne]: req.body.id},
//         },
//       });
//       console.log(req.body)
//       if (!existingDataCode) {
//         res.status(201).send("Not Exist");
//       } else {
//           const newData = await SubPart.update(
//         {
//           subPart_code: req.body.prodcode,
//           subPart_name: req.body.prodname,
//           subPart_desc: req.body.proddetails,
//           threshhold: req.body.prodthreshold,
//           subPart_unit: req.body.produnit,
//           bin_id: req.body.prodlocation,
//           subPart_unitMeasurement: req.body.prodmeasurement,
//           subPart_Manufacturer: req.body.prodmanufacture,
//           category_code: req.body.prodcategory
//         },
//           {
//             where: { id: req.body.id },
//           }
//         );

//         if(newData){
//           const deletesupplier = Subpart_supplier.destroy({
//             where: {
//               subpart_id: req.body.id
//             },
//           });

//           if(deletesupplier){
//             const selectedSuppliers = JSON.parse(req.body.subTAGSuppliers);
//             console.log(selectedSuppliers)
//             for (const supplier of selectedSuppliers) {
//               const { value, price } = supplier;
//               await Subpart_supplier.create({
//                 subpart_id: req.body.id,
//                 supplier_code: value,
//                 supplier_price: price
//                });
//              }
//           }
//         }
  
//         res.status(200).json(newData);
//         // console.log(newDa)
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("An error occurred");
//     }
//   }
// );


router.route("/update").post(async (req, res) => {
  try {
    console.log(req.query.id);
    const existingDataCode = await SubPart.findOne({
      where: {
        subPart_code: req.query.prodcode,
        id: { [Op.ne]: req.query.id },
      },
    });

    if (existingDataCode) {
      return res.status(201).send("Exist");
    } else {
      const subpart_newData = await SubPart.update(
        {
          subPart_code: req.query.prodcode,
          subPart_name: req.query.prodname,
          subPart_desc: req.query.proddetails,
          threshhold: req.query.prodthreshold,
          bin_id: req.query.prodlocation,
          subPart_unitMeasurement: req.query.prodmeasurement,
          subPart_Manufacturer: req.query.prodmanufacture,
          category_code: req.query.prodcategory
        },
        {
          where: {
            id: req.query.id,
          },
        }
      );

      if (subpart_newData) {
        const deletesupplier = Subpart_supplier.destroy({
          where: {
            subpart_id: req.query.id
          },
        });

        if(deletesupplier !== null || deletesupplier !== undefined){
          const selectedSuppliers = req.query.subpartTAGSuppliers;
          if (selectedSuppliers && typeof selectedSuppliers[Symbol.iterator] === 'function') {
          for (const supplier of selectedSuppliers) {
            const { value, price } = supplier;
            await Subpart_supplier.create({
              subpart_id: req.query.id,
              supplier_code: value,
              supplier_price: price
             });
           }
          }
        }
      }

      res.status(200).json();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});  
  
  router.route('/delete/:subPartId').delete(async (req, res) => {
    const subPartId = req.params.subPartId;
  
    try {
      // Delete the SubPart record
      const deletedRows = await SubPart.destroy({
        where: {
          id: subPartId,
        },
      });
  
      if (deletedRows > 0) {
        return res.json({ success: true, message: 'SubPart record deleted successfully' });
      } else {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'An error occurred' });
    }
  });
  
  

module.exports = router;