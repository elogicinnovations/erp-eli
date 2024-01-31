const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {SubPart, 
      Subpart_supplier, 
      Inventory_Subpart, 
      Subpart_image,
      Subpart_Price_History,
      IssuedSubpart} = require('../db/models/associations')
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
            category_code: slct_category,
            subPart_status: 'Active'
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

            await Subpart_Price_History.create({
                subpart_id: createdID,
                supplier_code: supplierValue,
                supplier_price: supplierPrices
            })

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
  

router.route("/update").post(
  async (req, res) => {
    const {id,
      prodcode,
      prodname,
      prodlocation,
      prodmeasurement,
      prodmanufacture,
      proddetails,
      prodthreshold,
      prodcategory,
      subpartTAGSuppliers,
      subpartImages
    } = req.body;
    try {
      const existingDataCode = await SubPart.findOne({
        where: {
          subPart_code: prodcode,
          id: { [Op.ne]: id },
        },
      });

      if (existingDataCode) {
        return res.status(201).send("Exist");
      } else {
        const subpart_newData = await SubPart.update(
          {
            subPart_code: prodcode,
            subPart_name: prodname,
            subPart_desc: proddetails,
            threshhold: prodthreshold,
            bin_id: prodlocation,
            subPart_unitMeasurement: prodmeasurement,
            subPart_Manufacturer: prodmanufacture,
            category_code: prodcategory,
          },
          {
            where: {
              id: id,
            },
          }
        );

        const deletesubImage = Subpart_image.destroy({
          where: {
            subpart_id: id
          }
        });

        if(deletesubImage){
          if (subpartImages && subpartImages.length > 0) {
            subpartImages.forEach(async (i) => {
              await Subpart_image.create({
                subpart_id: id,
                subpart_image: i.subpart_image
              });
            });
          }
        }

          const subsupprows = await Subpart_supplier.findAll({
            where: {
              subpart_id: id,
            },
          });
          
          if(subsupprows && subsupprows.length === 0) {
            console.log("No subpart id found");
            return res.status(201).json({ message: "No subpart supplier found" });
          }
          
          const ExistSuppId = subsupprows.map(supprow => supprow.id);

          await Inventory_Subpart.destroy({
            where: {
              subpart_tag_supp_id: ExistSuppId,
            },
          });

         const deletesupplier = await Subpart_supplier.destroy({
            where: {
              subpart_id: id,
            },
          });

          if(deletesupplier) {
            const selectedSuppliers = subpartTAGSuppliers;
              for(const supplier of selectedSuppliers) {
                const { value, price } = supplier;
        
                  const newSubpartsupp = await Subpart_supplier.create({
                    subpart_id: id,
                    supplier_code: value,
                    supplier_price: price,
                  });

                  const createdID = newSubpartsupp.id;

                  await Inventory_Subpart.create({
                    subpart_tag_supp_id: createdID,
                    quantity: 0,
                    price: price,
                  });

                  const ExistingSupplier = await Subpart_Price_History.findOne({
                    where: {
                      subpart_id: id,
                      supplier_code: value,
                    },
                    order: [['createdAt', 'DESC']],
                  });

                  if (!ExistingSupplier) {
                      await Subpart_Price_History.create({
                        subpart_id: id,
                        supplier_code: value,
                        supplier_price: price,
                      });
                  } else {
                    const existingPrice = ExistingSupplier.supplier_price;
                    
                    if (existingPrice !== price) {
                      await Subpart_Price_History.create({
                        subpart_id: id,
                        supplier_code: value,
                        supplier_price: price,
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


router.route('/statusupdate').put(async (req, res) => {
  try {
    const { subpartIDs, status } = req.body;

    const updateData = { subPart_status: status };

    if (status === 'Archive') {
      updateData.archive_date = new Date();
    }

    for (const subpartId of subpartIDs) {
      await SubPart.update(updateData, { where: { id: subpartId } });
    }

    res.status(200).json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


  

  router.route('/deleteOldArchivedSubParts').post(async (req, res) => {
    try {
      const currentDate = new Date();
      const currentManilaDate = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));

      const Subpartrows = await SubPart.findAll({
        where: {
          subPart_status: 'Archive',
        },
      });
  
      if (Subpartrows && Subpartrows.length === 0) {
        console.log("No subpart archive found");
        return res.status(201).json({ message: "No subpart archive found" });
      }
  
      for (let i = 0; i < Subpartrows.length; i++) {
        const archiveDate = new Date(Subpartrows[i].archive_date);
        // const nextDay = new Date(archiveDate);
        // nextDay.setDate(archiveDate.getDate() + 1);
        const newArchiveDate = new Date(archiveDate);
        newArchiveDate.setFullYear(newArchiveDate.getFullYear() + 1);
  
        const subPartId = Subpartrows[i].id;
  
        // Select subpart supplier
        const Subpartsupprows = await Subpart_supplier.findAll({
          where: {
            subpart_id: subPartId,
          },
        });
  
        if (Subpartsupprows && Subpartsupprows.length === 0) {
          console.log("No archive supplier found");
          continue;
        }
  
        const subpartsuppId = Subpartsupprows.map(supprow => supprow.id);
  
        // Select inventory subpart
        const Inventorysub = await Inventory_Subpart.findAll({
          where: {
            subpart_tag_supp_id: subpartsuppId,
          },
        });
  
        if (Inventorysub && Inventorysub.length === 0) {
          console.log("Inventory archive not found");
          continue;  
        }
  
        const InventoryId = Inventorysub.map(invrow => invrow.inventory_id);

        if(newArchiveDate <= currentDate){
          await IssuedSubpart.destroy({
            where: {
              inventory_Subpart_id: InventoryId,
            },
          });

          await Inventory_Subpart.destroy({
            where: {
              subpart_tag_supp_id: subpartsuppId,
            },
          });

          await SubPart.destroy({
            where: {
              subPart_status: 'Archive',
            }
          });
        }
      }
      
      res.status(200).json({ message: "Successfully deleted subpart archive" });
      // console.log("Delete archived successfully" + res);
  
    } catch (error) {
      console.error("Error Problem on delete archived subparts" + error);
    }
  });
  
  
  router.route('/lastCode').get(async (req, res) => {
    try {
      const latestPR = await SubPart.findOne({
        attributes: [[sequelize.fn('max', sequelize.col('subPart_code')), 'latestNumber']],
      });
      let latestNumber = latestPR.getDataValue('latestNumber');
  
      console.log('Latest Number:', latestNumber);
  
      // Increment the latestNumber by 1 for a new entry
      latestNumber = latestNumber !== null ? (parseInt(latestNumber, 10) + 1).toString() : '1';
  
      // Do not create a new entry, just return the incremented value
      return res.json(latestNumber.padStart(6, '0'));
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });
  
module.exports = router;