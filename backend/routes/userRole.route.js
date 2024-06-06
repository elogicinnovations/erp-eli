const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
// const UserRole = require('../db/models/userRole.model')
const {
  MasterList,
  UserRole,
  Warehouses,
  Activity_Log,
  Department,
} = require("../db/models/associations");
const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/fetchuserrole").get(async (req, res) => {
  await UserRole.findAll({
    where: {
      col_id: { [Op.ne]: 1 },
    },
  })
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json("Error");
    });
});

router.route("/fetchuserroleEDIT/:id").get(async (req, res) => {
  const roleId = req.params.id;

  try {
    // const data = await UserRole.find({
    //   where: {
    //     col_id: roleId,
    //   },
    // });
    const data = await UserRole.findByPk(roleId);

    if (!data) {
      // No record found
      return res.status(404).json({ message: "User role not found" });
    }
    console.log(data);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/editUserrole/:id/:rolename", async (req, res) => {
  const roleId = req.params.id;
  const rolename = req.params.rolename;
  const selectedCheckboxes = req.body.selectedCheckboxes;
  const userId = req.query.userId;

  console.log("Received parameters:", roleId, rolename);

  try {
    // Update the existing role with the updated data
    const updatedRole = await UserRole.update(
      {
        col_rolename: rolename,
        col_desc: selectedCheckboxes[0].desc,
        col_authorization: selectedCheckboxes
          .map((item) => item.authorization)
          .join(", "),
      },
      {
        where: {
          col_id: roleId,
        },
      }
    );

    if (!updatedRole[0]) {
      return res.status(404).json({ error: "User role not found" });
    }

    await Activity_Log.create({
      masterlist_id: userId,
      action_taken: `Updated the authorization named ${rolename}`,
    });

    return res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

//DELETE:

router.route("/deleteRoleById/:roleid").delete(async (req, res) => {
  const param_id = req.params.roleid;
  const userId = req.query.userId;

  try {
    // Assuming that MasterList and UserRole models are correctly defined
    const check = await MasterList.findAll({
      where: {
        col_roleID: param_id,
      },
    });

    if (check && check.length > 0) {
      return res.status(202).json({
        success: false,
        message: "Role is associated and cannot be deleted",
      });
    }
    const rolename = await UserRole.findOne({
      where: {
        col_id: param_id,
      },
    });

    const userRolename = rolename.col_rolename;

    const del = await UserRole.destroy({
      where: {
        col_id: param_id,
      },
    });

    if (del > 0) {
      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Deleted the authorization named ${userRolename}`,
      });
      return res.json({
        success: true,
        message: "User role deleted successfully",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User role not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
});

router.post("/createUserrole/:rolename", async (req, res) => {
  const selectedCheckboxes = req.body.selectedCheckboxes;
  const param_rolename = req.params.rolename;
  const userId = req.query.userId;

  try {
    const existingRole = await UserRole.findOne({
      where: { col_rolename: param_rolename },
    });

    if (existingRole) {
      return res.status(202).send("Exist");
    } else {
      // Concatenate the authorization values with commas
      const concatenatedAuthorization = selectedCheckboxes
        .map((item) => item.authorization)
        .join(", ");

      const createdRole = await UserRole.create({
        col_rolename: selectedCheckboxes[0].rolename, // Use the first rolename as an example
        col_desc: selectedCheckboxes[0].desc, // Use the first description as an example
        col_authorization: concatenatedAuthorization,
      });

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Created a new authorization named ${selectedCheckboxes[0].rolename}`,
      });

      return res.status(200).json({ message: "Data inserted successfully" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.route("/rbacautoadd").post(async (req, res) => {
  try {
    //this is for checking of Superadmin role
    const existingRBAC = await UserRole.findOne({
      where: {
        col_rolename: "Superadmin",
      },
    });

    if (existingRBAC) {
      return res.status(200).json({ message: "Superadmin already exists" });
    }

    //if not exist create super admin
    const newRBAC = await UserRole.create({
      col_rolename: "Superadmin",
      col_desc: "",
      col_authorization:
        "Dashboard - View, Master List - Add, Master List - Edit, Master List - Delete, Master List - View, User Access Role - Add, User Access Role - Edit, User Access Role - Delete, User Access Role - View, Department - Add, Department - Edit, Department - Delete, Department - View, Product List - Add, Product List - Edit, Product List - Delete, Product List - View, Assembly - Add, Assembly - Edit, Assembly - Delete, Assembly - View, Spare Part - Add, Spare Part - Edit, Spare Part - Delete, Spare Part - View, Sub-Part - Add, Sub-Part - Edit, Sub-Part - Delete, Sub-Part - View, Product Categories - Add, Product Categories - Edit, Product Categories - Delete, Product Categories - View, Product Manufacturer - Add, Product Manufacturer - Edit, Product Manufacturer - Delete, Product Manufacturer - View, Bin Location - Add, Bin Location - Edit, Bin Location - Delete, Bin Location - View, Cost Centre - Add, Cost Centre - Edit, Cost Centre - Delete, Cost Centre - View, Supplier - Add, Supplier - Edit, Supplier - Delete, Supplier - View, Warehouses - Add, Warehouses - Edit, Warehouses - Delete, Warehouses - View, Inventory - View, Inventory - Add, Inventory - Edit, Inventory - Approval, Inventory - Reject, PR - Add, PR - Edit, PR - Approval, PR - Reject, PR - View, PO - Approval, PO - Reject, PO - View, Receiving - View, Receiving - Approval, Receiving - Reject, Stock Management - Add, Stock Management - View, Stock Management - Approval, Stock Management - Reject, Report - View, Accountability - View, Price Checker - View, Activity Logs - View",
    });

    const rbacId = newRBAC.col_id;

    if (!newRBAC) {
      return res.status(401).json({ message: "No rbac id found" });
    }

    //create of masterlist
    const newUseradmin = await MasterList.create({
      col_roleID: rbacId,
      col_Fname: "Superadmin",
      col_address: "",
      col_username: "Superadmin",
      col_phone: null,
      col_email: "cminoza@elogicinnovations.com",
      col_Pass: "admin",
      col_status: "Active",
      user_type: "Superadmin",
    });

    //for warehouse
    const existingWarehouse = await Warehouses.findOne({
      where: {
        warehouse_name: "Main",
        location: "Agusan",
      },
    });

    if (existingWarehouse) {
      return res
        .status(200)
        .json({
          message:
            "Warehouse with the specified name and location already exists",
        });
    }

    const newWarehouse = await Warehouses.create({
      warehouse_name: "Main",
      location: "Agusan",
      details: "",
    });

    //for department (MCD)
    const existingDEpt = await Department.findOne({
      where: {
        id: 1,
        department_name: "MATERIAL CONTROL DEPARTMENT",
      },
    });

    if (existingDEpt) {
      return res
        .status(200)
        .json({
          message:
            "Warehouse with the specified name and location already exists",
        });
    }

    const newDept = await Department.create({
      department_name: "MATERIAL CONTROL DEPARTMENT",
      description: "N/A"
    });

    res.status(201).json(newUseradmin);
  } catch (error) {
    console.error("Error: Problem on inserting", error);
    res.status(500).json({ message: "Error inserting" });
  }
});

module.exports = router;
