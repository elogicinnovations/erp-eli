const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Supplier_SparePart = require('../db/models/sparePart_supplier..model')
const { SparePart_Supplier, Supplier } = require("../db/models/associations"); 
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/fetchTableEdit').get(async (req, res) => {
    try {
      const data = await SparePart_Supplier.findAll({
        where: {
          sparePart_id: req.query.id,
        },
        include: {
          model: Supplier,
          required: true
        }
      });
  
      if (data) {
        // Assuming 'supplier_code' and 'supplier_name' are properties of the Supplier model
        // const suppliers = data.map(item => ({
        //   value: item.supplier,
        //   label: item.supplier,
        // }));
  
        // console.log(suppliers);
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