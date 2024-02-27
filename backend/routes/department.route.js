const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  Department,
  Activity_Log,
  MasterList,
} = require("../db/models/associations");
const session = require("express-session");

router.route("/createDepartment").post(async (req, res) => {
  try {
    const { departmentname, description, userId } = req.body;
    console.log(departmentname);
    const existingWarehousename = await Department.findOne({
      where: {
        department_name: departmentname,
      },
    });

    if (existingWarehousename) {
      res.status(201).json("Exist");
    } else {
      const newData = await Department.create({
        department_name: departmentname,
        description: description,
      });

      if (newData) {
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Department: Created a new department named ${departmentname}`,
        });

        res.status(200).json();
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/fetchtableDepartment").get(async (req, res) => {
  try {
    const data = await Department.findAll();

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

router.route("/updateDepartment/:param_id").put(async (req, res) => {
  try {
    const name = req.body.department_name;
    const updatemasterID = req.params.param_id;
    const userId = req.query.userId;

    // Check if the name already exists in the table for other records
    const existingData = await Department.findOne({
      where: {
        department_name: name,
        id: { [Op.ne]: updatemasterID }, // Exclude the current record
      },
    });

    if (existingData) {
      res.status(202).send("Exist");
    } else {
      // Update the record in the table
      const [affectedRows] = await Department.update(
        {
          department_name: req.body.department_name,
          description: req.body.description,
        },
        {
          where: { id: updatemasterID },
        }
      );

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Department: Updated the information of department ${req.body.department_name}`,
      });

      res
        .status(200)
        .json({ message: "Data updated successfully", affectedRows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});
router.route("/deleteDepartment/:table_id").delete(async (req, res) => {
  try {
    const id = req.params.table_id;
    const userId = req.query.userId;
    //   const checkInventory = await Inventory.findAll({
    //     where: { warehouse_id: id },
    //   });

    //   const checkAssembly = await Inventory_Assembly.findAll({
    //     where: { warehouse_id: id },
    //   });

    //   const checkSpare = await Inventory_Spare.findAll({
    //     where: { warehouse_id: id },
    //   });

    const checkMasterList = await MasterList.findAll({
      where: { department_id: id },
    });

    if (checkMasterList.length > 0) {
      res.status(202).json({ success: true });
    } else {
      const deptData = await Department.findOne({
        where: {
          id: id,
        },
      });

      const Name = deptData.department_name;

      const del = await Department.destroy({
        where: {
          id: id,
        },
      });

      if (del) {
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Deleted the data of department named ${Name}`,
        });
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    }
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
