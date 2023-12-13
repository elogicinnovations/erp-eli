const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Category = require('../db/models/category.model')
const { Category, Product } = require("../db/models/associations"); 
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
      const data = await Category.findAll();
  
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
      

        // Check if the supplier code is already exists in the table
        const existingDataCode = await Category.findAll({
          where: {
            [Op.or] : [
              { category_code: { [Op.eq] : req.body.categoryCode }},
              { category_name : { [Op.eq] : req.body.categoryName }}
            ]
          },
        });
    
        if (existingDataCode.length > 0) {
          res.status(201).send('Exist');
        } else {
          const newData = await Category.create({
            category_code: req.body.categoryCode,
            category_name: req.body.categoryName,
            category_remarks: req.body.categoryRemarks
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
      const name = req.body.category_name;
      const updatemasterID = req.params.param_id;
      // console.log(updatemasterID)
  
      // Check if the email already exists in the table for other records
      const existingData = await Category.findOne({
        where: {
        category_name: name,
          category_code: { [Op.ne]: updatemasterID }, // Exclude the current record
        },
      });
  
      if (existingData) {
        res.status(202).send('Exist');
      } else {
  
        // Update the record in the table
        const [affectedRows] = await Category.update(
          {
            category_name: req.body.category_name,
            category_remarks: req.body.category_remarks,
          },
          {
            where: { category_code: updatemasterID },
          }
        );
  
        res.status(200).json({ message: "Data updated successfully", affectedRows });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });


router.route('/delete/:table_id').delete(async (req, res) => {
    const id = req.params.table_id;
    await Product.findAll({
      where: {
        product_category: id,
      },
    })
      .then((check) => {
        if (check && check.length > 0) {
          res.status(202).json({ success: true });
        }

        else{
           Category.destroy({
            where : {
              category_code: id
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
        }
      })
   
});




module.exports = router;
