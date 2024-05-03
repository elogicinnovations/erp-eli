const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const BinLocation = require('../db/models/binLocation.model')
const { BinLocation, Product, Activity_Log } = require("../db/models/associations"); 
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route('/fetchTable').get(async (req, res) => {
    try {
    //   const data = await MasterList.findAll({
    //     include: {
    //       model: UserRole,
    //       required: false,
    //     },
    //   });
      const data = await BinLocation.findAll({
        order: [['createdAt', 'DESC']],
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


router.route('/create').post(async (req, res) => {
    try {
      const userID = req.body.userId;
      // Check if the supplier code is already exists in the table
      const existingDataCode = await BinLocation.findAll({
        where: {
          bin_name: req.body.binLocationName,
          bin_subname:  req.body.binLocationSubName 
          // [Op.or] : [
          //   { bin_name: { [Op.eq] : req.body.binLocationName } },
          //   { bin_subname: { [Op.eq] : req.body.binLocationSubName } },
          // ]
        },
      });
  
      console.log("Existing: ", existingDataCode.length);

      if (existingDataCode.length > 0) {
        res.status(201).send('Exist');
      } 
      else {
      const newData = await BinLocation.create({
            bin_name: req.body.binLocationName,
            bin_subname: req.body.binLocationSubName,
            bin_remarks: req.body.binLocationRemarks
          });
    
          await Activity_Log.create({
            masterlist_id: userID,
            action_taken: `Created a new Bin Location named ${req.body.binLocationName}`
          }); 

          res.status(200).json(newData);
          // console.log(newDa)
        }
        } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});



router.route('/update/:param_id').put(async (req, res) => {
    try {
      const name = req.body.bin_name;
      const id = req.params.param_id;
      const userId = req.query.userId;
  
      // Check if the email already exists in the table for other records
      const existingData = await BinLocation.findOne({
        where: {
            bin_name: name,
            bin_subname: req.body.bin_subname,
            bin_id: { [Op.ne]: id }, // Exclude the current record
        },
      });
  
      if (existingData) {
        res.status(202).send('Exist');
      } else {
  
        // Update the record in the table
        const [affectedRows] = await BinLocation.update(
          {
            bin_name: req.body.bin_name,
            bin_subname: req.body.bin_subname,
            bin_remarks: req.body.bin_remarks,
          },
          {
            where: { bin_id: id },
          }
        );
  
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Updated the information of Bin location ${req.body.bin_name}`
        });

        res.status(200).json({ message: "Data updated successfully", affectedRows });
        console.log(affectedRows)
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });


  router.route('/delete/:table_id').delete(async (req, res) => {
    try {
      const id = req.params.table_id;
      const userId = req.query.userId;

      const productsToDelete = await Product.findAll({
        where: {
            product_location: id,
        },
      })

      if (productsToDelete && productsToDelete.length > 0) {
        res.status(202).json({ success: true });
      } else {
         const binLocationData = await BinLocation.findOne({
            where : {
              bin_id: id
            },
         });

         const binlocationname = binLocationData.bin_name;

         const deletionResult = await BinLocation.destroy({
              where : {
                bin_id: id
              },
          });

          if(deletionResult){
            await Activity_Log.create({
              masterlist_id: userId,
              action_taken: `Deleted the data of Bin location ${binlocationname}`,
            });
            res.json({success : true})
          } else {
            res.status(400).json({success : false})
          }
      }
    } catch (error) {
      console.error(error);
    }
  });  

// router.route('/delete/:table_id').delete(async (req, res) => {
//     const id = req.params.table_id;

//     await Product.findAll({
//         where: {
//             product_location: id,
//         },
//       })
//         .then((check) => {
//           if (check && check.length > 0) {
//             res.status(202).json({ success: true });
//           }
//           else{
//              BinLocation.destroy({
//                 where : {
//                   bin_id: id
//                 }
//             }).then(
//                 (del) => {
//                     if(del){
//                         res.json({success : true})
//                     }
//                     else{
//                         res.status(400).json({success : false})
//                     }
//                 }
//             ).catch(
//                 (err) => {
//                     console.error(err)
//                     res.status(409)
//                 }
//             );
//           }


//         })
    
// });




module.exports = router;