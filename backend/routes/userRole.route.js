const router = require("express").Router();
const { where } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
// const UserRole = require('../db/models/userRole.model')
const { MasterList, UserRole } = require("../db/models/associations");
const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/fetchuserrole").get(async (req, res) => {
  // const departmentName = req.query.departmentName;

  UserRole.findAll()
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
    const data = await UserRole.findAll({
      where: {
        col_id: roleId,
      },
    });

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

    return res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

//DELETE:

router.route("/deleteRoleById/:roleid").delete(async (req, res) => {
  const param_id = req.params.roleid;

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

    const del = await UserRole.destroy({
      where: {
        col_id: param_id,
      },
    });

    if (del > 0) {
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

      return res.status(200).json({ message: "Data inserted successfully" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
