const router = require('express').Router()
const {Sequelize, where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { CostCenter, MasterList, Activity_Log } = require("../db/models/associations"); 


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
          order: [['createdAt', 'DESC']],
        
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
      const userID = req.body.userId;
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
          description: req.body.description,
          status: req.body.status
        });

        await Activity_Log.create({
          masterlist_id: userID,
          action_taken: `Created a new cost center named ${req.body.name}`
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
          // include: {
          //   model: MasterList, required: true
          // }
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
  router.route('/update/:param_id').put(async (req, res) => {
    try {
      // const id = req.body.id;
      const updatemasterID = req.params.param_id;
      const name = req.body.name;
      const userId = req.query.userId;

      // Check if the costcenter already exists in the table for other records
      const existingData = await CostCenter.findOne({
        where: {
          name: name,
          id: { [Op.ne]: updatemasterID }, // Exclude the current record
        },
      });
  
      if (existingData) {
        res.status(201).send('Exist');
      } else {
  
        // Update the record in the table
        const [affectedRows] = await CostCenter.update(
          {
            name: req.body.name,
            // col_id: req.body.col_id,
            description: req.body.description,
            status: req.body.status,
          },
          {
            where: { id: updatemasterID },
          }
        );
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Cost Center: Updated the information for ${req.body.name}`
        }); 
  
        res.status(200).json({ message: "Data updated successfully", affectedRows });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });

  //Delete
  router.route('/delete/:param_id').delete(async (req, res) => {
    try {
      const id = req.params.param_id;
      const userId = req.query.userId;

      const costcenterData = await CostCenter.findOne({
        where : {
          id: id
        },
      })
      
      const ccname = costcenterData.name;

      const deletionResult = await CostCenter.destroy({
        where : {
          id: id
        },
      });

      if(deletionResult) {
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Cost Center: Deleted the data of ${ccname}`,
        });
        res.json({success : true})
      } else {
        res.status(400).json({success : false})
      }

    } catch (err) {
      console.error(err);
    }
});

router.route('/statusupdate').put(async (req, res) => {
  try {
    const { costCenterId, status, userId } = req.body;

    const updateData = { status: status };

    // if (status === 'Archive') {
    //   updateData.archive_date = new Date();
    // }

    for (const costcenterId of costCenterId) {
      const data = await CostCenter.findOne({
        where: { id: costcenterId} 
      });

      const costname = data.name;
      const currentstatus = data.status;

      if(data) {
      const updateStatus = await CostCenter.update(updateData, { 
        where: { id: costCenterId } 
      });
      
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Cost Center: ${costname} Updated status from ${currentstatus} to ${status}`
        })
      }
    };

    

    res.status(200).json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


 
module.exports = router;