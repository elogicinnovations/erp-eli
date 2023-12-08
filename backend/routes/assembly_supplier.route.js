const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Assembly_SparePart = require('../db/models/assembly_supplier.model')
// const Supplier = require('../db/models/supplier.model')
const {Assembly_Supplier, Supplier, Assembly, Assembly_SparePart} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route('/fetchAssigned').get(async (req, res) => {
    try {
      const data = await Assembly_SparePart.findAll({
        include: {
          model: Supplier,
          required: true
        },
        where: {
          assembly_id: req.query.id,
        },
      });
      if (data) {
        // // Assuming 'supplier_code' and 'supplier_name' are properties of the Supplier model
        // const suppliers = data.map(item => ({
        //   value: item.supplier,
        //   label: item.supplier,
        // }));
  
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


  router.route('/fetchCanvass').get(async (req, res) => {
    try {
      
      // console.log(req.query.id)
      const data = await Assembly_Supplier.findAll({
        include: [{
          model: Assembly,
          required: true
        },

        {
          model: Supplier,
          required: true
        }
      ],
        where: {assembly_id: req.query.id}
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