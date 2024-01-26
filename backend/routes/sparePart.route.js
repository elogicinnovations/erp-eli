const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { SparePart_Supplier, 
        SparePart_SubPart, 
        SparePart, 
        Inventory_Spare, 
        SparePartPrice_history, 
        SparePart_image,
        IssuedSpare} = require("../db/models/associations"); 
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
       const {code, 
              name, 
              supp, 
              desc, 
              SubParts, 
              SpareaddPriceInput, 
              slct_binLocation, 
              slct_manufacturer, 
              thresholds, 
              unitMeasurement,
              images} = req.body;

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
            spareParts_location: slct_binLocation,
            spareParts_manufacturer: slct_manufacturer,
            threshhold: threshholdValue,
            spareParts_unitMeasurement: unitMeasurement,
            spareParts_status: 'Active'
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

            await SparePartPrice_history.create({
              sparePart_id: createdID,
              supplier_code: supplierValue,
              supplier_price: supplierPrices
            })

            
            await Inventory_Spare.create({
              spare_tag_supp_id: SupplierSpare_ID.id,
              quantity: 0,
              price: supplierPrices
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
    
          if(images.length > 0){
            images.forEach(async (i) => {
              await SparePart_image.create({
                sparepart_id: createdID,
                sparepart_image: i.base64Data
              })
            });
          }

          return res.status(200).json();
        }
      } catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred');
      }
});

router.route("/update").post(
  async (req, res) => {
    const { sparepartimage, 
            id, 
            code, 
            name, 
            desc, 
            unit, 
            slct_binLocation, 
            unitMeasurement, 
            slct_manufacturer, 
            thresholds,
            SubParts,
            addPriceInput, } = req.body;

    try {
      const existingDataCode = await SparePart.findOne({
        where: {
          spareParts_code: code,
          id: { [Op.ne]: id },
        },
      });

      if (existingDataCode) {
        res.status(201).send('Exist');
      } else {
        let finalThreshold;
        if (thresholds === "") {
          finalThreshold = 0;
        } else {
          finalThreshold = thresholds;
        }

        const Spare_newData = await SparePart.update(
          {
            spareParts_code: code,
            spareParts_name: name,
            spareParts_desc: desc,
            spareParts_unit: unit,
            spareParts_location: slct_binLocation,
            spareParts_unitMeasurement: unitMeasurement,
            spareParts_manufacturer: slct_manufacturer,
            threshhold: finalThreshold,
          },
          {
            where: {
              id: id,
            },
          }
        );

        const deletespareImage = SparePart_image.destroy({
          where: {
            sparepart_id: id
          },
        });

        if(deletespareImage){
          if (sparepartimage && sparepartimage.length > 0) {
            sparepartimage.forEach(async (i) => {
              await SparePart_image.create({
                sparepart_id: id,
                sparepart_image: i.sparepart_image
              });
            });
          }
        }

        const deletesubpart = SparePart_SubPart.destroy({
            where: {
              sparePart_id: id
            },
        });

        if(deletesubpart) {
          const selectedSubpart = SubParts;
          for(const subpartDropdown of selectedSubpart) {
            const subpartValue = subpartDropdown.value;
            await SparePart_SubPart.create({
              sparePart_id: id,
              subPart_id: subpartValue
            });
          }
        }

        const deletesupplier = SparePart_Supplier.destroy({
          where: {
            sparePart_id: id
          }
        });

        if(deletesupplier) {
          const selectedSupplier = addPriceInput;
          for(const supplier of selectedSupplier) {
            const { value, price } = supplier;

            const existingPrice = await SparePart_Supplier.findOne({
              sparePart_id: id,
              supplier_code: value,
            })

            await SparePart_Supplier.create({
              sparePart_id: id,
              supplier_code: value,
              supplier_price: price
             });

             if (existingPrice && existingPrice.supplier_price === price) {
              continue;
            }

            if (existingPrice && existingPrice.supplier_price !== price) {
             await SparePartPrice_history.create({
              sparePart_id: id,
              supplier_code: value,
              supplier_price: price
             });
            }
          }
        }

        res.status(200).json();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    }
  }
);



// router.route('/delete/:table_id').delete(async (req, res) => {
//     const id = req.params.table_id;
//             await SparePart.destroy({
//             where : {
//               id: id
//             },
//           })
//         .then(() => {
//             SparePart_Supplier.destroy({
//               where : {
//                 sparePart_id: id
//               }
//             })
//             .then(() => {
              
//                   SparePart_SubPart.destroy({
//                     where : {
//                       sparePart_id: id
//                     }
//                   })
//                   .then(() => {
//                     return res.status(200).json({success : true})
//                   })
//                   .catch((err) => {
//                     console.error(err)
//                     res.status(409)
//                   });
             
//               }
//             )
//             .catch(
//                 (err) => {
//                     console.error(err)
//                     res.status(409)
//                 }
//             );
//         })
//         .catch(
//             (err) => {
//                 console.error(err)
//                 res.status(409)
//             }
//         );
//   });
  

router.route('/deleteOldArchivedSpare').post(async (req, res) => {
  try {
    const currentDate = new Date();
    const currentManilaDate = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));

    const Sparerows = await SparePart.findAll({
      where: {
        spareParts_status: 'Archive',
      },
    });

    if (Sparerows && Sparerows.length === 0) {
      console.log("No spare archive found");
      return res.status(201).json({ message: "No spare archive found" });
    }

    for (let i = 0; i < Sparerows.length; i++) {
      const archiveDate = new Date(Sparerows[i].archive_date);
      // const nextDay = new Date(archiveDate);
      // nextDay.setDate(archiveDate.getDate() + 1);
      const newArchiveDate = new Date(archiveDate);
      newArchiveDate.setFullYear(newArchiveDate.getFullYear() + 1);

      const spareId = Sparerows[i].id;

      // Select spare supplier
      const Sparesupprows = await SparePart_Supplier.findAll({
        where: {
          sparePart_id: spareId,
        },
      });

      if (Sparesupprows && Sparesupprows.length === 0) {
        console.log( "No archive spare supplier found");
        continue;
      }

      const SparesuppId = Sparesupprows.map(supprow => supprow.id);

      //Select inventory spare
      const Inventoryspare = await Inventory_Spare.findAll({
        where: {
          spare_tag_supp_id: SparesuppId,
        },
      });

      if (Inventoryspare && Inventoryspare.length === 0) {
        console.log("No archive Inventory spare found");
        continue;
      }

      const InventoryId = Inventoryspare.map(invrow => invrow.inventory_id);

      if(newArchiveDate <= currentDate) {
        await IssuedSpare.destroy({
          where: {
            inventory_Spare_id: InventoryId,
          },
        });

        await Inventory_Spare.destroy({
          where: {
            spare_tag_supp_id: SparesuppId,
          },
        });

        await SparePart.destroy({
          where: {
            spareParts_status: 'Archive',
          }
        });
      }
    }
    
    res.status(200).json({ message: "Successfully deleted spare archive" });
    // console.log("Delete archived successfully" + res);

  } catch (error) {
    console.error("Error Problem on delete archived spare" + error);
  }
}); 

  router.route('/statusupdate').put(async (req, res) => {
    try {
      const { sparePartIds, status } = req.body;
  
      const updateData = { spareParts_status: status };

      if (status === 'Archive') {
        updateData.archive_date = new Date();
      }  

      for (const sparePartId of sparePartIds) {
        await SparePart.update(updateData, { where: { id: sparePartId } });
      }
  
      res.status(200).json({ message: 'Products updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


module.exports = router;
