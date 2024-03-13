const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  PR_PO,
  PR_PO_asmbly,
  PR_PO_spare,
  PR_PO_subpart,
  PR,
  PR_history,
  Assembly_Supplier,
  Assembly,
  Product,
  SparePart,
  SubPart,
  ProductTAGSupplier,
  Subpart_supplier,
  SparePart_Supplier,
  Supplier,
  Activity_Log,
} = require("../db/models/associations");
const session = require("express-session");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");

router.route("/lastPONumber").get(async (req, res) => {
  try {
    const maxValues = await Promise.all([
      PR_PO.max('po_id'),
      PR_PO_asmbly.max('po_id'),
      PR_PO_spare.max('po_id'),
      PR_PO_subpart.max('po_id')
    ]);

    const maxNumber = Math.max(...maxValues);

    // Increment the maxNumber by 1 for a new entry
    const nextNumber = (maxNumber !== null ? parseInt(maxNumber, 10) : 0) + 1;

    // Format the nextNumber to have leading zeros
    const formattedNumber = nextNumber.toString().padStart(8, '0');

    // Return the formatted nextNumber
    return res.json(formattedNumber);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});


router.route("/save").post(async (req, res) => {
  try {
    const arrayPO = req.body.arrayPO;
    const PR_id = req.body.pr_id;
    const userId = req.body.userId;
    for (const parent of arrayPO) {
      const po_number = parent.title;

      for (const child of parent.serializedArray) {
        const quantity = child.quantity;
        const type = child.type;
        const prod_supp_id = child.prod_supplier;

        // console.log(`quantity${quantity} type ${type}`)

        if (type === "product") {
          PR_PO.create({
            pr_id: PR_id,
            po_id: po_number,
            quantity: quantity,
            product_tag_supplier_ID: prod_supp_id,
          });
        } else if (type === "assembly") {
          PR_PO_asmbly.create({
            pr_id: PR_id,
            po_id: po_number,
            quantity: quantity,
            assembly_suppliers_ID: prod_supp_id,
          });
        } else if (type === "spare") {
          PR_PO_spare.create({
            pr_id: PR_id,
            po_id: po_number,
            quantity: quantity,
            spare_suppliers_ID: prod_supp_id,
          });
        } else if (type === "subpart") {
          PR_PO_subpart.create({
            pr_id: PR_id,
            po_id: po_number,
            quantity: quantity,
            subpart_suppliers_ID: prod_supp_id,
          });
        }
      }
    }

    const PR_update = PR.update(
      {
        status: "For-Approval (PO)",
      },
      {
        where: { id: PR_id },
      }
    );

    if (PR_update) {
      const PR_historical = PR_history.create({
        pr_id: PR_id,
        status: "For-Approval (PO)",
      });

      if (PR_historical) {
        const forPR = await PR.findOne({
          where: {
            id: PR_id,
          },
        });

        const PRnum = forPR.pr_num;

        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Purchase Request is For-Approval (PO) with pr number ${PRnum}`,
        });

        return res.status(200).json();
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchPOPreview").get(async (req, res) => {
  try {
    const pr_id = req.query.id;
    const po_num = req.query.po_number;

    // Fetch data from all four tables with the specified pr_id
    const prPoData = await PR_PO.findAll({
      include: [
        {
          model: ProductTAGSupplier,
          required: true,

          include: [
            {
              model: Product,
              required: true,
              attributes: [
                ["product_code", "code"],
                ["product_name", "name"],
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
      where: {
        pr_id: pr_id,
        po_id: po_num,
      },
    });

    const prPoAsmblyData = await PR_PO_asmbly.findAll({
      include: [
        {
          model: Assembly_Supplier,
          required: true,

          include: [
            {
              model: Assembly,
              required: true,
              attributes: [
                ["assembly_code", "code"],
                ["assembly_name", "name"],
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
      where: {
        pr_id: pr_id,
        po_id: po_num,
      },
    });

    const prPoSpareData = await PR_PO_spare.findAll({
      include: [
        {
          model: SparePart_Supplier,
          required: true,

          include: [
            {
              model: SparePart,
              required: true,
              attributes: [
                ["spareParts_code", "code"],
                ["spareParts_name", "name"],
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
      where: {
        pr_id: pr_id,
        po_id: po_num,
      },
    });

    const prPoSubpartData = await PR_PO_subpart.findAll({
      include: [
        {
          model: Subpart_supplier,
          required: true,

          include: [
            {
              model: SubPart,
              required: true,
              attributes: [
                ["subPart_code", "code"],
                ["subPart_name", "name"],
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
      where: {
        pr_id: pr_id,
        po_id: po_num,
      },
    });

    // Consolidate data into an object with po_id as keys
    const consolidatedObject = {};

    prPoData.forEach((item) => {
      const po_id = item.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.product_tag_supplier.product,
        suppliers: item.product_tag_supplier.supplier,
      });
    });

    prPoAsmblyData.forEach((item) => {
      const po_id = item.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.assembly_supplier.assembly,
        suppliers: item.assembly_supplier.supplier,
      });
    });

    prPoSpareData.forEach((item) => {
      const po_id = item.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.sparepart_supplier.sparePart,
        suppliers: item.sparepart_supplier.supplier,
      });
    });

    prPoSubpartData.forEach((item) => {
      const po_id = item.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.subpart_supplier.subPart,
        suppliers: item.subpart_supplier.supplier,
      });
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

router.route("/fetchPOarray").get(async (req, res) => {
  try {
    const pr_id = req.query.id;

    // Fetch data from all four tables with the specified pr_id
    const prPoData = await PR_PO.findAll({
      include: [
        {
          model: ProductTAGSupplier,
          required: true,

          attributes: [
            ["id", "id"],
            ["product_id", "product_id"],
            ["supplier_code", "supplier_code"],
            ["product_price", "price"],
            ["createdAt", "createdAt"],
            ["updatedAt", "updatedAt"],
          ],

          include: [
            {
              model: Product,
              required: true,
              attributes: [
                ["product_code", "code"],
                ["product_name", "name"],
                ["product_unitMeasurement", "uom"],
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
      where: { pr_id: pr_id },
    });

    const prPoAsmblyData = await PR_PO_asmbly.findAll({
      include: [
        {
          model: Assembly_Supplier,
          required: true,
          attributes: [
            ["id", "id"],
            ["assembly_id", "assembly_id"],
            ["supplier_code", "supplier_code"],
            ["supplier_price", "price"],
            ["createdAt", "createdAt"],
            ["updatedAt", "updatedAt"],
          ],
          include: [
            {
              model: Assembly,
              required: true,
              attributes: [
                ["assembly_code", "code"],
                ["assembly_name", "name"],
                ["assembly_unitMeasurement", "uom"],
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
      where: { pr_id: pr_id },
    });

    const prPoSpareData = await PR_PO_spare.findAll({
      include: [
        {
          model: SparePart_Supplier,
          required: true,

          attributes: [
            ["id", "id"],
            ["sparePart_id", "sparePart_id"],
            ["supplier_code", "supplier_code"],
            ["supplier_price", "price"],
            ["createdAt", "createdAt"],
            ["updatedAt", "updatedAt"],
          ],

          include: [
            {
              model: SparePart,
              required: true,
              attributes: [
                ["spareParts_code", "code"],
                ["spareParts_name", "name"],
                ["spareParts_unitMeasurement", "uom"],
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
      where: { pr_id: pr_id },
    });

    const prPoSubpartData = await PR_PO_subpart.findAll({
      include: [
        {
          model: Subpart_supplier,
          required: true,
          attributes: [
            ["id", "id"],
            ["subpart_id", "subpart_id"],
            ["supplier_code", "supplier_code"],
            ["supplier_price", "price"],
            ["createdAt", "createdAt"],
            ["updatedAt", "updatedAt"],
          ],
          include: [
            {
              model: SubPart,
              required: true,
              attributes: [
                ["subPart_code", "code"],
                ["subPart_name", "name"],
                ["subPart_unitMeasurement", "uom"],
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
      where: { pr_id: pr_id },
    });

    // Consolidate data into an object with po_id as keys
    const consolidatedObject = {};

    prPoData.forEach((item) => {
      const po_id = item.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.product_tag_supplier.product,
        suppliers: item.product_tag_supplier.supplier,
        suppPrice: item.product_tag_supplier,
      });
    });

    prPoAsmblyData.forEach((item) => {
      const po_id = item.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.assembly_supplier.assembly,
        suppliers: item.assembly_supplier.supplier,
        suppPrice: item.assembly_supplier,
      });
    });

    prPoSpareData.forEach((item) => {
      const po_id = item.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.sparepart_supplier.sparePart,
        suppliers: item.sparepart_supplier.supplier,
        suppPrice: item.sparepart_supplier,
      });
    });

    prPoSubpartData.forEach((item) => {
      const po_id = item.po_id;
      consolidatedObject[po_id] = consolidatedObject[po_id] || {
        title: `${po_id}`,
        items: [],
      };
      consolidatedObject[po_id].items.push({
        item,
        supp_tag: item.subpart_supplier.subPart,
        suppliers: item.subpart_supplier.supplier,
        suppPrice: item.subpart_supplier,
      });
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

router.route("/approve_PO").post(async (req, res) => {
  try {
    const { id, POarray, prNum, userId } = req.body;
    const gmailEmail = "sbfmailer@gmail.com";
    const gmailPassword = "uoetasnknsroxwnq";

    POarray.forEach(async (group, index) => {
      // console.log(group)
      let toSendEmail = group.items[0].suppliers.supplier_email;

      // Convert base64 image data to binary buffer
      const imageData = group.imageData.split(";base64,").pop();
      const imageBuffer = Buffer.from(imageData, "base64");

      // Create a PDF document
      const doc = new PDFDocument();
      const pdfBuffers = [];

      // Add the image to the PDF
      doc.image(imageBuffer, { fit: [480, 700] }); // Adjust width and height as needed
      doc.on("data", (chunk) => pdfBuffers.push(chunk));

      // Listen for the end of the document
      doc.on('end', () => {
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
          to: toSendEmail,
          subject: `PR number: ${prNum}. Invoice Request for Order - SBF`,
          text: "Attached is a PDF file outlining the products we wish to order from your company. \n Could you please provide an invoice for these items, including:",
          attachments: [
            {
              filename: `purchase_order.pdf`, // Unique filename for each PDF
              content: Buffer.concat(pdfBuffers),
            },
          ],
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error sending email:", error);
          } else {
            console.log("Email Sent:", info);
            
          }
        });
      });

      doc.end();
    });

    const PR_newData = await PR.update({
      status: 'To-Receive'
    },
    {
      where: { id: id }
    });

    const PR_historical = await PR_history.create({
      pr_id: id,
      status: 'To-Receive',
      isRead: 1,
    });

    if (PR_newData) {
      const forPR = await PR.findOne({
        where: {
          id: id,
        },
      });

      const PRnum = forPR.pr_num;

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `The Purchase Order is being To-Receive with pr number ${PRnum}`,
      });

      res.status(200).json();
    }

    
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
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
