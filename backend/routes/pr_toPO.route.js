const router = require('express').Router()
const {where, Op, fn, col} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
// const PR_PO = require('../db/models/pr_toPO.model')
const { PR, PR_PO,
        PR_PO_asmbly,
        PR_PO_spare,
        PR_PO_subpart, 
        PR_history, 
        ProductTAGSupplier, 
        Product, 
        Supplier,
        Assembly, 
        Assembly_Supplier,  
        SparePart, 
        SparePart_Supplier, 
        SubPart,
        Subpart_supplier,
        Inventory,
        Inventory_Assembly,
        Inventory_Spare,
        Inventory_Subpart
      } = require('../db/models/associations')
const session = require('express-session');

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



  //for approval view
  // router.route('/fetchCanvassedSupplier_spare').get(async (req, res) => {
  //   try {
  //     const data = await PR_PO_spare.findAll({
  //       attributes: [
  //         'sparepart_supplier.supplier_code',
  //         // [fn('SUM', col('quantity')), 'total_quantity'],
  //         // [fn('SUM', col('sparepart_supplier.supplier_price')), 'total_price'],
  //         [fn('MAX', col('purchase_req_canvassed_spare.id')), 'spres_id'],
  //         // 'sparepart_supplier.id', // Include the 'id' column in the SELECT list
  //         // Add other aggregated columns or use sequelize.literal for complex expressions
  //       ],
  //       group: [
  //         'sparepart_supplier.supplier_code',
  //       ],
  //     });
  
     
  //     if (data) {
  //       return res.json(data);
  //     } else {
  //       res.status(400);
  //     }
  //   } catch (error) {
  //     // Handle errors
  //     console.error(error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // });



  router.route('/fetchCanvassedSupplier_spare').get(async (req, res) => {
    try {
      const data_quantity = await PR_PO_spare.findAll({
        attributes: [
          'sparepart_suppliers.supplier_code',
          [fn('SUM', col('quantity')), 'total_quantity'],
          [fn('SUM', col('sparepart_supplier.supplier_price')), 'total_price'],
        ],
        include: [{
          model: SparePart_Supplier,
          required: true,
          attributes: ['supplier_code'],

            include: [{
              model: Supplier,
              required: true
            }],


          // where: {
          //   id: col('spare_suppliers_ID'), // Assuming 'id' is the primary key in Supplier_SparePart
          // },
        }],
        group: ['sparepart_supplier.supplier_code'], // Group by supplier code
      });
  
      res.json(data_quantity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  // router.route('/').get(async (req, res) => {
  //   try {
  //     const data = await PR_history.findAll({
  //       where: {
  //         isRead: false, // Fetch only unread notifications
  //       },
  //       attributes: ['pr_id', [sequelize.fn('max', sequelize.col('createdAt')), 'latestCreatedAt']],
  //       group: ['pr_id'],
  //       raw: true,
  //     });
  
  //     const prIds = data.map(entry => entry.pr_id);
  
  //     const latestData = await PR_history.findAll({
  //       where: {
  //         pr_id: {
  //           [Op.in]: prIds,
  //         },
  //         createdAt: {
  //           [Op.in]: data.map(entry => entry.latestCreatedAt),
  //         },
  //       },
  //     });
  
  //     if (latestData) {
  //       return res.json(latestData);
  //     } else {
  //       res.status(400);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json("Error");
  //   }
  // });
  
  


  //save
router.route('/save').post(async (req, res) => {
  try {
    const { id, productArrays } = req.body;
  
    // Loop through the productArrays
    Object.entries(productArrays).forEach(([supplierCode, products]) => {
      console.log(`Supplier ${supplierCode}:`);
  
      // Create a new PDF document
      const doc = new PDFDocument();
  
      // Add content to the PDF
      products.forEach((item, index) => {
        console.log(`${item.code} => ${item.name}`);
        console.log(`Supplier_email ${item.supp_email}:`);
  
        doc.fontSize(12).text(`Product: ${item.code} => ${item.name}`, 50, 50).moveDown();
      });
  
      // Finalize the PDF document
      doc.end();
  
      // Pipe the PDF content to a buffer
      const pdfBuffer = [];
      doc.on('data', (chunk) => {
        pdfBuffer.push(chunk);
      });
  
      doc.on('end', () => {
        // Concatenate the chunks into a single buffer
        const pdfContent = Buffer.concat(pdfBuffer);
  
        // Create a nodemailer transporter
        const gmailEmail = "infintyerpslash@gmail.com";
        const gmailPassword = "kaaokvxtaahuckvp";
  
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailEmail,
            pass: gmailPassword,
          },
        });
  
        // Define email options
        const mailOptions = {
          from: gmailEmail,
          to: products[0].supp_email, // Use the email of the first product's supplier
          subject: 'PDF Attachment',
          text: 'Check out the attached PDF!',
          attachments: [
            {
              filename: 'output.pdf',
              content: pdfContent,
            },
          ],
        };
  
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log('Error sending email:', error);
          }
          console.log('Email sent:', info.response);
        });
      });
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


router.route('/receivedPRD').post(async (req, res) => {
  try {
    const {totalValue, id, prd_supplierID} = req.body;
    const destination = 'Agusan Del Sur'; 
       const received_newData = await PR_PO.update({
        quantity_received: totalValue,
       },
       {
         where: { id: id }
       }); 

        await Inventory.update({
          quantity: totalValue,
          warehouse: destination,
       },
       {
         where: { product_tag_supp_id: prd_supplierID }
       }); 

    
       
     res.status(200).json();
     
     
   } catch (err) {
     console.error(err);
     res.status(500).send('An error occurred');
   }
});

router.route('/receivedPRDQA').post(async (req, res) => {
  try {
    const {qualityAssurancePRD, id } = req.body;

    console.log(qualityAssurancePRD)

        const receivedQA_newData = await PR_PO.update({
        quality_assurance: qualityAssurancePRD,
       },
       {
         where: { id: id }
       }); 

       
     res.status(200).json();
     
     
   } catch (err) {
     console.error(err);
     res.status(500).send('An error occurred');
   }
});


router.route('/update_remarks').post(async (req, res) => {
  try {
    const {remarks, id} = req.query;

    console.log(id + remarks)
     
       const received_newData = await PR.update({
        remarks: remarks
       },
       {
         where: { id: id }
       }); 
      
       
     res.status(200).json();
     
     
   } catch (err) {
     console.error(err);
     res.status(500).send('An error occurred');
   }
});


router.route('/transactionDelivered').post(async (req, res) => {
  try {
    const {id} = req.query;

    // console.log(id + remarks)
     
       const received_newData = await PR.update({
        status: 'Delivered'
       },
       {
         where: { id: id }
       }); 
      //  console.log()
       
     res.status(200).json();
     
     
   } catch (err) {
     console.error(err);
     res.status(500).send('An error occurred');
   }
});


router.route('/receivedAssembly').post(async (req, res) => {
  try {
    const {totalValue, id, qualityAssuranceASM, asm_suppID} = req.body;
    const destination = 'Agusan Del Sur';
     
       const received_newData = await PR_PO_asmbly.update({
        quantity_received: totalValue,
        quality_assurance: qualityAssuranceASM,
       },
       {
         where: { id: id }
       }); 
       await Inventory_Assembly.update({
        quantity: totalValue,
        warehouse: destination,
     },
     {
       where: { assembly_tag_supp_id: asm_suppID }
     }); 
       
     res.status(200).json();
     
     
   } catch (err) {
     console.error(err);
     res.status(500).send('An error occurred');
   }
});

router.route('/receivedSparePart').post(async (req, res) => {
  try {
    const {totalValue, id, qualityAssuranceSpare, spare_suppID} = req.body;
    const destination = 'Agusan Del Sur';

       const received_newData = await PR_PO_spare.update({
        quantity_received: totalValue,
        quality_assurance: qualityAssuranceSpare,
       },
       {
         where: { id: id }
       }); 


       await Inventory_Spare.update({
        quantity: totalValue,
        warehouse: destination,
        },
        {
          where: { spare_tag_supp_id: spare_suppID }
        }); 
       
     res.status(200).json();
     
     
   } catch (err) {
     console.error(err);
     res.status(500).send('An error occurred');
   }
});

router.route('/receivedSubPart').post(async (req, res) => {
  try {
    const {totalValue, id, subpart_suppID, qualityAssuranceSub} = req.body;
    const destination = 'Agusan Del Sur';
       const received_newData = await PR_PO_subpart.update({
        quantity_received: totalValue,
        quality_assurance: qualityAssuranceSub,
       },
       {
         where: { id: id }
       }); 
       await Inventory_Subpart.update({
        quantity: totalValue,
        warehouse: destination,
     },
     {
       where: { subpart_tag_supp_id: subpart_suppID }
     }); 
       
     res.status(200).json();
     
     
   } catch (err) {
     console.error(err);
     res.status(500).send('An error occurred');
   }
});

module.exports = router;