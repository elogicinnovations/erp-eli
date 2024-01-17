const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  Assembly_Supplier,
  Assembly,
  Assembly_SparePart,
  Assembly_SubPart,
  Inventory_Assembly,
  AssemblyPrice_History,
  Assembly_image
} = require("../db/models/associations");

const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/fetchTable").get(async (req, res) => {
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

router.route("/fetchTableEdit").get(async (req, res) => {
  try {
    //   const data = await MasterList.findAll({
    //     include: {
    //       model: UserRole,
    //       required: false,
    //     },
    //   });
    const data = await Assembly.findAll({
      where: {
        id: req.query.id,
      },
      include: [
        {
          model: Assembly_image,
          required: false
        }
      ],
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

router.route("/create").post(async (req, res) => {
  try {
    const { 
      code, 
      name, 
      desc, 
      spareParts, 
      addPriceInput, 
      subparting,  
      slct_binLocation, 
      slct_manufacturer, 
      thresholds, 
      unitMeasurement,
      slct_category,
      images
      } =
      req.body;
    // Check if the supplier code is already exists in the table
    console.log(code);
    const existingDataCode = await Assembly.findOne({
      where: {
        assembly_code: code,
      },
    });

    if (existingDataCode) {
      return res.status(201).send("Exist");
    } else {
      const threshholdValue = thresholds === "" ? "0" : thresholds;
      const spare_newData = await Assembly.create({
        assembly_code: code.toUpperCase(),
        assembly_name: name,
        assembly_desc: desc,
        bin_id: slct_binLocation,
        assembly_manufacturer: slct_manufacturer,
        threshhold: threshholdValue,
        assembly_unitMeasurement: unitMeasurement,
        category_code: slct_category,
        assembly_status: 'Active'
      });

      const createdID = spare_newData.id;

      for (const supplier of addPriceInput) {
        const supplierValue = supplier.code;
        const supplierPrice = supplier.price;

        const SupplierAssembly_ID = await Assembly_Supplier.create({
          assembly_id: createdID,
          supplier_code: supplierValue,
          supplier_price: supplierPrice,
        });

        await AssemblyPrice_History.create({
          assembly_id: createdID,
          supplier_code: supplierValue,
          supplier_price: supplierPrice,
        })

        await Inventory_Assembly.create({
          assembly_tag_supp_id: SupplierAssembly_ID.id,
          quantity: 0,
          price: supplierPrice,
        });
      }

      for (const sparePart of spareParts) {
        const sparePartval = sparePart.value;

        await Assembly_SparePart.create({
          assembly_id: createdID,
          sparePart_id: sparePartval,
        });
      }

      for (const subPart of subparting) {
        const subparting = subPart.value;

        await Assembly_SubPart.create({
          assembly_id: createdID,
          subPart_id: subparting,
        });
      }

      if(images.length > 0){
        images.forEach(async (i) => {
          await Assembly_image.create({
            assembly_id : createdID,
            assembly_image : i.base64Data
          })
        });
      }
      res.status(200).json();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});


router.route("/update").post(
  async (req, res) => {
    const { id,
            code,
            name,
            desc,
            spareParts,
            Subparts,
            unitMeasurement,
            slct_manufacturer,
            slct_binLocation,
            thresholds,
            addPriceInput,
            assemblyimage, } = req.body;

    try {
      const existingDataCode = await Assembly.findOne({
        where: {
          assembly_code: code,
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

        const AssemblyNew_Data = await Assembly.update(
          {
            assembly_code: code,
            assembly_name: name,
            assembly_desc: desc,
            bin_id: slct_binLocation,
            assembly_unitMeasurement: unitMeasurement,
            assembly_manufacturer: slct_manufacturer,
            threshhold: finalThreshold,
          },
          {
            where: {
              id: id,
            },
          }
        );

        const deleteAssemblyImage = Assembly_image.destroy({
          where: {
            assembly_id: id
          },
        });

        if(deleteAssemblyImage){
          if (assemblyimage && assemblyimage.length > 0) {
            assemblyimage.forEach(async (i) => {
              await Assembly_image.create({
                assembly_id: id,
                assembly_image: i.assembly_image
              });
            });
          }
        }

        const deletesparepart = Assembly_SparePart.destroy({
            where: {
              assembly_id: id
            },
        });

        if(deletesparepart) {
          const selectedSparepart = spareParts;
          for(const spareDropdown of selectedSparepart) {
            const spareValue = spareDropdown.value;
            await Assembly_SparePart.create({
              assembly_id: id,
              sparePart_id: spareValue
            });
          }
        }

        const deletesubpart = Assembly_SubPart.destroy({
          where: {
            assembly_id: id
          },
        });

        if(deletesubpart) {
          const selectedSubpart = Subparts;
          for(const subpartDropdown of selectedSubpart) {
            const subpartValue = subpartDropdown.value;
            await Assembly_SubPart.create({
              assembly_id: id,
              subPart_id: subpartValue
            });
          }
        }

        const deletesupplier = Assembly_Supplier.destroy({
          where: {
            assembly_id: id
          }
        });

        if(deletesupplier) {
          const selectedSupplier = addPriceInput;
          for(const supplier of selectedSupplier) {
            const { value, price } = supplier;

            await Assembly_Supplier.create({
              assembly_id: id,
              supplier_code: value,
              supplier_price: price
             });

             await AssemblyPrice_History.create({
              assembly_id: id,
              supplier_code: value,
              supplier_price: price
             });
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


router.route("/delete/:table_id").delete(async (req, res) => {
  const id = req.params.table_id;

  await Assembly.destroy({
    where: {
      id: id,
    },
  })
    .then((del) => {
      Assembly_Supplier.destroy({
        where: {
          assembly_id: id,
        },
      })
        .then((del) => {
          if (del) {
            Assembly_SparePart.destroy({
              where: {
                assembly_id: id,
              },
            })
              .then((del) => {
                res.status(200).json({ success: true });
                //    if (del) {
                //      return res.status(200).json({ success: true });
                //    } else {
                //      res.status(400).json({ success: false });
                //    }
              })
              .catch((err) => {
                console.error(err);
                res.status(409);
              });
          } else {
            res.status(200).json({ success: false });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(409);
        });
      //   if (del) {

      //   } else {
      //     res.status(400).json({ success: false });
      //   }
    })
    .catch((err) => {
      console.error(err);
      res.status(409);
    });
  //     }
  //   })
});


router.route('/statusupdate').put(async (req, res) => {
  try {
    const { assemblyIds, status } = req.body;

    for (const assemblyId of assemblyIds) {
      await Assembly.update(
        { assembly_status: status },
        { where: { id: assemblyId } }
      );
    }

    res.status(200).json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
