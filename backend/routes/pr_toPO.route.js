const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const PR_PO = require('../db/models/pr_toPO.model')
const { PR, PR_PO,
        PR_PO_asmbly,
        PR_PO_spare,
        PR_PO_subpart, 
        PR_history, 
        ProductTAGSupplier, 
        Product, Supplier, 
        Assembly, 
        Assembly_Supplier,  
        SparePart, 
        SparePart_Supplier, 
        SubPart,
        Subpart_supplier
      } = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route('/fetchView_product').get(async (req, res) => {
    try {
     
      const data = await PR_PO.findAll({
        include: [{
          model: ProductTAGSupplier,
          required: true,

          include: [{
            model: Product,
            required: true

          },
          {
            model: Supplier,
            required: true
          }]
        }],
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


  router.route('/fetchView_asmbly').get(async (req, res) => {
    try {
     
      const data = await PR_PO_asmbly.findAll({
        include: [{
          model: Assembly_Supplier,
          required: true,

          include: [{
            model: Assembly,
            required: true

          },
          {
            model: Supplier,
            required: true
          }]
        }],
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

  
  router.route('/fetchView_spare').get(async (req, res) => {
    try {
     
      const data = await PR_PO_spare.findAll({
        include: [{
          model: SparePart_Supplier,
          required: true,

          include: [{
            model: SparePart,
            required: true

          },
          {
            model: Supplier,
            required: true
          }]
        }],
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

  router.route('/fetchView_subpart').get(async (req, res) => {
    try {
     
      const data = await PR_PO_subpart.findAll({
        include: [{
          model: Subpart_supplier,
          required: true,

          include: [{
            model: SubPart,
            required: true

          },
          {
            model: Supplier,
            required: true
          }]
        }],
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
       const {id, addProductbackend, addAssemblybackend, addSparebackend, addSubpartbackend} = req.body;
        
   

          
        /// inserting Product canvass supplier product 
          for (const prod of addProductbackend) {
            const prod_quantity = prod.quantity;
            const taggedIDSUpplier = prod.tagSupplier_ID;



            await PR_PO.create({
                pr_id: id,
                quantity: prod_quantity, 
                product_tag_supplier_ID: taggedIDSUpplier,
                         
            });
          }


           /// inserting Product canvass supplier assembly 
           for (const asmbly of addAssemblybackend) {
            const prod_quantity = asmbly.quantity;
            const taggedIDSUpplier = asmbly.tagSupplier_ID;



            await PR_PO_asmbly.create({
                pr_id: id,
                quantity: prod_quantity, 
                assembly_suppliers_ID: taggedIDSUpplier,
                         
            });
          }

          /// inserting Product canvass supplier spare 
          for (const sparepart of addSparebackend) {
          const prod_quantity = sparepart.quantity;
          const taggedIDSUpplier = sparepart.tagSupplier_ID;



          await PR_PO_spare.create({
              pr_id: id,
              quantity: prod_quantity, 
              spare_suppliers_ID: taggedIDSUpplier,       
          });
        }

         /// inserting Product canvass supplier subpart 
         for (const subpart of addSubpartbackend) {
          const prod_quantity = subpart.quantity;
          const taggedIDSUpplier = subpart.tagSupplier_ID;



          await PR_PO_subpart.create({
              pr_id: id,
              quantity: prod_quantity, 
              subpart_suppliers_ID: taggedIDSUpplier,       
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


router.route('/approve_PO').post(async (req, res) => {
  try {
     const {id} = req.body;

     console.log(id)
      
        const PR_newData = await PR.update({
          status: 'To-Receive'
        },
        {
          where: { id: id }
        }); 

        const PR_historical = await PR_history.create({
          pr_id: id,
          status: 'To-Receive',
        });

      //  return console.log(id)

        
      res.status(200).json();
      
      
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
});


router.route('/received').post(async (req, res) => {
  try {
    const {totalValue, id, quantityReceived, qualityAssurance} = req.body;
     
       const received_newData = await PR_PO.update({
        quantity_received: totalValue,
        quality_assurance: qualityAssurance,
       },
       {
         where: { id: id }
       }); 
       console.log()
       
     res.status(200).json();
     
     
   } catch (err) {
     console.error(err);
     res.status(500).send('An error occurred');
   }
});
module.exports = router;