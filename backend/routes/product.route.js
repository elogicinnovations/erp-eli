const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
// const Product = require('../db/models/product.model')
const {
  ProductTAGSupplier,
  Product,
  Inventory,
  Product_Assembly,
  Product_Spareparts,
  Product_Subparts,
  Product_image,
  productTAGsupplierHistory
} = require("../db/models/associations");
const session = require("express-session");
const multer = require("multer"); // Import multer

// const storage = multer.memoryStorage();
// const uploader = multer({ storage });
const mime = require("mime-types");
// const productTAGsupplier = require('../db/models/productTAGsupplier.model');
// Create a multer instance to handle file uploads
const upload = multer();

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// for PR  fetching all the products, assembly, sparePart, subpart
router.route("/fetchALLProduct").get(async (req, res) => {
  try {
    const data = await sequelize.query(
      `
      SELECT product_id as id, product_code as code, product_name as name,createdAt as createdAt FROM products
      UNION
      SELECT id as id, assembly_code as code, assembly_name as name, createdAt as createdAt FROM assemblies
    `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (data) {
      return res.json(data);
    } else {
      res.status(400).json({ error: "No data found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/fetchTable").get(async (req, res) => {
  try {
    //   const data = await MasterList.findAll({
    //     include: {
    //       model: UserRole,
    //       required: false,
    //     },
    //   });
    const data = await Product.findAll({
      attributes: [
        "product_id",
        "product_code",
        "product_name",
        "product_unitMeasurement",
        "createdAt",
        "updatedAt",
        'product_status'
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



router.route('/fetchTableEdit').get(async (req, res) => {

  try {
    const data = await Product.findAll({
      where: {
        product_id: req.query.id,
      },
      include: {
        model : Product_image,
        required: false
      }
    });

    if (!data) {
      // No record found
      return res.status(404).json();
    }
    // console.log(data)
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.route("/create").post(async (req, res) => {
    try {
      const {
        code,
        prod_id,
        name,
        slct_category,
        slct_binLocation,
        unitMeasurement,
        slct_manufacturer,
        details,
        thresholds,
        assembly,
        spareParts,
        subparting,
        images
      } = req.body;
      console.log(name)
        const existingDataCode = await Product.findOne({
          where: {
            product_code: code, 
          },
        });
    
        if (existingDataCode) {
          res.status(201).send('Exist');
        } else {
            const newData = await Product.create({
            product_code: code.toUpperCase(),
            product_name: name,
            productsID: prod_id,
            product_category: slct_category,
            product_location: slct_binLocation,
            product_unitMeasurement: unitMeasurement,
            product_manufacturer: slct_manufacturer,
            product_details: details,
            product_threshold: thresholds,
            product_status: 'Active'
          });

          //Assembly
          const IdData = newData.product_id;

          const selectedAssemblies = req.body.assembly;
          for (const assemblyDropdown of selectedAssemblies) {
            const assemblyValue = assemblyDropdown.value;

            await Product_Assembly.create({
              product_id: IdData,
              assembly_id: assemblyValue
            });
          }
          //Spareparts
          const selectedSpare = req.body.spareParts;
          for (const spareDropdown of selectedSpare) {
            const spareValue = spareDropdown.value;

            await Product_Spareparts.create({
              product_id: IdData,
              sparePart_id: spareValue
            });
          }

          //Subparts
          const selectedSubparting = req.body.subparting;
          for (const subpartDropdown of selectedSubparting) {
            const subpartValue = subpartDropdown.value;
  
            await Product_Subparts.create({
              product_id: IdData,
              subPart_id: subpartValue
            });
            }

          //Supplier
          const selectedSuppliers = req.body.productTAGSuppliers;
          for (const supplier of selectedSuppliers) {
            const { supplier_code, price } = supplier;
          
            const InsertedSupp = await ProductTAGSupplier.create({
              product_id: IdData,
              supplier_code: supplier_code,
              product_price: price
            });

            await productTAGsupplierHistory.create({
              product_id: IdData,
              supplier_code: supplier_code,
              product_price: price
            });

            const Inventories = InsertedSupp.id;
            await Inventory.create({
              product_tag_supp_id: Inventories,
              quantity: 0,
              price: price
            });
            }

          //Image
          const imageData = req.body.images;
          if(imageData.length > 0){
            imageData.forEach(async (i) => {
              await Product_image.create({
                product_id : IdData,
                product_image: i.base64Data
              });
            });
          }
          res.status(200).json(newData);
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});

router.route("/update").post(
  async (req, res) => {
    const {id,
      prod_id,
      code,
      name,
      slct_category,
      slct_binLocation,
      unitMeasurement,
      slct_manufacturer,
      details,
      thresholds,
      assembly,
      spareParts,
      subparting,
      productTAGSuppliers,
      productImages,
    } = req.body;
  try {
    const existingDataCode = await Product.findOne({
      where: {
        product_code: code,
        product_id: { [Op.ne]: id },
      },
    });

    if (existingDataCode) {
      return res.status(201).send("Exist");
    } else {
      const product_newdata = await Product.update(
        {
          product_code: code,
          productsID: prod_id,
          product_name: name,
          product_category: slct_category,
          product_location: slct_binLocation,
          product_unitMeasurement: unitMeasurement,
          product_manufacturer: slct_manufacturer,
          product_details: details,
          product_threshold: thresholds,
        },
        {
          where: {
            product_id: id,
          },
        }
      );

        const deleteassembly = Product_Assembly.destroy({
          where: {
            product_id: id
          },
        });

        if(deleteassembly) {
          const selectedAssemblies = assembly;
          for(const assemblyDropdown of selectedAssemblies) {
            const assemblyValue = assemblyDropdown.value;
            await Product_Assembly.create({
              product_id: id,
              assembly_id: assemblyValue
            }); 
          }
        };

        const deletespare = Product_Spareparts.destroy({
          where: {
            product_id: id
          },
        });

        if(deletespare) {
          const selectedSpare = spareParts;
          for(const spareDropdown of selectedSpare) {
            const spareValue = spareDropdown.value;
            await Product_Spareparts.create({
              product_id: id,
              sparePart_id: spareValue
            })
          }
        };
        

        const deletesubpart = Product_Subparts.destroy({
          where: {
            product_id: id
          },
        })

        if(deletesubpart) {
          const selectedSubpart = subparting;
          for(const subpartDropdown of selectedSubpart){
            const subpartValue = subpartDropdown.value;
            await Product_Subparts.create({
              product_id: id,
              subPart_id: subpartValue
            });
          }
        };

        const deleteproductImage = Product_image.destroy({
          where: {
            product_id: id
          },
        });

        if(deleteproductImage){
          if (productImages && productImages.length > 0) {
            productImages.forEach(async (i) => {
              await Product_image.create({
                product_id: id,
                product_image: i.product_image
              });
            });
          }
        };


        const deletesupplier = ProductTAGSupplier.destroy({
          where: {
            product_id: id
          },
        });

        if(deletesupplier) {
          const selectedsupplier = productTAGSuppliers;
          for(const supplier of selectedsupplier){
            const { value, price} = supplier;

            const existingPrice = await ProductTAGSupplier.findOne({
              product_id: id,
              supplier_code: value,
            })

            await ProductTAGSupplier.create({
              product_id: id,
              supplier_code: value,
              product_price: price
            });

            if(existingPrice && existingPrice.product_price === price){
              continue;
            }

            if(existingPrice && existingPrice.product_price !== price){
              await productTAGsupplierHistory.create({
                product_id: id,
                supplier_code: value,
                product_price: price
              });
            }
          }
        };

      res.status(200).json();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});  



router.route("/delete/:table_id").delete(async (req, res) => {
  const id = req.params.table_id;
  Product.destroy({
    where: {
      product_id: id,
    },
  })
    .then((del) => {
      if (del) {
        ProductTAGSupplier.destroy({
          where: {
            product_id: id,
          },
        })
          .then((deleted) => {
            if (deleted) {
              Inventory.destroy({
                where: {
                  product_id: id,
                },
              })
                .then((deletedInventory) => {
                  // if (deletedInventory) {
                    res.status(200).json({ success: true });
                  // } else {
                    // res.status(400).json({ success: false });
                  // }
                })
                .catch((err) => {
                  console.error(err);
                  res.status(409);
                });
            } else {
              // res.status(400).json({ success: false });
              res.status(200).json({ success: true });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(409);
          });
      } else {
        res.status(400).json({ success: false });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(409);
    });
});


router.route('/statusupdate').put(async (req, res) => {
  try {
    const { productIds, status } = req.body;

    for (const productId of productIds) {
      await Product.update(
        { product_status: status },
        { where: { product_id: productId } }
      );
    }

    res.status(200).json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;