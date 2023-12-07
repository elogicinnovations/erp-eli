const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const PR = require('../db/models/pr.model')
const {PR, PR_product, PR_history, PR_PO} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));



router.route('/fetchTable').get(async (req, res) => {
    try {
     
      const data = await PR.findAll();
  
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

  
router.route('/fetchTable_PO').get(async (req, res) => {
  try {
   
    const data = await PR.findAll({
      where: {
        [Op.or]: [
          { status: 'For-Canvassing' },
          { status: 'For-Approval (PO)' },
          { status: 'For-Rejustify (PO)' },
          { status: 'To-Receive' }
        ]
      }
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

router.route('/fetchTable_PO_view').get(async (req, res) => {
  try {
   
    const data = await PR.findAll({
      where: {
       id: req.query.id

      }
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


  router.route('/fetchView').get(async (req, res) => {
    try {
     
      const data = await PR.findOne({
          where: {
            id: req.query.id
          }
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


router.route('/lastPRNumber').get(async (req, res) => {
    try {

        const latestPR = await PR.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('pr_num')), 'latestPRNumber']],
          });
        const latestPRNumber = latestPR.getDataValue('latestPRNumber');

        // console.log('Latest PR Number:', latestPRNumber);
        return res.json(latestPRNumber);


    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });

  
router.route('/create').post(async (req, res) => {
    try {
       const {prNum, dateNeed, useFor, remarks, addProductbackend} = req.body;
        
          const PR_newData = await PR.create({
            pr_num: prNum,
            date_needed: dateNeed,
            used_for: useFor,
            remarks: remarks,
            status: 'For-Approval'
          });
          const createdID = PR_newData.id;
          const PR_historical = await PR_history.create({
            pr_id: createdID,
            status: 'For-Approval',
            remarks: remarks,
          });

          

          for (const prod of addProductbackend) {
            const prod_value = prod.value;
            const prod_quantity = prod.quantity;
            const prod_desc = prod.desc;

            await PR_product.create({
                pr_id: createdID,
                product_id: prod_value,
                quantity: prod_quantity,
                description: prod_desc,              
            });
          }
    
    
          res.status(200).json();
        
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});


router.route('/approve').post(async (req, res) => {
  try {
     const {id} = req.query;
      
        const PR_newData = await PR.update({
          status: 'For-Canvassing'
        },
        {
          where: { id: id }
        }); 

        const PR_historical = await PR_history.create({
          pr_id: id,
          status: 'For-Canvassing',
        });

      //  return console.log(id)

        
      res.status(200).json();
      
      
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
});


router.route('/update').post(async (req, res) => {
  try {
     const {id, prNum, dateNeed, useFor, remarks, addProductbackend} = req.query;
      
        const PR_newData = await PR.update({
          pr_num: prNum,
          date_needed: dateNeed,
          used_for: useFor,
          remarks: remarks,
          status: 'For-Approval'
        },
        {
          where: { id: req.query.id}
        });
        const updatedID = PR_newData.id;    

      //  return console.log(id)

      if (!Array.isArray(addProductbackend)) {
        return res.status(200).json();
      } else {
        const deletePR_prod = PR_product.destroy({
          where : {
            pr_id: id
          }
        })
        if(deletePR_prod){
          for (const prod of addProductbackend) {
            const prod_value = prod.value;
            const prod_quantity = prod.quantity;
            const prod_desc = prod.desc;

            await PR_product.create({
                pr_id: id,
                product_id: prod_value,
                quantity: prod_quantity,
                description: prod_desc,              
            });
          }
        }
      }
        
        
      res.status(200).json();
      
      
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
});

router.route('/cancel').put(async (req, res) => {
    try {
       const {row_id} = req.body;
        
       const [affectedRows] = await PR.update(
        {
          status: 'Cancelled'
        },
        {
          where: { id: row_id },
        }
      );

      const PR_historical = await PR_history.create({
        pr_id: row_id,
        status: 'Cancelled',
      });
    
          res.status(200).json();
        
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});

router.route('/cancel_PO').put(async (req, res) => {
  try {
     const {row_id} = req.body;
      
     const [affectedRows] = await PR.update(
      {
        status: 'For-Canvassing'
      },
      {
        where: { id: row_id },
      }
    );

    const PR_historical = await PR_history.create({
      pr_id: row_id,
      status: 'For-Canvassing',
      remarks: 'Cancelled PO - Re Canvassing'
    });


    const deletePR_prod = PR_PO.destroy({
      where : {
        pr_id: row_id
      }
    })
    if(deletePR_prod){

    }
  
        res.status(200).json();
      
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
});



module.exports = router;