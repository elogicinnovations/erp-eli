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
  MasterList,
  Department,
  PO_Received,
  PO_REJECT,
  PR_Rejustify,
  PR_product,
} = require("../db/models/associations");
const session = require("express-session");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");

router.route("/lastPONumber").get(async (req, res) => {
  try {
    const maxPo = await PR_PO.findOne({
      attributes: [[sequelize.fn("MAX", sequelize.col("po_id")), "maxPoId"]],
      raw: true, // Ensure raw output
    });

    console.log("Fetched maxPo:", maxPo);

    // Extract the max po_id and increment it by 1
    let maxPoId = maxPo.maxPoId || "00000000";
    console.log("maxPoId:", maxPoId);

    let nextPoId = (parseInt(maxPoId, 10) + 1).toString().padStart(8, "0");
    console.log("nextPoId:", nextPoId);

    res.json({ nextPoId });
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
    const POarray_checker = req.body.selected_PR_Prod_array; // array for checker if lahat ba ng product na gwan ng PO

    for (const parent of arrayPO) {
      const po_number = parent.title;

      for (const child of parent.serializedArray) {
        const quantity = child.quantity;
        const type = child.type;
        const prod_supp_id = child.prod_supplier;
        const prod_supp_price = child.prod_supplier_price;
        const FromDays = child.daysfrom;
        const ToDays = child.daysto;

        if (type === "product") {
          PR_PO.create({
            pr_id: PR_id,
            po_id: po_number,
            quantity: quantity,
            product_tag_supplier_ID: prod_supp_id,
            days_from: FromDays,
            days_to: ToDays,
            static_quantity: quantity,
            purchase_price: prod_supp_price,
          });
        }
      }
    }

    let pr_status, prComplete;

    const allTrue = POarray_checker.every((item) => item.isPO === true);

    POarray_checker.forEach((data) => {
      console.log(data);
      PR_product.update(
        {
          isPO: data.isPO,
        },
        {
          where: { id: data.id },
        }
      );
    });

    if (allTrue) {
      pr_status = "For-Approval (PO)";
      prComplete = true;
    } else {
      pr_status = "On-Canvass";
      prComplete = false;
    }

    const PR_update = await PR.update(
      {
        status: pr_status,
        isPRcomplete: prComplete,
      },
      {
        where: { id: PR_id },
      }
    );

    const forPR = await PR.findOne({
      where: {
        id: PR_id,
      },
    });

    const PRnum = forPR.pr_num;

    if (PR_update) {
      const PR_historical = PR_history.create({
        pr_id: PR_id,
        status: "Approved",
        remarks: `Purchase Request # ${PRnum} is now approved`,
      });

      if (PR_historical) {
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Purchase Request # ${PRnum} is now approved`,
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
router.route("/fetchView_PO").get(async (req, res) => {
  try {
    const data = await PR_PO.findOne({
      where: {
        po_id: req.query.po_id,
      },
      include: [
        {
          model: PR,
          required: true,
          include: [
            {
              model: MasterList,
              required: true,
              include: [
                {
                  model: Department,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          model: ProductTAGSupplier,
          required: true,

          include: [
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
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
router.route("/fetchRejectHistory").get(async (req, res) => {
  try {
    const { po_id, pr_id } = req.query;
    const poRejectData = await PO_REJECT.findAll({
      where: {
        po_id: po_id,
        pr_id: pr_id,
      },
      include: [
        {
          model: MasterList,
          required: true,
        },
      ],
    });

    const prRejustifyData = await PR_Rejustify.findAll({
      where: {
        po_id: po_id,
        pr_id: pr_id,
      },
      include: [
        {
          model: MasterList,
          required: true,
        },
      ],
    });

    // console.log(poRejectData)

    // Extract the dataValues from each result
    const poRejectValues = poRejectData.map((item) => ({
      ...item.dataValues,
      source: "REJECTION",
    }));
    const prRejustifyValues = prRejustifyData.map((item) => ({
      ...item.dataValues,
      source: "REJUSTIFICATION",
    }));
    // Combine the dataValues into one array
    const combinedData = [...poRejectValues, ...prRejustifyValues];

    // Sort the combined data by createdAt column in descending order
    combinedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // console.log(combinedData);

    // If you want to send the sorted data as a response
    res.json(combinedData);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/remove_productPO").post(async (req, res) => {
  try {
    const { primary_ID, po_id, prID, userId, prNum, product_name } = req.query;

    const deletePO_product = await PR_PO.destroy({
      where: {
        id: primary_ID,
      },
    });

    if (deletePO_product) {
      const PR_historical = await PR_history.create({
        pr_id: prID,
        status: "Rejected",
        isRead: 1,
        remarks: `The Product "${product_name}" has been removed from Purchase Order # ${po_id} with pr number ${prNum}`,
      });

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `The Product "${product_name}" has been removed from Purchase Order # ${po_id} with pr number ${prNum}`,
      });

      res.status(200).json();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json();
  }
});

router.route("/fetchPOarray").get(async (req, res) => {
  try {
    const po_id = req.query.po_id;

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
                ["part_number", "part_number"],
              ],
            },
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
      where: { po_id: po_id },
    });

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

    // Convert the object values back to an array
    const consolidatedArray = Object.values(consolidatedObject);

    res.status(200).json(consolidatedArray);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/approve_PO").post(async (req, res) => {
  try {
    const {
      prID,
      imageData,
      prNum,
      userId,
      POarray,
      formattedDateApproved,
      po_idApproval,
    } = req.body;
    const gmailEmail = "purchasing@sbfdrilling.com";
    const gmailPassword = "fwzunybngamowhuw";
    // const gmailEmail = "sbfmailer@gmail.com";
    //   const gmailPassword = "uoetasnknsroxwnq";

    const findEmail = await PR_PO.findAll({
      where: {
        po_id: po_idApproval,
      },
      include: [
        {
          model: ProductTAGSupplier,
          required: true,
          include: [
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
    });

    let toSendEmail = findEmail[0].product_tag_supplier.supplier.supplier_email;
    // console.log(`findEmail`)

    // console.log(toSendEmail)

    // Convert base64 image data to binary buffer
    const imageDatas = imageData.split(";base64,").pop();
    const imageBuffer = Buffer.from(imageDatas, "base64");

    // Create a PDF document
    const doc = new PDFDocument();
    const pdfBuffers = [];

    // Add the image to the PDF
    doc.image(imageBuffer, { fit: [480, 700] }); // Adjust width and height as needed
    doc.on("data", (chunk) => pdfBuffers.push(chunk));

    // Listen for the end of the document
    doc.on("end", () => {
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

    const PO_Approved = await PR_PO.update(
      {
        status: "To-Receive",
        date_approved: formattedDateApproved,
      },
      {
        where: { po_id: po_idApproval },
      }
    );

    if (PO_Approved) {
      const PR_historical = await PR_history.create({
        pr_id: prID,
        status: "To-Receive",
        isRead: 1,
        date_approved: formattedDateApproved,
        remarks: `The Purchase Order number ${po_idApproval} is being approved with pr number ${prNum}`,
      });

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `The Purchase Order number ${po_idApproval} is being approved with pr number ${prNum}`,
      });
    }
    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
