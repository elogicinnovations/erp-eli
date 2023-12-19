const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  Assembly_Supplier,
  Assembly,
  Assembly_SparePart,
  Assembly_SubPart,
  Inventory_Assembly,
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
      unit, 
      slct_binLocation, 
      slct_manufacturer, 
      thresholds, 
      unitMeasurement,
      slct_category} =
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
        assembly_unit: unit,
        bin_id: slct_binLocation,
        assembly_manufacturer: slct_manufacturer,
        threshhold: threshholdValue,
        assembly_unitMeasurement: unitMeasurement,
        category_code: slct_category
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
      res.status(200).json();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/update").post(
  async (req, res) => {
  
  try {
    console.log(req.query.id)
    const existingDataCode = await Assembly.findOne({
      where: {
        assembly_code: req.query.code,
        id: { [Op.ne]: req.query.id },
      },
    });

    if (existingDataCode) {
      res.status(201).send('Exist');
    } else {
      let finalThreshold;
      if (req.query.thresholds === "") {
      finalThreshold = 0;
      } else {
      finalThreshold = req.query.thresholds;
      }
      const Assembly_newData = await Assembly.update(
        {
          assembly_code: req.query.code,
          assembly_name: req.query.name,
          assembly_desc: req.query.desc,
          assembly_unit: req.query.unit,
          bin_id: req.query.slct_binLocation,
          assembly_unitMeasurement: req.query.unitMeasurement,
          assembly_manufacturer: req.query.slct_manufacturer,
          threshhold: finalThreshold,
        },
        {
          where: {
            id: req.query.id,
          },
        }
      );

      if (Assembly_newData) {
      const deletesparepart = Assembly_SparePart.destroy({
          where: {
            sparePart_id: req.query.id
          },
      });

      if(deletesparepart) {
        const selectedSparepart = req.query.spareParts
        for (const sparepartDropdown of selectedSparepart) {
          const sparepartValue = sparepartDropdown.value;
  
          console.log(sparepartValue)
          await Assembly_SparePart.create({
            assembly_id: req.query.id,
            sparePart_id: sparepartValue
          });
        }
      } //delete spare part end

        const deletesubpart = Assembly_SubPart.destroy({
          where: {
            subPart_id: req.query.id
          },
        });

        if(deletesubpart) {
          const selectedSubpart = req.query.Subparts
          for (const sparepartDropdown of selectedSubpart) {
            const subpartValue = sparepartDropdown.value;

            console.log(subpartValue)
            await Assembly_SubPart.create({
              assembly_id: req.query.id,
              subPart_id: subpartValue
            });
          }
        }

        const deletesupplier = Assembly_Supplier.destroy({
          where: {
            assembly_id: req.query.id
          },
        });

        if(deletesupplier){
          const selectedSuppliers = req.query.addPriceInput
          console.log(selectedSuppliers)
          for (const supplier of selectedSuppliers) {
            const { value, price } = supplier;

            await Assembly_Supplier.create({
              assembly_id: req.query.id,
              supplier_code: value,
              supplier_price: price
             });

            //  await Inventory_Assembly.create({
            //   assembly_tag_supp_id: SupplierID.id,
            //   quantity: 0,
            //   price: price
            // });
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

router.route("/delete/:table_id").delete(async (req, res) => {
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

module.exports = router;
