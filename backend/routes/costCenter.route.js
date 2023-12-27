const router = require('express').Router()
const {Sequelize, where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { CostCenter, MasterList } = require("../db/models/associations"); 


// Get All Cost Center
// router.route('/getCostCenter').get(async (req, res) => 
// {
//     try {
//         const data = await CostCenter.findAll({
//           where: {
//             col_Fname: {
//             [Sequelize.Op.ne]: null, // Include rows where col_Fname is not null
//           },
//           },
//           include: {
//             model: MasterList, 
//             required: true},
//           });

//         if (data) {
//         return res.json(data);
//         } else {
//         res.status(400);
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json("Error");
//     }
// });

router.route('/getCostCenter').get(async (req, res) => 
{
    try {
        const data = await CostCenter.findAll({
         
          include: {
            model: MasterList, 
            required: true},
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

//Get cost center that inner join on masterlist
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

  //Update
  router.route('/update/').put(async (req, res) => {
    try {
      const id = req.body.id;
      const name = req.body.name;
      // Check if the costcenter already exists in the table for other records
      const existingData = await CostCenter.findOne({
        where: {
          name: name,
          id: { [Op.ne]: id }, // Exclude the current record
        },
      });
  
      if (existingData) {
        res.status(201).send('Exist');
      } else {
  
        // Update the record in the table
        const [affectedRows] = await CostCenter.update(
          {
            name: req.body.name,
            col_id: req.body.select_masterlist,
            description: req.body.description,
            status: req.body.status,
          },
          {
            where: { id: id },
          }
        );
  
        res.status(200).json({ message: "Data updated successfully", affectedRows });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });

  //Delete
  router.route('/delete/:param_id').delete(async (req, res) => 
  {
    const id = req.params.param_id;
    await CostCenter.destroy({
              where : {
                id: id
              }
          }).then(
              (del) => {
                  if(del){
                      res.json({success : true})
                  }
                  else{
                      res.status(400).json({success : false})
                  }
              }
          ).catch(
              (err) => {
                  console.error(err)
                  res.status(409)
              }
          );
        });

 
module.exports = router;