const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const SubPart = require('../db/models/subpart.model')
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
      const data = await SubPart.findAll();
  
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
      const { subPartCode, subPartName, supplier, subPartDesc } = req.body;
  
      // // Validate the request data
      // if (!subPartCode || !subPartName || !supplier) {
      //   return res.status(400).json({ error: 'Missing required data' });
      // }
  
      // Check for an existing SubPart
      const existingSubPart = await SubPart.findOne({
        where: {
          subPart_code: subPartCode,
        },
      });
  
      if (existingSubPart) {
        return res.status(201).json({ error: 'SubPart with the same code already exists' });
      }
  
      // Create a new SubPart
      const newSubPart = await SubPart.create({
        subPart_code: subPartCode,
        subPart_name: subPartName,
        supplier: supplier,
        subPart_desc: subPartDesc, // You can provide an empty string or null if it's not provided
      });
  
      return res.status(200).json(newSubPart);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  


  router.route('/update/:param_id').put(async (req, res) => {
    try {
      const { subPart_code, subPart_name, supplier, subPart_desc } = req.body;
      const updatemasterID = req.params.param_id;
      console.log('id:' + updatemasterID)
      console.log('code:' + subPart_code)


      // Check if the email already exists in the table for other records
      const existingData = await SubPart.findOne({
        where: {
          subPart_code: subPart_code,
          id: { [Op.ne]: updatemasterID }, // Exclude the current record
        },
      });
  
      if (existingData) {
        res.status(202).send('Exist');
      } else {
  
        // Update the record in the table
        const [affectedRows] = await SubPart.update(
          {
            subPart_code: subPart_code.toUpperCase(),
            subPart_name: subPart_name,
            supplier: supplier,
            subPart_desc: subPart_desc,
          },
          {
            where: { id: updatemasterID },
          }
        );
  
        res.status(200).json({ message: "Data updated successfully", affectedRows });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });

  // router.route('/update/:param_id').put(async (req, res) => {
  //   try {
  //     const param_id = req.params.param_id;
  
  //     const { subPart_name, supplier, subPart_desc } = req.body;
  
  //     if (!subPart_name || !supplier) {
  //       return res.status(201).json({ error: 'Missing required data' });
  //     }
  
  //     // Update the SubPart
  //     const existingSubPart = await SubPart.findOne({
  //       where: {
  //         subPart_code: param_id,
  //       },
  //     });
  
  //     if (existingSubPart) {
  //       return res.status(202).json({ message: 'Record not found' });
  //     }
  
  //     existingSubPart.subPart_name = subPart_name;
  //     existingSubPart.supplier = supplier;
  //     existingSubPart.subPart_desc = subPart_desc;
  
  //     // Save the changes
  //     await existingSubPart.save();
  
  //     return res.status(200).json({ message: 'Data updated successfully' });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }
  // });
  
  
  router.route('/delete/:subPartId').delete(async (req, res) => {
    const subPartId = req.params.subPartId;
  
    try {
      // Delete the SubPart record
      const deletedRows = await SubPart.destroy({
        where: {
          id: subPartId,
        },
      });
  
      if (deletedRows > 0) {
        return res.json({ success: true, message: 'SubPart record deleted successfully' });
      } else {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'An error occurred' });
    }
  });
  
  

module.exports = router;