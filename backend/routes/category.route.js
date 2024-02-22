const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Category = require('../db/models/category.model')
const { Category, Product, Activity_Log } = require("../db/models/associations"); 
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
          const userID = req.body.userId;
          const lastCategory = await Category.findOne({
            order: [['createdAt', 'DESC']]
        });
        
        let newCategoryCode;
        if (lastCategory) {
            const lastCode = lastCategory.category_code;
            const lastNumber = parseInt(lastCode.substring(1), 10);
            newCategoryCode = 'C' + (lastNumber + 1).toString().padStart(6, '0');
        } else {
            newCategoryCode = 'C000001'; // Initial category code
        }

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
            category_code: newCategoryCode,
            category_name: req.body.categoryName,
            category_remarks: req.body.categoryRemarks
          });

          await Activity_Log.create({
            masterlist_id: userID,
            action_taken: `Created a new category named ${req.body.categoryName}`
          }); 

          res.status(200).json(newData);
          // console.log(newDa)
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});

router.route('/getNextCategoryCode').get(async (req, res) => {
  try {
      const lastCategory = await Category.findOne({
          order: [['createdAt', 'DESC']]
      });

      let nextCategoryCode;
      if (lastCategory) {
          const lastCode = lastCategory.category_code;
          const lastNumber = parseInt(lastCode.substring(1), 10);
          nextCategoryCode = 'C' + (lastNumber + 1).toString().padStart(6, '0');
      } else {
          nextCategoryCode = 'C000001'; // Initial category code
      }

      res.json({ nextCategoryCode });
  } catch (err) {
      console.error(err);
      res.status(500).json("Error");
  }
});

// router.route('/importCategory').post(upload.single('file'), async (req, res) => {
//     try {
//       const results = [];
//       const fileStream = fs.createReadStream(req.file.path)
//       console.log(results)
//         .pipe(csv())
//         .on('data', (data) => results.push(data))
//         .on('end', async () => {
//           console.log(data)
//           const mappedData = results.map((csvRow) => {
//             return {
//               category_code: csvRow.Code,
//               category_name: csvRow.Name,
//               category_remarks: csvRow.Remarks,
//             };
//           });
  
//           await Category.bulkCreate(mappedData);
//           res.json({ success: true, data: mappedData });
//         });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
//     fs.unlinkSync(req.file.path);
//   });


router.route('/update/:param_id').put(async (req, res) => {
    try {
      const name = req.body.category_name;
      const updatemasterID = req.params.param_id;
      const userId = req.query.userId;
  
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

        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Updated the information of category ${req.body.category_name}`
        }); 
        res.status(200).json({ message: "Data updated successfully", affectedRows });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });


// router.route('/delete/:table_id').delete(async (req, res) => {
//     const id = req.params.table_id;
    
//     await Product.findAll({
//       where: {
//         product_category: id,
//       },
//     })
//       .then((check) => {
//         if (check && check.length > 0) {
//           res.status(202).json({ success: true });
//         }

//         else{
//            Category.destroy({
//             where : {
//               category_code: id
//             }
//           }).then(
//               (del) => {
//                   if(del){
//                       res.json({success : true})
//                   }
//                   else{
//                       res.status(400).json({success : false})
//                   }
//               }
//           ).catch(
//               (err) => {
//                   console.error(err)
//                   res.status(409)
//               }
//           );
//         }
//       })
   
// });


router.route('/delete/:table_id').delete(async (req, res) => {
  try {
    const id = req.params.table_id;
    const userId = req.query.userId;

    const productsToDelete = await Product.findAll({
      where: {
        product_category: id,
      },
    });

    if (productsToDelete && productsToDelete.length > 0) {
      res.status(202).json({ success: true });
    } else {
      const categoryData = await Category.findOne({
        where: {
          category_code: id,
        },
      });

      const categoryname = categoryData.category_name;

      const deletionResult = await Category.destroy({
        where: {
          category_code: id,
        },
      });

      if (deletionResult) {
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Deleted the data category ${categoryname}`,
        });
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false, message: 'Deletion failed' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


module.exports = router;
