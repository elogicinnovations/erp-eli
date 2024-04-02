const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
// const Issued_Product = require('../db/models/issued_product.model')
const {
  Inventory,
  Product,
  ProductTAGSupplier,
  IssuedProduct,
  Issuance,
  IssuedAssembly,
  Inventory_Assembly,
  Assembly_Supplier,
  Assembly,
  IssuedSpare,
  Inventory_Spare,
  SparePart_Supplier,
  SparePart,
  IssuedSubpart,
  Inventory_Subpart,
  Subpart_supplier,
  SubPart,
  IssuedApproveProduct,
  IssuedApproveAssembly,
  IssuedApproveSpare,
  IssuedApproveSubpart,
  CostCenter,
} = require("../db/models/associations");

const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/getProducts").get(async (req, res) => {
  try {
    // console.log('url_ID prod', req.query.id)
    const data = await IssuedProduct.findAll({
      where: {
        issuance_id: req.query.id,
      },
      include: [
        {
          model: Inventory,
          required: true,

          include: [
            {
              model: ProductTAGSupplier,
              required: true,

              include: [
                {
                  model: Product,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
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

router.route("/getAssembly").get(async (req, res) => {
  try {
    console.log("url_ID asm", req.query.id);
    const data = await IssuedAssembly.findAll({
      where: {
        issuance_id: req.query.id,
      },
      include: [
        {
          model: Inventory_Assembly,
          required: true,

          include: [
            {
              model: Assembly_Supplier,
              required: true,

              include: [
                {
                  model: Assembly,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
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

router.route("/getSpare").get(async (req, res) => {
  try {
    const data = await IssuedSpare.findAll({
      where: {
        issuance_id: req.query.id,
      },
      include: [
        {
          model: Inventory_Spare,
          required: true,

          include: [
            {
              model: SparePart_Supplier,
              required: true,

              include: [
                {
                  model: SparePart,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
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

router.route("/getSubpart").get(async (req, res) => {
  try {
    const data = await IssuedSubpart.findAll({
      where: {
        issuance_id: req.query.id,
      },
      include: [
        {
          model: Inventory_Subpart,
          required: true,

          include: [
            {
              model: Subpart_supplier,
              required: true,

              include: [
                {
                  model: SubPart,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
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

router.route("/getissued").get(async (req, res) => {
  try {
    const issuedProd = await IssuedApproveProduct.findAll({
      include: [
        {
          model: Issuance,
          required: true,
          where: {
            issued_to: req.query.id,
          },
          include: [
            {
              model: CostCenter,
              required: true,
            },
          ],
        },
        {
          model: Inventory,
          required: true,

          include: [
            {
              model: ProductTAGSupplier,
              required: true,

              include: [
                {
                  model: Product,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    const issuedAsm = await IssuedApproveAssembly.findAll({
      include: [
        {
          model: Issuance,
          required: true,
          where: {
            issued_to: req.query.id,
          },
          include: [
            {
              model: CostCenter,
              required: true,
            },
          ],
        },
        {
          model: Inventory_Assembly,
          required: true,

          include: [
            {
              model: Assembly_Supplier,
              required: true,

              include: [
                {
                  model: Assembly,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    const issuedSpare = await IssuedApproveSpare.findAll({
      include: [
        {
          model: Issuance,
          required: true,
          where: {
            issued_to: req.query.id,
          },
          include: [
            {
              model: CostCenter,
              required: true,
            },
          ],
        },
        {
          model: Inventory_Spare,
          required: true,

          include: [
            {
              model: SparePart_Supplier,
              required: true,

              include: [
                {
                  model: SparePart,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    const issuedSubpart = await IssuedApproveSubpart.findAll({
      include: [
        {
          model: Issuance,
          required: true,
          where: {
            issued_to: req.query.id,
          },
          include: [
            {
              model: CostCenter,
              required: true,
            },
          ],
        },
        {
          model: Inventory_Subpart,
          required: true,

          include: [
            {
              model: Subpart_supplier,
              required: true,

              include: [
                {
                  model: SubPart,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    res.json({
      prod: issuedProd,
      asm: issuedAsm,
      spare: issuedSpare,
      subpart: issuedSubpart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

module.exports = router;
