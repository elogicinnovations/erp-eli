const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const PR_PO = require('../db/models/pr_toPO.model')
const {PR, PR_PO, PR_history} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route('/fetchView').get(async (req, res) => {
    try {
     
      const data = await PR_PO.findAll({
        where: {
         pr_id: req.query.id
  
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

router.route('/save').post(async (req, res) => {
    try {
       const {id, addProductbackend} = req.body;
        
   

          

          for (const prod of addProductbackend) {
            const prod_quantity = prod.quantity;
            const taggedIDSUpplier = prod.tagSupplier_ID;



            await PR_PO.create({
                pr_id: id,
                quantity: prod_quantity, 
                product_tag_supplier_ID: taggedIDSUpplier,
                         
            });
          }
            await PR.update({
                status: 'For-Approval (PO)',
            },
            {
                where: { id: id }
            }); 

          const PR_historical = await PR_history.create({
            pr_id: id,
            status: 'For-Approval (PO)',
            remarks: null,
          });
    
    
          res.status(200).json();
        
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});




module.exports = router;