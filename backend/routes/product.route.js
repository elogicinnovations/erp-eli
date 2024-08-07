const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  ProductTAGSupplier,
  Product,
  Inventory,
  Product_Assembly,
  Product_Spareparts,
  Product_Subparts,
  Product_image,
  productTAGsupplierHistory,
  IssuedProduct,
  Warehouses,
  Activity_Log,
  Assembly,
  SparePart,
  SubPart,
  Product_Assm,
  Product_Sub_Assembly,
  Product_Spare_Parts,
} = require("../db/models/associations");
const session = require("express-session");
const multer = require("multer");
const mime = require("mime-types");
const upload = multer();

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

//for dropdown Assembly
router.route("/DropdownProductAssembly").get(async (req, res) => {
  try {
    const data = await Product.findAll({
      where: {
        [Op.or]: [{ type: "Assembly" }, { type: null }],
      },
    });
    if (data) {
      return res.json(data);
    } else {
      res.status(400).json("No data found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

//for dropdown sub-assembly
router.route("/DropdownProductSubAssembly").get(async (req, res) => {
  try {
    const data = await Product.findAll({
      where: {
        [Op.or]: [{ type: "Sub-Assembly" }, { type: null }],
      },
    });
    if (data) {
      return res.json(data);
    } else {
      res.status(400).json("No data found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

//for dropdown product spare parts
router.route("/DropdownProductSpareParts").get(async (req, res) => {
  try {
    const data = await Product.findAll({
      where: {
        [Op.or]: [{ type: "SpareParts" }, { type: null }],
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

//fetching of product in data table with picture
router.route("/fetchTable").get(async (req, res) => {
  try {
    const data = await Product.findAll({
      order: [["createdAt", "DESC"]],
      attributes: [
        "product_id",
        "product_code",
        "product_name",
        "product_unitMeasurement",
        "createdAt",
        "updatedAt",
        "product_status",
      ],
      include: {
        model: Product_image,
        required: false,
        order: [["createdAt", "DESC"]], // Order by createdAt column in descending order
        // limit: 1, // Limit the result to only one image per subpart
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

router.route("/fetchTableEdit").get(async (req, res) => {
  try {
    const data = await Product.findAll({
      where: {
        product_id: req.query.id,
      },
      include: {
        model: Product_image,
        required: false,
      },
    });

    if (!data) {
      return res.status(404).json();
    }
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
      name,
      slct_category,
      slct_binLocation,
      unitMeasurement,
      slct_manufacturer,
      details,
      thresholds,
      selectProductType,
      ProductNumber,
      UOM_set,
      userId,
    } = req.body;

    const existingDataCode = await Product.findOne({
      where: {
        product_code: code,
      },
    });

    if (existingDataCode) {
      res.status(201).send("Exist");
    } else {
      const typeValue =
        selectProductType === "" || selectProductType === "N/A"
          ? null
          : selectProductType;

      const newData = await Product.create({
        product_code: code.toUpperCase(),
        product_name: name,
        product_category: slct_category,
        product_location: slct_binLocation,
        product_unitMeasurement: unitMeasurement,
        product_manufacturer:
          slct_manufacturer === "" ? null : slct_manufacturer,
        product_details: details,
        product_threshold: thresholds,
        UOM_set: UOM_set,
        product_status: "Active",
        type: typeValue,
        part_number: ProductNumber,
      });

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Product: Created a new product named ${name}`,
      });

      const IdData = newData.product_id;

      //Product Assembly Dropdown
      const selectedProductAssemblies = req.body.ProductAssemblies;
      for (const Product_assemblyDropdown of selectedProductAssemblies) {
        await Product_Assm.create({
          product_id: IdData,
          tag_product_assm: Product_assemblyDropdown,
        });
      }

      //Product Sub-Assembly
      const selectedProductSubAssemblies = req.body.ProductSubAssembly;
      for (const Product_sub_assemblyDropdown of selectedProductSubAssemblies) {
        await Product_Sub_Assembly.create({
          product_id: IdData,
          tag_product_sub_assembly: Product_sub_assemblyDropdown,
        });
      }

      //Product Spareparts
      const selectedProductSpare_parts = req.body.ProductSpareParts;
      for (const Product_spare_partDropdown of selectedProductSpare_parts) {
        await Product_Spare_Parts.create({
          product_id: IdData,
          tag_product_spare_parts: Product_spare_partDropdown,
        });
      }

      // const selectedAssemblies = req.body.assembly;
      // for (const assemblyDropdown of selectedAssemblies) {

      //   await Product_Assembly.create({
      //     product_id: IdData,
      //     assembly_id: assemblyDropdown
      //   });
      // }

      //Spareparts
      // const selectedSpare = req.body.spareParts;
      // for (const spareDropdown of selectedSpare) {

      //   await Product_Spareparts.create({
      //     product_id: IdData,
      //     sparePart_id: spareDropdown
      //   });
      // }

      //Subparts
      // const selectedSubparting = req.body.subparting;
      // for (const subpartDropdown of selectedSubparting) {

      //   await Product_Subparts.create({
      //     product_id: IdData,
      //     subPart_id: subpartDropdown
      //   });
      // }

      // const findWarehouse = await Warehouses.findOne({
      //   where: {
      //     id: 1
      //   },
      // });

      // if (!findWarehouse) {
      //   console.log("No warehouse found");
      // }

      // const ExistWarehouseId = findWarehouse.id;
      // console.log("Id ng warehouse: " + ExistWarehouseId);

      //Supplier
      const selectedSuppliers = req.body.productTAGSuppliers;
      for (const supplier of selectedSuppliers) {
        const { supplier_code, price } = supplier;

        const InsertedSupp = await ProductTAGSupplier.create({
          product_id: IdData,
          supplier_code: supplier_code,
          product_price: price,
          status: "Active",
        });

        await productTAGsupplierHistory.create({
          product_id: IdData,
          supplier_code: supplier_code,
          product_price: price,
        });

        // const Inventories = InsertedSupp.id;
        // await Inventory.create({
        //   product_tag_supp_id: Inventories,
        //   quantity: 0,
        //   price: price,
        //   warehouse_id: ExistWarehouseId,
        // });
      }

      //Image
      const imageData = req.body.images;
      if (imageData.length > 0) {
        imageData.forEach(async (i) => {
          await Product_image.create({
            product_id: IdData,
            product_image: i.base64Data,
          });
        });
      }
      res.status(200).json(newData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/update").post(async (req, res) => {
  const {
    id,
    code,
    name,
    slct_category,
    slct_binLocation,
    unitMeasurement,
    slct_manufacturer,
    details,
    thresholds,
    selectProductType,
    PartNumber,
    // assembly,
    // spareParts,
    // subparting,
    UOM_set,
    specificProductAssembly,
    specificProductSubAssembly,
    specificProductSpares,
    productTAGSuppliers,
    productImages,
    userId,
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
      const typeValue =
        selectProductType === "" || selectProductType === "N/A"
          ? null
          : selectProductType;
      const product_newdata = await Product.update(
        {
          product_code: code,
          product_name: name,
          product_category: slct_category,
          product_location: slct_binLocation,
          product_unitMeasurement: unitMeasurement,
          product_manufacturer: slct_manufacturer,
          product_details: details,
          product_threshold: thresholds,
          UOM_set: UOM_set,
          type: typeValue,
          part_number: PartNumber,
        },
        {
          where: {
            product_id: id,
          },
        }
      );

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Product: Updated the information product ${name}`,
      });

      const deleteProductAssembly = Product_Assm.destroy({
        where: {
          product_id: id,
        },
      });

      if (deleteProductAssembly) {
        const selectedProductAssemblies = specificProductAssembly;
        for (const assemblyDropdown of selectedProductAssemblies) {
          const assemblyValue = assemblyDropdown.value;
          await Product_Assm.create({
            product_id: id,
            tag_product_assm: assemblyValue,
          });
        }
      }

      const deleteProductSubAssembly = Product_Sub_Assembly.destroy({
        where: {
          product_id: id,
        },
      });

      if (deleteProductSubAssembly) {
        const selectedProductSubAssemblies = specificProductSubAssembly;
        for (const subassemblyDropdown of selectedProductSubAssemblies) {
          const subassemblyValue = subassemblyDropdown.value;
          await Product_Sub_Assembly.create({
            product_id: id,
            tag_product_sub_assembly: subassemblyValue,
          });
        }
      }

      const deleteProductSpares = Product_Spare_Parts.destroy({
        where: {
          product_id: id,
        },
      });

      if (deleteProductSpares) {
        const selectedProductSpares = specificProductSpares;
        for (const sparesDropdown of selectedProductSpares) {
          const sparesValue = sparesDropdown.value;
          await Product_Spare_Parts.create({
            product_id: id,
            tag_product_spare_parts: sparesValue,
          });
        }
      }

      // const deleteassembly = Product_Assembly.destroy({
      //   where: {
      //     product_id: id
      //   },
      // });

      // if(deleteassembly) {
      //   const selectedAssemblies = assembly;
      //   for(const assemblyDropdown of selectedAssemblies) {
      //     const assemblyValue = assemblyDropdown.value;
      //     await Product_Assembly.create({
      //       product_id: id,
      //       assembly_id: assemblyValue
      //     });
      //   }
      // };

      // const deletespare = Product_Spareparts.destroy({
      //   where: {
      //     product_id: id
      //   },
      // });

      // if(deletespare) {
      //   const selectedSpare = spareParts;
      //   for(const spareDropdown of selectedSpare) {
      //     const spareValue = spareDropdown.value;
      //     await Product_Spareparts.create({
      //       product_id: id,
      //       sparePart_id: spareValue
      //     })
      //   }
      // };

      // const deletesubpart = Product_Subparts.destroy({
      //   where: {
      //     product_id: id
      //   },
      // })

      // if(deletesubpart) {
      //   const selectedSubpart = subparting;
      //   for(const subpartDropdown of selectedSubpart){
      //     const subpartValue = subpartDropdown.value;
      //     await Product_Subparts.create({
      //       product_id: id,
      //       subPart_id: subpartValue
      //     });
      //   }
      // };

      const deleteproductImage = Product_image.destroy({
        where: {
          product_id: id,
        },
      });

      if (deleteproductImage) {
        if (productImages && productImages.length > 0) {
          productImages.forEach(async (i) => {
            await Product_image.create({
              product_id: id,
              product_image: i.product_image,
            });
          });
        }
      }
      await ProductTAGSupplier.update(
        {
          status: "Inactive",
        },
        {
          where: {
            product_id: id,
          },
        }
      );

      const selectedsupplier = productTAGSuppliers;
      for (const supplier of selectedsupplier) {
        const { value, price } = supplier;

        await ProductTAGSupplier.update(
          {
            product_price: price === "" ? null : price,
            status: "Active",
          },
          {
            where: {
              product_id: id,
              supplier_code: value,
            },
          }
        );

        const findSupplier = await ProductTAGSupplier.findAll({
          where: {
            product_id: id,
            supplier_code: value,
          },
        });

        if (findSupplier.length > 0) {
          // nothing
        } else {
          await ProductTAGSupplier.create({
            product_id: id,
            supplier_code: value,
            product_price: price,
            status: "Active",
          });
        }

        const ExistingSupplier = await productTAGsupplierHistory.findOne({
          where: {
            product_id: id,
            supplier_code: value,
          },
          order: [["createdAt", "DESC"]],
        });

        if (!ExistingSupplier) {
          await productTAGsupplierHistory.create({
            product_id: id,
            supplier_code: value,
            product_price: price === "" ? 0 : price,
          });
        } else {
          const existingPrice = ExistingSupplier.product_price;

          if (existingPrice !== price) {
            await productTAGsupplierHistory.create({
              product_id: id,
              supplier_code: value,
              product_price: price === "" ? 0 : price,
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
});

// router.route("/delete/:table_id").delete(async (req, res) => {
//   const id = req.params.table_id;
//   Product.destroy({
//     where: {
//       product_id: id,
//     },
//   })
//     .then((del) => {
//       if (del) {
//         ProductTAGSupplier.destroy({
//           where: {
//             product_id: id,
//           },
//         })
//           .then((deleted) => {
//             if (deleted) {
//               Inventory.destroy({
//                 where: {
//                   product_id: id,
//                 },
//               })
//                 .then((deletedInventory) => {
//                   // if (deletedInventory) {
//                     res.status(200).json({ success: true });
//                   // } else {
//                     // res.status(400).json({ success: false });
//                   // }
//                 })
//                 .catch((err) => {
//                   console.error(err);
//                   res.status(409);
//                 });
//             } else {
//               // res.status(400).json({ success: false });
//               res.status(200).json({ success: true });
//             }
//           })
//           .catch((err) => {
//             console.error(err);
//             res.status(409);
//           });
//       } else {
//         res.status(400).json({ success: false });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(409);
//     });
// });

router.route("/deleteOldArchivedProduct").post(async (req, res) => {
  try {
    const currentDate = new Date();
    const currentManilaDate = new Date(
      currentDate.toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );

    const productRows = await Product.findAll({
      where: {
        product_status: "Archive",
      },
    });

    if (productRows && productRows.length === 0) {
      console.log("No product archive found");
      return res.status(201).json({ message: "No product archive found" });
    }
    for (let i = 0; i < productRows.length; i++) {
      const archiveDate = new Date(productRows[i].archive_date);
      // const nextDay = new Date(archiveDate);
      // nextDay.setDate(archiveDate.getDate() + 1);
      const newArchiveDate = new Date(archiveDate);
      newArchiveDate.setFullYear(newArchiveDate.getFullYear() + 1);

      const prodId = productRows[i].product_id;

      //Select Product supplier
      const Productsupprows = await ProductTAGSupplier.findAll({
        where: {
          product_id: prodId,
        },
      });

      if (Productsupprows && Productsupprows.length === 0) {
        console.log("No archive product supplier");
        continue;
      }

      const prodSuppId = Productsupprows.map((prodsupp) => prodsupp.id);

      //Select Inventory Product
      const Inventoryprod = await Inventory.findAll({
        where: {
          product_tag_supp_id: prodSuppId,
        },
      });

      if (Inventoryprod && Inventoryprod.length === 0) {
        console.log("No inventory found");
        continue;
      }

      const InventoryId = Inventoryprod.map((invprod) => invprod.inventory_id);

      if (newArchiveDate <= currentDate) {
        await IssuedProduct.destroy({
          where: {
            inventory_id: InventoryId,
          },
        });

        await Inventory.destroy({
          where: {
            product_tag_supp_id: prodSuppId,
          },
        });

        await Product.destroy({
          where: {
            product_status: "Archive",
          },
        });
      }
    }

    res.status(200).json({ message: "Successfully deleted product archive" });
  } catch (error) {
    console.error("Error Problem on delete archived subparts" + error);
  }
});

router.route("/statusupdate").put(async (req, res) => {
  try {
    const { productIds, status, userId } = req.body;

    const updateData = { product_status: status };

    if (status === "Archive") {
      updateData.archive_date = new Date();
    }
    for (const productId of productIds) {
      const productdata = await Product.findOne({
        where: { product_id: productId },
      });

      const productname = productdata.product_name;
      const currentstatus = productdata.product_status;

      const updateStatus = await Product.update(updateData, {
        where: { product_id: productId },
      });

      if (updateStatus) {
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Product: ${productname} Updated status from ${currentstatus} to ${status}`,
        });
      }
    }

    res.status(200).json({ message: "Products updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.route("/lastCode").get(async (req, res) => {
  try {
    // const latestPR = await Product.findOne({
    //   attributes: [[sequelize.fn('max', sequelize.col('product_code')), 'latestNumber']],
    // });
    // let latestNumber = latestPR.getDataValue('latestNumber');

    // console.log('Latest Number:', latestNumber);

    // // Increment the latestNumber by 1 for a new entry
    // latestNumber = latestNumber !== null ? (parseInt(latestNumber, 10) + 1).toString() : '1';

    // // Do not create a new entry, just return the incremented value
    // return res.json(latestNumber.padStart(6, '0'));

    const maxValues = await Promise.all([
      Product.max("product_code"),
      Assembly.max("assembly_code"),
      SparePart.max("spareParts_code"),
      SubPart.max("subPart_code"),
    ]);

    const maxNumber = Math.max(...maxValues);

    // Increment the maxNumber by 1 for a new entry
    const nextNumber = (maxNumber !== null ? parseInt(maxNumber, 10) : 0) + 1;

    // Format the nextNumber to have leading zeros
    const formattedNumber = nextNumber.toString().padStart(6, "0");

    // Return the formatted nextNumber
    return res.json(formattedNumber);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

module.exports = router;
