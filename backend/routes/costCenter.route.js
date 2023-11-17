const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { CostCenter, MasterList } = require("../db/models/associations"); 


// Get All Cost Center
router.route('/getCostCenter').get(async (req, res) => 
{
    try {
        const data = await CostCenter.findAll({include: {model: MasterList, required: true}});

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

//Create Cost Center
router.route('/create').post(async (req, res) => {

    try {
      const existingCostCenter = await CostCenter.findOne({
        where: {
          name: req.body.name
         
        },
      });
  
      if (existingCostCenter) {
        res.status(201).send('Exist');
      } else {
        const newData = await CostCenter.create({
          name: req.body.name,
          col_id: req.body.select_masterlist,
          description: req.body.description,
          status: req.body.status
        });
  
        res.status(200).json(newData);
        // console.log(newDa)
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
});

//Init-update
router.route('/initUpdate').get(async (req, res) => {
      try {
          const data = await CostCenter.findAll({
          where: {
              id: req.query.id,
          },
          include: {
            model: MasterList, required: true
          }
          });
  
          if (!data) {
          // No record found
          return res.status(404).json({ message: 'Cost center not found' });
          
          }
          // console.log(data)
          return res.json(data);
          
      } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'An error occurred' });
      }
  });

 
module.exports = router;