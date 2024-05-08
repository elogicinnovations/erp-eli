const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {Product, Product_Spare_Parts} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/fetchProductSpares').get(async (req, res) => {
    try {
        const data = await Product_Spare_Parts.findAll({
          include:[{
             model: Product,
             as: "IncrementedProduct",
             attributes: ["product_name", "product_id"],
             foreignKey: "product_id",
             required: true,
          },
          {
            model: Product,
            as: "tag_product_spares",
            attributes: ["product_name", "product_id"],
            foreignKey: "tag_product_spare_parts",
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


router.route('/fetchTableProductSpares').get(async (req, res) => {
    try {
        const data = await Product_Spare_Parts.findAll({
          include:[{
             model: Product,
             as: "IncrementedProduct",
             attributes: ["product_name", "product_id", "product_code", "product_details"],
             foreignKey: "product_id",
             required: true,
          },
          {
            model: Product,
            as: "tag_product_spares",
            attributes: ["product_name", "product_id", "product_code", "product_details"],
            foreignKey: "tag_product_spare_parts",
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