const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  Supplier,
  Assembly,
  AssemblyPrice_History
} = require("../db/models/associations");
const session = require("express-session");



router.route("/fetchAssemblyPriceHistory").get(async (req, res) => {
    try {
      // console.log(req.query.id)
      const data = await AssemblyPrice_History.findAll({
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