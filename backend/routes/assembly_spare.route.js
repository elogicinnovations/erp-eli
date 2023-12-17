const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  Assembly_SubPart,
  Assembly,
  Assembly_SparePart,
  SparePart,
} = require("../db/models/associations");
const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/fetchSpareAssembly").get(async (req, res) => {
  try {
    const data = await Assembly_SparePart.findAll({
      include: [
        {
          model: SparePart,
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
    console.log("Query result:", data);
    // if (!data) {
    //   return res.status(404).json();
    // }
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
