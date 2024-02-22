const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const { Warehouses, 
  Inventory, 
  Inventory_Assembly, 
  Inventory_Spare, 
  Inventory_Subpart,
  Activity_Log,} = require("../db/models/associations");
const session = require("express-session");
const e = require("express");

router.use(
    session({
      secret: "secret-key",
      resave: false,
      saveUninitialized: true,
    })
  );


  router.route('/createWarehouse').post(async (req, res) => {
    const { warehousename, 
            locatename,
            description,
            userId} = req.body; 
    try {
      const existingWarehousename = await Warehouses.findOne({
        where: {
          warehouse_name: warehousename,
        },
      });

      if(existingWarehousename) {
        res.status(201).json('Exist');
      } else {
        const newWarehouseData = await Warehouses.create({
          warehouse_name: warehousename,
          location: locatename,
          details: description
        });

        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Warehouse: Created a new warehouse named ${warehousename}`,
        });

        res.status(200).json(newWarehouseData);
      }

    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });

  router.route('/fetchtableWarehouses').get(async (req, res) => 
  {
    try {
        const data = await Warehouses.findAll();

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

router.route('/updateWarehouse/:param_id').put(async (req, res) => {
  try {
    const name = req.body.warehouse_name;
    const updatemasterID = req.params.param_id;
    const userId = req.query.userId;

    // Check if the name already exists in the table for other records
    const existingData = await Warehouses.findOne({
      where: {
        warehouse_name: name,
        id: { [Op.ne]: updatemasterID }, // Exclude the current record
      },
    });

    if (existingData) {
      res.status(202).send('Exist');
    } else {

      // Update the record in the table
      const [affectedRows] = await Warehouses.update(
        {
          warehouse_name: req.body.warehouse_name,
          location: req.body.location,
          details: req.body.details,
        },
        {
          where: { id: updatemasterID },
        }
      );

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Warehouse: Updated the information of warehouse ${req.body.warehouse_name}`,
      });

      res.status(200).json({ message: "Data updated successfully", affectedRows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

// router.route('/deleteWarehouse/:table_id').delete(async (req, res) => {
//   try {
//     const id = req.params.table_id;

//     const del = await Warehouses.destroy({
//       where: {
//         id: id,
//       },
//     });

//     if (del) {
//       res.json({ success: true });
//     } else {
//       res.status(400).json({ success: false });
//     }
//   } catch (error) {
//     console.error("Error deleting warehouse:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// });

router.route('/deleteWarehouse/:table_id').delete(async (req, res) => {
  try {
    const id = req.params.table_id;
    const userId = req.query.userId;
    const checkInventory = await Inventory.findAll({
      where: { warehouse_id: id },
    });

    const checkAssembly = await Inventory_Assembly.findAll({
      where: { warehouse_id: id },
    });

    const checkSpare = await Inventory_Spare.findAll({
      where: { warehouse_id: id },
    });

    const checkSubpart = await Inventory_Subpart.findAll({
      where: { warehouse_id: id },
    });

    if (
      checkInventory.length > 0 ||
      checkAssembly.length > 0 ||
      checkSpare.length > 0 ||
      checkSubpart.length > 0
    ) {
      res.status(202).json({ success: true });
    } else {

      const warehouseData = await Warehouses.findOne({
        where: {
          id: id,
        },
      });

      const wareName = warehouseData.warehouse_name;

      const del = await Warehouses.destroy({
        where: {
          id: id,
        },
      });

      if (del) {
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Deleted the data of warehouse named ${wareName}`
        });
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    }
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


module.exports = router;