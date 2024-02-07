const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { PR_PO, PR_PO_asmbly, PR_PO_spare, PR_PO_subpart, 
        PR, PR_history, Assembly_Supplier, Assembly, Product, 
        SparePart, SubPart, ProductTAGSupplier, Subpart_supplier,
        SparePart_Supplier, Supplier
      } = require('../db/models/associations')
const session = require('express-session')
const { Parser } = require('json2csv');
const nodemailer = require('nodemailer');

router.route('/lastPONumber').get(async (req, res) => {
  try {
    const latestPR = await PR_PO.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('po_id')), 'latestNumber']],
    });
    let latestNumber = latestPR.getDataValue('latestNumber');

    // console.log('Latest Number:', latestNumber);

    // Increment the latestNumber by 1 for a new entry
    latestNumber = latestNumber !== null ? (parseInt(latestNumber, 10)).toString() : '0';
    // console.log('string Number:', latestNumber.padStart(8, '0'));

    // Do not create a new entry, just return the incremented value
    return res.json(latestNumber.padStart(8, '0'));
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
  });

  
router.route('/save').post(async (req, res) => {
  try {
    const arrayPO = req.body.arrayPO
    const PR_id = req.body.pr_id
    for (const parent of arrayPO) {
      const po_number = parent.title

      for (const child of parent.serializedArray) {
        const quantity = child.quantity
        const type = child.type
        const prod_supp_id = child.prod_supplier

        // console.log(`quantity${quantity} type ${type}`)
        

            if (type === 'product') {
              PR_PO.create({
                  pr_id: PR_id,
                  po_id: po_number,
                  quantity: quantity,
                  product_tag_supplier_ID: prod_supp_id
              });           
          } else if(type === 'assembly'){
              PR_PO_asmbly.create({
                pr_id: PR_id,
                po_id: po_number,
                quantity: quantity,
                assembly_suppliers_ID: prod_supp_id
              });           
          } else if(type === 'spare'){
              PR_PO_spare.create({
                pr_id: PR_id,
                po_id: po_number,
                quantity: quantity,
                spare_suppliers_ID: prod_supp_id
              });           
          } else if(type === 'subpart'){
              PR_PO_subpart.create({
                pr_id: PR_id,
                po_id: po_number,
                quantity: quantity,
                subpart_suppliers_ID: prod_supp_id
              });           
          }
      }    
    }

    const PR_update = PR.update({
      status: 'For-Approval (PO)'
    },
    {
      where: { id: PR_id }
    }); 

    if (PR_update){
      const PR_historical = PR_history.create({
        pr_id: PR_id,
        status: 'For-Approval (PO)'
      });


      if(PR_historical){
        return res.status(200).json()
      }    
    }

  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
  });

  router.route('/fetchPOarray').get(async (req, res) => {
    try {
      const pr_id = req.query.id;
  
      // Fetch data from all four tables with the specified pr_id
      const prPoData = await PR_PO.findAll({
        include: [{
          model: ProductTAGSupplier,
          required: true,

            include: [{
              model: Product,
              required: true,
              attributes: [
                ['product_code', 'code'],
                ['product_name', 'name'],
              ],
            
            },
            {
              model: Supplier,
              required: true
            }] 
        }],
        where: { pr_id: pr_id },
      });
  
      const prPoAsmblyData = await PR_PO_asmbly.findAll({
        include: [{
          model: Assembly_Supplier,
          required: true,

            include: [{
              model: Assembly,
              required: true,
              attributes: [
                ['assembly_code', 'code'],
                ['assembly_name', 'name'],
              ],
            },
            {
              model: Supplier,
              required: true
            }
          ] 
        }],
        where: { pr_id: pr_id },
      });
  
      const prPoSpareData = await PR_PO_spare.findAll({
        include: [{
          model: SparePart_Supplier,
          required: true,

            include: [{
              model: SparePart,
              required: true,
              attributes: [
                ['spareParts_code', 'code'],
                ['spareParts_name', 'name'],
              ],
            },
            {
              model: Supplier,
              required: true
            }] 
        }],
        where: { pr_id: pr_id },
      });
  
      const prPoSubpartData = await PR_PO_subpart.findAll({
        include: [{
          model: Subpart_supplier,
          required: true,

            include: [{
              model: SubPart,
              required: true,
              attributes: [
                ['subPart_code', 'code'],
                ['subPart_name', 'name'],
              ],
            },
            {
              model: Supplier,
              required: true
            }] 
        }],
        where: { pr_id: pr_id },
      });
  
      // Consolidate data into an object with po_id as keys
      const consolidatedObject = {};
  
      prPoData.forEach(item => {
        const po_id = item.po_id;
        consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
        consolidatedObject[po_id].items.push({item, supp_tag: item.product_tag_supplier.product, suppliers: item.product_tag_supplier.supplier});
      });
  
      prPoAsmblyData.forEach(item => {
        const po_id = item.po_id;
        consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: []};
        consolidatedObject[po_id].items.push({item, supp_tag: item.assembly_supplier.assembly, suppliers: item.assembly_supplier.supplier });
      });
  
      prPoSpareData.forEach(item => {
        const po_id = item.po_id;
        consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
        consolidatedObject[po_id].items.push({item, supp_tag: item.sparepart_supplier.sparePart, suppliers: item.sparepart_supplier.supplier });
      });
  
      prPoSubpartData.forEach(item => {
        const po_id = item.po_id;
        consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
        consolidatedObject[po_id].items.push({item, supp_tag: item.subpart_supplier.subPart, suppliers: item.subpart_supplier.supplier});
      });
  
      // Convert the object values back to an array
      const consolidatedArray = Object.values(consolidatedObject);
  
      // Sort the consolidated array by po_id
      // consolidatedArray.forEach(group => {
      //   group.items.sort((a, b) => a.po_id.localeCompare(b.po_id));
      // });
  
      // console.log(consolidatedArray);
  
      res.status(200).json(consolidatedArray);
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });


  router.route('/approve_PO').post(async (req, res) => {
    try {
      const { id, POarray } = req.body;
      
      // Create an object to store items for each supplier
      const itemsBySupplier = {};
      // Create a nodemailer transporter
          const gmailEmail = "sbfmailer@gmail.com";
          const gmailPassword = "uoetasnknsroxwnq";
  
      // Iterate through the POarray to gather items for each supplier
      POarray.forEach(parent => {
        parent.items.forEach(child => {
          const supplierEmail = child.suppliers.supplier_email;
  
          // If the supplier doesn't exist in the object, initialize it with an empty array
          if (!itemsBySupplier[supplierEmail]) {
            itemsBySupplier[supplierEmail] = [];
          }
  
          // Push the item details to the corresponding supplier's array
          itemsBySupplier[supplierEmail].push({
            code: child.supp_tag.code,
            name: child.supp_tag.name,
            quantity: child.item ? child.item.quantity : ''
          });
        });
      });
  
      // Iterate through each supplier and send an email with the consolidated CSV attachment
      for (const supplierEmail in itemsBySupplier) {
        // Create CSV content with header
        const header = ['ID', 'Product Name', 'Quantity'];
        let csvContent = header.join(',') + '\n';
  
        itemsBySupplier[supplierEmail].forEach(item => {
          csvContent += `${item.code},${item.name},${item.quantity}\n`;
        });
  
        // Create a nodemailer transporter
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
          to: supplierEmail,
          subject: 'Invoice Request for Order - SBF',
          text: 'Attached is a CSV file outlining the products we wish to order from your company. \n Could you please provide an invoice for these items, including:',
          attachments: [
            {
              filename: 'orders.csv',
              content: csvContent,
            },
          ],
        };
  
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending email:', error);
          }
        });
      }
  
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

        // return console.log(id)

        res.status(200).json();
  
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });
  

// router.route('/approve_PO').post(async (req, res) => {
//   try {
//     const { id, POarray } = req.body;

//     POarray.forEach(parent => {
//       parent.items.forEach(child => {
//         // Accessing properties from child.supp_tag array
//         const code = child.supp_tag.code;
//         const name = child.supp_tag.name;
        
//         // Accessing quantity from child.item if it exists
//         const quantity = child.item ? child.item.quantity : '2222'; 

//         // Customize fields and header names
//         const fields = ['code', 'name', 'quantity'];
//         const header = ['ID', 'Product Name', 'Quantity'];

//           // Create CSV content with header
//           let csvContent = header.join(',') + '\n';
//           csvContent += `${code},${name},${quantity}\n`;


//           // Create a nodemailer transporter
//           const gmailEmail = "sbfmailer@gmail.com";
//           const gmailPassword = "uoetasnknsroxwnq";

//         // Create a nodemailer transporter
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             user: gmailEmail,
//             pass: gmailPassword,
//           },
//         });

//         // Define email options
//         const mailOptions = {
//           from: gmailEmail,
//           to: child.suppliers.supplier_email,
//           subject: 'Invoice Request for Order - SBF',
//           text: 'Attached is a CSV file outlining the products we wish to order from your company. \n Could you please provide an invoice for these items, including:',
//           attachments: [
//             {
//               filename: 'dd.csv',
//               content: csvContent,
//             },
//           ],
//         };

//         // Send the email
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             return console.log('Error sending email:', error);
//           }
//           // console.log('Email sent:', info.response);
//         });
//       });
//     });

     
//       // const PR_newData = await PR.update({
//       //   status: 'To-Receive'
//       // },
//       // {
//       //   where: { id: id }
//       // }); 

//       // const PR_historical = await PR_history.create({
//       //   pr_id: id,
//       //   status: 'To-Receive',
//       // });

//     //  return console.log(id)

//     res.status(200).json();

//   } catch (err) {
//     console.error(err);
//     res.status(500).send('An error occurred');
//   }
// });

  
  


module.exports = router;