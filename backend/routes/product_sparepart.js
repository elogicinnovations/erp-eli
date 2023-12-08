const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {Product, Product_Spareparts, SparePart} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/fetchsparepartTable').get(async (req, res) => {
    try {
        const data = await Product_Spareparts.findAll({
          include:[{
             model: SparePart,
             required: true 
          }],
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