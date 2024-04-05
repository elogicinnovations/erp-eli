const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const moment = require("moment-timezone");
const {
    CostCenter, IssuedApproveProduct, Inventory, ProductTAGSupplier, Product, Category
} = require("../db/models/associations");
const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/content_fetch").get(async (req, res) => {
  try {

    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    const currentDate = moment();
    const firstDateOfMonth = currentDate.clone().startOf("month");
    const lastDateOfMonth = currentDate.clone().endOf("month");


    const data_prd = await IssuedApproveProduct.findAll({
        where: {
            quantity: { [Op.ne]: 0 },
            createdAt: {
                [Op.between]: [
                  firstDateOfMonth.format("YYYY-MM-DD"),
                  lastDateOfMonth.format("YYYY-MM-DD"),
                ],
              },
        },
        include: [{
            model: Inventory,
            required: true,
                include: [{
                    model: ProductTAGSupplier,
                    required: true,

                        include: [{
                            model: Product,
                            required: true,
                                include: [{
                                    model: Category,
                                    required: true
                                }]
                        }]
                }]
        }]
    })

    return res.json(data_prd)
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

module.exports = router;
