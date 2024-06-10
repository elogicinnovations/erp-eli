const router = require('express').Router()
const {where, Op, fn, col} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {Accountability, MasterList, Issuance, IssuedApproveProduct, Department, Inventory, ProductTAGSupplier, Product} = require('../db/models/associations')
const session = require('express-session')


router.route('/fetchAccountability').get(async (req, res) => {
    try {
      const data = await Accountability.findAll({
        include: [{
          model: IssuedApproveProduct,
          required: true,
          where: {
            quantity: {
              [Op.ne]: 0
            }
          },
            include: [{
              model: Issuance,
              required: true,
                include: [{
                    model: MasterList,
                    as: "receiver",
                    attributes: ["col_Fname", "col_id"],
                    foreignKey: "received_by",
                    required: true,
                    include:[{
                        model: Department,
                        required: true
                    }]
                }]
            }],
        }],
      });  
      if (data) {
        const uniquePoMap = new Map();
  
        // Filter data to ensure only unique masterlist_id and exclude those duplicate data
        const uniqueData = data.filter((item) => {
          if (!uniquePoMap.has(item.issued_approve_prd.issuance.received_by)) {
            uniquePoMap.set(item.issued_approve_prd.issuance.received_by, true);
            return true;
          }
          return false;
        });
        return res.json(uniqueData);
      } else {
        res.status(400);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Error');
    }
  });

  router.route('/fetchSpecificProduct').get(async (req, res) => {
    try {
      const data = await Accountability.findAll({
        include: [{
          model: IssuedApproveProduct,
          required: true,
            include: [{
              model: Issuance,
              required: true,
                where:{
                  received_by: req.query.ApprovedId
                }
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
            }]
          }],
      });  
        return res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json('Error');
    }
  });


  //for exporting
  router.route('/fetchDataForExport').get(async (req, res) => {
    try {
      const data = await Accountability.findAll({
        include: [{
          model: IssuedApproveProduct,
          required: true,
          where: {
            quantity: {
              [Op.ne]: 0
            }
          },
            include: [{
              model: Issuance,
              required: true,
                include: [{
                    model: MasterList,
                    as: "receiver",
                    attributes: ["col_Fname", "col_id"],
                    foreignKey: "received_by",
                    required: true,
                    include:[{
                        model: Department,
                        required: true
                    }]
                }]
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
            }],
        }],
      });  
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