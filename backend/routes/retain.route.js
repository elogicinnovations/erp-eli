const router = require('express').Router()
const {where, Op, fn, col} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {IssuedReturn, Issuance, Inventory, MasterList, ProductTAGSupplier, Product} = require('../db/models/associations')
const session = require('express-session')

router.route('/fetchRetainedData').get(async (req, res) => {
    try {
        const data = await IssuedReturn.findAll({
            include: [{
                model: Issuance,
                required: true
            },{
                model: Inventory,
                required: true,
                    include:[{
                        model: ProductTAGSupplier,
                        required: true,
                            include:[{
                                model: Product,
                                required: true
                            }]
                    }]
            },{
                model: MasterList,
                as: "returnedBy",
                attributes: ["col_Fname", "col_id"],
                foreignKey: "return_by",
                required: true,
            },{
                model: MasterList,
                as: "retainee",
                attributes: ["col_Fname", "col_id"],
                foreignKey: "retained_by",
                required: true,
            }]
        })
        return res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json('Error');
    }
  });

  router.route('/fetchDataForExport').get(async (req, res) => {
    try {
        const data = await IssuedReturn.findAll({
            include: [{
                model: Issuance,
                required: true
            },{
                model: Inventory,
                required: true,
                    include:[{
                        model: ProductTAGSupplier,
                        required: true,
                            include:[{
                                model: Product,
                                required: true
                            }]
                    }]
            },{
                model: MasterList,
                as: "returnedBy",
                attributes: ["col_Fname", "col_id"],
                foreignKey: "return_by",
                required: true,
            },{
                model: MasterList,
                as: "retainee",
                attributes: ["col_Fname", "col_id"],
                foreignKey: "retained_by",
                required: true,
            }]
        })
      if (data) {
        return res.json(data);
      } else {
        res.status(400).json({ error: "No data found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Error');
    }
  });
module.exports = router;