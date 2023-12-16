const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Supplier_SparePart = require('../db/models/sparePart_supplier..model')
const   {   Inventory, Product, ProductTAGSupplier,
            Inventory_Assembly, Assembly, SparePart, 
            SubPart, Inventory_Spare, Inventory_Subpart, Assembly_Supplier, SparePart_Supplier, Subpart_supplier
        } = require("../db/models/associations"); 
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));



router.route('/inventoryPRD').get(async (req, res) => {
    try {
     
      const data = await Inventory.findAll({
          include:[ {
            model: ProductTAGSupplier,
            required: true,
            
               include: [{
                model: Product,
                required: true
               }]
          }]
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



  router.route('/inventoryAssmbly').get(async (req, res) => {
    try {
     
      const data = await Inventory_Assembly.findAll({
          include:[ {
            model: Assembly_Supplier,
            required: true,
            
               include: [{
                model: Assembly,
                required: true
               }]
          }]
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



  router.route('/inventorySpare').get(async (req, res) => {
    try {
     
      const data = await Inventory_Spare.findAll({
          include:[ {
            model: SparePart_Supplier,
            required: true,
            
               include: [{
                model: SparePart,
                required: true
               }]
          }]
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

  router.route('/inventorySubpart').get(async (req, res) => {
    try {
     
      const data = await Inventory_Subpart.findAll({
          include:[ {
            model: Subpart_supplier,
            required: true,
            
               include: [{
                model: SubPart,
                required: true
               }]
          }]
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