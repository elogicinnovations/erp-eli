const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {Product, Product_Assm} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/fetchProductassembly').get(async (req, res) => {
    try {
        const data = await Product_Assm.findAll({
          include:[
          {
             model: Product,
             as: "product",
             attributes: ["product_id", "product_name"],
             foreignKey: "product_id",
             required: true,
          },
          {
            model: Product,
            as: "tagged_product_assemblies",
            attributes: ["product_id", "product_name"],
            foreignKey: "tag_product_assm",
            required: true,
         },
        ],
          where: {
              product_id: req.query.id,
          },
        });

        if (!data) {
        return res.status(404).json();
        
        }
        // console.log(data)
        return res.json(data);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

router.route('/fetchTableProductassembly').get(async (req, res) => {
    try {
        const data = await Product_Assm.findAll({
          include:[
          {
             model: Product,
             as: "product",
             attributes: ["product_id", "product_name", "product_code", "product_details"],
             foreignKey: "product_id",
             required: true,
          },
          {
            model: Product,
            as: "tagged_product_assemblies",
            attributes: ["product_id", "product_name", "product_code", "product_details"],
            foreignKey: "tag_product_assm",
            required: true,
         },
        ],
          where: {
              product_id: req.query.id,
          },
        });

        if (!data) {
        return res.status(404).json();
        
        }
        // console.log(data)
        return res.json(data);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

module.exports = router;