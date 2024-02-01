const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const { Warehouses } = require("../db/models/associations");
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
            description} = req.body; 
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

      res.status(200).json({ message: "Data updated successfully", affectedRows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

router.route('/deleteWarehouse/:table_id').delete(async (req, res) => {
  try {
    const id = req.params.table_id;

    const del = await Warehouses.destroy({
      where: {
        id: id,
      },
    });

    if (del) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// router.route('/automaticAdd').post(async (req, res) => {
//   try {
//     const warehouseName = 'Main';
//     const location = 'Agusan';

//     // Check if warehouse with given name and location already exists
//     const existingWarehouse = await Warehouses.findOne({
//       where: {
//         warehouse_name: warehouseName,
//         location: location
//       }
//     });

//     if (existingWarehouse) {
//       res.status(200).json({ message: 'Warehouse already exists' });
//     } else {
//       // Warehouse does not exist, create a new one
//       const newWarehouse = await Warehouses.create({
//         warehouse_name: warehouseName,
//         location: location,
//         details: ""
//       });

//       res.status(201).json({ message: 'New warehouse created', warehouse: newWarehouse });
//     }
//   } catch (error) {
//     console.error('Error: Problem on inserting warehouse', error);
//     res.status(500).json({ message: 'Error warehouse inserting' });
//   }
// });

router.route('/automaticAdd').post(async (req, res) => {
  try {
    
    const existingWarehouses = await Warehouses.findAll({
      where: {
        warehouse_name: "Main",
        location: "Agusan",
      },
    });

    if(existingWarehouses && existingWarehouses.length > 0){
      return res.status(201).json({message: "Warehouse already exists"});
    }
      //   await Warehouses.create({
      //   warehouse_name: "Main",
      //   location: "Agusan",
      //   details: "",
      // });
      console.log("HAHAHAHA")
    

    res.status(200).json({message: "Warehouse successfully inserted"});
  } catch (error) {
    console.error('Error: Problem on inserting warehouse');
    res.status(500).json({ message: 'Error warehouse inserting' });
  }
});


module.exports = router;