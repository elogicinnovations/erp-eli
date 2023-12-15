const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
// const Assembly_SparePart = require('../db/models/assembly_supplier.model')
// const Supplier = require('../db/models/supplier.model')
const {
  Assembly_Supplier,
  Supplier,
  Assembly,
  Assembly_SparePart,
} = require("../db/models/associations");
const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/fetchAssigned").get(async (req, res) => {
  try {
    const data = await Assembly_Supplier.findAll({
      include: [
        {
          model: Supplier,
          required: true,
        },
        {
          model: Assembly,
          required: true,
          attributes: ["assembly_name"],
        },
      ],
      where: {
        assembly_id: req.query.id,
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

router.route("/fetchCanvass").get(async (req, res) => {
  try {
    // console.log(req.query.id)
    const data = await Assembly_Supplier.findAll({
      include: [
        {
          model: Assembly,
          required: true,
        },

        {
          model: Supplier,
          required: true,
        },
      ],
      where: { assembly_id: req.query.id },
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

module.exports = router;
